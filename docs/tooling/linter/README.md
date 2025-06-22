<!-- tldr ::: comprehensive linter documentation for waymark v1.0 validation -->
# Waymark Linter

The waymark linter validates waymark syntax and enforces best practices for consistent, high-quality waymark usage across your codebase.

## Overview

The linter provides:
- **Syntax validation** for waymark v1.0 format
- **Best practice rules** to maintain consistency
- **Custom rule support** for team-specific conventions
- **Auto-fix capabilities** for common issues
- **IDE integration** via ESLint plugin

## Installation

### Standalone CLI

```bash
# Global installation
npm install -g @waymark/linter

# Project installation
pnpm add -D @waymark/linter
```

### ESLint Plugin

```bash
pnpm add -D eslint-plugin-waymark
```

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['waymark'],
  extends: ['plugin:waymark/recommended'],
  rules: {
    'waymark/require-actor-for-todo': 'warn',
    'waymark/no-branch-work-in-main': 'error'
  }
};
```

## Quick Start

### CLI Usage

```bash
# Lint all files
waymark-lint "src/**/*.{js,ts}"

# Auto-fix issues
waymark-lint "src/**/*.js" --fix

# Use custom config
waymark-lint "src/" --config .waymarkrc.json

# Strict mode (v1.0 compliance)
waymark-lint "src/" --strict
```

### Programmatic Usage

```typescript
import { WaymarkLinter } from '@waymark/linter';

const linter = new WaymarkLinter({
  rules: {
    'valid-syntax': 'error',
    'require-actor-for-todo': 'warn',
    'consistent-markers': 'error'
  }
});

const results = await linter.lintFiles(['src/**/*.js']);
results.forEach(result => {
  console.log(`${result.filePath}: ${result.messages.length} issues`);
});
```

## Core Rules

### Syntax Rules

#### `valid-syntax` (error)

Ensures waymarks follow v1.0 syntax specification.

```javascript
// ❌ Invalid
// todo:::missing spaces
// todo :: too few colons
// TODO ::: uppercase marker
// +todo ::: old tag syntax

// ✅ Valid
// todo ::: implement feature
// !fixme ::: critical bug
// *todo ::: branch work
```

#### `valid-marker` (error)

Ensures only valid markers are used.

```javascript
// ❌ Invalid
// task ::: unknown marker
// fix ::: should be 'fixme'
// to-do ::: should be 'todo'

// ✅ Valid
// todo ::: valid marker
// fixme ::: valid marker
// tldr ::: valid marker
```

#### `valid-signal` (error)

Validates signal usage and order.

```javascript
// ❌ Invalid
// !*todo ::: wrong signal order
// !!!todo ::: too many bangs
// +todo ::: invalid signal

// ✅ Valid
// *!todo ::: correct order (position then intensity)
// !!fixme ::: valid double-bang
// ?note ::: valid question
```

#### `valid-tags` (error)

Ensures tags follow v1.0 format.

```javascript
// ❌ Invalid
// todo ::: task +backend              // Old syntax
// todo ::: task #fixes:123            // Missing # in reference
// todo ::: task #owner: @alice        // Space in array

// ✅ Valid
// todo ::: task #backend
// todo ::: task #fixes:#123
// todo ::: task #owner:@alice
```

### Best Practice Rules

#### `require-actor-for-todo` (warn)

Todos should be assigned to someone.

```javascript
// ❌ Unassigned
// todo ::: implement feature

// ✅ Assigned
// todo ::: @alice implement feature
// todo ::: implement feature #owner:@bob
```

#### `require-prose` (error)

Waymarks must include descriptive text.

```javascript
// ❌ No description
// todo :::
// fixme ::: @alice

// ✅ Has description
// todo ::: implement validation
// fixme ::: @alice fix memory leak
```

#### `no-branch-work-in-main` (error)

Prevent branch-scoped waymarks in main/master.

```javascript
// ❌ In main branch
// *todo ::: finish before merge
// *!fixme ::: critical branch work

// ✅ Allowed in feature branches
// *todo ::: complete implementation
```

#### `consistent-markers` (warn)

Use consistent markers across the codebase.

```javascript
// If project uses 'todo' everywhere:
// ❌ Inconsistent
// task ::: implement feature    // Should use 'todo'

// ✅ Consistent
// todo ::: implement feature
```

#### `no-duplicate-anchors` (error)

Anchor definitions must be unique.

```javascript
// ❌ Duplicate anchor
// about ::: ##auth/login Login handler
// ...
// about ::: ##auth/login Another login  // Duplicate!

// ✅ Unique anchors
// about ::: ##auth/login Login handler
// about ::: ##auth/logout Logout handler
```

#### `valid-issue-references` (warn)

Issue references should be valid.

```javascript
// ❌ Invalid references
// todo ::: fix bug #fixes:ABC         // Non-numeric
// todo ::: implement #blocks:         // Empty reference

