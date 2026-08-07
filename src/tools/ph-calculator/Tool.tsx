"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { REFERENCES, classify, nearestReference, solvePh, type PhField } from "./logic";

export default function PhCalculatorTool() {
  const [field, setField] = React.useState<PhField>("ph");
  const [value, setValue] = React.useState("7");

  const result = solvePh(field, Number(value));
  const verdict = result ? classify(result.ph) : null;
  // The scale runs 0–14; anything outside is clamped for the marker only.
  const position = result ? Math.max(0, Math.min(100, (result.ph / 14) * 100)) : 0;

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ph-field">I know the</Label>
          <Select value={field} onValueChange={(next) => setField(next as PhField)}>
            <SelectTrigger id="ph-field">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ph">pH</SelectItem>
              <SelectItem value="poh">pOH</SelectItem>
              <SelectItem value="h">[H⁺] concentration (mol/L)</SelectItem>
              <SelectItem value="oh">[OH⁻] concentration (mol/L)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ph-value">Value</Label>
          <Input
            id="ph-value"
            type="number"
            inputMode="decimal"
            step="any"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
      </div>

      {result && verdict ? (
        <>
          <div className="surface-card p-6 text-center">
            <p className="text-xs text-muted-foreground">pH</p>
            <p
              className="mt-2 flex items-baseline justify-center gap-3 font-mono text-5xl tracking-[-0.03em] text-foreground"
              data-numeric
              aria-live="polite"
            >
              {result.ph.toFixed(2)}
              <CopyButton value={result.ph.toFixed(2)} iconOnly label="Copy pH" />
            </p>
            <p className="mt-2 text-sm text-foreground">{verdict.label}</p>
            <p className="text-xs text-muted-foreground">
              Closest everyday match: {nearestReference(result.ph)}
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-sm font-medium text-foreground">Where it sits</h2>
            <div className="relative pt-6">
              <div
                className="absolute top-0 -translate-x-1/2 whitespace-nowrap font-mono text-xs text-foreground"
                style={{ left: `${position}%` }}
                aria-hidden="true"
              >
                ▼ {result.ph.toFixed(1)}
              </div>
              {/* The classic red-to-blue pH strip, drawn as a gradient. */}
              <div
                className="h-4 rounded-full border border-border"
                style={{
                  background:
                    "linear-gradient(to right, #d92b2b, #f07f13, #f2c313, #1f9e55, #2f6fd0, #7d4fc9)",
                }}
                role="img"
                aria-label={`pH ${result.ph.toFixed(1)} on a scale from 0 to 14`}
              />
              <div className="mt-2 flex justify-between text-xs text-subtle-foreground" data-numeric>
                {[0, 2, 4, 6, 7, 8, 10, 12, 14].map((tick) => (
                  <span key={tick}>{tick}</span>
                ))}
              </div>
            </div>
          </section>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "pH", value: result.ph.toFixed(2) },
              { label: "pOH", value: result.poh.toFixed(2) },
              { label: "[H⁺]", value: `${result.h.toExponential(3)} M` },
              { label: "[OH⁻]", value: `${result.oh.toExponential(3)} M` },
            ].map((card) => (
              <div key={card.label} className="surface-card p-4">
                <dt className="text-xs text-muted-foreground">{card.label}</dt>
                <dd className="mt-1 font-mono text-base text-foreground" data-numeric>
                  {card.value}
                </dd>
              </div>
            ))}
          </dl>

          <section className="surface-card overflow-hidden">
            <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
              Reference points
            </h2>
            <dl className="max-h-72 divide-y divide-border overflow-y-auto">
              {REFERENCES.map((entry) => (
                <div
                  key={entry.name}
                  className={cn(
                    "flex items-center gap-4 px-5 py-2 text-sm",
                    Math.abs(entry.ph - result.ph) < 0.4 && "bg-surface-hover",
                  )}
                >
                  <dt className="min-w-0 flex-1 truncate text-muted-foreground">{entry.name}</dt>
                  <dd className="shrink-0 font-mono text-foreground" data-numeric>
                    {entry.ph.toFixed(1)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Concentrations must be greater than zero — the logarithm of zero is undefined.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          pH + pOH = 14 holds <strong className="text-foreground">at 25 °C</strong>. Water&rsquo;s
          dissociation constant changes with temperature, so neutral water is
          pH 6.14 at 100 °C — still neutral, because [H⁺] and [OH⁻] remain equal.
          The scale is logarithmic: pH 4 is ten times more acidic than pH 5.
        </span>
      </p>
    </div>
  );
}
