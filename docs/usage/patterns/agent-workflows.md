<!-- tldr ::: AI agent patterns for navigating and working with waymark-annotated codebases -->
# Agent Workflows

Patterns and best practices for AI agents working with waymark-annotated codebases.

## Overview

Waymarks enable AI agents to navigate codebases effectively by providing:
- Clear task delegation patterns
- Contextual breadcrumbs
- Searchable anchor points
- Explicit constraints and requirements

## Core Agent Patterns

### Task Delegation

```javascript
// Direct implementation request
// todo ::: @agent implement user authentication
// todo ::: @claude add comprehensive error handling
// refactor ::: @agent extract into reusable service

// With specific constraints
// todo ::: @agent use TypeScript with strict mode
// todo ::: @agent implement using React hooks only
// todo ::: @agent maintain backward compatibility
```

### Context Provision

```javascript
// Architecture context
// about ::: ##auth/service main authentication service
// notice ::: @agent uses JWT with RS256 algorithm
// important ::: @agent integrates with existing user service

// Performance constraints
// notice ::: @agent this is performance critical #hotpath
// important ::: @agent must handle 1000 req/sec
// note ::: @agent optimize for memory usage

// Security requirements  
// important ::: @agent validate all inputs #sec:boundary
// notice ::: @agent follow OWASP guidelines
// notice ::: @agent sanitize user data before storage
```

### Review Requests

```javascript
// Security review
// review ::: @agent check for SQL injection vulnerabilities
// review ::: @agent verify auth token handling
// review ::: @agent audit for OWASP top 10

// Performance review
// review ::: @agent identify performance bottlenecks
// review ::: @agent check for N+1 queries
// review ::: @agent suggest optimization opportunities

// Code quality
// review ::: @agent check for code smells
// review ::: @agent suggest refactoring opportunities
// review ::: @agent verify test coverage
```

## Navigation Patterns

### Entry Point Discovery

```bash
# AI agents should start with:
# 1. Find file overviews
rg "tldr :::"

# 2. Find main entry points
rg "about :::.*##\w+" 

# 3. Find important constraints
rg "(important|notice) :::"

# 4. Find assigned work
rg ":::.*@agent"
```

### Context Gathering

```javascript
// Agents should look for surrounding context:
// tldr ::: payment processing service
// notice ::: requires PCI compliance
// important ::: all amounts in cents
// about ::: ##payment/processor main payment handler

class PaymentProcessor {
  // todo ::: @agent add retry logic
  // notice ::: @agent max 3 retries with exponential backoff
  // important ::: @agent log all payment attempts
  async processPayment(amount, currency) {
    // existing implementation
  }
}
```

### Progressive Understanding

```bash
# Level 1: Understand the module
rg "tldr :::" path/to/module/

# Level 2: Find key components
rg "about :::.*##" path/to/module/

# Level 3: Understand constraints
rg "(important|notice) :::" path/to/module/

# Level 4: Find related work
rg "todo :::" path/to/module/

# Level 5: Check cross-references
rg "#refs:|#affects:" path/to/module/
```

## Implementation Patterns

### Incremental Development

```javascript
// Stage 1: Basic implementation
// todo ::: @agent implement basic CRUD operations
// notice ::: @agent start with create and read only

// Stage 2: Add complexity
// todo ::: @agent add update and delete operations  
// notice ::: @agent include soft delete support

// Stage 3: Production readiness
// todo ::: @agent add logging and monitoring
// todo ::: @agent implement rate limiting
// todo ::: @agent add comprehensive error handling
```

### Test-Driven Development

```javascript
// Test requirements for agents
// test ::: @agent write unit tests for all public methods
// test ::: @agent include edge case testing
// test ::: @agent mock external dependencies

// Specific test scenarios
// test ::: @agent test with empty input
// test ::: @agent test with invalid data types
// test ::: @agent test error handling paths
// test ::: @agent verify async behavior
```

### Documentation Requirements

```javascript
/**
 * todo ::: @agent add comprehensive JSDoc
 * notice ::: @agent include usage examples
 * important ::: @agent document all parameters
 */
function complexOperation(config) {
  // todo ::: @agent document config object structure
  // notice ::: @agent explain algorithm approach
}
```

## Collaboration Patterns

