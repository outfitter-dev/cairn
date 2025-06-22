<!-- tldr ::: comprehensive overview of waymark tooling ecosystem -->
# Waymark Tooling Ecosystem

Waymark provides a suite of tools to work with waymarks - standardized code annotations using the `:::` sign that make codebases discoverable by humans and AI agents.

## Overview

The waymark tooling ecosystem consists of:

- **Multitool** - Comprehensive CLI for waymark compliance, tagging, and migration
- **CLI** - Command-line interface for searching and managing waymarks
- **Parser** - JavaScript/TypeScript library for parsing waymark syntax
- **Linter** - Validation rules and best practice enforcement
- **IDE Plugins** - Editor integrations for VS Code, Vim, and more
- **CI/CD Tools** - Automation and validation for continuous integration

## Quick Start

### Installation

```bash
# Global CLI installation
npm install -g @waymark/cli

# Or use in a project
pnpm add -D @waymark/cli @waymark/core
```

### Basic Usage

```bash
# Check for waymark syntax violations
wm audit --legacy

# Preview fixes for violations
wm blaze --dry-run

# Apply fixes (requires --yes)
wm blaze --yes

# Find all waymarks in your project
waymark search "src/**/*.js"

# Find high-priority todos
waymark search "src/" --pattern "!todo"

# List all waymarks with JSON output
waymark list "src/" --format json
```

## Core Components

### Multitool (`@waymarks/multitool`)

Comprehensive TypeScript CLI for waymark development and maintenance:

- **Audit** - Check v1.0 syntax compliance across your codebase
- **Blaze** - Automatically tag violations or remove existing tags
- **TLDR Check** - Analyze documentation quality
- **Migrate** - Convert between waymark syntax versions

[Full Multitool documentation →](./multitool/README.md)

### CLI (`@waymark/cli`)

Command-line interface for waymark operations:

- **Search** - Find waymarks using glob patterns and filters
- **List** - Display all waymarks with grouping options
- **Parse** - Analyze individual files for waymarks
- **Validate** - Check waymark syntax and best practices

[Full CLI documentation →](./cli/README.md)

### Parser (`@waymark/core`)

JavaScript/TypeScript library for programmatic waymark parsing:

- **Syntax Parser** - Parse waymark v1.0 syntax including signals, markers, actors, anchors, and tags
- **Search API** - Find waymarks across multiple files
- **Result Types** - Type-safe interfaces for waymark data
- **Error Handling** - Comprehensive error codes and validation

[Full Parser documentation →](./parser/README.md)

### Linter (`@waymark/linter`)

Validation and best practice enforcement:

- **Syntax Validation** - Ensure correct waymark format
- **Best Practice Rules** - Enforce team conventions
- **ESLint Integration** - Works with existing linting setup
- **Custom Rules** - Define project-specific validations

[Full Linter documentation →](./linter/README.md)

### IDE Plugins

Editor integrations for better waymark workflow:

- **VS Code** - Syntax highlighting, snippets, and navigation
- **Vim** - Syntax files and navigation commands
- **IntelliJ** - Coming soon
- **Sublime Text** - Community maintained

[IDE Plugin documentation →](./ide-plugins/README.md)

## Integration Patterns

### Git Hooks

```bash
# .husky/pre-commit
#!/bin/sh

# Check for branch-scoped work
if waymark search "src/" --pattern "\*" | grep -q .; then
  echo "⚠️  Found branch-scoped waymarks (*). Complete before committing!"
  exit 1
fi
```

### CI/CD Pipeline

```yaml
# .github/workflows/waymarks.yml
name: Waymark Validation

on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install -g @waymark/cli
      
      # Fail on critical waymarks
      - name: Check for critical issues
        run: |
          if waymark search "src/" --pattern "!!" | grep -q .; then
            echo "❌ Critical waymarks found!"
            exit 1
          fi
      
      # Generate waymark report
      - name: Generate report
        run: waymark list "src/" --format json > waymark-report.json
      
      # Upload as artifact
      - uses: actions/upload-artifact@v3
        with:
          name: waymark-report
          path: waymark-report.json
```

### Build Tool Integration

