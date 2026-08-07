"use client";

import * as React from "react";
import { AlertTriangle, Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumeric } from "@/lib/science";
import { cn } from "@/lib/utils";
import { computeYield, EXAMPLES, parseEquation } from "./logic";

/** Renders subscripts so C6H12O6 reads the way it is written on paper. */
function Formula({ value }: { value: string }) {
  return (
    <span className="font-mono">
      {value.split(/(\d+)/).map((part, index) =>
        /^\d+$/.test(part) ? <sub key={index}>{part}</sub> : <span key={index}>{part}</span>,
      )}
    </span>
  );
}

export default function StoichiometryTool() {
  const [equation, setEquation] = React.useState("2H2 + O2 -> 2H2O");
  const [unit, setUnit] = React.useState<"g" | "mol">("g");
  const [amounts, setAmounts] = React.useState<Record<string, string>>({ H2: "10", O2: "64" });
  const [actualYield, setActualYield] = React.useState("");

  const parsed = parseEquation(equation);

  const result = parsed.ok
    ? computeYield(
        parsed.equation,
        parsed.equation.reactants.map((species) => Number(amounts[species.formula] ?? "")),
        unit,
      )
    : null;

  const firstProduct = result?.products[0];
  const percentYield =
    firstProduct && Number(actualYield) > 0 && firstProduct.grams > 0
      ? (Number(actualYield) / firstProduct.grams) * 100
      : null;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="stoich-equation">Balanced equation</Label>
        <Input
          id="stoich-equation"
          value={equation}
          onChange={(event) => setEquation(event.target.value)}
          placeholder="2H2 + O2 -> 2H2O"
          className="font-mono text-lg"
          spellCheck={false}
          autoComplete="off"
          aria-invalid={!parsed.ok}
        />
        {parsed.ok ? (
          <FieldHint>Arrows can be -&gt;, =&gt; or →. Brackets and hydrates are understood.</FieldHint>
        ) : (
          <p className="text-sm text-destructive">{parsed.error}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <Button
            key={example}
            variant="outline"
            size="sm"
            onClick={() => {
              setEquation(example);
              setAmounts({});
            }}
          >
            <Formula value={example.split("->")[0].trim()} />
          </Button>
        ))}
      </div>

      {parsed.ok && !parsed.balanced ? (
        <p className="flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
          <span>
            This equation isn&rsquo;t balanced — {parsed.imbalance.join(", ")}{" "}
            {parsed.imbalance.length === 1 ? "differs" : "differ"} across the arrow. The numbers below
            still follow the coefficients you wrote, but they won&rsquo;t describe a real reaction
            until it balances.
          </span>
        </p>
      ) : null}

      {parsed.ok && result ? (
        <>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-sm font-medium text-foreground">Amount of each reactant</h2>
            <Tabs value={unit} onValueChange={(value) => setUnit(value as "g" | "mol")}>
              <TabsList>
                <TabsTrigger value="g">Grams</TabsTrigger>
                <TabsTrigger value="mol">Moles</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {parsed.equation.reactants.map((species) => (
              <div key={species.formula} className="space-y-2">
                <Label htmlFor={`amount-${species.formula}`}>
                  <Formula value={species.formula} />{" "}
                  <span className="text-xs text-subtle-foreground">
                    ({formatNumeric(species.molarMass, 5)} g/mol)
                  </span>
                </Label>
                <Input
                  id={`amount-${species.formula}`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={amounts[species.formula] ?? ""}
                  placeholder="0"
                  onChange={(event) =>
                    setAmounts((current) => ({ ...current, [species.formula]: event.target.value }))
                  }
                />
              </div>
            ))}
          </div>

          <div className="surface-card p-6 text-center">
            <p className="text-xs text-muted-foreground">Limiting reagent</p>
            <p className="mt-2 text-4xl tracking-[-0.03em] text-foreground sm:text-5xl" aria-live="polite">
              {result.limiting ? <Formula value={result.limiting.formula} /> : "—"}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {result.limiting
                ? `Runs out first, capping the reaction at ${formatNumeric(result.extent)} mol as written.`
                : "Enter an amount for every reactant."}
            </p>
          </div>

          {result.extent > 0 ? (
            <>
              <section className="surface-card overflow-hidden">
                <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
                  Theoretical yield
                </h2>
                <ul className="divide-y divide-border">
                  {result.products.map((row) => (
                    <li key={row.species.formula} className="flex items-center gap-4 px-5 py-3">
                      <span className="min-w-0 flex-1 text-sm text-foreground">
                        <Formula value={`${row.species.coefficient > 1 ? row.species.coefficient : ""}${row.species.formula}`} />
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block font-mono text-base text-foreground" data-numeric>
                          {formatNumeric(row.grams)} g
                        </span>
                        <span className="block font-mono text-xs text-muted-foreground" data-numeric>
                          {formatNumeric(row.moles)} mol
                        </span>
                      </span>
                      <CopyButton
                        value={`${formatNumeric(row.grams)} g`}
                        iconOnly
                        label={`Copy ${row.species.formula} yield`}
                      />
                    </li>
                  ))}
                </ul>
              </section>

              <section className="surface-card overflow-hidden">
                <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
                  Reactants consumed
                </h2>
                <ul className="divide-y divide-border">
                  {result.reactants.map((row) => (
                    <li key={row.species.formula} className="flex items-center gap-4 px-5 py-3">
                      <span className="min-w-0 flex-1 text-sm text-foreground">
                        <Formula value={row.species.formula} />
                        {row.limiting ? (
                          <span
                            className={cn(
                              "ml-2 rounded-full px-2 py-0.5 text-[11px]",
                              "bg-[color-mix(in_oklab,var(--accent-science)_18%,transparent)] text-foreground",
                            )}
                          >
                            limiting
                          </span>
                        ) : null}
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block font-mono text-sm text-foreground" data-numeric>
                          {formatNumeric(row.consumedGrams)} g used
                        </span>
                        <span className="block font-mono text-xs text-muted-foreground" data-numeric>
                          {row.leftoverGrams > 1e-9
                            ? `${formatNumeric(row.leftoverGrams)} g left over`
                            : "fully consumed"}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {firstProduct ? (
                <div className="surface-card flex flex-wrap items-end gap-4 p-5">
                  <div className="space-y-2">
                    <Label htmlFor="actual-yield">
                      Actual yield of <Formula value={firstProduct.species.formula} /> (g)
                    </Label>
                    <Input
                      id="actual-yield"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={actualYield}
                      placeholder="What you measured"
                      onChange={(event) => setActualYield(event.target.value)}
                      className="w-56"
                    />
                  </div>
                  <div className="pb-1">
                    <p className="text-xs text-muted-foreground">Percent yield</p>
                    <p className="font-mono text-2xl text-foreground" data-numeric>
                      {percentYield === null ? "—" : `${percentYield.toFixed(2)}%`}
                    </p>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The limiting reagent is the one with the smallest moles ÷ coefficient
          ratio — not the smallest mass, and not the fewest moles. Burning 10 g
          of hydrogen with 64 g of oxygen leaves oxygen to spare even though
          there is far more of it by weight, because each mole of oxygen needs
          two of hydrogen.
        </span>
      </p>
    </div>
  );
}
