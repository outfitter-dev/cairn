// :M: tldr Type definitions for Cairn parsing and processing

export interface Cairn {
  // :M: api core anchor properties
  line: number;
  column: number;
  raw: string;
  contexts: string[];
  prose?: string;
  file?: string;
}

// :M: deprecated Backward compatibility alias
export type MagicAnchor = Cairn;

export interface ParseResult {
  // :M: api parser output structure
  anchors: Cairn[];
  errors: ParseError[];
}

export interface ParseError {
  // :M: api parsing error information
  line: number;
  column: number;
  message: string;
  raw: string;
}

export interface SearchOptions {
  // :M: api search configuration
  contexts?: string[];
  files?: string[];
  exclude?: string[];
  context?: number;
  recursive?: boolean;
  respectGitignore?: boolean;
}

export interface SearchResult {
  // :M: api search result structure
  anchor: MagicAnchor;
  context?: {
    before: string[];
    after: string[];
  };
}