#!/usr/bin/env node

// :ga:meta grepa-list script - discovers all grep-anchors in your codebase

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const DEFAULT_ANCHOR = ':ga:';
const OUTPUT_FILE = join(process.cwd(), '.grepa', 'grepa-list.json');

function findGrepAnchors(anchor = DEFAULT_ANCHOR) {
  try {
    // Run ripgrep to find all anchors
    // -n: line numbers, -o: only matching, --no-heading: compact format
    const rgCommand = `rg -n -o "${anchor}[^\\s]*" --no-heading`;
    const output = execSync(rgCommand, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    
    if (!output.trim()) {
      return { tags: {}, files: {}, totalAnchors: 0 };
    }
    
    const lines = output.trim().split('\n');
    const tags = {};
    const files = {};
    
    lines.forEach(line => {
      // Parse format: filename:line:match
      const match = line.match(/^(.+?):(\d+):(.+)$/);
      if (!match) return;
      
      const [, filename, lineNum, fullMatch] = match;
      
      // Extract the tag from the full match
      const tagMatch = fullMatch.match(new RegExp(`${anchor}([^\\s,\\]\\}]+)`));
      if (!tagMatch) return;
      
      const tag = tagMatch[1];
      
      // Update tag statistics
      if (!tags[tag]) {
        tags[tag] = {
          count: 0,
          files: {},
          firstSeen: { file: filename, line: parseInt(lineNum) }
        };
      }
      
      tags[tag].count++;
      
      // Track files for this tag
      if (!tags[tag].files[filename]) {
        tags[tag].files[filename] = [];
      }
      tags[tag].files[filename].push(parseInt(lineNum));
      
      // Update file statistics
      if (!files[filename]) {
        files[filename] = {
          totalAnchors: 0,
          tags: {},
          lines: []
        };
      }
      
      files[filename].totalAnchors++;
      files[filename].tags[tag] = (files[filename].tags[tag] || 0) + 1;
      files[filename].lines.push(parseInt(lineNum));
    });
    
    // Sort lines in each file
    Object.values(files).forEach(file => {
      file.lines.sort((a, b) => a - b);
    });
    
    // Sort lines in each tag's files
    Object.values(tags).forEach(tag => {
      Object.values(tag.files).forEach(lines => {
        lines.sort((a, b) => a - b);
      });
    });
    
    return {
      tags,
      files,
      totalAnchors: lines.length,
      anchor
    };
    
  } catch (error) {
    if (error.status === 1) {
      // No matches found
      return { tags: {}, files: {}, totalAnchors: 0, anchor };
    }
    throw error;
  }
}

function generateReport(data) {
  const { tags, files, totalAnchors, anchor } = data;
  
  // Sort tags by count (descending)
  const sortedTags = Object.entries(tags)
    .sort(([, a], [, b]) => b.count - a.count);
  
  // Sort files by anchor count (descending)
  const sortedFiles = Object.entries(files)
    .sort(([, a], [, b]) => b.totalAnchors - a.totalAnchors);
  
  const report = {
    _comment: ":ga:meta Generated grep-anchor inventory - DO NOT EDIT MANUALLY",
    generated: new Date().toISOString(),
    anchor: anchor,
    summary: {
      totalAnchors,
      uniqueTags: Object.keys(tags).length,
      filesWithAnchors: Object.keys(files).length
    },
    tags: Object.fromEntries(sortedTags),
    files: Object.fromEntries(sortedFiles),
    topTags: sortedTags.slice(0, 10).map(([tag, data]) => ({
      tag,
      count: data.count,
      fileCount: Object.keys(data.files).length
    })),
    topFiles: sortedFiles.slice(0, 10).map(([file, data]) => ({
      file,
      anchors: data.totalAnchors,
      uniqueTags: Object.keys(data.tags).length
    }))
  };
  
  return report;
}

// Main execution
function main() {
  console.log('🔍 Searching for grep-anchors...');
  
  try {
    // Check if custom anchor is provided as argument
    const anchor = process.argv[2] || DEFAULT_ANCHOR;
    
    const data = findGrepAnchors(anchor);
    const report = generateReport(data);
    
    // Ensure .grepa directory exists
    const grepaDir = join(process.cwd(), '.grepa');
    execSync(`mkdir -p "${grepaDir}"`, { stdio: 'ignore' });
    
    // Write JSONC file with pretty printing
    const jsonContent = JSON.stringify(report, null, 2);
    writeFileSync(OUTPUT_FILE, jsonContent);
    
    // Print summary
    console.log(`\n✅ Grep-anchor inventory generated!`);
    console.log(`📍 Anchor pattern: ${anchor}`);
    console.log(`📊 Found ${report.summary.totalAnchors} anchors across ${report.summary.filesWithAnchors} files`);
    console.log(`🏷️  Discovered ${report.summary.uniqueTags} unique tags`);
    console.log(`📄 Report saved to: ${OUTPUT_FILE}`);
    
    if (report.topTags.length > 0) {
      console.log('\n🔝 Top 5 tags:');
      report.topTags.slice(0, 5).forEach(({ tag, count, fileCount }) => {
        console.log(`   ${tag}: ${count} uses in ${fileCount} file(s)`);
      });
    }
    
  } catch (error) {
    if (error.code === 'ENOENT' && error.message.includes('rg')) {
      console.error('❌ Error: ripgrep (rg) is not installed or not in PATH');
      console.error('   Install it from: https://github.com/BurntSushi/ripgrep');
      process.exit(1);
    }
    
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
} 