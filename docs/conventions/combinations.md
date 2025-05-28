# Marker Combinations
<!-- :A: tldr How to effectively combine multiple Magic Anchor markers -->
<!-- :A: convention Guidelines for combining markers and multi-marker patterns -->

How to combine multiple Magic Anchor markers effectively.

## When to Combine vs Separate

### Use Combined Markers When:

- Markers are closely related (e.g., `security, todo`)
- No additional descriptions needed
- The combined meaning is clear

### Use Separate Comments When:

- Each marker needs its own description
- Line length would exceed ~80 characters
- Topics are distinct enough to warrant separation
- Better grep results readability is needed

## Combining Markers

Markers can be combined using comma-space separation when they form a cohesive concept:

### Security + Performance

```rust
// :A: sec, perf Crypto operations need constant-time implementation
fn compare_hashes(a: &[u8], b: &[u8]) -> bool {
    // ...
}
```

### Version + Deprecation

```typescript
// :A: v2.0, deprecated Will be removed in v3.0
function oldApiMethod(): void {
    // ...
}
```

### Priority + Issue

```python
# :A: p1, issue(456) Critical bug affecting production
def process_payment(amount):
    # ...
```

## Best Practices

1. **Order matters**: Place the most important marker first
2. **Limit chains**: Use 2-3 markers maximum for readability
3. **Avoid redundancy**: Don't combine markers with similar meanings
4. **Line length**: Keep lines under ~80 chars for better grep output
5. **Separate descriptions**: Use multiple comments when each marker needs explanation

### Good: Related markers, concise

```javascript
// :A: sec, todo validate user input
// :A: perf, p0 optimize this query
```

### Better: Separate lines for clarity

```javascript
// :A: sec sanitize HTML to prevent XSS
// :A: todo add rate limiting to this endpoint
// :A: ctx max 100 requests per minute per user
```

### Avoid: Multiple markers with descriptions

```javascript
// :A: sec, todo, perf validate inputs, add caching, check permissions
// ❌ Too long, hard to grep, mixed concerns
```

## Finding Combined Markers with Ripgrep

When markers are split across lines, use context flags:

```bash
# Find security markers with 2 lines context
rg -C2 ":A: sec"

# Find files with both security and todo markers
for f in $(rg -l ":A: sec"); do 
  rg -l ":A: todo" "$f" && echo "$f has both"
done

# Find security/todo within 3 lines of each other
rg -B3 -A3 ":A: sec" | rg -B3 -A3 ":A: todo"
```

## TODO: Expand this documentation

- Add more combination examples
- Define precedence rules
- Include tooling support details