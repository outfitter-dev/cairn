# UI Compression Comparison

This document shows the dramatic space savings from terse messages and line compression.

## Before: Verbose Messages, One Per Line

```
╭─────────────────────────────────────────────────────────────────────────────╮
│ ▸ packages/multitool/test-fixtures/test_new_patterns.md     16 violations │
├───────┬─────────────────────────────────────────────────────────────────────┤
│ Line  │ Issue                                                               │
├───────┼─────────────────────────────────────────────────────────────────────┤
│  5    │ Property-based priority found                                       │
│  5    │ Marker placed after ::: instead of before                           │
│  6    │ Discouraged hierarchical tag found                                  │
│  6    │ Marker placed after ::: instead of before                           │
│  7    │ Marker placed after ::: instead of before                           │
│  7    │ Property 'reason:test_reason' should use # prefix                   │
│  7    │ Legacy blessed property 'reason:' found                             │
│  8    │ Marker placed after ::: instead of before                           │
│  8    │ Property 'custom:value' should use # prefix                         │
│  9    │ Array with spaces found                                             │
│  9    │ Misplaced @actor found                                              │
│  9    │ Marker placed after ::: instead of before                           │
│  10   │ Marker placed after ::: instead of before                           │
│  11   │ Multiple #owner tags found                                          │
│  11   │ Legacy +tag syntax found                                            │
│  11   │ Marker placed after ::: instead of before                           │
╰───────┴─────────────────────────────────────────────────────────────────────╯
```

**Lines: 19** (including box borders)

## After: Terse Messages, Compressed Lines

```
╭─────────────────────────────────────────────────────────────────────────────╮
│ ▸ packages/multitool/test-fixtures/test_new_patterns.md   Issues (7 lines, 16 violations) │
├───────┬─────────────────────────────────────────────────────────────────────┤
│  Line │ Issues                                                              │
├───────┼─────────────────────────────────────────────────────────────────────┤
│     5 │ legacy (priority), marker (after :::)                               │
│     6 │ tag (hierarchical), marker (after :::)                              │
│     7 │ marker (after :::), use (#reason), legacy (reason:)                 │
│     8 │ marker (after :::), use (#custom)                                   │
│     9 │ array (spaces), actor (misplaced), marker (after :::)               │
│    10 │ marker (after :::)                                                  │
│    11 │ multiple (#owner), legacy (+tag), marker (after :::)                │
╰───────┴─────────────────────────────────────────────────────────────────────╯
```

**Lines: 11** (42% reduction!)

## With "and n more..." Compression

For files with many violations per line:

```
╭─────────────────────────────────────────────────────────────────────────────╮
│ ▸ packages/core/src/legacy-parser.ts                Issues (12 lines, 47 violations) │
├───────┬─────────────────────────────────────────────────────────────────────┤
│  Line │ Issues                                                              │
├───────┼─────────────────────────────────────────────────────────────────────┤
│    23 │ legacy (+tag), tag (hierarchical), and 3 more...                   │
│    45 │ marker (after :::), use (#priority)                                 │
│       │ › ::: todo do this thing priority:high                              │
│    67 │ deprecated (fix)                                                    │
│    89 │ all-caps (TODO), all-caps (FIXME), all-caps (NOTE), and 2 more...  │
│   101 │ legacy (priority), legacy (status:), legacy (owner:), and 4 more... │
╰───────┴─────────────────────────────────────────────────────────────────────╯
```

## Benefits

1. **Space Efficiency**: 42-60% reduction in vertical space
2. **Faster Scanning**: Related violations grouped by line
3. **Pattern Recognition**: Common issues become obvious
4. **Actionable**: Line-by-line fixes are clearer

## Terse Message Reference

| Verbose | Terse |
|---------|-------|
| "Legacy `+tag` syntax found" | `legacy (+tag)` |
| "Property-based priority found" | `legacy (priority)` |
| "Marker placed after ::: instead of before" | `marker (after :::)` |
| "Discouraged hierarchical tag found" | `tag (hierarchical)` |
| "Array with spaces found" | `array (spaces)` |
| "Property 'X' should use # prefix" | `use (#X)` |
| "Deprecated marker 'X' found" | `deprecated (X)` |
| "All-caps marker 'X' found" | `all-caps (X)` |
| "Multiple #owner tags found" | `multiple (#owner)` |
| "Misplaced @actor found" | `actor (misplaced)` |