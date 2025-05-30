## Problem
Current docs use "tag" vs "marker" inconsistently and do not formally describe parameterised markers like `:ga:gh(issue#4)`.

## Proposal
1. **Terminology**
   - **Sigil**: literal sentinel (`:ga:` or custom `:proj:`)
   - **Marker**: first token after sigil that names the category (e.g., `todo`, `sec`, `gh`)
   - **Parameter**: optional parenthesised payload tied to that marker (e.g., `issue#4`)
   - **Prose**: free-form description that follows after the structured payload
   - **Anchor**: complete structured part = sigil + marker (+ parameter)

2. **Grammar Update (EBNF-ish)**
```ebnf
anchor      ::= comment-leader sigil payload prose?
sigil       ::= ':' identifier ':'
payload     ::= marker (parameter)?
marker      ::= identifier | '@'identifier
parameter   ::= '(' [^)]* ')'   ; optional
prose       ::= .*              ; free text after a space
```

3. **Delimiter decision**
Prefer `#` instead of `/` inside parameters to avoid path-like ambiguity:
```
:ga:gh(issue#4)
```

4. **Docs to update**
- README quick examples
- docs/notation/format.md (define *parameter*)
- docs/notation/payloads.md
- Replace "tag" with "marker" where appropriate

5. **Open questions**
- Allow nested parameters / JSON inside `()` or keep flat?
- Provide a lint rule to validate parameter syntax?

## Acceptance Criteria
- Vocabulary is consistent across docs (sigil, marker, parameter, prose, anchor).
- At least one worked example added (`:ga:gh(issue#4) fix flaky test`).
- Format spec & examples updated.

---
Spawning this issue from ongoing discussion about terminology & parameterised markers.
