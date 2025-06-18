#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import WaymarkSpec from './lib/spec-loader.js';
import { FlagParser } from './lib/flag-parser.js';
import { getLogTimestamp } from './lib/timestamp.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments with new system
const flags = new FlagParser();

// Standard flags
const dryRun = flags.has('dry-run');
const verbose = flags.has('verbose');
const help = flags.has('help');
const yes = flags.has('yes');

// Blaze-specific flags
const tagPrefix = flags.get('tag-prefix', 'wm');
const reset = flags.has('reset');
const resetPattern = flags.get('reset') || (flags.has('reset') ? 'wm' : null);
const filePatterns = flags.getArray('pattern');
const specificFiles = flags.getArray('file');
const timestamp = getLogTimestamp();
const wantsReport = flags.has('report');
const reportFile = flags.get('report', `.waymark/logs/${timestamp}-blaze-report.json`);

function getTagForIssue(issue) {
  const spec = new WaymarkSpec();
  
  // Try to match issue to blaze tags
  for (const type of ['fix', 'warn']) {
    const tags = spec.spec.blaze_tags[type];
    for (const [suffix, description] of Object.entries(tags)) {
      if (issue.toLowerCase().includes(description)) {
        return `${tagPrefix}:${type}/${suffix}`;
      }
    }
  }
  
  // Fallback - check specific issue text patterns
  if (issue.includes('Discouraged hierarchical tag') || issue.includes('All-caps marker') || issue.includes('Misplaced @actor')) {
    return `${tagPrefix}:warn/unknown`;
  }
  
  return `${tagPrefix}:fix/unknown`; // Final fallback
}

function generateBlazeReport(appliedTags) {
  const report = {
    metadata: {
      version: '1.0',
      timestamp: new Date().toISOString(),
      mode: 'blaze',
      tagPrefix: tagPrefix,
      gitBranch: getCurrentGitBranch()
    },
    summary: {
      totalFiles: Object.keys(appliedTags).length,
      totalTags: Object.values(appliedTags).reduce((sum, file) => sum + file.length, 0),
      byType: {}
    },
    files: []
  };
  
  // Count by tag type
  Object.values(appliedTags).forEach(fileTags => {
    fileTags.forEach(tag => {
      const type = tag.tag.split('/')[1] || 'unknown';
      report.summary.byType[type] = (report.summary.byType[type] || 0) + 1;
    });
  });
  
  // Build file details
  Object.entries(appliedTags).forEach(([file, tags]) => {
    report.files.push({
      path: file,
      totalTags: tags.length,
      tags: tags
    });
  });
  
  return report;
}

