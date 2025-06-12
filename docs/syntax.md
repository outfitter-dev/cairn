# Waymark Syntax
<!-- :M: tldr Complete waymark syntax specification and reference -->
<!-- :M: core The canonical waymark syntax documentation -->
Waymark syntax is a lightweight marking system for code navigation using the `:M:` identifier.

## Overview

Waymark syntax defines the **structure** for writing searchable code markers:

- The `:M:` identifier with mandatory single space
- Delimiter semantics (`:` for classifications, `()` for parameters, `[]` for arrays)
- Context organization into six semantic groups
- Simple, grep-friendly patterns

Think of it like learning to write musical notes - the syntax is simple and consistent, while what you compose with it (conventions) can be infinitely varied.

## Basic Syntax

```text
<comment-leader> :M: <space> <context-list> <optional prose>
```

The syntax consists of:

1. **Identifier**: `:M:`
2. **Space**: Exactly one ASCII space (mandatory)
3. **Contexts**: One or more contexts with optional parameters
4. **Prose**: Optional human-readable description

### Quick Examples

```javascript
// :M: todo                      // Simple context
// :M: sec,perf                  // Multiple contexts
// :M: todo(priority:high)       // Context with parameter
// :M: owner:@alice              // Classification with mention
// :M: blocked:[4,7]             // Array of values
// :M: todo: implement caching   // With prose description
```

## Payload Types

Waymarks support three payload types:

### Bare Tokens

Simple string identifiers - most common and readable.

```javascript
// :M: todo
// :M: v1.2.3
// :M: high-priority
// :M: @alice
// :M: api_endpoint
```

Format:
- Alphanumeric characters, dots, dashes, underscores
- Optional `@` prefix for mentions
- Case-sensitive

### Parameters `()`

Structured parameters and arguments associated with markers.

```javascript
// :M: blocked(issue:4)           // blocked by issue
// :M: depends(auth-service)      // simple dependency
// :M: config(timeout:30,retry:3) // multiple params
// :M: todo(assign:@alice,priority:high) // task params
```

Format:
- `marker(param:value)` - single parameter
- `marker(p1:v1,p2:v2)` - multiple parameters
- Parameters use colon syntax internally

### Arrays `[]`

Multiple values, with brackets optional for single values.

```javascript
// :M: blocked:[4,7,12]           // multiple blockers
// :M: tags:[auth,api,security]   // multiple tags
// :M: owner:[@alice,@bob]        // multiple owners
// :M: files:['auth.js','api.js'] // quoted paths
```

## Grammar

The complete formal grammar in EBNF:

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

## Context Groups

Contexts are organized into six semantic groups:

| Group | Purpose | Primary contexts |
|-------|---------|------------------|
| **todo** | Work that needs to be done | `todo`, `bug`, `fix`/`fixme`, `task`, `issue`, `pr`, `review` |
| **info** | Explanations & guidance | `context`/`ctx`, `note`, `docs`, `tldr`, `example`, `guide` |
| **notice** | Warnings & alerts | `warn`, `critical`, `unsafe`, `deprecated`, `freeze`, `unstable` |
| **trigger** | Automated behavior hooks | `action`, `notify`, `alert`, `hook` |
| **domain** | Domain-specific focus areas | `api`, `security`/`sec`, `perf`, `test`, `data`, `config` |
| **status** | Lifecycle / completeness | `temp`/`tmp`, `stub`, `draft`, `prototype`, `complete`, `broken` |

**Usage Rules:**
1. Multiple contexts can be combined with commas: `:M: todo,bug,priority:high`
2. If `todo` appears, it must be the first context
3. Work markers can appear standalone OR as parameters to `todo`

## Universal Parameter Groups

Parameters are organized into six semantic families:

| Group | Purpose | Examples |
|-------|---------|----------|
| **mention** | People/entities | `owner:@alice`, `assign:@bob`, `team:@frontend` |
| **relation** | Links/references | `parent:epic-123`, `depends:auth-svc`, `path:src/auth.js` |
| **workflow** | Coordination | `blocked:[4,7]`, `blocking:12`, `reason:compliance` |
| **priority** | Importance/risk | `priority:high`, `severity:critical`, `complexity:high` |
| **lifecycle** | Time/state | `since:1.2.0`, `until:2.0.0`, `status:in-progress` |
| **scope** | Environment | `env:prod`, `platform:ios`, `region:us-east` |

## Advanced Patterns

### Workflow Patterns

```python
# Task management
# :M: todo priority:high assignee:@alice
# :M: todo(bug:auth-timeout) deadline:2024-03-15

# Code lifecycle
# :M: deprecated since:v1.8 replacement:newMethod
# :M: freeze until:v2.0 reason:api-stability

# Dependencies
# :M: depends:[auth,session,crypto]
# :M: blocks:[checkout,payment]
```

### Monorepo Patterns

Use contexts for service namespacing:

```javascript
// In auth service
// :M: auth, todo implement OAuth flow
// :M: auth, security validate JWT expiry

// In payment service
// :M: payment, todo add Stripe webhook
// :M: payment, perf optimize transaction queries

// Cross-service references
// :M: depends(auth-service) requires:validateToken
// :M: blocks(payment-service) reason:breaking-change
```

### Issue Tracker Integration

```python
# :M: issue(123)
# :M: jira(PROJ-456)
# :M: github(#789)
# :M: linear(ENG-123) cycle:current
```

## Quoting Rules

Simple values need no quotes:
```javascript
// :M: priority:high
// :M: version(2.0.1)
// :M: owner:@alice
```

Use quotes for special characters:
```javascript
// :M: match('user-123')              // string match
// :M: path('src/data migration.sql') // spaces
// :M: message('Can\'t connect')      // escaped quote
// :M: files:['auth.js','lib/utils.js'] // array of paths
```

## Search Examples

```bash
# Find all waymarks
rg ":M:"

# Find by context group
rg ":M:.*todo"      # All work items
rg ":M:.*notice"    # All warnings/alerts
rg ":M:.*domain"    # All domain-specific markers

# Find with context
rg -C2 ":M: security"  # 2 lines context
rg -B3 -A3 ":M: todo"  # 3 lines before/after

# Find in markdown (including HTML comments)
rg "<!-- :M:" --type md

# Advanced searches
rg ":M:.*priority:high.*security"  # High-priority security
rg ":M:.*@alice" --type js         # Alice's tasks
```

## Best Practices

1. **Single space after `:M:`**: Required for consistency and parsing
2. **One waymark per line**: Maintains grep-ability
3. **Be specific**: Use clear context combinations
4. **Start simple**: Add complexity only when needed
5. **Keep it searchable**: Simple patterns are easier to grep
6. **Use HTML comments in markdown**: `<!-- :M: tldr summary -->` for non-rendered waymarks

## Philosophy

- No complex object syntax within waymarks
- No regex/pattern matching as core feature
- Focus on LLM context and navigation
- Waymark syntax must be expressive enough on its own
- Boring solutions for boring problems