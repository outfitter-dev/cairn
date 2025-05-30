# Advanced Grep-Anchor Patterns
<!-- :A: tldr Advanced patterns including JSON payloads and complex workflows -->
<!-- :A: guide Advanced usage patterns and sophisticated techniques -->

This document covers advanced usage patterns for grep-anchors, including JSON payloads, complex metadata, and sophisticated workflows.

## JSON Payloads

For richer metadata, you can use JSON objects in your anchors:

### Temporal Metadata
```javascript
// :A: {"until":"2024-06-01","reason":"Chrome bug workaround"}
function patchChromeBug() {
    // temporary fix
}

// :A: {"since":"v1.8","deprecated":"v2.0","replacement":"newAPI.process"}
function legacyProcess() {
    // old implementation
}
```

### Ownership and Assignment
```python
# :A: {"owner":"@alice","reviewer":"@bob","deadline":"2024-03-15"}
def implement_feature():
    pass

# :A: {"team":"security","priority":"high","sla":"24h"}
def fix_vulnerability():
    pass
```

### Complex Relationships
```typescript
// :A: {"epic":"user-auth","depends":["session-mgmt","crypto"],"blocks":["checkout"]}
class AuthenticationService {
    // implementation
}

// :A: {"parent":"EPIC-123","subtasks":["validate","store","notify"],"estimate":"5d"}
async function processUserData() {
    // multi-step process
}
```

## Array Syntax

For listing multiple values:

```javascript
// :A: ["security","performance","breaking-change"]
// :A: affects:["api","cli","sdk"]
// :A:reviewers:["@security-team","@alice","@bob"]
```

## Structured Task Management

### Issue Linking with Metadata
```python
# :A:issue(123,{"status":"in-progress","assignee":"@dev"})
# :A:bug(456,{"severity":"high","reported":"2024-01-15"})
# :A:feature(789,{"milestone":"v2.0","approved":true})
```

### Epic and Task Hierarchies
```javascript
// :A:epic(auth,{"lead":"@alice","deadline":"Q2"})
// :A:task(auth.login,{"estimate":"3d","depends":["auth.session"]})
// :A:subtask(auth.login.oauth,{"provider":"google","status":"blocked"})
```

## Workflow Automation

### CI/CD Integration
```yaml
# :A:{"ci":"required","stage":"pre-commit","action":"block"}
# :A:{"deploy":"manual","environment":"production","approvers":["@ops"]}
```

### Conditional Patterns
```javascript
// :A:{"if":"NODE_ENV=production","then":"audit","priority":"critical"}
// :A:{"when":"version>=2.0","action":"remove","reason":"legacy support"}
```

## Advanced Search Patterns

### Complex Queries
```bash
# Find all high-priority security issues with deadlines
rg ':A:.*"priority":"high".*security' --json

# Find all deprecated code with replacements
rg ':A:.*"deprecated".*"replacement"' -A 2

# Find all tasks assigned to a specific person
rg ':A:.*"@alice"' --type js
```

### Extracting Structured Data
```bash
# Extract all JSON payloads
rg -o ':A:(\{[^}]+\})' -r '$1' | jq .

# Count tasks by assignee
rg -o ':A:.*"assignee":"(@\w+)"' -r '$1' | sort | uniq -c

# Find overdue items
rg ':A:.*"deadline":"([^"]+)"' -r '$1' | xargs -I {} date -d {} +%s | \
  awk -v now=$(date +%s) '$1 < now {print}'
```

## Migration Strategies

### Gradual Enhancement
```javascript
// Phase 1: Add to existing comments
// TODO :A:task implement validation

// Phase 2: Add metadata
// :A:task,{"id":"TASK-123","assigned":"@dev"}

// Phase 3: Full structured data
// :A:{"type":"task","id":"TASK-123","assigned":"@dev","due":"2024-03-01"}
```

### Bulk Conversion
```bash
# Convert TODO to :A:todo
find . -type f -name "*.js" -exec sed -i 's/\/\/ TODO:/\/\/ :A:todo/g' {} +

# Add :A: to existing FIXMEs
find . -type f -name "*.py" -exec sed -i 's/# FIXME:/# FIXME :A:fix/g' {} +
```

## Integration Examples

### With Issue Trackers
```python
# :A:jira(PROJ-123,{"sync":true,"fields":["status","assignee"]})
# :A:github(#456,{"auto-close":true,"labels":["bug","p1"]})
# :A:linear(ENG-789,{"project":"backend","cycle":"current"})
```

### With Documentation
```javascript
// :A:docs(api-guide.md#auth,{"type":"reference","update-needed":true})
// :A:spec(RFC-7231,{"section":"6.5.1","compliance":"partial"})
// :A:diagram(architecture.puml,{"component":"auth-flow"})
```

## Custom Schemas

Define your own structured formats:

```javascript
// Define in .grepa.yml or similar
// :A:custom-type({"field1":"value1","field2":"value2"})

// Examples:
// :A:metric({"name":"response_time","threshold":"200ms","alert":"pagerduty"})
// :A:experiment({"name":"new-ui","cohort":"10%","ends":"2024-04-01"})
// :A:compliance({"standard":"SOC2","control":"AC-2","status":"implemented"})
```

## Working with Advanced Patterns

- **Document your schema**: If using complex JSON, documenting expected fields helps
- **Validate consistently**: Consider tooling to validate JSON payloads
- **Start simple**: Add complexity only when it provides clear value
- **Keep it searchable**: Ensure your patterns remain greppable
- **Version your formats**: If schemas evolve, consider versioning them

Advanced patterns are powerful but optional. Most use cases work well with simple tags.

## Monorepo Patterns

In monorepos, maintain consistency by using one anchor with service/package tags:

### Service Namespacing
```javascript
// In auth service
// :A:auth,todo implement OAuth flow
// :A:auth,security validate JWT expiry

// In payment service
// :A:payment,todo add Stripe webhook
// :A:payment,perf optimize transaction queries

// In shared libraries
// :A:shared,api maintain backward compatibility
// :A:shared,breaking v2.0 removes this method
```

### Cross-Service References
```typescript
// :A:depends(auth-service) requires auth.validateToken
// :A:blocks(payment-service) breaking change affects checkout
// :A:see(shared/utils.ts) similar implementation
```

### Monorepo-Wide Searches
```bash
# All todos across services
rg ":A:.*todo"

# Just auth service markers
rg ":A:auth"

# Security issues in payment
rg ":A:payment.*security"

# All breaking changes
rg ":A:.*breaking"
```

### Package-Specific Patterns
```javascript
// NPM workspace packages
// :A:@frontend/ui,todo add dark mode
// :A:@backend/api,perf cache this endpoint
// :A:@shared/types,breaking interface change
```

**Note**: Consider using one anchor pattern with tags (`:A:auth`, `:A:payment`) rather than different anchors for different services. This approach tends to be more searchable and maintainable.