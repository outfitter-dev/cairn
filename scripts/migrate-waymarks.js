#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IgnorePatterns } from './lib/ignore-patterns.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Official markers from syntax evolution doc (v1.0)
const OFFICIAL_MARKERS = new Set([
  // Work
  'todo', 'fix', 'done', 'review', 'refactor', 'needs', 'blocked',
  // Alert
  'alert', 'risk', 'notice', 'always',
  // State
  'temp', 'deprecated', 'draft', 'stub', 'cleanup',
  // Info
  'tldr', 'note', 'summary', 'example', 'idea', 'about', 'docs',
  // Quality
  'test', 'audit', 'check', 'lint', 'ci',
  // Performance
  'perf', 'hotpath', 'mem', 'io',
  // Security
  'sec', 'auth', 'crypto', 'a11y',
  // Meta
  'flag', 'important', 'hack', 'legal', 'must', 'assert'
]);

// Deprecated marker replacements
const DEPRECATED_REPLACEMENTS = {
  'fixme': 'fix',
  'temporary': 'temp',
  'info': 'note',
  'wip': 'draft',
  'good': 'note', // with status:approved property
  'bad': 'note',  // with status:rejected property
  'remove': '-todo',
  'caution': '!alert',
  'pin': '*note',
  'broken': 'note', // with status:broken property
  'why': 'note',    // with reason: property
  'mustread': '!!note'
};

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose');
const filesOnly = args.includes('--files-only');

