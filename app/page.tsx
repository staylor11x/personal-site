import {
  getAboutContent,
  getCurrentlyContent,
  getFeaturedWorkContent,
  getHeroContent,
  getTerminalContent,
  getTravelContent,
} from "../lib/content";
import CurrentlyPanel from "./components/currently-panel";
import HeroPanel from "./components/hero-panel";
import NowPlayingPanel from "./components/now-playing-panel";
import { HudPanel, HudPanelHeader, SiteContainer } from "./components/site-primitives";
import TerminalPanel from "./components/terminal-panel";
import TravelPanel from "./components/travel-panel";

export default function Home() {
  const hero = getHeroContent();
  const about = getAboutContent();
  const work = getFeaturedWorkContent();
  const currently = getCurrentlyContent();
  const travel = getTravelContent();
  const terminal = getTerminalContent();

  return (
    <SiteContainer className="py-4">
      <div className="space-y-4">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <HeroPanel hero={hero} />

        {/* ── Three-column row: About / Currently / Now Playing ────── */}
        <div className="grid gap-4 lg:grid-cols-[1fr_240px_220px]">

          {/* About */}
          <section id="about" aria-labelledby="about-title" className="scroll-mt-24">
            <HudPanel>
              <HudPanelHeader label="// ABOUT ME" />
              <div className="space-y-4 p-5">
                <h2 id="about-title" className="sr-only">About me</h2>
                {about.paragraphs.map((para, i) => (
                  <p key={i} className="text-sm leading-7 text-foreground-muted">
                    {para}
                  </p>
                ))}
                {about.contact && (
                  <a
                    href={about.contact.href}
                    className="inline-flex items-center gap-1 border border-accent-magenta/40 bg-accent-magenta/5 px-4 py-2 text-xs text-accent-magenta transition-all hover:border-accent-magenta/70"
                    style={{ fontFamily: "var(--font-label)", letterSpacing: "0.1em" }}
                  >
                    &gt; READ MORE
                  </a>
                )}
              </div>
            </HudPanel>
          </section>

          {/* Currently */}
          <CurrentlyPanel content={currently} />

          {/* Now Playing */}
          <NowPlayingPanel />
        </div>

        {/* ── Travel ───────────────────────────────────────────────── */}
        <TravelPanel content={travel} />

        {/* ── Terminal ─────────────────────────────────────────────── */}
        <TerminalPanel content={terminal} />

        {/* ── Featured work ─────────────────────────────────────────── */}
        <section id="featured-work" aria-labelledby="featured-work-title" className="scroll-mt-24">
          <HudPanel>
            <HudPanelHeader label={work.eyebrow} />
            <div className="p-5">
              <h2
                id="featured-work-title"
                className="mb-5 text-xl font-semibold tracking-tight text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {work.heading}
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {work.items.map((item, idx) => (
                  <article
                    key={item.title}
                    className="relative flex flex-col gap-3 border border-border-subtle bg-bg-elevated/40 p-4"
                  >
                    <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" aria-hidden="true" />
                    <span className="technical-label text-xs text-foreground-muted/30">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="flex-1 text-xs leading-6 text-foreground-muted">{item.description}</p>
                    {item.href && (
                      <a
                        href={item.href}
                        className="self-start text-xs text-accent-cyan hover:underline"
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        &gt; VIEW →
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </HudPanel>
        </section>

      </div>
    </SiteContainer>
  );
}
