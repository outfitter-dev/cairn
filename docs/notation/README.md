# Grepa Notation

The technical specification for grep-anchor notation - a lightweight marking system for code documentation.

## What is Notation?

Grepa notation is the **format** for writing grep-anchors. It defines:
- How to write the `:ga:` marker
- What types of payloads are valid
- How to structure multiple values

Think of it like learning to write musical notes - the notation is simple and consistent, while what you compose with it (conventions) can be infinitely varied.

## Core Format

```
<comment-leader> :ga:payload
```

The notation consists of:
1. **Sigil**: `:ga:` (or custom like `:proj:`)
2. **Payload**: One or more tokens

## Quick Examples

```javascript
// :ga:todo                     // Bare token
// :ga:sec,perf                 // Multiple tokens
// :ga:@alice                   // Mention token
// :ga:{"priority": "high"}     // JSON metadata
// :ga:[v1.0, v1.1]            // Array notation
```

## Learn More

- [Format Specification](./format.md) - Detailed format rules
- [Payload Types](./payloads.md) - Token structures
- [Examples](./examples.md) - Notation in practice

## Key Principle

> Notation defines **how** to write grep-anchors.
> Conventions define **what** to write and **when**.