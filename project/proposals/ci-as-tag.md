<!-- tldr ::: proposal to convert ci from core waymark type to context tag -->

# CI as Tag Proposal

## Overview

This proposal recommends converting `ci` from a core waymark type to a context tag (#ci), making waymarks more semantic and flexible.

## Current State

Currently `ci` is listed as a core waymark type:
```javascript
ci ::: fix flaky test
ci ::: update GitHub Actions to Node 20
```

## Proposed Change

Convert `ci` to a tag that modifies existing waymark types:
```javascript
fixme ::: flaky test #ci
todo ::: update GitHub Actions to Node 20 #ci
alert ::: runner credits running low #ci:billing
```

## Rationale

1. **Semantic Clarity**: CI-related items are usually regular work (todo/fix/alert) that happens to be CI-related
2. **Action Focus**: The core action (fix/todo/alert) is immediately clear
3. **Flexibility**: Allows richer context with tag values
4. **Consistency**: Aligns with other context tags like #security, #performance

## Examples

### Basic CI Tags
```javascript
// Clear action type with CI context
todo ::: add test coverage reporting #ci
fixme ::: deployment script timeout #ci
alert ::: CircleCI failing on main #ci
temp ::: disable flaky test #ci:flaky
```

### CI with Additional Context
```javascript
// Platform-specific
todo ::: migrate to GitHub Actions #ci:github-actions
fixme ::: CircleCI config syntax error #ci:circleci

// CI categories
alert ::: runner out of disk space #ci:infrastructure
todo ::: update test dependencies #ci:dependencies
fixme ::: deployment script broken #ci:deploy

// Urgency indicators
!!fixme ::: main branch blocked #ci:urgent
!todo ::: security scan failing #ci:security
```

### Complex CI Patterns
```javascript
// Multiple contexts
todo ::: fix deployment timeout #ci:deploy #timeout:30s #prod
alert ::: CI budget exceeded #ci:billing #cost:$500

// With references
fixme ::: test failing after PR merge #ci:test #fixes:#234
todo ::: re-enable test after fix lands #ci:flaky #blocked:#123
```

## Tag Patterns

Recommended CI tag patterns:
- `#ci` - General CI/CD related
- `#ci:urgent` - Blocking CI issues  
- `#ci:deploy` - Deployment related
- `#ci:test` - Test related
- `#ci:flaky` - Intermittent failures
- `#ci:billing` - CI cost/credits
- `#ci:security` - Security scanning
- `#ci:<platform>` - Platform-specific (github-actions, circleci, jenkins)

## Migration

### Before
```javascript
ci ::: update test runner
ci ::: fix deployment script
ci ::: flaky test in auth module
```

### After  
```javascript
todo ::: update test runner #ci
fixme ::: deployment script #ci:deploy
temp ::: disable flaky auth test #ci:flaky
```

## Benefits

1. **Better Greppability**: Can find all CI items with `rg "#ci"` or specific types like `rg "fix.*#ci"`
2. **Richer Context**: Can specify what aspect of CI (deploy, test, billing, etc.)
3. **Priority via Signals**: Use `!!todo ::: ... #ci` for critical CI work
4. **Cross-cutting Concerns**: Can combine with other tags like #security, #prod

## Implementation

1. Remove `ci` from core waymark types list
2. Update documentation to show #ci tag usage
3. Add CI tag patterns to tag dictionary
4. Migration script to convert existing `ci ::: ` waymarks

## Conclusion

Converting `ci` to a tag provides more flexibility while maintaining searchability. It aligns with the principle of using waymark types for core actions and tags for context.