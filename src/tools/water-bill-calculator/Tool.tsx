"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatMoney } from "@/lib/home";
import { DRIP_GALLONS_PER_DAY, estimate } from "./logic";

export default function WaterBillTool() {
  const [people, setPeople] = React.useState("3");
  const [showerMinutes, setShowerMinutes] = React.useState("8");
  const [showersPerDay, setShowersPerDay] = React.useState("1");
  const [toiletFlushes, setToiletFlushes] = React.useState("5");
  const [oldToilets, setOldToilets] = React.useState(false);
  const [laundryPerWeek, setLaundryPerWeek] = React.useState("4");
  const [highEfficiency, setHighEfficiency] = React.useState(true);
  const [dishwasherPerWeek, setDishwasherPerWeek] = React.useState("5");
  const [faucetMinutes, setFaucetMinutes] = React.useState("8");
  const [outdoor, setOutdoor] = React.useState("30");
  const [drips, setDrips] = React.useState("0");
  const [rate, setRate] = React.useState("6.50");

  const result = estimate({
    people: Number(people),
    showerMinutes: Number(showerMinutes),
    showersPerDay: Number(showersPerDay),
    toiletFlushes: Number(toiletFlushes),
    oldToilets,
    laundryPerWeek: Number(laundryPerWeek),
    highEfficiencyWasher: highEfficiency,
    dishwasherPerWeek: Number(dishwasherPerWeek),
    faucetMinutes: Number(faucetMinutes),
    outdoorMinutesPerWeek: Number(outdoor),
    drippingTaps: Number(drips),
    ratePer1000Gal: Number(rate),
  });

  const fields = [
    { id: "water-people", label: "People in the home", value: people, set: setPeople },
    { id: "water-shower-min", label: "Minutes per shower", value: showerMinutes, set: setShowerMinutes, hint: "US average is about 8." },
    { id: "water-showers", label: "Showers per person per day", value: showersPerDay, set: setShowersPerDay, step: 0.5 },
    { id: "water-flushes", label: "Toilet flushes per person per day", value: toiletFlushes, set: setToiletFlushes },
    { id: "water-laundry", label: "Loads of laundry per week", value: laundryPerWeek, set: setLaundryPerWeek },
    { id: "water-dishes", label: "Dishwasher cycles per week", value: dishwasherPerWeek, set: setDishwasherPerWeek },
    { id: "water-faucet", label: "Tap minutes per person per day", value: faucetMinutes, set: setFaucetMinutes, hint: "Washing hands, brushing teeth, cooking." },
    { id: "water-outdoor", label: "Outdoor watering, minutes per week", value: outdoor, set: setOutdoor },
    { id: "water-drips", label: "Dripping taps", value: drips, set: setDrips, hint: `${DRIP_GALLONS_PER_DAY} gallons a day each.` },
    { id: "water-rate", label: "Rate per 1,000 gallons", value: rate, set: setRate, step: 0.01, hint: "On your bill." },
  ];

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
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

        <div className="flex items-center gap-3 pt-7">
          <Switch id="water-old-toilets" checked={oldToilets} onCheckedChange={setOldToilets} />
          <Label htmlFor="water-old-toilets">Pre-1994 toilets (3.5 gal)</Label>
        </div>

        <div className="flex items-center gap-3 pt-7">
          <Switch id="water-he" checked={highEfficiency} onCheckedChange={setHighEfficiency} />
          <Label htmlFor="water-he">High-efficiency washer</Label>
        </div>
      </div>

      <div className="surface-card p-6 text-center">
        <p className="text-xs text-muted-foreground">Estimated monthly bill</p>
        <p
          className="mt-2 flex items-baseline justify-center gap-3 font-mono text-4xl tracking-[-0.03em] text-foreground sm:text-5xl"
          data-numeric
          aria-live="polite"
        >
          {formatMoney(result.billPerMonth)}
          <CopyButton value={formatMoney(result.billPerMonth)} iconOnly label="Copy monthly bill" />
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatMoney(result.billPerYear)} a year ·{" "}
          {result.gallonsPerMonth.toLocaleString("en-US", { maximumFractionDigits: 0 })} gallons a month
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: "Gallons per day", value: result.gallonsPerDay.toLocaleString("en-US", { maximumFractionDigits: 1 }) },
          { label: "Litres per day", value: result.litresPerDay.toLocaleString("en-US", { maximumFractionDigits: 0 }) },
          { label: "Per person per day", value: `${result.perPersonPerDay.toFixed(1)} gal`, detail: "US average is 82" },
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
          Where the water goes
        </h2>
        <ul className="divide-y divide-border">
          {result.lines.map((line) => (
            <li key={line.id} className="px-5 py-3">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-foreground">{line.label}</span>
                <span className="shrink-0 font-mono text-muted-foreground" data-numeric>
                  {line.perDay.toFixed(1)} gal/day · {line.share.toFixed(0)}%
                </span>
              </div>
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-hover"
                role="presentation"
              >
                <div
                  className="h-full rounded-full bg-[var(--accent-home)]"
                  style={{ width: `${Math.min(100, line.share)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Most water bills also charge for sewer, usually as a multiple of the
          water used, so the real bill is often close to double the figure here.
          A single tap dripping once a second is about {DRIP_GALLONS_PER_DAY}{" "}
          gallons a day — 1,800 a year, from a washer that costs pennies.
        </span>
      </p>
    </div>
  );
}
