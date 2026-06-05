> **Version:** 2.0
> **Status:** Living document — updated as implementation decisions are made
> **Related:** [Implementation phases](implementation-phases.md) | [Style guide](style-guide.md) | [Architecture](architecture.md)

# Travel globe implementation plan

## Objective

Replace the static SVG `GlobePlaceholder` in the travel panel with an interactive 3D globe using `react-globe.gl`. The globe is a progressively enhanced experience — the panel must still communicate travel context without the 3D layer. Implementation is iterative; visual decisions will be adjusted as the feature is built.

## Why react-globe.gl

The initial custom Three.js / R3F implementation produced a black sphere with no usable output. `react-globe.gl` is a higher-level library that handles globe rendering, sphere texturing, atmosphere, point layers, and orbit controls internally. It has its own bundled Three.js, which removes the need for the separately installed `three`, `@react-three/fiber`, and `@react-three/drei` packages.

---

## Dependency changes

| Action | Package |
|---|---|
| Install | `react-globe.gl` |
| Remove | `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` |

```bash
npm install react-globe.gl
npm uninstall three @react-three/fiber @react-three/drei @types/three
```

---

## Scope

### Included

- 3D globe via `react-globe.gl` (React component, no manual Three.js wiring)
- Subtle dark topography/elevation texture on the sphere surface
- Atmosphere glow around the sphere edge
- Glowing journey pins at each `lat`/`lng` position from `content/travel.md`
- Drag to rotate (mouse + touch)
- Click a pin → highlight the matching row in the journey log; clicking a different pin shifts the highlight; clicking an already-active pin deselects
- Auto-rotate on load until first user drag interaction, then stop
- Initial camera orientation centered on Europe / UK
- Panel layout redesigned to give the globe more visual weight
- Lazy-loaded with `dynamic(..., { ssr: false })` — existing SVG placeholder shown during hydration
- Mobile: fully interactive (touch-rotate and tap-to-highlight)
- `prefers-reduced-motion`: globe still renders but all animation frozen (no auto-rotation)
- Transparent canvas background — site dark background shows through

### Excluded

- Tooltips / floating labels on pins
- Arcs or lines connecting journey pins
- Pulsing rings around markers
- Click-to-fly-to camera animation
- Country polygon/hex outline layer
- Autocomplete, deep-linking, or URL state for active journey

---

## Data

All travel data is already structured and complete. No content or library changes are needed before building.

| Source | What it provides |
|---|---|
| `content/travel.md` | `countriesVisited`, `journeys[]` with `year`, `destination`, `lat`, `lng` |
| `lib/content.ts` | `TravelContent` and `Journey` types; `getTravelContent()` getter |
| `app/page.tsx` | Passes `content={travel}` to `<TravelPanel>` — interface unchanged |

---

## Visual spec

| Element | Treatment |
|---|---|
| Sphere texture | Dark topography/elevation map — source a suitable public-domain image and place at `public/images/globe-surface.jpg` |
| Atmosphere | Enabled — default `react-globe.gl` atmosphere with cyan tint `#00f0ff` to match accent palette |
| Canvas background | Transparent (`backgroundColor="rgba(0,0,0,0)"`) |
| Journey pins | `react-globe.gl` points layer; color `#00f0ff` (cyan); small radius |
| Active pin | Color `#ff2e8a` (magenta) when its log row is selected |
| Auto-rotate speed | Slow — `0.5` deg/frame or equivalent |

### Texture sourcing

A suitable dark topography image needs to be sourced and committed at `public/images/globe-surface.jpg`. Candidates:
- NASA Visible Earth "Blue Marble" night image (public domain): dark with minimal land detail
- NASA elevation/topography image desaturated to near-black

The texture should be dark enough that the cyan pins and atmosphere dominate visually. Adjust brightness/contrast in an image editor before committing if needed.

---

## Component design

### New file: `app/components/globe-3d.tsx`

