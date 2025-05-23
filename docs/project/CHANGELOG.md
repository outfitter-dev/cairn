# Grepa Documentation Changelog

## 2025-05-23

### CLI Ergonomics Overhaul
- Updated command model to verb-first interface with implicit `find` as default
  - Primary verbs: `find`, `list`, `report` (alias `stats`), `lint`, `format`, `watch`
  - `find` is now the implicit default command when no verb is specified
  - Added `format` command for anchor rewriting (replacing `convert`)
  - `stats` is now an alias for `report` to align with modern CLI conventions

### Flag Scoping Rules Implementation  
- Introduced clear distinction between global and local flags
  - Global flags must appear BEFORE the verb
  - Local flags appear AFTER the verb
  - Grammar: `grepa [<GLOBAL FLAGS>] <verb> [<LOCAL FLAGS>]`
- Defined global flag set: `--json`, `--pretty`, `--context`, `--files`, `--literal`/`--no-aliases`, `--not`
- Updated all examples to demonstrate correct flag placement

### Enhanced Value Filters and Search Patterns
- Added comprehensive value filter syntax
  - Basic matching: `token=*`, `token=value`, `token!=value`, `*=value`
  - Advanced matching: `token~=value` (array membership), `token~/regex/` (regex)
  - JSON queries: `{field}=value`, `token={*}`, `*={*}`
- Documented multiple negation forms
  - Bang prefix: `grepa sec '!fix'` (must be quoted)
  - Value inequality: `token!=value`
  - Verbose flag: `--not pattern`
- Clarified pattern logic rules
  - AND: spaces or commas (default)
  - OR: pipe `|` or `--any` flag
  - Grouping with parentheses, precedence: AND > OR

### Interactive Help System
- Added new help and discoverability commands
  - `grepa --help`: Non-interactive command-line help
  - `grepa help`: Interactive TUI help
  - `grepa help tips`: Random pro-tips
  - `grepa learn`: Guided tutorial
  - `grepa help llms`: 10-line LLM primer

### Documentation Structure Updates
- Reorganized CLI documentation in docs/README.md with clearer sections
- Added dedicated "Value Filters and Search Patterns" section to syntax.md
- Updated all example commands in examples.md to use new syntax
- Maintained backwards compatibility notes where applicable

### Flag Scoping Corrections
- Corrected flag placement based on authoritative reference
  - `--ci` is now correctly shown as local to `lint` (not global)
  - `--yes` is local to `format` (not global)
  - `--any` is local to `find` (not global)
  - `--notify` is local to `watch` (not global)
  - `--interactive` replaces `--fzf`/`--open` as local to `find`
- Added comprehensive flag-placement reference table
  - Clear distinction between global flags (before verb) and local flags (after verb)
  - Listed all global flags: `-C`, `-l`, `-j`, `-p`, `-q`, `--literal`, `--raw`, `-v`, `--exit-code`
  - Documented verb-specific local flags for each command
  - Emphasized that no flags exist in "both" scopes

### Consistency Improvements
- Standardized terminology: "token-associated values" instead of "value associations"
- Emphasized that `:ga:` is just a searchable pattern; parser conventions are suggestions
- Updated EBNF grammar to support both comma and semicolon separators
- Aligned all code examples with new command structure and flag placement rules
- Changed `--no-aliases` to `--literal` for consistency