"use client";

import * as React from "react";
import { AlertTriangle, Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { calculate, distribution, parseNumbers, type Kind } from "./logic";

export default function StandardDeviationCalculatorTool() {
  const [input, setInput] = React.useState("2, 4, 4, 4, 5, 5, 7, 9");
  const [kind, setKind] = React.useState<Kind>("sample");

  const values = parseNumbers(input);
  const result = calculate(values, kind);
  const round = (n: number, places = 4) => Number(n.toPrecision(places));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Tabs value={kind} onValueChange={(v) => setKind(v as Kind)}>
          <TabsList>
            <TabsTrigger value="sample">Sample</TabsTrigger>
            <TabsTrigger value="population">Population</TabsTrigger>
          </TabsList>
        </Tabs>
        <span className="text-sm text-muted-foreground" data-numeric>
          {values.length} values
        </span>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="numbers">Numbers</Label>
        <Textarea
          id="numbers"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={5}
          spellCheck={false}
          className="font-mono text-sm"
          placeholder="Paste numbers separated by commas, spaces or newlines"
        />
      </div>

      {result ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Standard deviation", round(result.standardDeviation), true],
              ["Variance", round(result.variance), true],
              ["Mean", round(result.mean), false],
              ["Median", round(result.median), false],
              ["Minimum", round(result.min), false],
              ["Maximum", round(result.max), false],
              ["Range", round(result.range), false],
              ["Sum", round(result.sum, 8)],
            ].map(([label, value, highlight]) => (
              <div
                key={label as string}
                className={highlight ? "surface-card border-border-strong px-4 py-3" : "surface-card px-4 py-3"}
              >
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="mt-0.5 flex items-center gap-2 font-mono text-lg text-foreground" data-numeric>
                  {value}
                  <CopyButton value={String(value)} iconOnly />
                </dd>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Q1", round(result.q1)],
              ["Q3", round(result.q3)],
              ["IQR", round(result.iqr)],
              ["Standard error", round(result.standardError)],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-md border border-border px-4 py-2.5">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="mt-0.5 font-mono text-sm text-foreground" data-numeric>{value}</dd>
              </div>
            ))}
          </div>

          {result.mode.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              Mode: <span className="font-mono text-foreground">{result.mode.join(", ")}</span>
              {result.mode.length > 1 ? " — several values tie." : ""}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No mode — nothing repeats.</p>
          )}

          {result.outliers.length > 0 ? (
            <p className="flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
              <span>
                Possible outliers:{" "}
                <span className="font-mono">{result.outliers.join(", ")}</span> — more than
                1.5 interquartile ranges outside the quartiles. That is a flag to
                look at them, not grounds to remove them.
              </span>
            </p>
          ) : null}

          <section>
            <h2 className="text-sm font-medium text-foreground">How the data spreads</h2>
            <ul className="mt-3 divide-y divide-border rounded-md border border-border">
              {distribution(result).map((band) => (
                <li key={band.sigma} className="flex flex-wrap items-baseline justify-between gap-3 px-4 py-2.5 text-sm">
                  <span className="text-muted-foreground">
                    Within {band.sigma} standard deviation{band.sigma === 1 ? "" : "s"}
                  </span>
                  <span className="font-mono text-foreground" data-numeric>
                    {band.count} of {result.count} ({band.share.toFixed(1)}%)
                    <span className="ml-2 text-muted-foreground">
                      normal: {band.expected}%
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              A close match to the normal percentages suggests the data is roughly
              bell-shaped. A poor match does not mean the calculation is wrong — it
              means the distribution is not normal, which is itself worth knowing.
            </p>
          </section>
        </>
      ) : (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {values.length === 1 && kind === "sample"
            ? "A sample standard deviation needs at least two values — one point has no spread to measure."
            : "Enter some numbers, separated by commas, spaces or newlines."}
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Use <span className="text-foreground">sample</span> when your numbers
          are a subset of something larger, which is almost always. Use{" "}
          <span className="text-foreground">population</span> only when you have
          every member of the group. Sample divides by n−1 rather than n, because
          a sample mean sits closer to its own data than the true mean does and
          would otherwise understate the spread.
        </span>
      </p>
    </div>
  );
}
