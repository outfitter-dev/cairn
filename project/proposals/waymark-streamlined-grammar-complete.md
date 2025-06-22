<!-- tldr ::: ##docs:@waymark/proposals/streamlined-grammar-complete Complete waymark grammar with typed canonical reference system #proposal -->

# Waymark Streamlined Grammar & Canonical Reference System

A comprehensive proposal that simplifies waymark terminology while introducing typed canonical anchors for creating self-describing, interconnected knowledge graphs.

## Overview

After extensive iteration, we've identified opportunities to streamline the waymark grammar by:

- Simplifying terminology
- Unifying all key:value pairs as "tags" (keeping the `#` prefix)
- Clarifying the distinction between simple tags and relational tags
- Clarifying the anchor system
- Introducing **Typed Canonical Anchors** (`##type:target`) that transform waymarks into a semantic knowledge graph

The result is a cleaner, more intuitive system that maintains full search capabilities while enabling intelligent cross-referencing and self-describing architecture.

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

## Typed Canonical Anchors: The Core Innovation

### The Three-Tier Interaction Model

The typed canonical anchor system creates three semantically distinct ways to interact with any concept:

#### 1. Identity Declaration (`##type:target`)
**Purpose**: Establishes file identity and canonical purpose  
**Location**: Exactly one declaration per `type:target` pair across the entire repository  
**Meaning**: "This file IS the canonical [type] for [target]"

**Uniqueness Rules:**
- Each `##type:target` combination must be unique across the entire repository
- Multiple typed anchors are allowed per file (e.g., `##docs:@company/auth/api` and `##config:@company/auth/prod`)
- Same target with different types is allowed (e.g., `##docs:@company/auth` and `##config:@company/auth`)

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
// === Service Overview ===
// about ::: The @company/auth package provides authentication and authorization #services #security #critical
```

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

## Terminology Summary

| Component | Syntax | Example | Purpose |
|-----------|--------|---------|---------|
| **Tag** | `#word` | `#backend` | Simple labels |
| **Relational Tag** | `#key:value` | `#owner:@alice` | Key-value pairs |
| **Actor** | `@name` | `@alice` | People/teams/agents |
| **Generic Anchor** | `##name` | `##auth/login` | Named locations |
| **Typed Anchor** | `##type:name` | `##docs:@company/auth` | Canonical artifacts |
| **Anchor Reference** | `#name` or `#type:name` | `#auth/login`, `#docs:@company/auth` | Points to anchors |

## Namespace Design

### Package Format: `@scope/name` and `pkg:@scope/name`

- `@waymark/schema` or `pkg:@waymark/schema` - Open source packages
- `@company/auth` or `pkg:@company/auth` - Internal services  
- `@team/toolkit` or `pkg:@team/toolkit` - Team-specific tools
- `@projects/auth-v2` or `pkg:@projects/auth-v2` - Project codenames

**Tooling Note**: Waymark tools should treat `pkg:@scope/package` and `@scope/package` as synonyms. While `pkg:@scope/package` is more explicit for grep searches, both forms are valid and equivalent.

### Documentation Paths: `#docs:@scope/name/topic` or `#docs:pkg:@scope/name/topic`

- `#docs:@waymark/schema/grammar` or `#docs:pkg:@waymark/schema/grammar` - Grammar documentation
- `#docs:@company/auth/api` or `#docs:pkg:@company/auth/api` - API documentation
- `#docs:@projects/auth-v2/timeline` or `#docs:pkg:@projects/auth-v2/timeline` - Project timeline

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

The waymark provides a stable navigation anchor (`##api/auth/service`) while JSDoc handles the API documentation. They complement rather than compete. See [JSDoc Integration Proposal](./jsdoc-integration.md) for detailed patterns.

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

- [Waymark 1.0 Simplification](waymark-1.0-simplification.md) - Core waymark patterns
- [Custom Tags](../docs/usage/patterns/custom-tags.md) - Creating project-specific tags
- [Search Patterns](../docs/usage/search/) - Finding waymarks effectively