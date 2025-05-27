# Clarify terminology: Sigil, Marker, Parameter; introduce parameterised markers

> Issue harvested from ongoing conversation about renaming "tag" → "marker" and formalising the inner identifier syntax.

## Problem

The current documentation uses **tag** and **marker** interchangeably and does not formally describe *parameterised markers* such as:

```text
:ga:gh(issue#4)
```

Without a consistent vocabulary, contributors (both human and AI) may mis-interpret the structure of a grep-anchor and tooling cannot reliably lint or search for the richer patterns.

## Proposal

### 1. Terminology

| Term | Definition | Example |
|------|------------|---------|
| **Sigil** | Literal sentinel that opens every grep-anchor. | `:ga:` |
| **Marker** | First token after the sigil that names the category. | `todo`, `sec`, `gh` |
| **Parameter** | Optional parenthesised payload tied to a single marker. | `issue#4` in `gh(issue#4)` |
| **Prose** | Free-form description that follows after the structured payload. | `fix flaky test` |
| **Anchor** | Complete structured part = sigil + marker (+ parameter). | `:ga:gh(issue#4)` |

### 2. Grammar update (EBNF-ish)

```ebnf
anchor      ::= comment-leader sigil payload prose?
sigil       ::= ':' identifier ':'
payload     ::= marker (parameter)?
marker      ::= identifier | '@'identifier
parameter   ::= '(' ~')'* ')'   ; optional, no newlines
prose       ::= .*              ; free text after a space
```

### 3. Delimiter decision

Prefer `#` instead of `/` inside parameters to avoid path-like ambiguity:

```text
:ga:gh(issue#4)   // good
:ga:gh(issue/4)   // avoid (reads like a filesystem path)
```

### 4. Docs to update

* `README.md` quick examples
* `docs/notation/format.md` – add **Parameter** definition
* `docs/notation/payloads.md`
* Replace occurrences of **tag** that actually mean **marker**

### 5. Open questions

1. Allow nested parameters or JSON inside `()` or keep flat?
2. Provide a linter rule to validate parameter syntax?

## Acceptance criteria

* Consistent vocabulary across all docs (sigil, marker, parameter, prose, anchor).
* At least one worked example added: `:ga:gh(issue#4) fix flaky test`.
* Format spec & examples updated accordingly.
