<!-- !tldr ::: ##wm:docs/migration/v2 Migration guide from over-specified schemas to grammar+dictionary system -->

# Waymark Schema v2 Migration Guide

## Overview

Waymark schemas have been simplified to separate **grammar** (structural rules) from **vocabulary** (markers and tags). This migration guide helps you transition from the previous over-specified schema system to the new flexible approach.

## What Changed

### Before: Over-Specified Individual Schemas
- Individual schema files for each marker (`todo.schema.json`, `fixme.schema.json`, etc.)
- Individual schema files for each tag (`fixes.schema.json`, `owner.schema.json`, etc.)
- Rigid validation with no flexibility for domain-specific markers

### After: Grammar + Dictionary System
- Single grammar schema defining structural rules
- Dictionaries defining vocabulary
- Configurable validation strictness
- Support for custom markers and tags

## Key Benefits

1. **Flexibility**: Add domain-specific markers (`quest :::` for gaming, `hypothesis :::` for research)
2. **Maintainability**: Update vocabulary without changing structural rules
3. **Extensibility**: Create custom dictionaries for your team or project
4. **Control**: Choose validation strictness (`allow`, `warn`, or `error`)

## Migration Steps

### 1. Update Configuration

Add dictionary and validation settings to your `.waymark/config.json`:

```json
{
  "dictionaries": ["base"],
  "customDictionaries": ["./waymark-dict.json"],
  "validation": {
    "customMarkers": "warn",
    "customTags": "allow"
  }
}
```

### 2. Create Custom Dictionary (Optional)

If you use custom markers or tags, create a dictionary file:

```json
{
  "$schema": "https://waymarks.dev/schema/dictionary",
  "version": "1.0.0",
  "name": "team-dictionary",
  "extends": ["base"],
  "markers": {
    "custom": [
      {
        "name": "quest",
        "description": "Game development task",
        "category": "work"
      }
    ]
  },
  "tags": {
    "simple": ["gameplay", "ui/ux"],
    "relational": [
      {
        "name": "quest",
        "pattern": "^[A-Z]+-\\d+$",
        "description": "Quest identifier"
      }
    ]
  }
}
```

### 3. Update Tooling

If you have custom tooling that validates waymarks:

**Before:**
```javascript
// Validation against individual schemas
const todoSchema = require('./spec/markers/todo.schema.json');
const fixesSchema = require('./spec/tags/fixes.schema.json');
```

**After:**
```javascript
// Validation using grammar + dictionary
const grammar = require('./spec/waymark-grammar.schema.json');
const dictionary = require('./dictionaries/base.dictionary.json');

// Apply validation based on config settings
const config = require('./.waymark/config.json');
const validationMode = config.validation.customMarkers; // "allow" | "warn" | "error"
```

### 4. Review Validation Settings

Choose appropriate validation modes for your project:

- **New Projects**: Start with `"allow"` for flexibility
- **Established Projects**: Use `"warn"` to catch typos while allowing innovation
- **Strict Projects**: Use `"error"` to enforce consistency

## Common Scenarios

### Adding Domain-Specific Markers

```json
// Game development dictionary
{
  "markers": {
    "custom": [
      { "name": "quest", "description": "Quest or mission task" },
      { "name": "boss", "description": "Boss fight implementation" },
      { "name": "loot", "description": "Loot system work" }
    ]
  }
}
```

### Enforcing Company Standards

```json
// Strict validation for established teams
{
  "validation": {
    "customMarkers": "error",  // Only allow dictionary markers
    "customTags": "warn"       // Warn on non-standard tags
  }
}
```

### Gradual Migration

1. Start with `"warn"` mode to identify custom usage
2. Add frequently used custom markers/tags to dictionary
3. Switch to `"error"` mode when ready

## Breaking Changes

### Removed Files
- `/spec/markers/*.schema.jsonc` (individual marker schemas)
- `/spec/tags/*.schema.jsonc` (most individual tag schemas)

### API Changes
- Schema validation now requires both grammar and dictionary
- Configuration file supports new `dictionaries` and `validation` sections

## Backwards Compatibility

The base dictionary includes all v1.0 markers and tags, so existing waymarks remain valid. Only the validation approach has changed.

## Need Help?

- See the [grammar schema](../packages/schema/src/spec/waymark-grammar.schema.json) for structural rules
- See the [base dictionary](../packages/schema/src/dictionaries/base.dictionary.json) for standard vocabulary
- Check [waymark-dictionary.schema.json](../packages/schema/src/spec/waymark-dictionary.schema.json) for custom dictionary structure

## Examples

### Research Project
```json
{
  "dictionaries": ["base"],
  "customDictionaries": ["./research-dictionary.json"],
  "validation": {
    "customMarkers": "allow",  // Allow experimentation
    "customTags": "allow"
  }
}
```

### Enterprise Project
```json
{
  "dictionaries": ["base", "enterprise"],
  "validation": {
    "customMarkers": "error",  // Strict enforcement
    "customTags": "warn"       // Some flexibility for tags
  }
}
```

The new system provides the structure you need while giving you the flexibility to adapt waymarks to your specific domain and workflow.