# Grepa Notation Format Specification

## Core Format

Every grep-anchor follows this pattern:

```
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
token       ::= bare-token | json-object | array
bare-token  ::= ["@"] [a-zA-Z0-9_.-]+
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
// :ga:fix null check      (JavaScript)
# :ga:todo refactor        (Python)
-- :ga:perf add index      (SQL)
```

### Multi-line Comments
```javascript
/* :ga:doc needs examples */
/**
 * :ga:api public interface
 */
```

### Documentation Comments
```python
"""
:ga:module core authentication
"""
```

## Payload Separators

Tokens can be separated by:
- Comma: `:ga:fix,sec`
- Space: `:ga:fix sec`
- Pipe: `:ga:fix|sec` (rare)

## Whitespace Rules

- No space between sigil and payload: `:ga:todo` ✓
- Space after payload recommended: `:ga:todo implement cache` ✓
- Leading/trailing spaces trimmed: ` :ga:todo ` → `:ga:todo`