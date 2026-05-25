# Accessibility and Responsive Baseline

Checklist established at end of Phase 1. Each phase should revalidate relevant items before
shipping new surfaces.

---

## Keyboard navigation

- [ ] Skip-to-content link is the first focusable element and moves focus to `#main-content`
- [ ] All interactive elements are reachable by Tab in a logical document order
- [ ] Focus order matches visual reading order at all checked breakpoints
- [ ] No focus traps exist outside intentional modal/overlay patterns
- [ ] Navigation links activate on Enter

## Focus indicators

- [ ] `:focus-visible` outline is visible against all surface backgrounds
- [ ] Focus indicators are visible in Windows High Contrast / forced-colors mode
- [ ] Focus ring meets 3:1 contrast ratio against adjacent colors (WCAG 2.1 SC 1.4.11)

## Semantic structure and landmarks

- [ ] Page has exactly one `<main>` landmark
- [ ] `<header>`, `<main>`, `<footer>`, and `<nav>` landmarks are present and correctly nested
- [ ] Primary nav has `aria-label="Primary"` to distinguish from other nav landmarks
- [ ] Every `<section>` landmark has an accessible name via `aria-labelledby` or `aria-label`
- [ ] Heading hierarchy is sequential (h1 → h2 → h3) with no skipped levels
- [ ] Decorative eyebrow/label text is not marked as a heading

## Color contrast

Checked against WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text and UI components).

| Token | Value | On background | Ratio | Pass |
|---|---|---|---|---|
| `foreground` | `#edf4ff` | `#060816` | ~17.5:1 | ✅ AA, AAA |
| `foreground-muted` | `#9fb0cb` | `#060816` | ~9.7:1 | ✅ AA, AAA |
| `accent-cyan` | `#67e8f9` | `#060816` | ~13.5:1 | ✅ AA, AAA |
| `accent-magenta` | `#f472b6` | `#060816` | ~6.1:1 | ✅ AA |
| `foreground-muted` | `#9fb0cb` | `#0b1225` | ~7.8:1 | ✅ AA, AAA |

No contrast failures identified in Phase 1 base theme. Note: verify contrast for any new
surface/color combinations added in later phases, especially semi-transparent overlays.

## Touch targets

- [ ] All interactive elements meet 44×44px minimum touch target (WCAG 2.5.5)
- [ ] Nav links use `min-h-10` (40px) — meets WCAG 2.5.5 Level AA with `min-h-11` preferred;
  flag for Phase 4 polish
- [ ] No interactive elements overlap or are too close together on mobile

## Responsive layout

Validated at: 375px (mobile), 768px (tablet), 1280px (desktop).

- [ ] No horizontal overflow at any tested breakpoint
- [ ] Navigation wraps correctly on small viewports
- [ ] Section grids reflow to single column at mobile breakpoints
- [ ] Sticky header clears content correctly (`scroll-mt-28` on section anchors)
- [ ] Footer layout switches between column and row correctly at `sm` breakpoint

## Reduced motion

- [ ] `@media (prefers-reduced-motion: reduce)` suppresses all animations and transitions
- [ ] `body::before` ambient drift animation is suppressed under reduced motion
- [ ] `accent-pulse` animation on hero eyebrow is suppressed under reduced motion
- [ ] `scroll-behavior: auto` is set for reduced-motion users

## Screen reader

- [ ] Page `<title>` is descriptive
- [ ] `<html lang="en">` is set
- [ ] Images (when added) have meaningful alt text or `alt=""`  for decorative images
- [ ] Interactive components announce their state (expanded, selected, etc.) when applicable

---

## Known callouts as of Phase 1

- Nav link touch targets are `min-h-10` (40px); WCAG 2.5.5 prefers 44px. Acceptable at
  Phase 1 — revisit during Phase 4 polish.
- Contact links are placeholders with no `href` targets. They will need proper link markup,
  focus behavior, and labels in Phase 2/4 when real links are wired.
- Terminal surface (Phase 3) will require additional focus management review for keyboard
  input handling.
