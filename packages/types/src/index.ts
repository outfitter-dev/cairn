// :A: tldr Type definitions for Magic Anchor parsing and processing

export interface MagicAnchor {
  // :A: api core anchor properties
  line: number;
  column: number;
  raw: string;
  markers: string[];
  prose?: string;
  file?: string;
}

export interface ParseResult {
  // :A: api parser output structure
  anchors: MagicAnchor[];
  errors: ParseError[];
}

export interface ParseError {
  // :A: api parsing error information
  line: number;
  column: number;
  message: string;
  raw: string;
}

export interface SearchOptions {
  // :A: api search configuration
  markers?: string[];
  files?: string[];
  exclude?: string[];
  context?: number;
  recursive?: boolean;
  respectGitignore?: boolean;
}

export interface SearchResult {
  // :A: api search result structure
  anchor: MagicAnchor;
  context?: {
    before: string[];
    after: string[];
  };
}