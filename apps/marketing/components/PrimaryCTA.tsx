import type { ReactNode } from "react";

export type PrimaryCTAProps = {
  href: string;
  children: ReactNode;
  /** "lg" matches Stan's hero CTA; "md" for inline density. */
  size?: "md" | "lg";
};

/**
 * Stan-style primary CTA — deep black pill, soft shadow underneath that
 * reads as a glow, right-arrow icon. Used wherever a single decisive action
 * is asked of the visitor.
 *
 * Hover: lifts slightly + shadow intensifies. No color shift — the button is
 * already at full contrast.
 */
export function PrimaryCTA({ href, children, size = "lg" }: PrimaryCTAProps) {
  const sizing =
    size === "lg" ? "px-10 py-5 text-h3" : "px-7 py-3.5 text-body";

  return (
    <a
      href={href}
      className={[
        "group relative inline-flex items-center justify-center gap-3 rounded-full bg-black font-body font-semibold text-white",
        "shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45),0_8px_18px_-8px_rgba(0,0,0,0.35)]",
        "transition-[transform,box-shadow,filter] duration-DEFAULT ease-themed",
        "hover:-translate-y-[1px] hover:brightness-110",
        "hover:shadow-[0_22px_48px_-12px_rgba(0,0,0,0.55),0_12px_24px_-8px_rgba(0,0,0,0.45)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        sizing,
      ].join(" ")}
    >
      <span>{children}</span>
      <span
        aria-hidden
        className="inline-flex h-6 w-6 items-center justify-center transition-transform duration-DEFAULT ease-themed group-hover:translate-x-0.5"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="13 6 19 12 13 18" />
        </svg>
      </span>
    </a>
  );
}
