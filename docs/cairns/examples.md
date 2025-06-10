# Magic Anchors Examples
<!-- :A: tldr Pure notation examples showing Magic Anchors format in various contexts -->
<!-- :A: notation Examples of Magic Anchors notation across languages -->

Pure notation examples showing the Magic Anchors format in various contexts.

## Basic Notation

### Simple Markers
```javascript
// :A: todo
// :A: fix
// :A: security
// :A: @alice
```

### Multiple Markers
```python
# :A: fix,sec                    # Good: closely related
# :A: todo(priority:critical)    # Priority parameter
# :A: todo,refactor,perf         # Consider splitting for clarity
```

### Parameters with Colons
```go
// :A: priority:high
// :A: status:blocked
// :A: owner:@alice
```

### Arrays with Brackets
```ruby
# :A: tags:[frontend,backend,api]
# :A: reviewers:[@alice,@bob]
# :A: blocked:[4,7,12]
```

## Language Examples

### JavaScript/TypeScript
```javascript
// :A: todo implement error handling
/* :A: perf(priority:medium) optimize render loop */
/** 
 * :A: api public interface
 */
```

### Python
```python
# :A: fix handle None case
"""
:A: module authentication system
"""
# :A: test,assign:@qa needs integration tests
```

### Go
```go
// :A: todo add context support
/* :A: breaking api change in v2 */
// :A: config(goroutine:true,poolSize:10)
```

### Rust
```rust
// :A: unsafe review needed
/* :A: perf,todo optimize allocations */
/// :A: api public trait
```

### Java
```java
// :A: deprecated use newMethod() instead
/* :A: todo(sync:required) thread safety */
/** :A: since:v1.5 */
```

### HTML/XML
```html
<!-- :A: todo(a11y:required) add aria labels -->
<!-- :A: seo,priority:high meta tags missing -->
<!-- :A: responsive breakpoint -->
```

### CSS
```css
/* :A: theme dark mode support */
/* :A: todo(browser:ie11) fallback needed */
/* :A: refactor use CSS vars */
```

### SQL
```sql
-- :A: todo(index:covering) add covering index
-- :A: perf,todo slow join optimization
/* :A: migration required for v2 */
```

### Bash/Shell
```bash
# :A: todo(posix:required) ensure compatibility
# :A: error needs error handling
# :A: todo add getopts parsing
```

### YAML
```yaml
# :A: config production values
# :A: security needs encryption
# :A: todo validate schema check
```

### Markdown
```markdown
<!-- :A: draft needs review -->
<!-- :A: todo update sections -->
<!-- :A: example add code sample -->
```

## Mention Patterns

### Direct Mentions
```javascript
// :A: @alice
// :A: @backend-team
// :A: @cursor
```

### Ownership with Mentions
```javascript
// :A: owner:@alice
// :A: reviewer:@bob
// :A: assign:@security
```

### Multiple Mentions
```javascript
// :A: reviewers:[@alice,@bob]
// :A: cc:[@qa,@docs]
// :A: escalate:[@lead,@manager]
```

## Complex Examples

### Complex Context (use multiple lines)
```javascript
// Instead of:
// :A: bug,priority:critical,owner:@alice,blocked:AUTH-123,sprint:2025-Q1

// Better:
// :A: bug(priority:critical) payment processing error
// :A: owner:@alice assigned for immediate fix
// :A: blocked(issue:AUTH-123) waiting on auth service
// :A: todo(sprint:2025-Q1) scheduled for next sprint
```

### Version Tracking
```javascript
// Instead of:
// :A: since:v2.0,deprecated:v3.0,until:v4.0

// Better:
// :A: since:v2.0
// :A: deprecated:v3.0 use newMethod() instead  
// :A: until:v4.0
```

### Workflow Chain (separate for clarity)
```javascript
// Instead of:
// :A: draft,review,assign:@senior,deadline:2025-01-30

// Better:
// :A: draft API design document
// :A: review architecture decisions needed
// :A: assign:@senior security implications
// :A: deadline:2025-01-30
```