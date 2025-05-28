# Magic Anchor Examples
<!-- :A: tldr Real-world examples of grep-anchor usage patterns -->
<!-- :A: example Comprehensive examples for AI agents and developers -->

*Examples and patterns for working with Magic Anchors*

---

## 1. AI Agent Workflows

### Task Delegation
- `:A: @agent` - Direct any AI agent to implement or complete code
  - Use when you want AI to write implementation
  - Can specify particular agents like `@cursor`, `@claude`, `@copilot`
  - Combine with other tags for context

```javascript
// :A: @agent implement pagination
// :A: ctx use cursor-based pagination, not offset
// :A: requirement handle empty results gracefully
class PostsList {
  async fetchPosts(cursor?: string) {
    // :A: todo implementation needed
    throw new Error("Not implemented");
  }
}
```

### Implementation Guidance
- `:A: ctx` - Critical information AI needs to know
  - Document assumptions that aren't obvious from code
  - Explain business rules or constraints
  - Clarify architectural decisions

```python
# :A: ctx user_ids are UUIDs, not sequential integers
# :A: ctx all timestamps are UTC, convert for display only
class UserService:
    # :A: @agent implement with proper timezone handling
    def get_user_activity(self, user_id: str, date: datetime):
        # :A: sec validate UUID format
        pass
```

### Code Review Requests
- `:A: review` - Mark code for AI or human review
  - Security implications
  - Performance concerns
  - Best practices

```go
// :A: review check for race conditions
// :A: ctx concurrent access from multiple goroutines
func (c *Cache) Set(key string, value interface{}) {
    // :A: todo add mutex protection
    c.data[key] = value
}
```

---

## 2. Security Patterns

### Input Validation
- `:A: sec` - Mark security-critical code
  - Input sanitization points
  - Authentication boundaries
  - Sensitive data handling

```javascript
// :A: sec validate all user inputs
// :A: ctx prevent SQL injection and XSS
function updateUserProfile(userId, profileData) {
  // :A: todo sanitize HTML content
  // :A: sec check user owns this profile
  const query = `UPDATE users SET profile = ? WHERE id = ?`;
  return db.execute(query, [profileData, userId]);
}
```

### Authentication & Authorization
- `:A: auth` - Authentication/authorization checkpoints
  - Permission boundaries
  - Token validation
  - Access control

```python
# :A: auth verify user permissions
# :A: sec ensure proper scoping
@require_auth
def delete_resource(resource_id: str, user: User):
    # :A: ctx only owners and admins can delete
    resource = Resource.get(resource_id)
    
    # :A: sec prevent unauthorized access
    if resource.owner_id != user.id and not user.is_admin:
        raise Forbidden("Cannot delete resource")
    
    # :A: audit log deletion for compliance
    audit_log.record("resource_deleted", resource_id, user.id)
    resource.delete()
```

---

## 3. Performance Optimization

### Database Queries
- `:A: perf` - Performance-sensitive code
  - N+1 query problems
  - Inefficient algorithms
  - Resource-intensive operations

```ruby
# :A: perf N+1 query detected
# :A: ctx each post triggers separate comment count query
def get_posts_with_stats
  posts = Post.all
  
  # :A: todo use includes or join
  posts.map do |post|
    {
      title: post.title,
      # :A: perf this hits DB for each post
      comment_count: post.comments.count,
      author: post.author.name
    }
  end
end
```

### Caching Opportunities
- `:A: cache` - Places where caching would help
  - Expensive computations
  - Frequent API calls
  - Static data

```typescript
// :A: cache expensive calculation
// :A: ctx called on every request
function calculatePricing(items: CartItem[]): number {
  // :A: perf consider memoization
  // :A: todo add Redis caching with TTL
  return items.reduce((total, item) => {
    const discount = calculateComplexDiscount(item);
    return total + (item.price * item.quantity * discount);
  }, 0);
}
```

