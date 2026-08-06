"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currencies } from "@/tools/loan-calculator/logic";
import { calculateCompound, formatMoney, frequencies, type Frequency } from "./logic";

export default function CompoundInterestTool() {
  const [principal, setPrincipal] = React.useState("10000");
  const [monthly, setMonthly] = React.useState("500");
  const [rate, setRate] = React.useState("7");
  const [years, setYears] = React.useState("20");
  const [frequency, setFrequency] = React.useState<Frequency>(12);
  const [inflation, setInflation] = React.useState("2.5");
  const [currency, setCurrency] = React.useState("USD");

  const result = React.useMemo(
    () =>
      calculateCompound({
        principal: Number(principal) || 0,
        monthlyContribution: Number(monthly) || 0,
        annualRatePercent: Number(rate) || 0,
        years: Number(years),
        compoundsPerYear: frequency,
        inflationPercent: Number(inflation) || 0,
      }),
    [principal, monthly, rate, years, frequency, inflation],
  );

  const money = (value: number) => formatMoney(value, currency);
  const peak = result ? result.finalBalance : 1;

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="ci-principal">Starting balance</Label>
          <Input
            id="ci-principal"
            type="number"
            inputMode="decimal"
            min={0}
            value={principal}
            onChange={(event) => setPrincipal(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ci-monthly">Added each month</Label>
          <Input
            id="ci-monthly"
            type="number"
            inputMode="decimal"
            min={0}
            value={monthly}
            onChange={(event) => setMonthly(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ci-rate">Annual return (%)</Label>
          <Input
            id="ci-rate"
            type="number"
            inputMode="decimal"
            step="0.1"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ci-years">Years</Label>
          <Input
            id="ci-years"
            type="number"
            inputMode="numeric"
            min={1}
            max={100}
            value={years}
            onChange={(event) => setYears(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ci-frequency">Compounding</Label>
          <Select
            value={String(frequency)}
            onValueChange={(value) => setFrequency(Number(value) as Frequency)}
          >
            <SelectTrigger id="ci-frequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {frequencies.map((entry) => (
                <SelectItem key={entry.value} value={String(entry.value)}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ci-currency">Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="ci-currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((code) => (
                <SelectItem key={code} value={code}>
                  {code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2 lg:col-span-3">
          <Label htmlFor="ci-inflation">Assumed inflation (%)</Label>
          <Input
            id="ci-inflation"
            type="number"
            inputMode="decimal"
            step="0.1"
            min={0}
            value={inflation}
            onChange={(event) => setInflation(event.target.value)}
            className="max-w-40"
          />
          <FieldHint>
            Used only to show what the final balance is worth in today&rsquo;s money — the number
            that actually tells you what you can buy.
          </FieldHint>
        </div>
      </div>

      {result ? (
        <>
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "Final balance", value: money(result.finalBalance) },
              { label: "You put in", value: money(result.totalContributed) },
              { label: "Interest earned", value: money(result.totalGrowth) },
              { label: "In today's money", value: money(result.realBalance) },
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

          <section className="surface-card overflow-hidden">
            <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
              Growth by year
            </h2>
            <div className="max-h-96 overflow-auto">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">
                  Balance, contributions and interest at the end of each year.
                </caption>
                <thead className="sticky top-0 bg-surface">
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th scope="col" className="px-5 py-2.5 text-left font-medium">Year</th>
                    <th scope="col" className="px-5 py-2.5 text-left font-medium">Split</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Interest</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.points.map((point) => (
                    <tr key={point.year} className="border-b border-border last:border-0">
                      <td className="px-5 py-2 font-mono text-muted-foreground" data-numeric>
                        {point.year}
                      </td>
                      <td className="w-40 px-5 py-2">
                        {/* Contributions vs growth as a proportional bar. */}
                        <span
                          className="flex h-2 overflow-hidden rounded-full bg-border"
                          role="img"
                          aria-label={`${money(point.contributed)} contributed, ${money(point.growth)} growth`}
                        >
                          <span
                            className="bg-primary"
                            style={{ width: `${(point.contributed / peak) * 100}%` }}
                          />
                          <span
                            className="bg-success"
                            style={{ width: `${(point.growth / peak) * 100}%` }}
                          />
                        </span>
                      </td>
                      <td className="px-5 py-2 text-right font-mono text-muted-foreground" data-numeric>
                        {money(point.growth)}
                      </td>
                      <td className="px-5 py-2 text-right font-mono text-foreground" data-numeric>
                        {money(point.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="flex flex-wrap gap-x-6 gap-y-1 border-t border-border px-5 py-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-sm bg-primary" aria-hidden="true" />
                What you put in
              </span>
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-sm bg-success" aria-hidden="true" />
                Interest earned
              </span>
            </p>
          </section>
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Enter a term between 1 and 100 years to see the projection.
        </p>
      )}

      <p className="text-sm text-muted-foreground">
        This assumes a constant rate of return, which no real investment has. Markets fall as well
        as rise, and taxes and fees are not modelled — treat the figures as an illustration of how
        compounding works, not a forecast.
      </p>
    </div>
  );
}
