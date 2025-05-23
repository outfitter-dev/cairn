# Grep-Anchor Examples

*Real-world patterns for AI agents and developers*

---

## 1. TLDR Pattern (Universal Summary)

The `:ga:tldr` anchor should be the first line of every function, class, or module to provide a quick summary:

### Function-Level TLDR

```typescript
// :ga:tldr Validate email format and check against blocklist
// :ga:api,sec Email validation with security checks
export function validateEmail(email: string): ValidationResult {
  // :ga:tldr Check basic email format using regex
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, reason: 'invalid_format' };
  }
  
  // :ga:tldr Check against known disposable email domains
  // :ga:sec prevent spam accounts
  if (isDisposableEmail(email)) {
    return { valid: false, reason: 'disposable_email' };
  }
  
  return { valid: true };
}
```

### Module-Level TLDR

```javascript
// :ga:tldr User authentication and session management module
// :ga:entry Authentication service entry point

import { Strategy } from 'passport';
import { User } from './models';

// :ga:tldr Configure OAuth2 authentication strategy
// :ga:config OAuth setup
export function setupAuth(app) {
  // Implementation...
}

// :ga:tldr Validate and refresh JWT tokens
// :ga:api,sec Token management
export async function refreshToken(token) {
  // Implementation...
}
```

### Class-Level TLDR

```python
# :ga:tldr Manages database connection pooling and query execution
# :ga:api Core database interface
class DatabaseManager:
    # :ga:tldr Initialize connection pool with config
    def __init__(self, config):
        # :ga:config Database connection settings
        self.pool = create_pool(**config)
    
    # :ga:tldr Execute query with automatic retry on connection failure
    # :ga:error,perf Resilient query execution
    async def execute(self, query, params=None):
        # Implementation...
```

---

## 2. Security Review Patterns

### Critical Security Fixes

```javascript
// :ga:tldr Execute user query with potential SQL injection vulnerability
// :ga:sec,p0 SQL injection vulnerability
function queryUser(userId) {
  // UNSAFE: Direct string concatenation
  return db.query(`SELECT * FROM users WHERE id = ${userId}`);
}

// :ga:tldr Safely query user with parameterized SQL
// :ga:fix,sec sanitize input
function queryUserSafe(userId) {
  return db.query('SELECT * FROM users WHERE id = ?', [userId]);
}
```

### Authentication Boundaries

```python
# :ga:tldr Delete user with proper authorization checks and audit logging
# :ga:sec,review auth boundary check
@require_auth
def delete_user(user_id):
    # :ga:sec ensure user.id matches token
    if current_user.id != user_id and not current_user.is_admin:
        raise Forbidden()
    
    # :ga:audit log deletion event
    audit_log.record('user_deletion', user_id, current_user.id)
    User.delete(user_id)
```

### Crypto Implementation

```go
// :ga:sec,@security-team review crypto params
func hashPassword(password string) string {
    // :ga:sec verify cost factor meets current standards
    cost := 12
    hash, err := bcrypt.GenerateFromPassword([]byte(password), cost)
    if err != nil {
        // :ga:sec,fixme don't leak error details
        log.Fatal(err)
    }
    return string(hash)
}
```

---

## 2. Performance Optimization

### Database Queries

```ruby
# :ga:perf,p1 n+1 query detected
def get_posts_with_comments
  posts = Post.all
  posts.map do |post|
    # :ga:perf each post triggers separate query
    {
      title: post.title,
      comment_count: post.comments.count
    }
  end
end

# :ga:fix,perf use includes
def get_posts_with_comments_optimized
  Post.includes(:comments).map do |post|
    {
      title: post.title,
      comment_count: post.comments.size
    }
  end
end
```

### Frontend Rendering

```jsx
// :ga:perf unnecessary re-renders
function TodoList({ todos, filter }) {
  // :ga:perf,fix memoize filtered list
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // :ga:perf consider virtualization for long lists
  return (
    <ul>
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
```

---

## 3. Technical Debt Tracking

### Temporary Workarounds

```typescript
// :ga:temp,hack Chrome 120 bug workaround
// :ga:{"until":"2024-06-01","issue":"CHR-4823"}
function fixChromeScrollBug() {
  if (navigator.userAgent.includes('Chrome/120')) {
    // :ga:temp force repaint
    document.body.style.display = 'none';
    document.body.offsetHeight; // trigger reflow
    document.body.style.display = '';
  }
}
```

### Migration Paths

```python
# :ga:deprecated,v2.0 use new_api.process()
# :ga:{"since":"v1.8","until":"v2.0","replacement":"new_api.process"}
def legacy_process(data):
    """
    :ga:migration guide at docs/migration-v2.md
    """
    warnings.warn(
        "legacy_process is deprecated, use new_api.process",
        DeprecationWarning
    )
    return new_api.process(data, legacy_mode=True)
```