```javascript
// webpack.config.js
const { WaymarkWebpackPlugin } = require('@waymark/webpack-plugin');

module.exports = {
  plugins: [
    new WaymarkWebpackPlugin({
      // Fail build on critical waymarks
      failOnCritical: true,
      // Generate waymark manifest
      generateManifest: true,
      // Exclude patterns
      exclude: ['node_modules/**', 'dist/**']
    })
  ]
};
```

## Common Use Cases

### 1. Code Navigation

```bash
# Find all file summaries
waymark search "src/" --pattern "tldr"

# Find security-related code
waymark search "src/" --tags "#security,#auth"

# Find work assigned to Alice
waymark search "src/" --pattern "@alice"
```

### 2. Task Management

```bash
# Find all todos
waymark list "src/" --marker todo

# Find high-priority work
waymark search "src/" --pattern "![todo|fixme]"

# Find work blocking issues
waymark search "src/" --pattern "#blocks:#"
```

### 3. AI Agent Integration

```bash
# Find AI-delegated tasks
waymark search "src/" --pattern "@agent"

# Export for AI processing
waymark list "src/" --format json | jq '.[] | select(.actor == "@agent")'
```

### 4. Documentation Generation

```bash
# Generate file overview
waymark search "src/" --pattern "tldr" --format markdown > FILE_OVERVIEW.md

# Create anchor reference
waymark search "src/" --pattern "##" --format json | \
  jq -r '.[] | "- ["+.anchor+"]("+.file+"#L"+(.line|tostring)+")"' > ANCHORS.md
```

## Performance Considerations

### Large Codebases

- Use specific glob patterns instead of `**/*`
- Filter by markers or tags early in the pipeline
- Consider using `--max-depth` for directory traversal
- Use JSON output format for better performance with large results

### Caching

- The CLI includes a 15-minute cache for repeated searches
- Parser results can be cached using the `cache` option
- Consider implementing project-level waymark indices

## Best Practices

### 1. Consistent Marker Usage

- Establish team conventions for marker selection
- Use semantic markers that clearly indicate purpose
- Document custom markers in your project README

### 2. Effective Tagging

- Use simple tags for broad categorization: `#backend`, `#security`
- Use relational tags for connections: `#fixes:#123`, `#owner:@alice`
- Keep tag names consistent across the project

### 3. Search Optimization

- Always include `:::` in searches to avoid false positives
- Use the `--pattern` flag for regex searches
- Combine multiple filters for precise results

### 4. CI/CD Integration

- Fail builds on critical waymarks (`!!`)
- Block PRs with unfinished branch work (`*`)
- Generate waymark reports for code reviews
- Track waymark trends over time

## Ecosystem Compatibility

### Language Support

Waymarks work with any language that supports comments:

- **JavaScript/TypeScript** - `// marker :::`
- **Python** - `# marker :::`
- **HTML/Markdown** - `<!-- marker ::: -->`
- **CSS/SCSS** - `/* marker ::: */`
- **Shell/YAML** - `# marker :::`

### Tool Integration

- **ripgrep** - All waymark patterns are ripgrep-optimized
- **Git** - Waymarks are version-controlled with your code
- **GitHub** - Issue references work with GitHub's auto-linking
- **VS Code** - Full integration via extension
- **ESLint** - Validation via plugin

## Troubleshooting

### Common Issues

1. **No waymarks found**
   - Check your glob patterns match actual files
   - Ensure waymarks use correct syntax: `marker ::: content`
   - Verify files aren't being excluded by `.gitignore`

2. **Performance issues**
   - Use more specific file patterns
   - Enable caching with `--cache`
   - Consider using `--max-files` limit

3. **Syntax errors**
   - Ensure exactly one space before and after `:::`
   - Check marker names are lowercase letters only
   - Verify signals are in correct order (position then intensity)

## Resources

- [Waymark Syntax Specification](../syntax/SPEC.md)
- [CLI Command Reference](./cli/README.md)
- [Parser API Documentation](./parser/README.md)
- [Linter Configuration](./linter/README.md)
- [Contributing Guide](../../CONTRIBUTING.md)

## Future Roadmap

- **Language Server Protocol** - Full LSP implementation
- **Web Dashboard** - Project waymark visualization
- **AI Integrations** - Enhanced agent workflows
- **Advanced Analytics** - Waymark trends and insights
- **Plugin Ecosystem** - Community extensions