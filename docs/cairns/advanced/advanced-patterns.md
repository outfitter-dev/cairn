# Advanced Cairn Patterns
<!-- :M: tldr Advanced patterns including JSON payloads and complex workflows -->
<!-- :M: guide Advanced usage patterns and sophisticated techniques -->

This document covers advanced usage patterns for Cairns, including JSON payloads, complex metadata, and sophisticated workflows.

## JSON Payloads

For richer metadata, you can use JSON objects in your Cairns:

### Temporal Metadata
```javascript
// :M: {"until":"2024-06-01","reason":"Chrome bug workaround"}
function patchChromeBug() {
    // temporary fix
}

// :M: {"since":"v1.8","deprecated":"v2.0","replacement":"newAPI.process"}
function legacyProcess() {
    // old implementation
}
```

### Ownership and Assignment
```python
# :M: {"owner":"@alice","reviewer":"@bob","deadline":"2024-03-15"}
def implement_feature():
    pass

# :M: {"team":"security","priority":"high","sla":"24h"}
def fix_vulnerability():
    pass
```

### Complex Relationships
```typescript
// :M: {"epic":"user-auth","depends":["session-mgmt","crypto"],"blocks":["checkout"]}
class AuthenticationService {
    // implementation
}

// :M: {"parent":"EPIC-123","subtasks":["validate","store","notify"],"estimate":"5d"}
async function processUserData() {
    // multi-step process
}
```

## Array Syntax

For listing multiple values:

```javascript
// :M: ["security","performance","breaking-change"]
// :M: affects:["api","cli","sdk"]
// :M:reviewers:["@security-team","@alice","@bob"]
```

## Structured Task Management

### Issue Linking with Metadata
```python
# :M:issue(123,{"status":"in-progress","assignee":"@dev"})
# :M:bug(456,{"severity":"high","reported":"2024-01-15"})
# :M:feature(789,{"milestone":"v2.0","approved":true})
```

### Epic and Task Hierarchies
```javascript
// :M:epic(auth,{"lead":"@alice","deadline":"Q2"})
// :M:task(auth.login,{"estimate":"3d","depends":["auth.session"]})
// :M:subtask(auth.login.oauth,{"provider":"google","status":"blocked"})
```

## Workflow Automation

### CI/CD Integration
```yaml
# :M:{"ci":"required","stage":"pre-commit","action":"block"}
# :M:{"deploy":"manual","environment":"production","approvers":["@ops"]}
```

### Conditional Patterns
```javascript
// :M:{"if":"NODE_ENV=production","then":"audit","priority":"critical"}
// :M:{"when":"version>=2.0","action":"remove","reason":"legacy support"}
```

## Advanced Search Patterns

### Complex Queries
```bash
# Find all high-priority security issues with deadlines
rg ':M:.*"priority":"high".*security' --json

# Find all deprecated code with replacements
rg ':M:.*"deprecated".*"replacement"' -A 2

# Find all tasks assigned to a specific person
rg ':M:.*"@alice"' --type js
```

### Extracting Structured Data
```bash
# Extract all JSON payloads
rg -o ':M:(\{[^}]+\})' -r '$1' | jq .

# Count tasks by assignee
rg -o ':M:.*"assignee":"(@\w+)"' -r '$1' | sort | uniq -c

# Find overdue items
rg ':M:.*"deadline":"([^"]+)"' -r '$1' | xargs -I {} date -d {} +%s | \
  awk -v now=$(date +%s) '$1 < now {print}'
```

## Migration Strategies

### Gradual Enhancement
```javascript
// Phase 1: Add to existing comments
// TODO :M:task implement validation

// Phase 2: Add metadata
// :M:task,{"id":"TASK-123","assigned":"@dev"}

// Phase 3: Full structured data
// :M:{"type":"task","id":"TASK-123","assigned":"@dev","due":"2024-03-01"}
```

### Bulk Conversion
```bash
# Convert TODO to :M:todo
find . -type f -name "*.js" -exec sed -i 's/\/\/ TODO:/\/\/ :M:todo/g' {} +

# Add :M: to existing FIXMEs
find . -type f -name "*.py" -exec sed -i 's/# FIXME:/# FIXME :M:fix/g' {} +
```

## Integration Examples

### With Issue Trackers
```python
# :M:jira(PROJ-123,{"sync":true,"fields":["status","assignee"]})
# :M:github(#456,{"auto-close":true,"labels":["bug","p1"]})
# :M:linear(ENG-789,{"project":"backend","cycle":"current"})
```

### With Documentation
```javascript
// :M:docs(api-guide.md#auth,{"type":"reference","update-needed":true})
// :M:spec(RFC-7231,{"section":"6.5.1","compliance":"partial"})
// :M:diagram(architecture.puml,{"component":"auth-flow"})
```

## Custom Schemas

Define your own structured formats:

```javascript
// Define in .cairn.yml or similar
// :M:custom-type({"field1":"value1","field2":"value2"})

// Examples:
// :M:metric({"name":"response_time","threshold":"200ms","alert":"pagerduty"})
// :M:experiment({"name":"new-ui","cohort":"10%","ends":"2024-04-01"})
// :M:compliance({"standard":"SOC2","control":"AC-2","status":"implemented"})
```

## Working with Advanced Patterns

- **Document your schema**: If using complex JSON, documenting expected fields helps
- **Validate consistently**: Consider tooling to validate JSON payloads
- **Start simple**: Add complexity only when it provides clear value
- **Keep it searchable**: Ensure your patterns remain greppable
- **Version your formats**: If schemas evolve, consider versioning them

Advanced patterns are powerful but optional. Most use cases work well with simple tags.

## Monorepo Patterns

In monorepos, maintain consistency by using one cairn with service/package tags:

### Service Namespacing
```javascript
// In auth service
// :M:auth,todo implement OAuth flow
// :M:auth,security validate JWT expiry

// In payment service
// :M:payment,todo add Stripe webhook
// :M:payment,perf optimize transaction queries

// In shared libraries
// :M:shared,api maintain backward compatibility
// :M:shared,breaking v2.0 removes this method
```

### Cross-Service References
```typescript
// :M:depends(auth-service) requires auth.validateToken
// :M:blocks(payment-service) breaking change affects checkout
// :M:see(shared/utils.ts) similar implementation
```

### Monorepo-Wide Searches
```bash
# All todos across services
rg ":M:.*todo"

# Just auth service markers
rg ":M:auth"

# Security issues in payment
rg ":M:payment.*security"

# All breaking changes
rg ":M:.*breaking"
```

### Package-Specific Patterns
```javascript
// NPM workspace packages
// :M:@frontend/ui,todo add dark mode
// :M:@backend/api,perf cache this endpoint
// :M:@shared/types,breaking interface change
```

**Note**: Consider using one cairn pattern with tags (`:M:auth`, `:M:payment`) rather than different cairns for different services. This approach tends to be more searchable and maintainable.