# Common Patterns
<!-- :ga:tldr Essential grep-anchor patterns for any project -->
<!-- :ga:convention Core patterns that work universally across codebases -->

Core grep-anchor patterns that work across all projects.

## Tag Philosophy: Keep It Terse

**Shorter is better.** Grep-anchors should be quick to type and easy to search:
- ✅ `sec` not `security`
- ✅ `perf` not `performance` 
- ✅ `ctx` not `context`
- ✅ `tmp` not `temporary`

Why? Because you'll type these hundreds of times. Every character counts.

## Essential Patterns

### `:ga:tldr`
**Purpose**: Brief summary or overview ("Too Long; Didn't Read")
**Usage**: Document key takeaways, function purposes, or section summaries
```javascript
// :ga:tldr validates user input and returns sanitized data
// :ga:tldr handles all authentication flows for the app
```

### `:ga:todo`
**Purpose**: Work that needs to be done
**Replaces**: Traditional TODO comments
```javascript
// :ga:todo implement error handling
// :ga:todo add unit tests
```

### `:ga:ctx`
**Purpose**: Important context that isn't obvious from the code
**Usage**: Document assumptions, constraints, and critical knowledge
```python
# :ga:ctx all timestamps are UTC
# :ga:ctx user_ids are UUIDs, not integers
# :ga:ctx this runs in a Lambda with 256MB RAM limit
```

### `:ga:sec`
**Purpose**: Security-critical code that needs careful attention
**Usage**: Mark authentication, authorization, input validation, crypto
```go
// :ga:sec validate all inputs before SQL query
// :ga:sec ensure constant-time comparison
```

### `:ga:@agent`
**Purpose**: Direct AI agents to help with implementation
**Usage**: Can use generic @agent or specific ones like @cursor, @claude
```typescript
// :ga:@agent implement pagination logic
// :ga:@cursor write unit tests for edge cases
```

### `:ga:tmp`
**Purpose**: Temporary code that should be removed
**Usage**: Workarounds, quick fixes, migration code
```ruby
# :ga:tmp remove after v2.0 ships
# :ga:tmp workaround for Redis bug
```

## Quality & Maintenance

### `:ga:perf`
**Purpose**: Performance-sensitive code
**Usage**: Mark bottlenecks, optimization opportunities
```javascript
// :ga:perf N+1 query issue
// :ga:perf consider caching this result
```

### `:ga:bug`
**Purpose**: Known bugs or issues
**Usage**: Document problems that need fixing
```python
# :ga:bug race condition when concurrent requests
# :ga:bug doesn't handle Unicode properly
```

### `:ga:debt`
**Purpose**: Technical debt that needs addressing
**Usage**: Shortcuts taken, refactoring needed
```java
// :ga:debt tightly coupled to database
// :ga:debt needs proper error handling
```

## Documentation & API

### `:ga:api`
**Purpose**: Public API surface
**Usage**: Mark public interfaces, REST endpoints, exported functions
```rust
// :ga:api public interface - maintain compatibility
// :ga:api REST endpoint: POST /users
```

### `:ga:docs`
**Purpose**: Documentation needed or important notes
**Usage**: Complex algorithms, public APIs, business logic
```go
// :ga:docs explain rate limiting algorithm
// :ga:docs add usage examples
```

## Project Management

### `:ga:issue(ID)`
**Purpose**: Link to issue tracker
**Usage**: Connect code to tickets, PRs, or issues
```javascript
// :ga:issue(PROJ-123) implement user story
// :ga:issue(#456) fix reported bug
```

### `:ga:owner(@person)`
**Purpose**: Assign responsibility
**Usage**: Mark who should handle something
```python
# :ga:todo,@alice implement authentication
# :ga:owner(@backend-team) optimize query
```

## Combining Patterns

Combine tags judiciously for closely related concerns:

```typescript
// Good: closely related tags
// :ga:sec,todo validate inputs
// :ga:perf,debt refactor this loop

// Better: separate lines for clarity
// :ga:sec check for SQL injection
// :ga:todo add input validation for email format
// :ga:perf this loop processes 10k items inefficiently
// :ga:debt extract into separate service

// Good: issue tracking with description
// :ga:tmp,issue(#123) workaround until fixed upstream

// Avoid: too many tags, hard to grep
// :ga:api,docs,breaking,v2,urgent v2 changes signature
```

## Tips

1. **Start with tldr** - `:ga:tldr` for summaries is the most universally useful
2. **Add todo and context** - These three cover 80% of use cases
3. **Be consistent** - Pick a style and stick to it
4. **Keep it searchable** - The whole point is grep-ability
5. **Document your choices** - List your patterns in README
6. **Let it evolve** - Add patterns as you need them