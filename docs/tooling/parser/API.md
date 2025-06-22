<!-- tldr ::: complete API reference for @waymark/core v1.0 library -->
# Waymark API Reference v1.0

Complete API reference for the `@waymark/core` library, supporting waymark v1.0 syntax with signals, markers, actors, anchors, and tags.

## Installation

```bash
npm install @waymark/core
# or
pnpm add @waymark/core
# or  
yarn add @waymark/core
```

## Core Modules

### WaymarkParser

Parser for waymark v1.0 syntax including all components.

```typescript
import { WaymarkParser } from '@waymark/core';
```

#### Parser Methods

##### `parse(content: string, filename?: string): ParseResult`

Parse content for waymarks (legacy sync method, throws on error).

```typescript
try {
  const result = WaymarkParser.parse(fileContent, 'example.ts');
  console.log(result.waymarks); // Array of waymark objects
  console.log(result.errors);   // Array of non-fatal errors
  console.log(result.stats);    // Parsing statistics
} catch (error) {
  console.error('Parse failed:', error);
}
```

##### `parseWithResult(content: string, filename?: string, options?: ParseOptions): Result<ParseResult>`

Parse content using Result pattern for safe error handling.

```typescript
const result = WaymarkParser.parseWithResult(fileContent, 'app.ts', {
  strict: true,        // Enforce strict v1.0 compliance
  recoverable: true,   // Continue on errors
  includeContext: 3    // Include surrounding lines
});

if (result.ok) {
  const { waymarks, errors, stats } = result.data;
  console.log(`Found ${waymarks.length} waymarks`);
} else {
  console.error(result.error.message);
}
```

##### `findByMarker(waymarks: Waymark[], marker: string): Waymark[]`

Filter waymarks by marker type.

```typescript
const todos = WaymarkParser.findByMarker(waymarks, 'todo');
const criticalTodos = todos.filter(w => w.signal === '!!');
```

##### `findByActor(waymarks: Waymark[], actor: string): Waymark[]`

Filter waymarks by actor assignment.

```typescript
const aliceWork = WaymarkParser.findByActor(waymarks, '@alice');
const unassigned = waymarks.filter(w => !w.actor && !w.tags.relational.owner);
```

##### `findByTag(waymarks: Waymark[], tag: string): Waymark[]`

Filter waymarks by tag (simple or relational).

```typescript
// Simple tags
const backendWaymarks = WaymarkParser.findByTag(waymarks, 'backend');

// Relational tags  
const issue123 = WaymarkParser.findByTag(waymarks, 'fixes:#123');
```

##### `findBySignal(waymarks: Waymark[], signal: Signal): Waymark[]`

Filter waymarks by signal type.

```typescript
const criticalItems = WaymarkParser.findBySignal(waymarks, '!!');
const branchWork = WaymarkParser.findBySignal(waymarks, '*');
```

### WaymarkSearch

Search functionality for finding waymarks across files.

```typescript
import { WaymarkSearch } from '@waymark/core';
```

#### Search Methods

##### `search(patterns: string[], options?: SearchOptions): SearchResult[]`

Search files for waymarks (legacy sync method, throws on error).

```typescript
try {
  const results = WaymarkSearch.search(['src/**/*.ts'], {
    marker: ['todo', 'fixme'],
    signal: '!',
    tags: ['#security'],
    context: 2,
    recursive: true
  });
  console.log(`Found ${results.length} waymarks`);
} catch (error) {
  console.error('Search failed:', error);
}
```

##### `searchWithResult(patterns: string[], options?: SearchOptions): Promise<Result<SearchResult[]>>`

Search with Result pattern and async support (recommended).

```typescript
const result = await WaymarkSearch.searchWithResult(
  ['src/**/*.ts', 'lib/**/*.js'],
  {
    marker: ['todo', 'fixme'],
    actor: '@alice',
    tags: ['#backend', '#fixes:#123'],
    signal: ['!', '!!'],
    context: 3
  }
);

if (result.ok) {
  result.data.forEach(item => {
    console.log(`${item.waymark.file}:${item.waymark.line}`);
    console.log(`  ${item.waymark.raw}`);
    console.log(`  Marker: ${item.waymark.marker}`);
    if (item.waymark.signal) {
      console.log(`  Priority: ${item.waymark.signal}`);
    }
  });
} else {
  console.error('Search error:', result.error.message);
}
```