// ✅ Valid references
// todo ::: fix bug #fixes:#123
// todo ::: implement #blocks:#456,#789
```

### Security Rules

#### `no-sensitive-data` (error)

Prevent sensitive data in waymarks.

```javascript
// ❌ Contains sensitive data
// todo ::: update password to 'secret123'
// fixme ::: API key: sk_live_abcd1234

// ✅ Safe
// todo ::: update password handling
// fixme ::: rotate API keys
```

#### `require-security-review` (warn)

Security-related waymarks need review markers.

```javascript
// ❌ Missing review
// todo ::: implement authentication #security

// ✅ Has review marker
// todo ::: implement authentication #security #needs-review
// review ::: @security-team check auth implementation
```

### Style Rules

#### `marker-case` (warn)

Enforce consistent marker casing.

```javascript
// ❌ Mixed case (if lowercase enforced)
// TODO ::: task
// ToDo ::: another task

// ✅ Consistent lowercase
// todo ::: task
// todo ::: another task
```

#### `prose-capitalization` (warn)

Enforce prose capitalization style.

```javascript
// If sentence-case enforced:
// ❌ Inconsistent
// todo ::: implement Feature
// todo ::: Fix the bug

// ✅ Consistent
// todo ::: Implement feature
// todo ::: Fix the bug
```

#### `max-line-length` (warn)

Limit waymark line length for readability.

```javascript
// ❌ Too long (if limit is 100)
// todo ::: This is an extremely long description that goes on and on and exceeds the maximum line length...

// ✅ Within limit
// todo ::: Implement user authentication
// note ::: See docs/auth.md for details
```

## Configuration

### Configuration File

Create `.waymarkrc.json` in your project root:

```json
{
  "version": "1.0",
  "extends": "waymark:recommended",
  "rules": {
    "valid-syntax": "error",
    "require-actor-for-todo": "warn",
    "no-branch-work-in-main": "error",
    "consistent-markers": ["error", {
      "allowed": ["todo", "fixme", "note", "tldr"]
    }],
    "max-line-length": ["warn", { "limit": 120 }]
  },
  "overrides": [
    {
      "files": ["*.test.js"],
      "rules": {
        "require-actor-for-todo": "off"
      }
    }
  ],
  "customRules": [
    "./rules/team-conventions.js"
  ]
}
```

### Rule Severity Levels

- `"error"` or `2` - Reports as error, exits with code 1
- `"warn"` or `1` - Reports as warning, exits with code 0
- `"off"` or `0` - Disables the rule

### Extends Presets

```json
{
  "extends": "waymark:recommended"  // Recommended rules
  // or
  "extends": "waymark:strict"      // Strict v1.0 compliance
  // or
  "extends": "waymark:minimal"     // Only syntax validation
}
```

## Custom Rules

### Creating Custom Rules

```javascript
// rules/require-jira-reference.js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require JIRA reference for todos',
      category: 'Best Practices'
    },
    fixable: 'code',
    schema: []
  },
  
  create(context) {
    return {
      Waymark(node) {
        if (node.marker === 'todo' && !hasJiraReference(node)) {
          context.report({
            node,
            message: 'TODOs must include a JIRA reference',
            fix(fixer) {
              return fixer.insertTextAfter(
                node,
                ' #jira:PROJ-XXX'
              );
            }
          });
        }
      }
    };
  }
};

function hasJiraReference(waymark) {
  return waymark.tags.relational.jira?.length > 0;
}
```

### Using Custom Rules

```json
// .waymarkrc.json
{
  "customRules": ["./rules/require-jira-reference.js"],
  "rules": {
    "require-jira-reference": "error"
  }
}
```

## IDE Integration

### VS Code

Install the waymark extension for real-time linting:

```json
// .vscode/settings.json
{
  "waymark.lint.enable": true,
  "waymark.lint.run": "onType",
  "waymark.lint.rules": {
    "require-actor-for-todo": "warn"
  }
}
```

### ESLint Integration

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['waymark'],
  extends: ['plugin:waymark/recommended'],
  rules: {
    // Override specific rules
    'waymark/require-actor-for-todo': 'error',
    'waymark/max-line-length': ['warn', { limit: 100 }]
  },
  overrides: [
    {
      // Disable in tests
      files: ['**/*.test.js'],
      rules: {
        'waymark/require-actor-for-todo': 'off'
      }
    }
  ]
};
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/waymark-lint.yml
name: Waymark Lint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run waymark linter
        run: npx waymark-lint "src/**/*.{js,ts}" --format github
        
      - name: Check for branch work in main
        if: github.ref == 'refs/heads/main'
        run: |
          if npx waymark-lint "src/**/*" --rule no-branch-work-in-main:error --quiet; then
            echo "No branch work found"
          else
            echo "::error::Branch-scoped waymarks found in main!"
            exit 1
          fi
```

