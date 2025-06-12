# Search Patterns Guide

<!-- ::: tldr Complete guide to searching waymarks with ripgrep and the waymark CLI -->

This guide covers searching waymarks using both raw ripgrep/grep commands and the waymark CLI's enhanced capabilities.

## Part 1: Using ripgrep/grep

### Basic Patterns

#### Find all waymarks

```bash
# Find any waymark
rg ":::"

# With line numbers (default in rg)
rg -n ":::"

# Case-insensitive (though not usually needed)
rg -i ":::"
```

#### Find by prefix

```bash
# Specific prefix
rg "todo :::"
rg "fix :::"
rg "warn :::"

# Multiple prefixes (OR)
rg "(todo|fix) :::"

# Exclude certain prefixes
rg ":::" | rg -v "done :::"
```

#### Find by properties

```bash
# Find specific property
rg ":::.*priority:high"
rg ":::.*assign:@alice"

# Multiple properties (AND)
rg ":::.*priority:high.*assign:@alice"

# Property with any value
rg ":::.*priority:"
```

#### Find by hashtags

```bash
# Simple hashtag search
rg "#security"
rg "#performance"

# Hashtags in waymarks only
rg ":::.*#security"

# Multiple hashtags
rg ":::.*#security.*#critical"
```

### Context Searching

#### Show surrounding code

```bash
# Show 2 lines before and after
rg -C2 "todo :::"

# Show 3 lines before, 1 after
rg -B3 -A1 "fix :::"

# Show only the line after (useful for seeing what comes next)
rg -A1 "tldr :::" --no-line-number
```

#### File-level context

```bash
# Show just filenames with todos
rg -l "todo :::"

# Count waymarks per file
rg -c ":::" | sort -t: -k2 -nr

# Files with most todos
rg -c "todo :::" | sort -t: -k2 -nr | head -10
```

### Advanced Extraction

#### Extract assignees

```bash
# Get all assignees from todos
rg -o "todo :::.*@(\w+)" -r '$1' | sort | uniq

# Count tasks per person
rg -o "todo :::.*@(\w+)" -r '$1' | sort | uniq -c | sort -nr
```

#### Extract priorities

```bash
# List all priority levels used
rg -o "priority:(\w+)" -r '$1' | sort | uniq

# Find critical items across prefixes
rg ":::.*priority:(critical|high)"
```

#### Extract issue references

```bash
# Find all issue numbers
rg -o ":::.*#(\d+)" -r '#$1' | sort -n | uniq

# Find waymarks that fix issues
rg ":::.*fixes:#\d+"

# Find blocked items
rg ":::.*blocked"
```

### Searching in Different File Types

#### Markdown files with HTML comments

```bash
# Find waymarks in HTML comments
rg "<!-- .*:::" --type md

# Find only tldr in markdown
rg "<!-- tldr :::" --type md

# Exclude HTML comments
rg ":::" --type md | rg -v "<!--"
```

#### Language-specific searches

```bash
# JavaScript/TypeScript only
rg "// .*:::" -g "*.{js,ts,jsx,tsx}"

# Python only
rg "# .*:::" -g "*.py"

# In docstrings (multiline)
rg -U "\"\"\"[\s\S]*?:::[\s\S]*?\"\"\"" -g "*.py"
```

### Useful Aliases

Add these to your shell configuration:

```bash
# Find all waymarks
alias wm='rg ":::"'

# Find todos
alias wmt='rg "todo :::"'

# Find with context
alias wmc='rg -C2 ":::"'

# Find security issues
alias wmsec='rg ":::.*#security"'

# Count waymarks by type
alias wmcount='rg "^[^:]*:::" -o | sed "s/ ::://" | sort | uniq -c | sort -nr'
```

### Complex Queries

#### Time-based searches

```bash
# Find waymarks with dates
rg ":::.*2024-"

# Find overdue items (assuming YYYY-MM-DD format)
rg ":::.*until:2023-" # items that should be done by now
```

#### Multi-condition searches

```bash
# High priority security items
rg ":::.*priority:high.*#security"

# Assigned but not done
rg "@\w+" | rg -v "done :::"

# Temporary code in production files
rg "temp :::" -g "!*test*" -g "!*spec*"
```

#### Statistical analysis

```bash
# Waymark density (waymarks per 100 lines)
echo "scale=2; $(rg -c ":::" | awk -F: '{sum+=$2} END {print sum}') / $(wc -l **/*.{js,py,md} | tail -1 | awk '{print $1}') * 100" | bc

# Most used hashtags
rg -o "#\w+" | sort | uniq -c | sort -nr | head -20
```

## Part 2: Waymark CLI Vision

The waymark CLI will provide higher-level commands that wrap these ripgrep patterns with better UX and additional features.

### Core Commands

#### `waymark list` - List waymarks with filtering

```bash
# List all waymarks
waymark list

# Filter by prefix
waymark list --prefix todo
waymark list -p fix,warn  # multiple prefixes

# Filter by properties
waymark list --has priority:high
waymark list --assigned @alice

# Filter by hashtags
waymark list --tag security
waymark list --tags security,critical  # multiple tags

# Combine filters
waymark list -p todo --tag security --assigned @alice
```

#### `waymark search` - Full-text search within waymarks

