"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumeric } from "@/lib/science";
import { ISOTOPES, solveDecay, type Target } from "./logic";

export default function HalfLifeCalculatorTool() {
  const [target, setTarget] = React.useState<Target>("remaining");
  const [initial, setInitial] = React.useState("100");
  const [remaining, setRemaining] = React.useState("25");
  const [elapsed, setElapsed] = React.useState("10");
  const [halfLife, setHalfLife] = React.useState("5");

  const result = solveDecay(
    target,
    Number(initial),
    Number(remaining),
    Number(elapsed),
    Number(halfLife),
  );

  return (
    <div className="space-y-5">
      <Tabs value={target} onValueChange={(value) => setTarget(value as Target)}>
        <TabsList>
          <TabsTrigger value="remaining">Remaining amount</TabsTrigger>
          <TabsTrigger value="time">Elapsed time</TabsTrigger>
          <TabsTrigger value="halfLife">Half-life</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hl-initial">Starting amount</Label>
          <Input
            id="hl-initial"
            type="number"
            inputMode="decimal"
            min={0}
            value={initial}
            onChange={(event) => setInitial(event.target.value)}
          />
        </div>

        {target !== "remaining" ? (
          <div className="space-y-2">
            <Label htmlFor="hl-remaining">Remaining amount</Label>
            <Input
              id="hl-remaining"
              type="number"
              inputMode="decimal"
              min={0}
              value={remaining}
              onChange={(event) => setRemaining(event.target.value)}
            />
          </div>
        ) : null}

        {target !== "time" ? (
          <div className="space-y-2">
            <Label htmlFor="hl-elapsed">Time elapsed</Label>
            <Input
              id="hl-elapsed"
              type="number"
              inputMode="decimal"
              min={0}
              value={elapsed}
              onChange={(event) => setElapsed(event.target.value)}
            />
          </div>
        ) : null}

        {target !== "halfLife" ? (
          <div className="space-y-2">
            <Label htmlFor="hl-half">Half-life</Label>
            <Input
              id="hl-half"
              type="number"
              inputMode="decimal"
              min={0}
              value={halfLife}
              onChange={(event) => setHalfLife(event.target.value)}
            />
          </div>
        ) : null}

        <FieldHint className="sm:col-span-2">
          Time and half-life just need the same unit as each other — years, days
          or seconds. The amount can be grams, atoms or becquerels; only the
          ratio matters.
        </FieldHint>
      </div>

      {result ? (
        <>
          <div className="surface-card p-6 text-center">
            <p className="text-xs text-muted-foreground">
              {target === "remaining" ? "Remaining" : target === "time" ? "Time elapsed" : "Half-life"}
            </p>
            <p
              className="mt-2 flex items-baseline justify-center gap-3 font-mono text-4xl tracking-[-0.03em] text-foreground sm:text-5xl"
              data-numeric
              aria-live="polite"
            >
              {formatNumeric(
                target === "remaining" ? result.remaining : target === "time" ? result.elapsed : result.halfLife,
              )}
              <CopyButton
                value={formatNumeric(
                  target === "remaining" ? result.remaining : target === "time" ? result.elapsed : result.halfLife,
                )}
                iconOnly
                label="Copy result"
              />
            </p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              N = N₀ × (1/2)^(t / t½)
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Percent remaining", value: `${result.percentRemaining.toFixed(3)}%` },
              { label: "Half-lives elapsed", value: formatNumeric(result.halvings) },
              { label: "Decay constant λ", value: formatNumeric(result.decayConstant) },
              { label: "Mean lifetime", value: formatNumeric(result.meanLifetime) },
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
              Decay table
            </h2>
            <dl className="divide-y divide-border">
              {Array.from({ length: 10 }, (_, index) => index + 1).map((step) => (
                <div key={step} className="flex items-center gap-4 px-5 py-2 text-sm">
                  <dt className="min-w-0 flex-1 text-muted-foreground">
                    After {step} half-{step === 1 ? "life" : "lives"} (t ={" "}
                    {formatNumeric(result.halfLife * step)})
                  </dt>
                  <dd className="shrink-0 font-mono text-foreground" data-numeric>
                    {formatNumeric(Number(initial) * 0.5 ** step)}{" "}
                    <span className="text-subtle-foreground">
                      ({(100 * 0.5 ** step).toFixed(2)}%)
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Check the inputs — the remaining amount cannot exceed the starting
          amount, and the half-life must be positive.
        </p>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">Known isotopes</h2>
        <div className="flex flex-wrap gap-2">
          {ISOTOPES.map((isotope) => (
            <Button
              key={isotope.name}
              variant="outline"
              size="sm"
              onClick={() => setHalfLife(String(isotope.halfLife))}
            >
              {isotope.name} — {formatNumeric(isotope.halfLife)} {isotope.unit}
            </Button>
          ))}
        </div>
        <FieldHint>
          Loading one sets the half-life; enter your elapsed time in the same
          unit shown.
        </FieldHint>
      </section>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Half-life is the time for half the sample to decay, and it does not
          change as the sample shrinks — that is what makes decay exponential
          rather than linear. The <em>mean lifetime</em> is a different quantity:
          the average survival time of a single atom, longer than the half-life
          by a factor of 1/ln 2.
        </span>
      </p>
    </div>
  );
}
