<!-- !!tldr ::: A guide to using tldr waymarkers #documentation -->

# `tldr :::` Annotate your codebase for AI agents

> [!TIP]
> **If you only use one waymark for one thing, make it `tldr :::`.**

The `tldr :::` waymark is the single most valuable waymark for AI navigation and human understanding. It's the first thing agents read to understand a file's purpose and decide if they need to dig deeper.

For the formal specification, see [docs/syntax/SPEC.md](./syntax/SPEC.md).

## Understanding Grep Output

When you run `rg "tldr :::"`, you only see the specific line containing the waymark. This makes it crucial to pack the most important information into the TLDR itself:

```javascript
// ❌ Too sparse - doesn't tell the full story in one line
// tldr ::: auth utilities

// ✅ Complete context in one line  
// tldr ::: JWT auth middleware validating Bearer tokens via RS256 #auth #middleware #security
```

**Pro tip**: Use `rg "tldr :::" -A 2 -B 1` to see surrounding context when needed.

## Why TLDR Matters

1. **Agent Familiarity** - Agents use tldrs to build mental maps of codebases
2. **Search Efficiency** - `rg "tldr :::"` instantly shows what every file does across the codebase
3. **Onboarding Speed** - New developers understand structure in minutes
4. **Decision Making** - Quickly determine which files to read/modify

## Codebase Discovery Workflow

When entering a new codebase, use this search progression:

1. **Get the big picture**: `rg "!!tldr :::"` → Find 3-5 most critical files
2. **Understand core systems**: `rg "!tldr :::"` → Find important subsystems  
3. **Browse by domain**: `rg "tldr :::.*#auth"` → Find all auth-related code
4. **Map architecture**: `rg "tldr :::.*##"` → Find all canonical anchors
5. **Check status**: `rg "tldr :::.*#(experimental|legacy)"` → Find risky/outdated code

This progression builds understanding from critical → important → specific.

## Effective Signaling and Tagging

### Signal Priority System

Use signals to establish clear hierarchy for code navigation:

```javascript
// !!tldr ::: The single most critical entry point #entrypoint #critical
// !tldr ::: Important subsystem or core component #core #auth  
// tldr ::: Regular file summary #utils #helpers
```

**Search patterns:**

- `rg "!!tldr :::"` → Find the MOST critical parts first (app entry, main APIs)
- `rg "!tldr :::"` → Find important subsystems and core components  
- `rg "tldr :::"` → All file summaries

### Tag Categories for TLDRs

Add tags to make your tldrs searchable by domain, technology, and purpose:

#### Domain Tags

```javascript
// tldr ::: user management API endpoints #auth #users #api
// tldr ::: payment processing with Stripe #payments #billing #stripe
// tldr ::: real-time chat websocket handler #chat #websockets #realtime
```

#### Technology Tags  

```javascript
// tldr ::: React component library with TypeScript #react #typescript #components
// tldr ::: PostgreSQL migration scripts #postgres #migrations #database
// tldr ::: Docker configuration for development #docker #dev #infrastructure
```

#### Architecture Tags

```javascript
// !!tldr ::: Main application server entry point #entrypoint #server #express
// tldr ::: Shared utility functions for data validation #utils #validation #shared
// tldr ::: Integration layer for external APIs #integration #api #external
```

#### Status and Quality Tags

```javascript
// tldr ::: Legacy authentication system (needs migration) #legacy #auth #debt
// tldr ::: Experimental ML-based recommendations #experimental #ml #recommendations  
// tldr ::: Production-ready caching layer #stable #cache #performance
```

### Searchable TLDR Patterns

```bash
# Find all entry points across the codebase
rg "!!tldr :::"

# Find all authentication-related files
rg "tldr :::.*#auth"

# Find all API endpoints
rg "tldr :::.*#api"

# Find experimental or legacy code
rg "tldr :::.*#(experimental|legacy)"

# Find all React components
rg "tldr :::.*#react.*#components"

# Find database-related files
rg "tldr :::.*#(database|postgres|migrations)"

# Find performance-critical code
rg "tldr :::.*#(performance|hotpath|critical)"
```

