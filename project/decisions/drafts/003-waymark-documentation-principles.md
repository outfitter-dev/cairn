<!-- tldr ::: documentation principles for writing clear, engaging waymark examples -->

# ADR-003: Waymark Documentation Principles

**Status**: Draft
**Date**: 2025-06-25
**Author**: @galligan

## Context

As waymarks have evolved, we've discovered patterns for documenting them effectively. Our early documentation was functional but dry, often showing abstract patterns without concrete examples. Through iterating on ADR-002 (Search Patterns), we've identified principles that make waymark documentation both educational and engaging.

The challenge: How do we write documentation that is:

- Clear enough for newcomers to understand
- Specific enough to be immediately useful
- Generic enough to show the underlying patterns
- Engaging enough to keep readers interested

## Decision

We will adopt the following principles for all waymark documentation:

### 1. Concrete Examples First, Patterns Second

Show real examples with generic patterns as comments:

```bash
# Good - shows both specific and generic
rg ':::.*@claude'                  # Generic: rg ':::.*@name'
rg ':::.*#security'                # Generic: rg ':::.*#tag'

# Avoid - too abstract
rg ':::.*@<actor>'
rg ':::.*#<tag>'
```

### 2. Contextual Variety

Each document should have its own thematic examples that fit the context:

**Search Patterns (ADR-002)** - Developer workflow:

```javascript
// todo ::: @claude review auth logic #security
// !!fixme ::: race condition in cache refresh blocks:#2442
```

**README/Quickstart** - Relatable, slightly playful:

```javascript
// todo ::: @team-yolo ship dark mode #frontend
// !!todo ::: fix the thing that breaks on Fridays
// note ::: here be dragons #legacy #refactor
```

**Syntax Guide** - Clear teaching examples:

```javascript
// todo ::: @maya optimize query performance #database
// notice ::: breaking change in v2 #api affects:#mobile,#web
```

**Migration Guide** - Real migration scenarios:

```javascript
// Before: +backend +priority:high
// After:  !todo ::: migrate auth service #backend
```

### 3. Balance Specificity

Use this decision tree:

1. **Teaching a new concept?** → Use specific, memorable examples
2. **Showing a pattern?** → Include the generic form as a comment
3. **Demonstrating arrays/complex features?** → Be specific to show the feature clearly
4. **Risk of over-prescription?** → Use generic patterns

### 4. Character Without Cringe

**Good character** (subtle, authentic):

- `@team-yolo` - captures "ship it" energy
- `#dragon` - we all have that one module
- `fix before the demo` - real developer moments
- `#experimental` - acknowledges exploration

**Avoid** (too heavy):

- Excessive meme references
- "10x ninja rockstar" language
- Overuse of emoji
- Forced humor

### 5. Progressive Disclosure

Structure examples from simple to complex:

```javascript
// Level 1: Basic marker
// todo ::: implement user settings

// Level 2: With assignment
// todo ::: @alice implement user settings

// Level 3: With tags
// todo ::: @alice implement user settings #frontend #p1

// Level 4: With context markers
// todo ::: @alice implement user settings #frontend fixes:#1234
```

### 6. Example Rotation

Maintain a loose rotation of examples to avoid staleness:

- **Actors**: `@alice`, `@bob`, `@claude`, `@maya`, `@team-yolo`
- **Systems**: auth, cache, api, search, settings, notifications
- **Tags**: `#security`, `#performance`, `#frontend`, `#hotfix`, `#ship-it`
- **Issues**: Use realistic numbers like `#123`, `#2442`, `#789`

### 7. Show the Why

When introducing complex patterns, explain the use case:

```bash
# Find unassigned critical work (helps identify dropped balls)
rg -P '!!todo :::(?!.*owner:)'

# Find mixed references (useful in complex affects)
rg ':::.*affects:#?\\w+,#?\\w+'  # matches affects:#api,billing
```

## Consequences

### Positive

- Documentation becomes more engaging and memorable
- Newcomers see real-world usage patterns immediately
- Generic patterns are still visible for power users
- Documentation has personality while remaining professional
- Examples feel authentic to how developers actually work

### Negative  

- Requires more thought when writing examples
- Risk of examples becoming dated if not maintained
- Some users might prefer purely abstract documentation
- Need to ensure examples don't become too insider-y

## Implementation

1. Update existing documentation following these principles
2. Create an example bank for common scenarios
3. Review documentation quarterly for example freshness
4. Encourage contributors to add character within these bounds

## Examples

### Search Documentation

````markdown
Find todos assigned to specific developers:

```bash
rg ':::.*@claude'                  # Generic: rg ':::.*@name'
rg ':::.*owner:@alice,@bob'        # Multiple owners
```
````

### README Example

````markdown
Waymarks make your codebase searchable. Mark that sketchy code:

```javascript
// !todo ::: @team-yolo refactor this before it haunts us #dragon
// notice ::: temporary fix, remove after 2025-Q1 #hack
```
````

### Migration Guide

````markdown
The old syntax used `+` for tags. Update to `#`:

```javascript
// Old:  +backend +priority:high +security
// New:  !todo ::: audit user permissions #backend #security
```
````

## Notes

This ADR establishes documentation principles, not syntax rules. The syntax remains defined in ADR-001 and related proposals. This is about how we teach and demonstrate that syntax effectively.

The goal is documentation that developers actually want to read, with examples they'll remember, while still serving as an effective reference.

<!-- todo ::: @galligan does this capture our documentation vision? needs:#review -->