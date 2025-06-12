<!-- tldr ::: Get started with waymarks in 5 minutes -->
# Quick Start Guide

Get started with waymarks in 5 minutes.

## What is a Waymark?

**Waymarks** are special comments with the `:::` sigil that make your code searchable and discoverable.

## Basic Usage

### 1. Add Your First Waymark

Add a waymarked comment to mark important code:

```javascript
// todo ::: implement error handling
function processUser(data) {
  // warn ::: validate input #security
  return data;
}
```

### 2. Search with Ripgrep

Find all waymarks in your codebase:

```bash
# Find all waymarks
rg -n ":::"

# Find specific prefixes
rg -n "todo :::"
rg -n "warn :::"
```

### 3. Common Patterns

Start with these essential patterns:

| Pattern | Purpose | Example |
|---------|---------|---------|
| `tldr :::` | Brief summary | `// tldr ::: handles user auth` |
| `todo :::` | Future work | `// todo ::: add tests` |
| `:::` | Key assumptions (pure note) | `// ::: UTC timestamps only` |
| `fix :::` | Broken code | `// fix ::: null pointer exception` |
| `warn :::` | Security/safety critical | `// warn ::: validate input #security` |
| `@mentions` | Assign to someone | `// todo ::: @alice review this` |

## Pure Notes vs Prefixed Waymarks

Waymarks can be pure notes (no prefix) or prefixed:

```javascript
// Pure notes (no prefix - just information)
// ::: assumes all dates are UTC
// ::: users must be authenticated
// ::: performance-critical code path

// Prefixed waymarks (actionable items)
// todo ::: implement caching
// fix ::: handle null case
// warn ::: validate permissions #security
```

## Properties and Hashtags

Add structured data and classification:

```javascript
// Properties (key:value pairs)
// todo ::: priority:high implement auth
// todo ::: assign:@alice add validation
// fix ::: affects:auth,api memory leak

// Hashtags (classification)
// todo ::: implement OAuth #auth-service
// warn ::: rate limit required #security #performance
// fix ::: API timeout #backend #critical
```

For deeper exploration, see [Conventions](../conventions.md) and [Examples](../examples.md).

## @Mentions for Assignment

Assign work and request attention:

```javascript
// Direct assignment in todos
// todo ::: @alice implement payment flow
// review ::: @bob check security implications

// Explicit property assignment
// todo ::: assign:@charlie priority:high fix bug
// todo ::: attn:@security-team audit this code
```

## HTML Comments in Markdown

For markdown files, use HTML comments to make waymarks searchable but not rendered:

```markdown
<!-- tldr ::: User authentication guide -->
<!-- todo ::: @galligan add SSO examples -->
<!-- warn ::: breaking changes in v3.0 -->

# Authentication Guide

This guide covers user authentication.
```

## Next Steps

1. **Learn the syntax**: [Syntax Guide](../syntax.md)
2. **Explore conventions**: [Conventions](../conventions.md)
3. **See examples**: [Examples](../examples.md)
4. **Set up your team**: Create a CONVENTIONS.md file

## Example Search Commands

```bash
# Find all waymarks
rg -n ":::"

# Find by prefix
rg -n "todo :::"
rg -n "warn :::"
rg -n "fix :::"

# Find pure notes (no prefix)
rg -n "^[[:space:]]*//[[:space:]]*:::[[:space:]]"

# Find by hashtag
rg -n "#security"
rg -n "#frontend"

# Find work assigned to Alice
rg -n ":::.*@alice"

# Find high priority items
rg -n ":::.*priority:high"

# Find with context (lines before/after)
rg -n -C2 "warn :::"

# Count all waymarks
rg -c ":::" | awk -F: '{sum+=$2} END {print sum}'
```

## Advanced Patterns

### Issue Integration

```javascript
// Link to issue trackers
// todo ::: fixes:#123 implement feature
// fix ::: closes:#456 security patch
// done ::: relates-to:PROJ-789 completed auth
```

### Parameterized Properties

```javascript
// Version constraints
// todo ::: requires:node(16,18,20) add compatibility
// warn ::: deprecated:v3.0 use newMethod() instead
// fix ::: affects:versions(1.0-2.5) security issue
```

### Lifecycle Tracking

```javascript
// Work status
// draft ::: work in progress, do not merge
// review ::: ready for code review
// shipped ::: deployed to production
// hold ::: blocked waiting on API update
```

## Tips

- **Space before `:::`**: Required when prefix is present
- **Keep markers short**: Under 80-120 characters for readable grep output  
- **Use properties for structure**: Machine-readable key:value pairs
- **Use hashtags for grouping**: Cross-cutting concerns like #security
- **Document team conventions**: Establish consistent patterns
- **Start simple**: Begin with `todo :::` and `:::`, add complexity as needed

## Progressive Enhancement

Start simple and add features as needed:

```javascript
// Level 1: Basic waymarks
// todo ::: add validation

// Level 2: Add properties
// todo ::: priority:high add validation

// Level 3: Add hashtags
// todo ::: priority:high add validation #security

// Level 4: Add assignment and issues
// todo ::: priority:high assign:@alice fixes:#123 add validation #security
```

Remember: The goal is **discoverability**. Even one `:::` waymark makes your codebase more navigable than none.

<!-- note ::: Updated for new ::: syntax specification -->