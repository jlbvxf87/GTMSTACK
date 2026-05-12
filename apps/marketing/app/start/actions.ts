"use server";

import { redirect } from "next/navigation";

import {
  AccountSchema,
  GoalsSchema,
  HealthSchema,
  HREF_BY_STEP,
  PreferencesSchema,
  clearIntakeState,
  nextHref,
  readIntakeState,
  writeIntakeState,
} from "./state";

/**
 * Generic step handler — validate with the given schema, merge the result into
 * the cookie state under `slot`, and redirect to the next step on success.
 *
 * On validation failure, redirects back to the same step with `?error=1`. The
 * page reads that and re-renders with submitted values + inline messages. We
 * keep error reporting coarse here (one flag) for V1; per-field errors come
 * when the form-state hook lands in Sprint 7.
 */
async function handleStep<TSchema extends import("zod").ZodTypeAny>(
  schema: TSchema,
  formData: FormData,
  step: keyof typeof HREF_BY_STEP,
  slot: "goals" | "health" | "preferences" | "account",
  collect: (form: FormData) => Record<string, unknown>,
): Promise<void> {
  const parsed = schema.safeParse(collect(formData));
  if (!parsed.success) {
    redirect(`${HREF_BY_STEP[step]}?error=1`);
  }
  const state = await readIntakeState();
  await writeIntakeState({ ...state, [slot]: parsed.data });
  redirect(nextHref(step));
}

export async function submitGoals(formData: FormData): Promise<void> {
  await handleStep(GoalsSchema, formData, "goals", "goals", (f) => ({
    primaryGoal: f.get("primaryGoal"),
    goals: f.getAll("goals[]").map(String),
  }));
}

export async function submitHealth(formData: FormData): Promise<void> {
  await handleStep(HealthSchema, formData, "health", "health", (f) => ({
    age: f.get("age"),
    activityLevel: f.get("activityLevel"),
    sleepQuality: f.get("sleepQuality"),
    medicalNotes: f.get("medicalNotes") ?? "",
  }));
}

export async function submitPreferences(formData: FormData): Promise<void> {
  await handleStep(PreferencesSchema, formData, "preferences", "preferences", (f) => ({
    coachingFrequency: f.get("coachingFrequency"),
    deliveryCadence: f.get("deliveryCadence"),
    communicationChannel: f.get("communicationChannel"),
  }));
}

export async function submitAccount(formData: FormData): Promise<void> {
  await handleStep(AccountSchema, formData, "account", "account", (f) => ({
    firstName: f.get("firstName"),
    lastName: f.get("lastName"),
    email: f.get("email"),
    phone: f.get("phone") ?? "",
  }));
}

/**
 * Final submit — stamp `submittedAt` and redirect to /start/welcome. Sprint 7
 * replaces this with a write into the clinical Supabase project + audit log.
 */
export async function submitReview(): Promise<void> {
  const state = await readIntakeState();
  await writeIntakeState({ ...state, submittedAt: new Date().toISOString() });
  redirect("/start/welcome");
}

/**
 * Start over — clear the cookie and redirect to /start. Used by the welcome
 * page's "Start a new intake" link.
 */
export async function resetIntake(): Promise<void> {
  await clearIntakeState();
  redirect("/start");
}
