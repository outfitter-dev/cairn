# 🍇 Grep-Anchor (`:ga:`) Markers

> **grep** is a command-line utility for searching plain-text data sets for lines that match a regular expression. Its name comes from the ed command g/re/p (globally search a regular expression and print). [Learn more on Wikipedia](https://en.wikipedia.org/wiki/Grep).

> **grepa** /ɡrɛp·ə/ — a four-character tag (`:ga:`) you drop in comments so humans **and** AI agents can `grep` straight to the right spot.

---

## 1. The Problem

Even in well-structured repos it's painful to answer questions like:

* *Where is the security-critical code?*
* *What corners did we intentionally leave un-optimised for now?*
* *Which lines must a release engineer double-check before merging a hot-fix?*

Today we rely on ad-hoc **TODOs**, scattered issue links, or tribal knowledge. Those signals are:

| Pain-point               | Why it hurts                                    |
| ------------------------ | ----------------------------------------------- |
| ✏️ Free-form wording     | Agents can't pattern-match reliably.            |
| 🗺️ Buried in huge files | `grep "TODO"` returns hundreds of hits.         |
| 🌱 Quickly rot           | Comments stay after fixes, reviewers miss them. |

---

## 2. The Concept – `grep-anchor`

A **grep-anchor** is a tiny, predictable token that lives *only* inside comments:

```text
<comment-leader> :ga:payload
```

* **`:ga:`** = the fixed, four-byte sigil (extremely rare in prose or code).
* **payload**  = one or more *tokens* (see §4) that classify the line.

Because the pattern is unique, both shell scripts and LLM agents can jump directly to relevant code with a one-liner:

```bash
rg -n ":ga:"              # list every anchor
rg -n ":ga:sec"           # only security-related anchors
```

---

## 3. Quick Examples

| Intent                      | Anchor            | Comment example                                  |
| --------------------------- | ----------------- | ------------------------------------------------ |
| Security review needed      | `:ga:sec`         | `// :ga:sec validate signature length`           |
| Temporary hack              | `:ga:temp`        | `# :ga:temp remove once cache is fixed`          |
| Delegate to agent           | `:ga:@cursor`     | `/* :ga:@cursor please generate tests */`        |
| Conventional-commit tie-in  | `:ga:fix`         | `// :ga:fix align error codes (will close #123)` |
| Placeholder for future work | `:ga:placeholder` | `<!-- :ga:placeholder better SVG icon -->`       |

Need multiple tags? Separate them with commas or spaces:

```python
# :ga:perf,sec  optimise crypto loop
```

---

## 4. Minimal Grammar

```ebnf
anchor   ::= ":ga:" payload
payload  ::= token ( sep token )*
token    ::= bare | json | array
bare     ::= "@"? [A-Za-z0-9_.-]+
json     ::= "{" …balanced JSON… "}"
array    ::= "[" …comma list… "]"
sep      ::= "," | "|" | whitespace+
```

* **Bare tokens** simple strings: `sec`, `v0.2`, `@cursor`.
* **Arrays / JSON** attach richer metadata when needed:

  ```js
  // :ga:{"since":"v1.1","owner":"@security"}
  ```

---

## 5. Using grep-anchors

### Add an anchor

1. Choose the nearest comment above the code you're flagging.
2. Insert `:ga:` followed by one or more tokens.

### Search

```bash
# all anchors
rg -n ":ga:"  
# anchors that mention performance
rg -n "^.*:ga:.*\bperf\b" --type ts,js
```

### Clean-up workflow (CI)

* **Block** merges to `main` if `:ga:temp` is present.
* **Warn** when `:ga:v` is older than the current release tag (rot guard).

---

## 6. Future Directions

* VS Code / NeoVim extension for colour-highlighting `:ga:` lines.
* GitHub Action `grepa-lint` for automatic policy checks.
* Shared `grep-anchor.yml` dictionary at repo root to document project-specific tokens.

---

### Attribution

Inspired by OpenAI Codex agents' internal *grepable anchor* practice, adapted for general OSS use.