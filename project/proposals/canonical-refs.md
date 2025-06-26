<!-- !tldr ::: ##docs:@waymark/proposals/canonical-reference Canonical reference system with typed anchors for self-describing knowledge graphs #proposal -->

# Canonical Reference System

A proposal for creating self-describing, interconnected knowledge graphs using typed canonical anchors that declare file purpose and enable intelligent cross-referencing.

## Overview

This system introduces **Typed Canonical Anchors** (`##type:target`) that transform waymarks from simple annotations into a semantic knowledge graph. Files declare their identity and purpose, creating three distinct interaction patterns:

1. **Identity Declaration** (`##type:target`) - "This file IS the canonical X for Y"
2. **Reference Pointer** (`type:target`) - "This relates to the canonical X for Y" 
3. **Relational Link** (`see:type:target`) - "For more info, see the canonical X for Y"

The result is a self-describing system where any entity can be traced to its canonical artifacts (docs, configs, tests, schemas) and all usage points.

## Prefix Design Choice

The system uses `##` for canonical anchors. This design was chosen over alternatives like `^#` for several key reasons:

### Why `##` for Anchors?

**Cognitive Simplicity**: Double the # to make it canonical

- `#anchor` → `##anchor` (canonical anchor definition)
- Clear distinction between reference and definition

**Visual Distinction**: Impossible to confuse with regular references

- `docs:schema` vs `##docs:schema` - reference vs canonical definition
- Double prefix immediately signals "this is the definition"

**Grep Precision**: Clean search patterns without conflicts

```bash
rg "@alice"     # All alice references
rg "docs:"     # All doc references
rg "##docs:"    # Just canonical doc anchors
```

**No Symbol Conflicts**: Avoids regex confusion (unlike `^` which means start-of-line)

**Namespace Clarity**: Each prefix has a clear, distinct purpose in the waymark ecosystem

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

#### 2. Reference Pointer (`type:target`)
**Purpose**: Direct reference that implies lookup  
**Location**: Any file  
**Meaning**: "This relates to [target], find canonical [type] by searching for `##type:target`"

```javascript
// In authentication.js
// todo ::: implement JWT validation docs:@company/auth/setup

// In package.json  
// note ::: auth service configuration config:@company/auth

// In integration.test.js
// wip ::: auth flow testing test:@company/auth
```

#### 3. Relational Link (`see:type:target`)
**Purpose**: Explicit cross-reference with directional intent  
**Location**: Any file  
**Meaning**: "For more information, see the canonical [type] for [target]"

```javascript
// In api-gateway.js
// notice ::: auth middleware required see:docs:@company/auth/setup

// In deployment.yml
// important ::: requires auth config see:config:@company/auth
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

### Self-Describing Files

Every file with a typed canonical anchor immediately communicates:

- **What it is** (docs, config, test, etc.)
- **What it's for** (which system/component)
- **Its canonical authority** (the source of truth)

No context clues needed - the anchor IS the file's identity.

## Core Patterns

### 1. Package and Service References

Packages and services are referenced naturally:

```javascript
// about ::: Authentication service uses @company/auth package #services #internal
// note ::: Depends on @lodash for utility functions #deps #external  
// tldr ::: @waymark/schema provides the schema definitions #packages
```

**Benefits**:

- Natural references without special syntax
- Searchable: `rg "@company/auth"` finds all references
- Clear distinction: actors (@alice) vs packages (@scope/name)

### 2. Typed Canonical Artifacts

Create typed canonical artifacts using `##type:target`:

```markdown
<!-- Documentation Files -->
<!-- tldr ::: ##docs:@waymark/schema/grammar Grammar rules and syntax reference -->
<!-- tldr ::: ##docs:@company/auth/setup Local development setup guide -->
<!-- tldr ::: ##docs:@company/billing/api Payment processing API reference -->
```

```json
// Configuration Files
// tldr ::: ##config:@company/auth/jwt JWT token configuration
// tldr ::: ##config:@company/database/prod Production database settings
```

```javascript
// Test Suites
// tldr ::: ##test:@company/auth/integration Authentication integration tests
// tldr ::: ##test:@waymark/parser/unit Parser unit test suite
```

```yaml
# API Specifications
# tldr ::: ##api:@company/billing/v2 Billing service API v2.0 specification
```

