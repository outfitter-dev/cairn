# CLAUDE.md

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

- `:ga:sec` - Security-critical code requiring review
- `:ga:temp` - Temporary hacks to be removed  
- `:ga:@cursor` - Delegation points for AI agents
- `:ga:fix` - Conventional commit tie-ins
- `:ga:placeholder` - Future work markers
- `:ga:perf` - Performance-related sections

## Search Commands

Using ripgrep (rg) is the primary way to work with grep-anchors:

```bash
# Find all anchors
rg -n ":ga:"

# Find specific anchor types
rg -n ":ga:sec"           # security anchors
rg -n ":ga:temp"          # temporary code
rg -n ":ga:.*perf"        # performance-related
```

## Current Repository Structure

```
grepa/
├── docs/                 # Documentation
│   ├── styleguide/      # Tag conventions
│   ├── project/         # Project specs
│   └── about/           # Prior art
├── .claude/             # AI agent configuration
└── README.md            # Core concept overview
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