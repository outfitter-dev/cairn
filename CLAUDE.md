<!-- ::: tldr Claude Code configuration and development guidelines -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

About you: @.ai/prompts/MAX.md

## Project Overview

The Waymark CLI provides tooling for **waymarks** - a standardized way to mark important code locations using the `:::` sigil in comments. This allows both humans and AI agents to quickly find relevant code sections using simple grep commands.

## Important Notes

- This repository uses waymarks with the `:::` sigil. Use @llms.txt for how to use.
- The project is transitioning from `:M:` to `:::` syntax

## Core Concept

The waymark pattern: `[comment-leader] [prefix] ::: [properties] [note] [#hashtags]`

- **`:::`** - the sigil that defines a waymark (preceded by space when prefix is present)
- **prefix** - optional classifier before the sigil (e.g., `todo`, `fix`, `tldr`)
- **properties** - key:value pairs for structured metadata (e.g., `priority:high`)
- **note** - human-readable description
- **#hashtags** - open-namespace tags for classification

## Waymark Terminology

- **Waymark**: The entire comment structure containing the `:::` sigil
- **Sigil**: The `:::` separator that defines a waymark
- **Prefix**: Optional classifier before `:::` (limited namespace)
- **Properties**: Machine-readable key:value pairs after `:::`
- **Note**: Human-readable description (waymarks without prefix are pure notes)
- **Hashtags**: Classification tags prefixed with `#`

## Common Waymark Prefixes

### Work Prefixes

- `todo :::` - work to be done
- `fix :::` - bugs to fix (synonym: `fixme`)
- `done :::` - completed work
- `ask :::` - questions needing answers
- `review :::` - needs review
- `needs :::` - dependencies (synonyms: `depends`, `requires`)
- `chore :::` - routine maintenance tasks
- `hotfix :::` - urgent production patch
- `spike :::` - exploratory proof-of-concept work

### Lifecycle/Maturity Prefixes

- `stub :::` - skeleton/basic implementation
- `draft :::` - work in progress (synonym: `wip`)
- `stable :::` - mature/solid code
- `shipped :::` - deployed to production
- `good :::` - approved (synonyms: `lgtm`, `approved`)
- `bad :::` - not approved
- `hold :::` - work intentionally paused
- `stale :::` - work that has stagnated
- `cleanup :::` - code cleanup needed
- `remove :::` - scheduled deletion

### Alerts/Warnings Prefixes

- `warn :::` - warning
- `crit :::` - critical issue (synonym: `critical`)
- `unsafe :::` - dangerous code
- `caution :::` - proceed carefully
- `broken :::` - non-functional code
- `locked :::` - do not modify (synonym: `freeze`)
- `deprecated :::` - scheduled for removal
- `audit :::` - requires audit review
- `legal :::` - legal obligations
- `temp :::` - temporary code (synonym: `temporary`)
- `revisit :::` - flag for future reconsideration

### Information Prefixes

- `tldr :::` - brief summary (one per file at top)
- `summary :::` - code section summary
- `note :::` - general note (synonym: `info`)
- `thought :::` - thinking out loud
- `docs :::` - documentation reference
- `why :::` - explains reasoning
- `see :::` - cross-reference (synonyms: `ref`, `xref`)
- `example :::` - usage example

### Meta Prefixes

- `important :::` - important information
- `hack :::` - hacky solution
- `flag :::` - generic marker
- `pin :::` - pinned item
- `idea :::` - future possibility
- `test :::` - test-specific marker

## Property Keys and Patterns

### Core Property Keys

- **Assignment**: `assign:@person` or `attn:@person`
- **Priority**: `priority:high`, `priority:critical`
- **Dependencies**: `requires:package(version)`, `depends:service`
- **Issue tracking**: `fixes:#123`, `closes:#123`, `blocks:#123`
- **Lifecycle**: `deprecated:v2.0`, `since:v1.0`, `until:v3.0`
- **Files/paths**: `path:filename`, `affects:files`
- **Messages**: `message:"error text"`

### @Mentions

- Direct mentions in notes: `// ::: @alice please review`
- Assignment in todos: `// todo ::: @bob implement caching`
- Explicit assignment: `// todo ::: assign:@carol fix bug`

### Hashtags

- Open namespace for classification
- Can appear anywhere (prefer at end)
- Examples: `#security`, `#performance`, `#frontend`
- Hierarchical: `#auth/oauth`, `#security/a11y`
- **Note**: Numeric-only hashtags prohibited (conflicts with issue refs)

## Search Commands

Using ripgrep (rg) is the primary way to work with waymarks:

```bash
# Find all waymarks
rg ":::"

# Find by prefix
rg "todo :::"
rg "fix :::"
rg "warn :::"

# Find by properties
rg ":::.*priority:high"
rg ":::.*assign:@alice"

# Find by hashtags
rg "#security"
rg ":::.*#security"

# Find with context
rg -C2 "todo :::"  # 2 lines before/after

# Find in markdown (HTML comments)
rg "<!-- .*:::" --type md

# Extract assignees
rg -o "todo ::: .*@(\w+)" -r '$1' | sort | uniq -c

# Find high priority items
rg ".*::: .* priority:high"
```

