<!-- tldr ::: ##docs:@waymark/proposals/streamlined-grammar-complete Complete waymark grammar with typed canonical reference system #proposal -->

<!-- !!todo ::: #issue:#52 Run spell-checker and reflow where necessary -->
<!-- !!todo ::: #issue:#52 Fix typos/wording issues (`stillTags`, stray "a" bullets, "lingerinq", etc.) -->
# Waymark Streamlined Grammar & Canonical Reference System

A comprehensive proposal that simplifies waymark terminology while introducing typed canonical anchors for creating self-describing, interconnected knowledge graphs.

## Overview

This proposal captures the evolution of waymark syntax for the 1.0 spec, combining simplification decisions with advanced features for creating self-describing knowledge graphs. The goal is to strip away complexity while keeping patterns that provide clear value.

After extensive iteration, we've identified opportunities to streamline the waymark grammar by:

- Simplifying terminology
- Unifying all key:value pairs as "tags" (keeping the `#` prefix)
- Clarifying the distinction between simple tags and relational tags
- Clarifying the anchor system
- Introducing **Typed Canonical Anchors** (`##type:target`) that transform waymarks into a semantic knowledge graph

The result is a cleaner, more intuitive system that maintains full search capabilities while enabling intelligent cross-referencing and self-describing architecture.

## Core Principles

1. **Signals and markers are locked in** - These work well and stay as-is
2. **The `:::` sign is locked in** - Clean separation between scope and content
3. **Simplify the tag system** - Remove hierarchical complexity, focus on greppability
4. **Make relationships clear** - Small set of relational tags that cover real needs
5. **Enable knowledge graphs** - Typed anchors create navigable semantic networks

## Terminology

### Current Terms (v1.0)

- **Waymark sign**: The `:::` separator
- **Marker**: The type before `:::` (e.g., `todo`, `fixme`)
- **Tags**: Everything with `#` prefix after `:::`
- **Actors**: People/teams/agents with `@` prefix (e.g., `@alice`) - no slashes allowed
- **Signals**: Intensity/scope modifiers (`!`, `!!`, `?`, `??`, `*`, `-`, `--`)
- **Anchors**: Reference points with `##` prefix (generic or typed)

### Deprecated Terms (being removed)

<!-- !!todo ::: #issue:#52 Choose and document a single taxonomy for attribute vs relational tags -->
- **Sigil** → Use "waymark sign" or just "sign"
- **Properties** → Now just "tags with values" (e.g., `#priority:high`)
- **Context tokens** → Removed entirely (these are now just tags)
- **+tag syntax** → Now `#tag`
- **References as separate concept** → Now just tags (e.g., `#fixes:#123`)

## Core Structure

```
[signal][marker] ::: [content] [modifiers]
```

Where modifiers can include any combination of:

- **Tags**            - Simple labels that start with `#` (e.g. `#backend`, `#perf:hotpath`)
- **Relational Tags** - `#key:value` pairs
- **Actors** - People/teams with `@` prefix
- **Anchors** - Reference points with `##` prefix

## The Streamlined Components

### 1. Tags (Simple Labels)

Tags are simple descriptive labels prefixed with `#`:

```javascript
// Simple tags for categorization
// todo ::: implement auth #backend #security #critical
// fixme ::: race condition #async #database
// note ::: performance hotspot #optimization
```

**Key principle**: If it's just a word or path describing the waymark, it's a tag.

### 2. Relational Tags (Key:Value)

**Keep only:**

1. **Simple tags**: `#backend`, `#security`, `#auth`, `#perf`
2. **Relational tags**: `#fixes:#123`, `#blocked:#456`, `#owner:@alice`

**Remove:**

- Complex type:value patterns (except for relations)
- Forced expansions/transformations
- Ambiguous value rules
- Tag dictionaries and pattern files (moved to custom extensions)

**Rationale:**

- Two patterns are easy to explain: "Put # before tags. Use : for relationships."
- Covers 95% of use cases
- Parser becomes trivial
- No complex configuration needed

Relational tags are key:value pairs that **always start with `#`**.  They typically connect the current waymark to another entity such as an issue, anchor, or actor.

```text
#owner:@alice           # Points to an actor
#fixes:#123             # Points to another waymark (issue 123)
#affects:#api,#billing  # Points to multiple anchors
```

If the value does **not** start with `#` or `@`, the tag is merely descriptive and functions like an attribute (`#perf:hotpath`).

```javascript
// Clean, readable relational tags
// todo ::: implement feature #owner:@alice #priority:high
// fixme ::: bug in payment #fixes:#123 #blocks:#456,#789
// notice ::: deployment #affects:#api,#billing #status:pending

// Performance attributes (still tags because of leading #)
// todo ::: optimize query #perf:hotpath #arch:critical-path

// Workflow tags  
// wip ::: new feature #branch:feature/auth #pr:#234
```

**Key principle**: If the token starts with `#`, it is a tag (simple, attribute, or relational).  All key:value pairs therefore begin with `#`.

### 2.1 Attribute-Style Tags & Aliases

While relational tags handle most key:value data, many teams like the expressiveness of **attribute tags** such as `#perf:hotpath`, `#sec:boundary`, or `#api:endpoint`.  These are **still tags** because they begin with `#`; the colon simply namespaces the tag and does **not** turn it into a relational tag.

Key rules:

1. If a token starts with `#`, it is always treated as a **tag**, even when it contains `:`.
2. You MAY provide a **simple-tag alias** for any attribute tag. For example, `#perf:hotpath` and `#hotpath` can coexist and are considered synonyms by future tooling.
3. Use the namespaced form (`#perf:hotpath`) when precision matters or when you need to group related tags (`#perf:critical`, `#perf:bottleneck`).  Use the simple alias (`#hotpath`) for quick, ad-hoc marking.
4. When both appear on the same line, prefer placing them next to each other for readability:

```javascript
// todo ::: optimise parser #hotpath #perf:hotpath
```

<!-- !!todo ::: #issue:#52 CRITICAL: Resolve contradiction about `#hotpath` vs `#perf:hotpath` aliases - are they equivalent in v1.0 or future enhancement? -->
Tooling roadmap ▶  The Waymark CLI will eventually let you declare alias maps so searches for `#hotpath` automatically include `#perf:hotpath` (and vice-versa), maintaining greppability while giving authors freedom of expression.

#### Recommended Usage Patterns

• **Standalone tags** — `#hotpath`, `#boundary`, `#experimental`
   - Ideal for quick marking during day-to-day development.

• **Namespaced (category) tags** — `#perf:hotpath`, `#sec:boundary`, `#status:experimental`
   - Provide machine-readable structure, avoid collisions, and allow grouped searches such as `rg "#sec:"`.

In practice you can mix both:

```javascript
// important ::: validate input #boundary #sec:boundary,input
```

#### Search Cheat-Sheet

