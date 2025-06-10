# 🔱 Cairn - Cairns for Semantic Code Navigation
<!-- :M: tldr Universal pattern for making codebases AI-navigable and greppable -->
<!-- :M: core Main project documentation and overview -->

> [!WARNING]
> **📦 Migrating from Grepa?** This project was formerly known as "Grepa" with the package namespace `@grepa/*`. We've rebranded to **Cairn** with breaking changes. See the **[Migration Guide](MIGRATION.md)** for complete upgrade instructions.

> [!IMPORTANT]
> **🚧 Work in Progress** - This is an early proof of concept exploring how to make codebases more navigable for AI agents. I'm actively seeking feedback, suggestions, and use cases. Join the discussion in [Issues](https://github.com/galligan/cairn/issues) or share your thoughts!

> [!TIP]
> **A simple pattern for code navigation.** Cairns (`:M:`) provide a consistent way to mark important spots in code that both AI agents and humans can easily find with grep. Cairn is the tooling that understands and processes these cairns.

## 📚 Documentation

- **[Quick Start](docs/guides/quick-start.md)** - Get started in 5 minutes
- **[Migration Guide](MIGRATION.md)** - Upgrading from Grepa to Cairn
- **[Examples](docs/examples.md)** - Real-world patterns and workflows  
- **[Conventions](docs/conventions/)** - Common tags and best practices
- **[Progressive Guide](docs/guides/progressive-enhancement.md)** - Adopt at your own pace
- **[AI Patterns](docs/conventions/ai-patterns.md)** - Working with AI agents

## 🤔 The Problem

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

## 💡 Proposed Solution: Cairns (`:M:`)

A **Cairn** is a small, consistent context that helps make comments more discoverable:

```javascript
// :M: todo add input validation
function processPayment(amount) {
    // :M: sec verify amount is positive
    chargeCard(amount);
}
```

Search examples:

```bash
rg ":M:"          # List all anchors
rg ":M: sec"      # Jump to security concerns
rg ":M: todo"     # Find all tasks
```

### Why `:M:`?

The `:M:` cairn is the canonical prefix for Cairns. Like how "TODO" became a universal convention, using a single standard prefix:

- **Keeps tooling simple** - One pattern to search, parse, and lint
- **Avoids edge cases** - No conflicts between different cairn styles
- **Universal understanding** - Any developer or AI can recognize `:M:`
- **Fast to type** - Hold Shift for `:`, then `M`, then `:` in one fluid motion

**For monorepos:** Use contexts to distinguish services instead of different cairns:

```javascript
// :M: auth-service,todo implement OAuth
// :M: web-app,bug fix responsive layout
```

## 📦 Installation

### As a Global CLI Tool

```bash
npm install -g cairn
# or
pnpm add -g cairn
```

### As a Dev Dependency

```bash
npm install --save-dev cairn
# or
pnpm add -D cairn
```

### CLI Usage

```bash
# Parse files for Cairns
cairn parse src/**/*.ts

# Search for specific contexts
cairn search todo src/
cairn search security --context 2

# List all anchors in files
cairn list src/ --json

# Show only unique contexts
cairn list src/ --contexts
```

## 🚀 Quick Start

### 1. Start Simple

- `:M: todo` - Mark work that needs doing
  ```python
  # :M: todo implement retry logic
  def api_call():
      response = requests.get(url)
      return response
  ```

### 2. Add AI Instructions

- `:M: @agent` - Direct AI agents to specific tasks
  ```javascript
  // :M: @agent write unit tests for edge cases
  function divide(a, b) {
      return a / b;  // :M: todo handle division by zero
  }
  ```

### 3. Mark Important Context

- `:M: ctx` - Document important assumptions
  ```go
  // :M: ctx user_ids are always UUIDs, never integers
  func GetUser(userID string) (*User, error) {
      // :M: sec validate UUID format to prevent injection
      return db.FindUser(userID)
  }
  ```

### 4. Combine as Needed

- Stack multiple tags for richer meaning
  ```typescript
  // :M: sec,todo fix rate limiting
  // :M: temp,ctx remove after Redis upgrade
  ```

