<!-- tldr ::: core waymark markers and their semantic meanings -->

# Waymark Markers

Markers classify a waymark's purpose and appear before the `:::` sigil. They provide semantic context that enables both humans and tools to understand the intent of each waymark.

## Marker Syntax

```javascript
// Basic marker syntax
// marker ::: description
// todo ::: implement authentication
// fixme ::: resolve memory leak

// Markers with signals
// !todo ::: high priority task
// *fixme ::: must fix before PR merge
// !!notice ::: critical security update
```

## Core Marker Groups

Waymark v1.0 defines 18 core markers organized into semantic groups:

### Top-level Marker
- **`tldr`** - Brief file/module overview (typically at file top)
  ```javascript
  // tldr ::: authentication service handling OAuth2 flows
  ```

### Work Items
- **`todo`** - Task to complete
- **`fixme`** - Bug to fix  
- **`refactor`** - Code to improve
- **`review`** - Needs review
- **`wip`** - Work in progress
- **`stub`** - Placeholder implementation
- **`temp`** - Temporary code
- **`done`** - Completed work (typically removed after completion)
- **`deprecated`** - Old code to phase out
- **`test`** - Test-related work

```javascript
// todo ::: implement user authentication
// fixme ::: race condition in payment processing
// refactor ::: extract validation logic to separate module
// review ::: @alice check security implications
// wip ::: building new API endpoint
// stub ::: placeholder for future implementation
// temp ::: quick fix - replace with proper solution
// deprecated ::: use newMethod() instead
// test ::: add edge case for empty array
```

### Information Markers
- **`note`** - General note or comment
- **`idea`** - Future possibility or suggestion
- **`about`** - Description or context
- **`example`** - Usage example

```javascript
// note ::: this assumes Redis is available
// idea ::: could parallelize this for better performance
// about ::: handles rate limiting for API requests
// example ::: processData({ limit: 100, offset: 0 })
```

### Attention Markers
- **`notice`** - Important information
- **`risk`** - Potential issue or concern
- **`important`** - Critical context

```javascript
// notice ::: this modifies global state
// risk ::: potential memory leak with large datasets
// important ::: must validate input to prevent SQL injection
```

## Marker Usage Guidelines

### One Marker Per Waymark
Never combine multiple markers in a single waymark:

```javascript
// ❌ Wrong
// todo fixme ::: implement auth and fix bug

// ✅ Correct
// todo ::: implement authentication
// fixme ::: resolve session timeout bug
```

### Choose the Right Marker
Select the marker that best represents the primary intent:

- Use `todo` for new work to be done
- Use `fixme` for bugs and issues to resolve
- Use `refactor` for code improvements without changing behavior
- Use `notice` for important information (not `alert`)
- Use `deprecated` for code being phased out

### Marker Priority
Express priority through signals, not marker choice:

```javascript
// Standard priority
// todo ::: implement caching

// High priority  
// !todo ::: implement caching

// Critical priority
// !!todo ::: implement caching

// Branch-scoped critical
// *!todo ::: implement caching before merge
```

## Common Patterns

### File Documentation
```javascript
// tldr ::: user authentication service
// about ::: handles login, logout, and session management
```

### Work Tracking
```javascript
// todo ::: @alice implement password reset #auth
// fixme ::: session timeout not working #fixes:#123
// review ::: @security check for vulnerabilities
```

### Code Quality
```javascript
// refactor ::: extract to separate function #code-smell
// deprecated ::: use UserService.authenticate() instead
// temp ::: quick fix until proper solution implemented
```

### Documentation
```javascript
// note ::: requires Node.js 18+ for native fetch
// example ::: await processUser({ id: 123, role: 'admin' })
// important ::: never expose API keys in client code
```

## Marker Selection Quick Reference

| If you need to... | Use this marker |
|-------------------|-----------------|
| Add a task | `todo` |
| Fix a bug | `fixme` |
| Improve code structure | `refactor` |
| Request review | `review` |
| Mark incomplete code | `wip` or `stub` |
| Add temporary code | `temp` |
| Document behavior | `note` or `about` |
| Show usage | `example` |
| Highlight critical info | `important` or `notice` |
| Flag potential issues | `risk` |
| Mark old code | `deprecated` |
| Suggest future work | `idea` |
| Summarize file/module | `tldr` |

## See Also

- [Signals](./signals.md) - Priority and scope modifiers
- [Tags](./tags/) - Classification and relationships
- [Syntax Specification](./SPEC.md) - Complete v1.0 specification