# Cairns Examples
<!-- :M: tldr Pure notation examples showing Cairns format in various contexts -->
<!-- :M: notation Examples of Cairns notation across languages -->

Pure notation examples showing the Cairns format in various contexts.

## Basic Notation

### Simple Markers
```javascript
// :M: todo
// :M: fix
// :M: security
// :M: @alice
```

### Multiple Markers
```python
# :M: fix,sec                    # Good: closely related
# :M: todo(priority:critical)    # Priority parameter
# :M: todo,refactor,perf         # Consider splitting for clarity
```

### Parameters with Colons
```go
// :M: priority:high
// :M: status:blocked
// :M: owner:@alice
```

### Arrays with Brackets
```ruby
# :M: tags:[frontend,backend,api]
# :M: reviewers:[@alice,@bob]
# :M: blocked:[4,7,12]
```

## Language Examples

### JavaScript/TypeScript
```javascript
// :M: todo implement error handling
/* :M: perf(priority:medium) optimize render loop */
/** 
 * :M: api public interface
 */
```

### Python
```python
# :M: fix handle None case
"""
:M: module authentication system
"""
# :M: test,assign:@qa needs integration tests
```

### Go
```go
// :M: todo add context support
/* :M: breaking api change in v2 */
// :M: config(goroutine:true,poolSize:10)
```

### Rust
```rust
// :M: unsafe review needed
/* :M: perf,todo optimize allocations */
/// :M: api public trait
```

### Java
```java
// :M: deprecated use newMethod() instead
/* :M: todo(sync:required) thread safety */
/** :M: since:v1.5 */
```

### HTML/XML
```html
<!-- :M: todo(a11y:required) add aria labels -->
<!-- :M: seo,priority:high meta tags missing -->
<!-- :M: responsive breakpoint -->
```

### CSS
```css
/* :M: theme dark mode support */
/* :M: todo(browser:ie11) fallback needed */
/* :M: refactor use CSS vars */
```

### SQL
```sql
-- :M: todo(index:covering) add covering index
-- :M: perf,todo slow join optimization
/* :M: migration required for v2 */
```

### Bash/Shell
```bash
# :M: todo(posix:required) ensure compatibility
# :M: error needs error handling
# :M: todo add getopts parsing
```

### YAML
```yaml
# :M: config production values
# :M: security needs encryption
# :M: todo validate schema check
```

### Markdown
```markdown
<!-- :M: draft needs review -->
<!-- :M: todo update sections -->
<!-- :M: example add code sample -->
```

## Mention Patterns

### Direct Mentions
```javascript
// :M: @alice
// :M: @backend-team
// :M: @cursor
```

### Ownership with Mentions
```javascript
// :M: owner:@alice
// :M: reviewer:@bob
// :M: assign:@security
```

### Multiple Mentions
```javascript
// :M: reviewers:[@alice,@bob]
// :M: cc:[@qa,@docs]
// :M: escalate:[@lead,@manager]
```

## Complex Examples

### Complex Context (use multiple lines)
```javascript
// Instead of:
// :M: bug,priority:critical,owner:@alice,blocked:AUTH-123,sprint:2025-Q1

// Better:
// :M: bug(priority:critical) payment processing error
// :M: owner:@alice assigned for immediate fix
// :M: blocked(issue:AUTH-123) waiting on auth service
// :M: todo(sprint:2025-Q1) scheduled for next sprint
```

### Version Tracking
```javascript
// Instead of:
// :M: since:v2.0,deprecated:v3.0,until:v4.0

// Better:
// :M: since:v2.0
// :M: deprecated:v3.0 use newMethod() instead  
// :M: until:v4.0
```

### Workflow Chain (separate for clarity)
```javascript
// Instead of:
// :M: draft,review,assign:@senior,deadline:2025-01-30

// Better:
// :M: draft API design document
// :M: review architecture decisions needed
// :M: assign:@senior security implications
// :M: deadline:2025-01-30
```