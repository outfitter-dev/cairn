<!-- tldr ::: proposal for unified # syntax to simplify waymark context system -->
# Unified Hash Syntax Proposal

## Overview

This proposal introduces a unified `#` syntax that collapses multiple context patterns (properties, tags, references) into a single, consistent system. Waymarks are identified by the waymark sign `:::` which separates the scope from the content.

## Core Change

**Everything after the `:::` waymark sign that provides metadata now uses the `#` prefix.**

### Key Principles

1. **Unified Tag System**: Everything is a tag if it has a `#` prefix
   - Simple tags: `#backend`, `#security`, `#auth`, `#perf`
   - Tags with values: `#priority:high`, `#status:blocked` (or use shortcuts: `#p1`, `#blocked`)
   - Multiple tags: `#sec #auth` (two independent tags, not hierarchical)
   - Numeric references: `#123` (expands to `#id:123`)

2. **Actors Remain Separate**: The `@` prefix for actors is unchanged
   - Actors appear first in content: `todo ::: @alice implement auth`
   - Or as tag values: `todo ::: implement auth #owner:@alice`

3. **Strict `#` Prefix Rule**: The parser requires `#` on all tags
   - This enables `rg "#"` to find ALL metadata in waymarks
   - **ENFORCED**: Tag values MUST have `#`: `#fixes:#123` not `#fixes:123`
   - **Linter error**: Missing `#` in numeric references is not optional
   - **Auto-fix**: Formatter adds missing `#` automatically
   - Exception: Actor values already have `@`: `#owner:@alice`

### Tag Forms and Patterns

- `#tag` - Simple tag (standalone)
- `#type:value` - Tag with explicit value (e.g., `#env:prod`, `#priority:high`)
- `#parent/child` - Hierarchical tag (e.g., `#billing/subscriptions`, `#auth/oauth`)
- `#tag1 #tag2` - Multiple independent tags
- `#fixes:#123` - Tag with greppable reference value
- `#owner:@alice` - Tag with actor value (@ already greppable)
- `#123` - Numeric reference (hydrated by parser to `#id:123` via config)

**Multiple instances of the same tag are perfectly valid:**

```text
// Multiple dependencies
todo ::: implement payment flow #depends:#123 #depends:#456 #depends:#789

// Multiple owners/reviewers
review ::: security audit needed #owner:@alice #owner:@bob #reviewer:@security-team

// Multiple affected systems
fix ::: resolve data sync #affects:billing #affects:reporting #affects:analytics

// Mixed formats (both valid)
todo ::: update API #fixes:#123 #fixes:#456                    // Multiple tags
todo ::: update API #fixes:#123,#456,#789                       // Comma-separated
```

**Parser Operations:**

- **Expansion**: Tag map lookup for aliases and type mappings
  - Alias expansion: `#p0` → `#priority:critical`
  - Built-in shortcuts: `#sev1` → `#severity:high`  
  - Domain mapping (optional): `#auth` → `#domain:security` (if configured)
  - NO forced hierarchy: `#auth` doesn't become `#security/auth`
- **Hydration**: Runtime enrichment with metadata
  - Issue refs: `#123` → `{id: 123, url: "github.com/...", platform: "github"}`
  - Adds context without changing the tag structure

### What Changes

| Old Syntax | New Syntax | Notes |
|------------|------------|-------|
| `priority:high` | `#priority:high` | Properties → tags with values |
| `+backend` | `#backend` | Tag prefix change |
| `fixes:#123` | `#fixes:#123` | Keep `#` in values |
| `depends:#456` | `#depends:#456` | Keep `#` in values |
| `@alice` | `@alice` | Actors unchanged |
| `owner:@alice` | `#owner:@alice` | Property → tag, actor unchanged |

## Terminology Updates

Below are the new terms and their definitions. They are numbered in the specific sequence by which changes should be made to avoid naming conflicts during migration.

### 1. `context` / `context tokens` → REMOVE

- **Action**: Remove these terms entirely
- **Migration notes**:
  - "Context tokens" were `key:value` pairs after `:::` (e.g., `priority:high`)
  - These are now just properties/tags with `#` prefix
  - Search and remove all instances of "context" and "context tokens" from docs
  - The grammar section that refers to "context token" should be updated

### 2. Current "markers" → `waymark types`

- **Old**: Markers like `todo`, `fix`, `note`
- **New**: Waymark types
- **Migration notes**:
  - What we called "markers" are now "waymark types"
  - Update all references: "marker" → "waymark type" (when referring to todo, fix, etc.)
  - Update lists/categories from "marker groups" to "waymark type groups"
  - This MUST be done before changing sigil → sign to avoid confusion

### 3. `sigil` → `waymark sign`

- **Old**: `sigil` (the `:::` separator)
- **New**: `waymark sign` (or just `sign` for brevity)
- **Deprecated patterns**: `:M:`, `:ga:` (remove if found)
- **Migration notes**:
  - NOW safe to replace all instances of "sigil" with "waymark sign" or "sign"
  - Update: "waymarks are identified by the waymark sign `:::`"
  - Check for any remaining deprecated patterns

