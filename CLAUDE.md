<!-- ::: tldr Claude Code configuration and development guidelines -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

About you: @.ai/prompts/MAX.md

## Project Overview

The Waymark CLI provides tooling for **waymarks** - a standardized way to mark important code locations using the `:::` sigil in comments. This allows both humans and AI agents to quickly find relevant code sections using simple grep commands.

## Important Warning about rg Patterns

- When writing `rg` patterns that involve waymarks should *always* include the `:::` sigil otherwise risking false-positives. If searching on aspects that would follow the `:::` don't assume those things immediately follow `::: ` as they could appear anywhere after. With the exception of assignment e.g. `todo ::: @actor ...`

## Quick Reference for Claude

### Most Common Patterns I'll Use
```javascript
// todo ::: implement feature              // Work to do
// fix ::: bug description                 // Bugs to fix
// ::: important context here              // Pure notes (no marker)
// alert ::: security issue +security      // Alerts with tags (+ not #)
// todo ::: @agent write tests             // AI delegation
// temp ::: remove after deploy            // Temporary code
// !todo ::: critical bug fix              // Signal for urgency
// deprecated ::: use newMethod() instead  // Lifecycle marker
```

[Rest of the file remains unchanged...]