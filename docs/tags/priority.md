# Priority Tokens Reference

Priority tokens help teams triage work, communicate urgency, and manage technical debt. This document covers various priority notation patterns for grep-anchors.

## Standard Priority Levels

The most common pattern uses `p0` through `p3`:

```javascript
// :ga:p0 critical - system down, data loss risk
// :ga:p1 high - blocking users, needs immediate attention  
// :ga:p2 medium - important but not urgent
// :ga:p3 low - nice to have, cleanup tasks
```

## Alternative Priority Notations

### Word-Based Priorities
Some teams prefer descriptive words:

```javascript
// :ga:p?critical production outage
// :ga:p?high customer-facing bug
// :ga:p?medium performance issue
// :ga:p?low code cleanup
```

Or with different connectors:
```javascript
// :ga:p-critical security vulnerability
// :ga:p-urgent hot fix needed
// :ga:p_high regression in payment flow
```

### Severity Indicators
```javascript
// :ga:blocker cannot release without fix
// :ga:critical data corruption risk
// :ga:major functionality broken
// :ga:minor cosmetic issue
```

### Impact-Based
```javascript
// :ga:sev1 >50% users affected
// :ga:sev2 10-50% users affected
// :ga:sev3 <10% users affected
// :ga:sev4 edge case scenario
```

## Contextual Priority

### Domain-Specific Priority
```javascript
// :ga:sec-critical security vulnerability
// :ga:perf-high 10x slowdown
// :ga:ux-urgent broken user flow
// :ga:api-breaking public API affected
```

### Time-Sensitive Priority
```javascript
// :ga:urgent,by(2024-03-01) deadline approaching
// :ga:p0,sprint(45) must fix this sprint
// :ga:hot,customer(ACME) key client blocked
```

### Combined Priority Signals
```javascript
// :ga:p0,sec,prod critical security issue in production
// :ga:p1,regression,v2.0 high-priority regression
// :ga:p2,debt,refactor medium-priority tech debt
```

## Priority with Metadata

### Priority with Assignment
```javascript
// :ga:p0,@oncall immediate attention required
// :ga:p1,@security-team security review needed
// :ga:p2,@frontend UI bug to fix
```

### Priority with Estimation
```javascript
// :ga:p1,2d high priority, 2 day estimate
// :ga:p2,1w medium priority, 1 week effort
// :ga:p3,quick low priority quick fix
```

### Priority with Dependencies
```javascript
// :ga:p0,blocks[AUTH-1,AUTH-2] critical blocker
// :ga:p1,depends(API-99) high pri but blocked
// :ga:p2,after(v2.0) medium, post-release
```

## Escalation Patterns

### Priority Changes
```javascript
// :ga:p2->p1 escalated due to customer impact
// :ga:was-p3,now-p1 priority increased
// :ga:escalated,p0 upgraded to critical
```

### Conditional Priority
```javascript
// :ga:p3,unless(production) low pri except in prod
// :ga:p2,if(scale>1000) priority increases at scale
// :ga:p1,when(v2.0) high priority for v2 release
```

## Best Practices

1. **Be Consistent**: Pick one notation style and stick to it
2. **Define Meanings**: Document what each priority level means for your team
3. **Add Context**: `p0,sec` is more informative than just `p0`
4. **Review Regularly**: Priorities change; review and update them
5. **Avoid Inflation**: Not everything can be p0

## Examples in Practice

### Bug Report
```javascript
// :ga:tldr Null pointer when user has no profile image
// :ga:fix,p1,@backend,customer-reported
function getUserAvatar(userId) {
    // :ga:bug,npe profile.image can be null
    return user.profile.image.url; // crashes here
}
```

### Security Issue
```python
# :ga:tldr SQL injection vulnerability in search endpoint
# :ga:sec,p0,cve-pending
def search_users(query):
    # :ga:fixme,injection unsanitized input
    sql = f"SELECT * FROM users WHERE name LIKE '%{query}%'"
    return db.execute(sql)
```

### Performance Problem
```go
// :ga:tldr N+1 query in order listing
// :ga:perf,p1,impacts(checkout)
func GetOrdersWithItems(customerID string) []Order {
    orders := getOrders(customerID)
    // :ga:p1,n+1 separate query per order
    for i, order := range orders {
        orders[i].Items = getOrderItems(order.ID)
    }
    return orders
}
```

### Technical Debt
```ruby
# :ga:tldr Legacy payment processor integration
# :ga:debt,p2,deprecate(v3.0)
class OldPaymentGateway
  # :ga:p2,refactor migrate to new payment service
  # :ga:temp,until(2024-Q4) maintaining for compatibility
  def process_payment(amount)
    # legacy implementation
  end
end
```

## Priority Decision Matrix

When choosing a priority scheme, consider:

- **Team Size**: Larger teams may need more granular levels
- **Domain**: Security/finance may need different priorities than content sites  
- **Release Cycle**: Continuous deployment vs. scheduled releases
- **SLA Requirements**: Customer contracts may dictate priority levels

Remember: Priority tokens are communication tools. The best system is one your entire team understands and uses consistently.