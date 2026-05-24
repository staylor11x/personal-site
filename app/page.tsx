export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-24">
      <section className="space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Foundation</p>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-6xl">
            Personal site baseline is ready.
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            This lean App Router scaffold keeps the repository ready for Phase 1 shell work without pulling in later feature structure.
          </p>
        </div>
      </section>
    </main>
  );
}
