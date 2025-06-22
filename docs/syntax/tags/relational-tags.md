<!-- tldr ::: relational tags for linking waymarks and external references -->

# Relational Tags

Relational tags express connections between waymarks, issues, code elements, and external resources using the `#key:value` pattern.

## Core Syntax

```text
#key:value
#key:value1,value2,value3   (arrays - no spaces!)
#key:#reference             (reference to issue/anchor)
#key:@actor                 (reference to person/team)
```

## Core Relational Tags

The v1.0 specification defines these essential relational tags:

### Work Relationships

Track dependencies and blockers between work items:

```javascript
// Issue tracking
// todo ::: implement OAuth flow #fixes:#123
// fixme ::: memory leak in worker #closes:#456
// review ::: security audit #issue:#789

// Dependencies
// todo ::: update API client #blocks:#234,#567
// wip ::: refactor auth #blocked:#890
// todo ::: migrate database #depends:#123,#456

// Follow-up work
// done ::: basic implementation #followup:#234
// todo ::: complete phase 2 #replaces:#old-123
```

### References

Link to other waymarks, anchors, and documentation:

```javascript
// Anchor references
// todo ::: update validation #for:#auth/login
// fixme ::: race condition #refs:#payment/checkout
// note ::: similar pattern #see:#utils/cache

// Documentation
// note ::: implementation details #docs:/docs/auth.md
// todo ::: follow RFC spec #link:https://example.com/rfc
// important ::: see guide #docs:/guides/security.md
```

### Source Control

Track code changes across version control:

```javascript
// Pull requests and commits
// fixme ::: regression from PR #pr:#234
// note ::: introduced in #commit:abc123f
// todo ::: merge after #branch:feature/auth

// Combined references
// done ::: implemented in #pr:#234 #commit:def456
```

### Context and Impact

Describe scope and ownership:

```javascript
// System impact
// notice ::: breaking change #affects:#frontend,#mobile,#api
// todo ::: update all clients #affects:#web,#ios,#android

// Ownership
// review ::: needs approval #owner:@alice,@bob
// todo ::: security review #owner:@security-team #cc:@ops,@dev
```

## Value Formats

### Issue References

Always include `#` in issue references:

```javascript
// ✓ Correct
// todo ::: fix bug #fixes:#123
// todo ::: update deps #blocks:#456,#789

// ✗ Wrong (missing # in value)
// todo ::: fix bug #fixes:123
```

### Actor References

Use `@` for people and teams:

```javascript
// Individual assignment
// todo ::: code review #owner:@alice
// review ::: approval needed #cc:@bob,@charlie

// Team assignment
// todo ::: security audit #owner:@security-team
// fixme ::: performance issue #cc:@backend,@ops
```

### Arrays

No spaces in comma-separated values:

```javascript
// ✓ Correct
// todo ::: notify teams #cc:@frontend,@backend,@mobile
// notice ::: affects services #affects:#auth,#payment,#user

// ✗ Wrong (has spaces)
// todo ::: notify teams #cc:@frontend, @backend, @mobile
```

### External Links

Use appropriate protocols:

```javascript
// Web links
// note ::: see documentation #link:https://docs.example.com
// todo ::: implement RFC #link:https://tools.ietf.org/html/rfc7519

// File paths (relative to repo root)
// note ::: migration guide #docs:/docs/migration.md
// todo ::: update config #refs:/config/prod.json

// Tickets (external systems)
// fixme ::: customer issue #ticket:#SUP-1234
// todo ::: feature request #ticket:#JIRA-5678
```

## Search Patterns

### Finding Relationships

```bash
# All fixes
rg "#fixes:#\d+"

# Specific issue
rg "#fixes:#123\b"

# All blockers
rg "#blocks:#"
rg "#blocked:#"

# Dependencies
rg "#depends:#"

# Multi-value searches
rg "#affects:#.*,.*"      # Multiple affected items
rg "#cc:@.*,@"           # Multiple people CC'd
```

### Ownership Queries

```bash
# Find by owner
rg "#owner:@alice"
rg "#owner:@(alice|bob)"  # Either alice or bob

# Find all assignments
rg "#owner:@\w+"

# Team assignments
rg "#owner:@\w+-team"

# CC'd items
rg "#cc:.*@alice"
```

### Cross-References

