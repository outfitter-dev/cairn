<!-- tldr ::: advanced ripgrep patterns and techniques for waymark searches -->
# Ripgrep Patterns and Recipes

This guide provides advanced ripgrep patterns and recipes for searching waymarks efficiently.

<!-- important ::: all examples use waymark v1.0 syntax with # for tags and signals for priority -->

## Ripgrep Basics for Waymarks

### Essential Flags

```bash
# Context flags
-C NUM    # Show NUM lines before and after match
-B NUM    # Show NUM lines before match
-A NUM    # Show NUM lines after match

# Output control
-l        # List only filenames
-c        # Count matches per file
-o        # Show only matching part
-n        # Show line numbers (default)
-N        # Hide line numbers
-I        # Case insensitive

# File selection
-g GLOB   # Include/exclude files
-t TYPE   # Search only in file type
```

### Performance Tips

```bash
# Use fixed strings when possible (faster)
rg -F "todo :::"                    # No regex parsing

# Limit search scope
rg ":::" src/                       # Search specific directory
rg ":::" -g "*.js"                  # Only JavaScript files

# Use .ripgreprc for defaults
echo "--smart-case" >> ~/.ripgreprc
echo "--max-columns=150" >> ~/.ripgreprc
```

## Pattern Recipes

### Signal Detection Patterns

```bash
# Branch work patterns
rg '^\s*//\s*\*\w+\s+:::'          # Star signals at line start
rg '\*!!\w+\s+:::'                 # Critical branch work
rg '\*\w+\s+:::.*#hotfix'          # Branch hotfixes

# Priority cascades
rg '!{1,2}\w+\s+:::'               # Any priority (!todo or !!todo)
rg '(?:^|\s)!!\w+\s+:::'           # Critical only
rg '!\w+\s+:::(?!.*!)'             # High but not critical

# Uncertainty patterns
rg '\?{1,2}\w+\s+:::'              # Questions and uncertainties
rg '\?\w+\s+:::.*\?'               # Questions in description too

# Removal patterns
rg '-{1,2}\w+\s+:::'               # Marked for removal
rg '--\w+\s+:::.*deprecated'       # Urgent removal + deprecated
```

### Tag Pattern Variations

```bash
# Flexible tag matching
rg '#\w+'                          # Any tag
rg '#\w+\b'                        # Tag at word boundary
rg '(?<!\w)#\w+'                   # Tag not preceded by word char

# Compound tags
rg '#\w+:\w+'                      # Relational tags
rg '#\w+:#\d+'                     # Issue references
rg '#\w+:@\w+'                     # Actor references

# Array values
rg '#\w+:\w+(?:,\w+)+'            # Arrays like #cc:@alice,@bob
rg '#affects:#\w+(?:,#\w+)*'      # Multiple affected items
```

### Anchor Patterns

```bash
# Anchor definitions
rg ':::\s*##\w+(?:/\w+)*'         # Hierarchical anchors
rg '^[^#]*##\w+'                  # Anchor at line start

# Anchor references
rg '#refs:##?\w+'                 # References (# or ## prefix)
rg '#refs:#[\w/]+'                # With path segments

# Find orphaned references
rg -o '#refs:(#\w+(?:/\w+)*)' -r '$1' | sort | uniq > refs.txt
rg -o '##(\w+(?:/\w+)*)' -r '##$1' | sort | uniq > defs.txt
comm -23 refs.txt defs.txt        # References without definitions
```

### Actor Patterns

```bash
# Actor assignments
rg '@\w+(?:\.\w+)*'               # Handles @team.member format
rg ':::\s*@\w+'                   # Actor as first token
rg '#(?:owner|cc|reviewer):@\w+'  # Actor in tags

# Team patterns
rg '@(?:frontend|backend|qa)'     # Specific teams
rg ':::.*@\w+team\b'              # Any team assignment

# AI agent patterns
rg '@(?:agent|claude|max|ai)'     # AI delegations
rg ':::.*@agent\s+\w+'            # Agent with verb
```

## Advanced Extraction

### Structured Data Extraction

