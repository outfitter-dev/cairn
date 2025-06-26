<!-- !!tldr ::: ##wm:schema Canonical source of truth for the waymark language specification @waymark/schema -->
# @waymark/schema

This package is the canonical source of truth for the Waymark language specification. It contains the modular JSON Schema fragments that define all valid Waymark patterns, including markers, tags, signals, and actors.

## Purpose

The primary purpose of this package is to provide a single, versionable, and distributable definition of the Waymark language. All tools in the Waymark ecosystem (parsers, linters, IDE extensions, etc.) should consume this schema to ensure they operate on the same, consistent understanding of the language.

### Design Philosophy

1. **Separation of Concerns**: Grammar (syntax) is separate from vocabulary (markers/tags)
2. **Progressive Enhancement**: Core patterns are required, extensions are optional
3. **Tool Flexibility**: Different tools can support different levels of the spec
4. **Greppability**: All patterns must remain searchable with standard tools

## Structure

The schema is organized into logical groups in [`src/spec/`](./src/spec/):

```
spec/
├── core/                          # Core waymark definitions
│   ├── grammar.schema.json        # Syntax rules (how waymarks are structured)
│   ├── dictionary.schema.json     # Vocabulary schema (for dictionaries)
│   ├── extensions.schema.json     # Extension point framework
│   └── custom-definitions.schema.json  # Rules for custom markers/tags
├── extensions/                    # Grammar extension points
│   ├── array-patterns.schema.json # Alternative array syntaxes
│   └── README.md                  # Extension documentation
├── helpers/                       # Utilities and tooling support
│   ├── grep-patterns.schema.json  # Ripgrep patterns for searching
│   └── README.md                  # Helper documentation
├── runtime/                       # Runtime representations
│   ├── node.schema.json          # Parsed waymark structure
│   └── location.schema.json      # Source location tracking
├── config.schema.json            # Project configuration
└── index.schema.json             # Main entry point
```

### Key Components

- **Core**: The fundamental waymark specification - grammar rules, dictionary structure, and custom validation
- **Extensions**: Optional patterns that extend the base grammar (e.g., alternative array syntaxes)
- **Helpers**: Utilities like grep patterns that support waymark tooling but aren't part of the spec
- **Runtime**: Schemas for representing parsed waymarks in memory
- **Config**: Project-specific settings including dictionaries, validation modes, and custom rules

## Building the Schema

The individual schema fragments are not meant to be consumed directly. A build process is required to combine them into a single, dereferenced, and easily consumable file.

To build the schema, run the following command from the package's directory or use the workspace-level pnpm filter:

```bash
# From the workspace root
pnpm run --filter @waymark/schema build
```

This command executes the [`src/build.ts`](./src/build.ts) script, which generates the final, bundled schema at `dist/waymark-base.schema.json`.

## Issue Reference Support

The schema supports issue references that work with any project management system through simple patterns and optional configuration.

### Supported Formats

Issue references follow three basic patterns that cover all common systems:

- **Numeric**: `#123`, `#4567` (GitHub, GitLab, Azure, internal task numbers)
- **Prefix-dash**: `#ENG-123`, `#SUP-456` (Linear, JIRA, most custom systems)  
- **Prefix-number**: `#BUG123`, `#TASK456` (some custom systems)

### Optional Configuration

Create a simple `waymark.config.json` in your project root:

```json
{
  "$schema": "https://waymarks.dev/schema/config",
  "version": "1.0",
  "issues": {
    "url": "https://github.com/owner/repo/issues/{id}"
  }
}
```

**Other examples:**

```json
// JIRA
{"version": "1.0", "issues": {"url": "https://company.atlassian.net/browse/{id}"}}

// Linear  
{"version": "1.0", "issues": {"url": "https://linear.app/team/issue/{id}"}}

// Internal docs (for task management systems)
{"version": "1.0", "issues": {"docs": "./docs/tasks.md"}}

// No config needed - issues still validate, just no URL generation
{"version": "1.0"}
```

### Usage in Waymarks

All standard issue formats work automatically:

```javascript
// ✅ All valid - automatic pattern recognition
// todo ::: fix auth bug #fixes:#123
// fixme ::: memory leak #blocks:#ENG-456  
// review ::: security issue #see:#SUP-789
// note ::: task documented #refs:#TASK123
```

## Consuming the Schema

The built schema is the main entry point for this package, as defined in `package.json`. Tools can consume it by referencing this package's `main` file.

```javascript
import waymarkSchema from '@waymark/schema';
// Or: const waymarkSchema = require('@waymark/schema');
```

### Individual Schemas

For advanced use cases, you can import specific schemas:

```javascript
// Grammar rules only
import grammar from '@waymark/schema/spec/core/grammar.schema.json';

// Base dictionary
import baseDict from '@waymark/schema/dictionaries/base.dictionary.json';

// Grep patterns for searching
import grepPatterns from '@waymark/schema/spec/helpers/grep-patterns.schema.json';
```

## Extension Points

The waymark grammar defines extension points where alternative patterns are explicitly valid:

### Array Patterns

Base pattern (required):
```javascript
// todo ::: notify team #cc:@alice,@bob,@charlie
```

Extension patterns (optional):
```javascript
// Bracketed: #deps:[lodash react typescript]
// Parentheses: #affects:(api, frontend, mobile)
// Quoted: #tasks:"Bug fix, Performance, Features"
// Object-like: #config:{env:prod, debug:false}
// Pipeline: #flow:[build -> test -> deploy]
// Angle brackets: #cc:<alice bob charlie>
// Pipe-separated: #env:prod|staging|dev
// Semicolon: #deps:lodash;react;typescript
// JSON array: #cases:["happy","edge","error"]
// Range: #ports:8000..8005
// Plus-separated: #flags:read+write+delete
```

Tools declare their support level for extensions.

## Dictionaries

The schema system separates grammar from vocabulary:

- **Grammar**: Defines waymark structure (core/grammar.schema.json)
- **Dictionary**: Defines valid markers and tags (dictionaries/base.dictionary.json)
- **Custom**: Anything not in dictionaries follows custom definition rules

### Validation Modes

```json
{
  "validation": {
    "customMarkers": "warn",  // "allow" | "warn" | "error"
    "customTags": "allow"      // "allow" | "warn" | "error"
  }
}
```

## Grep Patterns

The schema includes comprehensive ripgrep patterns for searching waymarks:

```javascript
import grepPatterns from '@waymark/schema/spec/helpers/grep-patterns.schema.json';

// Get pattern for finding critical todos
const pattern = grepPatterns.markers.specific.variants.critical; // "!!todo\\s+:::"

// Get pattern for finding values in bracketed arrays
const arrayPattern = grepPatterns.arrays.bracketed.pattern; // "#\\w+:\\[[^\\]]*react[^\\]]*\\]"
```

Common patterns included:
- Basic waymark searches
- Marker-specific queries (with signals)
- Actor assignments
- Tag searches (simple and relational)
- Array value queries (all formats)
- Complex combined patterns

## Custom Definitions

Control what custom markers and tags are allowed:

```json
{
  "customDefinitions": "standard",  // or "strict" or "liberal"
  // Or detailed rules:
  "customDefinitions": {
    "customMarkers": {
      "minLength": 3,
      "maxLength": 20,
      "forbiddenPrefixes": ["wm", "_"]
    },
    "customTags": {
      "simple": {
        "allowHierarchical": true
      },
      "forbiddenTags": ["priority:*", "assigned-to:*"]
    }
  }
}
```