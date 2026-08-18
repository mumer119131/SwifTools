"use client";

import * as React from "react";
import { Info, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";
import {
  CATEGORIES,
  CYCLE_LABELS,
  STARTERS,
  annualCost,
  blankSubscription,
  totals,
  type Cycle,
  type Subscription,
} from "./logic";

export default function SubscriptionTrackerTool() {
  // Local, so the list is still here next month — which is the only way a
  // tool like this is used more than once.
  const [items, setItems] = useLocalStorage<Subscription[]>("pockettoolz:subscriptions", STARTERS);

  const summary = totals(items);
  const money = (value: number) =>
    value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function update(id: string, patch: Partial<Subscription>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["A year", money(summary.annual), true],
          ["A month", money(summary.monthly), false],
          ["A week", money(summary.weekly), false],
          ["A day", money(summary.daily), false],
        ].map(([label, value, highlight]) => (
          <div
            key={label as string}
            className={cn("surface-card px-4 py-3", highlight && "border-border-strong")}
          >
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd
              className={cn(
                "mt-0.5 font-mono text-xl",
                highlight ? "text-[var(--accent-calculator)]" : "text-foreground",
              )}
              data-numeric
            >
              {value}
            </dd>
          </div>
        ))}
      </div>

      <div className="surface-card overflow-x-auto">
        <table className="w-full min-w-[42rem] text-sm">
          <thead className="border-b border-border text-left text-xs text-muted-foreground">
            <tr>
              <th className="w-10 px-4 py-2.5 font-medium">On</th>
              <th className="px-4 py-2.5 font-medium">Name</th>
              <th className="px-4 py-2.5 font-medium">Amount</th>
              <th className="px-4 py-2.5 font-medium">Billed</th>
              <th className="px-4 py-2.5 font-medium">Category</th>
              <th className="px-4 py-2.5 text-right font-medium">A year</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr key={item.id} className={cn(!item.active && "opacity-50")}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={item.active}
                    onChange={(event) => update(item.id, { active: event.target.checked })}
                    className="size-4 cursor-pointer accent-[var(--accent-calculator)]"
                    aria-label={`Count ${item.name || "this subscription"}`}
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    value={item.name}
                    onChange={(event) => update(item.id, { name: event.target.value })}
                    placeholder="Netflix"
                    className="h-9 w-40"
                    aria-label="Name"
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    inputMode="decimal"
                    value={String(item.amount)}
                    onChange={(event) => update(item.id, { amount: Number(event.target.value) || 0 })}
                    className="h-9 w-24 font-mono"
                    aria-label="Amount"
                  />
                </td>
                <td className="px-4 py-2">
                  <Select
                    value={item.cycle}
                    onValueChange={(value) => update(item.id, { cycle: value as Cycle })}
                  >
                    <SelectTrigger className="h-9 w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(CYCLE_LABELS) as Cycle[]).map((key) => (
                        <SelectItem key={key} value={key}>
                          {CYCLE_LABELS[key]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-2">
                  <Select
                    value={item.category ?? "Other"}
                    onValueChange={(value) => update(item.id, { category: value })}
                  >
                    <SelectTrigger className="h-9 w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-2 text-right font-mono text-foreground" data-numeric>
                  {money(annualCost(item))}
                </td>
                <td className="px-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label={`Remove ${item.name || "subscription"}`}
                    onClick={() => setItems((current) => current.filter((s) => s.id !== item.id))}
                  >
                    <Trash2 className="size-3.5" strokeWidth={1.75} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setItems((current) => [...current, blankSubscription()])}
        >
          <Plus strokeWidth={1.75} />
          Add a subscription
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setItems(STARTERS)}>
          Start over
        </Button>
      </div>

      {summary.largest && summary.annual > 0 ? (
        <p className="text-sm text-muted-foreground">
          Your largest is{" "}
          <span className="text-foreground">{summary.largest.name || "an unnamed line"}</span> at{" "}
          <span className="font-mono text-foreground">{money(annualCost(summary.largest))}</span> a
          year
          {summary.inactive > 0 ? (
            <>
              . Turning off the {summary.inactive} unticked{" "}
              {summary.inactive === 1 ? "line" : "lines"} would save{" "}
              <span className="font-mono text-[var(--success)]">
                {money(summary.potentialInactiveSaving)}
              </span>{" "}
              a year
            </>
          ) : null}
          .
        </p>
      ) : null}

      {summary.byCategory.length > 1 ? (
        <section>
          <h2 className="text-sm font-medium text-foreground">Where it goes</h2>
          <ul className="mt-3 space-y-2">
            {summary.byCategory.map((entry) => (
              <li key={entry.category} className="flex items-center gap-3 text-sm">
                <span className="w-24 shrink-0 text-muted-foreground">{entry.category}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                  <span
                    className="block h-full rounded-full bg-[var(--accent-calculator)]"
                    style={{ width: `${entry.share * 100}%` }}
                  />
                </span>
                <span className="w-20 shrink-0 text-right font-mono text-foreground" data-numeric>
                  {money(entry.annual)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Your list is kept in this browser and never sent anywhere, so it will
          still be here next month. Untick anything you are considering
          cancelling to see the total without it before you commit.
        </span>
      </p>
    </div>
  );
}
