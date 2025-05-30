// :A: tldr Main entry point for Grepa library
export { MagicAnchorParser } from './parser/magic-anchor-parser.js';
export { GrepaSearch } from './search/grepa-search.js';
export { CLI } from './cli/index.js';

// :A: api Error handling exports
export * from './lib/error.js';
export * from './lib/result.js';
export * from './lib/type-guards.js';
export * from './lib/toast.js';
export * from './lib/zod-adapter.js';

// :A: api Schema exports
export * from './schemas/index.js';

// :A: api Type exports
export * from './types/index.js';