##### `getUniqueMarkers(results: SearchResult[]): string[]`

Extract all unique markers from search results.

```typescript
const markers = WaymarkSearch.getUniqueMarkers(results);
// ['todo', 'fixme', 'note', ...]
```

##### `groupByMarker(results: SearchResult[]): Record<string, SearchResult[]>`

Group search results by marker type.

```typescript
const grouped = WaymarkSearch.groupByMarker(results);
console.log(`TODOs: ${grouped.todo?.length || 0}`);
console.log(`FIXMEs: ${grouped.fixme?.length || 0}`);
```

##### `groupByFile(results: SearchResult[]): Record<string, SearchResult[]>`

Group search results by file path.

```typescript
const byFile = WaymarkSearch.groupByFile(results);
Object.entries(byFile).forEach(([file, waymarks]) => {
  console.log(`${file}: ${waymarks.length} waymarks`);
});
```

##### `groupByActor(results: SearchResult[]): Record<string, SearchResult[]>`

Group search results by actor assignment.

```typescript
const byActor = WaymarkSearch.groupByActor(results);
console.log('Work by assignee:');
Object.entries(byActor).forEach(([actor, items]) => {
  console.log(`  ${actor}: ${items.length} items`);
});
```

### WaymarkValidator

Validation functionality for waymark syntax and conventions.

```typescript
import { WaymarkValidator } from '@waymark/core';
```

#### Validator Methods

##### `constructor(options?: ValidatorOptions)`

Create a validator with custom rules.

```typescript
const validator = new WaymarkValidator({
  strict: true,
  rules: {
    'require-actor-for-todo': 'warn',
    'valid-issue-references': 'error'
  },
  customRules: [
    {
      name: 'team-convention',
      check: (waymark) => {
        if (waymark.marker === 'todo' && !waymark.tags.simple.includes('jira')) {
          return { severity: 'warn', message: 'TODOs should include JIRA tag' };
        }
      }
    }
  ]
});
```

##### `validate(waymarks: Waymark[]): ValidationIssue[]`

Validate an array of waymarks.

```typescript
const issues = validator.validate(waymarks);
issues.forEach(issue => {
  console.log(`${issue.severity}: ${issue.message} at line ${issue.line}`);
});
```

##### `validateFile(content: string, filename?: string): ValidationResult`

Validate waymarks in file content.

```typescript
const result = validator.validateFile(fileContent, 'app.ts');
if (result.issues.length > 0) {
  console.log(`Found ${result.issues.length} issues`);
}
```

## Type Definitions

### Core Types

#### Waymark

The complete waymark structure for v1.0.

```typescript
interface Waymark {
  // Location
  line: number;           // Line number (1-indexed)
  column: number;         // Column number (1-indexed)
  file?: string;          // File path (optional)
  
  // Core components
  raw: string;            // Original line content
  marker: string;         // Marker name (lowercase)
  signal?: Signal;        // Optional signal
  prose: string;          // Description text
  
  // v1.0 features
  actor?: string;         // Actor assignment (includes @)
  anchor?: Anchor;        // Anchor definition or reference
  tags: TagSet;           // Tag collection
  
  // Metadata
  commentStyle: CommentStyle;  // Comment syntax used
}

type Signal = '*' | '!' | '!!' | '?' | '??' | '-' | '--';

type CommentStyle = '//' | '#' | '/*' | '<!--' | ';' | '--';

interface Anchor {
  type: 'definition' | 'reference';
  value: string;          // Anchor name (without ## or #)
}

interface TagSet {
  simple: string[];       // Simple tags: ['backend', 'security']  
  relational: Record<string, string[]>;  // Relational: { fixes: ['#123'], owner: ['@alice'] }
}
```

#### ParseOptions

Options for parsing waymarks.

