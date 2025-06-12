# AI Patterns
<!-- :M: tldr Conventions for AI agent delegation and interaction -->
<!-- :M: convention Patterns specifically designed for AI agent workflows -->

Conventions for AI agent delegation and interaction.

## Agent Mentions

### Direct Agent Markers
**Purpose**: Delegate to specific AI assistants
```javascript
// :M: @cursor implement unit tests
// :M: @copilot complete this function
// :M: @claude explain this algorithm
// :M: @chatgpt optimize for readability
```

### Generic Agent Marker
**Purpose**: Any AI agent can help
```javascript
// :M: @agent generate documentation
// :M: @ai add error handling
```

## Task Delegation

### `:M: generate`
**Purpose**: Generate new code
```python
# :M: generate, @cursor test cases for this class
# :M: generate rest endpoint
```

### `:M: complete`
**Purpose**: Complete partial implementation
```javascript
// :M: complete TODO: implement sorting
// :M: complete, @copilot fill in edge cases
```

### `:M: refactor`
**Purpose**: Improve existing code
```go
// :M: refactor, @claude make more idiomatic
// :M: refactor extract common logic
```

### `:M: explain`
**Purpose**: Add explanations or documentation
```rust
// :M: explain, @agent how this macro works
// :M: explain add inline comments
```

## Review Requests

### `:M: review, @ai`
**Purpose**: AI code review
```javascript
// :M: review, @claude security implications
// :M: review, @ai potential bugs
```

### `:M: audit`
**Purpose**: Comprehensive analysis
```python
# :M: audit, @ai performance bottlenecks
# :M: audit check for memory leaks
```

## Specific Improvements

### `:M: optimize`
**Purpose**: Performance improvements
```javascript
// :M: optimize, @ai reduce complexity
// :M: optimize memory usage
```

### `:M: secure`
**Purpose**: Security hardening
```go
// :M: secure, @claude input validation
// :M: secure prevent injection
```

### `:M: simplify`
**Purpose**: Make code clearer
```python
# :M: simplify, @agent reduce nesting
# :M: simplify make more pythonic
```

## Documentation Tasks

### `:M: document`
**Purpose**: Add documentation
```javascript
// :M: document, @ai add jsdoc
// :M: document api usage examples
```

### `:M: summarize`
**Purpose**: Create summaries
```python
# :M: summarize, @claude module purpose
# :M: tldr, @ai function overview
```

## Context Patterns

### Providing Context
```javascript
// :M: ctx uses Redux for state management
// :M: note, @ai follows clean architecture
// :M: assume, @agent typescript strict mode
```

### Constraints
```javascript
// :M: constraint, @ai no external dependencies
// :M: requirement must be backwards compatible
// :M: limitation node 16 compatibility
```

## Multi-Agent Patterns

### Sequential Tasks
```javascript
// :M: @cursor generate, then @claude review
// :M: first, @copilot implement, then @ai optimize
```

### Specialized Delegation
```javascript
// :M: ui, @cursor, logic, @claude
// :M: frontend, @copilot, backend, @agent
```

## Working with AI Agents

- **Be Specific**: Clear instructions help agents understand what you need
- **Add Context**: Including constraints or requirements can improve results
- **Chain Tasks**: Consider using multiple agents for their different strengths
- **Verify Output**: Review AI-generated code before using it
- **Iterate**: Refining prompts based on results often helps

## Examples

### Complex Delegation
```javascript
// :M: @claude analyze this recursive function for edge cases,
// then @cursor generate comprehensive test cases
```

### Contextual Generation
```javascript
// :M: generate, @ai rest endpoint
// :M: ctx follow existing patterns in /api
// :M: requirement use zod for validation
```

### Review Pipeline
```javascript
// :M: review, @claude security
// :M: review, @cursor performance  
// :M: review, @ai best practices
```