```bash
# Find all hotpaths (standalone **or** namespaced)
rg "#(perf:)?hotpath"

# All security attributes
rg "#sec:"

# Any security boundary (both forms)
rg "#(sec:)?boundary"
```

These patterns mirror those in the 1.0 Simplification doc, so teams can migrate without changing their muscle-memory.

### 3. Actors (People/Teams)

Actors represent people, teams, or agents with `@` prefix:

```javascript
// Direct actor mentions
// todo ::: @alice implement OAuth integration
// review ::: @security-team check crypto implementation

// Actors in relational tags
// fixme ::: memory leak #owner:@bob #cc:@platform,@ops
```

**Key principle**: Actors never contain slashes (unlike scoped packages).

### Convention: Avoid Hierarchical Tags in the Core Spec

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

### 4. Anchors (Reference Points)

Anchors mark specific locations in code with `##` prefix. They come in two forms:

#### Generic Anchors
Mark important locations without categorization:

```javascript
// Generic anchors - mark specific places
// about ::: ##auth/login Login implementation
// about ::: ##payment/retry-logic Retry algorithm
// important ::: ##security/validation Input validation boundary
```

#### Typed Anchors  
Declare what something IS using `type:` prefix:

```javascript
// Typed anchors - declare canonical artifacts
// tldr ::: ##docs:@company/auth/api API documentation
// tldr ::: ##test:@company/billing/e2e End-to-end billing tests
// tldr ::: ##config:@company/database Production database config
// about ::: ##pkg:@company/auth Authentication package
```

**Key principles**:

- Use `##` for definitions (THIS IS the thing)
- Use `#` for references (pointing to the thing)
- Generic anchors work for simple names
- Typed anchors required for special characters (@, :) or canonical artifacts
- Actors (@alice) don't need anchors - they ARE the identifier
- Each canonical anchor `##name` must be unique in the codebase
- Canonical anchor name comes immediately after `:::` (like actors)
- Hierarchy IS allowed for canonical anchors
- Canonical anchors fit best with the `about`, `example`, `tldr`, and `important` markers

**Rationale:**

- Creates stable reference points better than file:line
- Hierarchies make sense here - you're creating a namespace
- Double `##` visually indicates "this is a canonical anchor"
- Still greppable:
  - `rg "##auth/oauth/google"` finds specific canonical anchor
  - `rg "#auth/oauth/google"` finds canonical anchor and all references

### Simplified Priority System

**Use signals for priority:**

```javascript
// !!todo ::: critical bug          // P0 - critical
// !todo ::: important feature      // P1 - high  
// todo ::: regular work           // P2 - normal
// todo ::: nice to have #p3       // P3 - explicit low (rare) <!-- !!todo ::: #issue:#52 Resolve: either forbid all priority tags or allow all -->
```

**Remove:**

- `#priority:high` syntax (use signals instead)
- Complex priority mappings
- Priority as a core property

**Rationale:**

- Signals already convey urgency visually
- One less thing to type
- Still greppable: `rg "!!todo"` finds all critical items

<!-- !!todo ::: #issue:#52 CRITICAL: Resolve priority system inconsistency - forbids `#priority:high` but allows `#p3` -->
**IMPORTANT**: We are **NOT** using `#priority:high` syntax anymore. Use signals (`!`, `!!`) for priority.

### Arrays for Relationships

**Support arrays where they make sense:**

```javascript
// Multiple people
// todo ::: implement auth #owner:@alice,@bob
// review ::: security audit #cc:@security,@ops,@compliance

// Multiple references  
// fixme ::: payment bug #depends:#123,#456 #blocks:#789,#234

// Multiple systems
// notice ::: deploying update #affects:#billing,#payments,#auth
```

<!-- !!todo ::: #issue:#52 Define parsing rules for values containing commas, quotes, empty arrays, whitespace -->
**Array Syntax Rules:**

Values in a relational array are comma-separated. Each value is parsed independently and should follow standard waymark conventions (e.g., tags start with `#`, actors start with `@`).

```javascript
// ✅ CORRECT - Commas only, no spaces
// todo ::: implement feature #owner:@alice,@bob
// fixme ::: payment bug #depends:#123,#456,#789

// ❌ WRONG - No spaces after commas
// todo ::: implement feature #owner:@alice, @bob

// ❌ WRONG - Don't use multiple tags for arrays
// todo ::: implement feature #owner:@alice #owner:@bob
```

**Single values only (no arrays):**

```javascript
#branch:feature/auth     // Not: #branch:main,develop
#pr:#234                // Not: #pr:#234,#235
#commit:abc123f         // Not: #commit:abc123f,def456g
```

**Rationale:**

- `#owner:@alice,@bob` is much cleaner than `#owner:@alice #owner:@bob`
- Commas without spaces ensure consistent parsing
- Only use arrays where multiple values are common
- Keep it predictable

## Typed Canonical Anchors: The Core Innovation

### Prefix Design Choice

The system uses `##` for canonical anchors. This design was chosen over alternatives like `^#` for several key reasons:

#### Why `##` for Anchors?

**Cognitive Simplicity**: Double the # to make it canonical

- `#anchor` → `##anchor` (canonical anchor definition)
- Clear distinction between reference and definition

**Visual Distinction**: Impossible to confuse with regular references

- `#docs:schema` vs `##docs:schema` - reference vs canonical definition
- Double prefix immediately signals "this is the definition"

**Grep Precision**: Clean search patterns without conflicts

```bash
rg "@alice"     # All alice references
rg "#docs:"     # All doc references
rg "##docs:"    # Just canonical doc anchors
```

**No Symbol Conflicts**: Avoids regex confusion (unlike `^` which means start-of-line)

**Namespace Clarity**: Each prefix has a clear, distinct purpose in the waymark ecosystem

### The Three-Tier Interaction Model

The typed canonical anchor system creates three semantically distinct ways to interact with any concept:

#### 1. Identity Declaration (`##type:target`)
**Purpose**: Establishes file identity and canonical purpose  
**Location**: Exactly one declaration per `type:target` pair across the entire repository  
**Meaning**: "This file IS the canonical [type] for [target]"

<!-- !!todo ::: #issue:#52 Explicitly state uniqueness scope for typed anchors (repo-wide) and rule on duplicates -->
<!-- !!todo ::: #issue:#52 Specify case sensitivity rules, conflict resolution during merges, handling of file moves/renames -->
**Uniqueness Rules:**
- Each `##type:target` combination must be unique across the entire repository
- Multiple typed anchors are allowed per file (e.g., `##docs:@company/auth/api` and `##config:@company/auth/prod`)
- Same target with different types is allowed (e.g., `##docs:@company/auth` and `##config:@company/auth`) <!-- !!todo ::: #issue:#52 Clarify policy on multiple types for the same target -->

```markdown
<!-- In auth-setup.md -->
<!-- tldr ::: ##docs:@company/auth/setup Authentication setup guide -->
```

