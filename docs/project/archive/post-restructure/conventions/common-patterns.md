# Common Patterns
<!-- :M: tldr Essential waymark patterns for any project -->
<!-- :M: convention Core patterns that work universally across codebases -->

Core waymark patterns that work across all projects.

## Marker Philosophy: Keep It Terse

**Consider using shorter markers.** They're quicker to type and easier to search:

<!-- :M: fixme: We shouldn't encourage `ctx` or `tmp`. `context` and `temp` is fine -->

- `sec` instead of `security`
- `perf` instead of `performance`
- `ctx` instead of `context`
- `tmp` instead of `temporary`

Shorter markers can be helpful when you're using them frequently.

## Essential Patterns

### `:M: tldr`

**Purpose**: Brief summary or overview ("Too Long; Didn't Read")
**Usage**: Document key takeaways, function purposes, or section summaries

```javascript
// :M: tldr validates user input and returns sanitized data
// :M: tldr handles all authentication flows for the app
```

### `:M: todo`

**Purpose**: Work that needs to be done
**Replaces**: Traditional TODO comments

```javascript
// :M: todo implement error handling
// :M: todo add unit tests
```

### `:M: context`

**Purpose**: Important context that isn't obvious from the code
**Usage**: Document assumptions, constraints, and critical knowledge

```python
# :M: context all timestamps are UTC
# :M: context user_ids are UUIDs, not integers
# :M: context this runs in a Lambda with 256MB RAM limit
```

### `:M: sec`

**Purpose**: Security-critical code that needs careful attention
**Usage**: Mark authentication, authorization, input validation, crypto

```go
// :M: sec validate all inputs before SQL query
// :M: sec ensure constant-time comparison
```

### `:M: @agent`

**Purpose**: Direct AI agents to help with implementation
**Usage**: Can use generic @agent or specific ones like @cursor, @claude

```typescript
// :M: @agent implement pagination logic
// :M: @cursor write unit tests for edge cases
```

### `:M: temp`

**Purpose**: Temporary code that should be removed
**Usage**: Workarounds, quick fixes, migration code

```ruby
# :M: temp remove after v2.0 ships
# :M: temp workaround for Redis bug
```

## Quality & Maintenance

### `:M: perf`

**Purpose**: Performance-sensitive code
**Usage**: Mark bottlenecks, optimization opportunities

```javascript
// :M: perf N+1 query issue
// :M: perf consider caching this result
```

### `:M: bug`

**Purpose**: Known bugs or issues
**Usage**: Document problems that need fixing

```python
# :M: bug race condition when concurrent requests
# :M: bug doesn't handle Unicode properly
```

### `:M: debt`

**Purpose**: Technical debt that needs addressing
**Usage**: Shortcuts taken, refactoring needed

```java
// :M: debt tightly coupled to database
// :M: debt needs proper error handling
```

### `:M: fix` / `:M: fixme`

**Purpose**: Broken code needing immediate attention
**Usage**: More urgent than bug or todo - this is actively broken

```python
# :M: fix null pointer exception here
# :M: fixme race condition in auth flow
```

### `:M: breaking`

**Purpose**: Breaking changes to APIs or interfaces
**Usage**: Mark changes that will break compatibility

```typescript
// :M: breaking removed legacy auth method in v3.0
// :M: breaking changed return type from string to object
```

### `:M: freeze`

**Purpose**: Code that must not be modified
**Usage**: Critical code, external dependencies, legal requirements

```go
// :M: freeze regulatory compliance - do not modify
// :M: freeze external API contract - must match exactly
```

### `:M: review`

**Purpose**: Code needing human review before shipping
**Usage**: Complex logic, security-sensitive, architectural decisions

```rust
// :M: review ensure this handles all edge cases
// :M: review security team must approve this approach
```

### `:M: config`

**Purpose**: Configuration values or settings
**Usage**: Values that might need environment-specific changes

```javascript
// :M: config default timeout is 30s
// :M: config production uses different endpoint
```

## Risk & Severity Indicators

### `:M: warn` / `:M: warning`

**Purpose**: Potential issues or risky code
**Usage**: Code that works but has risks or gotchas

```python
# :M: warn this assumes sorted input
# :M: warning rate limit not enforced here
```

### `:M: crit` / `:M: critical`

**Purpose**: Critical code requiring extreme care
**Usage**: System-critical paths, data integrity, financial calculations

```go
// :M: crit payment processing - must be idempotent
// :M: critical failover logic - test thoroughly
```

### `:M: unsafe`

**Purpose**: Potentially dangerous operations
**Usage**: Memory operations, concurrency, security boundaries

```rust
// :M: unsafe raw pointer manipulation
// :M: unsafe bypasses permission checks for admin
```

### `:M: danger`

**Purpose**: Extremely risky code that could cause major issues
**Usage**: Data deletion, irreversible operations, system-wide effects

```javascript
// :M: danger deletes all user data - no recovery
// :M: danger modifies production database directly
```

## Documentation & API

### `:M: api`

**Purpose**: Public API surface
**Usage**: Mark public interfaces, REST endpoints, exported functions

```rust
// :M: api public interface - maintain compatibility
// :M: api REST endpoint: POST /users
```

### `:M: docs`

**Purpose**: Documentation needed or important notes
**Usage**: Complex algorithms, public APIs, business logic

```go
// :M: docs explain rate limiting algorithm
// :M: docs add usage examples
```

### `:M: meta`

**Purpose**: Metadata about files, scripts, or generated content
**Usage**: Configuration files, generated code, script purposes

```javascript
// :M: meta Generated file - DO NOT EDIT MANUALLY
// :M: meta Configuration for production environment
/* :M: meta Script to generate security audit reports */
```

## Project Management

### `:M: issue(ID)`

**Purpose**: Link to issue tracker
**Usage**: Connect code to tickets, PRs, or issues

```javascript
// :M: issue(PROJ-123) implement user story
// :M: issue(#456) fix reported bug
```

### `:M: owner:@person`

**Purpose**: Assign responsibility
**Usage**: Mark who should handle something

```python
# :M: todo, owner:@alice implement authentication
# :M: owner:@backend-team optimize query
```

## Combining Patterns

Combine markers judiciously for closely related concerns:

```typescript
// Good: closely related markers
// :M: sec, todo validate inputs
// :M: perf, debt refactor this loop

// Better: separate lines for clarity
// :M: sec check for SQL injection
// :M: todo add input validation for email format
// :M: perf this loop processes 10k items inefficiently
// :M: debt extract into separate service

// Good: issue tracking with description
// :M: temp, issue(#123) workaround until fixed upstream

// Avoid: too many markers, hard to grep
// :M: api, docs, breaking, v2, urgent v2 changes signature
```

## Suggestions

- **Start with tldr** - `:M: tldr` for summaries can be widely useful
- **Add todo and context** - These three patterns cover many use cases
- **Be consistent** - Picking a style and sticking to it helps
- **Keep it searchable** - Grep-ability is a key benefit
- **Document your choices** - Consider listing your patterns in README
- **Let it evolve** - Add patterns as you discover needs
