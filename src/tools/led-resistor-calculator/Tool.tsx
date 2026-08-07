"use client";

import * as React from "react";
import { Info, TriangleAlert } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatEngineering, formatNumeric } from "@/lib/science";
import { LED_PRESETS, calculateLedResistor } from "./logic";

export default function LedResistorCalculatorTool() {
  const [supply, setSupply] = React.useState("5");
  const [forward, setForward] = React.useState("2");
  const [current, setCurrent] = React.useState("20");
  const [count, setCount] = React.useState("1");

  const result = calculateLedResistor(
    Number(supply),
    Number(forward),
    Number(current),
    Number(count) || 1,
  );

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="led-supply">Supply voltage (V)</Label>
          <Input
            id="led-supply"
            type="number"
            inputMode="decimal"
            value={supply}
            onChange={(event) => setSupply(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="led-forward">LED forward voltage (V)</Label>
          <div className="flex gap-2">
            <Input
              id="led-forward"
              type="number"
              inputMode="decimal"
              step="0.1"
              value={forward}
              onChange={(event) => setForward(event.target.value)}
            />
            <Select value={forward} onValueChange={setForward}>
              <SelectTrigger className="w-40" aria-label="LED colour preset">
                <SelectValue placeholder="Colour" />
              </SelectTrigger>
              <SelectContent>
                {LED_PRESETS.map((preset) => (
                  <SelectItem key={preset.label} value={String(preset.forward)}>
                    {preset.label} — {preset.forward} V
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <FieldHint>Presets are typical. Your datasheet is the authority.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="led-current">Forward current (mA)</Label>
          <Input
            id="led-current"
            type="number"
            inputMode="decimal"
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
          />
          <FieldHint>20 mA is the usual maximum for a standard 5 mm LED.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="led-count">LEDs in series</Label>
          <Input
            id="led-count"
            type="number"
            inputMode="numeric"
            min={1}
            max={20}
            value={count}
            onChange={(event) => setCount(event.target.value)}
          />
        </div>
      </div>

      {result?.warning ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md border border-[color-mix(in_oklab,var(--destructive)_30%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-destructive"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          <span>{result.warning}</span>
        </p>
      ) : null}

      {result && result.standardResistance > 0 ? (
        <>
          <div className="surface-card p-6 text-center">
            <p className="text-xs text-muted-foreground">Use this resistor</p>
            <p
              className="mt-2 flex items-baseline justify-center gap-3 font-mono text-4xl tracking-[-0.03em] text-foreground sm:text-5xl"
              data-numeric
              aria-live="polite"
            >
              {formatEngineering(result.standardResistance, "Ω")}
              <CopyButton
                value={formatEngineering(result.standardResistance, "Ω")}
                iconOnly
                label="Copy resistance"
              />
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Exact value {formatEngineering(result.exactResistance, "Ω")} — rounded up to the
              nearest E24 standard, because a smaller resistor would pass more current than you
              asked for.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Actual current", value: `${formatNumeric(result.actualCurrent * 1000)} mA` },
              { label: "Resistor dissipates", value: `${formatNumeric(result.resistorPower)} W` },
              { label: "Min. resistor rating", value: `${result.recommendedRating} W` },
              { label: "LED power", value: `${formatNumeric(result.ledPower)} W` },
            ].map((card) => (
              <div key={card.label} className="surface-card p-4">
                <dt className="text-xs text-muted-foreground">{card.label}</dt>
                <dd className="mt-1 font-mono text-lg text-foreground" data-numeric>
                  {card.value}
                </dd>
              </div>
            ))}
          </dl>
        </>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          An LED is not a resistor — its current rises steeply once past the
          forward voltage, so connecting one directly across a supply destroys
          it. The series resistor is what sets the current. The suggested power
          rating is double the calculated dissipation, which is the usual margin.
        </span>
      </p>
    </div>
  );
}
