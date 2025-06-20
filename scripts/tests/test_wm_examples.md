# Test WM Example Pattern Detection

This file tests the `wm:example` pattern and comma-separated values in code blocks.

## Should be ignored (wm:example patterns):

```javascript wm:example
// todo ::: this should be ignored (basic example)
// alert ::: deprecated marker example
```

```python wm:example,deprecated
# fix ::: old deprecated marker
# +security ::: old tag syntax
```

```javascript wm:example,antipattern,v0.9
// TODO ::: all caps marker (wrong)
// priority:high implement feature (wrong property syntax)
```

```yaml wm:example,migration,before-after
# Before:
# alert ::: validate config +security

# After:  
# notice ::: validate config #security
```

```typescript wm:example,broken
// This syntax is intentionally broken:
// ??? ::: unknown marker
// todo ::: missing hash in fixes:123
```

## Should be detected (normal code blocks):

```javascript
// todo ::: this should be detected as real waymark
// notice ::: another real waymark #important
```

```python
# todo ::: real Python waymark
# test ::: another real waymark #testing
```

```
// todo ::: generic code block waymark
```

<!-- todo ::: HTML comment waymark should be detected -->

## Mixed examples:

Regular markdown with `// todo ::: inline backtick` should be ignored.

But this should work:
```bash
# todo ::: shell script waymark #devops
```

While this should not:
```bash wm:example
# alert ::: old shell pattern  
```