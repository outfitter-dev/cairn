# 🍇 Grepa - Detailed Documentation

This repository contains the specification and reference implementation for **grep-anchors** - a lightweight markup system for making codebases more discoverable through standardized comment markers.

## Table of Contents

- [Architecture](#architecture)
- [Implementation Roadmap](#implementation-roadmap)
- [Packages](#packages)
- [Development](#development)
- [Contributing](#contributing)

## Architecture

The grepa ecosystem is designed as a modular system:

```
┌─────────────────────────────────────────┐
│           Editor Plugins                 │
│  (VS Code, Neovim, IntelliJ, etc.)     │
└─────────────┬───────────────────────────┘
              │
┌─────────────┴───────────────────────────┐
│         CLI & Build Tools               │
│  (@grepa/cli, GitHub Actions, etc.)     │
└─────────────┬───────────────────────────┘
              │
┌─────────────┴───────────────────────────┐
│           Core Library                  │
│         (@grepa/core)                   │
│  - Parser                               │
│  - Validator                            │
│  - Formatter                            │
└─────────────────────────────────────────┘
```

## Implementation Roadmap

### Phase 1: Foundation (Current)
- ✅ Define grep-anchor specification
- ✅ Document common patterns and use cases
- ✅ Create style guide and examples
- 🔄 Gather community feedback

### Phase 2: Core Tools
- [ ] Implement @grepa/core parser library
- [ ] Build @grepa/cli with basic commands
- [ ] Create GitHub Action for CI integration

### Phase 3: Editor Integration
- [ ] VS Code extension with syntax highlighting
- [ ] Neovim plugin
- [ ] Language Server Protocol (LSP) implementation

### Phase 4: Ecosystem
- [ ] ESLint plugin for enforcement
- [ ] Prettier plugin for formatting
- [ ] Integration with popular frameworks

## Packages

Currently, all package implementations are archived in the `archive/pre-rebuild-2025-01` branch. The packages include:

### @grepa/core
The core parsing and validation library. Features:
- Anchor parsing with full grammar support
- Validation rules engine
- Formatting utilities
- TypeScript types and interfaces

### @grepa/cli
Command-line interface for working with grep-anchors:
- `grepa list` - List all anchors in a codebase
- `grepa search` - Search for specific anchor patterns
- `grepa lint` - Validate anchor syntax and conventions
- `grepa stats` - Generate anchor usage statistics
- `grepa watch` - Monitor changes in real-time

## Development

### Prerequisites
- Node.js 18+ 
- pnpm 8+
- ripgrep (rg) for fast searching

### Getting Started
```bash
# Clone the repository
git clone https://github.com/galligan/grepa.git
cd grepa

# For now, use ripgrep directly
rg -n ":ga:" 

# Future: Install dependencies and build
# pnpm install
# pnpm build
```

### Project Structure
```
grepa/
├── docs/               # Specification and documentation
│   ├── styleguide/    # Tag conventions and patterns
│   ├── project/       # Project specifications
│   └── about/         # Background and prior art
├── packages/          # (Archived) Implementation packages
│   ├── core/         # Parser and utilities
│   └── cli/          # Command-line interface
└── .claude/          # AI agent configuration
```

## Contributing

We welcome contributions! The project follows these principles:

1. **Simplicity First**: Keep the core concept simple and grep-able
2. **Documentation Driven**: Document patterns before implementing tools
3. **Community Feedback**: Gather input before building complex features
4. **Incremental Progress**: Build and ship small, useful pieces

### Contribution Areas

- **Documentation**: Improve examples, add use cases, clarify concepts
- **Patterns**: Propose new anchor types and conventions
- **Tools**: Build integrations for your favorite editor or framework
- **Feedback**: Share how you're using grep-anchors in your projects

### Development Workflow

1. Fork the repository
2. Create a feature branch (`feat/your-feature`)
3. Make your changes
4. Ensure all examples use grep-anchors (`:ga:tldr` for functions)
5. Submit a pull request

## Resources

- [Syntax Guide](../docs/syntax-guide.md) - Full grammar specification
- [Style Guide](../docs/styleguide/) - Conventions and patterns
- [Examples](../docs/examples.md) - Real-world usage patterns
- [Prior Art](../docs/about/priors.md) - Related concepts and inspiration

## License

MIT - See [LICENSE](../LICENSE) file for details

## Acknowledgments

Special thanks to the OpenAI Codex team for inspiring this approach through their "Missing Manual" interview on Latent Space, where they emphasized the importance of making codebases discoverable through unique, greppable tokens.