"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { formatNumeric } from "@/lib/science";
import { cn } from "@/lib/utils";

export interface SolveVariable {
  id: string;
  label: string;
  unit: string;
  /** Shown under the field, e.g. a typical range. */
  hint?: string;
  placeholder?: string;
}

export interface DerivedValue {
  label: string;
  value: number;
  unit: string;
}

interface SolveForCalculatorProps {
  variables: SolveVariable[];
  /** Formula shown for each solvable variable, keyed by its id. */
  formulas: Record<string, string>;
  /**
   * Returns the value of `target` from the others, or null when the inputs are
   * incomplete or the maths is undefined (a division by zero, say).
   */
  solve: (values: Record<string, number>, target: string) => number | null;
  /** Extra quantities worth showing alongside the answer. */
  derive?: (values: Record<string, number>) => DerivedValue[];
  defaults: Record<string, string>;
  footnote: React.ReactNode;
}

/**
 * A calculator where any one variable is solved from the others.
 *
 * Six of the science tools are this exact shape — Ohm's law, force, density,
 * kinetic energy, the voltage divider and the LED resistor — so they share one
 * implementation and behave identically. Choosing the unknown rather than
 * filling a fixed field is what makes them useful in both directions.
 */
export function SolveForCalculator({
  variables,
  formulas,
  solve,
  derive,
  defaults,
  footnote,
}: SolveForCalculatorProps) {
  const [target, setTarget] = React.useState(variables[0].id);
  const [values, setValues] = React.useState<Record<string, string>>(defaults);

  const inputs = variables.filter((variable) => variable.id !== target);

  const numeric: Record<string, number> = {};
  let complete = true;
  for (const variable of inputs) {
    const raw = values[variable.id];
    const parsed = Number(raw);
    if (raw === undefined || raw.trim() === "" || !Number.isFinite(parsed)) {
      complete = false;
      continue;
    }
    numeric[variable.id] = parsed;
  }

  const result = complete ? solve(numeric, target) : null;
  const targetVariable = variables.find((variable) => variable.id === target)!;

  const derived =
    derive && complete && result !== null
      ? derive({ ...numeric, [target]: result })
      : [];

  return (
    <div className="space-y-5">
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-foreground">Solve for</legend>
        <div className="flex flex-wrap gap-2">
          {variables.map((variable) => (
            <button
              key={variable.id}
              type="button"
              role="radio"
              aria-checked={target === variable.id}
              onClick={() => setTarget(variable.id)}
              className={cn(
                "inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm",
                "transition-colors duration-[180ms] ease-out-expo",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                target === variable.id
                  ? "border-border-strong bg-surface-hover text-foreground"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {variable.label}
              <span className="font-mono text-xs text-subtle-foreground">{variable.unit}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        {inputs.map((variable) => (
          <div key={variable.id} className="space-y-2">
            <Label htmlFor={`solve-${variable.id}`}>
              {variable.label}{" "}
              <span className="font-mono text-xs text-subtle-foreground">({variable.unit})</span>
            </Label>
            <Input
              id={`solve-${variable.id}`}
              type="number"
              inputMode="decimal"
              value={values[variable.id] ?? ""}
              placeholder={variable.placeholder}
              onChange={(event) =>
                setValues((current) => ({ ...current, [variable.id]: event.target.value }))
              }
            />
            {variable.hint ? <FieldHint>{variable.hint}</FieldHint> : null}
          </div>
        ))}
      </div>

      <div className="surface-card p-6 text-center">
        <p className="text-xs text-muted-foreground">{targetVariable.label}</p>
        <p
          className="mt-2 flex flex-wrap items-baseline justify-center gap-2 font-mono text-4xl tracking-[-0.03em] text-foreground sm:text-5xl"
          data-numeric
          aria-live="polite"
        >
          {result === null ? "—" : formatNumeric(result)}
          <span className="text-lg text-muted-foreground">{targetVariable.unit}</span>
          {result !== null ? (
            <CopyButton
              value={`${formatNumeric(result)} ${targetVariable.unit}`}
              iconOnly
              label="Copy result"
            />
          ) : null}
        </p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">{formulas[target]}</p>
        {result === null && complete ? (
          <p className="mt-2 text-xs text-destructive">
            That combination has no answer — check for a zero where one
            isn&rsquo;t allowed.
          </p>
        ) : null}
      </div>

      {derived.length > 0 ? (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {derived.map((entry) => (
            <div key={entry.label} className="surface-card p-4">
              <dt className="text-xs text-muted-foreground">{entry.label}</dt>
              <dd className="mt-1 font-mono text-lg text-foreground" data-numeric>
                {formatNumeric(entry.value)}{" "}
                <span className="text-sm text-muted-foreground">{entry.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>{footnote}</span>
      </p>
    </div>
  );
}
