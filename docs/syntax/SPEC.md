<!-- tldr ::: canonical waymark syntax specification -->
<!-- todo ::: Document includes pre-simplification examples (`priority:high`, `+tag`); requires pass to align with v1.0 simplification spec (signals & `#` tags) #wm:fix -->
# Waymark Syntax Specification

The canonical specification for waymark syntax - a breadcrumb protocol for code navigation.

## Overview

Waymarks provide a breadcrumb protocol that enables developers and AI agents to leave structured, searchable markers throughout codebases. The syntax accommodates diverse team preferences while recommending patterns that enable effective tooling and cross-project consistency.

## Core Grammar

```ebnf
waymark     ::= comment-leader marker? space sigil space prose?
sigil       ::= ":::"
space       ::= " "                    # exactly one ASCII space
marker      ::= signal? marker_name
signal      ::= position_signal? intensity_signal?
position_signal ::= "*" | "_"
intensity_signal ::= "!!" | "!" | "??" | "?" | "--" | "-"
marker_name ::= [a-z]+
prose       ::= .+                     # free-form text
```

## Basic Structure

### The `:::` Sigil

The syntax uses `:::` as the sigil (separator between marker and content).

```javascript
// Standard waymark (marker before sigil)
// todo ::: implement authentication
```

**Key Rules:**

- Marker comes before `:::` with exactly one space
- `:::` must be followed by exactly one ASCII space
- Three colons for visual clarity and fast typing
- Trivially matched with `':::'` in ripgrep

### Markers

Each marker classifies a waymark's purpose. Markers appear before the sigil and are organized into semantic groups for discoverability.

```javascript
// Core markers with mandatory space before and after sigil
// todo ::: implement rate limiting
// fix ::: memory leak in auth service  
// sec ::: validate all user inputs
```

## Signal System

Signals act as intensity modifiers and position markers that can be prefixed to markers:

### Position Signals (first in chain)
- `*` - Star: Branch-scoped work that must be finished before PR merge
- `_` - Underscore: Ignore marker (reserved for future functionality)

### Intensity Signals
- `!` / `!!` - Bang/Double-bang: Important → Critical
- `?` / `??` - Question/Double-question: Needs clarification → Highly uncertain
- `-` / `--` - Tombstone/Instant-prune: Mark for removal → Remove ASAP

### Signal Combinations
```javascript
// Position signals come first, then intensity
// *todo ::: finish error handling before merge     // Branch-scoped work
// *!todo ::: critical issue blocking PR            // Urgent branch work
// !todo important ::: migration task               // Important (not branch-scoped)
// !!alert ::: critical security vulnerability      // Critical alert
// ?note ::: unclear if this handles edge case      // Needs clarification
// -todo ::: obsolete after v5 migration            // Mark for removal
```

## Delimiter Semantics

The syntax uses three distinct delimiters with specific semantic purposes:

### Colon (`:`) - Classifications

Used for type:value relationships, classifications, and states. These appear in the prose section after the sigil.

```javascript
// todo ::: implement feature priority:high         // priority classification
// fix ::: bug in payment status:blocked           // status classification
// alert check ::: config env:production           // environment type
// review ::: security audit owner:@alice          // ownership (including mentions)
```

### Parentheses (`()`) - Parameters

Used for structured parameters and arguments. These appear in the prose section after the sigil.

```javascript
// blocked ::: waiting for resolution blocked(issue:4)     // parameter with classification
// needs auth ::: service integration depends(auth-service) // simple parameter  
// todo ::: add retry logic config(timeout:30,retry:3)     // multiple parameters
```

### Brackets (`[]`) - Arrays

Used for multiple values, optional for single values. These appear in the prose section after the sigil.

```javascript
// blocked ::: by multiple issues blocked:[4,7]           // multiple blockers
// todo ::: implement auth tags:[auth,api,security]       // multiple tags
// review ::: needed from team owner:[@alice,@bob]        // multiple owners
// blocked ::: by deployment blocked:4                    // single value (brackets optional)
```

## Core Marker Groups

Markers are organized into eight semantic groups for discoverability (42 total markers):

