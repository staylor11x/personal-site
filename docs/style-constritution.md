# DESIGN_CONSTITUTION.md

## Core Identity

This website is a retro-futurist personal terminal node — a HUD-style dashboard that presents its owner as an operator of a living system, not just a visitor to a portfolio.

It should feel:
- technical and operational
- cinematic and atmospheric
- industrial and precise
- alive — status indicators, live data, system-aware UI

The aesthetic direction is:
- **synthwave** — the primary reference; 1980s-imagined future, neon gradients, grid floors, sunset skies
- retro-futurism — technology as art, hardware-inspired layouts
- cyberpunk HUD — heads-up display panels, corner brackets, system labels
- 1980s concept art — bold geometry, high contrast, intentional drama

The website should feel like:
> a personal engineering terminal node — online, operational, and inhabited

NOT:
- a startup landing page
- a generic portfolio template
- a neon gimmick or hacker parody
- an over-animated frontend experiment

---

# Visual Philosophy

## Primary Principles

Prioritize:
1. atmosphere — every element contributes to the world
2. clarity — information must remain legible and purposeful
3. geometry — sharp, structured, architectural
4. intentionality — nothing decorative without reason
5. performance — the aesthetic must cost nothing in speed
6. consistency — the system speaks with one voice

Every visual element should feel:
- engineered and deliberate
- sharp and premium
- part of a coherent operating environment

Avoid playful, soft, or trend-driven styling.

---

# Shape Language

## Geometry Rules

Use:
- sharp edges (no oversized border-radius)
- HUD corner bracket accents on panels (`border-l border-t`, `border-r border-b` spans)
- angular, grid-based layouts
- segmented, divided containers with thin border separators
- asymmetric column grids where structurally appropriate

Inspiration:
- aircraft heads-up displays
- DeLorean body panels
- sci-fi control room interfaces
- industrial rack hardware
- retro arcade cabinets and CRT monitors

Avoid:
- oversized rounded corners
- circular blob or pill layouts
- soft floating cards
- bubbly buttons
- organic or decorative shapes

---

# Color System

## Exact Token Values

```
Background:       #080E17  (near-black deep navy)
Surface:          rgba(8, 14, 23, 0.85) with backdrop-blur
Border (subtle):  rgba(0, 240, 255, 0.12)

Accent Cyan:      #00F0FF  — primary data / system status
Accent Pink:      #FF2E8A  — identity / hero / hot-pink highlight
Accent Green:     #39FF14  — ONLINE states / success / system ready
Accent Magenta:   #C026D3  — secondary actions / gradient partner to pink
Accent Blue:      #1E3ABA  — deep accent / structural color

Foreground:       #E8EDF5  (off-white)
Foreground Muted: #8899AA  (cool gray)
```

## CSS Variable Names

```css
--color-background:      #080E17
--color-surface:         rgba(8,14,23,0.85)
--color-accent-cyan:     #00F0FF
--color-accent-magenta:  #FF2E8A
--color-accent-green:    #39FF14
--color-accent-blue:     #1E3ABA
--color-foreground:      #E8EDF5
--color-foreground-muted: #8899AA
--color-border-subtle:   rgba(0,240,255,0.12)
```

## Color Rules

Accent colors are used sparingly and purposefully:

| Accent  | Primary use                                   |
|---------|-----------------------------------------------|
| Cyan    | Panel borders, data labels, system info       |
| Pink    | Hero name, identity-level headlines           |
| Green   | ONLINE badges, success states, CTAs           |
| Magenta | Secondary buttons, gradient partner to pink   |
| Blue    | Structural depth, background gradients        |

Neon should:
- guide attention
- highlight status and interactions
- create subtle edge lighting on panels
- reinforce the synthwave atmosphere

Do NOT:
- saturate the full UI in neon
- use rainbow gradients
- use pastel palettes
- use washed-out blue-only themes
- use Spotify green or brand greens as a dominant accent

Dark surfaces dominate. Neon is the accent, not the base.

---

# Lighting

