# Waymark Syntax
<!-- :M: tldr Technical specification for waymark syntax -->
<!-- :M: syntax Core syntax documentation and rules -->

The technical specification for waymark syntax - a lightweight marking system for code navigation.

## What is Waymark Syntax?

Waymark syntax is the **structure** for writing searchable code markers. It defines:

- How to write the `:M:` marker with mandatory single space
- Delimiter semantics (`:` for classifications, `()` for parameters, `[]` for arrays)
- Context organization into six semantic groups

Think of it like learning to write musical notes - the syntax is simple and consistent, while what you compose with it (conventions) can be infinitely varied.

## Core Syntax

```text
<comment-leader> :M: <space> <context-list> <optional prose>
```

The syntax consists of:

1. **Identifier**: `:M:`
2. **Space**: Exactly one ASCII space (mandatory)
3. **Contexts**: One or more contexts with optional parameters
4. **Prose**: Optional human-readable description

## Quick Examples

```javascript
// :M: todo                      // Simple context
// :M: sec,perf                  // Multiple contexts
// :M: todo(priority:high)       // Context with parameter
// :M: owner:@alice              // Classification with mention
// :M: blocked:[4,7]             // Array of values
// :M: todo: implement caching   // With prose description
```

## Learn More

- [Specification](./SPEC.md) - Complete syntax specification.
- [Payload Types](./payloads.md) - Parameter and value structures.
- [Examples](./examples.md) - Syntax in practice.
- [Language Guide](../project/LANGUAGE.md) - How to write about waymarks
