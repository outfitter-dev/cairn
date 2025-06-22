<!-- tldr ::: comprehensive parser API documentation for waymark v1.0 -->
# Waymark Parser API

The `@waymark/core` library provides a powerful parser for waymark v1.0 syntax, enabling programmatic analysis and manipulation of waymarks in your codebase.

## Installation

```bash
npm install @waymark/core
# or
pnpm add @waymark/core
# or
yarn add @waymark/core
```

## Quick Start

```typescript
import { WaymarkParser } from '@waymark/core';

// Parse a string for waymarks
const code = `
  // todo ::: implement validation #backend
  function validate(input: string) {
    // !fixme ::: @alice security issue #security #fixes:#123
    return input;
  }
`;

const result = WaymarkParser.parseWithResult(code, 'example.ts');
if (result.ok) {
  console.log(`Found ${result.data.waymarks.length} waymarks`);
  result.data.waymarks.forEach(waymark => {
    console.log(`${waymark.marker} at line ${waymark.line}: ${waymark.prose}`);
  });
}
```

## Core API

### WaymarkParser

The main parser class for analyzing waymark syntax.

#### `parseWithResult(content: string, filename?: string): Result<ParseResult>`

Parses content using Result pattern for safe error handling.

```typescript
const result = WaymarkParser.parseWithResult(fileContent, 'app.ts');
if (result.ok) {
  // Access parsed waymarks
  const { waymarks, errors, stats } = result.data;
  
  waymarks.forEach(w => {
    console.log(`${w.marker} at line ${w.line}`);
    if (w.signal) console.log(`Priority: ${w.signal}`);
    if (w.actor) console.log(`Assigned to: ${w.actor}`);
    if (w.anchor) console.log(`Anchor: ${w.anchor.type} ${w.anchor.value}`);
  });
} else {
  console.error('Parse error:', result.error.message);
}
```

#### `parse(content: string, filename?: string): ParseResult`

Legacy synchronous parsing method (throws on error).

```typescript
try {
  const result = WaymarkParser.parse(fileContent);
  console.log(result.waymarks);
} catch (error) {
  console.error('Parse failed:', error);
}
```

#### `findByMarker(waymarks: Waymark[], marker: string): Waymark[]`

Filter waymarks by marker type.

```typescript
const todos = WaymarkParser.findByMarker(waymarks, 'todo');
const criticalFixes = WaymarkParser.findByMarker(waymarks, 'fixme')
  .filter(w => w.signal === '!!');
```

#### `findByActor(waymarks: Waymark[], actor: string): Waymark[]`

Find waymarks assigned to a specific actor.

```typescript
const aliceWork = WaymarkParser.findByActor(waymarks, '@alice');
const agentTasks = WaymarkParser.findByActor(waymarks, '@agent');
```

#### `findByTag(waymarks: Waymark[], tag: string): Waymark[]`

Find waymarks with specific tags.

```typescript
// Simple tags
const securityWaymarks = WaymarkParser.findByTag(waymarks, 'security');

// Relational tags
const issue123Fixes = WaymarkParser.findByTag(waymarks, 'fixes:#123');
```

### WaymarkSearch

Search functionality for finding waymarks across multiple files.

#### `searchWithResult(patterns: string[], options?: SearchOptions): Promise<Result<SearchResult[]>>`

Asynchronously search files for waymarks.

```typescript
const result = await WaymarkSearch.searchWithResult(
  ['src/**/*.ts', 'lib/**/*.js'],
  {
    marker: ['todo', 'fixme'],
    signal: '!',
    tags: ['#security'],
    actor: '@alice',
    context: 3
  }
);

if (result.ok) {
  result.data.forEach(item => {
    console.log(`${item.waymark.file}:${item.waymark.line}`);
    console.log(`  ${item.waymark.raw}`);
    if (item.context) {
      console.log('  Context:', item.context.before.join('\n'));
    }
  });
}
```

#### `groupByMarker(results: SearchResult[]): Record<string, SearchResult[]>`

Group search results by marker type.

```typescript
const grouped = WaymarkSearch.groupByMarker(results);
console.log(`TODOs: ${grouped.todo?.length || 0}`);
console.log(`FIXMEs: ${grouped.fixme?.length || 0}`);
```

#### `groupByFile(results: SearchResult[]): Record<string, SearchResult[]>`

Group search results by file path.

```typescript
const byFile = WaymarkSearch.groupByFile(results);
Object.entries(byFile).forEach(([file, waymarks]) => {
  console.log(`${file}: ${waymarks.length} waymarks`);
});
```

### WaymarkValidator

Validate waymark syntax and enforce best practices.

