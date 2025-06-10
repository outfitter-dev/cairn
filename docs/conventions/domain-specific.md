# Domain-Specific Patterns
<!-- :M: tldr Specialized patterns for specific technical domains -->
<!-- :M: convention Domain-specific Cairns for security, performance, and more -->

Specialized Cairns for specific technical domains and concerns.

## Security

### `:M: sec`
**Purpose**: Security-critical code requiring review
```javascript
// :M: sec validate all inputs before SQL query
// :M: sec, p0 authentication bypass vulnerability
```

### `:M: vuln`
**Purpose**: Known vulnerability
```python
# :M: vuln CVE-2024-1234 needs patch
```

### `:M: crypto`
**Purpose**: Cryptographic operations
```go
// :M: crypto constant-time comparison required
```

### `:M: auth`
**Purpose**: Authentication/authorization
```java
// :M: auth check permissions before access
```

## Performance

### `:M: perf`
**Purpose**: Performance-critical sections
```rust
// :M: perf hot path - optimize carefully
// :M: perf, p1 N+1 query problem
```

### `:M: bench`
**Purpose**: Needs benchmarking
```go
// :M: bench measure before optimizing
```

### `:M: cache`
**Purpose**: Caching considerations
```python
# :M: cache consider memoization
# :M: cache invalidation needed
```

### `:M: async`
**Purpose**: Asynchronous operations
```javascript
// :M: async avoid blocking main thread
```

## Accessibility

### `:M: a11y`
**Purpose**: Accessibility requirements
```html
<!-- :M: a11y add ARIA labels -->
<!-- :M: a11y, wcag ensure AA compliance -->
```

### `:M: i18n`
**Purpose**: Internationalization
```javascript
// :M: i18n extract hardcoded strings
```

### `:M: rtl`
**Purpose**: Right-to-left support
```css
/* :M: rtl needs directional styles */
```

## Data & Storage

### `:M: migration`
**Purpose**: Database migrations
```sql
-- :M: migration breaking change in v2
-- :M: migration, rollback plan needed
```

### `:M: index`
**Purpose**: Database indexing
```sql
-- :M: index add covering index for query
```

### `:M: schema`
**Purpose**: Schema changes
```graphql
# :M: schema breaking change
# :M: schema, deprecated remove in v3
```

## Architecture

### `:M: pattern`
**Purpose**: Design pattern implementation
```java
// :M: pattern singleton - thread safety
// :M: pattern, factory consider dependency injection
```

### `:M: coupling`
**Purpose**: Coupling concerns
```python
# :M: coupling high - needs refactoring
# :M: coupling, tech database-specific
```

### `:M: debt`
**Purpose**: Technical debt
```javascript
// :M: debt, refactor extract to service
// :M: debt, p2 legacy code needs update
```

## Platform Specific

### `:M: browser`
**Purpose**: Browser compatibility
```javascript
// :M: browser, ie11 needs polyfill
// :M: browser, safari webkit prefix required
```

### `:M: mobile`
**Purpose**: Mobile considerations
```swift
// :M: mobile, memory watch for leaks
// :M: mobile, battery optimize polling
```

### `:M: platform`
**Purpose**: Platform-specific code
```python
# :M: platform, windows path handling
# :M: platform, linux permissions check
```

## Testing & Quality

### `:M: test`
**Purpose**: Testing requirements
```javascript
// :M: test, unit add edge cases
// :M: test, integration mock external service
```

### `:M: coverage`
**Purpose**: Code coverage gaps
```python
# :M: coverage error path not tested
```

### `:M: flaky`
**Purpose**: Unreliable tests
```go
// :M: flaky timing-dependent test
```

## API & Contracts

### `:M: breaking`
**Purpose**: Breaking changes
```typescript
// :M: breaking, v3 parameter order changed
```

### `:M: deprecated`
**Purpose**: Deprecation notices
```java
// :M: deprecated use newMethod() instead
// :M: deprecated, remove:v4.0
```

### `:M: experimental`
**Purpose**: Unstable features
```rust
// :M: experimental API may change
```

## Best Practices

1. **Combine with Priority**: `:M: sec, p0` for critical security
2. **Add Context**: Include specific concern after Cairn
3. **Version Breaking Changes**: `:M: breaking, v2` 
4. **Link Standards**: `:M: a11y, wcag-2.1`
5. **Specify Platforms**: `:M: browser, chrome, firefox`