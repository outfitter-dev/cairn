// :M: tldr Type definitions for waymark parsing and processing

export interface Waymark {
  // :M: api core anchor properties
  line: number;
  column: number;
  raw: string;
  contexts: string[];
  prose?: string;
  file?: string;
}

export interface ParseResult {
  // :M: api parser output structure
  anchors: Waymark[];
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
  anchor: Waymark;
  context?: {
    before: string[];
    after: string[];
  };
}