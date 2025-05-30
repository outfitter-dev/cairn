# 🔱 Grepa - Magic Anchors for Semantic Code Navigation
<!-- :A: tldr Universal pattern for making codebases AI-navigable and greppable -->
<!-- :A: core Main project documentation and overview -->

> [!IMPORTANT]
> **🚧 Work in Progress** - This is an early proof of concept exploring how to make codebases more navigable for AI agents. I'm actively seeking feedback, suggestions, and use cases. Join the discussion in [Issues](https://github.com/galligan/grepa/issues) or share your thoughts!

> [!TIP]
> **A simple pattern for code navigation.** Magic Anchors (`:A:`) provide a consistent way to mark important spots in code that both AI agents and humans can easily find with grep. Grepa is the tooling that understands and processes these anchors.

## 📚 Documentation

- **[Quick Start](docs/guides/quick-start.md)** - Get started in 5 minutes
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

## 💡 Proposed Solution: Magic Anchors (`:A:`)

A **Magic Anchor** is a small, consistent marker that helps make comments more discoverable:

```javascript
// :A: todo add input validation
function processPayment(amount) {
    // :A: sec verify amount is positive
    chargeCard(amount);
}
```

Search examples:

```bash
rg ":A:"          # List all anchors
rg ":A: sec"      # Jump to security concerns
rg ":A: todo"     # Find all tasks
```

### Why `:A:`?

The `:A:` anchor is the canonical prefix for Magic Anchors. Like how "TODO" became a universal convention, using a single standard prefix:

- **Keeps tooling simple** - One pattern to search, parse, and lint
- **Avoids edge cases** - No conflicts between different anchor styles
- **Universal understanding** - Any developer or AI can recognize `:A:`
- **Fast to type** - Hold Shift for `:`, then `A`, then `:` in one fluid motion

**For monorepos:** Use markers to distinguish services instead of different anchors:

```javascript
// :A: auth-service,todo implement OAuth
// :A: web-app,bug fix responsive layout
```

## 📦 Installation

### As a Global CLI Tool

```bash
npm install -g grepa
# or
pnpm add -g grepa
```

### As a Dev Dependency

```bash
npm install --save-dev grepa
# or
pnpm add -D grepa
```

### CLI Usage

```bash
# Parse files for Magic Anchors
grepa parse src/**/*.ts

# Search for specific markers
grepa search todo src/
grepa search security --context 2

# List all anchors in files
grepa list src/ --json

# Show only unique markers
grepa list src/ --markers
```

## 🚀 Quick Start

### 1. Start Simple

- `:A: todo` - Mark work that needs doing
  ```python
  # :A: todo implement retry logic
  def api_call():
      response = requests.get(url)
      return response
  ```

### 2. Add AI Instructions

- `:A: @agent` - Direct AI agents to specific tasks
  ```javascript
  // :A: @agent write unit tests for edge cases
  function divide(a, b) {
      return a / b;  // :A: todo handle division by zero
  }
  ```

### 3. Mark Important Context

- `:A: ctx` - Document important assumptions
  ```go
  // :A: ctx user_ids are always UUIDs, never integers
  func GetUser(userID string) (*User, error) {
      // :A: sec validate UUID format to prevent injection
      return db.FindUser(userID)
  }
  ```

### 4. Combine as Needed

- Stack multiple tags for richer meaning
  ```typescript
  // :A: sec,todo fix rate limiting
  // :A: tmp,ctx remove after Redis upgrade
  ```

## 🎯 Core Patterns

| Pattern | Purpose | Example |
|---------|---------|---------|
| `:A: tldr` | Brief summary/overview | `// :A: tldr handles user authentication` |
| `:A: todo` | Work to be done | `// :A: todo add error handling` |
| `:A: ctx` | Important context | `// :A: ctx expects UTC timestamps` |
| `:A: @agent` | AI agent tasks | `// :A: @agent implement this function` |
| `:A: sec` | Security concerns | `// :A: sec validate all inputs` |
| `:A: tmp` | Temporary code | `// :A: tmp remove after v2.0` |

## 📈 Progressive Enhancement

### Level 1: Basic TODO Migration
Start by enhancing your existing TODOs:

```javascript
// TODO :A: implement caching
// FIXME :A: sec sanitize user input
```

### Level 2: Structured Tasks
Or use standalone markers:

```javascript
// :A: todo implement caching
// :A: todo(task:auth) add OAuth support
// :A: todo(issue:42) fix memory leak
```

### Level 3: Rich Context
Add metadata when needed:

```javascript
// :A: todo(epic:user-onboarding) new user flow
// :A: todo(deadline:2024-03-01) compliance update
// :A: todo(owner:@alice) payment integration
```

## 🤖 Example AI Agent Workflow

### 1. Human marks the spot:

```python
class UserService:
    # :A: ctx all users must have unique emails
    def create_user(self, email: str, name: str):
        # :A: @agent implement with proper validation
        # :A: sec prevent duplicate emails
        # :A: todo add rate limiting
        pass
```

