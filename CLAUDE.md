# CLAUDE.md
<!-- :ga:tldr AI agent instructions for working with the grepa repository -->
<!-- :ga:meta Claude Code configuration and development guidelines -->

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

Currently undergoing an incremental rebuild (January 2025). The project is being rebuilt from the ground up with a focus on documentation and ripgrep-based functionality first. Full package implementations are archived in the `archive/pre-rebuild-2025-01` branch.

## Project Overview

Grepa is a specification for **grep-anchors** - a standardized way to mark important code locations using the `:ga:` sigil in comments. This allows both humans and AI agents to quickly find relevant code sections using simple grep commands.

## Core Concept

The grep-anchor pattern: `<comment-leader> :ga:payload`
- **`:ga:`** - the fixed four-character marker (or custom sigil like `:<your-sigil>:`)
- **payload** - one or more tokens that classify the line

## Common Anchor Types

- `:ga:tldr` - Brief summary/overview (use at function/class start)
- `:ga:todo` - Work that needs doing
- `:ga:sec` - Security-critical code requiring review
- `:ga:tmp` - Temporary hacks to be removed  
- `:ga:@agent` - Delegation points for AI agents (generic)
- `:ga:@cursor` - Cursor-specific tasks
- `:ga:@claude` - Claude-specific tasks
- `:ga:ctx` - Important assumptions and constraints
- `:ga:perf` - Performance-related sections
- `:ga:bug` - Known issues to fix

**Tag Philosophy**: Keep tags terse. You'll type these hundreds of times, so `sec` beats `security`, `ctx` beats `context`, `tmp` beats `temp`.

## Search Commands

Using ripgrep (rg) is the primary way to work with grep-anchors:

```bash
# Find all anchors
rg -n ":ga:"

# Find specific anchor types
rg -n ":ga:sec"          # security anchors
rg -n ":ga:tmp"           # temporary code
rg -n ":ga:todo"          # tasks to complete
rg -n ":ga:@agent"        # AI agent instructions
rg -n ":ga:.*perf"        # performance-related

# Find with context (lines before/after)
rg -B2 -A2 ":ga:sec"      # 2 lines before and after
rg -C3 ":ga:todo"         # 3 lines context

# Generate inventory (with options)
scripts/inventory.js              # Default: scan all files
scripts/inventory.js --ignore-md  # Ignore markdown files
scripts/inventory.js --ignore-examples  # Ignore code examples
```

## Current Repository Structure

```
grepa/
├── docs/                 # Documentation
│   ├── about/           # Prior art and history
│   ├── conventions/     # Tag conventions and patterns
│   ├── guides/          # User guides and tutorials
│   ├── notation/        # Notation format details
│   ├── project/         # Project specifications
│   ├── advanced-patterns.md  # Complex usage scenarios
│   └── what-ifs.md      # Vision for AI-native development
├── scripts/             # Automation scripts
│   ├── inventory.js     # Inventory generator (Node.js)
│   └── inventory.py     # Inventory generator (Python)
├── README.md            # Core concept overview
├── CLAUDE.md            # AI agent instructions
└── llms.txt             # LLM-readable reference
```

## Development Guidelines

1. **Incremental Approach**: We're building from documentation first, then simple ripgrep usage, before any complex tooling
2. **Preserve History**: The `archive/pre-rebuild-2025-01` branch contains all previous implementation work
3. **Focus on Clarity**: Documentation should clearly explain the grep-anchor concept and its benefits

## Future Tooling (Currently Archived)

The following packages exist in the archive branch and may be reintroduced:
- @grepa/core - Parser and validation library
- @grepa/cli - Command-line interface
- Additional integrations (ESLint, VS Code, etc.)

## Contributing

When working on this project:
1. Always use conventional commits
2. Work on feature branches off main
3. Use grep-anchors in any new code (`:ga:tldr` for functions)
4. Focus on simplicity and grep-ability