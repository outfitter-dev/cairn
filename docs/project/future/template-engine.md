# Template System with Parameter Interpolation

<!-- :ga:tldr future template engine for advanced placeholder syntax -->
<!-- :ga:meta speculative feature design for parameter interpolation -->

> **Future Feature**: This document outlines a speculative template system that may be implemented in future versions of grepa. It is not part of the current specification.

## Overview

<!-- :ga:advanced sophisticated patterns for complex use cases -->
### Template System with Parameter Interpolation

Advanced template system supporting positional parameters, named parameters with defaults, and array handling.

## Positional Parameters

```javascript
// Template Definition:
// jira: "issue(jira:$1)"

// Usage → Expansion:
// :ga:jira(PROJ-123)      → :ga:issue(jira:PROJ-123)
```

## Named Parameters with Defaults

```javascript
// Template Definition:
// assigned: "todo,owner@$owner,priority:$priority ?? medium"

// Usage → Expansion:
// :ga:assigned(owner:alice,priority:high) → :ga:todo,owner@alice,priority:high
// :ga:assigned(owner:bob)                 → :ga:todo,owner@bob,priority:medium
```

## Complex Templates with Array Handling

```javascript
// Template Definition:
// multi-block: "blocked(by:$1[*]),priority:$2"

// Usage → Expansion:
// :ga:multi-block([issue:4,issue:7],high)
// → :ga:blocked(by:issue:4,issue:7),priority:high
```

## Default Value Syntax

The `$var ?? default` syntax provides fallback values when parameters are not specified:

- `$priority ?? medium` - Uses "medium" if priority not provided
- `$owner ?? @unclaimed` - Uses "@unclaimed" if owner not specified
- `$status ?? open` - Uses "open" if status not provided

## Implementation Considerations

<!-- :ga:todo future implementation requirements -->
- Template parsing and validation engine
- Parameter interpolation with type checking
- Default value resolution system
- Array expansion mechanisms
- Template conflict detection
- Error handling for malformed templates