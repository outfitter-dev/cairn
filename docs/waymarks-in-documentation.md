# Waymarks in Documentation
<!-- :M: tldr Waymarks complement JSDoc, docstrings, and other doc systems -->
<!-- :M: guide How waymarks enhance existing documentation -->

Waymarks enhance existing documentation comments with searchable markers, without replacing or interfering with standard practices.

## Core Principle

**Waymarks complement your existing documentation** - they're just searchable tags within comments:

- Documentation generators ignore waymarks
- Search tools find them easily across all languages
- Existing tooling continues working unchanged
- Progressive enhancement of current codebases

## Examples

### JavaScript with JSDoc

Waymarks add searchability to standard JSDoc:

```javascript
/**
 * Calculates the total price including tax
 * @param {number} price - Base price
 * @param {number} taxRate - Tax rate as decimal
 * @returns {number} Total price with tax
 * :M: todo add currency conversion support
 * :M: ctx assumes USD for now
 */
function calculateTotal(price, taxRate) {
  // :M: perf consider caching for repeated calculations
  return price * (1 + taxRate);
}
```

### Python with Docstrings

Works with any docstring format:

```python
def process_order(order_data: dict) -> Order:
    """
    Process a customer order through the payment system.
    
    Args:
        order_data: Dictionary containing order details
        
    Returns:
        Processed Order object
        
    Raises:
        ValidationError: If order data is invalid
        PaymentError: If payment processing fails
    
    :M: sec validate all payment data
    :M: todo add retry logic for failed payments
    """
    # :M: ctx payment gateway has 30s timeout
    # :M: business max transaction amount is $10,000
    pass
```

### TypeScript Interfaces

```typescript
/**
 * User profile data structure
 * :M: api public interface - maintain compatibility
 */
interface UserProfile {
  id: string;           // :M: ctx UUID v4 format
  email: string;        // :M: sec PII - handle carefully
  preferences: {
    theme: 'light' | 'dark';  // :M: feature dark mode support
    notifications: boolean;    // :M: todo implement notification system
  };
}
```

### Go Documentation

```go
// Package auth provides HTTP authentication middleware.
// :M: sec validate all auth headers before processing
//
// Basic usage:
//   handler := auth.Middleware(yourHandler)
//   http.Handle("/api/", handler)
package auth

// Middleware provides HTTP authentication for web services.
// :M: api primary entry point for HTTP auth
func Middleware(next http.Handler) http.Handler {
    // :M: ctx assumes Authorization header format: "Bearer <token>"
    // :M: perf cache token validation results
}
```

### Rust Documentation

```rust
/// User authentication trait definition
/// :M: api public trait for auth providers
/// :M: sec ensure constant-time comparison for tokens
/// 
/// # Examples
/// ```
/// let auth = AuthProvider::new();
/// let result = auth.validate_token(&token).await?;
/// ```
pub trait AuthProvider {
    /// :M: todo add token refresh support
    async fn validate_token(&self, token: &str) -> Result<User, AuthError>;
}
```

## Integration Benefits

### 1. Works with All Doc Generators

- **JSDoc/TSDoc**: Generates documentation normally
- **Sphinx/Doxygen**: Processes without issues
- **rustdoc/godoc**: Renders documentation unchanged
- **IDE tooltips**: Continue showing helpful information

### 2. Universal Search

Find waymarks across any language:

```bash
# All waymarks
rg ":M:"

# Security issues across all languages
rg ":M: sec"

# AI tasks in JavaScript/TypeScript
rg ":M: @agent" --type js

# TODOs in documentation blocks
rg -U "(?:\/\*\*|\"\"\"|\#\#)[\s\S]*?:M: todo"
```

### 3. Zero Configuration

No setup required:
- Add waymarks to existing comments
- Search with standard tools
- Documentation continues as normal

## Best Practices

### 1. Place Waymarks Strategically

In documentation blocks:
```javascript
/**
 * Main description here
 * 
 * @param x Parameter description
 * :M: todo validate parameter range
 * :M: sec sanitize user input
 */
```

In inline comments:
```python
def calculate_risk(portfolio):
    # :M: business risk tolerance is 0.05
    # :M: perf cache calculation results
    return complex_calculation(portfolio)
```

### 2. Keep Documentation Primary

Waymarks enhance, not replace:
- Write complete JSDoc/docstrings first
- Add waymarks for searchable concerns
- Don't duplicate information

### 3. Use Consistent Patterns

Team conventions matter:
```yaml
# In your README or CONTRIBUTING.md
Waymark Conventions:
- :M: todo - work items
- :M: sec - security concerns  
- :M: api - public interfaces
- :M: ctx - important context
```

## Common Patterns

### API Documentation

```java
/**
 * Retrieves user by ID
 * 
 * @param userId User identifier
 * @return User object
 * @throws UserNotFoundException
 * 
 * :M: api public REST endpoint
 * :M: sec verify caller permissions
 */
public User getUser(String userId) { }
```

### Test Documentation

```javascript
describe('PaymentProcessor', () => {
  // :M: test missing edge cases
  // :M: ctx mock external payment gateway
  
  it('should handle successful payments', () => {
    // :M: todo test with different currencies
  });
});
```

### Configuration Files

```yaml
# Database configuration
# :M: config production values
# :M: sec use environment variables for passwords
database:
  host: ${DB_HOST}
  port: 5432
  # :M: perf connection pool tuning
  pool_size: 20
```

## Migration Strategy

Adding waymarks to existing code:

1. **Start with high-value locations**:
   - Public APIs
   - Security-critical code
   - Complex business logic

2. **Add incrementally**:
   ```bash
   # Find undocumented TODOs
   rg "TODO(?!.*:M:)" --type js
   
   # Add waymarks gradually
   # TODO: implement caching
   # TODO :M: todo implement caching
   ```

3. **Preserve existing tools**:
   - Run documentation generators
   - Verify IDE features work
   - Check linting passes

## Summary

Waymarks provide a lightweight enhancement to existing documentation:

- **Non-invasive**: Just comments within comments
- **Language-agnostic**: Works everywhere
- **Tool-friendly**: No configuration needed
- **Searchable**: Find anything with `rg ":M:"`

Start with one waymark today. Add `:M: todo` to your next TODO comment and see how it improves discoverability.