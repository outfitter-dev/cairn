<!-- tldr ::: ##docs:@waymark/proposals/streamlined-grammar Streamlined waymark grammar focusing on clarity and composability #proposal -->

# Waymark Streamlined Grammar

A proposal to simplify waymark terminology and syntax for maximum clarity and composability.

## Overview

After extensive iteration, we've identified opportunities to streamline the waymark grammar by:

- Simplifying terminology
- Unifying all key:value pairs as "tags" (keeping the `#` prefix)
- Clarifying the distinction between simple tags and relational tags
- Clarifying the anchor system

The result is a cleaner, more intuitive system that maintains full search capabilities.

## Core Structure

```
[signal][marker] ::: [content] [modifiers]
```

Where modifiers can include any combination of:

- **Tags**            - Simple labels that start with `#` (e.g. `#backend`, `#perf:hotpath`)
- **Relational Tags** - `#key:value` pairs
- **Actors** - People/teams with `@` prefix
- **Anchors** - Reference points with `##` prefix

## The Streamlined Components

### 1. Tags (Simple Labels)

Tags are simple descriptive labels prefixed with `#`:

```javascript
// Simple tags for categorization
// todo ::: implement auth #backend #security #critical
// fixme ::: race condition #async #database
// note ::: performance hotspot #optimization
```

**Key principle**: If it's just a word or path describing the waymark, it's a tag.

### 2. Relational Tags (Key:Value)

Relational tags are key:value pairs that **always start with `#`**.  They typically connect the current waymark to another entity such as an issue, anchor, or actor.

```text
#owner:@alice           # Points to an actor
#fixes:#123             # Points to another waymark (issue 123)
#affects:#api,#billing  # Points to multiple anchors
```

If the value does **not** start with `#` or `@`, the tag is merely descriptive and functions like an attribute (`#perf:hotpath`).

```javascript
// Clean, readable relational tags
// todo ::: implement feature #owner:@alice #priority:high
// fixme ::: bug in payment #fixes:#123 #blocks:#456,#789
// notice ::: deployment #affects:#api,#billing #status:pending

// Performance attributes (still tags because of leading #)
// todo ::: optimize query #perf:hotpath #arch:critical-path

// Workflow tags  
// wip ::: new feature #branch:feature/auth #pr:#234
```

**Key principle**: If the token starts with `#`, it is a tag (simple, attribute, or relational).  All key:value pairs therefore begin with `#`.

### 2.1 Attribute-Style Tags & Aliases

While relational tags handle most key:value data, many teams like the expressiveness of **attribute tags** such as `#perf:hotpath`, `#sec:boundary`, or `#api:endpoint`.  These are **stillTags** because they begin with `#`; the colon simply namespaces the tag and does **not** turn it into a relational tag.

Key rules:

1. If a token starts with `#`, it is always treated as a **tag**, even when it contains `:`.
2. You MAY provide a **simple-tag alias** for any attribute tag. For example, `#perf:hotpath` and `#hotpath` can coexist and are considered synonyms by future tooling.
3. Use the namespaced form (`#perf:hotpath`) when precision matters or when you need to group related tags (`#perf:critical`, `#perf:bottleneck`).  Use the simple alias (`#hotpath`) for quick, ad-hoc marking.
4. When both appear on the same line, prefer placing them next to each other for readability:

```javascript
// todo ::: optimise parser #hotpath #perf:hotpath
```

Tooling roadmap ▶  The Waymark CLI will eventually let you declare alias maps so searches for `#hotpath` automatically include `#perf:hotpath` (and vice-versa), maintaining greppability while giving authors freedom of expression.

#### Recommended Usage Patterns

• **Standalone tags** — `#hotpath`, `#boundary`, `#experimental`
   a Ideal for quick marking during day-to-day development.

• **Namespaced (category) tags** — `#perf:hotpath`, `#sec:boundary`, `#status:experimental`
   a Provide machine-readable structure, avoid collisions, and allow grouped searches such as `rg "#sec:"`.

