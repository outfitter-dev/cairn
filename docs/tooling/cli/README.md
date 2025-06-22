<!-- tldr ::: comprehensive CLI reference for waymark v1.0 -->
# Waymark CLI Reference

The waymark CLI provides powerful commands for searching, analyzing, and managing waymarks in your codebase using v1.0 syntax.

## Installation

```bash
# Global installation
npm install -g @waymark/cli

# Or use directly with npx
npx @waymark/cli

# Or in a project
pnpm add -D @waymark/cli
```

## Commands

### `waymark search [patterns...]`

Search for waymarks in files matching the given patterns.

```bash
# Search all JavaScript files
waymark search "src/**/*.js"

# Search for specific markers
waymark search "src/" --marker todo,fixme

# Search by signal (priority)
waymark search "src/" --pattern "!todo"     # High priority todos
waymark search "src/" --pattern "!!fixme"   # Critical fixes
waymark search "src/" --pattern "\*todo"    # Branch-scoped work

# Search by actor
waymark search "src/" --pattern "@alice"    # Assigned to Alice
waymark search "src/" --pattern "@agent"    # AI agent tasks

# Search by tags
waymark search "src/" --tags "#backend"     # Backend tags
waymark search "src/" --tags "#fixes:#123"  # Issue references

# Search with context lines
waymark search "lib/" --context 3

# Output as JSON
waymark search "src/" --format json
```

**Options:**
- `--marker <items>` - Filter by specific markers (comma-separated)
- `--pattern <regex>` - Filter using regex pattern
- `--tags <items>` - Filter by tags (comma-separated)
- `--actor <name>` - Filter by actor assignment
- `--context <number>` - Number of context lines to show (default: 0)
- `--format <format>` - Output format: terminal, json, csv (default: terminal)
- `--no-color` - Disable colored output
- `--recursive` - Search recursively (default: true)
- `--max-depth <number>` - Maximum directory depth
- `--exclude <patterns>` - Exclude file patterns

### `waymark parse <file>`

Parse a single file and display all waymarks with full v1.0 syntax analysis.

```bash
# Parse a single file
waymark parse src/index.js

# Parse with JSON output (includes all v1.0 components)
waymark parse src/app.ts --format json

# Show detailed validation
waymark parse config.yml --verbose

# Validate syntax only
waymark parse src/auth.ts --validate-only
```

**Options:**
- `--format <format>` - Output format: terminal, json, csv (default: terminal)
- `--no-color` - Disable colored output
- `--verbose` - Show detailed parsing information
- `--validate-only` - Only validate syntax, don't output waymarks
- `--strict` - Enable strict v1.0 syntax validation

### `waymark list [patterns...]`

List all waymarks in files matching patterns with grouping and filtering options.

```bash
# List all waymarks in src/
waymark list "src/**/*"

# List only todos and fixmes
waymark list "src/" --marker todo,fixme

# List by priority
waymark list "src/" --signal "!"     # High priority
waymark list "src/" --signal "!!"    # Critical
waymark list "src/" --signal "*"     # Branch work

# Group by marker
waymark list "src/" --group-by marker

# Group by file
waymark list "src/" --group-by file

# Group by actor
waymark list "src/" --group-by actor

# Output as CSV
waymark list "src/" --format csv > waymarks.csv

# Output with statistics
waymark list "src/" --stats
```

**Options:**
- `--marker <items>` - Filter by specific markers
- `--signal <type>` - Filter by signal type
- `--tags <items>` - Filter by tags
- `--actor <name>` - Filter by actor
- `--format <format>` - Output format: terminal, json, csv
- `--group-by <field>` - Group by: marker, file, actor, tag
- `--stats` - Include statistics summary
- `--no-color` - Disable colored output

### `waymark validate [patterns...]`

Validate waymark syntax and best practices.

```bash
# Validate all files
waymark validate "src/**/*"

# Validate with strict v1.0 rules
waymark validate "src/" --strict

# Show only errors
waymark validate "src/" --errors-only

# Custom rule set
waymark validate "src/" --rules .waymarkrc.json
```

**Options:**
- `--strict` - Enable strict v1.0 validation
- `--errors-only` - Only show errors, not warnings
- `--rules <file>` - Custom validation rules
- `--fix` - Attempt to auto-fix issues

### `waymark stats [patterns...]`

