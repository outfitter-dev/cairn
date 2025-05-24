---
description: "How to write effective grep-anchors in your codebase"
alwaysApply: true
---

# Grepa Writing Conventions

This guide explains how to write grep-anchors (`:ga:` patterns) effectively in your codebase. While `grepa-use.md` focuses on searching, this document covers the conventions for adding anchors to your code.

## Core Writing Principles

### 1. Keep Tags Terse
Shorter is better. Every character counts when you're writing hundreds of these:
- ✅ `sec` not `security`
- ✅ `ctx` not `context`  
- ✅ `tmp` not `temporary`
- ✅ `perf` not `performance`

### 2. One Line, One Concern
Each anchor should address a single, specific concern:
```python
# ✅ GOOD: Clear, separate concerns
# :ga:sec validate user permissions
# :ga:ctx assumes user is authenticated
# :ga:todo add rate limiting

# ❌ BAD: Multiple concerns mixed
# :ga:sec,ctx,todo validate permissions assuming auth and add rate limiting
```

### 3. Be Specific in Descriptions
After the tag, add a brief, specific description:
```javascript
// ✅ GOOD: Specific
// :ga:todo implement JWT token refresh
// :ga:sec sanitize HTML to prevent XSS

// ❌ BAD: Vague
// :ga:todo fix this
// :ga:sec security issue
```

## Essential Patterns to Use

### Starting Every Function/Class/Module
Always begin significant code blocks with `:ga:tldr`:
```python
def process_payment(amount, card_token):
    # :ga:tldr handles payment processing with Stripe API
    # :ga:sec validate amount before charging
    # :ga:ctx amount is in cents, not dollars
```

### Marking Work
```javascript
// :ga:todo implement error retry logic
// :ga:@agent add input validation for email format
// :ga:@claude optimize this query for performance
```

### Documenting Context
```go
// :ga:ctx this endpoint is rate-limited to 100 req/min
// :ga:ctx assumes database uses UTC timestamps
// :ga:ctx legacy system expects XML response
```

### Security Markers
```ruby
# :ga:sec never log credit card numbers
# :ga:sec use parameterized queries to prevent SQL injection
# :ga:sec constant-time comparison to prevent timing attacks
```

### Temporary Code
```typescript
// :ga:tmp remove after migration to v2 API
// :ga:tmp hardcoded for demo, use env var
```

## Advanced Writing Patterns

### Linking to Issues
```python
# :ga:issue(GH-123) performance degradation above 1000 users
# :ga:issue(JIRA-456) customer reported bug
```

### Assigning Ownership
```javascript
// :ga:owner(@alice) payment integration
// :ga:owner(@backend-team) API endpoints
```

### Setting Deadlines
```go
// :ga:deadline(2024-03-01) remove deprecated endpoint
// :ga:deadline(Q2-2024) implement new auth system
```

### Marking Dependencies
```ruby
# :ga:depends(redis) for session storage
# :ga:depends(auth-service) must be running
```

## Writing for Different Contexts

### In Documentation (Markdown)
Use HTML comments to keep anchors invisible:
```markdown
<!-- :ga:tldr Quick setup guide for new developers -->
<!-- :ga:guide Step-by-step AWS deployment -->
<!-- :ga:spec API v2 specification -->
```

### In Configuration Files
```yaml
# :ga:config production database settings
# :ga:sec contains sensitive credentials
database:
  host: prod.db.example.com
```

### In Tests
```python
# :ga:test unit test for user validation
# :ga:ctx mocks external API calls
def test_user_validation():
    pass
```

## Best Practices

### Do's
- ✅ Add `:ga:tldr` to every significant function/class
- ✅ Use `:ga:ctx` liberally - more context is always better
- ✅ Be specific about security concerns with `:ga:sec`
- ✅ Tag temporary code immediately with `:ga:tmp`
- ✅ Use `:ga:@agent` or `:ga:@claude` for AI-delegatable work

### Don'ts
- ❌ Don't combine unrelated concerns in one anchor
- ❌ Don't use prose instead of tags (e.g., `:ga:this is broken`)
- ❌ Don't create new tags without documenting them
- ❌ Don't use long tag names when short ones exist
- ❌ Don't forget to remove `:ga:tmp` markers

## Team-Specific Patterns

Document your team's custom patterns:
```javascript
// :ga:api public endpoint, maintain compatibility
// :ga:migration database schema change
// :ga:feature(dark-mode) feature flag controlled
// :ga:experiment(ab-test-checkout) A/B test code
```

## Monorepo Conventions

In monorepos, use service prefixes in tags:
```python
# :ga:auth,todo implement 2FA
# :ga:payment,sec validate card numbers
# :ga:shared,api maintain backwards compatibility
```

## Writing Workflow

1. **When writing new code**: Add `:ga:tldr` first
2. **When you see missing context**: Add `:ga:ctx`
3. **When you spot issues**: Add `:ga:todo` or `:ga:bug`
4. **When delegating**: Add `:ga:@agent` with clear instructions
5. **Before committing**: Search for `:ga:tmp` to ensure none remain

## Remember

The goal is to make your codebase navigable. Every `:ga:` anchor you add is a searchable entry point that helps both humans and AI understand your code better. Start simple, be consistent, and let the patterns grow organically with your needs.