## Current Repository Structure

```
waymark/
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
│   ├── syntax/          # Waymark syntax specification
│   │   ├── README.md    # Syntax overview
│   │   ├── SPEC.md      # Syntax specification
│   │   ├── CHANGELOG.md # Syntax version history
│   │   └── advanced/    # Deep-dive topics (delimiter semantics, etc.)
│   ├── tooling/         # Waymark tooling documentation
│   │   ├── ROADMAP.md   # Future tooling plans
│   │   └── CHANGELOG.md # Tooling version history
│   ├── project/         # Project specifications
│   │   ├── LANGUAGE.md  # Language guidelines for writing about waymark
│   │   └── specs/       # Version specifications
│   ├── examples.md      # Real-world usage
│   ├── syntax/advanced/advanced-patterns.md  # Complex scenarios
│   └── what-ifs.md      # AI-native vision
├── README.md            # Main documentation with links
├── CLAUDE.md            # AI agent instructions (this file)
└── llms.txt             # LLM-readable quick reference
```

### Additional Files

- `docs/project/syntax-revision.md` - Complete `:::` syntax specification
- `docs/project/syntax-emoji.md` - Future emoji support (not in v0.1)
- `docs/guides/search-patterns.md` - Comprehensive search guide

## Development Guidelines

1. **Incremental Approach**: We're building from documentation first, then simple ripgrep usage, before any complex tooling
2. **Preserve History**: The `archive/pre-rebuild-2025-01` branch contains all previous implementation work
3. **Focus on Clarity**: Documentation should clearly explain the waymark concept and its benefits
4. **Syntax Evolution**: Project is transitioning from `:M:` to `:::` sigil

## Future Tooling (Currently Archived)

The following packages exist in the archive branch and may be reintroduced:

- @waymark/core - Parser and validation library
- @waymark/cli - Command-line interface
- Additional integrations (ESLint, VS Code, etc.)

## Compatibility Notes

### Traditional Magic Comments
Waymarks work alongside existing TODO/FIXME patterns:

```javascript
// TODO ::: implement caching
// FIXME ::: memory leak here
// HACK ::: temporary workaround
```

### Progressive Adoption
1. Start with simple prefixes: `todo :::`, `fix :::`
2. Add properties as needed: `priority:high`, `assign:@alice`
3. Use hashtags for grouping: `#security`, `#frontend`
4. Pure notes for context: `// ::: this explains why`

## Best Practices for This Repository

### Using Waymarks

1. **Space before `:::`**: Required when prefix is present
2. **Delimiter rules**:
   - `:::` - the sigil that marks a waymark
   - `:` - creates key:value pairs
   - `()` - parameterizes a property
   - `[]` - groups multiple parameterized values
   - `#` - creates hashtags
   - `@` - creates mentions
3. **Line limits**: Keep under ~80-120 chars for readable grep output
4. **Be specific**: Use properties for machine-readable data, notes for descriptions
5. **Use HTML comments in markdown**: `<!-- tldr ::: summary -->` for non-rendered waymarks

### Contributing

When working on this project:

1. Always use conventional commits
2. Work on feature branches off main
3. Use waymarks with `:::` syntax in any new code
4. Focus on simplicity and grep-ability
5. Use ripgrep to verify waymark patterns before commits
6. Follow the `:::` sigil syntax (space before when prefix present)

### Pre-Push Quality Checks

**CRITICAL**: Before pushing any code:

1. **Run CI locally**: `pnpm ci:local` - This simulates the full CI pipeline
2. **Comprehensive check**: `pnpm check:all` - Includes temporary context detection
3. **Quick validation**: `pnpm ci:validate` - Tests, types, and build only
4. **Check for temp code**: `pnpm check:waymarks` - Ensures no `temp :::` or `tmp :::` waymarks

The pre-push hook will automatically run these checks, but running them manually first saves time.

### Documentation Standards

- All markdown files should have `<!-- tldr ::: <short description> -->` at the top
- Use contextual waymarks like `<!-- note ::: <description> -->` or `<!-- summary ::: <description> -->`
- Keep documentation focused and scannable
- Link related docs for navigation
- No prefix = pure note (e.g., `<!-- ::: this explains the context -->`)

### Examples

```javascript
// Basic waymarks
// todo ::: implement validation
// fix ::: memory leak in auth handler
// tldr ::: handles user authentication

// With properties and hashtags
// todo ::: priority:high implement caching #performance
// warn ::: validates all inputs #security

// Pure notes (no prefix)
// ::: this is a performance hotpath
// ::: assumes UTC timestamps

// With mentions
// todo ::: @alice implement OAuth flow
// ::: @bob please review this approach

// Issue references
// todo ::: fixes:#234 implement auth flow
// done ::: closes:#456 added validation
```
