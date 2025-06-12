<!-- tldr ::: Documentation hub for waymark syntax and conventions -->
# Waymark Documentation

Welcome to the waymark documentation. Start here to learn about waymarks - a universal pattern for making codebases searchable and AI-navigable.

## Quick Links

- **[Quick Start Guide](./guides/quick-start.md)** - Get started in 5 minutes
- **[Syntax Reference](./syntax.md)** - Complete waymark syntax specification
- **[Examples](./examples.md)** - Real-world usage patterns
- **[Conventions](./conventions.md)** - Best practices and team patterns

## What are Waymarks?

Waymarks are searchable markers in code comments using the `:::` sigil:

```javascript
// todo ::: implement validation
// warn ::: check user permissions #security
// ::: assumes UTC timestamps
```

Search them instantly:
```bash
rg ":::"          # Find all waymarks
rg "todo :::"     # Find all todos
rg "#security"    # Find security concerns
```

## Documentation Structure

### Core Documentation

- **[Syntax](./syntax.md)** - The `:::` sigil, prefixes, properties, and hashtags
- **[Examples](./examples.md)** - Patterns organized by use case
- **[Conventions](./conventions.md)** - Essential patterns and best practices
- **[Waymarks in Documentation](./waymarks-in-documentation.md)** - Integration with JSDoc, docstrings, etc.

### Guides

- **[Quick Start](./guides/quick-start.md)** - 5-minute introduction

### Reference

- **[About Prior Art](./about/priors.md)** - Related concepts and inspiration
- **[Tooling API](./tooling/API.md)** - Waymark parser and search APIs
- **[CLI Reference](./tooling/CLI.md)** - Command-line interface

### Project

- **[Language Guide](./project/LANGUAGE.md)** - How to write about waymarks
- **[Archive](./project/archive/)** - Historical documentation
- **[Proposals](./project/proposals/)** - Future enhancements

## Key Concepts

### The `:::` Sigil

The canonical waymark sigil, optionally preceded by a prefix:

```python
# todo ::: implement error handling
#      ^^^
#      └── Sigil separates prefix from content
```

### Prefix Categories

Waymarks use prefixes to classify code locations:

- **Tasks**: `todo`, `fix`, `done`, `review`
- **Information**: `tldr`, `note`, `docs`, `why`
- **Alerts**: `warn`, `crit`, `unsafe`, `deprecated`
- **Meta**: `ai`, `important`, `hack`, `idea`
- **Lifecycle**: `stub`, `draft`, `stable`, `shipped`

Plus properties (`priority:high`), hashtags (`#security`), and @mentions (`@alice`).

### Search Patterns

Find waymarks with ripgrep:

```bash
# Basic searches
rg "todo :::"              # All todos
rg ":::.*@alice"           # Alice's assignments
rg ":::.*priority:high"    # High priority items
rg "#security"             # Security hashtag

# With context
rg -C2 "warn :::"          # Warnings with 2 lines context
rg -B3 -A3 "todo :::"      # Todos with surrounding code
```

## Getting Started

1. **Add your first waymark**:
   ```javascript
   // todo ::: add input validation
   function processUser(data) {
     return data; 
   }
   ```

2. **Search for it**:
   ```bash
   rg "todo :::"
   # => example.js:1:// todo ::: add input validation
   ```

3. **Learn patterns** in the [Quick Start Guide](./guides/quick-start.md)

## Philosophy

- **Start simple** - One waymark is better than none
- **Progressive adoption** - Add complexity only when needed
- **Tool-agnostic** - Works with grep, ripgrep, or any search tool
- **Language-agnostic** - Same pattern works everywhere
- **AI-friendly** - Optimized for LLM navigation

## Contributing

See the main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

Remember: The goal is discoverability. Well-placed waymarks serve as breadcrumbs through your code.