# AI Patterns
<!-- :A: tldr Conventions for AI agent delegation and interaction -->
<!-- :A: convention Patterns specifically designed for AI agent workflows -->

Conventions for AI agent delegation and interaction.

## Agent Mentions

### Direct Agent Markers
**Purpose**: Delegate to specific AI assistants
```javascript
// :A: @cursor implement unit tests
// :A: @copilot complete this function
// :A: @claude explain this algorithm
// :A: @chatgpt optimize for readability
```

### Generic Agent Marker
**Purpose**: Any AI agent can help
```javascript
// :A: @agent generate documentation
// :A: @ai add error handling
```

## Task Delegation

### `:A: generate`
**Purpose**: Generate new code
```python
# :A: generate, @cursor test cases for this class
# :A: generate rest endpoint
```

### `:A: complete`
**Purpose**: Complete partial implementation
```javascript
// :A: complete TODO: implement sorting
// :A: complete, @copilot fill in edge cases
```

### `:A: refactor`
**Purpose**: Improve existing code
```go
// :A: refactor, @claude make more idiomatic
// :A: refactor extract common logic
```

### `:A: explain`
**Purpose**: Add explanations or documentation
```rust
// :A: explain, @agent how this macro works
// :A: explain add inline comments
```

## Review Requests

### `:A: review, @ai`
**Purpose**: AI code review
```javascript
// :A: review, @claude security implications
// :A: review, @ai potential bugs
```

### `:A: audit`
**Purpose**: Comprehensive analysis
```python
# :A: audit, @ai performance bottlenecks
# :A: audit check for memory leaks
```

## Specific Improvements

### `:A: optimize`
**Purpose**: Performance improvements
```javascript
// :A: optimize, @ai reduce complexity
// :A: optimize memory usage
```

### `:A: secure`
**Purpose**: Security hardening
```go
// :A: secure, @claude input validation
// :A: secure prevent injection
```

### `:A: simplify`
**Purpose**: Make code clearer
```python
# :A: simplify, @agent reduce nesting
# :A: simplify make more pythonic
```

## Documentation Tasks

### `:A: document`
**Purpose**: Add documentation
```javascript
// :A: document, @ai add jsdoc
// :A: document api usage examples
```

### `:A: summarize`
**Purpose**: Create summaries
```python
# :A: summarize, @claude module purpose
# :A: tldr, @ai function overview
```

## Context Patterns

### Providing Context
```javascript
// :A: ctx uses Redux for state management
// :A: note, @ai follows clean architecture
// :A: assume, @agent typescript strict mode
```

### Constraints
```javascript
// :A: constraint, @ai no external dependencies
// :A: requirement must be backwards compatible
// :A: limitation node 16 compatibility
```

## Multi-Agent Patterns

### Sequential Tasks
```javascript
// :A: @cursor generate, then @claude review
// :A: first, @copilot implement, then @ai optimize
```

### Specialized Delegation
```javascript
// :A: ui, @cursor, logic, @claude
// :A: frontend, @copilot, backend, @agent
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
// :A: @claude analyze this recursive function for edge cases,
// then @cursor generate comprehensive test cases
```

### Contextual Generation
```javascript
// :A: generate, @ai rest endpoint
// :A: ctx follow existing patterns in /api
// :A: requirement use zod for validation
```

### Review Pipeline
```javascript
// :A: review, @claude security
// :A: review, @cursor performance  
// :A: review, @ai best practices
```