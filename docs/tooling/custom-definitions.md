<!-- tldr ::: ##wm:docs/custom-definitions How custom markers and tags are validated beyond standard dictionaries -->

# Custom Definitions

Waymark allows teams to create custom markers and tags beyond the standard vocabulary. The custom definitions system provides guardrails to ensure these extensions remain greppable and maintainable.

## How It Works

1. **Standard Dictionary**: Contains official waymark markers and tags
2. **Custom Dictionary**: Your project-specific vocabulary (optional)  
3. **Custom Definitions**: Rules for anything not in the above dictionaries

When waymark encounters a marker or tag not in any loaded dictionary:
- With `validation.customMarkers: "allow"` - Anything goes
- With `validation.customMarkers: "warn"` - Check against custom definition rules
- With `validation.customMarkers: "error"` - Must pass custom definition rules

## Configuration

### Using Presets

The simplest approach uses predefined rulesets:

```json
{
  "version": "1.0",
  "validation": {
    "customMarkers": "warn",
    "customTags": "warn"
  },
  "customDefinitions": "standard"  // or "strict" or "liberal"
}
```

**Presets**:
- `liberal` - Very permissive, good for experimentation
- `standard` - Balanced rules (default)
- `strict` - Conservative, good for large teams

### Custom Rules

For fine-grained control:

```json
{
  "version": "1.0",
  "customDefinitions": {
    "customMarkers": {
      "minLength": 4,
      "maxLength": 15,
      "forbiddenPrefixes": ["wm", "_", "core"],
      "pattern": "^[a-z][a-z0-9]*(-[a-z0-9]+)*$"
    },
    "customTags": {
      "simple": {
        "allowHierarchical": true
      },
      "relational": {
        "namespacePattern": "^[a-z]+:[a-z][a-zA-Z0-9/._-]*$"
      },
      "forbiddenTags": ["priority:*", "assigned-to:*"]
    }
  }
}
```

## Examples

### Valid Custom Markers

With standard rules:

```javascript
// ✅ Valid custom markers
// quest ::: find the dragon's lair
// hypothesis ::: caching will improve performance  
// spike ::: research GraphQL alternatives

// ❌ Invalid custom markers
// x ::: too short (min 3 chars)
// _internal ::: forbidden prefix
// MyMarker ::: must be lowercase
// super-long-marker-name-here ::: too long
```

### Valid Custom Tags

With standard rules:

```javascript
// ✅ Valid custom tags
// todo ::: implement feature #experiment:checkout-v2
// note ::: see docs #proj:guidelines
// wip ::: refactoring #team:backend #sprint:42

// ✅ Valid namespace patterns
// notice ::: breaking change #api:v2/breaking
// todo ::: fix bug #wm:fix/validation
// idea ::: new feature #exp:ml/recommendations

// ❌ Invalid custom tags  
// todo ::: task #priority:high      // Forbidden - use signals
// todo ::: work #assigned-to:alice  // Forbidden - use @alice
```

## Custom Definition Rules

### Marker Rules

- **Pattern**: Must match regex (default: lowercase with hyphens)
- **Length**: Between min and max characters
- **Forbidden Prefixes**: Reserved for future use
- **Guidelines**: Human-readable best practices

### Tag Rules

**Simple Tags**:
- Pattern matching for valid tag names
- Optional hierarchical support (with `/`)

**Relational Tags**:
- Key pattern for tag names
- Allowed value types (string, number, reference, etc.)
- Namespace pattern for `prefix:path` style tags

**Forbidden Patterns**:
- Tags that duplicate core waymark functionality
- Common anti-patterns

## Integration

The custom definitions schema integrates with:

1. **Validation Modes**: Control strictness per project
2. **Custom Dictionaries**: Define your approved vocabulary
3. **Tooling**: Linters and parsers respect these rules

## Best Practices

1. **Start Liberal**: Begin with permissive rules and tighten as needed
2. **Document Custom Usage**: Keep a WAYMARK-CUSTOM.md file
3. **Use Namespaces**: Prefix custom tags to avoid collisions
4. **Regular Reviews**: Audit custom markers/tags quarterly

## See Also

- [Custom Tags Pattern Guide](../usage/patterns/custom-tags.md)
- [Configuration Schema](../schema/config.schema.json)
- [Dictionary Schema](../schema/dictionary.schema.json)