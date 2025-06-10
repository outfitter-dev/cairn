# Progressive Enhancement Guide
<!-- :M: tldr How to adopt Cairns incrementally from simple to advanced -->
<!-- :M: guide Step-by-step adoption guide for individuals and teams -->

Start simple, grow as needed. This guide shows how to adopt Cairns incrementally.

## Level 0: Your First Cairn

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

That's it! You've made your first Cairn.

## The Canonical Cairn

This guide uses `:M:` - the canonical Cairn prefix. The single standard ensures consistency across all projects and makes patterns universally searchable.

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

### Phase 2: Start using pure Cairns
```javascript
// :M: todo add error handling
// :M: fixme memory leak here  
// :M: note assumes UTC timezone
```

## Level 2: Add Context

Once comfortable with basic anchors, add context for clarity:

```python
# :A: todo implement retry logic
# becomes:
# :A: todo implement retry logic
# :A: ctx max 3 attempts with exponential backoff

# :A: sec validate input
# becomes:
# :A: sec validate input
# :A: ctx prevent SQL injection and XSS
```

## Level 3: AI Agent Integration

Start delegating to AI agents:

```javascript
// Basic delegation
// :A: @agent implement this function

// With guidance
// :A: @agent implement pagination
// :A: ctx use cursor-based approach
// :A: requirement support both forward and backward

// Specific agents
// :A: @cursor write unit tests
// :A: @claude optimize for performance
```

## Level 4: Structured Tasks

Link to your issue tracker:

```python
# Simple issue reference
# :A: issue(123) fix user validation

# With more context
# :A: issue(123) fix user validation
# :A: priority high
# :A: owner @alice

# Or combined
# :A: issue(123),priority:high,@alice fix user validation
```

## Level 5: Team Patterns

Define patterns that make sense for your team:

```ruby
# Your team's priority system
# :A: p0 - drop everything, fix now
# :A: p1 - fix this sprint  
# :A: p2 - fix next sprint
# :A: backlog - eventually

# Your team's workflow
# :A: ready-for-review
# :A: needs-qa
# :A: ship-it

# Your team's domains
# :A: frontend
# :A: backend
# :A: infra
```

## Migration Strategies

### Gradual File-by-File

Pick one file at a time:
```bash
# See current TODOs in a file
grep "TODO" --exclude-dir=.git src/auth.js

# Enhance them
sed -i 's/TODO/TODO :A: /g' src/auth.js
sed -i 's/FIXME/FIXME :A: /g' src/auth.js

# Verify
rg ":A: " src/auth.js
```

### By Feature Area

Adopt in one area first:
```bash
# Start with security-critical code
# Add :A: sec markers

# Then move to performance
# Add :A: perf markers

# Then documentation
# Add :A: docs markers
```

### During Code Reviews

Add anchors as you review:
- See missing error handling? Add `:A: error handle timeout`
- Spot performance issue? Add `:A: perf optimize query`
- Notice assumption? Add `:A: ctx assumes sorted input`

## Measuring Adoption

Track your progress:

```bash
# Count enhanced vs regular TODOs
echo "Regular TODOs: $(grep -r "TODO" --exclude-dir=.git | grep -v ":A: " | wc -l)"
echo "Enhanced TODOs: $(rg "TODO.*:A: |:A: todo" | wc -l)"

# See adoption by file type
rg ":A: " --type-list
rg ":A: " -t js --count-matches

# Most common patterns
rg -o ":A: (\w+)" -r '$1' | sort | uniq -c | sort -nr
```

## Common Progression Paths

### For Solo Developers
1. Start with `:A: todo`
2. Add `:A: fixme` for bugs
3. Add `:A: @agent` for AI help
4. Add `:A: ctx` for clarity

### For Teams
1. Agree on 3-5 initial patterns
2. Document in README
3. Add to PR checklist
4. Gradually expand vocabulary

### For Open Source
1. Start with `:A: help-wanted`
2. Add `:A: good-first-issue`
3. Add `:A: breaking-change`
4. Document in CONTRIBUTING.md

## Tips for Success

1. **Don't force it**: If a comment doesn't need to be searchable, don't add `:A: `
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
    // :A: todo add validation
    chargeCard(amount);
}
```

### Week 3: Add context
```javascript
function processPayment(amount) {
    // :A: todo add validation
    // :A: ctx amount must be positive, max 10000
    chargeCard(amount);
}
```

### Week 4: Delegate to AI
```javascript
function processPayment(amount) {
    // :A: @agent add validation
    // :A: ctx amount must be positive, max 10000
    // :A: sec prevent negative charges
    chargeCard(amount);
}
```

### Week 5: Link to issue
```javascript
function processPayment(amount) {
    // :A: issue(PAY-456) add validation
    // :A: ctx amount must be positive, max 10000
    // :A: sec prevent negative charges
    chargeCard(amount);
}
```

## Keep It Simple

The goal is discoverability, not perfection. Even one `:A:` marker can help make your codebase more navigable. Start where you are, use what works, and let your patterns grow naturally with your needs. 