Use:
- `box-shadow` edge glow on panels and interactive elements
- `text-shadow` glow on accent-colored type where intentional
- subtle emissive borders (`rgba(0, 240, 255, 0.2)` border on hud-panels)
- scanline overlays in hero imagery
- neon reflection implied by background gradients

Glow should feel:
- electrical and controlled
- monitor-emitted, not torch-lit
- cinematic — used to create depth, not decoration

Avoid:
- excessive blur or `backdrop-filter` stacking
- foggy soft-focus gradients
- white or warm shadows
- glassmorphism overload (blur + white opacity everywhere)

---

# Typography

## Font Stack

| Role      | Font        | Variable           | Use                                   |
|-----------|-------------|---------------------|---------------------------------------|
| Heading   | **Orbitron** | `--font-heading`   | Hero name, section callouts           |
| Label     | **Rajdhani** | `--font-label`     | Nav items, button text, system labels |
| Monospace | **JetBrains Mono** | `--font-ui-mono` | Terminal, metadata, technical labels |
| Body      | **Geist**   | system fallback     | Long-form text, paragraph content     |

## Typography Rules

**Orbitron** — used for the primary identity heading (hero name) only. It is large, uppercase, black-weight, and gradient-colored. Do not use it for body or navigation.

**Rajdhani** — used for all navigation labels, button text, section panel headers, and uppercase technical UI. Apply `letter-spacing: 0.1em–0.18em` and `text-transform: uppercase`.

**JetBrains Mono** — used for terminal prompts, system status values, metadata fields, cursor animations, and any monospace label. Used in `technical-label` and `nav-label` utilities.

**Geist** — body text, paragraph copy, readable long-form content.

Typography hierarchy:
1. Orbitron hero name — massive, gradient, uppercase
2. Rajdhani section label — bold, wide-tracked, uppercase, accent-colored
3. JetBrains panel metadata — small, monospace, muted
4. Geist body copy — legible, clean, minimal

Avoid:
- using Orbitron anywhere except the hero identity panel
- handwritten or display fonts
- excessive font variation within a section
- wide tracking on body text

---

# HUD Panel System

## The `HudPanel` Component

All content sections are wrapped in `HudPanel` — the core UI primitive of the design system.

Structure:
```
┌─╴ corner brackets ╶─────────────────────────────┐
│  HudPanelHeader: "// LABEL"        RIGHT SLOT   │
├─────────────────────────────────────────────────┤
│  content area                                   │
└─────────────────────────────────────────────────┘
```

Corner brackets are `absolute`-positioned `<span>` elements with:
- top-left: `border-l border-t`
- top-right: `border-r border-t`
- bottom-left: `border-l border-b`
- bottom-right: `border-r border-b`

The `hud-panel` CSS utility:
- `background`: semi-transparent surface
- `border`: `1px solid rgba(0, 240, 255, 0.2)`
- `position: relative` — required for corner bracket absolute positioning
- `backdrop-filter: blur(12px)`
- subtle cyan `box-shadow` glow

`HudPanel` accepts an optional `accentColor` prop (`"cyan"` | `"pink"` | `"green"`) that tints the corner brackets and header accordingly. Default is cyan.

`HudPanelHeader` renders:
- left slot: monospace label prefixed with `//`
- right slot: optional status badge or info

---

# Navigation

## Identity Branding

The site nav reads:
```
SCOTT TAYLOR // PERSONAL NODE
```

- "SCOTT TAYLOR" in Orbitron, accent-pink gradient
- "// PERSONAL NODE" in Rajdhani, muted foreground

Navigation items are numbered with zero-padding:
```
01_HOME  02_ABOUT  03_WORK  04_WRITING  05_CONTACT  06_TERMINAL
```

Numbers use a muted accent color; underscores and labels are in Rajdhani uppercase.

Mobile: hamburger menu, same branding visible at all sizes.

---

# Status Bar

The site footer is a live `StatusBar` client component — not a traditional footer.