```json
// Schema Definitions
// tldr ::: ##schema:@company/user User data model and validation rules
```

**Benefits**:

- **File Purpose is Explicit**: No guessing what a file contains
- **Typed Namespaces**: Find all docs, configs, tests, etc. for any target
- **Canonical Authority**: Exactly one file declares itself as THE source
- **Tool Intelligence**: Parsers understand file relationships automatically

### 3. Reference Network

Create intelligent cross-references using the three-tier system:

```javascript
// === Service Description ===
// about ::: Authentication service @company/auth handles all auth operations #services #security
```

```markdown
<!-- === Documentation Artifacts === -->
<!-- tldr ::: ##docs:@company/auth/overview Authentication service architecture overview -->
<!-- tldr ::: ##docs:@company/auth/api REST API endpoints and authentication -->
```

```json
// === Configuration Artifacts ===
// tldr ::: ##config:@company/auth Production authentication configuration
```

```javascript
// === Test Artifacts ===
// tldr ::: ##test:@company/auth/e2e End-to-end authentication test suite

// === Usage References ===
// todo ::: implement OAuth flow docs:@company/auth/api
// config ::: jwt settings required config:@company/auth  
// test ::: auth integration needed test:@company/auth/e2e

// === Cross-References ===
// notice ::: breaking change in auth see:docs:@company/auth/migration
// important ::: follows security standards see:docs:@company/security/guidelines
```

**Benefits**:

- **Bidirectional Discovery**: Find artifacts from usage, usage from artifacts
- **Typed References**: Know exactly what kind of information you're referencing
- **Intelligent Tooling**: Tools can resolve references and validate links
- **Self-Documenting**: Reference intent is explicit

## Search Patterns

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
rg "docs:@company/auth"              # All doc references to auth
rg "see:docs:"                      # All "see also" doc references
rg "deps:@company/"                  # All internal dependencies

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
- `docs:@company/auth/api` - Documentation references
- `config:@company/auth` - Configuration references
- `see:docs:@company/auth/setup` - Cross-references

### Typed Artifact Discovery

Find canonical artifacts by type:

```bash
# All documentation artifacts
rg "##docs:"

# All documentation for auth system
rg "##docs:@company/auth"

# All configuration artifacts
rg "##config:"

# All test suites
rg "##test:"

# All API specifications  
rg "##api:"

# All schemas
rg "##schema:"
```

### Reference Resolution

Find usage and cross-references:

```bash
# All references to auth documentation
rg "docs:@company/auth"

# All references to auth configuration  
rg "config:@company/auth"

# All "see also" references to auth docs
rg "see:docs:@company/auth"

# All dependencies on auth system
rg "deps:@company/auth"

# All code affected by auth changes
rg "affects:@company/auth"
```

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
rg "docs:@company/auth"

# What references auth config?
rg "config:@company/auth"

