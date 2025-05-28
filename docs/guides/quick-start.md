# Quick Start Guide
<!-- :A: tldr Get started with Magic Anchors in 5 minutes -->
<!-- :A: guide Essential quick start guide for new users -->

Get started with Magic Anchors in 5 minutes.

## What is Grepa?

Grepa uses **Magic Anchors** - special comments with the `:A:` marker that make your code searchable and discoverable.

## Basic Usage

### 1. Add Your First Anchor

Add a Magic Anchor comment to mark important code:

```javascript
// :A: todo implement error handling
function processUser(data) {
  // :A: sec validate input
  return data;
}
```

### 2. Search with Ripgrep

Find all anchors in your codebase:

```bash
# Find all Magic Anchors
rg -n ":A:"

# Find specific types
rg -n ":A: todo"
rg -n ":A: sec"
```

### 3. Common Patterns

Start with these essential markers:

| Marker | Purpose | Example |
|--------|---------|---------|
| `tldr` | Brief summary | `// :A: tldr handles user auth` |
| `todo` | Future work | `// :A: todo add tests` |
| `ctx` | Key assumptions | `// :A: ctx UTC only` |
| `fixme` | Broken code | `// :A: fixme null pointer` |
| `sec` | Security critical | `// :A: sec validate input` |
| `@person` | Assign to someone | `// :A: @alice review this` |

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
rg -n ":A:.*@alice"

# Find high priority items
rg -n ":A:.*p0"

# Count all anchors
rg -c ":A:" | awk -F: '{sum+=$2} END {print sum}'
```

## Tips

- Keep markers short and meaningful
- Always add a description after markers
- Use standard markers when possible
- Document team-specific conventions
- Review and clean up old anchors regularly