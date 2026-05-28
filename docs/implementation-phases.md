> **Version:** 1.0
> **Status:** Living document — updated when phase scope or delivery order changes
> **Related:** [Architecture](architecture.md) | [Issue template](templates/issue-template.md)

# Personal Site implementation phases

## Objective

Ship a strong first version quickly, then layer on the high-complexity interactive work without blocking launch.

The principle for this project is:

**identity first, interactivity second, experiments third**

That means the MVP should establish the tone, design system, narrative, and one standout interactive element before adding 3D, APIs, or a backend.

---

## Delivery Strategy

### MVP boundary

The MVP includes:

- Next.js app scaffold and deployment pipeline
- visual system and global styling
- landing hero
- about section
- interactive terminal with a fixed command set
- featured work or skills surface
- footer/contact links
- SEO, accessibility, and responsive polish

The MVP excludes:

- travel globe
- Spotify integration
- blog/logs system
- setup/environment page
- standalone C++ backend
- shader-heavy or 3D-first visuals

---

## Phase 0: Planning And Content Inputs

### Goal

Convert the project seed into buildable scope, content inputs, and implementation priorities.

### What needs to happen

- confirm the MVP boundary
- decide on deployment target: Vercel or Cloudflare Pages
- define the homepage information architecture
- identify initial content sources for hero, about, terminal responses, and featured work
- decide whether MVP uses a dedicated projects section, a skills section, or a hybrid
- define the initial command list for the terminal

### Outputs

- implementation roadmap document
- Phase 1 issue backlog
- initial content checklist

### Exit criteria

- the MVP scope is explicitly agreed
- the first build phases are sequenced
- Phase 1 can be worked in parallel by agents

---

## Phase 1: Foundation And MVP Shell

### Goal

Create the frontend foundation and ship-ready shell for the first release.

### What needs to happen

#### 1. Bootstrap the application

- initialize a Next.js app with TypeScript and Tailwind CSS
- set up the app router structure
- establish linting, formatting, and environment variable conventions
- add a clean base layout and metadata scaffold

#### 2. Establish the design system

- define CSS variables and Tailwind theme tokens
- set the primary palette: deep navy, muted purple, neon cyan, magenta, off-white, muted gray
- add typography pairings for body and monospace surfaces
- create reusable spacing, surface, border, and glow rules
- add reduced-motion-friendly animation primitives

#### 3. Build the site shell

- implement root layout
- implement navigation/header
- implement footer/contact bar
- create shared UI primitives for cards, section wrappers, and inline labels
- wire metadata, Open Graph basics, and favicon placeholders

#### 4. Compose the homepage skeleton

- assemble the homepage from section components
- create section anchors for hero, about, terminal, and featured work
- add mobile-first responsive layout behavior
- ensure the homepage reads clearly before advanced visuals are added

#### 5. Ship-readiness baseline

- ensure the app builds cleanly in production mode
- set accessibility baseline for keyboard navigation and semantic landmarks
- validate responsive behavior on mobile and desktop breakpoints
- prepare deployment target configuration

### Outputs

- running Next.js application
- global theme and layout system
- homepage shell ready for content sections
- deployable baseline on a preview environment

### Dependencies

- depends on Phase 0 decisions only
- blocks all downstream implementation work

### Exit criteria

- local build and production build succeed
- root layout and section structure are in place
- the design system is stable enough to build sections against
- Lighthouse baseline is acceptable before adding feature sections

---

## Phase 2: Core Narrative Surfaces

### Goal

Build the content surfaces that make the site feel personal and intentional.

### What needs to happen

#### 1. Landing hero

- add name, role, and short identity statement
- create a distinctive but restrained retro-futuristic visual treatment
- implement subtle motion for atmosphere without heavy runtime cost
- ensure the hero still works with reduced motion enabled

#### 2. About section

- write concise, human, non-corporate copy
- cover engineering, travel, music, creativity, and technical curiosity
- keep the layout scannable on mobile

#### 3. Featured work or skills section

- define a small structured content source for featured items
- present 3 to 5 representative pieces of work or capability clusters
- avoid a generic card wall by keeping the copy tight and purposeful

### Outputs

- a homepage that tells the story even if the terminal is disabled
- structured local content for featured work or skills

### Dependencies

- depends on Phase 1 shell and theme

### Exit criteria

