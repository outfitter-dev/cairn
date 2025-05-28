<!-- :ga:tldr comprehensive implementation plan for grepa syntax updates and specification refinements -->
# Grepa Syntax Updates - Implementation Plan

> **Architecture Document**: This is a forward-looking architectural specification that extends beyond the "simple pattern" approach described in the root README.md. It outlines comprehensive syntax enhancements and advanced features for future implementation.

<!-- :ga:meta comprehensive architectural design document for syntax updates -->
This document outlines the complete implementation plan for updating grepa's syntax specification, core patterns, and tooling integration based on architectural analysis and syntax refinement discussions.

> **Migration Note**: This specification uses the new `priority:high` syntax. Until global migration is complete, existing documentation may still show the legacy `priority.high` format.

<!-- :ga:status completed implementation plan with comprehensive specifications -->
## Implementation Status

All major architectural decisions have been finalized. This document serves as the authoritative implementation plan for syntax updates across the entire grepa project.

<!-- :ga:ctx this plan implements decisions from extensive syntax analysis and architectural discussions -->
## Implementation Overview

### Core Architectural Principles

<!-- :ga:principle fundamental design constraint for grammar consistency -->
1. **Single Token Preference**: When introducing markers, prefer markers that LLMs tokenize **as** single tokens.
2. **Logical Unit Coherence**: Each grep-anchor represents one complete logical unit of information.
3. **Comma-Only Separation**: Multiple markers within anchors use comma separation exclusively.
4. **Quote Protection**: Prose containing commas must be wrapped in quotes.
5. **Space Boundary Rule**: The first space following the last structured marker delimits the prose boundary.

<!-- :ga:arch delimiter semantic distinction for parser consistency -->
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

<!-- :ga:decision critical architectural choice affecting all syntax patterns -->
**Decision Framework Application:**
- Use dots (`.`) for genuine hierarchies: object structures, code organization
- Use colons (`:`) for type:value relationships: classifications, states, categories  
- Use parentheses `()` for parameters: structured data associated with markers
- Mixed patterns allowed: `api.v2:deprecated` (v2 of api *is* deprecated)

<!-- :ga:todo update all documentation to reflect colon delimiter usage for priority -->
**Required Documentation Updates:**
- Change all `priority.high` examples to `priority:high` throughout documentation
- Update pattern examples in conventions documentation
- Revise search pattern examples in guides

## Priority Scheme Configuration System

<!-- :ga:config flexible team configuration for priority notation preferences -->
### Configurable Priority Schemes

Teams can configure their preferred priority notation system in `grepaconfig.yaml` to standardize team-wide conventions.

**Numeric Scheme Configuration:**
```yaml
priorities:
# Primary notation uses p0/p1/p2
  scheme: "numeric"
  numeric:
    p0: "critical"     # :ga:p0 → :ga:priority:critical
    p1: "high"         # :ga:p1 → :ga:priority:high  
    p2: "medium"       # :ga:p2 → :ga:priority:medium
    p3: "low"          # :ga:p3 → :ga:priority:low
    p4: "trivial"      # :ga:p4 → :ga:priority:trivial
```

**Named Scheme Configuration:**
```yaml
priorities:
# Primary notation uses critical/high/medium
  scheme: named
  named:
    critical: "p0"     # :ga:critical → :ga:priority:critical
    high: "p1"         # :ga:high → :ga:priority:high
    medium: "p2"       # :ga:medium → :ga:priority:medium
    low: "p3"          # :ga:low → :ga:priority:low
    trivial: "p4"      # :ga:trivial → :ga:priority:trivial
```

**Custom Aliases:**
```yaml
priorities:
  aliases:
    "urgent": "critical"      # :ga:urgent → :ga:priority:critical
    "blocker": "critical"     # :ga:blocker → :ga:priority:critical
    "nice-to-have": "trivial" # :ga:nice-to-have → :ga:priority:trivial
```

<!-- :ga:benefit tool integration advantages for team consistency -->
**Benefits:**
- **Team Consistency**: Everyone uses same notation style
- **Tool Integration**: IDEs can show dropdowns with team's preferred scheme
- **Search Normalization**: All priority searches work regardless of input format
- **Migration Support**: Teams can gradually shift between schemes

## Version Notation System

