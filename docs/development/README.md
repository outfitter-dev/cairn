<!-- tldr ::: ##waymark-dev-guide contributor's guide to waymark development and tooling -->

# Development Guide

Welcome to waymark development! This guide will help you get up to speed on contributing to the waymark project.

## Quick Start

1. **Clone and setup**:
   ```bash
   git clone <repo-url>
   cd waymark
   pnpm install
   ```

2. **Run quality checks**:
   ```bash
   pnpm ci:local    # Full CI simulation
   pnpm check:all   # Comprehensive validation
   ```

3. **Test waymark tooling**:
   ```bash
   node scripts/audit-waymarks.js --test
   node scripts/blaze.js --dry-run
   ```

## Project Structure

```
waymark/
├── docs/
│   ├── development/     # This directory - dev docs
│   ├── syntax/         # Waymark syntax specification
│   └── tooling/        # Tool documentation
├── scripts/            # Development scripts
│   ├── lib/           # Shared script libraries
│   ├── tests/         # Test files for scripts
│   ├── audit-waymarks.js  # Main auditing tool
│   └── blaze.js       # Automated tagging tool
└── packages/          # Future: waymark packages
```

## Development Workflow

### Git Workflow
- **Main branch**: `main`
- **Feature branches**: `feature/description` 
- **Conventional commits**: Required
- **Pre-push checks**: Automated via hooks

### Quality Standards
<!-- important ::: all code must pass these checks before merge -->

1. **Syntax compliance**: All waymarks must use v1.0 syntax
2. **No temp markers**: Remove `*temp` and `*!temp` before push
3. **CI passing**: `pnpm ci:local` must succeed
4. **No lint errors**: Clean TypeScript and formatting

### Waymark Usage

This project uses **waymarks** extensively. Key patterns:

```javascript
// todo ::: implement feature #backend
// !fixme ::: critical security issue #security
// notice ::: important deployment info #ops
// about ::: ##auth/login main auth entry point
```

See [waymark syntax guide](../syntax/README.md) for complete specification.

## Development Scripts

See [dev-scripts.md](./dev-scripts.md) for detailed documentation of all development tooling.

### Quick Reference

```bash
# Quality checks
pnpm ci:local              # Full CI simulation
pnpm check:all             # All checks + temp marker detection

# Waymark tooling
node scripts/audit-waymarks.js           # Audit all waymarks
node scripts/audit-waymarks.js --test    # Test mode only
node scripts/audit-waymarks.js --legacy  # Show violations only
node scripts/blaze.js --dry-run          # Preview tagging

# Development
pnpm dev                   # Start development mode
pnpm test                  # Run tests
pnpm build                 # Build project
```

## Contributing Guidelines

### Before You Start

1. **Search existing issues** and waymarks: `rg "todo.*feature-name"`
2. **Check current work**: `rg "!todo"` for high-priority items
3. **Understand the context**: Read relevant `tldr` waymarks in files you'll modify

### Making Changes

1. **Branch from main**: `git checkout -b feature/your-feature`
2. **Use waymarks**: Mark your work with appropriate waymarks
3. **Test locally**: Run `pnpm ci:local` before pushing
4. **Follow conventions**: Use existing patterns and styles

### Waymark Conventions

- **File overviews**: Start files with `<!-- tldr ::: brief description -->`
- **Work items**: Use `todo`, `fixme`, `refactor` appropriately  
- **Documentation**: Use `about` for explanations, `notice` for important info
- **Priority**: Use signals (`!`, `!!`) not properties (`priority:high`)
- **Tags**: Use `#` prefix for all tags (`#backend`, `#security`)

### Code Review

All PRs are reviewed for:
- **Waymark compliance**: v1.0 syntax only
- **Test coverage**: New features need tests
- **Documentation**: Update docs for user-facing changes
- **Performance**: No regressions in tooling performance

## Resources

- [Waymark Syntax Specification](../syntax/README.md)
- [Development Scripts](./dev-scripts.md)
- [Tooling Documentation](../tooling/README.md)
- [Quick Reference](../QUICKSTART.md)

## Getting Help

1. **Search waymarks**: `rg "about.*topic"` for explanations
2. **Check issues**: Look for related GitHub issues
3. **Ask questions**: Create an issue with the `question` label

---

<!-- notice ::: keep this guide updated as the project evolves -->