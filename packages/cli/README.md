# @grepa/cli

Command-line interface for managing grep-anchors.

## Installation

```bash
npm install -g @grepa/cli
# or
pnpm add -g @grepa/cli
```

## Commands

### `grepa list`

List unique anchor tokens in your codebase.

```bash
# List all tokens
grepa list

# Show token counts
grepa list --count

# Output as JSON
grepa list --json
```

### `grepa grep <pattern>`

Search for anchors matching a pattern.

```bash
# Find security anchors
grepa grep sec

# Show only file names
grepa grep todo --files

# Output as JSON
grepa grep perf --json
```

### `grepa lint`

Enforce anchor policies defined in `.grepa.yml`.

```bash
# Run default lint rules
grepa lint

# Forbid specific tokens
grepa lint --forbid temp debug

# Set maximum age
grepa lint --max-age 90

# CI mode (exit 1 on violations)
grepa lint --ci
```

### `grepa stats`

Show anchor statistics and distributions.

```bash
# Show all stats
grepa stats

# Show top 10 tokens
grepa stats --top 10

# Filter by version
grepa stats --since v2.0

# Output as JSON
grepa stats --json
```

### `grepa format`

Convert TODO/FIXME comments to grep-anchors.

```bash
# Convert all TODO/FIXME
grepa format

# Preview changes
grepa format --dry-run

# Specify comment style
grepa format --comment-style hash
```

## Configuration

Create `.grepa.yml` in your project root:

```yaml
anchor: ":ga:"

files:
  include:
    - "**/*.ts"
    - "**/*.js"
  exclude:
    - "**/node_modules/**"

lint:
  forbid: ["temp", "debug"]
  maxAgeDays: 90

dictionary:
  tldr: "Brief summary"
  sec: "Security code"
  perf: "Performance"
```

## Global Options

- `--anchor <sigil>` - Override the anchor sigil (default: `:ga:`)

## Integration

### Pre-commit Hook

```bash
#!/bin/bash
grepa lint --ci || exit 1
```

### GitHub Actions

```yaml
- name: Lint grep-anchors
  run: |
    npm install -g @grepa/cli
    grepa lint --ci
```

## License

MIT