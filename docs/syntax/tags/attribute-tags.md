<!-- tldr ::: attribute tags for describing code characteristics -->

# Attribute Tags

Attribute tags describe the intrinsic characteristics of code - what it is, how it behaves, and what properties it has. Unlike relational tags that express connections, attribute tags answer "what kind of code is this?"

## Dual Form Syntax

Attribute tags support two forms for flexibility:

```javascript
// Standalone form (quick marking)
// todo ::: optimize parser #hotpath

// Category form (precise classification)
// todo ::: optimize parser #perf:hotpath
```

Both forms are searchable with patterns like `rg "#(perf:)?hotpath"`

## Attribute Categories

### Performance (`#perf:`)

Identify performance-critical code paths:

```javascript
// Hotspots and critical paths
// todo ::: optimize JSON parser #perf:hotpath
// note ::: main render loop #perf:critical-path
// fixme ::: N+1 query #perf:bottleneck

// Optimization status
// note ::: hand-optimized assembly #perf:optimized
// todo ::: needs caching #perf:slow
// important ::: do not modify #perf:tuned

// Standalone forms
// todo ::: speed up algorithm #hotpath
// note ::: performance critical #critical-path
```

**Common attributes:**
- `hotpath` - Frequently executed code
- `critical-path` - Performance-critical execution path
- `bottleneck` - Known performance limitation
- `optimized` - Already optimized, handle with care
- `slow` - Known to be slow
- `cpu-bound` - CPU intensive
- `io-bound` - I/O intensive
- `memory-intensive` - High memory usage

### Architecture (`#arch:`)

Mark architectural boundaries and patterns:

```javascript
// System boundaries
// about ::: ##app/init Application entrypoint #arch:entrypoint
// note ::: service boundary #arch:boundary
// important ::: global state manager #arch:singleton

// Design patterns
// note ::: repository pattern #arch:repository
// about ::: event emitter #arch:observer
// todo ::: convert to factory #arch:factory

// Standalone forms
// about ::: main entry #entrypoint
// note ::: API boundary #boundary
```

**Common attributes:**
- `entrypoint` - System or module entry point
- `boundary` - API or service boundary
- `singleton` - Single instance
- `state` - State management
- `repository` - Data access pattern
- `factory` - Object creation pattern
- `observer` - Event/observer pattern
- `middleware` - Request/response pipeline

### Security (`#sec:`)

Mark security-sensitive code:

```javascript
// Input validation
// important ::: validate all inputs #sec:boundary
// todo ::: add sanitization #sec:input
// fixme ::: SQL injection risk #sec:sanitize

// Authentication & authorization
// about ::: ##auth/check Permission check #sec:auth
// note ::: role validation #sec:authz
// important ::: JWT verification #sec:crypto

// Standalone forms
// important ::: security check #boundary
// todo ::: sanitize input #input
```

**Common attributes:**
- `boundary` - Security boundary
- `input` - User input handling
- `sanitize` - Data sanitization needed
- `auth` - Authentication logic
- `authz` - Authorization logic
- `crypto` - Cryptographic operations
- `sensitive` - Handles sensitive data
- `audit` - Requires audit trail

### Code Behavior (`#code:`)

Describe how code behaves:

```javascript
// Function characteristics
// note ::: pure function #code:pure
// important ::: modifies global state #code:sideeffect
// todo ::: make async #code:async

// Control flow
// note ::: recursive algorithm #code:recursive
// fixme ::: callback hell #code:callback
// wip ::: generator function #code:generator

// Standalone forms
// note ::: no side effects #pure
// important ::: async operation #async
```

**Common attributes:**
- `pure` - No side effects
- `sideeffect` - Has side effects
- `async` - Asynchronous operation
- `sync` - Synchronous operation
- `callback` - Uses callbacks
- `promise` - Returns promise
- `generator` - Generator function
- `recursive` - Uses recursion
- `iterative` - Uses iteration
- `stateful` - Maintains state
- `stateless` - No internal state

### Data Flow (`#data:`)

Track data movement and transformation:

```javascript
// Data sources and sinks
// note ::: database connection #data:source
// todo ::: add transformation #data:transform
// important ::: writes to disk #data:sink

// Data characteristics
// important ::: PII handling #data:sensitive
// note ::: caches results #data:cache
// todo ::: add validation #data:validate

// Standalone forms
// note ::: data source #source
// important ::: transforms data #transform
```

**Common attributes:**
- `source` - Data origin
- `transform` - Data transformation
- `sink` - Data destination
- `sensitive` - Sensitive data
- `cache` - Caching logic
- `validate` - Data validation
- `serialize` - Serialization
- `deserialize` - Deserialization

### API (`#api:`)

Mark API-related code:

```javascript
// API types
// about ::: REST endpoint #api:endpoint
// note ::: internal use only #api:internal
// deprecated ::: use v2 instead #api:deprecated

// API characteristics
// note ::: GraphQL resolver #api:graphql
// important ::: webhook handler #api:webhook
// todo ::: add rate limiting #api:ratelimit

// Standalone forms
// about ::: public API #endpoint
// note ::: internal only #internal
```

**Common attributes:**
- `endpoint` - API endpoint
- `internal` - Internal API
- `external` - External API
- `public` - Public API
- `private` - Private API
- `deprecated` - Deprecated API
- `graphql` - GraphQL API
- `rest` - REST API
- `webhook` - Webhook handler
- `ratelimit` - Rate limited

### Status (`#status:`)

Track code maturity and state:

```javascript
// Development status
// wip ::: new algorithm #status:experimental
// note ::: battle-tested code #status:stable
// todo ::: remove old code #status:legacy

// Migration status
// todo ::: update to new API #status:migration
// deprecated ::: old implementation #status:obsolete
// note ::: temporary workaround #status:temporary

// Standalone forms
// wip ::: experimental feature #experimental
// note ::: production ready #stable
```

**Common attributes:**
- `experimental` - Experimental code
- `stable` - Stable, production-ready
- `legacy` - Old but still in use
- `migration` - Being migrated
- `obsolete` - No longer used
- `temporary` - Temporary solution
- `preview` - Preview/beta feature
- `alpha` - Alpha quality
- `beta` - Beta quality

### Error Handling (`#error:`)

Mark error handling code:

```javascript
// Error boundaries
// note ::: catches all errors #error:handler
// important ::: error boundary #error:boundary
// todo ::: add retry logic #error:recovery

// Error types
// fixme ::: swallows errors #error:silent
// note ::: propagates errors #error:propagate
// todo ::: better error messages #error:message

// Standalone forms
// note ::: error handler #handler
// important ::: recovery logic #recovery
```

**Common attributes:**
- `handler` - Error handler
- `boundary` - Error boundary
- `recovery` - Error recovery
- `retry` - Retry logic
- `fallback` - Fallback behavior
- `silent` - Silent failure
- `propagate` - Error propagation
- `message` - Error messaging

## Search Patterns

### Finding Attributes

```bash
# Find all hotpaths (both forms)
rg "#(perf:)?hotpath"

# Find all boundaries (security, arch, error)
rg "#(sec:|arch:|error:)?boundary"

# Find by category
rg "#perf:"          # All performance attributes
rg "#sec:"           # All security attributes
rg "#arch:"          # All architecture attributes

# Find specific patterns
rg "#api:endpoint"   # All API endpoints
rg "#data:sensitive" # Sensitive data handling
rg "#code:async"     # Async operations
```

### Combined Searches

```bash
# Security-critical performance code
rg ":::.*#sec:.*#perf:"

# Experimental async code
rg ":::.*#status:experimental.*#async"

# Deprecated APIs
rg "#api:.*deprecated|#deprecated.*#api:"

# Error handlers in critical paths
rg ":::.*#error:handler.*#critical-path"
```

## Common Patterns

### Performance Optimization

```javascript
// Before optimization
// todo ::: improve performance #slow #perf:bottleneck

// During optimization
// wip ::: optimizing algorithm #perf:hotpath #status:experimental

// After optimization
// note ::: optimized in PR #234 #perf:optimized #perf:cpu-bound
// important ::: do not modify without benchmarking #perf:tuned
```

### Security Boundaries

```javascript
// Input validation
// important ::: user input validation #sec:boundary #sec:input
// todo ::: add rate limiting #api:endpoint #sec:ratelimit

// Authentication flow
// about ::: ##auth/verify Token verification #sec:auth #sec:crypto
// note ::: checks user permissions #sec:authz #code:async
```

### API Evolution

```javascript
// Current API
// about ::: user endpoint #api:endpoint #api:public #status:stable

// Deprecation notice
// deprecated ::: use /v2/users instead #api:deprecated #status:obsolete

// New version
// about ::: user endpoint v2 #api:endpoint #api:public #status:beta
```

### Error Handling Patterns

```javascript
// Comprehensive error handling
// note ::: main error handler #error:handler #error:recovery
// todo ::: add retry logic #error:retry #perf:slow

// Error boundaries
// important ::: React error boundary #error:boundary #arch:boundary
// note ::: catches async errors #error:handler #code:async
```

## Best Practices

### 1. Use Standalone for Common Cases

For frequently used attributes, prefer standalone:

```javascript
// ✓ Good: Common attributes as standalone
// todo ::: optimize loop #hotpath
// note ::: API boundary #boundary

// Consider category form for precision
// note ::: security check #sec:boundary  // Specifically security
```

### 2. Category Form for Clarity

Use category form when precision matters:

```javascript
// ✓ Clear classification
// note ::: error handling #error:boundary     // Error boundary
// note ::: service interface #arch:boundary   // Architecture boundary
// note ::: security perimeter #sec:boundary   // Security boundary

// ✗ Ambiguous
// note ::: boundary check #boundary  // What kind of boundary?
```

### 3. Combine Related Attributes

Group related attributes logically:

```javascript
// ✓ Good: Related attributes together
// important ::: auth check #sec:auth #sec:boundary #code:async
// todo ::: optimize parser #perf:hotpath #perf:cpu-bound #data:transform

// ✗ Poor: Unrelated mix
// note ::: some code #hotpath #deprecated #auth  // Confusing combination
```

### 4. Search-Friendly Patterns

Design for searchability:

```javascript
// Use consistent patterns
// note ::: critical path #perf:critical-path
// note ::: hot path #perf:hotpath

// Not
// note ::: critical path #critical
// note ::: hot path #hot-path  // Inconsistent
```

## Migration Guide

From old patterns to v1.0:

```javascript
// Old: Mixed properties
// todo ::: optimize function performance:critical type:cpu-bound

// New: Attribute tags
// todo ::: optimize function #perf:critical-path #perf:cpu-bound

// Old: Verbose properties
// note ::: security boundary requires:auth validates:input

// New: Clear attributes
// note ::: security boundary #sec:boundary #sec:auth #sec:input
```

## Summary

Attribute tags provide a rich vocabulary for describing code characteristics:
- **Dual forms** for flexibility (standalone and category)
- **Eight categories** covering all aspects of code
- **Searchable patterns** for powerful queries
- **Clear semantics** for consistent usage

Use them to build a self-documenting codebase where code characteristics are immediately discoverable through simple searches.