---

## 4. Code Quality & Maintenance

### Temporary Code
- `:A: tmp` - Code that should be removed
  - Workarounds for bugs
  - Quick fixes
  - Migration shims

```javascript
// :A: tmp remove after Chrome 120 fix ships
// :A: ctx workaround for scrolling bug
// :A: issue(CHR-4823) track browser fix
function patchChromeScroll() {
  if (navigator.userAgent.includes('Chrome/120')) {
    // :A: tmp force repaint hack
    document.body.style.display = 'none';
    document.body.offsetHeight; // trigger reflow
    document.body.style.display = '';
  }
}
```

### Technical Debt
- `:A: debt` - Known technical debt
  - Shortcuts taken
  - Refactoring needed
  - Architecture improvements

```python
# :A: debt refactor to use dependency injection
# :A: ctx tightly coupled to database implementation
class OrderService:
    def __init__(self):
        # :A: debt hardcoded connection
        self.db = PostgresConnection("prod-db-url")
    
    # :A: todo make database configurable
    def process_order(self, order_data):
        # :A: debt extract validation logic
        if not self._validate_order(order_data):
            return False
        
        # :A: ctx 500+ lines of business logic below
        # :A: refactor split into smaller methods
```

---

## 5. Documentation & Context

### API Documentation
- `:A: docs` - Documentation needed
  - API endpoints
  - Complex algorithms
  - Public interfaces

```rust
// :A: docs add comprehensive examples
// :A: api public interface - maintain compatibility
// :A: ctx returns Err for invalid inputs, not panic
pub fn parse_config(path: &Path) -> Result<Config, ConfigError> {
    // :A: docs explain config file format
    // :A: example show valid TOML structure
    let contents = fs::read_to_string(path)
        .map_err(|e| ConfigError::IoError(e))?;
    
    // :A: docs list all possible error types
    toml::from_str(&contents)
        .map_err(|e| ConfigError::ParseError(e.to_string()))
}
```

### Business Logic
- `:A: business` - Business rule documentation
  - Domain logic
  - Compliance requirements
  - Policy implementations

```java
// :A: business payment processing rules
// :A: ctx max transaction: $10,000
// :A: compliance PCI-DSS requirements
public class PaymentProcessor {
    // :A: business retry failed payments up to 3 times
    // :A: ctx exponential backoff: 1s, 2s, 4s
    public PaymentResult processPayment(Payment payment) {
        // :A: audit log all payment attempts
        // :A: sec never log full card numbers
        
        // :A: business validate amount limits
        if (payment.getAmount() > 10000) {
            // :A: ctx requires manual approval
            return PaymentResult.requiresApproval();
        }
        
        // :A: todo implement retry logic
        return attemptPayment(payment);
    }
}
```

---

## 6. Testing & Quality Assurance

### Test Coverage
- `:A: test` - Testing requirements
  - Missing tests
  - Edge cases
  - Test scenarios

```typescript
// :A: test needs comprehensive unit tests
// :A: ctx handle null, undefined, empty arrays
export function mergeConfigs(...configs: Config[]): Config {
  // :A: test edge case: circular references
  // :A: test edge case: conflicting values
  
  // :A: @agent write tests for all edge cases
  return configs.reduce((merged, config) => {
    return deepMerge(merged, config);
  }, {});
}
```

### Error Handling
- `:A: error` - Error handling needed
  - Missing try-catch
  - Unhandled edge cases
  - Error recovery

```go
// :A: error add proper error handling
// :A: ctx network calls can fail
func FetchUserData(userID string) (*User, error) {
    // :A: todo handle timeout errors
    resp, err := http.Get(fmt.Sprintf("/api/users/%s", userID))
    if err != nil {
        // :A: error add retry logic
        return nil, err
    }
    
    // :A: error check response status
    // :A: ctx API returns 404 for missing users
    var user User
    json.NewDecoder(resp.Body).Decode(&user)
    return &user, nil
}
```