---

## 4. AI Agent Delegation

### Test Generation

```java
// :ga:@cursor generate unit tests
// :ga:test cover edge cases: null, empty, overflow
public class Calculator {
    public int divide(int a, int b) {
        // :ga:test,fixme no zero check
        return a / b;
    }
    
    // :ga:@agent implement with error handling
    public Result<Integer> safeDivide(int a, int b) {
        // TODO: Implementation needed
        return null;
    }
}
```

### Documentation Generation

```rust
// :ga:@claude document with examples
// :ga:docs include error cases
pub fn parse_config(path: &Path) -> Result<Config, ConfigError> {
    // :ga:docs explain config format
    let contents = fs::read_to_string(path)?;
    
    // :ga:docs show valid/invalid examples
    toml::from_str(&contents)
        .map_err(|e| ConfigError::ParseError(e.to_string()))
}
```

---

## 5. Complex Workflows

### Multi-Stage Feature

```typescript
// :ga:feat,epic user-onboarding
// :ga:{"epic":"FEAT-123","tasks":["email","tutorial","analytics"]}
export class OnboardingFlow {
  // :ga:feat,task:email implement welcome email
  async sendWelcomeEmail(user: User) {
    // :ga:todo template selection based on user type
    throw new Error("Not implemented");
  }

  // :ga:feat,task:tutorial interactive guide
  async startTutorial(user: User) {
    // :ga:@cursor implement step-by-step tutorial
    // :ga:a11y ensure keyboard navigation
    return null;
  }

  // :ga:feat,task:analytics track completion
  async trackProgress(user: User, step: string) {
    // :ga:privacy ensure GDPR compliance
    // :ga:test mock analytics in dev
    return null;
  }
}
```

### Breaking Changes

```go
// :ga:breaking,v3.0 API restructure
// :ga:{"migration":"docs/v3-migration.md","deprecates":["OldClient","LegacyAuth"]}
package api

// :ga:deprecated,v3.0 use NewClient
type OldClient struct {
    // :ga:breaking field removed in v3.0
    APIKey string
}

// :ga:feat,v3.0 new auth model  
type NewClient struct {
    // :ga:breaking OAuth2 required
    TokenProvider TokenProvider
}
```

---

## 6. Search Patterns with grepa CLI

### Finding Security Issues
```bash
# All security-related anchors
grepa sec                    # Includes aliases: security, auth, crypto
grepa security               # Smart alias expansion

# Critical security issues only  
grepa sec p0                 # sec AND p0
grepa sec p=0                # Explicit priority value

# Security with specific attributes
grepa sec @alice             # Security items assigned to alice
grepa sec '!temp'             # Security but NOT temporary (quoted bang)
grepa sec owner~/alice|bob/  # Security owned by alice OR bob

# Using explicit find verb
grepa find sec -C 3          # With context lines
grepa --json find sec        # JSON output (global flag first)
```

### Finding Work Items
```bash
# All TODOs with various filters
grepa todo=*                 # Any todo with a value
grepa todo=T-123             # Exact ticket match  
grepa todo!=T-123            # Todo NOT equal to T-123
grepa blocks~=T-123          # Where T-123 appears in blocks array

# Assignment patterns
grepa todo @alice            # TODOs assigned to alice
grepa *=@alice               # Any tag with value @alice
grepa owner!=@me             # Items NOT owned by me

# High priority fixes
grepa fix p0 | fix p1        # P0 OR P1 fixes
grepa find fix,p0 fix,p1 --any  # Using --any flag

# Temporary code tracking
grepa temp | hack            # temp OR hack
grepa temp '!resolved'       # Temp but not resolved
grepa temp since~=2024       # Temp code from 2024
```

### Finding Feature Work
```bash
# All feature implementations
grepa feat                   # All features
grepa feat '!wip'            # Features not work-in-progress

# Features for specific version
grepa feat v2.0              # Features tagged v2.0
grepa feat version=2.0       # Using value filter
grepa feat version~/^v2\./   # Regex match for v2.*

# JSON payload queries
grepa feat {type}=enhancement # Features with JSON type field
grepa *={*}                  # Any tag with JSON payload

# Breaking changes
grepa breaking               # All breaking changes
grepa breaking v2.0          # Breaking changes in v2.0
grepa breaking '!resolved'   # Unresolved breaking changes
```

### Advanced Pattern Combinations
```bash
# Complex queries with grouping
grepa "(sec,p0)|temp"        # (security AND p0) OR temp
grepa "fix,!test" p0         # Fixes at p0 that aren't tests
grepa todo owner!=@me p0     # P0 todos not assigned to me

# Value filter combinations
grepa todo=* owner=@alice    # Alice's todos with any value
grepa *=T-123                # Any tag referencing T-123
grepa config={*} env=prod    # JSON configs for prod

# Using global flags correctly
grepa --json find sec        # JSON output (global before verb)
grepa --files list todo      # Files only (global flag)
grepa --literal find bug     # Literal search, no expansion
```

