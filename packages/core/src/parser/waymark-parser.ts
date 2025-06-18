// tldr ::: Core parser for waymark syntax (::: marker prose)
import type { Waymark, ParseResult, ParseError } from '@waymark/types';
import { type Result, success, failure } from '../lib/result.js';
import { makeError } from '../lib/error.js';
import { parseInputSchema } from '../schemas/index.js';
import { fromZod } from '../lib/zod-adapter.js';

/**
 * Parser for waymark syntax (`::: marker prose`).
 * Handles both sync and async parsing with Result pattern support.
 */
export class WaymarkParser {
  // ::: api parser configuration constants
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  
  /**
   * Parse content for waymarks using Result pattern.
   * @param content - The text content to parse
   * @param filename - Optional filename for context
   * @returns Result containing parsed anchors or error
   */
  // ::: api main parsing method with Result pattern
  static parseWithResult(content: string, filename?: string): Result<ParseResult> {
    // ::: ctx validate input with Zod
    const inputValidation = parseInputSchema.safeParse({ content, filename });
    if (!inputValidation.success) {
      return failure(fromZod(inputValidation.error));
    }

    // ::: ctx check file size limit using byte length to prevent multi-byte character bypass
    const contentByteLength = Buffer.byteLength(content, 'utf8');
    if (contentByteLength > WaymarkParser.MAX_FILE_SIZE) {
      return failure(makeError(
        'file.tooLarge',
        `File exceeds maximum size of ${Math.round(contentByteLength / 1024 / 1024)}MB (limit: ${Math.round(WaymarkParser.MAX_FILE_SIZE / 1024 / 1024)}MB)`
      ));
    }

    const waymarks: Waymark[] = [];
    const errors: ParseError[] = [];
    const lines = content.split('\n');
    
    lines.forEach((line, lineIndex) => {
      const waymarkMatch = WaymarkParser.findWaymarkInLine(line, lineIndex + 1);
      if (waymarkMatch) {
        if (waymarkMatch.error) {
          errors.push(waymarkMatch.error);
        } else if (waymarkMatch.waymark) {
          if (filename) {
            waymarkMatch.waymark.file = filename;
          }
          waymarks.push(waymarkMatch.waymark);
        }
      }
    });
    
    return success({ waymarks, errors });
  }
  
  
  // ::: api parse single line for waymark content
  private static findWaymarkInLine(line: string, lineNumber: number): {
    waymark?: Waymark;
    error?: ParseError;
  } | null {
    // ::: ctx look for ::: pattern anywhere in the line
    const waymarkIndex = line.indexOf(':::');
    if (waymarkIndex === -1) {
      return null;
    }
    
    // ::: ctx extract everything before ::: to find markers
    const beforeWaymark = line.substring(0, waymarkIndex);
    
    // ::: ctx extract everything after ::: (including the space)
    const afterWaymark = line.substring(waymarkIndex + 3);
    
    // notice ::: validate required space after ::: #security
    if (!afterWaymark.startsWith(' ')) {
      return {
        error: {
          line: lineNumber,
          column: waymarkIndex + 3, // Point to where the space should be
          message: 'Missing required space after :::',
          raw: line
        }
      };
    }
    
    // ::: ctx extract prose (everything after the space)
    const prose = afterWaymark.substring(1).trim();
    
    // ::: ctx extract markers from before the :::
    // Remove comment syntax to get just the content
    const commentContent = beforeWaymark.replace(/^\s*\/\/\s*|\s*<!--\s*|\s*#\s*|\s*\/\*\s*/, '').trim();
    
    if (!commentContent) {
      return {
        error: {
          line: lineNumber,
          column: waymarkIndex,
          message: 'No marker found before :::',
          raw: line
        }
      };
    }
    
    // Parse the comment content as markers
    const contexts = WaymarkParser.parseContexts(commentContent);
    
    return {
      waymark: {
        line: lineNumber,
        column: waymarkIndex + 1,
        raw: line,
        contexts,
        ...(prose ? { prose } : {})
      }
    };
  }
  
  
  // ::: api split comma-separated markers handling nested parentheses
  private static parseContexts(contextsStr: string): string[] {
    const contexts: string[] = [];
    let current = '';
    let parenDepth = 0;
    let bracketDepth = 0;
    
    for (let i = 0; i < contextsStr.length; i++) {
      const char = contextsStr[i];
      
      if (char === '(') {
        parenDepth++;
      } else if (char === ')') {
        if (parenDepth > 0) parenDepth--;
      } else if (char === '[') {
        bracketDepth++;
      } else if (char === ']') {
        if (bracketDepth > 0) bracketDepth--;
      } else if (char === ',' && parenDepth === 0 && bracketDepth === 0) {
        // ::: ctx top-level comma, split here
        const trimmed = current.trim();
        if (trimmed.length > 0) {
          contexts.push(trimmed);
        }
        current = '';
        continue;
      }
      
      current += char;
    }
    
    // ::: ctx add final marker if any
    const trimmed = current.trim();
    if (trimmed.length > 0) {
      contexts.push(trimmed);
    }
    
    return contexts;
  }
  
  // ::: api convenience method to find waymarks by marker
  static findByContext(waymarks: Waymark[], context: string): Waymark[] {
    return waymarks.filter(waymark => 
      waymark.contexts.some((c: string) => c === context || c.startsWith(`${context}(`))
    );
  }
  
  // ::: api convenience method to find waymarks by pattern
  static findByPattern(waymarks: Waymark[], pattern: RegExp): Waymark[] {
    return waymarks.filter(waymark =>
      waymark.contexts.some((context: string) => pattern.test(context)) ||
      (waymark.prose && pattern.test(waymark.prose))
    );
  }
}