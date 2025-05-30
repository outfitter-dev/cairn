<!-- :A: tldr canonical Magic Anchors notation specification -->
# Magic Anchors Notation Specification

The canonical specification for the Magic Anchors notation system - a breadcrumb protocol for code navigation.

## Overview

Magic Anchors provide a breadcrumb protocol that enables developers and AI agents to leave structured, searchable markers throughout codebases. The notation accommodates diverse team preferences while recommending patterns that enable effective tooling and cross-project consistency.

## Core Grammar

```ebnf
anchor      ::= comment-leader sigil space marker-list prose?
sigil       ::= ":A:" | ":" identifier ":"
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

### The `:A:` Sigil
The notation uses `:A:` as the canonical sigil, though custom sigils are accommodated for team-specific needs.

```javascript
// Standard sigil (mandatory single space after)
// :A: todo implement authentication

// Custom sigil (alternative)
// :team: todo implement authentication
```

**Key Rules:**
- `:A:` must be followed by exactly one ASCII space
- Three glyphs for visual clarity and fast typing
- Trivially matched with `':A:'` in ripgrep

### Markers
Markers classify the anchor's purpose. Markers are organized into six semantic groups for discoverability.

```javascript
// Core markers with mandatory space after sigil
// :A: todo implement rate limiting
// :A: bug memory leak in auth service
// :A: sec validate all user inputs
```

## Delimiter Semantics

The notation uses three distinct delimiters with specific semantic purposes:

### Colon (`:`) - Classifications
Used for type:value relationships, classifications, and states.

```javascript
// :A: priority:high         // priority classification
// :A: status:blocked        // status classification
// :A: env:production        // environment type
// :A: owner:@alice          // ownership (including mentions)
```

### Parentheses (`()`) - Parameters
Used for structured parameters and arguments associated with markers.

```javascript
// :A: blocked(issue:4)           // parameter with classification
// :A: depends(auth-service)      // simple parameter
// :A: config(timeout:30,retry:3) // multiple parameters
```

### Brackets (`[]`) - Arrays
Used for multiple values, optional for single values.

```javascript
// :A: blocked:[4,7]              // multiple blockers
// :A: tags:[auth,api,security]   // multiple tags
// :A: owner:[@alice,@bob]        // multiple owners
// :A: blocked:4                  // single value (brackets optional)
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
1. Multiple markers can be combined with commas: `:A: todo,bug,priority:high`
2. If `todo` appears, it must be the first marker
3. Work markers can appear standalone OR as parameters to `todo`

## Relational Patterns

Relationships are expressed directly through dedicated markers without redundant prepositions:

```javascript
// Dependency relationships
// :A: depends(auth-service)       // requires auth service
// :A: requires(api:v2-login)      // needs specific API
// :A: needs(config:redis)         // requires configuration

// Blocking relationships
// :A: blocked(issue:AUTH-123)     // blocked by issue
// :A: blocking:[PAY-45,UI-77]     // blocks multiple tasks

// Event relationships
// :A: emits(event:user-created)   // publishes event
// :A: listens(payment-completed)  // subscribes to event
// :A: triggers(workflow:deploy)   // initiates process
```

## Multi-line Anchors

The notation strongly recommends single-line anchors to maintain grep-ability:

```javascript
// Single-line anchors (preferred)
// :A: todo(assign:@alice,priority:high) implement OAuth integration

// Multiple related anchor lines for complex context
// :A: todo(assign:@alice,priority:high) implement OAuth integration  
// :A: context OAuth flow requires PKCE for security compliance
// :A: depends(service:session-api) user sessions must exist first
```

**Benefits:**
- `rg ":A: todo"` always finds todo items
- Simple, consistent search patterns
- No complex multi-line parsing required

## Prose Formatting

Prose follows markers, separated by space. Optional formatting for clarity:

```javascript
// Basic prose
// :A: todo implement rate limiting

// Colon prefix (recommended for clarity)
// :A: todo: implement rate limiting before launch
// :A: context: this function assumes Redis is available

// Quoted prose (for complex text)
// :A: todo(priority:high): "fix race condition in auth service"
// :A: warn: "this function modifies global state"
```

## Quoting and Escaping

The notation uses quotes for strings with special characters:

**Simple values** (no quotes needed):
```javascript
// :A: user(alice)
// :A: version(2.0.1)  
// :A: priority:high
```

**Complex values** (quotes required):
```javascript
// :A: match('user-123')              // literal string
// :A: path('src/data migration.sql') // spaces in path
// :A: message('Can\'t connect')      // escaped quote
// :A: files:['auth.js','lib/utils.js'] // array of paths
```

**No structural dots** - Use dots only for literals (versions, URLs, file paths)

## Configuration Integration

Teams can configure their preferred notation patterns:

### Priority Schemes
```yaml
priorities:
  scheme: "numeric"  # or "named"
  numeric:
    p0: "critical"   # :A: p0 → :A: priority:critical
    p1: "high"       # :A: p1 → :A: priority:high
    p2: "medium"     # :A: p2 → :A: priority:medium
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

While the notation accommodates flexible usage, Grepa tools may implement stricter parsing:

- **Linters** may enforce consistent delimiter styles
- **Parsers** may require specific marker formats  
- **CLIs** may validate parameter content
- **IDEs** may provide completion based on established patterns

See [Grepa documentation](../grepa/) for tool-specific requirements.

## Marker Philosophy

**Core Principles:**
- No JSON or YAML syntax within anchors
- No regex/pattern matching as core feature
- Focus on LLM context and navigation
- Magic Anchor syntax must be expressive enough on its own

## Search Examples

```bash
# Find all anchors
rg ":A:"

# Find by marker group
rg ":A:.*todo"      # All work items
rg ":A:.*notice"    # All warnings/alerts
rg ":A:.*domain"    # All domain-specific markers

# Find with context
rg -C2 ":A: security"  # 2 lines context
rg -B3 -A3 ":A: todo"  # 3 lines before/after

# Find in markdown (including HTML comments)
rg "<!-- :A:" --type md
```