### 4. Add new term: `scope`

- **Definition**: What appears before the `:::` waymark sign
- **Content**: Can contain either a waymark type (`todo`) or a tag (`#123`)
- **Structure**: `[scope] ::: [content]`
- **Migration notes**:
  - This is a new conceptual term
  - Update grammar to show scope/content structure
  - "The scope contains either a waymark type or a tag"

### 5. `+tag` → `#tag`

- **Old**: Tags with `+` prefix (e.g., `+backend`)
- **New**: Tags with `#` prefix (e.g., `#backend`)
- **Migration notes**:
  - Replace all `+tag` patterns with `#tag`
  - Properties now also use `#` (e.g., `priority:high` → `#priority:high`)
  - Exception: `#123` for issues was already using `#`, no change needed

### 6. `references` → Special case of `tag`

- **Old**: Separate concept for `#123`, `fixes:#456`
- **New**: These are just tags with values
- **Migration notes**:
  - No longer a separate category
  - `fixes:#123` becomes `#fixes:#123` (keep the `#` for greppability)
  - Update any docs that list references separately

### 7. `property`/`properties` → Tags with values

- **Old**: Separate concept for `key:value` pairs (e.g., `priority:high`)
- **New**: These are now just tags with values (e.g., `#priority:high`)
- **Migration notes**:
  - Properties are no longer a separate concept
  - They're unified under the tag system with `#` prefix
  - Update docs to refer to "tags with values" instead of "properties"
  - The term "property" may still appear in tag map configurations

### 8. No change terms

- **`signal`**: Remains the same (!, !!, ?, ??, -, --, *, _)
- **`actor`**: Remains the same (@alice, @team)
  - But update any "attention" or "@mention" references to "actor"
  - Actors should appear first in content after `:::` unless explicitly as a value for a tag (e.g. `#owner:@alice`)
  - Any `assign:@alice` or `assignee:@alice` should be updated to `::: @alice [rest of prose/tags]`

### Critical: Handling Colons in Prose

**Best Practice: Place tags after prose** to avoid colon ambiguity entirely:

```text
// RECOMMENDED - tags after prose (colons are always safe)
todo ::: implement the login flow: first validate, then authenticate #auth #backend
todo ::: handle errors: timeout, network, auth #status:pending #backend

// PROBLEMATIC - tags before prose with colons (parser may misinterpret)
todo ::: #auth implement the login: validate then authenticate  // "validate" might be parsed as value of "login"

// SOLUTION if tags must come first - quote the prose
todo ::: #auth "implement the login: validate then authenticate"

// OR ensure tags are "closed" with values before prose
todo ::: #priority:high #auth implement the login: validate then authenticate
```

**Parser Rules:**

1. Tags at the END of content never cause ambiguity - preferred pattern
2. Tags BEFORE prose with colons may cause the parser to misinterpret prose as tag values
3. A tag with an explicit value (e.g., `#priority:high`) is "closed" - subsequent colons are safe
4. The linter should encourage tags-after-prose pattern and warn about ambiguous cases

### Tag Value Auto-Closure

**Tag values automatically close when another `#` tag is encountered**, eliminating the need for quotes in most cases:

```text
// Auto-closure - no quotes needed
todo ::: @alice #message: implement the new auth flow with OAuth2 #priority:high
todo ::: #status: waiting for API team to finish endpoints #blocked #backend

// Quotes STILL REQUIRED when value contains:
// 1. Colons (would create ambiguity)
todo ::: #message: "the process is: first validate, then authenticate" #auth

// 2. Hash without space (could be misinterpreted, quotes are required)
todo ::: #message: check the #123 issue for details #backend // would separate "check the" and "#123" - needs quotes
todo ::: #message: "check the #123 issue for details" #backend // correct - recognizes the #123 as part of the string value for #message

// 3. When no closing tag follows
todo ::: #message: this needs quotes at the end without another tag
// vs
todo ::: #message: "this needs quotes at the end without another tag"
```

**Auto-Closure Rules:**

1. A `#tag:value` automatically closes when the parser encounters another ` #` (space + hash)
2. Values containing `:` or `#` characters MUST be quoted to avoid ambiguity
3. Values at the end of content (no following tag) SHOULD be quoted for clarity
4. The parser treats ` #` as a definitive tag boundary, making most quotes unnecessary

### Tag Map and Expansion

The tag map primarily provides aliases for common patterns, not forced hierarchies:

```text
// Independent tags - perfectly valid
#auth #security                    // Two separate tags
#backend #performance              // Two separate tags

// Type:value relationships
#env:prod                          // Environment type with prod value
#domain:security                   // Domain type with security value
#status:blocked                    // Status type with blocked value

// Hierarchical relationships using /
#billing/subscriptions             // Subscriptions as part of billing
#auth/oauth                        // OAuth as part of auth
#frontend/components/button        // Button in components in frontend

// Tags with values - always use # for greppability
#fixes:#123                        // CORRECT - can grep for #123
#blocked:#456                      // CORRECT - can find the blocking issue
#owner:@alice                      // @ is already greppable, no # needed

// Simple values
#priority:high                     // Or use shortcut #p1
#status:blocked                    // Or just use #blocked as a tag
```

