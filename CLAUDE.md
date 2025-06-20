<!-- tldr ::: Claude Code configuration and development guidelines -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

About you: @.agents/prompts/MAX.md

## Project Overview

The Waymark CLI provides tooling for **waymarks** - a standardized way to mark important code locations using the `:::` sign in comments. This allows both humans and AI agents to quickly find relevant code sections using simple grep commands.

**Core Value**: Waymarks make codebases AI-navigable and grep-friendly, enabling instant navigation to the right spot in any codebase.

## Waymark Syntax

This project uses **waymarks** for code annotation. The complete and authoritative syntax guide can be found here: @.agents/partials/waymark-usage.md

Please refer to that document for all rules regarding reading, writing, and searching for waymarks. It is the single source of truth for:

- Syntax specification (v1.0)
- Core markers and signals
- Tag system and relational tags
- Search patterns
- Best practices

## Repository Structure

```text
waymark/
├── docs/                 # Documentation
│   ├── _project/        # Project management docs
│   │   ├── proposals/   # Enhancement proposals
│   │   └── *.md        # Conversion guides, etc.
│   ├── about/           # Prior art and history
│   ├── conventions/     # Context conventions
│   ├── guides/          # User guides
│   ├── syntax/          # Waymark syntax specification
│   └── tooling/         # Waymark tooling docs
├── scripts/             # Utility scripts
│   ├── audit-waymarks.js    # Waymark inventory tool
│   └── lib/                 # Script libraries
├── src/                 # Source code (future)
├── README.md           # Main documentation
├── CLAUDE.md          # AI agent instructions (this file)
├── llms.txt           # LLM-readable quick reference
└── .agents/           # AI agent configuration
    ├── prompts/       # Agent prompts (MAX.md)
    └── partials/      # Reusable documentation
```

## Development Guidelines

### 1. Waymark Usage

When working in this codebase:

- Use v1.0 syntax as specified in @.agents/partials/waymark-usage.md
- Prefer signals (`!`, `!!`) over properties for priority
- Use `#` prefix for all tags (not `+`)
- Always include `#` in reference values: `#fixes:#123`
- Use `fixme` not `fix` for bug markers

Common patterns:
```javascript
// *todo ::: finish before merge          // Branch-scoped work
// !todo ::: high priority task           // P1 priority
// !!fixme ::: critical security bug      // P0 critical
// todo ::: implement feature #backend    // Simple tags
// notice ::: deployment #affects:#api,#billing  // Arrays
// todo ::: @alice review this #owner:@alice     // Actors
```

### 2. Search First Development

Before implementing anything, search for existing patterns:
```bash
# Find all todos
rg "todo\s+:::"

# Find work by priority
rg "!!todo"              # Critical
rg "!todo"               # High priority

# Find by tags
rg "#security"           # Security-related
rg "#(perf:)?hotpath"    # Performance hotspots

# Find by issue
rg "#123\b"              # Issue references
rg "#fixes:#\d+"         # All fixes
```

### 3. Git Workflow

- Always use conventional commits
- Work on feature branches off main
- The main branch is `main` (not master)
- Current feature branch pattern: `feature/[description]`

### 4. Pre-Push Quality Checks

**CRITICAL**: Before pushing any code:

1. **Run CI locally**: `pnpm ci:local` - Simulates the full CI pipeline
2. **Comprehensive check**: `pnpm check:all` - Includes temporary code detection
3. **Check for temp code**: Ensure no `*temp` or `*!temp` waymarks (branch-scoped temporary code)
4. **Audit waymarks**: `node scripts/audit-waymarks.js` - Check for deprecated markers

The pre-push hook will automatically run these checks, but running them manually first saves time.

### 5. Documentation Standards

All documentation files should include waymarks:

- **Markdown files**: Use HTML comments `<!-- marker ::: description -->`
- **Top of file**: Always include `<!-- tldr ::: brief summary -->`
- **Key sections**: Use `<!-- important ::: key concept -->` for critical information
- **Cross-references**: Use anchors `<!-- about ::: ##doc/section description -->`

Example:
```markdown
<!-- tldr ::: comprehensive guide to waymark syntax v1.0 -->
<!-- important ::: this supersedes all previous syntax versions -->
<!-- about ::: ##syntax/signals signal system explanation -->
```

### 6. Contributing Best Practices

1. **Search before adding**: Check if similar waymarks exist
2. **Be specific**: Clear, actionable descriptions
3. **Use appropriate markers**: Choose the right marker from v1.0 core set
4. **Tag consistently**: Reuse existing tags when possible
5. **Clean up**: Remove completed waymarks, don't leave them as `done`
6. **Test locally**: Always run `pnpm ci:local` before pushing

## AI Agent Integration

This repository is designed for AI-first development:

1. **Waymarks guide navigation**: Use waymarks to mark important locations
2. **Grep-first discovery**: All patterns are optimized for ripgrep
3. **Progressive enhancement**: Start simple, add complexity as needed
4. **Clear delegation**: Use `@agent` for AI-specific tasks

Example AI workflow:
```javascript
// todo ::: @agent implement validation for user input
// important ::: must validate email format and uniqueness
// test ::: email validation edge cases #for:#auth/signup
```

## Current Project Status

- **Syntax Version**: v1.0 (finalized 2025-06)
- **Migration**: Recently migrated from early syntax to v1.0
- **Tooling**: Basic CLI tools, VS Code integration planned
- **Documentation**: Comprehensive guides available

## Important Context

1. **This is the waymark reference implementation** - Set the standard
2. **Documentation-first approach** - Docs drive implementation
3. **Simplicity is key** - Avoid over-engineering
4. **Grep is the primary tool** - Optimize for searchability
5. **AI agents are first-class users** - Design for both humans and AI

## Quick Command Reference

```bash
# Development
pnpm dev              # Start development
pnpm test             # Run tests
pnpm build            # Build project

# Quality checks
pnpm ci:local         # Full CI simulation
pnpm check:all        # All checks
pnpm lint             # Lint code
pnpm typecheck        # Type checking

# Waymark tools
node scripts/audit-waymarks.js              # Audit all waymarks
node scripts/audit-waymarks.js --verbose    # Detailed audit
rg ":::" | wc -l                           # Count waymarks
```

## Resources

- Waymark syntax guide: @.agents/partials/waymark-usage.md
- Project proposals: docs/_project/proposals/
- Quick reference: llms.txt
- Main documentation: README.md

Remember: The goal is to make codebases navigable. Use waymarks to leave a trail that both humans and AI can follow.