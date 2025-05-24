# 🍇 Grepa (grep-anchor) - Better Code Navigation for AI Agents

> **Make your codebase AI-navigable.** Grepa (`:ga:`) provides a universal pattern that AI agents can reliably find and humans can easily grep.

## The Problem

AI coding agents and developers face the same challenge: **How do you quickly navigate to the right spot in a codebase?**

Even in well-structured repos, critical information is scattered across:
- Ad-hoc TODOs with inconsistent formatting
- Security concerns buried in comment threads  
- Temporary hacks that overstay their welcome
- Context and assumptions that only exist in developers' heads

Current approaches fail because they're:
- **Unpredictable**: Every project uses different conventions
- **Invisible to AI**: Agents can't reliably pattern-match free-form comments
- **Hard to search**: `grep TODO` returns hundreds of results with no structure

> **grep** is a command-line utility for searching plain-text data sets for lines that match a regular expression. Its name comes from the ed command g/re/p (globally search a regular expression and print). [Learn more on Wikipedia](https://en.wikipedia.org/wiki/Grep).

## The Solution: grep-anchor (`:ga:`)

A **grep-anchor** is a tiny, unique marker that makes any comment instantly discoverable:

```javascript
// :ga:todo add input validation
function processPayment(amount) {
    // :ga:security verify amount is positive
    chargeCard(amount);
}
```

Find everything instantly:
```bash
rg ":ga:"          # List all anchors
rg ":ga:security"  # Jump to security concerns
rg ":ga:todo"      # Find all tasks
```

### Custom Anchors

While `:ga:` is the recommended default, teams can choose their own anchor pattern:

```javascript
// :proj: for your project
// :team: for your team  
// :myco: for your company
```

**Best practices:**
- **One anchor per project** - Don't mix different anchors in the same codebase
- **Monorepo?** Use tags, not different anchors: `:ga:auth-service`, `:ga:web-app`
- **Document your choice** - If not using `:ga:`, note it in your README

## Quick Start

### 1. Start Simple
- `:ga:todo` - Mark work that needs doing
  ```python
  # :ga:todo implement retry logic
  def api_call():
      response = requests.get(url)
      return response
  ```

### 2. Add AI Instructions
- `:ga:@agent` - Direct AI agents to specific tasks
  ```javascript
  // :ga:@agent write unit tests for edge cases
  function divide(a, b) {
      return a / b;  // :ga:todo handle division by zero
  }
  ```

### 3. Mark Important Context
- `:ga:context` - Document critical assumptions
  ```go
  // :ga:context user_ids are always UUIDs, never integers
  func GetUser(userID string) (*User, error) {
      // :ga:security validate UUID format to prevent injection
      return db.FindUser(userID)
  }
  ```

### 4. Combine as Needed
- Stack multiple tags for richer meaning
  ```typescript
  // :ga:security,todo fix rate limiting
  // :ga:temp,context remove after Redis upgrade
  ```

## Core Patterns

| Pattern | Purpose | Example |
|---------|---------|---------|
| `:ga:todo` | Work to be done | `// :ga:todo add error handling` |
| `:ga:@agent` | AI agent tasks | `// :ga:@agent implement this function` |
| `:ga:security` | Security concerns | `// :ga:security validate all inputs` |
| `:ga:context` | Important assumptions | `// :ga:context expects UTC timestamps` |
| `:ga:temp` | Temporary code | `// :ga:temp remove after v2.0` |

## Progressive Enhancement

### Level 1: Basic TODO Migration
Start by enhancing your existing TODOs:
```javascript
// TODO :ga: implement caching
// FIXME :ga:security sanitize user input
```

### Level 2: Structured Tasks
Graduate to pure grepa markers:
```javascript
// :ga:todo implement caching
// :ga:task:auth add OAuth support
// :ga:issue(42) fix memory leak
```

### Level 3: Rich Context
Add metadata when needed:
```javascript
// :ga:epic(user-onboarding) new user flow
// :ga:deadline(2024-03-01) compliance update
// :ga:owner(@alice) payment integration
```

## Real AI Agent Workflow

### 1. Human marks the spot:
```python
class UserService:
    # :ga:context all users must have unique emails
    def create_user(self, email: str, name: str):
        # :ga:@agent implement with proper validation
        # :ga:security prevent duplicate emails
        # :ga:todo add rate limiting
        pass
```

### 2. AI agent finds the work:
```bash
$ rg ":ga:@agent"
user_service.py:4: # :ga:@agent implement with proper validation
```

### 3. AI reads the context:
```bash
$ rg ":ga:context|:ga:security" user_service.py
user_service.py:2: # :ga:context all users must have unique emails
user_service.py:5: # :ga:security prevent duplicate emails
```

### 4. AI implements with full understanding:
```python
def create_user(self, email: str, name: str):
    # Validate email format
    if not self._is_valid_email(email):
        raise ValueError("Invalid email format")
    
    # :ga:context enforcing unique email constraint
    if self.user_repo.exists_by_email(email):
        raise DuplicateEmailError(f"Email {email} already exists")
    
    # Create user with validated data
    return self.user_repo.create(email=email, name=name)
```

## Why Grepa?

### For AI Agents
- **Reliable navigation**: Unique pattern that won't match prose
- **Contextual understanding**: Find assumptions and constraints
- **Clear task delegation**: Know exactly what needs doing

### For Developers
- **One command**: `rg ":ga:"` shows all important markers
- **Flexible vocabulary**: Use patterns that make sense for your team
- **Progressive adoption**: Start simple, add richness over time

### For Teams
- **Shared language**: Consistent patterns across the codebase
- **Tool-friendly**: Works with grep, ripgrep, ag, and any search tool
- **Future-proof**: Grows with AI capabilities

## Common Patterns

### Security & Quality
- `:ga:security` - Security-critical code
- `:ga:audit` - Needs review
- `:ga:perf` - Performance concerns
- `:ga:bug` - Known issues

### Project Management
- `:ga:todo` - General tasks
- `:ga:task:` - Specific work items
- `:ga:issue(123)` - Link to issue tracker
- `:ga:epic(auth)` - Feature grouping

### Priority Examples (define your own!)
- `:ga:p0` - Critical priority
- `:ga:urgent` - Needs immediate attention
- `:ga:next-sprint` - Upcoming work
- `:ga:someday` - Future considerations

### AI-Specific
- `:ga:@agent` - Any AI can help
- `:ga:@cursor` - Cursor-specific
- `:ga:prompt` - AI instructions
- `:ga:review` - AI should review

## Escape Hatch

Need to remove all grepa markers? Easy:

```bash
# Find all files with :ga: markers
rg -l ":ga:" 

# Preview what would be removed
rg ":ga:.*$" 

# Remove all :ga: markers (backup first!)
find . -type f -exec sed -i.bak 's/:ga:[^*]*//g' {} +
```

## Quick Reference

```bash
# Find everything
rg ":ga:"

# Find by type
rg ":ga:todo"
rg ":ga:security"
rg ":ga:@agent"

# Find with context (lines before/after)
rg -B1 -A1 ":ga:security"  # 1 line before and after
rg -C2 ":ga:todo"          # 2 lines context

# Find related tags nearby
rg -B2 -A2 ":ga:security" | rg ":ga:(security|todo)"

# Find combinations
rg ":ga:security.*todo|:ga:todo.*security"

# Find in specific files
rg ":ga:" --type js
rg ":ga:" src/

# Count by type
rg ":ga:(\w+)" -o | sort | uniq -c
```

## Getting Started

1. **Try it now**: Add `// :ga:todo` to something in your code
2. **Search for it**: Run `rg ":ga:"` 
3. **Tell your AI**: "Look for :ga: markers to understand the codebase"
4. **Evolve naturally**: Add patterns as you need them

### Quick Setup

Download the `.grepa` directory to get started with scripts and examples:
```bash
# Clone just the .grepa directory
curl -L https://github.com/your-org/grepa/archive/main.tar.gz | tar -xz --strip=1 grepa-main/.grepa

# Generate your first inventory
.grepa/scripts/grepa-list.js
```

See the [Scripting Guide](docs/guides/scripting.md) for automation ideas.

Remember: **The goal is to make your codebase discoverable.** Start simple, stay consistent, and let your patterns grow with your needs.

---

*Inspired by the [OpenAI Codex team's practices](https://www.latent.space/p/codex) for making codebases AI-navigable.*
