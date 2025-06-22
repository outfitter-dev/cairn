<!-- tldr ::: ##multitool comprehensive waymark CLI for syntax compliance, tagging, and migration #tooling #cli -->

# Waymark Multitool

The waymark multitool is a comprehensive TypeScript-based CLI for managing waymarks in your codebase. It provides commands for auditing syntax compliance, automatically fixing violations, checking documentation quality, and migrating legacy syntax.

## Overview

The multitool consolidates all waymark development tools into a single, type-safe package:

- **`wm audit`**: Analyze waymarks for v1.0 syntax compliance
- **`wm blaze`**: Automatically tag violations or remove existing tags
- **`wm tldr-check`**: Analyze TLDR waymark quality
- **`wm migrate`**: Migrate between waymark syntax versions

## Installation

<!-- notice ::: the multitool is part of the waymark monorepo -->

```bash
# From the waymark repository root
pnpm install
pnpm build

# The multitool binary will be available at:
# packages/multitool/dist/index.js
```

## Usage

The multitool must be run from your project root directory (where the files you want to analyze are located).

```bash
# Using the full path
node path/to/waymark/packages/multitool/dist/index.js <command> [options]

# Or if linked/installed globally
wm <command> [options]
```

## Commands

### audit

<!-- about ::: ##multitool/audit comprehensive waymark syntax compliance checking -->

Analyze waymarks for v1.0 syntax compliance and quality issues.

```bash
wm audit [options]
```

**Options:**
| Flag | Description |
|------|-------------|
| `--json` | Output results as JSON for tooling integration |
| `--legacy` | Show only v1.0 syntax violations (simplified output) |
| `-v, --verbose` | Show detailed output with waymark content |
| `--filter <types...>` | Filter content types (official, deprecated, unknown, examples) |
| `--pattern <patterns...>` | File glob patterns to scan |
| `--file <files...>` | Specific file paths to audit |
| `--test` | Scan only test fixture files |

**Examples:**
```bash
# Audit entire codebase
wm audit

# Show only violations in legacy format (for CI/CD)
wm audit --legacy

# Audit specific files with verbose output
wm audit --file src/main.js src/api.js --verbose

# Output as JSON for tooling
wm audit --json > audit-results.json

# Audit only documentation files
wm audit --pattern "docs/**/*.md"

# Filter to show only deprecated markers
wm audit --filter deprecated --verbose
```

#### Violation Types Detected

<!-- notice ::: all violations are automatically detectable and taggable by blaze -->

| Type | Description | Example Fix |
|------|-------------|-------------|
| `legacy-plus-tag` | Old `+tag` syntax | `+security` → `#security` |
| `property-priority` | Property-based priority | `priority:high` → `!marker` |
| `missing-ref-hash` | Missing `#` in references | `fixes:123` → `#fixes:#123` |
| `hierarchical-tag` | Discouraged hierarchical tags | `#auth/oauth` (warn only) |
| `array-with-spaces` | Spaces in tag arrays | `#cc:@a, @b` → `#cc:@a,@b` |
| `misplaced-actor` | Actors in wrong position | `@user` not first or in relational |
| `deprecated-marker` | Old marker names | `alert` → `notice`, `fix` → `fixme` |
| `all-caps-marker` | All-caps markers | `TODO` → `todo` |
| `marker-misplaced` | Marker after `:::` | `::: todo` → `todo :::` |
| `multiple-ownership-tags` | Multiple `#owner:` tags | Use single `#owner:` |
| `multiple-cc-tags` | Multiple `#cc:` tags | Use single `#cc:` with array |
| `non-blessed-property` | Properties without `#` | `custom:value` → `#custom:value` |
| `legacy-blessed-property` | Old blessed properties | `reason:text` → deprecated |

#### Comment Pattern Support

The audit command recognizes waymarks in comments for 40+ file types:

- **JavaScript/TypeScript**: `.js`, `.ts`, `.tsx`, `.jsx`, `.vue`, `.svelte`
- **Markup/Config**: `.md`, `.html`, `.xml`, `.yaml`, `.toml`, `.ini`
- **Shell**: `.sh`, `.bash`, `.zsh`, `.fish`
- **Backend**: Python, Ruby, PHP, Go, Rust, Java, C#, Swift, etc.
- **Other**: SQL, Lua, Elixir, Clojure, R, and more

