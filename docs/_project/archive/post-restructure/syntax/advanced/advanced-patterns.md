# Advanced Waymark Patterns
<!-- :M: tldr Advanced patterns using arrays, parameters, and sophisticated workflows -->
<!-- :M: guide Advanced usage patterns and sophisticated techniques -->

This document covers advanced usage patterns for waymarks, including arrays, parameters, and sophisticated workflows.

## Array Syntax

Use brackets for listing multiple values:

```javascript
// :M: reviewers:[@alice,@bob,@charlie]
// :M: affects:[api,cli,sdk]
// :M: blocked:[123,456,789]
```

### Arrays in Parameters

```python
# :M: issue(4) blocked:[5,6,7]
# :M: owner:@alice depends:[auth,crypto]
```

## Structured Parameters

### Classifications with Values

```javascript
// :M: priority:high status:blocked
// :M: since:v1.8 until:v2.0
// :M: team:security severity:critical
```

### Parameterized Markers

```typescript
// :M: issue(123) assignee:@dev
// :M: bug(456) severity:high
// :M: feature(789) milestone:v2.0
```

### Nested Parameters

```javascript
// :M: blocked(issue:4) reason:security
// :M: depends(auth-service) version:2.1
// :M: deprecated(since:v1.8) replacement:newAPI
```

## Workflow Patterns

### Task Management

```python
# :M: todo priority:high assignee:@alice
# :M: todo(bug:auth-timeout) deadline:2024-03-15
# :M: done(issue:123) completed:2024-03-01
```

### Code Lifecycle

```javascript
// :M: deprecated since:v1.8 replacement:newMethod
// :M: freeze until:v2.0 reason:api-stability
// :M: temp remove:2024-06-01 reason:chrome-bug
```

### Dependencies and Relationships

```typescript
// :M: depends:[auth,session,crypto]
// :M: blocks:[checkout,payment]
// :M: related:[issue:123,pr:456]
```

## Advanced Search Patterns

### Complex Queries

```bash
# Find all high-priority security issues
rg ":M:.*priority:high.*security"

# Find all deprecated code with replacements
rg ":M:.*deprecated.*replacement:" -A 2

# Find all tasks assigned to specific person
rg ":M:.*@alice" --type js
```

### Extracting Structured Data

```bash
# Count tasks by assignee
rg -o ":M:.*assignee:(@\w+)" -r '$1' | sort | uniq -c

# Find all issue references
rg -o ":M:.*issue\((\d+)\)" -r '$1' | sort -n | uniq

# List all blocked items
rg ":M:.*blocked" -A 1 -B 1
```

## Monorepo Patterns

### Service Namespacing

```javascript
// In auth service
// :M: auth, todo implement OAuth flow
// :M: auth, security validate JWT expiry

// In payment service
// :M: payment, todo add Stripe webhook
// :M: payment, perf optimize transaction queries

// In shared libraries
// :M: shared, api maintain backward compatibility
// :M: shared, breaking v2.0 removes this method
```

### Cross-Service References

```typescript
// :M: depends(auth-service) requires:validateToken
// :M: blocks(payment-service) reason:breaking-change
// :M: see(shared/utils.ts) similar:implementation
```

### Monorepo-Wide Searches

```bash
# All todos across services
rg ":M:.*todo"

# Just auth service markers
rg ":M: auth,"

# Security issues in payment
rg ":M: payment,.*security"

# All breaking changes
rg ":M:.*breaking"
```

## Adoption Patterns

### Adding Waymarks to Existing Comments

```javascript
// Phase 1: Add waymarks to existing
// TODO: implement validation
// TODO :M: todo implement validation

// Phase 2: Add metadata
// :M: todo priority:high implement validation

// Phase 3: Full context
// :M: todo priority:high assignee:@dev deadline:2024-03-01
```

### Bulk Conversion

```bash
# Convert TODO to waymarks
find . -name "*.js" -exec sed -i 's/\/\/ TODO:/\/\/ :M: todo/g' {} +

# Add waymarks to FIXMEs
find . -name "*.py" -exec sed -i 's/# FIXME:/# :M: fix/g' {} +
```

## Integration Patterns

### Issue Tracker References

```python
# :M: jira(PROJ-123) status:in-progress
# :M: github(456) labels:[bug,p1]
# :M: linear(ENG-789) cycle:current
```

### Documentation Links

```javascript
// :M: docs(api-guide.md#auth) update:needed
// :M: spec(RFC-7231) section:6.5.1
// :M: adr(003) status:approved
```

## Best Practices

- **Keep it searchable**: Simple patterns are easier to grep
- **Be consistent**: Use the same patterns across your codebase
- **Start simple**: Add complexity only when needed
- **Document patterns**: Keep a CONVENTIONS.md file
- **One waymark per line**: Maintains grep-ability

Advanced patterns are powerful but optional. Most use cases work well with simple tags.