### 2. AI agent finds the work:

```bash
$ rg ":A: @agent"
user_service.py:4: # :A: @agent implement with proper validation
```

### 3. AI reads the context:

```bash
$ rg ":A: ctx|:A: sec" user_service.py
user_service.py:2: # :A: ctx all users must have unique emails
user_service.py:5: # :A: sec prevent duplicate emails
```

### 4. AI implements with full understanding:

```python
def create_user(self, email: str, name: str):
    # Validate email format
    if not self._is_valid_email(email):
        raise ValueError("Invalid email format")
    
    # :A: ctx enforcing unique email constraint
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

- **One command**: `rg ":A:"` shows all important markers
- **Flexible vocabulary**: Use patterns that make sense for your team
- **Progressive adoption**: Start simple, add richness over time

### For Teams

- **Shared language**: Consistent patterns across the codebase
- **Tool-friendly**: Works with grep, ripgrep, ag, and any search tool
- **Adaptable**: Can evolve with changing needs

## 🔧 Common Patterns

### Security & Quality

- `:A: sec` - Security-critical code
- `:A: audit` - Needs review
- `:A: perf` - Performance concerns
- `:A: bug` - Known issues

### Project Management

- `:A: todo` - General tasks
- `:A: todo(task:specific)` - Specific work items
- `:A: todo(issue:123)` - Link to issue tracker
- `:A: todo(epic:auth)` - Feature grouping

### Priority Examples (define your own!)

- `:A: todo(priority:critical)` - Critical priority
- `:A: urgent` - Needs immediate attention
- `:A: todo(sprint:next)` - Upcoming work
- `:A: someday` - Future considerations

### AI-Specific

- `:A: @agent` - Any AI can help
- `:A: @cursor` - Cursor-specific
- `:A: prompt` - AI instructions
- `:A: review` - AI should review

## 🚪 Escape Hatch

If you need to remove all Magic Anchor markers:

```bash
# Find all files with :A: markers
rg -l ":A:" 

# Preview what would be removed
rg ":A:.*$" 

# Remove all :A: markers (backup first!)
find . -type f -exec sed -i.bak 's/:A:[^*]*//g' {} +
```

## 📋 Quick Reference

```bash
# Find everything
rg ":A:"

# Find by type
rg ":A: todo"
rg ":A: sec"
rg ":A: @agent"

# Find with context (lines before/after)
rg -B1 -A1 ":A: sec"  # 1 line before and after
rg -C2 ":A: todo"     # 2 lines context

# Find related tags nearby
rg -B2 -A2 ":A: sec" | rg ":A: (sec|todo)"

# Find combinations
rg ":A: sec.*todo|:A: todo.*sec"

# Find in specific files
rg ":A:" --type js
rg ":A:" src/

# Count by type
rg ":A: (\w+)" -o | sort | uniq -c
```

## 🎬 Getting Started

1. **Try it now**: Add `// :A: todo` to something in your code
2. **Search for it**: Run `rg ":A:"` or `grepa search todo`
3. **Tell your AI**: "Look for :A: markers to understand the codebase"
4. **Evolve naturally**: Add patterns as you need them

**The goal is discoverability.** Start simple and let your patterns evolve with your needs.

## 🛠️ Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

### Quick Setup

```bash
git clone https://github.com/galligan/grepa.git
cd grepa
pnpm install
pnpm build
pnpm test
```

## 📖 Docs

### Core Documentation

- [Quick Start Guide](docs/guides/quick-start.md) - Get started with Magic Anchors in 5 minutes
- [Examples](docs/examples.md) - Real-world Magic Anchor usage patterns
- [Progressive Enhancement](docs/guides/progressive-enhancement.md) - Three levels of adoption

### Magic Anchors Notation

- [Magic Anchors Overview](docs/magic-anchors/README.md) - Technical format specification
- [Format Specification](docs/magic-anchors/SPEC.md) - Detailed syntax rules
- [Payload Rules](docs/magic-anchors/payloads.md) - How to structure tag payloads
- [Examples](docs/magic-anchors/examples.md) - Notation examples across languages

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

The idea for Magic Anchors comes directly from the Codex team's "Missing Manual" interview on Latent Space (May 17, 2025). The engineers emphasized that AI agents need to jump around repos with a single, collision-free token:

> *"Make your codebase discoverable — a well-named and organised tree lets Codex navigate the filesystem as quickly as a brand-new engineer might."*

They also advised capturing agent-specific conventions in a canonical doc so models "grow as model intelligence grows" — echoing our proposal for a root-level `grepa.yml` dictionary.

That mindset — pick a unique string, grep it everywhere, document the contract — is exactly what `:A:` formalizes. Think of Magic Anchors as the portable follow-up to Codex's internal practice, distilled into a three-character sigil any OSS project or LLM can rely on.

### Sources

- **Blog & transcript**: [latent.space/p/codex](https://www.latent.space/p/codex)
- **Video**: [youtube.com/watch?v=LIHP4BqwSw0](https://www.youtube.com/watch?v=LIHP4BqwSw0)
