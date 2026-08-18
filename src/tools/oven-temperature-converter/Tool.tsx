"use client";

import * as React from "react";
import { Fan, Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SCALE_LABELS, TABLE, convert, fanTimeAdjustment, type Scale } from "./logic";

export default function OvenTemperatureConverterTool() {
  const [value, setValue] = React.useState("200");
  const [scale, setScale] = React.useState<Scale>("c");
  const [minutes, setMinutes] = React.useState("");

  const parsed = Number(value);
  const result = Number.isFinite(parsed) ? convert(parsed, scale) : null;

  const round = (n: number) => Math.round(n);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="temp">Temperature</Label>
          <Input
            id="temp"
            inputMode="decimal"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="w-28 font-mono"
            aria-invalid={result === null}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="scale">Given as</Label>
          <Select value={scale} onValueChange={(next) => setScale(next as Scale)}>
            <SelectTrigger id="scale" className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SCALE_LABELS) as Scale[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {SCALE_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {result ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Conventional", `${round(result.celsius)}°C`, false],
              ["Fahrenheit", `${round(result.fahrenheit)}°F`, false],
              ["Gas mark", result.gas === null ? "—" : String(result.gas), false],
              ["Fan oven", `${round(result.fanCelsius)}°C`, true],
            ].map(([label, shown, highlight]) => (
              <div
                key={label as string}
                className={cn("surface-card px-4 py-3", highlight && "border-border-strong")}
              >
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {highlight ? <Fan className="size-3" strokeWidth={1.75} /> : null}
                  {label}
                </dt>
                <dd
                  className={cn(
                    "mt-0.5 flex items-center gap-2 font-mono text-xl",
                    highlight ? "text-[var(--accent-home)]" : "text-foreground",
                  )}
                  data-numeric
                >
                  {shown}
                  <CopyButton value={String(shown)} iconOnly />
                </dd>
              </div>
            ))}
          </div>

          <p className="flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground">
            <Fan className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
            <span>
              If your oven has a fan, set it to{" "}
              <span className="font-mono">{round(result.fanCelsius)}°C</span>, not{" "}
              <span className="font-mono">{round(result.celsius)}°C</span>. Moving
              air transfers heat far better than still air, so a fan oven at the
              recipe&rsquo;s temperature runs hot — burnt outside, raw inside.
            </span>
          </p>

          {result.nearest ? (
            <p className="text-sm text-muted-foreground">
              {result.standard ? "That is a standard setting: " : "Closest standard setting: "}
              <span className="text-foreground">
                {result.nearest.celsius}°C / gas {result.nearest.gas}
              </span>{" "}
              — {result.nearest.description}
            </p>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="minutes">
              Cooking time (optional) — if you keep the temperature instead of lowering it
            </Label>
            <div className="flex flex-wrap items-center gap-3">
              <Input
                id="minutes"
                inputMode="numeric"
                value={minutes}
                onChange={(event) => setMinutes(event.target.value)}
                placeholder="40"
                className="w-24 font-mono"
              />
              {Number(minutes) > 0 ? (
                <span className="text-sm text-muted-foreground">
                  In a fan oven at the same dial, check at about{" "}
                  <span className="font-mono text-foreground">
                    {fanTimeAdjustment(Number(minutes))} minutes
                  </span>{" "}
                  instead of {Math.round(Number(minutes))}.
                </span>
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          Enter a temperature above zero.
        </p>
      )}

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-2.5 text-sm font-medium text-foreground">
          The standard settings
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-sm">
            <thead className="border-b border-border text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-2 font-medium">°C</th>
                <th className="px-5 py-2 font-medium">°F</th>
                <th className="px-5 py-2 font-medium">Gas</th>
                <th className="px-5 py-2 font-medium">Fan °C</th>
                <th className="px-5 py-2 font-medium">Typically</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TABLE.map((row) => (
                <tr
                  key={row.celsius}
                  className={cn(
                    result && Math.abs(result.celsius - row.celsius) < 0.5 && "bg-surface-hover",
                  )}
                >
                  <td className="px-5 py-2 font-mono text-foreground" data-numeric>{row.celsius}</td>
                  <td className="px-5 py-2 font-mono text-muted-foreground" data-numeric>{row.fahrenheit}</td>
                  <td className="px-5 py-2 font-mono text-muted-foreground" data-numeric>{row.gas}</td>
                  <td className="px-5 py-2 font-mono text-muted-foreground" data-numeric>{row.fanCelsius}</td>
                  <td className="px-5 py-2 text-muted-foreground">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Gas marks are a defined table rather than a formula, and the
          Fahrenheit figures are the rounded ones recipes actually print — 140°C
          is written as 275°F, not 284°F. Oven dials are also frequently 10–20°C
          out; an oven thermometer costs very little and settles the question.
        </span>
      </p>
    </div>
  );
}
