# Documentation System Integration
<!-- :A: tldr Magic Anchors compatibility with JSDoc, docstrings, and other documentation systems -->
<!-- :A: convention Cross-language documentation integration patterns -->

## Table of Contents

- [Core Compatibility Principle](#core-compatibility-principle)
- [JavaScript Ecosystem](#javascript-ecosystem)
  - [JSDoc/TSDoc/ESDoc](#jsdoctscocdesdoc)
  - [Inline Comments](#inline-comments)
- [Python Ecosystem](#python-ecosystem)
  - [Docstrings (All Formats)](#docstrings-all-formats)
    - [Google Style](#google-style)
    - [NumPy Style](#numpy-style)
    - [Sphinx (reStructuredText)](#sphinx-restructuredtext)
- [Systems Languages](#systems-languages)
  - [Rust Documentation (Rustdoc)](#rust-documentation-rustdoc)
  - [Go Documentation (Godoc)](#go-documentation-godoc)
  - [C/C++ Documentation (Doxygen)](#cc-documentation-doxygen)
- [Enterprise Languages](#enterprise-languages)
  - [Java Documentation (Javadoc)](#java-documentation-javadoc)
  - [C# Documentation (XML Documentation)](#c-documentation-xml-documentation)
- [Dynamic Languages](#dynamic-languages)
  - [Ruby Documentation (RDoc/YARD)](#ruby-documentation-rdocyard)
  - [PHP Documentation (phpDocumentor)](#php-documentation-phpdocumentor)
- [Mobile Development](#mobile-development)
  - [Swift Documentation](#swift-documentation)
  - [Kotlin Documentation (KDoc)](#kotlin-documentation-kdoc)
- [Universal Search Patterns](#universal-search-patterns)
  - [Language-Specific Searches](#language-specific-searches)
  - [Cross-Language Searches](#cross-language-searches)
  - [Context-Aware Searches](#context-aware-searches)
- [Recommended Positioning](#recommended-positioning)
- [Migration Strategies](#migration-strategies)
  - [Adding to Existing Documentation](#adding-to-existing-documentation)
  - [Example Migration Script](#example-migration-script)
- [Best Practices](#best-practices)
  - [Universal Guidelines](#universal-guidelines)
  - [Language-Specific Tips](#language-specific-tips)
- [Conclusion](#conclusion)

Magic Anchors work seamlessly across all major documentation systems, because they're just comment content. This enables universal code navigation while preserving existing documentation workflows.

## Core Compatibility Principle

**Magic Anchors are documentation-system agnostic** - they work within any comment format:
- Documentation generators ignore Magic Anchor lines
- Search tools find anchors easily across all languages  
- Existing tooling continues working unchanged
- Progressive enhancement of current codebases

## JavaScript Ecosystem

### JSDoc/TSDoc/ESDoc

Perfect compatibility in block comments:

```javascript
/**
 * :A: tldr Core authentication utilities
 * :A: api Public interface for auth operations
 * :A: sec validate JWT signature and expiry
 * 
 * @description Handles user authentication with JWT tokens
 * @param {string} token - JWT token to validate  
 * @param {AuthOptions} options - Authentication configuration
 * @returns {Promise<Result<User, AuthError>>} Validation result
 * @throws {InvalidTokenError} When token format is invalid
 * @example
 * const result = await authenticateUser(token, { strict: true });
 * if (result.isOk()) {
 *   console.log('User:', result.value);
 * }
 */
async function authenticateUser(token, options = {}) {
  // :A: ctx assumes tokens are always Base64 encoded
  // :A: perf consider caching decoded tokens
  return validateJWT(token, options);
}
```

**Benefits:**
- JSDoc generators ignore Magic Anchor lines
- TypeScript tools work unchanged
- ESDoc processes normally
- VS Code intellisense preserved
- Search tools find anchors: `rg ":A: api" --type js`

### Inline Comments

Magic Anchors work in single-line comments too:

```typescript
// :A: todo @agent implement retry logic
const fetchUserData = async (id: string) => {
  // :A: ctx rate limit: 100 requests/minute
  return api.get(`/users/${id}`);
};
```

## Python Ecosystem

### Docstrings (All Formats)

Magic Anchors work with any docstring format:

#### Google Style
```python
def authenticate_user(token: str, strict: bool = False) -> Result[User, AuthError]:
    """
    :A: tldr Core user authentication function
    :A: sec validate JWT signature and expiry  
    :A: todo @agent add rate limiting
    
    Authenticates a user based on JWT token.
    
    Args:
        token: JWT token string to validate
        strict: Whether to use strict validation mode
        
    Returns:
        Result containing User object or AuthError
        
    Raises:
        InvalidTokenError: When token is malformed
        RateLimitError: When rate limit exceeded
        
    Examples:
        >>> result = authenticate_user("eyJ0eXAi...")
        >>> if result.is_ok():
        ...     print(f"Welcome {result.value.name}")
    """
```

#### NumPy Style  
```python
def calculate_metrics(data: np.ndarray) -> Dict[str, float]:
    """
    :A: tldr Statistical analysis functions
    :A: perf O(n) algorithm, efficient for large datasets
    :A: ctx assumes input data is normalized
    
    Calculate statistical metrics for input data.
    
    Parameters
    ----------
    data : np.ndarray
        Input array of numerical values
        
    Returns
    -------
    Dict[str, float]
        Dictionary containing calculated metrics
        
    Notes
    -----
    This function assumes the input is already normalized.
    Performance scales linearly with input size.
    """
```

#### Sphinx (reStructuredText)
```python
def process_documents(docs: List[str]) -> ProcessedDocs:
    """
    :A: tldr Document processing pipeline
    :A: api Main entry point for document processing
    :A: perf uses multiprocessing for large batches
    
    Process a collection of documents.
    
    :param docs: List of document strings to process
    :type docs: List[str]
    :param parallel: Enable parallel processing  
    :type parallel: bool
    :returns: Processed document collection
    :rtype: ProcessedDocs
    :raises DocumentError: When document format is invalid
    """
```

**Universal Benefits:**
- Sphinx documentation builds normally
- IDEs provide full intellisense
- All docstring tools work unchanged
- Search: `rg ":A: api" --type py`

## Systems Languages

### Rust Documentation (Rustdoc)

Seamless integration with Rust doc comments:

```rust
/// :A: tldr User authentication trait definition
/// :A: api Public trait for auth providers  
/// :A: sec ensure constant-time comparison for tokens
/// 
/// Provides authentication services for the application.
/// Supports multiple authentication backends including JWT,
/// OAuth2, and session-based authentication.
/// 
/// # Examples
/// 
/// ```rust
/// use auth::AuthProvider;
/// 
/// let auth = AuthProvider::new();
/// let result = auth.validate_token(&token).await?;
/// match result {
///     Ok(user) => println!("Welcome {}", user.name),
///     Err(e) => eprintln!("Auth failed: {}", e),
/// }
/// ```
/// 
/// # Safety
/// 
/// This trait assumes that implementations use secure
/// random number generation for token creation.
pub trait AuthProvider {
    /// :A: api Core validation method
    async fn validate_token(&self, token: &str) -> Result<User, AuthError>;
    
    /// :A: api Token generation with expiry
    async fn create_token(&self, user: &User) -> Result<String, AuthError>;
}

impl AuthProvider for JwtAuth {
    async fn validate_token(&self, token: &str) -> Result<User, AuthError> {
        // :A: sec timing attack protection - constant time comparison
        // :A: perf cache decoded tokens for repeated validation
        self.decode_and_validate(token).await
    }
}
```

**Benefits:**
- `cargo doc` renders normally, ignores Magic Anchors
- IDE integration preserved (rust-analyzer)
- Documentation tests continue working
- Search: `rg ":A: sec" --type rust`

### Go Documentation (Godoc)

Perfect compatibility with Go doc comments:

```go
// :A: tldr HTTP authentication middleware package
// :A: api Public middleware for web services
// :A: perf consider connection pooling for auth backends
//
// Package auth provides HTTP authentication middleware for web services.
// It supports JWT tokens, session-based auth, and OAuth2 flows.
//
// Basic usage:
//
//	handler := auth.Middleware(yourHandler)
//	http.Handle("/api/", handler)
//
// The middleware automatically validates authentication headers
// and populates request context with user information.
package auth

// :A: tldr Main authentication middleware function
// :A: api Primary entry point for HTTP auth
// :A: sec validate all auth headers before processing
//
// Middleware provides HTTP authentication for web services.
// It checks Authorization headers and validates tokens against
// configured authentication backends.
//
// The middleware sets these context values on successful auth:
//   - "user": authenticated User object
//   - "token": validated token string
//
// Usage:
//   handler := auth.Middleware(yourHandler)
//   http.Handle("/api/", handler)
func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// :A: ctx assumes Authorization header format: "Bearer <token>"
		// :A: perf cache token validation results
		// :A: sec prevent timing attacks during validation
		
		token := extractToken(r)
		if token == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		
		next.ServeHTTP(w, r)
	})
}
```

**Benefits:**
- `godoc` displays documentation normally
- Go tools work unchanged
- IDE support preserved (gopls)
- Search: `rg ":A: api" --type go`

### C/C++ Documentation (Doxygen)

Works perfectly in Doxygen comments:

```cpp
/**
 * :A: tldr Memory pool allocation utilities  
 * :A: perf critical path - optimized for speed
 * :A: unsafe manual memory management - review carefully
 * 
 * @brief Allocates memory from a pre-allocated pool
 * 
 * This function provides fast memory allocation from a pool
 * that was pre-allocated during system initialization.
 * 
 * @param size Number of bytes to allocate
 * @param alignment Memory alignment requirement (must be power of 2)
 * @return Pointer to allocated memory or nullptr on failure
 * 
 * @warning This function does not perform bounds checking.
 *          Caller must ensure size is within pool limits.
 * 
 * @see pool_free() To deallocate memory
 * @see pool_init() To initialize the memory pool
 * 
 * @code
 * void* ptr = pool_alloc(1024, 8);
 * if (ptr) {
 *     // Use allocated memory
 *     pool_free(ptr);
 * }
 * @endcode
 */
void* pool_alloc(size_t size, size_t alignment) {
    // :A: ctx pool must be initialized before first call
    // :A: perf O(1) allocation using bitmap tracking
    // :A: unsafe no bounds checking - caller responsibility
    
    if (!is_power_of_two(alignment)) {
        return nullptr;
    }
    
    return allocate_from_pool(size, alignment);
}
```

## Enterprise Languages

### Java Documentation (Javadoc)

Perfect compatibility:

```java
/**
 * :A: tldr User service business logic layer
 * :A: api REST controller endpoints for user management
 * :A: sec validate all inputs and check authorization
 * 
 * Provides comprehensive user management operations for the application.
 * Handles CRUD operations, validation, and business rule enforcement.
 * 
 * <p>This service integrates with the authentication system to ensure
 * only authorized users can perform operations. All inputs are validated
 * according to business rules defined in the User domain model.
 * 
 * @author Development Team
 * @version 2.1.0
 * @since 1.0.0
 * @see User The domain model this service operates on
 * @see AuthService For authentication operations
 */
@Service
@Transactional
public class UserService {
    
    /**
     * :A: api Public endpoint for user retrieval
     * :A: perf consider caching for frequently accessed users
     * :A: ctx user IDs are UUIDs, not sequential integers
     * 
     * Retrieves a user by their unique identifier.
     * 
     * @param userId The unique identifier for the user (must be valid UUID)
     * @return User object with complete profile data
     * @throws UserNotFoundException when user doesn't exist in database
     * @throws IllegalArgumentException when userId format is invalid
     * @throws SecurityException when caller lacks read permissions
     * 
     * @code
     * try {
     *     User user = userService.getUserById(UUID.fromString("123e4567..."));
     *     System.out.println("Found user: " + user.getName());
     * } catch (UserNotFoundException e) {
     *     logger.warn("User not found: " + e.getMessage());
     * }
     * @endcode
     */
    public User getUserById(@NonNull UUID userId) 
            throws UserNotFoundException, SecurityException {
        // :A: sec verify caller has READ_USER permission
        // :A: ctx database queries use prepared statements
        // :A: perf single query with JOIN to avoid N+1
        
        validatePermissions(READ_USER);
        return userRepository.findByIdWithProfile(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }
}
```

### C# Documentation (XML Documentation)

```csharp
/// <summary>
/// :A: tldr Email notification service for user communications
/// :A: api Public interface for sending notifications
/// :A: config requires SMTP server configuration
/// 
/// Provides email notification functionality for the application.
/// Supports templated emails, attachments, and delivery tracking.
/// </summary>
/// <remarks>
/// This service requires proper SMTP configuration in appsettings.json.
/// Templates are loaded from the Templates/ directory at startup.
/// 
/// Example configuration:
/// <code>
/// {
///   "Email": {
///     "SmtpHost": "smtp.example.com",
///     "SmtpPort": 587,
///     "UseTLS": true
///   }
/// }
/// </code>
/// </remarks>
public class EmailService : IEmailService
{
    /// <summary>
    /// :A: api Core email sending method
    /// :A: sec validate recipient addresses to prevent injection
    /// :A: perf use async operations for SMTP communication
    /// 
    /// Sends an email notification to the specified recipient.
    /// </summary>
    /// <param name="recipient">Valid email address of the recipient</param>
    /// <param name="subject">Email subject line (max 200 characters)</param>
    /// <param name="body">Email body content (supports HTML)</param>
    /// <param name="isHtml">Whether the body contains HTML markup</param>
    /// <returns>Task representing the async operation with success status</returns>
    /// <exception cref="ArgumentException">Thrown when recipient format is invalid</exception>
    /// <exception cref="SmtpException">Thrown when email delivery fails</exception>
    /// <example>
    /// <code>
    /// var success = await emailService.SendNotificationAsync(
    ///     "user@example.com",
    ///     "Welcome!",
    ///     "&lt;h1&gt;Welcome to our service&lt;/h1&gt;",
    ///     true
    /// );
    /// </code>
    /// </example>
    public async Task<bool> SendNotificationAsync(
        string recipient, 
        string subject, 
        string body, 
        bool isHtml = false)
    {
        // :A: sec validate email format using RFC 5322 compliance
        // :A: ctx SMTP client is disposed after each send operation
        // :A: perf connection pooling handled by SmtpClient internally
        
        ValidateEmailAddress(recipient);
        
        using var client = CreateSmtpClient();
        var message = CreateMessage(recipient, subject, body, isHtml);
        
        try 
        {
            await client.SendMailAsync(message);
            return true;
        }
        catch (SmtpException ex)
        {
            // :A: todo @agent add retry logic with exponential backoff
            logger.LogError(ex, "Failed to send email to {Recipient}", recipient);
            return false;
        }
    }
}
```

## Dynamic Languages

### Ruby Documentation (RDoc/YARD)

```ruby
##
# :A: tldr Email notification service for user communications
# :A: config requires ActionMailer configuration
# :A: api Primary interface for sending emails
#
# Handles email notifications for the application including
# welcome emails, password resets, and promotional content.
# Integrates with ActionMailer for delivery and templating.
#
# @example Basic usage
#   service = EmailService.new
#   service.send_notification('user@example.com', 'Welcome!', 'Hello World')
#
# @example With template
#   service.send_templated_email('user@example.com', :welcome, user: current_user)
#
# @author Development Team
# @version 2.0.0
class EmailService
  ##
  # :A: api Core email sending method
  # :A: sec validate recipient email format
  # :A: todo @agent add template support
  #
  # Sends an email notification to the specified recipient.
  # Validates email format and handles delivery errors gracefully.
  #
  # @param [String] recipient Email address of the recipient
  # @param [String] subject Email subject line
  # @param [String] body Email content (plain text or HTML)
  # @param [Hash] options Additional email options
  # @option options [Boolean] :html Whether body contains HTML (default: false)
  # @option options [Array<String>] :attachments File paths to attach
  # @return [Boolean] Success status of email delivery
  # @raise [ArgumentError] When recipient format is invalid
  # @raise [DeliveryError] When email cannot be delivered
  #
  # @example Send plain text email
  #   success = send_notification('user@example.com', 'Hello', 'Plain text message')
  #
  # @example Send HTML email with attachment
  #   send_notification(
  #     'user@example.com',
  #     'Report',
  #     '<h1>Monthly Report</h1>',
  #     html: true,
  #     attachments: ['/path/to/report.pdf']
  #   )
  def send_notification(recipient, subject, body, options = {})
    # :A: sec validate email using RFC 5322 regex
    # :A: ctx ActionMailer handles SMTP connection pooling
    # :A: perf consider background job for large attachment emails
    
    validate_email_format!(recipient)
    
    mail_options = {
      to: recipient,
      subject: subject,
      body: body
    }.merge(options)
    
    begin
      NotificationMailer.send_email(mail_options).deliver_now
      true
    rescue StandardError => e
      # :A: todo @agent implement retry logic with exponential backoff
      Rails.logger.error "Failed to send email to #{recipient}: #{e.message}"
      false
    end
  end
  
  private
  
  # :A: sec email validation using comprehensive regex
  def validate_email_format!(email)
    # :A: ctx uses RFC 5322 compliant regex pattern
    pattern = /\A[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\z/
    raise ArgumentError, "Invalid email format: #{email}" unless email.match?(pattern)
  end
end
```

### PHP Documentation (phpDocumentor)

```php
<?php
/**
 * :A: tldr Database connection management utilities
 * :A: api Primary interface for database operations
 * :A: config requires PDO extension and database credentials
 * 
 * Database Connection Manager
 * 
 * Provides centralized database connection management with connection
 * pooling, retry logic, and automatic failover support.
 * 
 * @package App\Database
 * @author Development Team
 * @version 3.1.0
 * @since 1.0.0
 * @link https://docs.company.com/database-manager
 */
class DatabaseManager
{
    /**
     * :A: api Core connection creation method
     * :A: sec ensure connection string doesn't leak in logs
     * :A: perf implement connection pooling for production
     * 
     * Creates a new database connection with the specified configuration.
     * 
     * Automatically handles connection retries and failover to secondary
     * database servers if the primary connection fails.
     * 
     * @param string $dsn Database connection string (e.g., "mysql:host=localhost;dbname=app")
     * @param string $username Database username
     * @param string $password Database password
     * @param array $options PDO connection options
     * @return PDO Database connection instance
     * @throws ConnectionException When all connection attempts fail
     * @throws InvalidArgumentException When DSN format is invalid
     * 
     * @example Basic MySQL connection
     * <code>
     * $manager = new DatabaseManager();
     * $pdo = $manager->createConnection(
     *     'mysql:host=localhost;dbname=myapp',
     *     'username',
     *     'password'
     * );
     * </code>
     * 
     * @example PostgreSQL with SSL
     * <code>
     * $pdo = $manager->createConnection(
     *     'pgsql:host=localhost;dbname=myapp;sslmode=require',
     *     'username',
     *     'password',
     *     [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
     * );
     * </code>
     */
    public function createConnection(
        string $dsn, 
        string $username, 
        string $password, 
        array $options = []
    ): PDO {
        // :A: sec sanitize DSN for logging (remove passwords)
        // :A: ctx default timeout is 30 seconds
        // :A: perf reuse connections when possible
        
        $this->validateDsn($dsn);
        
        $defaultOptions = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 30
        ];
        
        $options = array_merge($defaultOptions, $options);
        
        $attempts = 0;
        $maxAttempts = 3;
        
        while ($attempts < $maxAttempts) {
            try {
                // :A: sec ensure password is not logged
                $this->logger->info('Attempting database connection', [
                    'dsn' => $this->sanitizeDsn($dsn),
                    'attempt' => $attempts + 1
                ]);
                
                $pdo = new PDO($dsn, $username, $password, $options);
                
                // :A: ctx verify connection with simple query
                $pdo->query('SELECT 1');
                
                return $pdo;
                
            } catch (PDOException $e) {
                $attempts++;
                
                if ($attempts >= $maxAttempts) {
                    // :A: todo @agent implement exponential backoff
                    throw new ConnectionException(
                        "Failed to connect after {$maxAttempts} attempts: " . $e->getMessage(),
                        0,
                        $e
                    );
                }
                
                // :A: perf exponential backoff: 1s, 2s, 4s...
                sleep(pow(2, $attempts - 1));
            }
        }
    }
}
```

## Mobile Development

### Swift Documentation

```swift
import Foundation

/// :A: tldr Core networking utilities for iOS/macOS applications
/// :A: api Public interface for HTTP requests and responses
/// :A: perf uses URLSession with connection pooling
/// 
/// Provides comprehensive HTTP networking functionality for the app.
/// Handles authentication, request/response processing, error handling,
/// and automatic retry logic with exponential backoff.
/// 
/// ## Usage
/// 
/// ```swift
/// let client = NetworkClient()
/// 
/// // Simple GET request
/// let result = await client.get(url: URL(string: "https://api.example.com/users")!)
/// 
/// // POST with JSON body
/// let userData = ["name": "John", "email": "john@example.com"]
/// let createResult = await client.post(url: userEndpoint, body: userData)
/// ```
/// 
/// ## Error Handling
/// 
/// All methods return `Result<T, NetworkError>` for explicit error handling:
/// 
/// ```swift
/// switch result {
/// case .success(let data):
///     // Handle successful response
/// case .failure(let error):
///     // Handle network error
/// }
/// ```
/// 
/// - Note: This class is thread-safe and can be used from any queue
/// - Important: Requires network permissions in Info.plist
/// - Version: 2.1.0
public class NetworkClient {
    
    /// :A: api Primary GET request method
    /// :A: sec validate URL and sanitize headers
    /// :A: perf cache responses when appropriate
    /// 
    /// Performs an HTTP GET request to the specified URL.
    /// 
    /// This method automatically handles common HTTP scenarios including
    /// redirects, authentication challenges, and temporary failures with
    /// automatic retry logic.
    /// 
    /// - Parameter url: The URL to request (must be valid HTTP/HTTPS)
    /// - Parameter headers: Optional HTTP headers to include
    /// - Parameter timeout: Request timeout in seconds (default: 30)
    /// - Returns: Result containing response data or network error
    /// 
    /// - Throws: Never throws - all errors are returned in Result
    /// 
    /// ## Examples
    /// 
    /// ```swift
    /// // Basic GET request
    /// let result = await client.get(url: apiURL)
    /// 
    /// // With custom headers and timeout  
    /// let result = await client.get(
    ///     url: apiURL,
    ///     headers: ["Authorization": "Bearer \(token)"],
    ///     timeout: 60
    /// )
    /// ```
    public func get(
        url: URL,
        headers: [String: String] = [:],
        timeout: TimeInterval = 30
    ) async -> Result<Data, NetworkError> {
        // :A: ctx URLSession handles connection pooling automatically
        // :A: sec validate URL scheme is HTTP/HTTPS
        // :A: perf reuse URLSession instance across requests
        
        guard url.scheme == "http" || url.scheme == "https" else {
            return .failure(.invalidURL("URL must use HTTP or HTTPS scheme"))
        }
        
        var request = URLRequest(url: url, timeoutInterval: timeout)
        request.httpMethod = "GET"
        
        // :A: sec sanitize headers to prevent injection
        for (key, value) in headers {
            let sanitizedKey = sanitizeHeaderKey(key)
            let sanitizedValue = sanitizeHeaderValue(value)
            request.setValue(sanitizedValue, forHTTPHeaderField: sanitizedKey)
        }
        
        do {
            let (data, response) = try await urlSession.data(for: request)
            
            // :A: ctx verify response is HTTPURLResponse
            guard let httpResponse = response as? HTTPURLResponse else {
                return .failure(.invalidResponse("Response is not HTTP"))
            }
            
            // :A: api success range is 200-299
            guard 200...299 ~= httpResponse.statusCode else {
                return .failure(.httpError(httpResponse.statusCode, data))
            }
            
            return .success(data)
            
        } catch {
            // :A: todo @agent add retry logic for transient failures
            return .failure(.networkError(error))
        }
    }
    
    /// :A: api POST request with JSON body support
    /// :A: sec validate and sanitize request body
    /// :A: perf stream large request bodies
    /// 
    /// Performs an HTTP POST request with optional JSON body.
    /// 
    /// - Parameter url: The URL to post to
    /// - Parameter body: Optional request body (will be JSON encoded)
    /// - Parameter headers: Optional HTTP headers
    /// - Parameter timeout: Request timeout in seconds
    /// - Returns: Result containing response data or network error
    public func post<T: Codable>(
        url: URL,
        body: T? = nil,
        headers: [String: String] = [:],
        timeout: TimeInterval = 30
    ) async -> Result<Data, NetworkError> {
        // :A: ctx automatically sets Content-Type for JSON bodies
        // :A: sec ensure request body size limits
        // :A: perf consider compression for large payloads
        
        var request = URLRequest(url: url, timeoutInterval: timeout)
        request.httpMethod = "POST"
        
        var requestHeaders = headers
        
        if let body = body {
            do {
                // :A: sec validate body can be safely serialized
                request.httpBody = try JSONEncoder().encode(body)
                requestHeaders["Content-Type"] = "application/json"
            } catch {
                return .failure(.encodingError("Failed to encode request body: \(error)"))
            }
        }
        
        for (key, value) in requestHeaders {
            request.setValue(sanitizeHeaderValue(value), forHTTPHeaderField: sanitizeHeaderKey(key))
        }
        
        return await executeRequest(request)
    }
}

/// :A: api Network error types for comprehensive error handling
/// :A: tldr All possible network operation failures
public enum NetworkError: Error, LocalizedError {
    case invalidURL(String)
    case invalidResponse(String)
    case httpError(Int, Data?)
    case networkError(Error)
    case encodingError(String)
    case decodingError(String)
    
    /// :A: api User-friendly error descriptions
    public var errorDescription: String? {
        switch self {
        case .invalidURL(let message):
            return "Invalid URL: \(message)"
        case .invalidResponse(let message):
            return "Invalid response: \(message)"
        case .httpError(let code, _):
            return "HTTP error \(code)"
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        case .encodingError(let message):
            return "Encoding error: \(message)"
        case .decodingError(let message):
            return "Decoding error: \(message)"
        }
    }
}
```

### Kotlin Documentation (KDoc)

```kotlin
/**
 * :A: tldr Android HTTP client with coroutines support
 * :A: api Primary networking interface for Android apps
 * :A: perf uses OkHttp with connection pooling and caching
 * 
 * Comprehensive HTTP client designed for Android applications.
 * Provides coroutine-based async operations, automatic retry logic,
 * request/response interceptors, and offline caching support.
 * 
 * ## Features
 * - Coroutine-based async operations
 * - Automatic retry with exponential backoff
 * - Response caching for offline support
 * - Request/response logging and analytics
 * - Certificate pinning for security
 * 
 * ## Usage
 * 
 * ```kotlin
 * val client = HttpClient()
 * 
 * // Suspend function usage
 * val result = client.get<User>("https://api.example.com/user/123")
 * result.fold(
 *     onSuccess = { user -> println("User: ${user.name}") },
 *     onFailure = { error -> Log.e("Network", "Failed: $error") }
 * )
 * ```
 * 
 * @property baseUrl Base URL for all requests (optional)
 * @property timeout Default timeout for requests in milliseconds
 * @property retryCount Maximum number of retry attempts
 * 
 * @constructor Creates HTTP client with default configuration
 * @param config Optional configuration block for customization
 * 
 * @author Android Team
 * @version 1.5.0
 * @since 1.0.0
 */
class HttpClient(
    private val baseUrl: String? = null,
    private val timeout: Long = 30_000,
    private val retryCount: Int = 3,
    config: (OkHttpClient.Builder.() -> Unit)? = null
) {
    
    /**
     * :A: api Generic GET request with automatic JSON deserialization
     * :A: sec validate URL and sanitize headers
     * :A: perf use response caching when appropriate
     * 
     * Performs an HTTP GET request and deserializes the response to the specified type.
     * 
     * This method automatically handles:
     * - URL validation and sanitization
     * - Response caching based on HTTP headers
     * - Automatic retry for transient failures
     * - JSON deserialization with error handling
     * 
     * @param T The type to deserialize the response to
     * @param url The URL to request (relative or absolute)
     * @param headers Optional HTTP headers to include
     * @param cachePolicy Cache behavior for this request
     * @return Result containing deserialized object or error
     * 
     * @throws IllegalArgumentException if URL format is invalid
     * @sample sampleGetRequest
     */
    suspend inline fun <reified T> get(
        url: String,
        headers: Map<String, String> = emptyMap(),
        cachePolicy: CachePolicy = CachePolicy.Default
    ): Result<T> {
        // :A: ctx combines baseUrl with relative URLs automatically
        // :A: sec prevent URL injection attacks
        // :A: perf check cache before making network request
        
        val fullUrl = resolveUrl(url)
        validateUrl(fullUrl)
        
        val request = Request.Builder()
            .url(fullUrl)
            .apply {
                // :A: sec sanitize all header values
                headers.forEach { (key, value) ->
                    addHeader(sanitizeHeaderKey(key), sanitizeHeaderValue(value))
                }
                
                // :A: ctx cache policy affects request headers
                when (cachePolicy) {
                    CachePolicy.NetworkOnly -> addHeader("Cache-Control", "no-cache")
                    CachePolicy.CacheOnly -> addHeader("Cache-Control", "only-if-cached")
                    CachePolicy.Default -> { /* Use default caching */ }
                }
            }
            .build()
        
        return executeWithRetry(request) { response ->
            // :A: perf stream large responses instead of loading to memory
            val responseBody = response.body?.string() 
                ?: return@executeWithRetry Result.failure(HttpException("Empty response body"))
            
            try {
                // :A: ctx uses Moshi for JSON serialization
                val adapter = moshi.adapter(T::class.java)
                val result = adapter.fromJson(responseBody)
                    ?: return@executeWithRetry Result.failure(HttpException("Failed to parse JSON"))
                
                Result.success(result)
            } catch (e: Exception) {
                // :A: todo @agent add more specific error types
                Result.failure(HttpException("Deserialization failed: ${e.message}", e))
            }
        }
    }
    
    /**
     * :A: api POST request with automatic JSON serialization
     * :A: sec validate request body size and content
     * :A: perf compress large request bodies
     * 
     * Performs an HTTP POST request with automatic JSON serialization of the request body.
     * 
     * @param T Request body type
     * @param R Response body type
     * @param url The URL to post to
     * @param body Request body object (will be JSON serialized)
     * @param headers Optional HTTP headers
     * @return Result containing deserialized response or error
     */
    suspend inline fun <reified T, reified R> post(
        url: String,
        body: T,
        headers: Map<String, String> = emptyMap()
    ): Result<R> {
        // :A: ctx automatically sets Content-Type header for JSON
        // :A: sec limit request body size to prevent DoS
        // :A: perf consider request compression for large bodies
        
        val fullUrl = resolveUrl(url)
        validateUrl(fullUrl)
        
        val jsonBody = try {
            // :A: sec ensure request body doesn't contain sensitive data in logs
            val adapter = moshi.adapter(T::class.java)
            adapter.toJson(body)
        } catch (e: Exception) {
            return Result.failure(HttpException("Failed to serialize request body: ${e.message}", e))
        }
        
        // :A: ctx check body size limits before creating request
        if (jsonBody.length > MAX_REQUEST_BODY_SIZE) {
            return Result.failure(HttpException("Request body too large: ${jsonBody.length} bytes"))
        }
        
        val requestBody = jsonBody.toRequestBody("application/json; charset=utf-8".toMediaType())
        
        val request = Request.Builder()
            .url(fullUrl)
            .post(requestBody)
            .apply {
                headers.forEach { (key, value) ->
                    addHeader(sanitizeHeaderKey(key), sanitizeHeaderValue(value))
                }
            }
            .build()
        
        return executeWithRetry(request) { response ->
            val responseBody = response.body?.string() 
                ?: return@executeWithRetry Result.failure(HttpException("Empty response body"))
            
            try {
                val adapter = moshi.adapter(R::class.java)
                val result = adapter.fromJson(responseBody)
                    ?: return@executeWithRetry Result.failure(HttpException("Failed to parse response JSON"))
                
                Result.success(result)
            } catch (e: Exception) {
                Result.failure(HttpException("Response deserialization failed: ${e.message}", e))
            }
        }
    }
    
    /**
     * :A: perf retry logic with exponential backoff
     * :A: ctx internal method for request execution
     */
    private suspend fun <T> executeWithRetry(
        request: Request,
        transform: (Response) -> Result<T>
    ): Result<T> {
        // :A: perf exponential backoff: 1s, 2s, 4s, 8s...
        // :A: ctx only retry on transient failures (5xx, timeouts)
        
        repeat(retryCount) { attempt ->
            try {
                val response = okHttpClient.newCall(request).await()
                
                if (response.isSuccessful) {
                    return transform(response)
                } else if (!shouldRetry(response.code)) {
                    return Result.failure(HttpException("HTTP ${response.code}: ${response.message}"))
                }
                
                // :A: todo @agent make backoff configurable
                if (attempt < retryCount - 1) {
                    delay(1000L * (1 shl attempt)) // Exponential backoff
                }
                
            } catch (e: Exception) {
                if (attempt == retryCount - 1 || !isRetriableException(e)) {
                    return Result.failure(HttpException("Network request failed: ${e.message}", e))
                }
                
                delay(1000L * (1 shl attempt))
            }
        }
        
        return Result.failure(HttpException("Max retries exceeded"))
    }
}

/**
 * :A: api Cache policy options for HTTP requests
 * :A: tldr Controls caching behavior for network requests
 */
enum class CachePolicy {
    /** :A: ctx Use default HTTP caching headers */
    Default,
    /** :A: ctx Always fetch from network, ignore cache */
    NetworkOnly,
    /** :A: ctx Only return cached responses, no network */
    CacheOnly
}

/**
 * :A: api Custom exception for HTTP-related errors
 * :A: tldr Represents all HTTP operation failures
 */
class HttpException(
    message: String,
    cause: Throwable? = null
) : Exception(message, cause)

/**
 * :A: ctx Sample usage for documentation
 */
private suspend fun sampleGetRequest() {
    val client = HttpClient(baseUrl = "https://api.example.com")
    
    // :A: ctx demonstrates typical API call pattern
    val result = client.get<User>("/user/123")
    result.fold(
        onSuccess = { user -> 
            println("User loaded: ${user.name}")
        },
        onFailure = { error ->
            Log.e("HTTP", "Failed to load user: $error")
        }
    )
}
```

## Universal Search Patterns

Magic Anchors work consistently across all documentation systems with these search strategies:

### Language-Specific Searches

```bash
# JavaScript/TypeScript (JSDoc, TSDoc)
rg "\/\*\*[\s\S]*?:A:" --type js          # JSDoc blocks only
rg ":A:" --type js                        # All anchors in JS/TS

# Python (all docstring formats)
rg '"""[\s\S]*?:A:' --type py             # Triple quote docstrings  
rg "'''[\s\S]*?:A:" --type py             # Single quote docstrings
rg ":A:" --type py                        # All anchors in Python

# Rust (rustdoc)
rg "\/\/\/ :A:" --type rust               # Doc comments only
rg ":A:" --type rust                      # All anchors in Rust

# Go (godoc)
rg "\/\/ :A:" --type go                   # Doc comments only
rg ":A:" --type go                        # All anchors in Go

# C/C++ (Doxygen)
rg "\/\*\*[\s\S]*?:A:" --type cpp         # Doxygen blocks
rg ":A:" --type cpp                       # All anchors in C/C++

# Java (Javadoc)
rg "\/\*\*[\s\S]*?:A:" --type java        # Javadoc blocks
rg ":A:" --type java                      # All anchors in Java

# C# (XML documentation)
rg "\/\/\/ <summary>[\s\S]*?:A:" --type cs # XML doc comments
rg ":A:" --type cs                        # All anchors in C#

# Ruby (RDoc/YARD)
rg "##[\s\S]*?:A:" --type ruby            # Block comments
rg ":A:" --type ruby                      # All anchors in Ruby

# PHP (phpDocumentor)
rg "\/\*\*[\s\S]*?:A:" --type php         # PHPDoc blocks
rg ":A:" --type php                       # All anchors in PHP

# Swift
rg "\/\/\/ :A:" --type swift              # Swift doc comments
rg ":A:" --type swift                     # All anchors in Swift

# Kotlin (KDoc)
rg "\/\*\*[\s\S]*?:A:" --type kotlin      # KDoc blocks
rg ":A:" --type kotlin                    # All anchors in Kotlin
```

### Cross-Language Searches

```bash
# All documentation comments with anchors
rg -U "(?:\/\*\*|\/\/\/|##|#|<!--|\"\"\")\s*[\s\S]*?:A:" --type-add 'docs:*.{js,ts,py,rs,go,java,swift,kt,rb,php,cs,cpp,h,hpp}' -t docs

# All API-related anchors across languages
rg ":A:.*api" --type-add 'code:*.{js,ts,py,rs,go,java,swift,kt,rb,php,cs,cpp,h}' -t code

# Security-related anchors in documentation
rg -U "(?:\/\*\*|\/\/\/|##|#|<!--|\"\"\")\s*[\s\S]*?:A:.*sec" --type-add 'docs:*.{js,ts,py,rs,go,java,swift,kt,rb,php,cs,cpp,h}' -t docs

# Performance-related documentation anchors
rg -B2 -A5 ":A:.*perf" --type-add 'all:*'
```

### Context-Aware Searches

```bash
# Find anchors with surrounding documentation context
rg -B5 -A10 ":A: api" --type-add 'code:*'    # 5 lines before, 10 after
rg -C3 ":A: sec" --type js                    # 3 lines context for JS security

# Documentation blocks containing specific anchor types
rg -U "\/\*\*[\s\S]*?:A: todo[\s\S]*?\*\/" --type js    # JSDoc blocks with todos
rg -U '"""[\s\S]*?:A: api[\s\S]*?"""' --type py         # Python docstrings with API markers
```

## Recommended Positioning

**Universal pattern - Magic Anchors first in documentation:**

```
/* Any documentation format
 * :A: tldr Brief overview
 * :A: api Public interface marker  
 * :A: sec Security considerations
 * :A: todo @agent Tasks for AI
 * 
 * Standard documentation content follows...
 * @param/@arg/@parameter documentation
 * @returns/@return/@output documentation
 * @throws/@raise/@exception error conditions
 */
```

This ensures:
- **Consistent anchor placement** across all languages
- **Easy search patterns** work universally
- **No interference** with documentation generators
- **Progressive enhancement** of existing codebases

## Migration Strategies

### Adding to Existing Documentation

1. **Identify key documentation** - Start with public APIs
2. **Add anchors first** - Place at beginning of doc blocks
3. **Validate tools** - Ensure doc generators still work
4. **Search verification** - Test anchor discovery patterns
5. **Team adoption** - Document conventions in README

### Example Migration Script

```bash
#!/bin/bash
# Add API anchors to existing JSDoc functions

# :A: temp migration script - remove after completion
# :A: todo @agent make this more robust for edge cases

find . -name "*.js" -type f | xargs sed -i '
  /\/\*\*/{
    # Look for function/class documentation
    /\* @description\|* @param\|* @returns/ {
      # Add API anchor if not already present
      /\* :A:/ !{
        s/\/\*\*/\/\*\*\n * :A: api/
      }
    }
  }
'
```

## Best Practices

### Universal Guidelines

1. **Magic Anchors first** - Always place at beginning of documentation
2. **One space after `:A:`** - Consistent formatting across languages
3. **Language-appropriate comments** - Use `///` for Rust, `##` for Ruby, etc.
4. **Separate concerns** - Use multiple lines for distinct topics
5. **Test doc generation** - Ensure existing tools continue working
6. **Document conventions** - Add patterns to project README

### Language-Specific Tips

**JavaScript/TypeScript:**
- Use JSDoc blocks for functions, classes, and interfaces
- Place anchors before `@param` and `@returns`
- Consider TSDoc for TypeScript-specific features

**Python:**
- Work with any docstring style (Google, NumPy, Sphinx)
- Place anchors at docstring beginning
- Use triple quotes consistently

**Rust:**
- Use `///` for public item documentation
- Place anchors before examples and safety notes
- Works with `cargo doc` generation

**Go:**
- Use comment blocks starting with `//`
- Place anchors before usage examples
- Compatible with `godoc` tool

**Java:**
- Use Javadoc blocks for public APIs
- Place anchors before `@param` tags
- Works with standard Javadoc generation

## Conclusion

Magic Anchors provide **universal code navigation** that works seamlessly with all major documentation systems. The `:A:` pattern adds zero overhead to existing documentation workflows while enabling powerful search-based code discovery.

**Key benefits:**
- **Zero breaking changes** - Existing tools continue working
- **Universal search** - `rg ":A:"` works across all languages
- **Progressive adoption** - Add anchors incrementally
- **AI-friendly** - Enables intelligent code navigation
- **Documentation-aware** - Respects existing doc conventions

Start with essential patterns (`todo`, `api`, `sec`) and expand as your team discovers the value of searchable code markers.