# What would be affected by auth changes?
rg "affects:@company/auth"
```

## Extended Applications

### Actor-Related Documentation

Document team members and their expertise:

```javascript
// === Actor Description ===
// about ::: @alice is our senior backend engineer specializing in auth #team:backend
```

```markdown
<!-- === Actor Documentation === -->
<!-- tldr ::: ##docs:team/alice-expertise Alice's technical areas and current focus -->
<!-- tldr ::: ##docs:team/alice-projects Current project assignments for @alice -->
```

```javascript
// === References and Usage ===
// todo ::: review security implementation owner:@alice
// note ::: @alice is our auth expert, consult on security see:docs:team/alice-expertise  
// question ::: JWT implementation approach ask:@alice
```

### Service-Centered Knowledge

Complete service documentation with typed artifacts:

```javascript
// === Service Definition ===
// about ::: @@company/billing Payment processing and subscription management #services #critical
```

```markdown
<!-- === Service Documentation Artifacts === -->
<!-- tldr ::: ##docs:@company/billing/overview Service architecture and responsibilities -->
<!-- tldr ::: ##docs:@company/billing/api REST API endpoints and authentication -->
<!-- tldr ::: ##docs:@company/billing/runbook Incident response and troubleshooting -->
```

```json
// === Service Configuration Artifacts ===
// tldr ::: ##config:@company/billing/prod Production environment configuration
// tldr ::: ##config:@company/billing/dev Development setup and local testing
```

```javascript
// === Service Test Artifacts ===
// tldr ::: ##test:@company/billing/integration End-to-end payment flow tests
```

```yaml
# === Service API Artifacts ===
# tldr ::: ##api:@company/billing/v2 Billing service API v2.0 specification
```

```javascript
// === Usage and Dependencies ===
// todo ::: integrate payment processing deps:@company/billing #docs:@company/billing/api
// fixme ::: payment timeout on checkout affects:@company/billing see:docs:@company/billing/runbook
// notice ::: billing service upgrade scheduled see:docs:@company/billing/migration
```

### Project-Centered Coordination

Organize project artifacts and track progress:

```javascript
// === Project Definition ===
// about ::: @@projects/mobile-redesign Complete mobile app UI/UX overhaul #projects #q2-2024
```

```markdown
<!-- === Project Documentation Artifacts === -->
<!-- tldr ::: ##docs:@projects/mobile-redesign/overview Project goals and success metrics -->
<!-- tldr ::: ##docs:@projects/mobile-redesign/timeline Milestones and delivery schedule -->
<!-- tldr ::: ##docs:@projects/mobile-redesign/design UI mockups and design system -->
```

```json
// === Project Configuration Artifacts ===
// tldr ::: ##config:@projects/mobile-redesign/features Feature flags and rollout strategy
```

```javascript
// === Project Test Artifacts ===
// tldr ::: ##test:@projects/mobile-redesign/acceptance User acceptance test scenarios

// === Project Work and Progress ===
// todo ::: implement new navigation for:@projects/mobile-redesign #docs:@projects/mobile-redesign/design
// wip ::: user onboarding flow for:@projects/mobile-redesign owner:@design-team
// done ::: login screen redesign for:@projects/mobile-redesign see:docs:@projects/mobile-redesign/timeline
```

### Domain-Specific Applications

Extend to any domain with appropriate artifact types:

**Infrastructure & DevOps:**

```javascript
// tldr ::: ##runbook:@company/incident/database Database failure recovery procedures
// tldr ::: ##config:@company/kubernetes/prod Production cluster configuration
// tldr ::: ##docs:@company/deployment/pipeline CI/CD pipeline documentation
```

**Data & Analytics:**

```javascript
// tldr ::: ##schema:@company/events/user User interaction event definitions  
// tldr ::: ##docs:@company/analytics/reporting Business reporting requirements
// tldr ::: ##config:@company/data-warehouse/etl ETL pipeline configuration
```

**Security & Compliance:**

```javascript
// tldr ::: ##docs:@company/security/policies Information security policies
// tldr ::: ##runbook:@company/security/incident Security incident response plan
// tldr ::: ##config:@company/security/access Access control and permissions
```

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

## Implementation Benefits

### 1. Self-Describing System Architecture

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

### 2. Intelligent Knowledge Navigation

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

### 3. Zero-Ambiguity File Identification

Files declare their exact purpose and scope:

```javascript
// Immediately clear what each file contains:
// tldr ::: ##docs:@company/billing/api Billing service REST API documentation
// tldr ::: ##config:@company/billing/prod Production billing service configuration  
// tldr ::: ##test:@company/billing/integration Billing payment flow integration tests
// tldr ::: ##runbook:@company/billing/incident Billing service incident response procedures
```

### 4. Accelerated Onboarding with Typed Discovery

New team members can explore systematically by artifact type:

```bash
# What services exist?
rg "@@.*/"

# What documentation is available?
rg "##docs:" --no-filename | sed 's/.*##docs://' | sort

# What configuration files exist?  
rg "##config:" --no-filename | sed 's/.*##config://' | sort

# What test suites can I run?
rg "##test:" --no-filename | sed 's/.*##test://' | sort

# How do I set up the auth system?
rg "##docs:@company/auth.*setup"
```

### 5. Precise Impact Analysis

Understand exactly what artifacts and code are affected:

```bash
# What references auth documentation?
rg "docs:@company/auth"

# What needs auth configuration?
rg "config:@company/auth" 

# What would break if we change auth?
rg "affects:@company/auth"

