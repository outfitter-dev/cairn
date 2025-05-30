# Common Patterns
<!-- :A: tldr Essential Magic Anchor patterns for any project -->
<!-- :A: convention Core patterns that work universally across codebases -->

Core Magic Anchor patterns that work across all projects.

## Marker Philosophy: Keep It Terse

**Consider using shorter markers.** They're quicker to type and easier to search:
- `sec` instead of `security`
- `perf` instead of `performance` 
- `ctx` instead of `context`
- `tmp` instead of `temporary`

Shorter markers can be helpful when you're using them frequently.

## Essential Patterns

### `:A: tldr`
**Purpose**: Brief summary or overview ("Too Long; Didn't Read")
**Usage**: Document key takeaways, function purposes, or section summaries
```javascript
// :A: tldr validates user input and returns sanitized data
// :A: tldr handles all authentication flows for the app
```

### `:A: todo`
**Purpose**: Work that needs to be done
**Replaces**: Traditional TODO comments
```javascript
// :A: todo implement error handling
// :A: todo add unit tests
```

### `:A: ctx`
**Purpose**: Important context that isn't obvious from the code
**Usage**: Document assumptions, constraints, and critical knowledge
```python
# :A: ctx all timestamps are UTC
# :A: ctx user_ids are UUIDs, not integers
# :A: ctx this runs in a Lambda with 256MB RAM limit
```

### `:A: sec`
**Purpose**: Security-critical code that needs careful attention
**Usage**: Mark authentication, authorization, input validation, crypto
```go
// :A: sec validate all inputs before SQL query
// :A: sec ensure constant-time comparison
```

### `:A: @agent`
**Purpose**: Direct AI agents to help with implementation
**Usage**: Can use generic @agent or specific ones like @cursor, @claude
```typescript
// :A: @agent implement pagination logic
// :A: @cursor write unit tests for edge cases
```

### `:A: tmp`
**Purpose**: Temporary code that should be removed
**Usage**: Workarounds, quick fixes, migration code
```ruby
# :A: tmp remove after v2.0 ships
# :A: tmp workaround for Redis bug
```

## Quality & Maintenance

### `:A: perf`
**Purpose**: Performance-sensitive code
**Usage**: Mark bottlenecks, optimization opportunities
```javascript
// :A: perf N+1 query issue
// :A: perf consider caching this result
```

### `:A: bug`
**Purpose**: Known bugs or issues
**Usage**: Document problems that need fixing
```python
# :A: bug race condition when concurrent requests
# :A: bug doesn't handle Unicode properly
```

### `:A: debt`
**Purpose**: Technical debt that needs addressing
**Usage**: Shortcuts taken, refactoring needed
```java
// :A: debt tightly coupled to database
// :A: debt needs proper error handling
```

### `:A: fix` / `:A: fixme`
**Purpose**: Broken code needing immediate attention
**Usage**: More urgent than bug or todo - this is actively broken
```python
# :A: fix null pointer exception here
# :A: fixme race condition in auth flow
```

### `:A: breaking`
**Purpose**: Breaking changes to APIs or interfaces
**Usage**: Mark changes that will break compatibility
```typescript
// :A: breaking removed legacy auth method in v3.0
// :A: breaking changed return type from string to object
```

### `:A: freeze`
**Purpose**: Code that must not be modified
**Usage**: Critical code, external dependencies, legal requirements
```go
// :A: freeze regulatory compliance - do not modify
// :A: freeze external API contract - must match exactly
```

### `:A: review`
**Purpose**: Code needing human review before shipping
**Usage**: Complex logic, security-sensitive, architectural decisions
```rust
// :A: review ensure this handles all edge cases
// :A: review security team must approve this approach
```

### `:A: config`
**Purpose**: Configuration values or settings
**Usage**: Values that might need environment-specific changes
```javascript
// :A: config default timeout is 30s
// :A: config production uses different endpoint
```

## Risk & Severity Indicators

### `:A: warn` / `:A: warning`
**Purpose**: Potential issues or risky code
**Usage**: Code that works but has risks or gotchas
```python
# :A: warn this assumes sorted input
# :A: warning rate limit not enforced here
```

### `:A: crit` / `:A: critical`
**Purpose**: Critical code requiring extreme care
**Usage**: System-critical paths, data integrity, financial calculations
```go
// :A: crit payment processing - must be idempotent
// :A: critical failover logic - test thoroughly
```

### `:A: unsafe`
**Purpose**: Potentially dangerous operations
**Usage**: Memory operations, concurrency, security boundaries
```rust
// :A: unsafe raw pointer manipulation
// :A: unsafe bypasses permission checks for admin
```

### `:A: danger`
**Purpose**: Extremely risky code that could cause major issues
**Usage**: Data deletion, irreversible operations, system-wide effects
```javascript
// :A: danger deletes all user data - no recovery
// :A: danger modifies production database directly
```

## Documentation & API

### `:A: api`
**Purpose**: Public API surface
**Usage**: Mark public interfaces, REST endpoints, exported functions
```rust
// :A: api public interface - maintain compatibility
// :A: api REST endpoint: POST /users
```

### `:A: docs`
**Purpose**: Documentation needed or important notes
**Usage**: Complex algorithms, public APIs, business logic
```go
// :A: docs explain rate limiting algorithm
// :A: docs add usage examples
```

### `:A: meta`
**Purpose**: Metadata about files, scripts, or generated content
**Usage**: Configuration files, generated code, script purposes
```javascript
// :A: meta Generated file - DO NOT EDIT MANUALLY
// :A: meta Configuration for production environment
/* :A: meta Script to generate security audit reports */
```

## Project Management

### `:A: issue(ID)`
**Purpose**: Link to issue tracker
**Usage**: Connect code to tickets, PRs, or issues
```javascript
// :A: issue(PROJ-123) implement user story
// :A: issue(#456) fix reported bug
```

### `:A: owner:@person`
**Purpose**: Assign responsibility
**Usage**: Mark who should handle something
```python
# :A: todo, owner:@alice implement authentication
# :A: owner:@backend-team optimize query
```

## Combining Patterns

Combine markers judiciously for closely related concerns:

```typescript
// Good: closely related markers
// :A: sec, todo validate inputs
// :A: perf, debt refactor this loop

// Better: separate lines for clarity
// :A: sec check for SQL injection
// :A: todo add input validation for email format
// :A: perf this loop processes 10k items inefficiently
// :A: debt extract into separate service

// Good: issue tracking with description
// :A: tmp, issue(#123) workaround until fixed upstream

// Avoid: too many markers, hard to grep
// :A: api, docs, breaking, v2, urgent v2 changes signature
```

## Suggestions

- **Start with tldr** - `:A: tldr` for summaries can be widely useful
- **Add todo and context** - These three patterns cover many use cases
- **Be consistent** - Picking a style and sticking to it helps
- **Keep it searchable** - Grep-ability is a key benefit
- **Document your choices** - Consider listing your patterns in README
- **Let it evolve** - Add patterns as you discover needs