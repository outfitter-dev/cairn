---
version: 0.3
author: @galligan
---

# Prior Art: Why `:ga:` Might Feel Familiar

## The Lineage

If `:ga:` anchors feel instantly familiar, there's a good reason. Developers have embedded structured metadata in comments for decades, each iteration addressing new needs based on past experience. `:ga:` builds on these established patterns, offering a fresh approach adapted for modern polyglot codebases.

Here's a brief history of the patterns that `:ga:` builds upon:

### Historical Patterns

| Era / ecosystem / tool  | Pattern                                        | Purpose                                   | What `:ga:` borrows from                                  |
| ----------------------- | ---------------------------------------------- | ----------------------------------------- | --------------------------------------------------------- |
| **UNIX 1980s**          | `# TODO:`                                      | Human breadcrumb for future work          | Simple greppability (`grep TODO`)                         |
| **C family**            | `// FIXME`, `// XXX`, `// HACK`                | Flag questionable code or bugs            | Single-token severity tags                                |
| **Google / Chromium**   | `// TODO(user):`                               | Ownership metadata in the tag itself      | **Named tokens** (`@cursor` etc.)                         |
| **Xcode / Swift**       | `// MARK:`                                     | Editor jump bar & fold markers            | IDE integration via predictable prefix                    |
| **Go (1.17+)**          | `//go:build <expr>`                            | Build-constraint scanned *before* parsing | Comment parsed by tooling; lives only in source           |
| **Clang-Tidy**          | `// NOLINT(rule)`                              | Linter suppression                        | Machine-auditable anchors affecting CI                    |
| **ESLint / Flake8**     | `// eslint-disable-next-line` / `# noqa: E501` | Scoped rule ignore                        | Release-blocker policies on lingering suppressions        |
| **VS Code 2010s**       | `// region … endregion`                        | Code-folding & outline view               | Multi-line anchors recognized by editors                  |
| **Shopify smart_todo**  | `TODO(sc-12345)`                               | Tracking issue IDs                        | Validation via custom linter — proof teams codify anchors |

## Lessons from Proven Patterns

These historical patterns validate several key principles that `:ga:` inherits:

- **Fixed prefixes work**: Patterns like `//go:build` succeed because tools can parse them reliably. `:ga:` adopts this principle with a unique 4-byte sigil that's virtually collision-free.
- **Tooling follows convention**: IDEs, linters, and build systems readily parse comments when the pattern is stable. No AST parsing required—just grep and go.
- **Automation prevents rot**: Clang-Tidy and ESLint demonstrate that successful projects automate anchor hygiene. `grepa lint` continues this tradition with built-in policies for anchor lifecycle management.
- **Universal patterns last**: The most enduring patterns work everywhere comments do—source code, config files, SQL, documentation. Language-agnostic approaches have the longest shelf life.

## Real-World Validation

Teams already use anchor-like patterns successfully in production:

- **Shopify's smart_todo** links `TODO(sc-12345)` directly to tickets.
- **Kubernetes** uses `// TODO(username): description` for clear ownership.
- **Django** marks honest technical debt explicitly with `# XXX: This is a hack`.

These aren't academic exercises—they're battle-tested patterns that ship in real-world codebases.

## How `:ga:` Unifies and Extends

`:ga:` is evolutionary, inspired by proven patterns and refreshed for modern tooling and use cases:

- **Language universality**: Unlike JSDoc (documentation-focused) or language annotations (compiler-focused), `:ga:` works identically across polyglot repositories containing Python, JavaScript, Rust, Go, and more—no language-specific parsers required.
- **Zero friction adoption**: Being "just comments," anchors don't alter the Abstract Syntax Tree (AST), compiled output, or runtime behavior. Teams can adopt them incrementally without breaking existing workflows.
- **General-purpose tooling**: `:ga:` anchors treat the codebase as a queryable database, enabling advanced navigation, automated refactoring, and deep project management integration that goes far beyond traditional TODO lists.

Basically, `:ga:` anchors offer a fresh, practical refinement of established practices, distilled into a portable, OSS-friendly specification.

## Contributing Examples

Found an interesting anchor pattern in the wild? We'd love to hear about it! Open a PR and add it here. The more we understand what teams actually use, the better `:ga:` becomes at honoring and extending these traditions.
