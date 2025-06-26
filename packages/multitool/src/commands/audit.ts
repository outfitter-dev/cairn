import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { specLoader } from '../lib/spec-loader.js';
// import { IgnorePatterns } from '../lib/ignore-patterns.js';
import { FileFinder } from '../lib/file-finder.js';
import { TableBuilder, getSymbols, formatFilePath } from '../lib/ui-components.js';
import { groupViolationsByLine, formatLineViolations } from '../lib/violation-formatter.js';
import type { Violation as FormatterViolation } from '../lib/violation-formatter.js';
import { initializeConfig, status, logger, color } from '../lib/cli-config.js';
import { VIOLATIONS } from '../lib/terse-violations.js';

interface AuditOptions {
  json?: boolean;
  legacy?: boolean;
  verbose?: boolean;
  filter?: string[];
  pattern?: string[];
  file?: string[];
  test?: boolean;
}

export interface Violation {
  file: string;
  line: number;
  issue: string;
  type: string;
  content: string;
  column?: number;
}

const COMMENT_PATTERNS: Record<string, RegExp> = {
  // JavaScript/TypeScript family
  '.js': /^\s*(\/\/|\/\*|\*)/,
  '.mjs': /^\s*(\/\/|\/\*|\*)/,
  '.cjs': /^\s*(\/\/|\/\*|\*)/,
  '.ts': /^\s*(\/\/|\/\*|\*)/,
  '.tsx': /^\s*(\/\/|\/\*|\*)/,
  '.jsx': /^\s*(\/\/|\/\*|\*)/,
  '.vue': /^\s*(\/\/|\/\*|\*|<!--)/,
  '.svelte': /^\s*(\/\/|\/\*|\*|<!--)/,
  
  // Markup/Config
  '.md': /^\s*(<!--|\[\/\/\]:)/,
  '.mdx': /^\s*(<!--|\[\/\/\]:)/,
  '.html': /^\s*<!--/,
  '.xml': /^\s*<!--/,
  '.svg': /^\s*<!--/,
  '.yaml': /^\s*#/,
  '.yml': /^\s*#/,
  '.toml': /^\s*#/,
  '.ini': /^\s*[;#]/,
  
  // Shell/Scripts
  '.sh': /^\s*#/,
  '.bash': /^\s*#/,
  '.zsh': /^\s*#/,
  '.fish': /^\s*#/,
  
  // Backend languages
  '.py': /^\s*(#|"""|''')/,
  '.rb': /^\s*#/,
  '.php': /^\s*(\/\/|\/\*|#)/,
  '.go': /^\s*\/\//,
  '.rs': /^\s*\/\//,
  '.java': /^\s*(\/\/|\/\*)/,
  '.kt': /^\s*(\/\/|\/\*)/,
  '.scala': /^\s*(\/\/|\/\*)/,
  '.swift': /^\s*(\/\/|\/\*)/,
  '.c': /^\s*(\/\/|\/\*)/,
  '.cpp': /^\s*(\/\/|\/\*)/,
  '.cs': /^\s*(\/\/|\/\*)/,
  '.m': /^\s*(\/\/|\/\*)/,
  '.mm': /^\s*(\/\/|\/\*)/,
  
  // Other
  '.r': /^\s*#/,
  '.R': /^\s*#/,
  '.sql': /^\s*(--|\/\*)/,
  '.lua': /^\s*--/,
  '.ex': /^\s*#/,
  '.exs': /^\s*#/,
  '.clj': /^\s*;/,
  '.lisp': /^\s*;/,
  '.scm': /^\s*;/,
};

function isCommentLine(line: string, fileExtension: string): boolean {
  const pattern = COMMENT_PATTERNS[fileExtension];
  return pattern ? pattern.test(line) : true; // Default to true for unknown extensions
}

function isInBackticks(line: string, matchIndex: number): boolean {
  const beforeMatch = line.substring(0, matchIndex);
  const backtickCount = (beforeMatch.match(/`/g) || []).length;
  return backtickCount % 2 === 1;
}

export function createAuditCommand(): Command {
  const audit = new Command('audit')
    .description('Analyze waymarks for syntax compliance and quality.')
    .option('--json', 'Output as JSON for tooling')
    .option('--legacy', 'Show only v1.0 syntax violations')
    .option('-v, --verbose', 'Show detailed output with waymark content')
    .option('--filter <types...>', 'Filter content types (e.g., official, deprecated)')
    .option('--pattern <patterns...>', 'File glob patterns')
    .option('--file <files...>', 'Specific file paths')
    .option('--test', 'Scan only test files')
    .option('--no-unicode', 'Use ASCII characters instead of Unicode')
    .option('--no-color', 'Disable colored output')
    .action(async (options: AuditOptions) => {
      try {
        // Initialize CLI configuration
        initializeConfig(options);
        await runAudit(options);
      } catch (error) {
        logger.error('An unexpected error occurred during the audit:');
        console.error(error);
        process.exit(1);
      }
    });

  return audit;
}

export async function runAudit(options: AuditOptions): Promise<Violation[]> {
  const rootDir = process.cwd();
  
  // Handle test mode
  let patterns = options.pattern ?? [];
  if (options.test) {
    // Look for common test file patterns across the project
    patterns = [
      '**/test/**/*.{md,ts,js,tsx,jsx}',
      '**/tests/**/*.{md,ts,js,tsx,jsx}', 
      '**/__tests__/**/*.{md,ts,js,tsx,jsx}',
      '**/*.test.{md,ts,js,tsx,jsx}',
      '**/*.spec.{md,ts,js,tsx,jsx}',
      '**/test-fixtures/**/*.{md,ts,js,tsx,jsx}'
    ];
  }
  
  const fileFinder = new FileFinder({
    rootDir,
    patterns,
    specificFiles: options.file ?? [],
  });

  const files = await fileFinder.findFiles();
  const syntaxViolations: Violation[] = [];
  
  if (!options.json) {
    status(`Found ${files.length} files to audit...`, 'scanning');
  }

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
      const lines = content.split('\n');
      const fileExtension = path.extname(file);

      lines.forEach((line, index) => {
        // Check for old sigil syntax first (before checking ::: syntax)
        const oldSigilMatches = line.matchAll(/:(M|ga):\s*(.*)$/g);
        for (const oldMatch of oldSigilMatches) {
          if (isCommentLine(line, fileExtension) && !(oldMatch.index !== undefined && isInBackticks(line, oldMatch.index))) {
            syntaxViolations.push({
              file, line: index + 1, issue: VIOLATIONS.LEGACY_SIGIL, type: 'legacy-sigil', content: line.trim(), column: oldMatch.index
            });
          }
        }

        const matches = line.matchAll(/:::\s*(.*)$/g);

        for (const match of matches) {
          if (!isCommentLine(line, fileExtension) || (match.index !== undefined && isInBackticks(line, match.index))) {
            continue;
          }

          const afterSigil = (match[1] || '').trim();

          // 1. Check for legacy +tag syntax
          if (/\+\w+/.test(afterSigil)) {
            syntaxViolations.push({
              file, line: index + 1, issue: VIOLATIONS.LEGACY_PLUS_TAG, type: 'legacy-plus-tag', content: line.trim(), column: match.index
            });
          }

          // 2. Check for property-based priority
          if (/(^|\s)priority:(high|critical|low|medium|p[0-3])(\s|$)/.test(afterSigil)) {
            syntaxViolations.push({
              file, line: index + 1, issue: VIOLATIONS.LEGACY_PRIORITY, type: 'property-priority', content: line.trim(), column: match.index
            });
          }
          
          // 3. Check for missing hash in reference values
          const missingHashRegex = /#(fixes|closes|depends|blocks|refs|owner|cc|affects|for|relates|see|replaces|pr|commit|branch|test|feat|docs|link|needs|issue|ticket|followup):([a-zA-Z0-9][^#\s,]*)/g;
          let hashMatch;
          while ((hashMatch = missingHashRegex.exec(afterSigil)) !== null) {
            const value = hashMatch[2];
            if (value && !value.startsWith('@')) { // Don't flag actor values
              syntaxViolations.push({
                file, line: index + 1, issue: VIOLATIONS.MISSING_REF_HASH, type: 'missing-ref-hash', content: line.trim(), column: match.index
              });
            }
          }

          // 4. Check for hierarchical tags (warn only)
          const hierarchicalTagRegex = /#\w+\/\w+/g;
          let hMatch;
          while ((hMatch = hierarchicalTagRegex.exec(afterSigil)) !== null) {
            const position = hMatch.index;
            const precedingText = afterSigil.substring(0, position);
            const isCanonicalAnchor = afterSigil.trim().startsWith('##');
            const isReference = /#(refs|for|docs):/.test(precedingText);
            
            if (!isCanonicalAnchor && !isReference) {
              syntaxViolations.push({
                file, line: index + 1, issue: VIOLATIONS.NO_HIERARCHICAL, type: 'hierarchical-tag', content: line.trim(), column: match.index
              });
            }
          }

          // 5. Check for arrays with spaces
          if (/#\w+:@?\w+,\s+/.test(afterSigil)) {
            syntaxViolations.push({
              file, line: index + 1, issue: VIOLATIONS.NO_ARRAY_SPACES, type: 'array-with-spaces', content: line.trim(), column: match.index
            });
          }

          // 6. Check for misplaced @actors
          const actorRegex = /@([a-zA-Z0-9_-]+)/g;
          let aMatch;
          const firstToken = afterSigil.trim().split(/\s+/)[0] || '';
          const isFirstTokenActor = firstToken.startsWith('@');
          
          while ((aMatch = actorRegex.exec(afterSigil)) !== null) {
            // Skip if this is the first token (valid placement)
            if (isFirstTokenActor && aMatch.index === afterSigil.indexOf(firstToken)) continue;
            
            // Check if actor is in a relational tag value
            const precedingText = afterSigil.substring(0, aMatch.index);
            const relationalTagsWithActors = specLoader.getRelationalTagsWithActors();
            const isInRelationalValue = Array.from(relationalTagsWithActors).some(tag =>
              new RegExp(`#${tag}:[^\\s]*$`).test(precedingText.split(/\s+/).pop() || '')
            );
            
            if (!isInRelationalValue) {
              syntaxViolations.push({
                file, line: index + 1, issue: VIOLATIONS.ACTOR_MISPLACED, type: 'misplaced-actor', content: line.trim(), column: match.index
              });
            }
          }
          
          // 7. Check for deprecated markers
          const markerMatch = line.match(/^\s*(?:\/\/|\/\*|\*|#|<!--|;|--)\s*(\w+)\s+:::/);
          if (markerMatch) {
            const marker = markerMatch[1];
            if (marker && specLoader.isDeprecatedMarker(marker)) {
              syntaxViolations.push({
                file, line: index + 1, issue: VIOLATIONS.DEPRECATED_MARKER(marker), type: 'deprecated-marker', content: line.trim(), column: match.index
              });
            }
            
            // 8. Check for all-caps markers
            if (marker && marker === marker.toUpperCase() && marker !== marker.toLowerCase()) {
              syntaxViolations.push({
                file, line: index + 1, issue: VIOLATIONS.ALL_CAPS_MARKER(marker), type: 'all-caps-marker', content: line.trim(), column: match.index
              });
            }
          }
          
          // 9. Check for marker after ::: (only if it looks like a marker)
          const afterColonMatch = line.match(/:::\s*(\w+)\s+/);
          if (afterColonMatch) {
            const possibleMarker = afterColonMatch[1];
            // Only flag if it's a known marker
            if (possibleMarker && (specLoader.isOfficialMarker(possibleMarker) || specLoader.isDeprecatedMarker(possibleMarker))) {
              syntaxViolations.push({
                file, line: index + 1, issue: VIOLATIONS.MARKER_AFTER_SEPARATOR, type: 'marker-misplaced', content: line.trim(), column: match.index
              });
            }
          }
          
          // 10. Check for multiple ownership tags
          const ownerMatches = afterSigil.match(/#owner:[^\s#,]+/g) || [];
          if (ownerMatches.length > 1) {
            syntaxViolations.push({
              file, line: index + 1, issue: VIOLATIONS.MULTIPLE_OWNER, type: 'multiple-ownership-tags', content: line.trim(), column: match.index
            });
          }
          
          // 11. Check for multiple cc tags
          const ccMatches = afterSigil.match(/#cc:[^\s#]+/g) || [];
          if (ccMatches.length > 1) {
            syntaxViolations.push({
              file, line: index + 1, issue: VIOLATIONS.MULTIPLE_CC, type: 'multiple-cc-tags', content: line.trim(), column: match.index
            });
          }
          
          // 12. Check for non-blessed properties (property without #)
          const propertyMatch = afterSigil.match(/(?:^|\s)([a-zA-Z_-]+):([^\s#]+)/g);
          if (propertyMatch) {
            propertyMatch.forEach(match => {
              const trimmed = match.trim();
              const colonIndex = trimmed.indexOf(':');
              if (colonIndex > 0) {
                const key = trimmed.substring(0, colonIndex);
                // Skip if it's part of a URL or known pattern
                if (!trimmed.match(/^https?:/) && !['priority', 'status'].includes(key)) {
                  syntaxViolations.push({
                    file, line: index + 1, issue: VIOLATIONS.USE_HASH_PREFIX(trimmed), type: 'non-blessed-property', content: line.trim(), column: colonIndex
                  });
                }
              }
            });
          }
          
          // 13. Check for legacy blessed properties
          const legacyBlessedProps = ['reason', 'since', 'until', 'version', 'affects'];
          legacyBlessedProps.forEach(prop => {
            const regex = new RegExp(`(?:^|\\s)${prop}:([^\\s#]+)`, 'g');
            if (regex.test(afterSigil)) {
              syntaxViolations.push({
                file, line: index + 1, issue: VIOLATIONS.LEGACY_PROPERTY(prop), type: 'legacy-blessed-property', content: line.trim(), column: 0
              });
            }
          });
        }
      });
    } catch (err) {
      console.error(chalk.red(`Error processing ${file}:`), err);
    }
  }

  // Output results
  if (options.json) {
    console.log(JSON.stringify(syntaxViolations, null, 2));
  } else if (options.legacy) {
    // Legacy mode: only show output if there are violations
    if (syntaxViolations.length > 0) {
      const violationsByFile = syntaxViolations.reduce<Record<string, Violation[]>>((acc, v) => {
        const fileKey = v.file;
        const violations = acc[fileKey] || [];
        violations.push(v);
        acc[fileKey] = violations;
        return acc;
      }, {});

      for (const [file, violations] of Object.entries(violationsByFile)) {
        violations.sort((a, b) => a.line - b.line);
        for (const v of violations) {
          console.log(`${file}:${v.line}: ${v.issue}`);
        }
      }
    }
  } else {
    if (syntaxViolations.length === 0) {
      status('No waymark violations found.', 'success');
      return syntaxViolations;
    }

    const violationsByFile = syntaxViolations.reduce<Record<string, Violation[]>>((acc, v) => {
      const fileKey = v.file;
      const violations = acc[fileKey] || [];
      violations.push(v);
      acc[fileKey] = violations;
      return acc;
    }, {});

    status(`Found ${syntaxViolations.length} waymark violations in ${Object.keys(violationsByFile).length} files`, 'warning');

    for (const [file, violations] of Object.entries(violationsByFile)) {
      const symbols = getSymbols();
      
      // Convert our violations to formatter violations
      const formatterViolations: FormatterViolation[] = violations.map(v => ({
        line: v.line,
        column: v.column || 0,
        message: v.issue
      }));
      
      const grouped = groupViolationsByLine(formatterViolations);
      
      // Create table for this file
      const table = new TableBuilder({
        title: formatFilePath(file, true),
        subtitle: `Issues (${grouped.length} lines, ${violations.length} violations) ${symbols.warning}`,
        columns: [
          { header: 'Line', width: 6, align: 'right' },
          { header: 'Issues', align: 'left' }
        ]
      });
      
      // Add rows with compressed violations
      for (const group of grouped) {
        table.addRow(
          group.line.toString(),
          formatLineViolations(group.violations)
        );
      }
      
      console.log('\n' + table.render());
      
      if (options.verbose) {
        // Show content for each line with violations
        console.log('\n' + color.dim('Content:'));
        violations.sort((a, b) => a.line - b.line);
        const seenLines = new Set<number>();
        for (const v of violations) {
          if (!seenLines.has(v.line)) {
            seenLines.add(v.line);
            console.log(color.dim(`  ${v.line}: ${v.content}`));
          }
        }
      }
    }
  }
  return syntaxViolations;
} 