### blaze

<!-- about ::: ##multitool/blaze automated violation tagging and tag removal system -->

Automatically tag waymark violations found by audit, or remove existing tags.

```bash
wm blaze [options]
```

**Options:**
| Flag | Description |
|------|-------------|
| `-n, --dry-run` | Preview changes without modifying files |
| `-y, --yes` | **Required** flag to actually modify files |
| `--report [path]` | Generate a JSON report (saves to .waymark/logs/ by default) |
| `--tag-prefix <prefix>` | Override tag prefix (default: "wm") |
| `--reset [pattern]` | Remove tags matching pattern (see below) |
| `--test` | Process only test files |
| `--pattern <patterns...>` | File glob patterns |
| `--file <files...>` | Specific file paths |
| `-v, --verbose` | Show detailed output |

#### Reset Patterns

The `--reset` flag supports flexible tag removal:

| Pattern | Description | Example |
|---------|-------------|---------|
| `--reset` or `--reset wm` | Remove #wm:* tags (except #wmi:*) | `#wm:fix/todo` → removed |
| `--reset all` | Remove ALL tags | `#anything` → removed |
| `--reset wm:fix` | Remove only #wm:fix/* tags | `#wm:fix/todo` → removed |
| `--reset custom` | Remove #custom:* tags | `#custom:tag` → removed |

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

# Preview removal of specific tags
wm blaze --reset wm:fix --dry-run

# Process only specific files
wm blaze --file src/auth.js src/api.js --yes

# Generate report without making changes
wm blaze --dry-run --report
```

#### Tag Categories

Blaze applies tags based on violation severity:

- **`wm:fix/*`**: Definitive violations that must be fixed
- **`wm:warn/*`**: Potential issues or discouraged patterns

#### Blaze Reports

Reports are saved to `.waymark/logs/` with standardized timestamps:

```json
{
  "metadata": {
    "version": "1.0",
    "timestamp": "2025-06-18T10:30:00Z",
    "mode": "blaze",
    "tagPrefix": "wm",
    "gitBranch": "feature/v1-prep",
    "dryRun": false
  },
  "summary": {
    "totalFiles": 23,
    "totalTags": 67,
    "byType": {
      "deprecated-marker": 23,
      "property-priority": 15,
      "all-caps-marker": 19
    }
  },
  "files": [
    {
      "path": "src/auth.js",
      "totalTags": 3,
      "tags": [
        {
          "line": 15,
          "tag": "wm:fix/property-priority",
          "issue": "Property-based priority",
          "original": "// todo ::: priority:high fix auth"
        }
      ]
    }
  ]
}
```

### tldr-check

<!-- about ::: ##multitool/tldr quality analysis for TLDR waymarks -->

Analyze TLDR waymarks for quality and completeness.

```bash
wm tldr-check [options]
```

**Options:**
| Flag | Description |
|------|-------------|
| `--json` | Output as JSON for tooling |
| `--require <items...>` | Require specific elements (tags, anchors) |
| `--min-tags <n>` | Require minimum number of tags |
| `--strict` | Enable all quality checks |
| `-v, --verbose` | Show detailed suggestions |
| `--file <files...>` | Specific files to check |
| `--pattern <patterns...>` | File glob patterns |
| `--test` | Check only test files |

#### Quality Checks

The command analyzes TLDR waymarks for:

1. **Presence**: Every significant file should have a tldr
2. **Tags**: Context tags help categorization (#docs, #tooling, #api)
3. **Anchors**: Canonical anchors (##name) enable stable references
4. **Length**: Descriptions should be concise (< 120 chars recommended)

**Examples:**
```bash
# Basic TLDR analysis
wm tldr-check

# Require tags and anchors with minimum 2 tags
wm tldr-check --require tags anchors --min-tags 2

# Strict mode (all quality checks)
wm tldr-check --strict

# Check specific directory with verbose output
wm tldr-check --pattern "src/**/*.js" --verbose

