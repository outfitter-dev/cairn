// :ga:tldr File system traversal with gitignore support
// :ga:algo File discovery and filtering

import { readdirSync, statSync, readFileSync } from 'fs';
import { join, relative } from 'path';
import { minimatch } from 'minimatch';

// :ga:tldr Find all files matching patterns
// :ga:api File discovery
export function findFiles(
  rootPath: string,
  include: string[] = ['**/*'],
  exclude: string[] = []
): string[] {
  const files: string[] = [];
  
  // :ga:algo Add default exclusions
  const exclusions = [
    ...exclude,
    '**/node_modules/**',
    '**/.git/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**'
  ];
  
  // :ga:algo Recursive directory traversal
  function traverse(dirPath: string): void {
    try {
      const entries = readdirSync(dirPath);
      
      for (const entry of entries) {
        const fullPath = join(dirPath, entry);
        const relativePath = relative(rootPath, fullPath);
        
        // :ga:perf Skip excluded directories early
        if (isExcluded(relativePath, exclusions)) {
          continue;
        }
        
        const stats = statSync(fullPath);
        
        if (stats.isDirectory()) {
          traverse(fullPath);
        } else if (stats.isFile() && isIncluded(relativePath, include)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // :ga:error Skip inaccessible directories
      console.warn(`Cannot access directory: ${dirPath}`);
    }
  }
  
  traverse(rootPath);
  return files;
}

// :ga:tldr Check if file matches include patterns
function isIncluded(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => minimatch(path, pattern));
}

// :ga:tldr Check if file matches exclude patterns
function isExcluded(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => minimatch(path, pattern));
}

// :ga:tldr Read gitignore patterns if present
// :ga:compat Git integration
export function readGitignore(rootPath: string): string[] {
  const gitignorePath = join(rootPath, '.gitignore');
  
  try {
    const content = readFileSync(gitignorePath, 'utf8');
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(pattern => {
        // :ga:algo Convert gitignore to glob patterns
        if (pattern.endsWith('/')) {
          return `**/${pattern}**`;
        }
        return pattern.includes('/') ? pattern : `**/${pattern}`;
      });
  } catch {
    return [];
  }
}