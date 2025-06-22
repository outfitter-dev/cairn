<!-- tldr ::: comprehensive guide to searching waymarks with practical examples -->
# Searching Waymarks

This guide covers searching waymarks using ripgrep and understanding the v1.0 syntax for effective code navigation.

## Quick Start

### Finding Any Waymark

```bash
# Find all waymarks in current directory
rg ":::"

# Find waymarks in specific files/directories
rg ":::" src/
rg ":::" "*.js"

# Count total waymarks
rg ":::" | wc -l
```

### Finding Specific Markers

```bash
# Find todos
rg "todo\s+:::"

# Find critical bugs
rg "fixme\s+:::"

# Find file summaries
rg "tldr\s+:::"

# Multiple markers (OR)
rg "(todo|fixme)\s+:::"
```

## Priority and Signal Searches

<!-- important ::: v1.0 uses signal prefixes for priority, not tags -->

### Priority via Signals

```bash
# Critical items (P0)
rg "!!\w+\s+:::"

# High priority (P1)
rg "!\w+\s+:::"

# Branch-scoped work
rg "\*\w+\s+:::"

# Critical branch work
rg "\*!!\w+\s+:::"

# Items marked for removal
rg "--\w+\s+:::"
```

### Common Signal Patterns

```bash
# Uncertain items needing clarification
rg "\?\w+\s+:::"

# Highly uncertain items
rg "\?\?\w+\s+:::"

# Temporary branch code
rg "\*temp\s+:::"
```

## Tag Searches

<!-- notice ::: v1.0 uses # prefix for all tags, not + -->

### Simple Tags

```bash
# Find by tag
rg "#backend"
rg "#security"

# Tags within waymarks only
rg ":::.*#backend"

# Multiple tags (AND)
rg ":::.*#security.*#auth"

# Tag at word boundary
rg "#api\b"
```

### Relational Tags

```bash
# Issue references (always include #)
rg "#123\b"                    # Find issue 123
rg "#fixes:#\d+"              # All fixes
rg "#blocks:#\d+"             # Blocking issues

# Owner references
rg "#owner:@alice"            # Owned by alice
rg "#cc:@\w+"                # CC'd people

# Context references
rg "#affects:#api"            # Affects API
rg "#for:#auth/login"         # Related to auth/login
```

### Attribute Tags

```bash
# Performance hotspots (both forms)
rg "#(perf:)?hotpath"         # Matches #hotpath and #perf:hotpath

# Security boundaries
rg "#(sec:)?boundary"

# Architecture points
rg "#(arch:)?entrypoint"

# Code characteristics
rg "#(code:)?async"
```

## Actor Searches

```bash
# Find assignments to alice
rg ":::.*@alice"

# Find any assignments
rg ":::.*@\w+"

# Count tasks per person
rg -o "todo\s+:::.*@(\w+)" -r '$1' | sort | uniq -c | sort -nr

# Find delegated AI tasks
rg ":::.*@(agent|claude|max)"
```

## Anchor Searches

<!-- about ::: ##search/anchors stable reference points in code -->

```bash
# Find anchor definitions
rg ":::\s*##\w+"

# Find specific anchor
rg "##auth/login"

# Find references to anchors
rg "#refs:#auth/login"

# Find all anchor references
rg "#refs:##?\w+"
```

## Context and Scope

### Show Surrounding Code

```bash
# Show 2 lines before and after
rg -C2 "todo\s+:::"

# Show 3 lines before, 1 after
rg -B3 -A1 "fixme\s+:::"

# Show only the next line
rg -A1 "tldr\s+:::" --no-line-number
```

### File-Level Analysis

```bash
# List files with todos
rg -l "todo\s+:::"

# Count waymarks per file
rg -c ":::" | sort -t: -k2 -nr

# Files with most todos
rg -c "todo\s+:::" | sort -t: -k2 -nr | head -10

# Find files without waymarks
find . -name "*.js" | xargs -I {} sh -c 'rg -q ":::" {} || echo {}'
```

## Language-Specific Searches

### By Comment Style

```bash
# JavaScript/TypeScript (//)
rg "//.*:::" -g "*.{js,ts,jsx,tsx}"

# Python (#)
rg "#.*:::" -g "*.py"

# HTML/Markdown (<!-- -->)
rg "<!--.*:::" -g "*.{html,md}"

# Multi-line comments
rg -U "/\*[\s\S]*?:::[\s\S]*?\*/" -g "*.{js,java}"
```