In practice you can mix both:

```javascript
// important ::: validate input #boundary #sec:boundary,input
```

#### Search Cheat-Sheet

```bash
# Find all hotpaths (standalone **or** namespaced)
rg "#(perf:)?hotpath"

# All security attributes
rg "#sec:"

# Any security boundary (both forms)
rg "#(sec:)?boundary"
```

These patterns mirror those in the 1.0 Simplification doc, so teams can migrate without changing their muscle-memory.

### 3. Actors (People/Teams)

Actors represent people, teams, or agents with `@` prefix:

```javascript
// Direct actor mentions
// todo ::: @alice implement OAuth integration
// review ::: @security-team check crypto implementation

// Actors in relational tags
// fixme ::: memory leak #owner:@bob #cc:@platform,@ops
```

**Key principle**: Actors never contain slashes (unlike scoped packages).

### 4. Anchors (Reference Points)

Anchors mark specific locations in code with `##` prefix. They come in two forms:

#### Generic Anchors
Mark important locations without categorization:

```javascript
// Generic anchors - mark specific places
// about ::: ##auth/login Login implementation
// about ::: ##payment/retry-logic Retry algorithm
// important ::: ##security/validation Input validation boundary
```

#### Typed Anchors  
Declare what something IS using `type:` prefix:

```javascript
// Typed anchors - declare canonical artifacts
// tldr ::: ##docs:@company/auth/api API documentation
// tldr ::: ##test:@company/billing/e2e End-to-end billing tests
// tldr ::: ##config:@company/database Production database config
// about ::: ##pkg:@company/auth Authentication package
```

**Key principles**:

- Use `##` for definitions (THIS IS the thing)
- Use `#` for references (pointing to the thing)
- Generic anchors work for simple names
- Typed anchors required for special characters (@, :) or canonical artifacts
- Actors (@alice) don't need anchors - they ARE the identifier

## Visual Clarity

The streamlined syntax creates natural visual groupings:

```javascript
// Both use # prefix, but with better visual organization
// !todo ::: critical fix #backend #security #fixes:#123 #blocks:#456 #owner:@alice #perf:critical

// Tags can be organized by type for clarity:
// !todo ::: critical fix
//   #backend #security #critical              // simple tags
//   #fixes:#123 #blocks:#456                 // relational tags
//   #owner:@alice #cc:@security              // ownership tags
//   #perf:hotpath #arch:critical-path        // attribute tags
```

## Search Patterns

The streamlined grammar maintains excellent search capabilities:

```bash
# Find all tags
rg "#backend"              # All backend tags
rg "#security"             # All security tags

# Find all relational tags  
rg "#owner:"                # All ownership
rg "#fixes:"                # All fix relationships
rg "#perf:"                 # All performance relational tags

# Find all anchors
rg "::: ##"                # All anchor definitions
rg "::: ##[^:]+"           # Generic anchors only
rg "::: ##\w+:"            # Typed anchors only
rg "##docs:"               # All documentation anchors
rg "##test:"               # All test anchors
rg "#auth/login"           # References to auth/login anchor

# Find specific references
rg "#fixes:#123"            # What fixes issue 123
rg "#owner:@alice"          # Alice's owned items
rg "#affects:#api,#billing" # Items affecting both
```

## Examples

### Work Items

```javascript
// Simple todo with tags
// todo ::: implement user settings #frontend #react

// Complex todo with relational tags
// !todo ::: fix auth race condition 
//   #security #critical                    // relational tags
//   #fixes:#456,#789 #blocks:#234          // relational tags
//   #owner:@alice #cc:@security,@platform  // relational tags
//   #branch:fix/auth-race #pr:#567         // workflow tags
```

### Documentation and Tests