### Pre-commit Hook

```bash
#!/bin/sh
# .husky/pre-commit

# Lint staged waymarks
files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|ts|jsx|tsx)$')

if [ -n "$files" ]; then
  npx waymark-lint $files --fix
  
  # Re-add fixed files
  git add $files
fi
```

### GitLab CI

```yaml
# .gitlab-ci.yml
waymark-lint:
  stage: test
  script:
    - npm ci
    - npx waymark-lint "src/**/*.{js,ts}" --format gitlab
  rules:
    - if: '$CI_MERGE_REQUEST_ID'
```

## Auto-fix Capabilities

Many rules support auto-fixing:

```bash
# Fix all auto-fixable issues
waymark-lint "src/**/*.js" --fix

# Preview fixes without applying
waymark-lint "src/**/*.js" --fix-dry-run

# Fix specific rule only
waymark-lint "src/**/*.js" --fix --rule valid-syntax
```

### Auto-fixable Rules

| Rule | Fix Description |
|------|----------------|
| `valid-syntax` | Add missing spaces around `:::` |
| `valid-tags` | Convert old syntax to v1.0 |
| `marker-case` | Normalize marker casing |
| `prose-capitalization` | Fix prose capitalization |
| `require-prose` | Cannot auto-fix (requires human input) |

## Output Formats

### Terminal (default)

```
src/auth.js
  15:5  error    TODO must be assigned to someone    require-actor-for-todo
  23:3  warning  Line too long (125 chars)           max-line-length
  
src/api.js
  8:7   error    Invalid waymark syntax              valid-syntax

❌ 2 errors, 1 warning
```

### JSON

```json
{
  "results": [
    {
      "filePath": "src/auth.js",
      "messages": [
        {
          "line": 15,
          "column": 5,
          "severity": "error",
          "ruleId": "require-actor-for-todo",
          "message": "TODO must be assigned to someone"
        }
      ]
    }
  ],
  "errorCount": 2,
  "warningCount": 1
}
```

### GitHub Actions Format

```
::error file=src/auth.js,line=15,col=5::TODO must be assigned to someone
::warning file=src/auth.js,line=23,col=3::Line too long (125 chars)
```

## Performance Optimization

### Caching

```json
// .waymarkrc.json
{
  "cache": true,
  "cacheLocation": ".waymark-cache"
}
```

### Parallel Processing

```bash
# Use multiple threads
waymark-lint "src/**/*.js" --threads 4

# Auto-detect optimal threads
waymark-lint "src/**/*.js" --threads auto
```

### Incremental Linting

```bash
# Only lint changed files
waymark-lint --changed

# Lint files changed since commit
waymark-lint --since HEAD~5
```

## Troubleshooting

### Common Issues

1. **Rule conflicts**
   ```json
   {
     "rules": {
       "require-actor-for-todo": "off",  // Disable if using other assignment method
       "consistent-markers": ["error", {
         "allowed": ["todo", "task"]      // Allow both if migrating
       }]
     }
   }
   ```

2. **Performance issues**
   ```bash
   # Profile slow rules
   waymark-lint "src/**/*" --profile
   
   # Disable expensive rules
   waymark-lint "src/**/*" --rule no-duplicate-anchors:off
   ```

3. **False positives**
   ```javascript
   // Disable for specific line
   // waymark-disable-next-line valid-syntax
   // todo :: legacy format
   
   // Disable for file
   /* waymark-disable require-actor-for-todo */
   ```

### Debug Mode

```bash
# Enable debug logging
DEBUG=waymark:* waymark-lint "src/**/*.js"

# Verbose output
waymark-lint "src/**/*.js" --verbose

# Show rule timing
waymark-lint "src/**/*.js" --profile
```

## Best Practices

1. **Start with recommended preset** - Use `waymark:recommended` and adjust
2. **Enable auto-fix in development** - Save time with `--fix`
3. **Strict in CI, lenient locally** - Different configs for different contexts
4. **Custom rules for team conventions** - Encode your team's practices
5. **Progressive adoption** - Start with warnings, upgrade to errors
6. **Cache in CI** - Speed up repeated runs
7. **Integrate with existing tools** - Use ESLint plugin when possible

## Resources

- [Waymark Syntax Specification](../../syntax/SPEC.md)
- [CLI Documentation](../cli/README.md)
- [Custom Rule Examples](https://github.com/waymark/linter-rules)
- [ESLint Plugin Docs](https://github.com/waymark/eslint-plugin-waymark)