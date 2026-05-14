import type { ReactNode } from "react";

import { PrimaryCTA } from "./PrimaryCTA";

export type ImageStorySectionProps = {
  id?: string;
  eyebrow?: string;
  headline?: string;
  subhead?: ReactNode;
  imageSrc: string;
  imageAlt: string;
  /**
   * `image` → image stands alone as the section (the image already carries
   * baked-in headlines and supporting layout).
   * `split-left` → copy left, image right.
   * `split-right` → image left, copy right.
   * Defaults to `image`.
   */
  layout?: "image" | "split-left" | "split-right";
  /** Background, applied to the section wrapper. Defaults to white. */
  tone?: "white" | "neutral";
  cta?: { label: string; href: string };
};

/**
 * Stan.store-style story section. Each of the user's pre-composed marketing
 * mocks (Top Founders / Testimonials / Platform / 3-Steps) becomes its own
 * full-bleed instance of this. The image is the message; chrome is minimal.
 */
export function ImageStorySection({
  id,
  eyebrow,
  headline,
  subhead,
  imageSrc,
  imageAlt,
  layout = "image",
  tone = "white",
  cta,
}: ImageStorySectionProps) {
  const bg = tone === "neutral" ? "bg-[#f6f5f3]" : "bg-white";

  if (layout === "image") {
    return (
      <section id={id} className={`w-full ${bg} text-black`}>
        <div className="mx-auto max-w-container px-4 py-16 sm:px-6 md:px-10 md:py-32">
          {eyebrow || headline || subhead ? (
            <div className="px-2 sm:px-0">
              {eyebrow ? (
                <p className="font-body text-small font-semibold uppercase tracking-[0.18em] text-black/50">
                  {eyebrow}
                </p>
              ) : null}
              {headline ? (
                <h2 className="mt-4 max-w-3xl font-body text-[clamp(1.875rem,4.5vw+1rem,4.25rem)] font-bold leading-[1] tracking-tight text-black">
                  {headline}
                </h2>
              ) : null}
              {subhead ? (
                <p className="mt-4 max-w-2xl font-body text-base leading-snug text-black/70 sm:text-h3">
                  {subhead}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className={`${eyebrow || headline ? "mt-8 md:mt-14" : ""}`}>
            <img
              src={imageSrc}
              alt={imageAlt}
              className="block h-auto w-full"
              loading="lazy"
            />
          </div>

          {cta ? (
            <div className="mt-10 flex justify-center md:mt-14">
              <PrimaryCTA href={cta.href}>{cta.label}</PrimaryCTA>
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  // split-left or split-right
  const copyFirst = layout === "split-left";
  return (
    <section id={id} className={`w-full ${bg} text-black`}>
      <div className="mx-auto grid max-w-container grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 md:gap-12 md:px-10 md:py-32 lg:grid-cols-12 lg:gap-16">
        <div className={`lg:col-span-6 ${copyFirst ? "" : "lg:col-start-7"}`}>
          {eyebrow ? (
            <p className="font-body text-small font-semibold uppercase tracking-[0.18em] text-black/50">
              {eyebrow}
            </p>
          ) : null}
          {headline ? (
            <h2 className="mt-stack font-body text-[clamp(2.25rem,4vw+1rem,4rem)] font-bold leading-[0.98] tracking-tight text-black">
              {headline}
            </h2>
          ) : null}
          {subhead ? (
            <p className="mt-6 max-w-xl font-body text-h3 text-black/70">
              {subhead}
            </p>
          ) : null}
          {cta ? (
            <div className="mt-12">
              <PrimaryCTA href={cta.href}>{cta.label}</PrimaryCTA>
            </div>
          ) : null}
        </div>
        <div
          className={`lg:col-span-6 ${copyFirst ? "lg:col-start-7" : "lg:col-start-1 lg:row-start-1"}`}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className="block w-full h-auto"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
