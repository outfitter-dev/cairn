// :M: tldr Search functionality for Cairns across files
import { readFile, stat } from 'fs/promises';
import { createReadStream } from 'fs';
import { extname } from 'path';
import { CairnParser } from '../parser/cairn-parser.js';
import type { MagicAnchor, SearchOptions, SearchResult } from '@cairn/types';
import { type Result, success, failure, tryAsync } from '../lib/result.js';
import { type AppError, makeError } from '../lib/error.js';
import { searchOptionsSchema } from '../schemas/index.js';
import { fromZod } from '../lib/zod-adapter.js';
import { globby } from 'globby';
import * as readline from 'readline';

/**
 * Search functionality for finding Cairns across files.
 * All operations are async for better performance and scalability.
 */
export class CairnSearch {
  // :M: api search configuration constants
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
  // :M: api main search method
  static async search(
    patterns: string[],
    options: SearchOptions = {}
  ): Promise<Result<SearchResult[]>> {
    // :M: ctx validate search options
    const optionsValidation = searchOptionsSchema.safeParse(options);
    if (!optionsValidation.success) {
      return failure(fromZod(optionsValidation.error));
    }

    // :M: ctx validate patterns
    if (patterns.length === 0) {
      return failure(makeError(
        'cli.missingArgument',
        'At least one file pattern is required'
      ));
    }

    // :M: ctx resolve files with error handling
    const filesResult = await CairnSearch.resolveFiles(patterns, options);
    if (!filesResult.ok) {
      return filesResult;
    }

    const results: SearchResult[] = [];
    const errors: AppError[] = [];

    // :M: ctx process each file concurrently for better performance
    const filePromises = filesResult.data.map(file => 
      CairnSearch.processFile(file, options)
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

    // :M: ctx check if we found any results
    if (results.length === 0 && errors.length === 0) {
      return failure(makeError(
        'search.noResults',
        'No Cairns found matching the search criteria'
      ));
    }

    // :M: ctx check for too many results
    if (results.length > CairnSearch.MAX_RESULTS) {
      return failure(makeError(
        'search.tooManyResults',
        `Found ${results.length} results, exceeding limit of ${CairnSearch.MAX_RESULTS}`
      ));
    }

    return success(results);
  }

  // :M: api resolve file patterns to actual file paths using glob
  private static async resolveFiles(
    patterns: string[],
    options: SearchOptions
  ): Promise<Result<string[]>> {
    try {
      // :M: ctx use globby for proper glob pattern support
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

      // :M: ctx filter by extensions (case-insensitive to handle .TS, .Js, etc.)
      const filteredFiles = files.filter(file => {
        const ext = extname(file).toLowerCase();
        return CairnSearch.DEFAULT_EXTENSIONS.includes(ext);
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

  // :M: api process single file with error handling
  private static async processFile(
    file: string,
    options: SearchOptions
  ): Promise<Result<SearchResult[]>> {
    // :M: ctx check file size first
    const statResult = await tryAsync(
      () => stat(file),
      'file.readError'
    );

    if (!statResult.ok) {
      return statResult;
    }

    // :M: perf handle large files with streaming
    if (statResult.data.size > CairnSearch.MAX_FILE_SIZE) {
      return CairnSearch.processLargeFile(file, options);
    }

    // :M: ctx read file content
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

    // :M: ctx parse file content
    const parseResult = CairnParser.parseWithResult(
      contentResult.data,
      file
    );

    if (!parseResult.ok) {
      return parseResult;
    }

    // :M: ctx filter anchors based on search criteria
    const results: SearchResult[] = [];
    for (const anchor of parseResult.data.anchors) {
      if (CairnSearch.matchesSearch(anchor, options)) {
        const result: SearchResult = {
          anchor,
          ...(options.context && options.context > 0
            ? { context: CairnSearch.getContext(contentResult.data, anchor.line, options.context) }
            : {})
        };
        results.push(result);
      }
    }

    return success(results);
  }

  // :M: api check if anchor matches search criteria
  private static matchesSearch(anchor: MagicAnchor, options: SearchOptions): boolean {
    if (!options.contexts || options.contexts.length === 0) {
      return true;
    }

    return options.contexts.some((context: string) => 
      anchor.contexts.some((anchorContext: string) => 
        anchorContext === context || anchorContext.startsWith(`${context}(`)
      )
    );
  }

  // :M: api get context lines around an anchor
  private static getContext(content: string, lineNumber: number, contextLines: number): {
    before: string[];
    after: string[];
  } {
    const lines = content.split('\n');
    const before: string[] = [];
    const after: string[] = [];

    // :M: ctx get lines before (1-indexed to 0-indexed)
    for (let i = Math.max(0, lineNumber - contextLines - 1); i < lineNumber - 1; i++) {
      before.push(lines[i] || '');
    }

    // :M: ctx get lines after
    for (let i = lineNumber; i < Math.min(lines.length, lineNumber + contextLines); i++) {
      after.push(lines[i] || '');
    }

    return { before, after };
  }

  // :M: api get all unique contexts from search results
  static getUniqueContexts(results: SearchResult[]): string[] {
    const contexts = new Set<string>();
    results.forEach(result => {
      result.anchor.contexts.forEach(context => contexts.add(context));
    });
    return Array.from(contexts).sort();
  }

  // :M: api group results by context
  static groupByContext(results: SearchResult[]): Record<string, SearchResult[]> {
    const grouped: Record<string, SearchResult[]> = {};
    
    results.forEach(result => {
      result.anchor.contexts.forEach(context => {
        if (!grouped[context]) {
          grouped[context] = [];
        }
        grouped[context].push(result);
      });
    });

    return grouped;
  }

  // :M: api group results by file
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

  // :M: api process large files using streaming to avoid memory issues
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
        
        // :M: ctx maintain context buffer for surrounding lines
        if (contextSize > 0) {
          contextBuffer.push(line);
          if (contextBuffer.length > contextSize * 2 + 1) {
            contextBuffer.shift();
          }
        }

        // :M: ctx check for anchor in current line
        const anchorMatch = line.indexOf(':M:');
        if (anchorMatch !== -1) {
          // :M: ctx parse the line for a valid anchor
          const afterAnchor = line.substring(anchorMatch + 3);
          
          if (afterAnchor.startsWith(' ')) {
            const payload = afterAnchor.substring(1).trim();
            if (payload) {
              const { contexts, prose } = CairnSearch.parsePayloadSimple(payload);
              
              const anchor: MagicAnchor = {
                line: lineNumber,
                column: anchorMatch + 1,
                raw: line,
                contexts,
                file,
                ...(prose ? { prose } : {})
              };

              if (CairnSearch.matchesSearch(anchor, options)) {
                const result: SearchResult = {
                  anchor,
                  ...(contextSize > 0
                    ? { context: CairnSearch.getContextFromBuffer(contextBuffer, lineNumber, contextSize) }
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

  // :M: api simple payload parser for streaming (avoids full parser overhead)
  private static parsePayloadSimple(payload: string): { contexts: string[]; prose?: string } {
    // :M: ctx find first space not in parentheses for context/prose split
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
      const contextsStr = payload.substring(0, spaceIndex);
      const prose = payload.substring(spaceIndex + 1).trim();
      return {
        contexts: contextsStr.split(',').map(c => c.trim()).filter(c => c),
        ...(prose ? { prose } : {})
      };
    }
    
    return {
      contexts: payload.split(',').map(c => c.trim()).filter(c => c)
    };
  }

  // :M: api get context from buffer for streaming
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