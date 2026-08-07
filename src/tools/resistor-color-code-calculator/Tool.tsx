"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatEngineering } from "@/lib/science";
import { decode, encode, optionsForBand, type BandCount } from "./logic";

const BAND_LABELS: Record<BandCount, string[]> = {
  3: ["1st digit", "2nd digit", "Multiplier"],
  4: ["1st digit", "2nd digit", "Multiplier", "Tolerance"],
  5: ["1st digit", "2nd digit", "3rd digit", "Multiplier", "Tolerance"],
  6: ["1st digit", "2nd digit", "3rd digit", "Multiplier", "Tolerance", "Temp. coeff."],
};

const DEFAULTS: Record<BandCount, string[]> = {
  3: ["Yellow", "Violet", "Red"],
  4: ["Yellow", "Violet", "Red", "Gold"],
  5: ["Yellow", "Violet", "Black", "Brown", "Brown"],
  6: ["Yellow", "Violet", "Black", "Brown", "Brown", "Brown"],
};

export default function ResistorColorCodeTool() {
  const [mode, setMode] = React.useState<"decode" | "encode">("decode");
  const [bandCount, setBandCount] = React.useState<BandCount>(4);
  const [bands, setBands] = React.useState<string[]>(DEFAULTS[4]);
  const [resistance, setResistance] = React.useState("4700");

  function changeBandCount(next: BandCount) {
    setBandCount(next);
    setBands(DEFAULTS[next]);
  }

  // In reverse mode the bands are derived from the typed resistance.
  const encoded = mode === "encode" ? encode(Number(resistance), bandCount) : null;
  const shownBands = mode === "encode" ? (encoded ?? bands) : bands;
  const reading = decode(bandCount, shownBands);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <Tabs value={mode} onValueChange={(value) => setMode(value as "decode" | "encode")}>
          <TabsList>
            <TabsTrigger value="decode">Bands → value</TabsTrigger>
            <TabsTrigger value="encode">Value → bands</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <Label htmlFor="band-count">Bands</Label>
          <Select
            value={String(bandCount)}
            onValueChange={(value) => changeBandCount(Number(value) as BandCount)}
          >
            <SelectTrigger id="band-count" className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[3, 4, 5, 6].map((count) => (
                <SelectItem key={count} value={String(count)}>
                  {count}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* The part itself, drawn from the current bands. */}
      <div className="surface-card grid place-items-center p-8">
        <div className="flex w-full max-w-md items-center" role="img" aria-label="Resistor preview">
          <span className="h-1 flex-1 bg-[var(--border-strong)]" />
          <span className="relative flex h-16 items-center justify-center gap-2 rounded-lg bg-[#d9c9a3] px-5 shadow-card">
            {shownBands.map((name, index) => (
              <span
                key={index}
                className="h-16 w-3 rounded-sm"
                style={{ backgroundColor: optionsForBand(bandCount, index).find((c) => c.name === name)?.hex ?? "#000" }}
              />
            ))}
          </span>
          <span className="h-1 flex-1 bg-[var(--border-strong)]" />
        </div>
      </div>

      {mode === "encode" ? (
        <div className="space-y-2">
          <Label htmlFor="resistor-value">Resistance (Ω)</Label>
          <Input
            id="resistor-value"
            type="number"
            inputMode="decimal"
            min={0}
            value={resistance}
            onChange={(event) => setResistance(event.target.value)}
            className="max-w-xs"
            aria-invalid={encoded === null}
          />
          <FieldHint>
            {encoded === null
              ? "That value cannot be encoded with this many bands — try a different band count."
              : "Enter the value in ohms. 4700 gives yellow-violet-red."}
          </FieldHint>
        </div>
      ) : (
        <div className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {BAND_LABELS[bandCount].map((label, index) => (
            <div key={label} className="space-y-2">
              <Label htmlFor={`band-${index}`}>{label}</Label>
              <Select
                value={bands[index]}
                onValueChange={(value) =>
                  setBands((current) => current.map((entry, i) => (i === index ? value : entry)))
                }
              >
                <SelectTrigger id={`band-${index}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {optionsForBand(bandCount, index).map((color) => (
                    <SelectItem key={color.name} value={color.name}>
                      <span className="flex items-center gap-2">
                        <span
                          className="size-3 rounded-full border border-border"
                          style={{ backgroundColor: color.hex }}
                        />
                        {color.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}

      {reading ? (
        <>
          <div className="surface-card p-6 text-center">
            <p className="text-xs text-muted-foreground">Resistance</p>
            <p
              className="mt-2 flex items-baseline justify-center gap-3 font-mono text-4xl tracking-[-0.03em] text-foreground sm:text-5xl"
              data-numeric
              aria-live="polite"
            >
              {formatEngineering(reading.resistance, "Ω")}
              {reading.tolerance !== null ? (
                <span className="text-lg text-muted-foreground">±{reading.tolerance}%</span>
              ) : null}
              <CopyButton
                value={formatEngineering(reading.resistance, "Ω")}
                iconOnly
                label="Copy resistance"
              />
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Minimum", value: formatEngineering(reading.min, "Ω") },
              { label: "Maximum", value: formatEngineering(reading.max, "Ω") },
              {
                label: "Tolerance",
                value: reading.tolerance === null ? "±20% (none)" : `±${reading.tolerance}%`,
              },
              {
                label: "Temp. coefficient",
                value: reading.tempCoefficient === null ? "—" : `${reading.tempCoefficient} ppm/°C`,
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
        </>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Read from the end with bands grouped closest together — the tolerance
          band sits slightly apart. A resistor with no tolerance band is ±20% by
          convention. Gold and silver never appear as digits, only as
          multipliers or tolerances, so a band of either tells you which end
          you&rsquo;re looking at.
        </span>
      </p>
    </div>
  );
}
