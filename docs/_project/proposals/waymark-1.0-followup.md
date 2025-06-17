<!-- tldr ::: deferred items and future explorations for waymark 1.0 implementation #proposal #draft -->

# Waymark 1.0 Follow-up Items

This document captures implementation details and future explorations that were deferred from the main [waymark 1.0 simplification proposal](./waymark-1.0-simplification.md) to keep it focused and actionable.

## Implementation Details

### 1. Tag Dictionaries and Pattern Files

From the unified hash syntax proposal, a modular system for team-specific tags:

```yaml
# .waymark/config.yml
tagMap:
  aliases:
    # Team-specific shortcuts
    urgent: "priority:critical"  # NO - we don't use this anymore
    ship-blocker: "!!todo"       # YES - use signals
    nice-to-have: "#p3"          # YES - explicit low priority
    
    # Domain shortcuts
    payments: "#backend #payments"
    checkout: "#frontend #checkout"
```

**Status**: Consider post-1.0 if teams need extensive customization.

### 2. Parser Implementation

#### Auto-expansion Rules
```typescript
// Conceptual - NOT for 1.0
interface TagPattern {
  version: string;
  aliases: Record<string, string>;
  validation: ValidationRule[];
}
```

**Status**: Keep parser simple for 1.0. No complex expansions.

#### Validation Rules
```yaml
rules:
  reference_hash_required:
    level: "error"
    pattern: ":(\d+|[A-Z]+-\d+)\b"
    message: "Reference values must use # prefix"
```

**Status**: Implement only critical validations for 1.0.

### 3. Migration Scripts

Automated conversion tools from unified-hash-implementation-plan.md:

```bash
#!/bin/bash
# Convert properties to tags
sed -i 's/priority:high/!todo/g' 
sed -i 's/fixes:\([0-9]\+\)/#fixes:#\1/g'
sed -i 's/+\([a-z]\+\)/#\1/g'
```

**Status**: Create simple migration script for 1.0 launch.

## Future Explorations

### 1. Marker Definitions System

The comprehensive marker definition system proposal would provide:

- TypeScript-based marker definitions
- Single source of truth for all markers
- Automated documentation generation
- Type safety and validation

**Example structure**:
```typescript
export default defineMarker({
  marker: 'todo',
  category: 'work',
  signals: workSignals,
  commonTags: ['#bug', '#feature', '#enhancement'],
  aiContext: {
    purpose: 'Track work items',
    whenToUse: ['For any actionable task']
  }
});
```

**Status**: Valuable but complex. Consider for v2.0.

### 2. Advanced Search Patterns

Regex patterns for complex queries:

```bash
# Find todos depending on multiple issues
rg "todo.*#depends:(#\d+,?)+.*#depends:(#\d+,?)+"

# Find critical items in specific systems
rg "!!.*#affects:#billing"

# Find waymarks with specific actor patterns
rg "::: @(alice|bob|security).*#critical"
```

**Status**: Document common patterns post-1.0.

### 3. Enhanced Anchor System

Additional anchor features to explore:

- Anchor inheritance/composition
- Cross-repository anchor references
- Anchor versioning
- IDE integration for anchor navigation

**Status**: See adoption of basic anchors first.

### 4. Tag Composition Rules

Rules for combining tags effectively:

```yaml
tag_combinations:
  incompatible:
    - ['#draft', '#shipped']
    - ['#deprecated', '#enhancement']
  recommended:
    - ['#security', '#critical']
    - ['#api', '#breaking']
```

**Status**: Let patterns emerge organically.

### 5. Tooling Enhancements

- VS Code extension with waymark intelligence
- GitHub Actions for waymark validation
- Pre-commit hooks for waymark formatting
- Dashboard for waymark analytics

**Status**: Start with CLI, expand based on usage.

## Open Questions

1. **Version tags**: Should we standardize `#v2.0` vs `#version:2.0`?
   - Current: Allow both, see what teams prefer
   
2. **Multi-line waymarks**: How to handle waymarks spanning multiple lines?
   - Current: Single line only for 1.0
   
3. **Waymark chaining**: Should related waymarks reference each other?
   - Current: Use anchors for stable references
   
4. **Performance impact**: How do waymarks affect build/search performance?
   - Current: Measure after 1.0 adoption

## Success Metrics for 1.0

Before adding complexity, we should see:

1. **Adoption**: 80%+ of codebase using new syntax
2. **Consistency**: <5% validation errors after migration
3. **Search usage**: Teams actively using grep patterns
4. **Anchor usage**: At least 10 anchors per major module
5. **Tool satisfaction**: Positive feedback on simplicity

## Conclusion

The waymark 1.0 simplification focuses on getting the core syntax right. These follow-up items represent natural evolution paths based on real usage patterns. By deferring this complexity, we can ship a clean, understandable system that teams will actually adopt.