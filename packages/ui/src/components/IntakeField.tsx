import type { HTMLInputAutoCompleteAttribute } from "react";

export type IntakeFieldProps = {
  name: string;
  label: string;
  /** Defaults to "text". */
  type?: "text" | "email" | "tel";
  /** Render as <textarea>? Overrides `type`. */
  multiline?: boolean;
  /** Rows for textarea when multiline. */
  rows?: number;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  /** Helper text under the input. */
  helperText?: string;
  /** Inline error message — when present, helperText is suppressed. */
  error?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  /** HTML pattern attribute for native validation. */
  pattern?: string;
  /** Max length. */
  maxLength?: number;
};

/**
 * IntakeField — a labeled text input or textarea. Server component.
 *
 * Pure native form control, no client JS. Renders with error or helper text
 * underneath. Always pair with a server action that validates via zod and
 * re-renders this component with the appropriate `error` on failure.
 */
export function IntakeField({
  name,
  label,
  type = "text",
  multiline,
  rows = 4,
  defaultValue,
  required,
  placeholder,
  helperText,
  error,
  autoComplete,
  pattern,
  maxLength,
}: IntakeFieldProps) {
  const inputId = `intake-${name}`;
  const helperId = `${inputId}-help`;
  const errorId = `${inputId}-error`;
  const describedBy = error ? errorId : helperText ? helperId : undefined;

  const shared =
    "w-full rounded-button border-card bg-background px-4 py-3 font-body text-body text-foreground placeholder:text-muted-foreground/60 transition-colors duration-DEFAULT ease-themed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const borderClass = error ? "border-destructive" : "border-border focus-visible:border-brand";

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="font-body text-body font-medium text-foreground">
        {label}
        {required ? <span className="ml-1 text-destructive" aria-hidden>*</span> : null}
      </label>

      {multiline ? (
        <textarea
          id={inputId}
          name={name}
          rows={rows}
          defaultValue={defaultValue}
          required={required}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={`${shared} ${borderClass}`}
        />
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          defaultValue={defaultValue}
          required={required}
          placeholder={placeholder}
          maxLength={maxLength}
          pattern={pattern}
          autoComplete={autoComplete}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={`${shared} ${borderClass}`}
        />
      )}

      {error ? (
        <p id={errorId} className="text-small text-destructive">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-small text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
