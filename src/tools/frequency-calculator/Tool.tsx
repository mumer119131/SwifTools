"use client";

import * as React from "react";
import { Info } from "lucide-react";

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
import { formatEngineering } from "@/lib/science";
import { MEDIA, bandFor, solveWave } from "./logic";

type Field = "frequency" | "period" | "wavelength";

export default function FrequencyCalculatorTool() {
  const [field, setField] = React.useState<Field>("frequency");
  const [value, setValue] = React.useState("440");
  const [mediumId, setMediumId] = React.useState("sound-air");
  const [customSpeed, setCustomSpeed] = React.useState("343");

  const medium = MEDIA.find((entry) => entry.id === mediumId) ?? MEDIA[1];
  const speed = mediumId === "custom" ? Number(customSpeed) : medium.speed;
  const result = solveWave(field, Number(value), speed);

  const rows: [Field, string, string, number | undefined][] = [
    ["frequency", "Frequency", "Hz", result?.frequency],
    ["period", "Period", "s", result?.period],
    ["wavelength", "Wavelength", "m", result?.wavelength],
  ];

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="wave-field">I know the</Label>
          <Select value={field} onValueChange={(next) => setField(next as Field)}>
            <SelectTrigger id="wave-field">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frequency">Frequency (Hz)</SelectItem>
              <SelectItem value="period">Period (s)</SelectItem>
              <SelectItem value="wavelength">Wavelength (m)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="wave-value">Value</Label>
          <Input
            id="wave-value"
            type="number"
            inputMode="decimal"
            min={0}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="wave-medium">Medium</Label>
          <Select value={mediumId} onValueChange={setMediumId}>
            <SelectTrigger id="wave-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEDIA.map((entry) => (
                <SelectItem key={entry.id} value={entry.id}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {mediumId === "custom" ? (
          <div className="space-y-2">
            <Label htmlFor="wave-speed">Wave speed (m/s)</Label>
            <Input
              id="wave-speed"
              type="number"
              inputMode="decimal"
              min={0}
              value={customSpeed}
              onChange={(event) => setCustomSpeed(event.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Wave speed</Label>
            <p className="flex h-10 items-center font-mono text-sm text-muted-foreground" data-numeric>
              {formatEngineering(speed, "m/s")}
            </p>
            <FieldHint>Wavelength depends on the medium; frequency does not.</FieldHint>
          </div>
        )}
      </div>

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
          Results
        </h2>
        <dl className="divide-y divide-border">
          {rows.map(([id, label, unit, resultValue]) => (
            <div key={id} className="flex items-center gap-4 px-5 py-3">
              <dt className="min-w-0 flex-1 text-sm text-muted-foreground">
                {label}
                {field === id ? <span className="ml-2 text-xs text-subtle-foreground">given</span> : null}
              </dt>
              <dd className="shrink-0 font-mono text-base text-foreground" data-numeric>
                {resultValue === undefined ? "—" : formatEngineering(resultValue, unit)}
              </dd>
              {resultValue !== undefined ? (
                <CopyButton
                  value={formatEngineering(resultValue, unit)}
                  iconOnly
                  label={`Copy ${label}`}
                />
              ) : null}
            </div>
          ))}
        </dl>
      </section>

      {result ? (
        <p className="text-sm text-muted-foreground">
          That frequency sits in: <span className="text-foreground">{bandFor(result.frequency)}</span>
        </p>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Frequency and period are reciprocals and depend on nothing else.
          Wavelength does depend on the medium — the same 440 Hz note is about
          78 cm in air and 3.4 m in water, which is why the medium selector
          matters.
        </span>
      </p>
    </div>
  );
}
