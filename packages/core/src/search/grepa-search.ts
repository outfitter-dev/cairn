// :A: tldr Search functionality for Magic Anchors across files
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { MagicAnchorParser } from '../parser/magic-anchor-parser.js';
import { IgnoreManager } from '../lib/ignore-manager.js';
import type { MagicAnchor, SearchOptions, SearchResult } from '@grepa/types';
import { type Result, success, failure, tryAsync } from '../lib/result.js';
import { type AppError, makeError } from '../lib/error.js';
import { searchOptionsSchema } from '../schemas/index.js';
import { fromZod } from '../lib/zod-adapter.js';

/**
 * Search functionality for finding Magic Anchors across files.
 * Supports both sync and async operations with Result pattern.
 */
export class GrepaSearch {
  // :A: api supported file extensions for searching
  private static readonly DEFAULT_EXTENSIONS = ['.ts', '.js', '.jsx', '.tsx', '.md', '.txt', '.py', '.java', '.c', '.cpp', '.h'];
  private static readonly MAX_RESULTS = 1000;
  // private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  /**
   * Search files for Magic Anchors using Result pattern.
   * @param patterns - File patterns to search (supports glob)
   * @param options - Search options for filtering
   * @returns Promise<Result> containing search results or error
   */
  // :A: api search for anchors with Result pattern
  static async searchWithResult(
    patterns: string[],
    options: SearchOptions = {}
  ): Promise<Result<SearchResult[]>> {
    // :A: ctx validate search options
    const optionsValidation = searchOptionsSchema.safeParse(options);
    if (!optionsValidation.success) {
      return failure(fromZod(optionsValidation.error));
    }

    // :A: ctx validate patterns
    if (patterns.length === 0) {
      return failure(makeError(
        'cli.missingArgument',
        'At least one file pattern is required'
      ));
    }

    // :A: ctx resolve files with error handling
    const filesResult = await this.resolveFilesWithResult(patterns, options);
    if (!filesResult.ok) {
      return filesResult;
    }

    const results: SearchResult[] = [];
    const errors: AppError[] = [];

    // :A: ctx process each file
    for (const file of filesResult.data) {
      const fileResult = await this.processFileWithResult(file, options);
      if (fileResult.ok) {
        results.push(...fileResult.data);
      } else {
        errors.push(fileResult.error);
      }
    }

    // :A: ctx check if we found any results
    if (results.length === 0 && errors.length === 0) {
      return failure(makeError(
        'search.noResults',
        'No Magic Anchors found matching the search criteria'
      ));
    }

    // :A: ctx check for too many results
    if (results.length > this.MAX_RESULTS) {
      return failure(makeError(
        'search.tooManyResults',
        `Found ${results.length} results, exceeding limit of ${this.MAX_RESULTS}`
      ));
    }

    return success(results);
  }