**Key Distinction - When to use `:` vs `/`**:

- **Use `:` for type:value** - When specifying a value for a category
  - `#env:prod` - prod is a value of env type
  - `#priority:high` - high is a value of priority type
  - `#domain:security` - security is a value of domain type
  
- **Use `/` for hierarchies** - When showing parent/child relationships
  - `#billing/subscriptions` - subscriptions is part of billing
  - `#auth/oauth/google` - google oauth under auth
  - `#frontend/components/button` - button component in frontend

**Greppability Principle**: Always use `#` for values that should be discoverable:

- `#fixes:#123` - Both `#fixes` and `#123` are greppable
- `#blocked:#456` - Both `#blocked` and `#456` are findable
- Simple tags like `#auth` remain simple unless YOU want hierarchy

```bash
# Find issue 123 regardless of how it's referenced
rg ":#?123\b"        # Matches both :123 and :#123
rg ":#?123(?=\s|,|]|$)"  # More precise: ensures word boundary
```

**Critical Greppability Principle**: The linter MUST enforce `#` in all reference values to maintain search consistency. The formatter automatically fixes violations:

```bash
# Before formatting (linter error):
todo ::: fix auth bug fixes:123 depends:456

# After waymark format --fix:
todo ::: fix auth bug #fixes:#123 #depends:#456
```

However, these universal search patterns ensure backward compatibility during migration:

```bash
# Find ANY reference to issue 456, regardless of format:
rg "(:|#)456\b"                      # Matches both :456 and #456
rg "(fixes|depends|blocks):[^\s]*#?456" # In any relationship context
rg "#456\b"                          # As standalone tag or in values
```

### Multiple Values: Multiple Tags vs Comma-Separated

**RECOMMENDATION: Strongly prefer multiple tags** for maximum greppability:

```text
// PREFERRED: Multiple tags (fully greppable)
todo ::: implement feature #depends:#123 #depends:#456 #depends:#789  
// ✓ rg "#456" finds it
// ✓ rg "#depends:" finds all dependencies
// ✓ rg "#depends:#456" finds this specific dependency (simple, no regex)

// ALTERNATIVE: Comma-separated (more compact, requires regex)
todo ::: implement feature #depends:#123,#456,#789
// ✓ rg "#456" finds it
// ✓ rg "#depends:" finds all dependencies
// ✗ rg "#depends:#456" won't match directly
// ✓ rg "#depends:[^ ]*#456" WILL find it (with regex)

// With brackets (if supported)
todo ::: implement feature #depends:[#123, #456, #789]
// ✓ rg "#depends:\[.*#456.*\]" finds it
```

**Configuration Option:**

Teams can configure their preference in `.waymark/config.yml`:

```yaml
format:
  multiple_values: "separate"  # separate (default) | comma | brackets
  
# When set to "separate", the formatter will convert:
# #depends:#123,#456 → #depends:#123 #depends:#456
#
# When set to "comma", the formatter will convert:
# #depends:#123 #depends:#456 → #depends:#123,#456
```

**Ripgrep patterns for comma-separated values:**

```bash
# Find #456 as a dependency in comma-separated lists
rg "#depends:[^ ]*#456"              # Matches until first space
rg "#depends:([^ ]*,)*#456"          # More precise, ensures comma context

# Find #456 in bracket arrays
rg "#depends:\[.*#456.*\]"           # Matches within brackets
rg "#depends:\[[^\]]*#456[^\]]*\]"   # More precise bracket matching

# UNIVERSAL PATTERN: Find any reference to #456 regardless of format
rg "#(depends|blocks|fixes|refs):[^\s]*#?456\b"  # Finds #456 in any relation
rg ":#?456\b"                        # Simple: finds :456 or :#456 anywhere
rg "#456\b"                          # Simplest: finds #456 as standalone or in values
```

**When to use `waymark find` vs regex:**

- Use `waymark find` for semantic understanding ("all todos depending on #456")
- Use regex when you need the flexibility but can handle the complexity
- **STRONGLY prefer multiple tags** when simple searches are more important than compactness

**Linter Configuration:**

```yaml
# .waymark/config.yml
linting:
  reference_format: "strict"  # strict (default) | warn | fix
  # strict: Error on missing # in references
  # warn: Warning on missing # in references  
  # fix: Auto-add missing # during lint --fix
  
  greppability_required: true  # Always enforce # in numeric values
```

**Parser/Linter Behavior**:

- **Parser**: Treats each `#tag` as independent unless explicitly hierarchical
- **Linter**: **STRICTLY enforces** `#` on numeric/reference values (no exceptions)
  - `#fixes:123` → **ERROR**: Must be `#fixes:#123`
  - `#depends:456` → **ERROR**: Must be `#depends:#456`
