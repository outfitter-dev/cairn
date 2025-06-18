<!-- tldr ::: ##waymark-dev-scripting comprehensive documentation of development scripts and tooling -->

# Development Scripts

This document covers all development scripts and tooling used in the waymark project.

## Overview

The waymark project includes several custom scripts for maintaining code quality and waymark syntax compliance:

- **`audit-waymarks.js`**: Main auditing and inventory tool
- **`blaze.js`**: Automated violation tagging system
- **Spec system**: JSON-based specification for maintainability

## audit-waymarks.js

<!-- about ::: ##scripts/audit comprehensive waymark analysis and v1.0 compliance checking -->

Main tool for analyzing waymarks across the codebase and detecting v1.0 syntax violations.

### Basic Usage

```bash
# Audit entire codebase
node scripts/audit-waymarks.js

# Show only violations (legacy mode)
node scripts/audit-waymarks.js --legacy

# Test mode (only test files)
node scripts/audit-waymarks.js --test

# JSON output for tooling
node scripts/audit-waymarks.js --json

# Verbose output with content preview
node scripts/audit-waymarks.js --verbose
```

### Command Line Options

#### Standard Options
| Flag | Description | Example |
|------|-------------|---------|
| `--help, -h` | Show help message | `--help` |
| `--verbose, -v` | Show detailed output with waymark content | `--verbose` |
| `--json` | Output as JSON for tooling | `--json` |
| `--legacy` | Show only v1.0 syntax violations | `--legacy` |
| `--test` | Scan only `scripts/tests/` files | `--test` |
| `--dry-run, -n` | Preview mode (no file changes) | `--dry-run` |

#### Content Filtering
| Flag | Description | Example |
|------|-------------|---------|
| `--filter TYPE1 TYPE2 !TYPE3` | Filter content types with negation | `--filter official deprecated !unknown` |

**Available filter types:** `official`, `deprecated`, `unknown`, `examples`

#### File Targeting
| Flag | Description | Example |
|------|-------------|---------|
| `--pattern "*.md" "src/**"` | File glob patterns | `--pattern "docs/**/*.md"` |
| `--file path1 path2` | Specific file paths | `--file src/main.js docs/README.md` |

#### Input Methods
| Flag | Description | Example |
|------|-------------|---------|
| `--input "content"` | Analyze direct content input | `--input "// todo ::: test"` |
| `--stdin` | Read content from stdin | `echo "code" \| node audit-waymarks.js --stdin` |

### Output Modes

