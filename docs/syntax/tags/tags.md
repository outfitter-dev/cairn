<!-- tldr ::: comprehensive guide to waymark v1.0 tag system -->

# Waymark Tags

Tags provide semantic metadata for waymarks, enabling powerful search and categorization across codebases. The v1.0 tag system balances simplicity with expressiveness.

## Core Concepts

Tags appear in the prose section after the `:::` sigil and are prefixed with `#`:

```javascript
// todo ::: implement caching #backend #performance
// fixme ::: race condition in auth #security #critical
// note ::: uses Redis for sessions #cache #auth
```

## Tag Types

### 1. Simple Tags

Basic categorical labels that describe the waymark's context:

```javascript
// todo ::: add validation #backend
// fixme ::: memory leak #performance
// note ::: security boundary #security #auth
```

Common simple tags:
- **Domain**: `#backend`, `#frontend`, `#api`, `#database`, `#auth`
- **Quality**: `#security`, `#performance`, `#accessibility`, `#ux`
- **Tech**: `#react`, `#nodejs`, `#postgres`, `#redis`, `#docker`
- **Scope**: `#critical`, `#hotpath`, `#experimental`, `#legacy`

### 2. Relational Tags

Express relationships using the `#key:value` pattern:

```javascript
// todo ::: fix login bug #fixes:#123
// review ::: security check #owner:@alice #cc:@bob,@charlie
// fixme ::: update after API change #depends:#api/v2 #affects:#mobile,#web
```

See [relational-tags.md](./relational-tags.md) for comprehensive patterns.

### 3. Attribute Tags

Describe code characteristics in two forms:
- **Standalone**: `#hotpath` (quick marking)
- **Category form**: `#perf:hotpath` (precise classification)

```javascript
// todo ::: optimize parser #hotpath              // Standalone
// todo ::: optimize parser #perf:hotpath         // Category form
// important ::: validate all inputs #sec:boundary #auth
```

Both forms are searchable: `rg "#(perf:)?hotpath"`

See [attribute-tags.md](./attribute-tags.md) for categories.

## Tag Syntax Rules

### Basic Rules

1. **Hash prefix**: All tags start with `#`
2. **No spaces**: Use hyphens or underscores: `#api-v2`, `#auth_service`
3. **Case sensitive**: Convention is lowercase: `#backend` not `#Backend`
4. **Position**: Tags appear anywhere in prose after `:::`

### Arrays in Tags

Use comma-separated values with NO spaces:

```javascript
// ✓ Correct
// todo ::: notify stakeholders #cc:@alice,@bob,@charlie
// fixme ::: affects multiple services #affects:#auth,#billing,#api

// ✗ Wrong (has spaces)
// todo ::: notify stakeholders #cc:@alice, @bob, @charlie
```

### Reference Values

Always include `#` in reference values:

```javascript
// ✓ Correct
// todo ::: implement feature #fixes:#123
// note ::: see anchor #refs:#auth/login

// ✗ Wrong (missing # in value)
// todo ::: implement feature #fixes:123
```

## Search Patterns

### Basic Tag Searches

```bash
# Find by simple tag
rg "#backend"
rg "#security"
rg "#critical"

# Find by relational tag
rg "#owner:@alice"
rg "#fixes:#"         # All fixes
rg "#affects:#api"    # Affects API

# Multiple tags (AND)
rg ":::.*#backend.*#security"
rg ":::.*#critical.*#auth"
```

### Issue References

Always include the `#` when searching for issues:

```bash
# Find specific issue
rg "#123\b"           # Word boundary prevents #1234 match

# Find all issue references
rg "#\d+\b"           # Any issue number
rg "#[A-Z]+-\d+"      # JIRA-style: #ABC-123

# Find by relationship
rg "#fixes:#\d+"      # All fixes
rg "#blocks:#\d+"     # All blockers
rg "#depends:#\d+"    # All dependencies
```

### Attribute Searches

Search both standalone and category forms:

```bash
# Find hotpaths (both forms)
rg "#(perf:)?hotpath"

# Find security boundaries
rg "#(sec:)?boundary"

# Find by category
rg "#perf:"           # All performance attributes
rg "#sec:"            # All security attributes
```

### Advanced Patterns

```bash
# Count tags
rg -o "#\w+" | sort | uniq -c | sort -nr

# Find todos by owner
rg "todo :::.*#owner:@\w+" -o | rg -o "@\w+" | sort | uniq -c

# Context search
rg -C3 "#critical"    # Show 3 lines context
rg -B5 -A5 "#security.*#boundary"  # Security boundaries with context

# Multi-file analysis
rg -l "#deprecated"   # List files with deprecated code
rg -c "#todo"         # Count todos per file
```

## Best Practices

### 1. Tag Selection

Choose tags that aid discovery:

```javascript
// ✓ Good: Specific and searchable
// todo ::: implement rate limiting #api #security #rate-limit

// ✗ Poor: Too generic
// todo ::: implement feature #stuff #thing
```

### 2. Consistency

Use established tags when possible:

```javascript
// Check existing tags first
rg -o "#\w+" | sort | uniq

// Reuse domain tags
// todo ::: add user validation #auth #api
// fixme ::: session timeout bug #auth #session
```

### 3. Relational Clarity

Be explicit with relationships:

```javascript
// ✓ Clear relationships
// todo ::: implement OAuth #implements:#RFC6749 #for:#auth/login
// fixme ::: race condition #affects:#payment,#checkout #fixes:#456

// ✗ Ambiguous
// todo ::: implement thing #123  // Is this an issue? A reference?
```

### 4. Attribute Precision

Use category form when precision matters:

```javascript
// Performance-critical code
// todo ::: optimize JSON parser #perf:hotpath #perf:cpu-bound

// Security boundaries
// important ::: validate all inputs #sec:boundary #sec:input
```

## Common Patterns

### Work Tracking

```javascript
// Issue-driven development
// todo ::: implement user stories #issue:#234 #sprint:current
// fixme ::: regression from v2.1 #fixes:#567 #priority:high

// Ownership and collaboration
// review ::: API changes #owner:@backend-team #cc:@frontend,@mobile
// todo ::: security audit needed #owner:@security #deadline:2024-01-15
```

### Code Organization

```javascript
// Architectural boundaries
// about ::: ##auth/core Authentication core #module:auth #type:library
// important ::: API gateway #boundary #affects:#all-services

// Technical debt
// refactor ::: legacy parser #tech-debt #priority:medium #effort:large
// deprecated ::: old API endpoint #remove:v3.0 #migration:#new-api
```

### Cross-References

```javascript
// Documentation links
// note ::: see implementation guide #docs:/docs/auth.md
// todo ::: update after reading #link:https://example.com/rfc

// Code references
// fixme ::: similar to bug #refs:#payment/validation
// todo ::: use shared logic #see:#utils/validators
```

## Tag Namespaces

While not enforced by syntax, teams often use informal namespaces:

```javascript
// Service tags (monorepo)
// todo ::: update auth flow #service:web #team:frontend
// fixme ::: cache invalidation #service:api #affects:#service:worker

// Environment tags
// notice ::: prod-only config #env:prod #requires:#env:prod-db
// todo ::: test in staging #env:staging #before:#env:prod

// Feature flags
// wip ::: dark mode #feature:dark-mode #flag:DARK_MODE_ENABLED
```

## Migration from Old Syntax

Key changes in v1.0:

```javascript
// Old syntax → New syntax
// todo ::: task +backend      → todo ::: task #backend
// fix ::: bug priority:high   → fixme ::: bug #priority:high (or use !fixme)
// todo ::: fixes:123          → todo ::: #fixes:#123
// note ::: +tag1 +tag2        → note ::: #tag1 #tag2
```

## Summary

The v1.0 tag system provides:
- **Simple tags** for basic categorization
- **Relational tags** for expressing connections
- **Attribute tags** for code characteristics
- **Consistent syntax** with `#` prefix
- **Powerful search** via ripgrep patterns

Tags make waymarks discoverable and enable rich navigation patterns across any codebase.