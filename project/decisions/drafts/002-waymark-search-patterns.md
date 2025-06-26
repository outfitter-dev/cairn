---
status: draft
date: 2025-06-24
author: @galligan
related: "001-waymark-syntax-v1.md"
---
<!-- tldr ::: ##adr:002-waymark-search-patterns Establishes :::.*pattern as best practice for waymark searches -->

# ADR-002: Waymark Search Pattern Best Practices

## Context

While implementing ADR-001's search patterns, we discovered that many of our regex patterns could match content outside of waymarks, leading to false positives. For example, searching for `billing` might match:

- Variable names: `const billingService = ...`
- Regular comments: `// Update billing logic`
- String literals: `"Please check your billing information"`
- Documentation: `The billing system processes payments...`

This violates a core principle of waymarks: they should be instantly discoverable with simple grep commands while avoiding noise from non-waymark content.

## Decision

We establish `:::.*` as the foundational pattern prefix for all waymark-specific searches using ripgrep (or compatible tools).

### Core Pattern

The simplest waymark search just looks for the sign itself:

```bash
rg ':::'  # Find all waymarks
```

When you need to search for specific content within waymarks, add `.*` to match any content after the sign:

```bash
rg ':::.*[search-pattern]'
```

Where:

- `:::` - Ensures we're only searching within waymarks
- `.*` - Matches any content between the waymark sign and our search target
- `[search-pattern]` - The specific pattern we're looking for

The `.*` is what enables the pattern to scope searches to waymark content only, preventing false positives from non-waymark code.

**Heads-up about flags**

• **Dot-files / dot-folders**: ripgrep ignores them by default. If your repository stores waymarks inside hidden locations such as `.waymark/`, add `-u` or `-uu` (or `--hidden --no-ignore`) so they are included.

• **PCRE2 features**: Many examples below rely on look-behind / look-ahead and other PCRE2-only constructs. Pass **`-P`** (or its long form `--pcre2`) when running ripgrep or ensure your grep engine supports PCRE2.

A safe "copy-paste everywhere" flag trio is therefore **`-uuP`**.

### Why This Works

The `:::` sign is specifically chosen because it rarely appears naturally in code:

- Not a valid operator in most languages
- Not commonly used in documentation
- Not typical in string literals
- Creates a unique "namespace" for waymark content

- **Better performance**: Regex engine can quickly skip non-waymark lines, and with PCRE2 the scan remains near-linear so backtracking risk is minimal

## Consequences

### Positive

- **Zero false positives**: Only matches content within waymarks
- **Simplified mental model**: One pattern to remember
- **Better performance**: Regex engine skips non-waymark lines in near-linear time, and PCRE2-friendly patterns minimise backtracking risk even with lookarounds
- **Cleaner results**: No filtering needed post-search
- **Consistent approach**: Works for all waymark searches

### Negative

- **Slightly longer patterns**: Adding `:::.*` prefix to searches
- **Learning curve**: Users need to adopt this pattern
  - Some of these patterns can be shell-aliased, and will ultimately be built into tooling for waymark-specific searches.
  - Agent instruction files (e.g. `CLAUDE.md`, `AGENTS.md`) should include some specific patterns so they can know *exactly* how to search for and within waymarks.
- **Not applicable to other tools**: Some IDEs might not support regex search

### Neutral

- **Regex knowledge required**: Users need basic regex understanding
- **Tool-specific syntax**: Some escaping might vary between tools

## Examples

### Basic Searches

```bash
# Find all waymarks
rg ':::'

# Find all waymarks containing "billing"
rg ':::.*billing'                  # Generic: rg ':::.*mysearch'

# Find all todos
rg 'todo :::'

# Find all critical todos
rg '!!todo :::'
```

### Targeted Searches

```bash
# Find waymarks assigned to claude
rg ':::.*@claude'                  # Generic: rg ':::.*@name'

# Find waymarks with security tags
rg ':::.*#security'                # Generic: rg ':::.*#tag'

# Find waymarks with billing in a tag or list
rg ':::.*[,/#]billing\b'           # Generic: rg ':::.*[,/#]mysearch\b'

# Find waymarks that fix issue 123
rg ':::.*fixes:#123'               # Generic: rg ':::.*fixes:#\d+'
```

