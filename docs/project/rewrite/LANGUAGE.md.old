# Waymark Language Guide
<!-- :M: tldr Guidelines for writing about waymark syntax and tooling -->

This guide helps maintain consistent language when writing about waymark.

## Core Distinction

**Waymark syntax** is passive and flexible - it defines patterns but doesn't enforce them.
**Waymark tooling** is active and opinionated - it enforces specific rules and behaviors.

## Writing About Syntax

The waymark syntax is a pattern specification, not an active system. Use language that reflects this passive nature.

### Recommended Words

- **accommodates** - "The syntax accommodates different delimiter styles"
- **allows** - "The syntax allows both `:M: priority:high` and `:M: priority(high)`"
- **recognizes** - "The syntax recognizes parameterized markers"
- **accepts** - "Both forms are accepted in the syntax"
- **permits** - "The syntax permits flexible delimiter usage"
- **recommends** - "The syntax recommends using scope for clarity"

### Avoid

- ~~supports~~ - implies active system behavior
- ~~enforces~~ - syntax doesn't enforce, tools do
- ~~requires~~ - syntax is flexible, tools have requirements
- ~~validates~~ - tools validate, syntax defines

### Example

> The waymark syntax accommodates multiple delimiter styles. While `:M: config:env(prod)` is recommended for clarity, `:M: config(prod)` remains valid when context is unambiguous.

## Writing About Tooling

Waymark tools are opinionated implementations. Use prescriptive language that clearly states behavior.

### Recommended Words

- **requires** - "The CLI requires scope for config types"
- **enforces** - "The linter enforces consistent delimiter usage"
- **validates** - "The parser validates parameter syntax"
- **implements** - "The CLI implements strict parsing"
- **generates** - "The tool generates relationship graphs"

### Avoid

- ~~accommodates~~ - tools are opinionated, not flexible
- ~~allows~~ - tools have specific rules
- ~~recommends~~ - tools enforce, not suggest

### Example

> The waymark CLI enforces the `:M: priority(high)` syntax and rejects `:M: priority:high` forms. This ensures consistent parsing across the codebase.

## Key Guidelines

### The `:M:` Pattern

- Always followed by exactly one ASCII space
- Three characters for visual clarity and fast typing
- Matched with simple string search: `':M:'`

### Delimiter Rules

- **Colon (`:`)** for classifications: `priority:high`
- **Parentheses `()`** for parameters: `blocked(issue:4)`
- **Brackets `[]`** for arrays: `owner:[@alice,@bob]`

### Not Supported

- Complex object syntax within waymarks
- Regular expressions as core feature
- Structural dots (only literal dots in versions, URLs)

## Writing Examples

### Syntax Documentation

> The waymark syntax permits both explicit and implicit assignment:
> - `:M: owner:@alice` - explicit owner assignment
> - `:M: @alice` - implicit assignment (context-dependent)

### Tool Documentation

> The waymark CLI requires explicit scope markers:
> ```bash
> waymark validate ":M: config:env(prod)"  # Valid
> waymark validate ":M: config(prod)"      # Error: Missing scope
> ```

## Cross-References

When referencing between syntax and tooling:

> While the waymark syntax permits both forms, this tool enforces scoped parameters. See the syntax specification for underlying patterns.

## Common Pitfalls

❌ "Waymark supports multiple formats"
✅ "The waymark syntax accommodates multiple patterns"

❌ "The syntax requires proper formatting"
✅ "Waymark tools validate proper formatting"

❌ "The tool recommends using parentheses"
✅ "The tool enforces parenthetical parameters"