### TLDR Anchor Definitions

Use anchors for stable reference points that other waymarks can reference:

```javascript
// !!tldr ::: ##app/server Express server with auth and logging middleware #entrypoint #server
// tldr ::: ##auth/jwt JWT token validation and refresh logic #auth #security #core
// tldr ::: ##db/migrations Database schema migration utilities #database #migrations #utils
```

**Reference from other waymarks:**

```javascript
// todo ::: add rate limiting #for:#app/server #performance
// fixme ::: token refresh race condition #refs:#auth/jwt #security
// test ::: migration rollback scenarios #for:#db/migrations #integration
```

## Canonical Anchors in TLDR Waymarks

Canonical anchors in tldr waymarks (`##name`) create the most powerful navigation points in your codebase. They serve as both documentation and stable reference targets that remain valid even when code moves or changes.

### When to Use Canonical Anchors

**Use `##anchor` in tldr waymarks for:**

- **Entry points** - Main application startup, CLI entry, server initialization
- **Core systems** - Authentication, database access, payment processing
- **Integration points** - External API clients, webhook handlers, message queues
- **Shared utilities** - Common functions, validation logic, configuration
- **Architecture boundaries** - Service layers, data access, business logic

**Don't anchor trivial files:**

- Simple utility functions that rarely change
- One-off scripts or temporary code
- Files that are unlikely to be referenced elsewhere

### Canonical Anchor Patterns

#### Critical System Entry Points (`!!tldr`)

```javascript
// !!tldr ::: ##app/main Application entry point coordinating all services #entrypoint #orchestration
// !!tldr ::: ##server/express Express server binding routes and middleware #entrypoint #server #api
// !!tldr ::: ##cli/main CLI entry parsing commands and dispatching handlers #entrypoint #cli
```

Use `!!tldr` with anchors for the handful of files that are absolutely critical to understanding system architecture.

#### Core Component Systems (`!tldr`)

```javascript
// !tldr ::: ##auth/system Authentication system with JWT and OAuth providers #auth #core #security
// !tldr ::: ##db/connection Database connection pool and query interface #database #core #postgres
// !tldr ::: ##payments/stripe Stripe integration for subscriptions and billing #payments #core #stripe
```

Use `!tldr` with anchors for important subsystems that other parts of the code frequently interact with.

#### Shared Infrastructure (`tldr`)

```javascript
// tldr ::: ##utils/validation Input validation schemas and helpers #validation #utils #shared
// tldr ::: ##config/env Environment configuration and secrets management #config #env #shared
// tldr ::: ##middleware/auth JWT verification middleware for Express routes #auth #middleware #shared
```

Use `tldr` with anchors for shared infrastructure that many parts of the system depend on.

### Cross-Reference Benefits

Once you establish canonical anchors in tldr waymarks, they become powerful targets for cross-referencing:

```javascript
// In payment processing code:
// todo ::: implement webhook retry logic #for:#payments/stripe #reliability

// In authentication tests:  
// test ::: OAuth flow edge cases #for:#auth/system #integration #oauth

// In database migrations:
// notice ::: breaking schema change affects connections #affects:#db/connection #breaking

// In API endpoints:
// fixme ::: rate limiting not applied #needs:#middleware/auth #security #performance

// In configuration:
// important ::: secrets rotation procedure #for:#config/env #security #ops
```

### Canonical Anchor Discovery

**Find all anchored entry points:**

```bash
rg "!!tldr :::.*##"           # Critical anchored files
rg "!tldr :::.*##"            # Important anchored files  
rg "tldr :::.*##"             # All anchored files
```

**Find references to specific anchors:**

```bash
rg "#app/main"                # All references to app/main anchor
rg "#for:#auth/system"        # Work targeting auth system
rg "#affects:#db/connection"  # Changes affecting database
```

**Map system architecture:**