```typescript
interface ParseOptions {
  strict?: boolean;       // Enforce strict v1.0 syntax
  recoverable?: boolean;  // Continue parsing on errors
  includeContext?: number; // Include surrounding lines
  customMarkers?: string[]; // Additional valid markers
  cache?: boolean;        // Enable caching
}
```

#### SearchOptions

Options for searching waymarks.

```typescript
interface SearchOptions {
  // Filters
  marker?: string | string[];     // Filter by markers
  signal?: Signal | Signal[];     // Filter by signals  
  actor?: string | string[];      // Filter by actors
  tags?: string | string[];       // Filter by tags
  pattern?: string | RegExp;      // Custom pattern
  
  // Search behavior
  recursive?: boolean;            // Search recursively (default: true)
  context?: number;               // Context lines to include
  exclude?: string | string[];    // Patterns to exclude
  include?: string | string[];    // Patterns to include
  maxFiles?: number;              // Maximum files to search
  maxFileSize?: number;           // Max file size in bytes
  maxDepth?: number;              // Max directory depth
  
  // Output options
  includeStats?: boolean;         // Include statistics
  respectGitignore?: boolean;     // Respect .gitignore (default: true)
  followSymlinks?: boolean;       // Follow symbolic links
  cache?: boolean;                // Use cache
}
```

#### ParseResult

Result of parsing waymarks.

```typescript
interface ParseResult {
  waymarks: Waymark[];    // Successfully parsed waymarks
  errors: ParseError[];   // Non-fatal parsing errors
  stats: ParseStats;      // Parsing statistics
}

interface ParseError {
  line: number;
  column: number;
  message: string;
  code: string;           // Error code
  severity: 'error' | 'warning';
}

interface ParseStats {
  totalLines: number;
  totalWaymarks: number;
  parseTimeMs: number;
  byMarker: Record<string, number>;
  bySignal: Record<Signal, number>;
  byActor: Record<string, number>;
  errorCount: number;
  warningCount: number;
}
```

#### SearchResult

Result of searching for waymarks.

```typescript
interface SearchResult {
  waymark: Waymark;       // The found waymark
  context?: {             // Optional context lines
    before: string[];
    after: string[];
  };
}
```

#### ValidationTypes

Types for waymark validation.

```typescript
interface ValidatorOptions {
  strict?: boolean;       // Strict v1.0 compliance
  rules?: Record<string, RuleSeverity>;
  customRules?: CustomRule[];
}

type RuleSeverity = 'off' | 'warn' | 'error' | 0 | 1 | 2;

interface CustomRule {
  name: string;
  check: (waymark: Waymark) => ValidationIssue | void;
}

interface ValidationIssue {
  line: number;
  column: number;
  severity: 'warning' | 'error';
  rule: string;
  message: string;
  fix?: {
    range: [number, number];
    text: string;
  };
}

interface ValidationResult {
  issues: ValidationIssue[];
  errorCount: number;
  warningCount: number;
}
```

### Error Handling

#### Result Type

Safe error handling pattern.

```typescript
type Result<T, E = AppError> =
  | { ok: true; data: T }
  | { ok: false; error: E };

interface AppError {
  code: string;           // Machine-readable error code
  message: string;        // Human-readable message
  details?: unknown;      // Additional error details
  cause?: Error;          // Original error
  stack?: string;         // Stack trace
}
```

#### Error Codes

Standardized error codes.

```typescript
enum ErrorCode {
  // Parse errors
  PARSE_INVALID_SYNTAX = 'parse.invalidSyntax',
  PARSE_MISSING_SPACE = 'parse.missingSpace',
  PARSE_INVALID_MARKER = 'parse.invalidMarker',
  PARSE_INVALID_SIGNAL = 'parse.invalidSignal',
  PARSE_EMPTY_PROSE = 'parse.emptyProse',
  
  // Validation errors  
  VALIDATE_INVALID_ACTOR = 'validate.invalidActor',
  VALIDATE_INVALID_TAG = 'validate.invalidTag',
  VALIDATE_DUPLICATE_ANCHOR = 'validate.duplicateAnchor',
  VALIDATE_INVALID_REFERENCE = 'validate.invalidReference',
  
  // File errors
  FILE_NOT_FOUND = 'file.notFound',
  FILE_READ_ERROR = 'file.readError',
  FILE_TOO_LARGE = 'file.tooLarge',
  FILE_ACCESS_DENIED = 'file.accessDenied',
  
  // Search errors
  SEARCH_NO_RESULTS = 'search.noResults',
  SEARCH_PATTERN_INVALID = 'search.patternInvalid',
  SEARCH_TIMEOUT = 'search.timeout',
  
  // General errors
  INVALID_ARGUMENT = 'general.invalidArgument',
  OPERATION_CANCELLED = 'general.cancelled',
  UNKNOWN_ERROR = 'general.unknown'
}

```

