<!-- :M: tldr Comprehensive documentation update session implementing Magic Anchors v0.1.1 specification -->

# Documentation Update Session - 2025-05-28

## Session Overview

This session implemented the comprehensive documentation updates for Magic Anchors v0.1.1, migrating all documentation from the `:ga:` syntax to the canonical `:M:` syntax and implementing key architectural decisions from `grepa-updates.md`.

## Key Architectural Decisions Implemented

1. **Canonical Anchor**: `:M:` is now THE single canonical prefix (no custom anchors)
2. **Mandatory Space**: Single ASCII space required after `:M:`
3. **Delimiter Semantics**:
   - Colon (`:`) for classifications
   - Parentheses `()` for parameters
   - Brackets `[]` for arrays
4. **No JSON/YAML**: Removed JSON/YAML syntax within anchors
5. **No Regex**: Removed regex/pattern matching as core feature
6. **Marker Organization**: 6 semantic groups for markers
7. **Parameter Groups**: 6 semantic families for universal parameters

## Files Updated

### 1. README.md
- Migrated all `:ga:` references to `:M:` with mandatory space
- Updated terminology: Magic Anchors (notation) vs Grepa (tooling)
- **Removed custom anchors section** - replaced with "Why `:M:`?" explaining single canonical prefix
- Updated all code examples to new syntax
- Revised project management patterns to use parameters
- Removed link to custom anchors guide

### 2. docs/magic-anchors/SPEC.md
- Complete rewrite with delimiter semantics framework
- Added formal grammar with mandatory space requirement:
  ```ebnf
  anchor ::= comment-leader identifier space marker-list prose?
  identifier  ::= ":M:" | ":" identifier ":"
  space  ::= " "  # exactly one ASCII space
  ```
- Added 6 marker groups table (todo, info, notice, trigger, domain, status)
- Added 6 parameter groups table (mention, relation, workflow, priority, lifecycle, scope)
- Removed JSON/YAML examples
- Added universal parameter groups section
- Updated all relational examples

### 3. docs/magic-anchors/README.md
- Updated title to "Magic Anchors Notation"
- Clarified Magic Anchors vs Grepa distinction
- Updated core format to show mandatory space
- Revised all examples to `:M:` syntax

### 4. docs/magic-anchors/format.md
- Renamed to "Magic Anchors Format Specification"
- Added comprehensive delimiter semantics section
- Added marker organization table
- Updated whitespace rules (mandatory space)
- Added "Key Decisions" section documenting architectural choices

### 5. docs/magic-anchors/payloads.md
- Restructured entirely around delimiter semantics
- Removed JSON object section (per architectural decision)
- Added sections for each delimiter type
- Added universal parameter groups table
- Updated all examples to new syntax

### 6. docs/magic-anchors/examples.md
- Updated all examples from `:ga:` to `:M:`
- Replaced JSON examples with parameter syntax
- Updated mention patterns to use colon delimiter
- Revised complex examples to show multi-line approach

### 7. docs/magic-anchors/CHANGELOG.md
- Consolidated all changes into v0.1.1 release
- Documented comprehensive update including:
  - Delimiter semantics framework
  - Removal of JSON/YAML and regex
  - Single canonical prefix decision
  - Mandatory space requirement

### 8. CLAUDE.md
- Complete migration from `:ga:` to `:M:` syntax
- Updated marker examples and philosophy
- Added delimiter rules section
- Updated search examples

### 9. llms.txt
- Updated all examples to `:M:` syntax
- Revised to reflect new delimiter semantics
- Updated grammar section

## Key Changes Summary

### Before
- `:ga:` prefix with optional space
- Support for custom anchors (`:proj:`, `:team:`)
- JSON/YAML payloads allowed
- Regex patterns as examples
- Dot notation for hierarchical markers
- Flexible delimiter usage

### After
- `:M:` canonical prefix with mandatory single space
- No custom anchors - single standard only
- No JSON/YAML within anchors
- No regex patterns
- Dots only for literals (versions, URLs, paths)
- Clear delimiter semantics:
  - `:` for classifications
  - `()` for parameters
  - `[]` for arrays

## Commits Created

1. **First commit**: "docs: update documentation to Magic Anchors terminology and :M: syntax"
   - Initial migration of documentation structure
   - Created version tracking files

2. **Second commit**: "chore: complete documentation restructuring and add version tracking"
   - Added CHANGELOG files
   - Completed restructuring

3. **Third commit**: "docs: comprehensive update to Magic Anchors notation and delimiter semantics"
   - All documentation updates
   - Implemented key decisions from grepa-updates.md

## Impact

This session established Magic Anchors v0.1.1 as a standardized notation system with:
- Clear, unambiguous syntax rules
- Single canonical prefix for universal adoption
- Delimiter semantics that avoid ambiguity
- Focus on grep-ability and LLM navigation
- No complex features that could hinder adoption

The documentation now clearly separates the notation (Magic Anchors) from the tooling (Grepa), setting the stage for independent evolution of both components.

## Next Steps

1. Update remaining documentation in `docs/conventions/` and `docs/guides/`
2. Create migration guide for projects using custom anchors
3. Update any tooling references to support new syntax
4. Consider creating a validation tool for v0.1.1 compliance