| Group | Purpose | Primary markers (synonyms in parentheses) |
|-------|---------|-------------------------------------------|
| **work** | Work that needs to be done | `todo`, `fix`, `done`, `review`, `refactor`, `needs`, `blocked` |
| **alert** | Warnings & alerts | `alert`, `risk`, `notice`, `always` |
| **state** | Lifecycle / completeness | `temp`, `deprecated`, `draft`, `stub`, `cleanup` |
| **info** | Explanations & guidance | `tldr`, `note`, `summary`, `example`, `idea`, `about`, `docs` |
| **quality** | Quality & process | `test`, `audit`, `check`, `lint`, `ci` |
| **performance** | Performance focus | `perf`, `hotpath`, `mem`, `io` |
| **security** | Security & access | `sec`, `auth`, `crypto`, `a11y` |
| **meta** | Meta & special | `flag`, `important`, `hack`, `legal`, `must`, `assert` |

**Usage Rules:**

1. One marker per waymark - never combine multiple markers
2. Markers from the same category should not be combined
3. Properties provide additional context and metadata

## Relational Patterns

Relationships are expressed through properties in the prose section after the sigil:

```javascript
// Dependency relationships
// needs auth ::: service depends(auth-service)       // requires auth service
// todo ::: implement login requires(api:v2-login)    // needs specific API
// fix ::: connection issue needs(config:redis)       // requires configuration

// Blocking relationships
// blocked ::: by auth issue blocked(issue:AUTH-123)  // blocked by issue
// todo ::: payment update blocking:[PAY-45,UI-77]    // blocks multiple tasks

// Event relationships
// note ::: user creation emits(event:user-created)   // publishes event
// todo ::: handle payments listens(payment-completed) // subscribes to event
// alert ::: deployment triggers(workflow:deploy)      // initiates process
```

## Core Relational Tags

A minimal set of relational tags for real development needs:

### Work Relationships
- `#fixes:#123` - This fixes an issue
- `#closes:#456` - This closes an issue/PR
- `#blocks:#789,#234` - This blocks other work
- `#blocked:#567` - This is blocked by something
- `#depends:#890,#123` - Dependencies
- `#issue:#456` - Issue reference
- `#ticket:#SUP-789` - Support ticket reference
- `#followup:#ID` - Follow-up work

### References
- `#for:#auth/login` - Context-dependent link
- `#refs:#anchor` - Reference to anchor
- `#see:#topic` - Cross-reference
- `#replaces:#old-thing` - Supersedes something
- `#link:https://...` - External link
- `#docs:/path/to/file.md` - Documentation reference

### Source Control
- `#pr:#234` - Pull request
- `#commit:abc123f` - Git commit
- `#branch:feature/auth` - Git branch

### Context
- `#affects:#billing,#auth` - Systems impacted
- `#owner:@alice,@bob` - Ownership
- `#cc:@security,@ops` - Keep informed

## Prose Formatting

Prose follows markers, separated by space. Optional formatting for clarity:

```javascript
// Basic prose
// todo ::: implement rate limiting

// Additional context in prose
// todo ::: implement rate limiting before launch
// note ::: this function assumes Redis is available

// Properties mixed with prose
// todo fix ::: race condition in auth service priority:high
// alert ::: this function modifies global state
```

## Quoting and Escaping

The syntax uses quotes for strings with special characters:

**Simple values** (no quotes needed):

```javascript
// todo ::: assign user alice
// note ::: compatible with version:2.0.1  
// fix ::: critical bug priority:high
```

**Complex values** (quotes required):

```javascript
// todo ::: handle user match('user-123')              // literal string
// fix ::: migration at path('src/data migration.sql') // spaces in path
// alert ::: connection error message('Can\'t connect') // escaped quote
// review check ::: files:['auth.js','lib/utils.js']   // array of paths
```

**No structural dots** - Use dots only for literals (versions, URLs, file paths)

## Configuration Integration

Teams can configure their preferred syntax patterns:

### Priority Schemes

```yaml
priorities:
  scheme: "numeric"  # or "named"
  numeric:
    p0: "critical"   # todo ::: task priority:p0 → todo ::: task priority:critical
    p1: "high"       # todo ::: task priority:p1 → todo ::: task priority:high
    p2: "medium"     # todo ::: task priority:p2 → todo ::: task priority:medium
```

