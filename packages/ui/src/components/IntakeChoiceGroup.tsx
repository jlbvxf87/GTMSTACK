import type { IntakeChoice } from "./types";

export type IntakeChoiceGroupProps = {
  /** Form field name. */
  name: string;
  legend: string;
  /** Optional helper text under the legend. */
  helperText?: string;
  /** Inline error message. */
  error?: string;
  /** Multi-select renders as checkboxes; single-select renders as radios. */
  multiple?: boolean;
  /** Required (only enforced visually + by native validation on single-select). */
  required?: boolean;
  options: IntakeChoice[];
  /** Pre-selected value(s). String for single-select, array for multi-select. */
  defaultValue?: string | string[];
  /** Grid columns at >= sm. Defaults to 2. */
  columns?: 1 | 2 | 3;
};

/**
 * IntakeChoiceGroup — radio / checkbox card list. Server component.
 *
 * Pure native form control. CSS targets `:checked` to elevate the active card,
 * so no client JS is required. Multi-select uses checkboxes (same `name` per
 * input; the form parses them as an array on the server).
 */
export function IntakeChoiceGroup({
  name,
  legend,
  helperText,
  error,
  multiple,
  required,
  options,
  defaultValue,
  columns = 2,
}: IntakeChoiceGroupProps) {
  const inputType = multiple ? "checkbox" : "radio";
  const selected = new Set<string>(
    Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : [],
  );

  const gridClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2";

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="font-body text-body font-medium text-foreground">{legend}</legend>

      {helperText && !error ? (
        <p className="text-small text-muted-foreground">{helperText}</p>
      ) : null}

      <div className={`grid ${gridClass} gap-3`}>
        {options.map((opt) => {
          const id = `intake-${name}-${opt.value}`;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className="group relative flex cursor-pointer items-start gap-3 rounded-card border-card border-border bg-background p-4 transition-colors duration-DEFAULT ease-themed has-[:checked]:border-brand has-[:checked]:bg-muted/40"
            >
              <input
                id={id}
                name={multiple ? `${name}[]` : name}
                type={inputType}
                value={opt.value}
                defaultChecked={selected.has(opt.value)}
                required={!multiple && required}
                className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-brand"
              />
              <span className="flex flex-col gap-1">
                <span className="font-body font-medium text-foreground">{opt.label}</span>
                {opt.description ? (
                  <span className="text-small text-muted-foreground">{opt.description}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>

      {error ? <p className="text-small text-destructive">{error}</p> : null}
    </fieldset>
  );
}