```bash
# Find anchor references
rg "#refs:#\w+"
rg "#for:#\w+"

# Documentation references
rg "#docs:/"
rg "#link:http"

# Source control
rg "#pr:#\d+"
rg "#commit:[a-f0-9]+"
```

## Common Patterns

### Issue-Driven Development

```javascript
// Starting work
// todo ::: implement user auth #issue:#234 #owner:@alice

// In progress
// wip ::: auth implementation #issue:#234 #pr:#456

// Completion
// done ::: auth implemented #fixes:#234 #pr:#456 #commit:abc123

// Follow-up
// todo ::: add 2FA support #followup:#234 #issue:#567
```

### Code Reviews

```javascript
// Request review
// review ::: API changes #pr:#234 #owner:@backend-team #cc:@frontend

// Address feedback
// fixme ::: address review comments #pr:#234 #refs:#comment-123

// Approval tracking
// review ::: security approval needed #pr:#234 #owner:@security #blocks:#merge
```

### Dependency Management

```javascript
// Sequential work
// todo ::: design API #issue:#100
// todo ::: implement API #depends:#100 #issue:#101
// todo ::: write client #depends:#101 #issue:#102

// Parallel work with convergence
// todo ::: frontend auth #issue:#200 #blocks:#300
// todo ::: backend auth #issue:#201 #blocks:#300
// todo ::: integrate auth #depends:#200,#201 #issue:#300
```

### Cross-Team Coordination

```javascript
// API changes
// notice ::: breaking API change v2 #affects:#mobile,#web #owner:@api-team

// Migration coordination
// todo ::: prepare migration #blocks:#deploy-v2 #owner:@backend
// todo ::: update clients #depends:#api-v2 #owner:@frontend,@mobile

// Incident response
// !!fixme ::: production bug #ticket:#INC-123 #affects:#all #owner:@oncall
```

## Advanced Usage

### Chained References

Link through multiple systems:

```javascript
// Support ticket → Issue → PR → Commit
// fixme ::: customer bug #ticket:#SUP-123 #issue:#456 #pr:#789 #commit:def456
```

### Contextual Grouping

Group related work:

```javascript
// Feature epic
// todo ::: auth phase 1 #epic:#AUTH #issue:#101
// todo ::: auth phase 2 #epic:#AUTH #issue:#102 #depends:#101
// todo ::: auth phase 3 #epic:#AUTH #issue:#103 #depends:#102
```

### Time-Based References

Track temporal relationships:

```javascript
// Sprint planning
// todo ::: user stories #sprint:2024-01 #points:5
// todo ::: bug fixes #sprint:2024-01 #priority:high
<!-- todo ::: Example uses deprecated `#priority:high`; replace with `!todo` (signal) or remove #priority tag per v1.0 simplification #wm:fix -->

// Release tracking
// todo ::: feature flag removal #release:v2.1 #depends:#feature-complete
// deprecated ::: old API #remove:v3.0 #migration:#new-api
```

## Best Practices

### 1. Be Explicit

```javascript
// ✓ Good: Clear relationships
// todo ::: fix login bug #fixes:#123 #affects:#auth,#session

// ✗ Poor: Ambiguous
// todo ::: fix bug #123  // Is this issue #123 or something else?
```

### 2. Complete References

Include enough context:

```javascript
// ✓ Good: Full context
// done ::: implemented OAuth #fixes:#123 #pr:#456 #docs:/docs/oauth.md

// ✗ Poor: Missing context
// done ::: implemented #123  // What was implemented? What's #123?
```

### 3. Maintain Chains

Keep dependency chains updated:

```javascript
// When completing work
// done ::: API implemented #fixes:#100 #unblocks:#101,#102

// Update dependent items
// todo ::: write client #depends:#100 #issue:#101  // Now unblocked
```

### 4. Use Standard Keys

Stick to established patterns:

```javascript
// ✓ Standard keys
#fixes:#123          // Fixing an issue
#owner:@alice        // Clear ownership
#affects:#payment    // Impact is clear

// ✗ Non-standard (avoid)
#resolves:#123       // Use #fixes
#assignee:@alice     // Use #owner
#impacts:#payment    // Use #affects
```

## Summary

Relational tags connect your waymarks into a navigable web of relationships. They enable:
- **Dependency tracking** across work items
- **Clear ownership** and collaboration
- **Impact analysis** for changes
- **Cross-referencing** between code and documentation
- **Integration** with external systems

Use them to build a connected, searchable codebase that tells the complete story of your code.