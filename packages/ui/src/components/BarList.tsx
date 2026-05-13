import * as React from "react";

export type BarListItem = {
  label: string;
  value: number;
  subLabel?: string;
};

export type BarListProps = {
  items: BarListItem[];
  /** Format the right-aligned value. Defaults to `n.toLocaleString()`. */
  formatValue?: (v: number) => string;
  /** Empty state message. */
  emptyLabel?: string;
};

/**
 * Bar list — Vercel-style ranked rows. Bars sized as a fraction of the max
 * value in the set. Reads `currentColor` for the bar tint; wrap in a
 * `text-brand` ancestor to color.
 */
export function BarList({
  items,
  formatValue = (v) => v.toLocaleString(),
  emptyLabel = "No data yet.",
}: BarListProps) {
  if (items.length === 0) {
    return (
      <p className="text-small text-muted-foreground">{emptyLabel}</p>
    );
  }

  const max = Math.max(...items.map((i) => i.value)) || 1;

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => {
        const pct = Math.max(2, Math.round((item.value / max) * 100));
        return (
          <li key={item.label} className="relative">
            <div
              aria-hidden
              className="absolute inset-y-0 left-0 rounded-md bg-current opacity-10"
              style={{ width: `${pct}%` }}
            />
            <div className="relative flex items-center justify-between px-3 py-2">
              <div className="flex flex-col">
                <span className="font-body text-body text-foreground">{item.label}</span>
                {item.subLabel ? (
                  <span className="text-small text-muted-foreground">{item.subLabel}</span>
                ) : null}
              </div>
              <span className="font-mono text-small text-foreground">
                {formatValue(item.value)}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
