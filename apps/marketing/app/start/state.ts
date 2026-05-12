import "server-only";
import { cookies } from "next/headers";
import { z } from "zod";

import type { IntakeStep, IntakeStepKey } from "@gtmstack/ui";

// ---------------------------------------------------------------------------
// Step definitions — shared across pages and the stepper.
// ---------------------------------------------------------------------------

export const INTAKE_STEPS: IntakeStep[] = [
  { key: "goals", label: "Goals", hint: "What you want from the program" },
  { key: "health", label: "Health", hint: "A snapshot of you" },
  { key: "preferences", label: "Preferences", hint: "How we work together" },
  { key: "account", label: "Account", hint: "Where to send things" },
  { key: "review", label: "Review", hint: "Confirm and submit" },
];

export const HREF_BY_STEP: Record<IntakeStepKey, string> = {
  goals: "/start",
  health: "/start/health",
  preferences: "/start/preferences",
  account: "/start/account",
  review: "/start/review",
};

export function nextStep(current: IntakeStepKey): IntakeStepKey | "welcome" {
  const order: IntakeStepKey[] = ["goals", "health", "preferences", "account", "review"];
  const i = order.indexOf(current);
  if (i === -1 || i === order.length - 1) return "welcome";
  return order[i + 1]!;
}

export function nextHref(current: IntakeStepKey): string {
  const n = nextStep(current);
  return n === "welcome" ? "/start/welcome" : HREF_BY_STEP[n];
}

// ---------------------------------------------------------------------------
// State schema. All step fields optional; each step writes its slice.
// ---------------------------------------------------------------------------

const NonEmptyString = z.string().trim().min(1);

export const GoalsSchema = z.object({
  primaryGoal: NonEmptyString,
  goals: z.array(NonEmptyString).min(1, "Pick at least one focus area"),
});
export type GoalsInput = z.infer<typeof GoalsSchema>;

export const HealthSchema = z.object({
  age: NonEmptyString,
  activityLevel: NonEmptyString,
  sleepQuality: NonEmptyString,
  medicalNotes: z.string().trim().max(1000).optional().default(""),
});
export type HealthInput = z.infer<typeof HealthSchema>;

export const PreferencesSchema = z.object({
  coachingFrequency: NonEmptyString,
  deliveryCadence: NonEmptyString,
  communicationChannel: NonEmptyString,
});
export type PreferencesInput = z.infer<typeof PreferencesSchema>;

export const AccountSchema = z.object({
  firstName: NonEmptyString.max(60),
  lastName: NonEmptyString.max(60),
  email: z.string().trim().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+()\-.\s]{7,20}$/, "Use only digits, spaces, and + - ( )")
    .optional()
    .or(z.literal("")),
});
export type AccountInput = z.infer<typeof AccountSchema>;

export const IntakeStateSchema = z.object({
  goals: GoalsSchema.partial().optional(),
  health: HealthSchema.partial().optional(),
  preferences: PreferencesSchema.partial().optional(),
  account: AccountSchema.partial().optional(),
  submittedAt: z.string().optional(),
});
export type IntakeState = z.infer<typeof IntakeStateSchema>;

// ---------------------------------------------------------------------------
// Cookie I/O.
//
// TODO(sprint-7): replace JSON cookie with Supabase Auth signed session + a
// `clinical.intakes` row keyed on the auth user. Audit log every read.
// ---------------------------------------------------------------------------

const COOKIE_NAME = "intake_state";

export async function readIntakeState(): Promise<IntakeState> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return {};
  try {
    const decoded = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    const parsed = IntakeStateSchema.safeParse(decoded);
    return parsed.success ? parsed.data : {};
  } catch {
    return {};
  }
}

export async function writeIntakeState(next: IntakeState): Promise<void> {
  const store = await cookies();
  const payload = Buffer.from(JSON.stringify(next), "utf8").toString("base64");
  store.set(COOKIE_NAME, payload, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // 24 hours — long enough to finish intake later, short enough not to leak.
    maxAge: 60 * 60 * 24,
  });
}

export async function clearIntakeState(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export function completedKeys(state: IntakeState): IntakeStepKey[] {
  const out: IntakeStepKey[] = [];
  if (state.goals?.primaryGoal) out.push("goals");
  if (state.health?.age) out.push("health");
  if (state.preferences?.coachingFrequency) out.push("preferences");
  if (state.account?.email) out.push("account");
  return out;
}

// ---------------------------------------------------------------------------
// Option lists — single source of truth for choice groups and review summary.
// ---------------------------------------------------------------------------

import type { IntakeChoice } from "@gtmstack/ui";

export const PRIMARY_GOAL_OPTIONS: IntakeChoice[] = [
  { value: "sleep", label: "Better sleep", description: "Wake actually rested" },
  { value: "energy", label: "Sustainable energy", description: "No 3 PM crashes" },
  { value: "recovery", label: "Faster recovery", description: "Train hard, recover harder" },
  { value: "longevity", label: "Long-term health", description: "Optimize the 30-year horizon" },
];

export const FOCUS_AREA_OPTIONS: IntakeChoice[] = [
  { value: "sleep", label: "Sleep quality" },
  { value: "energy", label: "Daily energy" },
  { value: "recovery", label: "Recovery after training" },
  { value: "stress", label: "Stress resilience" },
  { value: "focus", label: "Focus & cognition" },
  { value: "mood", label: "Mood stability" },
];

export const ACTIVITY_LEVEL_OPTIONS: IntakeChoice[] = [
  { value: "low", label: "Mostly sedentary", description: "Desk job, light walks" },
  { value: "moderate", label: "Active", description: "2–4 training sessions a week" },
  { value: "high", label: "Athlete", description: "5+ sessions, training blocks" },
];

export const SLEEP_OPTIONS: IntakeChoice[] = [
  { value: "good", label: "I sleep well most nights" },
  { value: "uneven", label: "Some good nights, some rough" },
  { value: "rough", label: "Most nights are rough" },
];

export const COACHING_OPTIONS: IntakeChoice[] = [
  { value: "monthly", label: "Monthly check-ins", description: "A 20-minute call once a month" },
  { value: "biweekly", label: "Every two weeks", description: "Closer cadence at the start" },
  { value: "async", label: "Async only", description: "Message thread, no scheduled calls" },
];

export const CADENCE_OPTIONS: IntakeChoice[] = [
  { value: "monthly", label: "Monthly", description: "Ship on the same day each month" },
  { value: "60day", label: "Every 60 days", description: "Larger shipment, less frequent" },
];

export const COMMS_OPTIONS: IntakeChoice[] = [
  { value: "email", label: "Email", description: "Best for non-urgent updates" },
  { value: "sms", label: "Text", description: "Reminders and short check-ins" },
  { value: "app", label: "In-app only", description: "Notifications via the member dashboard" },
];

export const AGE_OPTIONS: IntakeChoice[] = [
  { value: "18-29", label: "18–29" },
  { value: "30-39", label: "30–39" },
  { value: "40-49", label: "40–49" },
  { value: "50-59", label: "50–59" },
  { value: "60+", label: "60+" },
];

// ---------------------------------------------------------------------------
// Pretty-printing for the review screen.
// ---------------------------------------------------------------------------

export function labelOf(options: IntakeChoice[], value: string | undefined): string {
  if (!value) return "";
  return options.find((o) => o.value === value)?.label ?? value;
}

export function labelsOf(options: IntakeChoice[], values: string[] | undefined): string {
  if (!values?.length) return "";
  return values.map((v) => labelOf(options, v)).filter(Boolean).join(", ");
}
