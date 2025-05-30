<!-- :A: tldr: Claude Code configuration and development guidelines -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

Currently undergoing an incremental rebuild (January 2025). The project is being rebuilt from the ground up with a focus on documentation and ripgrep-based functionality first. Full package implementations are archived in the `archive/pre-rebuild-2025-01` branch.

## Project Overview

Grepa provides tooling for **Magic Anchors** - a standardized way to mark important code locations using the `:A:` sigil in comments. This allows both humans and AI agents to quickly find relevant code sections using simple grep commands. Magic Anchors are the notation system, while Grepa is the tooling that understands and processes them.

## Important Notes

- This repository uses Magic Anchors (`:A:`). Use @llms.txt for how to use.
- Magic Anchors are the notation; Grepa is the tooling.

## Core Concept

The Magic Anchor pattern: `<comment-leader> :A: <space> <marker-list> <optional prose>`

- **`:A:`** - the canonical three-character anchor (always followed by exactly one ASCII space)
- **marker-list** - one or more markers that classify the line, comma-separated
- **prose** - optional human-readable description

## Common Anchor Types

### Essential Patterns

- `:A: tldr` - Brief summary/overview (use at function/class/doc start)
- `:A: todo` - Work that needs doing
- `:A: security` or `:A: sec` - Security-critical code requiring review
- `:A: temp` or `:A: tmp` - Temporary hacks to be removed
- `:A: context` or `:A: ctx` - Important context, assumptions, and constraints
- `:A: todo @agent` - AI agent tasks (using implicit assignment)
- `:A: todo @cursor` - Cursor-specific tasks
- `:A: todo @claude` - Claude-specific tasks

### Quality & Management

- `:A: perf` - Performance-related sections
- `:A: bug` - Known issues to fix (can be standalone or `:A: todo(bug:auth-timeout)`)
- `:A: fix` / `:A: fixme` - Broken code needing immediate fix
- `:A: test` - Testing requirements
- `:A: api` - Public interfaces
- `:A: deprecated` - Code scheduled for removal
- `:A: freeze` - Code that must not be modified
- `:A: review` - Needs human review
- `:A: config` - Configuration values

### Risk & Severity

- `:A: warn` - Potential issues or gotchas
- `:A: critical` - Critical code paths or issues
- `:A: unsafe` - Dangerous operations

### Advanced Patterns

- `:A: issue(123)` - Link to issue tracker
- `:A: owner:@alice` - Assign responsibility (colon for all markers with values)
- `:A: due(2024-03-01)` - Due dates
- `:A: depends(auth-service)` - Dependencies (no redundant prepositions)
- `:A: blocked:[4,7]` - Multiple blockers (brackets for arrays)
- `:A: priority:high` - Priority classification (colon for type:value)

### Marker Philosophy

- Markers are organized into 6 semantic groups: `todo`, `info`, `notice`, `trigger`, `domain`, `status`
- Use synonyms for brevity: `sec`/`security`, `ctx`/`context`, `tmp`/`temp`
- No JSON, YAML, or regex patterns within anchors
- No structural dots (only literal dots in versions, URLs, paths)

## Search Commands

Using ripgrep (rg) is the primary way to work with Magic Anchors:

```bash
# Find all anchors
rg -n ":A:"

# Find specific anchor types
rg -n ":A: security"      # security anchors
rg -n ":A: temp"          # temporary code
rg -n ":A: todo"          # tasks to complete
rg -n ":A:.*@agent"       # AI agent tasks
rg -n ":A:.*perf"         # performance-related

# Find with context (lines before/after)
rg -B2 -A2 ":A: security"  # 2 lines before and after
rg -C3 ":A: todo"          # 3 lines context

# Group-level searches
rg ":A:.*notice"          # All warnings/alerts
rg ":A:.*domain"          # All domain-specific markers

# Find in markdown (including HTML comments)
rg "<!-- :A:" --type md
```

## Current Repository Structure

