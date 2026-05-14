import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getPendingIntake,
  listIntakeMessages,
} from "@gtmstack/database-core";

import { requireProvider } from "../../../lib/require-provider";
import { reviewAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function IntakeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { client, provider } = await requireProvider();
  const { id } = await params;

  const intake = await getPendingIntake(client, id);
  if (!intake) notFound();

  const messages = await listIntakeMessages(client, id);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/queue"
        className="text-small text-muted-foreground underline hover:text-foreground"
      >
        ← Back to queue
      </Link>

      <header className="mt-4 mb-8">
        <p className="text-eyebrow uppercase tracking-wide text-muted-foreground">
          {intake.product_slug}
        </p>
        <h1 className="font-display text-h1 text-foreground">{intake.customer_email}</h1>
        <p className="mt-2 text-small text-muted-foreground">
          Submitted {new Date(intake.created_at).toLocaleString()} · Status{" "}
          <span className="font-medium text-foreground">{intake.status}</span>
          {intake.reviewed_at ? ` · Reviewed ${new Date(intake.reviewed_at).toLocaleString()}` : null}
        </p>
      </header>

      <section className="mb-10 rounded-card border border-border bg-card p-6">
        <h2 className="font-display text-h3 text-foreground">Intake responses</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {Object.entries(intake.payload).map(([sectionKey, sectionValue]) => (
            <section key={sectionKey} className="min-w-0 border-t border-border/60 pt-4">
              <p className="text-eyebrow uppercase tracking-wide text-muted-foreground">
                {humanize(sectionKey)}
              </p>
              <dl className="mt-3 flex flex-col gap-2">
                {flattenSection(sectionValue).map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <dt className="text-small text-muted-foreground">
                      {humanize(label)}
                    </dt>
                    <dd className="min-w-0 break-words font-body text-body text-foreground">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </section>

      <section className="mb-10 rounded-card border border-border bg-card p-6">
        <h2 className="font-display text-h3 text-foreground">Decision</h2>
        {intake.status === "pending_review" ? (
          <form action={reviewAction} className="mt-4 flex flex-col gap-4">
            <input type="hidden" name="intakeId" value={intake.id} />
            <label className="flex flex-col gap-2">
              <span className="text-small text-foreground">
                Notes for the patient (optional)
              </span>
              <textarea
                name="decisionNotes"
                rows={3}
                className="rounded-card border border-border bg-background px-3 py-2 font-body text-body text-foreground"
                placeholder="What you'd like the patient to see. Plain language."
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <DecisionButton decision="approved" label="Approve" tone="primary" />
              <DecisionButton decision="more_info" label="Request more info" tone="secondary" />
              <DecisionButton decision="declined" label="Decline" tone="danger" />
            </div>
          </form>
        ) : (
          <p className="mt-3 text-small text-muted-foreground">
            Already reviewed{intake.decision_notes ? `: "${intake.decision_notes}"` : "."}
          </p>
        )}
      </section>

      <section>
        <h2 className="font-display text-h3 text-foreground">Messages</h2>
        {messages.length === 0 ? (
          <p className="mt-3 text-small text-muted-foreground">
            No messages yet. A decision posts a system message; replies from the patient
            appear here as they arrive.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {messages.map((m) => (
              <li
                key={m.id}
                className="rounded-card border border-border bg-card p-4"
              >
                <p className="text-eyebrow uppercase tracking-wide text-muted-foreground">
                  {m.author} · {new Date(m.created_at).toLocaleString()}
                </p>
                <p className="mt-2 whitespace-pre-wrap font-body text-body text-foreground">
                  {m.body}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-12 text-eyebrow uppercase tracking-wide text-muted-foreground">
        Signed in as {provider.email}
      </p>
    </main>
  );
}

function DecisionButton({
  decision,
  label,
  tone,
}: {
  decision: "approved" | "declined" | "more_info";
  label: string;
  tone: "primary" | "secondary" | "danger";
}) {
  const cls =
    tone === "primary"
      ? "bg-foreground text-background hover:brightness-[1.1]"
      : tone === "danger"
        ? "border border-rose-500 text-rose-600 hover:bg-rose-500 hover:text-white"
        : "border border-border text-foreground hover:bg-foreground hover:text-background";
  return (
    <button
      type="submit"
      name="decision"
      value={decision}
      className={`inline-flex items-center justify-center rounded-button px-5 py-2 font-body font-medium transition-[transform,filter,background-color,color] duration-DEFAULT ease-themed ${cls}`}
    >
      {label}
    </button>
  );
}

function renderValue(v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "string") return v.length === 0 ? "—" : v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return v.map(renderValue).join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

/**
 * Flatten one section of the intake payload into label/value pairs the UI
 * can render row-by-row. Sections are typically plain objects keyed by
 * field name (e.g. `goals` → `{ primaryGoal: "energy" }`). If a section is
 * itself a primitive or array we wrap it under a synthetic `value` label
 * so the renderer still has something to show.
 */
function flattenSection(section: unknown): { label: string; value: string }[] {
  if (section == null) return [{ label: "value", value: "—" }];
  if (typeof section !== "object" || Array.isArray(section)) {
    return [{ label: "value", value: renderValue(section) }];
  }
  return Object.entries(section as Record<string, unknown>).map(([k, v]) => ({
    label: k,
    value: renderValue(v),
  }));
}

/** Turn `primaryGoal` → `Primary goal`, `sleepQuality` → `Sleep quality`. */
function humanize(key: string): string {
  const spaced = key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}
