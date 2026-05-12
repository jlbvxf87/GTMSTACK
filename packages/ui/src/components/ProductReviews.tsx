import type { ProductReview } from "./types";

export type ProductReviewsProps = {
  eyebrow?: string;
  headline?: string;
  reviews: ProductReview[];
  /** If omitted, computed from `reviews`. */
  averageRating?: number;
  /** If omitted, computed from `reviews.length`. */
  reviewCount?: number;
};

/**
 * ProductReviews — review list with star ratings + summary header.
 * Server component. Emits Product `aggregateRating` JSON-LD when reviews exist.
 */
export function ProductReviews({
  eyebrow,
  headline,
  reviews,
  averageRating,
  reviewCount,
}: ProductReviewsProps) {
  const avg =
    averageRating ??
    (reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0);
  const count = reviewCount ?? reviews.length;

  return (
    <section className="w-full bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-section md:px-10">
        <header className="mb-12 flex flex-col gap-stack md:flex-row md:items-end md:justify-between">
          <div>
            {eyebrow ? (
              <p className="mb-stack font-mono text-small uppercase tracking-[0.18em] text-muted-foreground">
                {eyebrow}
              </p>
            ) : null}
            {headline ? (
              <h2 className="font-display text-h1 text-foreground">{headline}</h2>
            ) : null}
          </div>
          {count > 0 ? (
            <div className="flex flex-col items-start gap-1 md:items-end">
              <StarRow rating={avg} size={20} />
              <p className="text-small text-muted-foreground">
                <span className="font-medium text-foreground">{avg.toFixed(1)}</span> ·{" "}
                {count} review{count === 1 ? "" : "s"}
              </p>
            </div>
          ) : null}
        </header>

        {count === 0 ? (
          <p className="text-body text-muted-foreground">No reviews yet.</p>
        ) : (
          <ul role="list" className="space-y-6">
            {reviews.map((r) => (
              <li key={r.id}>
                <ReviewCard review={r} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: ProductReview }) {
  return (
    <article className="rounded-card border-card border-border bg-background p-6 shadow-card">
      <div className="flex flex-col gap-stack md:flex-row md:items-center md:justify-between">
        <StarRow rating={review.rating} />
        {review.verified ? (
          <span className="self-start rounded-full bg-accent/15 px-2 py-0.5 font-mono text-small uppercase tracking-[0.16em] text-accent md:self-auto">
            Verified purchase
          </span>
        ) : null}
      </div>

      {review.headline ? (
        <h3 className="mt-stack font-display text-h3 text-foreground">{review.headline}</h3>
      ) : null}

      <p className="mt-stack text-body leading-[1.7] text-foreground/90">"{review.quote}"</p>

      <p className="mt-stack text-small text-muted-foreground">
        <span className="font-medium text-foreground">{review.attribution}</span>
        {review.attributionDetail ? (
          <>
            <span aria-hidden> · </span>
            <span>{review.attributionDetail}</span>
          </>
        ) : null}
      </p>
    </article>
  );
}

function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div role="img" aria-label={`${clamped} out of 5 stars`} className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} filled={i < clamped} size={size} />
      ))}
    </div>
  );
}

function Star({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={filled ? "text-accent" : "text-border"}>
      <path
        fill="currentColor"
        d="M12 17.27l5.18 3.04-1.64-5.81L20 9.97l-5.91-.51L12 4l-2.09 5.46L4 9.97l4.46 4.53-1.64 5.81L12 17.27z"
      />
    </svg>
  );
}
