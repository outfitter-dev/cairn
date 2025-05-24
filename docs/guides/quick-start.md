# Quick Start Guide

Get started with grep-anchors in 5 minutes.

## What is Grepa?

Grepa uses **grep-anchors** - special comments with the `:ga:` marker that make your code searchable and discoverable.

## Basic Usage

### 1. Add Your First Anchor

Add a grep-anchor comment to mark important code:

```javascript
// :ga:todo implement error handling
function processUser(data) {
  // :ga:sec validate input
  return data;
}
```

### 2. Search with Ripgrep

Find all anchors in your codebase:

```bash
# Find all grep-anchors
rg -n ":ga:"

# Find specific types
rg -n ":ga:todo"
rg -n ":ga:sec"
```

### 3. Common Patterns

Start with these essential tags:

| Tag | Purpose | Example |
|-----|---------|---------|
| `todo` | Future work | `// :ga:todo add tests` |
| `fixme` | Broken code | `// :ga:fixme null pointer` |
| `sec` | Security critical | `// :ga:sec validate input` |
| `perf` | Performance | `// :ga:perf optimize loop` |
| `@person` | Assign to someone | `// :ga:@alice review this` |

## Combining Tags

Combine related tags with commas, or use separate lines for clarity:

```javascript
// Good: related tags, concise
// :ga:fix,sec critical security bug
// :ga:todo,@bob implement for next release

// Better: separate lines for different concerns
// :ga:sec validate user permissions
// :ga:todo implement rate limiting
// :ga:@bob assigned for code review
```

## Mention Patterns

Assign work and request attention:

```javascript
// :ga:@alice please review
// :ga:owner@bob payment module
// :ga:attn@security needs audit
```

## Next Steps

1. **Learn the notation**: [Notation Guide](../notation/)
2. **Explore conventions**: [Common Patterns](../conventions/common-patterns.md)
3. **Set up your team**: Create a CONVENTIONS.md file

## Example Search Commands

```bash
# Find all TODOs
rg -n ":ga:todo"

# Find security issues
rg -n ":ga:sec"

# Find work assigned to Alice
rg -n ":ga:.*@alice"

# Find high priority items
rg -n ":ga:.*p0"

# Count all anchors
rg -c ":ga:" | awk -F: '{sum+=$2} END {print sum}'
```

## Tips

- Keep tags short and meaningful
- Always add a description after tags
- Use standard tags when possible
- Document team-specific conventions
- Review and clean up old anchors regularly