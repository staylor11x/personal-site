import { getAboutContent, getFeaturedWorkContent, getHeroContent } from "../lib/content";
import { SiteContainer, SiteSection, SurfaceCard } from "./components/site-primitives";

export default function Home() {
  const hero = getHeroContent();
  const about = getAboutContent();
  const work = getFeaturedWorkContent();

  return (
    <SiteContainer className="py-[var(--site-space-section)]">
      <div className="space-y-6">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section id="hero" aria-labelledby="hero-title" role="region" className="scroll-mt-28">
          <SurfaceCard className="space-y-6 p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
              <div className="space-y-5">
                <h1 id="hero-title" className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
                  {hero.name} — {hero.role}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-foreground-muted">
                  {hero.subheading}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {hero.cta.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className={
                        item.variant === "primary"
                          ? "inline-flex items-center rounded-full bg-accent-cyan/10 px-4 py-2 text-sm font-medium text-accent-cyan ring-1 ring-accent-cyan/20 hover:bg-accent-cyan/20"
                          : "inline-flex items-center rounded-full bg-accent-magenta/10 px-4 py-2 text-sm font-medium text-accent-magenta ring-1 ring-accent-magenta/20 hover:bg-accent-magenta/20"
                      }
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </SurfaceCard>
        </section>

        {/* ── About ─────────────────────────────────────────────────────── */}
        <SiteSection
          id="about"
          eyebrow={about.eyebrow}
          title={about.heading}
          description=""
        >
          <div className="space-y-4">
            {about.paragraphs.map((para, i) => (
              <p key={i} className="text-base leading-8 text-foreground-muted">
                {para}
              </p>
            ))}
            {about.contact && (
              <a
                href={about.contact.href}
                className="mt-2 inline-flex items-center rounded-full bg-accent-cyan/10 px-4 py-2 text-sm font-medium text-accent-cyan ring-1 ring-accent-cyan/20 hover:bg-accent-cyan/20"
              >
                {about.contact.label}
              </a>
            )}
          </div>
        </SiteSection>

        {/* ── Terminal (scaffold — Phase 3) ──────────────────────────────── */}
        <SiteSection
          id="terminal"
          eyebrow="Terminal"
          title="Interactive terminal — coming in Phase 3."
          description="A fixed command set will let you explore the site without leaving the keyboard."
        >
          <SurfaceCard as="article" className="rounded-2xl bg-[#030712]/90 p-5" data-ui="technical">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-4 text-xs text-foreground-muted">
              <span className="h-3 w-3 rounded-full bg-accent-magenta/80" />
              <span className="h-3 w-3 rounded-full bg-accent-cyan/70" />
              <span className="technical-label ml-2 text-[0.65rem]">Terminal shell reserved</span>
            </div>
            <div className="space-y-3 pt-4 text-sm text-foreground-muted">
              <p>&gt; interactive command registry deferred to Phase 3</p>
            </div>
          </SurfaceCard>
        </SiteSection>

        {/* ── Featured work ──────────────────────────────────────────────── */}
        <SiteSection
          id="featured-work"
          eyebrow={work.eyebrow}
          title={work.heading}
          description=""
        >
          <div className="grid gap-4 md:grid-cols-3">
            {work.items.map((item) => (
              <SurfaceCard key={item.title} as="article" className="rounded-2xl bg-bg-elevated/72 p-5">
                <h3 className="text-lg font-medium text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-foreground-muted">{item.description}</p>
                {item.href && (
                  <a
                    href={item.href}
                    className="mt-4 inline-flex items-center text-sm text-accent-cyan hover:underline"
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    View →
                  </a>
                )}
              </SurfaceCard>
            ))}
          </div>
        </SiteSection>

      </div>
    </SiteContainer>
  );
}
