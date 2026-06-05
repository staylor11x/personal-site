"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { TravelContent } from "../../lib/content";
import { getMarkers } from "../../lib/markers";
import { HudPanel, HudPanelHeader } from "./site-primitives";

const Globe3D = dynamic(() => import("./globe-3d"), {
  ssr: false,
  loading: () => <GlobePlaceholder />,
});

type TravelPanelProps = {
  content: TravelContent;
};

export default function TravelPanel({ content }: TravelPanelProps) {
  const markers = useMemo(() => getMarkers(content), [content]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [journeyWithArcs, setJourneyWithArcs] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleMarkerClick = useCallback((index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
    setJourneyWithArcs(null);
  }, []);

  const handleLogRowClick = useCallback((index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
    setJourneyWithArcs((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section id="travel" aria-labelledby="travel-title" className="scroll-mt-24">
      <HudPanel accentColor="cyan">
        <HudPanelHeader label="// TRAVEL MAP" />
        <div className="grid gap-0 lg:grid-cols-[7fr_2fr]">
          {/* Globe */}
          <div className="relative h-96 lg:h-full border-b border-border-subtle lg:border-b-0 lg:border-r">
            <h2 id="travel-title" className="sr-only">Travel Map</h2>
            <Globe3D
              markers={markers}
              activeIndex={activeIndex}
              journeyWithArcs={journeyWithArcs}
              onMarkerClick={handleMarkerClick}
              reducedMotion={reducedMotion}
            />
            <div className="absolute bottom-3 left-3 space-y-1 pointer-events-none">
              <p className="text-5xl font-black text-accent-magenta" style={{ fontFamily: "var(--font-heading)" }}>
                {content.countriesVisited}
              </p>
              <p className="technical-label text-xs text-foreground-muted/60">COUNTRIES VISITED</p>
            </div>
          </div>

          {/* Journey log */}
          <div className="p-5">
            <p className="technical-label mb-4 text-xs text-accent-cyan">{'// RECENT JOURNEYS'}</p>
            <ul className="space-y-1">
              {content.journeys.map((journey, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleLogRowClick(i)}
                    className={`flex w-full items-center gap-3 px-2 py-2 text-left transition-all ${
                      activeIndex === i
                        ? "border-l-2 border-accent-cyan bg-accent-cyan/5 text-accent-cyan"
                        : "border-l-2 border-transparent text-foreground-muted hover:border-accent-cyan/30 hover:bg-accent-cyan/[0.03]"
                    }`}
                  >
                    <span className="technical-label text-[10px] text-accent-cyan/40 tabular-nums shrink-0">
                      {journey.year}
                    </span>
                    <span className="font-mono text-xs">{journey.destination}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </HudPanel>
    </section>
  );
}

function GlobePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
      <div
        className="relative flex h-40 w-40 items-center justify-center rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, #1e3aba 0%, #0f1626 50%, #080e17 100%)",
          boxShadow:
            "0 0 0 1px rgba(0,240,255,0.2), 0 0 40px rgba(0,240,255,0.1), inset 0 0 30px rgba(30,58,186,0.3)",
        }}
      >
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          className="absolute opacity-30"
          style={{ filter: "drop-shadow(0 0 4px #00f0ff)" }}
        >
          {[30, 50, 80, 110, 130].map((cy) => {
            const r = Math.sqrt(80 * 80 - (cy - 80) * (cy - 80));
            return <ellipse key={cy} cx="80" cy={cy} rx={r} ry={r * 0.3} fill="none" stroke="#00f0ff" strokeWidth="0.5" />;
          })}
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
          {[
            { x: 55, y: 45 },
            { x: 90, y: 60 },
            { x: 70, y: 90 },
            { x: 110, y: 75 },
          ].map((dot, i) => (
            <circle key={i} cx={dot.x} cy={dot.y} r="2.5" fill="#ff2e8a" style={{ filter: "drop-shadow(0 0 3px #ff2e8a)" }} />
          ))}
          <line x1="55" y1="45" x2="90" y2="60" stroke="#ff2e8a" strokeWidth="0.5" opacity="0.5" />
          <line x1="90" y1="60" x2="110" y2="75" stroke="#ff2e8a" strokeWidth="0.5" opacity="0.5" />
          <line x1="55" y1="45" x2="70" y2="90" stroke="#ff2e8a" strokeWidth="0.5" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}