### Advanced Searches

```bash
# Find waymarks affecting billing system
rg ':::.*affects:[^\\s]*billing'   # Generic: rg ':::.*affects:[^\\s]+'

# Find high-priority work assigned to alice
rg '![a-z]+ :::.*@alice'           # Generic: rg '![a-z]+ :::.*@name'

# Find waymarks with multiple owners (demonstrates arrays)
rg ':::.*owner:@alice,@bob'        # Pattern: rg ':::.*owner:@\w+,@\w+'

# Find only actors (not package references) - requires -P flag
rg -P ':::.*(?<![\w/])@[\w-]+(?!/)'

# Find attribute tags with flexible hierarchy
rg ':::.*#(perf/)?hotpath'       # Matches #hotpath OR #perf/hotpath
rg ':::.*#perf/[^#\s]*'          # All performance attributes
rg ':::.*#sec/boundary'          # Specific security boundary
```

```bash
# Use non-greedy to avoid skipping multiple hits on the same line
rg -P ':::.*?@alice.*?#security'   # Generic: rg -P ':::.*?@name.*?#tag'

# Terse hyphen-agent pattern for claude
rg -Pu ':::.*\b@(?:agent-)?claude(?:-[\w]+)*\b'
```

### Landmark Searches

```bash
# Find landmark definitions
rg ':::.*##\w+'                    # Generic landmarks
rg ':::.*##doc:'                   # Typed landmarks
rg ':::.*##[^:]+:@company'         # Any type for @company

# Find landmark references (without the definition)
rg -P ':::.*(?<!#)#auth/login'     # References to #auth/login landmark
```

### Mixed Values and Complex Patterns

```bash
# Find mixed comma-separated values (demonstrates flexibility)
rg ':::.*affects:#?\w+,#?\w+'      # Matches affects:#api,billing or affects:api,#billing

# Find unassigned critical work
rg -P '!!todo :::(?!.*owner:)'

# Find security work in feature branches
rg ':::.*#security.*branch:feature/' # Pattern: rg ':::.*#tag.*branch:[^\\s]+'
```

### Negative Pattern Searches

```bash
# Find todos NOT assigned to anyone
rg -P 'todo :::(?!.*@\w+)'

# Find waymarks without any tags
rg -P ':::(?!.*#\w+)'

# Find work items without owners
rg -P '(todo|fixme|wip) :::(?!.*owner:)'
```

## Implementation Guidelines

### 1. Understanding Context Markers vs Attribute Tags

As of v1.0, waymarks distinguish between:

- **Context Markers**: `key:value` pairs where the key has NO `#` prefix (e.g., `owner:@alice`, `fixes:#123`)
  - Values can be flexible: plain text (`key:value`), tags (`key:#value`), mixed values: `key:#value,value-2`, actors (`key:@actor`), etc.
- **Attribute Tags**: More specific tags using `/` delimiter (e.g., `#perf/hotpath`, `#sec/boundary`)

```bash
# Context markers (no # on the key)
rg ':::.*owner:@alice'          # NOT #owner:@alice
rg ':::.*fixes:#123'            # NOT #fixes:#123

# Context marker values are flexible
rg ':::.*affects:billing'       # Plain text
rg ':::.*affects:#billing'      # Tag reference
rg ':::.*affects:@billing-team' # Actor reference
rg ':::.*affects:[^\\s]+'        # Pattern: any non-whitespace value

# Attribute tags (use / for hierarchy)
rg ':::.*#perf/hotpath'         # NOT #perf:hotpath
rg ':::.*#sec/boundary'         # NOT #sec:boundary
```

### 2. Always Start with Waymark Context

```bash
# ❌ WRONG - Matches anywhere
rg '#billing'
rg '@alice'
rg 'todo'

# ✅ CORRECT - Only in waymarks
rg ':::.*#billing'
rg ':::.*@alice'
rg 'todo :::'
```

