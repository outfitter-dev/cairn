# Grep-Anchor Syntax Specification

*Version 0.2*

---

## Core Philosophy

At its heart, a grep-anchor is simply a comment containing the pattern `:ga:` - nothing more, nothing less. What makes `:ga:` special is just the `:<anchor-string>:` pattern that makes it universally searchable with grep.

Everything else in this document represents conventions and suggestions that the `grepa` parser follows. These are sensible, opinionated defaults designed to help teams build consistent, searchable codebases - but they are not requirements. Comments are lexically isolated; you are free to use whatever patterns work for your team.

---

## 1. Core Syntax

The `grepa` parser recognizes the following syntax:

```ebnf
anchor       ::= comment-leader ":ga:" tag-chain
tag-chain    ::= tag ( separator tag )*
separator    ::= "," | ";"
tag          ::= bare-tag | value-tag | json-object
bare-tag     ::= ["@"] [a-zA-Z0-9_.-]+
value-tag    ::= tag-name enclosing-delimiter tag-payload enclosing-delimiter
json-object  ::= "{" valid-json "}"
```

**Parser Convention**: The `grepa` tools accept comma (`,`) or semicolon (`;`) separation for tag chains. This flexibility allows teams to choose their preferred style.

### 1.1 The Anchor

Every grep-anchor begins with `:ga:` preceded by the appropriate comment syntax for the language:

```javascript
// :ga:fix critical auth bypass
# :ga:perf optimize this loop
/* :ga:docs needs examples */
<!-- :ga:test missing edge cases -->
```

### 1.2 Tag Types

**Bare tags** - Simple identifiers that convey meaning:
```
:ga:fix
:ga:feat
:ga:p0                # Priority level
:ga:v2.0              # Version marker
:ga:@alice            # Person/agent assignment
```

**Tag-associated values** - Tags with values enclosed by delimiters:
```
:ga:todo(T-123)       # Parentheses for single values
:ga:blocks[T-1,T-2]   # Brackets for arrays/lists
:ga:issue#456         # Hash for references
```

When using enclosing delimiters, everything within them is considered the tag payload. The parser identifies the tag itself as the first non-breaking word before the delimiter. A **non-breaking word** is defined as a continuous sequence of alphanumeric characters, hyphens, underscores, or dots (matching `[a-zA-Z0-9_.-]+`).

Examples:
- `todo(T-123)` → tag: `todo`, payload: `T-123`
- `depends-on[A,B,C]` → tag: `depends-on`, payload: `A,B,C`
- `v2.0.1#deprecated` → tag: `v2.0.1`, payload: `deprecated`

**JSON objects** - Complex structured metadata:
```javascript
// :ga:{"type":"security","severity":"critical","owner":"@security-team"}
```

### 1.3 Delimiters and Separators

The `grepa` parser recognizes these patterns:

**Enclosing delimiters** - Define value boundaries:
- `()` - Single value association (e.g., `todo(T-123)`)
- `[]` - Array/list values (e.g., `depends[A,B,C]`)
- `{}` - JSON objects

**Separators** - Divide tags or values:
- `,` - Comma separator for token chains and array items
- `;` - Semicolon separator for token chains

**Connectors** - Join parts within a tag:
- `-` - Hyphen connector (e.g., `p-high`, `fix-urgent`)
- `_` - Underscore connector (e.g., `auth_module`)

**Hierarchical connectors** - Express relationships:
- `.` - Dot notation (e.g., `api.v2`, `user.profile`)
- `/` - Path notation (e.g., `frontend/components`)

---

## 2. Tag Dictionary

### 2.1 Common Tags

#### Conventional Commit Aligned

| Tag | Purpose | Example |
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

#### Extended Tags

