"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  KG_PER_LB,
  calculateBmi,
  categories,
  feetInchesToCm,
  scalePosition,
} from "./logic";

type UnitSystem = "metric" | "imperial";

export default function BmiCalculatorTool() {
  const [units, setUnits] = React.useState<UnitSystem>("metric");
  const [heightCm, setHeightCm] = React.useState("175");
  const [weightKg, setWeightKg] = React.useState("72");
  const [feet, setFeet] = React.useState("5");
  const [inches, setInches] = React.useState("9");
  const [pounds, setPounds] = React.useState("159");

  const height =
    units === "metric" ? Number(heightCm) : feetInchesToCm(Number(feet) || 0, Number(inches) || 0);
  const weight = units === "metric" ? Number(weightKg) : (Number(pounds) || 0) * KG_PER_LB;

  const result = React.useMemo(() => calculateBmi(height, weight), [height, weight]);

  const displayWeight = (kg: number) =>
    units === "metric" ? `${kg.toFixed(1)} kg` : `${(kg / KG_PER_LB).toFixed(0)} lb`;

  return (
    <div className="space-y-5">
      <Tabs value={units} onValueChange={(value) => setUnits(value as UnitSystem)}>
        <TabsList>
          <TabsTrigger value="metric">Metric</TabsTrigger>
          <TabsTrigger value="imperial">Imperial</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        {units === "metric" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="bmi-height">Height (cm)</Label>
              <Input
                id="bmi-height"
                type="number"
                inputMode="decimal"
                min={50}
                max={260}
                value={heightCm}
                onChange={(event) => setHeightCm(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bmi-weight">Weight (kg)</Label>
              <Input
                id="bmi-weight"
                type="number"
                inputMode="decimal"
                min={10}
                max={400}
                value={weightKg}
                onChange={(event) => setWeightKg(event.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <span className="text-sm font-medium text-foreground">Height</span>
              <div className="flex gap-3">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="bmi-feet" className="text-xs font-normal text-muted-foreground">
                    Feet
                  </Label>
                  <Input
                    id="bmi-feet"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={8}
                    value={feet}
                    onChange={(event) => setFeet(event.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label htmlFor="bmi-inches" className="text-xs font-normal text-muted-foreground">
                    Inches
                  </Label>
                  <Input
                    id="bmi-inches"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={11}
                    value={inches}
                    onChange={(event) => setInches(event.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bmi-pounds">Weight (lb)</Label>
              <Input
                id="bmi-pounds"
                type="number"
                inputMode="decimal"
                min={20}
                max={900}
                value={pounds}
                onChange={(event) => setPounds(event.target.value)}
              />
            </div>
          </>
        )}
      </div>

      {result ? (
        <>
          <div className="surface-card p-6 text-center">
            <p className="text-xs text-muted-foreground">Your BMI</p>
            <p
              className="mt-1 font-mono text-5xl tracking-[-0.03em] text-foreground"
              data-numeric
              aria-live="polite"
            >
              {result.bmi.toFixed(1)}
            </p>
            <p className="mt-2 text-sm text-foreground">{result.category.label}</p>
          </div>

          {/* Scale from 15 to 40, with the reading marked. Categories are
              labelled in words as well as position — never colour alone. */}
          <section className="space-y-2">
            <h2 className="text-sm font-medium text-foreground">Where you sit</h2>
            <div className="relative pt-6">
              <div
                className="absolute top-0 -translate-x-1/2 whitespace-nowrap font-mono text-xs text-foreground"
                style={{ left: `${scalePosition(result.bmi)}%` }}
                aria-hidden="true"
              >
                ▼ {result.bmi.toFixed(1)}
              </div>
              <div className="flex h-3 overflow-hidden rounded-full border border-border">
                {categories.map((category) => {
                  const width = ((Math.min(category.to, 40) - Math.max(category.from, 15)) / 25) * 100;
                  if (width <= 0) return null;
                  return (
                    <div
                      key={category.id}
                      className={cn(
                        category.id === "healthy"
                          ? "bg-success"
                          : "bg-[color-mix(in_oklab,var(--foreground)_20%,transparent)]",
                        category.id === result.category.id && "ring-2 ring-inset ring-foreground",
                      )}
                      style={{ width: `${width}%` }}
                    />
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between text-xs text-subtle-foreground" data-numeric>
                <span>15</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
              </div>
            </div>
          </section>

          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="surface-card p-4">
              <dt className="text-xs text-muted-foreground">Healthy range for your height</dt>
              <dd className="mt-1 font-mono text-lg text-foreground" data-numeric>
                {displayWeight(result.healthyMinKg)} – {displayWeight(result.healthyMaxKg)}
              </dd>
            </div>
            <div className="surface-card p-4">
              <dt className="text-xs text-muted-foreground">Category</dt>
              <dd className="mt-1 text-lg text-foreground">{result.category.label}</dd>
            </div>
          </dl>
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Enter a height and weight to calculate.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          <strong className="text-foreground">BMI is a population screening tool.</strong> It
          doesn&rsquo;t distinguish muscle from fat, so athletes often read as
          &ldquo;overweight&rdquo;, and it isn&rsquo;t validated for children, pregnancy, or the
          elderly. It also performs differently across ethnic groups. Use it as one rough signal
          among several, and talk to a doctor about what it means for you.
        </span>
      </p>
    </div>
  );
}
