<!-- :A: tldr comprehensive implementation plan for grepa syntax updates and specification refinements -->
# Grepa Syntax Updates - Implementation Plan

> **Architecture Document**: This is a forward-looking architectural specification that extends beyond the "simple pattern" approach described in the root README.md. It outlines comprehensive syntax enhancements and advanced features for future implementation.

<!-- :A: meta comprehensive architectural design document for syntax updates -->
This document outlines the complete implementation plan for updating grepa's syntax specification, core patterns, and tooling integration based on architectural analysis and syntax refinement discussions.

## Key Decisions

**Core syntax decisions:**
- `:A:` anchor replaces `:ga:` for speed and clarity
- Eliminate dot notation except for literals (versions, file paths, URLs, decimals)
- Colon (`:`) for classifications, parentheses `()` for value attachment
- @mentions work as implicit assignment (`@alice` = `assign:@alice`)
- Bracket arrays for multiple values: `blocked:[4,7]`, optional for single values

**Marker organization:**
- 6 marker groups: `todo`, `info`, `notice`, `trigger`, `domain`, `status`
- ~40 specific markers organized by semantic purpose
- Group-level searching: `rg ":A:.*notice"` finds all warnings

**Parameter system:**
- 6 parameter groups: `mention`, `relation`, `workflow`, `priority`, `lifecycle`, `scope`
- Universal parameters work across all marker types
- Context-aware interpretation (teams configure issue formats)

**Scope limitations:**
- No JSON or YAML syntax within anchors
- No regex/pattern matching as core feature
- Magic anchor syntax must be expressive enough on its own
- Focus on LLM context and navigation, not full task management

## The `:A:` Anchor

After extensive experimentation with earlier prefixes we discovered an even simpler, faster-to-type form: **`:A:`**.

> **Style Rule** – `:A:` **must** be followed by exactly one ASCII space before the first marker (`:A: todo`). This guarantees uniform readability and keeps regexes trivial. Linters should flag any zero-space or multi-space variants as errors.

### Why `:A:` Works Better

- **Lightning-fast typing** – the author already holds <kbd>Shift</kbd> for the leading colon, so keeping it down while hitting the capital "A" means the whole prefix is entered in a single fluid chord (`:` → `A` → `:`).
- **Visual clarity** – three glyphs instead of four; the capital letter pops inside monospaced text and even resembles a miniature anchor.
- **Ultra-low collision risk** – quick scans of large open-source repos show virtually zero incidental occurrences of `:A:`.
- **Regex friendliness** – trivially matched with `':A:'`; no special escaping or look-arounds required.
- **LLM tokenization** – emitted as two tokens (`:A`, `:`)
- **Symmetry with `<a>`** – similar to HTML's `<a>` anchor tag

### Evolution of the Anchor

1. **Concept: "grep anchor"** – the original phrase that inspired a recognizable comment sigil.
2. **Prototype shorthand (`ga`)** – the initials collapsed into a compact prefix that served well in early prototypes.
3. **Current refinement (`A`)** – optimization for speed and aesthetics: `:A:` retains the anchor mnemonic while shaving a character and improving ergonomics.

### Anchor Migration

- From this version forward **`:A:` is the canonical anchor prefix**.
- No migration concerns exist—the project is still in its early stages and all content is maintained by a single author.
- Custom anchor sigils were considered, but a *single canonical prefix* keeps tooling simple, avoids edge-case parsing, and mirrors the way "TODO" became a universal convention for work-in-progress notes.

### Magic Anchors vs Grepa Tooling

With the `:A:` sigil in place we can make a clear terminology split:

- **Magic Anchors (notation)** – the comment-level grammar that begins with `:A:` and encodes markers, parameters, and prose.  Magic Anchors are *just text* and can be searched or parsed by any standard tool (ripgrep, awk, IDE search, etc.).
- **Grepa (tooling)** – the reference CLI / library / editor plug-ins that *understand* Magic Anchors and offer value-adds: rich queries, linting, navigation maps, index daemons, etc.

This separation keeps the notation vendor-neutral and future-proof:

1. **Portability** – teams can adopt Magic Anchors today and still rely on plain `rg` if they don't want extra tooling.
2. **Pluggability** – other ecosystems (Bazel rules, language servers, CI pipelines) can add Magic-Anchor awareness without pulling in the full Grepa stack.
3. **Innovation surface** – Grepa can evolve aggressively (indexes, LSP, dashboards) while the core notation remains stable.

#### Magic Anchor Grammar Snapshot

```
<comment leader> :A: <space> <marker-list> <optional prose>

marker-list   ::= marker ("," marker)*
marker        ::= key [ delimiter value ]
delimiter     ::= ":" | "(" | "["             # colon / paren / array start
```

