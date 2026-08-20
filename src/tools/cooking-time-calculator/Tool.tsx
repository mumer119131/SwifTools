"use client";

import * as React from "react";
import { AlertTriangle, Clock, Thermometer } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  DONENESS_LABELS, MEATS, calculate, donenessOptions, formatMinutes, startTime,
  toFahrenheit, type Doneness,
} from "./logic";

function parseClock(input: string): number | null {
  const match = input.trim().match(/^(\d{1,2})[:.]?(\d{2})?$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = match[2] ? Number(match[2]) : 0;
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function formatClock(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export default function CookingTimeCalculatorTool() {
  const [meatId, setMeatId] = React.useState("beef");
  const [weight, setWeight] = React.useState("2");
  const [doneness, setDoneness] = React.useState<Doneness>("medium-rare");
  const [serveAt, setServeAt] = React.useState("13:00");

  const options = donenessOptions(meatId);
  const result = calculate(meatId, Number(weight), doneness);

  const serveMinutes = parseClock(serveAt);

  function changeMeat(next: string) {
    setMeatId(next);
    const available = donenessOptions(next);
    if (available.length > 0 && !available.includes(doneness)) setDoneness(available[0]);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="meat">What are you roasting</Label>
          <Select value={meatId} onValueChange={changeMeat}>
            <SelectTrigger id="meat">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEATS.map((meat) => (
                <SelectItem key={meat.id} value={meat.id}>
                  {meat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            inputMode="decimal"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            className="font-mono"
            aria-invalid={result === null}
          />
        </div>

        {options.length > 0 ? (
          <div className="space-y-1.5">
            <Label htmlFor="doneness">How you like it</Label>
            <Select value={doneness} onValueChange={(v) => setDoneness(v as Doneness)}>
              <SelectTrigger id="doneness">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((key) => (
                  <SelectItem key={key} value={key}>
                    {DONENESS_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <div className="space-1.5">
          <Label htmlFor="serve">Serving at</Label>
          <Input
            id="serve"
            value={serveAt}
            onChange={(event) => setServeAt(event.target.value)}
            placeholder="13:00"
            className="font-mono"
          />
        </div>
      </div>

      {result ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["In the oven", formatMinutes(result.minutes), true],
              ["Then rest", formatMinutes(result.restMinutes), false],
              ["Oven", `${result.celsius}°C · fan ${result.fanCelsius}°C`, false],
              [
                "Cooked at",
                result.internalCelsius === null
                  ? "—"
                  : `${result.internalCelsius}°C / ${toFahrenheit(result.internalCelsius)}°F`,
                true,
              ],
            ].map(([label, value, highlight]) => (
              <div
                key={label as string}
                className={cn("surface-card px-4 py-3", highlight && "border-border-strong")}
              >
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {label === "Cooked at" ? <Thermometer className="size-3" strokeWidth={1.75} /> : null}
                  {label === "In the oven" ? <Clock className="size-3" strokeWidth={1.75} /> : null}
                  {label}
                </dt>
                <dd
                  className={cn(
                    "mt-0.5 font-mono text-lg",
                    highlight ? "text-[var(--accent-home)]" : "text-foreground",
                  )}
                  data-numeric
                >
                  {value}
                </dd>
              </div>
            ))}
          </div>

          {serveMinutes !== null ? (
            <div className="surface-card px-5 py-4">
              <div className="text-xs text-muted-foreground">
                To serve at {formatClock(serveMinutes)}, it goes in at
              </div>
              <div className="mt-1 font-mono text-3xl text-[var(--accent-home)]" data-numeric>
                {formatClock(startTime(serveMinutes, result.totalMinutes))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatMinutes(result.minutes)} cooking plus{" "}
                {formatMinutes(result.restMinutes)} resting. Take it out of the
                fridge an hour before that — a cold joint cooks unevenly and
                takes longer than the table says.
              </p>
            </div>
          ) : null}

          {result.meat.note ? (
            <p className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
              {result.meat.note}
            </p>
          ) : null}

          <p className="flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground">
            <Thermometer className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
            <span>
              Time is an estimate; temperature is the answer. Thickness matters
              more than weight, oven dials are frequently 10–20°C out, and a
              joint straight from the fridge takes noticeably longer. Check with
              a thermometer in the thickest part, away from bone
              {result.internalCelsius !== null ? (
                <>
                  {" "}— you want{" "}
                  <span className="font-mono">{result.internalCelsius}°C</span>
                </>
              ) : null}
              .
            </span>
          </p>

          {["chicken", "turkey", "duck", "pork"].includes(result.meat.id) ? (
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
              Poultry and pork have no doneness setting because there is only one
              safe answer. Cook them through.
            </p>
          ) : null}
        </>
      ) : (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          Enter a weight between 0 and 30 kg.
        </p>
      )}
    </div>
  );
}
