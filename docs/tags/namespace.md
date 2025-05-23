# Namespaced Tokens Reference

The `grepa` parser recognizes a set of standard tokens with defined meanings. These namespaced tokens form the core vocabulary for grep-anchors, with aliases provided for flexibility and backwards compatibility.

## Token Namespace and Aliases

| Namespace Token | Aliases | Description |
|----------------|---------|-------------|
| `tldr` | `summary`, `brief`, `desc` | Brief one-line summary of function/module/class |
| `fix` | `bugfix`, `patch`, `fixes` | Bug fix or correction needed |
| `feat` | `feature`, `enhancement`, `add` | New feature or capability |
| `docs` | `doc`, `documentation` | Documentation needed or related |
| `style` | `format`, `formatting`, `lint` | Code style/formatting changes |
| `refactor` | `refact`, `restructure`, `rewrite` | Code restructuring without behavior change |
| `perf` | `performance`, `optimize`, `opt` | Performance optimization |
| `test` | `tests`, `testing`, `spec` | Testing related |
| `build` | `compile`, `make` | Build system changes |
| `ci` | `cd`, `pipeline`, `actions` | CI/CD configuration |
| `chore` | `maint`, `maintenance`, `deps` | Routine maintenance tasks |
| `revert` | `rollback`, `undo` | Reverting previous changes |

## Extended Namespace Tokens

| Namespace Token | Aliases | Description |
|----------------|---------|-------------|
| `sec` | `security`, `vuln`, `cve` | Security-critical code |
| `temp` | `tmp`, `temporary`, `interim` | Temporary code to be removed |
| `hack` | `workaround`, `kludge`, `patch` | Workaround solution |
| `todo` | `task`, `issue`, `ticket` | Work to be done |
| `fixme` | `bug`, `broken`, `error` | Known issue that needs fixing |
| `note` | `info`, `nb`, `remark` | Important information |
| `deprecated` | `deprecate`, `obsolete`, `old` | Deprecated code |
| `breaking` | `break`, `incompatible` | Breaking change |
| `debt` | `techdebt`, `td`, `cleanup` | Technical debt |

## Priority Aliases

| Namespace Tag | Aliases | Description |
|----------------|---------|-------------|
| `p0` | `critical`, `blocker`, `urgent` | Critical priority |
| `p1` | `high`, `important` | High priority |
| `p2` | `medium`, `normal` | Medium priority |
| `p3` | `low`, `minor`, `trivial` | Low priority |

## Workflow Aliases

| Namespace Tag | Aliases | Description |
|----------------|---------|-------------|
| `wip` | `inprogress`, `doing`, `active` | Work in progress |
| `review` | `pr`, `cr`, `needs-review` | Needs code review |
| `blocked` | `waiting`, `depends`, `stuck` | Blocked by dependency |
| `done` | `complete`, `finished`, `resolved` | Completed work |

## Agent/Assignment Aliases

| Namespace Tag | Aliases | Description |
|----------------|---------|-------------|
| `@agent` | `@ai`, `@bot`, `@assistant` | Any AI agent |
| `@cursor` | `@cursor-ai`, `@cursor-ide` | Cursor AI specifically |
| `@copilot` | `@github-copilot`, `@gh-copilot` | GitHub Copilot |
| `@claude` | `@anthropic`, `@claude-ai` | Claude AI |

## Version and Lifecycle Aliases

| Namespace Tag | Aliases | Description |
|----------------|---------|-------------|
| `since` | `from`, `introduced`, `added` | Version when introduced |
| `until` | `before`, `remove-by`, `expires` | Version when removed |
| `backport` | `cherry-pick`, `port` | Backported change |
| `migration` | `migrate`, `upgrade`, `transition` | Migration-related |

## Using Aliases

The parser treats aliases as equivalent to their namespace tag:

```javascript
// These are equivalent:
// :ga:perf optimize query
// :ga:performance optimize query
// :ga:opt optimize query

// These are equivalent:
// :ga:sec,p0 SQL injection
// :ga:security,critical SQL injection
// :ga:vuln,blocker SQL injection
```

## Alias Resolution Rules

1. **Case Insensitive**: `TODO` and `todo` are equivalent
2. **Partial Matches**: The parser may recognize common abbreviations
3. **Precedence**: Namespace tokens take precedence over aliases in output
4. **Context Aware**: Some aliases may be context-dependent

## Custom Aliases

Teams can define custom aliases in their `.grepa.yml` configuration:

```yaml
aliases:
  story: feat
  defect: bug
  spike: research
  p-high: p1
  p-critical: p0
```

## Best Practices

1. **Prefer Namespace Tokens**: Use the standard namespace token when possible
2. **Document Custom Aliases**: If you define custom aliases, document them
3. **Avoid Ambiguity**: Don't create aliases that could be confused with other tokens
4. **Consistency**: Pick either namespace tokens or specific aliases and stick with them

## Examples

### Standard Usage
```javascript
// :ga:tldr User authentication service
// :ga:todo(T-123) implement OAuth2
// :ga:perf,p1 optimize database queries
```

### With Aliases
```javascript
// :ga:summary User authentication service
// :ga:task(T-123) implement OAuth2  
// :ga:performance,high optimize database queries
```

### Mixed Styles (Valid but not recommended)
```javascript
// :ga:feat,security,critical new auth system
// :ga:feature,sec,p0 new auth system
```

Remember: While aliases provide flexibility, using consistent namespace tokens makes your codebase more searchable and maintainable. The aliases exist primarily for compatibility and personal preference.