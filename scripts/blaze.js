#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import WaymarkSpec from './lib/spec-loader.js';
import { FlagParser } from './lib/flag-parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments with new system
const flags = new FlagParser();

// Standard flags
const dryRun = flags.has('dry-run');
const verbose = flags.has('verbose');
const help = flags.has('help');

// Blaze-specific flags
const tagPrefix = flags.get('tag-prefix', 'wm');

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


// Show help if requested
if (help) {
  console.log(`
blaze - Automated waymark violation tagging system

Usage: node scripts/blaze.js [options]

Standard Options:
  --help, -h            Show this help message
  --verbose, -v         Show detailed output
  --dry-run, -n         Preview mode (no file changes)

Blaze Options:
  --tag-prefix PREFIX   Custom tag prefix (default: wm)

Examples:
  node scripts/blaze.js --dry-run
  node scripts/blaze.js --tag-prefix custom
  node scripts/blaze.js --verbose
`);
  process.exit(0);
}

async function blazeProblems() {
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
  
  for (const file in problemsByFile) {
    const fileProblems = problemsByFile[file];
    
    if (dryRun) {
      console.log(`\n[DRY RUN] Would tag ${fileProblems.length} problem-lines in ${file}:`);
      fileProblems.forEach(p => {
        const tagsToAdd = p.issues.map(getTagForIssue).join(' #');
        console.log(`  L${p.line}: ${p.content.trim()} #${tagsToAdd}`);
        if (verbose) {
          console.log(`    Issues: ${p.issues.join(', ')}`);
        }
      });
    } else {
      try {
        const fullPath = path.resolve(__dirname, '..', file);
        let content = fs.readFileSync(fullPath, 'utf8');
        let lines = content.split('\n');
        
        // Sort problems by line number descending to avoid line shift issues
        fileProblems.sort((a, b) => b.line - a.line);
        
        let modifiedCount = 0;
        fileProblems.forEach(p => {
          const lineIndex = p.line - 1;
          const tagsToAdd = p.issues.map(getTagForIssue);
          
          if (lines[lineIndex]) {
            let lineContent = lines[lineIndex];
            tagsToAdd.forEach(tag => {
              if (!lineContent.includes(`#${tag}`)) {
                lineContent = `${lineContent} #${tag}`;
                modifiedCount++;
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

blazeProblems(); 