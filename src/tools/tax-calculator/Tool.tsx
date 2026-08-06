"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateTax, formatMoney, systems } from "./logic";

export default function TaxCalculatorTool() {
  const [systemId, setSystemId] = React.useState("uk");
  const [gross, setGross] = React.useState("60000");

  const system = systems.find((entry) => entry.id === systemId) ?? systems[0];
  const result = React.useMemo(
    () => calculateTax(Number(gross) || 0, system),
    [gross, system],
  );

  const money = (value: number) => formatMoney(value, system.currency);

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tax-system">Tax system</Label>
          <Select value={systemId} onValueChange={setSystemId}>
            <SelectTrigger id="tax-system">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {systems.map((entry) => (
                <SelectItem key={entry.id} value={entry.id}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax-gross">Gross annual income ({system.currency})</Label>
          <Input
            id="tax-gross"
            type="number"
            inputMode="decimal"
            min={0}
            value={gross}
            onChange={(event) => setGross(event.target.value)}
          />
        </div>
      </div>

      {result ? (
        <>
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "Take-home pay", value: money(result.netIncome) },
              { label: "Total tax", value: money(result.totalTax) },
              { label: "Effective rate", value: `${result.effectiveRatePercent.toFixed(1)}%` },
              { label: "Marginal rate", value: `${result.marginalRatePercent}%` },
            ].map((card) => (
              <div key={card.label} className="surface-card p-4">
                <dt className="text-xs text-muted-foreground">{card.label}</dt>
                <dd
                  className="mt-1 font-mono text-xl tracking-[-0.02em] text-foreground"
                  data-numeric
                >
                  {card.value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="text-sm text-muted-foreground">
            Monthly take-home:{" "}
            <span className="font-mono text-foreground" data-numeric>
              {money(result.netIncome / 12)}
            </span>{" "}
            · Weekly:{" "}
            <span className="font-mono text-foreground" data-numeric>
              {money(result.netIncome / 52)}
            </span>
          </p>

          <section className="surface-card overflow-hidden">
            <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
              Tax by band
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">
                  Income taxed in each band, the rate applied and the tax due.
                </caption>
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th scope="col" className="px-5 py-2.5 text-left font-medium">Band</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Rate</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Taxed here</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Tax</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-5 py-2 text-muted-foreground">
                      Tax-free allowance
                    </td>
                    <td className="px-5 py-2 text-right font-mono text-muted-foreground" data-numeric>
                      0%
                    </td>
                    <td className="px-5 py-2 text-right font-mono text-foreground" data-numeric>
                      {money(result.allowance)}
                    </td>
                    <td className="px-5 py-2 text-right font-mono text-success" data-numeric>
                      {money(0)}
                    </td>
                  </tr>
                  {result.bands.map((band) => (
                    <tr key={band.label} className="border-b border-border last:border-0">
                      <td className="px-5 py-2 font-mono text-muted-foreground">{band.label}</td>
                      <td className="px-5 py-2 text-right font-mono text-muted-foreground" data-numeric>
                        {band.ratePercent}%
                      </td>
                      <td className="px-5 py-2 text-right font-mono text-foreground" data-numeric>
                        {money(band.taxableInBand)}
                      </td>
                      <td className="px-5 py-2 text-right font-mono text-foreground" data-numeric>
                        {money(band.tax)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
            <span>
              <strong className="text-foreground">This is an estimate, not tax advice.</strong>{" "}
              {system.note} Your actual liability depends on your full circumstances — check with a
              qualified accountant or your tax authority before relying on any figure here.
            </span>
          </p>
        </>
      ) : null}
    </div>
  );
}
