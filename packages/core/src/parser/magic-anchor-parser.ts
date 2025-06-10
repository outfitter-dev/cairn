// :A: tldr Core parser for Cairn syntax (:M: context prose)
import type { MagicAnchor, ParseResult, ParseError } from '@cairn/types';
import { type Result, success, failure } from '../lib/result.js';
import { makeError } from '../lib/error.js';
import { parseInputSchema } from '../schemas/index.js';
import { fromZod } from '../lib/zod-adapter.js';

/**
 * Parser for Cairn syntax (`:M: context prose`).
 * Handles both sync and async parsing with Result pattern support.
 */
export class MagicAnchorParser {
  // :A: api parser configuration constants
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  
  /**
   * Parse content for Cairns using Result pattern.
   * @param content - The text content to parse
   * @param filename - Optional filename for context
   * @returns Result containing parsed anchors or error
   */
  // :A: api main parsing method with Result pattern
  static parseWithResult(content: string, filename?: string): Result<ParseResult> {
    // :A: ctx validate input with Zod
    const inputValidation = parseInputSchema.safeParse({ content, filename });
    if (!inputValidation.success) {
      return failure(fromZod(inputValidation.error));
    }

    // :A: ctx check file size limit using byte length to prevent multi-byte character bypass
    const contentByteLength = Buffer.byteLength(content, 'utf8');
    if (contentByteLength > MagicAnchorParser.MAX_FILE_SIZE) {
      return failure(makeError(
        'file.tooLarge',
        `File exceeds maximum size of ${Math.round(contentByteLength / 1024 / 1024)}MB (limit: ${Math.round(MagicAnchorParser.MAX_FILE_SIZE / 1024 / 1024)}MB)`
      ));
    }

    const anchors: MagicAnchor[] = [];
    const errors: ParseError[] = [];
    const lines = content.split('\n');
    
    lines.forEach((line, lineIndex) => {
      const anchorMatch = this.findAnchorInLine(line, lineIndex + 1);
      if (anchorMatch) {
        if (anchorMatch.error) {
          errors.push(anchorMatch.error);
        } else if (anchorMatch.anchor) {
          if (filename) {
            anchorMatch.anchor.file = filename;
          }
          anchors.push(anchorMatch.anchor);
        }
      }
    });
    
    return success({ anchors, errors });
  }
  
  
  // :A: api parse single line for anchor content
  private static findAnchorInLine(line: string, lineNumber: number): {
    anchor?: MagicAnchor;
    error?: ParseError;
  } | null {
    // :A: ctx look for :M: pattern anywhere in the line
    const anchorIndex = line.indexOf(':M:');
    if (anchorIndex === -1) {
      return null;
    }
    
    // :A: ctx extract everything after :M: (including the space)
    const afterAnchor = line.substring(anchorIndex + 3);
    
    // :A: sec validate required space after :M:
    if (!afterAnchor.startsWith(' ')) {
      return {
        error: {
          line: lineNumber,
          column: anchorIndex + 3, // Point to where the space should be
          message: 'Missing required space after :M:',
          raw: line
        }
      };
    }
    
    // :A: ctx extract payload (everything after the space)
    const payload = afterAnchor.substring(1).trim();
    if (!payload) {
      return {
        error: {
          line: lineNumber,
          column: anchorIndex + 4,
          message: 'Empty anchor payload',
          raw: line
        }
      };
    }
    
    // :A: ctx parse contexts and prose from payload
    const { contexts, prose } = this.parsePayload(payload);
    
    return {
      anchor: {
        line: lineNumber,
        column: anchorIndex + 1,
        raw: line,
        contexts,
        ...(prose ? { prose } : {})
      }
    };
  }
  
  // :A: api extract contexts and prose from payload string
  private static parsePayload(payload: string): { contexts: string[]; prose?: string } {
    // :A: ctx safer string-based parsing to avoid ReDoS vulnerability
    // :A: ctx find first space that isn't inside parentheses or after a comma
    let parenDepth = 0;
    let spaceIndex = -1;
    
    for (let i = 0; i < payload.length; i++) {
      const char = payload[i];
      if (char === '(') {
        parenDepth++;
      } else if (char === ')') {
        if (parenDepth > 0) parenDepth--; // Prevent negative depth on unmatched parentheses
      } else if (char === ' ' && parenDepth === 0) {
        // :A: ctx check if this space is after a comma (still in marker list)
        let j = i - 1;
        while (j >= 0 && payload[j] === ' ') {
          j--;
        }
        
        if (j >= 0 && payload[j] === ',') {
          // :A: ctx space after comma, still in marker list
          continue;
        }
        
        // :A: ctx check if the next non-space character could be a marker
        let k = i + 1;
        while (k < payload.length && payload[k] === ' ') {
          k++;
        }
        
        if (k < payload.length) {
          // :A: ctx simple heuristic: if next word contains only marker-like characters, skip
          const nextChar = payload[k];
          if (nextChar && /^[a-zA-Z0-9_@-]$/.test(nextChar)) {
            // :A: ctx might still be in markers, look for a better separator
            const restOfLine = payload.substring(k);
            // :A: ctx if we find a comma soon, we're still in markers
            const commaIndex = restOfLine.indexOf(',');
            const nextSpaceIndex = restOfLine.indexOf(' ');
            
            if (commaIndex !== -1 && (nextSpaceIndex === -1 || commaIndex < nextSpaceIndex)) {
              continue;
            }
          }
        }
        
        // :A: ctx this looks like a real separator between markers and prose
        spaceIndex = i;
        break;
      }
    }
    
    if (spaceIndex > 0) {
      // :A: ctx split at the separator
      const markersStr = payload.substring(0, spaceIndex);
      const prose = payload.substring(spaceIndex + 1).trim();
      
      return {
        contexts: MagicAnchorParser.parseContexts(markersStr),
        ...(prose ? { prose } : {})
      };
    }
    
    // :A: ctx no prose found, entire payload is contexts
    return {
      contexts: MagicAnchorParser.parseContexts(payload)
    };
  }
  
  // :A: api split comma-separated contexts
  private static parseContexts(contextsStr: string): string[] {
    return contextsStr
      .split(',')
      .map(context => context.trim())
      .filter(context => context.length > 0);
  }
  
  // :A: api convenience method to find anchors by context
  static findByContext(anchors: MagicAnchor[], context: string): MagicAnchor[] {
    return anchors.filter(anchor => 
      anchor.contexts.some((c: string) => c === context || c.startsWith(`${context}(`))
    );
  }
  
  // :A: api convenience method to find anchors by pattern
  static findByPattern(anchors: MagicAnchor[], pattern: RegExp): MagicAnchor[] {
    return anchors.filter(anchor =>
      anchor.contexts.some((context: string) => pattern.test(context)) ||
      (anchor.prose && pattern.test(anchor.prose))
    );
  }
}