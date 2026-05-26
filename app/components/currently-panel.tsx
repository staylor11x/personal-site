import type { CurrentlyContent } from "../../lib/content";
import { HudPanel, HudPanelHeader } from "./site-primitives";

type CurrentlyPanelProps = {
  content: CurrentlyContent;
};

export default function CurrentlyPanel({ content }: CurrentlyPanelProps) {
  return (
    <section id="now" aria-labelledby="now-title" className="scroll-mt-24">
      <HudPanel>
        <HudPanelHeader label="// CURRENTLY" />
        <div className="space-y-5 p-5">
          <h2 id="now-title" className="sr-only">
            Currently
          </h2>
          <CurrentlyGroup label="LEARNING" items={content.learning} accent="cyan" />
          <CurrentlyGroup label="LISTENING" items={content.listening} accent="pink" />
          <CurrentlyGroup label="BUILDING" items={content.building} accent="green" />
        </div>
      </HudPanel>
    </section>
  );
}

function CurrentlyGroup({
  label,
  items,
  accent,
}: {
  label: string;
  items: string[];
  accent: "cyan" | "pink" | "green";
}) {
  const accentColor =
    accent === "pink"
      ? "text-accent-magenta"
      : accent === "green"
        ? "text-accent-green"
        : "text-accent-cyan";

  const bulletColor =
    accent === "pink"
      ? "text-accent-magenta/60"
      : accent === "green"
        ? "text-accent-green/60"
        : "text-accent-cyan/60";

  return (
    <div className="space-y-2">
      <p
        className={`technical-label text-[10px] font-semibold ${accentColor}`}
        style={{ fontFamily: "var(--font-label)" }}
      >
        {label}
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 font-mono text-xs text-foreground-muted">
            <span className={bulletColor} aria-hidden="true">
              &gt;
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
