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

| Flag | Description | Example |
|------|-------------|---------|
| `--legacy` | Show only v1.0 syntax violations | `--legacy` |
| `--test` | Scan only `scripts/tests/` files | `--test` |
| `--json` | Output violations as JSON | `--json` |
| `--verbose` | Show waymark content in output | `--verbose` |
| `--include` | Filter categories to include | `--include official,deprecated` |
| `--exclude` | Filter categories to exclude | `--exclude unknown` |

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
node scripts/tldr-check.js --require-tags

# Require canonical anchors
node scripts/tldr-check.js --require-anchors

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
| `--require-tags` | Require at least one #tag in tldr | `--require-tags` |
| `--require-anchors` | Require ##canonical-anchor | `--require-anchors` |
| `--min-tags N` | Require minimum N tags | `--min-tags 2` |
| `--strict` | Enable all quality checks | `--strict` |
| `--verbose` | Show detailed suggestions | `--verbose` |
| `--json` | Output as JSON for tooling | `--json` |

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
```

## blaze.js

<!-- about ::: ##scripts/blaze automated violation tagging system for waymark compliance -->

Automated system for tagging waymark violations in the codebase. Reads violations from audit-waymarks.js and adds appropriate tags.

### Basic Usage

```bash
# Preview what would be tagged (recommended first)
node scripts/blaze.js --dry-run

# Actually apply tags to files
node scripts/blaze.js

# Use custom tag prefix
node scripts/blaze.js --tag wm:custom
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
- **`test_new_patterns.md`**: Basic v1.0 violations
- **`test_additional_patterns.md`**: Actor placement and reference issues  
- **`legacy_patterns.md`**: Comprehensive legacy pattern examples

### Running Tests

```bash
# Test only the test files
node scripts/audit-waymarks.js --test

# Test with verbose output
node scripts/audit-waymarks.js --test --verbose

# Test JSON output
node scripts/audit-waymarks.js --test --json

# Test blaze on test files only
node scripts/blaze.js --dry-run  # (blaze automatically uses audit --legacy)
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
```

### Pre-push Hooks

Automatically run quality checks before push:
- Waymark syntax compliance
- No temporary markers (`*temp`, `*!temp`)
- TypeScript compilation
- Linting passes

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
- Filter output with `--include`/`--exclude` for focused analysis
- Run audit before blaze to avoid processing unchanged files

## Troubleshooting

### Common Issues

<!-- fixme ::: add more troubleshooting scenarios as they arise -->

**No violations found but expecting some:**
- Check file is tracked by git (`git ls-files | grep filename`)
- Verify file contains `:::` pattern
- Check ignore patterns aren't excluding the file

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
```

---

<!-- notice ::: update this documentation when adding new scripts or changing functionality -->