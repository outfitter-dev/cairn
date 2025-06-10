# Cairn Examples
<!-- :M: tldr Real-world examples of cairn usage patterns -->
<!-- :M: example Comprehensive examples for AI agents and developers -->

*Examples and patterns for working with Cairns*

---

## 1. AI Agent Workflows

### Task Delegation
- `:M: @agent` - Direct any AI agent to implement or complete code
  - Use when you want AI to write implementation
  - Can specify particular agents like `@cursor`, `@claude`, `@copilot`
  - Combine with other tags for context

```javascript
// :M: @agent implement pagination
// :M: ctx use cursor-based pagination, not offset
// :M: requirement handle empty results gracefully
class PostsList {
  async fetchPosts(cursor?: string) {
    // :M: todo implementation needed
    throw new Error("Not implemented");
  }
}
```

### Implementation Guidance
- `:M: ctx` - Critical information AI needs to know
  - Document assumptions that aren't obvious from code
  - Explain business rules or constraints
  - Clarify architectural decisions

```python
# :M: ctx user_ids are UUIDs, not sequential integers
# :M: ctx all timestamps are UTC, convert for display only
class UserService:
    # :M: @agent implement with proper timezone handling
    def get_user_activity(self, user_id: str, date: datetime):
        # :M: sec validate UUID format
        pass
```

### Code Review Requests
- `:M: review` - Mark code for AI or human review
  - Security implications
  - Performance concerns
  - Best practices

```go
// :M: review check for race conditions
// :M: ctx concurrent access from multiple goroutines
func (c *Cache) Set(key string, value interface{}) {
    // :M: todo add mutex protection
    c.data[key] = value
}
```

---

## 2. Security Patterns

### Input Validation
- `:M: sec` - Mark security-critical code
  - Input sanitization points
  - Authentication boundaries
  - Sensitive data handling

```javascript
// :M: sec validate all user inputs
// :M: ctx prevent SQL injection and XSS
function updateUserProfile(userId, profileData) {
  // :M: todo sanitize HTML content
  // :M: sec check user owns this profile
  const query = `UPDATE users SET profile = ? WHERE id = ?`;
  return db.execute(query, [profileData, userId]);
}
```

### Authentication & Authorization
- `:M: auth` - Authentication/authorization checkpoints
  - Permission boundaries
  - Token validation
  - Access control

```python
# :M: auth verify user permissions
# :M: sec ensure proper scoping
@require_auth
def delete_resource(resource_id: str, user: User):
    # :M: ctx only owners and admins can delete
    resource = Resource.get(resource_id)
    
    # :M: sec prevent unauthorized access
    if resource.owner_id != user.id and not user.is_admin:
        raise Forbidden("Cannot delete resource")
    
    # :M: audit log deletion for compliance
    audit_log.record("resource_deleted", resource_id, user.id)
    resource.delete()
```

---

## 3. Performance Optimization

### Database Queries
- `:M: perf` - Performance-sensitive code
  - N+1 query problems
  - Inefficient algorithms
  - Resource-intensive operations

```ruby
# :M: perf N+1 query detected
# :M: ctx each post triggers separate comment count query
def get_posts_with_stats
  posts = Post.all
  
  # :M: todo use includes or join
  posts.map do |post|
    {
      title: post.title,
      # :M: perf this hits DB for each post
      comment_count: post.comments.count,
      author: post.author.name
    }
  end
end
```

### Caching Opportunities
- `:M: cache` - Places where caching would help
  - Expensive computations
  - Frequent API calls
  - Static data

```typescript
// :M: cache expensive calculation
// :M: ctx called on every request
function calculatePricing(items: CartItem[]): number {
  // :M: perf consider memoization
  // :M: todo add Redis caching with TTL
  return items.reduce((total, item) => {
    const discount = calculateComplexDiscount(item);
    return total + (item.price * item.quantity * discount);
  }, 0);
}
```

---

## 4. Code Quality & Maintenance

### Temporary Code
- `:M: temp` - Code that should be removed
  - Workarounds for bugs
  - Quick fixes
  - Migration shims

```javascript
// :M: temp remove after Chrome 120 fix ships
// :M: ctx workaround for scrolling bug
// :M: issue(CHR-4823) track browser fix
function patchChromeScroll() {
  if (navigator.userAgent.includes('Chrome/120')) {
    // :M: temp force repaint hack
    document.body.style.display = 'none';
    document.body.offsetHeight; // trigger reflow
    document.body.style.display = '';
  }
}
```

### Technical Debt
- `:M: debt` - Known technical debt
  - Shortcuts taken
  - Refactoring needed
  - Architecture improvements

```python
# :M: debt refactor to use dependency injection
# :M: ctx tightly coupled to database implementation
class OrderService:
    def __init__(self):
        # :M: debt hardcoded connection
        self.db = PostgresConnection("prod-db-url")
    
    # :M: todo make database configurable
    def process_order(self, order_data):
        # :M: debt extract validation logic
        if not self._validate_order(order_data):
            return False
        
        # :M: ctx 500+ lines of business logic below
        # :M: refactor split into smaller methods
```

---

## 5. Documentation & Context

### API Documentation
- `:M: docs` - Documentation needed
  - API endpoints
  - Complex algorithms
  - Public interfaces

```rust
// :M: docs add comprehensive examples
// :M: api public interface - maintain compatibility
// :M: ctx returns Err for invalid inputs, not panic
pub fn parse_config(path: &Path) -> Result<Config, ConfigError> {
    // :M: docs explain config file format
    // :M: example show valid TOML structure
    let contents = fs::read_to_string(path)
        .map_err(|e| ConfigError::IoError(e))?;
    
    // :M: docs list all possible error types
    toml::from_str(&contents)
        .map_err(|e| ConfigError::ParseError(e.to_string()))
}
```

