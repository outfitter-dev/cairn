<!-- tldr ::: how teams can create custom tags for project-specific semantic marking -->
# Custom Tags

Teams can extend waymarks with custom tags to capture project-specific semantics, workflow states, or domain concepts. This guide shows how to create and use custom tags effectively.

## Why Custom Tags?

While waymarks provide a rich set of core markers and standard tags, every project has unique needs:

- **Domain concepts**: `#wham`, `#spike`, `#debt`, `#reflog`
- **Workflow states**: `#needs-qa`, `#ready-to-merge`, `#needs-design`
- **Team conventions**: `#pair-with`, `#mob-session`, `#tech-talk`
- **Project metadata**: `#wm` (waymark meta), `#wmi` (waymark internal)

Custom tags let you extend waymarks without waiting for spec changes.

## Example: The `#wm` Pattern

The waymark project itself uses custom tags to mark meta-work:

```javascript
// Development tooling example
// todo ::: priority:high fix auth #wm:fix/property-priority
// alert ::: validate input #wm:fix/deprecated-marker
// note ::: discouraged #auth/oauth #wm:warn/hierarchical-tag
```

These `#wm:` tags identify:
- `#wm:fix/*` - Things that need fixing in the waymark ecosystem
- `#wm:warn/*` - Warnings about waymark usage
- `#wm:meta` - Meta-discussions about waymarks themselves

Similarly, `#wmi:` (waymark internal) marks internal project concerns:

```markdown
<!-- todo ::: Document appears based on pre-v1.0 syntax #wm:fix -->
<!-- todo ::: Example uses deprecated #priority:high #wm:fix -->
```

## Creating Custom Tags

### 1. Choose a Namespace

Pick a short, unique prefix for your project:

```javascript
// Project-specific
#proj:*        // Generic project namespace
#acme:*        // Company namespace
#api:v2        // Version-specific

// Team-specific
#fe:*          // Frontend team
#be:*          // Backend team
#qa:*          // QA team
#sec:*         // Security team

// Workflow-specific
#review:*      // Code review states
#deploy:*      // Deployment tracking
#experiment:*  // A/B testing
```

### 2. Define Semantics

Document what your tags mean:

```markdown
## Our Custom Tags

- `#spike:research` - Exploratory work, no deliverable expected
- `#spike:timeboxed` - Time-limited investigation
- `#debt:interest` - Tech debt actively slowing development
- `#debt:principal` - Core debt that needs addressing
- `#experiment:active` - Currently running A/B test
- `#experiment:concluded` - Test complete, results available
```

### 3. Keep It Greppable

Design tags for easy searching:

```bash
# Find all spike work
rg "#spike:"

# Find active experiments
rg "#experiment:active"

# Find high-interest tech debt
rg "#debt:interest.*!!" 

# Count custom tags by type
rg -o "#(wm|debt|spike):[^#\s]+" | sort | uniq -c
```

## Best Practices

### Do: Keep It Simple

```javascript
// ✅ Clear and searchable
// todo ::: investigate performance issue #spike:timeboxed
// fixme ::: accumulating tech debt here #debt:interest

// ❌ Over-engineered
// todo ::: investigate #investigation:performance:database:optimization
```

### Do: Document Your Tags

Add a `WAYMARK-TAGS.md` or similar to your repo:

```markdown
# Project Waymark Tags

## Domain Tags
- `#wham` - "What Happened After Merge" - post-deploy issues
- `#spike` - Time-boxed investigation work
- `#reflog` - Reference to git reflog for context

## Workflow Tags  
- `#needs-product` - Blocked on product decision
- `#needs-design` - Blocked on design assets
- `#ready-to-merge` - PR approved and tested

## Meta Tags
- `#wm:*` - Waymark-related work
- `#tooling:*` - Build/dev tooling issues
```

### Do: Use Relational Patterns

Custom tags work great with relational tags:

```javascript
// Custom domain concept with relations
// todo ::: investigate timeout #spike:research #timeboxed:2h #refs:#prod-incident-42

// Workflow states with ownership
// review ::: needs security check #needs-review:security #owner:@sec-team

// Experiments with references
// notice ::: checkout A/B test #experiment:active #feat:checkout-v2
```

### Don't: Recreate Core Patterns

Avoid duplicating what waymarks already provide:

```javascript
// ❌ Don't recreate priority
// todo ::: task #custom-priority:high    // Use: !todo

// ❌ Don't recreate assignment  
// todo ::: task #assigned-to:alice       // Use: @alice

// ❌ Don't recreate issue refs
// todo ::: task #bug-number:123          // Use: #fixes:#123
```

## Search Patterns

### Finding Custom Tags

```bash
# List all custom tags in use (assuming 3+ char prefixes)
rg -o "#\w{3,}:[^#\s]+" | sort | uniq

# Find specific custom tag usage
rg "#wm:" --type md          # In markdown files
rg "#spike:" --type js       # In JavaScript
rg "#debt:interest"          # High-interest debt

# Custom tag analytics
# Count by prefix
rg -o "#(\w+):" | sed 's/#\(.*\):/\1/' | sort | uniq -c | sort -nr

# Recent custom tag usage
rg "#(wm|spike|debt):" --sort modified | head -20
```

### Combining with Standard Patterns

```bash
# Critical custom-tagged items
rg "!!.*#spike:"

# Assigned custom work
rg "@\w+.*#debt:|#debt:.*@\w+"

# Custom tags in specific states
rg "wip ::.*#experiment:active"
```

## Migration Considerations

When adopting custom tags:

1. **Audit existing markers**: Check if you're already using informal patterns
2. **Standardize gradually**: Start with high-value patterns
3. **Update tooling**: Ensure your scripts recognize custom tags
4. **Document conventions**: Make them discoverable for new team members

Example migration:

```bash
# Find informal patterns that could be tags
rg "::: .*(SPIKE|DEBT|EXPERIMENT)" 

# Convert to tags
sed -i 's/SPIKE investigation/#spike:research/g' **/*.js
sed -i 's/DEBT:/needs addressing #debt:principal/g' **/*.js
```

## Advanced Patterns

### Hierarchical Custom Tags

While waymark v1.0 simplified away hierarchical tags, custom tags can still use them:

```javascript
// Custom hierarchies for specific domains
// todo ::: fix API rate limiting #api:v2/ratelimit
// notice ::: breaking change #api:v3/breaking
// wip ::: new ML model #ml:nlp/transformer
```

### Custom Tag Arrays

Apply array patterns to custom tags:

```javascript
// Multiple experiment flags
// notice ::: testing checkout flow #experiment:checkout-v2,payment-v3

// Multiple spike areas
// todo ::: investigate options #spike:performance,security,ux
```

### Tooling Integration

Build simple tools around your custom tags:

```javascript
#!/usr/bin/env node
// List all active experiments
const { execSync } = require('child_process');

const output = execSync('rg "#experiment:active"', { encoding: 'utf8' });
console.log('Active Experiments:');
output.split('\n').forEach(line => {
  if (line) console.log(`- ${line}`);
});
```

## Remember

Custom tags are powerful but should be used judiciously:

- **Start small**: Add custom tags as needs arise
- **Stay consistent**: Document and share conventions
- **Keep it greppable**: Simple patterns win
- **Review regularly**: Prune unused custom tags

The goal is to enhance your workflow without adding complexity. When in doubt, use standard waymark patterns first, and add custom tags only when they provide clear value.

## See Also

- [Common Patterns](common-patterns.md) - Standard waymark patterns
- [Workflow Patterns](workflow-patterns.md) - Team workflow integration
- [Conventions](conventions.md) - Establishing team standards