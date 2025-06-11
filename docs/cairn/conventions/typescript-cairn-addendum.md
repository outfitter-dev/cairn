# TypeScript Conventions – Cairn Addendum

<!-- :M: tldr Cairn-specific TypeScript conventions and adaptations -->

This document extends the base TypeScript conventions with Cairn-specific patterns.

## Cairn-Specific Error Codes

```typescript
export type CairnErrorCode =
  // File-system errors
  | 'file.notFound'          // File or directory not found
  | 'file.readError'         // Cannot read file
  | 'file.writeError'        // Cannot write file
  | 'file.accessDenied'      // Permission denied

  // Parsing errors
  | 'parse.invalidContext'   // Invalid context syntax
  | 'parse.missingSpace'     // Missing space after :M:
  | 'parse.emptyContexts'    // No contexts provided

  // Search errors
  | 'search.noResults'       // No cairns found
  | 'search.tooManyResults'  // Result limit exceeded
  | 'search.invalidPattern'  // Invalid search pattern

  // CLI errors
  | 'cli.missingArgument'    // Required argument missing
  | 'cli.invalidCommand'     // Unknown command
  | 'cli.invalidOption'      // Invalid option value

  // Generic errors (from base)
  | 'validation'             // Schema validation failure
  | 'unexpected';            // Unhandled error
```

## Cairn Type Guards

```typescript
// Check if a line contains a Cairn
export function hasCairn(line: string): boolean {
  return line.includes(':M: ');
}

// Type guard for valid context
// Allows: todo, priority:high, owner:@alice, blocked:[4,7], issue(123)
export function isValidContext(context: string): boolean {
  return /^[a-zA-Z0-9_@:,\[\]-]+(\([^)]*\))?$/.test(context);
}

// Type guard for parameterised context
export function isParameterizedContext(
  context: string
): context is `${string}(${string})` {
  return context.includes('(') && context.includes(')');
}
```

## Cairn-Specific Patterns

### 1. File-System Operations

Always use the Result pattern for file operations:

```typescript
async function readFileWithResult(path: string): Promise<Result<string>> {
  return tryAsync(() => fs.promises.readFile(path, 'utf-8'), 'file.readError');
}
```

### 2. Cairn Validation

Use composed schemas for cairn validation:

```typescript
const contextSchema = z
  .string()
  .min(1, 'Context cannot be empty')
  .max(50, 'Context too long')
  .regex(/^[a-zA-Z0-9_@-]+(\([^)]*\))?$/, 'Invalid context format');

const cairnPayloadSchema = z
  .string()
  .refine(
    (payload) => payload.trim().length > 0,
    'Payload must contain non-whitespace characters'
  );
```

### 3. Search Pattern Composition

Utility types for search options:

```typescript
// Base search options
interface BaseSearchOptions {
  recursive?: boolean;
  respectGitignore?: boolean;
}

// Context-specific search
interface ContextSearchOptions extends BaseSearchOptions {
  contexts: string[];
  contextLines?: number;
}

// File-specific search
interface FileSearchOptions extends BaseSearchOptions {
  files?: string[];
  exclude?: string[];
}

// Combined search options
type SearchOptions = ContextSearchOptions | FileSearchOptions;
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

    // Execute search…
  }
}
```

## Naming Conventions

- **Files**: kebab-case (`cairn-parser.ts`)
- **Classes**: PascalCase (`CairnParser`)
- **Interfaces**: prefix with ‘I’ only for service contracts (`ISearchService`)
- **Type aliases**: PascalCase (`SearchResult`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_EXTENSIONS`)
- **Cairns**: always refer to them as “Cairns”, not “anchors” or “markers”, in code and docs.

## Testing Patterns

```typescript
// Use Result pattern in tests
describe('CairnParser', () => {
  it('should parse valid cairn', () => {
    const result = CairnParser.parseWithResult('// :M: todo implement');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.cairns).toHaveLength(1);
      expect(result.data.cairns[0].contexts).toContain('todo');
    }
  });
});
```

## Integration with Base Conventions

1. **Always use Result<T>** for operations that can fail  
2. **Map file-system errors** to the appropriate CairnErrorCode  
3. **Use type guards** before type assertions  
4. **Compose schemas** for validation  
5. **Export types** from `@cairn/types` package  

## Future Considerations

As Cairn evolves, consider:  
- Stream-based file processing for large codebases  
- Async iterators for search results  
- Worker threads for parallel parsing  
- WebAssembly for performance-critical parsing