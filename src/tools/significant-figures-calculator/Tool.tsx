"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { analyse } from "./logic";

export default function SignificantFiguresTool() {
  const [input, setInput] = React.useState("0.004520");
  const [roundTo, setRoundTo] = React.useState("3");

  const result = analyse(input, Number(roundTo));

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sf-input">Number</Label>
          <Input
            id="sf-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="0.004520"
            className="font-mono text-lg"
            spellCheck={false}
            inputMode="decimal"
            aria-invalid={input.trim() !== "" && result === null}
          />
          <FieldHint>Scientific notation like 4.52e-3 works too.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sf-round">Round to (significant figures)</Label>
          <Input
            id="sf-round"
            type="number"
            inputMode="numeric"
            min={1}
            max={15}
            value={roundTo}
            onChange={(event) => setRoundTo(event.target.value)}
            className="max-w-32"
          />
        </div>
      </div>

      {result ? (
        <>
          <div className="surface-card p-6 text-center">
            <p className="text-xs text-muted-foreground">Significant figures</p>
            <p
              className="mt-2 font-mono text-5xl tracking-[-0.03em] text-foreground"
              data-numeric
              aria-live="polite"
            >
              {result.count}
            </p>

            {/* Each digit marked, so the rule is visible rather than asserted. */}
            <p className="mt-4 flex flex-wrap justify-center gap-1 font-mono text-2xl">
              {result.digits.map((digit, index) => (
                <span
                  key={index}
                  className={cn(
                    "rounded px-1",
                    digit.character === "."
                      ? "text-subtle-foreground"
                      : digit.significant
                        ? "bg-[color-mix(in_oklab,var(--success)_22%,transparent)] text-foreground"
                        : "text-subtle-foreground line-through",
                  )}
                  title={digit.significant ? "Significant" : "Not significant"}
                >
                  {digit.character}
                </span>
              ))}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">{result.explanation}</p>
          </div>

          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: `Rounded to ${roundTo} s.f.`, value: result.rounded },
              { label: "Scientific notation", value: result.scientific },
              { label: "Decimal places", value: String(result.decimalPlaces) },
            ].map((card) => (
              <div key={card.label} className="surface-card flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <dt className="text-xs text-muted-foreground">{card.label}</dt>
                  <dd className="mt-1 truncate font-mono text-lg text-foreground" data-numeric>
                    {card.value}
                  </dd>
                </div>
                <CopyButton value={card.value} iconOnly label={`Copy ${card.label}`} />
              </div>
            ))}
          </dl>
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Enter a number to analyse.
        </p>
      )}

      <section className="surface-card space-y-2 p-5 text-sm text-muted-foreground">
        <h2 className="text-sm font-medium text-foreground">The rules</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Every non-zero digit is significant.</li>
          <li>Zeros between non-zero digits are significant — 1002 has four.</li>
          <li>Leading zeros are never significant — 0.0045 has two.</li>
          <li>Trailing zeros count only if there is a decimal point — 4.50 has three, 450 has two.</li>
          <li>
            When multiplying or dividing, the answer carries the fewest figures of any input. When
            adding, it carries the fewest <em>decimal places</em>.
          </li>
        </ul>
      </section>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          &ldquo;1200&rdquo; is genuinely ambiguous — it could be two, three or
          four significant figures, and nothing in the notation says which.
          Writing 1.2 × 10³ removes the doubt, which is why scientific notation
          exists.
        </span>
      </p>
    </div>
  );
}
