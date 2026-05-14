import { PrimaryCTA } from "./PrimaryCTA";

type LineItem = {
  label: string;
  replaces: string;
  cost: string;
  icon: string;
};

/**
 * Stan-style "A Simpler Solution" pricing card.
 *
 * The whole frame: itemize what an operator would otherwise pay for separately
 * — storefront builder, AI support tools, email + SMS, subscription billing,
 * provider network access, compliance — sum the cost with a strikethrough,
 * then surface a single low GTMStack price. Easy low-barrier entry. We make
 * money on transaction fees + Clinical-tier upsells.
 */
export function PricingSimpler({ operatorAppUrl }: { operatorAppUrl: string }) {
  const items: LineItem[] = [
    {
      icon: "🛍️",
      label: 'Branded storefront + product pages',
      replaces: "Replaces Shopify · Webflow",
      cost: "$79",
    },
    {
      icon: "💳",
      label: "Subscription billing + Stripe Connect routing",
      replaces: "Replaces Recharge · Bold",
      cost: "$60",
    },
    {
      icon: "🤖",
      label: "AI customer support + brand voice",
      replaces: "Replaces Intercom · Klaviyo AI",
      cost: "$150",
    },
    {
      icon: "✉️",
      label: "Email + SMS marketing",
      replaces: "Replaces Klaviyo · Postscript",
      cost: "$85",
    },
    {
      icon: "🩺",
      label: "Licensed provider review network",
      replaces: "Replaces Cerbo · custom MSO build",
      cost: "$200",
    },
    {
      icon: "📊",
      label: "Real-time MRR + churn analytics",
      replaces: "Replaces Mixpanel · PostHog",
      cost: "$25",
    },
    {
      icon: "🔒",
      label: "HIPAA-ready data layer + audit logs",
      replaces: "Replaces Aptible · custom infra",
      cost: "$100",
    },
    {
      icon: "📦",
      label: "Fulfillment + pharmacy partner adapters",
      replaces: "Replaces ShipStation · custom EDI",
      cost: "$45",
    },
  ];

  const otherwiseTotal = items.reduce(
    (acc, i) => acc + Number(i.cost.replace(/[^0-9]/g, "")),
    0,
  );

  return (
    <section id="pricing" className="w-full bg-[#f6f5f3] text-black">
      <div className="mx-auto max-w-3xl px-6 py-section md:py-32">
        <div className="text-center">
          <h2 className="font-body text-[clamp(2.25rem,4vw+1rem,3.75rem)] font-bold leading-[1.05] tracking-tight text-black">
            A Simpler Solution{" "}
            <span aria-hidden className="inline-block align-middle">💰</span>
          </h2>
          <p className="mt-4 text-h3 text-black/60">
            No more cobbling together 8+ tools. GTMStack brings the whole
            wellness business under one roof.
          </p>
        </div>

        <div className="mt-12 rounded-3xl bg-white p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.18),0_10px_20px_-8px_rgba(0,0,0,0.10)] md:p-10">
          <ul role="list" className="divide-y divide-black/10">
            {items.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <span
                  aria-hidden
                  className="flex h-9 w-9 flex-none items-center justify-center text-2xl"
                >
                  {item.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-body text-body font-semibold text-black">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-small text-black/50">
                    {item.replaces}
                  </p>
                </div>
                <p className="flex-none font-body text-body font-bold text-black">
                  ${item.cost.replace("$", "")}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl bg-black/[0.04] p-5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-rose-500/10 text-rose-600"
              >
                ✕
              </span>
              <p className="flex-1 font-body text-body font-medium text-black/50 line-through">
                What you'd spend otherwise
              </p>
              <p className="flex-none font-body text-h3 font-bold text-rose-600 line-through">
                ${otherwiseTotal}/mo
              </p>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span
                aria-hidden
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-black text-white"
              >
                $
              </span>
              <p className="flex-1 font-body text-body font-semibold text-black">
                Run your business on GTMStack{" "}
                <span aria-hidden>✨</span>
              </p>
              <p className="flex-none font-body text-h2 font-bold tracking-tight text-black">
                $49<span className="text-body font-normal text-black/60">/mo</span>
              </p>
            </div>
            <p className="mt-3 pl-12 text-small text-black/60">
              Plus a small platform fee on transactions. No fee until you start
              selling. Upgrade to Clinical when you launch peptides or hormones.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3">
          <PrimaryCTA href={`${operatorAppUrl}/signup`}>
            Start My Trial
          </PrimaryCTA>
          <p className="text-small text-black/50">
            14 days free. No credit card to start.
          </p>
        </div>
      </div>
    </section>
  );
}
