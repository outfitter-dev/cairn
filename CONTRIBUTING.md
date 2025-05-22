# Contributing to Grepa

Thank you for your interest in contributing to Grepa! This guide will help you get started.

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/grepa.git
   cd grepa
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build the project**
   ```bash
   pnpm build
   ```

4. **Link CLI for testing**
   ```bash
   cd packages/cli
   pnpm link --global
   ```

## Project Structure

```
grepa/
├── packages/
│   ├── core/          # Parser and utilities
│   └── cli/           # Command-line interface
├── scripts/
│   └── hooks/         # Git hooks
└── docs/              # Documentation
```

## Development Workflow

### 1. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make your changes

Remember to:
- Add `:ga:tldr` to every new function
- Use appropriate grep-anchors throughout your code
- Follow the existing code style
- Add tests for new functionality

### 3. Run tests

```bash
pnpm test
```

### 4. Run linting

```bash
pnpm lint
grepa lint --ci  # Dogfood our own tool!
```

### 5. Build and test locally

```bash
pnpm build
grepa list  # Test the CLI
```

### 6. Commit your changes

Follow conventional commits:
```bash
git commit -m "feat(core): add support for nested tokens"
git commit -m "fix(cli): handle empty files gracefully"
```

## Coding Guidelines

### Use Grep-Anchors

Every contribution should properly use grep-anchors:

```typescript
// :ga:tldr Parse nested token structures
// :ga:api Public parser extension
export function parseNestedTokens(payload: string): Token[] {
  // :ga:algo Recursive token parsing
  // ...
}
```

### TypeScript Standards

- Enable strict mode
- Avoid `any` types
- Use interfaces over type aliases for objects
- Document public APIs with JSDoc

### Testing

- Write unit tests for parser logic
- Add integration tests for CLI commands
- Use fixtures for test data
- Aim for high coverage

## Adding New Features

### New Token Types

1. Update types in `packages/core/src/types.ts`
2. Extend parser in `packages/core/src/parser.ts`
3. Add examples to documentation
4. Update `.grepa.yml` dictionary

### New Commands

1. Create command file in `packages/cli/src/commands/`
2. Register in `packages/cli/src/cli.ts`
3. Add tests and documentation
4. Update README with examples

### New Lint Rules

1. Add rule logic to `packages/core/src/lint.ts`
2. Update config schema in `packages/core/src/types.ts`
3. Document in configuration section
4. Add tests for edge cases

## Documentation

- Update README.md for user-facing changes
- Update CLAUDE.md for AI agent guidance
- Add examples to docs/examples.md
- Keep syntax.md in sync with parser

## Pull Request Process

1. **Open a PR** with a clear title and description
2. **Link issues** if applicable
3. **Ensure CI passes** - all tests and lints must pass
4. **Request review** from maintainers
5. **Address feedback** promptly

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing opinions

## Getting Help

- Open an issue for bugs or feature requests
- Join discussions in GitHub Discussions
- Tag @galligan for urgent matters

## License

By contributing, you agree that your contributions will be licensed under the MIT License.