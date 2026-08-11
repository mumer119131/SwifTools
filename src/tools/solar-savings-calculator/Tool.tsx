"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { formatMoney } from "@/lib/home";
import { cn } from "@/lib/utils";
import { SUN_HOURS, estimate } from "./logic";

export default function SolarSavingsTool() {
  const [monthlyBill, setMonthlyBill] = React.useState("180");
  const [rate, setRate] = React.useState("0.17");
  const [sunHours, setSunHours] = React.useState("4.5");
  const [costPerWatt, setCostPerWatt] = React.useState("2.80");
  const [incentive, setIncentive] = React.useState("30");
  const [offset, setOffset] = React.useState("100");
  const [panelWatts, setPanelWatts] = React.useState("400");
  const [inflation, setInflation] = React.useState("3");

  // The bill is the number people know; kWh is what the maths needs.
  const annualKwh = Number(rate) > 0 ? (Number(monthlyBill) / Number(rate)) * 12 : 0;

  const result = estimate({
    annualKwh,
    ratePerKwh: Number(rate),
    sunHours: Number(sunHours),
    costPerWatt: Number(costPerWatt),
    incentivePercent: Number(incentive),
    offsetPercent: Number(offset),
    panelWatts: Number(panelWatts),
    rateInflation: Number(inflation),
    years: 25,
  });

  const fields = [
    { id: "solar-bill", label: "Monthly electricity bill", value: monthlyBill, set: setMonthlyBill, step: 1 },
    { id: "solar-rate", label: "Rate per kWh", value: rate, set: setRate, step: 0.01 },
    { id: "solar-sun", label: "Peak sun hours per day", value: sunHours, set: setSunHours, step: 0.1 },
    { id: "solar-cost", label: "Installed cost per watt", value: costPerWatt, set: setCostPerWatt, step: 0.1, hint: "$2.50–$3.50 typical after competition." },
    { id: "solar-incentive", label: "Incentives and credits (%)", value: incentive, set: setIncentive, hint: "The US federal credit is 30%." },
    { id: "solar-offset", label: "Bill to offset (%)", value: offset, set: setOffset, hint: "100% covers your whole usage." },
    { id: "solar-panel", label: "Panel wattage", value: panelWatts, set: setPanelWatts, hint: "400 W is a common modern panel." },
    { id: "solar-inflation", label: "Rate rises per year (%)", value: inflation, set: setInflation, step: 0.5 },
  ];

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type="number"
              inputMode="decimal"
              min={0}
              step={field.step}
              value={field.value}
              onChange={(event) => field.set(event.target.value)}
            />
            {field.hint ? <FieldHint>{field.hint}</FieldHint> : null}
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">Sun hours where you are</h2>
        <div className="flex flex-wrap gap-2">
          {SUN_HOURS.map((region) => (
            <Button
              key={region.label}
              variant="outline"
              size="sm"
              onClick={() => setSunHours(String(region.hours))}
            >
              {region.label}
              <span className="text-subtle-foreground">{region.hours} h</span>
            </Button>
          ))}
        </div>
      </section>

      <div className="surface-card p-6 text-center">
        <p className="text-xs text-muted-foreground">Payback period</p>
        <p
          className="mt-2 flex items-baseline justify-center gap-3 font-mono text-4xl tracking-[-0.03em] text-foreground sm:text-5xl"
          data-numeric
          aria-live="polite"
        >
          {result.paybackYears === null ? "Over 25 yrs" : `${result.paybackYears.toFixed(1)} yrs`}
          <CopyButton
            value={
              result.paybackYears === null
                ? "No payback within 25 years"
                : `${result.paybackYears.toFixed(1)} year payback`
            }
            iconOnly
            label="Copy payback period"
          />
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatMoney(result.lifetimeSavings)} net over 25 years
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "System size", value: `${result.systemKw.toFixed(2)} kW`, detail: `${result.panels} panels` },
          { label: "Cost before credits", value: formatMoney(result.grossCost) },
          { label: "Cost after credits", value: formatMoney(result.netCost), detail: `${incentive}% off` },
          { label: "First-year savings", value: formatMoney(result.firstYearSavings) },
        ].map((card) => (
          <div key={card.label} className="surface-card p-4">
            <dt className="text-xs text-muted-foreground">{card.label}</dt>
            <dd className="mt-1 font-mono text-base text-foreground" data-numeric>
              {card.value}
            </dd>
            {card.detail ? (
              <dd className="mt-0.5 text-xs text-subtle-foreground">{card.detail}</dd>
            ) : null}
          </div>
        ))}
      </dl>

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
          Year by year
        </h2>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-surface text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-2 text-left font-normal">Year</th>
                <th className="px-5 py-2 text-right font-normal">Saved</th>
                <th className="px-5 py-2 text-right font-normal">Cumulative</th>
                <th className="px-5 py-2 text-right font-normal">Net position</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {result.yearly.map((row) => (
                <tr key={row.year}>
                  <td className="px-5 py-2 text-muted-foreground">{row.year}</td>
                  <td className="px-5 py-2 text-right font-mono text-foreground" data-numeric>
                    {formatMoney(row.savings)}
                  </td>
                  <td className="px-5 py-2 text-right font-mono text-muted-foreground" data-numeric>
                    {formatMoney(row.cumulative)}
                  </td>
                  <td
                    className={cn(
                      "px-5 py-2 text-right font-mono",
                      row.net >= 0 ? "text-[var(--success)]" : "text-muted-foreground",
                    )}
                    data-numeric
                  >
                    {formatMoney(row.net)}
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
          Payback is not cost divided by first-year savings — electricity prices
          rise while panels slowly lose output, so the break-even year is read
          from the table rather than from a single division. This assumes a 20%
          system loss, half a percent of panel degradation a year, and that
          everything you generate offsets electricity you would have bought.
          Where net metering pays less than the retail rate for exported power,
          real savings will be lower. A quote from an installer who has seen your
          roof beats any of this.
        </span>
      </p>
    </div>
  );
}
