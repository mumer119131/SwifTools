"use client";

import * as React from "react";
import { HeartPulse, Info } from "lucide-react";

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
import { FORMULA_LABELS, calculateZones, formulaDifference, type Formula } from "./logic";

const ZONE_TINTS = [
  "bg-[color-mix(in_oklab,var(--accent-converter)_18%,transparent)]",
  "bg-[color-mix(in_oklab,var(--success)_18%,transparent)]",
  "bg-[color-mix(in_oklab,var(--warning)_18%,transparent)]",
  "bg-[color-mix(in_oklab,var(--accent-pdf)_18%,transparent)]",
  "bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)]",
];

export default function HeartRateZonesTool() {
  const [age, setAge] = React.useState("35");
  const [formula, setFormula] = React.useState<Formula>("tanaka");
  const [measured, setMeasured] = React.useState("");
  const [resting, setResting] = React.useState("");

  const parsedAge = Number(age);
  const parsedResting = resting.trim() === "" ? null : Number(resting);
  const parsedMeasured = measured.trim() === "" ? undefined : Number(measured);

  const result = calculateZones(
    parsedAge,
    formula,
    parsedResting !== null && Number.isFinite(parsedResting) ? parsedResting : null,
    parsedMeasured,
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="formula">Estimate maximum with</Label>
          <Select value={formula} onValueChange={(value) => setFormula(value as Formula)}>
            <SelectTrigger id="formula">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(FORMULA_LABELS) as Formula[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {FORMULA_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formula === "measured" ? (
          <div className="space-y-1.5">
            <Label htmlFor="measured">Maximum heart rate</Label>
            <Input
              id="measured"
              inputMode="numeric"
              value={measured}
              onChange={(event) => setMeasured(event.target.value)}
              placeholder="188"
              className="font-mono"
            />
          </div>
        ) : (
          <div className="space-y-1.5">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              inputMode="numeric"
              value={age}
              onChange={(event) => setAge(event.target.value)}
              className="font-mono"
              aria-invalid={result === null}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="resting">Resting heart rate (optional)</Label>
          <Input
            id="resting"
            inputMode="numeric"
            value={resting}
            onChange={(event) => setResting(event.target.value)}
            placeholder="60"
            className="font-mono"
          />
        </div>
      </div>

      {result ? (
        <>
          <div className="flex flex-wrap gap-3">
            <div className="surface-card flex-1 px-4 py-3">
              <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <HeartPulse className="size-3" strokeWidth={1.75} />
                Estimated maximum
              </dt>
              <dd className="mt-0.5 font-mono text-2xl text-foreground" data-numeric>
                {result.max} bpm
              </dd>
            </div>
            {result.reserve !== null ? (
              <div className="surface-card flex-1 px-4 py-3">
                <dt className="text-xs text-muted-foreground">Heart rate reserve</dt>
                <dd className="mt-0.5 font-mono text-2xl text-foreground" data-numeric>
                  {result.reserve} bpm
                </dd>
              </div>
            ) : null}
          </div>

          <p
            className={cn(
              "flex items-start gap-2 rounded-md border px-4 py-3 text-sm",
              result.method === "karvonen"
                ? "border-border bg-surface text-muted-foreground"
                : "border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] text-foreground",
            )}
          >
            <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
            {result.method === "karvonen" ? (
              <span>
                Using the Karvonen method, which works from the gap between your
                resting and maximum rates. It accounts for fitness, so these
                zones are higher — and more useful — than percentage-of-maximum
                figures.
              </span>
            ) : (
              <span>
                These are straight percentages of your maximum, which ignores
                fitness entirely. Add your resting heart rate — measured first
                thing, before getting up — for meaningfully better zones.
              </span>
            )}
          </p>

          <ul className="space-y-2">
            {result.zones.map((zone, index) => (
              <li key={zone.number} className="surface-card overflow-hidden">
                <div className="flex items-stretch">
                  <div className={cn("w-1.5 shrink-0", ZONE_TINTS[index])} />
                  <div className="min-w-0 flex-1 p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="text-sm font-medium text-foreground">
                        Zone {zone.number} · {zone.name}
                        <span className="ml-2 font-normal text-muted-foreground">
                          {zone.lowPercent}–{zone.highPercent}%
                        </span>
                      </h3>
                      <span className="font-mono text-lg text-foreground" data-numeric>
                        {zone.low}–{zone.high} bpm
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{zone.purpose}</p>
                    <p className="mt-1 text-xs text-subtle-foreground">{zone.feel}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {formula !== "measured" && Number.isFinite(parsedAge) ? (
            <p className="text-sm text-muted-foreground">
              At {parsedAge}, the two population formulas differ by{" "}
              <span className="text-foreground" data-numeric>
                {Math.abs(formulaDifference(parsedAge))} bpm
              </span>
              {formulaDifference(parsedAge) === 0
                ? " — they agree at 40 and diverge either side."
                : formulaDifference(parsedAge) > 0
                  ? " — 220 − age underestimates for older people."
                  : " — 220 − age overestimates for younger people."}
            </p>
          ) : null}
        </>
      ) : (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {formula === "measured"
            ? "Enter your measured maximum heart rate."
            : "Enter an age between 5 and 120."}
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          These are population estimates, not measurements. Individual maximum
          heart rates vary by 10–20 beats either side of any formula, so treat
          the zones as a starting point and adjust by how the effort actually
          feels. This is training guidance and not medical advice — if you have
          a heart condition or are starting exercise after a long gap, ask a
          doctor rather than a web page.
        </span>
      </p>
    </div>
  );
}