<!-- :ga:spec multi-ecosystem version support with configurable patterns -->
### Multi-Ecosystem Version Support

Support for diverse version notation styles across different technology ecosystems:

**Semver Patterns:**
```javascript
// :ga:since:^1.2.0        // Compatible versions from 1.2.0
// :ga:until:~1.2.0        // Patch-level changes only
// :ga:compat:>=1.2.0      // Minimum version requirement
// :ga:range:>=1.2.0,<2.0.0 // Version range specification
```

**Python Version Patterns:**
```python
# :ga:since:==1.2.0       # Exact version match
# :ga:compat:~=1.2.0      # Compatible release operator
# :ga:requires:>=1.2.0,<2.0.0 # Range with comma separator
```

**Maven Version Patterns:**
```java
// :ga:since:[1.2.0]       // Exact version specification
// :ga:range:[1.2.0,2.0.0) // Range with exclusive upper bound
// :ga:minimum:[1.2.0,)    // Minimum with open upper bound
```

**Ruby Version Patterns:**
```ruby
# :ga:compat:~> 1.2.0     # Pessimistic version constraint
# :ga:range:>= 1.2.0, < 2.0 # Range with Ruby syntax
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

<!-- :ga:syntax advanced multi-line support for complex anchor patterns -->
### Enhanced Readability for Complex Anchors

Multi-line anchor syntax for comment formats that support it, while preserving the "single anchor == one complete thought" principle.

**Supported Comment Formats:**
- HTML: `<!-- :ga: ... -->`
- CSS/JS/C++: `/* :ga: ... */`
- Python docstrings: `""" :ga: ... """`

**Syntax Rules:**
1. **Opening Pattern**: Comment start + `:ga:` on first line
2. **Marker Lines**: Indented markers, one per line or comma-separated
3. **Prose Constraint**: Optional prose must be on same line as final marker
4. **Closing Pattern**: Comment end maintains marker boundary

**Examples:**

```html
<!-- :ga:
    todo,
    priority:critical,
    blocked(by:issue:4),
    owner@alice fix authentication bug
-->
```

```javascript
/* :ga:
    config:env[
        prod(api-prod.company.com),
        staging(api-staging.company.com),
        dev(localhost:3000)
    ]
    endpoint configuration for environments
*/
```

```python
""" :ga:
    api,
    module:auth,
    since:v2.0 main authentication module
"""
```

<!-- :ga:warning ripgrep search implications for multi-line patterns -->
**Search Pattern Implications:**

Single-line patterns won't find multi-line anchors:
```bash
# This WON'T find multi-line anchors
rg ":ga:todo"                    # Misses multi-line variants
```

Multi-line search patterns required:
```bash
# Find opening patterns (good starting point)  
rg "<!-- :ga:|/\* :ga:|\"\"\" :ga:"

# Multi-line search with context
rg -U ":ga:.*todo.*-->" --type html    # Multi-line mode
rg -A 10 "<!-- :ga:" | rg "todo"      # Find opens, then search content
```

<!-- :ga:decision backwards compatibility with single-line preference -->
**Implementation Decision:**
- All existing single-line anchors continue to work unchanged
- Multi-line is opt-in syntax for complex cases only
- Simple markers should remain single-line: `<!-- :ga:todo fix this -->`
- Complex parameter lists and conditional configurations can use multi-line

## Escape and Quoting Mechanisms

<!-- :ga:spec comprehensive character handling for special cases -->
### Robust Special Character Handling

**Quoting Rules Framework:**

1. **Single Quotes for Literal Strings:**
```javascript
// :ga:regex('user-\d+')              // literal regex pattern
// :ga:path('/path/with spaces')      // path with spaces
// :ga:message('Error: invalid ()')   // message with special chars
```

2. **Double Quotes for Interpolated Strings:**
```javascript
// :ga:template("User: $name ($id)")  // template with variables
// :ga:query("SELECT * FROM users")   // SQL with interpolation potential
```

3. **No Quotes When Unambiguous:**
```javascript
// :ga:user(alice)                    // simple identifier
// :ga:priority:high                  // simple type:value
// :ga:version(2.0.1)                 // version number
```

**Escape Sequences:**
```javascript
// :ga:message('Can\'t connect')      // escaped single quote
// :ga:path("C:\\Program Files")      // escaped backslash
// :ga:regex("user\.\d+")             // escaped dots in regex
// :ga:json('{"key": "value"}')       // JSON in single quotes
```

**Complex Use Cases:**

**Regex Patterns:**
```javascript
// Simple patterns (no quotes needed)
// :ga:match(user-123)                // literal match
// :ga:pattern(\d+)                   // simple regex