- The single space after `:A:` is **mandatory**.
- The entire anchor content – markers plus optional prose – must fit on one line **or** follow the multi-line rules (see "Multi-line Anchor Syntax" below).

> Draft tagline for the README: **`grep:A:` — Magic Anchors for Codebases**.

<!-- :A: status completed implementation plan with comprehensive specifications -->
## Implementation Status

All major architectural decisions have been finalized. This document serves as the authoritative implementation plan for syntax updates across the entire grepa project.

<!-- :A: ctx this plan implements decisions from extensive syntax analysis and architectural discussions -->
## Implementation Overview

### Core Architectural Principles

<!-- :A: principle fundamental design constraint for grammar consistency -->
1. **Single Token Preference**: When introducing markers, prefer markers that LLMs tokenize **as** single tokens.
2. **Logical Unit Coherence**: Each grep-anchor represents one complete logical unit of information.
3. **Comma-Only Separation**: Multiple markers within anchors use comma separation exclusively.
4. **Quote Protection**: Prose containing commas must be wrapped in quotes.
5. **Space Boundary Rule**: The first space following the last structured marker delimits the prose boundary.

<!-- :A: arch delimiter semantic distinction for parser consistency -->
## Delimiter Semantics Framework

**Colon (:) Usage - Scope and Classification:**

- **Purpose**: Express type:value relationships, classifications, states
- **Examples**: `priority:critical`, `status:blocked`, `env:production`
- **Grammar**: `marker:value` where value classifies or categorizes the marker

**Parentheses Usage - Parameters and Arguments:**

- **Purpose**: Associate structured parameters with markers
- **Examples**: `blocked(by:issue:4)` (inner colons are literal), `config(timeout:30)`
- **Grammar**: `marker(param:value,param2:value2)`

**Dot Notation - Hierarchical Organization:**

- **Purpose**: Express genuine parent.child relationships
- **Examples**: `api.v2.users`, `module.auth.login`
- **Grammar**: `parent.child.grandchild`

<!-- :A: decision critical architectural choice affecting all syntax patterns -->
**Decision Framework Application:**

- Use dots (`.`) for genuine hierarchies: object structures, code organization
- Use colons (`:`) for type:value relationships: classifications, states, categories  
- Use parentheses `()` for parameters: structured data associated with markers
- Mixed patterns allowed: `api.v2:deprecated` (v2 of api *is* deprecated)

<!-- :A: todo update all documentation to reflect colon delimiter usage for priority -->
**Required Documentation Updates:**

- Change all `priority.high` examples to `priority:high` throughout documentation
- Update pattern examples in conventions documentation
- Revise search pattern examples in guides

## Priority Scheme Configuration System

<!-- :A: config flexible team configuration for priority notation preferences -->
### Configurable Priority Schemes

Teams can configure their preferred priority notation system in `grepaconfig.yaml` to standardize team-wide conventions.

**Numeric Scheme Configuration:**

```yaml
priorities:
# Primary notation uses p0/p1/p2
  scheme: "numeric"
  numeric:
    p0: "critical"     # :A: p0 → :A: priority:critical
    p1: "high"         # :A: p1 → :A: priority:high  
    p2: "medium"       # :A: p2 → :A: priority:medium
    p3: "low"          # :A: p3 → :A: priority:low
    p4: "trivial"      # :A: p4 → :A: priority:trivial
```

**Named Scheme Configuration:**

```yaml
priorities:
# Primary notation uses critical/high/medium
  scheme: named
  named:
    critical: "p0"     # :A: critical → :A: priority:critical
    high: "p1"         # :A: high → :A: priority:high
    medium: "p2"       # :A: medium → :A: priority:medium
    low: "p3"          # :A: low → :A: priority:low
    trivial: "p4"      # :A: trivial → :A: priority:trivial
```

**Custom Aliases:**

```yaml
priorities:
  aliases:
    "urgent": "critical"      # :A: urgent → :A: priority:critical
    "blocker": "critical"     # :A: blocker → :A: priority:critical
    "nice-to-have": "trivial" # :A: nice-to-have → :A: priority:trivial
```

<!-- :A: benefit tool integration advantages for team consistency -->
**Benefits:**

- **Team Consistency**: Everyone uses same notation style
- **Tool Integration**: IDEs can show dropdowns with team's preferred scheme
- **Search Normalization**: All priority searches work regardless of input format
- **Migration Support**: Teams can gradually shift between schemes

## Version Notation System

<!-- :A: spec multi-ecosystem version support with configurable patterns -->
### Multi-Ecosystem Version Support

Support for diverse version notation styles across different technology ecosystems:

**Semver Patterns:**