### Version Styles

```yaml
versioning:
  style: "semver"  # or "python", "ruby", "maven"
  semver:
    compatible: "^1.2.0"
    patch-level: "~1.2.0"
```

## Universal Parameter Groups

Parameters are organized into six semantic families that work with any marker:

| Group | Purpose | Examples |
|-------|---------|----------|
| **mention** | People / entities | `owner:@alice`, `assign:@bob`, `team:@frontend` |
| **relation** | Links & references | `parent:epic-123`, `depends:auth-svc`, `url:https://docs.example.com` |
| **workflow** | Coordination | `blocked:[4,7]`, `blocking:12`, `reason:compliance` |
| **priority** | Importance / risk | `priority:high`, `severity:critical`, `complexity:high` |
| **lifecycle** | Time / state | `since:1.2.0`, `until:2.0.0`, `status:in-progress` |
| **scope** | Environment / context | `env:prod`, `platform:ios`, `region:us-east` |

## Blessed Properties

The syntax defines a core set of "blessed" properties with special semantic meaning:

| Property | Purpose | Example |
|----------|---------|---------|
| `priority` | Task priority level | `priority:high`, `priority:p0` |
| `reason` | Explanation for state | `reason:compliance` |
| `since` | Starting version/time | `since:1.2.0` |
| `until` | Ending version/time | `until:2.0.0` |
| `version` | Applicable version | `version:3.1.4` |
| `affects` | What's impacted | `affects:auth-service` |
| `fixes` | Issues being fixed | `fixes:#431` |
| `closes` | Issues to close | `closes:#123` |
| `depends` | Dependencies | `depends:#456` |
| `branch` | Git branch reference | `branch:feature/auth` |

**Priority Aliases**: The `priority` property accepts both named levels and numeric aliases:
- `priority:critical` = `priority:p0`
- `priority:high` = `priority:p1`
- `priority:medium` = `priority:p2`
- `priority:low` = `priority:p3`

## Tool Integration Notes

While the syntax accommodates flexible usage, waymark tooling may implement stricter parsing:

- **Linters** may enforce consistent delimiter styles
- **Parsers** may require specific marker formats  
- **CLIs** may validate parameter content
- **IDEs** may provide completion based on established patterns

See [waymark documentation](../waymark/) for tooling-specific requirements.

## Marker Philosophy

**Core Principles:**

- No complex object syntax within waymarks
- No regex/pattern matching as core feature
- Focus on LLM context and navigation
- Waymark syntax must be expressive enough on its own

## Search Patterns

### Basic Searches
```bash
# All waymarks
rg ":::"

# By marker
rg "todo\s+:::"
rg "fixme\s+:::"
rg "!!\w+\s+:::"    # Critical items
rg "\*\w+\s+:::"    # Branch work

# By assignment
rg ":::.*@alice"     # Assigned to alice
rg "@alice"          # All mentions of alice
```

### Tag Searches
```bash
# Simple tags
rg "#backend"
rg "#security"

# Issue references (always include #)
rg "#123\b"          # Find issue 123
rg "#fixes:#\d+"     # All fixes
rg "#blocked:#\d+"   # Blocked items

# Performance hotspots
rg "#(perf:)?hotpath" # Both forms
```

### Advanced Searches
```bash
# Count waymarks by type
rg -o "\b(\w+)\s+:::" | sed 's/\s*::://' | sort | uniq -c | sort -nr

# Find todos by assignee
rg -o "todo :::.*(@\w+|#owner:@\w+)" | rg -o "(@\w+)" | sort | uniq -c

# Context searches
rg -C3 "#security"   # 3 lines context
rg -B2 -A2 "!!fixme" # Critical bugs with context
```

## Summary

Waymark v1.0 simplifies code navigation with:

- **Clear syntax**: `[signal][marker] ::: [@actor|##anchor] prose #tags`
- **Simple tags**: Just `#tag` and `#key:value` patterns
- **Priority via signals**: Use `!` and `!!`, not `#priority:high`
- **Stable anchors**: Define with `##name`, reference with `#name`
- **Maximum greppability**: Everything searchable with ripgrep

The result is a system that's both powerful and approachable - exactly what code navigation should be.
