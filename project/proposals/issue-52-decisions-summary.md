<!-- tldr ::: Summary of Issue #52 decisions made and remaining items -->

# Issue #52 Decisions Summary

## Resolved Decisions

1. **Universal Colon Pattern** ✅
   - Relational tags use `key:value` format (no `#` prefix on key)
   - Values keep their natural prefixes (`#`, `@`, etc.)
   - This replaces the old `#key:value` syntax

2. **Attribute Tag Syntax** ✅
   - Attribute tags use `category:#attribute` pattern
   - Example: `perf:#hotpath`, `sec:#boundary`
   - Standalone shortcuts allowed: `#hotpath`, `#boundary`
   - Both forms are searchable with patterns like `(perf:#|#)hotpath`

3. **Priority System** ✅
   - Use signals (`!`, `!!`) for priority
   - No `priority:high` syntax
   - `#p3` allowed only for explicit low priority (rare)

4. **Package References** ✅
   - Unscoped packages: `#lodash`, `#react`, `#express`
   - Scoped packages: `@scope/package` or `pkg:@scope/package`
   - Both forms are valid synonyms for scoped packages

5. **Typed Canonical Anchors** ✅
   - Added comprehensive system for typed anchors
   - Pattern: `##type:target` for declarations
   - References use `type:target` (no `##`)
   - Three-tier interaction model defined

## Remaining Open Decisions

### 1. Array Parsing Rules
- Need to define parsing rules for values containing:
  - Commas within values
  - Quotes in values
  - Empty arrays
  - Whitespace handling

### 2. Typed Anchor Implementation Details
- Uniqueness scope confirmation (repo-wide)
- Case sensitivity rules
- Conflict resolution during merges
- Handling of file moves/renames
- Policy on multiple types for same target

### 3. Escaping Rules
- Rules for waymarks containing `→` and arrow notation in HTML comments
- General escaping mechanism for special characters

### 4. Documentation References
- Fix or remove references to non-existent files:
  - jsdoc-integration.md
  - Various documentation files in See Also section

### 5. JSON Configuration Format
- Either fully specify the format and location
- Or remove references to JSON configuration

### 6. Custom Definition Modes
- Define what "liberal", "standard", "strict" modes include
- Specify behaviors for each mode

### 7. Progressive Enhancement Levels
- Define specific levels more clearly
- Specify which array patterns are required vs optional for tools

### 8. Tool Requirements
- Document grep tool requirements
- Many patterns assume ripgrep-specific features

## Next Steps

1. Create detailed specification for remaining items
2. Update documentation to reflect all resolved decisions
3. Remove completed todos from documents
4. Create implementation guide for tooling developers