Generate waymark statistics and insights.

```bash
# Basic statistics
waymark stats "src/"

# Detailed breakdown
waymark stats "src/" --detailed

# Export as JSON
waymark stats "src/" --format json > stats.json
```

## Output Formats

### Terminal (default)

Human-readable colored output with full v1.0 syntax highlighting:

```
src/index.js:42:3
  // todo ::: implement error handling #backend
  Marker: todo
  Prose: implement error handling
  Tags: #backend
  
src/auth.js:15:5  
  // !fixme ::: @alice validate token expiry #security #fixes:#123
  Marker: fixme
  Signal: ! (high priority)
  Actor: @alice
  Prose: validate token expiry
  Tags: #security, #fixes:#123
  
src/api.ts:102:7
  // about ::: ##auth/oauth OAuth implementation #auth
  Marker: about
  Anchor: ##auth/oauth (definition)
  Prose: OAuth implementation
  Tags: #auth
```

### JSON

Machine-readable JSON output with complete v1.0 structure:

```json
[
  {
    "file": "src/index.js",
    "line": 42,
    "column": 3,
    "raw": "// todo ::: implement error handling #backend",
    "marker": "todo",
    "signal": null,
    "actor": null,
    "anchor": null,
    "prose": "implement error handling",
    "tags": {
      "simple": ["backend"],
      "relational": {}
    }
  },
  {
    "file": "src/auth.js",
    "line": 15,
    "column": 5,
    "raw": "// !fixme ::: @alice validate token expiry #security #fixes:#123",
    "marker": "fixme",
    "signal": "!",
    "actor": "@alice",
    "anchor": null,
    "prose": "validate token expiry",
    "tags": {
      "simple": ["security"],
      "relational": {
        "fixes": ["#123"]
      }
    }
  }
]
```

### CSV

Spreadsheet-compatible CSV output:

```csv
file,line,column,marker,signal,actor,anchor,prose,tags
src/index.js,42,3,todo,,,,,implement error handling,#backend
src/auth.js,15,5,fixme,!,@alice,,validate token expiry,"#security,#fixes:#123"
src/api.ts,102,7,about,,,##auth/oauth,OAuth implementation,#auth
```

## Common Usage Patterns

### Working with Priorities (Signals)

```bash
# Find critical issues (P0)
waymark search "src/" --pattern "!!"

# Find high priority work (P1)
waymark search "src/" --pattern "!"

# Find branch-scoped work
waymark search "src/" --pattern "\*"

# Find uncertain items
waymark search "src/" --pattern "\?"
```

### Task Management

```bash
# Find all todos
waymark search "**/*.{js,ts}" --marker todo

# Find work assigned to Alice
waymark search "src/" --pattern "@alice"

# Find unassigned high-priority work
waymark search "src/" --pattern "!todo ::: [^@]"

# Find work blocking issues
waymark search "src/" --tags "#blocks:#"
```

### Security Audit

```bash
# Find security waymarks
waymark search "src/" --tags "#security" --context 5

# Find authentication boundaries
waymark search "src/" --tags "#auth,#boundary"

# Find critical security issues
waymark search "src/" --pattern "!!.* #security"
```

### Code Navigation

```bash
# Find all file summaries
waymark search "src/" --marker tldr

# Find anchor definitions
waymark search "src/" --pattern "##"

# Find references to an anchor
waymark search "src/" --tags "#refs:#auth/login"
```

### AI Agent Integration

```bash
# Find AI-delegated tasks
waymark search "src/" --actor "@agent"

# Find specific agent assignments
waymark search "src/" --pattern "@claude|@max"

# Export agent tasks as JSON
waymark list "src/" --actor "@agent" --format json
```

### Issue Tracking

```bash
# Find waymarks related to issue #123
waymark search "src/" --tags "#123"

# Find all fix references
waymark search "src/" --tags "#fixes:#"

# Find blocking issues
waymark search "src/" --tags "#blocks:#"
```

## Configuration

### Config File (`.waymarkrc.json`)

```json
{
  "version": "1.0",
  "exclude": [
    "node_modules/**",
    "dist/**",
    "*.min.js"
  ],
  "rules": {
    "require-actor-for-todo": "warn",
    "no-branch-work-in-main": "error",
    "valid-issue-references": "error",
    "consistent-markers": "warn"
  },
  "customMarkers": [
    "spike",
    "research"
  ],
  "teamActors": [
    "@alice",
    "@bob",
    "@security-team"
  ]
}
```