- **Formatter**: Automatically adds missing `#` in reference values
- **Tag Map**: Provides convenient aliases (e.g., `#p0` → `#priority:critical`)
- **No Forced Expansion**: `#auth` stays `#auth` unless configured otherwise

## What This Eliminates

### Current Syntax → New Syntax

**Properties (`:` delimiter)**

```text
// Current
todo ::: implement auth priority:high
// New
todo ::: implement auth #priority:high
```

**Tags (`+` prefix)**

```text
// Current  
fix ::: memory leak +backend +performance
// New
fix ::: memory leak #backend #performance
```

**References (`#` already, but now consistent)**

```text
// Current
todo ::: fixes:#123 depends:#456
// New
todo ::: #fixes:#123 #depends:#456
```

## Scopes and Waymark Types

What appears before the `:::` waymark sign is the "scope". The scope contains either a waymark type or a tag.

### Core Waymark Types (built-in, no `#` needed)

These are the standard waymark types that can appear in the scope:

- `tldr` - Brief summary or overview
- `todo` - Work to be done
- `fix` - Problems to solve
- `refactor` - Code that needs restructuring
- `note` - Information to remember
- `alert` - Warnings or important notices
- `temp` - Temporary code
- `idea` - Suggestions/proposals
- `about` - Explains purpose or context
- `example` - Usage examples
- `ci` - CI/CD related markers
- `always` - Always-on markers

### Tags as Scopes (implicit `#` treatment)

Any non-core token in the scope (before the `:::` waymark sign) is treated as a tag with implicit `#`:

```text
// These are equivalent:
#123 ::: implement OAuth as specified
123 ::: implement OAuth as specified    // Treated as #123

// These are equivalent:
#sec ::: SQL injection vulnerability
sec ::: SQL injection vulnerability     // Treated as #sec
```

**Important**: The scope MUST be a single, non-breaking string (no spaces).

### Parser vs Linter Behavior

- **Parser**: Permissive - accepts any single token in the scope (before the waymark sign)
- **Runtime**: Non-waymark-type tokens in scope get implicit `#` treatment
- **Linter**: Can enforce explicit `#` prefix for tags used as scopes (configurable strictness)

This approach ensures existing waymarks remain valid while providing a migration path to stricter conventions.

## Benefits

1. **Simplified patterns** - Properties and tags unified under `#`
2. **Eliminates false positives** - `:` in prose no longer conflicts
3. **Unified search** - `rg "#blocked"` finds all blocked items
4. **Extensible** - Teams can define custom aliases without syntax changes
5. **Greppable values** - `#priority:high` makes both `#priority` and `:high` searchable
6. **Backward compatible** - Existing waymarks remain valid, just interpreted as custom scopes

## Choosing Tag Forms

**DEFAULT RECOMMENDATION: Keep it simple, use `#` for greppability**

1. **Simple tags**: `#auth`, `#backend`, `#security` - perfectly valid as independent tags
2. **Tags with values**: Always use `#` for numeric/reference values
   - `#fixes:#123` ✓ (both parts greppable)
   - `#blocked:#456` ✓ (can find the blocking issue)
   - `#priority:high` ✓ (context clear, or use `#p1` shortcut)
3. **Only add hierarchy when it adds value**: Don't force relationships

### Self-Descriptive vs Enhanced Tags

Some tags work beautifully both ways:

```text
// Self-descriptive standalone
todo ::: implement caching #blocked
// Clear that work is blocked, reason may be obvious from context

// Enhanced with specific blocker
todo ::: implement caching #blocked:#123
// Shows exactly what's blocking (issue 123)

// Alternative patterns
todo ::: implement caching #blocked #by:#123 #needs:api-v2
// Multiple tags provide rich context while remaining individually searchable
```

The beauty of tags like `#blocked`, `#deprecated`, `#urgent` is they convey immediate meaning while allowing optional enhancement.

**When to use different forms:**

**Simple tags (`#auth #security`) when:**

- Tags are conceptually independent
- You want maximum flexibility
- Building up conventions organically

**Type:value tags (`#env:prod`, `#priority:high`) when:**

- You're specifying a value for a category
- The tag represents a type with specific instances
- You need structured classification

**Hierarchical tags (`#billing/subscriptions`, `#auth/oauth`) when:**

- There's a true parent-child relationship
- The child is a logical part of the parent
- You want to organize within a namespace

**Reference tags (`#fixes:#123`, `#blocks:#456`) when:**

- Linking to issues or other work items
- The value is independently searchable
- ALWAYS use `#` for greppability

**Version tags (both forms valid):**

```text
// Simple version tags (concise, greppable)
deprecated ::: removed in next release #v3.0
todo ::: migrate before #v2.5 ships #migration
fix ::: regression since #v2.3.1 #bug

// Type:value form (explicit categorization)
note ::: breaking change #version:3.0 #breaking
todo ::: backport to #version:2.4.x #backport

// Mixed usage in practice
fix ::: bug introduced in #v2.3, needs backport #version:2.4.x #version:2.5.x
```