#### Default Mode (Inventory)
Shows comprehensive waymark inventory categorized by type:
- Official markers (v1.0 core)
- Deprecated markers (need updating)
- Properties/metadata
- Special tokens (@actors, #issues)
- Unknown markers

#### Legacy Mode (Violations Only)
Shows only v1.0 syntax violations with file and line numbers. Used by blaze.js for automated tagging.

#### Test Mode
Scans only files in `scripts/tests/` directory for isolated testing of violation detection.

#### Comment Detection
The audit script includes enhanced comment detection that:
- **Filters by file type**: Only processes waymarks in actual comments based on file extension
- **Handles code blocks**: Detects waymarks in markdown code blocks using language-specific comment patterns
- **Avoids false positives**: Ignores `:::` in strings, backticks, and documentation prose
- **Supports wm:example**: Special handling for documentation examples

#### WM Example Pattern
Documentation can use `wm:example` to mark code blocks that contain example waymarks:

```markdown
```javascript wm:example
// alert ::: this is an example (ignored by default)
```

```javascript wm:example,deprecated,v0.9
// +security ::: old syntax examples (ignored by default)
```

```javascript
// todo ::: real waymark (always detected)
```
```

Use `--include-examples` to process `wm:example` blocks for documentation validation.

### Violation Types Detected

<!-- notice ::: these violations are automatically detected and tagged by blaze.js -->

| Type | Description | Example |
|------|-------------|---------|
| `legacy-plus-tag` | Old `+tag` syntax | `+security` → `#security` |
| `property-priority` | Property-based priority | `priority:high` → `!marker` |
| `missing-ref-hash` | Missing `#` in references | `fixes:123` → `#fixes:#123` |
| `hierarchical-tag` | Discouraged hierarchical tags | `#auth/oauth` (warn only) |
| `legacy-blessed-property` | Old blessed properties | `reason:text` → deprecated |
| `non-blessed-property` | Properties without `#` | `custom:value` → `#custom:value` |
| `array-with-spaces` | Spaces in tag arrays | `#cc:@a, @b` → `#cc:@a,@b` |
| `multiple-ownership-tags` | Duplicate ownership tags | Multiple `#owner:` tags |
| `multiple-cc-tags` | Duplicate cc tags | Multiple `#cc:` tags |
| `misplaced-actor` | Actors in wrong position | `@user` not first or in relational |
| `all-caps-marker` | All-caps markers | `TODO` → `todo` |
| `deprecated-marker` | Old marker names | `alert` → `notice` |
| `marker-misplaced` | Marker after `:::` | `::: todo` → `todo :::` |

## tldr-check.js

<!-- about ::: ##scripts/tldr TLDR waymark quality analysis tool -->

Dedicated tool for analyzing TLDR waymarks and ensuring documentation quality standards.

### Basic Usage

```bash
# Basic analysis
node scripts/tldr-check.js

# Require tags in all tldrs
node scripts/tldr-check.js --require tags

# Require canonical anchors
node scripts/tldr-check.js --require anchors

# Require both tags and anchors
node scripts/tldr-check.js --require tags anchors

# Minimum tag count
node scripts/tldr-check.js --min-tags 2

# Strict mode (all checks)
node scripts/tldr-check.js --strict

# JSON output for tooling
node scripts/tldr-check.js --json

# Verbose output with suggestions
node scripts/tldr-check.js --verbose
```

### Command Line Options

| Flag | Description | Example |
|------|-------------|---------|
| `--require [items]` | Require specific elements | `--require tags anchors` |
| `--min-tags N` | Require minimum N tags | `--min-tags 2` |
| `--strict` | Enable all quality checks | `--strict` |
| `--verbose` | Show detailed suggestions | `--verbose` |
| `--json` | Output as JSON for tooling | `--json` |

#### --require Options
- `tags` or `tag` - Require at least one #tag
- `anchors` or `anchor` - Require ##canonical-anchor
- Can combine: `--require tags anchors`

### Quality Checks

The script analyzes TLDR waymarks for:

1. **Presence**: Every significant file should have a tldr
2. **Tags**: Context tags help categorization (#docs, #tooling, #api)
3. **Anchors**: Canonical anchors (##name) enable stable references
4. **Length**: Descriptions should be concise (< 120 chars recommended)

### Example Output

```
📊 TLDR Analysis Report
======================

✅ Files with valid tldr: 10
📝 Files with tldr (with issues): 75  
❌ Files missing tldr: 45
📁 Total files analyzed: 130

Missing TLDRs:
  src/utils/helpers.js
    💡 Consider adding: // tldr ::: brief description #component

TLDRs with issues:
  docs/README.md:1
    <!-- tldr ::: Documentation hub for waymark syntax -->
    ⚠️  No tags found
    💡 Consider adding tags: #docs
```

### Integration Ideas

```bash
# Add to package.json
"scripts": {
  "tldr:check": "node scripts/tldr-check.js",
  "tldr:strict": "node scripts/tldr-check.js --strict"
}

# Pre-commit hook (check changed files only)
git diff --cached --name-only | xargs node scripts/tldr-check.js --files

# CI/CD integration
- name: Check TLDR Quality
  run: node scripts/tldr-check.js --strict --json

# Specific requirements
- name: Ensure all docs have tagged TLDRs
  run: node scripts/tldr-check.js --require tags --include docs/
```

## blaze.js

<!-- about ::: ##scripts/blaze automated violation tagging system for waymark compliance -->

Automated system for tagging waymark violations in the codebase. Reads violations from audit-waymarks.js and adds appropriate tags.

### Basic Usage

```bash
# Preview what would be tagged (recommended first)
node scripts/blaze.js --dry-run

# Preview AND generate a report of what would be done
node scripts/blaze.js --dry-run --report

# Actually apply tags to files (requires --yes)
node scripts/blaze.js --yes

# Use custom tag prefix
node scripts/blaze.js --tag-prefix custom --yes

# Remove tags with different patterns
node scripts/blaze.js --reset              # Remove all #wm:* tags (not #wmi:)
node scripts/blaze.js --reset all          # Remove ALL tags (#anything)
node scripts/blaze.js --reset wm           # Same as --reset (default)
node scripts/blaze.js --reset wm:fix       # Remove only #wm:fix/* tags
node scripts/blaze.js --reset wm:warn      # Remove only #wm:warn/* tags
node scripts/blaze.js --reset custom       # Remove #custom:* tags

# Combine with file targeting
node scripts/blaze.js --reset --pattern "docs/**/*.md"
node scripts/blaze.js --reset wm:fix --file src/main.js
node scripts/blaze.js --reset all --dry-run
```

### Tag Categories

Blaze applies tags based on violation severity:

- **`wm:fix/`**: Definitive violations that need fixing
- **`wm:warn/`**: Potential issues or discouraged patterns

### Tag Mapping

| Violation | Tag | Category |
|-----------|-----|----------|
| Deprecated marker | `wm:fix/deprecated-marker` | fix |
| Legacy +tag syntax | `wm:fix/legacy-plus-tag` | fix |
| Property-based priority | `wm:fix/property-priority` | fix |
| Missing # in reference | `wm:fix/missing-ref-hash` | fix |
| Non-blessed property | `wm:fix/non-blessed-property` | fix |
| Array with spaces | `wm:fix/array-with-spaces` | fix |
| Multiple ownership | `wm:fix/multiple-ownership-tags` | fix |
| Hierarchical tag | `wm:warn/hierarchical-tag` | warn |
| All-caps marker | `wm:warn/all-caps-marker` | warn |
| Misplaced actor | `wm:warn/misplaced-actor` | warn |

### Example Output

```bash
🔥 Starting blaze to tag problems...
Found 25 problems to tag.

📁 src/auth.js (3 problem-lines)
  L15: // todo ::: priority:high fix auth #wm:fix/property-priority
  L22: // alert ::: validate input #wm:fix/deprecated-marker
  L35: // note ::: discouraged #auth/oauth #wm:warn/hierarchical-tag

🔥 Blaze completed.
```

### Safety Features

**--yes Flag Requirement**: Blaze now requires explicit confirmation to modify files:
```bash
# This will error without --yes
node scripts/blaze.js
# Error: --yes flag is required to modify files.

# Correct usage
node scripts/blaze.js --yes
```

### Blaze Reports

Reports are saved to `.waymark/logs/` with timestamped filenames:

- **Automatic**: When tags are applied with `--yes`
- **On-demand**: Use `--dry-run --report` to generate a report without modifying files

Example filename: `.waymark/logs/202506181030-blaze-report.json`

The timestamp format is `YYYYMMDDhhmm` for easy sorting and consistency across all waymark logs.

```json
{
  "metadata": {
    "version": "1.0",
    "timestamp": "2025-06-18T10:30:00Z",
    "mode": "blaze",
    "tagPrefix": "wm",
    "gitBranch": "feature/v1-prep",
    "dryRun": true      // Present only for dry-run reports
  },
  "summary": {
    "totalFiles": 23,
    "totalTags": 67,
    "byType": {
      "deprecated-marker": 23,
      "property-priority": 15,
      "all-caps-marker": 19,
      "unknown": 10
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

This report enables:
- **Tracking**: Know exactly what was changed
- **Auditing**: Review applied tags
- **Future Undo**: Foundation for `--undo` functionality

## Specification System

<!-- about ::: ##scripts/spec json-based specification system for maintainable waymark validation -->

The scripts use a JSON-based specification system for maintainability and consistency.

### Files

- **`scripts/lib/waymark-spec.json`**: Complete v1.0 specification
- **`scripts/lib/spec-loader.js`**: JavaScript interface to spec data

### Specification Structure

```json
{
  "version": "1.0.0",
  "markers": {
    "official": {
      "work": ["todo", "fixme", "refactor", ...],
      "info": ["note", "idea", "about", ...],
      "attention": ["notice", "risk", "important"]
    },
    "deprecated": {
      "legacy": ["temporary", "info", "good", ...],
      "migration": ["alert", "fix", "check", ...]
    }
  },
  "relational_tags": {
    "work": ["fixes", "closes", "blocks", ...],
    "references": ["for", "needs", "relates", ...],
    "context": ["affects", "owner", "cc"]
  },
  "validation_rules": { ... },
  "blaze_tags": { ... }
}
```

### Using the Spec in Scripts

```javascript
import WaymarkSpec from './lib/spec-loader.js';

const spec = new WaymarkSpec();

// Check if marker is official
if (spec.isOfficialMarker('todo')) { ... }

// Get blaze tag for issue
const tag = spec.getBlazeTagFor('deprecated marker found');

// Access raw spec data
const officialMarkers = spec.spec.markers.official;
```

## Test Infrastructure

### Test Files

Located in `scripts/tests/`:
- **`legacy_patterns.md`**: Comprehensive legacy pattern examples (25 violations)
- **`test_additional_patterns.md`**: Actor placement and reference issues (12 violations)  
- **`test_new_patterns.md`**: Basic v1.0 violations (13 violations)
- **`test_wm_examples.md`**: WM example pattern testing and code block detection (31 waymarks, 41 with examples)

#### Test File Coverage

The test files provide comprehensive coverage of violation detection:

```bash
# Check current test coverage
node scripts/audit-waymarks.js --test
# Expected: ~31 waymarks detected (excluding wm:example blocks)

node scripts/audit-waymarks.js --test --filter examples
# Expected: ~41 waymarks (including wm:example blocks)

# Legacy violations only
node scripts/audit-waymarks.js --test --legacy
# Expected: Various v1.0 syntax violations
```

### Running Tests

```bash
# Test only the test files (excludes wm:example blocks)
node scripts/audit-waymarks.js --test

# Test including documentation examples
node scripts/audit-waymarks.js --test --filter examples

# Test with verbose output
node scripts/audit-waymarks.js --test --verbose

# Test JSON output
node scripts/audit-waymarks.js --test --json

# Test legacy violations only
node scripts/audit-waymarks.js --test --legacy

# Test blaze on test files (shows what would be tagged)
node scripts/blaze.js --dry-run --verbose

# Test specific test file
node scripts/audit-waymarks.js --file scripts/tests/test_new_patterns.md --verbose

# Test direct content
node scripts/audit-waymarks.js --input "// todo ::: test syntax" --verbose
```

### Adding New Test Patterns

To test detection of new violation patterns:

1. Add examples to appropriate test file in `scripts/tests/`
2. Run audit in test mode to verify detection
3. Update spec if needed for new violation types

## Quality Assurance Scripts

### pnpm Scripts

```bash
# Full CI simulation (includes waymark audit)
pnpm ci:local

# Comprehensive checks (includes temp marker detection)  
pnpm check:all

# Individual checks
pnpm lint
pnpm typecheck
pnpm test

# Waymark-specific checks
node scripts/audit-waymarks.js --legacy  # Check for violations
node scripts/tldr-check.js --strict      # Check TLDR quality
```

### Pre-push Hooks

Automatically run quality checks before push:
- Waymark syntax compliance
- No temporary markers (`*temp`, `*!temp`)
- TypeScript compilation
- Linting passes

## Standardized Flag System

### Overview

All waymark scripts now use a consistent flag system for better usability and maintainability:

- **Boolean flags**: `--verbose`, `--help`, `--dry-run`
- **Space-separated arrays**: `--filter official deprecated !unknown`
- **Single values**: `--tag-prefix custom`
- **Negation support**: Use `!` prefix to exclude items

### Common Flags Across Scripts

| Flag | Available In | Description |
|------|-------------|-------------|
| `--help, -h` | All scripts | Show help message |
| `--verbose, -v` | All scripts | Show detailed output |
| `--dry-run, -n` | audit, blaze | Preview mode (no changes) |
| `--json` | audit, tldr | Output as JSON |
| `--test` | audit, tldr | Test mode (scripts/tests/ only) |
| `--filter TYPE1 !TYPE2` | audit | Filter content types |
| `--pattern "glob"` | audit, tldr, blaze | File glob patterns |
| `--file path1 path2` | audit, tldr, blaze | Specific files |
| `--input "content"` | audit | Analyze direct content |
| `--stdin` | audit | Read from stdin |
| `--tag-prefix PREFIX` | blaze | Custom tag prefix (default: wm) |
| `--yes, -y` | blaze | Confirm file modifications (required for non-dry-run) |
| `--report [PATH]` | blaze | Generate report (can use with --dry-run) |
| `--reset [PATTERN]` | blaze | Remove tags matching pattern (default: wm) |

### Examples

```bash
# Filter with negation
node scripts/audit-waymarks.js --filter official deprecated !unknown

# Multiple file patterns
node scripts/audit-waymarks.js --pattern "docs/**/*.md" "src/**/*.js"

# Custom tag prefix
node scripts/blaze.js --tag-prefix custom --dry-run

# Reset tags from documentation files
node scripts/blaze.js --reset --pattern "docs/**/*.md" --dry-run

# Reset all wm: tags project-wide
node scripts/blaze.js --reset

# Require specific elements
node scripts/tldr-check.js --require tags anchors --min-tags 2

# Direct content analysis
node scripts/audit-waymarks.js --input "// todo ::: test syntax"

# Test mode with verbose output
node scripts/audit-waymarks.js --test --verbose
```

## Development Workflow Integration

### During Development

1. **Add waymarks** as you work:
   ```javascript
   // todo ::: implement validation #backend
   // !fixme ::: critical auth bug #security
   ```

2. **Check compliance** regularly:
   ```bash
   node scripts/audit-waymarks.js --legacy
   ```

3. **Use blaze** to fix violations:
   ```bash
   node scripts/blaze.js --dry-run  # preview
   node scripts/blaze.js            # apply
   ```

### Before Committing

```bash
# Run full quality check
pnpm ci:local

# Ensure no violations remain
node scripts/audit-waymarks.js --legacy

# Check for temp markers
pnpm check:all

# Test all scripts work correctly
node scripts/audit-waymarks.js --test
node scripts/tldr-check.js --test
node scripts/blaze.js --dry-run
```

## Performance Considerations

### Large Codebases

The audit script handles large codebases efficiently:
- Respects `.gitignore` and ignore patterns
- Processes files in parallel where possible
- Streams large files to avoid memory issues
- Configurable file size limits

### Optimization Tips

- Use `--test` mode during development
- Use `--json` mode for programmatic processing  
- Filter output with `--filter` for focused analysis
- Use `--pattern` to target specific file types
- Use `--dry-run` to preview changes before applying
- Run audit before blaze to avoid processing unchanged files

## Troubleshooting

### Common Issues

<!-- fixme ::: add more troubleshooting scenarios as they arise -->

**No violations found but expecting some:**
- Check file is tracked by git (`git ls-files | grep filename`)
- Verify file contains `:::` pattern in actual comments (not strings/prose)
- Check ignore patterns aren't excluding the file
- For markdown: ensure `:::` is in comments or code blocks (not inline backticks)
- For code blocks: verify they don't use `wm:example` pattern

**False positives in documentation:**
- Use `wm:example` pattern for code blocks containing example syntax
- Ensure documentation examples are in code blocks, not inline text

**Script fails with permission error:**
- Ensure scripts are executable: `chmod +x scripts/*.js`
- Check Node.js version compatibility

**Performance issues:**
- Use `--test` mode for development
- Check file size limits in large repositories
- Verify sufficient memory for large file processing

### Debug Mode

For debugging script behavior:

```bash
# Verbose output shows more context
node scripts/audit-waymarks.js --verbose

# JSON output for inspection
node scripts/audit-waymarks.js --json | jq '.'

# Test specific patterns
node scripts/audit-waymarks.js --test --verbose

# Analyze specific files
node scripts/audit-waymarks.js --file src/main.js --verbose

# Direct content analysis
node scripts/audit-waymarks.js --input "// todo ::: test syntax" --verbose

# Filter to specific types
node scripts/audit-waymarks.js --filter deprecated --verbose

# Test blaze with detailed output
node scripts/blaze.js --dry-run --verbose
```

---

<!-- notice ::: update this documentation when adding new scripts or changing functionality -->