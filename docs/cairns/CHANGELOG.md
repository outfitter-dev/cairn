# Magic Anchors – Changelog

> [!INFO]
> The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and adheres to semantic versioning for the spec itself (independent of the grepa tooling version).

All notable changes to the Magic-Anchor language specification will be documented in this file.

## v0.1.1 – 2025-05-28

### Added

- Initial migration from `docs/notation/` to `docs/cairns/` directory
- Comprehensive delimiter semantics framework (`:` for classifications, `()` for parameters, `[]` for arrays)
- Universal parameter groups organized into 6 semantic families
- Canonical marker groups organized into 6 semantic categories
- Prose formatting guidelines with optional colon prefix and quotes
- Key decisions section in format specification
- Quoting rules for complex values and special characters
- Formal grammar with mandatory single space after identifier

### Changed

- Replaced all `:ga:` identifiers with the canonical `:A:` anchor
- Complete documentation update to new `:A:` syntax with mandatory single space
- Revised SPEC.md with comprehensive delimiter semantics and examples
- Updated all documentation examples to use new delimiter patterns
- Removed custom anchor recommendations - `:A:` is now the single canonical prefix
- Reorganized payloads.md to focus on delimiter semantics rather than payload types
- Removed legacy `rel()` wrapper in relational examples

### Removed

- Dot notation in structural names (reserved only for literals like versions, URLs, file paths)
- JSON/YAML syntax within anchors (key architectural decision)
- Regex/pattern matching as core feature
- Support for custom anchors in documentation
- References to optional space after identifier (now mandatory)

