import { SiteContainer, SiteSection, SurfaceCard } from "./components/site-primitives";

const heroSignals = [
  "Clear section hierarchy",
  "Shared surface primitives",
  "Mobile-first responsive shell",
] as const;

const featuredWorkShell = [
  {
    title: "Featured item slot 01",
    description: "Reserved for a concise project or capability summary once structured content is ready.",
  },
  {
    title: "Featured item slot 02",
    description: "Keeps the homepage balanced before real featured work copy lands in a later phase.",
  },
  {
    title: "Featured item slot 03",
    description: "Uses the same card surface so future content can drop in without layout rewrites.",
  },
] as const;

export default function Home() {
  return (
    <SiteContainer className="py-[var(--site-space-section)]">
      <div className="space-y-6">
        <section id="hero" aria-labelledby="hero-title" className="scroll-mt-28">
          <SurfaceCard className="space-y-8 p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)] lg:items-start">
              <div className="space-y-5">
                <p className="technical-label motion-safe-accent inline-flex items-center rounded-full border border-border-strong bg-bg-elevated/80 px-4 py-2 text-xs text-accent-cyan">
                  Phase 1 homepage shell
                </p>
                <div className="space-y-4">
                  <h1 id="hero-title" className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
                    Root layout, navigation, footer, and homepage scaffolding are in place.
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-foreground-muted sm:text-lg">
                    This hero reserves clear structure for future identity content while keeping today&apos;s foundation focused on landmarks, shared primitives, and responsive layout behavior.
                  </p>
                </div>
              </div>
              <SurfaceCard as="aside" className="space-y-4 rounded-2xl bg-bg-elevated/80 p-5">
                <p className="technical-label text-[0.7rem] text-accent-magenta">Shell signals</p>
                <ul className="space-y-3 text-sm text-foreground-muted">
                  {heroSignals.map((signal) => (
                    <li key={signal} className="rounded-2xl border border-border-subtle bg-bg px-4 py-3">
                      {signal}
                    </li>
                  ))}
                </ul>
              </SurfaceCard>
            </div>
          </SurfaceCard>
        </section>

        <SiteSection
          id="about"
          eyebrow="About scaffold"
          title="A dedicated narrative section is ready for concise personal copy."
          description="This container establishes spacing, typography, and semantic structure for the about surface without pulling Phase 2 storytelling into Phase 1."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <SurfaceCard as="article" className="rounded-2xl bg-bg-elevated/72 p-5">
              <h3 className="text-base font-medium text-foreground">Narrative slot</h3>
              <p className="mt-3 text-sm leading-7 text-foreground-muted">
                Reserved for short personal context, technical perspective, and supporting details once content work begins.
              </p>
            </SurfaceCard>
            <SurfaceCard as="article" className="rounded-2xl bg-bg-elevated/72 p-5">
              <h3 className="text-base font-medium text-foreground">Supporting details slot</h3>
              <p className="mt-3 text-sm leading-7 text-foreground-muted">
                Uses the same shared surface treatment so future text blocks remain visually consistent across breakpoints.
              </p>
            </SurfaceCard>
          </div>
        </SiteSection>

        <SiteSection
          id="terminal"
          eyebrow="Terminal scaffold"
          title="The terminal section is framed without adding interaction or command logic yet."
          description="Phase 1 keeps the terminal surface to a static, accessible shell so the homepage reads clearly before interactive behavior arrives."
        >
          <SurfaceCard as="article" className="rounded-2xl bg-[#030712]/90 p-5" data-ui="technical">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-4 text-xs text-foreground-muted">
              <span className="h-3 w-3 rounded-full bg-accent-magenta/80" />
              <span className="h-3 w-3 rounded-full bg-accent-cyan/70" />
              <span className="technical-label ml-2 text-[0.65rem]">Terminal shell reserved</span>
            </div>
            <div className="space-y-3 pt-4 text-sm text-foreground-muted">
              <p>&gt; terminal surface placeholder initialized</p>
              <p>&gt; keyboard-friendly static frame only</p>
              <p>&gt; interactive command registry deferred to Phase 3</p>
            </div>
          </SurfaceCard>
        </SiteSection>

        <SiteSection
          id="featured-work"
          eyebrow="Featured work scaffold"
          title="Featured work slots are ready for structured content."
          description="This section keeps the homepage balanced with reusable cards while intentionally avoiding real project content until the next phase."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {featuredWorkShell.map((item) => (
              <SurfaceCard key={item.title} as="article" className="rounded-2xl bg-bg-elevated/72 p-5">
                <p className="technical-label text-[0.7rem] text-accent-magenta">Placeholder</p>
                <h3 className="mt-3 text-lg font-medium text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-foreground-muted">{item.description}</p>
              </SurfaceCard>
            ))}
          </div>
        </SiteSection>
      </div>
    </SiteContainer>
  );
}
