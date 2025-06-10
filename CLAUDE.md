<!-- :M: tldr: Claude Code configuration and development guidelines -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

About you: @.ai/prompts/MAX.md

## Project Overview

Cairn provides tooling for **Cairns** - a standardized way to mark important code locations using the `:M:` identifier in comments. This allows both humans and AI agents to quickly find relevant code sections using simple grep commands. Cairns are the notation system, while Cairn is the tooling that understands and processes them.

## Important Notes

- This repository uses Cairns (`:M:`). Use @llms.txt for how to use.
- Cairns are the notation; Cairn is the tooling.

## Core Concept

The Cairn pattern: `<comment-leader> :M: <space> <context-list> <optional prose>`

- **`:M:`** - the canonical three-character cairn (always followed by exactly one ASCII space)
- **context-list** - one or more contexts that classify the line, comma-separated
- **prose** - optional human-readable description

## Common Cairn Types

### Essential Patterns

- `:M: tldr` - Brief summary/overview (use at function/class/doc start)
- `:M: todo` - Work that needs doing
- `:M: security` or `:M: sec` - Security-critical code requiring review
- `:M: temp` - Temporary hacks to be removed (`:M: tmp` also recognized)
- `:M: context` or `:M: ctx` - Important context, assumptions, and constraints
- `:M: todo @agent` - AI agent tasks (using implicit assignment)
- `:M: todo @cursor` - Cursor-specific tasks
- `:M: todo @claude` - Claude-specific tasks

### Quality & Management

- `:M: perf` - Performance-related sections
- `:M: bug` - Known issues to fix (can be standalone or `:M: todo(bug:auth-timeout)`)
- `:M: fix` / `:M: fixme` - Broken code needing immediate fix
- `:M: test` - Testing requirements
- `:M: api` - Public interfaces
- `:M: deprecated` - Code scheduled for removal
- `:M: freeze` - Code that must not be modified
- `:M: review` - Needs human review
- `:M: config` - Configuration values

### Risk & Severity

- `:M: warn` - Potential issues or gotchas
- `:M: critical` - Critical code paths or issues
- `:M: unsafe` - Dangerous operations

### Advanced Patterns

- `:M: issue(123)` - Link to issue tracker
- `:M: owner:@alice` - Assign responsibility (colon for all contexts with values)
- `:M: due(2024-03-01)` - Due dates
- `:M: depends(auth-service)` - Dependencies (no redundant prepositions)
- `:M: blocked:[4,7]` - Multiple blockers (brackets for arrays)
- `:M: priority:high` - Priority classification (colon for type:value)

### Context Philosophy

- Contexts are organized into 6 semantic groups: `todo`, `info`, `notice`, `trigger`, `domain`, `status`
- Use synonyms for brevity: `sec`/`security`, `ctx`/`context`, `tmp`/`temp`
- No JSON, YAML, or regex patterns within cairns
- No structural dots (only literal dots in versions, URLs, paths)

## Search Commands

Using ripgrep (rg) is the primary way to work with Cairns:

```bash
# Find all cairns
rg -n ":M:"

# Find specific cairn types
rg -n ":M: security"      # security cairns
rg -n ":M: temp"          # temporary code
rg -n ":M: todo"          # tasks to complete
rg -n ":M:.*@agent"       # AI agent tasks
rg -n ":M:.*perf"         # performance-related

# Find with context (lines before/after)
rg -B2 -A2 ":M: security"  # 2 lines before and after
rg -C3 ":M: todo"          # 3 lines context

# Group-level searches
rg ":M:.*notice"          # All warnings/alerts
rg ":M:.*domain"          # All domain-specific contexts

# Find in markdown (including HTML comments)
rg "<!-- :M:" --type md
```

## Current Repository Structure

