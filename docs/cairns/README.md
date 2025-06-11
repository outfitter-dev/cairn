# Cairns Notation
<!-- :M: tldr Technical specification for Cairns notation format -->
<!-- :M: notation Core notation documentation and format rules -->

The technical specification for Cairns notation - a lightweight marking system for code navigation.

## What is Cairns Notation?

Cairns notation is the **format** for writing searchable code markers. It defines:
- How to write the `:M:` marker with mandatory single space
- Delimiter semantics (`:` for classifications, `()` for parameters, `[]` for arrays)
- Marker organization into six semantic groups

Think of it like learning to write musical notes - the notation is simple and consistent, while what you compose with it (conventions) can be infinitely varied.

## Core Format

```
<comment-leader> :M: <space> <context-list> <optional prose>
```

The notation consists of:
1. **Identifier**: `:M:` (or custom like `:proj:`)
2. **Space**: Exactly one ASCII space (mandatory)
3. **Contexts**: One or more contexts with optional parameters
4. **Prose**: Optional human-readable description

## Quick Examples

```javascript
// :M: todo                      // Simple marker
// :M: sec,perf                  // Multiple markers
// :M: todo(priority:high)       // Marker with parameter
// :M: owner:@alice              // Classification with mention
// :M: blocked:[4,7]             // Array of values
// :M: todo: implement caching   // With prose description
```

## Learn More

- [Specification](./SPEC.md) - Complete notation specification
- [Payload Types](./payloads.md) - Parameter and value structures
- [Examples](./examples.md) - Notation in practice
- [Language Guide](./LANGUAGE.md) - How to write about Cairns

## Key Principles

> **Cairns** = The notation system (`:M:` with specific syntax)
> **Cairn** = The tooling that understands and processes Cairns
> 
> Notation defines **how** to write cairns.
> Conventions define **what** to write and **when**.
