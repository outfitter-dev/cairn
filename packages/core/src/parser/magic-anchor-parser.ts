// :A: tldr Core parser for Magic Anchor syntax (:A: marker prose)
import type { MagicAnchor, ParseResult, ParseError } from '@grepa/types';
import { type Result, success, failure } from '../lib/result.js';
import { makeError } from '../lib/error.js';
import { parseInputSchema } from '../schemas/index.js';
import { fromZod } from '../lib/zod-adapter.js';

/**
 * Parser for Magic Anchor syntax (`:A: marker prose`).
 * Handles both sync and async parsing with Result pattern support.
 */
export class MagicAnchorParser {
  // :A: api parser configuration constants
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  
  /**
   * Parse content for Magic Anchors using Result pattern.
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

    // :A: ctx check file size limit
    if (content.length > this.MAX_FILE_SIZE) {
      return failure(makeError(
        'file.tooLarge',
        `File exceeds maximum size of ${this.MAX_FILE_SIZE} bytes`
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
    // :A: ctx look for :A: pattern anywhere in the line
    const anchorIndex = line.indexOf(':A:');
    if (anchorIndex === -1) {
      return null;
    }
    
    // :A: ctx extract everything after :A: (including the space)
    const afterAnchor = line.substring(anchorIndex + 3);
    
    // :A: sec validate required space after :A:
    if (!afterAnchor.startsWith(' ')) {
      return {
        error: {
          line: lineNumber,
          column: anchorIndex + 4,
          message: 'Missing required space after :A:',
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
    
    // :A: ctx parse markers and prose from payload
    const { markers, prose } = this.parsePayload(payload);
    
    return {
      anchor: {
        line: lineNumber,
        column: anchorIndex + 1,
        raw: line,
        markers,
        ...(prose ? { prose } : {})
      }
    };
  }
  
  // :A: api extract markers and prose from payload string
  private static parsePayload(payload: string): { markers: string[]; prose?: string } {
    // :A: ctx safer string-based parsing to avoid ReDoS vulnerability
    // :A: ctx find first space that isn't inside parentheses or after a comma
    let parenDepth = 0;
    let spaceIndex = -1;
    
    for (let i = 0; i < payload.length; i++) {
      const char = payload[i];
      if (char === '(') {
        parenDepth++;
      } else if (char === ')') {
        parenDepth--;
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
        markers: this.parseMarkers(markersStr),
        ...(prose ? { prose } : {})
      };
    }
    
    // :A: ctx no prose found, entire payload is markers
    return {
      markers: this.parseMarkers(payload)
    };
  }
  
  // :A: api split comma-separated markers
  private static parseMarkers(markersStr: string): string[] {
    return markersStr
      .split(',')
      .map(marker => marker.trim())
      .filter(marker => marker.length > 0);
  }
  
  // :A: api convenience method to find anchors by marker
  static findByMarker(anchors: MagicAnchor[], marker: string): MagicAnchor[] {
    return anchors.filter(anchor => 
      anchor.markers.some((m: string) => m === marker || m.startsWith(`${marker}(`))
    );
  }
  
  // :A: api convenience method to find anchors by pattern
  static findByPattern(anchors: MagicAnchor[], pattern: RegExp): MagicAnchor[] {
    return anchors.filter(anchor =>
      anchor.markers.some((marker: string) => pattern.test(marker)) ||
      (anchor.prose && pattern.test(anchor.prose))
    );
  }
}