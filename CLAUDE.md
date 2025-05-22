# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Grepa is a specification for **grep-anchors** - a standardized way to mark important code locations using the `:ga:` sigil in comments. This allows both humans and AI agents to quickly find relevant code sections using simple grep commands.

## Core Concept

The grep-anchor pattern: `<comment-leader> :ga:payload`
- **`:ga:`** - the fixed four-character marker
- **payload** - one or more tokens that classify the line

## Common Anchor Types

- `:ga:sec` - Security-critical code requiring review
- `:ga:temp` - Temporary hacks to be removed
- `:ga:@cursor` - Delegation points for AI agents
- `:ga:fix` - Conventional commit tie-ins
- `:ga:placeholder` - Future work markers
- `:ga:perf` - Performance-related sections

## Search Commands

```bash
# Find all anchors
rg -n ":ga:"

# Find specific anchor types
rg -n ":ga:sec"           # security anchors
rg -n ":ga:temp"          # temporary code
rg -n ":ga:.*perf"        # performance-related
```

## Implementation Notes

When implementing grep-anchor tooling:

1. **Parser Requirements**
   - Support bare tokens: `sec`, `v0.2`, `@cursor`
   - Support JSON metadata: `:ga:{"since":"v1.1","owner":"@security"}`
   - Support multiple tokens: `:ga:perf,sec`

2. **CI Integration Ideas**
   - Block merges if `:ga:temp` exists
   - Warn on outdated version anchors
   - Validate anchor syntax

3. **Editor Integration**
   - Highlight `:ga:` lines distinctly
   - Provide jump-to-anchor navigation
   - Autocomplete known tokens