# JSON output for CI/CD
wm tldr-check --json > tldr-report.json
```

### migrate

<!-- about ::: ##multitool/migrate bidirectional waymark syntax migration -->

Migrate waymark syntax between versions.

```bash
wm migrate [options]
```

**Options:**
| Flag | Description |
|------|-------------|
| `-n, --dry-run` | Preview migrations without modifying files |
| `-y, --yes` | **Required** flag to actually modify files |
| `-d, --direction <dir>` | Migration direction (forward, backward) |
| `--file <files...>` | Specific files to migrate |
| `--pattern <patterns...>` | File glob patterns |
| `-v, --verbose` | Show detailed migration info |

**Migration Mappings:**

| Legacy | v1.0 |
|--------|------|
| `+tag` | `#tag` |
| `alert :::` | `notice :::` |
| `fix :::` | `fixme :::` |
| `priority:high` | `!marker` |
| `fixes:123` | `#fixes:#123` |

**Examples:**
```bash
# Preview migration to v1.0
wm migrate --dry-run

# Migrate all files to v1.0
wm migrate --yes

# Migrate specific files
wm migrate --file legacy/old.js --yes --verbose

# Backward migration (v1.0 to legacy)
wm migrate --direction backward --yes

# Migrate only markdown files
wm migrate --pattern "**/*.md" --yes
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

The multitool respects ignore patterns from multiple sources:

1. **`.gitignore`** - Standard git ignore patterns
2. **`.npmignore`** - NPM-specific patterns
3. **`.dockerignore`** - Docker-specific patterns
4. **`.waymarkignore`** - Waymark-specific patterns
5. **`.waymark/config.json`** - Advanced configuration

Example `.waymarkignore`:
```
# Ignore generated files
*.generated.*
**/dist/**
**/build/**

# Ignore vendor directories
**/vendor/**
**/node_modules/**

# Ignore archives
**/archive/**
*.zip
*.tar.gz
```

## Integration

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check for waymark violations
wm audit --legacy
if [ $? -ne 0 ]; then
  echo "❌ Waymark violations found. Run 'wm audit' for details."
  exit 1
fi

# Check TLDR quality
wm tldr-check --require tags
if [ $? -ne 0 ]; then
  echo "❌ TLDR quality issues found. Run 'wm tldr-check --verbose' for details."
  exit 1
fi
```

### GitHub Actions

```yaml
name: Waymark Compliance

on: [push, pull_request]

jobs:
  waymark-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd path/to/waymark
          pnpm install
          pnpm build
          
      - name: Check waymark syntax
        run: |
          node path/to/waymark/packages/multitool/dist/index.js audit --legacy
          
      - name: Check TLDR quality
        run: |
          node path/to/waymark/packages/multitool/dist/index.js tldr-check --strict --json
```

### Package.json Scripts

```json
{
  "scripts": {
    "waymark:audit": "wm audit",
    "waymark:fix": "wm blaze --yes",
    "waymark:fix:preview": "wm blaze --dry-run",
    "waymark:tldr": "wm tldr-check --strict",
    "waymark:migrate": "wm migrate --yes",
    "waymark:clean": "wm blaze --reset --yes",
    "waymark:report": "wm audit --json > .waymark/audit-report.json"
  }
}
```

## Architecture

<!-- about ::: ##multitool/architecture TypeScript-based modular CLI design -->

The multitool is built with modern TypeScript and follows these principles:

### Core Technologies
- **TypeScript** - Full type safety with strict mode
- **Commander.js** - Robust CLI framework
- **Vitest** - Fast unit testing
- **ES Modules** - Modern module system

### Project Structure
```
packages/multitool/
├── src/
│   ├── index.ts          # CLI entry point
│   ├── commands/         # Command implementations
│   │   ├── audit.ts      # Syntax compliance checking
│   │   ├── blaze.ts      # Violation tagging/removal
│   │   ├── tldr-check.ts # TLDR quality analysis
│   │   └── migrate.ts    # Syntax migration
│   └── lib/              # Shared utilities
│       ├── file-finder.ts    # File discovery
│       ├── ignore-patterns.ts # Ignore handling
│       ├── spec-loader.ts    # Specification interface
│       ├── timestamp.ts      # Log timestamps
│       └── waymark-spec.json # v1.0 specification
├── dist/                 # Compiled JavaScript
├── tests/                # Test files
└── package.json          # Package configuration
```

### Key Design Decisions

1. **Unified Specification** - Single source of truth in `waymark-spec.json`
2. **Modular Commands** - Each command is independent and testable
3. **Shared Libraries** - Common functionality extracted to lib/
4. **Type Safety** - Full TypeScript with strict mode enabled
5. **Direct Integration** - Blaze calls audit directly (no subprocess)

## Testing

<!-- about ::: ##multitool/testing vitest-based testing infrastructure -->

The multitool includes a comprehensive test suite:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage

# Run specific test file
pnpm test src/lib/__tests__/spec-loader.test.ts
```

### Test Fixtures

Test fixture files for waymark patterns are located in `packages/multitool/test-fixtures/`:
- `legacy_patterns.md` - Legacy syntax examples
- `test_additional_patterns.md` - Actor and reference patterns
- `test_new_patterns.md` - v1.0 violation examples
- `test_wm_examples.md` - Documentation example patterns

## Performance

<!-- notice ::: optimized for large codebases with efficient file processing -->

The multitool is designed for performance:

- **Parallel Processing** - Files processed concurrently where possible
- **Streaming** - Large files streamed to avoid memory issues
- **Smart Filtering** - Respects ignore patterns early
- **Lazy Loading** - Commands loaded on demand
- **Minimal Dependencies** - Fast startup time

### Tips for Large Codebases

1. Use glob patterns to target specific areas
2. Leverage ignore patterns to skip irrelevant files
3. Use `--json` output for programmatic processing
4. Run audit before blaze to avoid redundant work
5. Use `--dry-run` to preview changes

## Troubleshooting

### Common Issues

**No violations found but expecting some:**
- Ensure files contain `:::` in actual comments (not strings)
- Check that files aren't ignored by .gitignore
- Verify correct file extensions for comment detection
- Use `--verbose` to see what's being processed

**Command not found:**
- Ensure you've run `pnpm build` in the waymark repo
- Check the path to the multitool dist/index.js
- Consider creating an alias or npm link

**Performance issues:**
- Use glob patterns to limit scope
- Check for extremely large files
- Ensure adequate memory available
- Use `--test` mode for development

### Debug Mode

```bash
# Verbose output for debugging
wm audit --verbose

# Check what files are being processed
wm audit --pattern "**/*.js" --verbose

