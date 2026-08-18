"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  RACES,
  formatDuration,
  formatPace,
  fromKm,
  fromPaceAndDistance,
  fromPaceAndTime,
  fromTimeAndDistance,
  parseDuration,
  racePredictions,
  splits,
  type Unit,
} from "./logic";

type Solve = "pace" | "time" | "distance";

export default function PaceCalculatorTool() {
  const [solve, setSolve] = React.useState<Solve>("pace");
  const [unit, setUnit] = React.useState<Unit>("km");
  const [distance, setDistance] = React.useState("10");
  const [time, setTime] = React.useState("50:00");
  const [pace, setPace] = React.useState("5:00");

  const parsedTime = parseDuration(time);
  const parsedPace = parseDuration(pace);
  const parsedDistance = Number(distance);

  const result =
    solve === "pace"
      ? parsedTime !== null
        ? fromTimeAndDistance(parsedTime, parsedDistance, unit)
        : null
      : solve === "time"
        ? parsedPace !== null
          ? fromPaceAndDistance(parsedPace, parsedDistance, unit)
          : null
        : parsedPace !== null && parsedTime !== null
          ? fromPaceAndTime(parsedPace, parsedTime, unit)
          : null;

  const perUnit = result ? (unit === "km" ? result.perKm : result.perMile) : 0;
  const rows = result ? splits(perUnit, fromKm(result.km, unit)) : [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={solve} onValueChange={(value) => setSolve(value as Solve)}>
          <TabsList>
            <TabsTrigger value="pace">Find pace</TabsTrigger>
            <TabsTrigger value="time">Find time</TabsTrigger>
            <TabsTrigger value="distance">Find distance</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={unit} onValueChange={(value) => setUnit(value as Unit)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="km">Kilometres</SelectItem>
            <SelectItem value="mi">Miles</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        {solve !== "distance" ? (
          <div className="space-y-1.5">
            <Label htmlFor="distance">Distance ({unit})</Label>
            <Input
              id="distance"
              inputMode="decimal"
              value={distance}
              onChange={(event) => setDistance(event.target.value)}
              className="w-28 font-mono"
            />
          </div>
        ) : null}

        {solve !== "time" ? (
          <div className="space-y-1.5">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              placeholder="50:00"
              className="w-32 font-mono"
              aria-invalid={parsedTime === null}
            />
          </div>
        ) : null}

        {solve !== "pace" ? (
          <div className="space-y-1.5">
            <Label htmlFor="pace">Pace (per {unit})</Label>
            <Input
              id="pace"
              value={pace}
              onChange={(event) => setPace(event.target.value)}
              placeholder="5:00"
              className="w-28 font-mono"
              aria-invalid={parsedPace === null}
            />
          </div>
        ) : null}
      </div>

      {solve !== "distance" ? (
        <div className="flex flex-wrap gap-2">
          {RACES.map((race) => (
            <button
              key={race.label}
              type="button"
              onClick={() => setDistance(String(Number(fromKm(race.km, unit).toFixed(3))))}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                Math.abs(Number(distance) - fromKm(race.km, unit)) < 0.01
                  ? "border-border-strong text-foreground"
                  : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
              )}
            >
              {race.label}
            </button>
          ))}
        </div>
      ) : null}

      {result ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Pace", `${formatPace(result.perKm)}/km`],
              ["Pace", `${formatPace(result.perMile)}/mi`],
              ["Speed", `${result.kph.toFixed(2)} km/h`],
              ["Speed", `${result.mph.toFixed(2)} mph`],
            ].map(([label, value], index) => (
              <div key={index} className="surface-card px-4 py-3">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="mt-0.5 flex items-center gap-2 font-mono text-lg text-foreground" data-numeric>
                  {value}
                  <CopyButton value={value} iconOnly />
                </dd>
              </div>
            ))}
          </div>

          <div className="surface-card px-5 py-4">
            <div className="text-xs text-muted-foreground">
              {fromKm(result.km, unit).toFixed(2)} {unit} in
            </div>
            <div className="mt-1 font-mono text-2xl text-[var(--accent-calculator)]" data-numeric>
              {formatDuration(result.totalSeconds)}
            </div>
          </div>

          <section>
            <h2 className="text-sm font-medium text-foreground">
              At this pace, the standard distances
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {racePredictions(result.perKm).map((race) => (
                <li
                  key={race.label}
                  className="flex items-baseline justify-between gap-3 rounded-md border border-border px-4 py-2 text-sm"
                >
                  <span className="text-muted-foreground">{race.label}</span>
                  <span className="font-mono text-foreground" data-numeric>
                    {formatDuration(race.seconds)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              A straight extrapolation, not a race prediction — nobody holds
              their 5K pace for a marathon.
            </p>
          </section>

          {rows.length > 1 ? (
            <section className="surface-card overflow-hidden">
              <h2 className="border-b border-border px-5 py-2.5 text-sm font-medium text-foreground">
                Splits
              </h2>
              <div className="max-h-72 overflow-auto">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border">
                    {rows.map((row) => (
                      <tr key={row.at}>
                        <td className="px-5 py-1.5 text-muted-foreground" data-numeric>
                          {Number.isInteger(row.at) ? row.at : row.at.toFixed(3)} {unit}
                        </td>
                        <td className="px-5 py-1.5 text-right font-mono text-foreground" data-numeric>
                          {formatDuration(row.elapsed)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </>
      ) : (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          Check the figures. Times are minutes and seconds — 50:00 is fifty
          minutes, 1:45:30 is an hour forty-five.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Both time and pace are read as minutes and seconds, so{" "}
          <code className="font-mono">50:00</code> in the time box is fifty
          minutes and <code className="font-mono">5:00</code> in the pace box is
          five minutes per {unit}. Add hours with a third part —{" "}
          <code className="font-mono">1:45:30</code>.
        </span>
      </p>
    </div>
  );
}
