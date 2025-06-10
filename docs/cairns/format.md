# Cairn Notation Format Specification
<!-- :M: tldr Formal specification for Cairn notation format -->
<!-- :M: notation Technical format specification and grammar rules -->

## Core Format

Every cairn follows this pattern:

```text
<comment-leader> :M: payload
```

### Components

1. **Comment Leader**: Language-appropriate comment syntax
2. **Identifier**: The marker `:M:` (or custom identifier)
3. **Payload**: One or more tokens

## Formal Grammar

```ebnf
cairn       ::= comment-leader identifier payload
identifier  ::= ":M:" | ":" identifier ":"
payload     ::= token ( separator token )*
token       ::= bare-token | parameter | json-object | array
bare-token  ::= ["@"] [a-zA-Z0-9_.-]+
parameter   ::= bare-token "(" [^)]* ")"    # optional parameter payload
json-object ::= "{" valid-json "}"
array       ::= "[" item ("," item)* "]"
separator   ::= "," | " " | "|"
```

## Identifier Rules

### Standard Identifier
```javascript
// :M: todo  // Standard Cairn
```

### Custom Identifiers
Projects can define custom identifiers:
```javascript
// :proj:milestone-1  // Project-specific
// :team:backend      // Team-specific
// :api:v2           // API-specific
```

## Comment Integration

The cairn must follow language comment rules:

### Single-line Comments
```javascript
// :M: fix null check      (JavaScript)
# :M: todo refactor        (Python)
-- :M: perf add index      (SQL)
```

### Multi-line Comments
```javascript
/* :M: doc needs examples */
/**
 * :M: api public interface
 */
```

### Documentation Comments
```python
"""
:M: module core authentication
"""  
```

### HTML Comments (for Markdown)
```markdown
<!-- :M: tldr Quick summary of the document -->
<!-- :M: guide Step-by-step instructions -->
```

## Delimiter Semantics

Cairns use three distinct delimiters:

### Colon (`:`) - Classifications
```javascript
// :M: priority:high         // priority classification
// :M: status:blocked        // status classification  
// :M: owner:@alice          // ownership (including mentions)
```

### Parentheses (`()`) - Parameters
```javascript
// :M: blocked(issue:4)           // parameter with classification
// :M: depends(auth-service)      // simple parameter
// :M: config(timeout:30,retry:3) // multiple parameters
```

### Brackets (`[]`) - Arrays
```javascript
// :M: blocked:[4,7]              // multiple values
// :M: owner:[@alice,@bob]        // multiple mentions
// :M: blocked:4                  // single value (brackets optional)
```

## Marker Organization

Markers are organized into six semantic groups:

| Group | Purpose | Example Markers |
|-------|---------|----------------|
| **todo** | Work items | `todo`, `bug`, `fix`, `task` |
| **info** | Explanations | `context`, `ctx`, `docs`, `tldr` |
| **notice** | Warnings | `warn`, `critical`, `deprecated` |
| **trigger** | Automation | `action`, `notify`, `hook` |
| **domain** | Focus areas | `security`, `sec`, `perf`, `api` |
| **status** | Lifecycle | `temp`, `tmp`, `draft`, `complete` |

## Whitespace Rules

- **Mandatory space after identifier**: `:M: todo` ✓ (NOT `:M:todo` ✗)
- Space separates markers from prose: `:M: todo implement cache` ✓
- Leading/trailing spaces in values are trimmed

## Line Length Considerations

For better grep results and readability:
- Keep total line length under ~120 characters
- Use separate anchor lines for distinct concerns
- Combine only closely related markers

```javascript
// Good: Single-line cairn
// :M: todo(priority:high) implement rate limiting

// Better: Multiple related cairns for complex context
// :M: todo(priority:high) implement rate limiting
// :M: context API allows 100 requests/minute  
// :M: depends(redis) requires cache service
```

## Key Decisions

1. **No JSON/YAML** within cairns - use structured parameters instead
2. **No regex patterns** - use string matching functions
3. **No structural dots** - dots only for literals (versions, URLs, paths)
4. **Colon for all mentions** - `owner:@alice` not `owner@alice`