```bash
# Find version 2.3 in either format
rg "#(version:|v)2\.3"              # Matches #v2.3 OR #version:2.3

# Find any version starting with 2
rg "#(version:|v)2\."               # Matches #v2.x OR #version:2.x

# Find any semver-like version
rg "#(version:|v)\d+\.\d+(\.\d+)?"  # Matches #v1.2.3 OR #version:1.2.3
```

### Formatter Support

The waymark formatter could transform between forms:

```bash
waymark format --tags compact      # Convert to shortest aliases
waymark format --tags canonical    # Convert to standard form
waymark format --tags expanded     # Convert to greppable form
waymark format --tags breadcrumb   # Expand to all components
```

## Built-in Tag Patterns

The waymark parser includes a core tag patterns file with essential aliases:

```
waymark/
├── core-tags.yaml         # Essential built-in tags (shipped with waymark)
└── .waymark/
    └── custom-tags.yaml   # User-defined patterns (optional)
```

### Core Tag Patterns

The parser always loads `core-tags.yaml` which defines essential built-in aliases:

```yaml
# tag-patterns/core.yaml
# Essential aliases and patterns that ship with waymark
version: "1.0"
preset_name: core

priority:
  patterns: ["priority:(critical|high|medium|low)", "p[0-3]", "urgent", "asap", "blocker"]
  format_rules:
    default: "preserve"    # Default behavior: keep tags as written
    normalize_duplicates: true  # If multiple tags for same level, use default
    
    # Include/exclude patterns for expansion
    expand:
      include: ["*"]       # By default, all could expand
      exclude: ["p[0-3]"]  # But exclude numeric shortcuts
      # Result: #urgent → #priority:critical, but #p0 stays #p0
    
    # Or simpler:
    # expand:
    #   exclude: ["p*", "sev*"]  # Keep all p0-p3 and sev0-sev3 compact
    
    # Or explicit include:
    # expand:
    #   include: ["urgent", "asap", "blocker"]  # Only these expand
    #   # Everything else preserves original form
  # Define which aliases can be used as standalone tags
  standalone:
    include: ["*"]              # All aliases can be standalone by default
    exclude: ["crit", "med"]    # Except these abbreviations
    
  # Alternative: reference levels
  # standalone:
  #   include: ["$level:[0-1]"]         # Range: levels 0 through 1
  #   exclude: ["crit"]                 # But not this abbreviation
  #
  # Or multiple range syntaxes:
  # include: ["$level:[0-1]"]          # Range syntax
  # include: ["$level:0-1"]            # Simpler range
  # include: ["$level:<2"]             # Less than 2
  # include: ["$level:>=1"]            # Greater than or equal to 1
  # include: ["$level:[0,1,3]"]        # Specific levels
  #
  # Or by level description:
  # standalone:
  #   include: ["$critical", "$high"]   # Include all aliases for these levels
  #
  # Or exclude by level:
  # standalone:
  #   include: ["*"]
  #   exclude: ["$level:>1"]            # Exclude medium and low (levels 2-3)
  
  levels:
    - level: 0
      description: "Critical priority"
      default: "p0"                    # Canonical form for this level
      aliases: ["p0", "critical", "crit", "asap", "urgent", "blocker"]
    - level: 1
      description: "High priority"
      default: "p1"
      aliases: ["p1", "high"]
    - level: 2
      description: "Medium priority"
      default: "p2"
      aliases: ["p2", "medium", "med"]
    - level: 3
      description: "Low priority"
      default: "p3"
      aliases: ["p3", "low", "minor"]

# Common workflow aliases
aliases:
  # Status shortcuts  
  wip: "status:in-progress"
  done: "status:complete"
  
  # Type shortcuts
  feat: "type:feature"
  
  # Self-descriptive tags that don't need expansion
  blocked: true    # Just #blocked, not #status:blocked
  deprecated: true # Just #deprecated
  breaking: true   # Just #breaking
  experimental: true # Just #experimental

# Ambiguous values that need context
ambiguous:
  - high      # high what? priority? severity? complexity?
  - medium    # medium what?
  - low       # low what?
  - major     # major version? issue? feature?
  - minor     # minor version? issue? update?

# Format behavior examples:
# Input: #urgent #critical #blocker
# Output (normalize=true): #p0  (uses default for level 0)
# 
# Input: #priority:critical
# Output (expand_to_full=false): #p0  (uses shorthand)
# Output (--force): #priority:critical  (forces full form)

# Include/exclude pattern examples:
#
# 1. Keep numeric shortcuts compact:
# expand:
#   exclude: ["p[0-3]", "sev[0-3]"]
#
# 2. Only expand verbose aliases:
# expand:
#   include: ["urgent", "asap", "blocker", "critical"]
#
# 3. Exclude by property:
# expand:
#   exclude: ["$default"]          # Don't expand tags marked as default
#   # So #p0 (default: true) stays #p0
#   # But #urgent → #priority:critical
#
# 4. Different rules for different actions:
# format_rules:
#   expand:
#     exclude: ["$default", "p*"]  # Don't expand defaults OR p* patterns
#   normalize:
#     include: ["!$default"]       # Only normalize non-default aliases
#   preserve:
#     include: ["blocker", "deprecated"]   # Never change these specific tags
#
# 5. Pattern matching:
# expand:
#   exclude: ["/^p\d$/", "$default"]  # Regex AND property matchers
#   include: ["*"]                     # Everything else expands
#
# Other property selectors:
# "$default"      # Has default: true
# "$as_tag"       # Has as_tag: true  
# "!$default"     # Does NOT have default: true
# "!$as_tag"      # Does NOT have as_tag: true

# Pattern validation rules
patterns:
  - match: ":[0-9]+"
    suggest: ":#[0-9]+"
    message: "Use # for numeric references (e.g., #fixes:#123)"
  
  - match: "^(high|medium|low)$"
    level: "warning"
    message: "Ambiguous value - consider #priority:high or #p1"
```