It renders:
- `NODE ONLINE` — persistent system status
- Live uptime since page load (`hh:mm:ss`)
- Live UTC clock
- Decorative `SYSTEM LOAD` and `MEMORY` fields
- `NODE ID: ST-[identifier]`

All values in JetBrains Mono, small, uppercase, muted foreground. A thin cyan `border-t` separates it from content.

The status bar reinforces the "living terminal" identity of the site. It is never decorative — it is always operational.

---

# Layout System

## Dashboard Grid

The homepage uses a stacked dashboard layout:
1. **Hero panel** — full-width, 3-column internal grid
2. **Three-column row** — About (flex) / Currently / Now Playing
3. **Travel panel** — full-width
4. **Terminal scaffold** — full-width
5. **Featured Work** — full-width

All sections use `HudPanel`. Spacing between panels: `gap-4` (16px).

## Spacing Rules

Layouts should:
- breathe — generous internal padding (p-5, p-6, sm:p-8)
- align strongly — grid-based column structure
- feel architectural — panels feel like hardware modules, not cards
- maintain visual rhythm — consistent `gap-4` between sections

Avoid:
- cramped layouts with insufficient padding
- oversized padding that wastes space on mobile
- excessive empty blur zones between sections

---

# Hero Panel

## Structure

The hero is a single `HudPanel` with `accentColor="pink"`, divided into three columns:

```
┌─────────────────────┬─────────────────┬──────────────┐
│  IDENTITY           │  SYNTHWAVE IMG  │  STATUS      │
│  name / role / CTAs │  (CSS scene or  │  ONLINE      │
│                     │  actual image)  │  LOCATION    │
│                     │                 │  LOCAL TIME  │
└─────────────────────┴─────────────────┴──────────────┘
```

**Left column** — Orbitron name in hot-pink gradient, Rajdhani role, body subheading, CTA buttons.

**Centre column** — `SynthwaveHeroImage`: a client component that renders a CSS synthwave scene (purple sky, gradient sun, perspective grid floor, scanlines). When `/public/images/hero-synthwave.jpg` exists, it overlays the CSS scene. Fallback is always the CSS scene.

**Right column** — vertical stack of `StatusField` rows: STATUS (green ONLINE badge), LOCATION, LOCAL TIME (live client clock). NODE ID at bottom.

---

# Content Panels

## Currently Panel

Displays three lists: LEARNING / LISTENING / BUILDING.
- Each list uses a cyan accent header in Rajdhani
- Items as monospace `>` prefixed lines
- `accentColor="green"` on its `HudPanel`

## Now Playing Panel

Displays the current/recent track from `content/now-playing.md`.
- Track name prominent, artist secondary
- Waveform bars animation (CSS keyframes)
- Spotify URL if available
- `accentColor="pink"` on its `HudPanel`
- When Spotify Live API is integrated later, this panel updates in real-time

## Travel Panel

Displays countries visited count and journey log from `content/travel.md`.
- Left: CSS globe placeholder (SVG arcs, glowing points)
- Right: journey log as `YEAR — DESTINATION` rows
- Globe is `position: relative` container required for absolute SVG

---

# Synthwave Hero Image

The synthwave image scene (CSS placeholder):
- Background gradient: dark purple (`#0a0520`) → deep purple → sunset horizon
- Grid floor: `perspective(200px) rotateX(40deg)` with pink grid lines
- Sun: radial gradient orange → pink with `box-shadow` glow
- Scanlines: `repeating-linear-gradient` overlay at 20% opacity

This scene is always rendered as the fallback. A real photograph or illustration at `/public/images/hero-synthwave.jpg` will overlay it when present.

---

# Terminal Design

The terminal is a core identity element — the most direct expression of the "personal node" concept.

It should feel:
- authentic and operational
- fast and responsive
- minimal — the content is the interface

Use:
- JetBrains Mono throughout
- `>` prompt prefix
- cursor blink animation (`cursor-blink` CSS utility)
- green-on-dark for active output
- cyan for system responses

Avoid:
- fake hacker spam or random characters
- excessive Matrix-style effects
- green-only terminal clichés
- simulated "hacking" tropes

---