```typescript
import { WaymarkValidator } from '@waymark/core';

const validator = new WaymarkValidator({
  strict: true,
  customRules: [
    {
      name: 'require-actor-for-todo',
      severity: 'warning',
      check: (waymark) => {
        if (waymark.marker === 'todo' && !waymark.actor) {
          return 'TODOs should be assigned to someone';
        }
      }
    }
  ]
});

const issues = validator.validate(waymarks);
issues.forEach(issue => {
  console.log(`${issue.severity}: ${issue.message} at line ${issue.line}`);
});
```

## Type Definitions

### Waymark

The core waymark data structure with v1.0 components.

```typescript
interface Waymark {
  // Location
  line: number;           // 1-indexed line number
  column: number;         // 1-indexed column number
  file?: string;          // File path if available
  
  // Core components
  raw: string;            // Original line content
  marker: string;         // Marker name (todo, fixme, etc.)
  signal?: Signal;        // Priority/scope signal
  prose: string;          // Description text
  
  // v1.0 features
  actor?: string;         // Assigned actor (@alice)
  anchor?: Anchor;        // Anchor definition or reference
  tags: TagSet;           // Simple and relational tags
}

type Signal = '*' | '!' | '!!' | '?' | '??' | '-' | '--';

interface Anchor {
  type: 'definition' | 'reference';
  value: string;          // The anchor name (without ##)
}

interface TagSet {
  simple: string[];       // Simple tags: ['backend', 'security']
  relational: Record<string, string[]>;  // Relational: { fixes: ['#123'], owner: ['@alice'] }
}
```

### SearchOptions

Options for searching waymarks across files.

```typescript
interface SearchOptions {
  // Filters
  marker?: string[];      // Filter by markers
  signal?: Signal | Signal[];  // Filter by signals
  actor?: string;         // Filter by actor assignment
  tags?: string[];        // Filter by tags
  
  // Search behavior
  recursive?: boolean;    // Search recursively (default: true)
  context?: number;       // Context lines to include
  exclude?: string[];     // File patterns to exclude
  maxFiles?: number;      // Maximum files to search
  maxFileSize?: number;   // Max file size in bytes
  
  // Output options
  includeStats?: boolean; // Include statistics
  respectGitignore?: boolean;  // Respect .gitignore (default: true)
}
```

### ParseResult

Result of parsing a file for waymarks.

```typescript
interface ParseResult {
  waymarks: Waymark[];    // Parsed waymarks
  errors: ParseError[];   // Non-fatal parsing errors
  stats: ParseStats;      // Parsing statistics
}

interface ParseError {
  line: number;
  column: number;
  message: string;
  code: string;           // Error code for programmatic handling
}

interface ParseStats {
  totalLines: number;
  waymarkCount: number;
  parseTime: number;      // Milliseconds
  byMarker: Record<string, number>;
  bySignal: Record<Signal, number>;
}
```

### Result Type

Safe error handling pattern used throughout the API.

```typescript
type Result<T, E = AppError> =
  | { ok: true; data: T }
  | { ok: false; error: E };

interface AppError {
  code: string;
  message: string;
  details?: unknown;
  stack?: string;
}
```

## Advanced Usage

### Custom Parser Extensions

```typescript
import { WaymarkParser, ParserPlugin } from '@waymark/core';

// Create a custom plugin
const customPlugin: ParserPlugin = {
  name: 'custom-markers',
  
  // Extend marker definitions
  markers: ['spike', 'research'],
  
  // Custom validation
  validate: (waymark) => {
    if (waymark.marker === 'spike' && !waymark.tags.simple.includes('timeboxed')) {
      return { error: 'Spikes must be timeboxed' };
    }
  },
  
  // Transform waymarks
  transform: (waymark) => {
    if (waymark.marker === 'research') {
      waymark.tags.simple.push('knowledge');
    }
    return waymark;
  }
};

// Use with parser
const parser = new WaymarkParser({ plugins: [customPlugin] });
```

### Streaming Large Files

```typescript
import { WaymarkStreamParser } from '@waymark/core';

const stream = new WaymarkStreamParser();

stream.on('waymark', (waymark) => {
  console.log(`Found: ${waymark.marker} at line ${waymark.line}`);
});

stream.on('error', (error) => {
  console.error('Parse error:', error);
});

// Parse file stream
import { createReadStream } from 'fs';
creatReadStream('large-file.js')
  .pipe(stream);
```

### AST Integration

```typescript
import { WaymarkASTVisitor } from '@waymark/core';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';

// Parse JavaScript AST
const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['typescript']
});

// Extract waymarks with AST context
const visitor = new WaymarkASTVisitor();
traverse(ast, visitor);

const waymarksWithContext = visitor.getWaymarks();
waymarksWithContext.forEach(({ waymark, node, scope }) => {
  console.log(`${waymark.marker} in ${scope.type}`);
});
```

### Performance Optimization