```bash
# Get high-level system map
rg "!!tldr :::.*##" | head -10

# Find all auth-related anchors and references
rg "##.*auth|#.*auth/\w+"

# Find integration points
rg "tldr :::.*##.*integration|#.*integration"
```

### Anchor Naming Conventions

**Hierarchical naming helps organization:**

```javascript
// !!tldr ::: ##app/server - Main application server
// tldr ::: ##app/config - Application configuration  
// tldr ::: ##app/routes - Route definitions

// !tldr ::: ##auth/system - Authentication system
// tldr ::: ##auth/middleware - Auth middleware
// tldr ::: ##auth/tokens - Token management

// !tldr ::: ##db/connection - Database connection
// tldr ::: ##db/models - Data models
// tldr ::: ##db/migrations - Schema migrations
```

**Consistent patterns make anchors predictable:**

- `##service/main` - Primary entry point for a service
- `##service/client` - Client interface for external services  
- `##service/config` - Configuration for a service
- `##utils/service` - Utilities for a specific domain

### Evolution-Proof References

Canonical anchors in tldr waymarks create references that survive refactoring:

```javascript
// Before refactoring - auth logic in single file:
// !tldr ::: ##auth/system Complete authentication with JWT and OAuth #auth #security

// After refactoring - auth split across multiple files:
// !tldr ::: ##auth/system Authentication orchestrator coordinating providers #auth #orchestration
// tldr ::: ##auth/jwt JWT token validation and signing #auth #jwt #core  
// tldr ::: ##auth/oauth OAuth provider integrations (Google, GitHub) #auth #oauth #providers
```

The `#auth/system` anchor remains stable, but now references the orchestrating component. Other waymarks using `#for:#auth/system` continue to work without updates.

### Quick Start: Adding Your First Canonical Anchors

1. **Start with entry points** - Find your main application files and add `!!tldr ::: ##app/main`
2. **Add core systems** - Authentication, database, key business logic get `!tldr ::: ##system/name`  
3. **Anchor shared utilities** - Common code that many files import gets `tldr ::: ##utils/name`
4. **Reference in related work** - Start using `#for:#anchor/name` in todos and other waymarks
5. **Expand gradually** - Add canonical anchors as you discover reference patterns in your codebase

Canonical anchors in tldr waymarks transform from simple file documentation into a navigable map of your system's architecture.

## The Golden Rules

1. **ONE per file** - At the very top (first waymark)
2. **Be SPECIFIC** - Say what the code DOES, not what it IS
3. **Include TECHNICAL DETAILS** - Main exports, patterns, dependencies
4. **Make it SEARCHABLE** - Include terms someone would grep for
5. **Use ACTIVE VOICE** - Present tense, action-oriented

## Writing Effective TLDRs

### ❌ Poor tldrs (missing critical context)

```javascript
// tldr ::: authentication module          // What KIND of auth? How does it work?
// tldr ::: handles user authentication    // WHERE? For what system? What method?
// tldr ::: utility functions             // What utilities? For what purpose?
// tldr ::: API endpoints                 // Which endpoints? What do they do?
// tldr ::: database stuff                // Which database? What operations?
```

**Problems**: Generic, no technical details, not greppable, no implementation hints.

### ✅ Excellent tldrs (complete context in one line)

```javascript
// !tldr ::: JWT auth middleware validating Bearer tokens via RS256 #auth #middleware #security
// tldr ::: React hooks for OAuth2 login with Google/GitHub providers #react #oauth #hooks  
// tldr ::: PostgreSQL user CRUD with bcrypt password hashing #database #users #postgres #security
// tldr ::: REST API endpoints for file upload with S3 integration #api #uploads #aws #s3
// tldr ::: Redis connection pool with automatic retry logic #database #redis #utils #resilience
```

**Why these work**: Specific technology, implementation details, searchable tags, clear purpose.

## TLDR Anti-Patterns

### Don't Repeat the Filename
```javascript
// ❌ In user-service.ts
// tldr ::: user service

// ✅ In user-service.ts  
// tldr ::: REST API for user CRUD operations with role-based permissions #api #users #rbac
```

