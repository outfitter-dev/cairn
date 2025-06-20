---
status: Accepted
date: 2025-06-17
author: matt.galligan@gmail.com
---

# ADR-001: Adopt Waymark V1 Simplified Syntax

## Context

The Waymark syntax has undergone several design iterations aimed at maximizing clarity, searchability, and ease of use. This exploration of different syntax models revealed key challenges with early designs, which this final V1 specification resolves.

The core challenges discovered during this iterative process were:

- **Inconsistent Tagging:** Early models allowed multiple prefixes (`+tag`, `#tag`), creating ambiguity.
- **Ambiguous Priority:** Allowing both signals (`!`) and properties (`#priority:high`) for priority made intent unclear.
- **Complex Hierarchies:** Path-based tags (`#auth/oauth`) proved difficult to maintain and search consistently.
- **Inconsistent References:** Lacking a strict format for references (`fixes:123` vs. `#fixes:#123`) harmed discoverability.
- **Marker Sprawl:** A large, uncurated list of markers created cognitive overhead.

This ADR formalizes the decision to adopt the final, simplified V1 syntax, which directly addresses the lessons learned during the design process, resulting in a system that is robust, intuitive, and highly practical.

## Decision

We will adopt the **Waymark V1 Simplified Syntax** as the single, authoritative standard for the initial release and all subsequent development. The canonical definition for this syntax will be documented in [docs/syntax/SPEC.md](../../syntax/SPEC.md).

The core principles of the V1 syntax are:

1. **Unified `#` Prefix:** All tags—whether simple, relational, or attribute-based—exclusively use the `#` prefix.
2. **Signals for Priority:** Urgency and importance are conveyed *only* through signals (`!todo`, `!!fixme`).
3. **No Hierarchical Tags:** Path-based tags are replaced by multiple, flat tags (`#a #b`).
4. **Greppable References:** Relational tags *must* include a `#` on the reference value (e.g., `#fixes:#123`).
5. **Curated Marker Set:** The list of official markers is pruned to a small, intuitive core set.
6. **Anchors for Stability:** A new `##anchor` syntax creates stable, searchable reference points.
7. **Attribute Tags:** A formal system for `#category:value` tags describes code characteristics.

## Consequences

### Positive

- **High Learnability:** The simplified rules and smaller marker set make the syntax exceptionally easy for new users to learn and apply correctly from day one.
- **Improved Clarity and Readability:** The syntax is significantly easier to read and parse. A single glance is enough to understand the components of a waymark.
- **Enhanced Searchability:** The consistent use of the `#` prefix makes every piece of metadata reliably searchable with simple tools like `rg`.
- **Simplified Tooling:** The unambiguous and consistent grammar makes it much easier to build robust parsers, linters, and other tooling.
- **Single Source of Truth:** Consolidating the specification into a single guide eliminates documentation drift and ensures consistency.

### Internal Alignment

- **Finalized Design:** This decision renders all previous internal syntax variations obsolete, providing a clear standard for all future work.
- **Internal Codebase Alignment:** A one-time effort is required to align all waymarks *within this repository* to the final V1 standard. The `scripts/audit-waymarks.js` tool has been created to automate this internal cleanup.
