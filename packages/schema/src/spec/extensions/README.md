<!-- tldr ::: ##wm:schema/extensions Waymark grammar extension points and how they work @waymark/schema -->
# Waymark Extensions

This directory contains schemas for waymark grammar extension points - places where the grammar explicitly allows alternative patterns beyond the core specification.

## Philosophy

1. **Core is Required**: Base patterns that all tools MUST support
2. **Extensions are Optional**: Alternative patterns that tools MAY support  
3. **All Patterns are Valid**: Extensions aren't "wrong", just optional
4. **Greppability is Sacred**: All patterns must remain searchable
5. **Progressive Enhancement**: Tools can support patterns at different levels

## Current Extensions

### Array Patterns (`array-patterns.schema.json`)

Defines alternative ways to express array values beyond the base comma-separated pattern.

**Base (Required)**: `#cc:@alice,@bob,@charlie`

**Extensions (Optional)**:
- Bracketed: `#deps:[lodash react typescript]`
- Parentheses: `#affects:(api, frontend, mobile)`
- Quoted: `#tasks:"Bug fix, Performance, Features"`
- Object-like: `#config:{env:prod, debug:false}`
- Pipeline: `#flow:[build -> test -> deploy]`

## Adding New Extensions

To add a new extension point:

1. Create a schema file in this directory
2. Update `core/extensions.schema.json` to reference it
3. Document the extension patterns and use cases
4. Ensure all patterns remain greppable

## Tool Support

Tools declare their extension support:

```json
{
  "waymarkSupport": {
    "version": "1.0",
    "extensions": {
      "arrayPatterns": {
        "base": "full",
        "bracketed": "full",
        "parentheses": "basic",
        "quoted": "none"
      }
    }
  }
}
```

## See Also

- [Extension Points Documentation](../../docs/syntax/extension-points.md)
- [Core Grammar](../core/grammar.schema.json)
- [Extensions Schema](../core/extensions.schema.json)