- the site communicates who you are without relying on future features
- the layout is balanced across desktop and mobile

---

## Phase 3: Terminal MVP

### Goal

Build the differentiator that makes the site feel like a personal operating system.

### What needs to happen

#### 1. Terminal UI

- create the terminal container and prompt UI
- style it with modern shell cues rather than novelty effects
- make the input interaction reliable on mobile devices

#### 2. Command system

- create a central command registry
- support a fixed set of simple commands such as `help`, `whoami`, `skills`, `stack`, `now`, `travel`, `music`, `github`, and `contact`
- keep parsing intentionally simple for v1
- return deterministic output with no backend dependency

#### 3. Usability and accessibility

- preserve focus handling and keyboard support
- support clear empty, error, and unknown-command states
- keep output readable with long responses

### Explicitly deferred

- autocomplete
- persistent history
- fake filesystem depth
- hidden command chains
- remote command execution

### Outputs

- one standout interactive element that works in production without external services

### Dependencies

- depends on Phase 1 foundation and should be styled against the established theme

### Exit criteria

- the terminal works on desktop and mobile
- all MVP commands are tested manually
- the terminal improves the site instead of dominating it

---

## Phase 4: MVP Polish And Launch

### Goal

Move from a working site to a credible public release.

### What needs to happen

- review spacing, contrast, and readability across sections
- optimize animation cost and bundle size
- verify metadata and social preview behavior
- add production-grade contact links
- run Lighthouse and fix the biggest performance and accessibility issues
- deploy to the chosen platform
- connect the domain when the production build is stable

### Outputs

- first public release

### Exit criteria

- production build is clean
- no major mobile layout defects remain
- metadata and links are correct
- performance and accessibility are in a good baseline range

---

## Phase 5: Integrations And Visual Depth

### Goal

Add richer interactivity once the core experience is already live.

### What needs to happen

#### Spotify integration

- add a server-side or route-handler-based integration for currently playing or recent listening data
- design a compact music surface that complements rather than dominates the homepage
- provide fallback states for auth errors, rate limits, and no active track

#### Travel globe

- define a travel data model before building visuals
- add the globe as a progressively enhanced experience
- lazy load all 3D dependencies
- provide a non-3D fallback or static travel summary for weaker devices

#### Terminal enhancements

- add history
- add autocomplete if the MVP terminal proves worth expanding
- add small easter eggs only if they do not weaken clarity

### Dependencies

- should begin only after MVP performance and structure are stable

### Exit criteria

- integrations do not destabilize the main experience
- 3D features do not become a hard dependency for understanding the site

---

## Phase 6: Content Layer And Experiments

### Goal

Turn the site from a polished portfolio into an evolving personal platform.

### What needs to happen

- add blog or logs using a maintainable content workflow such as MDX
- add the setup/environment page
- add optional gallery or photography surfaces if they have a clear editorial purpose
- introduce analytics or live-status features only when there is a concrete use case

### Exit criteria

- the site can evolve without restructuring the core architecture
- new content can be added quickly without rewriting layout code

---

## Phase 7: Optional Backend Expansion

### Goal

Introduce backend infrastructure only when a real feature needs it.

### What needs to happen

- identify which feature justifies a separate service
- evaluate whether Next.js route handlers are sufficient first
- only introduce a standalone C++ service if performance, protocol, or experimentation goals clearly require it

### Candidate reasons for a backend

- Spotify token refresh proxying
- realtime status or websocket features
- travel/media APIs
- experimental command processing

### Exit criteria

- the backend solves a real problem rather than existing for its own sake

---

## Recommended Phase 1 Issue Breakdown

Phase 1 should be split into parallelizable issues so coding agents can pick them up independently:

1. bootstrap the Next.js project and base tooling
2. implement global theme tokens, typography, and base styling
3. build the root layout, header, footer, and homepage section shell
4. wire metadata, SEO basics, and deployment scaffolding
5. establish accessibility and responsive baseline checks

These issues should stay focused on the shared foundation only. Feature sections such as hero content, terminal logic, and Spotify should remain outside the Phase 1 milestone.

---

## Phase Review Checklist

At the end of each phase, validate:

- does the scope still match the roadmap?
- did we keep the project performant and readable?
- did we avoid adding complexity early?
- can the next phase start without rework?

If the answer is no, stop and correct the foundation before adding more features.