```javascript
// :A: since:^1.2.0        // Compatible versions from 1.2.0
// :A: until:~1.2.0        // Patch-level changes only
// :A: compat:>=1.2.0      // Minimum version requirement
// :A: range:>=1.2.0,<2.0.0 // Version range specification
```

**Python Version Patterns:**

```python
# :A: since:==1.2.0       # Exact version match
# :A: compat:~=1.2.0      # Compatible release operator
# :A: requires:>=1.2.0,<2.0.0 # Range with comma separator
```

**Maven Version Patterns:**

```java
// :A: since:[1.2.0]       // Exact version specification
// :A: range:[1.2.0,2.0.0) // Range with exclusive upper bound
// :A: minimum:[1.2.0,)    // Minimum with open upper bound
```

**Ruby Version Patterns:**

```ruby
# :A: compat:~> 1.2.0     # Pessimistic version constraint
# :A: range:>= 1.2.0, < 2.0 # Range with Ruby syntax
```

**Configuration Support:**

```yaml
versioning:
  style: "semver"  # or "python", "ruby", "maven", "go"
  
  semver:
    exact: "=1.2.0"
    compatible: "^1.2.0" 
    patch-level: "~1.2.0"
    minimum: ">=1.2.0"
    range: ">=1.2.0 <2.0.0"
```

## Multi-line Anchor Syntax

<!-- :A: syntax advanced multi-line support for complex anchor patterns -->
### Enhanced Readability for Complex Anchors

Multi-line anchor syntax for comment formats that support it, while preserving the "single anchor == one complete thought" principle.

**Supported Comment Formats:**

- HTML: `<!-- :A: ... -->`
- CSS/JS/C++: `/* :A: ... */`
- Python docstrings: `""" :A: ... """`

**Syntax Rules:**

1. **Opening Pattern**: Comment start + `:A:` on first line
2. **Marker Lines**: Indented markers, one per line or comma-separated
3. **Prose Constraint**: Optional prose must be on same line as final marker
4. **Closing Pattern**: Comment end maintains marker boundary

**Examples:**

```html
<!-- :A:
    todo,
    priority:critical,
    blocked(by:issue:4),
    owner@alice fix authentication bug
-->
```

```javascript
/* :A:
    config:env[
        prod(api-prod.company.com),
        staging(api-staging.company.com),
        dev(localhost:3000)
    ]
    endpoint configuration for environments
*/
```

```python
""" :A:
    api,
    module:auth,
    since:v2.0 main authentication module
"""
```

<!-- :A: warning ripgrep search implications for multi-line patterns -->
**Search Pattern Implications:**

Single-line patterns won't find multi-line anchors:

```bash
# This WON'T find multi-line anchors
rg ":A: todo"                    # Misses multi-line variants
```

Multi-line search patterns required:

```bash
# Find opening patterns (good starting point)  
rg "<!-- :A:|/\* :A:|\"\"\" :A:"

# Multi-line search with context
rg -U ":A:.*todo.*-->" --type html    # Multi-line mode
rg -A 10 "<!-- :A:" | rg "todo"      # Find opens, then search content
```

<!-- :A: decision backwards compatibility with single-line preference -->
**Implementation Decision:**

- All existing single-line anchors continue to work unchanged
- Multi-line is opt-in syntax for complex cases only
- Simple markers should remain single-line: `<!-- :A: todo fix this -->`
- Complex parameter lists and conditional configurations can use multi-line

## Escape and Quoting Mechanisms

<!-- :A: spec comprehensive character handling for special cases -->
### Robust Special Character Handling

**Quoting Rules Framework:**

1. **Single Quotes for Literal Strings:**

   ```javascript
   // :A: regex('user-\d+')              // literal regex pattern
   // :A: path('/path/with spaces')      // path with spaces
   // :A: message('Error: invalid ()')   // message with special chars
   ```

2. **Double Quotes for Interpolated Strings:**

   ```javascript
   // :A: template("User: $name ($id)")  // template with variables
   // :A: query("SELECT * FROM users")   // SQL with interpolation potential
   ```

3. **No Quotes When Unambiguous:**

   ```javascript
   // :A: user(alice)                    // simple identifier
   // :A: priority:high                  // simple type:value
   // :A: version(2.0.1)                 // version number
   ```

**Escape Sequences:**

```javascript
// :A: message('Can\'t connect')      // escaped single quote
// :A: path("C:\\Program Files")      // escaped backslash
// :A: regex("user\.\d+")             // escaped dots in regex
// :A: json('{"key": "value"}')       // JSON in single quotes
```

**Complex Use Cases:**

**Regex Patterns:**

