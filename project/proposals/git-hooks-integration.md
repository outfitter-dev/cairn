<!-- tldr ::: Git hooks for automatic waymark validation, tracking, and branch-scoped work enforcement +proposal -->

# Proposal: Git Hooks for Waymark Workflow Integration

## Status

| Date       | State | Owner |
|------------|-------|-------|
| 2025-06-16 | Draft | @mg   |

## Context

Waymarks with the `*` (star) signal indicate branch-scoped work that must be completed before merging. Currently, enforcing this convention relies on:

- Manual PR reviews
- CI checks that run after push
- Developer discipline

This leads to:
- Forgotten branch work items
- CI failures after code is pushed
- Inconsistent waymark hygiene across team members

## Decision

Implement **git hooks** that automatically validate waymarks at commit time and enforce branch-scoped work completion before merge. Hooks are opt-in locally but required in CI.

## Hook Architecture

```
.git/hooks/
├── pre-commit        # Validate waymark syntax
├── prepare-commit-msg # Auto-populate from branch waymarks
├── post-commit       # Sync to waymark database
├── pre-push          # Check star waymarks
└── post-checkout     # Notify about branch waymarks

.waymark/
└── hooks/
    ├── pre-commit.js     # Actual implementation
    ├── pre-push.js       # (git hooks call these)
    └── install.js        # Setup script
```

## Implementation

### Pre-commit Hook

Validates waymark syntax and enforces standards:

```javascript
#!/usr/bin/env node
// .waymark/hooks/pre-commit.js

import { WaymarkParser } from '@waymark/core';
import { execSync } from 'child_process';

async function main() {
  // Get staged files
  const files = execSync('git diff --cached --name-only')
    .toString()
    .trim()
    .split('\n')
    .filter(f => /\.(js|ts|py|md)$/.test(f));
  
  const errors = [];
  
  for (const file of files) {
    // Get staged content (not working directory)
    const content = execSync(`git show :${file}`).toString();
    
    // Parse waymarks
    const result = await WaymarkParser.parse(content, file);
    
    // Check for errors
    if (result.errors.length > 0) {
      errors.push(`${file}:\n  ${result.errors.join('\n  ')}`);
    }
    
    // Validate required properties
    for (const waymark of result.waymarks) {
      if (waymark.marker === 'todo' && !waymark.actor) {
        errors.push(`${file}:${waymark.line} - todo missing assignee`);
      }
    }
  }
  
  if (errors.length > 0) {
    console.error('Waymark validation failed:\n');
    console.error(errors.join('\n\n'));
    process.exit(1);
  }
  
  console.log('✅ Waymarks validated');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
```

### Prepare-commit-msg Hook

Auto-generates commit message from completed waymarks:

```javascript
#!/usr/bin/env node
// .waymark/hooks/prepare-commit-msg.js

async function main() {
  const messageFile = process.argv[2];
  const source = process.argv[3]; // undefined for normal commits
  
  if (source) return; // Skip for merges, squashes, etc.
  
  // Find completed waymarks (comparing staged vs HEAD)
  const completed = await findCompletedWaymarks();
  
  if (completed.length > 0) {
    const summary = completed
      .map(w => `- ${w.marker}: ${w.content}`)
      .join('\n');
    
    // Append to commit message
    const currentMessage = fs.readFileSync(messageFile, 'utf8');
    const newMessage = `${currentMessage}\n\nCompleted waymarks:\n${summary}`;
    
    fs.writeFileSync(messageFile, newMessage);
  }
}
```

### Pre-push Hook

Enforces star waymark completion:

```javascript
#!/usr/bin/env node
// .waymark/hooks/pre-push.js

async function main() {
  const localRef = process.argv[2];
  const localSha = process.argv[3];
  const remoteRef = process.argv[4];
  const remoteSha = process.argv[5];
  
  // Get current branch
  const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  
  // Skip for main/master
  if (['main', 'master', 'develop'].includes(branch)) {
    return;
  }
  
  // Find star waymarks in this branch
  const starWaymarks = execSync(`git diff ${remoteSha}..${localSha} | rg "\\+.*\\*\\w+\\s+:::"`)
    .toString()
    .trim()
    .split('\n')
    .filter(Boolean);
  
  if (starWaymarks.length > 0) {
    console.error(`
