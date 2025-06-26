<!-- tldr ::: proposal to simplify waymark syntax for 1.0 spec, focusing on essential patterns -->

# Waymark 1.0 Simplification Proposal

## Overview

This proposal captures the simplification decisions for the Waymark 1.0 spec based on our discussion. The goal is to strip away complexity while keeping the patterns that provide clear value.

## Core Principles

1. **Signals and markers are locked in** - These work well and stay as-is
2. **The `:::` sign is locked in** - Clean separation between scope and content
3. **Simplify the tag system** - Remove hierarchical complexity, focus on greppability
4. **Make relationships clear** - Small set of relational tags that cover real needs

## Terminology

### Current Terms (v1.0)

- **Waymark sign**: The `:::` separator
- **Marker**: The type before `:::` (e.g., `todo`, `fixme`)
- **Tags**: Everything with `#` prefix after `:::`
- **Actors**: People/teams/agents with `@` prefix (e.g., `@alice`) - no slashes allowed
- **Signals**: Intensity/scope modifiers (`!`, `!!`, `?`, `??`, `*`, `-`, `--`)

### Deprecated Terms (being removed)

- **Sigil** → Use "waymark sign" or just "sign"
- **Properties** → Now just "tags with values" (e.g., `key:value` or more commonly `key:#value`)
- **Context tokens** → Removed entirely (these are now just tags)
- **`+tag` syntax** → Now `#tag`
- **References as separate concept** → Now just tags (e.g., `#456`, `fixes:#123`, `blocked:#789`)

## Major Simplifications

### Universal Colon Pattern

**IMPORTANT**: The v1.0 spec uses a colon to define relationships, attributes, and references:
- The key has NO prefix: `owner:@alice`, `fixes:#123`, `depends:@scope/package`
- The value keeps its natural prefix: `#`, `@`, etc.
- This replaces the old `#key:#value` syntax with cleaner `key:#value`
<!-- todo ::: @claude I want to include a sublist item here about how canonical reference anchors and refs are an exception to the above rule -->

This change improves readability and creates a consistent pattern across all relational tags.

### 2. Convention: Avoid Hierarchical Tags in the Core Spec (`/` syntax)

**The Old Rule (Removed):**
The original proposal was to completely remove support for hierarchical tags like `#auth/oauth/google`.

**The New Rule (More Flexible):**
The Waymark v1.0 syntax **permits** hierarchical tags, but the **core specification** avoids them by convention. They are considered a powerful tool for teams building their own custom tag systems or for defining structured canonical anchors.

For the base set of Waymark tags, we prefer simple, flat tags.

**Core Convention (Simple & Clear - Do This):**

```javascript
// todo ::: implement auth #auth #oauth #google
// todo ::: fix UI bug #frontend #components #button
```

**Permitted for Custom Extensions (Advanced Use):**

```javascript
// A team could define a custom, structured tag system
// todo ::: implement login button #acme/ui/button
```

**Rationale for the Convention:**

- **Greppability**: Flat tags are easier to search with simple tools. `rg "#auth.*#oauth.*#google"` is powerful and requires no special parser.
- **Simplicity**: Flat tags are easier to learn and use, avoiding debates about the "correct" hierarchy (`#frontend/auth` vs `#auth/frontend`?).
- **Flexibility**: Simple tags can be combined in any order.

Hierarchical tags remain a valid part of the syntax for those who need them, but they are not part of the core Waymark pattern language.

### 3. Reduce Tag Forms to Just Two

**Keep only:**

1. **Simple tags**: `#backend`, `#security`, `#auth`, `#perf`
2. **Relational tags**: `fixes:#123`, `blocked:#456`, `owner:@alice`

**Remove:**

- ❌ Complex type:value patterns (except for relations)
- ❌ Forced expansions/transformations
- ❌ Ambiguous value rules
- ❌ Tag dictionaries and pattern files

**Rationale:**

- Two patterns are easy to explain: "Put # before tags. Use : for relationships."
- Covers 95% of use cases
- Parser becomes trivial
- No complex configuration needed

