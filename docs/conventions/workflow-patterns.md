# Workflow Patterns
<!-- :A: tldr Markers for managing work, collaboration, and process flow -->
<!-- :A: convention Patterns for team workflows and collaboration -->

Markers for managing work, collaboration, and process flow.

## Work Tracking

### `:A: todo`
**Purpose**: Mark future work items
```javascript
// :A: todo implement caching layer
```

### `:A: fixme`
**Purpose**: Broken code needing immediate attention
```python
# :A: fixme race condition in auth flow
```

### `:A: hack`
**Purpose**: Temporary workarounds
```go
// :A: hack workaround for upstream bug #123
```

## Review & Collaboration

### `:A: review`
**Purpose**: Code needing review
```javascript
// :A: review security implications unclear
```

### `:A: question`
**Purpose**: Clarification needed
```python
# :A: question is this the right approach?
```

### `:A: discuss`
**Purpose**: Needs team discussion
```java
// :A: discuss architecture decision needed
```

## Mention Patterns

### Direct Mentions
**Purpose**: Tag specific people or teams
```javascript
// :A: @alice please review
// :A: @backend-team optimization needed
// :A: @security audit required
```

### Attention Mentions
**Purpose**: Request someone's attention
```javascript
// :A: attn, @alice broken in production
// :A: attn, @devops deployment issue
// :A: attn, owner:[@alice,@bob] coordination needed
```

### Owner Mentions
**Purpose**: Designate ownership/responsibility
```javascript
// :A: owner:@alice payment module
// :A: owner:@frontend-team UI components
// :A: owner:[@alice,@bob] shared ownership
```

### Reviewer Mentions
**Purpose**: Assign reviewers
```javascript
// :A: reviewer:@senior needs approval
// :A: reviewers:[@alice,@bob]
// :A: reviewer:[@security,@performance]
```

## Status Tracking

### `:A: wip`
**Purpose**: Work in progress
```python
# :A: wip do not merge
```

### `:A: blocked`
**Purpose**: Blocked by dependency
```go
// :A: blocked waiting on API update
// :A: blocked, @alice need input
```

### `:A: ready`
**Purpose**: Ready for next step
```javascript
// :A: ready for review
// :A: ready, @qa for testing
```

## Priority Patterns

### Priority Levels
```javascript
// :A: p0 system down
// :A: p1 major feature broken
// :A: p2 important bug
// :A: p3 nice to have
```

### Urgency Indicators
```javascript
// :A: urgent, @ops production issue
// :A: asap, owner:@alice customer blocker
// :A: whenever low priority cleanup
```

## Lifecycle Management

### `:A: draft`
**Purpose**: Not finalized
```python
# :A: draft api design subject to change
```

### `:A: approved`
**Purpose**: Formally approved
```java
// :A: approved, @architect design reviewed
```

### `:A: shipped`
**Purpose**: Deployed to production
```javascript
// :A: shipped:v2.1 feature released
```

## Integration Patterns

### Issue Tracking
```javascript
// :A: issue(1234) related ticket
// :A: fixes(#456) closes issue
// :A: see:[#123,#456] related issues
```

### External References
```javascript
// :A: rfc(7231) follows HTTP spec
// :A: spec:section-4.2
// :A: doc:wiki/AuthFlow
```

## Best Practices

1. **Mention Format**: Use `@` for people/teams consistently
2. **Attribute Actions**: `action@person` shows who should act
3. **Group Mentions**: Use arrays or parens for multiple people
4. **Add Context**: Always include description after markers
5. **Update Status**: Change tags as work progresses