```bash
# Search in waymark content
waymark search "auth"
waymark search "implement.*cache"  # regex support

# Search with filters
waymark search "validation" --prefix todo
waymark search "critical" --tag security
```

#### `waymark show` - Display waymarks with context

```bash
# Show waymark with code context
waymark show path/to/file.js:42

# Show all in file
waymark show path/to/file.js

# Show with more context
waymark show path/to/file.js:42 --context 5
```

### Task Management

#### `waymark todos` - Specialized todo management

```bash
# List all todos
waymark todos

# My todos
waymark todos --mine  # detects git config user
waymark todos --assigned @alice

# By priority
waymark todos --priority high
waymark todos --critical  # shorthand

# Unassigned todos
waymark todos --unassigned
```

#### `waymark assign` - Manage assignments

```bash
# Assign a todo
waymark assign path/to/file.js:42 @bob

# Bulk assign
waymark assign --tag frontend @carol

# Reassign
waymark assign --from @alice --to @dave
```

#### `waymark done` - Mark completion

```bash
# Mark single waymark as done
waymark done path/to/file.js:42

# Mark by issue
waymark done --issue 234

# Interactive mode
waymark done -i  # shows menu of todos
```

### Reporting

#### `waymark stats` - Statistical analysis

```bash
# Overall stats
waymark stats

# By person
waymark stats --by-person

# By prefix
waymark stats --by-prefix

# By file/directory
waymark stats --by-path src/

# Time-based
waymark stats --since 2024-01-01
```

#### `waymark report` - Generate reports

```bash
# Security audit
waymark report security > security-audit.md

# Sprint planning
waymark report sprint --priority high,critical

# Technical debt
waymark report debt

# Custom format
waymark report --format json
waymark report --format csv
```

### AI Agent Features

#### `waymark agent` - Agent-specific commands

```bash
# Find agent tasks
waymark agent tasks

# Claim a task
waymark agent claim path/to/file.js:42

# Mark progress
waymark agent progress path/to/file.js:42 "Implemented basic structure"

# Complete with summary
waymark agent complete path/to/file.js:42 "Added validation and error handling"
```

### Integration Commands

#### `waymark check` - CI/CD integration

```bash
# Check for issues
waymark check          # exits 1 if critical issues
waymark check --strict # exits 1 if any todos

# Specific checks
waymark check --no-temp     # no temporary code
waymark check --no-security # no security issues
waymark check --all-assigned # all todos assigned
```

#### `waymark sync` - Issue tracker sync

```bash
# Sync with GitHub issues
waymark sync github

# Create issues from waymarks
waymark sync github --create --tag bug

# Update waymarks from issues
waymark sync github --pull
```

### Interactive Features

#### `waymark browse` - TUI browser

```bash
# Interactive browser
waymark browse

# Start in specific view
waymark browse --view todos
waymark browse --view security
```

#### `waymark add` - Interactive waymark creation

```bash
# Add waymark to current position (if editor integration)
waymark add

# Add to specific file
waymark add path/to/file.js:42

# With template
waymark add --template todo
```

### Configuration & Customization

#### Project-level configuration

```bash
# Initialize waymark in project
waymark init

# Configure project
waymark config set prefix.custom "spec"
waymark config set emoji.todo "📝"
```

#### Personal configuration

```bash
# Set your identity
waymark config --global set user.name "@alice"

# Set preferences
waymark config --global set ui.emoji true
waymark config --global set ui.color auto
```

### Advanced Features

#### `waymark watch` - File watching

```bash
# Watch for changes
waymark watch

# Watch with notifications
waymark watch --notify

# Watch specific patterns
waymark watch --prefix "todo,fix"
```

#### `waymark migrate` - Syntax updates

```bash
# Update to latest syntax
waymark migrate --to v2

# Dry run
waymark migrate --dry-run

# Interactive
waymark migrate -i
```

### Output Formats

All commands support multiple output formats:

```bash
# Human-readable (default)
waymark list

# JSON
waymark list --json

# CSV
waymark list --csv

# Machine-readable
waymark list --format "{file}:{line}:{prefix}:{content}"

# Quiet (just file:line)
waymark list -q
```

### Example Workflows

#### Daily standup

```bash
# What did I do yesterday?
waymark list --prefix done --since yesterday --mine

# What am I doing today?
waymark todos --mine --priority high,medium

# Any blockers?
waymark list --has blocked --mine
```

#### Code review

```bash
# Security check
waymark check --security

# TODOs added in this PR
waymark list --prefix todo --since @{upstream}

# Technical debt introduced
waymark report debt --since @{upstream}
```

#### Sprint planning

```bash
# Unassigned high-priority work
waymark todos --unassigned --priority high

# Work by component
waymark todos --group-by tag

# Estimate (if using points)
waymark stats --sum points --prefix todo
```

### Performance Considerations

The CLI should:
- Use ripgrep under the hood for speed
- Cache results when appropriate
- Support `.waymarkignore` for exclusions
- Parallelize operations where possible
- Stream results for large codebases

### Error Handling

Clear, actionable errors:

```bash
$ waymark assign file.js:42 alice
Error: No waymark found at file.js:42
Hint: Did you mean file.js:43? (todo ::: implement caching)

$ waymark done --issue 999
Error: No waymarks reference issue #999
Hint: Use 'waymark list --has "#999"' to search
```