# Backgrounds

The site background is:
- `#080E17` base
- Layered with a subtle radial gradient from dark blue-purple at center, fading to near-black at edges
- Optional: very faint `noise` texture or `repeating-linear-gradient` grid overlay at <5% opacity

Avoid:
- flat white sections
- bright or light backgrounds anywhere in the design
- heavy blur mesh gradients
- generic SaaS gradient washes

---

# Motion Design

Motion should feel:
- mechanical and system-driven
- intentional — every animation has a purpose
- subtle — the content moves, the atmosphere doesn't

Use:
- `accent-pulse` keyframe: gentle periodic box-shadow glow on panels
- `cursor-blink` keyframe: terminal cursor opacity cycle
- `scan-line` keyframe: optional top-to-bottom scan effect
- hover transitions: `transition-all` with 150–200ms duration
- subtle border-color / shadow shifts on hover

Avoid:
- bounce or spring animations
- floaty or elastic motion
- exaggerated scaling on hover
- entry animations that delay content visibility
- playful or whimsical interactions

Always respect `prefers-reduced-motion`. All decorative animations should be conditioned on `@media (prefers-reduced-motion: no-preference)`.

---

# Buttons and CTAs

Buttons should feel tactile and industrial:

**Primary CTA** (green): `border border-accent-green/60 bg-accent-green/5 text-accent-green` with hover glow `shadow-[0_0_12px_rgba(57,255,20,0.2)]`

**Secondary CTA** (magenta): `border border-accent-magenta/40 bg-accent-magenta/5 text-accent-magenta` with subtle hover intensification

All button text:
- Rajdhani font
- Uppercase
- `letter-spacing: 0.1em`
- `>` prefix (CLI convention)

Avoid:
- rounded pill buttons
- gradient-filled buttons
- oversized CTAs
- soft hover shadows

---

# Accessibility

Despite the aesthetic, the following are non-negotiable:
- Text contrast must meet WCAG AA against dark backgrounds
- All interactive elements must be keyboard-navigable
- Motion must be reducible via `prefers-reduced-motion`
- Mobile layouts must remain fully usable
- Screen reader labels must be present on all icon-only UI

Never sacrifice usability for atmosphere.

---

# Performance Rules

The aesthetic must not cost performance:
- Use CSS animations and keyframes over JavaScript animation libraries
- Use `backdrop-filter` sparingly (causes GPU paint)
- Avoid particle systems or WebGL unless explicitly required
- No heavy autoplay effects
- Images must be optimised; the CSS hero scene is the approved zero-cost fallback

Performance is part of the aesthetic. A slow site breaks the "precision engineering" identity.

---

# Forbidden Patterns

Never introduce:
- pastel-heavy or warm-toned UI
- oversized rounded cards or pill shapes
- startup SaaS or generic portfolio aesthetics
- glassmorphism overload (multiple stacked blur + white opacity layers)
- emoji-heavy or illustrative interfaces
- random neon that doesn't map to the token system
- generic cyberpunk clichés (green matrix rain, skull logos)
- cluttered or information-dense dashboards without visual hierarchy
- inconsistent spacing or competing grid systems
- multiple typeface personalities in one section
- Orbitron used outside the hero identity context

---

# Emotional Goal

Visitors should feel:
- **curiosity** — what does this person build?
- **atmosphere** — this feels like a place, not a page
- **technical confidence** — the operator knows what they're doing
- **individuality** — this is clearly one person's space, not a template

The website should feel like:
> a precision-engineered personal terminal — atmospheric, inhabited, and alive

NOT:
> a frontend trends showcase or a portfolio template with dark mode

---

# Final Rule

Every new feature, component, animation, or section must answer:

1. Does this strengthen the synthwave retro-futurist identity?
2. Does this feel engineered and intentional — not decorative for decoration's sake?
3. Is this visually consistent with the HUD panel system?
4. Does this use only the defined color token system?
5. Is the effect subtle enough to remain professional and readable?
6. Does this improve atmosphere without harming usability or performance?

If any answer is "no", redesign it.