❌ Branch contains ${starWaymarks.length} star waymarks that must be completed:

${starWaymarks.join('\n')}

Star waymarks (*) indicate branch-scoped work that must be finished before merge.
To proceed:
1. Complete the marked tasks
2. Remove the star prefix when done
3. Commit and push again

To override (not recommended):
  git push --no-verify
`);
    process.exit(1);
  }
}
```

### Post-checkout Hook

Notifies about waymarks in new branch:

```javascript
#!/usr/bin/env node
// .waymark/hooks/post-checkout.js

async function main() {
  const previousHead = process.argv[2];
  const newHead = process.argv[3];
  const branchCheckout = process.argv[4] === '1';
  
  if (!branchCheckout) return;
  
  // Count waymarks in new branch
  const stats = await getWaymarkStats();
  
  if (stats.total > 0) {
    console.log(`
📋 Branch waymark summary:
  ${stats.star} star waymarks (must complete before merge)
  ${stats.todo} todos (${stats.assigned} assigned to you)
  ${stats.alerts} alerts
  
Run 'waymark list --mine' to see your assigned items.
`);
  }
}
```

## Installation

### Automatic (Recommended)

```bash
# Install hooks for current project
waymark hooks install

# Install globally for all projects
waymark hooks install --global

# Uninstall
waymark hooks uninstall
```

### Manual

```bash
# Link hooks
ln -sf ../../.waymark/hooks/pre-commit.js .git/hooks/pre-commit
ln -sf ../../.waymark/hooks/pre-push.js .git/hooks/pre-push
# etc...
```

### CI Integration

```yaml
# .github/workflows/waymarks.yml
name: Waymark Validation
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Check star waymarks
        run: |
          if [ "${{ github.event_name }}" = "pull_request" ]; then
            npx waymark check --star-waymarks
          fi
      
      - name: Validate all waymarks
        run: npx waymark lint
```

## Configuration

```json
// .waymark/config.json
{
  "hooks": {
    "enabled": true,
    "pre-commit": {
      "validateSyntax": true,
      "requireAssignee": ["todo", "fix"],
      "forbiddenMarkers": ["fixme", "hack"]
    },
    "pre-push": {
      "blockStarWaymarks": true,
      "allowOverride": false
    },
    "notifications": {
      "onCheckout": true,
      "onCommit": false
    }
  }
}
```

## Developer Experience

### Success Case
```bash
$ git commit -m "Fix authentication"
✅ Waymarks validated
[feature/auth abc123] Fix authentication

$ git push
✅ No blocking waymarks found
```

### Failure Case
```bash
$ git commit -m "WIP"
Waymark validation failed:

src/auth.ts:
  Line 45: todo missing assignee
  Line 67: deprecated marker 'fixme' (use 'fix')

$ git push
❌ Branch contains 2 star waymarks that must be completed:

+ // *todo ::: implement error handling
+ // *fix ::: validate token expiry

Star waymarks (*) indicate branch-scoped work...
```

## Migration Plan

### Phase 1: Core Hooks (3 days)
- Implement pre-commit validation
- Basic pre-push star checking
- Installation script

### Phase 2: Team Rollout (1 week)
- Documentation and training
- Opt-in period with warnings only
- Gather feedback

### Phase 3: Enforcement (2 weeks)
- Enable in CI
- Block merges with star waymarks
- Monitor metrics

### Phase 4: Advanced Features (ongoing)
- Commit message generation
- Waymark-based changelog
- Branch work planning

## Success Metrics

- 95% of commits have valid waymark syntax
- Zero PRs merged with star waymarks
- 50% reduction in "forgot to assign" comments
- <100ms hook execution time

## Risks & Mitigations

- **Developer friction** - Make hooks fast and helpful, not punitive
- **False positives** - Comprehensive test suite for edge cases
- **Bypass temptation** - Track `--no-verify` usage in metrics
- **Windows compatibility** - Test extensively, provide PowerShell versions