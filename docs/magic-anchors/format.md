# Grepa Notation Format Specification
<!-- :ga:tldr Formal specification for grep-anchor notation format -->
<!-- :ga:notation Technical format specification and grammar rules -->

## Core Format

Every grep-anchor follows this pattern:

```text
<comment-leader> :ga:payload
```

### Components

1. **Comment Leader**: Language-appropriate comment syntax
2. **Sigil**: The marker `:ga:` (or custom sigil)
3. **Payload**: One or more tokens

## Formal Grammar

```ebnf
anchor      ::= comment-leader sigil payload
sigil       ::= ":ga:" | ":" identifier ":"
payload     ::= token ( separator token )*
token       ::= bare-token | parameter | json-object | array
bare-token  ::= ["@"] [a-zA-Z0-9_.-]+
parameter   ::= bare-token "(" [^)]* ")"    # optional parameter payload
json-object ::= "{" valid-json "}"
array       ::= "[" item ("," item)* "]"
separator   ::= "," | " " | "|"
```

## Sigil Rules

### Standard Sigil
```javascript
// :ga:todo  // Standard grep-anchor
```

### Custom Sigils
Projects can define custom sigils:
```javascript
// :proj:milestone-1  // Project-specific
// :team:backend      // Team-specific
// :api:v2           // API-specific
```

## Comment Integration

The anchor must follow language comment rules:

### Single-line Comments
```javascript
// :A: fix null check      (JavaScript)
# :A: todo refactor        (Python)
-- :A: perf add index      (SQL)
```

### Multi-line Comments
```javascript
/* :A: doc needs examples */
/**
 * :A: api public interface
 */
```

### Documentation Comments
```python
"""
:A: module core authentication
"""  
```

### HTML Comments (for Markdown)
```markdown
<!-- :A: tldr Quick summary of the document -->
<!-- :A: guide Step-by-step instructions -->
```

## Delimiter Semantics

Magic Anchors use three distinct delimiters:

### Colon (`:`) - Classifications
```javascript
// :A: priority:high         // priority classification
// :A: status:blocked        // status classification  
// :A: owner:@alice          // ownership (including mentions)
```

### Parentheses (`()`) - Parameters
```javascript
// :A: blocked(issue:4)           // parameter with classification
// :A: depends(auth-service)      // simple parameter
// :A: config(timeout:30,retry:3) // multiple parameters
```

### Brackets (`[]`) - Arrays
```javascript
// :A: blocked:[4,7]              // multiple values
// :A: owner:[@alice,@bob]        // multiple mentions
// :A: blocked:4                  // single value (brackets optional)
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

- **Mandatory space after sigil**: `:A: todo` ✓ (NOT `:A:todo` ✗)
- Space separates markers from prose: `:A: todo implement cache` ✓
- Leading/trailing spaces in values are trimmed

## Line Length Considerations

For better grep results and readability:
- Keep total line length under ~120 characters
- Use separate anchor lines for distinct concerns
- Combine only closely related markers

```javascript
// Good: Single-line anchor
// :A: todo(priority:high) implement rate limiting

// Better: Multiple related anchors for complex context
// :A: todo(priority:high) implement rate limiting
// :A: context API allows 100 requests/minute  
// :A: depends(redis) requires cache service
```

## Key Decisions

1. **No JSON/YAML** within anchors - use structured parameters instead
2. **No regex patterns** - use string matching functions
3. **No structural dots** - dots only for literals (versions, URLs, paths)
4. **Colon for all mentions** - `owner:@alice` not `owner@alice`