```bash
# Extract marker-actor pairs
rg -o '(\w+)\s+:::\s*@(\w+)' -r '$1:$2' | sort | uniq

# Extract tag values
rg -o '#(\w+):(\w+)' -r '$1=$2' | sort | uniq

# Build assignment matrix
rg -o '(\w+)\s+:::.*@(\w+)' -r '$2,$1' | \
  awk -F, '{count[$1][$2]++} 
  END {for(person in count) {
    printf "%s:", person; 
    for(marker in count[person]) 
      printf " %s(%d)", marker, count[person][marker]; 
    print ""
  }}'
```

### Multi-File Analysis

```bash
# Find files with multiple priority levels
for file in $(rg -l ":::")
do
  critical=$(rg -c "!!\w+\s+:::" "$file" 2>/dev/null || echo 0)
  high=$(rg -c "!\w+\s+:::" "$file" 2>/dev/null || echo 0)
  if [[ $critical -gt 0 && $high -gt 0 ]]; then
    echo "$file: critical=$critical high=$high"
  fi
done

# Tag co-occurrence analysis
rg -o ':::.*' | \
  grep -o '#\w\+' | \
  awk '{tags[$0]++} END {for(t in tags) if(tags[t]>5) print tags[t], t}' | \
  sort -nr
```

### Time-Based Analysis

```bash
# Combine with git for temporal analysis
rg -l "todo\s+:::" | while read file
do
  last_modified=$(git log -1 --format="%ar" -- "$file")
  todo_count=$(rg -c "todo\s+:::" "$file")
  echo "$last_modified: $file ($todo_count todos)"
done | sort

# Find stale branch work
rg -l "\*\w+\s+:::" | xargs -I {} git log -1 --format="%ad %ae {}" --date=short {} | \
  awk '$1 < "'$(date -d '30 days ago' '+%Y-%m-%d')'" {print}'
```

## Complex Multi-Pattern Searches

### Conditional Patterns

```bash
# TODO with no assignee
rg 'todo\s+:::(?!.*@\w+)'

# High priority without due date
rg '!\w+\s+:::(?!.*(?:due|until|by):)'

# Branch work not marked critical
rg '\*(?!!)\w+\s+:::'

# Security issues not assigned
rg ':::.*#security(?!.*@\w+)'
```

### Lookaround Patterns

```bash
# Tags not in waymarks
rg '(?<!:::.*?)#\w+'

# Waymarks without tags
rg '\w+\s+:::[^#]*$'

# Multiple tags required
rg ':::(?=.*#backend)(?=.*#api)'

# Exclude pattern
rg ':::(?!.*#deprecated).*#api'
```

## Ripgrep Configuration

### Project-Specific .ripgreprc

```bash
# Create project-specific config
cat > .ripgreprc << 'EOF'
# Waymark-specific settings
--smart-case
--max-columns=200
--max-columns-preview

# Type definitions
--type-add=waymark:*.{js,ts,py,md,java,go,rs}

# Ignore patterns
--glob=!*.min.js
--glob=!**/node_modules/**
--glob=!**/dist/**

# Custom type for docs
--type-add=docs:*.{md,mdx,rst,txt}
EOF
```

### Useful Shell Functions

```bash
# Add to ~/.bashrc or ~/.zshrc

# Waymark context search
wmc() {
  local pattern="${1:-:::}"
  local context="${2:-2}"
  rg -C"$context" "$pattern"
}

# Waymark stats
wmstats() {
  echo "=== Waymark Statistics ==="
  echo "Total: $(rg -c ':::'  | awk -F: '{sum+=$2} END {print sum}')"
  echo ""
  echo "By Marker:"
  rg -o '(\w+)\s+:::'  -r '$1' | sort | uniq -c | sort -nr | head -10
  echo ""
  echo "By Priority:"
  echo "  Critical: $(rg '!!\w+\s+:::'  | wc -l)"
  echo "  High: $(rg '(?<!!)!\w+\s+:::'  | wc -l)"
  echo "  Branch: $(rg '\*\w+\s+:::'  | wc -l)"
  echo ""
  echo "Top Tags:"
  rg -o '#\w+' | sort | uniq -c | sort -nr | head -10
}

# Find waymark in function context
wmfunc() {
  local pattern="$1"
  # Attempt to show the containing function
  rg -B 20 "$pattern" | tac | grep -m 1 -E '(function|def|class|const.*=.*=>)' | tac
  rg -A 5 "$pattern"
}

# Interactive waymark search with fzf
wmi() {
  local selected=$(rg ":::" --line-number | fzf --preview 'echo {} | cut -d: -f1-2 | xargs bat --color=always --highlight-line={2}')
  if [[ -n "$selected" ]]; then
    local file=$(echo "$selected" | cut -d: -f1)
    local line=$(echo "$selected" | cut -d: -f2)
    ${EDITOR:-vim} "+$line" "$file"
  fi
}
```

