// :A: tldr Type definitions for Magic Anchor parsing and processing

// :A: api Core anchor interface
export interface MagicAnchor {
  readonly line: number;
  readonly column: number;
  readonly raw: string;
  readonly markers: readonly string[];
  readonly prose?: string;
  readonly file?: string;
}

// :A: api Parser output structure
export interface ParseResult {
  readonly anchors: readonly MagicAnchor[];
  readonly errors: readonly ParseError[];
}

// :A: api Parsing error information
export interface ParseError {
  readonly line: number;
  readonly column: number;
  readonly message: string;
  readonly raw: string;
}

// :A: api Search configuration options
export interface SearchOptions {
  readonly markers?: readonly string[];
  readonly files?: readonly string[];
  readonly exclude?: readonly string[];
  readonly context?: number;
  readonly recursive?: boolean;
}

// :A: api Search result structure  
export interface SearchResult {
  readonly anchor: MagicAnchor;
  readonly context?: Readonly<{
    before: readonly string[];
    after: readonly string[];
  }>;
}

// :A: api Utility types for common operations
export type CreateMagicAnchorInput = Omit<MagicAnchor, 'file'>;
export type UpdateSearchOptions = Partial<SearchOptions>;
export type MagicAnchorLocation = Pick<MagicAnchor, 'line' | 'column' | 'file'>;
export type MagicAnchorContent = Pick<MagicAnchor, 'markers' | 'prose' | 'raw'>;

// :A: api Readonly versions for immutable operations
export type ReadonlyMagicAnchor = Readonly<MagicAnchor>;
export type ReadonlySearchOptions = Readonly<SearchOptions>;
export type ReadonlyParseResult = Readonly<ParseResult>;

// :A: api Function type utilities
export type ParseFunction = (input: string) => ParseResult;
export type SearchFunction = (options: SearchOptions) => Promise<SearchResult[]>;
export type ValidateFunction = (anchor: MagicAnchor) => boolean;

// :A: api Required versions for strict validation
export type RequiredSearchOptions = Required<SearchOptions>;
export type RequiredMagicAnchor = Required<MagicAnchor>;