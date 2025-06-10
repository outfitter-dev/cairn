# Workflow Patterns
<!-- :M: tldr Cairns for managing work, collaboration, and process flow -->
<!-- :M: convention Patterns for team workflows and collaboration -->

Cairns for managing work, collaboration, and process flow.

## Work Tracking

### `:M: todo`
**Purpose**: Mark future work items
```javascript
// :M: todo implement caching layer
```

### `:M: fixme`
**Purpose**: Broken code needing immediate attention
```python
# :M: fixme race condition in auth flow
```

### `:M: hack`
**Purpose**: Temporary workarounds
```go
// :M: hack workaround for upstream bug #123
```

## Review & Collaboration

### `:M: review`
**Purpose**: Code needing review
```javascript
// :M: review security implications unclear
```

### `:M: question`
**Purpose**: Clarification needed
```python
# :M: question is this the right approach?
```

### `:M: discuss`
**Purpose**: Needs team discussion
```java
// :M: discuss architecture decision needed
```

## Mention Patterns

### Direct Mentions
**Purpose**: Tag specific people or teams
```javascript
// :M: @alice please review
// :M: @backend-team optimization needed
// :M: @security audit required
```

### Attention Mentions
**Purpose**: Request someone's attention
```javascript
// :M: attn, @alice broken in production
// :M: attn, @devops deployment issue
// :M: attn, owner:[@alice,@bob] coordination needed
```

### Owner Mentions
**Purpose**: Designate ownership/responsibility
```javascript
// :M: owner:@alice payment module
// :M: owner:@frontend-team UI components
// :M: owner:[@alice,@bob] shared ownership
```

### Reviewer Mentions
**Purpose**: Assign reviewers
```javascript
// :M: reviewer:@senior needs approval
// :M: reviewers:[@alice,@bob]
// :M: reviewer:[@security,@performance]
```

## Status Tracking

### `:M: wip`
**Purpose**: Work in progress
```python
# :M: wip do not merge
```

### `:M: blocked`
**Purpose**: Blocked by dependency
```go
// :M: blocked waiting on API update
// :M: blocked, @alice need input
```

### `:M: ready`
**Purpose**: Ready for next step
```javascript
// :M: ready for review
// :M: ready, @qa for testing
```

## Priority Patterns

### Priority Levels
```javascript
// :M: p0 system down
// :M: p1 major feature broken
// :M: p2 important bug
// :M: p3 nice to have
```

### Urgency Indicators
```javascript
// :M: urgent, @ops production issue
// :M: asap, owner:@alice customer blocker
// :M: whenever low priority cleanup
```

## Lifecycle Management

### `:M: draft`
**Purpose**: Not finalized
```python
# :M: draft api design subject to change
```

### `:M: approved`
**Purpose**: Formally approved
```java
// :M: approved, @architect design reviewed
```

### `:M: shipped`
**Purpose**: Deployed to production
```javascript
// :M: shipped:v2.1 feature released
```

## Integration Patterns

### Issue Tracking
```javascript
// :M: issue(1234) related ticket
// :M: fixes(#456) closes issue
// :M: see:[#123,#456] related issues
```

### External References
```javascript
// :M: rfc(7231) follows HTTP spec
// :M: spec:section-4.2
// :M: doc:wiki/AuthFlow
```

## Best Practices

1. **Mention Format**: Use `@` for people/teams consistently
2. **Attribute Actions**: `action@person` shows who should act
3. **Group Mentions**: Use arrays or parens for multiple people
4. **Add Context**: Always include description after cairns
5. **Update Status**: Change tags as work progresses