### Don't Use Vague Adjectives
```javascript
// ❌ Vague and unhelpful
// tldr ::: important authentication logic
// tldr ::: complex data processing  
// tldr ::: advanced caching system

// ✅ Specific and technical
// tldr ::: JWT token validation with RS256 signature verification #auth #security #jwt
// tldr ::: ETL pipeline transforming CSV to Parquet with schema validation #data #etl #validation
// tldr ::: Redis-backed LRU cache with TTL and write-through strategy #cache #redis #performance
```

### Don't Bury the Lead
```javascript
// ❌ Important detail at the end
// tldr ::: utility functions for various operations including critical startup validation

// ✅ Lead with the most important part
// tldr ::: Critical startup validation ensuring database connectivity and env vars #startup #validation #critical
```

## TLDR Patterns by File Type

### Entry points (use `!!tldr` for canonical entries)

```javascript
// !!tldr ::: ##app/server Express server entry point binding port 3000 #entrypoint #server #express
// !!tldr ::: ##app/client React app root mounting Redux provider and router #entrypoint #react #redux
// !!tldr ::: ##cli/main CLI main entry parsing args and dispatching commands #entrypoint #cli #core
```

### Core libraries

```javascript
// !tldr ::: ##db/pool database connection pool managing Postgres with pgbouncer #database #postgres #core
// tldr ::: WebSocket client with auto-reconnect and exponential backoff #websockets #client #realtime
// tldr ::: S3 upload manager with multipart and retry logic #aws #s3 #uploads #utils
```

### Components/UI

```javascript  
// tldr ::: UserProfile component displaying avatar+bio with edit mode #react #components #users
// tldr ::: DataTable with sorting, filtering, and virtual scroll #react #components #table #performance
// tldr ::: Modal wrapper handling focus trap and ESC key #react #components #modal #a11y
```

### Configuration

```javascript
// tldr ::: webpack prod config with code splitting and terser minification #webpack #build #production
// tldr ::: ESLint rules enforcing team style guide with TypeScript #eslint #typescript #config
// tldr ::: Docker Compose for local dev with Redis+Postgres+MinIO #docker #dev #infrastructure
```

### Tests

```javascript
// tldr ::: integration tests for payment API with Stripe mock #test #integration #payments #stripe
// tldr ::: e2e tests for checkout flow using Playwright #test #e2e #checkout #playwright
// tldr ::: unit tests for auth token validation edge cases #test #unit #auth #security
```

### Utilities

```javascript
// tldr ::: date formatting with timezone support via date-fns #utils #dates #timezone
// tldr ::: retry wrapper with exponential backoff and jitter #utils #retry #resilience
// tldr ::: deep object comparison ignoring key order #utils #objects #comparison
```

## Advanced TLDR Patterns

### For AI agents - Include implementation hints

```javascript
// tldr ::: ##ratelimit/redis rate limiter using sliding window with Redis sorted sets #ratelimit #redis #performance
// tldr ::: ##events/aggregate event sourcing aggregate root with snapshot optimization #events #patterns #performance
```

### For monorepos - Include package context

```javascript
// !tldr ::: ##packages/auth @acme/auth shared auth logic for Express middleware #auth #middleware #shared
// tldr ::: ##packages/ui @acme/ui-kit React component library with Storybook #react #components #storybook
```

### For critical code - Use `!tldr` or `!!tldr`

```javascript
// !tldr ::: ##payments/processor payment processing with PCI compliance and audit logging #payments #security #compliance
// !!tldr ::: ##app/coordinator main application entry coordinating all services #entrypoint #orchestration #critical
```

## TLDR for Documentation Files

### README files

```markdown
<!-- !!tldr ::: ##waymark/spec Waymark syntax specification and tooling for AI-navigable codebases #waymark #documentation #spec -->
<!-- tldr ::: React component library setup guide with Storybook integration #react #storybook #setup #guide -->
<!-- tldr ::: Monorepo workspace configuration for pnpm with shared configs #monorepo #pnpm #workspace #config -->
```

