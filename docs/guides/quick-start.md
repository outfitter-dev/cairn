# Quick Start Guide
<!-- :M: tldr Get started with Cairns in 5 minutes -->
<!-- :M: guide Essential quick start guide for new users -->

Get started with Cairns in 5 minutes.

## What is Cairn?

Cairn uses **Cairns** - special comments with the `:M:` marker that make your code searchable and discoverable.

## Basic Usage

### 1. Add Your First Cairn

Add a Cairn comment to mark important code:

```javascript
// :M: todo implement error handling
function processUser(data) {
  // :M: sec validate input
  return data;
}
```

### 2. Search with Ripgrep

Find all cairns in your codebase:

```bash
# Find all Cairns
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
// :A: fix, sec critical security bug
// :A: todo, @bob implement for next release

// Better: separate lines for different concerns
// :A: sec validate user permissions
// :A: todo implement rate limiting
// :A: @bob assigned for code review
```

## Mention Patterns

Assign work and request attention:

```javascript
// :A: @alice please review
// :A: owner:@bob payment module
// :A: attn, @sec needs audit
```

## Next Steps

1. **Learn the notation**: [Notation Guide](../notation/)
2. **Explore conventions**: [Common Patterns](../conventions/common-patterns.md)
3. **Set up your team**: Create a CONVENTIONS.md file

## Example Search Commands

```bash
# Find all TODOs
rg -n ":A: todo"

# Find security issues
rg -n ":A: sec"

# Find work assigned to Alice
rg -n ":M:.*@alice"

# Find high priority items
rg -n ":M:.*p0"

# Count all cairns
rg -c ":M:" | awk -F: '{sum+=$2} END {print sum}'
```

## Tips

- Keep markers short and meaningful
- Always add a description after markers
- Use standard markers when possible
- Document team-specific conventions
- Review and clean up old cairns regularly