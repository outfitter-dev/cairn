<!-- tldr ::: proposal for extended tag vocabulary in waymark 1.0 spec -->

# Waymark 1.0 Extended Tag Vocabulary

## Overview

This proposal extends the Waymark 1.0 tag vocabulary with essential patterns for modern development workflows, while maintaining the core principles of simplicity and greppability established in the base specification.

## Core Principles

1. **Build on v1.0 foundation** - Extends existing patterns without breaking them
2. **Maintain greppability** - All new tags follow `#tag` and `#category:value` patterns
3. **Cover real development needs** - Focus on patterns that improve codebase navigation
4. **Support aliasing** - Long-form tags with short-form aliases for common use

## New Simple Tags (Technology/Platform)

### Runtime/Platform Tags
```javascript
#browser          // Browser-specific code
#nodejs           // Node.js specific code  
#deno             // Deno runtime
#bun              // Bun runtime
#electron         // Electron app code
#react-native     // React Native mobile code
#cordova          // Cordova/PhoneGap mobile
#chrome-ext       // Chrome extension code
#firefox-ext      // Firefox extension code
```

### Build/Development Lifecycle
```javascript
#build            // Build scripts and config
#dev              // Development-only code
#test             // Test-related (distinct from test marker)
#prod             // Production-specific
#staging          // Staging environment
#ci               // CI/CD related
#deployment       // Deployment scripts
#migration        // Database/data migrations
#seed             // Seed data
#fixture          // Test fixtures
```

### Common Technology Tags
```javascript
#typescript       // TypeScript specific
#javascript       // JavaScript specific
#python           // Python code
#rust             // Rust code
#go               // Go code
#docker           // Docker related
#kubernetes       // K8s related
#terraform        // Infrastructure as code
#ansible          // Configuration management
```

## Extended Attribute Categories

### Performance (`#perf:`) - Additional Values
```javascript
#perf:memory-intensive    // High memory usage
#perf:cpu-intensive      // Heavy computation
#perf:io-intensive       // Heavy I/O operations
#perf:network-intensive  // Heavy network usage
#perf:cache-miss         // Known cache performance issue
#perf:lazy-loaded        // Lazy loading for performance
```

### Timing/Lifecycle (`#timing:`) - New Category
```javascript
#timing:startup          // Runs at application startup
#timing:shutdown         // Runs at shutdown
#timing:init             // Initialization code
#timing:cleanup          // Cleanup operations
#timing:scheduled        // Scheduled/cron jobs
#timing:periodic         // Runs periodically
#timing:event-driven     // Event-triggered code
#timing:on-demand        // Runs on user request
```

**Standalone shortcuts**: `#startup`, `#init`, `#scheduled`, `#cron`

### Integration (`#integration:`) - New Category
```javascript
#integration:webhook     // Webhook handlers
#integration:api-client  // External API clients
#integration:queue       // Message queue integration
#integration:pubsub      // Pub/sub messaging
#integration:rpc         // RPC calls
#integration:graphql     // GraphQL integration
#integration:rest        // REST API integration
#integration:socket      // WebSocket integration
```

## Extended Relational Tags

### External Dependencies
```javascript
#external:stripe-api     // External service dependency
#external:aws-s3         // AWS service dependency
#external:redis          // External Redis dependency
#external:postgres       // External database dependency
#external:github-api     // GitHub API dependency
#external:slack-api      // Slack API dependency
```

### Requirements
```javascript
#requires:auth           // Requires authentication
#requires:permission     // Requires specific permission
#requires:network        // Requires network access
#requires:filesystem     // Requires file system access
#requires:database       // Requires database connection
#requires:env-var        // Requires environment variable
#requires:secret         // Requires secret/credential
#requires:feature-flag   // Requires feature flag
```

## Example Usage

### Technology and Platform
```javascript
// tldr ::: Express middleware for JWT auth #nodejs #express #middleware #auth
// tldr ::: React component with TypeScript props #browser #typescript #react #components
// tldr ::: Python data processing script #python #data #batch #migration
```