### 4. Simplified Priority System

**Use signals for priority:**

```javascript
// !!todo ::: critical bug          // P0 - critical
// !todo ::: important feature      // P1 - high  
// todo ::: regular work           // P2 - default
```

**Remove:**

- ❌ `priority:high` syntax | ✅ use signals `!!` or `!` instead
- ❌ Complex priority mappings
- ❌ Priority as a core property

**Rationale:**

- Signals already convey urgency visually
- One less thing to type
- Still greppable: `rg "!!todo"` finds all critical items

### 5. Arrays for Relationships

**Support arrays where they make sense:**

```javascript
// Multiple people
// todo ::: implement auth owner:@alice,@bob
// review ::: security audit cc:@security,@ops,@compliance

// Multiple references  
// fixme ::: payment bug depends:#123,#456 blocks:#789,#234

// Multiple systems
// notice ::: deploying update affects:#billing,#payments,#auth
```

**Array Syntax Rules:**

Values in a relational array are comma-separated. Each value is parsed independently and should follow standard waymark conventions (e.g., tags start with `#`, actors start with `@`).

```javascript
// ✅ CORRECT - Commas only, no spaces
// todo ::: implement feature owner:@alice,@bob
// fixme ::: payment bug depends:#123,#456,#789

// ❌ WRONG - No spaces after commas
// todo ::: implement feature owner:@alice, @bob
```

**Single values only (no arrays):**

```javascript
// branch:feature/auth     // Not: "branch:main,develop"
// pr:#234                // Not: "pr:#234,#235"
// commit:abc123f         // Not: "commit:abc123f,def456g"
```

**Rationale:**

- `owner:@alice,@bob` is much cleaner than `owner:@alice owner:@bob`
- Commas without spaces ensure consistent parsing
- Only use arrays where multiple values are common
- Keep it predictable

### 6. Test Marker Addition

Add `test` as a core marker to the Work category:

```javascript
// Simple test marking
// test ::: boundary conditions for rate limiter

// Test with specific target
// test ::: OAuth refresh token flow for:#auth/oauth

// Test with metadata
// test ::: payment retry logic for:#payment/stripe #flaky #slow
```

**Usage guideline**: Use test waymarks when they add information beyond what the test framework provides:

- ❌ `test ::: login test` (redundant with test name)
- ✅ `test ::: flaky on slow connections for:#auth/login #flaky`
- ✅ `test ::: regression from v4.2 for:#payment/retry issue:#456`

**Rationale:**

- Tests are work (writing, maintaining, fixing)
- Extremely common in codebases
- Enables the `for:` pattern naturally
- Clear semantic meaning

## Core Relational Tags
<!-- todo ::: @claude Update relational tag examples below so keys include a leading # per streamlined grammar (e.g., fixes:#123 → #fixes:#123) #needs:syntax-update -->

A minimal set of relational tags that cover real development needs:

### Work Relationships

- `fixes:#123` - This fixes an issue
- `closes:#456` - This closes an issue/PR  
- `blocks:#789,#234` - This blocks other work
- `blocked:#567` - This is blocked by something
- `depends:#890,#123` - Dependencies
- `issue:#456` - Issue reference
- `ticket:#SUP-789` - Support ticket reference
- `followup:#ID` - Follow-up work to be addressed later

### Versatile References

- `for:#auth/login` - Context-dependent (see below)
- `needs:@alice,#api-key,#auth,#rbac` - Flexible requirements
- `rel:#billing` - Generic relationship (loosely related to this)
- `see:#billing/tax,RFC-45` - General cross-reference  
- `refs:#123,#auth/oauth` - Multiple references
- `replaces:#old-thing` - Marks code or other element that this supersedes/replaces
- `link:"https://docs.api.com"` - External link

### Specific References

- `pr:#234` - Pull request
- `commit:abc123f` - Git commit
- `branch:feature/auth` - Git branch
- `test:auth-suite` - Test suite reference
- `feat:chat-v2` - Feature flag
- `docs:"/path/to/file.md"` - Documentation reference (absolute path from repo root)