`"use client"` component. Receives:

```ts
interface Globe3DProps {
  journeys: Journey[];
  activeIndex: number | null;
  onMarkerClick: (index: number) => void;
  reducedMotion: boolean;
}
```

Internally:
- Renders `<Globe>` from `react-globe.gl`
- `globeImageUrl="/images/globe-surface.jpg"` for the dark topography texture
- `backgroundColor="rgba(0,0,0,0)"` for transparent canvas
- `atmosphereColor="#00f0ff"` with low `atmosphereAltitude`
- `pointsData={journeys}` with `pointLat`, `pointLng`, `pointColor` (cyan default, magenta when active), `pointRadius`
- `onPointClick` callback maps the clicked point back to its index in the `journeys` array and calls `onMarkerClick`
- `onPointRightClick` / `onBackgroundClick` → deselect (set active to null)
- `autoRotate` and `autoRotateSpeed` props for orbit controls; `autoRotate={!reducedMotion}`; stops on first user interaction via `onZoom`/`onRotate` event
- Initial camera position set to face Europe/UK: `{ lat: 52, lng: -5, altitude: 2 }`
- `width` and `height` driven by a `ResizeObserver` on the container div so the canvas fills its parent

### Updated file: `app/components/travel-panel.tsx`

Becomes a `"use client"` component. Changes:

- `useState<number | null>(null)` for `activeIndex`
- `useEffect` + `window.matchMedia('(prefers-reduced-motion: reduce)')` to detect preference; passed as prop to `Globe3D`
- `dynamic(() => import('./globe-3d'), { ssr: false, loading: () => <GlobePlaceholder /> })` — SVG placeholder remains the loading and no-JS fallback
- Panel layout redesigned: stacked on mobile (globe on top, log below), `lg:grid-cols-[3fr_2fr]` on desktop
- Globe container: explicit height on mobile (`h-64`), full height on desktop
- Journey log: active row gets `text-accent-cyan` + `bg-accent-cyan/5` + left-border accent; clicking a log row also sets `activeIndex` (bidirectional with globe)
- Countries count badge repositioned to overlay the bottom of the globe or sit below it

---

## Files affected

```
app/components/globe-3d.tsx       NEW — react-globe.gl wrapper
app/components/travel-panel.tsx   MODIFIED — "use client", dynamic import, new layout, activeIndex state
public/images/globe-surface.jpg   NEW — dark topography texture (sourced manually)
package.json                      MODIFIED — react-globe.gl added; three/R3F/Drei removed
```

No changes to: `lib/content.ts`, `content/travel.md`, `app/page.tsx`

---

## Iteration approach

This feature is built iteratively. After each implementation pass:

1. Run `npm run dev` and inspect visually in the browser
2. Note what looks or feels off (pin size, atmosphere intensity, panel proportions, rotation speed, texture brightness, etc.)
3. Adjust and re-inspect before considering it complete

TypeScript/build validation at each iteration:

```bash
npm run build
```

A clean build is the exit criterion for each iteration, not just the final one.

---

## Exit criteria

- [ ] `react-globe.gl` installed; `three`/R3F/Drei removed; `npm run build` is clean
- [ ] Dark topography texture sourced and committed at `public/images/globe-surface.jpg`
- [ ] 3D globe renders in the travel panel on desktop and mobile
- [ ] Atmosphere glow visible with cyan tint
- [ ] All 7 journey pins are placed correctly on the globe
- [ ] Dragging rotates the globe; touch works on mobile
- [ ] Clicking a pin highlights the matching row in the journey log
- [ ] Clicking the same pin or a new one updates the highlight correctly
- [ ] Globe auto-rotates on load and stops after first drag
- [ ] Initial camera faces Europe / UK
- [ ] `prefers-reduced-motion: reduce` → globe is frozen (no rotation)
- [ ] SVG placeholder is shown during lazy load / hydration
- [ ] No regressions on other homepage sections