```javascript
// Typed anchor declaring this IS the auth docs
// tldr ::: ##docs:@company/auth/setup Setup and configuration guide

// Generic anchor marking important location
// about ::: ##payment/stripe-webhook Webhook processing logic

// Test with references to both
// test ::: OAuth flow validation 
//   see:#docs:@company/auth/setup       // Reference to typed anchor
//   at:#payment/stripe-webhook          // Reference to generic anchor
```

### System References

```javascript
// Service with mixed relational tags
// notice ::: deploying auth service v2
//   #deployment #breaking-change           // relational tag
//   #affects:#frontend,#mobile,#api        // relational tag
//   #owner:@platform #version:2.0.0        // descriptive tag
//   #see:#docs:@company/auth/migration     // anchor reference
```

### Package and Module References

```javascript
// Typed anchor for scoped package (@ requires typed anchor)
// about ::: ##pkg:@company/auth Internal authentication package

// Documentation for the package
// tldr ::: ##docs:pkg:@company/auth Package usage guide

// Generic anchor for algorithm  
// important ::: ##algorithms/jwt-verify JWT verification logic

// Usage with all reference types
// todo ::: upgrade auth system
//   #depends:@company/auth@2.0           // package dependency (not anchor)
//   see:#pkg:@company/auth               // reference to package anchor
//   at:#algorithms/jwt-verify            // reference to generic anchor
//   docs:#docs:pkg:@company/auth         // reference to package docs
```

## When to Use Generic vs Typed Anchors

### Use Generic Anchors When:

- Marking a specific location or algorithm
- Creating stable reference points in code
- The anchor name is simple (no special characters)

```javascript
// about ::: ##auth/validation Input validation logic
// important ::: ##payment/retry Retry algorithm
// note ::: ##cache/lru LRU cache implementation
```

### Use Typed Anchors When:

- Declaring canonical artifacts (docs, tests, configs)
- The name contains special characters (@, :)
- You want to categorize what something IS

```javascript
// tldr ::: ##docs:@company/auth API documentation
// tldr ::: ##test:@company/billing Test suite
// about ::: ##pkg:@company/utils Utility package
// tldr ::: ##api:v2/users User API endpoints
```

## Benefits

### 1. **Visual Hierarchy**

- All tags use `#` but can be visually grouped by type
- Anchors (with `##`) stand out as special reference points
- Less visual noise overall

### 2. **Cognitive Simplicity**

- One rule for all tags: "Always starts with #"
- No distinction between "relational" and "attribute" relational tags
- Anchors are just anchors (some happen to have types)

### 3. **Maintained Searchability**

- Everything remains greppable
- Common searches become cleaner
- `rg "::: ##"` finds all anchor definitions

### 4. **Composability**

- Mix and match components as needed
- Natural grouping of similar elements
- Progressive complexity (start simple, add as needed)

## Key Principles

### Consistent Tag Syntax

```javascript
// All tags start with # - no exceptions
// todo ::: task #priority:high #owner:@alice #fixes:#123
```

### Component Summary

1. All tags start with `#` (simple, attribute, or relational)
2. Actors always use `@`
3. Anchor definitions use `##`
4. Anchor references use `#`

## Terminology Summary

| Component | Syntax | Example | Purpose |
|-----------|--------|---------|---------|
| **Tag** | `#word` | `#backend` | Simple labels |
| **Relational Tag** | `#key:value` | `#owner:@alice` | Key-value pairs |
| **Actor** | `@name` | `@alice` | People/teams/agents |
| **Generic Anchor** | `##name` | `##auth/login` | Named locations |
| **Typed Anchor** | `##type:name` | `##docs:@company/auth` | Canonical artifacts |
| **Anchor Reference** | `#name` or `#type:name` | `#auth/login`, `#docs:@company/auth` | Points to anchors |

## Conclusion

This streamlined grammar achieves:

- **Clarity**: Visual distinction between component types
- **Simplicity**: Fewer rules to remember
- **Power**: Full expressiveness maintained
- **Searchability**: Excellent grep patterns

The result is a waymark system that's easier to read, write, and search while maintaining all the power of the original design.