```javascript
// Simple patterns (no quotes needed)
// :A: match(user-123)                // literal match
// :A: pattern(\d+)                   // simple regex

// Complex patterns (quoted)
// :A: regex('^\\w+@[\\w.-]+\\.\\w{2,}$') // email regex
// :A: match('user-\\d+-(test|prod)')  // complex pattern
```

**File Paths:**

```javascript
// Simple paths (no quotes)
// :A: file(src/auth.js)              // standard path
// :A: path(/usr/local/bin)           // Unix path

// Paths with special chars (quoted)
// :A: file('src/user service.js')    // spaces
// :A: path('C:\Program Files\App')   // Windows path
```

**Arrays with Special Characters:**

```javascript
// Simple arrays (no quotes)
// :A: tags[auth,api,v2]              // simple identifiers

// Complex arrays (quoted elements)
// :A: patterns['user-\\d+','admin-.*'] // regex patterns
// :A: files['src/auth.js','lib/util.js'] // file paths
```

<!-- :A: guideline parsing strategy for robust character handling -->
**Parsing Strategy:**

1. **Unquoted**: Parse until `,`, `)`, `]`, `}`, or whitespace
2. **Single-quoted**: Parse until unescaped `'`, handle `\'` escapes
3. **Double-quoted**: Parse until unescaped `"`, handle `\"` escapes and `$var` substitution
4. **Validation**: Ensure balanced parens/brackets/braces
5. **Error Handling**: Clear messages for malformed syntax

## Universal Relational Marker System

<!-- :A: arch unified relationship expression pattern for consistency -->
### Canonized Relational Patterns

Universal relational markers using consistent `marker(relation-type:target-identifier)` pattern for expressing all types of relationships.

**Dependency Relations:**

```javascript
// :A: depends(on:auth-service)        // requires auth service to function
// :A: requires(api:user.login)        // needs specific API endpoint
// :A: needs(config:redis.connection)  // requires configuration
```

**Blocking/Flow Relations:**

```javascript
// :A: blocked(by:issue:4)             // blocked by specific issue
// :A: blocking(issue:[7,10])          // blocks other issues
// :A: awaits(approval:@security-team) // waiting for approval
// :A: prevents(deployment:prod)       // prevents action
```

**Event/Message Relations:**

```javascript
// :A: emits(event:user.created)       // publishes this event
// :A: listens(to:payment.completed)   // subscribes to events
// :A: triggers(workflow:deploy.prod)  // initiates process
// :A: responds(to:webhook.stripe)     // handles incoming event
```

**API Contract Relations:**

```javascript
// :A: consumes(api:v2/users)          // calls this API endpoint
// :A: provides(api:auth/login)        // implements this endpoint
// :A: exposes(endpoint:/health)       // makes endpoint available
// :A: calls(service:payment.charge)   // invokes external service
```

**Data Flow Relations:**

```javascript
// :A: reads(from:user-db)             // reads from data source
// :A: writes(to:analytics-queue)      // sends data to destination
// :A: caches(in:redis.sessions)       // uses cache layer
// :A: stores(data:user.preferences)   // persists data
```

**Infrastructure Relations:**

```javascript
// :A: deploys(with:payment-service)   // same deployment boundary
// :A: scales(based-on:api-traffic)    // scaling relationship
// :A: monitors(via:prometheus.alerts) // observability relationship
// :A: routes(through:api-gateway)     // network routing
```

**Array Targets for Multiple Relationships:**

```javascript
// :A: depends(on:[auth-service,user-db,redis])
// :A: triggers(workflow:[deploy.staging,run.tests])
// :A: blocked(by:[issue:4,approval:@alice])
// :A: consumes(api:[v2/users,v2/auth,v1/billing])
```

<!-- :A: benefit automation and tooling integration advantages -->
**Automation Benefits:**

- **Service Discovery**: Auto-generate service topology maps
- **Impact Analysis**: Understand blast radius of changes  
- **Event Tracing**: Follow data flows across distributed systems
- **Deployment Planning**: Understand service deployment dependencies

## Enhanced Core Marker Set

<!-- :A: core expanded standard marker definitions for agent efficiency -->
### Agent-Optimized Core Markers

**Navigation Markers for AI Efficiency:**

```javascript
// :A: entry                           // Entry points for understanding code flow
// :A: entry(api)                      // API entry point
// :A: entry(auth)                     // Authentication entry point
// :A: explains(auth-flow)             // Documentation content
// :A: explains(business-logic)        // Business rule explanations
```

**Code Quality Assessment:**

```javascript
// :A: impact:high                     // Change impact assessment
// :A: impact([perf:high,api:low])     // Multi-dimensional impact
// :A: pattern(singleton)              // Design pattern documentation
// :A: state:global                    // State management markers
// :A: state:immutable                 // Immutability constraints
```