### Business Logic
- `:M: business` - Business rule documentation
  - Domain logic
  - Compliance requirements
  - Policy implementations

```java
// :M: business payment processing rules
// :M: ctx max transaction: $10,000
// :M: compliance PCI-DSS requirements
public class PaymentProcessor {
    // :M: business retry failed payments up to 3 times
    // :M: ctx exponential backoff: 1s, 2s, 4s
    public PaymentResult processPayment(Payment payment) {
        // :M: audit log all payment attempts
        // :M: sec never log full card numbers
        
        // :M: business validate amount limits
        if (payment.getAmount() > 10000) {
            // :M: ctx requires manual approval
            return PaymentResult.requiresApproval();
        }
        
        // :M: todo implement retry logic
        return attemptPayment(payment);
    }
}
```

---

## 6. Testing & Quality Assurance

### Test Coverage
- `:M: test` - Testing requirements
  - Missing tests
  - Edge cases
  - Test scenarios

```typescript
// :M: test needs comprehensive unit tests
// :M: ctx handle null, undefined, empty arrays
export function mergeConfigs(...configs: Config[]): Config {
  // :M: test edge case: circular references
  // :M: test edge case: conflicting values
  
  // :M: @agent write tests for all edge cases
  return configs.reduce((merged, config) => {
    return deepMerge(merged, config);
  }, {});
}
```

### Error Handling
- `:M: error` - Error handling needed
  - Missing try-catch
  - Unhandled edge cases
  - Error recovery

```go
// :M: error add proper error handling
// :M: ctx network calls can fail
func FetchUserData(userID string) (*User, error) {
    // :M: todo handle timeout errors
    resp, err := http.Get(fmt.Sprintf("/api/users/%s", userID))
    if err != nil {
        // :M: error add retry logic
        return nil, err
    }
    
    // :M: error check response status
    // :M: ctx API returns 404 for missing users
    var user User
    json.NewDecoder(resp.Body).Decode(&user)
    return &user, nil
}
```

---

## 7. Feature Development

### Feature Flags
- `:M: feature` - Feature-flagged code
  - Experimental features
  - Gradual rollouts
  - A/B tests

```python
# :M: feature new checkout flow
# :M: ctx 10% rollout to test conversion
# :M: metrics track success rate
def checkout_process(cart: Cart, user: User) -> Order:
    # :M: feature check flag status
    if feature_flags.is_enabled("new-checkout-v2", user):
        # :M: todo implement new flow
        # :M: @agent create optimized checkout
        return new_checkout_flow(cart, user)
    else:
        # :M: deprecated remove after full rollout
        return legacy_checkout(cart, user)
```

### API Versioning
- `:M: version` - Version-specific code
  - API compatibility
  - Migration paths
  - Deprecation notices

```javascript
// :M: version v2 API endpoint
// :M: deprecated v1 endpoint - remove in v3
router.post('/api/v2/users', async (req, res) => {
  // :M: breaking returns different response format
  // :M: migration guide at docs/v2-migration.md
  
  // :M: ctx v2 uses JSON:API format
  const user = await createUser(req.body);
  
  // :M: todo add pagination headers
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
- `:M: integration` - External service touchpoints
  - API calls
  - Third-party libraries
  - Service dependencies

```ruby
# :M: integration Stripe payment API
# :M: ctx requires API key in env vars
# :M: error handle rate limiting (429)
class PaymentGateway
  # :M: todo add circuit breaker
  # :M: ctx timeout after 30 seconds
  def charge_card(amount, token)
    # :M: sec never log tokens
    # :M: audit record all transactions
    
    begin
      # :M: integration Stripe charge creation
      # :M: docs see https://stripe.com/docs/api/charges
      Stripe::Charge.create(
        amount: amount,
        currency: 'usd',
        source: token
      )
    rescue Stripe::RateLimitError => e
      # :M: todo implement exponential backoff
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
rg ":M: @agent"

# Security issues
rg ":M: sec"

# Performance problems
rg ":M: perf"

# Temporary code to remove
rg ":M: temp"
```

### Finding Context
```bash
# All contextual information
rg ":M: ctx"

# Business rules
rg ":M: business"

# Integration points
rg ":M: integration"
```

### Complex Searches
```bash
# Security TODOs
rg ":M: sec.*todo|:M: todo.*security"

# AI tasks with context
rg -B2 -A2 ":M: @agent"

# Temporary code with deadlines
rg ":M: temp.*2024"
```

---

## 10. Best Practices

1. **Layer your tags**: Combine tags for richer meaning
   ```javascript
   // :M: sec,todo,p0 critical auth fix needed
   ```

2. **Add context liberally**: More context helps AI and humans
   ```python
   # :M: ctx database uses UTC timestamps
   # :M: ctx user_ids are case-sensitive
   ```

3. **Be specific with AI instructions**:
   ```javascript
   // :M: @agent implement using async/await, not callbacks
   // :M: @agent add comprehensive error handling
   ```

4. **Link to external resources**:
   ```go
   // :M: docs see RFC-7231 section 6.5.1
   // :M: issue(PROJ-123) tracking in Jira
   ```

5. **Use consistent vocabulary**: Define patterns for your team
   ```ruby
   # Team convention:
   # :M: shipit - ready for production
   # :M: holdup - needs review before merge
   # :M: dragon - here be dragons, proceed carefully
   ```

The goal is to help make codebases more discoverable. Well-placed Cairns can serve as waypoints through your code.