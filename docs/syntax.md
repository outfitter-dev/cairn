# Grep-Anchor Syntax Specification

*Version 0.1*

---

## 1. Core Syntax

```ebnf
anchor      ::= comment-leader ":ga:" payload
payload     ::= token ( separator token )*
token       ::= bare-token | json-object | array
bare-token  ::= ["@"] [a-zA-Z0-9_.-]+
json-object ::= "{" valid-json "}"
array       ::= "[" item ("," item)* "]"
separator   ::= "," | " " | "|"
```

### 1.1 The Anchor

Every grep-anchor begins with `:ga:` preceded by the appropriate comment syntax for the language:

```javascript
// :ga:fix critical auth bypass
# :ga:perf optimize this loop
/* :ga:docs needs examples */
<!-- :ga:test missing edge cases -->
```

### 1.2 Token Types

**Bare tokens** - Simple identifiers:
```
:ga:fix
:ga:v1.2.3
:ga:@alice
:ga:high-priority
```

**JSON objects** - Structured metadata:
```javascript
// :ga:{"type":"security","severity":"critical","owner":"@security-team"}
```

**Arrays** - Multiple values:
```python
# :ga:["python","rust","go"]
```

---

## 2. Standard Token Categories

### 2.1 Conventional Commit Aligned

| Token | Purpose | Example |
|-------|---------|---------|
| `fix` | Bug fixes | `// :ga:fix null pointer in auth` |
| `feat` | New features | `// :ga:feat implement OAuth2` |
| `docs` | Documentation | `// :ga:docs add API examples` |
| `style` | Formatting | `// :ga:style needs prettier` |
| `refactor` | Code restructuring | `// :ga:refactor extract method` |
| `perf` | Performance | `// :ga:perf n+1 query issue` |
| `test` | Testing | `// :ga:test missing unit tests` |
| `build` | Build system | `// :ga:build webpack config` |
| `ci` | CI/CD | `// :ga:ci add GitHub action` |
| `chore` | Maintenance | `// :ga:chore update deps` |
| `revert` | Reverts | `// :ga:revert undo commit abc123` |

### 2.2 Extended Categories

| Token | Purpose | Example |
|-------|---------|---------|
| `sec` | Security critical | `// :ga:sec validate input` |
| `temp` | Temporary code | `// :ga:temp remove after v2.0` |
| `hack` | Workaround | `// :ga:hack browser bug` |
| `todo` | Future work | `// :ga:todo implement caching` |
| `fixme` | Known issues | `// :ga:fixme race condition` |
| `note` | Important notes | `// :ga:note see RFC-123` |
| `deprecated` | Deprecation | `// :ga:deprecated use newAPI()` |
| `breaking` | Breaking changes | `// :ga:breaking API change` |

### 2.3 Agent-Specific

| Token | Purpose | Example |
|-------|---------|---------|
| `@cursor` | Cursor AI | `// :ga:@cursor generate tests` |
| `@copilot` | GitHub Copilot | `// :ga:@copilot complete function` |
| `@claude` | Claude | `// :ga:@claude explain algorithm` |
| `@agent` | Any AI agent | `// :ga:@agent optimize this` |

### 2.4 Priority Levels

| Token | Priority | Example |
|-------|----------|---------|
| `p0` | Critical | `// :ga:p0,sec auth bypass` |
| `p1` | High | `// :ga:p1,fix data loss` |
| `p2` | Medium | `// :ga:p2,feat user request` |
| `p3` | Low | `// :ga:p3,style cleanup` |

---

## 3. Compound Anchors

### 3.1 Multiple Tokens

Combine tokens with commas or spaces:

```javascript
// :ga:fix,sec,p0 critical auth vulnerability
// :ga:temp hack workaround for iOS 15
// :ga:feat breaking v2.0
```

### 3.2 Ownership

Use `@` prefix for assignees:

```python
# :ga:fix,@alice null check needed
# :ga:review,@security-team crypto implementation
```

### 3.3 Versioning

Track introduction or target versions:

```go
// :ga:deprecated,v1.5 removed in v2.0
// :ga:feat,v2.1 new async API
```

---

## 4. Structured Metadata

### 4.1 JSON Format

For complex metadata, use JSON:

```javascript
// :ga:{"type":"bug","priority":"p0","assignee":"@alice","due":"2024-03-01"}
```

### 4.2 Common JSON Fields

| Field | Type | Purpose |
|-------|------|---------|
| `type` | string | Anchor category |
| `priority` | string | Priority level |
| `assignee` | string | Owner/assignee |
| `due` | string | Due date (ISO 8601) |
| `issue` | string | Issue/ticket ID |
| `since` | string | Version introduced |
| `until` | string | Version to remove |
| `tags` | array | Additional tags |

---

## 5. Language-Specific Examples

### JavaScript/TypeScript
```javascript
// :ga:fix,p1 handle undefined user
/* :ga:perf consider memoization */
/** :ga:docs add JSDoc */
```

### Python
```python
# :ga:refactor use dataclass
"""
:ga:test add integration tests
"""
```

### Go
```go
// :ga:todo context cancellation
/* :ga:sec validate user input */
```

### HTML/XML
```html
<!-- :ga:a11y missing alt text -->
<!-- :ga:seo meta description -->
```

### CSS/SCSS
```css
/* :ga:style use CSS variables */
// :ga:responsive mobile breakpoint
```

### Shell/Bash
```bash
# :ga:fix handle spaces in filenames
# :ga:perf parallel processing
```

### SQL
```sql
-- :ga:index add index on user_id
/* :ga:perf optimize join */
```

---

## 6. Best Practices

1. **Be Specific**: `// :ga:fix auth` is better than `// :ga:fix`
2. **Use Standard Tokens**: Stick to conventional commit types when possible
3. **Add Context**: Include brief description after tokens
4. **Version Markers**: Use versions for temporary code
5. **Assign Ownership**: Use `@username` for accountability
6. **Combine Wisely**: `fix,sec,p0` clearly indicates critical security fix

---

## 7. Anti-Patterns

❌ **Don't use natural language as tokens**
```javascript
// Bad:  :ga:this-needs-to-be-fixed-eventually
// Good: :ga:fix,p3 validation edge case
```

❌ **Don't nest anchors**
```javascript
// Bad:  :ga:fix :ga:test broken
// Good: :ga:fix,test broken validation
```

❌ **Don't use anchors for code**
```javascript
// Bad:  :ga:console.log('debug')
// Good: :ga:todo remove debug log
```