**Enhanced Reference System:**

```javascript
// :A: rel(implements:auth-redesign)   // Universal relationship marker
// :A: rel(depends:auth-service)       // Dependency relationship
// :A: rel(blocks:issue:4)             // Blocking relationship
```

**Field Markers with Rich Semantics:**

```javascript
// :A: due(2024-03-15)                 // Due date field
// :A: since:^1.2.0                    // Version introduced
// :A: until:[3.0.0,)                  // Version for removal
// :A: type(migration)                 // Type classification
```

**Mention-Required Markers:**

```javascript
// :A: owner@alice                     // Responsibility assignment
// :A: assignee[@alice,@bob]           // Multi-person assignment
```

<!-- :A: synonym marker aliasing system for consistency -->
**Synonym System:**

- `ctx` ↔ `context` (1:1 substitution)
- `sec` ↔ `security` (1:1 substitution)
- `perf` ↔ `performance` (1:1 substitution)
- `tmp` ↔ `temp` ↔ `placeholder` (multiple synonyms)

## Future Feature References

The following advanced features have been moved to separate design documents for future consideration:

- **[Plugin Architecture](../future/plugin-architecture.md)** - Configuration bundles for workflow standardization
- **[Conditional Scopes](../future/conditional-scopes.md)** - Environment and platform-aware marker values  
- **[Template Engine](../future/template-engine.md)** - Advanced placeholder syntax with parameter interpolation
- **[UUID ID System](../future/uuid-ids.md)** - Automatic UUID strategies and cross-reference mechanics
- **[AI Agent Triggers](../future/agent-triggers.md)** - Integration patterns for Claude, Cursor, and other AI assistants

## Breadcrumb Protocol Framework

<!-- :A: concept grep-anchor as standardized navigation protocol -->
### Grepa as Universal Navigation Protocol

**Core Metaphor**: Grepa as a "breadcrumb protocol" - a standardized way to leave navigational markers throughout codebases that both humans and AI agents can follow.

**Traditional Breadcrumbs**: Leave a trail to find your way back  
**Web Breadcrumbs**: Show navigation path (Home > Products > Laptops > Dell)  
**Grep-Anchor Breadcrumbs**: Mark important locations for future discovery and navigation

**Protocol Components:**

1. **Trail Markers** - Standardized markers for important code locations
   - `:A: todo` - "work needed here"
   - `:A: sec` - "security-sensitive location"
   - `:A: ctx` - "important context to understand"
   - `:A: entry` - "start here for understanding"

2. **Navigation Paths** - Relationships between marked locations
   - `:A: rel(depends:auth-service)` - "this connects to auth"
   - `:A: rel(blocks:feature-x)` - "this prevents that"
   - `:A: see(auth.js:42)` - "related code over there"

3. **Context Clues** - Human-readable explanations
   - Prose after markers explains WHY this location matters
   - `:A: todo,priority:high implement rate limiting before launch`

4. **Discovery Mechanism** - Tools to follow the trail
   - `rg ":A: todo"` - find all work locations
   - `grepa trace --from auth --to payment` - follow dependency trail
   - `grepa map --service auth` - see all auth-related breadcrumbs

**Protocol Benefits:**

- **Leaves a trail** for future developers (including your future self)
- **AI-navigable** - agents can follow breadcrumbs to understand code structure
- **Cross-project consistency** - same breadcrumb format across all codebases
- **Searchable and parsable** - tools can build navigation maps
- **Human-friendly** - readable prose alongside structured markers
- **Relationship-aware** - breadcrumbs can point to other breadcrumbs

## Implementation Roadmap

<!-- :A: roadmap systematic implementation approach across project -->
### Phase 1: Core Specification Updates

**Documentation Updates Required:**

1. **docs/notation/SPEC.md** ✅ COMPLETED
   - Implement delimiter semantics framework
   - Add relational marker specifications
   - Include multi-line syntax rules
   - Define escape and quoting mechanisms

2. **docs/notation/LANGUAGE.md** ✅ COMPLETED
   - Language guidelines for notation flexibility
   - "Accommodates", "recommends", "enables" terminology

3. **docs/toolset/LANGUAGE.md** ✅ COMPLETED
   - Language guidelines for tool requirements
   - "Requires", "enforces", "validates" terminology