function migrateWaymarks() {
  console.log('🔄 Migrating waymarks to v1.0 syntax...\n');
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }
  
  try {
    // Initialize ignore patterns
    const ignorePatterns = new IgnorePatterns(path.resolve(__dirname, '..'));
    
    // Find all files
    const directories = ['docs', 'src', 'scripts', '.', 'packages'];
    let files = [];
    
    for (const dir of directories) {
      try {
        const dirFiles = execSync(`find ${dir} -type f \\( -name "*.md" -o -name "*.js" -o -name "*.ts" -o -name "*.json" -o -name "*.yaml" \\) -exec grep -l ":::" {} \\; 2>/dev/null || true`, {
          encoding: 'utf8',
          cwd: path.resolve(__dirname, '..'),
          maxBuffer: 10 * 1024 * 1024
        }).trim().split('\n').filter(Boolean);
        files = files.concat(dirFiles);
      } catch (err) {
        // Skip directories that don't exist
      }
    }
    
    // Remove duplicates and filter ignored files
    files = [...new Set(files)];
    files = files.filter(file => !ignorePatterns.shouldIgnoreFile(path.join(__dirname, '..', file)));
    
    console.log(`Found ${files.length} files to check\n`);
    
    let totalChanges = 0;
    let filesModified = 0;
    const changesByType = {
      incorrectSyntax: 0,
      deprecatedMarkers: 0,
      properties: 0
    };
    
    // Process each file
    files.forEach(file => {
      const filePath = path.join(__dirname, '..', file);
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      let fileChanges = 0;
      
      // Split into lines for line-by-line processing
      const lines = content.split('\n');
      const modifiedLines = lines.map((line, index) => {
        let modifiedLine = line;
        
        // Pattern 1: Fix incorrect marker placement (::: marker → marker :::)
        const incorrectPattern = /:::\s+([!*?-]*)(todo|fix|done|review|refactor|needs|blocked|alert|risk|notice|always|temp|deprecated|draft|stub|cleanup|tldr|note|summary|example|idea|about|docs|test|audit|check|lint|ci|perf|hotpath|mem|io|sec|auth|crypto|a11y|flag|important|hack|legal|must|assert)\b/gi;
        
        modifiedLine = modifiedLine.replace(incorrectPattern, (match, signals, marker) => {
          fileChanges++;
          changesByType.incorrectSyntax++;
          if (verbose) {
            console.log(`  Line ${index + 1}: ::: ${signals}${marker} → ${signals}${marker} :::`);
          }
          return `${signals}${marker} :::`;
        });
        
        // Pattern 2: Fix deprecated markers (before :::)
        Object.entries(DEPRECATED_REPLACEMENTS).forEach(([deprecated, replacement]) => {
          const deprecatedPattern = new RegExp(`\\b${deprecated}\\s+:::`, 'gi');
          modifiedLine = modifiedLine.replace(deprecatedPattern, (match) => {
            fileChanges++;
            changesByType.deprecatedMarkers++;
            if (verbose) {
              console.log(`  Line ${index + 1}: ${deprecated} ::: → ${replacement} :::`);
            }
            
            // Handle special cases that need properties
            if (deprecated === 'good') {
              return `${replacement} ::: status:approved`;
            } else if (deprecated === 'bad') {
              return `${replacement} ::: status:rejected`;
            } else if (deprecated === 'broken') {
              return `${replacement} ::: status:broken`;
            } else if (deprecated === 'why') {
              return `${replacement} ::: reason:`;
            }
            
            return `${replacement} :::`;
          });
        });
        
        // Pattern 3: Fix deprecated markers (after ::: - wrong syntax that also needs updating)
        Object.entries(DEPRECATED_REPLACEMENTS).forEach(([deprecated, replacement]) => {
          const deprecatedPatternAfter = new RegExp(`:::\\s+${deprecated}\\b`, 'gi');
          modifiedLine = modifiedLine.replace(deprecatedPatternAfter, (match) => {
            fileChanges++;
            changesByType.deprecatedMarkers++;
            changesByType.incorrectSyntax++; // Also counts as incorrect syntax
            if (verbose) {
              console.log(`  Line ${index + 1}: ::: ${deprecated} → ${replacement} :::`);
            }
            
            // Handle special cases
            if (deprecated === 'good') {
              return `${replacement} ::: status:approved`;
            } else if (deprecated === 'bad') {
              return `${replacement} ::: status:rejected`;
            } else if (deprecated === 'broken') {
              return `${replacement} ::: status:broken`;
            } else if (deprecated === 'why') {
              return `${replacement} ::: reason:`;
            }
            
            return `${replacement} :::`;
          });
        });
        
        return modifiedLine;
      });
      
      content = modifiedLines.join('\n');
      
      if (content !== originalContent) {
        filesModified++;
        totalChanges += fileChanges;
        
        if (filesOnly) {
          console.log(file);
        } else {
          console.log(`📝 ${file}: ${fileChanges} changes`);
        }
        
        if (!dryRun) {
          fs.writeFileSync(filePath, content, 'utf8');
        }
      }
    });
    
    // Summary
    if (!filesOnly) {
      console.log('\n=== MIGRATION SUMMARY ===');
      console.log(`Files checked: ${files.length}`);
      console.log(`Files modified: ${filesModified}`);
      console.log(`Total changes: ${totalChanges}`);
      console.log('\nChanges by type:');
      console.log(`  Incorrect syntax fixed: ${changesByType.incorrectSyntax}`);
      console.log(`  Deprecated markers updated: ${changesByType.deprecatedMarkers}`);
      
      if (dryRun) {
        console.log('\n✅ DRY RUN COMPLETE - No files were modified');
        console.log('Run without --dry-run to apply changes');
      } else {
        console.log('\n✅ MIGRATION COMPLETE');
      }
    }
    
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

// Show help if requested
if (args.includes('--help')) {
  console.log(`
Waymark Migration Script v1.0

Migrates waymarks to the v1.0 syntax specification:
- Fixes incorrect marker placement (::: marker → marker :::)
- Updates deprecated markers to their modern equivalents
- Respects .waymark/config.json and .waymarkignore patterns

Usage:
  node scripts/migrate-waymarks.js [options]

Options:
  --dry-run     Show what would be changed without modifying files
  --verbose     Show detailed information about each change
  --files-only  Only output modified file paths (useful for piping)
  --help        Show this help message

Examples:
  node scripts/migrate-waymarks.js --dry-run
  node scripts/migrate-waymarks.js --verbose
  node scripts/migrate-waymarks.js --files-only | xargs git add
`);
  process.exit(0);
}

// Run the migration
migrateWaymarks();