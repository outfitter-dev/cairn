<!-- :A: tldr API reference documentation for Grepa library -->

# Grepa API Reference

## Installation

```bash
npm install grepa
# or
pnpm add grepa
```

## Core Modules

### MagicAnchorParser

Parser for Magic Anchor syntax (`:A: marker prose`).

```typescript
import { MagicAnchorParser } from 'grepa';
```

#### Parser Methods

##### `parse(content: string, filename?: string): ParseResult`

Parse content for Magic Anchors (legacy sync method).

```typescript
const result = MagicAnchorParser.parse(fileContent, 'example.ts');
console.log(result.anchors); // Array of MagicAnchor objects
console.log(result.errors);  // Array of ParseError objects
```

##### `parseWithResult(content: string, filename?: string): Result<ParseResult>`

Parse content using Result pattern for better error handling.

```typescript
const result = MagicAnchorParser.parseWithResult(fileContent);
if (result.ok) {
  console.log(result.data.anchors);
} else {
  console.error(result.error);
}
```

##### `findByMarker(anchors: MagicAnchor[], marker: string): MagicAnchor[]`

Find anchors containing a specific marker.

```typescript
const todoAnchors = MagicAnchorParser.findByMarker(anchors, 'todo');
```

### GrepaSearch

Search functionality for finding Magic Anchors across files.

```typescript
import { GrepaSearch } from 'grepa';
```

#### Search Methods

##### `search(patterns: string[], options?: SearchOptions): SearchResult[]`

Search files for anchors (legacy sync method).

```typescript
const results = GrepaSearch.search(['src/**/*.ts'], {
  markers: ['todo', 'security'],
  context: 2,
  recursive: true
});
```

##### `searchWithResult(patterns: string[], options?: SearchOptions): Promise<Result<SearchResult[]>>`

Search with Result pattern and async support.

```typescript
const result = await GrepaSearch.searchWithResult(['src/'], {
  markers: ['todo']
});

if (result.ok) {
  result.data.forEach(item => {
    console.log(`${item.anchor.file}:${item.anchor.line}`);
    console.log(item.anchor.markers);
  });
}
```

##### `getUniqueMarkers(results: SearchResult[]): string[]`

Extract all unique markers from search results.

```typescript
const markers = GrepaSearch.getUniqueMarkers(results);
// ['todo', 'security', 'api', ...]
```

##### `groupByMarker(results: SearchResult[]): Record<string, SearchResult[]>`

Group search results by marker.

```typescript
const grouped = GrepaSearch.groupByMarker(results);
console.log(grouped.todo);     // All results with 'todo' marker
console.log(grouped.security); // All results with 'security' marker
```

## Types

### MagicAnchor

```typescript
interface MagicAnchor {
  line: number;        // Line number (1-indexed)
  column: number;      // Column number (1-indexed)
  raw: string;         // Original line content
  markers: string[];   // Array of markers
  prose?: string;      // Optional prose description
  file?: string;       // File path (if provided)
}
```

### SearchOptions

```typescript
interface SearchOptions {
  markers?: string[];    // Filter by specific markers
  context?: number;      // Number of context lines
  recursive?: boolean;   // Search recursively
  files?: string[];      // Filter by file patterns
  exclude?: string[];    // Exclude file patterns
}
```

### SearchResult

```typescript
interface SearchResult {
  anchor: MagicAnchor;
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
- `parse.invalidSyntax` - Invalid Magic Anchor syntax
- `parse.missingSpace` - Missing space after :A:
- `parse.emptyPayload` - Empty anchor payload
- `search.noResults` - No anchors found
- `cli.missingArgument` - Missing required argument

## CLI Programmatic Usage

```typescript
import { CLI } from 'grepa';

const cli = new CLI();
await cli.run(); // Parses process.argv
```

## Examples

### Basic Parsing

```typescript
import { MagicAnchorParser } from 'grepa';

const code = `
// :A: todo implement validation
function validate(input: string) {
  // :A: security check for SQL injection
  return input;
}
`;

const result = MagicAnchorParser.parseWithResult(code);
if (result.ok) {
  console.log(`Found ${result.data.anchors.length} anchors`);
}
```

### Search with Context

```typescript
import { GrepaSearch } from 'grepa';

const result = await GrepaSearch.searchWithResult(['src/'], {
  markers: ['security'],
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
import { GrepaSearch, isAppError } from 'grepa';

const result = await GrepaSearch.searchWithResult(['missing-dir/']);

if (!result.ok) {
  switch (result.error.code) {
    case 'file.notFound':
      console.error('Directory not found');
      break;
    case 'search.noResults':
      console.log('No Magic Anchors found');
      break;
    default:
      console.error(`Error: ${result.error.message}`);
  }
}
```