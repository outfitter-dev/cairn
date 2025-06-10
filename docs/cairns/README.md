# Magic Anchors Notation
<!-- :A: tldr Technical specification for Magic Anchors notation format -->
<!-- :A: notation Core notation documentation and format rules -->

The technical specification for Magic Anchors notation - a lightweight marking system for code navigation.

## What is Magic Anchors Notation?

Magic Anchors notation is the **format** for writing searchable code markers. It defines:
- How to write the `:A:` marker with mandatory single space
- Delimiter semantics (`:` for classifications, `()` for parameters, `[]` for arrays)
- Marker organization into six semantic groups

Think of it like learning to write musical notes - the notation is simple and consistent, while what you compose with it (conventions) can be infinitely varied.

## Core Format

```
<comment-leader> :A: <space> <marker-list> <optional prose>
```

The notation consists of:
1. **Sigil**: `:A:` (or custom like `:proj:`)
2. **Space**: Exactly one ASCII space (mandatory)
3. **Markers**: One or more markers with optional parameters
4. **Prose**: Optional human-readable description

## Quick Examples

```javascript
// :A: todo                      // Simple marker
// :A: sec,perf                  // Multiple markers
// :A: todo(priority:high)       // Marker with parameter
// :A: owner:@alice              // Classification with mention
// :A: blocked:[4,7]             // Array of values
// :A: todo: implement caching   // With prose description
```

## Learn More

- [Specification](./SPEC.md) - Complete notation specification
- [Payload Types](./payloads.md) - Parameter and value structures
- [Examples](./examples.md) - Notation in practice
- [Language Guide](./LANGUAGE.md) - How to write about Magic Anchors

## Key Principles

> **Magic Anchors** = The notation system (`:A:` with specific syntax)
> **Grepa** = The tooling that understands and processes Magic Anchors
> 
> Notation defines **how** to write anchors.
> Conventions define **what** to write and **when**.
