# Grepa Documentation

Welcome to the comprehensive documentation for **grepa** (grep-anchor).

## Documentation Structure

- **[Syntax Reference](syntax.md)** - Complete grep-anchor syntax specification
- **Tag Guides**
  - [Version Tags](tags/version.md) - Version tracking patterns
  - [Priority Tags](tags/priority.md) - Priority and urgency patterns
  - [Task Tags](tags/tasks-todos-issues.md) - Task and issue tracking
  - [Namespace Reference](tags/namespace.md) - Standard tags and aliases
- **About**
  - [Prior Art & Inspiration](about/priors.md) - Historical context and influences
- **[Examples](examples.md)** - Real-world usage patterns

## CLI Usage

The `grepa` CLI uses a verb-first interface with implicit `find` as the default command.

### Command Model

```
USAGE  grepa [<GLOBAL FLAGS>] <verb> [<LOCAL FLAGS>]
```

**Primary verbs:**
- `find` (implicit default) - Search anchors
- `list` - Enumerate unique tags
- `report` (alias `stats`) - Analytical reports
- `lint` - Policy enforcement
- `format` - Anchor rewriting
- `watch` - Live monitoring

### Default Command: Find

```bash
# Simple pattern search - find is implicit!
grepa sec                    # Find security anchors
grepa todo                   # Find todos  
grepa fix sec               # Find anchors with BOTH fix AND sec
grepa "fix, sec"            # Same as above (comma + quotes)
grepa fix | sec             # Find anchors with EITHER fix OR sec
grepa find fix sec --any    # Same as above (--any flag)

# Explicit verb form
grepa find sec -C 3         # Explicit verb
grepa sec -C 3              # Implicit verb (same result)

# Smart aliases - search for concepts
grepa security              # Expands to: sec, security, auth, crypto
grepa performance           # Expands to: perf, performance, optimize, slow
grepa bug                   # Expands to: fix, bug, fixme, broken

# Inline negation
grepa sec '!fix'            # Security anchors but NOT fix (quoted bang)
grepa todo '!@alice'        # TODOs not assigned to alice

# Value filters
grepa todo=*                # Any todo with a value
grepa todo=T-123            # Exact value match
grepa todo!=T-123           # Value NOT equal to T-123
grepa blocks~=T-123         # Array membership check
grepa version~/^v2\./       # Regex match
grepa {type}=security       # JSON field match
grepa config={*}            # Has JSON payload
grepa *=T-123              # Any tag with value T-123
grepa *={*}                # Any tag with JSON payload
```

### Advanced Search Features

```bash
# Context display (grep-compatible)
grepa -C 3 sec              # 3 lines of context
grepa -B 2 -A 2 todo        # 2 before, 2 after

# Output control (global flags BEFORE verb)
grepa --files find sec      # List files only
grepa --json find api       # JSON output
grepa --pretty find todo    # Force pretty output

# Case and content (ripgrep compatibility)
grepa -i TODO               # Case insensitive (pass-through to rg)
grepa -w todo               # Word boundaries (pass-through to rg)

# Interactive features  
grepa find todo --interactive  # Fuzzy picker (local to find)
grepa find test --interactive  # Interactive selection

# Negation options
grepa sec '!fix'            # Bang prefix (quoted)
grepa todo!=T-123           # Value mismatch
grepa --not temp find sec   # Verbose form (global)
```

### Other Commands

#### `grepa list` - List unique tags
```bash
grepa list                  # List all unique tags
grepa list --count          # Show usage counts
grepa list --by-file        # Group by file
grepa list todo sec         # List only these tags
```

#### `grepa report` (alias: `stats`) - Tag analytics
```bash
grepa report                # Tag distribution
grepa report --top 10       # Most used tags
grepa report --chart        # ASCII visualization
grepa report p0 p1          # Stats for specific tags

# Legacy alias still works
grepa stats --top 10        # Same as report
```

#### `grepa lint` - Enforce policies  
```bash
grepa lint                  # Run configured rules
grepa lint --fix            # Auto-fix issues
grepa lint --rules temp     # Lint specific rules
grepa lint --ci              # CI mode (local flag)
```

#### `grepa format` - Transform anchors
```bash
grepa format                # Interactive anchor formatting
grepa format --style v2     # Apply specific style
grepa format --dry-run      # Preview changes
grepa format --yes          # Skip confirmation (local)
```

#### `grepa watch` - Live monitoring
```bash
grepa watch                 # Watch all changes
grepa watch sec p0          # Watch specific tags
grepa watch --exec "..."    # Run command on change
grepa watch --notify        # Desktop notifications (local)
```

#### `grepa init` - Initialize project
```bash
grepa init                  # Interactive setup
grepa init --anchor todo    # Custom anchor
grepa init --preset node    # Use preset config
```

### Flag Scoping Rules

Global flags must come BEFORE the verb, local flags AFTER:

```bash
# USAGE: grepa [<GLOBAL FLAGS>] <verb> [<LOCAL FLAGS>]

# Examples - correct placement
grepa --json --files find sec     # JSON output + files only (global)
grepa --quiet lint --ci           # Suppress output + CI mode
grepa format --yes                # Confirm rewrite (local to format)
grepa find sec --any              # OR logic (local to find)

# Wrong placement will error
grepa find --json sec             # ❌ --json must be global
grepa --fix lint                  # ❌ --fix must be local
grepa --any find sec              # ❌ --any must be after verb
```

### Flag-placement Reference

| Flag (short / long)                  | Applies to | Scope      | Notes                                      |
| ------------------------------------ | ---------- | ---------- | ------------------------------------------ |
| `-C N` / `--context N`               | all verbs  | **Global** | grep-style surrounding lines               |
| `-l` / `--files`                     | all verbs  | **Global** | list only filenames                        |
| `-j` / `--json`                      | all verbs  | **Global** | one JSON line per match                    |
| `-p` / `--pretty` (`--color` alias)  | all verbs  | **Global** | colour / table when TTY                    |
| `-q` / `--quiet`                     | all verbs  | **Global** | suppress normal output, rely on exit-code  |
| `--literal` / `--no-aliases`         | all verbs  | **Global** | turn off synonym expansion                 |
| `--raw`                              | all verbs  | **Global** | plain `file:line:anchor` lines even on TTY |
| `-v` / `--not PATTERN`               | all verbs  | **Global** | logical NOT (line-level)                   |
| `--exit-code N`                      | all verbs  | **Global** | override 0/1/2 convention                  |
| `--help`                             | CLI        | **Global** | static cheat-sheet                         |
| `--version`                          | CLI        | **Global** | prints semantic version                    |

#### Verb-specific (local) flags

| Verb                 | Flag(s)                                                  | Scope     | Purpose                                      |
| -------------------- | -------------------------------------------------------- | --------- | -------------------------------------------- |
| **find**             | `--any` (OR logic) • `--interactive` (fuzzy picker)     | **Local** | refine search behaviour / UI                 |
| **list**             | `--count` • `--tree`                                     | **Local** | show usage counts / tree viz                 |
| **report** (`stats`) | `--chart` • `--top N` • `--count` • `--diff <rev>`      | **Local** | analytics & visualisation                    |
| **lint**             | `--fix` • `--ci`                                         | **Local** | auto-fix & CI-strict mode                    |
| **format**           | `--dry-run` (default) • `-y` / `--yes` • `--interactive`| **Local** | rewrite anchors with or without confirmation |
| **watch**            | `--notify`                                               | **Local** | desktop / OSC 133 notifications              |

*Nothing lives in "both" scopes - every flag is either global or verb-local to maintain the simple ordering rule.*

### Pattern Matching Logic

Multi-pattern rules:
- **Comma or spaces** → AND
- **Pipe `|` or `--any` flag** → OR
- Parentheses for grouping; precedence: AND > OR

#### AND Logic (Default)
```bash
grepa fix sec               # Spaces = AND
grepa "fix, sec"            # Commas = AND  
grepa fix,sec               # No quotes needed for simple patterns
```

#### OR Logic  
```bash
grepa fix | sec             # Pipe = OR
grepa find fix sec --any    # --any flag = OR (local to find)
grepa "fix|sec"             # Quoted pipe = OR
```

#### Complex Patterns
```bash
grepa "(fix,sec)|temp"      # (fix AND sec) OR temp
grepa fix sec | todo hack   # (fix AND sec) OR (todo AND hack)
grepa p=0 '!temp' owner=@me # p0 AND NOT temp AND owned by me
```

### Help & Discoverability

```bash
grepa --help                # Command-line help (non-interactive)
grepa help                  # Interactive TUI help
grepa help tips             # Random pro-tips  
grepa learn                 # Guided tutorial
grepa help llms             # 10-line LLM primer
```

### Why grepa is better than grep/ripgrep alone:

1. **Semantic Search**: Understands anchor structure and token relationships
2. **Smart Aliases**: `grepa security` finds sec, auth, crypto automatically  
3. **Value Filters**: Search by priority, owner, version with operators
4. **Logical Patterns**: AND/OR logic with intuitive syntax
5. **Rich Output**: Syntax highlighting, context, interactive selection
6. **Editor Integration**: `--open` to jump directly to matches
7. **Policy Enforcement**: Built-in linting with auto-fix
8. **Live Updates**: Watch mode with custom actions

### Configuration

Create a `.grepa.yml` file in your project root:

```yaml
# :ga:tldr Grepa configuration
anchor: ":ga:"  # Override the default anchor

files:
  include:
    - "**/*.ts"
    - "**/*.js"
  exclude:
    - "**/node_modules/**"
    - "**/dist/**"

lint:
  forbid: ["temp", "debug"]  # Blocked in CI
  maxAgeDays: 90
  versionField: "since"

dictionary:
  tldr: "Brief function/module summary"
  sec: "Security-critical code"
  perf: "Performance hotspot"
  temp: "Temporary hack"
  todo: "Future work"
```

### Pre-commit Hooks

Use the provided hooks to enforce policies:

```bash
# Install hooks
cp scripts/hooks/grepa-lint.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# Or use with Husky
npx husky add .husky/pre-commit "scripts/hooks/grepa-lint.sh"
```

