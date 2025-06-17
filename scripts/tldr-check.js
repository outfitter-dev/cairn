#!/usr/bin/env node

// tldr ::: ##tldr-analyzer comprehensive TLDR waymark analysis and quality checking tool #tooling #docs

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
const requireTags = args.includes('--require-tags');
const requireAnchors = args.includes('--require-anchors');
const strict = args.includes('--strict'); // Enables all checks
const verbose = args.includes('--verbose');
const jsonOutput = args.includes('--json');
const fixMode = args.includes('--fix');

// Parse min-tags flag
let minTags = 0;
const minTagsIndex = args.indexOf('--min-tags');
if (minTagsIndex !== -1 && args[minTagsIndex + 1]) {
  minTags = parseInt(args[minTagsIndex + 1], 10);
}

// If strict mode, enable all checks
const checks = {
  requireTags: strict || requireTags,
  requireAnchors: strict || requireAnchors,
  minTags: strict ? Math.max(minTags, 1) : minTags
};

function findFiles() {
  const ignorePatterns = new IgnorePatterns(path.resolve(__dirname, '..'));
  let files = [];
  
  try {
    // Use git ls-files to respect .gitignore
    const gitFiles = execSync('git ls-files', {
      encoding: 'utf8',
      cwd: path.resolve(__dirname, '..'),
      maxBuffer: 10 * 1024 * 1024
    }).trim().split('\n').filter(Boolean);
    
    // Filter for relevant files
    files = gitFiles.filter(file => {
      // Check file extension
      if (!/\.(md|js|ts|jsx|tsx|py|go|rs|java|rb|php|swift|kt|scala|clj|yml|yaml|json|sql|sh)$/i.test(file)) {
        return false;
      }
      
      // Skip test files unless explicitly checking
      if (/\.(test|spec)\.(js|ts|jsx|tsx)$/i.test(file)) {
        return false;
      }
      
      // Skip config files
      if (/\.(config|rc)\.?(js|json|yml|yaml)?$/i.test(file)) {
        return false;
      }
      
      // Skip generated files
      if (/\.(generated|min|bundle)\./i.test(file)) {
        return false;
      }
      
      // Check ignore patterns
      const fullPath = path.join(__dirname, '..', file);
      return !ignorePatterns.shouldIgnoreFile(fullPath);
    });
  } catch (err) {
    console.error('Error getting file list:', err.message);
  }
  
  return files;
}

function extractTLDR(content, filePath) {
  const lines = content.split('\n');
  
  // Look for tldr in first 10 lines (reasonable for top-of-file)
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i];
    const tldrMatch = line.match(/tldr\s*:::\s*(.+)$/);
    
    if (tldrMatch) {
      const fullContent = tldrMatch[1].trim();
      
      // Parse components
      const anchorMatch = fullContent.match(/^##(\S+)\s+(.+)$/);
      const anchor = anchorMatch ? anchorMatch[1] : null;
      const description = anchorMatch ? anchorMatch[2] : fullContent;
      
      // Extract tags
      const tags = [];
      const tagMatches = description.matchAll(/#(\w+(?::\w+)?)/g);
      for (const match of tagMatches) {
        tags.push(match[1]);
      }
      
      return {
        line: i + 1,
        raw: line.trim(),
        description,
        anchor,
        tags,
        length: description.length
      };
    }
  }
  
  return null;
}

function analyzeTLDR(tldr, filePath) {
  const issues = [];
  const suggestions = [];
  
  if (!tldr) {
    issues.push('Missing tldr waymark');
    
    // Suggest based on file type/location
    const ext = path.extname(filePath);
    const dir = path.dirname(filePath);
    
    if (dir.includes('docs')) {
      suggestions.push('Consider adding: <!-- tldr ::: ##anchor-name brief description #docs -->');
    } else if (dir.includes('scripts')) {
      suggestions.push('Consider adding: // tldr ::: brief description #tooling');
    } else if (ext === '.ts' || ext === '.js') {
      suggestions.push('Consider adding: // tldr ::: brief description #component');
    }
    
    return { issues, suggestions };
  }
  
  // Check requirements
  if (checks.requireTags && tldr.tags.length === 0) {
    issues.push('No tags found');
    
    // Suggest tags based on context
    const suggestedTags = [];
    if (filePath.includes('test')) suggestedTags.push('#test');
    if (filePath.includes('docs')) suggestedTags.push('#docs');
    if (filePath.includes('scripts')) suggestedTags.push('#tooling');
    if (filePath.includes('packages')) suggestedTags.push('#package');
    
    if (suggestedTags.length > 0) {
      suggestions.push(`Consider adding tags: ${suggestedTags.join(' ')}`);
    }
  }
  
  if (checks.requireAnchors && !tldr.anchor) {
    issues.push('No canonical anchor found');
    
    // Suggest anchor based on file
    const baseName = path.basename(filePath, path.extname(filePath));
    const suggestedAnchor = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    suggestions.push(`Consider adding anchor: ##${suggestedAnchor}`);
  }
  
  if (checks.minTags > 0 && tldr.tags.length < checks.minTags) {
    issues.push(`Only ${tldr.tags.length} tags found (minimum: ${checks.minTags})`);
  }
  
  // Quality suggestions
  if (tldr.length > 120) {
    suggestions.push('Consider shortening description (currently ' + tldr.length + ' chars)');
  }
  
  return { issues, suggestions };
}

