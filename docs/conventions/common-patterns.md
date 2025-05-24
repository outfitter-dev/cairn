# Common Patterns
<!-- :ga:tldr Essential grep-anchor patterns for any project -->
<!-- :ga:convention Core patterns that work universally across codebases -->

Core grep-anchor patterns that work across all projects.

## Essential Patterns

### `:ga:todo`
**Purpose**: Work that needs to be done
**Replaces**: Traditional TODO comments
```javascript
// :ga:todo implement error handling
// :ga:todo add unit tests
```

### `:ga:context`
**Purpose**: Important information that isn't obvious from the code
**Usage**: Document assumptions, constraints, and critical knowledge
```python
# :ga:context all timestamps are UTC
# :ga:context user_ids are UUIDs, not integers
# :ga:context this runs in a Lambda with 256MB RAM limit
```

### `:ga:security`
**Purpose**: Security-critical code that needs careful attention
**Usage**: Mark authentication, authorization, input validation, crypto
```go
// :ga:security validate all inputs before SQL query
// :ga:security ensure constant-time comparison
```

### `:ga:@agent`
**Purpose**: Direct AI agents to help with implementation
**Usage**: Can use generic @agent or specific ones like @cursor, @claude
```typescript
// :ga:@agent implement pagination logic
// :ga:@cursor write unit tests for edge cases
```

### `:ga:temp`
**Purpose**: Temporary code that should be removed
**Usage**: Workarounds, quick fixes, migration code
```ruby
# :ga:temp remove after v2.0 ships
# :ga:temp workaround for Redis bug
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
// :ga:security,todo validate inputs
// :ga:perf,debt refactor this loop

// Better: separate lines for clarity
// :ga:security check for SQL injection
// :ga:todo add input validation for email format
// :ga:perf this loop processes 10k items inefficiently
// :ga:debt extract into separate service

// Good: issue tracking with description
// :ga:temp,issue(#123) workaround until fixed upstream

// Avoid: too many tags, hard to grep
// :ga:api,docs,breaking,v2,urgent v2 changes signature
```

## Tips

1. **Start with 3-5 patterns** - Don't try to use everything at once
2. **Be consistent** - Pick a style and stick to it
3. **Keep it searchable** - The whole point is grep-ability
4. **Document your choices** - List your patterns in README
5. **Let it evolve** - Add patterns as you need them