<!-- tldr ::: actor system for task assignment and ownership -->

# Waymark Actors

Actors represent people, teams, or AI agents that can be assigned work or mentioned in waymarks. The `@` symbol identifies actors and enables clear ownership and collaboration patterns.

## Actor Syntax

```javascript
// Basic actor assignment (first token after :::)
// todo ::: @alice implement authentication

// Actor mention in prose (not an assignment)
// note ::: discussed with @bob about the approach

// Multiple actors
// review ::: @alice check implementation, cc @bob
```

## Assignment vs Mention

The position of the actor determines its meaning:

### Assignment (First Token)
When an actor appears as the **first token** after `:::`, it assigns ownership:

```javascript
// todo ::: @alice implement caching          // Assigned to alice
// review ::: @security-team audit this       // Assigned to security-team
// fixme ::: @bob resolve memory leak         // Assigned to bob
```

### Mention (In Prose)
Actors appearing elsewhere are just mentions or references:

```javascript
// todo ::: @alice coordinate with @bob      // Assigned to alice, mentions bob
// note ::: per @charlie, use new API         // References charlie's input
// review ::: @alice @bob both should check   // Assigned to alice, mentions bob
```

## Actor Types

### Individual People
Use lowercase names for individuals:

```javascript
// todo ::: @alice implement feature
// review ::: @bob check performance
// fixme ::: @charlie resolve bug
```

### Teams
Use descriptive team names:

```javascript
// review ::: @security-team audit code
// todo ::: @frontend implement UI
// notice ::: @devops deployment required
```

### AI Agents
Use agent names or generic `@agent`:

```javascript
// todo ::: @agent generate tests
// refactor ::: @claude optimize this function
// review ::: @agent check for security issues
```

## Common Patterns

### Direct Assignment
Simple, clear ownership:

```javascript
// todo ::: @alice implement user registration
// fixme ::: @bob fix login timeout issue
// review ::: @security audit authentication flow
```

### Assignment with Context
Provide additional information after assignment:

```javascript
// todo ::: @alice implement caching for API responses
// review ::: @bob ensure backwards compatibility
// fixme ::: @charlie race condition in payment processing
```

### Multiple Stakeholders
Use mentions to involve others:

```javascript
// todo ::: @alice implement with input from @bob
// review ::: @security coordinate with @compliance
// fixme ::: @charlie urgent - blocks @dave's work
```

### Team Collaboration
Assign to individuals while notifying teams:

```javascript
// todo ::: @alice implement feature cc @frontend
// review ::: @bob security check cc @security-team
// fixme ::: @charlie critical bug affecting @backend
```

## Actor + Tag Patterns

Combine actors with tags for rich context:

### Using #owner Tag
When the primary content needs to come first:

```javascript
// todo ::: implement new API endpoint #owner:@alice
// fixme ::: memory leak in auth service #owner:@bob #critical
```

### Using #cc Tag
For keeping people informed:

```javascript
// notice ::: API breaking change #owner:@alice #cc:@frontend,@mobile
// todo ::: database migration #owner:@dave #cc:@ops
```

### Issue Assignment
Combine actors with issue tracking:

```javascript
// todo ::: @alice implement feature #fixes:#123
// fixme ::: @bob resolve bug #blocks:#456
// review ::: @security check before release #pr:#789
```

## Search Patterns

Find waymarks by actor:

```bash
# All waymarks assigned to alice
rg ":::\s*@alice"

# All mentions of alice (including assignments)
rg "@alice"

# Team assignments
rg ":::\s*@(security|frontend|backend)"

# Agent delegations
rg ":::\s*@(agent|claude|max)"

# Multiple actor patterns
rg "#cc:.*@"
rg "#owner:@"
```

## Best Practices

### 1. Clear Ownership
Always make ownership explicit:

```javascript
// ✅ Clear assignment
// todo ::: @alice implement caching

// ❌ Unclear ownership
// todo ::: implement caching (alice?)
```

### 2. Use Consistent Names
Standardize actor names across the codebase:

```javascript
// ✅ Consistent
// todo ::: @alice implement feature
// review ::: @alice check edge cases

// ❌ Inconsistent
// todo ::: @alice implement feature
// review ::: @alice-smith check edge cases
```

### 3. Prefer Direct Assignment
When possible, use direct assignment over tags:

```javascript
// ✅ Direct assignment (preferred)
// todo ::: @alice implement feature

// ⚠️ Tag form (when needed)
// todo ::: implement feature #owner:@alice
```

### 4. Team vs Individual
Choose the right granularity:

```javascript
// For team-wide concerns
// review ::: @security-team audit all endpoints

// For specific tasks
// todo ::: @alice implement login endpoint
```

### 5. AI Agent Delegation
Be specific about agent capabilities:

```javascript
// Generic agent task
// todo ::: @agent write unit tests

// Specific agent with context
// refactor ::: @claude optimize for readability #lang:python
```

## Actor Arrays

Use comma-separated lists (no spaces) for multiple actors:

```javascript
// Multiple owners (rare but valid)
// todo ::: implement with #owner:@alice,@bob

// Keep multiple people informed
// notice ::: breaking change #cc:@frontend,@mobile,@backend

// Complex ownership
// review ::: @security coordinate #cc:@alice,@bob,@charlie
```

## Special Cases

### Self-Assignment
Use your own handle for self-assignment:

```javascript
// todo ::: @alice [I'll handle this]
```

### Rotating Assignment
For tasks that rotate between people:

```javascript
// review ::: @on-call check monitoring alerts
// todo ::: @release-captain prepare changelog
```

### External References
For people not in the system:

```javascript
// note ::: per @customer-john, need this feature
// todo ::: @alice follow up with @vendor-support
```

## See Also

- [Markers](./markers.md) - Core waymark markers
- [Signals](./signals.md) - Priority modifiers
- [Tags](./tags/) - Classification and relationships
- [Syntax Specification](./SPEC.md) - Complete v1.0 specification