| Tag | Purpose | Example |
|-------|---------|---------|
| `tldr` | Brief function/module summary | `// :ga:tldr Parse and validate user credentials` |
| `sec` | Security critical | `// :ga:sec validate input` |
| `temp` | Temporary code | `// :ga:temp remove after v2.0` |
| `hack` | Workaround | `// :ga:hack browser bug` |
| `todo` | Future work | `// :ga:todo implement caching` |
| `fixme` | Known issues | `// :ga:fixme race condition` |
| `note` | Important notes | `// :ga:note see RFC-123` |
| `deprecated` | Deprecation | `// :ga:deprecated use newAPI()` |
| `breaking` | Breaking changes | `// :ga:breaking API change` |

#### Priority Tags

| Tag | Priority | Example |
|-------|----------|---------|
| `p0` | Critical | `// :ga:p0,sec auth bypass` |
| `p1` | High | `// :ga:p1,fix data loss` |
| `p2` | Medium | `// :ga:p2,feat user request` |
| `p3` | Low | `// :ga:p3,style cleanup` |

*Alternative: Some teams prefer word-based priorities like `p?high` or `p-critical`*

#### Version Tags

| Tag | Purpose | Example |
|-------|---------|---------|  
| `v2.0` | Version marker | `// :ga:v2.0,breaking API change` |
| `v1.2.3` | Specific version | `// :ga:v1.2.3,deprecated` |
| `>=v2.0` | Version range | `// :ga:>=v2.0,required` |

*See [version.md](tags/version.md) for detailed version syntax patterns*

### 2.2 Attention Tags

| Tag | Purpose | Example |
|-------|---------|---------|
| `@username` | Assign to person | `// :ga:@alice fix edge case` |
| `@team-name` | Assign to team | `// :ga:@security review` |
| `@cursor` | Cursor AI | `// :ga:@cursor generate tests` |
| `@copilot` | GitHub Copilot | `// :ga:@copilot complete function` |
| `@claude` | Claude | `// :ga:@claude explain algorithm` |
| `@agent` | Any AI agent | `// :ga:@agent optimize this` |

### 2.3 Task and Issue Tags

| Tag | Purpose | Example |
|-------|---------|---------|
| `todo` | Task to complete | `// :ga:todo implement caching` |
| `todo(ID)` | Task with reference | `// :ga:todo(T-123) add validation` |
| `issue#ID` | Issue reference | `// :ga:issue#456 regression` |
| `blocks[...]` | Blocking tasks | `// :ga:blocks[T-1,T-2] waiting on deps` |
| `depends(ID)` | Dependencies | `// :ga:depends(T-3) needs auth first` |

*See [tasks-todos-issues.md](tags/tasks-todos-issues.md) for detailed patterns*

---

## 3. Tag Chains

### 3.1 Combining Tags

Create tag chains by combining tags with commas or semicolons. The `grepa` parser accepts both separators:

```javascript
// :ga:fix,sec,p0 critical auth vulnerability
// :ga:temp;hack;@alice workaround for iOS 15
// :ga:feat,breaking;v2.0 new async API
// :ga:todo(T-123);blocks[T-99] implementation blocked
```

**Parser flexibility**: The `grepa` tools accept both comma and semicolon separators:
```javascript
// :ga:fix,sec,p0        // Comma-separated
// :ga:fix;sec;p0        // Semicolon-separated
// :ga:fix,sec;p0        // Mixed (valid)
// :ga:fix sec p0         // Spaces won't parse as separate tags
```

### 3.2 Common Patterns

Effective combinations of tags:

```python
# :ga:fix,@alice null check needed
# :ga:review,@security-team crypto implementation
# :ga:perf,@cursor,database optimize queries
# :ga:todo(T-456),p1,@backend implement API
```

### 3.3 Tag-Associated Values

Tags can carry values using various delimiters:

```go
// :ga:deprecated;v1.5;until(v2.0) old API removal
// :ga:feat,v2.1,api new async endpoints
// :ga:fix;p1;auth;@security critical patch
// :ga:todo(JIRA-123);depends[AUTH-1,AUTH-2]
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
// :ga:fix,p1,@backend handle undefined user
/* :ga:perf,cache consider memoization */
/** :ga:docs,@tech-writer add JSDoc */
```

