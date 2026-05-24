const themeSignals = [
  {
    label: "Palette",
    value: "Tokens now drive background, surface, border, and glow states.",
  },
  {
    label: "Type",
    value: "Body copy uses a readable sans stack while technical UI stays monospace.",
  },
  {
    label: "Motion",
    value: "Ambient effects stay subtle and shut down safely for reduced-motion users.",
  },
] as const;

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-[var(--site-space-gutter)] py-[var(--site-space-section)]">
      <section className="panel-surface w-full space-y-8 p-8 sm:p-10">
        <div className="space-y-5">
          <p className="technical-label motion-safe-accent inline-flex items-center rounded-full border border-border-strong bg-bg-elevated/80 px-4 py-2 text-xs text-accent-cyan">
            Foundation tokens online
          </p>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
              Personal site baseline is ready.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-foreground-muted">
              The global theme now centralizes color, surfaces, spacing, typography, and motion-safe defaults so Phase 1 sections can inherit a restrained retro-futuristic aesthetic without one-off styling.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {themeSignals.map((signal) => (
            <article
              key={signal.label}
              data-ui="technical"
              className="rounded-2xl border border-border-subtle bg-bg-elevated/72 p-5"
            >
              <p className="technical-label text-[0.7rem] text-accent-magenta">{signal.label}</p>
              <p className="mt-3 font-sans text-sm leading-7 text-foreground-muted">{signal.value}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
