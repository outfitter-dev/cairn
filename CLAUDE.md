<!-- ::: tldr Claude Code configuration and development guidelines -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

About you: @.ai/prompts/MAX.md

## Project Overview

The Waymark CLI provides tooling for **waymarks** - a standardized way to mark important code locations using the `:::` sigil in comments. This allows both humans and AI agents to quickly find relevant code sections using simple grep commands.

## Quick Reference for Claude

### Most Common Patterns I'll Use
```javascript
// todo ::: implement feature              // Work to do
// fix ::: bug description                 // Bugs to fix
// ::: important context here              // Pure notes (no marker)
// alert ::: security issue +security      // Alerts with tags (+ not #)
// todo ::: @agent write tests             // AI delegation
// temp ::: remove after deploy            // Temporary code
// !todo ::: critical bug fix              // Signal for urgency
// deprecated ::: use newMethod() instead  // Lifecycle marker
```

### Key Search Commands
```bash
rg ":::"                    # Find all waymarks
rg "todo :::"               # Find todos
rg ":::.*@agent"            # Find AI tasks
rg -C2 "alert :::"          # Show context for alerts
rg "<!-- .*:::" --type md   # In markdown
rg "!{1,2}todo :::"         # Find urgent/critical todos
rg "\b(hotpath|mem|io) :::" # Performance markers
```

## Important Notes

- This repository uses waymarks with the `:::` sigil. Use @llms.txt for how to use.
- The project is transitioning from `:M:` to `:::` syntax
- **SPACE BEFORE `:::`** is required when prefix is present!

## Core Concept

The waymark pattern: `[comment-leader] [signal][marker] ::: [@actor] [properties] [note] [+tags]`

### Key Syntax Rules

1. **Space before `:::`**: ALWAYS required when prefix is present
   - ✅ `// todo ::: implement validation`
   - ❌ `// todo::: implement validation`
   
2. **The `:::` sigil**: Core waymark identifier (three colons)
   - With prefix: `todo :::`, `fix :::`, `warn :::`
   - Pure note (no prefix): `// ::: important context here`