  /**
   * Search files for Magic Anchors (legacy sync method).
   * @param patterns - File patterns to search
   * @param options - Search options for filtering
   * @returns Array of search results
   */
  // :A: api legacy search method for backward compatibility
  static search(patterns: string[], options: SearchOptions = {}): SearchResult[] {
    const files = this.resolveFiles(patterns, options);
    const results: SearchResult[] = [];

    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf-8');
        const parseResult = MagicAnchorParser.parse(content, file);
        
        for (const anchor of parseResult.anchors) {
          if (this.matchesSearch(anchor, options)) {
            const result: SearchResult = {
              anchor,
              ...(options.context ? { context: this.getContext(content, anchor.line, options.context) } : {})
            };
            results.push(result);
          }
        }
      } catch (error) {
        // :A: ctx silently skip unreadable files
        continue;
      }
    }

    return results;
  }

  // :A: api resolve file patterns to actual file paths
  private static resolveFiles(patterns: string[], options: SearchOptions): string[] {
    const files = new Set<string>();

    for (const pattern of patterns) {
      if (pattern.includes('*')) {
        // :A: todo implement proper glob matching
        // :A: ctx for now, just treat as directory
        const baseDir = pattern.replace(/\/\*\*?.*$/, '') || '.';
        this.findFiles(baseDir, files, options.recursive !== false);
      } else {
        // :A: ctx direct file path
        try {
          const stat = statSync(pattern);
          if (stat.isFile()) {
            files.add(pattern);
          } else if (stat.isDirectory()) {
            this.findFiles(pattern, files, options.recursive !== false);
          }
        } catch {
          // :A: ctx file doesn't exist, skip
        }
      }
    }

    return Array.from(files).filter(file => this.shouldIncludeFile(file, options));
  }

  // :A: api recursively find files in directory
  private static findFiles(dir: string, files: Set<string>, recursive: boolean): void {
    try {
      const entries = readdirSync(dir);
      
      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);
        
        if (stat.isFile()) {
          if (this.DEFAULT_EXTENSIONS.includes(extname(entry))) {
            files.add(fullPath);
          }
        } else if (stat.isDirectory() && recursive && !entry.startsWith('.') && entry !== 'node_modules') {
          this.findFiles(fullPath, files, recursive);
        }
      }
    } catch {
      // :A: ctx can't read directory, skip
    }
  }

  // :A: api check if file should be included based on options
  private static shouldIncludeFile(file: string, options: SearchOptions): boolean {
    // :A: ctx check gitignore first if enabled
    if (options.respectGitignore !== false) {
      const ignoreResult = IgnoreManager.shouldIgnore(file);
      // :A: ctx if we can't determine ignore status, include the file
      if (!ignoreResult.ok || ignoreResult.data) {
        return false;
      }
    }

    if (options.files && options.files.length > 0) {
      return options.files.some((pattern: string) => file.includes(pattern));
    }

    if (options.exclude && options.exclude.length > 0) {
      return !options.exclude.some((pattern: string) => file.includes(pattern));
    }

    return true;
  }

  // :A: api check if anchor matches search criteria
  private static matchesSearch(anchor: MagicAnchor, options: SearchOptions): boolean {
    if (!options.markers || options.markers.length === 0) {
      return true;
    }

    return options.markers.some((marker: string) => 
      anchor.markers.some((anchorMarker: string) => 
        anchorMarker === marker || anchorMarker.startsWith(`${marker}(`)
      )
    );
  }

  // :A: api get context lines around an anchor
  private static getContext(content: string, lineNumber: number, contextLines: number): {
    before: string[];
    after: string[];
  } {
    const lines = content.split('\n');
    const before: string[] = [];
    const after: string[] = [];

    // :A: ctx get lines before (1-indexed to 0-indexed)
    for (let i = Math.max(0, lineNumber - contextLines - 1); i < lineNumber - 1; i++) {
      before.push(lines[i] || '');
    }

    // :A: ctx get lines after
    for (let i = lineNumber; i < Math.min(lines.length, lineNumber + contextLines); i++) {
      after.push(lines[i] || '');
    }

    return { before, after };
  }

  // :A: api resolve file patterns with error handling
  private static async resolveFilesWithResult(
    patterns: string[],
    options: SearchOptions
  ): Promise<Result<string[]>> {
    const files = new Set<string>();

    for (const pattern of patterns) {
      if (pattern.includes('*')) {
        const baseDir = pattern.replace(/\/\*\*?.*$/, '') || '.';
        const dirResult = await this.findFilesWithResult(
          baseDir,
          files,
          options.recursive !== false
        );
        if (!dirResult.ok) {
          return dirResult;
        }
      } else {
        // :A: ctx validate file path
        const statResult = await tryAsync(
          () => Promise.resolve(statSync(pattern)),
          'file.notFound'
        );
        
        if (!statResult.ok) {
          return failure(makeError(
            'file.notFound',
            `File or directory not found: ${pattern}`
          ));
        }

        const stat = statResult.data;
        if (stat.isFile()) {
          files.add(pattern);
        } else if (stat.isDirectory()) {
          const dirResult = await this.findFilesWithResult(
            pattern,
            files,
            options.recursive !== false
          );
          if (!dirResult.ok) {
            return dirResult;
          }
        }
      }
    }

    const fileArray = Array.from(files).filter(file => 
      this.shouldIncludeFile(file, options)
    );

    if (fileArray.length === 0) {
      return failure(makeError(
        'search.noResults',  
        'No files found matching the specified patterns'
      ));
    }

    return success(fileArray);
  }

  // :A: api find files in directory with error handling
  private static async findFilesWithResult(
    dir: string,
    files: Set<string>,
    recursive: boolean
  ): Promise<Result<void>> {
    const readResult = await tryAsync(
      () => Promise.resolve(readdirSync(dir)),
      'file.readError'
    );

    if (!readResult.ok) {
      return failure(makeError(
        'file.accessDenied',
        `Cannot read directory: ${dir}`,
        readResult.error
      ));
    }

    for (const entry of readResult.data) {
      const fullPath = join(dir, entry);
      const statResult = await tryAsync(
        () => Promise.resolve(statSync(fullPath)),
        'file.readError'
      );

      if (statResult.ok) {
        const stat = statResult.data;
        if (stat.isFile() && this.isSupportedFile(entry)) {
          files.add(fullPath);
        } else if (
          stat.isDirectory() &&
          recursive &&
          !entry.startsWith('.') &&
          entry !== 'node_modules'
        ) {
          await this.findFilesWithResult(fullPath, files, recursive);
        }
      }
    }

    return success(undefined);
  }

  // :A: api check if file type is supported
  private static isSupportedFile(filename: string): boolean {
    const supportedExtensions = [
      '.ts', '.js', '.jsx', '.tsx', '.md', '.txt',
      '.py', '.java', '.c', '.cpp', '.h', '.go',
      '.rs', '.rb', '.php', '.swift', '.kt', '.scala'
    ];
    return supportedExtensions.includes(extname(filename));
  }

  // :A: api process single file with error handling
  private static async processFileWithResult(
    file: string,
    options: SearchOptions
  ): Promise<Result<SearchResult[]>> {
    // :A: ctx read file content
    const contentResult = await tryAsync(
      () => Promise.resolve(readFileSync(file, 'utf-8')),
      'file.readError'
    );

    if (!contentResult.ok) {
      return failure(makeError(
        'file.readError',
        `Cannot read file: ${file}`,
        contentResult.error
      ));
    }

    // :A: ctx parse file content
    const parseResult = MagicAnchorParser.parseWithResult(
      contentResult.data,
      file
    );

    if (!parseResult.ok) {
      return parseResult;
    }

    // :A: ctx filter anchors based on search criteria
    const results: SearchResult[] = [];
    for (const anchor of parseResult.data.anchors) {
      if (this.matchesSearch(anchor, options)) {
        const result: SearchResult = {
          anchor,
          ...(options.context && options.context > 0
            ? { context: this.getContext(contentResult.data, anchor.line, options.context) }
            : {})
        };
        results.push(result);
      }
    }

    return success(results);
  }

  // :A: api get all unique markers from search results
  static getUniqueMarkers(results: SearchResult[]): string[] {
    const markers = new Set<string>();
    results.forEach(result => {
      result.anchor.markers.forEach((marker: string) => markers.add(marker));
    });
    return Array.from(markers).sort();
  }

  // :A: api group results by marker
  static groupByMarker(results: SearchResult[]): Record<string, SearchResult[]> {
    const grouped: Record<string, SearchResult[]> = {};
    
    results.forEach(result => {
      result.anchor.markers.forEach((marker: string) => {
        if (!grouped[marker]) {
          grouped[marker] = [];
        }
        grouped[marker].push(result);
      });
    });

    return grouped;
  }

  // :A: api group results by file
  static groupByFile(results: SearchResult[]): Record<string, SearchResult[]> {
    const grouped: Record<string, SearchResult[]> = {};
    
    results.forEach(result => {
      const file = result.anchor.file || 'unknown';
      if (!grouped[file]) {
        grouped[file] = [];
      }
      grouped[file].push(result);
    });

    return grouped;
  }
}