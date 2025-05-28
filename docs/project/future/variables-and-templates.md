# Variables, Templates, and Alias System

<!-- :A: tldr future variables, templates, and alias system for advanced magic anchor features -->
<!-- :A: meta speculative feature design covering interpolation, aliases, and variable systems -->

> **Future Feature**: This document outlines speculative variable, template, and alias systems that may be implemented in future versions of grepa. These features are not part of the current specification and represent advanced capabilities for complex workflows.

## Overview

<!-- :A: concept comprehensive system for dynamic anchor generation and reuse -->
### Variables, Templates, and Aliases

A comprehensive system providing three complementary features:

1. **Variable System** - Define reusable values and references across anchors
2. **Template System** - Create parameterized anchor patterns for common workflows  
3. **Alias System** - Define shorthand notation for frequently used marker combinations

These systems work together to reduce repetition, ensure consistency, and support complex organizational workflows while maintaining the core grep-ability of Magic Anchors.

## Variable System

<!-- :A: spec variable definition and resolution for consistent values -->
### Variable Definition and Usage

**Purpose**: Define reusable values that can be referenced across multiple anchors for consistency and maintainability.

**Configuration in grepaconfig.yaml:**

```yaml
variables:
  # Team and ownership variables
  frontend-team: "@alice,@bob,@charlie"
  backend-team: "@david,@eve,@frank"
  security-lead: "@mallory"
  
  # Project and milestone variables
  current-sprint: "sprint-24"
  next-release: "v2.1.0"
  auth-epic: "epic-auth-redesign"
  
  # Service and infrastructure variables
  auth-service: "auth.api.company.com"
  user-db: "postgres.users.prod"
  cache-layer: "redis.sessions.prod"
  
  # Common paths and endpoints
  api-base: "/api/v2"
  docs-base: "https://docs.company.com"
  
  # Priority and workflow variables
  critical-priority: "priority:critical,severity:high"
  review-process: "review,owner:@security-lead,type:security"
```

**Usage in Anchors:**

```javascript
// Variable references with ${var} syntax
// :A: todo(assign:${frontend-team}) implement user dashboard
// :A: depends(service:${auth-service},db:${user-db}) user authentication
// :A: ${review-process} validate input sanitization
// :A: todo(milestone:${next-release},epic:${auth-epic}) OAuth integration

// Variable expansion at parse time:
// :A: todo(assign:@alice,@bob,@charlie) implement user dashboard
// :A: depends(service:auth.api.company.com,db:postgres.users.prod) user authentication
// :A: review,owner:@mallory,type:security validate input sanitization
// :A: todo(milestone:v2.1.0,epic:epic-auth-redesign) OAuth integration
```

**Array Variable Support:**

```yaml
variables:
  mobile-platforms: ["ios", "android", "react-native"]
  test-environments: ["staging", "integration", "e2e"]
  
  # Nested variable references
  full-stack-team: "${frontend-team},${backend-team}"
```

```javascript
// :A: todo(platform:${mobile-platforms}) implement push notifications
// :A: test(env:${test-environments}) validate payment flow
// :A: review(assign:${full-stack-team}) architecture changes

// Expands to:
// :A: todo(platform:[ios,android,react-native]) implement push notifications
// :A: test(env:[staging,integration,e2e]) validate payment flow
// :A: review(assign:@alice,@bob,@charlie,@david,@eve,@frank) architecture changes
```

### Variable Scope and Context

**Global Variables**: Defined in root `grepaconfig.yaml`, available everywhere

**Local Variables**: Defined in directory-specific config files, override globals

**Context Variables**: Auto-generated based on file location and git context

```yaml
# Auto-generated context variables
context-variables:
  current-file: "src/auth/login.js"
  current-directory: "src/auth"
  current-branch: "feat/oauth-integration"
  last-modified-by: "@alice"
  file-owner: "@backend-team"  # from CODEOWNERS
```

```javascript
// Context variable usage
// :A: todo(file:${current-file},owner:${file-owner}) add input validation
// :A: context(branch:${current-branch}) temporary OAuth implementation
```

## Template System

<!-- :A: spec parameterized anchor patterns for workflow standardization -->
### Template Definition and Usage

**Purpose**: Create reusable anchor patterns with parameters for common organizational workflows.

**Template Configuration:**

```yaml
templates:
  # Simple positional parameters
  jira: "issue(jira:$1)"
  github: "issue(github:$1,repo:$2)"
  
  # Named parameters with defaults
  assigned-task: |
    todo(assign:$owner,priority:$priority ?? medium,epic:$epic ?? none)
  
  security-review: |
    security,review(assign:${security-lead},severity:$severity ?? high,due:$due)
  
  # Complex templates with multiple markers
  feature-epic: |
    todo(epic:$epic,milestone:$milestone),
    context(complexity:$complexity ?? medium),
    depends(services:$services)
  
  # Templates with conditional logic
  production-deploy: |
    deploy(env:prod,approve:${backend-team}),
    ${if:$hotfix}critical,warn${endif},
    depends(services:$services ?? [])
```

