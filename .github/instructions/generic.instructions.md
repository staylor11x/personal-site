---
description: "General repository guidance for the personal site project. Applies to planning docs, app code, content, and repository automation files."
---

# Personal Site Repository Guidance

## Project priorities

- Build the site in phases and protect the MVP boundary.
- Prefer readable, maintainable implementation over novelty.
- Keep the retro-futuristic aesthetic intentional and restrained.
- Accessibility, performance, and mobile behavior are not optional polish tasks.

## Delivery rules

- Follow the staged plan in `docs/implementation-phases.md`.
- Respect the execution guidance in `.copilot-output.md` when sequencing work.
- Do not pull Phase 2 or later features into Phase 1 work unless the issue explicitly requires it.
- Treat the current repo state as evolving; do not assume the full app scaffold already exists.

## Engineering guidance

- Use Next.js with TypeScript, Tailwind CSS, and App Router conventions for application work.
- Keep shared design decisions centralized in theme tokens, layout primitives, and structured content where possible.
- Prefer server components by default and add client components only when interaction requires them.
- Keep motion subtle and respect reduced-motion preferences.
- Avoid heavyweight dependencies unless they materially improve delivery or maintainability.

## UX guidance

- The site should feel technical, atmospheric, and personal without collapsing into generic cyberpunk tropes.
- Readability beats visual effects.
- Mobile layouts and keyboard behavior must remain usable as features are added.

## Repo workflow

- Work from the active GitHub issue or milestone plan when one exists.
- Keep changes scoped to the issue being worked.
- Update documentation when a decision or workflow meaningfully changes.
- Do not invent repository scripts, templates, or conventions that do not exist unless the task explicitly includes creating them.
