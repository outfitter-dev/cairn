// :M: tldr Centralized ignore file management for waymark
import { readFileSync, existsSync } from 'fs';
import { join, relative, dirname } from 'path';
import ignore from 'ignore';
import type { Ignore } from 'ignore';
import { type Result, success, failure } from './result.js';
import { makeError } from './error.js';
import { assert, assertNonNull } from './type-guards.js';

/**
 * Manages ignore patterns from various sources (.gitignore, .waymarkignore, etc.)
 * Follows DRY principle by centralizing all ignore logic
 */
export class IgnoreManager {
  // :M: ctx cache ignore instances by directory
  private static cache = new Map<string, Ignore>();
  
  // :M: ctx default patterns to always ignore
  private static readonly DEFAULT_IGNORES: Readonly<string[]> = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    'coverage',
    '*.log',
    '.DS_Store',
    'thumbs.db'
  ];

  /**
   * Check if a file should be ignored based on all ignore rules
   */
  // :M: api main entry point for ignore checking
  static shouldIgnore(filePath: string): Result<boolean> {
    // :M: ctx validate input
    try {
      assert(filePath, 'File path cannot be empty');
      assert(!filePath.includes('\0'), 'File path cannot contain null bytes');
    } catch (error) {
      return failure(makeError(
        'validation',
        error instanceof Error ? error.message : 'Invalid file path',
        error
      ));
    }

    const dir = dirname(filePath);
    const igResult = this.getIgnoreInstance(dir);
    
    if (!igResult.ok) {
      // :M: ctx if we can't load ignore files, default to not ignoring
      return success(false);
    }

    const projectRoot = this.findProjectRoot(dir);
    let relativePath = relative(projectRoot, filePath);
    
    // :M: ctx normalize path separators to POSIX style for cross-platform compatibility
    // The ignore library expects forward slashes even on Windows
    if (process.platform === 'win32') {
      relativePath = relativePath.replace(/\\/g, '/');
    }
    
    return success(igResult.data.ignores(relativePath));
  }

  /**
   * Get or create ignore instance for a directory
   */
  // :M: api get ignore instance with caching
  private static getIgnoreInstance(dir: string): Result<Ignore> {
    // :M: ctx check cache first
    if (this.cache.has(dir)) {
      const cached = this.cache.get(dir);
      assertNonNull(cached, 'Cached ignore instance should not be null');
      return success(cached);
    }

    const ig = ignore();
    
    // :M: ctx add default ignores
    ig.add([...this.DEFAULT_IGNORES]);
    
    // :M: ctx load .gitignore
    const gitignoreResult = this.loadIgnoreFile(dir, '.gitignore');
    if (gitignoreResult.ok) {
      ig.add(gitignoreResult.data);
    }
    
    // :M: ctx load .waymarkignore (project-specific)
    const waymarkignoreResult = this.loadIgnoreFile(dir, '.waymarkignore');
    if (waymarkignoreResult.ok) {
      ig.add(waymarkignoreResult.data);
    }

    this.cache.set(dir, ig);
    return success(ig);
  }

  /**
   * Load ignore file content
   */
  // :M: api load and validate ignore file
  private static loadIgnoreFile(dir: string, filename: string): Result<string> {
    const filePath = this.findIgnoreFile(dir, filename);
    if (!filePath) {
      return failure(makeError(
        'file.notFound',
        `${filename} not found in directory hierarchy`
      ));
    }

    try {
      const content = readFileSync(filePath, 'utf-8');
      return success(content);
    } catch (error) {
      return failure(makeError(
        'file.readError',
        `Cannot read ${filename} at ${filePath}`,
        error
      ));
    }
  }

  /**
   * Find ignore file by traversing up directory tree
   */
  // :M: api find ignore file in directory hierarchy
  private static findIgnoreFile(startDir: string, filename: string): string | null {
    let currentDir = startDir;
    
    while (currentDir !== dirname(currentDir)) {
      const filePath = join(currentDir, filename);
      if (existsSync(filePath)) {
        return filePath;
      }
      currentDir = dirname(currentDir);
    }
    
    return null;
  }

  /**
   * Find project root (directory containing .git)
   */
  // :M: api find project root directory
  private static findProjectRoot(startDir: string): string {
    let currentDir = startDir;
    
    while (currentDir !== dirname(currentDir)) {
      if (existsSync(join(currentDir, '.git'))) {
        return currentDir;
      }
      currentDir = dirname(currentDir);
    }
    
    // :M: ctx fallback to current directory
    return startDir;
  }

  /**
   * Clear the cache (useful for testing or when files change)
   */
  // :M: api clear ignore cache
  static clearCache(): void {
    this.cache.clear();
  }
}