```json
// In auth.config.json  
// tldr ::: ##config:@company/auth JWT and session configuration
```

```javascript
// In auth.test.js
// tldr ::: ##test:@company/auth Authentication test suite
```

```json
// In user.schema.json
// tldr ::: ##schema:@company/user User data structure definition
```

#### 2. Reference Pointer (`#type:target`)
**Purpose**: Direct reference that implies lookup  
**Location**: Any file  
**Meaning**: "This relates to [target], find canonical [type] by searching for `##type:target`"

```javascript
// In authentication.js
// todo ::: implement JWT validation #docs:@company/auth/setup

// In package.json  
// note ::: auth service configuration #config:@company/auth

// In integration.test.js
// wip ::: auth flow testing #test:@company/auth
```

#### 3. Relational Link (`#see:#type:target`)
**Purpose**: Explicit cross-reference with directional intent  
**Location**: Any file  
**Meaning**: "For more information, see the canonical [type] for [target]"

```javascript
// In api-gateway.js
// notice ::: auth middleware required #see:#docs:@company/auth/setup

// In deployment.yml
// important ::: requires auth config #see:#config:@company/auth
```

### When to Use Generic vs Typed Anchors

#### Use Generic Anchors When:

- Marking a specific location or algorithm
- Creating stable reference points in code
- The anchor name is simple (no special characters)

```javascript
// about ::: ##auth/validation Input validation logic
// important ::: ##payment/retry Retry algorithm
// note ::: ##cache/lru LRU cache implementation
```

#### Use Typed Anchors When:

- Declaring canonical artifacts (docs, tests, configs)
- The name contains special characters (@, :)
- You want to categorize what something IS

```javascript
// tldr ::: ##docs:@company/auth API documentation
// tldr ::: ##test:@company/billing Test suite
// about ::: ##pkg:@company/utils Utility package
// tldr ::: ##api:v2/users User API endpoints
```

### Artifact Types: Beyond Documentation

Typed canonical anchors work with any artifact type:

**Documentation**: `##docs:@company/auth/api` - API reference  
**Configuration**: `##config:@company/database/prod` - Production DB config  
**Test Suites**: `##test:@company/payment/integration` - Payment tests  
**API Specs**: `##api:@company/billing/v2` - Billing API v2  
**Data Schemas**: `##schema:@company/user` - User data model  
**Runbooks**: `##runbook:@company/incident/security` - Security incident response  
**Architecture**: `##arch:@company/microservices` - Service architecture docs  
**Standards**: `##standard:@company/coding/typescript` - TypeScript guidelines

### When to Create New Artifact Types

**Reuse Existing Types When:**
- The content fits the semantic meaning of existing types
- `docs` for any explanatory content (guides, references, tutorials)
- `config` for any configuration data (settings, environment vars, flags)
- `test` for any validation or verification content
- `api` for interface specifications (REST, GraphQL, gRPC)

**Create New Types When:**
- Content has distinct purpose not covered by existing types
- Team needs domain-specific categorization (e.g., `playbook`, `design`, `spec`)
- Different validation or tooling requirements
- Clear semantic distinction from existing types

**Common Extended Types:**
- `design` - UI/UX mockups and design specifications  
- `playbook` - Step-by-step operational procedures
- `spec` - Technical specifications and requirements
- `guide` - How-to and tutorial content (alternative to `docs`)
- `policy` - Business rules and governance documents

### Understanding "Types" in Typed Canonical Anchors

A "type" in the pattern `##type:target` represents a **category of artifact** - it answers "What kind of content is this?"

**Key Principle**: A type should pass the "Canonical Test" - ask yourself:
> "Will someone actually need to reference this specific thing independently?"
> "Does it make sense to say 'This file/section IS the canonical [type] for [target]'?"

**What Makes a Good Type:**
- Represents a distinct category of content (docs, config, test, api)
- Could exist as a standalone file or section
- Has clear boundaries and purpose
- Would be searched for as a group (`rg "##config:"` to find all configs)

**What Should NOT Be a Type:**
- Attributes or properties (security, performance, backend)
- Relationships (fixes, blocks, depends)
- Status indicators (deprecated, experimental)
- Arbitrary groupings that don't represent artifacts

### Type Granularity Guidelines

Choose the appropriate level of granularity based on referenceable units:

**Too Granular** (avoid):
```javascript
// about ::: ##function:@company/utils/capitalize Single function
function capitalize(str) { ... }

// about ::: ##function:@company/utils/trim Another single function
function trim(str) { ... }
```

**Appropriate Granularity** (prefer):
```javascript
// about ::: ##api:@company/utils/string String manipulation utilities
// Groups related functions that would be referenced together

function capitalize(str) { ... }
function trim(str) { ... }
function truncate(str, len) { ... }
```