### Python
```python
# :ga:refactor,models use dataclass
"""
:ga:test,p1 add integration tests
"""
```

### Go
```go
// :ga:todo(T-89),server context cancellation
/* :ga:sec,p0 validate user input */
```

### HTML/XML
```html
<!-- :ga:a11y,p1 missing alt text -->
<!-- :ga:seo,landing meta description -->
```

### CSS/SCSS
```css
/* :ga:style,v2.0 use CSS variables */
// :ga:responsive,header mobile breakpoint
```

### Shell/Bash
```bash
# :ga:fix,p2 handle spaces in filenames
# :ga:perf,@devops parallel processing
```

### SQL
```sql
-- :ga:perf,orders add index on user_id
/* :ga:perf,p0,@dba optimize join */
```

---

## 6. Value Filters and Search Patterns

The `grepa` CLI supports advanced search patterns for filtering anchors by their values:

### 6.1 Basic Value Matching

| Pattern | Description | Example |
|---------|-------------|---------|
| `tag=*` | Any tag with a value | `grepa find todo=*` |
| `tag=value` | Exact value match | `grepa find todo=T-123` |
| `tag!=value` | Value NOT equal | `grepa find todo!=T-123` |
| `*=value` | Any tag with this value | `grepa find *=T-123` |

### 6.2 Advanced Matching

| Pattern | Description | Example |
|---------|-------------|---------|
| `tag~=value` | Array membership | `grepa find blocks~=T-123` |
| `tag~/regex/` | Regex match | `grepa find version~/^v2\./` |
| `{field}=value` | JSON field match | `grepa find {type}=security` |
| `tag={*}` | Has JSON payload | `grepa find config={*}` |
| `*={*}` | Any tag with JSON | `grepa find *={*}` |

### 6.3 Negation Forms

The CLI supports multiple ways to express negation:

```bash
# Bang prefix (must be quoted in shell)
grepa find sec '!fix'        # Security but NOT fix

# Value inequality  
grepa find todo!=T-123       # Todo not equal to T-123

# Verbose flag
grepa --not temp find sec    # Global negation flag
```

### 6.4 Pattern Logic

- **AND logic** (default): Space or comma separated
- **OR logic**: Pipe `|` or `--any` flag
- **Grouping**: Parentheses with precedence AND > OR

```bash
grepa find fix sec           # fix AND sec
grepa find fix | sec         # fix OR sec  
grepa find "(fix,sec)|temp"  # (fix AND sec) OR temp
```

---

## 7. Best Practices

1. **Start with TLDR**: Every function/module should begin with `// :ga:tldr <summary>`
2. **Be Specific**: `// :ga:fix,auth` is better than `// :ga:fix`
3. **Use Common Tokens**: Stick to widely-understood tokens when possible
4. **Build Token Chains**: Combine tokens to tell a complete story
5. **Track Versions**: Use tokens like `v2.0` or `until(v3.0)` for lifecycle
6. **Assign Ownership**: Use `@username` tokens for accountability
7. **Reference Tasks**: Link to external systems with `todo(T-123)` patterns
8. **Be Consistent**: Pick comma or semicolon separation and stick with it

---

## 8. Anti-Patterns

❌ **Don't use natural language as tokens**
```javascript
// Bad:  :ga:this-needs-to-be-fixed-eventually
// Good: :ga:fix,p3 validation edge case
```

❌ **Don't embed code in anchors**
```javascript
// Bad:  :ga:console.log('debug')
// Good: :ga:temp,@dev remove debug log
```

❌ **Don't nest anchors**
```javascript
// Bad:  :ga:fix :ga:test broken
// Good: :ga:fix,test broken validation
```

❌ **Don't over-tokenize**
```javascript
// Bad:  :ga:fix,bug,error,problem,issue,urgent,asap,p0,critical
// Good: :ga:fix,p0,@alice null pointer exception
```

**Remember**: While the `grepa` parser expects comma or semicolon separation, `:ga:` patterns in comments remain searchable regardless of format. The conventions exist to help teams build consistency.