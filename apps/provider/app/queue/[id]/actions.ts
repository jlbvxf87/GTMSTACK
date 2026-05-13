"use server";

import { redirect } from "next/navigation";

import {
  getPendingIntake,
  insertEvent,
  insertIntakeMessage,
  reviewPendingIntake,
} from "@gtmstack/database-core";
import { JOB_EVENTS, dispatch } from "@gtmstack/jobs";

import { requireProvider } from "../../../lib/require-provider";
import { supabaseAdmin } from "../../../lib/supabase";

const VALID_DECISIONS = new Set(["approved", "declined", "more_info"] as const);
type Decision = "approved" | "declined" | "more_info";

export async function reviewAction(formData: FormData): Promise<void> {
  const { client, provider } = await requireProvider();

  const intakeId = String(formData.get("intakeId") ?? "");
  const decision = String(formData.get("decision") ?? "") as Decision;
  const decisionNotes = String(formData.get("decisionNotes") ?? "").trim() || undefined;

  if (!intakeId || !VALID_DECISIONS.has(decision)) {
    redirect(`/queue/${intakeId || ""}?error=invalid`);
  }

  // 1. Flip the intake status. RLS only lets a logged-in provider do this.
  const updated = await reviewPendingIntake(client, {
    intakeId,
    decision,
    decisionNotes,
  });
  if (!updated) {
    redirect(`/queue/${intakeId}?error=write`);
  }

  // 2. Append a system message recording the decision.
  await insertIntakeMessage(client, {
    pendingIntakeId: intakeId,
    author: "system",
    body: messageFor(decision, decisionNotes),
  });

  // 3. Reload to get organization_id for the audit event + dispatch.
  const intake = await getPendingIntake(client, intakeId);
  if (intake) {
    // Audit event. Service-role write so it lands regardless of RLS.
    await insertEvent(supabaseAdmin(), {
      organizationId: intake.organization_id,
      type: "intake.reviewed",
      payload: {
        pendingIntakeId: intake.id,
        decision,
        providerId: provider.id,
        productSlug: intake.product_slug,
      },
    });

    // Inngest dispatch. Cancels the pending-reminder + may trigger
    // an approved-welcome chain in a later sprint.
    await dispatch(JOB_EVENTS.INTAKE_REVIEWED, {
      organizationId: intake.organization_id,
      pendingIntakeId: intake.id,
      customerEmail: intake.customer_email,
      decision,
      providerId: provider.id,
    });
  }

  redirect(`/queue/${intakeId}`);
}

function messageFor(decision: Decision, notes?: string): string {
  const base =
    decision === "approved"
      ? "Your intake has been approved. Your order is moving to fulfillment."
      : decision === "declined"
        ? "Your provider has reviewed your intake and is unable to approve this protocol at this time."
        : "Your provider has reviewed your intake and needs a bit more information before approving.";
  return notes ? `${base}\n\nFrom your provider: ${notes}` : base;
}
