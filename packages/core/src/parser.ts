// :ga:tldr Parse grep-anchors from text content
// :ga:parse Core parsing implementation

import type { Anchor, Token, ParseOptions } from './types';

// :ga:parse Regex for finding anchors in text
const DEFAULT_ANCHOR = ':ga:';
const ANCHOR_REGEX = (anchor: string) => 
  new RegExp(`${escapeRegex(anchor)}(.+?)(?=\\n|$)`, 'gm');

// :ga:parse Token separator patterns
const SEPARATOR_REGEX = /[,\s|]+/;

// :ga:parse Patterns for different token types
const JSON_REGEX = /^\{.*\}$/;
const ARRAY_REGEX = /^\[.*\]$/;
const BARE_TOKEN_REGEX = /^@?[A-Za-z0-9_.-]+$/;

// :ga:tldr Parse anchors from text content
// :ga:api Main parsing function
export function parseAnchors(
  content: string,
  filePath: string,
  options: ParseOptions = {}
): Anchor[] {
  const anchor = options.anchor || DEFAULT_ANCHOR;
  const regex = ANCHOR_REGEX(anchor);
  const anchors: Anchor[] = [];
  
  const lines = content.split('\n');
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const raw = match[0];
    const payload = match[1]?.trim() || '';
    
    // :ga:algo Find line number
    const position = match.index;
    const lineNumber = content.substring(0, position).split('\n').length;
    
    // :ga:algo Extract comment if requested
    let comment: string | undefined;
    if (options.includeComment && lineNumber > 0 && lineNumber <= lines.length) {
      const line = lines[lineNumber - 1];
      if (line) {
        const anchorEnd = line.indexOf(anchor) + raw.length;
        comment = line.substring(anchorEnd).trim();
      }
    }
    
    anchors.push({
      raw,
      tokens: parseTokens(payload),
      line: lineNumber,
      file: filePath,
      comment
    });
  }
  
  return anchors;
}

// :ga:tldr Parse payload string into tokens
// :ga:parse Token extraction logic
export function parseTokens(payload: string): Token[] {
  const tokens: Token[] = [];
  
  // :ga:algo Handle JSON object
  if (JSON_REGEX.test(payload)) {
    try {
      const value = JSON.parse(payload);
      tokens.push({ type: 'json', value });
      return tokens;
    } catch {
      // :ga:error Fall through to regular parsing
    }
  }
  
  // :ga:algo Handle array
  if (ARRAY_REGEX.test(payload)) {
    try {
      const value = JSON.parse(payload);
      if (Array.isArray(value)) {
        tokens.push({ type: 'array', value });
        return tokens;
      }
    } catch {
      // :ga:error Fall through to regular parsing
    }
  }
  
  // :ga:algo Split by separators and parse each token
  const parts = payload.split(SEPARATOR_REGEX).filter(Boolean);
  
  for (const part of parts) {
    if (BARE_TOKEN_REGEX.test(part)) {
      tokens.push({ type: 'bare', value: part });
    }
  }
  
  return tokens;
}

// :ga:tldr Escape special regex characters
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}