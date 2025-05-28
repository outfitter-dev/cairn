<!-- :ga:tldr language guide for writing about grepa toolset -->
# Toolset Language Guide

Guidelines for writing documentation about grepa tools, CLIs, parsers, and implementations.

## Core Principles

Tools are opinionated implementations that make specific choices about syntax enforcement, validation, and behavior. Language should be prescriptive and definitive about tool capabilities and requirements.

## Recommended Language

### What Tools Do

**Use:**
- "requires" - The CLI requires scope markers for config types
- "enforces" - The linter enforces consistent delimiter usage
- "validates" - The parser validates parameter syntax
- "supports" - The tool supports semver notation styles
- "implements" - The CLI implements strict anchor parsing
- "parses" - The tool parses multi-line anchor blocks
- "generates" - The tool generates relationship graphs

**Avoid:**
- "accommodates" - tools are opinionated, not accommodating
- "allows" - tools have specific rules, not flexible permissions
- "recommends" - tools enforce, they don't just recommend

### Describing Tool Behavior

**Enforcement:**
> "The linter enforces the `:ga:priority(high)` syntax and rejects `:ga:priority:high` forms."

**Configuration:**
> "The CLI supports multiple notation styles through the `--delimiter-style` flag. Default behavior requires parenthetical parameters."

**Validation:**
> "The parser validates that relational markers include proper targets and generates errors for malformed syntax."

**Tool capabilities:**
> "The tool implements bidirectional relationship discovery and supports semantic search across marker types."

## Structure Guidelines

### Rules vs Configuration

**Rules** (non-negotiable):
- Use "requires", "enforces", "validates"
- Be definitive about behavior
- Specify error conditions

**Configuration** (user-controllable):
- Use "supports", "enables", "allows" (in tool context)
- Document available options
- Explain default behavior

### Error Messages

**Be specific:**
> "Error: Missing scope in config marker. Use `:ga:config:env(prod)` instead of `:ga:config(prod)`."

**Reference notation:**
> "The notation accommodates both styles, but this tool enforces scoped parameters for config markers."

### Examples Format

**Tool requirement example:**
> The CLI requires explicit scope markers for ambiguous contexts:
> ```bash
> # Valid
> grepa validate ":ga:config:env(prod)"
> 
> # Error: Missing scope
> grepa validate ":ga:config(redis)"
> ```
> 
> This enforcement ensures consistent parsing, though the underlying notation accommodates both forms. See [notation language guide](../magic-anchors/LANGUAGE.md) for pattern flexibility.

## Cross-References

- Reference notation documentation for underlying patterns
- Link to tool-specific configuration options
- Distinguish between tool limitations and notation capabilities

## Anti-Patterns

**Don't write:**
> "The tool accommodates different styles and recommends consistency."

**Do write:**
> "The tool enforces the `:ga:priority(high)` style and requires consistent delimiter usage throughout the project."

**Don't write:**
> "The notation requires scope markers for config types."

**Do write:**
> "This tool requires scope markers for config types, though the notation permits both scoped and unscoped forms."