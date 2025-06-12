# Waymark Documentation
<!-- :M: tldr Documentation hub for waymark syntax and conventions -->

Welcome to the waymark documentation. Start here to learn about waymarks - a universal pattern for making codebases searchable and AI-navigable.

## Quick Links

- **[Quick Start Guide](./guides/quick-start.md)** - Get started in 5 minutes
- **[Syntax Reference](./syntax.md)** - Complete waymark syntax specification
- **[Examples](./examples.md)** - Real-world usage patterns
- **[Conventions](./conventions.md)** - Best practices and team patterns

## What are Waymarks?

Waymarks are searchable markers in code comments using the `:M:` pattern:

```javascript
// :M: todo implement validation
// :M: sec check user permissions
// :M: ctx assumes UTC timestamps
```

Search them instantly:
```bash
rg ":M:"          # Find all waymarks
rg ":M: todo"     # Find all todos
rg ":M: sec"      # Find security concerns
```

## Documentation Structure

### Core Documentation

- **[Syntax](./syntax.md)** - The `:M:` identifier, grammar, and payload types
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

### The `:M:` Identifier

The canonical waymark identifier followed by exactly one space:

```python
# :M: todo implement error handling
#    ^
#    └── Exactly one space required
```

### Context Types

Waymarks use contexts to classify code locations:

- **Work**: `todo`, `fix`, `bug`
- **Context**: `ctx`, `tldr`, `docs`
- **Security**: `sec`, `warn`, `critical`
- **AI**: `@agent`, `@claude`, `@cursor`
- **Quality**: `perf`, `debt`, `test`
- **Status**: `tmp`, `wip`, `done`

### Search Patterns

Find waymarks with ripgrep:

```bash
# Basic searches
rg ":M: todo"              # All todos
rg ":M:.*@agent"           # AI tasks
rg ":M:.*priority:high"    # High priority items

# With context
rg -C2 ":M: sec"           # Security with 2 lines context
rg -B3 -A3 ":M: todo"      # Todos with surrounding code
```

## Getting Started

1. **Add your first waymark**:
   ```javascript
   // :M: todo add input validation
   function processUser(data) {
     return data; 
   }
   ```

2. **Search for it**:
   ```bash
   rg ":M: todo"
   # => example.js:1:// :M: todo add input validation
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