## Performance Optimization

### Large Codebase Strategies

```bash
# Use file type restrictions
rg ":::" -t js -t ts              # Only JS/TS files

# Parallel execution for analysis
find . -name "*.js" -print0 | \
  xargs -0 -P 8 -I {} rg -c ":::" {} 2>/dev/null | \
  awk -F: '{sum+=$2; files++} END {print "Files:", files, "Waymarks:", sum}'

# Incremental search
rg -l ":::" > waymark-files.txt
cat waymark-files.txt | xargs rg "todo\s+:::"

# Binary file exclusion
rg ":::" --binary-skip
```

### Memory-Efficient Patterns

```bash
# Stream processing for large results
rg ":::" --max-columns=150 | while read line
do
  # Process each line without loading all into memory
  echo "$line" | grep -q "#critical" && echo "$line"
done

# Chunked processing
rg -l ":::" | split -l 100 - waymark-chunks-
for chunk in waymark-chunks-*
do
  cat "$chunk" | xargs rg "todo\s+:::" > "results-$chunk"
done
```

## Integration Examples

### Git Integration

```bash
# Pre-commit hook to check branch work
#!/bin/bash
if rg -q '\*\w+\s+:::' $(git diff --cached --name-only); then
  echo "Warning: Branch-scoped waymarks (*) found in commit"
  echo "These should be resolved before merging:"
  rg '\*\w+\s+:::' $(git diff --cached --name-only)
  exit 1
fi
```

### CI/CD Integration

```bash
# GitHub Actions example
- name: Check Critical Waymarks
  run: |
    if rg -q '!!\w+\s+:::'; then
      echo "::error::Critical waymarks found"
      rg -n '!!\w+\s+:::'
      exit 1
    fi

# Jenkins pipeline
stage('Waymark Analysis') {
  steps {
    sh '''
      rg ":::" --stats | tail -10
      rg '!!\w+\s+:::' || true
    '''
  }
}
```

## Common Pitfalls and Solutions

### Regex Escaping

```bash
# Wrong: Treats * as regex quantifier
rg "*todo :::"                    # Error!

# Right: Escape the asterisk
rg "\*todo :::"                   # Correct

# Alternative: Use fixed string
rg -F "*todo :::"                 # Also correct
```

### Performance Issues

```bash
# Slow: Complex lookarounds
rg '(?=.*#tag1)(?=.*#tag2)(?=.*#tag3)'

# Fast: Progressive filtering
rg ":::" | rg "#tag1" | rg "#tag2" | rg "#tag3"

# Faster: Limit file scope first
rg -l "#tag1" | xargs rg "#tag2" | rg "#tag3"
```

### Unicode and Special Characters

```bash
# Handle non-ASCII in team names
rg '@\p{L}+'                      # Unicode letter support

# Handle special chars in paths
rg '#refs:#[\w/\-\.]+'           # Include dash and dot
```

## Next Steps

- Review [Search Overview](README.md) for basic patterns
- See [Syntax Specification](../../syntax/SPEC.md) for complete v1.0 reference
- Check [Waymark Usage](.agents/partials/waymark-usage.md) for best practices

<!-- tip ::: combine ripgrep with fzf, bat, and delta for powerful interactive workflows -->