## 🎯 Core Patterns

| Pattern | Purpose | Example |
|---------|---------|---------|
| `:M: tldr` | Brief summary/overview | `// :M: tldr handles user authentication` |
| `:M: todo` | Work to be done | `// :M: todo add error handling` |
| `:M: ctx` | Important context | `// :M: ctx expects UTC timestamps` |
| `:M: @agent` | AI agent tasks | `// :M: @agent implement this function` |
| `:M: sec` | Security concerns | `// :M: sec validate all inputs` |
| `:M: temp` | Temporary code | `// :M: temp remove after v2.0` |

## 📈 Progressive Enhancement

### Level 1: Basic TODO Migration
Start by enhancing your existing TODOs:

```javascript
// TODO :M: implement caching
// FIXME :M: sec sanitize user input
```

### Level 2: Structured Tasks
Or use standalone contexts:

```javascript
// :M: todo implement caching
// :M: todo(task:auth) add OAuth support
// :M: todo(issue:42) fix memory leak
```

### Level 3: Rich Context
Add metadata when needed:

```javascript
// :M: todo(epic:user-onboarding) new user flow
// :M: todo(deadline:2024-03-01) compliance update
// :M: todo(owner:@alice) payment integration
```

## 🤖 Example AI Agent Workflow

### 1. Human marks the spot:

```python
class UserService:
    # :M: ctx all users must have unique emails
    def create_user(self, email: str, name: str):
        # :M: @agent implement with proper validation
        # :M: sec prevent duplicate emails
        # :M: todo add rate limiting
        pass
```

### 2. AI agent finds the work:

```bash
$ rg ":M: @agent"
user_service.py:4: # :M: @agent implement with proper validation
```

### 3. AI reads the context:

```bash
$ rg ":M: ctx|:M: sec" user_service.py
user_service.py:2: # :M: ctx all users must have unique emails
user_service.py:5: # :M: sec prevent duplicate emails
```

### 4. AI implements with full understanding:

```python
def create_user(self, email: str, name: str):
    # Validate email format
    if not self._is_valid_email(email):
        raise ValueError("Invalid email format")
    
    # :M: ctx enforcing unique email constraint
    if self.user_repo.exists_by_email(email):
        raise DuplicateEmailError(f"Email {email} already exists")
    
    # Create user with validated data
    return self.user_repo.create(email=email, name=name)
```

## ✨ Potential Benefits

### For AI Agents

- **Reliable navigation**: Consistent pattern that's less likely to match prose
- **Contextual understanding**: Find assumptions and constraints
- **Clear task delegation**: Helps identify what needs doing

### For Developers

- **One command**: `rg ":M:"` shows all important contexts
- **Flexible vocabulary**: Use patterns that make sense for your team
- **Progressive adoption**: Start simple, add richness over time

### For Teams

- **Shared language**: Consistent patterns across the codebase
- **Tool-friendly**: Works with grep, ripgrep, ag, and any search tool
- **Adaptable**: Can evolve with changing needs

## 🔧 Common Patterns

### Security & Quality

- `:M: sec` - Security-critical code
- `:M: audit` - Needs review
- `:M: perf` - Performance concerns
- `:M: bug` - Known issues

### Project Management

- `:M: todo` - General tasks
- `:M: todo(task:specific)` - Specific work items
- `:M: todo(issue:123)` - Link to issue tracker
- `:M: todo(epic:auth)` - Feature grouping

### Priority Examples (define your own!)

- `:M: todo(priority:critical)` - Critical priority
- `:M: urgent` - Needs immediate attention
- `:M: todo(sprint:next)` - Upcoming work
- `:M: someday` - Future considerations

### AI-Specific

- `:M: @agent` - Any AI can help
- `:M: @cursor` - Cursor-specific
- `:M: prompt` - AI instructions
- `:M: review` - AI should review

## 🚪 Escape Hatch

If you need to remove all Cairn contexts:

```bash
# Find all files with :M: contexts
rg -l ":M:" 

# Preview what would be removed
rg ":M:.*$" 

# Remove all :M: contexts (backup first!)
find . -type f -exec sed -i.bak 's/:M:[^*]*//g' {} +
```

## 📋 Quick Reference

```bash
# Find everything
rg ":M:"

# Find by type
rg ":M: todo"
rg ":M: sec"
rg ":M: @agent"

# Find with context (lines before/after)
rg -B1 -A1 ":M: sec"  # 1 line before and after
rg -C2 ":M: todo"     # 2 lines context

# Find related tags nearby
rg -B2 -A2 ":M: sec" | rg ":M: (sec|todo)"

# Find combinations
rg ":M: sec.*todo|:M: todo.*sec"

# Find in specific files
rg ":M:" --type js
rg ":M:" src/

# Count by type
rg ":M: (\w+)" -o | sort | uniq -c
```

## 🎬 Getting Started

1. **Try it now**: Add `// :M: todo` to something in your code
2. **Search for it**: Run `rg ":M:"` or `cairn search todo`
3. **Tell your AI**: "Look for :M: cairns to understand the codebase"
4. **Evolve naturally**: Add patterns as you need them

**The goal is discoverability.** Start simple and let your patterns evolve with your needs.

## 🛠️ Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

### Quick Setup

```bash
git clone https://github.com/galligan/cairn.git
cd cairn
pnpm install
pnpm build
pnpm test
```

## 📖 Docs

### Core Documentation

- [Quick Start Guide](docs/guides/quick-start.md) - Get started with Cairns in 5 minutes
- [Examples](docs/examples.md) - Real-world Cairn usage patterns
- [Progressive Enhancement](docs/guides/progressive-enhancement.md) - Three levels of adoption

### Cairns Notation

- [Cairns Overview](docs/cairns/README.md) - Technical format specification
- [Format Specification](docs/cairns/SPEC.md) - Detailed syntax rules
- [Payload Rules](docs/cairns/payloads.md) - How to structure tag payloads
- [Examples](docs/cairns/examples.md) - Notation examples across languages

### Conventions & Patterns

- [Conventions Overview](docs/conventions/README.md) - Usage patterns and best practices
- [Common Patterns](docs/conventions/common-patterns.md) - Essential tags like `tldr`, `sec`, `tmp`
- [AI Patterns](docs/conventions/ai-patterns.md) - Working with AI agents using `@cursor` and `@claude`
- [Workflow Patterns](docs/conventions/workflow-patterns.md) - Task tracking and workflows
- [Domain-Specific](docs/conventions/domain-specific.md) - Specialized patterns for frameworks
- [Combinations](docs/conventions/combinations.md) - Using multiple tags effectively

### Advanced Topics

- [Advanced Patterns](docs/advanced-patterns.md) - Complex usage scenarios
- [What Ifs](docs/what-ifs.md) - Vision for AI-native development

### Project Information

- [Prior Art](docs/about/priors.md) - Related concepts and inspiration
- [V0 Specification](docs/project/specs/v0.md) - Initial specification
- [V1 Specification](docs/project/specs/v1.md) - Current specification

---

## 🌟 Inspiration: Lessons from OpenAI Codex

The idea for Cairns comes directly from the Codex team's "Missing Manual" interview on Latent Space (May 17, 2025). The engineers emphasized that AI agents need to jump around repos with a single, collision-free token:

> *"Make your codebase discoverable — a well-named and organised tree lets Codex navigate the filesystem as quickly as a brand-new engineer might."*

They also advised capturing agent-specific conventions in a canonical doc so models "grow as model intelligence grows" — echoing our proposal for a root-level `cairn.yml` dictionary.

That mindset — pick a unique string, grep it everywhere, document the contract — is exactly what `:M:` formalizes. Think of Cairns as the portable follow-up to Codex's internal practice, distilled into a three-character identifier any OSS project or LLM can rely on.

### Sources

- **Blog & transcript**: [latent.space/p/codex](https://www.latent.space/p/codex)
- **Video**: [youtube.com/watch?v=LIHP4BqwSw0](https://www.youtube.com/watch?v=LIHP4BqwSw0)