### Using Other Commands
```bash
# List unique tags
grepa list                   # All unique tags
grepa list --count           # With usage counts
grepa list todo sec          # Only these tags

# Generate reports
grepa report                 # Tag distribution
grepa report --top 10        # Most used tags
grepa report --chart         # ASCII visualization

# Lint for policy violations
grepa lint                   # Run all rules
grepa lint --fix             # Auto-fix issues
grepa lint --ci              # CI mode (exits 1 on violations)

# Watch for changes
grepa watch sec p0           # Monitor critical security
grepa watch todo --notify    # Desktop notifications (local)
```

---

## 7. CI/CD Integration Examples

### Pre-commit Hook

```bash
#!/bin/bash
# :ga:ci block commits with temp code

# :ga:ci,config adjust patterns as needed
if git diff --cached | grep -q ":ga:temp"; then
    echo "Error: Temporary code markers found!"
    echo "Remove :ga:temp anchors before committing"
    exit 1
fi
```

### GitHub Action

```yaml
# :ga:ci,example grep-anchor validator
name: Validate Grep Anchors
on: [pull_request]

jobs:
  check-anchors:
    runs-on: ubuntu-latest
    steps:
      # :ga:ci check for p0 issues
      - name: Block P0 issues
        run: |
          if grep -r ":ga:.*p0" --include="*.{js,py,go}"; then
            echo "::error::P0 issues must be resolved"
            exit 1
          fi
          
      # :ga:ci warn on missing owners
      - name: Check ownership
        run: |
          if grep -r ":ga:fix" --include="*.{js,py,go}" | grep -v "@"; then
            echo "::warning::Fix anchors should have owners"
          fi
```

---

## 8. Editor Integration

### VS Code Task

```json
{
  "label": "Find TODOs",
  "type": "shell",
  "command": "rg",
  "args": ["-n", ":ga:todo|:ga:fixme"],
  "problemMatcher": [],
  "presentation": {
    "reveal": "always",
    "panel": "new"
  }
}
```

### Vim Quickfix

```vim
" :ga:config add to .vimrc
command! Anchors cexpr system('rg -n ":ga:" --vimgrep')
command! Security cexpr system('rg -n ":ga:.*sec" --vimgrep')
command! MyTasks cexpr system('rg -n ":ga:.*@myusername" --vimgrep')
```

---

## 9. Real-World Scenarios

### Hot-Fix Workflow

```javascript
// :ga:hotfix,p0,@oncall memory leak in prod
// :ga:{"incident":"INC-4823","eta":"2024-01-30T18:00:00Z"}
class WebSocketManager {
  constructor() {
    // :ga:fix,root-cause unbounded growth
    this.connections = new Map();
    
    // :ga:temp,hotfix clear every hour
    setInterval(() => {
      this.cleanupStale();
    }, 3600000);
  }
  
  // :ga:fix implement proper cleanup
  cleanupStale() {
    // :ga:monitor track cleanup performance
    const start = Date.now();
    let cleaned = 0;
    
    this.connections.forEach((conn, id) => {
      if (!conn.isAlive) {
        conn.close();
        this.connections.delete(id);
        cleaned++;
      }
    });
    
    // :ga:metrics report to monitoring
    metrics.record('ws.cleanup', {
      duration: Date.now() - start,
      cleaned
    });
  }
}
```

### Feature Flag Integration

```python
# :ga:feat,flag:new-checkout feature flagged
# :ga:{"flag":"enable-new-checkout","rollout":"10%"}
def process_checkout(cart, user):
    # :ga:ab-test track conversion metrics
    if feature_flags.is_enabled('enable-new-checkout', user):
        # :ga:feat,v2 new streamlined flow
        return new_checkout_flow(cart, user)
    else:
        # :ga:deprecated remove after full rollout
        return legacy_checkout(cart, user)
```

---

## 10. Best Practices Summary

1. **Always start with TLDR**: Every function/class/module begins with `:ga:tldr`
2. **Layer your anchors**: `type,priority,owner` gives maximum context
3. **Use JSON for deadlines**: `{"due":"2024-03-01"}` for time-sensitive items
4. **Link to issues**: Include ticket IDs for traceability
5. **Version your temps**: Always specify when temporary code should be removed
6. **Assign ownership**: Use `@username` for accountability
7. **Be specific**: "fix auth" is better than just "fix"
8. **Group related work**: Use epic/task relationships for large features

Remember: The goal is to make your codebase discoverable for both human developers and AI agents. Well-placed grep-anchors act as semantic waypoints through your code. The `:ga:tldr` anchor is especially crucial as it provides instant context for what any piece of code does.