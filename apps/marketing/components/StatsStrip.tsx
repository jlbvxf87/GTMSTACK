/**
 * Trust strip with platform-level numbers + integrations. Honest about being
 * early — these are *capability* numbers, not user-volume numbers.
 */
export function StatsStrip() {
  const stats = [
    { value: "3", label: "Theme families" },
    { value: "5", label: "Operator types" },
    { value: "100%", label: "On Stripe Connect" },
    { value: "AI", label: "Powered by Claude" },
  ];
  return (
    <section className="w-full border-y border-black/10 bg-black text-white">
      <div className="mx-auto max-w-container px-6 py-10 md:px-10">
        <ul role="list" className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label} className="flex flex-col">
              <span className="font-body text-h1 font-bold leading-none tracking-tight text-white">
                {s.value}
              </span>
              <span className="mt-2 font-mono text-small uppercase tracking-[0.18em] text-white/60">
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
