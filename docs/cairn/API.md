<!-- :M: TL;DR API reference documentation for Cairn library -->

# Cairn API Reference

## Installation

```bash
npm install @cairn/core
# or
pnpm add @cairn/core
```

## Core Modules

### CairnParser

Parser for Cairn syntax (`:M: context prose`).

```typescript
import { CairnParser } from '@cairn/core';
```

#### Parser Methods

##### `parse(content: string, filename?: string): ParseResult`

Parse content for Cairns (legacy sync method).

```typescript
const result = CairnParser.parse(fileContent, 'example.ts');
console.log(result.anchors); // Array of Cairn objects
console.log(result.errors);  // Array of ParseError objects
```

##### `parseWithResult(content: string, filename?: string): Result<ParseResult>`

Parse content using Result pattern for better error handling.

```typescript
const result = CairnParser.parseWithResult(fileContent);
if (result.ok) {
  console.log(result.data.anchors);
} else {
  console.error(result.error);
}
```

##### `findByContext(anchors: Cairn[], context: string): Cairn[]`

Find Cairns containing a specific context.

```typescript
const todoCairns = CairnParser.findByContext(anchors, 'todo');
```

### CairnSearch

Search functionality for finding Cairns across files.

```typescript
import { CairnSearch } from '@cairn/core';
```

#### Search Methods

##### `search(patterns: string[], options?: SearchOptions): SearchResult[]`

Search files for Cairns (legacy sync method).

```typescript
const results = CairnSearch.search(['src/**/*.ts'], {
  contexts: ['todo', 'security'],
  context: 2,
  recursive: true
});
```

##### `searchWithResult(patterns: string[], options?: SearchOptions): Promise<Result<SearchResult[]>>`

Search with Result pattern and async support.

```typescript
const result = await CairnSearch.searchWithResult(['src/'], {
  contexts: ['todo']
});

if (result.ok) {
  result.data.forEach(item => {
    console.log(`${item.anchor.file}:${item.anchor.line}`);
    console.log(item.anchor.contexts);
  });
}
```

##### `getUniqueContexts(results: SearchResult[]): string[]`

Extract all unique contexts from search results.

```typescript
const contexts = CairnSearch.getUniqueContexts(results);
// ['todo', 'security', 'api', ...]
```

##### `groupByContext(results: SearchResult[]): Record<string, SearchResult[]>`

Group search results by context.

```typescript
const grouped = CairnSearch.groupByContext(results);
console.log(grouped.todo);     // All results with 'todo' context
console.log(grouped.security); // All results with 'security' context
```

## Types

### Cairn

```typescript
interface Cairn {
  line: number;        // Line number (1-indexed)
  column: number;      // Column number (1-indexed)
  raw: string;         // Original line content
  contexts: string[];  // Array of contexts
  prose?: string;      // Optional prose description
  file?: string;       // File path (if provided)
}
```

### SearchOptions

```typescript
interface SearchOptions {
  contexts?: string[];    // Filter by specific contexts
  context?: number;       // Number of context lines
  recursive?: boolean;    // Search recursively
  files?: string[];       // Filter by file patterns
  exclude?: string[];     // Exclude file patterns
}
```

### SearchResult

```typescript
interface SearchResult {
  anchor: Cairn;
  context?: {
    before: string[];
    after: string[];
  };
}
```

### Result<T, E>

Result pattern for error handling.

```typescript
type Result<T, E = AppError> =
  | { ok: true; data: T }
  | { ok: false; error: E };
```

## Error Handling

### AppError

All errors follow a consistent structure:

```typescript
interface AppError {
  code: ErrorCode;
  message: string;
  statusCode?: number;
  cause?: unknown;
}
```

### Error Codes

Common error codes:

- `file.notFound` - File or directory not found
- `file.readError` - Cannot read file
- `file.tooLarge` - File exceeds size limit
- `parse.invalidSyntax` - Invalid Cairn syntax
- `parse.missingSpace` - Missing space after :M:
- `parse.emptyPayload` - Empty context payload
- `search.noResults` - No Cairns found
- `cli.missingArgument` - Missing required argument

## CLI Programmatic Usage

```typescript
import { CLI } from '@cairn/core';

const cli = new CLI();
await cli.run(); // Parses process.argv
```

## Examples

### Basic Parsing

```typescript
import { CairnParser } from '@cairn/core';

const code = `
// :M: ctx implement validation
function validate(input: string) {
  // :M: ctx
  return input;
}
`;

const result = CairnParser.parseWithResult(code);
if (result.ok) {
  console.log(`Found ${result.data.anchors.length} cairns`);
}
```

### Search with Context

```typescript
import { CairnSearch } from '@cairn/core';

const result = await CairnSearch.searchWithResult(['src/'], {
  contexts: ['security'],
  context: 3
});

if (result.ok) {
  result.data.forEach(item => {
    console.log(`\n${item.anchor.file}:${item.anchor.line}`);
    console.log('Before:', item.context?.before.join('\n'));
    console.log('>>> ' + item.anchor.raw);
    console.log('After:', item.context?.after.join('\n'));
  });
}
```

### Error Handling Example

```typescript
import { CairnSearch, isAppError } from '@cairn/core';

const result = await CairnSearch.searchWithResult(['missing-dir/']);

if (!result.ok) {
  switch (result.error.code) {
    case 'file.notFound':
      console.error('Directory not found');
      break;
    case 'search.noResults':
      console.log('No Cairns found');
      break;
    default:
      console.error(`Error: ${result.error.message}`);
  }
}
```