```
cairn/
├── docs/                 # Documentation
│   ├── about/           # Prior art and history
│   │   └── priors.md    # Related concepts and inspiration
│   ├── conventions/     # Context conventions and patterns
│   │   ├── README.md    # Convention overview
│   │   ├── common-patterns.md     # Essential contexts
│   │   ├── ai-patterns.md         # AI agent patterns
│   │   ├── workflow-patterns.md   # Task tracking
│   │   ├── domain-specific.md     # Framework patterns
│   │   └── combinations.md        # Multiple context usage
│   ├── guides/          # User guides and tutorials
│   │   ├── quick-start.md         # 5-minute intro
│   │   ├── progressive-enhancement.md  # Adoption levels
│   │   └── custom-cairns.md      # Custom identifiers
│   ├── cairns/   # Cairns notation spec
│   │   ├── README.md    # Notation overview
│   │   ├── SPEC.md      # Syntax specification
│   │   ├── LANGUAGE.md  # Language guidelines
│   │   ├── CHANGELOG.md # Notation version history
│   │   └── advanced/    # Deep-dive topics (delimiter semantics, etc.)
│   ├── cairn/           # Cairn tooling documentation
│   │   ├── LANGUAGE.md  # Tool language guidelines
│   │   ├── ROADMAP.md   # Future tooling plans
│   │   └── CHANGELOG.md # Tooling version history
│   ├── project/         # Project specifications
│   │   └── specs/       # Version specifications
│   ├── examples.md      # Real-world usage
│   ├── cairns/advanced/advanced-patterns.md  # Complex scenarios
│   └── what-ifs.md      # AI-native vision
├── README.md            # Main documentation with links
├── CLAUDE.md            # AI agent instructions (this file)
└── llms.txt             # LLM-readable quick reference
```

## Development Guidelines

1. **Incremental Approach**: We're building from documentation first, then simple ripgrep usage, before any complex tooling
2. **Preserve History**: The `archive/pre-rebuild-2025-01` branch contains all previous implementation work
3. **Focus on Clarity**: Documentation should clearly explain the Cairns concept and its benefits
4. **Terminology**: Cairns = notation, Cairn = tooling

## Future Tooling (Currently Archived)

The following packages exist in the archive branch and may be reintroduced:

- @cairn/core - Parser and validation library
- @cairn/cli - Command-line interface
- Additional integrations (ESLint, VS Code, etc.)

## Best Practices for This Repository

### Using Cairns

1. **Single space after `:M:`**: Required for consistency and parsing
2. **Delimiter rules**:
   - Colon (`:`) for classifications: `priority:high`
   - Parentheses `()` for parameters: `blocked(issue:4)`
   - Brackets `[]` for arrays: `owner:[@alice,@bob]`
3. **Line limits**: Keep under ~120 chars for readable grep output
4. **Be specific**: Use clear context combinations
5. **Use HTML comments in markdown**: `<!-- :M: tldr summary -->` for non-rendered cairns

### Contributing

When working on this project:

1. Always use conventional commits
2. Work on feature branches off main
3. Use Cairns as comments in any new code or when you find code that doesn't yet have them
4. Focus on simplicity and grep-ability
5. Use ripgrep to verify cairn patterns before commits
6. Follow the `:M:` syntax with mandatory single space

### Pre-Push Quality Checks

**CRITICAL**: Before pushing any code:

1. **Run CI locally**: `pnpm ci:local` - This simulates the full CI pipeline
2. **Comprehensive check**: `pnpm check:all` - Includes temporary context detection
3. **Quick validation**: `pnpm ci:validate` - Tests, types, and build only
4. **Check for temp code**: `pnpm check:cairns` - Ensures no `:M: tmp` or `:M: temp` contexts

The pre-push hook will automatically run these checks, but running them manually first saves time.

### Documentation Standards

- All markdown files should have `<!-- :M: tldr: <short description> -->` at the top
- Use contextual cairns like `<!-- :M: guide: <short description> -->` or `<!-- :M: spec: <short description> -->`
- Keep documentation focused and scannable
- Link related docs for navigation
- Remember: if `todo` appears, it must be the first context
