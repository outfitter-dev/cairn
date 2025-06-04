// :A: tldr Search functionality for Magic Anchors across files
import { readFile, stat } from 'fs/promises';
import { createReadStream } from 'fs';
import { extname } from 'path';
import { MagicAnchorParser } from '../parser/magic-anchor-parser.js';
import type { MagicAnchor, SearchOptions, SearchResult } from '@grepa/types';
import { type Result, success, failure, tryAsync } from '../lib/result.js';
import { type AppError, makeError } from '../lib/error.js';
import { searchOptionsSchema } from '../schemas/index.js';
import { fromZod } from '../lib/zod-adapter.js';
import { globby } from 'globby';
import * as readline from 'readline';

/**
 * Search functionality for finding Magic Anchors across files.
 * All operations are async for better performance and scalability.
 */
export class GrepaSearch {
  // :A: api search configuration constants
  private static readonly DEFAULT_EXTENSIONS = [
    '.ts', '.js', '.jsx', '.tsx', '.md', '.txt',
    '.py', '.java', '.c', '.cpp', '.h', '.go',
    '.rs', '.rb', '.php', '.swift', '.kt', '.scala'
  ];
  private static readonly MAX_RESULTS = 10000;
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  /**
   * Search files for Magic Anchors.
   * @param patterns - File patterns to search (supports glob)
   * @param options - Search options for filtering
   * @returns Promise<Result> containing search results or error
   */
  // :A: api main search method
  static async search(
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
    const filesResult = await GrepaSearch.resolveFiles(patterns, options);
    if (!filesResult.ok) {
      return filesResult;
    }

    const results: SearchResult[] = [];
    const errors: AppError[] = [];

    // :A: ctx process each file concurrently for better performance
    const filePromises = filesResult.data.map(file => 
      GrepaSearch.processFile(file, options)
    );

    const fileResults = await Promise.allSettled(filePromises);

    for (const result of fileResults) {
      if (result.status === 'fulfilled') {
        if (result.value.ok) {
          results.push(...result.value.data);
        } else {
          errors.push(result.value.error);
        }
      } else {
        errors.push(makeError(
          'file.readError',
          `Failed to process file: ${result.reason}`
        ));
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
    if (results.length > GrepaSearch.MAX_RESULTS) {
      return failure(makeError(
        'search.tooManyResults',
        `Found ${results.length} results, exceeding limit of ${GrepaSearch.MAX_RESULTS}`
      ));
    }

    return success(results);
  }

  // :A: api resolve file patterns to actual file paths using glob
  private static async resolveFiles(
    patterns: string[],
    options: SearchOptions
  ): Promise<Result<string[]>> {
    try {
      // :A: ctx use globby for proper glob pattern support
      const globOptions = {
        absolute: true,
        onlyFiles: true,
        dot: false,
        gitignore: options.respectGitignore !== false,
        ignore: [
          '**/node_modules/**',
          '**/.git/**',
          ...(options.exclude || [])
        ]
      };

      const files = await globby(patterns, globOptions);

      // :A: ctx filter by extensions
      const filteredFiles = files.filter(file => {
        const ext = extname(file);
        return GrepaSearch.DEFAULT_EXTENSIONS.includes(ext);
      });

      if (filteredFiles.length === 0) {
        return failure(makeError(
          'search.noResults',
          'No files found matching the specified patterns'
        ));
      }

      return success(filteredFiles);
    } catch (error) {
      return failure(makeError(
        'search.invalidPattern',
        `Invalid file pattern: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      ));
    }
  }

  // :A: api process single file with error handling
  private static async processFile(
    file: string,
    options: SearchOptions
  ): Promise<Result<SearchResult[]>> {
    // :A: ctx check file size first
    const statResult = await tryAsync(
      () => stat(file),
      'file.readError'
    );

    if (!statResult.ok) {
      return statResult;
    }

    // :A: perf handle large files with streaming
    if (statResult.data.size > GrepaSearch.MAX_FILE_SIZE) {
      return GrepaSearch.processLargeFile(file, options);
    }

    // :A: ctx read file content
    const contentResult = await tryAsync(
      () => readFile(file, 'utf-8'),
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
      if (GrepaSearch.matchesSearch(anchor, options)) {
        const result: SearchResult = {
          anchor,
          ...(options.context && options.context > 0
            ? { context: GrepaSearch.getContext(contentResult.data, anchor.line, options.context) }
            : {})
        };
        results.push(result);
      }
    }

    return success(results);
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

  // :A: api get all unique markers from search results
  static getUniqueMarkers(results: SearchResult[]): string[] {
    const markers = new Set<string>();
    results.forEach(result => {
      result.anchor.markers.forEach(marker => markers.add(marker));
    });
    return Array.from(markers).sort();
  }

  // :A: api group results by marker
  static groupByMarker(results: SearchResult[]): Record<string, SearchResult[]> {
    const grouped: Record<string, SearchResult[]> = {};
    
    results.forEach(result => {
      result.anchor.markers.forEach(marker => {
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

  // :A: api process large files using streaming to avoid memory issues
  private static async processLargeFile(
    file: string,
    options: SearchOptions
  ): Promise<Result<SearchResult[]>> {
    return new Promise((resolve) => {
      const results: SearchResult[] = [];
      const stream = createReadStream(file, { encoding: 'utf-8' });
      const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
      });

      let lineNumber = 0;
      let contextBuffer: string[] = [];
      const contextSize = options.context || 0;

      rl.on('line', (line) => {
        lineNumber++;
        
        // :A: ctx maintain context buffer for surrounding lines
        if (contextSize > 0) {
          contextBuffer.push(line);
          if (contextBuffer.length > contextSize * 2 + 1) {
            contextBuffer.shift();
          }
        }

        // :A: ctx check for anchor in current line
        const anchorMatch = line.indexOf(':A:');
        if (anchorMatch !== -1) {
          // :A: ctx parse the line for a valid anchor
          const afterAnchor = line.substring(anchorMatch + 3);
          
          if (afterAnchor.startsWith(' ')) {
            const payload = afterAnchor.substring(1).trim();
            if (payload) {
              const { markers, prose } = GrepaSearch.parsePayloadSimple(payload);
              
              const anchor: MagicAnchor = {
                line: lineNumber,
                column: anchorMatch + 1,
                raw: line,
                markers,
                file,
                ...(prose ? { prose } : {})
              };

              if (GrepaSearch.matchesSearch(anchor, options)) {
                const result: SearchResult = {
                  anchor,
                  ...(contextSize > 0
                    ? { context: GrepaSearch.getContextFromBuffer(contextBuffer, lineNumber, contextSize) }
                    : {})
                };
                results.push(result);
              }
            }
          }
        }
      });

      rl.on('close', () => {
        if (results.length === 0) {
          resolve(success([]));
        } else {
          resolve(success(results));
        }
      });

      rl.on('error', (error) => {
        resolve(failure(makeError(
          'file.readError',
          `Error reading large file ${file}: ${error.message}`,
          error
        )));
      });
    });
  }

  // :A: api simple payload parser for streaming (avoids full parser overhead)
  private static parsePayloadSimple(payload: string): { markers: string[]; prose?: string } {
    // :A: ctx find first space not in parentheses for marker/prose split
    let parenDepth = 0;
    let spaceIndex = -1;
    
    for (let i = 0; i < payload.length; i++) {
      const char = payload[i];
      if (char === '(') parenDepth++;
      else if (char === ')') parenDepth--;
      else if (char === ' ' && parenDepth === 0) {
        // Check if this might be prose separator
        const beforeSpace = payload.substring(0, i);
        if (!beforeSpace.endsWith(',')) {
          spaceIndex = i;
          break;
        }
      }
    }
    
    if (spaceIndex > 0) {
      const markersStr = payload.substring(0, spaceIndex);
      const prose = payload.substring(spaceIndex + 1).trim();
      return {
        markers: markersStr.split(',').map(m => m.trim()).filter(m => m),
        ...(prose ? { prose } : {})
      };
    }
    
    return {
      markers: payload.split(',').map(m => m.trim()).filter(m => m)
    };
  }

  // :A: api get context from buffer for streaming
  private static getContextFromBuffer(
    buffer: string[],
    _currentLine: number,
    contextSize: number
  ): { before: string[]; after: string[] } {
    const bufferMiddle = Math.floor(buffer.length / 2);
    const before = buffer.slice(Math.max(0, bufferMiddle - contextSize), bufferMiddle);
    const after = buffer.slice(bufferMiddle + 1, Math.min(buffer.length, bufferMiddle + contextSize + 1));
    
    return { before, after };
  }
}