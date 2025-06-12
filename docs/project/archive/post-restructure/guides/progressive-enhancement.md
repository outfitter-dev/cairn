# Progressive Enhancement Guide
<!-- :M: tldr How to adopt waymarks incrementally from simple to advanced -->
<!-- :M: guide Step-by-step adoption guide for individuals and teams -->

Start simple, grow as needed. This guide shows how to adopt waymarks incrementally.

## Level 0: Your First Waymark

Start with just one pattern to get comfortable:

```javascript
// :M: todo implement validation
function saveUser(data) {
    // Save to database
}
```

**Find it:**

```bash
rg ":M:"
```

That's it! You've made your first waymark.

## The Waymark Identifier

This guide uses `:M:` - the canonical waymark identifier. The three-character pattern ensures consistency across all projects and makes patterns universally searchable.

## Level 1: TODO Migration

If you already use TODO comments, enhance them gradually:

### Phase 1: Add `:M:` to existing TODOs

```javascript
// TODO :M: add error handling
// FIXME :M: memory leak here
// NOTE :M: this assumes UTC timezone
```

Your existing tools still work, but now you can also:

```bash
rg ":M:"  # Find all enhanced comments
```

### Phase 2: Start using pure waymarks

```javascript
// :M: todo add error handling
// :M: fixme memory leak here  
// :M: note assumes UTC timezone
```

## Level 2: Add Context

Once comfortable with basic waymarks, add context for clarity:

```python
# :M: todo implement retry logic
# becomes:
# :M: todo implement retry logic
# :M: ctx max 3 attempts with exponential backoff

# :M: sec validate input
# becomes:
# :M: sec validate input
# :M: ctx prevent SQL injection and XSS
```

## Level 3: AI Agent Integration

Start delegating to AI agents:

```javascript
// Basic delegation
// :M: @agent implement this function

// With guidance
// :M: @agent implement pagination
// :M: ctx use cursor-based approach
// :M: requirement support bidirectional navigation

// Specific agents
// :M: @cursor write unit tests
// :M: @claude optimize for performance
```

## Level 4: Structured Tasks

Link to your issue tracker:

```python
# Simple issue reference
# :M: issue(123) fix user validation

# With more context
# :M: issue(123) fix user validation
# :M: priority high
# :M: owner @alice

# Or combined
# :M: issue(123),priority:high,@alice fix user validation
```

## Level 5: Team Patterns

Define patterns that make sense for your team:

```ruby
# Your team's priority system
# :M: p0 - drop everything, fix now
# :M: p1 - fix this sprint  
# :M: p2 - fix next sprint
# :M: backlog - eventually

# Your team's workflow
# :M: ready-for-review
# :M: needs-qa
# :M: ship-it

# Your team's domains
# :M: frontend
# :M: backend
# :M: infra
```

## Migration Strategies

### Gradual File-by-File

Pick one file at a time:

```bash
# See current TODOs in a file
grep "TODO" --exclude-dir=.git src/auth.js

# Enhance them
sed -i 's/TODO/TODO :M: /g' src/auth.js
sed -i 's/FIXME/FIXME :M: /g' src/auth.js

# Verify
rg ":M: " src/auth.js
```

### By Feature Area

Adopt in one area first:

```bash
# Start with security-critical code
# Add :M: sec markers

# Then move to performance
# Add :M: perf markers

# Then documentation
# Add :M: docs markers
```

### During Code Reviews

Add waymarks as you review:
- See missing error handling? Add `:M: error handle timeout`
- Spot performance issue? Add `:M: perf optimize query`
- Notice assumption? Add `:M: ctx assumes sorted input`

## Measuring Adoption

Track your progress:

```bash
# Count enhanced vs regular TODOs
echo "Regular TODOs: $(grep -r "TODO" --exclude-dir=.git | grep -v ":M: " | wc -l)"
echo "Enhanced TODOs: $(rg "TODO.*:M: |:M: todo" | wc -l)"

# See adoption by file type
rg ":M: " --type-list
rg ":M: " -t js --count-matches

# Most common patterns
rg -o ":M: (\w+)" -r '$1' | sort | uniq -c | sort -nr
```

## Common Progression Paths

### For Solo Developers
1. Start with `:M: todo`
2. Add `:M: fixme` for bugs
3. Add `:M: @agent` for AI help
4. Add `:M: ctx` for clarity

### For Teams
1. Agree on 3-5 initial patterns
2. Document in README
3. Add to PR checklist
4. Gradually expand vocabulary

### For Open Source
1. Start with `:M: help-wanted`
2. Add `:M: good-first-issue`
3. Add `:M: breaking-change`
4. Document in CONTRIBUTING.md

## Tips for Success

1. **Don't force it**: If a comment doesn't need to be searchable, don't add `:M: `
2. **Stay consistent**: Pick patterns and stick to them
3. **Document your patterns**: Keep a list in your README
4. **Start small**: 3-5 patterns are plenty to start
5. **Let it evolve**: Add new patterns as needs arise

## Example Evolution

Here's how one function might evolve:

### Week 1: Basic TODO

```javascript
function processPayment(amount) {
    // TODO: add validation
    chargeCard(amount);
}
```

### Week 2: Enhanced TODO

```javascript
function processPayment(amount) {
    // :M: todo add validation
    chargeCard(amount);
}
```

### Week 3: Add context

```javascript
function processPayment(amount) {
    // :M: todo add validation
    // :M: ctx amount must be positive, max 10000
    chargeCard(amount);
}
```

### Week 4: Delegate to AI

```javascript
function processPayment(amount) {
    // :M: @agent add validation
    // :M: ctx amount must be positive, max 10000
    // :M: sec prevent negative charges
    chargeCard(amount);
}
```

### Week 5: Link to issue

```javascript
function processPayment(amount) {
    // :M: issue(PAY-456) add validation
    // :M: ctx amount must be positive, max 10000
    // :M: sec prevent negative charges
    chargeCard(amount);
}
```

## Keep It Simple

The goal is discoverability, not perfection. Even one `:M:` marker can help make your codebase more navigable. Start where you are, use what works, and let your patterns grow naturally with your needs. 