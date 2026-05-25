# Issue Template

> This template defines the required structure for all agent-targeted issues
> in this repository. AI tools generating issues must follow this format exactly.
> Human-created issues should follow it where possible.
>
> Remove all HTML comments and guidance text before uploading to GitHub.

---

<!-- ================================================================
TITLE GUIDANCE
- Imperative mood: "Add terminal hero section" not "Terminal hero work"
- Specific and scoped: one clear deliverable per issue
- No phase prefix in the title — phase is captured in the body
================================================================ -->

## Context

<!-- Why is this work needed? What problem does it solve?
     Which phase does it belong to (see docs/implementation-phases.md)?
     What breaks or is missing without it? 2–4 sentences maximum. -->

**Phase:** <!-- e.g. Phase 1 — see docs/implementation-phases.md -->
**Agents:** <!-- Comma-separated list of agents for the Orchestrator to invoke. Options: Implementer, Documentation. E.g. "Implementer, Documentation" -->


---

## Acceptance criteria

<!-- Numbered list of testable conditions.
     Every criterion must be verifiable — if you cannot check it, rewrite it.
     The documentation criterion below is mandatory on every issue. -->

1.
2.
3.
- [ ] All documentation affected by this change has been identified and updated

---

## Files likely affected

<!-- List the files the agent is expected to create or modify.
     Be specific — this scopes the agent's search space.
     Use paths relative to the repo root (e.g. app/components/terminal.tsx). -->

```
```

## Files to not touch

<!-- List files the agent must not modify under any circumstances.
     Include files adjacent to the work that might tempt the agent. -->

```
```

---

## Constraints

<!-- Things the agent must not do, even if they seem helpful.
     Examples: "do not add new npm dependencies without noting them",
     "do not pull Phase 2 features into this issue",
     "do not change the Tailwind theme tokens" -->

---

## Definition of done

<!-- How will a human reviewer confirm this issue is complete?
     E.g. "npm run build passes with no errors",
     "page renders correctly on mobile at 375px",
     "lighthouse accessibility score ≥ 90".
     This is distinct from acceptance criteria — it is the verification step. -->