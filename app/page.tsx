import { getAboutContent, getFeaturedWorkContent, getHeroContent } from "../lib/content";
import { SiteContainer, SiteSection } from "./components/site-primitives";

export default function Home() {
  const hero = getHeroContent();
  const about = getAboutContent();
  const work = getFeaturedWorkContent();

  return (
    <SiteContainer className="py-[var(--site-space-section)]">
      <div className="space-y-6">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section id="hero" aria-labelledby="hero-title" className="scroll-mt-28">
          <div className="panel-surface overflow-hidden">
            <div className="flex items-center justify-between border-b border-border-subtle bg-bg-elevated/40 px-5 py-3">
              <span className="technical-label text-xs text-accent-cyan">// NODE.001 — IDENTITY</span>
              <span className="technical-label inline-flex items-center gap-2 text-xs text-foreground-muted/50">
                <span className="inline-block h-1.5 w-1.5 bg-accent-cyan" aria-hidden="true" />
                ONLINE
              </span>
            </div>
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-start">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 border border-accent-cyan/25 bg-accent-cyan/5 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 bg-accent-cyan" aria-hidden="true" />
                  <span className="technical-label text-xs text-accent-cyan">{hero.role}</span>
                </div>
                <h1 id="hero-title" className="text-5xl font-semibold tracking-tight text-foreground sm:text-7xl">
                  {hero.name}
                </h1>
                <p className="max-w-lg text-base leading-7 text-foreground-muted">
                  {hero.subheading}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  {hero.cta.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className={
                        item.variant === "primary"
                          ? "inline-flex items-center border border-accent-cyan/40 bg-accent-cyan/5 px-5 py-2.5 text-sm font-medium text-accent-cyan transition-colors hover:border-accent-cyan/70 hover:bg-accent-cyan/15"
                          : "inline-flex items-center border border-border-subtle px-5 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:border-accent-magenta/50 hover:text-foreground"
                      }
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-start justify-center lg:justify-end">
                <div className="relative">
                  <img
                    src="/images/me.jpg"
                    alt={hero.name}
                    className="h-72 w-64 object-cover object-top sm:h-80 sm:w-72"
                  />
                  <span className="absolute -left-px -top-px h-5 w-5 border-l border-t border-accent-cyan/50" aria-hidden="true" />
                  <span className="absolute -right-px -top-px h-5 w-5 border-r border-t border-accent-cyan/50" aria-hidden="true" />
                  <span className="absolute -bottom-px -left-px h-5 w-5 border-b border-l border-accent-cyan/50" aria-hidden="true" />
                  <span className="absolute -bottom-px -right-px h-5 w-5 border-b border-r border-accent-cyan/50" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── About ─────────────────────────────────────────────────────── */}
        <SiteSection
          id="about"
          eyebrow={about.eyebrow}
          title={about.heading}
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
                className="mt-2 inline-flex items-center border border-accent-cyan/40 bg-accent-cyan/5 px-5 py-2.5 text-sm font-medium text-accent-cyan transition-colors hover:border-accent-cyan/70 hover:bg-accent-cyan/15"
              >
                {about.contact.label}
              </a>
            )}
          </div>
        </SiteSection>

        {/* ── Terminal (scaffold — Phase 3) ──────────────────────────────── */}
        <SiteSection
          id="terminal"
          eyebrow="// TERMINAL.NODE"
          title="Interactive terminal"
          description="A fixed command set will let you explore the site without leaving the keyboard. — Phase 3"
        >
          <div className="border border-border-subtle bg-[#020510]" data-ui="technical">
            <div className="flex items-center gap-2 border-b border-border-subtle px-5 py-3">
              <span className="h-2.5 w-2.5 bg-accent-magenta/70" aria-hidden="true" />
              <span className="h-2.5 w-2.5 bg-accent-cyan/60" aria-hidden="true" />
              <span className="technical-label ml-3 text-[0.6rem] text-foreground-muted/50">shell@personal-site ~ %</span>
            </div>
            <div className="space-y-2 p-5 text-sm text-foreground-muted">
              <p>
                <span className="mr-2 text-accent-cyan">›</span>
                interactive command registry deferred to Phase 3
              </p>
            </div>
          </div>
        </SiteSection>

        {/* ── Featured work ──────────────────────────────────────────────── */}
        <SiteSection
          id="featured-work"
          eyebrow={work.eyebrow}
          title={work.heading}
        >
          <div className="grid gap-4 md:grid-cols-3">
            {work.items.map((item, idx) => (
              <article key={item.title} className="panel-surface relative flex flex-col gap-4 overflow-hidden p-5">
                <span className="absolute inset-x-0 top-0 h-px bg-accent-cyan/35" aria-hidden="true" />
                <span className="technical-label text-xs text-foreground-muted/40">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="flex-1 text-sm leading-7 text-foreground-muted">{item.description}</p>
                {item.href && (
                  <a
                    href={item.href}
                    className="self-start text-sm text-accent-cyan hover:underline"
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    View →
                  </a>
                )}
              </article>
            ))}
          </div>
        </SiteSection>

      </div>
    </SiteContainer>
  );
}