### Human-Agent Handoff

```javascript
// Clear handoff points
// todo ::: @agent implement data validation
// notice ::: @human review business logic after
// todo ::: @agent stop here - needs product decision

// Partial implementation
// wip ::: @agent basic structure complete
// todo ::: @human add business-specific logic
// notice ::: @agent resume after business logic added
```

### Multi-Agent Coordination

```javascript
// Sequential tasks
// todo ::: @agent1 implement API endpoints
// todo ::: @agent2 add frontend components #depends:api
// todo ::: @agent3 write integration tests #depends:api,frontend

// Parallel tasks
// todo ::: @claude implement auth service #parallel
// todo ::: @agent implement user service #parallel
// todo ::: @agent implement logging #parallel
```

## Search Strategies for Agents

### Focused Searches

```bash
# Find specific work areas
rg "todo :::.*@agent.*#backend"
rg "review :::.*@agent.*#security"

# Find by file type
rg ":::.*@agent" --type js
rg ":::.*@agent" --type py

# Find incomplete work
rg "(wip|stub) :::.*@agent"
```

### Contextual Searches

```bash
# Find with context
rg -B3 -A3 "todo :::.*@agent"

# Find related patterns
rg "#affects:.*auth" | rg "@agent"

# Find by priority
rg "!\!?todo :::.*@agent"
```

## Anti-Patterns to Avoid

### For AI Agents

```javascript
// ❌ Too vague
// todo ::: @agent fix this

// ✅ Clear and specific
// todo ::: @agent add input validation for email field

// ❌ Missing context
// todo ::: @agent implement feature

// ✅ Sufficient context
// todo ::: @agent implement password reset flow
// notice ::: @agent use existing email service
// important ::: @agent follow security best practices
```

### For Humans Delegating

```javascript
// ❌ Conflicting instructions
// todo ::: @agent use React class components
// todo ::: @agent use React hooks  

// ✅ Clear direction
// todo ::: @agent use React hooks (v16.8+)
// notice ::: @agent no class components

// ❌ Implicit requirements
// todo ::: @agent add user form

// ✅ Explicit requirements
// todo ::: @agent add user registration form
// notice ::: @agent include email and password fields
// important ::: @agent add client-side validation
// notice ::: @agent use existing form components
```

## Advanced Agent Patterns

### Architecture-Aware Implementation

```javascript
// Provide architectural context
// about ::: ##arch/overview microservices architecture
// notice ::: @agent each service has own database
// important ::: @agent use message queue for communication

// Service-specific instructions
// todo ::: @agent implement user service
// notice ::: @agent follows ##arch/overview patterns
// important ::: @agent expose REST API on port 3001
// notice ::: @agent publish events to 'user-events' topic
```

### Iterative Refinement

```javascript
// Round 1: Basic implementation
// todo ::: @agent v1 - implement basic functionality

// Round 2: Optimization
// todo ::: @agent v2 - optimize performance
// notice ::: @agent focus on database queries

// Round 3: Production hardening
// todo ::: @agent v3 - add monitoring and alerting
// notice ::: @agent include error tracking
```

### Knowledge Transfer

```javascript
// Document decisions for future agents
// about ::: ##decisions/auth-strategy JWT chosen for stateless auth
// notice ::: @agent see ##decisions/auth-strategy for context
// important ::: @agent maintain compatibility with decision

// Learn from previous attempts
// deprecated ::: old approach - too slow #lesson
// notice ::: @agent avoid nested loops here #lesson
// important ::: @agent use Set for O(1) lookups #lesson
```

## Best Practices Summary

### For AI Agents

1. **Start with search**: Always search for context before implementing
2. **Read tldr markers**: Understand file purpose before modifying
3. **Check constraints**: Look for important/notice markers
4. **Follow patterns**: Maintain consistency with existing code
5. **Ask when uncertain**: Use `question` markers for clarification

### For Humans Working with Agents

1. **Be specific**: Clear, actionable instructions
2. **Provide context**: Include relevant constraints
3. **Set boundaries**: Explicitly state what not to do
4. **Link references**: Use anchors for complex concepts
5. **Stage complex work**: Break into manageable chunks

Remember: Waymarks are breadcrumbs. The clearer the trail, the better agents can navigate and contribute to your codebase.