### API Documentation

```markdown
<!-- !tldr ::: ##api/users REST API reference for user management endpoints with JWT auth #api #users #auth #documentation -->
<!-- tldr ::: GraphQL schema documentation for e-commerce platform #graphql #schema #ecommerce #documentation -->
<!-- !tldr ::: ##api/payments OpenAPI 3.0 spec for payment processing microservice #api #payments #openapi #microservice -->
```

### Guides and Tutorials

```markdown
<!-- tldr ::: Step-by-step AWS Lambda deployment guide with Terraform #aws #lambda #terraform #deployment #guide -->
<!-- tldr ::: Database migration strategy from MySQL to PostgreSQL #database #migration #mysql #postgres #guide -->
<!-- tldr ::: Performance optimization guide for React applications #react #performance #optimization #guide -->
```

### Architecture Docs

```markdown
<!-- !tldr ::: ##arch/events Event-driven architecture design using Kafka and microservices #architecture #events #kafka #microservices -->
<!-- tldr ::: ##arch/crdt System design for real-time collaborative editing with CRDTs #architecture #realtime #crdt #collaboration -->
<!-- !tldr ::: ##arch/security Security architecture for multi-tenant SaaS platform #architecture #security #multitenant #saas -->
```

## TLDR for Configuration Files

### Build configs

```javascript
// tldr ::: Vite config for React with module federation and HMR #vite #react #build #hmr
// tldr ::: Rollup config building ESM and CJS with TypeScript declarations #rollup #typescript #esm #cjs
// tldr ::: Turbo config for monorepo with remote caching enabled #turbo #monorepo #cache #build
```

### CI/CD configs

```yaml
# tldr ::: GitHub Actions workflow for PR checks with parallel jobs #github #ci #testing #parallel
# tldr ::: GitLab CI pipeline deploying to K8s with canary releases #gitlab #ci #k8s #deployment #canary
# tldr ::: CircleCI config with Docker layer caching and test splitting #circleci #docker #testing #cache
```

### Container configs

```dockerfile
# tldr ::: Multi-stage Dockerfile for Node.js app with Alpine base #docker #nodejs #alpine #multistage
# tldr ::: Docker Compose setup for local dev with hot reload #docker #compose #dev #hotreload
# tldr ::: Kubernetes deployment manifest with HPA and health checks #k8s #deployment #hpa #health
```

### Infrastructure as Code

```hcl
// tldr ::: Terraform module for AWS ECS Fargate with ALB and auto-scaling #terraform #aws #ecs #fargate
// tldr ::: Pulumi stack deploying serverless API with DynamoDB #pulumi #serverless #api #dynamodb
// tldr ::: CDK app creating S3 + CloudFront static site hosting #cdk #aws #s3 #cloudfront
```

## TLDR for Data Files

### Schema definitions

```sql
-- !tldr ::: ##db/schema PostgreSQL schema for multi-tenant e-commerce with RLS #database #postgres #multitenant #rls
-- tldr ::: Prisma schema defining user auth models with relations #prisma #auth #models #database
-- tldr ::: MongoDB schema validation rules for payment documents #mongodb #validation #payments #schema
```

### Migration files

```sql
-- tldr ::: Migration adding composite indexes for query performance #migration #indexes #performance #database
-- tldr ::: Migration converting status enum to state machine table #migration #enum #state-machine #database
-- tldr ::: Rollback script for failed user permissions migration #migration #rollback #permissions #database
```

### Seed data

```javascript
// tldr ::: Development seed data with 100 users and sample orders #seed #dev #users #orders
// tldr ::: Test fixtures for integration tests with edge cases #test #fixtures #integration #edge-cases
// tldr ::: Production data anonymization script for dev environments #data #anonymization #production #privacy
```

## TLDR for Scripts and Automation

### Build scripts

