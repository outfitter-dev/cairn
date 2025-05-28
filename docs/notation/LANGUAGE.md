<!-- :ga:tldr language guide for writing about grepa notation -->
# Notation Language Guide

Guidelines for writing documentation about the grepa notation system.

## Core Principles

The grepa notation is a set of patterns and conventions, not an active system. Language should reflect this passive nature while remaining opinionated about best practices.

## Recommended Language

### What the Notation Does

**Use:**
- "accommodates" - The notation accommodates different delimiter styles
- "allows" - The notation allows both `:ga:priority:high` and `:ga:priority(high)`
- "recognizes" - The notation recognizes parameterized markers
- "accepts" - Both forms are accepted in the notation
- "permits" - The notation permits flexible delimiter usage
- "recommends" - The notation recommends using scope for ambiguous contexts
- "enables" - This pattern enables clear relationship mapping (use for outcomes/use cases)

**Avoid:**
- "supports" - implies active system behavior
- "enforces" - notation doesn't enforce, tools do
- "requires" - notation is flexible, tools have requirements
- "validates" - tools validate, notation defines patterns

### Describing Flexibility vs Opinion

**Flexibility:**
> "The notation accommodates team preferences while recommending consistency within projects."

**Opinion with alternatives:**
> "The notation recommends `:ga:config:env(prod)` for clarity, though `:ga:config(redis)` is also valid when context is unambiguous."

**Tool relationship:**
> "While the notation allows both styles, specific tools may enforce one approach - see toolset documentation for implementation details."

## Structure Guidelines

### Recommendations vs Rules

**Recommendations** (opinionated but non-prescriptive):
- Use "recommends" or "suggests"
- Provide rationale: "for clarity", "to avoid ambiguity"
- Acknowledge alternatives exist

**Patterns** (descriptive):
- Use "accommodates" or "recognizes"
- Describe what's possible, not what's required

### Examples Format

**Good notation example:**
> The notation recommends scope markers for ambiguous contexts:
> - `:ga:config:env(prod)` - clear environmental configuration
> - `:ga:config:database(postgres)` - clear database configuration
> 
> This pattern enables tools to provide better validation and teams to maintain consistency, though simpler forms like `:ga:config(redis)` remain valid when context is clear.

**Tool reference:**
> Tools may implement stricter parsing rules based on these patterns. See [toolset language guide](../toolset/LANGUAGE.md) for enforcement-focused documentation.

## Cross-References

- Reference toolset documentation for enforcement and validation
- Link to specification for canonical patterns
- Distinguish between notation flexibility and tool implementations

## Anti-Patterns

**Don't write:**
> "The notation supports multiple delimiter styles and enforces consistency."

**Do write:**
> "The notation accommodates multiple delimiter styles and recommends consistency within projects."