### Context

- `affects:#billing,#auth,#payments` - Systems impacted
- `owner:@alice,@bob` - Ownership
- `cc:@security,@ops` - Keep informed

## The `for:` Pattern

A single versatile rel tag that can take on different meanings based on context provided by the marker. This requires no additional tooling, just a consideration of its semantic connection to the marker.

```javascript
// With different markers, for: means different things
// test ::: validation edge cases for:#auth/login          // test FOR this
// docs ::: API usage guide for:#payment/stripe           // docs FOR this  
// example ::: retry pattern for:#patterns/resilience      // example FOR this
// stub ::: payment processing for:#billing/checkout       // stub implementation FOR this
```

Use `for:` to link work or documentation to a concept or code anchor. For relationships involving people, status, or issue tracking, prefer the more specific relational tags like `owner:`, `blocked:`, or `fixes:`.

**Key insight**: the meaning of `for:` can be implied by considering the marker, making it incredibly flexible without adding complexity.

## Greppability Principle

**Always use `#` for reference values and `@` for actors** - this makes everything searchable:

- `fixes:#123` - `#123` is greppable, and `fixes:` can be searched
- `blocked:#456` - Can find the blocking issue with `rg "#456"`
- `depends:#789,#234` - All dependencies searchable
- `owner:@alice` - @ is already greppable, no extra # needed

## Actor vs Package Disambiguation

**Actors never contain slashes**, while **package names always do** in the scoped format:

```javascript
// ✅ Actors (people/teams/agents) - no slashes
// todo ::: @alice implement OAuth integration
// review ::: @security-team audit the crypto implementation
// fixme ::: @bob fix the memory leak you introduced

// ✅ Package references - always @scope/package format  
// tldr ::: JWT middleware using @acme/auth and @types/jsonwebtoken
// note ::: upgrade required depends:@acme/database,@prisma/client
// important ::: breaking change in @acme/ui affects multiple apps

// ✅ Mixed usage works naturally
// todo ::: @alice update auth system to use @acme/auth v2.0 owner:@alice depends:@acme/auth
```

**Package names** are either:
- **Unscoped**: `#lodash`, `#express`, `#react` (no `@` symbol)  
- **Scoped**: `@acme/auth`, `@babel/core`, `@types/node` (always `@scope/package`)

This natural distinction eliminates any ambiguity between actors and package references.

Search examples:

```bash
# Find all references to issue 123
rg "#123\b"

# Find all blocking relationships
rg "blocks:#\d+"

# Find work assigned to alice (actor)
rg "@alice"

# Find all actors (no slashes)
rg "@[a-zA-Z0-9_-]+\b"

# Find all package references (has slashes)
rg "@[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+"

# Find specific package usage
rg "@acme/auth"
```

## Attribute Tags

Attribute tags describe characteristics of code rather than relationships. They answer "what kind of code is this?"

### Format

- Use `category:#attribute` for structured classification
- Common attributes can be standalone tags for easy searching e.g. `#hotpath`
- Can combine: `perf:#critical,bottleneck`

**When to use standalone tags** (e.g., `#hotpath`):

- Quick marking during development
- Common concepts everyone understands
- When the category is obvious from context
- For easier grep searches

**When to use category form** (e.g., `perf:#hotpath`):

- When precision matters
- Multiple related attributes (e.g., `perf:#critical,#bottleneck`)
- Building tooling that processes categories
- Avoiding namespace collisions

**Recommended pattern for references**: When using attribute values in relational tags, always include `#`:

- ✅ `for:perf:#hotpath` or `refs:arch:#entrypoint`
- ❌ `for:perf:hotpath` (missing # makes it less greppable)

This ensures maximum searchability - you can find all hotpaths with `rg "#hotpath"` whether they're written as `#hotpath`, `perf:#hotpath`, or referenced as `for:#hotpath`.

**Important**: While `#hotpath` and `perf:#hotpath` are intended to mean the same thing, without tooling support they're technically independent tags. For consistency:

- Use standalone shortcuts (`#hotpath`) for quick marking
- Use category form (`perf:#hotpath`) when being explicit
- Search patterns above show how to find both forms
- Future tooling may treat them as aliases

### Core Attribute Categories

#### Performance (`perf:`)

- `perf:#hotpath` - Performance-critical code path
- `perf:#critical-path` - Must execute efficiently
- `perf:#bottleneck` - Known performance constraint
- `perf:#optimized` - Already optimized code

**Standalone shortcuts**: `#hotpath`, `#critical-path`, `#bottleneck`

#### Architecture (`arch:`)

- `arch:#entrypoint` - Where execution begins
- `arch:#boundary` - System/security boundary  
- `arch:#singleton` - Single instance in system
- `arch:#state` - State management location

**Standalone shortcuts**: `#entrypoint`, `#boundary`

#### Security (`sec:`)

- `sec:#boundary` - Security boundary
- `sec:#input` - External input point
- `sec:#sanitize` - Input sanitization
- `sec:#auth` - Authentication logic
- `sec:#authz` - Authorization logic
- `sec:#crypto` - Cryptographic operations

#### Code Behavior (`code:`)

- `code:#pure` - No side effects
- `code:#sideeffect` - Has external effects
- `code:#async` - Asynchronous operation
- `code:#callback` - Callback pattern
- `code:#recursive` - Recursive implementation

#### Data Flow (`data:`)

- `data:#source` - Where data originates
- `data:#transform` - Data transformation
- `data:#sink` - Where data ends up
- `data:#sensitive` - PII/sensitive data

#### API (`api:`)

- `api:#endpoint` - API endpoint
- `api:#internal` - Internal API
- `api:#external` - External API
- `api:#deprecated` - Deprecated API

#### Status (`status:`)

- `status:#experimental` - Not production ready
- `status:#stable` - Well-tested, reliable
- `status:#legacy` - Old code needing care
- `status:#migration` - Being migrated

**Standalone shortcuts**: `#experimental`, `#stable`, `#legacy`

#### Error Handling (`error:`)

- `error:#handler` - Error handling logic
- `error:#boundary` - Error boundary
- `error:#recovery` - Recovery point

### Examples

```javascript
// Performance-critical code (standalone for common concepts)
// todo ::: optimize JSON parser #hotpath
// todo ::: fix memory leak #bottleneck

// Security boundaries (category form for precision)
// important ::: validate all user input sec:#boundary,input
// important ::: sanitize HTML content sec:#sanitize

// Architecture points (mix of standalone and category)
// about ::: ##app/init main entry point #entrypoint
// important ::: global state store arch:#state,#singleton

// Data flow (category form for clarity)
// note ::: user data transformed here data:#transform #api/internal
// important ::: PII encrypted here data:#sensitive sec:#crypto

// Mixed attributes (combining standalone and category)
// todo ::: async request handler #async api:endpoint #critical-path

// References to attributes (always include #)
// test ::: performance test for:#hotpath
// fixme ::: race condition in handler refs:#app/init
```

### Search Patterns

```bash
# Find all hotpaths (standalone or in category)
<!-- todo ::: @claude Review and update the regex patterns in this Search Patterns section to align with the corrected `(perf:#|#)hotpath` logic from the streamlined grammar #regex #needs:fix -->
rg "(perf:#|#)hotpath"                   # Matches #hotpath and perf:#hotpath
waymark find #hotpath                    # Simpler: finds all hotpath variations

rg "(perf:#[^#\s]*)?hotpath"            # Also matches perf:#critical,hotpath
waymark find #hotpath                    # Same command handles all cases

# Find all performance-related tags
rg "perf:"                               # All performance attributes
waymark find --category perf             # All perf category tags

rg "(perf:|#hotpath|#bottleneck)"        # Performance tags including standalone
waymark find #perf #hotpath #bottleneck  # Multiple tag search (OR by default)

# Find security boundaries (any form)
rg "(sec:#|#)boundary"                   # Matches #boundary and sec:#boundary
waymark find #boundary                   # Finds both forms automatically

rg "sec:"                                # All security attributes
waymark find --category sec              # All security category tags

# Find experimental code (any form)
rg "(status:#|#)experimental"            # Both forms
waymark find #experimental               # Understands both variations

# Complex searches with comma-separated values
rg "perf:[^#\s]*hotpath"                # Finds hotpath in any perf: list
waymark find perf:hotpath                # Direct search for specific combo

# Find by category regardless of order
rg "data:(source|transform|sink)"        # Any data flow point
waymark find --category data             # All data attributes

# Combining searches
rg "code:(pure|sideeffect|async)"       # Any code behavior
waymark find --any code:pure code:async     # Find pure OR async code
waymark find --all api:endpoint #async      # Find async endpoints
```

These attribute tags create a semantic map that helps both humans and AI agents understand code characteristics at a glance.

## Canonical Anchors

The system includes both generic and typed canonical anchors for stable reference points:

### Generic Anchors

Mark important locations without categorization:

```javascript
// Generic anchors - mark specific places
// about ::: ##auth/login Login implementation
// about ::: ##payment/retry-logic Retry algorithm
// important ::: ##security/validation Input validation boundary
```

### Typed Canonical Anchors

Declare what something IS using `type:` prefix:

```javascript
// Typed anchors - declare canonical artifacts
// tldr ::: ##docs:@acme/auth/api API documentation
// tldr ::: ##test:@acme/billing/e2e End-to-end billing tests
// tldr ::: ##config:@acme/database Production database config
// about ::: ##pkg:@acme/auth Authentication package
```

### Three-Tier Interaction Model

Typed canonical anchors create three semantically distinct ways to interact with any concept:

#### 1. Identity Declaration (`##type:target`)
**Purpose**: Establishes file identity and canonical purpose  
**Meaning**: "This file IS the canonical [type] for [target]"

```markdown
<!-- In auth-setup.md -->
<!-- tldr ::: ##docs:@acme/auth/setup Authentication setup guide -->
```

#### 2. Reference Pointer (`type:target`)
**Purpose**: Direct reference that implies lookup  
**Meaning**: "This relates to [target], find canonical [type] by searching for `##type:target`"

```javascript
// In authentication.js
// todo ::: implement JWT validation docs:@acme/auth/setup
```

#### 3. Relational Link (`see:#type:target`)
**Purpose**: Explicit cross-reference with directional intent  
**Meaning**: "For more information, see the canonical [type] for [target]"

```javascript
// In api-gateway.js
// notice ::: auth middleware required see:#docs:@acme/auth/setup
```

### When to Use Generic vs Typed Anchors

#### Use Generic Anchors When:
- Marking a specific location or algorithm
- Creating stable reference points in code
- The anchor name is simple (no special characters)

#### Use Typed Anchors When:
- Declaring canonical artifacts (docs, tests, configs)
- The name contains special characters (@, :)
- You want to categorize what something IS

### Common Artifact Types

**Documentation**: `##docs:@acme/auth/api` - API reference  
**Configuration**: `##config:@acme/database/prod` - Production DB config  
**Test Suites**: `##test:@acme/payment/integration` - Payment tests  
**API Specs**: `##api:@acme/billing/v2` - Billing API v2  
**Data Schemas**: `##schema:@acme/user` - User data model  
**Runbooks**: `##runbook:@acme/incident/security` - Security incident response  

### Reference Examples

```javascript
// Reference canonical anchors using relational tags
// todo ::: implement refresh tokens refs:#auth/oauth/google
// fixme ::: race condition see:#api/webhooks
// test ::: tax calculation accuracy for:#billing/tax-engine

// Reference typed anchors directly
// todo ::: implement JWT validation docs:@acme/auth/setup
// config ::: auth service deployment config:@acme/auth/prod
// test ::: auth flow testing test:@acme/auth/integration
```

**Rules:**

1. Each canonical anchor `##name` must be unique in the codebase
2. Each `##type:target` combination must be unique across the entire repository
3. Canonical anchor name comes immediately after `:::` (like actors)
4. Hierarchy IS allowed for canonical anchors
5. Canonical anchors fit best with the `about`, `example`, `tldr`, and `important` markers

**Rationale:**

- Creates stable reference points better than file:line
- Hierarchies make sense here - you're creating a namespace
- Double `##` visually indicates "this is a canonical anchor"
- Typed anchors enable self-describing architecture
- Still greppable:
  - `rg "##auth/oauth/google"` finds specific canonical anchor
  - `rg "#auth/oauth/google"` finds canonical anchor and all references
  - `rg "##docs:"` finds all documentation anchors

## Updated Core Markers

With the addition of `test`:

- **Primary**: `tldr`
- **Work**: `todo`, `fixme`, `refactor`, `review`, `wip`, `stub`, `temp`, `done`, `deprecated`, `test`
- **Info**: `note`, `idea`, `about`, `example`
- **Attention**: `notice`, `risk`, `important`

## What We're NOT Doing

1. **No complex tag expansions**: `#urgent` stays `#urgent` and/or using a `!!todo` signaled marker, not `priority:critical`
2. **No forced hierarchies**: Teams can use whatever tags make sense
3. **No ambiguous value policing**: If a team wants `#high`, let them
4. **No complex configuration**: No tag dictionaries, expansion rules, or pattern files
5. **No `--is` category syntax**: Direct marker searches instead

## Migration Impact

These simplifications mean:

1. **Hierarchical tags** → Multiple simple tags
2. **Priority properties** → Signals
3. **Complex expansions** → Keep tags as written
4. **Multiple tag syntaxes** → Just two patterns

## Examples of the Simplified System

// Agent‑friendly snapshots: performance hotspots, security risks, initialization, and experiments

```javascript
// Work with clear relationships
// *!todo ::: @alice critical auth fix blocks:#456,#789 needs:@security pr:#234

// Canonical anchor for stable reference point
// about ::: ##payment/stripe-webhook Stripe webhook handler #payments #critical

// Test with context
// test ::: webhook retry logic for:#payment/stripe-webhook #flaky #integration

// Simple documentation reference
// note ::: see integration guide docs:/docs/architecture/auth.md link:https://docs.stripe.com

// Clean multi-ownership
// wip ::: implementing RBAC owner:@security,@alice branch:feature/rbac

// Clear system impacts
// !!notice ::: deploying breaking change affects:#api,#billing,#frontend

// Performance hotspot (standalone tag for common concept)
// todo ::: optimize JSON serialization inner loop #hotpath

// Entry point - critical for understanding system startup
// tldr ::: ##app/init initialize cache and database connections #entrypoint

// Security boundary - where external data enters
// important ::: validate all user input here #boundary sec:input

// State management - central source of truth
// about ::: ##state/user-store global user state management arch:state,singleton

// Error handling - where errors bubble up to
// important ::: ##errors/handler central error recovery point error:boundary

// Data flow - key transformation point
// note ::: user data transformed for API here data:transform api:internal

// Integration point - external service connection
// important ::: ##integration/stripe Stripe webhook handler api:external arch:integration

// Critical path - must be fast
// todo ::: optimize query performance #critical-path data:source

// Experimental - not production ready
// wip ::: new search algorithm #experimental
```

## Benefits

1. **Easier to explain**: Two tag patterns, clear relationships
2. **Easier to implement**: Parser is straightforward
3. **Easier to adopt**: No complex rules to learn
4. **Still powerful**: Covers all real use cases
5. **Still greppable**: Everything is searchable

## Migration Summary

### Quick Conversions

- `priority:high` → **REMOVE** - Use signals instead: `!todo` (NOT `priority:high`)
- `priority:critical` → **REMOVE** - Use signals: `!!todo`
- `+backend` → `#backend`
- `fixes:123` → `fixes:#123` (always include # for references)
- `branch:feature/auth` → `branch:feature/auth`
- `status:blocked` → `#blocked` or `blocked:#123`
- Actors stay the same: `@alice` remains `@alice`

**IMPORTANT**: We are **NOT** using `priority:high` syntax anymore. Use signals (`!`, `!!`) for priority.

### Deprecated Markers → v1.0 Core

| Old Marker | New Marker | Notes |
|------------|------------|-------|
| `alert` | `notice` | Broader semantic meaning |
| `fix` | `fixme` | Consistent naming |
| `always` | `important` | Clearer intent |
| `check` | `todo` | Add `#verify` tag |
| `must` | `!notice` | Use signal for urgency |
| `ci` | appropriate type | Add `#ci` tag |
| `needs` | `todo` | Work that needs doing |
| `blocked` | `todo` | Add `#blocked` tag |
| `sec` | `[!!,!]risk` | Add `#security` tag |
| `audit` | `important` | Add `#audit` tag |
| `warn` | `!notice` | Add `#warning` tag |
| `draft` | `wip` | Add `#draft` tag |
| `new` | `todo` | Add `#enhancement` tag |
| `hold` | `note` | Add `#hold` tag |
| `shipped` | `note` | Add `#shipped` tag |
| `perf` | `todo` | Add `#perf` tag |
| `cleanup` | `temp` | Add `#cleanup` tag |
| `hack` | `temp` | Add `#hack` tag |

### Search Pattern Updates

```bash
# ❌ OLD PATTERNS (DO NOT USE)
rg "priority:high"      # NO - old property syntax
rg "status:blocked"     # NO - old property syntax

# ✅ NEW PATTERNS (USE THESE)
rg "!!todo"             # Find critical todos
rg "!todo"              # Find high priority todos
rg "todo"               # Find all todos
# todo ::: @claude Include an example of a todo search that *doesn't* also match `!!` and `!`

# Finding references (always use #)
rg "#123\b"             # Find issue 123
rg "fixes:#\d+"         # Find all fixes
rg "blocked:#\d+"       # Find blocked by issues
rg "blocked:"           # Find items marked as blocked
```

## Custom Extensions

### Custom Definitions System

The v1.0 spec introduces a flexible system for custom markers and tags beyond the standard vocabulary:

**Core Principle**: Anything not in loaded dictionaries is considered custom.

```json
{
  "validation": {
    "customMarkers": "warn",   // "allow" | "warn" | "error"
    "customTags": "allow"      // "allow" | "warn" | "error"
  },
  "customDefinitions": "standard"  // or "strict" or "liberal"
}
```

This separation means:
- **Dictionaries** define standard vocabulary
- **Custom definitions** set rules for everything else
- Teams can innovate while preventing anti-patterns

### Namespace-Style Tags

A powerful pattern emerges from the tag syntax - pseudo-namespaces using colons:
<!-- todo ::: Find a way to go from these "namespace-style tags" to canonical anchors -->
```javascript
// Namespace-style custom tags
// todo ::: fix validation #wm:fix/property-priority
// notice ::: breaking change #api:v2/breaking
// wip ::: experiment #exp:ml/recommendations

// These work because they're treated as simple tags
// (no valid reference value after the colon)
```

This pattern is especially useful for:
- Project-specific categorization (`#wm:*`, `#proj:*`)
- API versioning (`#api:v2/*`, `#api:v3/*`)
- Feature flags (`#exp:*`, `#feat:*`)
- Team conventions (`#team:backend/*`, `#qa:blocked/*`)

**Note**: These aren't true relational tags - they're simple tags that happen to contain colons. This makes them fully greppable while providing organizational structure.

### Custom Markers

While custom markers are supported, we encourage using the standard vocabulary when possible. If you do need custom markers (e.g., `spike :::` or `hypothesis :::`), keep them simple and document them well.

### Forbidden Patterns

To prevent confusion and maintain consistency, certain patterns are forbidden in custom tags:

```javascript
// ❌ Forbidden - duplicates core waymark features
// todo ::: task priority:high       // Use: !todo or !!todo
// todo ::: task assigned-to:alice   // Use: @alice or owner:@alice
// todo ::: task status:blocked      // Use: #blocked or blocked:#123

// ✅ Correct usage
// !todo ::: critical task @alice blocked:#456
```

### Validation Modes

The three validation modes provide flexibility for different team needs:

1. **`"allow"`** - No restrictions (good for experimentation)
   ```javascript
   // Anything goes
   // dragon-quest ::: slay the beast #loot:epic #xp:5000
   ```

2. **`"warn"`** - Flags non-standard usage (good for established projects)
   ```javascript
   // Warning: 'dragon-quest' not in dictionary, but allowed
   // dragon-quest ::: slay the beast #loot:epic
   ```

3. **`"error"`** - Strict enforcement (good for large teams)
   ```javascript
   // Error: 'dragon-quest' not in dictionary or custom definitions
   // Must use standard markers or add to custom dictionary
   ```

### Custom Definition Presets

For teams that want sensible defaults without detailed configuration:

- **`"liberal"`** - Very permissive, allows most patterns
- **`"standard"`** - Balanced rules, prevents common mistakes (default)
- **`"strict"`** - Conservative, requires explicit patterns

### Best Practices for Extensions

1. **Start with standard vocabulary** - Only add custom when needed
2. **Use namespace prefixes** - Avoid collisions (`#proj:*`, `#team:*`)
3. **Document your customs** - Keep a WAYMARK-CUSTOM.md file
4. **Regular reviews** - Audit custom usage quarterly
5. **Consider dictionaries** - Frequently used customs should become official

## Grammar Extension Points

The v1.0 grammar defines a solid core with explicit extension points where alternative patterns are acknowledged as valid.

### Array Pattern Extensions

The base spec uses simple comma-separated arrays:

```javascript
// Base pattern (REQUIRED - all tools must support)
// todo ::: notify team #cc:@alice,@bob,@charlie
// fixme ::: update systems affects:#api,#billing,#frontend
```

However, the grammar acknowledges these alternative patterns as valid extensions:

```javascript
// Bracketed arrays - space-separated with clear boundaries
// todo ::: add dependencies #deps:[lodash react typescript]
// wip ::: matrix testing #test:[ubuntu-latest macos-latest windows-latest]

// Parentheses groups - allows spaces after commas
// notice ::: system update affects:(api, frontend, mobile)
// todo ::: test scenarios #cases:(happy-path, edge-case, error-case)

// Quoted values - for complex strings
// note ::: sprint goals #tasks:"Bug fixes, Performance improvements, New features"
// example ::: commit message #type:"feat(auth): Add OAuth support"

// Object-like - for key-value data
// config ::: deployment settings #env:{prod:true, debug:false, region:us-east}
// test ::: browser matrix #matrix:{chrome:latest, firefox:esr, safari:16}

// Pipeline/sequence - for ordered steps
// todo ::: deployment process #workflow:[build -> test -> staging -> production]
// example ::: data flow #pipeline:[extract -> transform -> load]
```

**Key Principles**:
- Tools SHOULD support the base comma-separated pattern
- Tools MAY support any extension patterns
- All patterns MUST remain greppable (e.g., `rg "#deps:\["`)
- Start simple, adopt extensions only when truly beneficial
- Document which patterns your tools support

**Progressive Enhancement**:
1. Level 0: Treat as opaque string
2. Level 1: Recognize as array pattern
3. Level 2: Parse specific pattern type
4. Level 3: Understand semantics

This approach lets teams adopt richer array syntax when needed while keeping the core spec simple and universal.

## Conclusion

This simplified system removes complexity while keeping the patterns that provide clear value:

- Signals + markers for type and urgency
- Simple tags for classification  
- Relational tags for connections
- Anchors for stable reference points
- Arrays where they make sense
- Custom extensions with guardrails

The result is a system that's both powerful and approachable - exactly what Waymark 1.0 should be.