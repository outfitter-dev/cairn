<!-- tldr ::: exploring integration patterns between waymarks and JSDoc/TSDoc documentation -->

# Waymarks and JSDoc/TSDoc Integration

## Status
- **Type**: Proposal
- **Status**: Draft
- **Created**: 2025-01-20
- **Author**: @mg

## Summary

This proposal explores integration patterns between waymarks and JSDoc/TSDoc documentation systems, examining how these complementary systems can work together to provide comprehensive code documentation and navigation.

## Motivation

While waymarks excel at creating grep-friendly navigation points and task tracking, JSDoc/TSDoc provides type information and API documentation. Developers shouldn't have to choose between these systems - they should work together seamlessly.

## Integration Patterns

### 1. Adjacent Comments (Recommended)

Keep waymarks in separate comments adjacent to JSDoc blocks:

```javascript
// tldr ::: user authentication service
// !todo ::: @alice add rate limiting #security #api
/**
 * Handles user authentication and session management.
 * Provides methods for login, logout, and token validation.
 * 
 * @class AuthService
 * @implements {IAuthService}
 */
class AuthService {
    // fixme ::: token expiry not checked properly #security
    /**
     * Authenticates a user with credentials.
     * 
     * @param {string} username - User's username
     * @param {string} password - User's password
     * @returns {Promise<AuthResult>} Authentication result
     * @throws {AuthError} When credentials are invalid
     */
    async authenticate(username, password) {
        // Implementation
    }
}
```

**Benefits:**
- Clean separation of concerns
- No tooling conflicts
- Both systems remain pure
- Easy to migrate existing code

### 2. Embedded Waymarks (Experimental)

Place waymarks as the first lines within JSDoc blocks:

```javascript
/**
 * tldr ::: payment processing module
 * !todo ::: @team migrate to Stripe v3 #deadline:2024-02
 * about ::: ##modules/payments Core payment operations
 * 
 * This module handles all payment processing operations,
 * including one-time payments and subscriptions.
 * 
 * @module payments
 * @since 2.0.0
 */
```

**Benefits:**
- Single documentation block
- Waymarks appear in IDE tooltips
- Preserved during refactoring

**Challenges:**
- Appears in generated documentation
- May conflict with strict linters
- Requires tooling updates

### 3. Hybrid Approach

Use adjacent comments for work items, embedded for stable references:

```javascript
// !todo ::: @alice optimize query performance #perf
/**
 * about ::: ##api/users/list User listing endpoint
 * 
 * Retrieves paginated list of users with optional filters.
 * 
 * @async
 * @param {ListOptions} options - Pagination and filter options
 * @returns {Promise<UserList>} Paginated user results
 */
async function listUsers(options) {
    // Implementation
}
```

## Complementary Roles

### What JSDoc/TSDoc Provides
- Type information and signatures
- Parameter descriptions
- Return value documentation
- Example usage
- API contracts
- Generated documentation

### What Waymarks Provide
- Task tracking and assignment
- Cross-reference navigation
- Issue linking
- Performance annotations
- Security boundaries
- Grep-friendly discovery

## Practical Guidelines

### 1. Use JSDoc for API Documentation
```javascript
/**
 * Validates an email address format.
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 * @example
 * validateEmail('user@example.com') // returns true
 */
```

### 2. Use Waymarks for Navigation and Tasks
```javascript
// todo ::: @alice add regex for international domains #i18n
// perf ::: consider caching validation results #hotpath
function validateEmail(email) {
    // Implementation
}
```

### 3. Combine for Complete Context
```javascript
// about ::: ##utils/validation/email Email validation utilities
// notice ::: moving to @company/validators in v3 #deprecation
/**
 * Email validation utility module.
 * Provides RFC-compliant email validation with extended support.
 * 
 * @module utils/validation/email
 * @deprecated Will be moved to @company/validators in v3
 */
```

## Tooling Considerations

### Documentation Generators

For embedded waymarks, use preprocessing to filter:

```javascript
// jsdoc.config.js
module.exports = {
  plugins: ['plugins/waymark-filter'],
  opts: {
    filter: function(comment) {
      // Remove waymark lines from documentation
      return comment.replace(/^\s*\*?\s*\w+\s*:::[^\n]*/gm, '');
    }
  }
};
```

### Linter Configuration

Allow waymark patterns in JSDoc:

```json
{
  "rules": {
    "jsdoc/match-description": ["error", {
      "matchDescription": "^(?:\\w+\\s*:::|[A-Z])"
    }]
  }
}
```

### IDE Support

Future IDE extensions could:
- Highlight waymarks differently within JSDoc
- Provide quick actions for waymark tasks
- Show waymark information in separate tooltip sections

## Migration Strategy

For existing codebases:

1. **Phase 1**: Add waymarks as adjacent comments
2. **Phase 2**: Identify stable documentation waymarks
3. **Phase 3**: Optionally embed stable waymarks in JSDoc
4. **Phase 4**: Update tooling to handle embedded waymarks

## Examples

### TypeScript with TSDoc
```typescript
// !fixme ::: @team type narrowing too broad #types
/** 
 * Processes user input with validation.
 * 
 * @remarks
 * This function needs better type narrowing for the return type.
 * 
 * @param input - Raw user input
 * @returns Processed result or error
 */
function processInput(input: unknown): Result<ProcessedData, ValidationError> {
    // Implementation
}
```

### Complex Service with Multiple Concerns
```javascript
// tldr ::: core authentication service with JWT
// !todo ::: @security implement refresh token rotation #security
// notice ::: rate limiting added in v2.1 #features
/**
 * JWT-based authentication service.
 * 
 * Handles user authentication using JSON Web Tokens with
 * automatic refresh and rate limiting capabilities.
 * 
 * @class JWTAuthService
 * @extends {BaseAuthService}
 * @since 2.0.0
 * @see {@link https://jwt.io/introduction}
 */
class JWTAuthService extends BaseAuthService {
    // Implementation
}
```

### API Endpoint Documentation
```javascript
// about ::: ##api/v2/users User management endpoints
// notice ::: breaking changes from v1 #migration
/**
 * Creates a new user account.
 * 
 * @route POST /api/v2/users
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 * @throws {ValidationError} 400 - Invalid user data
 * @throws {ConflictError} 409 - Email already exists
 */
async function createUser(req, res) {
    // Implementation
}
```

## Conclusion

Waymarks and JSDoc/TSDoc serve complementary purposes and can coexist effectively. The adjacent comment pattern provides the cleanest integration, while embedded waymarks offer interesting possibilities for future tooling development.

The key principle: use JSDoc for API documentation and type information, use waymarks for navigation, task tracking, and cross-referencing. Together, they create a comprehensive documentation system that serves both human developers and AI assistants.

## Future Considerations

1. **Standardized Embedding**: Define official patterns for embedded waymarks
2. **Tooling Support**: Build plugins for major documentation generators
3. **IDE Integration**: Develop extensions that understand both systems
4. **AI Optimization**: Train AI assistants to leverage both information sources

## References

- [JSDoc Documentation](https://jsdoc.app/)
- [TSDoc Specification](https://tsdoc.org/)
- [Waymark Syntax Specification](../syntax/SPEC.md)