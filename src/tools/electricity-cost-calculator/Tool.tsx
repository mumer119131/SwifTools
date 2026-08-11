"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { APPLIANCES, DEFAULT_KWH_RATE, formatMoney } from "@/lib/home";
import { runningCost } from "./logic";

export default function ElectricityCostTool() {
  const [watts, setWatts] = React.useState("1500");
  const [hours, setHours] = React.useState("6");
  const [rate, setRate] = React.useState(String(DEFAULT_KWH_RATE));
  const [quantity, setQuantity] = React.useState("1");
  const [label, setLabel] = React.useState("Space heater");

  const result = runningCost(Number(watts), Number(hours), Number(rate), Number(quantity));

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="elec-watts">Power (watts)</Label>
          <Input
            id="elec-watts"
            type="number"
            inputMode="decimal"
            min={0}
            value={watts}
            onChange={(event) => setWatts(event.target.value)}
          />
          <FieldHint>On the label or the plate on the back.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="elec-hours">Hours per day</Label>
          <Input
            id="elec-hours"
            type="number"
            inputMode="decimal"
            min={0}
            max={24}
            step={0.5}
            value={hours}
            onChange={(event) => setHours(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="elec-rate">Rate per kWh</Label>
          <Input
            id="elec-rate"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            value={rate}
            onChange={(event) => setRate(event.target.value)}
          />
          <FieldHint>On your bill. US average is about $0.17.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="elec-quantity">How many</Label>
          <Input
            id="elec-quantity"
            type="number"
            inputMode="numeric"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
          <FieldHint>Twelve bulbs, four fans.</FieldHint>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">Common appliances</h2>
        <div className="flex flex-wrap gap-2">
          {APPLIANCES.map((appliance) => (
            <Button
              key={appliance.name}
              variant="outline"
              size="sm"
              onClick={() => {
                setWatts(String(appliance.watts));
                setHours(String(appliance.hours));
                setLabel(appliance.name);
              }}
            >
              {appliance.name}
              <span className="text-subtle-foreground">{appliance.watts} W</span>
            </Button>
          ))}
        </div>
        <FieldHint>Typical values — your own appliance&rsquo;s label is the real number.</FieldHint>
      </section>

      <div className="surface-card p-6 text-center">
        <p className="text-xs text-muted-foreground">{label} — cost per year</p>
        <p
          className="mt-2 flex items-baseline justify-center gap-3 font-mono text-4xl tracking-[-0.03em] text-foreground sm:text-5xl"
          data-numeric
          aria-live="polite"
        >
          {formatMoney(result.perYear)}
          <CopyButton value={formatMoney(result.perYear)} iconOnly label="Copy yearly cost" />
        </p>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          watts × hours ÷ 1000 × rate
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Per hour", value: formatMoney(result.perHour), detail: `${(Number(watts) * Number(quantity) / 1000).toFixed(2)} kWh` },
          { label: "Per day", value: formatMoney(result.perDay), detail: `${result.kwhPerDay.toFixed(2)} kWh` },
          { label: "Per month", value: formatMoney(result.perMonth), detail: `${result.kwhPerMonth.toFixed(1)} kWh` },
          { label: "CO₂ per year", value: `${result.co2PerYear.toLocaleString("en-US", { maximumFractionDigits: 0 })} kg`, detail: "US grid average" },
        ].map((card) => (
          <div key={card.label} className="surface-card p-4">
            <dt className="text-xs text-muted-foreground">{card.label}</dt>
            <dd className="mt-1 font-mono text-base text-foreground" data-numeric>
              {card.value}
            </dd>
            <dd className="mt-0.5 text-xs text-subtle-foreground">{card.detail}</dd>
          </div>
        ))}
      </dl>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Nameplate wattage is the maximum draw, not the average. Anything that
          cycles — a fridge, a freezer, an air conditioner — runs its compressor
          perhaps a third of the time, so its real consumption is well under this
          figure. Anything with a heating element — kettle, dryer, space heater,
          oven — draws close to its rating the whole time it is on, which is why
          those few appliances dominate a bill.
        </span>
      </p>
    </div>
  );
}
