# Tasks, TODOs, and Issues Reference

Grep-anchors excel at connecting code to task tracking systems, capturing work items, and maintaining traceability. This document covers patterns for task-related anchors.

## Basic Task Tokens

The simplest patterns for marking work to be done:

```javascript
// :ga:todo implement error handling
// :ga:fixme race condition in async call
// :ga:hack temporary workaround for IE11
```

These tokens (`todo`, `fixme`, `hack`) are synonymous with `task` and `issue` - use whichever matches your team's vocabulary.

## Task References

### Simple ID References
```javascript
// :ga:todo(T-123) implement user preferences
// :ga:issue#456 regression from v2.0
// :ga:bug(BUG-789) null pointer exception
// :ga:task[PROJ-100] refactor auth module
```

### Multiple Reference Styles
```javascript
// :ga:jira(PROJ-123) detailed in ticket
// :ga:gh#456 see GitHub issue  
// :ga:linear(ENG-789) tracked in Linear
// :ga:asana(1234567890) task details
```

## Task Dependencies

### Blocking Relationships
```javascript
// :ga:blocks[T-1,T-2,T-3] must complete first
// :ga:blocked-by(T-99) waiting on API changes
// :ga:depends-on(AUTH-1) needs auth service
// :ga:prerequisite[API-1,API-2] required tasks
```

### Task Chains
```javascript
// :ga:todo(T-1),next(T-2) part of sequence
// :ga:step(3/5),task(EPIC-1) third step of epic
// :ga:phase(2),sprint(45) phase 2 work
```

## Task Metadata

### Status Tracking
```javascript
// :ga:todo,status(in-progress) actively working
// :ga:task(T-123),started(2024-01-15) WIP
// :ga:todo,assigned(@alice) has owner
// :ga:fixme,status(blocked) can't proceed
```

### Effort Estimation
```javascript
// :ga:todo(T-123),estimate(3d) 3 day task
// :ga:task,effort(5sp) 5 story points
// :ga:todo,size(L) large task
// :ga:fixme,quick(<1h) quick fix
```

### Task Context
```javascript
// :ga:todo,component(auth),p1 auth module task
// :ga:bug,found(v2.1),fix(v2.2) version info
// :ga:task,customer(ACME) client-specific
// :ga:todo,type(refactor) clarify intent
```

## Backwards Compatibility

Support for existing TODO patterns in codebases:

```javascript
// TODO: :ga:p1 upgrade to React 18
// FIXME: :ga:bug memory leak in cache
// HACK: :ga:temp workaround until v3
// NOTE: :ga:doc explain algorithm
```

Or inline with traditional markers:
```javascript
// TODO(alice): :ga:assigned implement feature
// FIXME #123: :ga:issue ref to ticket
// BUG-456: :ga:regression from refactor
```

## Complex Task Patterns

### Subtasks and Epics
```javascript
// :ga:epic(FEAT-100) user profile redesign
// :ga:subtask(T-123),parent(EPIC-99) 
// :ga:task,part-of(MILESTONE-Q1)
// :ga:story(US-456),tasks[T-1,T-2,T-3]
```

### Task Lifecycle
```javascript
// :ga:todo,created(2024-01-01),due(2024-02-01)
// :ga:task,sprint(45),committed
// :ga:todo,moved-from(sprint-44)
// :ga:done(T-123),completed(2024-01-20)
```

### Cross-References
```javascript
// :ga:todo,see-also[T-100,T-101] related work
// :ga:bug,duplicate-of(BUG-200) already tracked
// :ga:task,supersedes(T-50) replaces old task
// :ga:todo,split-from(T-999) decomposed task
```

## Integration Patterns

### CI/CD Integration
```javascript
// :ga:todo,ci-skip not ready for tests
// :ga:fixme,breaks-build known issue
// :ga:task,requires-deploy needs release
```

### Documentation Links
```javascript
// :ga:todo,spec(RFC-123) see design doc
// :ga:task,wiki(ProjectSetup) setup details
// :ga:todo,discuss(slack#eng) needs input
```

## Best Practices

1. **Use IDs**: Always reference external tickets when possible
2. **Be Specific**: `todo(T-123)` better than just `todo`
3. **Track Dependencies**: Make blockers explicit
4. **Update Status**: Mark completed tasks as done
5. **Standardize Format**: Pick one ID format per system

## Examples in Practice

### Feature Implementation
```javascript
// :ga:tldr Add user preference storage
// :ga:todo(T-123),epic(FEAT-100),p1
class UserPreferences {
    // :ga:todo(T-124),depends-on(T-123) add validation
    save(preferences) {
        // :ga:fixme,validation check required fields
        return db.save(preferences);
    }
    
    // :ga:todo(T-125),blocks[T-130,T-131] implement first
    load(userId) {
        // implementation pending
    }
}
```

### Bug Fix Workflow
```python
# :ga:tldr Fix memory leak in image processor
# :ga:bug(BUG-456),p0,customer-reported
def process_image(path):
    # :ga:fixme,memory-leak cache grows unbounded
    if path in cache:
        return cache[path]
    
    # :ga:todo,pr(#123) apply fix from PR
    img = load_image(path)
    cache[path] = img  # :ga:bug never cleared
    return img
```

### Refactoring Epic
```go
// :ga:tldr Modernize legacy payment system
// :ga:epic(TECH-200),q1-goal
package payment

// :ga:task(T-501),phase(1) extract interface
type PaymentProcessor interface {
    // :ga:todo(T-502) define methods
}

// :ga:task(T-510),phase(2),blocked-by(T-501)
type ModernProcessor struct {
    // :ga:todo migrate from LegacyProcessor
}

// :ga:deprecated,remove(T-520),phase(3)
type LegacyProcessor struct {
    // :ga:debt to be replaced
}
```

### Sprint Planning
```ruby
# :ga:tldr Shopping cart improvements
# :ga:sprint(45),team(@ecommerce)
class ShoppingCart
  # :ga:todo(T-601),estimate(3d),assigned(@bob)
  def apply_discount(code)
    # :ga:todo validate discount code
    # :ga:todo calculate discount amount
    # :ga:todo update cart total
  end
  
  # :ga:todo(T-602),estimate(2d),depends-on(T-601)
  def checkout
    # :ga:blocked-by(T-601) needs discount logic
  end
end
```

## Tool Integration

Many teams integrate grep-anchors with their tooling:

- **IDE Plugins**: Highlight and link to tickets
- **Git Hooks**: Validate task references exist
- **CI Pipeline**: Generate task reports
- **Project Boards**: Sync with code TODOs

Remember: Task tokens create a bridge between your code and project management. The most valuable patterns are those that help your team track and complete work effectively.