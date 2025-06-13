<!-- tldr ::: Complete waymark syntax specification using the ::: sigil -->
# Waymark Syntax

Waymark syntax is a lightweight marking system for code navigation using the `:::` sigil.

## Overview

Waymark syntax defines the **structure** for writing searchable code markers:

- The `:::` sigil with optional prefix
- Delimiter semantics (`:` for properties, `()` for parameters, `[]` for arrays)
- Fixed namespace of prefixes organized into semantic groups
- Properties, tags, and @mentions for metadata
- Simple, grep-friendly patterns

Think of it like learning to write musical notes - the syntax is simple and consistent, while what you compose with it can be infinitely varied.

## Basic Syntax

```text
<comment-leader> [signal][marker] ::: [actor] [properties] [note] [+tags]
```

The syntax consists of:

1. **Signal**: Optional urgency/emphasis symbol (!, ?, *, etc.)
2. **Marker**: Optional classifier before the `:::` sigil  
3. **Sigil**: `:::` separator (always preceded by space when marker present)
4. **Actor**: Optional @mention for assignment
5. **Properties**: Key:value pairs for machine-readable metadata
6. **Note**: Human-readable description
7. **Tags**: Classification tags prefixed with `+`

### Quick Examples

```javascript
// todo ::: implement caching                    // Prefix with note
// fix ::: priority:high memory leak             // Prefix with property
// ::: this is a performance hotpath             // Pure note (no prefix)
// alert ::: validates all inputs +security      // With tag
// todo ::: assign:@alice implement OAuth flow   // With assignment
// ::: deprecated:v2.0 use newMethod() instead   // Properties in note
```

## Syntax Components

### Markers

Optional classifiers from a fixed namespace (~41 total) that appear before `:::`:

```javascript
// todo ::: implement validation
// fix ::: memory leak in auth
// alert ::: security vulnerability
// tldr ::: handles user authentication
```

### Properties

Key:value pairs for structured metadata:

```javascript
// todo ::: priority:high implement caching
// ::: deprecated:v2.0 moving to new API
// fix ::: assign:@alice memory leak issue
```

### Tags

Classification tags for grouping and filtering (use + prefix):

```javascript
// todo ::: implement auth flow +security +backend
// fix ::: button contrast +critical +frontend +a11y
```

### @Mentions

People or entity references:

```javascript
// todo ::: @bob implement caching
// ::: @alice please review this approach
// todo ::: assign:@carol attention:@dave needs input
```

## Grammar

The complete formal grammar in EBNF:

```ebnf
waymark  ::= comment-leader signal? marker? sigil space payload
signal   ::= "_"? ("!!" | "!" | "??" | "?" | "**" | "*" | "--" | "-" | "~" | "^")
marker   ::= [A-Za-z0-9_-]+
sigil    ::= ":::"
space    ::= " "                    # exactly one ASCII space
payload  ::= property* note? hashtag*
property ::= key ":" value space?
key      ::= [A-Za-z0-9_-]+
value    ::= simple-value | parameterized-value | array-value
tag      ::= "+" [A-Za-z0-9_/-]+     # hierarchical tags allowed
mention  ::= "@" [A-Za-z0-9_-]+
note     ::= text                    # human-readable description
```

## Delimiter Semantics

Each delimiter has a specific purpose:

### `:::` - The Sigil

The core waymark identifier that separates prefix from content:

```javascript
// todo ::: implement validation    // marker + content
// ::: this is just a note          // pure note (no marker)
```

### `:` - Properties

Creates key:value pairs for structured metadata:

```javascript
// todo ::: priority:high assign:@alice implement caching
// ::: deprecated:v2.0 use newMethod() instead
```

### `()` - Parameterized Values

Provides parameters to property values:

```javascript
// todo ::: requires:node(>=16) supports:node(16,18,20)
// ::: affects:versions(1.0-2.5) security vulnerability
```

### `[]` - Grouped Values

Groups multiple parameterized values:

```javascript
// todo ::: requires:[npm(>=8),node(16,18,20)] upgrade deps
// ::: affects:[auth,api,frontend] breaking change
```

### `+` - Tags

Classification tags, can be hierarchical:

```javascript
// todo ::: implement auth +security +backend
// fix ::: contrast issue +frontend/ui +a11y/wcag
```

### `@` - Mentions

People or entity references:

```javascript
// todo ::: @bob implement caching
// ::: @alice please review this approach
```

## Marker Categories

Markers are organized into 8 semantic categories (~41 total):

### Work (`--is work`)
`todo`, `fix`, `done`, `review`, `refactor`, `needs`, `blocked`

### State & Lifecycle (`--is state`)
`temp`, `deprecated`, `draft`, `stub`, `cleanup`

### Alert (`--is alert`)
`alert`, `risk`, `notice`, `always`

### Information & Documentation (`--is info`)
`tldr`, `note`, `summary`, `example`, `idea`, `about`, `docs`

### Quality & Process (`--is quality`)
`test`, `audit`, `check`, `lint`, `ci`

### Performance (`--is performance`)
`perf`, `hotpath`, `mem`, `io`

### Security & Access (`--is security`)
`sec`, `auth`, `crypto`, `a11y`