### In Specific Contexts

```bash
# In test files only
rg ":::" -g "*test*" -g "*spec*"

# Exclude test files
rg ":::" -g "!*test*" -g "!*spec*"

# In source code only
rg ":::" -g "src/**/*.{js,ts}"

# In documentation
rg ":::" -g "*.md" -g "docs/**"
```

## Advanced Extraction

### Data Mining

```bash
# Extract all unique markers
rg -o "(\w+)\s+:::" -r '$1' | sort | uniq

# Count by marker type
rg -o "(\w+)\s+:::" -r '$1' | sort | uniq -c | sort -nr

# Extract all tags
rg -o "#\w+" | sort | uniq -c | sort -nr

# Find all issue numbers
rg -o "#(\d+)\b" -r '$1' | sort -n | uniq
```

### Statistical Analysis

```bash
# Waymark density (per 100 lines)
echo "scale=2; $(rg -c ":::" | awk -F: '{sum+=$2} END {print sum}') / $(find . -type f -name "*.js" | xargs wc -l | tail -1 | awk '{print $1}') * 100" | bc

# Progress tracking
echo "Open: $(rg "todo\s+:::" | wc -l), Done: $(rg "done\s+:::" | wc -l)"

# Tag distribution
rg -o "#\w+" | sort | uniq -c | sort -nr | head -20
```

## Useful Aliases

Add these to your shell configuration:

```bash
# Basic searches
alias wm='rg ":::"'                          # All waymarks
alias wmt='rg "todo\s+:::"'                  # Todos
alias wmf='rg "fixme\s+:::"'                 # Bugs
alias wmc='rg -C2 ":::"'                     # With context

# Priority searches
alias wm0='rg "!!\w+\s+:::"'                 # P0 Critical
alias wm1='rg "!\w+\s+:::"'                  # P1 High
alias wmb='rg "\*\w+\s+:::"'                 # Branch work

# Analysis
alias wmcount='rg -o "(\w+)\s+:::" -r '\''$1'\'' | sort | uniq -c | sort -nr'
alias wmtags='rg -o "#\w+" | sort | uniq -c | sort -nr | head -20'

# My work
alias wmmine='rg ":::.*@${USER}"'           # Assigned to me
alias wmdone='rg "done\s+:::.*@${USER}"'    # My completed work
```

## Complex Queries

### Multi-Condition Searches

```bash
# High priority security items
rg "!\w+\s+:::.*#security"

# Branch work with specific tag
rg "\*\w+\s+:::.*#backend"

# Assigned but not done
rg "todo\s+:::.*@\w+" | rg -v "done"

# Specific file types with priority
rg "!!\w+\s+:::" -g "*.ts" -g "!*.test.ts"
```

### Time-Based Searches

```bash
# With dates (if included in descriptions)
rg ":::.*2024-"

# Recent files with waymarks
find . -name "*.js" -mtime -7 | xargs rg ":::"

# Stale todos (combine with git)
rg -l "todo\s+:::" | xargs -I {} git log -1 --format="%ar %s" {}
```

### Cross-Reference Searches

```bash
# Find all related to an issue
rg "#123\b|#refs:#issue/123|#fixes:#123"

# Find implementation and tests
rg "##auth/login|#refs:#auth/login"

# Track feature across codebase
rg "#feature:payment|#affects:.*payment|payment.*:::"
```

## Tips and Best Practices

1. **Use word boundaries**: Add `\b` to avoid partial matches
2. **Escape special regex chars**: Use `\.` for literal dots
3. **Use `\s+` for flexibility**: Handles variable spacing
4. **Combine with other tools**: `git`, `find`, `xargs` for powerful workflows
5. **Save complex patterns**: Create aliases for frequently used searches
6. **Use `-C` for context**: Understanding surroundings is crucial
7. **Filter incrementally**: Start broad, then narrow with pipes

## Next Steps

- See [Ripgrep Patterns](ripgrep-patterns.md) for advanced ripgrep techniques
- Check the [Syntax Specification](../../syntax/SPEC.md) for complete v1.0 syntax
- Review [Common Patterns](../patterns/README.md) for waymark best practices

<!-- notice ::: remember to use v1.0 syntax: # for tags, fixme not fix, signals for priority -->