```
grepa/
├── docs/                 # Documentation
│   ├── about/           # Prior art and history
│   │   └── priors.md    # Related concepts and inspiration
│   ├── conventions/     # Marker conventions and patterns
│   │   ├── README.md    # Convention overview
│   │   ├── common-patterns.md     # Essential markers
│   │   ├── ai-patterns.md         # AI agent patterns
│   │   ├── workflow-patterns.md   # Task tracking
│   │   ├── domain-specific.md     # Framework patterns
│   │   └── combinations.md        # Multiple marker usage
│   ├── guides/          # User guides and tutorials
│   │   ├── quick-start.md         # 5-minute intro
│   │   ├── progressive-enhancement.md  # Adoption levels
│   │   └── custom-anchors.md      # Custom sigils
│   ├── magic-anchors/   # Magic Anchors notation spec
│   │   ├── README.md    # Notation overview
│   │   ├── SPEC.md      # Syntax specification
│   │   ├── LANGUAGE.md  # Language guidelines
│   │   ├── CHANGELOG.md # Notation version history
│   │   └── advanced/    # Deep-dive topics (delimiter semantics, etc.)
│   ├── grepa/           # Grepa tooling documentation
│   │   ├── LANGUAGE.md  # Tool language guidelines
│   │   ├── ROADMAP.md   # Future tooling plans
│   │   └── CHANGELOG.md # Tooling version history
│   ├── project/         # Project specifications
│   │   └── specs/       # Version specifications
│   ├── examples.md      # Real-world usage
│   ├── magic-anchors/advanced/advanced-patterns.md  # Complex scenarios
│   └── what-ifs.md      # AI-native vision
├── README.md            # Main documentation with links
├── CLAUDE.md            # AI agent instructions (this file)
└── llms.txt             # LLM-readable quick reference
```

## Development Guidelines

1. **Incremental Approach**: We're building from documentation first, then simple ripgrep usage, before any complex tooling
2. **Preserve History**: The `archive/pre-rebuild-2025-01` branch contains all previous implementation work
3. **Focus on Clarity**: Documentation should clearly explain the Magic Anchors concept and its benefits
4. **Terminology**: Magic Anchors = notation, Grepa = tooling

## Future Tooling (Currently Archived)

The following packages exist in the archive branch and may be reintroduced:

- @grepa/core - Parser and validation library
- @grepa/cli - Command-line interface
- Additional integrations (ESLint, VS Code, etc.)

## Best Practices for This Repository

### Using Magic Anchors

1. **Single space after `:A:`**: Required for consistency and parsing
2. **Delimiter rules**:
   - Colon (`:`) for classifications: `priority:high`
   - Parentheses `()` for parameters: `blocked(issue:4)`
   - Brackets `[]` for arrays: `owner:[@alice,@bob]`
3. **Line limits**: Keep under ~120 chars for readable grep output
4. **Be specific**: Use clear marker combinations
5. **Use HTML comments in markdown**: `<!-- :A: tldr summary -->` for non-rendered anchors

### Contributing

When working on this project:

1. Always use conventional commits
2. Work on feature branches off main
3. Use Magic Anchors as comments in any new code or when you find code that doesn't yet have them
4. Focus on simplicity and grep-ability
5. Use ripgrep to verify anchor patterns before commits
6. Follow the `:A:` syntax with mandatory single space

### Pre-Push Quality Checks

**CRITICAL**: Before pushing any code:

1. **Run CI locally**: `pnpm ci:local` - This simulates the full CI pipeline
2. **Comprehensive check**: `pnpm check:all` - Includes temporary marker detection
3. **Quick validation**: `pnpm ci:validate` - Tests, types, and build only
4. **Check for temp code**: `pnpm check:anchors` - Ensures no `:A: tmp` markers

The pre-push hook will automatically run these checks, but running them manually first saves time.

### Documentation Standards

- All markdown files should have `<!-- :A: tldr: <short description> -->` at the top
- Use contextual markers like `<!-- :A: guide: <short description> -->` or `<!-- :A: spec: <short description> -->`
- Keep documentation focused and scannable
- Link related docs for navigation
- Remember: if `todo` appears, it must be the first marker
