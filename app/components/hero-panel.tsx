import type { ReactNode } from "react";
import type { HeroContent } from "../../lib/content";
import { HudPanel, HudPanelHeader } from "./site-primitives";
import LiveClock from "./live-clock";
import SynthwaveHeroImage from "./synthwave-hero-image";

type HeroPanelProps = {
  hero: HeroContent;
};

export default function HeroPanel({ hero }: HeroPanelProps) {
  return (
    <section id="hero" aria-labelledby="hero-title" className="scroll-mt-24">
      <HudPanel accentColor="pink">
        <HudPanelHeader
          label="// NODE.001 — IDENTITY"
          accentColor="pink"
          right={
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-green" aria-hidden="true" />
              ONLINE
            </span>
          }
        />

        <div className="grid gap-0 lg:grid-cols-[1fr_280px_200px]">
          {/* ── Left: identity ─────────────────────────────────────── */}
          <div className="flex flex-col justify-between gap-6 border-b border-border-subtle p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="space-y-4">
              {/* System status */}
              <p className="flex items-center gap-2 font-mono text-xs text-accent-green">
                <span className="inline-block h-1.5 w-1.5 bg-accent-green" aria-hidden="true" />
                &gt; SYSTEM ONLINE
              </p>

              {/* Name */}
              <h1
                id="hero-title"
                className="text-5xl font-black uppercase leading-none tracking-wide sm:text-6xl lg:text-7xl"
                style={{
                  fontFamily: "var(--font-heading)",
                  background: "linear-gradient(135deg, #ff2e8a 0%, #ff6eb4 50%, #c026d3 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                SCOTT
                <br />
                TAYLOR
              </h1>

              {/* Role */}
              <p
                className="text-base font-bold uppercase tracking-widest text-accent-cyan sm:text-lg"
                style={{ fontFamily: "var(--font-label)" }}
              >
                {hero.role}
              </p>

              {/* Subheading */}
              <p className="technical-label max-w-xs text-xs leading-relaxed text-foreground-muted/80">
                {hero.subheading}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              {hero.cta.map((item) =>
                item.variant === "primary" ? (
                  <a
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-2 border border-accent-green/60 bg-accent-green/5 px-5 py-2.5 text-sm font-medium text-accent-green transition-all hover:border-accent-green hover:bg-accent-green/10 hover:shadow-[0_0_12px_rgba(57,255,20,0.2)]"
                    style={{ fontFamily: "var(--font-label)", letterSpacing: "0.1em" }}
                  >
                    &gt; {item.label.toUpperCase()}
                  </a>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center gap-2 border border-accent-magenta/40 bg-accent-magenta/5 px-5 py-2.5 text-sm font-medium text-accent-magenta transition-all hover:border-accent-magenta/70 hover:bg-accent-magenta/10"
                    style={{ fontFamily: "var(--font-label)", letterSpacing: "0.1em" }}
                  >
                    &gt; {item.label.toUpperCase()}
                  </a>
                )
              )}
            </div>
          </div>

          {/* ── Centre: synthwave image ─────────────────────────────── */}
          <div className="relative border-b border-border-subtle lg:border-b-0 lg:border-r">
            <SynthwaveHeroImage />
          </div>

          {/* ── Right: status sidebar ───────────────────────────────── */}
          <div className="flex flex-col gap-0 divide-y divide-border-subtle">
            <StatusField label="STATUS">
              <span className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-accent-green shadow-[0_0_6px_#39ff14]" />
                <span className="text-accent-green">ONLINE</span>
              </span>
            </StatusField>
            <StatusField label="LOCATION">
              <span>SCOTLAND, UK</span>
            </StatusField>
            <StatusField label="LOCAL TIME">
              <LiveClock className="text-accent-cyan" />
            </StatusField>
            <div className="mt-auto flex-1 p-4">
              <p className="technical-label text-[10px] text-foreground-muted/30">
                NODE ID: ST-1988-0427
              </p>
            </div>
          </div>
        </div>
      </HudPanel>
    </section>
  );
}

function StatusField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-4">
      <span className="technical-label text-[10px] text-foreground-muted/40">{label}</span>
      <span className="font-mono text-xs font-medium text-foreground">{children}</span>
    </div>
  );
}
