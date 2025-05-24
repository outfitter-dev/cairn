# Notation Examples

Pure notation examples showing the format in various contexts.

## Basic Notation

### Simple Tokens
```javascript
// :ga:todo
// :ga:fix
// :ga:v1.0
// :ga:@alice
```

### Multiple Tokens
```python
# :ga:fix,sec
# :ga:p0,urgent,breaking
# :ga:todo,refactor,perf
```

### JSON Payloads
```go
// :ga:{"type":"bug","id":"BUG-123"}
// :ga:{"priority":"high","assignee":"@team"}
```

### Array Payloads
```ruby
# :ga:[frontend,backend,api]
# :ga:[@alice,@bob]
```

## Language Examples

### JavaScript/TypeScript
```javascript
// :ga:todo implement error handling
/* :ga:perf,p2 optimize render loop */
/** 
 * :ga:api public interface
 */
```

### Python
```python
# :ga:fix handle None case
"""
:ga:module authentication system
"""
# :ga:test,@qa needs integration tests
```

### Go
```go
// :ga:todo add context support
/* :ga:breaking api change in v2 */
// :ga:{"goroutine":true,"poolSize":10}
```

### Rust
```rust
// :ga:unsafe review needed
/* :ga:perf,mem optimize allocations */
/// :ga:api public trait
```

### Java
```java
// :ga:deprecated use newMethod() instead
/* :ga:synchronized thread safety */
/** :ga:since@v1.5 */
```

### HTML/XML
```html
<!-- :ga:a11y add aria labels -->
<!-- :ga:seo,p1 meta tags missing -->
<!-- :ga:responsive breakpoint -->
```

### CSS
```css
/* :ga:theme dark mode support */
/* :ga:browser,ie11 fallback needed */
/* :ga:refactor use CSS vars */
```

### SQL
```sql
-- :ga:index add covering index
-- :ga:perf,query slow join
/* :ga:migration required for v2 */
```

### Bash/Shell
```bash
# :ga:posix ensure compatibility
# :ga:error needs error handling
# :ga:todo add getopts
```

### YAML
```yaml
# :ga:config production values
# :ga:secret needs encryption
# :ga:validate schema check
```

### Markdown
```markdown
<!-- :ga:draft needs review -->
<!-- :ga:toc update sections -->
<!-- :ga:example add code sample -->
```

## Mention Patterns

### Direct Mentions
```javascript
// :ga:@alice
// :ga:@backend-team
// :ga:@cursor
```

### Attributed Mentions
```javascript
// :ga:owner@alice
// :ga:reviewer@bob
// :ga:attn@security
```

### Multiple Mentions
```javascript
// :ga:reviewers[@alice,@bob]
// :ga:cc(@qa,@docs)
// :ga:escalate[@lead,@manager]
```

## Complex Examples

### Multi-part Metadata
```javascript
// :ga:bug,p0,@alice,{"blocker":true,"sprint":"2025-Q1"}
```

### Version Tracking
```javascript
// :ga:introduced@v2.0,deprecated@v3.0,removed@v4.0
```

### Workflow Chain
```javascript
// :ga:draft,needs-review,attn@senior,due@2025-01-30
```