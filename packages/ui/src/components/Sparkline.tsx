import * as React from "react";

export type SparklinePoint = {
  date: string;
  value: number;
};

export type SparklineProps = {
  data: SparklinePoint[];
  /** rendered SVG width in CSS px */
  width?: number;
  /** rendered SVG height in CSS px */
  height?: number;
  /** stroke uses currentColor by default — wrap in `text-brand` to recolor */
  strokeWidth?: number;
  /** fill under the line. `none` to disable. */
  fill?: "none" | "subtle" | "filled";
  className?: string;
  ariaLabel?: string;
};

/**
 * Themeless SVG sparkline. Renders at full domain — caller is responsible for
 * windowing the data. Reads `currentColor` so the line picks up any text-color
 * Tailwind utility on the wrapper. SSR-safe; no client hooks.
 */
export function Sparkline({
  data,
  width = 240,
  height = 56,
  strokeWidth = 2,
  fill = "subtle",
  className,
  ariaLabel,
}: SparklineProps) {
  if (data.length < 2) {
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className={className}
        role="img"
        aria-label={ariaLabel ?? "No data yet"}
      >
        <line
          x1={0}
          x2={width}
          y1={height / 2}
          y2={height / 2}
          stroke="currentColor"
          strokeOpacity={0.18}
          strokeDasharray="2 4"
        />
      </svg>
    );
  }

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = data.length === 1 ? width : width / (data.length - 1);

  const points = data.map((d, i) => {
    const x = i * stepX;
    const y = height - ((d.value - min) / range) * (height - strokeWidth * 2) - strokeWidth;
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

  const areaPath = `${linePath} L${width.toFixed(2)},${height} L0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={ariaLabel ?? `Trend across ${data.length} days`}
    >
      {fill !== "none" ? (
        <path
          d={areaPath}
          fill="currentColor"
          fillOpacity={fill === "filled" ? 0.18 : 0.08}
        />
      ) : null}
      <path
        d={linePath}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
