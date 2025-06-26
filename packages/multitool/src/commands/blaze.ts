import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
// import { specLoader } from '../lib/spec-loader.js';
import { runAudit, type Violation } from './audit.js';
import { getLogFilePath } from '../lib/timestamp.js';
import { initializeConfig, status, logger, color } from '../lib/cli-config.js';
import { getSymbols } from '../lib/ui-components.js';

interface BlazeOptions {
  dryRun?: boolean;
  yes?: boolean;
  save?: boolean;
  tagPrefix?: string;
  test?: boolean;
  pattern?: string[];
  file?: string[];
  reset?: string;
  report?: boolean | string;
  verbose?: boolean;
}

interface BlazeConfig {
  tagPrefix?: string;
}

// Function to load configuration
function loadConfig(): BlazeConfig {
  const configPath = path.join(process.cwd(), '.waymark', 'multitool.json');
  if (fs.existsSync(configPath)) {
    try {
      const configContent = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(configContent);
      return config.blaze || {};
    } catch (error) {
      logger.warn('Warning: Could not parse .waymark/multitool.json. Using defaults.');
    }
  }
  return {};
}

function getTagForIssue(issueType: string, prefix: string): string {
  // A simple mapping from violation type to a blaze tag part
  const typeMap: Record<string, string> = {
    'legacy-plus-tag': 'fix/legacy-plus-tag',
    'legacy-sigil': 'fix/legacy-sigil',
    'property-priority': 'fix/property-priority',
    'missing-ref-hash': 'fix/missing-ref-hash',
    'hierarchical-tag': 'warn/hierarchical-tag',
    'array-with-spaces': 'fix/array-with-spaces',
    'misplaced-actor': 'warn/misplaced-actor',
    'deprecated-marker': 'fix/deprecated-marker',
    'all-caps-marker': 'warn/all-caps-marker',
    'marker-misplaced': 'fix/marker-misplaced',
    'multiple-ownership-tags': 'fix/multiple-ownership-tags',
    'multiple-cc-tags': 'fix/multiple-cc-tags',
    'non-blessed-property': 'fix/non-blessed-property',
    'legacy-blessed-property': 'fix/legacy-blessed-property',
  };
  const tagPart = typeMap[issueType] || 'fix/unknown';
  return `${prefix}:${tagPart}`;
}

