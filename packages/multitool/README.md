# @waymarks/multitool

A comprehensive CLI tool for managing waymarks in your codebase. This tool provides commands for auditing waymark syntax compliance, automatically fixing violations, checking TLDR quality, and migrating legacy waymark syntax.

## Installation

```bash
# From the waymark repository root
pnpm install
pnpm build
```

## Usage

The multitool must be run from your project root directory (where the files you want to analyze are located).

```bash
# From your project root
node path/to/waymark/packages/multitool/dist/index.js <command> [options]

# Or use the shorthand (if linked)
wm <command> [options]
```

## Commands

### audit

Analyze waymarks for v1.0 syntax compliance and quality issues.

```bash
wm audit [options]
```

**Options:**
- `--json` - Output results as JSON for tooling integration
- `--legacy` - Show only v1.0 syntax violations (simplified output)
- `-v, --verbose` - Show detailed output with waymark content
- `--filter <types...>` - Filter content types (e.g., official, deprecated)
- `--pattern <patterns...>` - File glob patterns to scan
- `--file <files...>` - Specific file paths to audit
- `--test` - Scan only test files (scripts/tests/**/*.md)

**Examples:**
```bash
# Audit entire codebase
wm audit

# Show only violations in legacy format
wm audit --legacy

# Audit specific files with verbose output
wm audit --file src/main.js --verbose

# Output as JSON for CI/CD integration
wm audit --json > audit-results.json

# Audit only documentation files
wm audit --pattern "docs/**/*.md"
```

### blaze

Automatically tag waymark violations found by audit, or remove existing tags.

```bash
wm blaze [options]
```

**Options:**
- `-n, --dry-run` - Preview changes without modifying files
- `-y, --yes` - Required flag to actually modify files
- `--report [path]` - Generate a JSON report of changes (saves to .waymark/logs/ by default)
- `--tag-prefix <prefix>` - Override tag prefix (default: "wm")
- `--reset [pattern]` - Remove tags matching pattern:
  - `--reset` or `--reset wm` - Remove #wm:* tags (except #wmi:*)
  - `--reset all` - Remove ALL tags
  - `--reset wm:fix` - Remove only #wm:fix/* tags
  - `--reset custom` - Remove #custom:* tags
- `--test` - Process only test files
- `--pattern <patterns...>` - File glob patterns
- `--file <files...>` - Specific file paths
- `-v, --verbose` - Show detailed output

**Examples:**
```bash
# Preview what would be tagged
wm blaze --dry-run

# Actually apply tags (requires --yes)
wm blaze --yes

# Apply tags with custom prefix and generate report
wm blaze --tag-prefix wmi --yes --report

# Remove all wm: tags
wm blaze --reset --yes

# Remove specific tag types
wm blaze --reset wm:fix --yes --dry-run

# Process only specific files
wm blaze --file src/auth.js src/api.js --yes
```

### tldr-check

Analyze TLDR waymarks for quality and completeness.

```bash
wm tldr-check [options]
```

**Options:**
- `--json` - Output as JSON for tooling
- `--require <items...>` - Require specific elements:
  - `tags` or `tag` - Require at least one #tag
  - `anchors` or `anchor` - Require ##canonical-anchor
- `--min-tags <n>` - Require minimum number of tags
- `--strict` - Enable all quality checks
- `-v, --verbose` - Show detailed suggestions
- `--file <files...>` - Specific files to check
- `--pattern <patterns...>` - File glob patterns
- `--test` - Check only test files

**Examples:**
```bash
# Basic TLDR analysis
wm tldr-check

# Require tags and anchors
wm tldr-check --require tags anchors

# Strict mode with minimum 2 tags
wm tldr-check --strict --min-tags 2

# Check specific directory
wm tldr-check --pattern "src/**/*.js"
```

### migrate

Migrate legacy waymark syntax to v1.0 format.

```bash
wm migrate [options]
```

**Options:**
- `-n, --dry-run` - Preview migrations without modifying files
- `-y, --yes` - Required flag to actually modify files
- `-d, --direction <dir>` - Migration direction:
  - `forward` - Legacy to v1.0 (default)
  - `backward` - v1.0 to legacy
- `--file <files...>` - Specific files to migrate
- `--pattern <patterns...>` - File glob patterns
- `-v, --verbose` - Show detailed migration info

**Examples:**
```bash
# Preview migration
wm migrate --dry-run

# Migrate all files to v1.0
wm migrate --yes

# Migrate specific files
wm migrate --file legacy/old.js --yes

# Backward migration (v1.0 to legacy)
wm migrate --direction backward --yes
```

## Configuration

### Project Configuration

Create `.waymark/multitool.json` for project-specific settings:

```json
{
  "blaze": {
    "tagPrefix": "wmi"  // Use wmi: instead of wm: for tags
  }
}
```

### Ignore Patterns

The multitool respects ignore patterns from:
1. `.gitignore` - Standard git ignore patterns
2. `.waymarkignore` - Waymark-specific ignore patterns
3. `.waymark/config.json` - Advanced ignore configuration

## Violation Types

The audit command detects these v1.0 syntax violations:

- **legacy-plus-tag**: Old `+tag` syntax → use `#tag`
- **property-priority**: `priority:high` → use `!marker`
- **missing-ref-hash**: `#fixes:123` → use `#fixes:#123`
- **hierarchical-tag**: Discouraged `#auth/login` in tags
- **array-with-spaces**: `#cc:@a, @b` → use `#cc:@a,@b`
- **misplaced-actor**: `@user` not in valid position
- **deprecated-marker**: `alert` → use `notice`
- **all-caps-marker**: `TODO` → use `todo`
- **marker-misplaced**: `::: todo` → use `todo :::`
- **multiple-ownership-tags**: Multiple `#owner:` tags
- **multiple-cc-tags**: Multiple `#cc:` tags
- **non-blessed-property**: `custom:value` → use `#custom:value`
- **legacy-blessed-property**: Old properties like `reason:`

## Integration

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check for waymark violations
node path/to/waymark/packages/multitool/dist/index.js audit --legacy
if [ $? -ne 0 ]; then
  echo "Waymark violations found. Run 'wm audit' for details."
  exit 1
fi
```

### CI/CD Pipeline

```yaml
# GitHub Actions example
- name: Check Waymark Syntax
  run: |
    node packages/multitool/dist/index.js audit --json > audit.json
    if [ -s audit.json ] && [ "$(cat audit.json)" != "[]" ]; then
      echo "Waymark violations found:"
      cat audit.json
      exit 1
    fi
```

## Development

```bash
# Install dependencies
pnpm install

# Build TypeScript
pnpm build

# Watch mode for development
pnpm dev

# Run tests
pnpm test
```

## Architecture

The multitool is built with:
- **TypeScript** for type safety and better developer experience
- **Commander.js** for robust CLI interface
- **Unified spec system** via waymark-spec.json
- **Modular commands** for easy extension
- **Shared libraries** for file finding, ignore patterns, and spec loading

## Future Enhancements

- [ ] Interactive mode for selective fixes
- [ ] Undo functionality using blaze reports
- [ ] Performance metrics for large codebases
- [ ] VSCode extension integration
- [ ] Custom rule configuration
- [ ] Waymark statistics and analytics