### Modular Pattern Files

Additional patterns are loaded based on configuration:

```yaml
# tag-patterns/workflows.yaml
version: "1.0"
preset_name: workflows
requires: [core]

# Workflow-specific aliases
aliases:
  feat: "type:feature"
  hotfix: "type:hotfix"
  spike: "type:research"
  debt: "type:technical-debt"
  techdebt: "type:technical-debt"
  
# Type classifications
type_patterns:
  - env          # #env:prod, #env:staging
  - type         # #type:bug, #type:feature  
  - status       # #status:ready, #status:shipped
  - complexity   # #complexity:high, #complexity:low
```

### Parser Behavior

The parser processes tag patterns in a specific order:

```typescript
// Conceptual parser implementation
interface TagPattern {
  version: string;
  preset_name: string;
  requires?: string[];
  aliases: Record<string, string>;
  ambiguous?: string[];
  patterns?: ValidationRule[];
}

class TagParser {
  private patterns: Map<string, TagPattern> = new Map();
  
  async loadPatterns(config: ParserConfig) {
    // Always load core
    await this.loadPattern('core.yaml');
    
    // Load configured modules
    for (const module of config.modules) {
      await this.loadPattern(`${module}.yaml`);
    }
    
    // Load custom patterns
    if (config.customPath) {
      await this.loadCustomPatterns(config.customPath);
    }
  }
  
  expandTag(tag: string): string {
    // Check each namespace in load order
    for (const [namespace, pattern] of this.patterns) {
      if (pattern.aliases[tag]) {
        return pattern.aliases[tag];
      }
    }
    return tag; // No expansion found
  }
}
```

### Configuration

Teams configure which patterns to load:

```yaml
# .waymark/config.yml
parser:
  # Core is always loaded
  modules:
    - workflows      # Common workflow patterns
    - testing        # If you have tests
    # - compliance   # Only if regulated
    # - mobile       # Only for mobile teams
  
  # Custom patterns
  custom_patterns: ".waymark/tags/"
  
  # Strictness
  validation:
    ambiguous_tags: "warn"  # warn | error | ignore
    unknown_tags: "ignore"  # warn | error | ignore
```

### Benefits of This Approach

1. **Modular**: Load only what you need
2. **Extensible**: Easy to add new pattern files
3. **Versioned**: Each pattern file has a version
4. **Dependencies**: Patterns can require other patterns
5. **Overridable**: Later patterns can override earlier ones
6. **Testable**: Each pattern file can be validated independently

### Example Pattern Files

```yaml
# tag-patterns/testing.yaml
version: "1.0"
preset_name: testing
requires: [core]

aliases:
  skip: "test:skip"
  slow: "test:slow"
  flaky: "test:flaky"
  failing: "test:failing"

tags:
  - test
  - e2e
  - unit
  - integration
  - benchmark
  - smoke

patterns:
  - match: "#test$"
    suggest: "Consider #test:unit or #test:e2e for clarity"
```

```yaml
# tag-patterns/compliance.yaml
version: "1.0"  
preset_name: compliance
requires: [core]

# No aliases - these should be explicit
tags:
  - pii
  - gdpr
  - sox
  - hipaa
  - audit

type_patterns:
  - compliance   # #compliance:gdpr, #compliance:sox
  - data         # #data:sensitive, #data:public
  - retention    # #retention:7years, #retention:permanent
```

This modular approach:

1. **Separates concerns**: Each domain has its own pattern file
2. **Enables composition**: Teams pick only what they need
3. **Supports evolution**: Easy to add new patterns without touching core
4. **Maintains consistency**: Parser behavior is predictable
5. **Allows customization**: Teams can add their own patterns

### How Tags Are Processed

When the parser encounters a tag like `#p0` or `#blocked`, it:

1. Checks loaded aliases in namespace order
2. Expands aliases to their full form (`#p0` → `#priority:critical`)
3. Validates against ambiguous patterns
4. Applies any transformation rules
5. Returns the expanded form for storage/search

### Version Tags - Special Handling

Version tags can use either form:

```typescript
// Parser recognizes both patterns
#v2.3.1              // Simple version tag
#version:2.3.1       // Explicit type:value

// Search works across both
rg "#(version:|v)2\.3"   // Finds either form
```

### Relationship Tags

Relationships always use the `#tag:#value` pattern:

```yaml
# Common relationship patterns
#fixes:#123          # Fixing issue 123
#blocks:#456         # Blocking issue 456  
#depends:#789        # Depends on issue 789
#implements:#spec-001 # Implements specification
#refs:#pr-234        # References pull request

# Multiple values supported
#depends:#123,#456   # Comma-separated
#depends:#123 #depends:#456  # Multiple tags
```

### Tag Validation

The parser can enforce rules at different levels:

```yaml
# Strict mode - reject ambiguous tags
validation:
  ambiguous_tags: "error"
  unknown_tags: "warn"

# Permissive mode - allow anything
validation:
  ambiguous_tags: "ignore"
  unknown_tags: "ignore"

# Balanced mode (default)
validation:
  ambiguous_tags: "warn"
  unknown_tags: "ignore"
```

## Sample Team Configuration

Here's how a team might extend the minimal built-in tags with their own conventions:

```yaml
# .waymark/config.yml
tagMap:
  # Extend built-in aliases with team-specific shortcuts
  aliases:
    # Your team's priority terms
    urgent: "priority:critical"
    ship-blocker: "priority:critical"
    nice-to-have: "priority:low"
    
    # Your team's domains/areas
    payments: "backend/payments"
    checkout: "frontend/checkout" 
    mobile: "platform:mobile"
    
    # Your team's workflow states
    ready: "status:ready-for-review"
    ship-it: "status:approved"
    
    # Common patterns in your codebase
    tech-debt: "type:technical-debt"
    spike: "type:research"
    rfc: "type:proposal"

# Configure issue tracking (optional)
platforms:
  github:
    owner: "your-org"
    repo: "your-repo"
```

With this config:

- Built-in: `#p1`, `#wip`, `#sec` work as expected
- Your aliases: `#urgent` → `#priority:critical`
- Simple tags: `#payments`, `#mobile` work as standalone tags
- Relationships: `#fixes:#123`, `#blocks:#456` for issue refs

**Note**: Advanced modularity features (tag dictionaries, expansion concepts, and suggester systems) are covered in a separate proposal. This document focuses on the core unified hash syntax implementation.

## Validation Rules

The unified hash syntax introduces strict validation rules to ensure consistency:

### Linter Rules

```yaml
# .waymark/validation.yml
rules:
  # STRICT: All reference values must have # prefix
  reference_hash_required:
    level: "error"
    pattern: ":(\\d+|[A-Z]+-\\d+)\\b"  # Matches :123 or :PROJ-456
    message: "Reference values must use # prefix (e.g., #fixes:#123)"
    fix: "Add # prefix to reference value"
  
  # STRICT: No ambiguous standalone values
  ambiguous_values:
    level: "error"
    values: ["high", "medium", "low", "critical", "major", "minor"]
    message: "Ambiguous value - specify context (e.g., #priority:high)"
  
  # Format preference enforcement
  multiple_values_format:
    level: "warn"
    prefer: "separate"  # separate | comma | brackets
    message: "Use separate tags for multiple values (#depends:#123 #depends:#456)"
    auto_fix: true
  
  # Tag prefix consistency
  tag_prefix_required:
    level: "error"
    pattern: "\\s+[a-z]+:[^#@\\s]+"
    message: "Tags must use # prefix"
    fix: "Add # prefix"
```

### Parser Validation

```typescript
// Validation during parsing
interface ValidationError {
  type: 'missing_hash' | 'ambiguous_value' | 'invalid_format';
  line: number;
  column: number;
  message: string;
  suggestion?: string;
  autoFix?: string;
}

// Auto-fix transformations
const autoFixes = {
  'fixes:123': '#fixes:#123',
  'depends:456': '#depends:#456', 
  'priority:high': '#priority:high',
  '+backend': '#backend'
};
```

## Implementation Phases

### Phase 1: Documentation Updates
- [ ] Update `docs/syntax/SPEC.md` with unified hash syntax
- [ ] Update `docs/syntax/syntax-full.md` with new terminology
- [ ] Update README files with new examples
- [ ] Create migration guide

### Phase 2: Parser & Tooling Updates
- [ ] Add # prefix parsing to core parser
- [ ] Implement strict validation rules
- [ ] Add auto-fix formatter functionality
- [ ] Update linter with new rule set

### Phase 3: Migration Tools
- [ ] Create migration script for existing waymarks
- [ ] Build validation report generator
- [ ] Add backwards compatibility patterns for search

