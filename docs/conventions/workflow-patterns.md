# Workflow Patterns
<!-- :ga:tldr Tags for managing work, collaboration, and process flow -->
<!-- :ga:convention Patterns for team workflows and collaboration -->

Tags for managing work, collaboration, and process flow.

## Work Tracking

### `:ga:todo`
**Purpose**: Mark future work items
```javascript
// :ga:todo implement caching layer
```

### `:ga:fixme`
**Purpose**: Broken code needing immediate attention
```python
# :ga:fixme race condition in auth flow
```

### `:ga:hack`
**Purpose**: Temporary workarounds
```go
// :ga:hack workaround for upstream bug #123
```

## Review & Collaboration

### `:ga:review`
**Purpose**: Code needing review
```javascript
// :ga:review security implications unclear
```

### `:ga:question`
**Purpose**: Clarification needed
```python
# :ga:question is this the right approach?
```

### `:ga:discuss`
**Purpose**: Needs team discussion
```java
// :ga:discuss architecture decision needed
```

## Mention Patterns

### Direct Mentions
**Purpose**: Tag specific people or teams
```javascript
// :ga:@alice please review
// :ga:@backend-team optimization needed
// :ga:@security audit required
```

### Attention Mentions
**Purpose**: Request someone's attention
```javascript
// :ga:attn@alice broken in production
// :ga:attn@devops deployment issue
// :ga:attn[@alice,@bob] coordination needed
```

### Owner Mentions
**Purpose**: Designate ownership/responsibility
```javascript
// :ga:owner@alice payment module
// :ga:owner@frontend-team UI components
// :ga:owner[@alice,@bob] shared ownership
```

### Reviewer Mentions
**Purpose**: Assign reviewers
```javascript
// :ga:reviewer@senior needs approval
// :ga:reviewers[@alice,@bob]
// :ga:reviewer(@security,@performance)
```

## Status Tracking

### `:ga:wip`
**Purpose**: Work in progress
```python
# :ga:wip do not merge
```

### `:ga:blocked`
**Purpose**: Blocked by dependency
```go
// :ga:blocked waiting on API update
// :ga:blocked@alice need input
```

### `:ga:ready`
**Purpose**: Ready for next step
```javascript
// :ga:ready for review
// :ga:ready@qa for testing
```

## Priority Patterns

### Priority Levels
```javascript
// :ga:p0 system down
// :ga:p1 major feature broken
// :ga:p2 important bug
// :ga:p3 nice to have
```

### Urgency Indicators
```javascript
// :ga:urgent,@ops production issue
// :ga:asap,owner@alice customer blocker
// :ga:whenever low priority cleanup
```

## Lifecycle Management

### `:ga:draft`
**Purpose**: Not finalized
```python
# :ga:draft api design subject to change
```

### `:ga:approved`
**Purpose**: Formally approved
```java
// :ga:approved@architect design reviewed
```

### `:ga:shipped`
**Purpose**: Deployed to production
```javascript
// :ga:shipped@v2.1 feature released
```

## Integration Patterns

### Issue Tracking
```javascript
// :ga:issue-1234 related ticket
// :ga:fixes#456 closes issue
// :ga:see[#123,#456] related issues
```

### External References
```javascript
// :ga:rfc-7231 follows HTTP spec
// :ga:spec@section-4.2
// :ga:doc@wiki/AuthFlow
```

## Best Practices

1. **Mention Format**: Use `@` for people/teams consistently
2. **Attribute Actions**: `action@person` shows who should act
3. **Group Mentions**: Use arrays or parens for multiple people
4. **Add Context**: Always include description after tags
5. **Update Status**: Change tags as work progresses