export function createBlazeCommand(): Command {
  const blaze = new Command('blaze')
    .description('Automatically tag waymark violations found by the audit, or remove tags.')
    .option('-n, --dry-run', 'Preview changes without modifying files')
    .option('-y, --yes', 'Automatically apply all changes')
    .option('--save', 'Save a report of the changes (deprecated, use --report)')
    .option('--report [path]', 'Generate report (optional path, defaults to .waymark/logs/)')
    .option('--tag-prefix <prefix>', 'Override the tag prefix (e.g., wmi)')
    .option('--reset [pattern]', 'Remove tags matching pattern (default: wm, use "all" for all tags)')
    .option('--test', 'Scan only test files')
    .option('--pattern <patterns...>', 'File glob patterns')
    .option('--file <files...>', 'Specific file paths')
    .option('-v, --verbose', 'Show detailed output')
    .option('--no-unicode', 'Use ASCII characters instead of Unicode')
    .option('--no-color', 'Disable colored output')
    .action(async (options: BlazeOptions) => {
      // Initialize CLI configuration
      initializeConfig(options);
      const symbols = getSymbols();
      
      const config = loadConfig();
      const tagPrefix = options.tagPrefix || config.tagPrefix || 'wm';
      const dryRun = options.dryRun ?? false;
      
      if (!dryRun && !options.yes) {
        logger.error('Error: --yes flag is required to modify files unless in --dry-run mode.');
        process.exit(1);
      }

      // Handle reset mode
      if (options.reset !== undefined) {
        await runReset(options, tagPrefix);
        return;
      }

      logger.info(`${symbols.blaze} Starting Blaze run...`);

      // 1. Run the audit programmatically
      const auditOptions: any = {
        legacy: false
      };
      if (options.test) auditOptions.test = options.test;
      if (options.pattern) auditOptions.pattern = options.pattern;
      if (options.file) auditOptions.file = options.file;
      const problems = await runAudit(auditOptions);

      if (problems.length === 0) {
        status('No problems found to blaze.', 'success');
        return;
      }

      logger.warn(`Found ${problems.length} problems to blaze.`);

      // Track all changes for reporting
      const gitBranch = await getGitBranch();
      const report: BlazeReport = {
        metadata: {
          version: '1.0',
          timestamp: new Date().toISOString(),
          mode: 'blaze',
          tagPrefix,
          ...(gitBranch !== undefined && { gitBranch }),
          ...(dryRun && { dryRun })
        },
        summary: {
          totalFiles: 0,
          totalTags: 0,
          byType: {}
        },
        files: []
      };

      // 2. Group problems by file
      const problemsByFile = problems.reduce<Record<string, Violation[]>>((acc, p) => {
        (acc[p.file] = acc[p.file] || []).push(p);
        return acc;
      }, {});

      // 3. Process each file
      for (const [file, fileProblems] of Object.entries(problemsByFile)) {
        logger.info(`\n${symbols.directory} Processing ${color.highlight(file)}`);
        
        const fileReport: FileReport = {
          path: file,
          totalTags: 0,
          tags: []
        };
        
        try {
          const filePath = path.join(process.cwd(), file);
          const lines = fs.readFileSync(filePath, 'utf8').split('\n');
          let changesMade = false;

          // Sort problems by line number descending to avoid line number shifts
          fileProblems.sort((a, b) => b.line - a.line);

          for (const problem of fileProblems) {
            const lineIndex = problem.line - 1;
            const originalLine = lines[lineIndex];

            if (originalLine !== undefined) {
              const tagToAdd = getTagForIssue(problem.type, tagPrefix);
              if (!originalLine.includes(tagToAdd)) {
                // Check if this is an HTML/XML comment
                const htmlCommentMatch = originalLine.match(/^(\s*<!--.*?)(\s*-->)(\s*)$/);
                if (htmlCommentMatch) {
                  // Insert tag before the closing -->
                  lines[lineIndex] = `${htmlCommentMatch[1]} #${tagToAdd}${htmlCommentMatch[2]}${htmlCommentMatch[3]}`;
                } else {
                  // Normal line - append at end
                  lines[lineIndex] = `${originalLine} #${tagToAdd}`;
                }
                
                changesMade = true;
                logger.info(`  ${color.warning(problem.line.toString())}: ${color.dim(problem.issue)} -> ${color.success(`#${tagToAdd}`)}`);
                
                // Track for report
                fileReport.tags.push({
                  line: problem.line,
                  tag: `${tagPrefix}:${getTagForIssue(problem.type, '').substring(3)}`, // Remove 'wm:' prefix
                  issue: problem.issue,
                  original: originalLine.trim()
                });
                fileReport.totalTags++;
                
                // Update summary
                const typeKey = problem.type;
                report.summary.byType[typeKey] = (report.summary.byType[typeKey] || 0) + 1;
                report.summary.totalTags++;
              }
            }
          }

          if (changesMade) {
            if (!dryRun) {
              fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
              logger.info(`  ${symbols.complete} Patched ${file}`);
            }
            report.files.push(fileReport);
            report.summary.totalFiles++;
          }
        } catch (error) {
          logger.error(`Failed to process ${file}:`);
          logger.error(String(error));
        }
      }

      // Generate report if requested
      if (options.report || options.save) {
        const reportPath = typeof options.report === 'string' 
          ? options.report 
          : getLogFilePath('blaze');
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        logger.info(`\n${symbols.file} Report saved to: ${reportPath}`);
      }

      logger.info(`\n${symbols.blaze} Blaze run complete.`);
      if (dryRun) {
        logger.warn('NOTE: This was a dry run. No files were modified.');
      }
    });

  return blaze;
}

interface BlazeReport {
  metadata: {
    version: string;
    timestamp: string;
    mode: string;
    tagPrefix: string;
    gitBranch?: string;
    dryRun?: boolean;
  };
  summary: {
    totalFiles: number;
    totalTags: number;
    byType: Record<string, number>;
  };
  files: FileReport[];
}

interface FileReport {
  path: string;
  totalTags: number;
  tags: Array<{
    line: number;
    tag: string;
    issue: string;
    original: string;
  }>;
}

async function getGitBranch(): Promise<string | undefined> {
  try {
    const { execSync } = await import('child_process');
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return undefined;
  }
}

async function runReset(options: BlazeOptions, tagPrefixFromParent: string): Promise<void> {
  const dryRun = options.dryRun ?? false;
  const pattern = options.reset || tagPrefixFromParent;
  const symbols = getSymbols();
  
  if (!dryRun && !options.yes) {
    logger.error('Error: --yes flag is required to modify files unless in --dry-run mode.');
    process.exit(1);
  }
  
  logger.info(`${symbols.blaze} Starting Blaze reset (pattern: "${pattern}")...`);
  
  // Build regex pattern based on reset pattern
  let regexPattern: RegExp;
  if (pattern === 'all') {
    regexPattern = / #[^\s#]+/g;
  } else if (pattern === 'wm' || pattern === '') {
    regexPattern = / #wm:(?!i:)[^\s#]*/g;
  } else if (pattern.includes(':')) {
    // Specific pattern like 'wm:fix'
    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    regexPattern = new RegExp(` #${escapedPattern}[^\s#]*`, 'g');
  } else {
    // Custom prefix
    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    regexPattern = new RegExp(` #${escapedPattern}:[^\s#]*`, 'g');
  }
  
  // Find files
  const { FileFinder } = await import('../lib/file-finder.js');
  const fileFinder = new FileFinder({
    rootDir: process.cwd(),
    patterns: options.pattern || ['**/*'],
    specificFiles: options.file || []
  });
  
  const files = await fileFinder.findFiles();
  let totalTagsRemoved = 0;
  let filesModified = 0;
  
  for (const file of files) {
    try {
      const filePath = path.join(process.cwd(), file);
      const content = fs.readFileSync(filePath, 'utf8');
      const newContent = content.replace(regexPattern, '');
      
      if (content !== newContent) {
        filesModified++;
        const tagsRemoved = (content.match(regexPattern) || []).length;
        totalTagsRemoved += tagsRemoved;
        
        logger.info(`\n${symbols.directory} ${file} (${color.warning(tagsRemoved.toString())} tags)`);
        
        if (options.verbose) {
          const removedTags = content.match(regexPattern) || [];
          removedTags.forEach(tag => {
            logger.warn(`  - ${tag.trim()}`);
          });
        }
        
        if (!dryRun) {
          fs.writeFileSync(filePath, newContent, 'utf8');
        }
      }
    } catch (error) {
      logger.error(`Failed to process ${file}:`);
      logger.error(String(error));
    }
  }
  
  logger.info(`\n${symbols.blaze} Reset complete: ${totalTagsRemoved} tags removed from ${filesModified} files.`);
  if (dryRun) {
    logger.warn('NOTE: This was a dry run. No files were modified.');
  }
} 