## Utility Functions

### Helper Functions

```typescript
import { isValidMarker, isValidSignal, isValidActor, parseTag } from '@waymark/core/utils';

// Validate components
console.log(isValidMarker('todo'));     // true
console.log(isValidMarker('TODO'));     // false (uppercase)

console.log(isValidSignal('!!'));       // true  
console.log(isValidSignal('+++'));      // false

console.log(isValidActor('@alice'));    // true
console.log(isValidActor('alice'));     // false (missing @)

// Parse tags
const tag1 = parseTag('#backend');      // { type: 'simple', key: 'backend' }
const tag2 = parseTag('#fixes:#123');   // { type: 'relational', key: 'fixes', value: '#123' }
```

### Format Converters

```typescript
import { toJSON, toCSV, toMarkdown } from '@waymark/core/formatters';

// Convert waymarks to different formats
const waymarks = /* ... */;

const json = toJSON(waymarks);
const csv = toCSV(waymarks);
const markdown = toMarkdown(waymarks);
```

### Migration Helpers

```typescript
import { migrateFromV0 } from '@waymark/core/migration';

// Migrate old syntax to v1.0
const oldContent = '// todo ::: task +backend priority:high';
const newContent = migrateFromV0(oldContent);
// Result: '// todo ::: task #backend #priority:high'
// todo ::: Migration example still outputs deprecated `#priority:high`; update to signal-based priority (`!todo`) or show second migration step #wm:fix
```

## Advanced Features

### Streaming Parser

For large files or real-time processing.

```typescript
import { WaymarkStreamParser } from '@waymark/core/stream';
import { createReadStream } from 'fs';

const parser = new WaymarkStreamParser({
  highWaterMark: 64 * 1024  // 64KB chunks
});

parser.on('waymark', (waymark) => {
  console.log(`Found ${waymark.marker} at line ${waymark.line}`);
});

parser.on('error', (error) => {
  console.error('Parse error:', error);
});

parser.on('end', () => {
  console.log('Parsing complete');
});

creatReadStream('large-file.js').pipe(parser);
```

### Batch Processing

```typescript
import { BatchProcessor } from '@waymark/core/batch';

const processor = new BatchProcessor({
  concurrency: 4,        // Parallel workers
  chunkSize: 100,        // Files per batch
  timeout: 30000         // 30s timeout
});

const results = await processor.process([
  'src/**/*.js',
  'lib/**/*.ts',
  'test/**/*.spec.js'
]);

console.log(`Processed ${results.totalFiles} files`);
console.log(`Found ${results.totalWaymarks} waymarks`);
```

### AST Integration

Integrate with JavaScript/TypeScript AST.

```typescript
import { ASTWaymarkExtractor } from '@waymark/core/ast';
import * as parser from '@babel/parser';

const code = await fs.readFile('app.js', 'utf8');

const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['jsx', 'typescript']
});

const extractor = new ASTWaymarkExtractor();
const waymarksWithContext = extractor.extract(ast, code);

waymarksWithContext.forEach(({ waymark, node, scope }) => {
  console.log(`${waymark.marker} in ${node.type}`);
  console.log(`Scope: ${scope.path}`);
});
```

### Caching

```typescript
import { WaymarkCache } from '@waymark/core/cache';

const cache = new WaymarkCache({
  store: 'memory',       // or 'file', 'redis'
  ttl: 15 * 60 * 1000,  // 15 minutes
  maxSize: 100 * 1024 * 1024  // 100MB
});