3. **Components**:
   - **signal** - optional urgency/emphasis symbol (!, ?, *, etc.)
   - **marker** - classifier from fixed namespace (~41 total)
   - **actor** - @mention if first after :::
   - **properties** - key:value pairs for structured metadata
   - **note** - human-readable description
   - **+tags** - classification tags (use + not #)
   - **@mentions** - people or entity references

## Waymark Terminology

- **Waymark**: The entire comment structure containing the `:::` sigil
- **Sigil**: The `:::` separator that defines a waymark
- **Marker**: Optional classifier before `:::` (limited namespace)
- **Signal**: Optional symbol modifying the marker (!, ?, *, ^, etc.)
- **Properties**: Machine-readable key:value pairs after `:::`
- **Note**: Human-readable description (waymarks without prefix are pure notes)
- **Tags**: Classification tags prefixed with `+`
- **Pure Note**: Waymark with no marker: `// ::: this explains the context`

## Common Waymark Prefixes

### Essential Patterns (Start Here!)

1. **`todo :::`** - Work that needs doing
2. **Pure note `:::`** - Important assumptions or constraints (no marker)
3. **`alert :::`** - General warning or attention needed
4. **`risk :::`** - Potential risk or concern
4. **`@mentions`** - AI agent instructions
5. **`temp :::`** - Temporary code to remove

### Work Markers (`--is work`)

- `todo :::` - work to be done
- `fix :::` - bugs to fix
- `done :::` - completed work
- `review :::` - needs review
- `refactor :::` - code that needs restructuring
- `needs :::` - dependencies or requirements
- `blocked :::` - work blocked by external dependency

### State & Lifecycle Markers (`--is state`)

- `temp :::` - temporary code
- `deprecated :::` - scheduled for removal
- `draft :::` - work in progress
- `stub :::` - skeleton/basic implementation
- `cleanup :::` - code cleanup needed

### Alert Markers (`--is alert`)

- `alert :::` - general warning or attention needed
- `risk :::` - potential risk or concern
- `notice :::` - important information to be aware of
- `always :::` - always-on marker (e.g. `always ::: @ai review for pii leaks`)

### Information & Documentation Markers (`--is info`)

- `tldr :::` - brief summary (ONLY one per file at top, `**tldr :::` for canonical entry)
- `note :::` - general note
- `summary :::` - code section summary
- `example :::` - usage example
- `idea :::` - future possibility
- `about :::` - explains purpose or context
- `docs :::` - documentation for this code

### Quality & Process Markers (`--is quality`)

- `test :::` - test-specific marker
- `audit :::` - requires audit review
- `check :::` - needs verification
- `lint :::` - intentional lint overrides/suppressions
- `ci :::` - CI/CD related markers

### Performance Markers (`--is performance`)

- `perf :::` - general performance concern (search alias)
- `hotpath :::` - tight loops/latency hot-paths
- `mem :::` - memory-sensitive or allocation hotspots
- `io :::` - disk/network throughput critical sections

### Security & Access Markers (`--is security`)

- `sec :::` - general security requirements (search alias)
- `auth :::` - authentication/authorization specific
- `crypto :::` - cryptography-specific requirements
- `a11y :::` - accessibility requirements/issues

### Meta & Special Markers (`--is meta`)

- `flag :::` - feature flag marker
- `important :::` - important information
- `hack :::` - hacky solution
- `legal :::` - legal/compliance requirements
- `must :::` - must-hold requirements (use with `^` for critical)
- `assert :::` - invariants that must hold true

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

### Tags

- Open namespace for classification
- Can appear anywhere (prefer at end)
- Examples: `+security`, `+performance`, `+frontend`
- Hierarchical: `+auth/oauth`, `+security/a11y`
- **Note**: Use `+` for tags, not `#` (hashtag reserved for issue refs)

## Search Commands (Critical for AI Navigation!)

Using ripgrep (rg) is the primary way to work with waymarks:

### Most Important Searches

```bash
# Find all waymarks
rg ":::"

# Find work to do
rg "todo :::"
rg "fix :::"

# Find context (pure notes)
rg "^[^:]*:::" --type-not md  # Pure notes in code
rg "// :::"                   # Pure notes in JS/TS/C/etc
rg "# :::"                    # Pure notes in Python/Ruby/etc

# Find AI tasks
rg ":::.*@agent"
rg ":::.*@claude"
rg "@alice" | rg ":::"        # Specific person's tasks
```

### Search with Context

```bash
# Show surrounding code
rg -C2 "todo :::"             # 2 lines before/after
rg -B3 -A1 "warn :::"         # 3 before, 1 after

# Find related waymarks nearby
rg -B5 -A5 ":::" | rg -C2 "cache"  # Find waymarks near "cache" mentions
```

### Property and Hashtag Searches

```bash
# By properties
rg ":::.*priority:high"
rg ":::.*assign:@alice"
rg ":::.*deprecated:"

# By tags
rg "\+security"
rg ":::.*\+security"
rg ":::.*\+critical.*\+security"  # Multiple tags

# Extract specific data
rg -o "todo ::: .*@(\w+)" -r '$1' | sort | uniq -c  # Count by assignee
rg -o "priority:(\w+)" -r '$1' | sort | uniq -c      # Count by priority
```

### File and Language Specific

```bash
# In markdown (HTML comments)
rg "<!-- .*:::" --type md
rg "<!-- tldr :::" --type md   # Find file summaries

# JavaScript/TypeScript
rg "// .*:::" -g "*.{js,ts,jsx,tsx}"

# Python
rg "# .*:::" -g "*.py"

# Find files with most todos
rg -c "todo :::" | sort -t: -k2 -nr | head -10
```

## Current Repository Structure

```text
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
3. Use tags for grouping: `+security`, `+frontend`
4. Pure notes for context: `// ::: this explains why`

## Delimiter Semantics (Important!)

Each delimiter has a specific purpose:

- **`:::`** - The sigil that marks a waymark (always with space before when prefix present)
- **`:`** - Creates key:value pairs for properties
- **`()`** - Parameterizes a property value
- **`[]`** - Groups multiple parameterized values
- **`+`** - Creates tags (hierarchical allowed: `+security/input`)
- **`#`** - Reserved for issue references only
- **`@`** - Creates mentions for people/entities
- **`" "`** - Quotes values with spaces/special chars

## Best Practices for This Repository

### Critical Rules

1. **Space before `:::`**: ALWAYS required when prefix is present
   - ✅ `// todo ::: implement feature`
   - ❌ `// todo::: implement feature`

2. **Pure notes for context**: Use waymarks without prefixes liberally
   - `// ::: this function is called 1000x per second`
   - `// ::: all prices are in cents, not dollars`
   - `// ::: depends on external auth service`

3. **AI-first patterns**: Make waymarks discoverable by AI agents
   - Use `@agent`, `@claude`, etc. for delegation
   - Provide context with pure notes near todos
   - Be explicit about constraints and assumptions

### Writing Effective Waymarks

1. **Be specific**: Use properties for machine-readable data, notes for human context
2. **Line limits**: Keep under ~80-120 chars for readable grep output  
3. **Separate concerns**: Multiple focused waymarks > one overloaded waymark
4. **Use HTML comments in markdown**: `<!-- tldr ::: summary -->` for non-rendered waymarks
5. **Start simple**: Begin with basic patterns, add complexity only when needed

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

## Signal Modifiers (New!)

Signals modify the urgency/emphasis of markers:

| Symbol | Name | Meaning |
|--------|------|----------|
| `!` / `!!` | Bang / Double-bang | `!` critical · `!!` blocker/show-stopper |
| `?` / `??` | Question / Double-question | `?` needs clarification · `??` highly uncertain |
| `*` / `**` | Star / Double-star | `*` bookmark · `**` canonical entry point |
| `~` | Tilde | Experimental / unstable |
| `^` | Caret | Protected / hazardous – senior review required |
| `-` / `--` | Tombstone / Instant-prune | `-` mark for removal · `--` prune ASAP |
| `_` | Underscore | Ignore marker (reserved for future functionality) |

Examples:
```javascript
// !todo ::: migrate to new hashing algo
// ?note ::: does pagination handle zero items?
// *tldr ::: core event-loop entry point
// !!sec ::: patch data-loss vulnerability
// **tldr ::: canonical docs landing page
// ^must ::: array length must be power of two
// -todo ::: obsolete after migrating to v5 SDK
```

### Documentation Standards

- All markdown files should have `<!-- tldr ::: <short description> -->` at the top
- Use contextual waymarks like `<!-- note ::: <description> -->` or `<!-- summary ::: <description> -->`
- Keep documentation focused and scannable
- Link related docs for navigation
- No prefix = pure note (e.g., `<!-- ::: this explains the context -->`)

### Examples

#### Basic Waymarks
```javascript
// Work items
// todo ::: implement validation
// fix ::: memory leak in auth handler
// done ::: added rate limiting

// Pure notes (critical for context!)
// ::: all timestamps are UTC
// ::: user_ids are UUIDs, not integers
// ::: this is a performance hotpath
```

#### AI Agent Patterns
```javascript
// Direct delegation
// todo ::: @agent implement error handling
// todo ::: @claude add comprehensive tests
// todo ::: @cursor optimize this function

// With specific instructions
// todo ::: @agent use async/await pattern, not callbacks
// todo ::: @agent priority:high add TypeScript types throughout

// Review requests
// review ::: @ai check for security vulnerabilities
// ::: @alice please review this approach
```

#### Properties and Metadata
```javascript
// Priority levels
// todo ::: priority:critical system down
// todo ::: priority:high major bug
// fix ::: priority:medium performance issue

// Assignment and ownership  
// todo ::: assign:@alice implement OAuth
// review ::: attn:@bob,@carol security review needed

// Lifecycle markers
// deprecated ::: use newMethod() instead
// temp ::: remove after Chrome 120 ships
// stub ::: basic implementation, needs completion

// Signals for urgency
// !todo ::: critical bug fix
// !!alert ::: security vulnerability
// ?note ::: needs clarification
// ^must ::: protected requirement
```

#### Issue Integration
```javascript
// Issue references
// todo ::: fixes:#234 implement auth flow
// done ::: closes:#456 added validation
// fix ::: blocked-by:#123 waiting on API changes
```

#### Tags for Organization
```javascript
// Single tags
// todo ::: implement caching +performance
// alert ::: validate inputs +security

// Multiple tags
// fix ::: button contrast +critical +frontend +a11y
// todo ::: optimize query +backend +database +performance

// Hierarchical tags
// alert ::: input validation +security/input
// todo ::: add unit tests +testing/unit
```

#### Advanced Patterns
```javascript
// Parameterized properties
// todo ::: requires:node(>=16) upgrade dependencies
// ::: supports:browsers(chrome,firefox,safari)
// fix ::: affects:versions(1.0-2.5) security patch

// Grouped parameters
// todo ::: requires:[npm(>=8),node(16,18,20)] upgrade tooling

// Multiple properties
// todo ::: assign:@alice priority:high deadline:2024-03-01 implement feature
```

#### Markdown (HTML Comments)
```markdown
<!-- tldr ::: API documentation for user service -->
<!-- todo ::: @galligan add authentication examples -->
<!-- alert ::: breaking changes in v2.0 -->
<!-- ::: assumes REST API knowledge -->
```