### Environment Variables

```bash
# Disable color output
export WAYMARK_NO_COLOR=1

# Set default format
export WAYMARK_FORMAT=json

# Enable debug logging
export WAYMARK_DEBUG=1

# Custom config path
export WAYMARK_CONFIG=./custom-waymark.json
```

### Ignoring Files

```bash
# Use .gitignore (default)
waymark search "src/"

# Include gitignored files
waymark search "src/" --no-respect-gitignore

# Custom ignore patterns
waymark search "src/" --exclude "*.test.js,*.spec.ts"
```

## Exit Codes

- `0` - Success
- `1` - General error
- `2` - File not found
- `3` - Parse error
- `4` - No results found
- `5` - Validation error
- `6` - Configuration error

## Examples

### Project-Wide Analysis

```bash
# Find all waymarks in a project
waymark search "."

# Get project statistics
waymark stats "src/" --detailed

# Find waymarks by directory
waymark list "src/" "lib/" "test/" --group-by file
```

### Advanced Searches

```bash
# Complex pattern matching
waymark search "src/" --pattern "(!|!!)(todo|fixme).*#(security|auth)"

# Find waymarks with multiple tags
waymark search "src/" --tags "#backend,#api"

# Find relational tags
waymark search "src/" --pattern "#\w+:#\d+"
```

### Integration with Other Tools

```bash
# Count waymarks by marker
waymark list "src/" --format json | jq '.[] | .marker' | sort | uniq -c

# Find files with most waymarks
waymark list "src/" --format json | jq -r '.file' | sort | uniq -c | sort -nr

# Extract all actors
waymark list "src/" --format json | jq -r '.actor // empty' | sort | uniq

# Create GitHub issues from todos
waymark search "src/" --marker todo --format json | \
  jq -r '.[] | "gh issue create --title \"" + .prose + "\" --body \"Found in " + .file + ":" + (.line|tostring) + "\"\nAssigned to: " + (.actor // "unassigned") + "\""'

# Find stale waymarks (30+ days old)
waymark list "src/" --format json | \
  jq '.[] | select(.file | test("\\.(js|ts)$"))' | \
  while read -r waymark; do
    file=$(echo "$waymark" | jq -r '.file')
    line=$(echo "$waymark" | jq -r '.line')
    last_modified=$(git blame -L "$line,$line" --porcelain "$file" | grep "committer-time" | awk '{print $2}')
    # Check if older than 30 days...
  done
```

### CI/CD Integration

```bash
# Pre-commit hook
#!/bin/sh
# Fail if branch work exists
if waymark search "src/" --signal "*" | grep -q .; then
  echo "❌ Found branch-scoped waymarks (*). Complete before committing!"
  exit 1
fi

# GitHub Actions
- name: Check for critical waymarks
  run: |
    if waymark search "src/" --signal "!!" | grep -q .; then
      echo "::error::Critical waymarks found!"
      waymark search "src/" --signal "!!" --context 2
      exit 1
    fi

# Generate PR comment with waymark summary
waymark stats "src/" --format json | \
  jq -r '"### Waymark Summary\n\n" +
    "- Total: " + (.total|tostring) + "\n" +
    "- TODOs: " + (.markers.todo // 0|tostring) + "\n" +
    "- FIXMEs: " + (.markers.fixme // 0|tostring) + "\n" +
    "- Critical (!!): " + (.signals["!!"] // 0|tostring) + "\n" +
    "- Branch work (*): " + (.signals["*"] // 0|tostring)' | \
  gh pr comment --body-file -
```

### Reporting and Analytics

```bash
# Generate markdown report
cat << 'EOF' > waymark-report.md
# Waymark Report

## Summary
$(waymark stats "src/")

## High Priority Items
$(waymark search "src/" --signal "!" --format markdown)

## Branch Work
$(waymark search "src/" --signal "*" --format markdown)

## By Owner
$(waymark list "src/" --group-by actor --format markdown)
EOF

# Generate CSV for spreadsheet analysis
waymark list "src/" --format csv > waymarks.csv

# JSON for custom processing
waymark list "src/" --format json | \
  jq '[.[] | {
    file: .file,
    line: .line,
    marker: .marker,
    priority: (if .signal == "!!" then "P0" elif .signal == "!" then "P1" else "P2" end),
    owner: (.actor // "unassigned"),
    tags: (.tags.simple + (.tags.relational | to_entries | map("#" + .key + ":" + .value[])))
  }]' > waymark-analysis.json
```

