"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatEngineering } from "@/lib/science";
import { CAP_UNITS, CHARGE_STEPS, calculate, combineParallel, combineSeries } from "./logic";

export default function CapacitorCalculatorTool() {
  const [capacitance, setCapacitance] = React.useState("100");
  const [unit, setUnit] = React.useState("uf");
  const [resistance, setResistance] = React.useState("10000");
  const [frequency, setFrequency] = React.useState("50");
  const [voltage, setVoltage] = React.useState("12");
  const [second, setSecond] = React.useState("100");

  const factor = CAP_UNITS.find((entry) => entry.id === unit)?.factor ?? 1e-6;
  const farads = Number(capacitance) * factor;
  const secondFarads = Number(second) * factor;

  const result = calculate(farads, Number(resistance), Number(frequency), Number(voltage));

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cap-value">Capacitance</Label>
          <div className="flex gap-2">
            <Input
              id="cap-value"
              type="number"
              inputMode="decimal"
              min={0}
              value={capacitance}
              onChange={(event) => setCapacitance(event.target.value)}
            />
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="w-24" aria-label="Capacitance unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CAP_UNITS.map((entry) => (
                  <SelectItem key={entry.id} value={entry.id}>
                    {entry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cap-resistance">Series resistance (Ω)</Label>
          <Input
            id="cap-resistance"
            type="number"
            inputMode="decimal"
            min={0}
            value={resistance}
            onChange={(event) => setResistance(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cap-frequency">Frequency (Hz)</Label>
          <Input
            id="cap-frequency"
            type="number"
            inputMode="decimal"
            min={0}
            value={frequency}
            onChange={(event) => setFrequency(event.target.value)}
          />
          <FieldHint>0 means DC, where a capacitor blocks entirely.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cap-voltage">Voltage (V)</Label>
          <Input
            id="cap-voltage"
            type="number"
            inputMode="decimal"
            min={0}
            value={voltage}
            onChange={(event) => setVoltage(event.target.value)}
          />
        </div>
      </div>

      {result ? (
        <>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Time constant τ", value: formatEngineering(result.timeConstant, "s") },
              {
                label: "Reactance Xc",
                value: result.reactance === null ? "∞ (DC)" : formatEngineering(result.reactance, "Ω"),
              },
              {
                label: "Stored energy",
                value: result.energy === null ? "—" : formatEngineering(result.energy, "J"),
              },
              {
                label: "Charge",
                value: result.charge === null ? "—" : formatEngineering(result.charge, "C"),
              },
            ].map((card) => (
              <div key={card.label} className="surface-card p-4">
                <dt className="text-xs text-muted-foreground">{card.label}</dt>
                <dd className="mt-1 font-mono text-base text-foreground" data-numeric>
                  {card.value}
                </dd>
              </div>
            ))}
          </dl>

          {result.timeConstant > 0 ? (
            <section className="surface-card overflow-hidden">
              <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
                Charge curve
              </h2>
              <dl className="divide-y divide-border">
                {CHARGE_STEPS.map((step) => (
                  <div key={step.taus} className="flex items-center gap-4 px-5 py-2.5 text-sm">
                    <dt className="min-w-0 flex-1 text-muted-foreground">
                      {step.taus}τ — {step.percent}% charged
                    </dt>
                    <dd className="shrink-0 font-mono text-foreground" data-numeric>
                      {formatEngineering(result.timeConstant * step.taus, "s")}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </>
      ) : null}

      <section className="surface-card space-y-4 p-5">
        <h2 className="text-sm font-medium text-foreground">Combine with a second capacitor</h2>
        <div className="space-y-2">
          <Label htmlFor="cap-second">Second capacitance ({CAP_UNITS.find((e) => e.id === unit)?.label})</Label>
          <Input
            id="cap-second"
            type="number"
            inputMode="decimal"
            min={0}
            value={second}
            onChange={(event) => setSecond(event.target.value)}
            className="max-w-40"
          />
        </div>
        <dl className="grid grid-cols-2 gap-3">
          <div>
            <dt className="text-xs text-muted-foreground">In series</dt>
            <dd className="mt-1 font-mono text-lg text-foreground" data-numeric>
              {formatEngineering(combineSeries([farads, secondFarads]), "F")}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">In parallel</dt>
            <dd className="mt-1 font-mono text-lg text-foreground" data-numeric>
              {formatEngineering(combineParallel([farads, secondFarads]), "F")}
            </dd>
          </div>
        </dl>
      </section>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Capacitors combine the opposite way to resistors: they{" "}
          <strong className="text-foreground">add in parallel</strong> and
          combine reciprocally in series. A capacitor is considered fully
          charged after about 5τ — at that point it is within 0.7% of the supply,
          which is closer than most components are accurate.
        </span>
      </p>
    </div>
  );
}
