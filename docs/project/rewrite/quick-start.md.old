# Quick Start Guide
<!-- :M: tldr Get started with waymarks in 5 minutes -->
<!-- :M: guide Essential quick start guide for new users -->

Get started with waymarks in 5 minutes.

## What is a Waymark?

**Waymarks** are special comments with the `:M:` identifier that make your code searchable and discoverable.

## Basic Usage

### 1. Add Your First Waymark

Add a waymarked comment to mark important code:

```javascript
// :M: todo implement error handling
function processUser(data) {
  // :M: sec validate input
  return data;
}
```

### 2. Search with Ripgrep

Find all waymarks in your codebase:

```bash
# Find all waymark
rg -n ":M:"

# Find specific types
rg -n ":M: todo"
rg -n ":M: sec"
```

### 3. Common Patterns

Start with these essential markers:

| Marker | Purpose | Example |
|--------|---------|---------|
| `tldr` | Brief summary | `// :M: tldr handles user auth` |
| `todo` | Future work | `// :M: todo add tests` |
| `ctx` | Key assumptions | `// :M: ctx UTC only` |
| `fixme` | Broken code | `// :M: fixme null pointer` |
| `sec` | Security critical | `// :M: sec validate input` |
| `@person` | Assign to someone | `// :M: @alice review this` |

## Combining Markers

Combine related markers with comma-space separation, or use separate lines for clarity:

```javascript
// Good: related markers, concise
// :M: fix, sec critical security bug
// :M: todo, @bob implement for next release

// Better: separate lines for different concerns
// :M: sec validate user permissions
// :M: todo implement rate limiting
// :M: @bob assigned for code review
```

## Mention Patterns

Assign work and request attention:

```javascript
// :M: @alice please review
// :M: owner:@bob payment module
// :M: attn, @sec needs audit
```

## Next Steps

1. **Learn the syntax**: [Syntax Guide](../syntax.md)
2. **Explore conventions**: [Conventions](../conventions.md)
3. **Set up your team**: Create a CONVENTIONS.md file

## Example Search Commands

```bash
# Find all TODOs
rg -n ":M: todo"

# Find security issues
rg -n ":M: sec"

# Find work assigned to Alice
rg -n ":M:.*@alice"

# Find high priority items
rg -n ":M:.*p0"

# Count all waymarks
rg -c ":M:" | awk -F: '{sum+=$2} END {print sum}'
```

## Tips

- Keep markers short and meaningful
- Always add a description after markers
- Use standard markers when possible
- Document team-specific conventions
- Review and clean up old waymarks regularly