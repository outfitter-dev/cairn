<!-- tldr ::: developer workflow patterns using waymarks for task management and automation -->
# Workflow Patterns

Common developer workflows and automation patterns using waymarks.

## Task Management Workflows

### Sprint Planning

```javascript
// Sprint work organization
// todo ::: implement user profile API #sprint:24-01 #team:backend
// todo ::: add profile UI components #sprint:24-01 #team:frontend
// !todo ::: fix auth token expiry #sprint:24-01 #fixes:#456

// Blocked work
// todo ::: payment integration #blocked:#789
// notice ::: waiting on vendor API docs #blocks:#payment-integration
```

### Daily Workflow

```bash
# Morning: Check your assigned work
rg ":::.*@$(whoami)"

# See high-priority items
rg "!\!?todo" 

# Check branch-specific work
rg "\*\w+\s+:::"

# Review blocked items
rg "#blocked:|#blocks:"
```

### Code Review Patterns

```javascript
// Review requests
// review ::: @alice security implications of this change
// review ::: @backend-team check performance impact

// Review feedback
// fixme ::: address PR feedback - add input validation
// todo ::: per review - add unit tests
// question ::: @reviewer is this the right approach?

// Post-review cleanup
// *fixme ::: address review comments before merge
// *todo ::: update docs per review feedback
```

## Branch & Release Workflows

### Feature Branch Management

```javascript
// Feature branch work
// todo ::: implement OAuth flow #branch:feature/oauth
// wip ::: payment integration #branch:feature/payments

// Branch-specific tasks (use * signal)
// *todo ::: complete error handling
// *fixme ::: fix failing tests
// *!todo ::: security review before merge
```

### Release Coordination

```javascript
// Release preparation
// !!todo ::: update changelog #release:v2.0
// !review ::: @qa final testing #release:v2.0
// notice ::: feature freeze in effect #release:v2.0

// Hotfix workflow
// !!fixme ::: critical prod bug #hotfix:security-patch
// review ::: @security urgent review needed
// notice ::: deploy immediately after approval
```

### Version Management

```javascript
// Deprecation notices
// deprecated ::: use newMethod() instead #until:v3.0
// notice ::: breaking change in v2.0 #api

// Migration paths
// todo ::: migrate to new API #by:v2.5
// notice ::: legacy support ends v3.0
```

## Issue Tracking Integration

### Issue Lifecycle

```javascript
// New issue
// todo ::: implement feature #fixes:#123

// In progress
// wip ::: working on auth flow #fixes:#123

// Blocked
// todo ::: waiting on design #blocked:#123 #needs:design

// Completed
// done ::: implemented caching #closes:#123
// (then remove the waymark)
```

### Cross-Issue References

```javascript
// Dependencies
// todo ::: update API client #depends:#456 #fixes:#123
// notice ::: blocked by backend changes #blocks:#789

// Related work
// todo ::: similar to #relates:#234
// notice ::: see also #refs:#345,#346
```

## CI/CD Workflows

### Build & Test Management

```javascript
// CI-specific markers
// todo ::: fix flaky test #ci #flaky
// notice ::: test requires env var API_KEY #ci
// fixme ::: build fails on Node 18 #ci #compat

// Deployment notes
// notice ::: requires database migration #deploy
// important ::: update env vars before deploy #deploy #config
// todo ::: add feature flag #deploy #flag:new-checkout
```

### Environment-Specific Work

```javascript
// Environment markers
// fixme ::: only fails in staging #env:staging
// notice ::: prod-only configuration #env:prod
// todo ::: test in all environments #env:dev,staging,prod
```

## Automation Patterns

### Scripted Workflows

```bash
#!/bin/bash
# Find and count todos by assignee
echo "Tasks by assignee:"
rg -o "todo :::.*@\w+" | \
  sed 's/.*@//' | \
  sort | uniq -c | sort -nr

# Generate sprint report
echo "Sprint $(date +%Y-%m) Status:"
echo "Todos: $(rg "todo :::.*#sprint:$(date +%y-%m)" | wc -l)"
echo "In Progress: $(rg "wip :::.*#sprint:$(date +%y-%m)" | wc -l)"
echo "Blocked: $(rg "#blocked:" | wc -l)"
```

### Git Hooks

```bash
# pre-commit hook
#!/bin/bash
# Check for branch-scoped work
if rg -q "\*\w+\s+:::"; then
  echo "Warning: Branch-scoped waymarks found:"
  rg "\*\w+\s+:::"
  echo "Complete these before merging!"
fi

# Check for temporary code
if rg -q "\btemp\s+:::"; then
  echo "Error: Temporary code markers found:"
  rg "\btemp\s+:::"
  exit 1
fi
```

## Search Workflows

### Daily Searches

```bash
# What am I working on?
rg ":::.*@$(whoami)" --sort modified

# What's urgent?
rg "!!\w+\s+:::" -A 2

# What's blocking progress?
rg "#blocked:|blocks:" -B 1 -A 1

# Recent changes?
rg ":::" --sort modified | head -20
```

### Project Overview

```bash
# Get file summaries
rg "tldr :::"

# Security concerns
rg "#security|#sec:"

# Performance hotspots  
rg "#(perf:)?hotpath|#perf:"

# Technical debt
rg "fixme :::|refactor :::|#debt"
```

### Advanced Queries

```bash
# Complex state queries
# Find Alice's blocked security tasks
rg "todo :::.*@alice.*#blocked.*#security"

# Find critical items without assignee
rg "!!\w+\s+:::" | grep -v "@\w\+"

# Find stale WIP items (with file dates)
find . -name "*.js" -mtime +7 -exec rg -l "wip :::" {} \;
```

## Team Collaboration Patterns

### Handoff Workflows

```javascript
// Handoff preparation
// todo ::: @bob taking over from @alice #handoff
// notice ::: see PR #234 for context #handoff
// important ::: talk to @alice about auth approach #handoff

// Knowledge transfer
// about ::: ##payment/flow payment processing logic
// notice ::: tricky edge case here #gotcha
// example ::: see tests for usage #docs
```

### Cross-Team Coordination

```javascript
// Multi-team work
// todo ::: API changes needed #team:backend #for:frontend
// notice ::: breaking change #affects:#mobile,#web
// review ::: @frontend-team check compatibility

// Escalation
// !!todo ::: needs architect review #escalate:@chief-arch
// notice ::: security concern #escalate:security-team
```

## Monitoring & Metrics

### Progress Tracking

```bash
# Generate metrics
echo "Waymark Metrics:"
echo "Total: $(rg ":::" | wc -l)"
echo "TODOs: $(rg "todo :::" | wc -l)"
echo "FIXMEs: $(rg "fixme :::" | wc -l)"
echo "Critical: $(rg "!!\w+\s+:::" | wc -l)"
echo "Assigned: $(rg ":::.*@\w+" | wc -l)"
```

### Trend Analysis

```bash
# Track waymark growth over time
git log --format="%ad" --date=short | \
  sort -u | \
  while read date; do
    count=$(git show $(git rev-list -1 --before="$date" HEAD):. | \
            rg ":::" | wc -l)
    echo "$date: $count waymarks"
  done
```

## Best Practices

1. **Consistent Assignment**: Always put actor first after `:::`
2. **Clear Priorities**: Use signals (`!`, `!!`) not tags
3. **Branch Awareness**: Use `*` for must-complete work
4. **Issue Linking**: Always include `#` in references
5. **Regular Cleanup**: Remove completed waymarks
6. **Team Conventions**: Document your patterns

These patterns evolve with your team. Start simple and add complexity as needed.