### Timing and Lifecycle  
```javascript
// tldr ::: Database connection pool setup #startup #database #postgres
// todo ::: implement graceful shutdown #timing:shutdown #cleanup
// tldr ::: Scheduled report generator #timing:scheduled #reports #cron
```

### Performance Characteristics
```javascript
// todo ::: optimize image processing #perf:memory-intensive #perf:cpu-intensive
// important ::: cache implementation uses significant memory #perf:memory-intensive #cache
// tldr ::: Lazy-loaded chart component #perf:lazy-loaded #react #charts
```

### Integration Points
```javascript
// tldr ::: Stripe webhook handler #integration:webhook #payments #external:stripe-api
// tldr ::: GitHub API client for repository sync #integration:api-client #external:github-api
// tldr ::: Redis pub/sub event dispatcher #integration:pubsub #external:redis #events
```

### External Dependencies with Requirements
```javascript
// important ::: payment processor #requires:secret #external:stripe-api #security
// tldr ::: OAuth login handler #requires:auth #external:google-api #browser
// tldr ::: File upload service #requires:filesystem #requires:env-var #uploads
```

### Build and Deployment
```javascript
// tldr ::: Docker build configuration #docker #build #ci
// tldr ::: Kubernetes deployment manifest #kubernetes #deployment #prod
// tldr ::: Terraform AWS infrastructure #terraform #infrastructure #deployment
```

### Runtime-Specific Utilities
```javascript
// tldr ::: LocalStorage wrapper utilities #browser #storage #utils
// tldr ::: File system helper functions #nodejs #filesystem #utils
// tldr ::: Chrome extension content script #chrome-ext #browser #dom
```

## Search Patterns

### Technology-Based Searches
```bash
# Find all Node.js code
rg "#nodejs"

# Find all TypeScript files
rg "#typescript"

# Find browser-specific code
rg "#browser"

# Find CI/build related code
rg "#(ci|build|deployment)"
```

### Lifecycle and Timing
```bash
# Find startup code
rg "#(timing:)?startup"

# Find scheduled jobs
rg "#(timing:)?scheduled"

# Find cleanup code
rg "#(timing:)?cleanup"
```

### Performance and Resources
```bash
# Find performance-intensive code
rg "#perf:(memory|cpu|io)-intensive"

# Find all performance-related code
rg "#perf:"

# Find lazy-loaded components
rg "#perf:lazy-loaded"
```

### External Dependencies
```bash
# Find all external integrations
rg "#external:"

# Find specific service dependencies
rg "#external:stripe-api"

# Find all webhook handlers
rg "#integration:webhook"

# Find code requiring secrets
rg "#requires:secret"
```

### Combined Searches
```bash
# Find Node.js code that requires database
rg "#nodejs.*#requires:database"

# Find TypeScript React components
rg "#typescript.*#react.*#components"

# Find production deployment code
rg "#deployment.*#prod"
```

## Aliasing Strategy (Future)

The extended vocabulary is designed with aliasing in mind. Common short forms could include:

- `#ext:` → `#external:`
- `#req:` → `#requires:`
- `#int:` → `#integration:`
- `#ts` → `#typescript`
- `#js` → `#javascript`
- `#py` → `#python`

## Benefits

1. **Comprehensive Coverage** - Handles modern development workflows
2. **Maintains Simplicity** - Uses existing v1.0 patterns
3. **Highly Searchable** - All patterns optimized for grep/ripgrep
4. **Technology Agnostic** - Covers multiple languages and platforms
5. **Scalable** - Can be extended with additional categories as needed

## Migration Impact

This proposal is **additive only** - it doesn't change existing v1.0 patterns, just adds new vocabulary options. Teams can adopt these tags gradually based on their needs.

## Conclusion

This extended vocabulary transforms waymarks into a powerful navigation system for modern codebases while maintaining the core v1.0 principles of simplicity and greppability. The additions cover the most common patterns in contemporary development workflows.