<!-- tldr ::: comprehensive guide to using waymarks effectively in real codebases -->
# Usage Guide

A practical guide to using waymarks for code navigation, task management, and AI agent collaboration.

## Overview

Waymarks are standardized code annotations using `:::` that make codebases discoverable by both humans and AI agents. They act as breadcrumbs throughout your code, enabling instant navigation with simple grep commands.

## Quick Start

Begin with these five essential patterns:

1. `todo :::` - Tasks that need doing
2. `tldr :::` - Brief file/module summaries
3. `fixme :::` - Bugs to fix
4. `@mentions` - Assign work or give AI instructions
5. `#tags` - Classify and link related items

That's it! Search all waymarks with `rg ":::"`.

## Basic Usage

### Task Management

```javascript
// Simple tasks
// todo ::: implement validation
// fixme ::: handle edge case when user_id is null

// Assigned work
// todo ::: @alice add unit tests
// review ::: @security-team check auth flow

// Priority work (use signals, not tags)
// !todo ::: important security update      // P1 priority
// !!fixme ::: critical production bug      // P0 critical

// Branch-scoped work (must complete before merge)
// *todo ::: finish error handling
// *!fixme ::: fix critical bug found in review
```

### Documentation & Context

```javascript
// File summaries (put at top)
// tldr ::: JWT auth middleware validating Bearer tokens

// Important context
// notice ::: this endpoint requires admin privileges
// important ::: algorithm assumes sorted input array

// General notes
// note ::: cache expires every 15 minutes
// idea ::: consider using Redis for session storage
```

### Working with Issues

```javascript
// Link to issues (always include # in reference)
// todo ::: implement auth flow #fixes:#234
// fixme ::: race condition #blocks:#456
// done ::: added validation #closes:#789

// Multiple references
// notice ::: breaking change #affects:#api,#billing
// todo ::: update deps #fixes:#123,#124
```

## Search Patterns

### Basic Searches

```bash
# Find all waymarks
rg ":::"

# Find specific markers
rg "todo :::"
rg "fixme :::"
rg "tldr :::"

# Find by assignment
rg ":::.*@alice"
rg ":::.*@$(whoami)"     # Your assigned work

# Find by priority
rg "!!\w+\s+:::"        # Critical items (P0)
rg "!\w+\s+:::"         # High priority (P1)
rg "\*\w+\s+:::"        # Branch work
```

### Advanced Searches

```bash
# Find by tags
rg "#backend"
rg "#security"
rg "#(perf:)?hotpath"    # Both #hotpath and #perf:hotpath

# Find issue references
rg "#fixes:#\d+"         # All fixes
rg "#123\b"              # Specific issue

# Complex queries
rg "todo :::.*#backend"  # Backend todos
rg ":::.*@alice.*#security"  # Alice's security work

# Context-aware search
rg -C3 "fixme :::"       # Show 3 lines of context
```

## AI Agent Patterns

### Direct Delegation

```javascript
// Assign implementation to AI
// todo ::: @agent implement error handling
// refactor ::: @claude optimize this function
// test ::: @agent add edge case tests

// With specific instructions
// todo ::: @agent use async/await pattern
// review ::: @agent check for security vulnerabilities
// todo ::: @agent implement with TypeScript types
```

### Providing Context

```javascript
// Important constraints for AI
// notice ::: @agent this is performance critical
// important ::: @agent maintain backward compatibility
// note ::: @agent use existing auth service

// Architecture context
// about ::: ##auth/service main authentication entry point
// todo ::: update logic #refs:#auth/service
```

## Tag System

### Simple Tags

Use for classification and searching:

```javascript
// Category tags
// todo ::: optimize query #backend #database
// fixme ::: button contrast #frontend #a11y

// Status tags  
// wip ::: new algorithm #experimental
// notice ::: breaking change #api #v2
```

### Relational Tags

Connect waymarks to external systems:

```javascript
// Issue tracking
// todo ::: implement feature #fixes:#123
// fixme ::: memory leak #blocks:#456

// People references
// todo ::: needs review #owner:@alice #cc:@bob,@charlie

// Cross-references
// notice ::: update needed #affects:#billing,#auth
// test ::: verify integration #for:#payment/stripe
```

### Attribute Tags

Describe code characteristics:

```javascript
// Performance
// todo ::: optimize parser #hotpath
// notice ::: critical path #perf:bottleneck

// Security
// important ::: validate input #boundary
// notice ::: auth check #sec:boundary

// Architecture
// about ::: entry point #arch:entrypoint
// note ::: singleton instance #arch:state
```

## Best Practices

### 1. Start Simple

Begin with basic patterns and add complexity as needed:

```text
Level 1: Basic markers (todo :::)
   ↓
Level 2: Add priorities (!todo :::)
   ↓
Level 3: Add assignments (@alice)
   ↓  
Level 4: Add tags (#backend)
   ↓
Level 5: Link issues (#fixes:#123)
```

### 2. Be Specific and Actionable

```javascript
// ❌ Too vague
// todo ::: fix this

// ✅ Clear and actionable
// todo ::: add input validation for email field
```

### 3. One Waymark Per Line

```javascript
// ❌ Multiple markers
// todo fixme ::: various issues

// ✅ Separate concerns
// todo ::: add validation
// fixme ::: handle null case
```

### 4. Use Signals for Priority

```javascript
// ❌ Priority as tag
// todo ::: implement auth #priority:high

// ✅ Priority as signal
// !todo ::: implement auth
```

### 5. Clean Up Completed Work

```javascript
// ❌ Leaving as done
// done ::: implemented caching

// ✅ Remove completed waymarks
// (deleted)
```

## Common Patterns

### Monorepo Organization

```javascript
// Service-specific work
// todo ::: implement caching #service:api #team:backend
// fixme ::: UI bug #service:web #team:frontend

// Cross-cutting concerns
// notice ::: breaking API change #affects:#web,#mobile
// todo ::: update all services #team:platform
```

### Documentation Integration

Waymarks complement existing documentation:

```javascript
/**
 * Calculate total with tax
 * @param {number} price - Base price
 * @param {number} taxRate - Tax rate
 * @returns {number} Total price
 */
function calculateTotal(price, taxRate) {
  // todo ::: add currency conversion
  // notice ::: assumes USD
  return price * (1 + taxRate);
}
```

### Performance & Security

```javascript
// Performance markers
// notice ::: hot path - measure before changing #hotpath
// todo ::: optimize for large datasets #perf

// Security boundaries
// important ::: validate all inputs #sec:boundary
// notice ::: sanitize user data #security
```

## Migration from Old Syntax

If you're migrating from pre-v1.0 waymarks:

- `+tag` → `#tag`
- `alert` → `notice`
- `fix` → `fixme`
- `priority:high` → use `!` signal
- `fixes:123` → `#fixes:#123`

## Next Steps

- See [Patterns](patterns/) for advanced usage patterns
- Check [Search Guide](search/) for complex queries
- Read [Migration Guide](migration/) for upgrading existing waymarks

Remember: The goal is discoverability. Even one waymark makes your codebase more navigable than none.