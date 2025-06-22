<!-- tldr ::: version history and release notes for waymark tooling -->
# Waymark Tooling Changelog

All notable changes to waymark tooling will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive tooling documentation for v1.0
- Full v1.0 syntax support in parser
- Signal support (`!`, `!!`, `*`, `?`, `??`, `-`, `--`)
- Actor assignments (`@alice`)
- Anchor definitions and references (`##name`, `#name`)
- Relational tags (`#fixes:#123`, `#owner:@alice`)
- Streaming parser for large files
- Batch processing capabilities
- AST integration for JavaScript/TypeScript
- Comprehensive validation rules
- Auto-fix capabilities for common issues

### Changed
- **BREAKING**: Migrated from contexts to explicit markers
- **BREAKING**: Changed tag syntax from `+tag` to `#tag`
- **BREAKING**: Priority now uses signals instead of tags
- Improved error handling with Result pattern
- Enhanced search performance with caching
- Better TypeScript types for all APIs

### Deprecated
- Old context-based syntax
- `+tag` notation (use `#tag`)
- Priority tags (use signals instead)

## [0.5.0] - 2024-12-01

### Added
- ESLint plugin for waymark validation
- VS Code extension with syntax highlighting
- Pre-commit hook integration
- GitHub Actions workflow support

### Fixed
- Parser handling of multi-line comments
- Search performance for large codebases
- Memory usage in batch operations

## [0.4.0] - 2024-10-15

### Added
- CLI validate command
- Custom rule support in linter
- JSON and CSV output formats
- Configuration file support (`.waymarkrc.json`)

### Changed
- Improved error messages
- Better handling of edge cases
- Performance optimizations

## [0.3.0] - 2024-08-20

### Added
- Basic linter functionality
- Parser API for programmatic use
- Search with context lines
- Group by functionality

### Fixed
- Windows path handling
- Unicode support in waymarks

## [0.2.0] - 2024-06-10

### Added
- Search command with glob patterns
- List command with filtering
- Basic parsing functionality
- Terminal and JSON output

### Changed
- Improved CLI interface
- Better error handling

## [0.1.0] - 2024-04-01

### Added
- Initial release
- Basic waymark parsing
- Simple CLI tool
- Documentation

[Unreleased]: https://github.com/waymark/waymark/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/waymark/waymark/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/waymark/waymark/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/waymark/waymark/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/waymark/waymark/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/waymark/waymark/releases/tag/v0.1.0