### 3. Position Matters for Markers

For markers (the word before `:::`), the pattern is reversed:

```bash
# Markers come BEFORE :::
rg 'todo :::'
rg '!fixme :::'
rg '\*wip :::'
```

### 4. Combining Patterns

When searching for multiple conditions:

```bash
# Find todos with billing content
rg 'todo :::.*billing'             # Generic: rg 'todo :::.*mysearch'

# Find critical work affecting auth
rg '!!todo :::.*affects:[^\\s]*auth' # Pattern: rg '!!todo :::.*affects:[^\\s]+'

# Find alice's work on security
rg ':::.*@alice.*#security'        # Generic: rg ':::.*@name.*#tag'
```

### 5. Special Characters

Remember to escape special regex characters:

```bash
# Find waymarks with questions
rg '\?todo :::'

# Find waymarks with wildcards
rg '\*todo :::'

# Find exact issue number
rg ':::.*#123\b'
```

### Word-Boundary vs Lookaround

Use `\b` for simple boundaries when surrounding characters are word vs non-word, but prefer lookarounds like `(?<![\w/])…(?!/)` when you need precise control over allowed prefixes or suffixes.

### 6. Escaping Special Characters in Values

Context marker values may contain special regex characters that need escaping:

```bash
# Values with special regex characters (specific examples for clarity)
rg ':::.*branch:feature/\w+'       # Branches with / character
rg ':::.*url:https://[^\\s]+'       # URLs (escape dots if searching for specific domain)
rg ':::.*note:[^:]+\([^)]+\)'      # Notes with parentheses
rg ':::.*version:\d+\.\d+\.\d+'    # Semantic versions
```

## Best Practices

1. **Include hidden files by default**: Remember that ripgrep skips dot-folders (`.*`) unless you add `-u`/`-uu` or `--hidden --no-ignore`.
2. **Start broad, then narrow**: First use `rg ':::.*term'` to see all contexts, then refine
3. **Use word boundaries**: Add `\b` to avoid partial matches: `:::.*\bterm\b`
4. **Check marker+content**: For specific markers with content: `marker :::.*pattern`
5. **Save common searches**: Create aliases for frequently used patterns
6. **Document complex patterns**: Add comments explaining sophisticated searches

## Migration from Old Patterns

Update existing search documentation and scripts:

```bash
# Old approach (multiple searches)
rg '#billing' | grep -v 'variable' | grep -v 'comment'

# New approach (single search)
rg ':::.*[,/#]billing\b'
```

## Tool-Specific Notes

### ripgrep (rg)

Our examples use ripgrep syntax. Key flags:

- `-n` - Show line numbers
- `--with-filename` - Show filenames
- `-u` / `-uu` - Include hidden files/directories (critical for .waymark folders)
- `-P` - Enable PCRE2 for advanced patterns (lookahead/lookbehind)

**Note:** Ripgrep ignores hidden files/folders (`.*`) by default; use `-u`/`-uu` or `--hidden --no-ignore` to include them.

```bash
# Include hidden files and directories
rg -uu ':::.*#waymark'

# Or combine with PCRE2 for advanced patterns
rg -uuP ':::.*(?<![\w/])@[\w-]+(?!/)'
```

### GNU grep

Requires `-E` for extended regex:

```bash
grep -E ':::.*billing'
```

### Other Tools

- **VS Code**: Use regex mode, pattern works as-is
- **IntelliJ**: Enable regex search, may need escaping adjustments
- **vim/neovim**: Use `/:::.*pattern` in search mode

## Future Considerations

1. **Tooling integration**: Build this pattern into waymark-specific tools
2. **Editor plugins**: Auto-prefix searches when in "waymark mode"
3. **Performance optimization**: Pre-index waymark lines for faster searches
4. **Pattern builder**: Interactive tool to construct complex waymark searches

## References

- [ADR-001: Waymark Syntax v1](001-waymark-syntax-v1.md) - Syntax specification
- [ripgrep User Guide](https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md) - Regex patterns and usage