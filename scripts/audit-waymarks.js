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

// Parse include/exclude filters
let includeFilters = [];
let excludeFilters = [];

const includeIndex = args.indexOf('--include');
if (includeIndex !== -1 && args[includeIndex + 1]) {
  includeFilters = args[includeIndex + 1].split(',');
}

const excludeIndex = args.indexOf('--exclude');
if (excludeIndex !== -1 && args[excludeIndex + 1]) {
  excludeFilters = args[excludeIndex + 1].split(',');
}

// Official markers from waymark v1.0 spec
const OFFICIAL_MARKERS = new Set([
  // Top-level
  'tldr',
  // Work
  'todo', 'fixme', 'refactor', 'review', 'wip', 'stub', 'temp', 'done', 'deprecated', 'test',
  // Info
  'note', 'idea', 'about', 'example',
  // Attention
  'notice', 'risk', 'important'
]);

// Known deprecated markers (from unified hash migration guide)
const DEPRECATED_MARKERS = new Set([
  // From original deprecated list
  'temporary', 'info', 'good', 'bad', 'remove', 'caution', 'pin', 'broken', 'why', 'mustread',
  // From migration guide
  'alert', 'always', 'fix', 'check', 'must', 'ci', 'needs', 'blocked',
  'sec', 'audit', 'warn', 'draft', 'new', 'hold', 'shipped', 'perf', 'cleanup', 'hack',
  // From old official markers not in v1.0
  'summary', 'docs', 'lint', 'hotpath', 'mem', 'io', 'auth', 'crypto', 'a11y',
  'flag', 'legal', 'assert'
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
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes(':::')) {
            files.push(file);
          }
        } catch (err) {
          // File doesn't contain ::: or can't be read
        }
      }
    } catch (err) {
      console.error('Error getting file list:', err.message);
      // Fallback to reading files directly if git ls-files fails
      const directories = ['docs', 'src', 'scripts', '.', 'packages'];
      const fileExtensions = ['.md', '.js', '.ts', '.jsx', '.tsx', '.json', '.yaml', '.yml', '.py', '.go', '.rs', '.java', '.cpp', '.c', '.h', '.hpp', '.rb', '.php', '.swift', '.kt', '.scala', '.clj'];
      
      const searchDirectory = (dir) => {
        const fullDir = path.join(__dirname, '..', dir);
        if (!fs.existsSync(fullDir)) return;
        
        const items = fs.readdirSync(fullDir, { withFileTypes: true });
        for (const item of items) {
          const itemPath = path.join(dir, item.name);
          const fullPath = path.join(__dirname, '..', itemPath);
          
          if (item.isDirectory()) {
            // Skip ignored directories
            if (item.name === 'node_modules' || item.name === '.pnpm-store' || item.name.startsWith('.')) continue;
            searchDirectory(itemPath);
          } else if (item.isFile()) {
            // Check file extension
            const ext = path.extname(item.name).toLowerCase();
            if (!fileExtensions.includes(ext)) continue;
            
            // Check ignore patterns
            if (ignorePatterns.shouldIgnoreFile(fullPath)) continue;
            
            // Check if file contains :::
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              if (content.includes(':::')) {
                files.push(itemPath);
              }
            } catch (err) {
              // Skip files that can't be read
            }
          }
        }
      };
      
      for (const dir of directories) {
        searchDirectory(dir);
      }
      files = [...new Set(files)];
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
    
    // Apply filters if requested
    const shouldShowCategory = (category) => {
      // If no filters specified, show all
      if (includeFilters.length === 0 && excludeFilters.length === 0) {
        return true;
      }
      
      // Check excludes first
      if (excludeFilters.length > 0 && excludeFilters.includes(category)) {
        return false;
      }
      
      // If includes specified, must be in the list
      if (includeFilters.length > 0) {
        return includeFilters.includes(category);
      }
      
      // No includes specified, not excluded, so show it
      return true;
    };
    
    // Filter support
    if (includeFilters.length > 0 || excludeFilters.length > 0) {
      console.log('🔍 Applying filters...');
      if (includeFilters.length > 0) console.log(`  Include: ${includeFilters.join(', ')}`);
      if (excludeFilters.length > 0) console.log(`  Exclude: ${excludeFilters.join(', ')}`);
      console.log();
    }
    
    // Print results by category (respecting filters)
    if (shouldShowCategory('core') || shouldShowCategory('official')) {
      console.log('📗 OFFICIAL MARKERS (v1.0 core):');
      categories.official.forEach(({ token, count }) => {
        console.log(`  ${token.padEnd(20)} ${count}`);
      });
      console.log();
    }
    
    if (shouldShowCategory('deprecated')) {
      console.log('📕 DEPRECATED MARKERS (need updating):');
      categories.deprecated.forEach(({ token, count, cleanToken }) => {
        const replacement = getReplacementForDeprecated(cleanToken);
        console.log(`  ${token.padEnd(20)} ${count} → should be: ${replacement}`);
      });
      console.log();
    }
    
    if (shouldShowCategory('properties') || shouldShowCategory('metadata')) {
      console.log('📘 PROPERTIES/METADATA:');
      categories.properties.forEach(({ token, count }) => {
        console.log(`  ${token.padEnd(20)} ${count}`);
      });
      console.log();
    }
    
    if (shouldShowCategory('special')) {
      console.log('📙 SPECIAL TOKENS:');
      categories.special.forEach(({ token, count }) => {
        console.log(`  ${token.padEnd(20)} ${count}`);
      });
      console.log();
    }
    
    if (shouldShowCategory('unknown')) {
      console.log('📓 UNKNOWN/POTENTIAL MARKERS:');
      categories.unknown.forEach(({ token, count }) => {
        console.log(`  ${token.padEnd(20)} ${count}`);
        // Show examples for unknown tokens
        const examples = waymarkExamples.get(token);
        if (examples && examples.length > 0) {
          console.log(`    Example: ${examples[0].content}`);
          console.log(`    File: ${examples[0].file}:${examples[0].line}`);
        }
      });
      console.log();
    }
    
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
    // Original deprecated markers
    'temporary': 'temp',
    'info': 'note',
    'good': 'note ::: #approved',
    'bad': 'note ::: #rejected',
    'remove': '-todo or -temp',
    'caution': '!notice',
    'pin': '*note',
    'broken': 'note ::: #broken',
    'why': 'note ::: #reason:...',
    'mustread': '!!important',
    
    // From migration guide
    'alert': 'notice',
    'always': 'important',
    'fix': 'fixme',
    'check': 'todo ::: #verify',
    'must': '!notice ::: #required',
    'ci': '[appropriate type] ::: #ci',
    'needs': 'todo',
    'blocked': 'todo ::: #blocked',
    'sec': '[!!,!]risk ::: #security',
    'audit': 'important ::: #audit',
    'warn': '!notice ::: #warning',
    'draft': 'wip ::: #draft',
    'new': 'todo ::: #enhancement',
    'hold': 'note ::: #hold',
    'shipped': 'note ::: #shipped',
    'perf': 'todo ::: #perf',
    'cleanup': 'temp ::: #cleanup',
    'hack': 'temp ::: #hack',
    
    // From old official markers not in v1.0
    'summary': 'tldr',
    'docs': 'note ::: #docs',
    'lint': 'todo ::: #lint',
    'hotpath': 'todo ::: #hotpath #perf',
    'mem': 'todo ::: #memory #perf',
    'io': 'todo ::: #io #perf',
    'auth': 'todo ::: #auth #security',
    'crypto': 'todo ::: #crypto #security',
    'a11y': 'todo ::: #a11y',
    'flag': 'todo ::: #feature-flag',
    'legal': 'important ::: #legal',
    'assert': 'important ::: #assert'
  };
  return replacements[marker] || marker;
}

// Run the audit
extractWaymarks();