function generateReport(results) {
  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }
  
  const totalFiles = results.length;
  const filesWithTLDR = results.filter(r => r.tldr).length;
  const missingTLDR = results.filter(r => !r.tldr).length;
  const perfectTLDRs = results.filter(r => r.tldr && r.analysis.issues.length === 0).length;
  
  console.log('📊 TLDR Analysis Report');
  console.log('======================\n');
  
  console.log(`✅ Files with valid tldr: ${perfectTLDRs}`);
  console.log(`📝 Files with tldr (with issues): ${filesWithTLDR - perfectTLDRs}`);
  console.log(`❌ Files missing tldr: ${missingTLDR}`);
  console.log(`📁 Total files analyzed: ${totalFiles}\n`);
  
  // Group by issue type
  const missingFiles = results.filter(r => !r.tldr);
  const filesWithIssues = results.filter(r => r.tldr && r.analysis.issues.length > 0);
  
  if (missingFiles.length > 0) {
    console.log('Missing TLDRs:');
    missingFiles.forEach(r => {
      console.log(`  ${r.file}`);
      if (verbose && r.analysis.suggestions.length > 0) {
        r.analysis.suggestions.forEach(s => {
          console.log(`    💡 ${s}`);
        });
      }
    });
    console.log();
  }
  
  if (filesWithIssues.length > 0) {
    console.log('TLDRs with issues:');
    filesWithIssues.forEach(r => {
      console.log(`  ${r.file}:${r.tldr.line}`);
      if (verbose) {
        console.log(`    ${r.tldr.raw}`);
      }
      r.analysis.issues.forEach(issue => {
        console.log(`    ⚠️  ${issue}`);
      });
      if (verbose && r.analysis.suggestions.length > 0) {
        r.analysis.suggestions.forEach(s => {
          console.log(`    💡 ${s}`);
        });
      }
    });
    console.log();
  }
  
  // Summary statistics
  if (checks.requireTags || checks.requireAnchors) {
    console.log('=== Check Summary ===');
    if (checks.requireTags) {
      const withTags = results.filter(r => r.tldr && r.tldr.tags.length > 0).length;
      console.log(`Files with tags: ${withTags}/${filesWithTLDR}`);
    }
    if (checks.requireAnchors) {
      const withAnchors = results.filter(r => r.tldr && r.tldr.anchor).length;
      console.log(`Files with anchors: ${withAnchors}/${filesWithTLDR}`);
    }
  }
}

async function main() {
  if (!jsonOutput) {
    console.log('🔍 Analyzing TLDR waymarks...\n');
  }
  
  const files = findFiles();
  const results = [];
  
  for (const file of files) {
    try {
      const fullPath = path.join(__dirname, '..', file);
      const content = fs.readFileSync(fullPath, 'utf8');
      const tldr = extractTLDR(content, file);
      const analysis = analyzeTLDR(tldr, file);
      
      results.push({
        file,
        tldr,
        analysis
      });
    } catch (err) {
      // Skip files that can't be read
    }
  }
  
  // Sort results: missing first, then by file path
  results.sort((a, b) => {
    if (!a.tldr && b.tldr) return -1;
    if (a.tldr && !b.tldr) return 1;
    return a.file.localeCompare(b.file);
  });
  
  generateReport(results);
  
  // Exit with error if issues found and in CI mode
  const hasIssues = results.some(r => !r.tldr || r.analysis.issues.length > 0);
  if (hasIssues && process.env.CI) {
    process.exit(1);
  }
}

main().catch(console.error);