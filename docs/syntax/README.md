<!-- tldr ::: waymark syntax overview and quick reference -->
# Waymark Syntax

Waymark syntax is a standardized way to mark important code locations using the `:::` sign.

## Overview

Waymarks make codebases discoverable. They're breadcrumbs that both humans and AI agents can follow using simple grep commands. The syntax is designed to be:

- **Simple**: Learn in 5 minutes, master in 30
- **Searchable**: Every pattern works with ripgrep
- **Semantic**: Markers convey clear meaning
- **Flexible**: Start simple, add features as needed

## Quick Reference

```text
[signal][marker] ::: [@actor|##anchor] prose #tags
```

### Components

| Component | Purpose | Examples |
|-----------|---------|----------|
| **Signal** | Priority/scope modifier | `!` (high), `!!` (critical), `*` (branch work) |
| **Marker** | Semantic type | `todo`, `fixme`, `tldr`, `notice` |
| **Sign** | The `:::` separator | Always with spaces: ` ::: ` |
| **Actor** | Assignment to person/team | `@alice`, `@security-team` |
| **Anchor** | Stable reference point | `##auth/login` (define), `#auth/login` (reference) |
| **Tags** | Classification/metadata | `#backend`, `#fixes:#123`, `#owner:@alice` |

## Basic Examples

```javascript
// Simple waymark
// todo ::: implement caching

// With assignment
// todo ::: @alice add input validation

// With tags
// fixme ::: memory leak in auth service #backend #critical

// With priority signal
// !todo ::: important security update
// !!fixme ::: critical production bug

// Branch work (must complete before merge)
// *todo ::: finish error handling
```

## Core Concepts

### 1. Markers
The semantic type of the waymark. Core markers include:

- **Work**: `todo`, `fixme`, `refactor`, `review`, `test`
- **Info**: `tldr`, `note`, `idea`, `about`, `example`
- **Status**: `wip`, `stub`, `temp`, `done`, `deprecated`
- **Attention**: `notice`, `risk`, `important`

### 2. Signals
Optional prefixes that modify meaning:

- `!` / `!!` - Priority levels (P1/P0)
- `*` - Branch-scoped work
- `?` / `??` - Uncertainty levels
- `-` / `--` - Mark for removal

### 3. Tags
Two types of tags, both with `#` prefix:

- **Simple tags**: `#backend`, `#security`, `#auth`
- **Relational tags**: `#fixes:#123`, `#owner:@alice`, `#affects:#billing,#auth`

### 4. Actors and Anchors
- **Actors** (`@`): Assign work or reference people
- **Anchors** (`##`): Define stable reference points

## Key Principles

1. **Priority via signals, not tags**: Use `!!todo` not `todo ... #priority:high`
2. **One marker per line**: Keep waymarks atomic and searchable
3. **Tags use #**: Both simple (`#backend`) and relational (`#fixes:#123`)
4. **Include # in references**: `#fixes:#123` not `#fixes:123`
5. **Arrays have no spaces**: `#cc:@alice,@bob` not `@alice, @bob`

## Common Patterns

```javascript
// File overview (at top of file)
// tldr ::: user authentication service

// Assigned work with context
// todo ::: @alice implement OAuth flow #auth #security

// Bug with issue reference
// fixme ::: race condition in payment processor #fixes:#456

// Stable reference point
// about ::: ##payment/stripe Stripe webhook handler #payments

// Multi-owner task
// todo ::: implement RBAC #owner:@alice,@bob #security

// System-wide impact
// !!notice ::: breaking API change #affects:#frontend,#mobile,#api
```

## Searching Waymarks

```bash
# Find all waymarks
rg ":::"

# Find by marker
rg "todo\s+:::"      # All todos
rg "!!fixme"         # Critical bugs

# Find by assignment
rg "@alice"          # All mentions of alice

# Find by tag
rg "#security"       # Security-related
rg "#123\b"          # Issue 123 references
```

## Next Steps

- **[Full Specification](./SPEC.md)** - Complete syntax reference
- **[Changelog](./CHANGELOG.md)** - Version history and migration guides
- **[Quick Start Guide](../QUICKSTART.md)** - Get started in 5 minutes

## Philosophy

Waymarks are breadcrumbs, not documentation. They mark the interesting spots in your code - the places where decisions were made, work needs doing, or context matters. Like trail markers on a hike, they guide you to what's important without cluttering the path.

The syntax is intentionally boring. No complex hierarchies, no special parsing rules, no configuration files. Just markers, signs, and tags that work with grep. Because the best syntax is the one you don't have to think about.