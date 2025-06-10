# Grepa CLI – Roadmap

> **Status:** Draft (last updated 2025-05-28)

This roadmap tracks upcoming work for the **Grepa** tooling layer – the CLI, editor plug-ins and library packages that understand Magic Anchors.

## 0.1.0 – Foundations

- Rich query parser that understands marker/parameter grammar (single-line only).
- `grepa search` sub-command wrapping ripgrep with smart defaults.
- `grepa lint` for syntax validation and simple rule checking (comma spacing, missing space after `:A:`, etc.).
- VS Code extension MVP: gutter icons, hover cards, quick-filter panel.

## 0.2.0 – Relations & Visualisation

- Relationship graph builder (depends / blocked / related).
- `grepa map` renders interactive HTML or Graphviz outputs.
- Query language supports transitive dependency hops (`--from auth-service --to payment-api`).

## 0.3.0 – Configuration & Teams

- Full `grepaconfig.yaml` schema validation.
- Priority-scheme aliases and automatic normalisation.
- Lint rules configurable per repo.

## Later / Icebox

- Multi-line anchor support (speculative, gated behind flag).
- Persistent index daemon for instant queries in large monorepos.
- JetBrains / NeoVim plug-ins.
- Server mode for CI and pull-request bots.

---

Feedback & pull requests welcome!  Please open an issue and reference the milestone you’re interested in.