### Phase 4: Testing & Validation
- [ ] Update all test fixtures
- [ ] Add comprehensive validation tests
- [ ] Run migration on codebase
- [ ] Verify search patterns work correctly

## Migration Scripts

Proposed migration tools to automate the transition:

### 1. Terminology Migration Script

```bash
#!/bin/bash
# migrate-terminology.sh - Updates terminology across all documentation

# Create backup
cp -r docs docs.backup.$(date +%Y%m%d)

# Update sigil → waymark sign
find docs -name "*.md" -exec sed -i.bak 's/sigil/waymark sign/g' {} +
find docs -name "*.md" -exec sed -i.bak 's/The `:::` waymark sign/The `:::` waymark sign/g' {} +

# Update marker → waymark type (only when referring to todo, fix, etc.)
find docs -name "*.md" -exec sed -i.bak 's/marker groups/waymark type groups/g' {} +
find docs -name "*.md" -exec sed -i.bak 's/Core markers/Core waymark types/g' {} +

# Generate report
echo "Terminology Migration Report - $(date)" > migration-report.txt
echo "Files modified:" >> migration-report.txt
find docs -name "*.bak" | wc -l >> migration-report.txt
echo "Changes made:" >> migration-report.txt
echo "- sigil → waymark sign" >> migration-report.txt
echo "- marker groups → waymark type groups" >> migration-report.txt
```

### 2. Syntax Migration Script

```bash
#!/bin/bash
# migrate-syntax.sh - Converts existing waymarks to unified hash syntax

# Find all waymarks and convert syntax
rg --type-add 'source:*.{js,ts,py,go,rs,java,cpp,c,h}' \
   --type source \
   ':::\s*([^#]*)(priority|status|fixes|depends|affects):([^#\s]+)' \
   --replace '$1#$2:#$3' \
   --files-with-matches | \
while IFS= read -r file; do
    echo "Processing: $file"
    # Backup original
    cp "$file" "$file.backup.$(date +%Y%m%d)"
    
    # Apply conversions
    sed -i.tmp \
        -e 's/\(:::\s*[^#]*\)priority:\([^#\s]\+\)/\1#priority:#\2/g' \
        -e 's/\(:::\s*[^#]*\)fixes:\([^#\s]\+\)/\1#fixes:#\2/g' \
        -e 's/\(:::\s*[^#]*\)depends:\([^#\s]\+\)/\1#depends:#\2/g' \
        -e 's/\(:::\s*[^#]*\)+\([a-z]\+\)/\1#\2/g' \
        "$file"
    
    # Log changes
    diff "$file.backup.$(date +%Y%m%d)" "$file" >> syntax-migration-report.txt
done

echo "Syntax migration complete. See syntax-migration-report.txt for details."
```

### 3. Validation Report Generator

```bash
#!/bin/bash
# validate-migration.sh - Generates validation report after migration

echo "Unified Hash Syntax Validation Report - $(date)" > validation-report.txt
echo "=================================================" >> validation-report.txt
echo "" >> validation-report.txt

# Check for unconverted patterns
echo "1. UNCONVERTED PATTERNS:" >> validation-report.txt
echo "------------------------" >> validation-report.txt
rg --type-add 'source:*.{js,ts,py,go,rs,java,cpp,c,h}' \
   --type source \
   ':::\s*[^#]*[a-z]+:[^#@\s]+' \
   --line-number >> validation-report.txt || echo "None found" >> validation-report.txt

echo "" >> validation-report.txt
echo "2. AMBIGUOUS VALUES:" >> validation-report.txt
echo "-------------------" >> validation-report.txt
rg --type-add 'source:*.{js,ts,py,go,rs,java,cpp,c,h}' \
   --type source \
   ':::\s*[^#]*(high|medium|low|critical|major|minor)\b' \
   --line-number >> validation-report.txt || echo "None found" >> validation-report.txt

echo "" >> validation-report.txt
echo "3. MISSING # IN REFERENCES:" >> validation-report.txt
echo "---------------------------" >> validation-report.txt
rg --type-add 'source:*.{js,ts,py,go,rs,java,cpp,c,h}' \
   --type source \
   ':::\s*[^#]*[a-z]+:(\d+|[A-Z]+-\d+)\b' \
   --line-number >> validation-report.txt || echo "None found" >> validation-report.txt

echo "" >> validation-report.txt
echo "4. SUCCESSFUL CONVERSIONS:" >> validation-report.txt
echo "-------------------------" >> validation-report.txt
rg --type-add 'source:*.{js,ts,py,go,rs,java,cpp,c,h}' \
   --type source \
   ':::\s*[^#]*#[a-z]+:#[0-9A-Z-]+' \
   --count-matches >> validation-report.txt

echo "Validation complete. See validation-report.txt for full details."
```

These scripts provide:

1. **Automated terminology updates** with backup and reporting
2. **Syntax conversion** for common patterns with change tracking  
3. **Validation reporting** to identify remaining issues and confirm successful migrations

Each script creates backups and detailed reports for auditing the migration process.