const parser = new WaymarkParser({ cache });

// First parse - hits filesystem
const result1 = await parser.parseFile('app.js');

// Second parse - hits cache
const result2 = await parser.parseFile('app.js');
```

### Plugin System

```typescript
import { WaymarkPlugin } from '@waymark/core/plugin';

class SecurityPlugin implements WaymarkPlugin {
  name = 'security-scanner';
  
  async beforeParse(content: string, filename: string) {
    // Pre-process content
    return content;
  }
  
  async afterParse(waymarks: Waymark[]) {
    // Post-process waymarks
    for (const waymark of waymarks) {
      if (waymark.tags.simple.includes('security')) {
        // Run security analysis
        await this.analyzeSecurityIssue(waymark);
      }
    }
    return waymarks;
  }
  
  private async analyzeSecurityIssue(waymark: Waymark) {
    // Custom security analysis
  }
}

const parser = new WaymarkParser({
  plugins: [new SecurityPlugin()]
});
```

## CLI Programmatic Usage

```typescript
import { CLI } from '@waymark/core/cli';

// Run with custom arguments
const cli = new CLI();
const exitCode = await cli.run(['search', 'src/', '--marker', 'todo']);

// Or parse process.argv
await cli.run();

// Programmatic API
const results = await cli.search(['src/**/*.js'], {
  marker: ['todo', 'fixme'],
  format: 'json'
});
```

## Examples

### Basic Parsing

```typescript
import { WaymarkParser } from '@waymark/core';

const code = `
  // todo ::: implement validation #backend
  function validate(input: string) {
    // !fixme ::: @alice security issue #security #fixes:#123
    return input;
  }
  
  // about ::: ##auth/validate Input validation logic
`;

const result = WaymarkParser.parseWithResult(code);
if (result.ok) {
  console.log(`Found ${result.data.waymarks.length} waymarks`);
  
  result.data.waymarks.forEach(w => {
    console.log(`Line ${w.line}: ${w.marker}`);
    if (w.signal) console.log(`  Signal: ${w.signal}`);
    if (w.actor) console.log(`  Actor: ${w.actor}`);
    if (w.anchor) console.log(`  Anchor: ${w.anchor.type} ${w.anchor.value}`);
    if (w.tags.simple.length) console.log(`  Tags: ${w.tags.simple.join(', ')}`);
  });
}
```

### Advanced Search

```typescript
import { WaymarkSearch } from '@waymark/core';

// Search with multiple filters
const result = await WaymarkSearch.searchWithResult(
  ['src/**/*.{js,ts}', '!src/**/*.test.js'],
  {
    marker: ['todo', 'fixme'],
    signal: ['!', '!!'],
    actor: '@alice',
    tags: ['#security', '#fixes:#123'],
    context: 3,
    exclude: ['node_modules/**', 'dist/**']
  }
);

if (result.ok) {
  // Group by priority
  const byPriority = result.data.reduce((acc, item) => {
    const priority = item.waymark.signal || 'normal';
    acc[priority] = acc[priority] || [];
    acc[priority].push(item);
    return acc;
  }, {});
  
  console.log('Critical (!!):', byPriority['!!']?.length || 0);
  console.log('High (!):', byPriority['!']?.length || 0);
  console.log('Normal:', byPriority['normal']?.length || 0);
}
```

### Validation Example

```typescript
import { WaymarkValidator } from '@waymark/core';

const validator = new WaymarkValidator({
  strict: true,
  rules: {
    'require-actor-for-todo': 'error',
    'valid-issue-references': 'warn',
    'no-duplicate-anchors': 'error'
  },
  customRules: [
    {
      name: 'require-jira-tag',
      check: (waymark) => {
        if (waymark.marker === 'todo' && 
            !Object.keys(waymark.tags.relational).includes('jira')) {
          return {
            severity: 'warning',
            message: 'TODOs should include JIRA reference',
            rule: 'require-jira-tag'
          };
        }
      }
    }
  ]
});

const waymarks = /* parsed waymarks */;
const issues = validator.validate(waymarks);

