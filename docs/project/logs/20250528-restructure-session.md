# Documentation & Repo Restructure Session – May 28 2025

<!-- :M: tldr moved notation → cairns, toolset → cairn, created changelogs, roadmap, archives -->

## Session Overview

**Date**: 28 May 2025  
**Focus**: Bring documentation hierarchy in line with the post-`cairn-updates` architecture; lay groundwork for versioned spec & tooling docs.  
**Outcome**: v0.1.1 docs milestone shipped.

## Major Accomplishments

### 1  Docs directory restructure ✅ DONE

| Old path | New path |
|----------|----------|
| `docs/notation/` | `docs/magic-anchors/` |
| `docs/toolset/`  | `docs/grepa/`        |

All files were moved with `git mv` to preserve history.  In-repo links updated (README, migration plan, cairn-updates).  Historical log and feedback files intentionally untouched.

### 2  Version tracking files ✅ ADDED

• `docs/magic-anchors/CHANGELOG.md` – spec changelog (initialised at **v0.1.1**).  
• `docs/grepa/CHANGELOG.md` – tooling changelog (also v0.1.1).  
• `docs/grepa/ROADMAP.md` – milestone plan through 0.3.0.

### 3  Advanced & Archive folders ✅ CREATED

• `docs/magic-anchors/advanced/` – deep-dive topics; moved `advanced-patterns.md`.  
• `docs/project/archive/` – parked older drafts (`cairn-updates-old*.md`).

### 4  Spec & guidance tidy-up ✅

• `cairn-updates.md` – synced with v2 decisions, removed legacy `rel()` section, added canonical marker / parameter tables, updated examples to real-world snippets.  
• “Completed work since v0 draft” block lists restructure & new files.  
• `docs/project/plans/docs-migration.md` – progress snapshot checklist added; shows what’s left.

### 5  AI-assistant file updates ✅

• `CLAUDE.md` tree diagram now reflects new layout: advanced folder, Grepa CHANGELOG/ROADMAP.  
• Removed obsolete paths.

## Remaining TODOs (tracked in docs-migration checklist)

- Global sweep for dot-notation & delimiter hygiene in all guides / conventions.  
- Move parameter & marker tables into their final convention docs.  
- Add spacing/quoting table to `magic-anchors/payloads.md`.  
- Integrate anchor-density & hashtag guidance into user guides.  
- Update screenshots / casts that still show `:ga:`.

## Version Bump

Both spec and tooling docs tagged **v0.1.1** to mark the restructure milestone.

---

### Files Added / Modified (highlights)

```
docs/magic-anchors/CHANGELOG.md
docs/grepa/CHANGELOG.md
docs/grepa/ROADMAP.md
docs/magic-anchors/advanced/advanced-patterns.md (moved)
docs/project/archive/cairn-updates-old*.md (moved)
docs/project/logs/20250528-restructure-session.md (this file)
```