function saveBlazeReport(report) {
  try {
    const reportPath = path.resolve(__dirname, '..', reportFile);
    const reportDir = path.dirname(reportPath);
    
    // Ensure directory exists
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📝 Blaze report saved to: ${reportFile}`);
  } catch (err) {
    console.error(`❌ Error saving report: ${err.message}`);
  }
}

function getCurrentGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

// Show help if requested
if (help) {
  console.log(`
blaze - Automated waymark violation tagging system

Usage: node scripts/blaze.js [options]

Standard Options:
  --help, -h            Show this help message
  --verbose, -v         Show detailed output
  --dry-run, -n         Preview mode (no file changes)
  --yes, -y             Confirm file modifications (required for non-dry-run)

Blaze Options:
  --tag-prefix PREFIX   Custom tag prefix (default: wm)
  --report [PATH]       Generate report (can use with --dry-run)
  --reset [PATTERN]     Remove tags matching pattern:
                        - --reset         Remove all #wm:* tags (not #wmi:)
                        - --reset all     Remove ALL tags (#anything)
                        - --reset wm      Remove all #wm:* tags (not #wmi:)
                        - --reset wm:fix  Remove #wm:fix/* tags
                        - --reset custom  Remove #custom:* tags

File Targeting:
  --pattern "*.md" "src/**"  File glob patterns
  --file path1 path2         Specific file paths

Examples:
  node scripts/blaze.js --dry-run                    # Preview only
  node scripts/blaze.js --dry-run --report           # Preview + generate report
  node scripts/blaze.js --yes                        # Apply tags (auto-saves report)
  node scripts/blaze.js --tag-prefix custom --yes
  node scripts/blaze.js --reset --pattern "docs/**/*.md" --yes
  node scripts/blaze.js --reset all --dry-run
  node scripts/blaze.js --reset wm:fix --file src/main.js --yes

Note: When applying tags with --yes, a timestamped report is saved to .waymark/logs/
`);
  process.exit(0);
}

async function blazeProblems() {
  // Safety check for actual modifications
  if (!dryRun && !yes) {
    console.error('❌ Error: --yes flag is required to modify files.');
    console.error('Use --dry-run to preview changes or --yes to confirm modifications.');
    process.exit(1);
  }
  
  if (dryRun) {
    console.log('🔥 [DRY RUN] Starting blaze preview...');
  } else {
    console.log('🔥 Starting blaze to tag problems...');
  }
  
  // 1. Run the audit script to get the list of problems
  const auditOutput = execSync('node scripts/audit-waymarks.js --legacy', {
    encoding: 'utf8',
  });
  
  const problems = parseAuditOutput(auditOutput);
  
  if (problems.length === 0) {
    console.log('✅ No problems found to blaze.');
    return;
  }
  
  console.log(`Found ${problems.length} problems to tag.`);
  
  // Group problems by file and then by line number to handle multiple issues on one line
  const problemsByLine = problems.reduce((acc, problem) => {
    const key = `${problem.file}:${problem.line}`;
    if (!acc[key]) {
      acc[key] = {
        file: problem.file,
        line: problem.line,
        content: problem.content,
        issues: []
      };
    }
    acc[key].issues.push(problem.issue);
    return acc;
  }, {});

  // Convert to a flat list for processing
  const uniqueProblems = Object.values(problemsByLine);
  
  // Group by file again for file I/O
  const problemsByFile = uniqueProblems.reduce((acc, problem) => {
    if (!acc[problem.file]) {
      acc[problem.file] = [];
    }
    acc[problem.file].push(problem);
    return acc;
  }, {});
  
  // Track all applied tags for report
  const appliedTags = {};
  
  for (const file in problemsByFile) {
    const fileProblems = problemsByFile[file];
    
    if (dryRun) {
      console.log(`\n[DRY RUN] Would tag ${fileProblems.length} problem-lines in ${file}:`);
      appliedTags[file] = [];
      
      fileProblems.forEach(p => {
        const tagsToAdd = p.issues.map(getTagForIssue);
        const tagsStr = tagsToAdd.join(' #');
        console.log(`  L${p.line}: ${p.content.trim()} #${tagsStr}`);
        if (verbose) {
          console.log(`    Issues: ${p.issues.join(', ')}`);
        }
        
        // Track what would be applied for report
        tagsToAdd.forEach(tag => {
          appliedTags[file].push({
            line: p.line,
            tag: tag,
            issue: p.issues.find(i => getTagForIssue(i) === tag),
            original: p.content
          });
        });
      });
    } else {
      try {
        const fullPath = path.resolve(__dirname, '..', file);
        let content = fs.readFileSync(fullPath, 'utf8');
        let lines = content.split('\n');
        
        // Sort problems by line number descending to avoid line shift issues
        fileProblems.sort((a, b) => b.line - a.line);
        
        let modifiedCount = 0;
        appliedTags[file] = [];
        
        fileProblems.forEach(p => {
          const lineIndex = p.line - 1;
          const tagsToAdd = p.issues.map(getTagForIssue);
          
          if (lines[lineIndex]) {
            let lineContent = lines[lineIndex];
            tagsToAdd.forEach(tag => {
              if (!lineContent.includes(`#${tag}`)) {
                lineContent = `${lineContent} #${tag}`;
                modifiedCount++;
                
                // Track applied tag for report
                appliedTags[file].push({
                  line: p.line,
                  tag: tag,
                  issue: p.issues.find(i => getTagForIssue(i) === tag),
                  original: lines[lineIndex]
                });
              }
            });
            lines[lineIndex] = lineContent;
          }
        });
        
        if (modifiedCount > 0) {
          fs.writeFileSync(fullPath, lines.join('\n'));
          console.log(`✅ Tagged problems in ${file}`);
        }
      } catch (err) {
        console.error(`❌ Error processing ${file}: ${err.message}`);
      }
    }
  }
  
  // New sorted and detailed output
  const sortedFiles = Object.entries(problemsByFile).sort((a, b) => b[1].length - a[1].length);

  console.log('\n--- Blaze Problem Report ---');
  sortedFiles.forEach(([file, problems]) => {
    console.log(`\n📁 ${file} (${problems.length} problem-lines)`);
    problems.sort((a, b) => a.line - b.line); // Sort problems by line number
    problems.forEach(p => {
      const tagsToAdd = p.issues.map(getTagForIssue).join(' #');
      console.log(`  L${p.line}: ${p.content.trim()} #${tagsToAdd}`);
    });
  });
  
  console.log('\n🔥 Blaze completed.');
  
  // Generate and save report if requested
  if (Object.keys(appliedTags).length > 0 && (wantsReport || !dryRun)) {
    const report = generateBlazeReport(appliedTags);
    if (dryRun && wantsReport) {
      report.metadata.dryRun = true;
      console.log('\n📝 [DRY RUN] Report shows what WOULD be done.');
    }
    saveBlazeReport(report);
  }
}