if (issues.length > 0) {
  console.log('Validation issues:');
  issues.forEach(issue => {
    console.log(`  ${issue.severity}: ${issue.message} (line ${issue.line})`);
  });
}
```

### Error Handling

```typescript
import { WaymarkSearch, ErrorCode } from '@waymark/core';

const result = await WaymarkSearch.searchWithResult(['src/']);

if (!result.ok) {
  switch (result.error.code) {
    case ErrorCode.FILE_NOT_FOUND:
      console.error('Directory not found:', result.error.details);
      break;
      
    case ErrorCode.FILE_ACCESS_DENIED:
      console.error('Permission denied:', result.error.details);
      break;
      
    case ErrorCode.SEARCH_TIMEOUT:
      console.error('Search timed out');
      break;
      
    case ErrorCode.SEARCH_NO_RESULTS:
      console.log('No waymarks found');
      break;
      
    default:
      console.error(`Error ${result.error.code}: ${result.error.message}`);
      if (result.error.stack) {
        console.error(result.error.stack);
      }
  }
}
```

### Integration Example

```typescript
import { WaymarkParser, WaymarkSearch } from '@waymark/core';
import { GitHubClient } from '@octokit/rest';

// Find all todos and create GitHub issues
async function createIssuesFromTodos() {
  const github = new GitHubClient({ auth: process.env.GITHUB_TOKEN });
  
  const result = await WaymarkSearch.searchWithResult(['src/**/*.js'], {
    marker: 'todo',
    signal: ['!', '!!']  // Only high priority
  });
  
  if (!result.ok) {
    console.error('Search failed:', result.error);
    return;
  }
  
  for (const item of result.data) {
    const { waymark } = item;
    
    // Skip if already has issue reference
    if (waymark.tags.relational.fixes) continue;
    
    const labels = ['waymark-todo'];
    if (waymark.signal === '!!') labels.push('critical');
    if (waymark.signal === '!') labels.push('high-priority');
    labels.push(...waymark.tags.simple);
    
    const issue = await github.issues.create({
      owner: 'myorg',
      repo: 'myrepo',
      title: waymark.prose,
      body: `Found in ${waymark.file}:${waymark.line}\n\n${'`'}${waymark.raw}${'`'}`,
      labels,
      assignees: waymark.actor ? [waymark.actor.slice(1)] : []
    });
    
    console.log(`Created issue #${issue.data.number} for line ${waymark.line}`);
  }
}
```

## Performance Benchmarks

```typescript
import { benchmark } from '@waymark/core/benchmark';

// Run performance tests
const results = await benchmark({
  files: ['src/**/*.js'],
  iterations: 100
});

console.log('Parse performance:');
console.log(`  Average: ${results.parse.average}ms`);
console.log(`  P95: ${results.parse.p95}ms`);
console.log(`  P99: ${results.parse.p99}ms`);

console.log('\nSearch performance:');
console.log(`  Files/sec: ${results.search.filesPerSecond}`);
console.log(`  Memory: ${results.search.memoryUsed}MB`);
```

## Migration Guide

### From v0.x to v1.0

```typescript
// Old API (v0.x)
import { WaymarkParser } from '@waymark/core';

const waymarks = WaymarkParser.parse(content);
waymarks.forEach(w => {
  console.log(w.contexts);  // ['todo', 'backend']
  console.log(w.priority);  // 'high'
});

// New API (v1.0)  
import { WaymarkParser } from '@waymark/core';

const result = WaymarkParser.parseWithResult(content);
if (result.ok) {
  result.data.waymarks.forEach(w => {
    console.log(w.marker);           // 'todo'
    console.log(w.signal);           // '!'
    console.log(w.tags.simple);      // ['backend']
    console.log(w.tags.relational);  // { priority: ['high'] }
  });
}
```

## Resources

- [Waymark Syntax Specification](../../syntax/SPEC.md)
- [CLI Documentation](../cli/README.md)
- [Linter Documentation](../linter/README.md)
- [Example Repository](https://github.com/waymark/examples)
- [API Changelog](./CHANGELOG.md)