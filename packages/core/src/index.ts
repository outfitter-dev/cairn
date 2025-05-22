// :ga:tldr Core library for grep-anchor parsing and processing
// :ga:entry,api Main package exports

export * from './types';
export * from './parser';
export * from './config';
export * from './files';
export * from './lint';

// :ga:api Re-export commonly used functions
export { parseAnchors } from './parser';
export { loadConfig, resolveConfig, findConfigFile } from './config';
export { findFiles } from './files';
export { lintAnchors } from './lint';