# @grepa/core

Core parser and utilities for grep-anchors.

## Installation

```bash
npm install @grepa/core
# or
pnpm add @grepa/core
```

## Usage

```typescript
import { parseAnchors, findFiles, lintAnchors, resolveConfig } from '@grepa/core';

// Parse anchors from content
const anchors = parseAnchors(
  fileContent,
  'src/example.ts',
  { includeComment: true }
);

// Find files to scan
const files = findFiles(
  process.cwd(),
  ['**/*.ts', '**/*.js'],
  ['**/node_modules/**']
);

// Load configuration
const config = resolveConfig();

// Lint anchors
const result = lintAnchors(anchors, config);
if (!result.passed) {
  console.error('Lint violations:', result.violations);
}
```

## API

### `parseAnchors(content, filePath, options?)`

Parse grep-anchors from text content.

- `content` - File content to parse
- `filePath` - Path to the file
- `options.anchor` - Override anchor sigil (default: `:ga:`)
- `options.includeComment` - Include comment text after anchor

Returns: `Anchor[]`

### `findFiles(rootPath, include?, exclude?)`

Find files matching patterns with gitignore support.

- `rootPath` - Root directory to search
- `include` - Glob patterns to include
- `exclude` - Glob patterns to exclude

Returns: `string[]` (file paths)

### `resolveConfig(configPath?, envAnchor?)`

Load and merge configuration with defaults.

- `configPath` - Path to config file
- `envAnchor` - Environment variable override

Returns: `Config`

### `lintAnchors(anchors, config)`

Run lint rules on anchors.

- `anchors` - Anchors to lint
- `config` - Configuration with lint rules

Returns: `LintResult`

## Types

```typescript
interface Anchor {
  raw: string;        // Full anchor text
  tokens: Token[];    // Parsed tokens
  line: number;       // Line number
  file: string;       // File path
  comment?: string;   // Comment text
}

interface Config {
  anchor?: string;
  files?: {
    include?: string[];
    exclude?: string[];
  };
  lint?: {
    forbid?: string[];
    maxAgeDays?: number;
    versionField?: string;
  };
  dictionary?: Record<string, string>;
}
```

## License

MIT