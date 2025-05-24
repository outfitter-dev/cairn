# Common Tags

Common grep-anchor tags used across projects.

## General Purpose Tags

### `:ga:tldr`
**Purpose**: Mark the "too long; didn't read" summary of a function or module.
**Usage**: Place at the beginning of functions to provide a quick overview.

```javascript
// :ga:tldr Parse and validate user input before processing
function processUserInput(data) {
  // ...
}
```

### `:ga:api`
**Purpose**: Mark public API entry points.
**Usage**: Identify functions, classes, or modules that form the public interface.

### `:ga:internal`
**Purpose**: Mark internal implementation details.
**Usage**: Flag code that should not be used by external consumers.

## TODO: Expand this documentation
- Add more common tags
- Include examples from real codebases
- Define naming conventions for custom tags