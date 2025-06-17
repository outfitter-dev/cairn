#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IgnorePatterns } from './lib/ignore-patterns.js';
import WaymarkSpec from './lib/spec-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const legacyMode = args.includes('--legacy');
const noPrefixMode = args.includes('--no-prefix');
const saveLog = args.includes('--save');
const testMode = args.includes('--test');
const jsonOutput = args.includes('--json');

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

function extractWaymarks() {
  if (testMode) {
    console.log('🧪 Running in test mode - scanning only test files...\n');
  } else if (!jsonOutput) {
    console.log('🔍 Searching for all waymarks in the codebase...\n');
  }
  
  try {
    const spec = new WaymarkSpec();
    const OFFICIAL_MARKERS = spec.officialMarkers;
    const DEPRECATED_MARKERS = spec.deprecatedMarkers;
    const LEGACY_PROPERTIES = spec.legacyProperties;
    const RELATIONAL_TAGS = spec.allRelationalTags;
    const syntaxViolations = [];
    
    // Initialize counters
    let totalWaymarks = 0;
    let ignoredWaymarks = 0;
    const waymarkInventory = new Map();
    const waymarkExamples = new Map();

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

    // In test mode, override with test files only
    if (testMode) {
      const testDir = path.join(__dirname, 'tests');
      if (fs.existsSync(testDir)) {
        const testFiles = fs.readdirSync(testDir)
          .filter(file => /\.(md|js|ts|jsx|tsx)$/i.test(file))
          .map(file => path.join('scripts/tests', file));
        
        // Check which test files contain :::
        files = [];
        for (const file of testFiles) {
          try {
            const fullPath = path.join(__dirname, '..', file);
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(':::')) {
              files.push(file);
            }
          } catch (err) {
            // Skip files that can't be read
          }
        }
      } else {
        console.log('⚠️  No scripts/tests/ directory found');
        files = [];
      }
    }
    
    if (!jsonOutput) {
      console.log(`Found ${files.length} files containing waymarks (after applying ignore patterns)`);
    }
    
    // Show what's being ignored
    if (verbose) {
      console.log('\nIgnore patterns applied:');
      console.log('  - Inherited from: .gitignore, .npmignore, .dockerignore (if they exist)');
      console.log('  - Additional patterns from .waymark/config.json');
      console.log('  - Patterns from .waymarkignore');
    }
    console.log();
    
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

            // --- V1 Syntax Compliance Checks ---
            
            // 1. Check for legacy +tag syntax
            if (/\+\w+/.test(afterSigil)) {
              syntaxViolations.push({
                file, line: index + 1, issue: 'Legacy `+tag` syntax found.', type: 'legacy-plus-tag', content: line.trim()
              });
            }

            // 2. Check for property-based priority
            if (/(^|\s)priority:(high|critical|low|medium|p[0-3])(\s|$)/.test(afterSigil)) {
              syntaxViolations.push({
                file, line: index + 1, issue: 'Property-based priority found.', type: 'property-priority', content: line.trim()
              });
            }

            // 3. Check for missing hash in reference values
            const missingHashRegex = /#(fixes|closes|depends|blocks|refs|owner|cc|affects|for|relates|see|replaces|pr|commit|branch|test|feat|docs|link|needs|issue|ticket|followup):([a-zA-Z0-9][^#\s,]*)/g;
            let hashMatch;
            while ((hashMatch = missingHashRegex.exec(afterSigil)) !== null) {
              const key = hashMatch[1];
              const value = hashMatch[2];
              if (!value.startsWith('@')) { // Don't flag actor values
                syntaxViolations.push({
                  file, line: index + 1, issue: 'Missing `#` in reference value.', type: 'missing-ref-hash', content: line.trim()
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
                  file, line: index + 1, issue: 'Discouraged hierarchical tag found.', type: 'hierarchical-tag', content: line.trim()
                });
              }
            }

            // 5. Check for legacy blessed properties
            const legacyBlessedRegex = /(^|\s)(reason|since|until|version|affects):([^#\s]+)/g;
            let bMatch;
            while ((bMatch = legacyBlessedRegex.exec(afterSigil)) !== null) {
              syntaxViolations.push({
                file, line: index + 1, issue: 'Legacy blessed property found.', type: 'legacy-blessed-property', content: line.trim()
              });
            }

            // 6. Check for non-blessed properties without # prefix
            const propertyRegex = /(^|\s)([a-zA-Z_][a-zA-Z0-9_]*):([^#\s]+)/g;
            let pMatch;
            while ((pMatch = propertyRegex.exec(afterSigil)) !== null) {
              const key = pMatch[2];
              // Skip if it's already a tag, actor value, or blessed relational
              if (pMatch[0].includes('#') || pMatch[3].startsWith('@') || RELATIONAL_TAGS.has(key)) {
                continue;
              }
              syntaxViolations.push({
                file, line: index + 1, issue: 'Non-blessed property without `#` found.', type: 'non-blessed-property', content: line.trim()
              });
            }

            // 7. Check for arrays with spaces
            if (/#\w+:@?\w+,\s+/.test(afterSigil)) {
              syntaxViolations.push({
                file, line: index + 1, issue: 'Array with spaces found.', type: 'array-with-spaces', content: line.trim()
              });
            }

            // 8. Check for multiple ownership tags
            const ownerMatches = afterSigil.match(/#owner:\S+/g);
            if (ownerMatches && ownerMatches.length > 1) {
              syntaxViolations.push({
                file, line: index + 1, issue: 'Multiple ownership tags found.', type: 'multiple-ownership-tags', content: line.trim()
              });
            }

            // 9. Check for multiple cc tags
            const ccMatches = afterSigil.match(/#cc:\S+/g);
            if (ccMatches && ccMatches.length > 1) {
              syntaxViolations.push({
                file, line: index + 1, issue: 'Multiple cc tags found.', type: 'multiple-cc-tags', content: line.trim()
              });
            }

            // 10. Check for misplaced @actors
            const actorRegex = /@([a-zA-Z0-9_-]+)/g;
            let aMatch;
            const firstToken = afterSigil.trim().split(/\s+/)[0];
            const isFirstTokenActor = firstToken && firstToken.startsWith('@');
            
            while ((aMatch = actorRegex.exec(afterSigil)) !== null) {
              const position = aMatch.index;
              
              // Skip if this is the first token (valid placement)
              if (isFirstTokenActor && position === 0) continue;
              
              // Check if actor is in a relational tag value (valid placement)
              const precedingText = afterSigil.substring(0, position);
              const relationalTagsWithActors = spec.getRelationalTagsWithActors();
              const isInRelationalValue = Array.from(relationalTagsWithActors).some(tag =>
                new RegExp(`#${tag}:[^\\s]*$`).test(precedingText.split(/\s+/).pop() || '')
              );
              
              if (!isInRelationalValue) {
                syntaxViolations.push({
                  file, line: index + 1, issue: 'Misplaced @actor found.', type: 'misplaced-actor', content: line.trim()
                });
              }
            }

            // --- Marker and Inventory Logic ---
            let inventoryToken = null;
            const beforeTokens = beforeSigil.split(/\s+/);
            let markerCandidate = beforeTokens.pop() || '';
            const signals = markerCandidate.match(/^([!*?-]+)/);
            if(signals){
                markerCandidate = markerCandidate.substring(signals[0].length);
            }

            // 11. Check for all-caps markers
            if (markerCandidate && markerCandidate === markerCandidate.toUpperCase() && markerCandidate.length > 1) {
              syntaxViolations.push({
                file, line: index + 1, issue: 'All-caps marker found.', type: 'all-caps-marker', content: line.trim()
              });
            }

            if (OFFICIAL_MARKERS.has(markerCandidate)) {
                inventoryToken = markerCandidate;
            } else if (DEPRECATED_MARKERS.has(markerCandidate)) {
                inventoryToken = markerCandidate;
                syntaxViolations.push({
                    file,
                    line: index + 1,
                    issue: `Deprecated marker found: '${markerCandidate}'`,
                    type: 'deprecated-marker',
                    content: line.trim()
                });
            }

            // Check for misplaced markers
            const afterTokens = afterSigil.split(/\s+/);
            let firstTokenAfter = afterTokens[0]?.replace(/[!*?-]+$/, '');
            if (firstTokenAfter && (OFFICIAL_MARKERS.has(firstTokenAfter) || DEPRECATED_MARKERS.has(firstTokenAfter))) {
              syntaxViolations.push({
                  file,
                  line: index + 1,
                  issue: `Marker in wrong position: '${firstTokenAfter}' should be before :::`,
                  type: 'marker-misplaced',
                  content: line.trim()
              });
              // For inventory purposes, treat it as if it were correct
              inventoryToken = `INCORRECT_${firstTokenAfter}`;
            }

            if (!inventoryToken) {
              // If no marker was found before, and no misplaced marker after,
              // then the inventory token is based on what's after the sigil.
              inventoryToken = afterTokens[0] || '[UNKNOWN]';
            }
            
            // Handle special cases for inventory
            let finalInventoryToken = inventoryToken;
            if (finalInventoryToken.startsWith('@')) {
              finalInventoryToken = '@[ACTOR]';
            } else if (finalInventoryToken.includes(':') && !finalInventoryToken.startsWith('http') && !finalInventoryToken.startsWith('INCORRECT_')) {
              const [prop] = finalInventoryToken.split(':');
              finalInventoryToken = `${prop}:[VALUE]`;
            } else if (finalInventoryToken.match(/^#\d+$/)) {
              finalInventoryToken = '#[ISSUE]';
            }
            
            // Check if this waymark should be ignored for inventory
            const cleanToken = finalInventoryToken.replace(/[!*?-]+$/, ''); // Remove signals
            if (ignorePatterns.shouldIgnoreWaymark(cleanToken, afterSigil, null)) {
              ignoredWaymarks++;
              return;
            }
            
            // Count occurrences for inventory
            waymarkInventory.set(finalInventoryToken, (waymarkInventory.get(finalInventoryToken) || 0) + 1);
            
            // Store example for context
            if (!waymarkExamples.has(finalInventoryToken) || waymarkExamples.get(finalInventoryToken).length < 3) {
              if (!waymarkExamples.has(finalInventoryToken)) {
                waymarkExamples.set(finalInventoryToken, []);
              }
              waymarkExamples.get(finalInventoryToken).push({
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
    
    if (jsonOutput) {
        console.log(JSON.stringify(syntaxViolations, null, 2));
        return;
    }

    if (legacyMode) {
      // Legacy mode: show only violations
      if (syntaxViolations.length === 0) {
        console.log('✅ No waymark violations found. Codebase is v1.0 compliant!');
        return;
      }

      console.log(`⚠️  Found ${syntaxViolations.length} waymark violations:\n`);
      
      // Group violations by file
      const violationsByFile = new Map();
      syntaxViolations.forEach(v => {
        if (!violationsByFile.has(v.file)) {
          violationsByFile.set(v.file, []);
        }
        violationsByFile.get(v.file).push(v);
      });

      // Sort files alphabetically
      const sortedFiles = Array.from(violationsByFile.keys()).sort();
      
      sortedFiles.forEach(file => {
        const violations = violationsByFile.get(file);
        console.log(`📁 ${file}`);
        
        // Sort violations by line number
        violations.sort((a, b) => a.line - b.line);
        
        violations.forEach(v => {
          console.log(`  ${v.line}: ${v.issue}`);
          if (verbose) {
            console.log(`      ${v.content}`);
          }
        });
        console.log();
      });
      return;
    }
    
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
      } else if (token.includes(':[VALUE]') || LEGACY_PROPERTIES.has(cleanToken)) {
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
        console.log(`  ${token.padEnd(20)} ${count}`);
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

// Run the audit
extractWaymarks();