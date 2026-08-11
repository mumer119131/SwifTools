"use client";

import * as React from "react";
import { Info, Plus, X } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useHydrated } from "@/lib/use-client-value";
import { cn } from "@/lib/utils";
import {
  MEALS,
  caloriesFromMacros,
  macroTargets,
  sum,
  todayKey,
  type FoodEntry,
} from "./logic";

interface Store {
  target: string;
  proteinPercent: string;
  carbPercent: string;
  fatPercent: string;
  days: Record<string, FoodEntry[]>;
}

const EMPTY: Store = {
  target: "2000",
  proteinPercent: "30",
  carbPercent: "40",
  fatPercent: "30",
  days: {},
};

const BLANK = { name: "", meal: "Breakfast", calories: "", protein: "", carbs: "", fat: "" };

export default function CalorieTrackerTool() {
  const [store, setStore] = useLocalStorage<Store>("swiftknife:calorie-tracker", EMPTY);
  const [draft, setDraft] = React.useState(BLANK);
  const hydrated = useHydrated();

  // The date is read at render rather than stored, so the log rolls over at
  // midnight without needing a timer.
  const day = hydrated ? todayKey() : "";
  const entries = store.days[day] ?? [];

  const totals = sum(entries);
  const target = Number(store.target) || 0;
  const targets = macroTargets(
    target,
    Number(store.proteinPercent) || 0,
    Number(store.carbPercent) || 0,
    Number(store.fatPercent) || 0,
  );

  const remaining = target - totals.calories;
  const percent = target > 0 ? Math.min(100, (totals.calories / target) * 100) : 0;
  const macroCalories = caloriesFromMacros(totals);
  const mismatch =
    totals.calories > 0 && macroCalories > 0
      ? Math.abs(macroCalories - totals.calories) / totals.calories
      : 0;

  function addEntry(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.name.trim() || !day) return;

    setStore((current) => ({
      ...current,
      days: {
        ...current.days,
        [day]: [
          ...(current.days[day] ?? []),
          { ...draft, name: draft.name.trim(), id: `entry-${Date.now()}` },
        ],
      },
    }));
    setDraft({ ...BLANK, meal: draft.meal });
  }

  const macroRows = [
    { key: "protein" as const, label: "Protein", unit: "g", target: targets.protein },
    { key: "carbs" as const, label: "Carbs", unit: "g", target: targets.carbs },
    { key: "fat" as const, label: "Fat", unit: "g", target: targets.fat },
  ];

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="ct-target">Daily calorie target</Label>
          <Input
            id="ct-target"
            type="number"
            inputMode="numeric"
            min={0}
            value={store.target}
            onChange={(event) => setStore((current) => ({ ...current, target: event.target.value }))}
          />
          <FieldHint>
            Not sure? The BMI and calorie calculators work one out from your
            height, weight and activity.
          </FieldHint>
        </div>
        {[
          { id: "ct-protein", label: "Protein %", key: "proteinPercent" as const },
          { id: "ct-carbs", label: "Carbs %", key: "carbPercent" as const },
          { id: "ct-fat", label: "Fat %", key: "fatPercent" as const },
        ].map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type="number"
              inputMode="numeric"
              min={0}
              max={100}
              value={store[field.key]}
              onChange={(event) =>
                setStore((current) => ({ ...current, [field.key]: event.target.value }))
              }
            />
          </div>
        ))}
      </div>

      <div className="surface-card p-6">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {remaining >= 0 ? "Calories remaining today" : "Over target by"}
          </p>
          <p
            className={cn(
              "mt-2 font-mono text-4xl tracking-[-0.03em] sm:text-5xl",
              remaining >= 0 ? "text-foreground" : "text-destructive",
            )}
            data-numeric
            aria-live="polite"
          >
            {Math.abs(remaining).toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {totals.calories.toLocaleString("en-US", { maximumFractionDigits: 0 })} of{" "}
            {target.toLocaleString("en-US")} kcal logged
          </p>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface-hover">
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-[240ms] ease-out-expo",
              remaining >= 0 ? "bg-[var(--accent-home)]" : "bg-destructive",
            )}
            style={{ width: `${percent}%` }}
            role="progressbar"
            aria-valuenow={Math.round(percent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Calories logged against target"
          />
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-4">
          {macroRows.map((row) => (
            <div key={row.key}>
              <dt className="text-xs text-muted-foreground">{row.label}</dt>
              <dd className="mt-1 font-mono text-lg text-foreground" data-numeric>
                {totals[row.key].toFixed(0)}
                <span className="text-sm text-subtle-foreground">
                  {" "}
                  / {row.target.toFixed(0)} {row.unit}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <form onSubmit={addEntry} className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-7">
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="ct-name">Food</Label>
          <Input
            id="ct-name"
            value={draft.name}
            onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
            placeholder="Chicken salad"
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ct-meal">Meal</Label>
          <Select
            value={draft.meal}
            onValueChange={(value) => setDraft((current) => ({ ...current, meal: value }))}
          >
            <SelectTrigger id="ct-meal">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEALS.map((meal) => (
                <SelectItem key={meal} value={meal}>
                  {meal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {[
          { id: "ct-cal", label: "kcal", key: "calories" as const },
          { id: "ct-p", label: "Protein g", key: "protein" as const },
          { id: "ct-c", label: "Carbs g", key: "carbs" as const },
          { id: "ct-f", label: "Fat g", key: "fat" as const },
        ].map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type="number"
              inputMode="decimal"
              min={0}
              value={draft[field.key]}
              onChange={(event) =>
                setDraft((current) => ({ ...current, [field.key]: event.target.value }))
              }
            />
          </div>
        ))}
        <div className="sm:col-span-2 lg:col-span-7">
          <Button type="submit">
            <Plus className="size-4" strokeWidth={1.75} />
            Log it
          </Button>
        </div>
      </form>

      {mismatch > 0.15 ? (
        <p className="rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground">
          The macros you logged add up to{" "}
          <span className="font-mono">{macroCalories.toFixed(0)} kcal</span>, which is
          some way from the {totals.calories.toFixed(0)} kcal total. Worth
          checking a label — protein and carbs are 4 kcal a gram, fat is 9.
        </p>
      ) : null}

      {MEALS.map((meal) => {
        const mealEntries = entries.filter((entry) => entry.meal === meal);
        if (mealEntries.length === 0) return null;

        const mealTotals = sum(mealEntries);

        return (
          <section key={meal} className="surface-card overflow-hidden">
            <header className="flex items-baseline justify-between gap-4 border-b border-border px-5 py-3">
              <h2 className="text-sm font-medium text-foreground">{meal}</h2>
              <p className="font-mono text-xs text-muted-foreground" data-numeric>
                {mealTotals.calories.toFixed(0)} kcal
              </p>
            </header>
            <ul className="divide-y divide-border">
              {mealEntries.map((entry) => (
                <li key={entry.id} className="flex items-center gap-4 px-5 py-2.5 text-sm">
                  <span className="min-w-0 flex-1 truncate text-foreground">{entry.name}</span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground" data-numeric>
                    {Number(entry.calories) || 0} kcal · P{Number(entry.protein) || 0} C
                    {Number(entry.carbs) || 0} F{Number(entry.fat) || 0}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${entry.name}`}
                    onClick={() =>
                      setStore((current) => ({
                        ...current,
                        days: {
                          ...current.days,
                          [day]: (current.days[day] ?? []).filter((item) => item.id !== entry.id),
                        },
                      }))
                    }
                  >
                    <X className="size-3.5" strokeWidth={1.75} />
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {entries.length > 0 ? (
        <CopyButton
          value={entries
            .map((entry) => `${entry.meal}: ${entry.name} — ${entry.calories} kcal`)
            .join("\n")}
          label="Copy today's log"
        />
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Each day is logged separately and the tracker rolls over at midnight in
          your own timezone. Everything is kept in this browser — no account,
          nothing uploaded, and no sync to your phone. This is a log, not
          nutrition advice; if you are tracking for a medical reason, work with
          someone who can see the whole picture.
        </span>
      </p>
    </div>
  );
}