**Template Usage:**

```javascript
// Simple positional parameters
// :A: @jira(PROJ-123) → :A: issue(jira:PROJ-123)
// :A: @github(456,frontend) → :A: issue(github:456,repo:frontend)

// Named parameters with defaults
// :A: @assigned-task(owner:@alice,epic:auth-redesign)
// → :A: todo(assign:@alice,priority:medium,epic:auth-redesign)

// :A: @assigned-task(owner:@bob,priority:critical,epic:user-profiles)
// → :A: todo(assign:@bob,priority:critical,epic:user-profiles)

// Complex template expansion
// :A: @feature-epic(epic:oauth,milestone:v2.1,services:[auth,user])
// → :A: todo(epic:oauth,milestone:v2.1),context(complexity:medium),depends(services:[auth,user])

// Conditional template
// :A: @production-deploy(hotfix:true,services:[auth,payment])
// → :A: deploy(env:prod,approve:@david,@eve,@frank),critical,warn,depends(services:[auth,payment])
```

### Advanced Template Features

**Array Parameter Expansion:**

```yaml
templates:
  multi-service: "depends(services:$services[*]),test(env:$environments[*])"
  team-review: "review(assign:$reviewers[*],type:$type ?? code)"
```

**Conditional Logic:**

```yaml
templates:
  conditional-security: |
    ${if:$sensitive}security,critical${endif}
    review(assign:$reviewer,type:${if:$sensitive}security${else}standard${endif})
  
  environment-deploy: |
    deploy(env:$env),
    ${if:$env=prod}warn,critical,approve:${security-lead}${endif}
```

**Template Composition:**

```yaml
templates:
  base-task: "todo(assign:$owner,priority:$priority ?? medium)"
  epic-task: "@base-task(owner:$owner,priority:$priority),epic:$epic,milestone:$milestone"
  
  security-task: |
    @epic-task(owner:${security-lead},priority:critical,epic:$epic,milestone:$milestone),
    security,review(type:security)
```

## Alias System

<!-- :A: spec shorthand notation for frequently used marker combinations -->
### Alias Definition and Usage

**Purpose**: Define shorthand notation for frequently used marker combinations, reducing typing and ensuring consistency.

**Alias Configuration:**

```yaml
aliases:
  # Simple marker aliases
  p0: "priority:critical"
  p1: "priority:high"
  p2: "priority:medium"
  p3: "priority:low"
  
  # Team assignment aliases
  fe: "assign:${frontend-team}"
  be: "assign:${backend-team}"
  sec: "assign:${security-lead}"
  
  # Common marker combinations
  urgent: "priority:critical,severity:high"
  blocked-high: "priority:high,status:blocked"
  security-critical: "security,priority:critical,severity:high"
  
  # Workflow state aliases
  wip: "status:in-progress,type:development"
  review-ready: "status:ready,type:review"
  prod-ready: "status:ready,env:production"
  
  # Complex workflow aliases
  hotfix: "priority:critical,type:hotfix,env:production,alert:on"
  experiment: "type:experiment,status:draft,warn"
```

**Alias Usage:**

```javascript
// Simple aliases
// :A: todo,p1 implement user authentication
// → :A: todo,priority:high implement user authentication

// Team assignment aliases
// :A: todo,fe update component styles
// → :A: todo,assign:@alice,@bob,@charlie update component styles

// Complex combination aliases
// :A: todo,security-critical validate all user inputs
// → :A: todo,security,priority:critical,severity:high validate all user inputs

// Workflow state aliases
// :A: todo,wip,fe implement OAuth flow
// → :A: todo,status:in-progress,type:development,assign:@alice,@bob,@charlie implement OAuth flow

// Multiple aliases in one anchor
// :A: todo,hotfix,sec fix authentication bypass
// → :A: todo,priority:critical,type:hotfix,env:production,alert:on,assign:@mallory fix authentication bypass
```

### Alias Precedence and Conflicts

**Resolution Order:**

1. **Direct parameters** (highest precedence)
2. **Alias expansions**
3. **Template defaults**
4. **Variable defaults** (lowest precedence)

**Conflict Resolution:**

```javascript
// Example with conflicts
// Alias: urgent: "priority:critical,severity:high"
// Direct: priority:medium

// :A: todo,urgent,priority:medium fix bug
// → :A: todo,priority:medium,severity:high fix bug
// (direct priority:medium overrides alias priority:critical)
```

**Alias Composition:**

```yaml
aliases:
  base-security: "security,review"
  critical-security: "@base-security,priority:critical,severity:high"
  prod-security: "@critical-security,env:production,alert:on"
```

## Configuration Integration

<!-- :A: spec unified configuration system supporting all three features -->
### Complete grepaconfig.yaml Example

