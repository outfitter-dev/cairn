// :ga:tldr Core library for grep-anchor parsing and processing
// :ga:entry,api Main package exports

export * from './types';
export * from './parser';
export * from './config';
export * from './files';
export * from './lint';
export * from './anchor-lexer';

// :ga:api Re-export commonly used functions
export { parseAnchors } from './parser';
export { loadConfig, loadConfigSync, resolveConfig, findConfigFile, validateConfig, mergeConfigs } from './config';
export { findFiles } from './files';
export { lintAnchors } from './lint';

// Export new names as primary
export { extractAnchorParts, normalizeAnchorPart, validateAnchorPart } from './anchor-lexer';

// Keep old names for backwards compatibility
export { extractTokens, normalizeToken, validateToken } from './anchor-lexer';