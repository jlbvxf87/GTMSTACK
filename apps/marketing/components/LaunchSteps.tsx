/**
 * 4-step "Launch in Minutes" section. Matches the row of choose-stack /
 * brand-clinic / launch-instantly / scale cards from the user's mock.
 */
export function LaunchSteps() {
  const steps = [
    {
      title: "Choose Your Stack",
      body: "Pick a vertical (wellness, clinical, community) and the products you want to list. Marketplace + your own catalog when partners sign.",
      icon: "01",
    },
    {
      title: "Brand Your Clinic",
      body: "One paragraph in, full identity out. Claude generates tagline, hero copy, FAQ drafts, voice register. Edit anything.",
      icon: "02",
    },
    {
      title: "Launch Instantly",
      body: "Connect Stripe. Pick a plan. Your storefront goes live on your subdomain. Customers can subscribe within the hour.",
      icon: "03",
    },
    {
      title: "Scale Effortlessly",
      body: "Subscriptions auto-renew. AI handles routine support. Provider partners review clinical intakes. You own the audience.",
      icon: "04",
    },
  ];

  return (
    <section className="w-full bg-white text-black">
      <div className="mx-auto max-w-container px-6 py-section md:px-10">
        <p className="font-body text-small font-semibold uppercase tracking-[0.18em] text-black/50">
          Launch in minutes
        </p>
        <h2 className="mt-stack font-body text-[clamp(2rem,4vw+1rem,3.5rem)] font-bold leading-tight tracking-tight text-black max-w-3xl">
          From a single description to a real business.
        </h2>

        <ul role="list" className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li
              key={s.title}
              className="flex h-full flex-col rounded-3xl border border-black/10 bg-white p-6 transition-shadow hover:shadow-xl"
            >
              <span aria-hidden className="font-mono text-h3 font-bold tracking-tight text-black/30">
                {s.icon}
              </span>
              <h3 className="mt-stack font-body text-h2 font-bold tracking-tight text-black">
                {s.title}
              </h3>
              <p className="mt-stack text-body text-black/70">{s.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
