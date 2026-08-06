"use client";

import * as React from "react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { fillQuestion, formatResult, modes } from "./logic";

export default function PercentageCalculatorTool() {
  const [modeId, setModeId] = React.useState("of");
  const mode = modes.find((entry) => entry.id === modeId) ?? modes[0];

  const [first, setFirst] = React.useState(String(mode.defaults[0]));
  const [second, setSecond] = React.useState(String(mode.defaults[1]));

  function switchMode(nextId: string) {
    const next = modes.find((entry) => entry.id === nextId);
    if (!next) return;
    setModeId(nextId);
    setFirst(String(next.defaults[0]));
    setSecond(String(next.defaults[1]));
  }

  const a = Number(first);
  const b = Number(second);
  const isValid = first.trim() !== "" && second.trim() !== "" && Number.isFinite(a) && Number.isFinite(b);
  const outcome = isValid ? mode.compute(a, b) : null;

  return (
    <div className="space-y-5">
      <div
        role="group"
        aria-label="Calculation type"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {modes.map((entry) => (
          <button
            key={entry.id}
            type="button"
            aria-pressed={modeId === entry.id}
            onClick={() => switchMode(entry.id)}
            className={cn(
              "inline-flex h-9 shrink-0 cursor-pointer items-center whitespace-nowrap rounded-full border px-3.5 text-sm",
              "transition-colors duration-[180ms] ease-out-expo",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
              modeId === entry.id
                ? "border-border-strong bg-surface-hover text-foreground"
                : "border-border bg-surface text-muted-foreground hover:text-foreground",
            )}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="surface-card space-y-5 p-5">
        <p className="text-sm text-muted-foreground">{fillQuestion(mode, first, second)}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pct-first">{mode.firstLabel}</Label>
            <Input
              id="pct-first"
              type="number"
              inputMode="decimal"
              value={first}
              onChange={(event) => setFirst(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pct-second">{mode.secondLabel}</Label>
            <Input
              id="pct-second"
              type="number"
              inputMode="decimal"
              value={second}
              onChange={(event) => setSecond(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="surface-card p-6 text-center">
        <p className="text-xs text-muted-foreground">Result</p>
        <p
          className="mt-2 flex items-center justify-center gap-3 font-mono text-4xl tracking-[-0.03em] text-foreground sm:text-5xl"
          data-numeric
          aria-live="polite"
        >
          {outcome ? `${formatResult(outcome.value)}${outcome.suffix}` : "—"}
          {outcome ? (
            <CopyButton
              value={`${formatResult(outcome.value)}${outcome.suffix}`}
              iconOnly
              label="Copy result"
            />
          ) : null}
        </p>
        {outcome ? (
          <p className="mt-3 font-mono text-xs text-muted-foreground">{outcome.working}</p>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">
            {isValid
              ? "That combination has no answer — dividing by zero."
              : "Enter both numbers."}
          </p>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        <strong className="text-foreground">Change vs. difference:</strong> percentage{" "}
        <em>change</em> is directional and measured against the starting value, so 200 → 250 is
        +25%. Percentage <em>difference</em> is symmetric and measured against the average of the
        two, giving 22.2%. They answer different questions and are routinely confused.
      </p>
    </div>
  );
}
