<!-- tldr ::: decisions made while finalizing the waymark v1.0 specification -->

# Waymark Streamlined Decisions

This document captures key decisions made while resolving issues in the waymark v1.0 specification.

## Decisions

1. [Attribute Tag Format](#1-attribute-tag-format) - Use universal colon pattern `category:#tag` for scoped tags
2. [Priority System](#2-priority-system) - Use only signals (!, !!) for priority, no priority tags
3. [Package Reference Format](#3-package-reference-format) - Use `@scope/package` for scoped, `#package` for unscoped
4. [Universal Colon Pattern](#4-universal-colon-pattern-for-keyvalue-pairs) - All key:value pairs use colon with natural prefixes
5. [Reference Tags](#5-reference-tags) - External references use `key:value` with no prefix for external entities
6. [Multiline Waymarks](#6-multiline-waymarks) - Not supported in v1.0, considered antipattern
7. [Array Syntax Clarification](#7-array-syntax-clarification) - Arrays supported with universal colon pattern
8. [Undefined Tokens Resolution](#8-undefined-tokens-resolution) - Remove or clarify undefined tokens
9. [Arrow Notation in HTML Comments](#9-arrow-notation-in-html-comments) - Use `→` to avoid comment closure
10. [Semver Patterns with @ Symbol](#10-semver-patterns-with--symbol) - Support `@version` for packages
11. [Grep Tool Requirements](#11-grep-tool-requirements) - Document ripgrep features and alternatives
12. [Ecosystem Convention Conformance](#12-ecosystem-convention-conformance) - Waymarks adapt to existing conventions, not vice versa

---

## 1. Attribute Tag Format

**Decision**: Use universal colon pattern `category:#tag` for scoped tags (not `#category:tag`).

**Note**: With [Decision 4](#4-universal-colon-pattern-for-keyvalue-pairs), attribute tags now follow the universal colon pattern: `category:#tag` (e.g., `perf:#hotpath`).

### 1.1 The Problem

The original spec had confusing "aliasing" between standalone tags and category tags:

- `#hotpath` and `#perf:hotpath` were "intended to mean the same thing"
- But "technically independent tags without tooling"
- This created ambiguity about whether they were equivalent

### 1.2 The Solution (Updated)

With the universal colon pattern:

- **Standalone tag**: `#hotpath`
- **Scoped tag**: `perf:#hotpath`
  - ❌ NEVER: `perf#hotpath`, `#perf:hotpath`, `#perf/hotpath`

These are clearly distinct - one is a simple tag, the other is a key:value relationship.

### 1.3 Examples

```javascript
// Quick tagging (standalone)
// todo ::: optimize parser #hotpath

// Categorized tagging (with universal colon pattern)
// todo ::: optimize parser perf:#hotpath

// Multiple attributes
// important ::: validate input sec:#boundary,#input,#sanitize

// Mixed usage
// note ::: critical handler #entrypoint arch:#boundary perf:#critical-path
```

### 1.4 Benefits

1. **No aliasing confusion** - Tags are clearly independent
2. **Dead simple grep patterns**:
   ```bash
   rg "#hotpath"        # Finds standalone #hotpath
   rg ":#hotpath"       # Finds categorized perf:#hotpath
   rg "perf:#"          # Finds all perf-categorized attributes
   rg "sec:#boundary"   # Finds specific categorized attribute
   ```
3. **No special parsing** - No colons, no arrays, no complexity
4. **Natural reading** - "perf hotpath", "sec boundary"
5. **Backwards compatible** - Old `#hotpath` still works

### 1.5 Implementation

With the universal colon pattern:

- **Simple tag**: `#tagname`
- **Scoped tag**: `category:#tagname`
- **Arrays when needed**: `perf:#hotpath,#critical,#bottleneck`

The key insight: `#perf:hotpath` was incorrect thinking - it mixed tag syntax with key:value syntax. The correct forms are:

- `#hotpath` (simple tag)
- `perf:#hotpath` (key:value relationship)

---

## 2. Priority System

**Decision**: Use only signals (!, !!) for priority. No priority tags allowed.

### 2.1 The Problem

The spec had an inconsistency:

- Forbids `#priority:high`
- But allows `#p3` for low priority
- This created a confusing exception

### 2.2 The Solution

**No priority tags at all**. Use only signals:

- `!!todo` - Critical (P0)
- `!todo` - High priority (P1)
- `todo` - Normal priority (P2)

That's it. Three levels is sufficient.

### 2.3 Why No Low Priority Tag?

Low priority work is better handled by:

1. **Issue trackers** - Most teams already have priority fields there
2. **Backlog placement** - Low priority naturally falls to bottom
3. **Description text** - Can note "nice to have" in the waymark
4. **Simply not tagging it** - If it's truly low priority, maybe it doesn't need a waymark

### 2.4 Examples

```javascript
// Critical priority
// !!todo ::: fix security vulnerability

// High priority  
// !todo ::: implement auth before launch

// Normal priority
// todo ::: add user preferences

// Not tagging low priority work at all
// (or just mention in regular comments)
```

### 2.5 Benefits

1. **Consistency** - One rule: "signals for priority, period"
2. **Simplicity** - No special cases or exceptions
3. **Visual clarity** - Signals provide immediate visual priority
4. **Greppable** - `rg "!!todo"` finds critical, `rg "!todo"` finds high
5. **Realistic** - Most codebases only need 3 priority levels

### 2.6 Implementation

- Remove ALL priority tags (`#p3`, `#priority:*`, etc.)
- Update examples to use only signals
- Remove any mention of "explicit low priority"
- Document that three levels (critical/high/normal) are sufficient

---

## 3. Package Reference Format

**Decision**: Use `@scope/package` for scoped packages, `#package` for unscoped packages.

### 3.1 The Problem

There was concern about ambiguity between actors and packages:

- `@alice` - Actor
- `@scope/package` - Package? Actor?
- Could we tell them apart?

### 3.2 The Solution

**Actors never contain slashes**, and unscoped packages get `#` prefix for consistency:

- `@alice` - Always an actor (no slash)
- `@scope/package ` - Always a scoped package (has slash)
- `#package-name` - Unscoped package (# prefix for greppability)

### 3.3 Examples

```javascript
// Clear distinction - slash means scoped package, # means unscoped package
// todo ::: @alice upgrade @acme/auth to v2.0

// Package references in relationships
// note ::: requires depends:#lodash,#react,@acme/auth

// Unscoped packages (# prefix for greppability)
// todo ::: replace #moment with #date-fns

// Mixed usage is unambiguous
// todo ::: @bob review PR for @acme/auth upgrade owner:@bob depends:@acme/auth,#lodash
```

### 3.4 Benefits

1. **Natural npm syntax** - No mental translation needed
2. **Slash disambiguates** - `@word` = actor, `@word/word` = package
3. **Familiar to developers** - Standard package notation
4. **No new syntax to learn** - Uses existing conventions

### 3.5 Search Patterns

```bash
# Find all actors (no slashes)
rg "@[a-zA-Z0-9_-]+\b"

# Find all scoped packages (has slashes)
rg "@[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+"

# Find all unscoped packages (# prefix in dependencies)
rg "depends:#[a-zA-Z0-9_-]+"

# Find specific package usage
rg "@acme/auth"    # Scoped package
rg "#lodash\b"        # Unscoped package
```

### 3.6 Implementation

- Use standard npm notation for packages
- No special prefix needed
- Keep `##package-name` for typed canonical anchors (different context)

---

## 4. Universal Colon Pattern for Key:Value Pairs

**Decision**: Use a universal `key:value` pattern for all relational tags, with values keeping their natural prefixes (not `#key:value`).

### 4.1 The Problem

Our previous approach created inconsistent patterns:

- Relational tags: `#fixes:#123`, `#owner:@alice`, `#affects:#billing,#auth,#payments`
- Reference tags: `#link:url`, `#docs:path`
- Arrays were complex: `#affects:#billing,#auth,#payments` - parsing overhead

This mixing of patterns created confusion about syntax consistency and parsing complexity.

### 4.2 The Solution

**Universal rule**: All key:value pairs use colon, and values keep their natural prefixes:

- **Issue relationships**: `fixes:#123`, `blocks:#456`
- **Actor relationships**: `owner:@alice`, `cc:@bob`
- **Attribute relationships**: `perf:#hotpath`, `sec:#boundary`
- **Package relationships**: `depends:#package-name,@scope/package`
- **External references**: `link:https://example.com`, `docs:/path/to/file.md`

### 4.3 Why This Works

```javascript
// Given this waymark:
// todo ::: implement auth fixes:#123 blocks:#456 owner:@alice

// Search for all references to issue 123
rg "#123"           // ✓ Finds it everywhere

// Search for RELATIONSHIPS to issue 123
rg ":#123"          // ✓ Finds fixes:#123 specifically

// Search for all things that fix issues
rg "fixes:#"        // ✓ Finds all fix relationships

// Search for Alice
rg "@alice"         // ✓ Finds her everywhere
rg ":@alice"        // ✓ Finds where she's referenced to
```

### 4.4 Examples

```javascript
// Work relationships with issues
// todo ::: critical bug fixes:#123,#456 blocks:#789 owner:@alice

// Attribute relationships
// todo ::: optimize parser perf:#hotpath,#critical arch:#boundary

// Package dependencies (scoped and unscoped)
// note ::: requires depends:#lodash,#react,@acme/auth@2.0

// Mixed references
// notice ::: deployment affects:#billing,#auth,#frontend cc:@alice,@bob

// External references (no prefix - they're external)
// note ::: see guide docs:README.md link:https://oauth.net affects:#frontend
```

### 4.5 The Rule for Prefixes

**Values in key:value pairs keep their natural prefixes**:

- **Waymarkable entities** (issues, tags, anchors): `#value`
- **Actors**: `@value`
- **Scoped packages**: `@scope/package` (the `/` disambiguates from actors)
- **Unscoped packages**: `#value` (consistent with other waymarkable entities)
- **External references** (URLs, file paths): no prefix

### 4.6 Array Search Patterns

Arrays require specific grep patterns to find individual items:

```bash
# Find #critical anywhere (including in arrays)
rg "#critical\b"

# Find perf-scoped critical specifically (including in arrays)  
rg "perf:#[^,\s]*critical"

# Find all perf-scoped attributes (including array items)
rg "perf:#[^,\s]*"

# Find issue 123 in any relationship (including arrays)
rg ":#123\b"

# Find alice in any actor relationship (including arrays)
rg ":@alice\b"

# Find specific package in dependencies (including arrays)
rg "depends:#[^,\s]*lodash"     # Unscoped packages
rg "depends:@[^,\s]*company"    # Scoped packages

# Find all items in a specific key (useful for analysis)
rg "affects:#[^,\s]*"        # All affected systems
rg "cc:@[^,\s]*"             # All CC'd people
rg "fixes:#[^,\s]*"          # All fixed issues
```

**Key Patterns**:

- `\b` - Word boundary (prevents partial matches)
- `[^,\s]*` - Match until comma or whitespace (finds array items)
- `[^,\s]*term` - Find array items containing term

### 4.7 Benefits

1. **One consistent pattern** - Colon always separates key from value
2. **Everything stays greppable** - `#123` finds all instances, `:#123` finds relationships
3. **Arrays are searchable** - Individual array items found with specific patterns
4. **No parsing ambiguity** - `affects:#billing,#auth` is clearly two items
5. **Visual consistency** - All relationships follow the same pattern

---

## 5. Reference Tags

**Decision**: Use `key:[#]value` format for external references that don't have waymark prefixes (not `#key:value`).

**Note**: With [Decision 4](#4-universal-colon-pattern-for-keyvalue-pairs), this is now part of the universal pattern. External references simply don't have # or @ prefixes because they're not waymarkable entities.

### 5.1 The Problem

Some values don't fit the waymark reference pattern:

- URLs: `https://example.com`
- File paths: `/docs/auth.md`
- Git branches: `feature/auth-v2`

### 5.2 The Solution

The universal colon pattern handles these naturally - external references have no prefix:

<!-- todo ::: @claude we need to pay close attention to where quotes are needed in this section -->
- `link:https://example.com` (no prefix - it's a URL)
- `docs:/docs/auth.md` (no prefix - it's a file path)
- `branch:feature/auth-v2` (no prefix - it's a branch name)

### 5.3 Examples

```javascript
// External references - no prefix because they're external
// todo ::: implement OAuth docs:/docs/oauth-guide.md link:https://oauth.net/2/ branch:feature/oauth

// Waymarkable entities - keep their prefixes
// notice ::: deployment affects:#api,#billing,#frontend cc:@alice,@bob

// Mixed references
// note ::: see guide docs:README.md link:https://oauth.net affects:#frontend
```

### 5.4 Benefits

1. **Handles special characters** - URLs, paths work naturally
2. **No # confusion** - Clear that these are external
3. **Optional arrays** - Available but discouraged
4. **Clean separation** - Context prefixes vs external references

### 5.5 Implementation

- Remove `#` from reference tags (`#link:` → `link:`)
- Document as "external reference" pattern
- Emphasize individual context prefixes as preferred

---

## 7. Multiline Waymarks

**Decision**: Multiline waymarks are not supported in v1.0 and considered an antipattern.

**Search by**: `#decision-multiline`

### 7.1 The Problem

Examples throughout the spec showed waymarks spanning multiple lines:

```javascript
// todo ::: implement feature
//   #backend #security
//   fixes:#123 blocks:#456
```

This creates parser ambiguity - where does the waymark end?

### 7.2 The Solution

**All waymarks must be on a single line**. The waymark ends at the line break.

### 7.3 Examples

```javascript
// ❌ WRONG - Multiline waymark
// todo ::: implement OAuth
//   docs:/docs/oauth.md
//   link:https://oauth.net

// ✅ CORRECT - Single line
// todo ::: implement OAuth docs:/docs/oauth.md link:https://oauth.net
```

### 7.4 Benefits

1. **Parser simplicity** - Clear boundaries for waymark content
2. **Grep friendly** - Each waymark is a complete line
3. **No ambiguity** - Line break always ends the waymark
4. **Editor friendly** - Easy to select/copy entire waymark

### 7.5 Implementation

- Update all examples to show single-line waymarks
- Document that line breaks terminate waymarks
- Note as antipattern in best practices

---

## 8. Array Syntax Clarification

**Decision**: Arrays are supported with universal colon pattern (not discouraged anymore).

**Search by**: `#decision-arrays`

### 8.1 The Problem

The spec showed comma-separated arrays but also recommended repetition:

- Arrays: `affects:#api,#billing,#frontend`
- Repetition: `affects:#api affects:#billing affects:#frontend`

Which is preferred?

### 8.2 The Solution

- **Parsers support arrays** - Natural with colon pattern
- **Arrays are now acceptable** - The universal colon pattern makes them clear
- **Both patterns are valid** - Choose based on readability
- **Ripgrep still works** - `rg "affects:#[^,\s]*"` will find both patterns

### 8.3 Examples

```javascript
// Arrays are clear with universal colon pattern
// notice ::: deployment affects:#api,#billing,#frontend

// Repetition also valid if preferred
// notice ::: deployment affects:#api affects:#billing affects:#frontend

// Arrays work naturally for all types
// todo ::: notify team cc:@alice,@bob,@charlie
// note ::: requires depends:@lodash,@react,@acme/auth
```

### 8.4 Benefits

1. **Backward compatibility** - Existing waymarks continue to work
2. **Forward guidance** - New code uses cleaner pattern
3. **Parser flexibility** - Tools can support both
4. **Clear preference** - Documentation shows best practice

### 8.5 Implementation

- Keep array support in schema/parser
- Update all examples to use repetition
- Add note: "Arrays supported for compatibility but repetition preferred"

---

## 9. Undefined Tokens Resolution

**Decision**: Remove or clarify undefined tokens from examples.

**Search by**: `#decision-tokens`

### 9.1 The Problem

Examples included undefined tokens:

- `#at:` - Purpose unclear
- `#docs:pkg:@acme/auth` - Confusing nesting
- `#depends:@acme/auth@2.0` - Mixed `#` prefix with standard npm syntax

### 9.2 The Solution

1. **Remove `#at:`** - No clear use case
2. **Change nested references** - Use simpler patterns e.g. `#docs:@acme/auth`
3. **Package versions** - Use standard npm version syntax

### 9.3 Examples

```javascript
// ❌ Remove undefined #at:
// old: at:#payment/stripe-webhook

// ✅ For location references, use:
// note ::: implementation at:#payment/stripe-webhook

// ✅ For package documentation, use:
// todo ::: update docs docs:@acme/auth

// ✅ For package versions, use standard npm syntax:
// todo ::: upgrade auth depends:@acme/auth@2.0.0
// note ::: requires depends:#lodash@^4.17.0,#react@18.2.0
```

### 9.4 Version Syntax

Use standard npm version syntax after package names:

- `#package@version` - Unscoped packages with version
- `@scope/package@version` - Scoped packages with version

Where `@version` follows standard npm patterns like `@2.0`, `@^1.0.0`, `@~1.2.3`, `@latest`, `@next`, etc.

**Important**: Version specifiers follow ecosystem conventions - both `:latest` and `@latest` patterns exist and should be supported.

### 9.5 Implementation

- Remove all `#at:` references
  - Prefer `
- Update nested references to simpler patterns
- Document version syntax for packages

---

## 10. Arrow Notation in HTML Comments

**Decision**: Use `→` for arrow notation in HTML comment waymarks to avoid premature comment closure.

### 10.1 The Problem

HTML comments close when they encounter `-->`, which can break waymarks:

```html
<!-- todo ::: convert to arrow function (x) --> x * 2 -->
                                            ^^^ This closes the comment!
```

### 10.2 The Solution

**Forbid `-->` in HTML comment waymarks** and recommend alternative arrow notations:

- **Highly recommended**: `→` (Unicode arrow)
- **Acceptable**: `=>`, `->`, `»`
- **Never use**: `-->`

### 10.3 Examples

```html
<!-- ❌ WRONG - Breaks HTML comment -->
<!-- note ::: data flow: input --> process --> output -->

<!-- ✅ CORRECT - Using Unicode arrow (recommended) -->
<!-- note ::: data flow: input → process → output -->

<!-- ✅ CORRECT - Using fat arrow -->
<!-- todo ::: convert to arrow function (x) => x * 2 -->

<!-- ✅ CORRECT - Using single arrow -->
<!-- note ::: pipeline: extract -> transform -> load -->

<!-- ✅ CORRECT - Using guillemet -->
<!-- note ::: workflow: design » implement » test -->
```

### 10.4 Why `→` is Recommended

1. **Clear semantics** - Unambiguously means "arrow"
2. **No escaping needed** - Works in all contexts
3. **Grep-friendly** - Easy to search: `rg "→"`
4. **Visual clarity** - Stands out in comments
5. **No conflicts** - Can't be confused with operators

### 10.5 Search Patterns

```bash
# Find all arrow flows
rg "→"

# Find specific patterns
rg "input\s*→\s*process"
rg "flow:.*→"
```

### 10.6 Implementation

- Update all examples using `-->` in HTML comments
- Add note to best practices about HTML comment limitations
- Suggest using regular comments for complex arrow notation if needed

---

## 11. Semver Patterns with @ Symbol

**Decision**: Support `@version` patterns for packages while maintaining actor detection accuracy.

### 11.1 The Problem

Package dependencies often include version specifications:

- `depends:#lodash@4.17.21`
- `depends:@acme/auth@2.0.0`

This could create false positives when searching for actors (which also use `@`).

### 11.2 The Solution

1. **Allow `@version` patterns** after package names
2. **Update actor search patterns** to exclude semver
3. **Document the distinction** clearly

### 11.3 Version Syntax Rules

Valid version patterns after `@`:

- `@1.2.3` - Exact version
- `@^1.0.0` - Compatible version (npm style)
- `@~1.0.0` - Patch version (npm style)
- `@2.0` - Short version
- `@latest`, `@next`, `@beta` - Named versions

Edge cases:

- `@50cent` - Valid actor (not a version)
- `@1` - Could be actor (like user "1")

### 11.4 Examples

```javascript
// Package versions in dependencies
// todo ::: upgrade auth depends:@acme/auth@2.0.0
// note ::: requires depends:#lodash@^4.17.0,#react@18.2.0

// Actors remain unchanged
// todo ::: @alice review the PR from @50cent

// Mixed usage is clear
// todo ::: @bob upgrade depends:@acme/auth@2.0 to depends:@acme/auth@3.0
```

### 11.5 Search Patterns

```bash
# Find actors (exclude likely versions)
rg "@[a-zA-Z][a-zA-Z0-9_-]*(?![@\.])\b"   # Actors not followed by @ or .
rg "@[a-zA-Z0-9_-]+(?![0-9]\.[0-9])"       # Exclude x.y patterns

# Find package versions
rg "@[0-9]+\.[0-9]+(\.[0-9]+)?"            # Semver patterns
rg "@\^[0-9]"                               # Compatible versions
rg "@~[0-9]"                                # Patch versions

# Find all @ references and distinguish
rg "@\w+" | grep -v "@[0-9]+\.[0-9]"       # Likely actors
rg "@\w+" | grep "@[0-9]+\.[0-9]"          # Likely versions
```

### 11.6 Implementation

- Update documentation to clarify @ is used for both actors and versions
- Provide clear search patterns for distinguishing them
- Note that context usually makes intent clear

---

## 12. Grep Tool Requirements

**Decision**: Document assumes PCRE-compatible grep with specific features. Provide alternatives for basic grep.

### 12.1 The Problem

Many search patterns in the spec use ripgrep-specific or PCRE regex features that may not work with basic grep.

### 12.2 The Solution

1. **Primary recommendation**: Use `ripgrep` (rg) for all searches
2. **Fallback options**: Provide simpler patterns for basic grep when possible
3. **Required features**: Document which regex features are assumed

### 12.3 Required Regex Features

The search patterns assume these capabilities:

- **Optional groups**: `(pattern)?`
- **Character classes**: `[a-zA-Z]`, `\w`, `\d`
- **Negated classes**: `[^:]`
- **Quantifiers**: `+`, `*`, `?`
- **Word boundaries**: `\b`
- **Line anchors**: `$`

### 12.4 Tool Compatibility

| Pattern | ripgrep | GNU grep -E | Basic grep | Alternative |
|---------|---------|-------------|------------|-------------|
| `(perf:#|#)hotpath` | ✓ | ✓ | ✗ | Use two searches |
| `[^:]+` | ✓ | ✓ | ✗ | Use `[^:][^:]*` |
| `\w+` | ✓ | ✓ | ✗ | Use `[a-zA-Z0-9_]+` |
| `#\d+` | ✓ | ✓ | ✗ | Use `#[0-9]+` |

### 12.5 Examples with Alternatives

```bash
# ripgrep (recommended)
rg "(perf:#|#)hotpath"

# GNU grep with extended regex
grep -E "(perf:#|#)hotpath"

# Basic grep (two searches)
grep "#hotpath" files... | grep "perf:#hotpath" files...

# Find all typed anchors
rg "##\w+:"                    # ripgrep
grep -E "##[a-zA-Z0-9_]+:"    # GNU grep -E
```

### 12.6 Implementation

- Add tool requirements section to documentation
- Recommend ripgrep as the primary search tool
- Provide basic grep alternatives where feasible
- Note that complex analysis requires PCRE support

---

## 12. Ecosystem Convention Conformance

**Decision**: Waymarks adapt to existing ecosystem conventions, not the other way around.

### 12.1 The Principle

When there's a conflict between waymark syntax convenience and established ecosystem conventions, **the ecosystem wins**. Waymarks should be a good citizen that works with existing tools and conventions.

### 12.2 Examples

**Package versions** (this decision):

- ✅ `depends:#lodash:latest` - Follows existing `:latest` convention
- ❌ `depends:#lodash@latest` - Forces npm syntax to avoid waymark parsing issues

**Git branches**:

- ✅ `branch:feature/auth-v2` - Standard git branch naming
- ❌ `branch:feature-auth-v2` - Modified to avoid parsing complexity

**URLs and paths**:

- ✅ `link:https://example.com/path?param=value` - Standard URL format
- ❌ `link:https→example.com/path→param=value` - Modified to avoid special chars

### 12.3 Implementation Guidelines

1. **Research first** - Understand existing conventions before designing syntax
2. **Adapt parsing** - Make waymark parsers handle standard formats, not the reverse
3. **Document edge cases** - When conventions create parsing challenges, document solutions
4. **Prefer complexity in tools** - Better to have complex parsing than force users to modify standard conventions

### 12.4 Benefits

1. **Lower adoption barrier** - Developers can use familiar syntax
2. **Tool compatibility** - Works with existing ecosystem tools
3. **Future-proof** - Adapts to new conventions as they emerge
4. **Respect** - Shows respect for established community standards

### 12.5 Quoting for Complex Values

When external references contain spaces, special characters, or parsing ambiguity, use quotes following ecosystem conventions:

```javascript
// URLs (quotes recommended for complex URLs)
// todo ::: implement OAuth link:"https://oauth.net/2/guide?response_type=code&state=xyz"

// File paths (quotes required for spaces)
// note ::: see guide docs:"/docs/advanced setup/oauth.md"

// Git branches (quotes for complex cases)
// todo ::: merge branch:feature/auth-v2           // Simple - no quotes needed  
// todo ::: merge branch:"feature/auth-v2.0-final" // Complex - quotes recommended

// Arrays with complex values
// notice ::: breaking change affects:#api,#billing docs:"/migration/v2.md","/guides/upgrade.md"
```

**Guidelines**:

- **URLs with parameters**: Use quotes
- **Paths with spaces**: Use quotes (required for greppability)
- **Simple git branches**: No quotes needed (`branch:feature/auth`)
- **Complex branches**: Use quotes (`branch:"feature/auth-v2.0-final"`)

### 12.6 Impact on Colon Parsing

This decision means we should allow `:latest`, `:stable`, etc. for version references, and improve our parsing to handle these cases rather than forcing `@latest` syntax.

```javascript
// ✅ CORRECT - Follows ecosystem conventions
// todo ::: upgrade auth depends:#lodash:latest,@acme/auth:next

// ❌ WRONG - Forces waymark syntax on ecosystem conventions  
// todo ::: upgrade auth depends:#lodash@latest,@acme/auth@next
```

---

## Future Decisions

Additional decisions to be documented as they are made during the v1.0 finalization process.

---

## Implementation Tracking for Grammar Document

This section tracks the implementation of these decisions in the `waymark-streamlined-grammar-complete.md` document. It is NOT a decision itself, but a guide for updating that specific document.

### Search Tags for Grammar Updates

When updating waymarks in the grammar document to reflect these decisions, use the following tags to make changes discoverable:

- `#decision-attributes` - For attribute tag format updates
- `#decision-priority` - For priority system changes
- `#decision-packages` - For package reference updates
- `#decision-multiline` - For multiline waymark examples
- `#decision-arrays` - For array syntax examples
- `#decision-tokens` - For undefined token resolution
- `#decision-arrows` - For arrow notation in HTML comments
- `#decision-relational` - For additional relational tags (at:, see:, etc.)
- `#decision-semver` - For @version pattern handling

### Example Updates

When updating the grammar document, transform waymarks like this:

```javascript
// OLD: Using old relational tag format
// !!todo ::: implement feature #fixes:#123 #blocks:#456

// NEW: Using universal colon pattern 
// !!todo ::: implement feature fixes:#123 blocks:#456

// For simple issue references, just use the issue number
// !!todo ::: resolve critical bug #123
```

This makes it easy to find all updates related to a specific decision:

```bash
# Find all attribute-related updates
rg "#decision-attributes" waymark-streamlined-grammar-complete.md

# Find all references to issue 123
rg "#123" waymark-streamlined-grammar-complete.md

# Find all fix relationships
rg "fixes:#" waymark-streamlined-grammar-complete.md
```

### Note on Custom Array/Object Patterns

The grammar document shows various array and object patterns in the extensions section:

- Object-like: `#env:{prod:true, debug:false}`
- Arrays with brackets: `#deps:[lodash react typescript]`
- Arrays with parentheses: `#cases:(happy-path, edge-case)`
- Quoted values: `#tasks:"Bug fixes, Performance improvements"`
- Pipelines: `#workflow:[build -> test -> production]`

These are **not part of the core spec** but are documented as examples of custom patterns teams might adopt. They demonstrate the flexibility of the waymark system while keeping the core syntax simple.

### Documentation File References

Issue #52 flagged potentially non-existent documentation file references. Verification shows all referenced files exist:

- `./jsdoc-integration.md` → Exists at `project/proposals/jsdoc-integration.md`
- `waymark-1.0-simplification.md` → Exists at `project/proposals/waymark-1.0-simplification.md`
- `../docs/usage/patterns/custom-tags.md` → Exists (from project root)
- `../docs/usage/search/` → Directory exists with multiple search guides

**Action**: Remove the waymarks about non-existent files - they are incorrect.