---

## 7. Feature Development

### Feature Flags
- `:A: feature` - Feature-flagged code
  - Experimental features
  - Gradual rollouts
  - A/B tests

```python
# :A: feature new checkout flow
# :A: ctx 10% rollout to test conversion
# :A: metrics track success rate
def checkout_process(cart: Cart, user: User) -> Order:
    # :A: feature check flag status
    if feature_flags.is_enabled("new-checkout-v2", user):
        # :A: todo implement new flow
        # :A: @agent create optimized checkout
        return new_checkout_flow(cart, user)
    else:
        # :A: deprecated remove after full rollout
        return legacy_checkout(cart, user)
```

### API Versioning
- `:A: version` - Version-specific code
  - API compatibility
  - Migration paths
  - Deprecation notices

```javascript
// :A: version v2 API endpoint
// :A: deprecated v1 endpoint - remove in v3
router.post('/api/v2/users', async (req, res) => {
  // :A: breaking returns different response format
  // :A: migration guide at docs/v2-migration.md
  
  // :A: ctx v2 uses JSON:API format
  const user = await createUser(req.body);
  
  // :A: todo add pagination headers
  res.json({
    data: {
      type: 'users',
      id: user.id,
      attributes: user
    }
  });
});
```

---

## 8. Integration Points

### External Services
- `:A: integration` - External service touchpoints
  - API calls
  - Third-party libraries
  - Service dependencies

```ruby
# :A: integration Stripe payment API
# :A: ctx requires API key in env vars
# :A: error handle rate limiting (429)
class PaymentGateway
  # :A: todo add circuit breaker
  # :A: ctx timeout after 30 seconds
  def charge_card(amount, token)
    # :A: sec never log tokens
    # :A: audit record all transactions
    
    begin
      # :A: integration Stripe charge creation
      # :A: docs see https://stripe.com/docs/api/charges
      Stripe::Charge.create(
        amount: amount,
        currency: 'usd',
        source: token
      )
    rescue Stripe::RateLimitError => e
      # :A: todo implement exponential backoff
      raise PaymentError.new("Rate limited")
    end
  end
end
```

---

## 9. Search Patterns

### Finding Work
```bash
# All AI agent tasks
rg ":A: @agent"

# Security issues
rg ":A: sec"

# Performance problems
rg ":A: perf"

# Temporary code to remove
rg ":A: tmp"
```

### Finding Context
```bash
# All contextual information
rg ":A: ctx"

# Business rules
rg ":A: business"

# Integration points
rg ":A: integration"
```

### Complex Searches
```bash
# Security TODOs
rg ":A: sec.*todo|:A: todo.*security"

# AI tasks with context
rg -B2 -A2 ":A: @agent"

# Temporary code with deadlines
rg ":A: tmp.*2024"
```

---

## 10. Best Practices

1. **Layer your tags**: Combine tags for richer meaning
   ```javascript
   // :A: sec,todo,p0 critical auth fix needed
   ```

2. **Add context liberally**: More context helps AI and humans
   ```python
   # :A: ctx database uses UTC timestamps
   # :A: ctx user_ids are case-sensitive
   ```

3. **Be specific with AI instructions**:
   ```javascript
   // :A: @agent implement using async/await, not callbacks
   // :A: @agent add comprehensive error handling
   ```

4. **Link to external resources**:
   ```go
   // :A: docs see RFC-7231 section 6.5.1
   // :A: issue(PROJ-123) tracking in Jira
   ```

5. **Use consistent vocabulary**: Define patterns for your team
   ```ruby
   # Team convention:
   # :A: shipit - ready for production
   # :A: holdup - needs review before merge
   # :A: dragon - here be dragons, proceed carefully
   ```

The goal is to help make codebases more discoverable. Well-placed Magic Anchors can serve as waypoints through your code.