function parseAuditOutput(output) {
  const problems = [];
  const lines = output.split('\n');
  let currentFile = null;
  
  const fileRegex = /^📁\s+(.*)$/;
  const problemRegex = /^\s+(\d+):\s+(.*)$/;
  
  for (const line of lines) {
    const fileMatch = line.match(fileRegex);
    if (fileMatch) {
      currentFile = fileMatch[1];
      continue;
    }
    
    if (currentFile) {
      const problemMatch = line.match(problemRegex);
      if (problemMatch) {
        // Need to get the original content to preserve it
        const originalContent = getOriginalLineContent(currentFile, parseInt(problemMatch[1]));
        
        problems.push({
          file: currentFile,
          line: parseInt(problemMatch[1]),
          issue: problemMatch[2],
          content: originalContent,
        });
      }
    }
  }
  
  return problems;
}

function getOriginalLineContent(file, lineNumber) {
    try {
        const fullPath = path.resolve(__dirname, '..', file);
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');
        return lines[lineNumber - 1] || '';
    } catch (err) {
        return ''; // Return empty string if file can't be read
    }
}

async function resetTags() {
  // Safety check for actual modifications
  if (!dryRun && !yes) {
    console.error('❌ Error: --yes flag is required to modify files.');
    console.error('Use --dry-run to preview changes or --yes to confirm modifications.');
    process.exit(1);
  }
  
  // Build the regex pattern based on reset pattern
  let regexPattern;
  let description;
  
  if (resetPattern === 'all') {
    regexPattern = / #[^\s#]+/g;
    description = 'ALL tags';
  } else if (resetPattern === 'wm' || resetPattern === true) {
    // Default behavior: remove #wm:* except #wmi:*
    regexPattern = / #wm:(?!i:)[^\s#]*/g;
    description = '#wm:* tags (excluding #wmi:)';
  } else if (resetPattern.includes(':')) {
    // Pattern like "wm:fix" - remove specific prefix
    const escapedPattern = resetPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    regexPattern = new RegExp(` #${escapedPattern}[^\s#]*`, 'g');
    description = `#${resetPattern}* tags`;
  } else {
    // Simple prefix pattern like "custom"
    const escapedPattern = resetPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    regexPattern = new RegExp(` #${escapedPattern}:[^\s#]*`, 'g');
    description = `#${resetPattern}:* tags`;
  }
  
  if (dryRun) {
    console.log(`🧹 [DRY RUN] Starting tag reset preview for ${description}...`);
  } else {
    console.log(`🧹 Starting tag reset to remove ${description}...`);
  }
  
  // Get files to process
  let files = [];
  
  if (specificFiles.length > 0) {
    // Use specific files if provided
    files = specificFiles;
  } else if (filePatterns.length > 0) {
    // Use glob patterns if provided
    const { globby } = await import('globby');
    try {
      files = await globby(filePatterns, {
        absolute: false,
        onlyFiles: true,
        gitignore: true
      });
    } catch (err) {
      console.error(`❌ Error resolving file patterns: ${err.message}`);
      process.exit(1);
    }
  } else {
    // Default: find all files containing wm: tags
    try {
      const gitFiles = execSync('git ls-files', {
        encoding: 'utf8',
        cwd: path.resolve(__dirname, '..'),
        maxBuffer: 10 * 1024 * 1024
      }).trim().split('\n').filter(Boolean);
      
      // Filter for files that might contain waymarks
      files = gitFiles.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return /\.(md|js|ts|jsx|tsx|json|yaml|yml|py|go|rs|java|cpp|c|h|hpp|rb|php|swift|kt|scala|clj)$/i.test(file);
      });
    } catch (err) {
      console.error('Error getting file list:', err.message);
      process.exit(1);
    }
  }
  
  let totalFiles = 0;
  let totalTagsRemoved = 0;
  
  for (const file of files) {
    try {
      const fullPath = path.resolve(__dirname, '..', file);
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check if file contains tags matching our pattern
      if (!content.match(regexPattern)) {
        continue;
      }
      
      const lines = content.split('\n');
      let modifiedCount = 0;
      
      const modifiedLines = lines.map(line => {
        // Remove tags based on the regex pattern
        const newLine = line.replace(regexPattern, '');
        if (newLine !== line) {
          modifiedCount++;
        }
        return newLine;
      });
      
      if (modifiedCount > 0) {
        totalFiles++;
        totalTagsRemoved += modifiedCount;
        
        if (dryRun) {
          console.log(`\n[DRY RUN] Would remove tags from ${file} (${modifiedCount} lines)`);
          if (verbose) {
            // Show a few examples
            lines.forEach((line, idx) => {
              if (line !== modifiedLines[idx]) {
                console.log(`  L${idx + 1}: ${line.trim()}`);
                console.log(`      → ${modifiedLines[idx].trim()}`);
              }
            });
          }
        } else {
          fs.writeFileSync(fullPath, modifiedLines.join('\n'));
          console.log(`✅ Removed tags from ${file} (${modifiedCount} lines)`);
        }
      }
    } catch (err) {
      console.error(`❌ Error processing ${file}: ${err.message}`);
    }
  }
  
  console.log(`\n🧹 Reset complete: ${totalFiles} files cleaned, ${totalTagsRemoved} tags removed.`);
}

// Decide which action to take
if (resetPattern) {
  resetTags();
} else {
  blazeProblems();
} 