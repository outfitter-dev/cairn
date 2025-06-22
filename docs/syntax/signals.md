<!-- tldr ::: signal system for priority and scope modifiers -->

# Waymark Signals

Signals are optional prefixes that modify waymark markers to indicate priority, scope, or other special handling. They provide a visual and searchable way to classify the urgency and context of waymarks.

## Signal Types

### Position Signals (Must Be First)
- **`*`** (Star) - Branch-scoped work that must be finished before PR merge
- **`_`** (Underscore) - Ignore marker (reserved for future functionality)

### Intensity Signals  
- **`!`** / **`!!`** (Bang/Double-bang) - Important → Critical
- **`?`** / **`??`** (Question/Double-question) - Needs clarification → Highly uncertain  
- **`-`** / **`--`** (Tombstone/Instant-prune) - Mark for removal → Remove ASAP

## Signal Order

When combining signals, position signals must come first:

```javascript
// Correct order: position then intensity
// *!todo ::: critical bug blocking PR
// *?note ::: unclear if this handles edge case

// ❌ Wrong order
// !*todo ::: this won't parse correctly
```

## Signal Reference

| Symbol | Name | Primary Meaning | Common Usage |
|--------|------|-----------------|--------------|
| `*` | Star | Branch-scoped work | Tasks that must complete before PR merge |
| `!` | Bang | Important/High priority | P1 priority items |
| `!!` | Double-bang | Critical/Urgent | P0 priority, blockers |
| `?` | Question | Needs clarification | Uncertain assumptions |
| `??` | Double-question | Highly uncertain | Major unknowns |
| `-` | Tombstone | Mark for removal | Code to remove later |
| `--` | Instant-prune | Remove ASAP | Code to remove immediately |
| `_` | Underscore | Ignore | Reserved for future use |

## Contextual Interpretation

The meaning of intensity signals varies by marker type:

### Work Markers (`todo`, `fixme`)
- `!` = High priority (P1)
- `!!` = Critical priority (P0)

```javascript
// !todo ::: implement rate limiting          // P1 priority
// !!fixme ::: data loss bug                  // P0 critical
```

### Information Markers (`tldr`, `note`, `about`)
- `!` = Important/must-read
- `!!` = Most critical/canonical

```javascript
// !tldr ::: core authentication service      // Important summary
// !!note ::: modifies global state           // Critical information
```

### Attention Markers (`notice`, `risk`, `important`)
- `!` = High severity
- `!!` = Critical severity

```javascript
// !risk ::: potential memory leak            // High risk
// !!notice ::: breaking API change           // Critical notice
```

## Common Patterns

### Branch Work
Use `*` for work that must be completed before merging:

```javascript
// *todo ::: finish error handling
// *fixme ::: resolve test failures
// *!todo ::: critical issue blocking PR
```

### Priority Levels
Express priority through signals, not tags:

```javascript
// todo ::: standard priority task            // P2 (normal)
// !todo ::: high priority task               // P1 (high)
// !!todo ::: critical blocker                // P0 (critical)
```

### Uncertainty
Mark unclear or questionable code:

```javascript
// ?note ::: does this handle null values?
// ??todo ::: unclear requirements - needs clarification
// ?fixme ::: might be causing intermittent failures
```

### Code Removal
Mark code for deletion:

```javascript
// -deprecated ::: remove after v2.0 migration
// --temp ::: remove this hack immediately
// -todo ::: obsolete after new API ships
```

## Search Patterns

Find waymarks by signal:

```bash
# All branch work
rg "\*\w+\s+:::"

# Critical items
rg "!!\w+\s+:::"

# High priority items
rg "!\w+\s+:::"

# Uncertain items
rg "\?\w+\s+:::"

# Items to remove
rg "-\w+\s+:::"

# Critical branch work
rg "\*!\w+\s+:::"
```

## Best Practices

### 1. Use Signals for Priority, Not Tags
```javascript
// ✅ Correct - use signal
// !todo ::: implement caching

// ❌ Wrong - don't use priority tags
// todo ::: implement caching #priority:high
```

### 2. Branch Work Gets Star
Any work that must be done before merging should use `*`:

```javascript
// *todo ::: add error handling
// *test ::: fix flaky test
// *refactor ::: clean up before merge
```

### 3. Double Signals for Critical Items
Reserve `!!` for truly critical items:

```javascript
// !!fixme ::: security vulnerability
// !!notice ::: breaking change
// !!todo ::: fixes data corruption
```

### 4. Question Uncertain Code
Use `?` to flag assumptions:

```javascript
// ?note ::: assumes user is authenticated
// ??todo ::: requirements unclear
```

### 5. Clean Up Removal Markers
Code marked with `-` or `--` should be removed promptly:

```javascript
// --temp ::: remove after deploy
// -deprecated ::: delete in next release
```

## Signal Combinations

Valid signal combinations follow the pattern: `[position][intensity]`

```javascript
// Valid combinations
// *todo ::: branch work
// !todo ::: important
// *!todo ::: important branch work
// !!fixme ::: critical bug
// *!!fixme ::: critical branch bug
// ?note ::: uncertain
// -todo ::: to be removed

// Invalid combinations
// !*todo ::: wrong order
// !!*todo ::: wrong order
// *_todo ::: conflicting position signals
```

## See Also

- [Markers](./markers.md) - Core waymark markers
- [Actors](./actors.md) - Assignment and ownership
- [Tags](./tags/) - Classification system
- [Syntax Specification](./SPEC.md) - Complete v1.0 specification