**Rule of Thumb**: Create a canonical anchor when:
- The content represents a complete, referenceable unit
- Others would search for this specific artifact
- It has enough substance to warrant its own identity
- It would make sense as a separate file (even if it isn't)

## Visual Clarity

The streamlined syntax creates natural visual groupings:

```javascript
// Both use # prefix, but with better visual organization
// !todo ::: critical fix #backend #security #fixes:#123 #blocks:#456 #owner:@alice #perf:critical

// Tags can be organized by type for clarity:
// !todo ::: critical fix
//   #backend #security #critical              // simple tags
//   #fixes:#123 #blocks:#456                 // relational tags
//   #owner:@alice #cc:@security              // ownership tags
//   #perf:hotpath #arch:critical-path        // attribute tags
```

## Search Patterns

The streamlined grammar maintains excellent search capabilities:

### Basic Searches

```bash
# Find all tags
rg "#backend"              # All backend tags
rg "#security"             # All security tags

# Find all relational tags  
rg "#owner:"                # All ownership
rg "#fixes:"                # All fix relationships
rg "#perf:"                 # All performance relational tags

# Find all anchors
rg "::: ##"                # All anchor definitions
rg "::: ##[^:]+"           # Generic anchors only
rg "::: ##\w+:"            # Typed anchors only
rg "##docs:"               # All documentation anchors
rg "##test:"               # All test anchors
rg "#auth/login"           # References to auth/login anchor

# Find specific references
rg "#fixes:#123"            # What fixes issue 123
rg "#owner:@alice"          # Alice's owned items
rg "#affects:#api,#billing" # Items affecting both
```

### Quick Reference Cheat Sheet

```bash
# Essential searches
rg "##[^:]+"                          # All canonical declarations
rg ":::"                              # All waymarks
rg "@company/auth"                    # All references to auth system
rg "@[a-zA-Z][^/]*$"                  # All actor references (no slashes)

# Typed artifact discovery
rg "##docs:"                          # All documentation declarations
rg "##config:"                        # All configuration declarations
rg "##test:"                          # All test suite declarations
rg "##api:"                           # All API specification declarations

# Reference patterns
rg "#docs:@company/auth"              # All doc references to auth
rg "#see:#docs:"                      # All "see also" doc references
rg "#deps:@company/"                  # All internal dependencies

# Validation queries
rg "::: ##"                           # Section starts (potential unclosed)
rg "##.*:::"                          # Section ends (potential orphaned)

# Type discovery
rg "##([^:]+):" -o | sort | uniq      # Find all defined types in use
rg "##docs:" --no-filename | sort     # List all documentation artifacts
rg "##config:" --no-filename | sort   # List all configuration artifacts
rg "##test:" --no-filename | sort     # List all test artifacts
```

### Multi-Level Discovery

A single search reveals the entire knowledge graph:

```bash
# Find everything related to company auth system
rg "@company/auth"
```

Results include:

- `@company/auth` - All package/service references
- `##docs:@company/auth/overview` - Documentation declarations  
- `##config:@company/auth` - Configuration declarations
- `##test:@company/auth/integration` - Test suite declarations
- `#docs:@company/auth/api` - Documentation references
- `#config:@company/auth` - Configuration references
- `#see:#docs:@company/auth/setup` - Cross-references

### Discovery Workflows

**Find all artifacts for a system:**

```bash
# Complete picture: definitions + artifacts + references
rg "@company/auth"

# Just the canonical artifacts (declarations)
rg "##[^:]+:@company/auth"

# Just the references (usage points)  
rg "#[^:]+:@company/auth" | grep -v "##"
```

**Explore by artifact type:**

```bash
# All documentation in the system
rg "##docs:" --no-filename | sed 's/.*##docs://' | sort | uniq

# All configuration files
rg "##config:" --no-filename | sed 's/.*##config://' | sort | uniq

# All test suites
rg "##test:" --no-filename | sed 's/.*##test://' | sort | uniq
```

**Impact analysis:**

```bash
# What needs auth documentation?
rg "#docs:@company/auth"

# What references auth config?
rg "#config:@company/auth"

# What would be affected by auth changes?
rg "#affects:@company/auth"
```

## Core Relational Tags

A minimal set of relational tags that cover real development needs:

### Work Relationships

- `#fixes:#123` - This fixes an issue
- `#closes:#456` - This closes an issue/PR  
- `#blocks:#789,#234` - This blocks other work
- `#blocked:#567` - This is blocked by something
- `#depends:#890,#123` - Dependencies
- `#issue:#456` - Issue reference
- `#ticket:#SUP-789` - Support ticket reference
- `#followup:#ID` - Follow-up work to be addressed later

### Versatile References

- `#for:#auth/login` - Context-dependent (see below)
- `#needs:@alice,#api-key,#auth,#rbac` - Flexible requirements
- `#relates:*` - Generic relationship (loosely related to this)
- `#see:#billing/tax,RFC-45` - General cross-reference  
- `#refs:#123,#auth/oauth` - Multiple references
- `#replaces:#old-thing` - Marks code or other element that this supersedes/replaces
- `#link:https://docs.api.com` - External link

### Specific References

- `#pr:#234` - Pull request
- `#commit:abc123f` - Git commit
- `#branch:feature/auth` - Git branch
- `#test:auth-suite` - Test suite reference
- `#feat:chat-v2` - Feature flag
- `#docs:/path/to/file.md` - Documentation reference (absolute path from repo root)

### Context

- `#affects:#billing,#auth,#payments` - Systems impacted
- `#owner:@alice,@bob` - Ownership
- `#cc:@security,@ops` - Keep informed

## The `#for:` Pattern

A single versatile rel tag that can take on different meanings based on context provided by the marker. This requires no additional tooling, just a consideration of its semantic connection to the marker.

```javascript
// With different markers, #for: means different things
// test ::: validation edge cases #for:#auth/login          // test FOR this
// docs ::: API usage guide #for:#payment/stripe           // docs FOR this  
// example ::: retry pattern #for:#patterns/resilience      // example FOR this
// stub ::: payment processing #for:#billing/checkout       // stub implementation FOR this
```

Use `#for:` to link work or documentation to a concept or code anchor. For relationships involving people, status, or issue tracking, prefer the more specific relational tags like `#owner`, `#blocked`, or `#fixes`.

**Key insight**: the meaning of `#for:` can be implied by considering the marker, making it incredibly flexible without adding complexity.

## Greppability Principle

**Always use `#` for reference values and `@` for actors** - this makes everything searchable:

- `#fixes:#123` - Both `#fixes` and `#123` are greppable
- `#blocked:#456` - Can find the blocking issue with `rg "#456"`
- `#depends:#789,#234` - All dependencies searchable
- `#owner:@alice` - @ is already greppable, no extra # needed

## Actor vs Package Disambiguation

**Actors never contain slashes**, while **package names always do** in the scoped format:

```javascript
// ✅ Actors (people/teams/agents) - no slashes
// todo ::: @alice implement OAuth integration
// review ::: @security-team audit the crypto implementation
// fixme ::: @bob fix the memory leak you introduced

// ✅ Package references - always @scope/package format  
// tldr ::: JWT middleware using @company/auth and @types/jsonwebtoken
// note ::: upgrade required #depends:@company/database,@prisma/client
// important ::: breaking change in @company/ui affects multiple apps

// ✅ Mixed usage works naturally
// todo ::: @alice update auth system to use @company/auth v2.0 #owner:@alice #depends:@company/auth
```

**Package names** are either:
- **Unscoped**: `lodash`, `express`, `react` (no `@` symbol)  
- **Scoped**: `@company/auth`, `@babel/core`, `@types/node` (always `@scope/package`)

This natural distinction eliminates any ambiguity between actors and package references.

Search examples:

```bash
# Find all references to issue 123
rg "#123\b"

# Find all blocking relationships
rg "#blocks:#\d+"

# Find work assigned to alice (actor)
rg "@alice"

# Find all actors (no slashes)
rg "@[a-zA-Z0-9_-]+\b"

# Find all package references (has slashes)
rg "@[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+"

# Find specific package usage
rg "@company/auth"
```

## Test Marker Addition

Add `test` as a core marker to the Work category:

```javascript
// Simple test marking
// test ::: boundary conditions for rate limiter

// Test with specific target
// test ::: OAuth refresh token flow #for:#auth/oauth

// Test with metadata
// test ::: payment retry logic #for:#payment/stripe #flaky #slow
```

**Usage guideline**: Use test waymarks when they add information beyond what the test framework provides:

- ❌ `test ::: login test` (redundant with test name)
- ✅ `test ::: flaky on slow connections #for:#auth/login #flaky`
- ✅ `test ::: regression from v4.2 #for:#payment/retry #issue:#456`

**Rationale:**

- Tests are work (writing, maintaining, fixing)
- Extremely common in codebases
- Enables the `#for:` pattern naturally
- Clear semantic meaning

## Examples

### Work Items

```javascript
// Simple todo with tags
// todo ::: implement user settings #frontend #react

// Complex todo with relational tags
// !todo ::: fix auth race condition 
//   #security #critical                    // relational tags
//   #fixes:#456,#789 #blocks:#234          // relational tags
//   #owner:@alice #cc:@security,@platform  // relational tags
//   #branch:fix/auth-race #pr:#567         // workflow tags
```

### Documentation and Tests

```javascript
// Typed anchor declaring this IS the auth docs
// tldr ::: ##docs:@company/auth/setup Setup and configuration guide

// Generic anchor marking important location
// about ::: ##payment/stripe-webhook Webhook processing logic

// Test with references to both
// test ::: OAuth flow validation 
//   see:#docs:@company/auth/setup       // Reference to typed anchor
//   at:#payment/stripe-webhook          // Reference to generic anchor
```

### System References

```javascript
// Service with mixed relational tags
// notice ::: deploying auth service v2
//   #deployment #breaking-change           // relational tag
//   #affects:#frontend,#mobile,#api        // relational tag
//   #owner:@platform #version:2.0.0        // descriptive tag
//   #see:#docs:@company/auth/migration     // anchor reference
```

### Package and Module References

```javascript
// Typed anchor for scoped package (@ requires typed anchor)
// about ::: ##pkg:@company/auth Internal authentication package

// Documentation for the package
// tldr ::: ##docs:pkg:@company/auth Package usage guide

// Generic anchor for algorithm  
// important ::: ##algorithms/jwt-verify JWT verification logic

// Usage with all reference types
// todo ::: upgrade auth system
//   #depends:@company/auth@2.0           // package dependency (not anchor)
//   see:#pkg:@company/auth               // reference to package anchor
//   at:#algorithms/jwt-verify            // reference to generic anchor
//   docs:#docs:pkg:@company/auth         // reference to package docs
```

### Complete System Example

Here's how a complete authentication system would be documented using typed canonical anchors:

```javascript
// Work with clear relationships
// *!todo ::: @alice critical auth fix #blocks:#456,#789 #needs:@security #pr:#234

// Canonical anchor for stable reference point
// about ::: ##payment/stripe-webhook Stripe webhook handler #payments #critical

// Test with context
// test ::: webhook retry logic #for:#payment/stripe-webhook #flaky #integration

// Simple documentation reference
// note ::: see integration guide #docs:/docs/architecture/auth.md #link:https://docs.stripe.com

// Clean multi-ownership
// wip ::: implementing RBAC #owner:@security,@alice #branch:feature/rbac

// Clear system impacts
// !!notice ::: deploying breaking change #affects:#api,#billing,#frontend

// Performance hotspot (standalone tag for common concept)
// todo ::: optimize JSON serialization inner loop #hotpath

// Entry point - critical for understanding system startup
// tldr ::: ##app/init initialize cache and database connections #entrypoint

// Security boundary - where external data enters
// important ::: validate all user input here #boundary #sec:input

// State management - central source of truth
// about ::: ##state/user-store global user state management #arch:state,singleton

// Error handling - where errors bubble up to
// important ::: ##errors/handler central error recovery point #error:boundary

// Data flow - key transformation point
// note ::: user data transformed for API here #data:transform #api:internal

// Integration point - external service connection
// important ::: ##integration/stripe Stripe webhook handler #api:external #arch:integration

// Critical path - must be fast
// todo ::: optimize query performance #critical-path #data:source

// Experimental - not production ready
// wip ::: new search algorithm #experimental
```

Full authentication system example:

```javascript
// === Service Overview ===
// about ::: The @company/auth package provides authentication and authorization #services #security #critical
```

<!-- !!todo ::: #issue:#52 Define escaping rules for waymarks containing --> and multi-line waymark format in HTML comments -->
```markdown
<!-- === Documentation Artifacts (in respective .md files) === -->
<!-- tldr ::: ##docs:@company/auth/overview Authentication service architecture and design principles -->
<!-- tldr ::: ##docs:@company/auth/api REST API endpoints, authentication, and authorization -->
<!-- tldr ::: ##docs:@company/auth/setup Local development environment setup and debugging -->
<!-- tldr ::: ##docs:@company/auth/deployment Production deployment and configuration guide -->
<!-- tldr ::: ##docs:@company/auth/troubleshooting Common issues and resolution procedures -->
```

```json
// === Configuration Artifacts (in respective config files) ===
// tldr ::: ##config:@company/auth/prod Production JWT settings, secrets, and security policies
// tldr ::: ##config:@company/auth/dev Development environment auth configuration
// tldr ::: ##config:@company/auth/test Test environment with mock JWT tokens
```

```javascript
// === Test Artifacts (in respective test files) ===
// tldr ::: ##test:@company/auth/unit Unit tests for auth service functions
// tldr ::: ##test:@company/auth/integration Integration tests for auth API endpoints
// tldr ::: ##test:@company/auth/e2e End-to-end authentication and authorization flows
```

```yaml
# === API Specification (in OpenAPI file) ===
# tldr ::: ##api:@company/auth/v2 Authentication service OpenAPI v2.0 specification
```

```markdown
<!-- === Runbook (in operations guide) === -->
<!-- tldr ::: ##runbook:@company/auth/incident Authentication service incident response procedures -->
```

```javascript
// === Usage References ===

// In application code
// todo ::: implement JWT validation #docs:@company/auth/api #config:@company/auth/prod
// fixme ::: session timeout on mobile #affects:@company/auth #test:@company/auth/e2e
// note ::: rate limiting required #see:#docs:@company/auth/api

// In infrastructure code  
// config ::: auth service deployment #config:@company/auth/prod #see:#docs:@company/auth/deployment
// test ::: auth load testing #test:@company/auth/integration

// In other services
// todo ::: integrate SSO #deps:@company/auth #see:#docs:@company/auth/overview
// notice ::: auth token format change #affects:@frontend/app,@mobile/app #see:#docs:@company/auth/migration

// === Cross-Service References ===

// From user service
// note ::: depends on auth for user sessions #deps:@company/auth #see:#api:@company/auth/v2

// From billing service  
// important ::: requires authenticated requests #deps:@company/auth #see:#docs:@company/auth/api

// From admin dashboard
// config ::: admin auth configuration #see:#config:@company/auth/prod

// === Operational References ===

// In monitoring alerts
// alert ::: auth service down #runbook:@company/auth/incident

// In deployment pipeline
// deploy ::: auth service rollout #see:#docs:@company/auth/deployment #config:@company/auth/prod
```

<!-- !!todo ::: #issue:#52 Normalize heading hierarchy (avoid duplicate H2s) -->
## Benefits

### 1. **Visual Hierarchy**

- All tags use `#` but can be visually grouped by type
- Anchors (with `##`) stand out as special reference points
- Less visual noise overall

### 2. **Cognitive Simplicity**

- One rule for all tags: "Always starts with #"
- No distinction between "relational" and "attribute" relational tags
- Anchors are just anchors (some happen to have types)

### 3. **Maintained Searchability**

- Everything remains greppable
- Common searches become cleaner
- `rg "::: ##"` finds all anchor definitions

### 4. **Composability**

- Mix and match components as needed
- Natural grouping of similar elements
- Progressive complexity (start simple, add as needed)

### 5. **Self-Describing Architecture**

Every file immediately communicates its purpose and relationships:

**Before (Generic anchors):**

```javascript
// tldr ::: ##auth/jwt-config JWT settings #configuration
```

*Question: Is this a config file, documentation, or something else?*

**After (Typed anchors):**

```javascript
// tldr ::: ##config:@company/auth/jwt JWT token configuration and secrets
```

*Clear: This IS the canonical configuration for company auth JWT*

### 6. **Intelligent Knowledge Navigation**

Every entity becomes a typed hub with discoverable artifacts:

```bash
# Start with any entity
rg "@company/auth"

# Discover ALL artifact types for this entity
rg "##[^:]+:@company/auth"
# Results: ##docs:@company/auth/overview, ##config:@company/auth, ##test:@company/auth/e2e

# Find specific artifact types
rg "##docs:@company/auth"     # All documentation
rg "##config:@company/auth"   # All configuration  
rg "##test:@company/auth"     # All test suites
```

### 7. **Zero-Ambiguity File Identification**

Files declare their exact purpose and scope:

```javascript
// Immediately clear what each file contains:
// tldr ::: ##docs:@company/billing/api Billing service REST API documentation
// tldr ::: ##config:@company/billing/prod Production billing service configuration  
// tldr ::: ##test:@company/billing/integration Billing payment flow integration tests
// tldr ::: ##runbook:@company/billing/incident Billing service incident response procedures
```

### 8. **Tool Intelligence & Validation**

Parsers can understand and validate file relationships:

- **Link Resolution**: Tools can resolve `#docs:@company/auth` to `##docs:@company/auth/overview`
- **Broken Link Detection**: Flag references to non-existent canonical artifacts
- **Coverage Analysis**: Identify entities missing documentation, tests, or config
- **Consistency Checks**: Ensure naming conventions across artifact types
- **Uniqueness Validation**: Detect duplicate `##type:target` declarations across repository
- **Collision Detection**: Flag when same `##type:target` appears in multiple files

**Validation Rules:**
- **Error**: Duplicate canonical declarations (same `##type:target` in multiple files)
- **Warning**: References to non-existent canonical anchors
- **Info**: Entities missing common artifact types (docs, config, tests)

**Example Collision Error:**
```
Error: Duplicate canonical anchor ##docs:@company/auth/setup
  Found in: docs/auth/setup.md:1
  Found in: guides/authentication.md:15
  
Resolution: Keep one canonical declaration, use cross-references for the other
```

## Attribute Tags

Attribute tags describe characteristics of code rather than relationships. They answer "what kind of code is this?"

### Format

- Use `#category:attribute` for structured classification
- Common attributes can be standalone tags for easy searching
- Can combine: `#hotpath #perf:critical,bottleneck`

**When to use standalone tags** (e.g., `#hotpath`):

- Quick marking during development
- Common concepts everyone understands
- When the category is obvious from context
- For easier grep searches

**When to use category form** (e.g., `#perf:hotpath`):

- When precision matters
- Multiple related attributes (e.g., `#perf:critical,bottleneck`)
- Building tooling that processes categories
- Avoiding namespace collisions

**Recommended pattern for references**: When using attribute values in relational tags, always include `#`:

- ✅ `#for:#perf/hotpath` or `#refs:#arch/entrypoint`
- ❌ `#for:perf/hotpath` (missing # makes it less greppable)

This ensures maximum searchability - you can find all hotpaths with `rg "#hotpath"` whether they're written as `#hotpath`, `#perf:hotpath`, or referenced as `#for:#hotpath`.

<!-- !!todo ::: #issue:#52 CRITICAL: Resolve attribute tag aliases ambiguity - decide if they're equivalent in v1.0 -->
**Important**: While `#hotpath` and `#perf:hotpath` are intended to mean the same thing, without tooling support they're technically independent tags. For consistency:

- Use standalone shortcuts (`#hotpath`) for quick marking
- Use category form (`#perf:hotpath`) when being explicit
- Search patterns above show how to find both forms
- Future tooling may treat them as aliases

### Core Attribute Categories

#### Performance (`#perf:`)

- `#perf:hotpath` - Performance-critical code path
- `#perf:critical-path` - Must execute efficiently
- `#perf:bottleneck` - Known performance constraint
- `#perf:optimized` - Already optimized code

**Standalone shortcuts**: `#hotpath`, `#critical-path`, `#bottleneck`

#### Architecture (`#arch:`)

- `#arch:entrypoint` - Where execution begins
- `#arch:boundary` - System/security boundary  
- `#arch:singleton` - Single instance in system
- `#arch:state` - State management location

**Standalone shortcuts**: `#entrypoint`, `#boundary`

#### Security (`#sec:`)

- `#sec:boundary` - Security boundary
- `#sec:input` - External input point
- `#sec:sanitize` - Input sanitization
- `#sec:auth` - Authentication logic
- `#sec:authz` - Authorization logic
- `#sec:crypto` - Cryptographic operations

#### Code Behavior (`#code:`)

- `#code:pure` - No side effects
- `#code:sideeffect` - Has external effects
- `#code:async` - Asynchronous operation
- `#code:callback` - Callback pattern
- `#code:recursive` - Recursive implementation

#### Data Flow (`#data:`)

- `#data:source` - Where data originates
- `#data:transform` - Data transformation
- `#data:sink` - Where data ends up
- `#data:sensitive` - PII/sensitive data

#### API (`#api:`)

- `#api:endpoint` - API endpoint
- `#api:internal` - Internal API
- `#api:external` - External API
- `#api:deprecated` - Deprecated API

#### Status (`#status:`)

- `#status:experimental` - Not production ready
- `#status:stable` - Well-tested, reliable
- `#status:legacy` - Old code needing care
- `#status:migration` - Being migrated

**Standalone shortcuts**: `#experimental`, `#stable`, `#legacy`

#### Error Handling (`#error:`)

- `#error:handler` - Error handling logic
- `#error:boundary` - Error boundary
- `#error:recovery` - Recovery point

### Attribute Tag Examples

```javascript
// Performance-critical code (standalone for common concepts)
// todo ::: optimize JSON parser #hotpath
// todo ::: fix memory leak #bottleneck

// Security boundaries (category form for precision)
// important ::: validate all user input #sec:boundary,input
// important ::: sanitize HTML content #sec:sanitize

// Architecture points (mix of standalone and category)
// about ::: ##app/init main entry point #entrypoint
// important ::: global state store #arch:state,singleton

// Data flow (category form for clarity)
// note ::: user data transformed here #data:transform #api:internal
// important ::: PII encrypted here #data:sensitive #sec:crypto

// Mixed attributes (combining standalone and category)
// todo ::: async request handler #async #api:endpoint #critical-path

// References to attributes (always include #)
// test ::: performance test #for:#hotpath
// fixme ::: race condition in handler #refs:#app/init
```

### Attribute Tag Search Patterns

<!-- !!todo ::: #issue:#52 Document grep tool requirements - many patterns assume ripgrep-specific features -->
```bash
# Find all hotpaths (standalone or in category)
rg "#(perf:)?hotpath"                    # Matches #hotpath and #perf:hotpath
waymark find #hotpath                    # Simpler: finds all hotpath variations

rg "#(perf:[^#\s]*)?hotpath"            # Also matches #perf:critical,hotpath
waymark find #hotpath                    # Same command handles all cases

# Find all performance-related tags
rg "#perf:"                              # All performance attributes
waymark find --category perf             # All perf category tags

rg "#(perf:|hotpath|bottleneck)"         # Performance tags including standalone
waymark find #perf #hotpath #bottleneck  # Multiple tag search (OR by default)

# Find security boundaries (any form)
rg "#(sec:)?boundary"                    # Matches #boundary and #sec:boundary
waymark find #boundary                   # Finds both forms automatically

rg "#sec:"                               # All security attributes
waymark find --category sec              # All security category tags

# Find experimental code (any form)
rg "#(status:)?experimental"             # Both forms
waymark find #experimental               # Understands both variations

# Complex searches with comma-separated values
rg "#perf:[^#\s]*hotpath"               # Finds hotpath in any perf: list
waymark find #perf:hotpath               # Direct search for specific combo

# Find by category regardless of order
rg "#data:(source|transform|sink)"       # Any data flow point
waymark find --category data             # All data attributes

# Combining searches
rg "#code:(pure|sideeffect|async)"      # Any code behavior
waymark find --any #code:pure #code:async  # Find pure OR async code
waymark find --all #api:endpoint #async     # Find async endpoints
```

These attribute tags create a semantic map that helps both humans and AI agents understand code characteristics at a glance.

## Key Principles

### Consistent Tag Syntax

```javascript
// All tags start with # - no exceptions
// todo ::: task #priority:high #owner:@alice #fixes:#123
```

### Component Summary

1. All tags start with `#` (simple, attribute, or relational)
2. Actors always use `@`
3. Anchor definitions use `##`
4. Anchor references use `#`

## Updated Core Markers

With the addition of `test`:

- **Primary**: `tldr`
- **Work**: `todo`, `fixme`, `refactor`, `review`, `wip`, `stub`, `temp`, `done`, `deprecated`, `test`
- **Info**: `note`, `idea`, `about`, `example`
- **Attention**: `notice`, `risk`, `important`

## Terminology Summary

| Component | Syntax | Example | Purpose |
|-----------|--------|---------|---------|
| **Tag** | `#word` | `#backend` | Simple labels |
| **Relational Tag** | `#key:value` | `#owner:@alice` | Key-value pairs |
| **Actor** | `@name` | `@alice` | People/teams/agents |
| **Generic Anchor** | `##name` | `##auth/login` | Named locations |
| **Typed Anchor** | `##type:name` | `##docs:@company/auth` | Canonical artifacts |
| **Anchor Reference** | `#name` or `#type:name` | `#auth/login`, `#docs:@company/auth` | Points to anchors |
| **Signal** | `!`, `!!`, `*`, etc. | `!!todo` | Priority/scope modifiers |

## Namespace Design

### Package Format: `@scope/name` and `pkg:@scope/name`

- `@waymark/schema` or `pkg:@waymark/schema` - Open source packages
- `@company/auth` or `pkg:@company/auth` - Internal services  
- `@team/toolkit` or `pkg:@team/toolkit` - Team-specific tools
- `@projects/auth-v2` or `pkg:@projects/auth-v2` - Project codenames

<!-- !!todo ::: #issue:#52 CRITICAL: Choose single canonical form for v1.0 - currently allows both formats -->
**Tooling Note**: Waymark tools should treat `pkg:@scope/package` and `@scope/package` as synonyms. While `pkg:@scope/package` is more explicit for grep searches, both forms are valid and equivalent.

### Documentation Paths: `#docs:@scope/name/topic` or `#docs:pkg:@scope/name/topic`

- `#docs:@waymark/schema/grammar` or `#docs:pkg:@waymark/schema/grammar` - Grammar documentation
- `#docs:@company/auth/api` or `#docs:pkg:@company/auth/api` - API documentation
- `#docs:@projects/auth-v2/timeline` or `#docs:pkg:@projects/auth-v2/timeline` - Project timeline

<!-- !!todo ::: #issue:#52 Standardise package references (`##pkg:@scope/name`) vs bare `@scope/name`; update examples -->
**Consistency Note**: Both forms work, but within a project, prefer consistency. The `pkg:` prefix makes searches more explicit when mixing packages with other `@` entities.

### Actor Format: `@username`

- `@alice` - Individual contributors
- `@security-team` - Team entities
- `@external-consultant` - External entities

**Note**: Actors don't need canonical definitions - they ARE the identifier

### Extensible Canonical Pattern: `##tag:value`

The `##` prefix works with any tag to create domain-specific canonical namespaces:

**Infrastructure & Services**:

- `##env:production` - Environment definitions
- `##service:auth-api` - Service specifications
- `##db:users-primary` - Database references

**Standards & Protocols**:

- `##rfc:7519` - Technical standards (JWT)
- `##api:rest/v2` - API specifications
- `##proto:grpc/user` - Protocol definitions

**Processes & Workflows**:

- `##process:code-review` - Process documentation
- `##workflow:deployment` - Workflow specifications
- `##sop:incident-response` - Standard operating procedures

**Business & Domains**:

- `##domain:billing` - Business domain definitions
- `##feature:oauth` - Feature specifications
- `##epic:mobile-redesign` - Project epics

**Data & Schemas**:

- `##schema:user` - Data schema definitions
- `##event:user-signup` - Event specifications
- `##metric:page-load-time` - Metric definitions

This pattern allows unlimited extensibility - any concept that needs a canonical definition can use `##namespace:identifier`.

## Relationship to Documentation Systems

### Integration with JSDoc/TSDoc

Canonical references work seamlessly alongside traditional documentation systems. While JSDoc provides type information and API documentation, waymarks (including canonical refs) provide navigation and cross-referencing:

```javascript
// about ::: ##api/auth/service Core authentication service
/**
 * JWT-based authentication service with rate limiting.
 * Handles user login, logout, and session management.
 * 
 * @class AuthService
 * @since 2.0.0
 */
class AuthService {
    // todo ::: implement token rotation #refs:#api/auth/tokens
    /**
     * Authenticates user credentials.
     * @param {string} username - User's username
     * @param {string} password - User's password
     * @returns {Promise<AuthResult>} Authentication result
     */
    async authenticate(username, password) {
        // Implementation
    }
}
```

<!-- !!todo ::: #issue:#52 Fix or remove reference to non-existent jsdoc-integration.md file -->
The waymark provides a stable navigation anchor (`##api/auth/service`) while JSDoc handles the API documentation. They complement rather than compete. See [JSDoc Integration Proposal](./jsdoc-integration.md) for detailed patterns.

## Custom Extensions

### Custom Definitions System

The v1.0 spec introduces a flexible system for custom markers and tags beyond the standard vocabulary:

**Core Principle**: Anything not in loaded dictionaries is considered custom.

<!-- !!todo ::: #issue:#52 Either fully specify JSON configuration format, where config files live, default behaviors, or remove references -->
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
// todo ::: task #priority:high       // Use: !todo or !!todo
// todo ::: task #assigned-to:alice   // Use: @alice or #owner:@alice
// todo ::: task #status:blocked      // Use: #blocked or #blocked:#123

// ✅ Correct usage
// !todo ::: critical task @alice #blocked:#456
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

<!-- !!todo ::: #issue:#52 Define what "liberal", "standard", "strict" modes actually include -->
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
// fixme ::: update systems #affects:#api,#billing,#frontend
```

However, the grammar acknowledges these alternative patterns as valid extensions:

```javascript
// Bracketed arrays - space-separated with clear boundaries
// todo ::: add dependencies #deps:[lodash react typescript]
// wip ::: matrix testing #test:[ubuntu-latest macos-latest windows-latest]

// Parentheses groups - allows spaces after commas
// notice ::: system update #affects:(api, frontend, mobile)
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

<!-- !!todo ::: #issue:#52 Define "Progressive Enhancement" levels more specifically -->
<!-- !!todo ::: #issue:#52 Specify which array patterns are required vs optional for tools -->
**Progressive Enhancement**:
1. Level 0: Treat as opaque string
2. Level 1: Recognize as array pattern
3. Level 2: Parse specific pattern type
4. Level 3: Understand semantics

This approach lets teams adopt richer array syntax when needed while keeping the core spec simple and universal.

## Migration Strategy

### Phase 1: Canonical Definitions
Add typed anchors for key entities:

- Critical services and packages
- Core team members
- Major projects

### Phase 2: Documentation Links
Convert existing docs to use `##docs:@entity/topic` pattern:

- API documentation
- Setup guides
- Troubleshooting docs

### Phase 3: Cross-References
Add `#see:` references throughout codebase:

- Link code to documentation
- Reference canonical definitions
- Connect related systems

### Phase 4: Advanced Patterns
Extend to new entity types:

- Client applications
- Data sources
- External integrations

## Migration Summary

### Quick Conversions

- `priority:high` → **REMOVE** - Use signals instead: `!todo` (NOT `#priority:high`)
- `priority:critical` → **REMOVE** - Use signals: `!!todo`
- `+backend` → `#backend`
- `fixes:123` → `#fixes:#123` (always include # for references)
- `branch:feature/auth` → `#branch:feature/auth`
- `status:blocked` → `#blocked` or `#blocked:#123`
- Actors stay the same: `@alice` remains `@alice`

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
rg "!todo"              # Find high priority todos
rg "!!todo"             # Find critical todos
rg "#p3"                # ONLY for explicit low priority (rare)

# Finding references (always use #)
rg "#123\b"             # Find issue 123
rg "#fixes:#\d+"        # Find all fixes
rg "#blocked:#\d+"      # Find blocked by issues
rg "#blocked\b"         # Find items marked as blocked
```

## What We're NOT Doing

1. **No complex tag expansions**: `#urgent` stays `#urgent` and/or using a `!!todo` signaled marker, not `#priority:critical`
2. **No forced hierarchies**: Teams can use whatever tags make sense
3. **No ambiguous value policing**: If a team wants `#high`, let them
4. **No complex configuration**: No tag dictionaries, expansion rules, or pattern files
5. **No `--is` category syntax**: Direct marker searches instead

## Conclusion

This streamlined grammar with typed canonical anchors achieves:

- **Clarity**: Visual distinction between component types
- **Simplicity**: Fewer rules to remember
- **Power**: Full expressiveness maintained
- **Searchability**: Excellent grep patterns
- **Intelligence**: Self-describing architecture with typed knowledge graphs
- **Extensibility**: Works for any artifact type in any domain

The result is a waymark system that's easier to read, write, and search while maintaining all the power of the original design and enabling intelligent tooling through typed canonical references.

### Benefits Summary

**Core Advantages**:

1. **Self-Describing Architecture**: Files declare their purpose and authority explicitly
2. **Typed Knowledge Graph**: Every artifact has a clear type and relationship
3. **Zero-Ambiguity References**: No guessing about file contents or purpose  
4. **Intelligent Discovery**: Find artifacts by type, entity, or cross-reference
5. **Tool-Friendly**: Parsers can understand, validate, and resolve relationships
6. **Infinite Extensibility**: Works for any artifact type in any domain

**Transformation Impact**:

**Before:** Waymarks as simple annotations  
**After:** Waymarks as a typed, navigable knowledge graph

**Before:** Files need context to understand purpose  
**After:** Files declare their identity and canonical authority

**Before:** Documentation scattered and hard to find  
**After:** Every entity has discoverable, typed artifacts

**Before:** Manual effort to understand system relationships  
**After:** Automated discovery of dependencies and impacts

**Key insight:** Actors (@alice) and packages (@scope/name) are inherently unique - only anchors need canonical definitions

**Organizational Benefits**:

- **Faster Onboarding**: New team members can systematically explore by artifact type
- **Reduced Context Switching**: Find exactly what you need without guessing
- **Improved Documentation Culture**: Easy to create and maintain canonical artifacts  
- **Better Architecture Visibility**: Self-documenting system relationships
- **Enhanced Tool Development**: Rich semantic information enables intelligent tooling
- **Future-Proof Knowledge**: Scales to any domain or artifact type

**Future Tooling Possibilities**:

**Graph Visualization**: `waymark graph` command generates DOT/PNG of entity relationships
**LSP Integration**: VS Code hover shows canonical artifact content inline
**Auto-Generation**: CLI tools create canonical anchors for existing content
**Coverage Reports**: Identify entities missing documentation, tests, or configuration
**Impact Analysis**: Visualize what changes when entities are modified

This system transforms waymarks from simple annotations into a self-describing, typed knowledge graph that becomes more valuable and intelligent as it grows across an organization.

## See Also

<!-- !!todo ::: #issue:#52 Fix or remove references to non-existent documentation files -->
- [Waymark 1.0 Simplification](waymark-1.0-simplification.md) - Core waymark patterns
- [Custom Tags](../docs/usage/patterns/custom-tags.md) - Creating project-specific tags
- [Search Patterns](../docs/usage/search/) - Finding waymarks effectively