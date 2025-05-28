# Domain-Specific Patterns
<!-- :A: tldr Specialized patterns for specific technical domains -->
<!-- :A: convention Domain-specific markers for security, performance, and more -->

Specialized markers for specific technical domains and concerns.

## Security

### `:A: sec`
**Purpose**: Security-critical code requiring review
```javascript
// :A: sec validate all inputs before SQL query
// :A: sec, p0 authentication bypass vulnerability
```

### `:A: vuln`
**Purpose**: Known vulnerability
```python
# :A: vuln CVE-2024-1234 needs patch
```

### `:A: crypto`
**Purpose**: Cryptographic operations
```go
// :A: crypto constant-time comparison required
```

### `:A: auth`
**Purpose**: Authentication/authorization
```java
// :A: auth check permissions before access
```

## Performance

### `:A: perf`
**Purpose**: Performance-critical sections
```rust
// :A: perf hot path - optimize carefully
// :A: perf, p1 N+1 query problem
```

### `:A: bench`
**Purpose**: Needs benchmarking
```go
// :A: bench measure before optimizing
```

### `:A: cache`
**Purpose**: Caching considerations
```python
# :A: cache consider memoization
# :A: cache invalidation needed
```

### `:A: async`
**Purpose**: Asynchronous operations
```javascript
// :A: async avoid blocking main thread
```

## Accessibility

### `:A: a11y`
**Purpose**: Accessibility requirements
```html
<!-- :A: a11y add ARIA labels -->
<!-- :A: a11y, wcag ensure AA compliance -->
```

### `:A: i18n`
**Purpose**: Internationalization
```javascript
// :A: i18n extract hardcoded strings
```

### `:A: rtl`
**Purpose**: Right-to-left support
```css
/* :A: rtl needs directional styles */
```

## Data & Storage

### `:A: migration`
**Purpose**: Database migrations
```sql
-- :A: migration breaking change in v2
-- :A: migration, rollback plan needed
```

### `:A: index`
**Purpose**: Database indexing
```sql
-- :A: index add covering index for query
```

### `:A: schema`
**Purpose**: Schema changes
```graphql
# :A: schema breaking change
# :A: schema, deprecated remove in v3
```

## Architecture

### `:A: pattern`
**Purpose**: Design pattern implementation
```java
// :A: pattern singleton - thread safety
// :A: pattern, factory consider dependency injection
```

### `:A: coupling`
**Purpose**: Coupling concerns
```python
# :A: coupling high - needs refactoring
# :A: coupling, tech database-specific
```

### `:A: debt`
**Purpose**: Technical debt
```javascript
// :A: debt, refactor extract to service
// :A: debt, p2 legacy code needs update
```

## Platform Specific

### `:A: browser`
**Purpose**: Browser compatibility
```javascript
// :A: browser, ie11 needs polyfill
// :A: browser, safari webkit prefix required
```

### `:A: mobile`
**Purpose**: Mobile considerations
```swift
// :A: mobile, memory watch for leaks
// :A: mobile, battery optimize polling
```

### `:A: platform`
**Purpose**: Platform-specific code
```python
# :A: platform, windows path handling
# :A: platform, linux permissions check
```

## Testing & Quality

### `:A: test`
**Purpose**: Testing requirements
```javascript
// :A: test, unit add edge cases
// :A: test, integration mock external service
```

### `:A: coverage`
**Purpose**: Code coverage gaps
```python
# :A: coverage error path not tested
```

### `:A: flaky`
**Purpose**: Unreliable tests
```go
// :A: flaky timing-dependent test
```

## API & Contracts

### `:A: breaking`
**Purpose**: Breaking changes
```typescript
// :A: breaking, v3 parameter order changed
```

### `:A: deprecated`
**Purpose**: Deprecation notices
```java
// :A: deprecated use newMethod() instead
// :A: deprecated, remove:v4.0
```

### `:A: experimental`
**Purpose**: Unstable features
```rust
// :A: experimental API may change
```

## Best Practices

1. **Combine with Priority**: `:A: sec, p0` for critical security
2. **Add Context**: Include specific concern after marker
3. **Version Breaking Changes**: `:A: breaking, v2` 
4. **Link Standards**: `:A: a11y, wcag-2.1`
5. **Specify Platforms**: `:A: browser, chrome, firefox`