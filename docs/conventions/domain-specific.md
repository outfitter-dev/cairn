# Domain-Specific Patterns
<!-- :ga:tldr Specialized patterns for specific technical domains -->
<!-- :ga:convention Domain-specific tags for security, performance, and more -->

Specialized tags for specific technical domains and concerns.

## Security

### `:ga:sec`
**Purpose**: Security-critical code requiring review
```javascript
// :ga:sec validate all inputs before SQL query
// :ga:sec,p0 authentication bypass vulnerability
```

### `:ga:vuln`
**Purpose**: Known vulnerability
```python
# :ga:vuln CVE-2024-1234 needs patch
```

### `:ga:crypto`
**Purpose**: Cryptographic operations
```go
// :ga:crypto constant-time comparison required
```

### `:ga:auth`
**Purpose**: Authentication/authorization
```java
// :ga:auth check permissions before access
```

## Performance

### `:ga:perf`
**Purpose**: Performance-critical sections
```rust
// :ga:perf hot path - optimize carefully
// :ga:perf,p1 N+1 query problem
```

### `:ga:bench`
**Purpose**: Needs benchmarking
```go
// :ga:bench measure before optimizing
```

### `:ga:cache`
**Purpose**: Caching considerations
```python
# :ga:cache consider memoization
# :ga:cache invalidation needed
```

### `:ga:async`
**Purpose**: Asynchronous operations
```javascript
// :ga:async avoid blocking main thread
```

## Accessibility

### `:ga:a11y`
**Purpose**: Accessibility requirements
```html
<!-- :ga:a11y add ARIA labels -->
<!-- :ga:a11y,wcag ensure AA compliance -->
```

### `:ga:i18n`
**Purpose**: Internationalization
```javascript
// :ga:i18n extract hardcoded strings
```

### `:ga:rtl`
**Purpose**: Right-to-left support
```css
/* :ga:rtl needs directional styles */
```

## Data & Storage

### `:ga:migration`
**Purpose**: Database migrations
```sql
-- :ga:migration breaking change in v2
-- :ga:migration,rollback plan needed
```

### `:ga:index`
**Purpose**: Database indexing
```sql
-- :ga:index add covering index for query
```

### `:ga:schema`
**Purpose**: Schema changes
```graphql
# :ga:schema breaking change
# :ga:schema,deprecated remove in v3
```

## Architecture

### `:ga:pattern`
**Purpose**: Design pattern implementation
```java
// :ga:pattern singleton - thread safety
// :ga:pattern,factory consider dependency injection
```

### `:ga:coupling`
**Purpose**: Coupling concerns
```python
# :ga:coupling high - needs refactoring
# :ga:coupling,tech database-specific
```

### `:ga:debt`
**Purpose**: Technical debt
```javascript
// :ga:debt,refactor extract to service
// :ga:debt,p2 legacy code needs update
```

## Platform Specific

### `:ga:browser`
**Purpose**: Browser compatibility
```javascript
// :ga:browser,ie11 needs polyfill
// :ga:browser,safari webkit prefix required
```

### `:ga:mobile`
**Purpose**: Mobile considerations
```swift
// :ga:mobile,memory watch for leaks
// :ga:mobile,battery optimize polling
```

### `:ga:platform`
**Purpose**: Platform-specific code
```python
# :ga:platform,windows path handling
# :ga:platform,linux permissions check
```

## Testing & Quality

### `:ga:test`
**Purpose**: Testing requirements
```javascript
// :ga:test,unit add edge cases
// :ga:test,integration mock external service
```

### `:ga:coverage`
**Purpose**: Code coverage gaps
```python
# :ga:coverage error path not tested
```

### `:ga:flaky`
**Purpose**: Unreliable tests
```go
// :ga:flaky timing-dependent test
```

## API & Contracts

### `:ga:breaking`
**Purpose**: Breaking changes
```typescript
// :ga:breaking,v3 parameter order changed
```

### `:ga:deprecated`
**Purpose**: Deprecation notices
```java
// :ga:deprecated use newMethod() instead
// :ga:deprecated,remove@v4.0
```

### `:ga:experimental`
**Purpose**: Unstable features
```rust
// :ga:experimental API may change
```

## Best Practices

1. **Combine with Priority**: `:ga:sec,p0` for critical security
2. **Add Context**: Include specific concern after tag
3. **Version Breaking Changes**: `:ga:breaking,v2` 
4. **Link Standards**: `:ga:a11y,wcag-2.1`
5. **Specify Platforms**: `:ga:browser,chrome,firefox`