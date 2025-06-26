---
status: draft
date: 2025-01-25  
author: @galligan
supersedes: "../obsolete/proposed-waymark-v1-syntax.md"
---
<!-- tldr ::: adrs/001-waymark-syntax-v1 Defines the v1 syntax for Waymarks -->

# ADR-001: Establish Waymark Syntax v1

## Context

The Waymark syntax has undergone several design iterations aimed at maximizing clarity, searchability, and ease of use. Through extensive exploration and discussion, we've identified key design principles:

- **Visual Clarity**: Clear distinction between different syntactic elements
- **Grep-Friendly**: Optimized for search with tools like ripgrep
- **Flexible Namespace**: Tags as a flexible categorization system
- **Semantic Boundaries**: Clear separation between relationships and attributes

This ADR establishes the v1 syntax that balances simplicity with expressiveness.

## Decision

We adopt Waymark v1 syntax with clear distinctions between tags, context markers, and attributes.

### Core Syntax Elements

#### 1. The Waymark Sign

- `:::` - The waymark sign marks waymark content in comments

#### 2. Tags (Flexible Namespace)

Tags use the `#` prefix and provide flexible categorization:

- **Simple Tags**: `#backend`, `#security`, `#hotfix`
- **Attribute Tags**: `#category/attribute` using `/` for hierarchy
  - Examples: `#perf/hotpath`, `#sec/boundary`, `#api/internal`
  - Can be deeply nested: `#perf/cpu/hotpath`

**Key principle**: The `#` namespace is flexible - users choose their specificity level.

#### 3. Context Markers (Relationships)

Context markers establish relationships using `key:value` syntax (NO `#` on the key):

**Categories**:
- **Workflow**: `fixes:#123`, `blocks:#456`, `depends:#789`
- **Relational**: `affects:billing`, `related:#auth/login`
- **Reference**: `pr:#234`, `commit:abc123`, `docs:/path/to/file.md`
- **Responsibility**: `owner:@alice`, `cc:@bob,@charlie`

**Values can be**:
- Plain text: `affects:billing`
- Tag references: `affects:#billing` 
- Actor references: `owner:@alice`
- Issue references: `fixes:#123`
- Mixed: `affects:#api,billing,@team-frontend`

#### 4. Actors

- `@alice` - Individual actors
- `@team-yolo` - Team references
- `@agent` - AI agent delegation

#### 5. Landmarks (Stable Reference Points)

Landmarks provide stable anchors in code:

- **Define**: `##name` as first token after `:::`
- **Reference**: `#name` in tag position

```javascript
// Define a landmark
// about ::: ##auth/login Main authentication entry point

// Reference it elsewhere  
// fixme ::: race condition here refs:#auth/login
```

#### 6. Signals (Priority/Intensity)

Position signals (must be first):
- `*` - Branch work (must complete before merge)

Intensity signals:
- `!` - High priority
- `!!` - Critical/urgent
- `?` - Needs clarification
- `??` - Highly uncertain
- `-` - Mark for removal
- `--` - Remove ASAP

### Syntax Patterns

```javascript
// Basic waymark with tags
// todo ::: implement authentication #backend #security

// Context markers (no # on key)
// todo ::: critical bug fixes:#123 blocks:#456 owner:@alice

// Multiple values in arrays (no spaces)
// notice ::: deployment affects:api,billing,frontend cc:@alice,@bob

// Attribute tags with hierarchy
// todo ::: optimize parser #perf/hotpath #sec/boundary

// Landmarks for stable references
// about ::: ##auth/oauth OAuth implementation #security

// Complete example mixing patterns
// !todo ::: implement webhooks fixes:#123 #api #perf/critical owner:@alice
```

### Key Principles

