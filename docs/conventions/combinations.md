# Tag Combinations

How to combine multiple grep-anchor tags effectively.

## Combining Tags

Tags can be combined using commas or spaces to provide richer context:

### Security + Performance
```rust
// :ga:sec,perf Crypto operations need constant-time implementation
fn compare_hashes(a: &[u8], b: &[u8]) -> bool {
    // ...
}
```

### Version + Deprecation
```typescript
// :ga:v2.0,deprecated Will be removed in v3.0
function oldApiMethod(): void {
    // ...
}
```

### Priority + Issue
```python
# :ga:p1,issue-456 Critical bug affecting production
def process_payment(amount):
    # ...
```

## Best Practices

1. **Order matters**: Place most important tag first
2. **Limit chains**: Use 2-3 tags maximum for readability
3. **Avoid redundancy**: Don't combine tags with similar meanings

## TODO: Expand this documentation
- Add more combination examples
- Define precedence rules
- Include tooling support details