### Meta & Special (`--is meta`)
`flag`, `important`, `hack`, `legal`, `must`, `assert`

**Usage Rules:**
1. Only one marker per waymark
2. Markers are optional - waymarks can be pure notes
3. Signals can modify markers: `!todo :::`, `^must :::`

## Signal Modifiers

Signals modify the urgency/emphasis of markers:

| Symbol | Name | Meaning |
|--------|------|---------|
| `!` / `!!` | Bang / Double-bang | `!` critical · `!!` blocker/show-stopper |
| `?` / `??` | Question / Double-question | `?` needs clarification · `??` highly uncertain |
| `*` / `**` | Star / Double-star | `*` bookmark · `**` canonical entry point |
| `~` | Tilde | Experimental / unstable |
| `^` | Caret | Protected / hazardous – senior review required |
| `-` / `--` | Tombstone / Instant-prune | `-` mark for removal · `--` prune ASAP |
| `_` | Underscore | Ignore marker (reserved for future functionality) |

Examples:
```javascript
// !todo ::: migrate to new hashing algo
// ?note ::: does pagination handle zero items?
// *tldr ::: core event-loop entry point
// !!alert ::: patch data-loss vulnerability
// **tldr ::: canonical docs landing page
// ^must ::: array length must be power of two
// -todo ::: obsolete after migrating to v5 SDK
```

## Property Categories

Properties are organized into semantic families:

| Category | Purpose | Examples |
|----------|---------|----------|
| **Assignment** | People/ownership | `assign:@alice`, `attn:@bob`, `for:@team` |
| **Priority** | Importance/urgency | `priority:high`, `priority:critical` |
| **Dependencies** | Links/requirements | `requires:package(version)`, `depends:service`, `blocks:#123` |
| **Issue Tracking** | External references | `fixes:#123`, `closes:#456`, `relates-to:AUTH-789` |
| **Lifecycle** | Time/versioning | `status:deprecated`, `since:v1.0`, `until:v3.0` |
| **Files/Paths** | Location info | `path:filename`, `affects:files` |
| **Messages** | Quoted content | `message:"error text"`, `reason:"compliance"` |

## Advanced Patterns

### Task Management

```javascript
// Basic tasks
// todo ::: implement validation
// fix ::: priority:high memory leak
// done ::: added rate limiting

// With assignments and properties
// todo ::: assign:@alice priority:high implement caching
// review ::: @bob please check auth logic +security
```

### Code Lifecycle

```javascript
// Maturity markers
// stub ::: basic implementation
// draft ::: work in progress
// stable ::: production ready
// deprecated ::: v2.0 use newMethod() instead
```

### Issue Integration

```javascript
// Issue references
// todo ::: fixes:#234 implement auth flow
// done ::: closes:#456 added validation
// fix ::: blocked-by:#123 waiting on API changes
```

### Monorepo Patterns

```javascript
// Service namespacing with tags
// todo ::: implement OAuth +auth +backend
// fix ::: payment validation +payment +security

// Or with properties
// todo ::: service:auth implement OAuth
// fix ::: service:payment validate amounts
```

## Quoting Rules

Simple values need no quotes:
```javascript
// todo ::: priority:high
// ::: version:2.0.1
// todo ::: assign:@alice
```

Use quotes for values with spaces or special characters:
```javascript
// todo ::: message:"Can't connect to database"
// note ::: path:"src/data migration.sql"
// ::: reason:"waiting for compliance approval"
```

## Search Examples

```bash
# Find all waymarks
rg ":::"

# Find by prefix
rg "todo :::"
rg "fix :::"
rg "warn :::"

# Find by properties
rg ":::.*priority:high"
rg ":::.*assign:@alice"

# Find by tags
rg "\+security"
rg "\+frontend"

# Find with context
rg -C2 "todo :::"  # 2 lines before/after
rg -B3 -A3 "fix :::"  # 3 lines before/after

# Find in markdown (HTML comments)
rg "<!-- .*:::" --type md

# Advanced searches
rg ":::.*priority:high.*\+security"  # High-priority security
rg ":::.*@alice"                    # Alice's assignments
rg ":::.*fixes:#\d+"                # Issue fixes
```

## Best Practices

1. **Space before `:::`**: Required when prefix is present
2. **One waymark per line**: Maintains grep-ability
3. **Be specific**: Use clear prefixes and properties
4. **Start simple**: Begin with basic prefixes, add properties as needed
5. **Keep it searchable**: Simple patterns are easier to grep
6. **Line length**: Keep under ~80-120 characters for readable output
7. **Use HTML comments in markdown**: `<!-- tldr ::: summary -->` for non-rendered waymarks
8. **Pure notes**: Use waymarks without prefixes for context: `// ::: this explains why`

## Philosophy

1. **Visual Clarity**: The `:::` sigil clearly separates prefix from content
2. **Progressive Complexity**: Start simple, add advanced features only when needed
3. **Toolability**: Properties are structured for CLI/linting, notes are freeform
4. **Flexibility**: Open namespace for hashtags, minimal opinions on property keys
5. **Searchability**: Every pattern optimized for grep/ripgrep
6. **AI-Friendly**: Optimized for LLM context and navigation
7. **Boring solutions for boring problems**: Proven patterns over complexity