4. **Update Convention Documentation**
   - Revise docs/conventions/*.md with new priority syntax
   - Update all `priority.high` to `priority:high`
   - Add relational marker examples
   - Include multi-line syntax examples

5. **Update Guide Documentation**
   - Revise docs/guides/*.md with current syntax
   - Add escape mechanism examples
   - Include plugin configuration examples
   - Update search pattern documentation

### Phase 2: Configuration System Implementation

**grepaconfig.yaml Enhancements:**

1. **Priority Scheme Configuration**
   - Implement numeric vs named scheme selection
   - Add custom alias definitions
   - Support scheme migration tooling

2. **Version Notation Support**
   - Multi-ecosystem version pattern support
   - Configurable version style preferences
   - Validation for version constraint syntax

### Phase 3: Core Feature Implementation

**Multi-line Anchor Support:**

- Parser updates for multi-line comment detection
- Search pattern adaptation for multi-line anchors
- Tool integration for complex anchor structures

**Relational System:**

- Universal `rel()` marker implementation
- Relationship mapping and visualization
- Dependency chain analysis
- Cross-reference validation

### Phase 4: Tool Integration and Validation

**Search and Discovery:**

- Enhanced ripgrep pattern generation
- Multi-line anchor search support
- Relational marker search patterns

**Validation and Linting:**

- Syntax validation for complex patterns
- Relationship consistency checking
- Multi-line syntax validation

**Documentation Generation:**

- Auto-generated pattern documentation
- Configuration reference generation
- Migration guide creation

## Migration Strategy

<!-- :A: migration systematic approach for adopting new syntax patterns -->
### Backward Compatibility Approach

**Phase 1: Additive Changes Only**

- All existing single-line anchors continue to work unchanged
- New syntax features are opt-in extensions
- No breaking changes to existing patterns

**Phase 2: Enhanced Tooling**

- Tools support both old and new syntax simultaneously
- Migration utilities for syntax updates
- Validation warnings for deprecated patterns

**Phase 3: Gradual Migration**

- Team-by-team adoption of enhanced features
- Configuration-driven syntax preferences
- Feature-by-feature rollout

**Phase 4: Full Feature Utilization**

- Advanced relational mapping
- Comprehensive search and discovery tools
- Robust validation and linting systems

<!-- :A: validation implementation verification checkpoints -->
## Validation Checkpoints

### Syntax Consistency Validation

- All delimiter usage follows semantic framework
- Priority notation uses colon syntax throughout
- Relational markers use consistent parameter patterns
- Escape mechanisms handle all edge cases

### Documentation Coherence Validation  

- All examples use current syntax patterns
- Search patterns work with documented syntax
- Future feature references are clear and accessible
- Migration guides are accurate and complete

### Tool Integration Validation

- ripgrep patterns find intended anchors
- Multi-line search patterns work correctly
- Relational marker resolution functions properly
- Configuration systems validate correctly

### User Experience Validation

- Syntax is learnable and memorable
- Error messages are clear and actionable
- Documentation flow supports progressive learning
- Migration path is well-defined and tested

<!-- :A: completion comprehensive implementation plan finalized -->
## Conclusion

This implementation plan provides a comprehensive framework for updating grepa's syntax specification with enhanced readability, powerful relational capabilities, flexible configuration systems, and robust plugin architecture. The systematic approach ensures backward compatibility while enabling advanced features that support both human understanding and AI agent efficiency.

All architectural decisions have been finalized and documented. Implementation can proceed with confidence in the design's coherence and extensibility.

---



## Doc Updates

### Eliminate Dot Notation (Except Literals)

**Decision**: Remove dot notation from structural/hierarchical markers, keeping dots only for literal values where they have established meaning.

**Keep dots for literals:**

- Version numbers: `since:1.2.0`, `until:v2.3.1`
- File paths: `file:src/auth.js`, `path:/usr/local/bin`
- URLs/domains: `endpoint:api.company.com`
- Decimal numbers: `timeout:3.5`, `rate:0.25`

**Replace hierarchical dots with simplified delimiter rules:**

```javascript
// Old: api.v2.users → New: api:v2-users or api(v2-users)
// Old: module.auth.login → New: auth:login-module or auth(login-module)
// Old: service.payment.stripe → New: payment(stripe-service)
```

**Apply simplified delimiter rules:**

- `:` for classifications: `priority:high`, `env:production`
- `()` for attaching values: `blocked(issue:4)`, `depends(auth-service,user-db)`
- Remove redundant prepositions: `blocked(by:issue:4)` → `blocked(issue:4)`

**Change notes:**

- Update all `priority.high` → `priority:high` patterns
- File path dots remain literal: `config.yaml`, `auth.service.ts`

**Benefits:**

- Familiar function-call syntax for developers
- Eliminates parser ambiguity between structural vs literal dots
- Clear semantic distinction: colon for classification, parentheses for attachment
- Consistent search patterns: `rg ":A:.*auth"` works reliably

### Require Colon Delimiter for All Markers

**Decision**: All markers with values must use colon delimiter syntax, including mentions.

**Change notes:**

- `owner@alice` → `owner:@alice`
- `assignee@bob` → `assignee:@bob`
- All markers follow consistent `marker:value` pattern

### Simplified Delimiter Rules

**Decision**: Use clear, consistent delimiter rules based on function-call familiarity.

**Rules:**

- `:` for classifications: `priority:high`, `status:blocked`
- `()` for attaching values to markers: `blocked(issue:4)`, `owner(@alice,@bob)`
- Remove redundant prepositions: `blocked(by:issue:4)` → `blocked(issue:4)`

**Patterns:**
```javascript
// Simple classifications
// :A: priority:high, status:blocked

// Single parameter attachment  
// :A: blocked(issue:4), owner(@alice), due(2024-03-15)

// Multiple parameter attachment
// :A: depends(auth-service,user-db,redis)
// :A: tags(security,auth,api)
// :A: owner(@alice,@bob)
```

**Change notes:**

- Remove preposition words inside parentheses where context is clear
- Parentheses can contain single or multiple values
- Structured data inside parentheses can still use colons: `config(timeout:30,retries:3)`

### Spacing and Quoting Rules

**Decision**: Handle spaces and special characters consistently across all parameters.

**Quoting guidelines:**
- **No quotes needed**: Simple values without spaces or special characters
  - `path:src/auth.js`, `service:auth-api`, `issue:123`
- **Single quotes required**: Values containing spaces or special characters
  - `path:'src/user service.js'`, `service:'user management api'`
  - `url:'https://example.com/api reference'`, `endpoint:'/api/user profiles'`
- **Double quotes for complex cases**: When single quotes appear in the value
  - `message:"Can't connect to service"`, `pattern:"user's-\d+"` 

**Benefits:**
- Handles real-world file paths with spaces (especially Windows)
- Supports service names and API endpoints with spaces
- Consistent with established quoting mechanisms
- Clean syntax for simple cases, robust handling for complex ones

### Universal Parameters and Todo Consolidation

**Decision**: Recognize universal parameters that work across markers, and consolidate work-related markers into `todo`.

**Universal parameters (work across all markers):**
- `owner:@alice` or `owners:[@alice,@bob]` - responsibility assignment
- `assignee:@charlie` - active work assignment  
- `parent:epic-123` - hierarchical organization
- `related:[4,7,docs-auth]` - connected items
- `priority:high` - importance/urgency level

**Todo as work container:**

```javascript
// Simple todos
// :A: todo implement validation
// :A: todo(priority:high) fix login bug

// Todo with work-specific parameters
// :A: todo(blocked:[4,7],status:in-progress) waiting for API fixes
// :A: todo(blocking:[12,15],owners:[@alice,@bob]) auth redesign

// Universal parameters work with any marker
// :A: sec(owner:@bob,priority:critical) validate user inputs
// :A: ctx(parent:user-stories) explains authentication flow
```

**Bracket usage guidelines:**
- Single values: `blocked:4` or `blocked:[4]` (brackets optional but aid future editing)
- Multiple values: `blocked:[4,7]` (brackets required)
- Preference: Use brackets for parameters that commonly become multiple (`owners`, `blocked`, `tags`)

**Change notes:**
- Consolidate `bug`, `fixme`, `debt` → `todo(type:bug)`, `todo(type:debt)`, etc.
- Universal parameters provide consistent context across marker types
- Reserve braces `{}` for future use

### Core Marker Groups System

**Decision**: Organize markers into 6 semantic groups for flexible usage and searchability.

**Core Marker Groups:**

1. **`todo` group (work needed):**
   - `todo` - general work that needs doing
   - `bug` - defects to fix
   - `fix` / `fixme` - broken code requiring immediate attention
   - `task` - specific work items
   - `issue` / `ticket` - tracked work items
   - `pr` - pull request related work
   - `review` - code/design review needed

2. **`info` group (explanations/guidance):**
   - `context` - important background information for understanding code
   - `note` - general observations or explanations
   - `docs` - documentation needed or references
   - `explain` - detailed explanations of complex logic
   - `tldr` - brief summaries or overviews
   - `example` - usage examples or demonstrations
   - `guide` - step-by-step instructions
   - `rule` - behavioral rules for humans or agents

3. **`notice` group (warnings/alerts):**
   - `warn` - general warnings or cautions
   - `freeze` - code must not be modified
   - `critical` - critical issues requiring immediate attention
   - `unsafe` - potentially dangerous code
   - `deprecated` - code scheduled for removal
   - `unstable` - subject to change without notice
   - `experiment` - new features being tested
   - `changing` - code that will change in future versions

4. **`trigger` group (automated behaviors):**
   - `action` - general automated actions
   - `notify` - send notifications when conditions met
   - `alert` - urgent notifications
   - `hook` - integration with external systems

5. **`domain` group (specialized contexts):**
   - `api` - public interface definitions
   - `security` - security-sensitive code
   - `perf` - performance-critical sections
   - `deploy` - deployment-related code
   - `test` - testing-related markers
   - `data` - data handling or storage
   - `config` - configuration management
   - `lint` - code quality and style

6. **`status` group (lifecycle states):**
   - `temp` - temporary code to be removed
   - `placeholder` - incomplete implementations
   - `stub` - minimal implementations for testing
   - `mock` - fake implementations
   - `draft` - preliminary versions
   - `prototype` - experimental implementations
   - `complete` - finished implementations
   - `ready` - ready for next phase
   - `broken` - known non-functional code

**Benefits:**

- **Flexible searching**: `rg ":A:.*notice"` finds all warnings, or `rg ":A:.*warn"` for specific types
- **Semantic clarity**: Write precise markers (`freeze`, `critical`) rather than generic ones
- **Extensible**: Add new markers to existing groups without core changes
- **LLM-friendly**: Clear categorization helps AI agents understand intent

### Universal Parameter Groups

**Decision**: Organize parameters into 6 semantic groups that work across all marker types.

**Parameter Groups:**

1. **`mention` group (who/what entity):**
   - `owner:@alice` - who maintains/owns this code
   - `by:@agent` - who created this (useful for agent attribution)
   - `team:@frontend` - which team is responsible
   - `assign:@bob` - who should work on this (equivalent to `@bob`)

2. **`relation` group (connections):**
   - `parent:epic-123` - belongs to larger work item or hierarchy
   - `related:[4,7,docs-auth]` - connected items, cross-references
   - `depends:[auth-service,user-db]` - external dependencies required
   - `path:src/auth.js` - file or directory references
   - `url:https://docs.example.com` - web documentation or external links
   - `service:auth-api` - microservice or external service references
   - `endpoint:/api/users` - API endpoint references
   - `repo:frontend/components` - repository or codebase references
   - `issue:4` - issue tracker references (alternative to blocked/related)
   - `pr:123` - pull request references
   - `commit:a1b2c3d` - git commit references

3. **`workflow` group (work coordination):**
   - `blocked:[4,7]` - what prevents this work from proceeding
   - `blocking:[12,15]` - what this work prevents from proceeding  
   - `on:change` - trigger condition for automated actions
   - `reason:compliance` - explanation for why something exists

4. **`priority` group (importance/urgency):**
   - `priority:high` - importance level for triage
   - `severity:critical` - risk/impact level (especially for warnings)
   - `complexity:high` - difficulty level for code understanding

5. **`lifecycle` group (timing/state):**
   - `since:1.2.0` - version when introduced
   - `until:2.0.0` - version scheduled for removal
   - `status:in-progress` - current state of work
   - `type:bug` - classification category

6. **`scope` group (environment/context):**
   - `env:prod` - environment context (dev, staging, prod)
   - `platform:ios` - platform-specific behavior (ios, android, web)
   - `region:us-east` - geographic or deployment region
   - `build:debug` - build configuration context

**Usage Examples:**

```javascript
// Universal parameters work with any marker
// :A: todo(assign:@alice,priority:high,blocked:[4,7]) implement auth
// :A: security(owner:@bob,severity:critical,url:compliance-docs) validate inputs
// :A: context(complexity:high,since:1.2.0,path:algorithms/auth.js) recursive algorithm

// Specific reference types for clear context
// :A: api(endpoint:/users,service:user-api,path:routes/users.js) user management
// :A: deploy(depends:[auth-service],env:prod,repo:infrastructure) production setup
// :A: bug(issue:123,commit:a1b2c3d,related:[124,125]) fix authentication flow

// @mentions are equivalent to assign parameter
// :A: todo @alice implement auth
// :A: review @team-leads check performance impact
```

**Search Benefits:**

```bash
# Group-level searches
rg ":A:.*mention"        # All assignments/ownership
rg ":A:.*relation"       # All connections/references
rg ":A:.*workflow"       # All work coordination
rg ":A:.*priority"       # All importance/urgency markers

# Specific parameter searches  
rg ":A:.*blocked"        # Just blocked items
rg ":A:.*severity:critical"  # Critical severity items
rg ":A:.*path:"          # All file references
rg ":A:.*service:"       # All service references
rg ":A:.*endpoint:"      # All API endpoint references
```

**Benefits:**

- **Universal application**: Same parameters work across all marker groups
- **Flexible searching**: Group-level or specific parameter searches
- **Clear semantics**: Parameters grouped by purpose and meaning
- **Extensible**: Add new parameters to existing groups without syntax changes