1. **Visual Distinction**: `#` for tags, bare keys for context markers, `/` for attributes
2. **Flexible Namespace**: Users choose tag specificity (`#hotpath` vs `#perf/hotpath`)
3. **Clear Relationships**: Context markers show clear key:value relationships
4. **Grep Optimized**: The `:::.*` pattern ensures waymark-only searches
5. **No Spaces in Arrays**: `cc:@alice,@bob` not `cc:@alice, @bob`

### Terminology

- **Waymarks**: The overall system
- **Waymark**: A complete annotated line
- **Marker**: The word before `:::` (e.g., `todo`, `fixme`)
- **Sign**: The `:::` separator
- **Tag**: Any `#` prefixed identifier
  - **Simple Tag**: `#word` 
  - **Attribute Tag**: `#category/attribute`
- **Context Marker**: Key-value pattern `key:value` (no `#` on key)
- **Actor**: `@` prefixed identifier
- **Landmark**: `##` prefixed stable reference point
- **Signal**: Optional prefix (`*`, `!`, `?`, `-`)

## Consequences

### Positive

- **Clear Visual Language**: Instant recognition of tags vs context markers
- **Flexible Evolution**: Start simple (`#backend`), add specificity later (`#backend/api/v2`)
- **Perfect Searchability**: `rg ':::.*owner:@alice'` finds assignments
- **Natural Reading**: Left-to-right flow feels intuitive
- **AI-Friendly**: Clear patterns for agent navigation

### Negative

- **Migration Complexity**: Moving from old syntax requires careful identification
- **Learning Curve**: Multiple concepts to understand

### Neutral

- **Character Count**: Similar to previous proposals
- **Visual Density**: Balanced between clarity and conciseness

## Implementation Notes

### Search Patterns

Per ADR-002, all waymark searches should use the `:::.*` prefix:

```bash
# Find all waymarks
rg ':::'

# Find specific tags
rg ':::.*#security'                # Generic: rg ':::.*#tag'

# Find context markers  
rg ':::.*owner:@alice'             # Generic: rg ':::.*key:value'

# Find attribute tags
rg ':::.*#perf/hotpath'            # Generic: rg ':::.*#category/attribute'
```

### Documentation Guidelines

Per ADR-003, documentation should:

1. Use concrete examples with generic patterns as comments
2. Maintain contextual variety across documents
3. Include character without cringe (`@team-yolo` yes, `@10x-ninja` no)
4. Show progressive disclosure from simple to complex

### Migration Path

From old syntax:
- `:tag` → `#tag` (tags use `#`)
- `#key:value` → `key:value` (context markers lose `#` prefix)
- `#category:attribute` → `#category/attribute` (attributes use `/`)
- `##anchor` → `##landmark` (terminology change)

**Critical**: Cannot blindly replace - must identify whether each pattern is a tag or context marker.

## Examples

### Before (Previous Proposals)

```javascript
// Colon-based markers
// todo ::: implement feature :backend :security

// Context markers with # prefix  
// todo ::: critical bug #depends:#123 #owner:@alice

// Attributes with colons
// todo ::: optimize code #perf:hotpath #sec:boundary
```

### After (This ADR)

```javascript
// Tags with # prefix
// todo ::: implement feature #backend #security

// Context markers without # prefix
// todo ::: critical bug depends:#123 owner:@alice  

// Attributes with / delimiter
// todo ::: optimize code #perf/hotpath #sec/boundary

// Real-world example with character
// !todo ::: @team-yolo ship dark mode before demo #frontend fixes:#2442
```

## Future Considerations

This ADR establishes core syntax. Future ADRs may address:

- Standard vocabulary for markers and context keys
- Landmark naming conventions
- Tool integration patterns
- Advanced search techniques

## References

- [ADR-002: Waymark Search Patterns](./002-waymark-search-patterns.md)
- [ADR-003: Waymark Documentation Principles](./003-waymark-documentation-principles.md)
- [Waymark Simplification Proposal](../../proposals/waymark-1.0-simplification.md)
- [Waymark Streamlined Grammar](../../proposals/waymark-streamlined-grammar-complete.md)