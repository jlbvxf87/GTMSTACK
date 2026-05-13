import * as React from "react";

import { Sparkline, type SparklinePoint } from "./Sparkline";

export type TrendCardProps = {
  title: string;
  subtitle?: string;
  series: SparklinePoint[];
  /** Formatter for the headline number (the last point's value). */
  formatHeadline?: (v: number) => string;
  /** Formatter for the secondary stat (sum of series, or whatever the caller wants). */
  formatSecondary?: (v: number) => string;
  secondaryLabel?: string;
};

/**
 * Larger sparkline card for dashboard trend rows. Computes its own headline
 * + secondary from the series so callers don't need to repeat themselves.
 */
export function TrendCard({
  title,
  subtitle,
  series,
  formatHeadline = (v) => v.toLocaleString(),
  formatSecondary,
  secondaryLabel,
}: TrendCardProps) {
  const last = series.length > 0 ? series[series.length - 1]!.value : 0;
  const sum = series.reduce((a, b) => a + b.value, 0);

  return (
    <div className="flex flex-col gap-4 rounded-card border border-border bg-card p-6">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h3 className="font-display text-h3 text-foreground">{title}</h3>
          {subtitle ? (
            <p className="text-small text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        <div className="text-right">
          <div className="font-display text-h2 text-foreground">
            {formatHeadline(last)}
          </div>
          {formatSecondary && secondaryLabel ? (
            <div className="text-small text-muted-foreground">
              {secondaryLabel}: {formatSecondary(sum)}
            </div>
          ) : null}
        </div>
      </div>
      <div className="text-brand">
        <Sparkline data={series} width={680} height={120} strokeWidth={2} />
      </div>
    </div>
  );
}
