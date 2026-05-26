import type { TravelContent } from "../../lib/content";
import { HudPanel, HudPanelHeader } from "./site-primitives";

type TravelPanelProps = {
  content: TravelContent;
};

export default function TravelPanel({ content }: TravelPanelProps) {
  return (
    <section id="travel" aria-labelledby="travel-title" className="scroll-mt-24">
      <HudPanel accentColor="cyan">
        <HudPanelHeader label="// TRAVEL MAP" />
        <div className="grid gap-0 lg:grid-cols-[1fr_240px]">
          {/* Globe placeholder */}
          <div className="relative border-b border-border-subtle p-6 lg:border-b-0 lg:border-r">
            <h2 id="travel-title" className="sr-only">
              Travel Map
            </h2>
            <GlobePlaceholder />
            <div className="mt-6 space-y-1">
              <p
                className="text-5xl font-black text-accent-magenta"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {content.countriesVisited}
              </p>
              <p className="technical-label text-xs text-foreground-muted/60">COUNTRIES VISITED</p>
            </div>
            <a
              href="#travel"
              className="mt-4 inline-flex items-center gap-1 border border-accent-cyan/30 bg-accent-cyan/5 px-4 py-2 text-xs text-accent-cyan transition-all hover:border-accent-cyan/60 hover:bg-accent-cyan/10"
              style={{ fontFamily: "var(--font-label)", letterSpacing: "0.1em" }}
            >
              &gt; EXPLORE MAP
            </a>
          </div>

          {/* Recent journeys */}
          <div className="p-5">
            <p className="technical-label mb-4 text-xs text-accent-cyan">// RECENT JOURNEYS</p>
            <ul className="space-y-3">
              {content.journeys.map((journey, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="technical-label text-[10px] text-accent-cyan/40 tabular-nums">
                    {journey.year}
                  </span>
                  <span className="font-mono text-xs text-foreground-muted">{journey.destination}</span>
                </li>
              ))}
            </ul>
            <a
              href="#travel"
              className="mt-5 inline-flex items-center gap-1 technical-label text-[10px] text-foreground-muted/40 transition-colors hover:text-accent-cyan"
            >
              &gt; VIEW ALL
            </a>
          </div>
        </div>
      </HudPanel>
    </section>
  );
}

function GlobePlaceholder() {
  return (
    <div
      className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(circle at 35% 35%, #1e3aba 0%, #0f1626 50%, #080e17 100%)",
        boxShadow:
          "0 0 0 1px rgba(0,240,255,0.2), 0 0 40px rgba(0,240,255,0.1), inset 0 0 30px rgba(30,58,186,0.3)",
      }}
    >
      {/* Grid lines on the globe */}
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        className="absolute opacity-30"
        style={{ filter: "drop-shadow(0 0 4px #00f0ff)" }}
      >
        {/* Latitude lines */}
        {[30, 50, 80, 110, 130].map((cy) => {
          const r = Math.sqrt(80 * 80 - (cy - 80) * (cy - 80));
          return <ellipse key={cy} cx="80" cy={cy} rx={r} ry={r * 0.3} fill="none" stroke="#00f0ff" strokeWidth="0.5" />;
        })}
        {/* Longitude arcs */}
        {[0, 40, 80, 120].map((deg) => (
          <ellipse
            key={deg}
            cx="80"
            cy="80"
            rx={Math.abs(40 * Math.cos((deg * Math.PI) / 180))}
            ry="80"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="0.5"
            transform={`rotate(${deg}, 80, 80)`}
          />
        ))}
        {/* Connection dots */}
        {[
          { x: 55, y: 45 },
          { x: 90, y: 60 },
          { x: 70, y: 90 },
          { x: 110, y: 75 },
        ].map((dot, i) => (
          <circle key={i} cx={dot.x} cy={dot.y} r="2.5" fill="#ff2e8a" style={{ filter: "drop-shadow(0 0 3px #ff2e8a)" }} />
        ))}
        {/* Connection lines */}
        <line x1="55" y1="45" x2="90" y2="60" stroke="#ff2e8a" strokeWidth="0.5" opacity="0.5" />
        <line x1="90" y1="60" x2="110" y2="75" stroke="#ff2e8a" strokeWidth="0.5" opacity="0.5" />
        <line x1="55" y1="45" x2="70" y2="90" stroke="#ff2e8a" strokeWidth="0.5" opacity="0.5" />
      </svg>
    </div>
  );
}
