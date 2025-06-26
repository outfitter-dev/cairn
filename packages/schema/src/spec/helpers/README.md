<!-- tldr ::: ##wm:schema/helpers Helper schemas and utilities for waymark tooling @waymark/schema -->

# Waymark Helper Schemas

This directory contains helper schemas that support waymark tooling and usage, but aren't part of the core specification.

## Contents

### `grep-patterns.schema.json`

Comprehensive ripgrep patterns for querying waymark components. Includes:
- Basic waymark patterns
- Marker-specific searches
- Actor queries
- Tag patterns (simple and relational)
- Array value searches (all formats)
- Complex query combinations
- Analysis and extraction patterns

These patterns are designed to be:
- **Tool-consumable**: Tools can read and use these patterns
- **Position-aware**: Account for `:::` placement
- **Format-specific**: Different patterns for different array formats
- **Copy-paste ready**: Use directly with ripgrep

## Philosophy

Helper schemas:
- Support tooling and development workflows
- Don't define waymark structure or validation
- Can be updated without affecting core spec
- Provide practical utilities for working with waymarks

## Future Helpers

Potential additions:
- `editor-snippets.schema.json` - IDE snippet definitions
- `conversion-rules.schema.json` - Migration patterns
- `statistics.schema.json` - Analysis query templates
- `visualization.schema.json` - Graph/chart definitions

## Usage

Tools can reference these helpers:
```javascript
const grepPatterns = require('./spec/helpers/grep-patterns.schema.json');
const pattern = grepPatterns.arrays.bracketed.queryPatterns.contains;
// Use pattern for searching...
```

But they're optional - core waymark functionality doesn't depend on them.