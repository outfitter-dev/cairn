# Grepa Conventions

Community patterns and best practices for using grep-anchors effectively.

## What are Conventions?

While **notation** defines how to write grep-anchors, **conventions** define:
- What tags to use for specific purposes
- When to apply certain patterns
- How teams organize their anchor usage

## Convention Categories

### [Common Patterns](./common-patterns.md)
General-purpose tags used across most projects:
- `:ga:tldr` - Function summaries
- `:ga:api` - Public interfaces
- `:ga:internal` - Private implementation

### [Domain Specific](./domain-specific.md)
Specialized tags for specific concerns:
- `:ga:sec` - Security critical
- `:ga:perf` - Performance sensitive
- `:ga:a11y` - Accessibility

### [Workflow Patterns](./workflow-patterns.md)
Process and collaboration tags:
- `:ga:todo` - Future work
- `:ga:review` - Needs review
- `:ga:attn@mention` - Attention needed
- `:ga:owner@mention` - Ownership

### [AI Patterns](./ai-patterns.md)
Agent delegation and AI assistance:
- `:ga:@cursor` - Cursor AI
- `:ga:@claude` - Claude
- `:ga:generate` - Code generation

### [Combinations](./combinations.md)
Effective tag combinations:
- `:ga:fix,sec,p0` - Critical security fix
- `:ga:todo,@alice,v2.1` - Assigned future work

## Creating Team Conventions

Teams should document their specific conventions:

1. **Choose a core set** - Start with 5-10 tags
2. **Define meanings** - Clear descriptions
3. **Add examples** - Show usage in context
4. **Evolve gradually** - Add patterns as needed

## Best Practices

- **Be consistent** - Use the same tags for same purposes
- **Stay simple** - Prefer common tags over custom ones
- **Document locally** - Keep a CONVENTIONS.md in your repo
- **Review regularly** - Audit and clean up stale anchors