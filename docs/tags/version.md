# Version Tokens Reference

Version tokens in grep-anchors help track code lifecycle, compatibility requirements, and deprecation timelines. This document covers common version notation patterns you can use with `:ga:`.

## Basic Version Tokens

The simplest approach is to use version numbers directly as tokens:

```javascript
// :ga:v2.0 breaking API change
// :ga:v1.2.3,deprecated will be removed
// :ga:2.0.0,feat new async support
```

## Version Range Notation

For expressing version requirements and ranges:

### Comparison Operators
```javascript
// :ga:>=v2.0 requires Node 18 or higher
// :ga:>v1.0,<v2.0 compatible with 1.x only
// :ga:<=v3.0,fix works up to version 3
```

### SemVer-Style Ranges
```javascript
// :ga:^2.1.0 compatible within major version
// :ga:~2.1.0 compatible within minor version
// :ga:v2.x any 2.x version acceptable
```

## Lifecycle Patterns

### Introduction Tracking
```javascript
// :ga:since(v1.5),feat async processing added
// :ga:introduced(2.0) new API endpoint
// :ga:v1.0+,breaking requires newer version
```

### Deprecation and Removal
```javascript
// :ga:deprecated,until(v3.0) remove in next major
// :ga:deprecated(v2.1),use(newMethod) migration path
// :ga:obsolete,v2.0 no longer supported
```

### Temporary Code
```javascript
// :ga:temp,until(v2.1) workaround for bug
// :ga:hack,remove(v3.0) compatibility shim
// :ga:interim,v2.0-v2.5 bridge implementation
```

## Complex Version Expressions

### Multiple Version Constraints
```javascript
// :ga:v1.0|v2.0,fix patches for both versions
// :ga:supports[v1.5,v2.0,v2.1] tested versions
// :ga:breaking,affects(>=v2.0) all 2.x affected
```

### Version with Context
```javascript
// :ga:v2.0,api,breaking REST endpoints changed
// :ga:v1.9,backport,fix security patch
// :ga:lts(v2.0),support long-term support branch
```

## Platform-Specific Versions

### Runtime Versions
```javascript
// :ga:node(>=18),required ES2022 features
// :ga:python(3.9+) type hints syntax
// :ga:php(^8.0) named arguments used
```

### Dependency Versions
```javascript
// :ga:react(^18.0),hooks concurrent features
// :ga:angular(v15),deprecated old syntax
// :ga:rails(~>7.0) ActiveRecord 7 required
```

## Best Practices

1. **Be Explicit**: `v2.0` is clearer than just `2.0`
2. **Include Context**: `v2.0,breaking` tells more than just `v2.0`
3. **Specify Ranges**: Use `>=v2.0` rather than "2.0 or higher" in comments
4. **Track Both Ends**: For temporary code, specify both introduction and removal
5. **Use Standards**: Follow SemVer notation when applicable

## Examples in Practice

### Feature Introduction
```javascript
// :ga:tldr New async file handler with streaming support
// :ga:feat,v2.0,api async file operations
async function processFile(path) {
    // :ga:since(v2.0),breaking returns Promise
    // implementation
}
```

### Deprecation Notice
```python
# :ga:deprecated(v3.0),use(new_api.process)
def old_process(data):
    # :ga:warning,until(v4.0) will be removed
    warnings.warn("Use new_api.process instead", DeprecationWarning)
    return new_api.process(data)
```

### Version-Specific Workaround
```go
// :ga:hack,ios(15.0-15.3) Safari WebSocket bug
if isIOSSafari(version) && version >= "15.0" && version <= "15.3" {
    // :ga:temp,until(ios-15.4) force polling
    usePolling = true
}
```

### Multi-Version Support
```ruby
# :ga:supports[rails-6,rails-7],tested
if Rails::VERSION::MAJOR >= 7
  # :ga:v7.0+,api new Active Record syntax
  has_many :items, -> { active }, inverse_of: :parent
else
  # :ga:v6.x,deprecated old syntax
  has_many :items, -> { where(active: true) }
end
```

Remember: Version tokens are just conventions. Use whatever notation makes sense for your team and tools, keeping in mind that simpler patterns are easier to grep and parse.