```yaml
# Variables, Templates, and Aliases Configuration
grepa:
  version: "2.0"
  anchor: ":A:"

# Variable definitions
variables:
  # Team definitions
  frontend-team: "@alice,@bob,@charlie"
  backend-team: "@david,@eve,@frank"
  security-lead: "@mallory"
  devops-team: "@oscar,@peggy"
  
  # Project context
  current-sprint: "sprint-24"
  next-release: "v2.1.0"
  auth-epic: "epic-auth-redesign"
  mobile-epic: "epic-mobile-app"
  
  # Infrastructure
  auth-service: "auth.api.company.com"
  user-db: "postgres.users.prod"
  api-gateway: "gateway.api.company.com"
  
  # Common URLs
  docs-base: "https://docs.company.com"
  jira-base: "https://company.atlassian.net"

# Template definitions
templates:
  # Issue tracking templates
  jira-task: "todo(issue:${jira-base}/browse/$ticket,epic:$epic)"
  feature-request: |
    todo(epic:$epic,milestone:$milestone,complexity:$complexity ?? medium),
    context(business-value:$value ?? medium)
  
  # Security templates
  security-review: |
    security,review(assign:${security-lead},severity:$severity ?? high),
    ${if:$urgent}critical,priority:critical${else}priority:high${endif}
  
  # Deployment templates
  deploy-check: |
    deploy(env:$env,services:$services),
    ${if:$env=production}critical,approve:${devops-team}${endif},
    depends(services:$dependencies ?? [])

# Alias definitions
aliases:
  # Priority shortcuts
  p0: "priority:critical"
  p1: "priority:high"
  p2: "priority:medium"
  p3: "priority:low"
  
  # Team shortcuts
  fe: "assign:${frontend-team}"
  be: "assign:${backend-team}"
  sec: "assign:${security-lead}"
  ops: "assign:${devops-team}"
  
  # Common combinations
  urgent: "priority:critical,severity:high"
  security-critical: "security,priority:critical,severity:high"
  hotfix: "type:hotfix,priority:critical,env:production"
  
  # Workflow states
  blocked-external: "status:blocked,type:external-dependency"
  review-ready: "status:ready,type:review"
  prod-ready: "status:ready,env:production,type:deployment"

# Priority schemes (from main spec)
priorities:
  scheme: "numeric"
  numeric:
    p0: "critical"
    p1: "high"
    p2: "medium"
    p3: "low"
```

### Usage Examples with Full System

```javascript
// Variable + Template + Alias combinations

// :A: @jira-task(ticket:PROJ-123,epic:${auth-epic}),fe
// → :A: todo(issue:https://company.atlassian.net/browse/PROJ-123,epic:epic-auth-redesign),assign:@alice,@bob,@charlie

// :A: @security-review(urgent:true),ops
// → :A: security,review(assign:@mallory,severity:high),critical,priority:critical,assign:@oscar,@peggy

// :A: @deploy-check(env:production,services:[auth,user],dependencies:[${auth-service}]),hotfix
// → :A: deploy(env:production,services:[auth,user]),critical,approve:@oscar,@peggy,depends(services:[auth.api.company.com]),type:hotfix,priority:critical,env:production

// :A: todo,p1,fe implement OAuth for ${mobile-epic}
// → :A: todo,priority:high,assign:@alice,@bob,@charlie implement OAuth for epic-mobile-app
```

## Implementation Considerations

<!-- :A: todo future implementation requirements and technical challenges -->
### Technical Requirements

**Variable System:**
- Variable definition parsing and validation
- Variable interpolation engine with `${var}` syntax
- Scope resolution (global → local → context)
- Circular reference detection
- Type checking for array vs scalar variables
- Context variable auto-generation from git/file metadata

**Template System:**
- Template definition parsing with multi-line support
- Parameter extraction and validation (positional vs named)
- Default value resolution with `?? default` syntax
- Conditional logic parsing with `${if:condition}...${endif}`
- Template composition and inheritance
- Array parameter expansion with `[*]` syntax
- Template conflict detection and resolution

**Alias System:**
- Alias definition parsing and circular dependency detection
- Alias expansion engine with precedence rules
- Conflict resolution between aliases and direct parameters
- Alias composition with `@alias` references
- Performance optimization for complex alias chains

**Integration Challenges:**
- Unified configuration validation across all three systems
- Performance impact of complex expansion operations
- Error reporting with clear source attribution
- IDE integration for auto-completion and validation
- Backwards compatibility with simple Magic Anchor syntax
- Tool integration for search patterns across expanded anchors

**Search and Discovery:**
- Search patterns must work with both expanded and unexpanded forms
- Index generation for template and alias usage
- Reverse lookup from expanded anchors to original templates/aliases
- Performance optimization for large codebases with complex configurations

### Migration Strategy

**Phase 1: Variable System** - Basic `${var}` interpolation
**Phase 2: Alias System** - Simple marker combination shortcuts
**Phase 3: Template System** - Full parameterized templates with conditionals
**Phase 4: Integration** - Unified system with composition and advanced features

### Compatibility Considerations

- All three systems are **opt-in** - basic Magic Anchor syntax continues to work
- Tools must support both expanded and unexpanded anchor forms
- Configuration validation prevents conflicts between systems
- Clear error messages guide users through complex feature interactions
- Performance impact minimized through caching and optimization