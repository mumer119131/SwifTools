"use client";

import * as React from "react";
import { Info, TriangleAlert } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { formatNumeric } from "@/lib/science";
import { EXAMPLES, moleculesFrom, molesFrom, parseFormula } from "./logic";

export default function MolecularWeightTool() {
  const [formula, setFormula] = React.useState("C6H12O6");
  const [sample, setSample] = React.useState("10");

  const parsed = parseFormula(formula);
  const grams = Number(sample);
  const moles = parsed.ok && Number.isFinite(grams) ? molesFrom(grams, parsed.molarMass) : null;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="formula">Chemical formula</Label>
        <Input
          id="formula"
          value={formula}
          onChange={(event) => setFormula(event.target.value)}
          placeholder="C6H12O6"
          className="font-mono text-lg"
          spellCheck={false}
          autoCapitalize="off"
          aria-invalid={!parsed.ok}
        />
        <div className="flex flex-wrap gap-2 pt-1">
          {EXAMPLES.map((example) => (
            <Button
              key={example}
              variant="outline"
              size="sm"
              className="font-mono"
              onClick={() => setFormula(example)}
            >
              {example}
            </Button>
          ))}
        </div>
      </div>

      {!parsed.ok ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md border border-[color-mix(in_oklab,var(--destructive)_30%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-destructive"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          <span>{parsed.error}</span>
        </p>
      ) : (
        <>
          <div className="surface-card p-6 text-center">
            <p className="text-xs text-muted-foreground">Molar mass</p>
            <p
              className="mt-2 flex items-baseline justify-center gap-3 font-mono text-4xl tracking-[-0.03em] text-foreground sm:text-5xl"
              data-numeric
              aria-live="polite"
            >
              {formatNumeric(parsed.molarMass)}
              <span className="text-lg text-muted-foreground">g/mol</span>
              <CopyButton
                value={`${formatNumeric(parsed.molarMass)} g/mol`}
                iconOnly
                label="Copy molar mass"
              />
            </p>
          </div>

          <section className="surface-card overflow-hidden">
            <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
              Composition
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">
                  Each element&rsquo;s atom count, mass contribution and percentage.
                </caption>
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th scope="col" className="px-5 py-2.5 text-left font-medium">Element</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Atoms</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Atomic mass</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Mass</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">%</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.elements.map((element) => (
                    <tr key={element.symbol} className="border-b border-border last:border-0">
                      <td className="px-5 py-2 text-foreground">
                        <span className="font-mono">{element.symbol}</span>{" "}
                        <span className="text-xs text-muted-foreground">{element.name}</span>
                      </td>
                      <td className="px-5 py-2 text-right font-mono text-muted-foreground" data-numeric>
                        {element.count}
                      </td>
                      <td className="px-5 py-2 text-right font-mono text-muted-foreground" data-numeric>
                        {formatNumeric(element.atomicWeight)}
                      </td>
                      <td className="px-5 py-2 text-right font-mono text-foreground" data-numeric>
                        {formatNumeric(element.mass)}
                      </td>
                      <td className="px-5 py-2 text-right font-mono text-foreground" data-numeric>
                        {element.percent.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="surface-card space-y-4 p-5">
            <div className="space-y-2">
              <Label htmlFor="sample-mass">Sample mass (g)</Label>
              <Input
                id="sample-mass"
                type="number"
                inputMode="decimal"
                min={0}
                value={sample}
                onChange={(event) => setSample(event.target.value)}
                className="max-w-40"
              />
              <FieldHint>Converts straight to moles and molecule count.</FieldHint>
            </div>

            {moles !== null ? (
              <dl className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Moles</dt>
                  <dd className="mt-1 font-mono text-lg text-foreground" data-numeric>
                    {formatNumeric(moles)} mol
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Molecules</dt>
                  <dd className="mt-1 font-mono text-lg text-foreground" data-numeric>
                    {moleculesFrom(moles).toExponential(4)}
                  </dd>
                </div>
              </dl>
            ) : null}
          </div>
        </>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Atomic weights are the IUPAC 2021 standard values — averages across
          natural isotope abundance, which is what you want for weighing out a
          reagent. For mass spectrometry you need monoisotopic masses instead.
          Element symbols are case-sensitive: <code className="font-mono">Co</code>{" "}
          is cobalt, <code className="font-mono">CO</code> is carbon monoxide.
        </span>
      </p>
    </div>
  );
}
