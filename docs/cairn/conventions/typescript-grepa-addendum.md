# TypeScript Conventions - Cairn Addendum

<!-- :M: tldr Cairn-specific TypeScript conventions and adaptations -->

This document extends the base TypeScript conventions with Cairn-specific patterns.

## Cairn-Specific Error Codes

```typescript
export type CairnErrorCode =
  // File system errors
  | 'file.notFound'        // File or directory not found
  | 'file.readError'       // Cannot read file
  | 'file.writeError'      // Cannot write file
  | 'file.accessDenied'    // Permission denied
  
  // Parsing errors
  | 'parse.invalidAnchor'  // Invalid Magic Anchor syntax
  | 'parse.missingSpace'   // Missing space after :M:
  | 'parse.emptyMarkers'   // No markers provided
  
  // Search errors
  | 'search.noResults'     // No anchors found
  | 'search.tooManyResults'// Result limit exceeded
  | 'search.invalidPattern'// Invalid search pattern
  
  // CLI errors
  | 'cli.missingArgument'  // Required argument missing
  | 'cli.invalidCommand'   // Unknown command
  | 'cli.invalidOption'    // Invalid option value
  
  // Generic errors (from base)
  | 'validation'           // Schema validation failure
  | 'unexpected';          // Unhandled error
```

## Magic Anchor Type Guards

```typescript
// Check if a line contains a Magic Anchor
export function hasMagicAnchor(line: string): boolean {
  return line.includes(':M: ');
}

// Type guard for valid marker
export function isValidMarker(marker: string): boolean {
  return /^[a-zA-Z0-9_@-]+(\([^)]*\))?$/.test(marker);
}

// Type guard for parameterized marker
export function isParameterizedMarker(marker: string): marker is `${string}(${string})` {
  return marker.includes('(') && marker.includes(')');
}
```

## Grepa-Specific Patterns

### 1. File System Operations

Always use Result pattern for file operations:

```typescript
async function readFileWithResult(path: string): Promise<Result<string>> {
  return tryAsync(
    () => fs.promises.readFile(path, 'utf-8'),
    'file.readError'
  );
}
```

### 2. Magic Anchor Validation

Use composed schemas for anchor validation:

```typescript
const markerSchema = z.string()
  .min(1, 'Marker cannot be empty')
  .max(50, 'Marker too long')
  .regex(/^[a-zA-Z0-9_@-]+(\([^)]*\))?$/, 'Invalid marker format');

const anchorPayloadSchema = z.string()
  .refine(payload => payload.trim().length > 0, 
    'Payload must contain non-whitespace characters');
```

### 3. Search Pattern Composition

Use utility types for search options:

```typescript
// Base search options
interface BaseSearchOptions {
  recursive?: boolean;
  respectGitignore?: boolean;
}

// Marker-specific search
interface MarkerSearchOptions extends BaseSearchOptions {
  markers: string[];
  context?: number;
}

// File-specific search
interface FileSearchOptions extends BaseSearchOptions {
  files?: string[];
  exclude?: string[];
}

// Combined search options
type SearchOptions = MarkerSearchOptions | FileSearchOptions;
```

### 4. CLI Command Pattern

Each command should return a Result:

```typescript
interface CLICommand<T = void> {
  execute(args: string[], options: unknown): Promise<Result<T>>;
}

class SearchCommand implements CLICommand {
  async execute(args: string[], options: unknown): Promise<Result<void>> {
    // Validate options
    const validationResult = searchOptionsSchema.safeParse(options);
    if (!validationResult.success) {
      return failure(fromZod(validationResult.error));
    }
    
    // Execute search...
  }
}
```

## Naming Conventions

- **Files**: Use kebab-case for files (`magic-anchor-parser.ts`)
- **Classes**: Use PascalCase (`MagicAnchorParser`)
- **Interfaces**: Prefix with 'I' only for service interfaces (`ISearchService`)
- **Type aliases**: Use PascalCase (`SearchResult`)
- **Constants**: Use UPPER_SNAKE_CASE for true constants (`DEFAULT_EXTENSIONS`)
- **Magic Anchors**: Always refer to as "Magic Anchors" not "anchors" in types/docs

## Testing Patterns

```typescript
// Use Result pattern in tests
describe('MagicAnchorParser', () => {
  it('should parse valid anchor', () => {
    const result = CairnParser.parseWithResult('// :M: todo implement');
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.anchors).toHaveLength(1);
      expect(result.data.anchors[0].markers).toContain('todo');
    }
  });
});
```

## Integration with Base Conventions

1. **Always use Result<T>** for operations that can fail
2. **Map file system errors** to appropriate GrepaErrorCode
3. **Use type guards** before type assertions
4. **Compose schemas** for validation
5. **Export types** from @grepa/types package

## Future Considerations

As Grepa evolves, consider:
- Stream-based file processing for large codebases
- Async iterators for search results
- Worker threads for parallel parsing
- WebAssembly for performance-critical parsing