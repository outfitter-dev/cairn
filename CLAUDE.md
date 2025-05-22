# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Grepa is a monorepo implementing **grep-anchors** - a standardized way to mark important code locations using the `:ga:` sigil in comments. It provides both a core parser library and a full-featured CLI for managing anchors across codebases.

## Project Structure

```
grepa/
├── packages/
│   ├── core/          # @grepa/core - Parser and utilities
│   └── cli/           # @grepa/cli - Command-line interface
├── scripts/
│   └── hooks/         # Pre-commit hooks
├── docs/              # Documentation
└── .grepa.yml         # Project configuration
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Clean build artifacts
pnpm clean
```

## Core Concepts

### The `:ga:tldr` Anchor
**ALWAYS** start every function, class, and module with a `:ga:tldr` anchor that provides a brief one-line summary. This is the most important anchor and should be universally applied.

### Common Anchor Types

- `:ga:tldr` - Brief function/module summary (REQUIRED)
- `:ga:sec` - Security-critical code requiring review
- `:ga:temp` - Temporary hacks to be removed
- `:ga:@cursor` - Delegation points for AI agents
- `:ga:fix` - Conventional commit tie-ins
- `:ga:placeholder` - Future work markers
- `:ga:perf` - Performance-related sections
- `:ga:api` - Public API surfaces
- `:ga:config` - Configuration handling
- `:ga:error` - Error handling logic

### Search Commands

```bash
# Using the grepa CLI
grepa list              # List all unique tokens
grepa grep sec          # Find security anchors
grepa lint --ci         # Run lint checks
grepa stats --top 10    # Show top 10 tokens

# Using ripgrep directly
rg -n ":ga:"           # Find all anchors
rg -n ":ga:sec"        # Security anchors
rg -n ":ga:temp"       # Temporary code
```

## Implementation Notes

### Architecture

The project uses a monorepo structure with:
- **@grepa/core**: Parser, config loader, file traversal, linting engine
- **@grepa/cli**: Command implementations, ripgrep integration, output formatting

### Key Implementation Details

1. **Parser** (`packages/core/src/parser.ts`)
   - Regex-based anchor detection
   - Support for bare tokens, JSON, and arrays
   - Line number and file tracking

2. **Config System** (`packages/core/src/config.ts`)
   - YAML-based configuration
   - Upward directory traversal for config discovery
   - Environment variable overrides (GREPA_ANCHOR)

3. **CLI Commands** (`packages/cli/src/commands/`)
   - Each command in separate file
   - Ripgrep integration for performance
   - JSON output support for tooling

4. **Linting Engine** (`packages/core/src/lint.ts`)
   - Forbidden token detection
   - Age-based validation
   - CI mode with exit codes

### Testing Approach

When adding tests:
- Unit tests for parser and tokenizer
- Integration tests for CLI commands
- E2E tests with fixture repositories

### Contributing

When making changes:
1. **Always add `:ga:tldr` to new functions**
2. Use appropriate anchors from the dictionary
3. Run `grepa lint` before committing
4. Update docs if adding new features
5. Follow conventional commits

## Coding with Grepa Tags

- **ALWAYS** start functions with `:ga:tldr`
- Use `:ga:` tags to mark important code sections
- Layer tags for context: `:ga:fix,sec,p0`
- Document new tokens in `.grepa.yml`
- Run `grepa lint --ci` in pre-commit hooks