# What tests cover auth functionality?
rg "test:@company/auth"
```

### 6. Tool Intelligence & Validation

Parsers can understand and validate file relationships:

- **Link Resolution**: Tools can resolve `docs:@company/auth` to `##docs:@company/auth/overview`
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

## Namespace Design

### Package Format: `@scope/name` and `pkg:@scope/name`

- `@waymark/schema` or `pkg:@waymark/schema` - Open source packages
- `@company/auth` or `pkg:@company/auth` - Internal services  
- `@team/toolkit` or `pkg:@team/toolkit` - Team-specific tools
- `@projects/auth-v2` or `pkg:@projects/auth-v2` - Project codenames

**Tooling Note**: Waymark tools should treat `pkg:@scope/package` and `@scope/package` as synonyms. While `pkg:@scope/package` is more explicit for grep searches, both forms are valid and equivalent.

### Documentation Paths: `#docs:@scope/name/topic` or `#docs:pkg:@scope/name/topic`

- `#docs:@waymark/schema/grammar` or `#docs:pkg:@waymark/schema/grammar` - Grammar documentation
- `docs:@company/auth/api` or `#docs:pkg:@company/auth/api` - API documentation
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

## Migration Strategy

### Phase 1: Canonical Definitions
Add `@@` anchors for key entities:

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

## Example: Complete System

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
// todo ::: implement JWT validation docs:@company/auth/api config:@company/auth/prod
// fixme ::: session timeout on mobile affects:@company/auth test:@company/auth/e2e
// note ::: rate limiting required see:docs:@company/auth/api

// In infrastructure code  
// config ::: auth service deployment config:@company/auth/prod see:docs:@company/auth/deployment
// test ::: auth load testing test:@company/auth/integration

// In other services
// todo ::: integrate SSO deps:@company/auth see:docs:@company/auth/overview
// notice ::: auth token format change affects:@frontend/app,@mobile/app see:docs:@company/auth/migration

// === Cross-Service References ===

// From user service
// note ::: depends on auth for user sessions deps:@company/auth see:api:@company/auth/v2

// From billing service  
// important ::: requires authenticated requests deps:@company/auth see:docs:@company/auth/api

// From admin dashboard
// config ::: admin auth configuration see:config:@company/auth/prod

// === Operational References ===

// In monitoring alerts
// alert ::: auth service down runbook:@company/auth/incident

// In deployment pipeline
// deploy ::: auth service rollout see:docs:@company/auth/deployment config:@company/auth/prod
```

## Search Examples

```bash
# Complete auth system picture
rg "@company/auth"

# All references to the auth service
rg "@company/auth"

# All auth documentation
rg "docs:@company/auth"

# Who owns auth-related work?
rg "owner:@\w+.*auth|auth.*owner:@\w+"

# What depends on auth?
rg "deps:@company/auth"
```

## Benefits Summary

### Core Advantages

1. **Self-Describing Architecture**: Files declare their purpose and authority explicitly
2. **Typed Knowledge Graph**: Every artifact has a clear type and relationship
3. **Zero-Ambiguity References**: No guessing about file contents or purpose  
4. **Intelligent Discovery**: Find artifacts by type, entity, or cross-reference
5. **Tool-Friendly**: Parsers can understand, validate, and resolve relationships
6. **Infinite Extensibility**: Works for any artifact type in any domain

### Transformation Impact

**Before:** Waymarks as simple annotations  
**After:** Waymarks as a typed, navigable knowledge graph

**Before:** Files need context to understand purpose  
**After:** Files declare their identity and canonical authority

**Before:** Documentation scattered and hard to find  
**After:** Every entity has discoverable, typed artifacts

**Before:** Manual effort to understand system relationships  
**After:** Automated discovery of dependencies and impacts

**Key insight:** Actors (@alice) and packages (@scope/name) are inherently unique - only anchors need canonical definitions

### Organizational Benefits

- **Faster Onboarding**: New team members can systematically explore by artifact type
- **Reduced Context Switching**: Find exactly what you need without guessing
- **Improved Documentation Culture**: Easy to create and maintain canonical artifacts  
- **Better Architecture Visibility**: Self-documenting system relationships
- **Enhanced Tool Development**: Rich semantic information enables intelligent tooling
- **Future-Proof Knowledge**: Scales to any domain or artifact type

### Future Tooling Possibilities

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