<!-- :M: tldr canonical waymark syntax specification -->
# Waymark Syntax Specification

The canonical specification for waymark syntax - a breadcrumb protocol for code navigation.

## Overview

Waymarks provide a breadcrumb protocol that enables developers and AI agents to leave structured, searchable markers throughout codebases. The syntax accommodates diverse team preferences while recommending patterns that enable effective tooling and cross-project consistency.

## Core Grammar

```ebnf
waymark       ::= comment-leader identifier space marker-list prose?
identifier  ::= ":M:"
space       ::= " "                    # exactly one ASCII space
marker-list ::= marker ("," marker)*
marker      ::= key delimiter?
key         ::= identifier | "@" identifier
delimiter   ::= ":" value | "(" params ")" | "[" array "]"
value       ::= identifier | quoted-string
params      ::= param ("," param)*
param       ::= key ":" value
array       ::= value ("," value)*
prose       ::= text                   # everything after markers
```

## Basic Structure

### The `:M:` Identifier

The syntax uses `:M:` as the identifier.

```javascript
// Standard identifier (mandatory single space after)
// :M: todo implement authentication
```

**Key Rules:**

- `:M:` must be followed by exactly one ASCII space
- Three glyphs for visual clarity and fast typing
- Trivially matched with `':M:'` in ripgrep

### Markers

Each marker classifies an anchor's purpose and is organized into one of six semantic groups for discoverability.

```javascript
// Core markers with mandatory space after identifier
// :M: todo implement rate limiting
// :M: bug memory leak in auth service
// :M: sec validate all user inputs
```

## Delimiter Semantics

The syntax uses three distinct delimiters with specific semantic purposes:

### Colon (`:`) - Classifications

Used for type:value relationships, classifications, and states.

```javascript
// :M: priority:high         // priority classification
// :M: status:blocked        // status classification
// :M: env:production        // environment type
// :M: owner:@alice          // ownership (including mentions)
```

### Parentheses (`()`) - Parameters

Used for structured parameters and arguments associated with markers.

```javascript
// :M: blocked(issue:4)           // parameter with classification
// :M: depends(auth-service)      // simple parameter
// :M: config(timeout:30,retry:3) // multiple parameters
```

### Brackets (`[]`) - Arrays

Used for multiple values, optional for single values.

```javascript
// :M: blocked:[4,7]              // multiple blockers
// :M: tags:[auth,api,security]   // multiple tags
// :M: owner:[@alice,@bob]        // multiple owners
// :M: blocked:4                  // single value (brackets optional)
```

## Core Marker Groups

Markers are organized into six semantic groups for discoverability:

| Group | Purpose | Primary markers (synonyms in parentheses) |
|-------|---------|-------------------------------------------|
| **todo** | Work that needs to be done | `todo`, standalone work markers: `bug`, `fix`/`fixme`, `task`, `issue`/`ticket`, `pr`, `review` |
| **info** | Explanations & guidance | `context` (`ctx`), `note`, `docs`, `explain`, `tldr`/`about`, `example`, `guide`, `rule`, `decision` |
| **notice** | Warnings & alerts | `warn`, `flag`, `freeze`, `critical`, `unsafe`, `deprecated`, `unstable`, `experiment`, `changing` |
| **trigger** | Automated behavior hooks | `action`, `notify`, `alert`, `hook` |
| **domain** | Domain-specific focus areas | `api`, `security`/`sec`, `perf`/`performance`, `deploy`, `test`, `data`, `config`, `lint` |
| **status** | Lifecycle / completeness | `temp`/`tmp`/`placeholder`, `stub`, `mock`, `draft`, `prototype`, `complete`, `ready`, `broken` |

**Usage Rules:**

1. Multiple markers can be combined with commas: `:M: todo,bug,priority:high`
2. If `todo` appears, it must be the first marker
3. Work markers can appear standalone OR as parameters to `todo`

## Relational Patterns

Relationships are expressed directly through dedicated markers without redundant prepositions:

```javascript
// Dependency relationships
// :M: depends(auth-service)       // requires auth service
// :M: requires(api:v2-login)      // needs specific API
// :M: needs(config:redis)         // requires configuration

// Blocking relationships
// :M: blocked(issue:AUTH-123)     // blocked by issue
// :M: blocking:[PAY-45,UI-77]     // blocks multiple tasks

// Event relationships
// :M: emits(event:user-created)   // publishes event
// :M: listens(payment-completed)  // subscribes to event
// :M: triggers(workflow:deploy)   // initiates process
```

## Multi-line Anchors

The syntax strongly recommends single-line anchors to maintain grep-ability:

```javascript
// Single-line waymarks (preferred)
// :M: todo(assign:@alice,priority:high) implement OAuth integration

// Multiple related waymark lines for complex context
// :M: todo(assign:@alice,priority:high) implement OAuth integration  
// :M: context OAuth flow requires PKCE for security compliance
// :M: depends(service:session-api) user sessions must exist first
```

**Benefits:**

- `rg ":M: todo"` always finds todo items
- Simple, consistent search patterns
- No complex multi-line parsing required

## Prose Formatting

Prose follows markers, separated by space. Optional formatting for clarity:

```javascript
// Basic prose
// :M: todo implement rate limiting

// Colon prefix (recommended for clarity)
// :M: todo: implement rate limiting before launch
// :M: context: this function assumes Redis is available

// Quoted prose (for complex text)
// :M: todo(priority:high): "fix race condition in auth service"
// :M: warn: "this function modifies global state"
```

## Quoting and Escaping

The syntax uses quotes for strings with special characters:

**Simple values** (no quotes needed):

```javascript
// :M: user(alice)
// :M: version(2.0.1)  
// :M: priority:high
```

**Complex values** (quotes required):

```javascript
// :M: match('user-123')              // literal string
// :M: path('src/data migration.sql') // spaces in path
// :M: message('Can\'t connect')      // escaped quote
// :M: files:['auth.js','lib/utils.js'] // array of paths
```

**No structural dots** - Use dots only for literals (versions, URLs, file paths)

## Configuration Integration

Teams can configure their preferred syntax patterns:

### Priority Schemes

```yaml
priorities:
  scheme: "numeric"  # or "named"
  numeric:
    p0: "critical"   # :M: p0 → :M: priority:critical
    p1: "high"       # :M: p1 → :M: priority:high
    p2: "medium"     # :M: p2 → :M: priority:medium
```

### Version Styles

```yaml
versioning:
  style: "semver"  # or "python", "ruby", "maven"
  semver:
    compatible: "^1.2.0"
    patch-level: "~1.2.0"
```

## Universal Parameter Groups

Parameters are organized into six semantic families that work with any marker:

| Group | Purpose | Examples |
|-------|---------|----------|
| **mention** | People / entities | `owner:@alice`, `assign:@bob`, `team:@frontend` |
| **relation** | Links & references | `parent:epic-123`, `depends:auth-svc`, `url:https://docs.example.com` |
| **workflow** | Coordination | `blocked:[4,7]`, `blocking:12`, `reason:compliance` |
| **priority** | Importance / risk | `priority:high`, `severity:critical`, `complexity:high` |
| **lifecycle** | Time / state | `since:1.2.0`, `until:2.0.0`, `status:in-progress` |
| **scope** | Environment / context | `env:prod`, `platform:ios`, `region:us-east` |

## Tool Integration Notes

While the syntax accommodates flexible usage, waymark tooling may implement stricter parsing:

- **Linters** may enforce consistent delimiter styles
- **Parsers** may require specific marker formats  
- **CLIs** may validate parameter content
- **IDEs** may provide completion based on established patterns

See [waymark documentation](../waymark/) for tooling-specific requirements.

## Marker Philosophy

**Core Principles:**

- No complex object syntax within waymarks
- No regex/pattern matching as core feature
- Focus on LLM context and navigation
- Waymark syntax must be expressive enough on its own

## Search Examples

```bash
# Find all waymarks
rg ":M:"

# Find by marker group
rg ":M:.*todo"      # All work items
rg ":M:.*notice"    # All warnings/alerts
rg ":M:.*domain"    # All domain-specific markers

# Find with context
rg -C2 ":M: security"  # 2 lines context
rg -B3 -A3 ":M: todo"  # 3 lines before/after

# Find in markdown (including HTML comments)
rg "<!-- :M:" --type md
```