// Complex patterns (quoted)
// :ga:regex('^\\w+@[\\w.-]+\\.\\w{2,}$') // email regex
// :ga:match('user-\\d+-(test|prod)')  // complex pattern
```

**File Paths:**
```javascript
// Simple paths (no quotes)
// :ga:file(src/auth.js)              // standard path
// :ga:path(/usr/local/bin)           // Unix path

// Paths with special chars (quoted)
// :ga:file('src/user service.js')    // spaces
// :ga:path('C:\Program Files\App')   // Windows path
```

**Arrays with Special Characters:**
```javascript
// Simple arrays (no quotes)
// :ga:tags[auth,api,v2]              // simple identifiers

// Complex arrays (quoted elements)
// :ga:patterns['user-\\d+','admin-.*'] // regex patterns
// :ga:files['src/auth.js','lib/util.js'] // file paths
```

<!-- :ga:guideline parsing strategy for robust character handling -->
**Parsing Strategy:**
1. **Unquoted**: Parse until `,`, `)`, `]`, `}`, or whitespace
2. **Single-quoted**: Parse until unescaped `'`, handle `\'` escapes
3. **Double-quoted**: Parse until unescaped `"`, handle `\"` escapes and `$var` substitution
4. **Validation**: Ensure balanced parens/brackets/braces
5. **Error Handling**: Clear messages for malformed syntax

## Universal Relational Marker System

<!-- :ga:arch unified relationship expression pattern for consistency -->
### Canonized Relational Patterns

Universal relational markers using consistent `marker(relation-type:target-identifier)` pattern for expressing all types of relationships.

**Dependency Relations:**
```javascript
// :ga:depends(on:auth-service)        // requires auth service to function
// :ga:requires(api:user.login)        // needs specific API endpoint
// :ga:needs(config:redis.connection)  // requires configuration
```

**Blocking/Flow Relations:**
```javascript
// :ga:blocked(by:issue:4)             // blocked by specific issue
// :ga:blocking(issue:[7,10])          // blocks other issues
// :ga:awaits(approval:@security-team) // waiting for approval
// :ga:prevents(deployment:prod)       // prevents action
```

**Event/Message Relations:**
```javascript
// :ga:emits(event:user.created)       // publishes this event
// :ga:listens(to:payment.completed)   // subscribes to events
// :ga:triggers(workflow:deploy.prod)  // initiates process
// :ga:responds(to:webhook.stripe)     // handles incoming event
```

**API Contract Relations:**
```javascript
// :ga:consumes(api:v2/users)          // calls this API endpoint
// :ga:provides(api:auth/login)        // implements this endpoint
// :ga:exposes(endpoint:/health)       // makes endpoint available
// :ga:calls(service:payment.charge)   // invokes external service
```

**Data Flow Relations:**
```javascript
// :ga:reads(from:user-db)             // reads from data source
// :ga:writes(to:analytics-queue)      // sends data to destination
// :ga:caches(in:redis.sessions)       // uses cache layer
// :ga:stores(data:user.preferences)   // persists data
```

**Infrastructure Relations:**
```javascript
// :ga:deploys(with:payment-service)   // same deployment boundary
// :ga:scales(based-on:api-traffic)    // scaling relationship
// :ga:monitors(via:prometheus.alerts) // observability relationship
// :ga:routes(through:api-gateway)     // network routing
```

**Array Targets for Multiple Relationships:**
```javascript
// :ga:depends(on:[auth-service,user-db,redis])
// :ga:triggers(workflow:[deploy.staging,run.tests])
// :ga:blocked(by:[issue:4,approval:@alice])
// :ga:consumes(api:[v2/users,v2/auth,v1/billing])
```

<!-- :ga:benefit automation and tooling integration advantages -->
**Automation Benefits:**
- **Service Discovery**: Auto-generate service topology maps
- **Impact Analysis**: Understand blast radius of changes  
- **Event Tracing**: Follow data flows across distributed systems
- **Deployment Planning**: Understand service deployment dependencies