# Test with direct input
echo "// todo ::: test" | wm audit --stdin

# Generate detailed reports
wm blaze --dry-run --report --verbose
```

## Development

<!-- about ::: ##multitool/development contributing and extending the multitool -->

### Setup

```bash
# Clone the waymark repository
git clone https://github.com/your-org/waymark.git
cd waymark

# Install dependencies
pnpm install

# Build the multitool
cd packages/multitool
pnpm build

# Run in development mode
pnpm dev
```

### Adding New Commands

1. Create new command file in `src/commands/`
2. Implement using Commander.js pattern
3. Export factory function `createXCommand()`
4. Register in `src/index.ts`
5. Add tests in `src/commands/__tests__/`
6. Update documentation

### Contributing

- Follow TypeScript best practices
- Maintain 100% type safety
- Add tests for new features
- Update documentation
- Run `pnpm test` before submitting

## Migration from Legacy Scripts

<!-- notice ::: the multitool replaces all legacy JavaScript scripts -->

The multitool is a complete replacement for the legacy scripts:

| Legacy Script | Multitool Command | Notes |
|---------------|-------------------|-------|
| `audit-waymarks.js` | `wm audit` | Enhanced with more violations |
| `blaze.js` | `wm blaze` | Added reset functionality |
| `tldr-check.js` | `wm tldr-check` | Same functionality |
| `migrate-waymarks.js` | `wm migrate` | Bidirectional migration |

### Key Improvements

1. **Type Safety** - Full TypeScript implementation
2. **Better CLI** - Commander.js for better UX
3. **Unified Spec** - Single source of truth
4. **Direct Integration** - No subprocess calls
5. **Enhanced Features** - Reset, reports, more patterns
6. **Test Coverage** - Comprehensive test suite

---

<!-- notice ::: for additional help run `wm --help` or `wm <command> --help` -->