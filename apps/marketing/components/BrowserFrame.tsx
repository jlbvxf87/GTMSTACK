import type { ReactNode } from "react";

/**
 * Stylized browser-chrome wrapper for hero / preview screenshots.
 *
 * Wraps a child component in a faux Chrome window (traffic-light buttons,
 * subtle address bar) so live-rendered components read as "screenshots" of
 * the product. Used by the hero mockup and the template-family previews.
 */
export function BrowserFrame({
  url,
  children,
  className = "",
}: {
  url: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-image border-card border-border bg-background shadow-card ${className}`}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-3 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-destructive/70" />
          <span className="h-3 w-3 rounded-full bg-accent/70" />
          <span className="h-3 w-3 rounded-full bg-brand/70" />
        </div>
        <div className="mx-auto flex max-w-[280px] flex-1 items-center justify-center rounded-full bg-background px-3 py-1 text-center font-mono text-[11px] tracking-tight text-muted-foreground">
          {url}
        </div>
        <div className="h-3 w-3" />
      </div>

      {/* Window contents */}
      <div className="bg-background">{children}</div>
    </div>
  );
}
