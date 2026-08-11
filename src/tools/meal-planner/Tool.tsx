"use client";

import * as React from "react";
import { Info, RotateCcw } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/lib/use-local-storage";
import { DAYS, MEALS, cellKey, planToText, shoppingList, type Plan } from "./logic";

const EMPTY: Plan = {};

export default function MealPlannerTool() {
  const [plan, setPlan, clear] = useLocalStorage<Plan>("swiftknife:meal-planner", EMPTY);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const list = shoppingList(plan);
  const filled = Object.values(plan).filter((cell) => cell?.dish?.trim()).length;

  function update(key: string, patch: Partial<{ dish: string; ingredients: string }>) {
    setPlan((current) => ({
      ...current,
      [key]: { dish: current[key]?.dish ?? "", ingredients: current[key]?.ingredients ?? "", ...patch },
    }));
  }

  return (
    <div className="space-y-5">
      <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
        <p className="text-sm text-muted-foreground">
          <span className="font-mono text-foreground" data-numeric>
            {filled}
          </span>{" "}
          of {DAYS.length * MEALS.length} meals planned
        </p>
        <div className="flex flex-wrap gap-2">
          <CopyButton value={planToText(plan)} label="Copy plan" />
          <Button variant="ghost" size="sm" onClick={clear}>
            <RotateCcw className="size-4" strokeWidth={1.75} />
            Clear week
          </Button>
        </div>
      </div>

      <div className="surface-card overflow-x-auto">
        <table className="w-full min-w-3xl border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="w-24 px-4 py-3 text-left text-xs font-normal text-muted-foreground">
                Day
              </th>
              {MEALS.map((meal) => (
                <th
                  key={meal}
                  className="px-4 py-3 text-left text-xs font-normal text-muted-foreground"
                >
                  {meal}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {DAYS.map((day) => (
              <tr key={day}>
                <th
                  scope="row"
                  className="px-4 py-2 text-left align-top text-sm font-medium text-foreground"
                >
                  {day.slice(0, 3)}
                </th>
                {MEALS.map((meal) => {
                  const key = cellKey(day, meal);
                  const cell = plan[key];
                  const isOpen = expanded === key;

                  return (
                    <td key={meal} className="px-2 py-2 align-top">
                      <Input
                        value={cell?.dish ?? ""}
                        onChange={(event) => update(key, { dish: event.target.value })}
                        onFocus={() => setExpanded(key)}
                        placeholder="—"
                        aria-label={`${meal} on ${day}`}
                        className="h-9 border-transparent bg-transparent hover:border-border focus-visible:border-border"
                      />
                      {isOpen ? (
                        <Textarea
                          value={cell?.ingredients ?? ""}
                          onChange={(event) => update(key, { ingredients: event.target.value })}
                          placeholder="Ingredients, comma or line separated"
                          aria-label={`Ingredients for ${meal} on ${day}`}
                          rows={2}
                          className="mt-1 text-xs"
                        />
                      ) : cell?.ingredients ? (
                        <p className="mt-1 truncate px-3 text-xs text-subtle-foreground">
                          {cell.ingredients.split(/[\n,]/).filter(Boolean).length} ingredients
                        </p>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="surface-card overflow-hidden">
        <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-medium text-foreground">
            Shopping list
            <span className="ml-2 text-xs text-subtle-foreground">{list.length} items</span>
          </h2>
          {list.length > 0 ? (
            <CopyButton
              value={list.map((item) => `- ${item.name}${item.count > 1 ? ` (×${item.count})` : ""}`).join("\n")}
              label="Copy list"
            />
          ) : null}
        </header>

        {list.length > 0 ? (
          <ul className="divide-y divide-border">
            {list.map((item) => (
              <li key={item.name} className="flex items-center gap-4 px-5 py-2 text-sm">
                <span className="min-w-0 flex-1 text-foreground">{item.name}</span>
                {item.count > 1 ? (
                  <span className="shrink-0 font-mono text-xs text-muted-foreground" data-numeric>
                    needed {item.count}×
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            Click a meal and add its ingredients — they collect here.
          </p>
        )}
      </section>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Ingredients typed under different meals are merged into one list, with
          a count when the same thing appears more than once in the week. The
          plan is saved in this browser only — nothing is uploaded and there is
          no account, so copy it out if you need it elsewhere.
        </span>
      </p>
    </div>
  );
}
