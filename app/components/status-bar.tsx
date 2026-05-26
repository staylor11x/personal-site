"use client";

import { useEffect, useState } from "react";

function padTwo(n: number) {
  return String(n).padStart(2, "0");
}

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (d > 0) return `${d}D ${padTwo(h)}H ${padTwo(m)}M`;
  return `${padTwo(h)}H ${padTwo(m)}M ${padTwo(s)}S`;
}

function formatTime(date: Date) {
  return `${padTwo(date.getHours())}:${padTwo(date.getMinutes())}:${padTwo(date.getSeconds())}`;
}

const SESSION_START = Date.now();

export default function StatusBar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const uptimeSeconds = now ? Math.floor((now.getTime() - SESSION_START) / 1000) : 0;

  return (
    <footer
      aria-label="System status"
      className="border-t border-border-subtle bg-bg-elevated/95 backdrop-blur-md"
    >
      {/* Bottom accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent" />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-[var(--site-space-gutter)] py-2">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <StatusField label="UPTIME" value={now ? formatUptime(uptimeSeconds) : "00H 00M 00S"} />
          <StatusField label="SYSTEM LOAD" value="0.32" />
          <StatusField label="MEMORY" value="42%" />
          <StatusField label="LOCAL TIME" value={now ? formatTime(now) : "--:--:--"} accent="cyan" />
          <StatusField label="NODE ID" value="ST-1988-0427" />
        </div>
        <span
          className="technical-label text-xs text-foreground-muted/40"
          style={{ fontFamily: "var(--font-label)" }}
        >
          BUILT WITH PASSION{" "}
          <span className="text-accent-magenta" aria-hidden="true">
            ♥
          </span>
        </span>
      </div>
    </footer>
  );
}

function StatusField({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "cyan" | "green";
}) {
  const valueColor =
    accent === "cyan"
      ? "text-accent-cyan"
      : accent === "green"
        ? "text-accent-green"
        : "text-foreground-muted/70";

  return (
    <span className="flex items-center gap-1.5">
      <span className="technical-label text-[10px] text-foreground-muted/40">{label}:</span>
      <span className={`font-mono text-[10px] ${valueColor}`}>{value}</span>
    </span>
  );
}
