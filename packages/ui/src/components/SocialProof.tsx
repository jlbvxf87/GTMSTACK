import type { Testimonial } from "./types";

export type SocialProofProps = {
  eyebrow?: string;
  headline: string;
  /** Featured large quote rendered at the top. */
  featured: Testimonial;
  /** Optional supporting quotes (recommend 3) rendered as a row below. */
  supporting?: Testimonial[];
};

/**
 * SocialProof — testimonials. Server component.
 *
 * Layout: section header → featured quote (large, centered) → row of supporting quotes.
 * Stars render only when `rating` is set on the testimonial. Per doctrine, the
 * supporting row defaults to 3-up on desktop; provide more or fewer freely.
 */
export function SocialProof({ eyebrow, headline, featured, supporting = [] }: SocialProofProps) {
  return (
    <section className="w-full bg-background text-foreground">
      <div className="mx-auto max-w-container px-6 py-section md:px-10">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          {eyebrow ? (
            <p className="mb-stack font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-display text-h1 text-foreground">{headline}</h2>
        </header>

        <FeaturedQuote testimonial={featured} />

        {supporting.length ? (
          <ul
            role="list"
            className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {supporting.map((t) => (
              <li key={t.id} className="contents">
                <SupportingQuote testimonial={t} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

function FeaturedQuote({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="mx-auto max-w-3xl rounded-card border-card border-border bg-muted p-10 text-center shadow-card md:p-14">
      {typeof testimonial.rating === "number" ? <StarRow rating={testimonial.rating} /> : null}
      <blockquote className="mt-stack font-display text-h2 leading-[1.15] text-foreground">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-8 text-body text-muted-foreground">
        <span className="font-medium text-foreground">{testimonial.attribution}</span>
        {testimonial.attributionDetail ? (
          <>
            <span aria-hidden> · </span>
            <span>{testimonial.attributionDetail}</span>
          </>
        ) : null}
      </figcaption>
    </figure>
  );
}

function SupportingQuote({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col gap-stack rounded-card border-card border-border bg-background p-6 shadow-card">
      {typeof testimonial.rating === "number" ? <StarRow rating={testimonial.rating} /> : null}
      <blockquote className="text-body text-foreground/90">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-auto text-small text-muted-foreground">
        <span className="font-medium text-foreground">{testimonial.attribution}</span>
        {testimonial.attributionDetail ? (
          <>
            <span aria-hidden> · </span>
            <span>{testimonial.attributionDetail}</span>
          </>
        ) : null}
      </figcaption>
    </figure>
  );
}

function StarRow({ rating }: { rating: number }) {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div role="img" aria-label={`${clamped} out of 5 stars`} className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} filled={i < clamped} />
      ))}
    </div>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden
      className={filled ? "text-accent" : "text-border"}
    >
      <path
        fill="currentColor"
        d="M12 17.27l5.18 3.04-1.64-5.81L20 9.97l-5.91-.51L12 4l-2.09 5.46L4 9.97l4.46 4.53-1.64 5.81L12 17.27z"
      />
    </svg>
  );
}