```bash
# tldr ::: Release script handling versioning, changelog, and npm publish #release #versioning #npm #automation
# tldr ::: Database backup script with S3 upload and retention policy #backup #database #s3 #retention #automation
# tldr ::: Dependency update script with automated PR creation #dependencies #updates #automation #github
```

### Dev tools

```python
# tldr ::: Code generator for CRUD endpoints from OpenAPI spec #codegen #crud #openapi #automation
# tldr ::: Git hooks setup script enforcing commit conventions #git #hooks #commit #conventions #setup
# tldr ::: Local environment setup automating all dependencies #setup #dev #environment #dependencies #automation
```

### Data processing

```python
# tldr ::: ETL pipeline extracting Stripe data to BigQuery #etl #stripe #bigquery #data #analytics
# tldr ::: Log parser aggregating errors by service and severity #logs #parsing #errors #monitoring #aggregation
# tldr ::: CSV processor validating and importing customer data #csv #validation #import #customers #data
```

## TLDR for Special Files

### Package files

```json
// !!tldr ::: ##workspace/root Monorepo root with workspaces for api, web, and shared packages #monorepo #workspace #pnpm
// tldr ::: Library package exporting React hooks for real-time data #react #hooks #realtime #library
// tldr ::: CLI tool package for database migrations and seeding #cli #database #migrations #tools
```

### Lock files (yes, even these benefit from context)

```yaml
# tldr ::: pnpm lock with 2453 deps, last updated for React 18 upgrade #lockfile #pnpm #react18 #dependencies
# tldr ::: yarn.lock frozen for production deploy on Node 20.11.0 #lockfile #yarn #production #node20
```

### Environment examples

```bash
# tldr ::: Environment template for local dev with required services #env #template #dev #local
# tldr ::: Production env config for AWS deployment with secrets #env #production #aws #secrets
```

### Git files

```gitignore
# tldr ::: Gitignore for Node.js monorepo with build artifacts excluded #gitignore #nodejs #monorepo #build
# tldr ::: Git attributes enforcing LF endings and marking generated files #gitattributes #lf #generated #git
```

## Quick Reference

### Basic Search Patterns

- **Search all tldrs**: `rg "tldr :::"`
- **Find critical entries**: `rg "!!tldr :::"` → Most important parts of codebase
- **Find important summaries**: `rg "!tldr :::"` → Core components and subsystems

### Tag-Based Searches

- **Find by domain**: `rg "tldr :::.*#auth"` → Authentication-related files
- **Find by technology**: `rg "tldr :::.*#react"` → React components/apps
- **Find by purpose**: `rg "tldr :::.*#(api|database|config)"` → APIs, databases, configs
- **Find by status**: `rg "tldr :::.*#(experimental|legacy|deprecated)"` → Code status

### Anchor Searches

- **Find anchor definitions**: `rg "tldr :::.*##"` → Stable reference points
- **Find specific anchor**: `rg "##app/server"` → Specific anchor and references

### Combined Searches

- **Critical auth code**: `rg "!!tldr :::.*#auth"`
- **All entry points**: `rg "tldr :::.*#entrypoint"`  
- **Performance hotspots**: `rg "tldr :::.*#(performance|hotpath)"`

## Keeping TLDRs Current

### When to Update TLDRs
- **Technology changes**: Framework upgrades, library swaps
- **Architecture changes**: New patterns, refactored responsibilities  
- **Purpose changes**: File takes on new or different responsibilities
- **Criticality changes**: Code becomes more/less important to system

### Signs Your TLDR Needs Work
```bash
# Find potentially stale TLDRs
rg "tldr :::.*#legacy"        # Legacy code might need updated context
rg "tldr :::.*#deprecated"    # Deprecated code needs status update
rg "tldr :::.*#temp"          # Temporary code that's become permanent
```

### TLDR Review Process
1. **During code reviews**: Check if TLDR still matches implementation
2. **During refactoring**: Update TLDR before changing code structure
3. **Quarterly audits**: Search for generic TLDRs and improve them
