#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IgnorePatterns } from './lib/ignore-patterns.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const verbose = args.includes('--verbose');

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

// Known deprecated markers
const DEPRECATED_MARKERS = new Set([
  'fixme', 'temporary', 'info', 'wip', 'good', 'bad', 'remove',
  'caution', 'pin', 'broken', 'why', 'mustread'
]);

// Blessed properties (things that might appear after ::: but aren't markers)
const BLESSED_PROPERTIES = new Set([
  'priority', 'reason', 'since', 'until', 'version', 'affects',
  'fixes', 'closes', 'depends', 'branch', 'status'
]);

function extractWaymarks() {
  console.log('🔍 Searching for all waymarks in the codebase...\n');
  
  try {
    // Initialize ignore patterns
    const ignorePatterns = new IgnorePatterns(path.resolve(__dirname, '..'));
    
    // Find all files containing :::
    let files = [];
    
    try {
      // Use git ls-files to respect .gitignore, then filter further
      const gitFiles = execSync('git ls-files', {
        encoding: 'utf8',
        cwd: path.resolve(__dirname, '..'),
        maxBuffer: 10 * 1024 * 1024
      }).trim().split('\n').filter(Boolean);
      
      // Filter for files that might contain waymarks and aren't ignored
      const relevantFiles = gitFiles.filter(file => {
        // Check file extension
        if (!/\.(md|js|ts|jsx|tsx|json|yaml|yml|py|go|rs|java|cpp|c|h|hpp|rb|php|swift|kt|scala|clj)$/i.test(file)) {
          return false;
        }
        
        // Check ignore patterns
        const fullPath = path.join(__dirname, '..', file);
        return !ignorePatterns.shouldIgnoreFile(fullPath);
      });
      
      // Now check which files actually contain :::
      for (const file of relevantFiles) {
        try {
          const fullPath = path.join(__dirname, '..', file);
          const hasWaymarks = execSync(`grep -l ":::" "${fullPath}" 2>/dev/null || true`, {
            encoding: 'utf8',
            cwd: path.resolve(__dirname, '..')
          }).trim();
          
          if (hasWaymarks) {
            files.push(file);
          }
        } catch (err) {
          // File doesn't contain ::: or can't be read
        }
      }
    } catch (err) {
      console.error('Error getting file list:', err.message);
      // Fallback to find command if git ls-files fails
      const directories = ['docs', 'src', 'scripts', '.', 'packages'];
      for (const dir of directories) {
        try {
          const dirFiles = execSync(`find ${dir} -type f \\( -name "*.md" -o -name "*.js" -o -name "*.ts" -o -name "*.json" -o -name "*.yaml" \\) -not -path "*/node_modules/*" -not -path "*/.pnpm-store/*" -exec grep -l ":::" {} \\; 2>/dev/null || true`, {
            encoding: 'utf8',
            cwd: path.resolve(__dirname, '..'),
            maxBuffer: 10 * 1024 * 1024
          }).trim().split('\n').filter(Boolean);
          files = files.concat(dirFiles);
        } catch (err) {
          // Skip directories that don't exist
        }
      }
      files = [...new Set(files)];
      files = files.filter(file => !ignorePatterns.shouldIgnoreFile(path.join(__dirname, '..', file)));
    }
    
    console.log(`Found ${files.length} files containing waymarks (after applying ignore patterns)`);
    
    // Show what's being ignored
    if (verbose) {
      console.log('\nIgnore patterns applied:');
      console.log('  - Inherited from: .gitignore, .npmignore, .dockerignore (if they exist)');
      console.log('  - Additional patterns from .waymark/config.json');
      console.log('  - Patterns from .waymarkignore');
    }
    console.log();
    
    const waymarkInventory = new Map();
    const waymarkExamples = new Map();
    let totalWaymarks = 0;
    let ignoredWaymarks = 0;
    
    // Process each file
    files.forEach(file => {
      try {
        const content = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          // Match ::: followed by any content
          const matches = line.matchAll(/:::\s*(.*)$/g);
          
          for (const match of matches) {
            totalWaymarks++;
            const fullMatch = match[0];
            const beforeSigil = line.substring(0, match.index).trim();
            const afterSigil = match[1].trim();
            
            if (!afterSigil) {
              // Empty waymark
              const key = '[EMPTY]';
              waymarkInventory.set(key, (waymarkInventory.get(key) || 0) + 1);
              continue;
            }
            
            // Check if this is correct syntax (marker before :::) or incorrect (marker after :::)
            let firstToken = afterSigil.split(/\s+/)[0];
            let actor = null;
            
            // Extract actor if present
            const actorMatch = afterSigil.match(/@(\w+)/);
            if (actorMatch) {
              actor = `@${actorMatch[1]}`;
            }
            
            // For incorrect syntax detection, we need to check if a marker appears after :::
            // But only if there's no marker before :::
            const markerBeforeSigil = beforeSigil.match(/(\*|!|\?|-|_)*(todo|fix|done|review|refactor|needs|blocked|alert|risk|notice|always|temp|deprecated|draft|stub|cleanup|tldr|note|summary|example|idea|about|docs|test|audit|check|lint|ci|perf|hotpath|mem|io|sec|auth|crypto|a11y|flag|important|hack|legal|must|assert)\s*$/);
            
            // If there's already a marker before :::, this is correct syntax
            if (markerBeforeSigil) {
              // This is correct syntax, process normally
            } else {
              // Check if the first token after ::: is a marker (incorrect syntax)
              const cleanFirstToken = firstToken.replace(/[!*?-]+$/, '');
              if (OFFICIAL_MARKERS.has(cleanFirstToken) || DEPRECATED_MARKERS.has(cleanFirstToken)) {
                // This is incorrect syntax - marker after :::
                firstToken = `INCORRECT_${firstToken}`;
                
                // Debug logging
                if (verbose) {
                  console.log(`Found incorrect syntax at ${file}:${index + 1}`);
                  console.log(`  Line: ${line.trim()}`);
                  console.log(`  Token: ${cleanFirstToken}`);
                }
              }
            }
            
            // Handle special cases
            if (firstToken.startsWith('@')) {
              // Actor reference
              firstToken = '@[ACTOR]';
            } else if (firstToken.includes(':') && !firstToken.startsWith('http') && !firstToken.startsWith('INCORRECT_')) {
              // Property (e.g., priority:high)
              const [prop] = firstToken.split(':');
              firstToken = `${prop}:[VALUE]`;
            } else if (firstToken.match(/^#\d+$/)) {
              // Issue reference
              firstToken = '#[ISSUE]';
            }
            
            // Check if this waymark should be ignored
            const cleanToken = firstToken.replace(/[!*?-]+$/, ''); // Remove signals
            if (ignorePatterns.shouldIgnoreWaymark(cleanToken, afterSigil, actor)) {
              ignoredWaymarks++;
              continue;
            }
            
            // Count occurrences
            waymarkInventory.set(firstToken, (waymarkInventory.get(firstToken) || 0) + 1);
            
            // Store example for context
            if (!waymarkExamples.has(firstToken) || waymarkExamples.get(firstToken).length < 3) {
              if (!waymarkExamples.has(firstToken)) {
                waymarkExamples.set(firstToken, []);
              }
              waymarkExamples.get(firstToken).push({
                file: file,
                line: index + 1,
                content: line.trim()
              });
            }
          }
        });
      } catch (err) {
        console.error(`Error processing ${file}: ${err.message}`);
      }
    });
    
    // Analyze and categorize results
    console.log(`📊 Total waymarks found: ${totalWaymarks}`);
    console.log(`📊 Waymarks ignored by filters: ${ignoredWaymarks}`);
    console.log(`📊 Waymarks analyzed: ${totalWaymarks - ignoredWaymarks}\n`);
    console.log('=== WAYMARK INVENTORY ===\n');
    
    const categories = {
      official: [],
      deprecated: [],
      properties: [],
      special: [],
      unknown: [],
      incorrectSyntax: []
    };
    
    // Sort by frequency
    const sortedEntries = Array.from(waymarkInventory.entries())
      .sort((a, b) => b[1] - a[1]);
    
    // Categorize each entry
    sortedEntries.forEach(([token, count]) => {
      // Handle incorrect syntax specially
      if (token.startsWith('INCORRECT_')) {
        const actualToken = token.replace('INCORRECT_', '');
        categories.incorrectSyntax = categories.incorrectSyntax || [];
        categories.incorrectSyntax.push({ token: actualToken, count });
        return;
      }
      
      const cleanToken = token.replace(/[!*?-]+$/, ''); // Remove signals
      
      if (OFFICIAL_MARKERS.has(cleanToken)) {
        categories.official.push({ token, count, cleanToken });
      } else if (DEPRECATED_MARKERS.has(cleanToken)) {
        categories.deprecated.push({ token, count, cleanToken });
      } else if (token.includes(':[VALUE]') || BLESSED_PROPERTIES.has(cleanToken)) {
        categories.properties.push({ token, count });
      } else if (token === '@[ACTOR]' || token === '#[ISSUE]' || token === '[EMPTY]') {
        categories.special.push({ token, count });
      } else {
        categories.unknown.push({ token, count });
      }
    });
    
    // Print results by category
    console.log('📗 OFFICIAL MARKERS:');
    categories.official.forEach(({ token, count }) => {
      console.log(`  ${token.padEnd(20)} ${count}`);
    });
    
    console.log('\n📕 DEPRECATED MARKERS (need updating):');
    categories.deprecated.forEach(({ token, count, cleanToken }) => {
      const replacement = getReplacementForDeprecated(cleanToken);
      console.log(`  ${token.padEnd(20)} ${count} → should be: ${replacement}`);
    });
    
    console.log('\n📘 PROPERTIES/METADATA:');
    categories.properties.forEach(({ token, count }) => {
      console.log(`  ${token.padEnd(20)} ${count}`);
    });
    
    console.log('\n📙 SPECIAL TOKENS:');
    categories.special.forEach(({ token, count }) => {
      console.log(`  ${token.padEnd(20)} ${count}`);
    });
    
    console.log('\n📓 UNKNOWN/POTENTIAL MARKERS:');
    categories.unknown.forEach(({ token, count }) => {
      console.log(`  ${token.padEnd(20)} ${count}`);
      // Show examples for unknown tokens
      const examples = waymarkExamples.get(token);
      if (examples && examples.length > 0) {
        console.log(`    Example: ${examples[0].content}`);
        console.log(`    File: ${examples[0].file}:${examples[0].line}`);
      }
    });
    
    // Summary statistics
    console.log('\n=== SUMMARY ===');
    console.log(`Official markers:    ${categories.official.reduce((sum, item) => sum + item.count, 0)}`);
    console.log(`Deprecated markers:  ${categories.deprecated.reduce((sum, item) => sum + item.count, 0)}`);
    console.log(`Properties:          ${categories.properties.reduce((sum, item) => sum + item.count, 0)}`);
    console.log(`Special tokens:      ${categories.special.reduce((sum, item) => sum + item.count, 0)}`);
    console.log(`Unknown:             ${categories.unknown.reduce((sum, item) => sum + item.count, 0)}`);
    
    // Check for markers used incorrectly (after sigil instead of before)
    console.log('\n=== CHECKING FOR INCORRECT SYNTAX ===');
    console.log('(markers that should be before ::: but appear after)\n');
    
    if (categories.incorrectSyntax && categories.incorrectSyntax.length > 0) {
      let incorrectCount = 0;
      categories.incorrectSyntax.forEach(({ token, count }) => {
        incorrectCount += count;
        console.log(`  ❌ ::: ${token} (${count} instances) → should be: ${token} :::`);
      });
      console.log(`\n⚠️  Found ${incorrectCount} waymarks using incorrect syntax!`);
    } else {
      console.log('✅ No incorrect marker placement found!');
    }
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

function getReplacementForDeprecated(marker) {
  const replacements = {
    'fixme': 'fix',
    'temporary': 'temp',
    'info': 'note',
    'wip': 'draft',
    'good': 'note ::: status:approved',
    'bad': 'note ::: status:rejected',
    'remove': '-todo or -note',
    'caution': '!alert',
    'pin': '*note',
    'broken': 'note ::: status:broken',
    'why': 'note ::: reason:...',
    'mustread': '!!note or !!tldr'
  };
  return replacements[marker] || marker;
}

// Run the audit
extractWaymarks();