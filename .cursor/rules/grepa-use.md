---
description: "How to search and navigate using Grepa grep-anchors effectively"
alwaysApply: true
---

# Grepa Search and Navigation Guide

This codebase uses grep-anchors (`:ga:` patterns) as a universal navigation system. Understanding how to search and utilize these anchors enables rapid code discovery, context gathering, and intelligent navigation for both development and AI-assisted tasks.

## Core Search Philosophy

Grep-anchors transform the codebase into a searchable knowledge graph. Every `:ga:` marker is a discoverable entry point that provides immediate context about the surrounding code. The search patterns are designed to be:
- **Compositional** - Combine searches to find intersections
- **Contextual** - Always show surrounding code
- **Progressive** - Start broad, refine as needed

## Essential Search Patterns

### Finding All Anchors

The most basic search shows all navigation points:

```bash
rg ":ga:"                    # All anchors in the codebase
rg ":ga:" --stats            # Summary with counts
rg -t py ":ga:"              # Python files only
```

### Tag-Specific Searches

Target specific concerns by searching for tags:

```bash
rg ":ga:todo"                # All pending work
rg ":ga:sec"                 # Security-sensitive code
rg ":ga:@agent"              # AI agent tasks
rg ":ga:ctx"                 # Important context/assumptions
rg ":ga:tmp"                 # Temporary code to remove
```

### Context-Aware Searching

Always search with context to understand the surrounding code:

```bash
rg -C2 ":ga:sec"             # 2 lines before and after
rg -B3 -A3 ":ga:todo"        # 3 lines before, 3 after
rg -B5 -A10 ":ga:@agent"     # Asymmetric context for AI tasks
```

## Advanced Search Techniques

### Multi-Tag Searches

Find code with multiple concerns:

```bash
# Security TODOs
rg ":ga:sec" | rg "todo"

# Performance issues in payment service
rg ":ga:payment" | rg "perf"

# All context for security code
rg -B2 -A2 ":ga:sec" | rg ":ga:(sec|ctx)"
```

### File-Scoped Investigation

Understand all anchors in a specific file:

```bash
# All anchors in a file
rg ":ga:" path/to/file.js

# With full context
rg -C5 ":ga:" path/to/file.js

# Specific concerns in a file
rg ":ga:(sec|todo)" path/to/file.js
```

### Pattern-Based Discovery

Use regex for flexible searches:

```bash
# All issue references
rg ":ga:issue\([^)]+\)"

# Deadline markers
rg ":ga:.*deadline"

# Owner assignments
rg ":ga:.*owner\(@\w+\)"
```

## AI Agent Workflow Patterns

### Task Discovery

When working as an AI agent, follow this systematic approach:

1. **Find assigned tasks**:
```bash
rg ":ga:@agent"
```

2. **Gather context for each task**:
```bash
# Get surrounding context
rg -B10 -A10 ":ga:@agent" specific_file.py

# Find related security/context markers
rg ":ga:(ctx|sec)" specific_file.py
```

3. **Check for dependencies**:
```bash
# Find related TODOs
rg -B5 -A5 ":ga:todo" specific_file.py

# Check for temporary code
rg ":ga:tmp" specific_file.py
```

### Context Building

Before modifying code, build complete context:

```bash
# Step 1: Find the specific anchor
rg ":ga:@agent implement validation" 

# Step 2: Get all context in that file
rg ":ga:" user_service.py

# Step 3: Find related patterns in codebase
rg ":ga:.*validation" --type py

# Step 4: Check for existing examples
rg -A20 "def validate" --type py
```

## Search Strategies by Use Case

### Security Audit

```bash
# All security markers
rg ":ga:sec" --stats

# Security with context
rg -C5 ":ga:sec"

# Unaddressed security TODOs
rg -B2 -A2 ":ga:sec" | rg ":ga:todo"

# Security in specific services
rg ":ga:auth.*sec|:ga:sec.*auth"
```

### Technical Debt Assessment

```bash
# All debt markers
rg ":ga:debt"

# Temporary code inventory
rg ":ga:tmp" --stats

# Performance issues
rg ":ga:perf" -C3

# Combined debt indicators
rg ":ga:(debt|tmp|perf|bug)"
```

### Task Prioritization

```bash
# High-priority items
rg ":ga:.*p0|:ga:priority.*high"

# Deadline-driven work
rg ":ga:.*deadline" -C2

# Blocked or dependent tasks
rg ":ga:.*block|:ga:.*depend"
```

### Documentation Gaps

```bash
# Missing documentation
rg ":ga:docs"

# API documentation needs
rg ":ga:api" | rg -v "documented"

# Example requests
rg ":ga:example"
```

## Monorepo Navigation

### Service-Specific Searches

```bash
# All auth service anchors
rg ":ga:auth"

# Payment security concerns
rg ":ga:payment.*sec|:ga:sec.*payment"

# Shared component changes
rg ":ga:shared"
```

### Cross-Service Dependencies

```bash
# Find service interactions
rg ":ga:.*api" | rg -E "(auth|payment|user)"

# Breaking changes
rg ":ga:.*breaking"

# Compatibility concerns
rg ":ga:.*compat|:ga:ctx.*version"
```

## Integration with Development Tools

### IDE Integration

Configure your IDE to highlight grep-anchors:
- Set up custom search patterns for `:ga:` markers
- Create quick actions to jump to next/previous anchor
- Add syntax highlighting for anchor patterns

### Command-Line Aliases

Create useful aliases for common searches:

```bash
alias ga='rg ":ga:"'
alias ga-todo='rg ":ga:todo" -C2'
alias ga-sec='rg ":ga:sec" -C3'
alias ga-agent='rg ":ga:@agent" -B5 -A10'
alias ga-ctx='rg ":ga:ctx"'
```

### Git Integration

Find anchors in staged changes:

```bash
# Check staged files for TODOs
git diff --cached | grep ":ga:todo"

# Find security markers in branch
git diff main...feature | grep ":ga:sec"
```

## Best Practices for Effective Search

### Start Broad, Refine Narrow

1. Begin with `rg ":ga:"` to understand scope
2. Filter by specific tags
3. Add context with `-C`, `-B`, `-A` flags
4. Combine with other grep patterns

### Use Context Liberally

Always search with context - naked anchors without surrounding code provide limited value:

```bash
# GOOD: Provides understanding
rg -C3 ":ga:sec"

# POOR: Just locations
rg -l ":ga:sec"
```

### Combine Multiple Passes

Build comprehensive understanding through multiple searches:

```bash
# First pass: Find feature
rg ":ga:.*payment"

# Second pass: Security concerns
rg ":ga:sec" payment/

# Third pass: Full context
rg -C10 ":ga:" payment/critical_path.py
```

### Document Search Patterns

When working on specific features, document useful search combinations:

```bash
# Payment refactoring searches
rg ":ga:payment" | rg -E "(debt|refactor|todo)"
rg -C5 ":ga:ctx" payment/ | rg -i "assumption"
```

## Remember

Grep-anchors are your navigation system through the codebase. Effective searching:
- Provides instant access to relevant code sections
- Reveals hidden dependencies and assumptions
- Enables systematic task discovery
- Supports both human and AI navigation

The power of `:ga:` patterns lies not just in marking code, but in the rich search capabilities they enable. Master these search patterns to navigate any Grepa-enabled codebase with confidence.