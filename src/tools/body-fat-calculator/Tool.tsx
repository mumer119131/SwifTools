"use client";

import * as React from "react";
import { Info, Ruler } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { MEASURING_NOTES, calculate, type Sex, type Units } from "./logic";

const TONE: Record<string, string> = {
  low: "text-[var(--warning)]",
  good: "text-[var(--success)]",
  raised: "text-[var(--warning)]",
  high: "text-destructive",
};

export default function BodyFatCalculatorTool() {
  const [sex, setSex] = React.useState<Sex>("male");
  const [units, setUnits] = React.useState<Units>("metric");
  const [height, setHeight] = React.useState("180");
  const [waist, setWaist] = React.useState("90");
  const [neck, setNeck] = React.useState("40");
  const [hip, setHip] = React.useState("95");
  const [weight, setWeight] = React.useState("");
  const [age, setAge] = React.useState("");

  const result = calculate({
    sex,
    units,
    height: Number(height),
    waist: Number(waist),
    neck: Number(neck),
    hip: sex === "female" ? Number(hip) : undefined,
    weight: weight.trim() === "" ? undefined : Number(weight),
    age: age.trim() === "" ? undefined : Number(age),
  });

  const unit = units === "metric" ? "cm" : "in";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <Tabs value={sex} onValueChange={(v) => setSex(v as Sex)}>
          <TabsList>
            <TabsTrigger value="male">Male</TabsTrigger>
            <TabsTrigger value="female">Female</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs value={units} onValueChange={(v) => setUnits(v as Units)}>
          <TabsList>
            <TabsTrigger value="metric">Metric</TabsTrigger>
            <TabsTrigger value="imperial">Imperial</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(
          [
            ["height", `Height (${unit})`, height, setHeight],
            ["waist", `Waist (${unit})`, waist, setWaist],
            ["neck", `Neck (${unit})`, neck, setNeck],
            ...(sex === "female" ? [["hip", `Hip (${unit})`, hip, setHip] as const] : []),
            ["weight", `Weight (${units === "metric" ? "kg" : "lb"}) — optional`, weight, setWeight],
            ["age", "Age — optional", age, setAge],
          ] as [string, string, string, (v: string) => void][]
        ).map(([id, label, value, setter]) => (
          <div key={id} className="space-y-1.5">
            <Label htmlFor={id}>{label}</Label>
            <Input
              id={id}
              inputMode="decimal"
              value={value}
              onChange={(event) => setter(event.target.value)}
              className="font-mono"
            />
            {MEASURING_NOTES[id] ? (
              <p className="text-xs text-muted-foreground">{MEASURING_NOTES[id]}</p>
            ) : null}
          </div>
        ))}
      </div>

      {result ? (
        <>
          <div className="surface-card px-6 py-5">
            <div className="text-xs text-muted-foreground">Estimated body fat</div>
            <div className="mt-1 flex flex-wrap items-baseline gap-3">
              <span
                className={cn("font-display", TONE[result.category.tone])}
                style={{ fontSize: "clamp(2rem, 8vw, 3.25rem)" }}
                data-numeric
              >
                {result.navy}%
              </span>
              <span className="text-sm text-muted-foreground">
                {result.category.label} · typical range {result.category.range}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Fat mass", result.fatMass === null ? "—" : `${result.fatMass} ${units === "metric" ? "kg" : "kg"}`],
              ["Lean mass", result.leanMass === null ? "—" : `${result.leanMass} kg`],
              ["BMI", result.bmi === null ? "—" : String(result.bmi)],
              ["BMI estimate", result.bmiEstimate === null ? "—" : `${result.bmiEstimate}%`],
            ].map(([label, value]) => (
              <div key={label} className="surface-card px-4 py-3">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="mt-0.5 font-mono text-lg text-foreground" data-numeric>
                  {value}
                </dd>
              </div>
            ))}
          </div>

          {result.bmiEstimate !== null ? (
            <p className="text-sm text-muted-foreground">
              The BMI-derived estimate reads{" "}
              <span className="font-mono text-foreground">{result.bmiEstimate}%</span>{" "}
              against the tape measurement&rsquo;s{" "}
              <span className="font-mono text-foreground">{result.navy}%</span>. It
              cannot tell muscle from fat, so it overstates for anyone muscular
              and understates for anyone sedentary at a normal weight. Where they
              disagree, trust the tape.
            </p>
          ) : null}
        </>
      ) : (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          Check the measurements. The neck must be smaller than the waist
          {sex === "female" ? ", and a hip measurement is needed" : ""} — the
          formula takes the difference between them.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Ruler className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The US Navy circumference method, accurate to roughly ±3–4% against
          hydrostatic weighing. That makes it genuinely useful for tracking a
          direction over months and not precise enough to agonise over a single
          reading — a centimetre out on the waist moves the result by about a
          percentage point. Measure at the same time of day, the same way, and
          watch the trend rather than the number.
        </span>
      </p>

      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Below the essential-fat range is a medical concern rather than an
          achievement. This is an estimate, not advice — and nothing you type
          leaves your browser.
        </span>
      </p>
    </div>
  );
}