## Performance Tips

1. **Use specific patterns**: `src/**/*.js` is faster than `**/*`
2. **Filter early**: Use `--marker`, `--signal`, or `--tags` to reduce processing
3. **Limit context lines**: Large `--context` values slow down output
4. **Use JSON for processing**: Terminal format is slower for large results
5. **Enable caching**: Use `--cache` for repeated searches
6. **Parallelize**: Split large searches across multiple processes

### Benchmarks

```bash
# Benchmark different search strategies
time waymark search "**/*"                    # Slow: searches everything
time waymark search "src/**/*.{js,ts}"        # Fast: specific patterns
time waymark search "src/" --marker todo      # Faster: filtered search
time waymark search "src/" --pattern "^todo" # Fastest: anchored regex
```

## Troubleshooting

### No waymarks found

Check your syntax:
- Correct format: `marker ::: content` (spaces required)
- Valid markers: lowercase letters only
- Proper signals: `!`, `!!`, `*`, `?`, `??`, `-`, `--`
- Tag format: `#tag` or `#key:value`

```bash
# Debug mode shows parsing details
waymark search "src/" --debug

# Validate specific file
waymark validate src/index.js --verbose
```

### Syntax Errors

Common v1.0 syntax issues:
```bash
# Wrong: no spaces
// todo:::implement feature

# Wrong: wrong signal order
// !*todo ::: branch work     # Should be *!todo

# Wrong: old tag syntax
// todo ::: task +backend      # Should be #backend

# Wrong: missing # in reference
// fixme ::: bug fixes:123     # Should be #fixes:#123
```

### Performance Issues

```bash
# Profile slow searches
time waymark search "src/" --profile

# Limit file count
waymark search "src/" --max-files 1000

# Skip binary files
waymark search "src/" --text-only

# Use cache for repeated searches
waymark search "src/" --cache
```

### Large Files

```bash
# Default: skip files > 10MB
waymark search "src/"

# Include large files
waymark search "src/" --max-file-size 50mb

# Or use streaming mode
waymark search "large-file.log" --stream
```

## Security Features

The CLI includes comprehensive security protections:

### Path Security
- Path traversal prevention
- Symlink validation
- Restricted to project directory
- No execution of file contents

### Resource Limits
- File size limits (10MB default, configurable)
- Memory usage caps
- Timeout protection (30s default)
- Rate limiting for API operations

### Input Validation
- Sanitized glob patterns
- Validated regex patterns
- Safe JSON parsing
- Command injection prevention

### Secure Defaults
```bash
# These are blocked by default:
waymark search "/etc/passwd"        # Outside project
waymark search "../../secret"       # Path traversal
waymark parse "/dev/random"         # Special files
waymark search "src/" --exec "rm"   # No exec option
```

## Advanced Features

### Custom Reporters

```javascript
// waymark-reporter.js
module.exports = {
  name: 'custom-reporter',
  format: (waymarks) => {
    // Custom formatting logic
    return waymarks.map(w => `${w.marker}: ${w.prose}`).join('\n');
  }
};
```

```bash
waymark search "src/" --reporter ./waymark-reporter.js
```

### Programmatic Usage

```javascript
import { CLI } from '@waymark/cli';

const cli = new CLI();
const results = await cli.search(['src/**/*.js'], {
  marker: ['todo', 'fixme'],
  format: 'json'
});

console.log(`Found ${results.length} waymarks`);
```

### Integration with Build Tools

```javascript
// webpack.config.js
const { WaymarkWebpackPlugin } = require('@waymark/webpack-plugin');

module.exports = {
  plugins: [
    new WaymarkWebpackPlugin({
      patterns: ['src/**/*.js'],
      failOnCritical: true,
      reportPath: 'waymark-report.html'
    })
  ]
};
```

## Resources

- [Waymark Syntax Guide](../../syntax/README.md)
- [Parser API Documentation](../parser/README.md)
- [Linter Configuration](../linter/README.md)
- [VS Code Extension](../ide-plugins/vscode.md)