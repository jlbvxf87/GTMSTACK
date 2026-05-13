import * as React from "react";

import { Sparkline, type SparklinePoint } from "./Sparkline";

export type MetricTileProps = {
  label: string;
  value: string;
  /** e.g. `+12.4%` — rendered with green if starts with `+`, rose if `-`. */
  delta?: string;
  hint?: string;
  spark?: SparklinePoint[];
};

/**
 * Operator-dashboard metric tile. SSR-only, no client state. Sparkline reads
 * currentColor — apply a brand color via wrapping `<div className="text-brand">`
 * if you want it to pop.
 */
export function MetricTile({ label, value, delta, hint, spark }: MetricTileProps) {
  const deltaTone = !delta
    ? ""
    : delta.startsWith("+")
      ? "text-emerald-600"
      : delta.startsWith("-")
        ? "text-rose-600"
        : "text-muted-foreground";

  return (
    <div className="flex flex-col gap-3 rounded-card border border-border bg-card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-eyebrow uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        {delta ? (
          <span className={`font-mono text-small ${deltaTone}`}>{delta}</span>
        ) : null}
      </div>
      <div className="font-display text-h2 text-foreground">{value}</div>
      {hint ? (
        <div className="text-small text-muted-foreground">{hint}</div>
      ) : null}
      {spark ? (
        <div className="text-brand">
          <Sparkline data={spark} width={240} height={36} strokeWidth={1.5} />
        </div>
      ) : null}
    </div>
  );
}