```typescript
import { WaymarkCache, BatchParser } from '@waymark/core';

// Use caching for repeated parses
const cache = new WaymarkCache({
  ttl: 15 * 60 * 1000,  // 15 minutes
  maxSize: 100          // Max cached files
});

const parser = new WaymarkParser({ cache });

// Batch processing for better performance
const batch = new BatchParser({
  concurrency: 4,       // Parallel workers
  chunkSize: 50        // Files per chunk
});

const results = await batch.parseFiles([
  'src/**/*.js',
  'lib/**/*.ts'
]);
```

## Error Handling

### Error Codes

The parser uses consistent error codes for programmatic handling:

```typescript
enum ErrorCode {
  // Syntax errors
  INVALID_SYNTAX = 'parse.invalidSyntax',
  MISSING_SPACE = 'parse.missingSpace',
  INVALID_MARKER = 'parse.invalidMarker',
  INVALID_SIGNAL = 'parse.invalidSignal',
  
  // Validation errors
  INVALID_ACTOR = 'validate.invalidActor',
  INVALID_TAG = 'validate.invalidTag',
  DUPLICATE_ANCHOR = 'validate.duplicateAnchor',
  
  // File errors
  FILE_NOT_FOUND = 'file.notFound',
  FILE_TOO_LARGE = 'file.tooLarge',
  READ_ERROR = 'file.readError'
}
```

### Error Recovery

```typescript
const result = await WaymarkParser.parseWithResult(code, {
  // Continue parsing on errors
  recoverable: true,
  
  // Custom error handler
  onError: (error) => {
    console.warn(`Recoverable error at line ${error.line}: ${error.message}`);
  }
});

if (result.ok) {
  // Access both valid waymarks and errors
  const { waymarks, errors } = result.data;
  console.log(`Parsed ${waymarks.length} waymarks with ${errors.length} errors`);
}
```

## Integration Examples

### VS Code Extension

```typescript
import * as vscode from 'vscode';
import { WaymarkParser } from '@waymark/core';

export function activate(context: vscode.ExtensionContext) {
  // Register waymark provider
  const provider = new WaymarkProvider();
  
  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(
      { pattern: '**/*' },
      provider
    )
  );
}

class WaymarkProvider implements vscode.DocumentSymbolProvider {
  provideDocumentSymbols(document: vscode.TextDocument): vscode.DocumentSymbol[] {
    const result = WaymarkParser.parseWithResult(document.getText());
    
    if (!result.ok) return [];
    
    return result.data.waymarks.map(waymark => {
      const range = new vscode.Range(
        waymark.line - 1, waymark.column - 1,
        waymark.line - 1, document.lineAt(waymark.line - 1).text.length
      );
      
      return new vscode.DocumentSymbol(
        waymark.prose,
        waymark.actor || '',
        vscode.SymbolKind.Event,
        range,
        range
      );
    });
  }
}
```

### GitHub Actions

```typescript
import * as core from '@actions/core';
import { WaymarkSearch } from '@waymark/core';

async function run() {
  try {
    const patterns = core.getInput('patterns').split(',');
    const failOnCritical = core.getBooleanInput('fail-on-critical');
    
    const result = await WaymarkSearch.searchWithResult(patterns, {
      signal: '!!'
    });
    
    if (result.ok && result.data.length > 0 && failOnCritical) {
      core.setFailed(`Found ${result.data.length} critical waymarks`);
      
      result.data.forEach(({ waymark }) => {
        core.error(`${waymark.marker}: ${waymark.prose}`, {
          file: waymark.file,
          startLine: waymark.line
        });
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
```

## Performance Benchmarks

| Operation | Files | Waymarks | Time | Memory |
|-----------|-------|----------|------|--------|
| Parse single file | 1 | 50 | 2ms | 0.5MB |
| Search small project | 100 | 500 | 150ms | 8MB |
| Search large project | 5,000 | 10,000 | 3.2s | 45MB |
| Stream parse 100MB file | 1 | 5,000 | 800ms | 12MB |

## Best Practices

1. **Use Result pattern** - Always prefer `parseWithResult` over `parse`
2. **Filter early** - Use SearchOptions to reduce processing
3. **Cache when appropriate** - Enable caching for repeated operations
4. **Handle errors gracefully** - Check error codes for specific handling
5. **Validate inputs** - Use WaymarkValidator for enforcing conventions
6. **Stream large files** - Use streaming parser for files > 10MB

## Migration from v0.x

```typescript
// Old API (v0.x)
const waymarks = WaymarkParser.parse(content);
waymarks.forEach(w => {
  console.log(w.contexts); // Old: contexts array
});

// New API (v1.0)
const result = WaymarkParser.parseWithResult(content);
if (result.ok) {
  result.data.waymarks.forEach(w => {
    console.log(w.marker);  // New: explicit marker
    console.log(w.signal);  // New: priority signals
    console.log(w.tags);    // New: structured tags
  });
}
```

## Resources

- [CLI Documentation](../cli/README.md)
- [Waymark Syntax Specification](../../syntax/SPEC.md)
- [TypeScript Examples](https://github.com/waymark/examples)
- [API Reference](./API.md)