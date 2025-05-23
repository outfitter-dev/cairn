// :ga:tldr Type definitions for grep-anchor system
// :ga:api Core type exports

export interface Anchor {
  // :ga:tldr The full anchor text including :ga: prefix
  raw: string;
  
  // :ga:tldr Array of parsed anchor parts from the payload
  // Note: Property name kept as 'tokens' for backwards compatibility
  tokens: AnchorPart[];
  
  // :ga:tldr Line number where anchor was found
  line: number;
  
  // :ga:tldr File path where anchor was found
  file: string;
  
  // :ga:tldr The comment text after the anchor
  comment?: string;
}

// New primary types using AnchorPart terminology
export type AnchorPart = BareAnchorPart | JsonAnchorPart | ArrayAnchorPart;

export interface BareAnchorPart {
  type: 'bare';
  value: string;
}

export interface JsonAnchorPart {
  type: 'json';
  value: Record<string, unknown>;
}

export interface ArrayAnchorPart {
  type: 'array';
  value: string[];
}

// Backwards compatibility aliases (deprecated)
/** @deprecated Use AnchorPart instead */
export type Token = AnchorPart;

/** @deprecated Use BareAnchorPart instead */
export type BareToken = BareAnchorPart;

/** @deprecated Use JsonAnchorPart instead */
export type JsonToken = JsonAnchorPart;

/** @deprecated Use ArrayAnchorPart instead */
export type ArrayToken = ArrayAnchorPart;

export interface ParseOptions {
  // :ga:tldr The anchor sigil to search for (default: ":ga:")
  anchor?: string;
  
  // :ga:tldr Include the comment text after the anchor
  includeComment?: boolean;
}

export interface Config {
  // :ga:tldr Override the default anchor sigil
  anchor?: string;
  
  // :ga:tldr File patterns to include/exclude
  files?: {
    include?: string[];
    exclude?: string[];
  };
  
  // :ga:tldr Linting rules
  lint?: {
    forbid?: string[];
    maxAgeDays?: number;
    versionField?: 'since' | 'v';
  };
  
  // :ga:tldr Tag dictionary for documentation
  dictionary?: Record<string, string>;
}

export interface LintResult {
  // :ga:tldr Whether linting passed
  passed: boolean;
  
  // :ga:tldr Array of lint violations
  violations: LintViolation[];
}

export interface LintViolation {
  // :ga:tldr Type of violation
  type: 'forbidden' | 'outdated' | 'invalid';
  
  // :ga:tldr The anchor that violated the rule
  anchor: Anchor;
  
  // :ga:tldr Human-readable message
  message: string;
}