/**
 * Lightweight SVG product packshot used inside the brand-voice phone preview.
 *
 * We don't have real product photography per-brand in the repo (and shouldn't
 * stand in stock images that would mislead). So we render a clean illustrated
 * bottle in the brand's aesthetic — reads like a real product packshot at
 * thumbnail size, scales infinitely, and adapts to any product name we feed
 * it. Three visual variants per theme so a list of products doesn't look
 * stamped from one mold.
 */

export type ProductPackshotProps = {
  productName: string;
  /** Picks the silhouette shape: pill bottle, tub, sachet. Defaults to bottle. */
  vessel?: "bottle" | "tub" | "sachet";
  /** Color treatment. */
  tone?: "ink" | "cream" | "amber";
  size?: number;
};

export function ProductPackshot({
  productName,
  vessel = "bottle",
  tone = "ink",
  size = 56,
}: ProductPackshotProps) {
  const palette = palettes[tone];
  const label = shortenName(productName);

  return (
    <svg
      viewBox="0 0 64 80"
      width={size}
      height={(size * 80) / 64}
      role="img"
      aria-label={`${productName} packshot`}
    >
      {vessel === "tub" ? (
        <TubBody palette={palette} label={label} />
      ) : vessel === "sachet" ? (
        <SachetBody palette={palette} label={label} />
      ) : (
        <BottleBody palette={palette} label={label} />
      )}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Vessels
// ---------------------------------------------------------------------------

type Palette = {
  body: string;
  bodyShadow: string;
  cap: string;
  label: string;
  labelText: string;
  highlight: string;
};

const palettes: Record<NonNullable<ProductPackshotProps["tone"]>, Palette> = {
  ink: {
    body: "#0E0E10",
    bodyShadow: "#000000",
    cap: "#1F1F22",
    label: "#F4EFE6",
    labelText: "#0E0E10",
    highlight: "rgba(255,255,255,0.12)",
  },
  cream: {
    body: "#EAE2D2",
    bodyShadow: "#D5C9B0",
    cap: "#0E0E10",
    label: "#FFFFFF",
    labelText: "#0E0E10",
    highlight: "rgba(255,255,255,0.55)",
  },
  amber: {
    body: "#6A4D24",
    bodyShadow: "#4A3617",
    cap: "#0E0E10",
    label: "#F0E2C0",
    labelText: "#3A2A12",
    highlight: "rgba(255,220,160,0.32)",
  },
};

function BottleBody({ palette, label }: { palette: Palette; label: string }) {
  return (
    <g>
      {/* Subtle drop shadow */}
      <ellipse cx="32" cy="76" rx="20" ry="2.5" fill="rgba(0,0,0,0.15)" />
      {/* Cap */}
      <rect x="22" y="6" width="20" height="9" rx="2.5" fill={palette.cap} />
      <rect x="22" y="6" width="20" height="2.5" rx="1.25" fill={palette.highlight} />
      {/* Neck */}
      <rect x="26" y="15" width="12" height="3" fill={palette.bodyShadow} />
      {/* Body */}
      <rect x="14" y="18" width="36" height="54" rx="6" fill={palette.body} />
      {/* Body highlight */}
      <rect x="16" y="20" width="4" height="48" rx="2" fill={palette.highlight} />
      {/* Label */}
      <rect x="14" y="34" width="36" height="22" fill={palette.label} />
      <text
        x="32"
        y="46"
        textAnchor="middle"
        fontSize="6"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fill={palette.labelText}
      >
        {label}
      </text>
      <line x1="20" y1="50" x2="44" y2="50" stroke={palette.labelText} strokeWidth="0.4" opacity="0.4" />
    </g>
  );
}

function TubBody({ palette, label }: { palette: Palette; label: string }) {
  return (
    <g>
      <ellipse cx="32" cy="76" rx="22" ry="2.5" fill="rgba(0,0,0,0.15)" />
      {/* Lid */}
      <rect x="10" y="10" width="44" height="8" rx="2" fill={palette.cap} />
      <rect x="10" y="10" width="44" height="2" rx="1" fill={palette.highlight} />
      {/* Body */}
      <rect x="12" y="18" width="40" height="54" rx="4" fill={palette.body} />
      <rect x="14" y="20" width="3" height="48" rx="1.5" fill={palette.highlight} />
      {/* Label */}
      <rect x="12" y="34" width="40" height="22" fill={palette.label} />
      <text
        x="32"
        y="46"
        textAnchor="middle"
        fontSize="6"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fill={palette.labelText}
      >
        {label}
      </text>
      <line x1="18" y1="50" x2="46" y2="50" stroke={palette.labelText} strokeWidth="0.4" opacity="0.4" />
    </g>
  );
}

function SachetBody({ palette, label }: { palette: Palette; label: string }) {
  return (
    <g>
      <ellipse cx="32" cy="76" rx="20" ry="2" fill="rgba(0,0,0,0.15)" />
      {/* Crimped top */}
      <path
        d="M16 12 L48 12 L46 16 L18 16 Z"
        fill={palette.cap}
      />
      {/* Body */}
      <rect x="14" y="16" width="36" height="56" rx="2" fill={palette.body} />
      <rect x="16" y="18" width="2" height="50" fill={palette.highlight} />
      {/* Label band */}
      <rect x="14" y="38" width="36" height="18" fill={palette.label} />
      <text
        x="32"
        y="50"
        textAnchor="middle"
        fontSize="6"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fill={palette.labelText}
      >
        {label}
      </text>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shortenName(name: string): string {
  // Keep the first significant word so labels stay readable at thumbnail size.
  const first = name.split(/\s+/)[0] ?? name;
  return first.length > 10 ? first.slice(0, 10).toUpperCase() : first.toUpperCase();
}
