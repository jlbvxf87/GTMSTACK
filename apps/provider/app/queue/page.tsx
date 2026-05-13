import Link from "next/link";

import {
  listPendingIntakes,
  type PendingIntakeRow,
} from "@gtmstack/database-core";

import { requireProvider } from "../../lib/require-provider";

export const dynamic = "force-dynamic";

/**
 * /queue — pending intake queue, newest first. We default to status=pending_review
 * but providers can browse other statuses via ?status=approved etc.
 */
export default async function QueuePage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: PendingIntakeRow["status"] }>;
}) {
  const { client, provider } = await requireProvider();
  const sp = (await searchParams) ?? {};
  const status = sp.status ?? "pending_review";

  const intakes = await listPendingIntakes(client, { status });

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="text-eyebrow uppercase tracking-wide text-muted-foreground">
            Provider portal
          </p>
          <h1 className="font-display text-h1 text-foreground">Intake queue</h1>
          <p className="mt-2 text-body text-muted-foreground">
            Signed in as {provider.display_name ?? provider.email}. Licensed in{" "}
            {provider.licensed_states.length > 0
              ? provider.licensed_states.join(", ")
              : "no states on file"}
            .
          </p>
        </div>
        <form action="/signout" method="post">
          <button
            type="submit"
            className="text-small text-muted-foreground underline hover:text-foreground"
          >
            Sign out
          </button>
        </form>
      </header>

      <nav className="mb-6 flex gap-2 text-small">
        {(["pending_review", "more_info", "approved", "declined"] as const).map((s) => (
          <Link
            key={s}
            href={s === "pending_review" ? "/queue" : `/queue?status=${s}`}
            className={[
              "rounded-button border px-3 py-1.5 transition-colors duration-DEFAULT ease-themed",
              status === s
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
            ].join(" ")}
          >
            {labelFor(s)}
          </Link>
        ))}
      </nav>

      {intakes.length === 0 ? (
        <EmptyState status={status} />
      ) : (
        <ul className="flex flex-col gap-3">
          {intakes.map((intake) => (
            <li key={intake.id}>
              <Link
                href={`/queue/${intake.id}`}
                className="block rounded-card border border-border bg-card p-5 transition-colors duration-DEFAULT ease-themed hover:border-foreground"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-body text-small text-muted-foreground">
                      {intake.product_slug} · org {intake.organization_id.slice(0, 8)}…
                    </p>
                    <p className="mt-1 font-display text-h3 text-foreground">
                      {intake.customer_email}
                    </p>
                    <p className="mt-2 text-small text-muted-foreground">
                      Submitted {relativeTime(intake.created_at)}
                    </p>
                  </div>
                  <StatusBadge status={intake.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function EmptyState({ status }: { status: PendingIntakeRow["status"] }) {
  return (
    <div className="rounded-card border border-dashed border-border bg-card/40 p-12 text-center">
      <p className="font-display text-h3 text-foreground">No intakes here.</p>
      <p className="mt-2 text-small text-muted-foreground">
        {status === "pending_review"
          ? "Nothing waiting for review. The queue updates as customers complete clinical-tier intake flows."
          : `No ${labelFor(status).toLowerCase()} intakes yet.`}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: PendingIntakeRow["status"] }) {
  const tone =
    status === "pending_review"
      ? "border-amber-400 text-amber-600"
      : status === "approved"
        ? "border-emerald-500 text-emerald-700"
        : status === "declined"
          ? "border-rose-500 text-rose-700"
          : "border-sky-500 text-sky-700";
  return (
    <span
      className={`whitespace-nowrap rounded-full border px-3 py-1 text-eyebrow uppercase tracking-wide ${tone}`}
    >
      {labelFor(status)}
    </span>
  );
}

function labelFor(s: PendingIntakeRow["status"]): string {
  if (s === "pending_review") return "Pending review";
  if (s === "more_info") return "Needs info";
  if (s === "approved") return "Approved";
  return "Declined";
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const ms = Date.now() - then;
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