## Enhanced Core Marker Set

<!-- :ga:core expanded standard marker definitions for agent efficiency -->
### Agent-Optimized Core Markers

**Navigation Markers for AI Efficiency:**
```javascript
// :ga:entry                           // Entry points for understanding code flow
// :ga:entry(api)                      // API entry point
// :ga:entry(auth)                     // Authentication entry point
// :ga:explains(auth-flow)             // Documentation content
// :ga:explains(business-logic)        // Business rule explanations
```

**Code Quality Assessment:**
```javascript
// :ga:impact:high                     // Change impact assessment
// :ga:impact([perf:high,api:low])     // Multi-dimensional impact
// :ga:pattern(singleton)              // Design pattern documentation
// :ga:state:global                    // State management markers
// :ga:state:immutable                 // Immutability constraints
```

**Enhanced Reference System:**
```javascript
// :ga:rel(implements:auth-redesign)   // Universal relationship marker
// :ga:rel(depends:auth-service)       // Dependency relationship
// :ga:rel(blocks:issue:4)             // Blocking relationship
```

**Field Markers with Rich Semantics:**
```javascript
// :ga:due(2024-03-15)                 // Due date field
// :ga:since:^1.2.0                    // Version introduced
// :ga:until:[3.0.0,)                  // Version for removal
// :ga:type(migration)                 // Type classification
```

**Mention-Required Markers:**
```javascript
// :ga:owner@alice                     // Responsibility assignment
// :ga:assignee[@alice,@bob]           // Multi-person assignment
```

<!-- :ga:synonym marker aliasing system for consistency -->
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

<!-- :ga:concept grep-anchor as standardized navigation protocol -->
### Grepa as Universal Navigation Protocol

**Core Metaphor**: Grepa as a "breadcrumb protocol" - a standardized way to leave navigational markers throughout codebases that both humans and AI agents can follow.

**Traditional Breadcrumbs**: Leave a trail to find your way back  
**Web Breadcrumbs**: Show navigation path (Home > Products > Laptops > Dell)  
**Grep-Anchor Breadcrumbs**: Mark important locations for future discovery and navigation

**Protocol Components:**

1. **Trail Markers** - Standardized markers for important code locations
   - `:ga:todo` - "work needed here"
   - `:ga:sec` - "security-sensitive location"
   - `:ga:ctx` - "important context to understand"
   - `:ga:entry` - "start here for understanding"

2. **Navigation Paths** - Relationships between marked locations
   - `:ga:rel(depends:auth-service)` - "this connects to auth"
   - `:ga:rel(blocks:feature-x)` - "this prevents that"
   - `:ga:see(auth.js:42)` - "related code over there"

3. **Context Clues** - Human-readable explanations
   - Prose after markers explains WHY this location matters
   - `:ga:todo,priority:high implement rate limiting before launch`

4. **Discovery Mechanism** - Tools to follow the trail
   - `rg ":ga:todo"` - find all work locations
   - `grepa trace --from auth --to payment` - follow dependency trail
   - `grepa map --service auth` - see all auth-related breadcrumbs

**Protocol Benefits:**
- **Leaves a trail** for future developers (including your future self)
- **AI-navigable** - agents can follow breadcrumbs to understand code structure
- **Cross-project consistency** - same breadcrumb format across all codebases
- **Searchable and parseable** - tools can build navigation maps
- **Human-friendly** - readable prose alongside structured markers
- **Relationship-aware** - breadcrumbs can point to other breadcrumbs


## Implementation Roadmap

<!-- :ga:roadmap systematic implementation approach across project -->
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

<!-- :ga:migration systematic approach for adopting new syntax patterns -->
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

<!-- :ga:validation implementation verification checkpoints -->
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

<!-- :ga:completion comprehensive implementation plan finalized -->
## Conclusion

This implementation plan provides a comprehensive framework for updating grepa's syntax specification with enhanced readability, powerful relational capabilities, flexible configuration systems, and robust plugin architecture. The systematic approach ensures backward compatibility while enabling advanced features that support both human understanding and AI agent efficiency.

All architectural decisions have been finalized and documented. Implementation can proceed with confidence in the design's coherence and extensibility.