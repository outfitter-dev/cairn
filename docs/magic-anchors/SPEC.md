<!-- :ga:tldr canonical grepa notation specification -->
# Grepa Notation Specification

The canonical specification for the grepa notation system - a breadcrumb protocol for code navigation.

## Overview

Grepa is a breadcrumb protocol that enables developers and AI agents to leave structured, searchable markers throughout codebases. The notation accommodates diverse team preferences while recommending patterns that enable effective tooling and cross-project consistency.

## Core Grammar

```ebnf
anchor      ::= sigil marker-list prose?
sigil       ::= ":" identifier ":"
marker-list ::= marker ("," marker)*
marker      ::= identifier scope? parameter?
scope       ::= ":" identifier
parameter   ::= "(" content ")"
prose       ::= " " text
```

## Basic Structure

### Sigil
The notation recognizes `:ga:` as the standard sigil, though custom sigils are accommodated for team-specific needs.

```javascript
// Standard sigil
// :ga:todo implement authentication

// Custom sigil (alternative)
// :team:todo implement authentication
```

### Markers
Markers classify the anchor's purpose. The notation recommends established core markers while accommodating domain-specific extensions.

```javascript
// Core markers
// :ga:todo implement rate limiting
// :ga:bug memory leak in auth service
// :ga:sec validate all user inputs
```

## Delimiter Patterns

The notation accommodates two delimiter approaches, with recommendations based on semantic clarity.

### Scope Delimiters (`:`)
Recommended for categorical relationships where the value represents a type or classification.

```javascript
// :ga:priority:high        // priority IS high
// :ga:status:blocked       // status IS blocked  
// :ga:env:production       // environment IS production
```

### Parameter Delimiters (`()`)
Recommended for relational data, targets, and complex values.

```javascript
// :ga:depends(auth-service)     // depends ON auth-service
// :ga:see(auth.js:42)           // see file at location
// :ga:pattern(singleton)        // implements pattern
```

### Combined Usage
The notation accommodates scope and parameter combinations for nuanced expression.

```javascript
// :ga:config:env(production)    // config scope: env, value: production
// :ga:impact:security(high)     // impact scope: security, severity: high
// :ga:rel:depends(auth-service) // relationship scope: depends, target: auth-service
```

**Recommendation:** Use scope when the context type matters for disambiguation, parameters when providing specific values or targets.

## Core Markers

The notation recognizes these established markers while accommodating extensions.

### General Markers
- `todo` - work that needs doing (synonyms: `fixme`, `bug`, `task`)
- `context` - important background information (synonyms: `ctx`)  
- `needs` - prerequisites or missing requirements (synonyms: `requires`, `missing`)
- `temp` - temporary code for replacement (synonyms: `tmp`, `placeholder`)

### Navigation Markers  
- `entry` - entry points and main interfaces (synonyms: `start-here`)
- `explains` - documentation and explanatory content (synonyms: `about`, `why`, `describes`, `clarifies`)

### Quality Markers
- `impact` - change impact assessment with typed severity
- `pattern` - design pattern documentation  
- `state` - state management and mutability markers
- `sec` - security-sensitive code (synonyms: `security`)
- `perf` - performance-related code (synonyms: `performance`)

### Reference Markers
- `see` - file or code references
- `ref` - general references (synonyms: `reference`)
- `rel` - relationships between entities

### Versioning Markers  
- `since` - version introduced
- `until` - version for removal
- `due` - due dates (synonyms: `deadline`)

## Relational Patterns

The notation accommodates relationship expression through the universal `rel()` marker, enabling tools to build dependency graphs.

```javascript
// :ga:rel(depends:auth-service)    // dependency relationship
// :ga:rel(blocks:issue:4)          // blocking relationship  
// :ga:rel(emits:user.created)      // event relationship
// :ga:rel(consumes:api:v2/users)   // API relationship
```

**Alternative approach:** Direct relational markers with parameter expansion (tool-dependent).
```javascript
// :ga:depends(auth-service)    // expands to rel(depends:auth-service)
// :ga:blocks(issue:4)          // expands to rel(blocks:issue:4)
```

## Multi-line Anchors

The notation accommodates multi-line expression in compatible comment formats while recommending single-line for simplicity.

```html
<!-- :ga:
  todo,
  priority:critical,
  blocked(by:issue:4),
  owner@alice fix authentication bug
-->
```

**Recommendation:** Use multi-line only for complex marker combinations that significantly improve readability.

## Prose Attribution

The notation recognizes prose as belonging to the entire anchor, separated by the first space after structured content.

```javascript
// :ga:todo,priority:high implement rate limiting before launch
//     ^^^^^^^^^^^^^^^^^^^ structured markers
//                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ prose
```

## Quoting and Escaping

The notation accommodates special characters through established quoting conventions.

**Simple values** (no quotes needed):
```javascript
// :ga:user(alice)
// :ga:version(2.0.1)  
// :ga:priority:high
```

**Complex values** (quotes recommended):
```javascript
// :ga:regex('user-\d+')
// :ga:path('/path/with spaces')
// :ga:message('Can\'t connect')
```

## Configuration Integration

The notation enables team customization through configuration while maintaining cross-project readability.

### Priority Schemes
```yaml
priorities:
  scheme: "numeric"  # or "named"
  numeric:
    p0: "critical"
    p1: "high"
```

### Version Styles
```yaml
versioning:
  style: "semver"  # accommodates semver, python, maven, etc.
```

## Tool Integration Notes

While the notation accommodates flexible usage, tools may implement stricter parsing rules:

- **Linters** may enforce consistent delimiter styles
- **Parsers** may require specific marker formats  
- **CLIs** may validate parameter content
- **IDEs** may provide completion based on established patterns

See [toolset documentation](../toolset/) for tool-specific requirements and enforcement details.

## Synonyms vs Aliases

**Synonyms:** Different words for identical concepts (no transformation)
- `ctx` ↔ `context`
- `start-here` ↔ `entry`

**Aliases:** Shortcuts that expand to complex patterns (transformation required)  
- `p0` → `priority:critical`
- `blocked` → `rel(blocked-by:$1)`

## Extension Patterns

The notation accommodates domain-specific markers while recommending consistency with established patterns:

```javascript
// Domain extensions
// :ga:deployment:stage(staging)
// :ga:compliance:soc2(required)  
// :ga:experiment:feature-flag(new-checkout)
```

**Recommendation:** Extend through scoped markers rather than entirely new marker vocabularies to maintain tool compatibility.