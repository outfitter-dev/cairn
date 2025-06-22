<!-- !tldr ::: ##wm:docs/grep-guide Comprehensive guide to waymark grep patterns with examples -->

# Waymark Grep Patterns Guide

This guide shows how to use the grep patterns embedded in waymark schemas to effectively search your codebase.

## Quick Reference

```bash
# Find all waymarks
rg ":::"

# Find specific marker
rg "todo\s+:::"

# Find critical items
rg "!!\w+\s+:::"

# Find assigned work
rg ":::\s*@alice"

# Find tagged items
rg ":::.*#backend"
```

## Pattern Categories

### 1. Basic Waymark Patterns

Find any waymark:
```bash
rg ":::"                    # All waymarks
rg "\b\w+\s+:::"           # Waymarks with markers
rg "//.*:::"               # Waymarks in line comments
rg "<!--.*:::"             # Waymarks in HTML comments
```

### 2. Marker Patterns

Find specific markers:
```bash
rg "todo\s+:::"            # All todos
rg "fixme\s+:::"           # All fixmes
rg "!todo\s+:::"           # High priority todos
rg "!!todo\s+:::"          # Critical todos
rg "\*todo\s+:::"          # Branch work todos
```

With signals:
```bash
rg "[*!?-]*todo\s+:::"     # Todos with any signal
rg "\*\w+\s+:::"           # All branch work
rg "!!\w+\s+:::"           # All critical items
```

### 3. Actor Patterns

Find assigned work:
```bash
rg ":::\s*@\w+"            # Any assigned waymark
rg ":::\s*@alice"          # Assigned to alice
rg ":::.*@alice"           # Alice mentioned anywhere
rg "#owner:@alice"         # Alice as owner
rg "#cc:@\w*,*@*alice"     # Alice in CC list
```

### 4. Tag Patterns

#### Simple Tags
```bash
rg ":::.*#backend"         # Backend tagged items
rg "#backend\b"            # Exact tag match
rg "#api/v2"               # Hierarchical tag
rg ":::.*#\w+"             # Any tagged waymark
```

#### Relational Tags
```bash
rg "#fixes:#\d+"           # Issue fixes
rg "#owner:@\w+"           # Owner assignments
rg "#blocked:#\d+"         # Blocked by issues
rg "#affects:#\w+(,#\w+)*" # Multiple affects
```

### 5. Array Patterns

#### Base Arrays (Comma-separated)
```bash
# Find alice in CC list
rg "#cc:[^#]*@alice"       # Contains alice
rg "#cc:@alice\b"          # Starts with alice
rg "#cc:@\w*,@*alice"      # Alice anywhere

# Find specific value
rg "#deps:[^#]*lodash"     # Contains lodash
```

#### Extended Arrays

**Bracketed Arrays:**
```bash
rg "#deps:\[[^\]]*react[^\]]*\]"     # Contains react
rg "#deps:\[react"                     # Starts with react
rg "#platforms:\[[^\]]*linux[^\]]*\]"  # Contains linux
```

**Parentheses Arrays:**
```bash
rg "#affects:\([^)]*api[^)]*\)"       # Contains api
rg "#regions:\([^)]*us-east[^)]*\)"   # Contains us-east
```

**Quoted Arrays:**
```bash
rg '#tasks:"[^"]*bug[^"]*"'           # Contains "bug"
rg '#goals:"[^"]*performance[^"]*"'   # Contains "performance"
```

**Object-like Arrays:**
```bash
rg "#config:\{[^}]*debug:true[^}]*\}" # Has debug:true
rg "#env:\{[^}]*prod[^}]*\}"          # Has prod key or value
```

**Pipeline Arrays:**
```bash
rg "#workflow:\[[^\]]*test[^\]]*\]"   # Has test step
rg "#workflow:\[build\s*->"           # Starts with build
rg "#workflow:\[.*->\s*deploy\]"      # Ends with deploy
```

### 6. Anchor Patterns

Find anchor definitions:
```bash
rg ":::\s*##\w+(/\w+)*"    # Any anchor definition
rg ":::\s*##auth/"         # Auth namespace anchors
rg ":::\s*##auth/login"    # Specific anchor
```

Find anchor references:
```bash
rg "#refs:#auth/login"     # References to anchor
rg "#for:#auth/"           # For auth namespace
rg "#auth/login\b"         # Any reference
```

### 7. Complex Queries

Combine patterns for powerful searches:

```bash
# Critical security issues
rg "!!\w+\s+:::.*#security"

# Alice's backend work
rg ":::\s*@alice.*#backend|:::\s*.*#backend.*@alice"

# Branch work with hotfixes
rg "\*\w+\s+:::.*#hotfix"

# Blocked critical items
rg "!!.*:::.*#blocked"

# Find P0 bugs assigned to team
rg "!!fixme\s+:::\s*@(alice|bob|charlie)"
```

### 8. Analysis Patterns

Extract and count:

```bash
# Count by marker type
rg -o "\b(\w+)\s+:::" | sed 's/\s*::://' | sort | uniq -c | sort -nr

# Count by assignee
rg -o ":::\s*@\w+" | sed 's/:::\s*//' | sort | uniq -c | sort -nr

# Count tags
rg -o ":::.*" | rg -o "#\w+" | sort | uniq -c | sort -nr

# Find most blocked issues
rg -o "#blocks:#\d+" | sed 's/#blocks:#//' | sort | uniq -c | sort -nr
```

## Advanced Patterns

### Negative Lookarounds

Find untagged waymarks:
```bash
rg ":::[^#]*$"             # No tags at all
rg ":::(?!.*#backend)"     # Not tagged backend (PCRE2)
```

### Multi-line Patterns

Find waymarks with specific follow-up:
```bash
rg -U "todo :::.*\n.*implement"  # Todo followed by implement
```

### Context Searches

Get surrounding code:
```bash
rg -C3 "!!fixme"           # 3 lines context
rg -B2 -A5 "#hotpath"      # 2 before, 5 after
```

## Tips

1. **Use `-F` for literal searches**: `rg -F "#fixes:#123"`
2. **Case insensitive**: `rg -i "todo :::"`
3. **File type filtering**: `rg ":::" --type js`
4. **Exclude paths**: `rg ":::" --glob "!node_modules"`
5. **Pretty output**: `rg ":::" --pretty`

## Integration with Tools

### Generate TODO list
```bash
rg "todo\s+:::" --no-filename | sed 's/.*todo :::\s*/- [ ] /'
```

### Find work by priority
```bash
echo "=== CRITICAL ==="
rg "!!todo" --no-filename
echo "=== HIGH ==="
rg "!todo" --no-filename | grep -v "!!"
echo "=== NORMAL ==="
rg "todo\s+:::" --no-filename | grep -v "!"
```

### Export to JSON
```bash
rg ":::" --json | jq '.data.lines.text' | jq -s '.'
```

## Schema Integration

The waymark schemas include these patterns directly:
- Check `grep-patterns.schema.json` for all patterns
- Each pattern includes variants and examples
- Use schema patterns for consistent searching

This integration ensures your searches always match the waymark specification.