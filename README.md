# 🍇 Grepa (grep-anchor)

> **A four-character tag (`:ga:`) you drop in comments so humans and AI agents can `grep` straight to the right spot.**

[![npm version](https://img.shields.io/npm/v/@grepa/cli.svg)](https://www.npmjs.com/package/@grepa/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What is Grepa?

Grepa standardizes code annotations with **grep-anchors** - searchable markers that help both humans and AI navigate codebases efficiently. Instead of scattered TODOs and ad-hoc comments, use a consistent `:ga:` pattern that's instantly greppable.

```javascript
// :ga:tldr Validate user input and return JWT
function authenticate(username, password) {
    // :ga:sec,todo add rate limiting
    // :ga:fixme,p1 timing attack vulnerability
}
```

Find what matters instantly:
```bash
grepa sec                # Find all security anchors
grepa "fix,sec"         # Find security-related fixes  
grepa p1 --open         # Open high-priority items in editor
```

## Why Grepa?

**For Humans:**

- 🎯 **Precise Navigation** - Jump to exactly what you're looking for
- 🏷️ **Consistent Tagging** - No more "TODO" vs "FIXME" vs "HACK" confusion
- 📊 **Better Insights** - See patterns across your entire codebase

**For AI Agents:**

- 🤖 **Agent-Friendly** - AI assistants can navigate with surgical precision
- 🔍 **Semantic Search** - Agents understand context, not just string matching
- 📈 **Scalable** - Works in codebases of any size

## Quick Start

### Install

```bash
npm install -g @grepa/cli
```

### Basic Usage

Add grep-anchors to your code:
```python
# :ga:tldr User authentication service
class AuthService:
    def login(self, username, password):
        # :ga:sec,p0 prevent timing attacks
        # :ga:todo(T-123) implement 2FA
        return self.verify_credentials(username, password)
```

Search with the CLI:
```bash
grepa sec                    # Find security issues
grepa todo                   # Find all TODOs
grepa "p0,p1" --count        # Count high-priority items
```

## Three Ways to Search

You can search for grep-anchors using any tool:

### 1. Standard grep
```bash
grep -n ":ga:" **/*.js              # Find all anchors
grep -n ":ga:sec" **/*.js           # Security anchors
grep -n ":ga:todo" **/*.py          # TODOs in Python files
```

### 2. ripgrep (faster)
```bash
rg -n ":ga:"                        # Find all anchors
rg -n ":ga:sec"                     # Security anchors
rg -n ":ga:todo" -t py              # TODOs in Python files
```

### 3. grepa CLI (smartest)
```bash
grepa sec                           # Semantic search with aliases
grepa "fix,sec"                     # Multiple tags
grepa p1 --open                     # Open in editor
```

The grepa CLI provides semantic search, rich output, and editor integration. [See full CLI documentation →](docs/README.md#cli-usage)

## Quick Examples

| Intent                      | Anchor            | Comment example                                  |
| --------------------------- | ----------------- | ------------------------------------------------ |
| Function summary            | `:ga:tldr`        | `// :ga:tldr Validate user input and return errors` |
| Security review needed      | `:ga:sec`         | `// :ga:sec validate signature length`           |
| Temporary hack              | `:ga:temp`        | `# :ga:temp remove once cache is fixed`          |
| Delegate to agent           | `:ga:@claude`     | `/* :ga:@claude please generate tests */`        |
| Conventional-commit tie-in  | `:ga:fix`         | `// :ga:fix align error codes (will close #123)` |
| Placeholder for future work | `:ga:placeholder` | `<!-- :ga:placeholder better SVG icon -->`       |

## Documentation

- **[Complete Documentation](docs/README.md)** - Comprehensive guide
- **[Syntax Reference](docs/syntax.md)** - Full syntax specification
- **[Examples](docs/examples.md)** - Real-world patterns
- **[Tag Reference](docs/tags/namespace.md)** - Standard tags and aliases

## Best Practices

1. **Always start with `:ga:tldr`** - Every function, class, and module should begin with a brief summary
2. **Layer your anchors** - Combine tags for context: `:ga:fix,sec,p0`
3. **Use standard tags** - Stick to conventional commit types when possible
4. **Document your dictionary** - Define project-specific tags in `.grepa.yml`
5. **Version temporary code** - Always specify when temp code should be removed: `:ga:temp,v2.0`

## Project Structure

This is a monorepo containing:

- `packages/core` - Parser and core utilities
- `packages/cli` - Command-line interface

## Future Directions

- VS Code / NeoVim extension for color-highlighting `:ga:` lines
- GitHub Action `grepa-lint` for automatic policy checks
- ESLint plugin for JavaScript/TypeScript projects
- Language server protocol (LSP) integration

## Inspiration: Lessons from OpenAI Codex

The idea for grep-anchors comes directly from the Codex team's "Missing Manual" interview on Latent Space (May 17, 2025). The engineers emphasized that AI agents need to jump around repos with a single, collision-free token:

> *"Make your codebase discoverable — a well-named and organised tree lets Codex navigate the filesystem as quickly as a brand-new engineer might."*

They also advised capturing agent-specific conventions in a canonical doc so models "grow as model intelligence grows" — echoing our proposal for a root-level `grep-anchor.yml` dictionary.

That mindset — pick a unique string, grep it everywhere, document the contract — is exactly what `:ga:` formalizes. Think of grepa as the portable follow-up to Codex's internal practice, distilled into a four-byte sigil any OSS project or LLM can rely on.

### Sources

* **Blog & transcript**: [latent.space/p/codex](https://www.latent.space/p/codex)
* **Video**: [youtube.com/watch?v=LIHP4BqwSw0](https://www.youtube.com/watch?v=LIHP4BqwSw0)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup.

## License

MIT © [Matt Galligan](https://github.com/galligan)