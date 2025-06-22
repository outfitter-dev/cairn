<!-- tldr ::: common waymark patterns and conventions for effective code navigation -->
# Waymark Patterns

Practical patterns and conventions for using waymarks effectively in real codebases.

## Overview

This section covers common patterns that have emerged from real-world waymark usage. These patterns help teams:

- Maintain consistency across codebases
- Enable powerful search workflows
- Facilitate AI agent collaboration
- Track work effectively
- Document code intent

## Pattern Categories

### [Workflow Patterns](workflow-patterns.md)
Developer workflows and automation patterns:
- Task management workflows
- Code review patterns  
- Branch and release coordination
- Issue tracking integration
- CI/CD workflows

### [Agent Workflows](agent-workflows.md)
AI agent-specific patterns:
- Delegation patterns
- Context provision strategies
- Agent instruction formats
- Collaborative workflows
- Agent-friendly code organization

### [Custom Tags](custom-tags.md)
Creating project-specific semantic tags:
- Domain-specific tags and namespaces
- Workflow state tracking
- Team convention tags
- Search patterns and tooling

### Legacy Patterns (Reference)
These patterns are preserved for reference but use pre-v1.0 syntax:
- [Common Patterns](common-patterns.md) - Essential patterns and best practices
- [Conventions](conventions.md) - Team conventions and standards
- [Documentation Patterns](documentation-patterns.md) - Integration with docs
- [Examples](examples.md) - Comprehensive examples by use case

## Quick Pattern Reference

### Task Patterns
```javascript
// Basic task
// todo ::: implement validation

// Assigned priority task
// !todo ::: @alice add security checks

// Branch-scoped critical work
// *!fixme ::: fix before merge

// Linked to issue
// todo ::: implement OAuth #fixes:#234
```

### Documentation Patterns
```javascript
// File overview (top of file)
// tldr ::: user authentication service

// Important constraints
// notice ::: requires admin privileges

// Architecture reference
// about ::: ##auth/login main entry point
```

### AI Agent Patterns
```javascript
// Direct delegation
// todo ::: @agent implement with error handling

// Context for AI
// important ::: @agent maintain backward compatibility

// Specific instructions
// refactor ::: @agent use Repository pattern
```

### Search Patterns
```bash
# All waymarks
rg ":::"

# Priority work
rg "!\!?\w+\s+:::"

# Assigned to someone
rg ":::.*@\w+"

# Tagged items
rg "#backend"

# Issue references
rg "#\d+\b"
```

## Best Practices Summary

1. **Consistency**: Establish team conventions early
2. **Simplicity**: Start with basic patterns, evolve as needed
3. **Searchability**: Optimize for grep/ripgrep discovery
4. **Context**: Provide enough information for understanding
5. **Maintenance**: Remove completed waymarks

See individual pattern guides for detailed examples and use cases.