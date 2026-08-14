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
import { formatMoney } from "@/lib/home";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";
import { BUCKETS, STARTER, summarise, type Bucket, type Line } from "./logic";

interface Store {
  income: string;
  lines: Line[];
}

const EMPTY: Store = { income: "3200", lines: STARTER };

export default function BudgetTrackerTool() {
  const [store, setStore, clear] = useLocalStorage<Store>("swiftknife:budget", EMPTY);

  const summary = summarise(Number(store.income), store.lines);

  function update(id: string, patch: Partial<Line>) {
    setStore((current) => ({
      ...current,
      lines: current.lines.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    }));
  }

  return (
    <div className="space-y-5">
      <div className="surface-card flex flex-wrap items-end justify-between gap-4 p-5">
        <div className="space-y-2">
          <Label htmlFor="budget-income">Monthly income, after tax</Label>
          <Input
            id="budget-income"
            type="number"
            inputMode="decimal"
            min={0}
            value={store.income}
            onChange={(event) =>
              setStore((current) => ({ ...current, income: event.target.value }))
            }
            className="w-40 text-lg"
          />
          <FieldHint>What actually lands in your account.</FieldHint>
        </div>

        <div className="flex flex-wrap gap-2">
          <CopyButton
            value={[
              `Income: ${formatMoney(summary.income)}`,
              ...store.lines.map((line) => `${line.label}: ${formatMoney(Number(line.amount) || 0)} (${line.bucket})`),
              `Left over: ${formatMoney(summary.left)}`,
            ].join("\n")}
            label="Copy budget"
          />
          <Button variant="ghost" onClick={clear}>
            Reset
          </Button>
        </div>
      </div>

      <div className="surface-card p-6 text-center">
        <p className="text-xs text-muted-foreground">
          {summary.left >= 0 ? "Left at the end of the month" : "Over budget by"}
        </p>
        <p
          className={cn(
            "mt-2 font-mono text-4xl tracking-[-0.03em] sm:text-5xl",
            summary.left >= 0 ? "text-foreground" : "text-destructive",
          )}
          data-numeric
          aria-live="polite"
        >
          {formatMoney(Math.abs(summary.left))}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatMoney(summary.spent)} allocated of {formatMoney(summary.income)}
        </p>
      </div>

      <dl className="grid gap-3 sm:grid-cols-3">
        {BUCKETS.map((bucket) => {
          const share = summary.shares[bucket.id];
          const over = share > bucket.target + 0.5;

          return (
            <div key={bucket.id} className="surface-card p-4">
              <dt className="flex items-baseline justify-between text-xs">
                <span className="text-muted-foreground">{bucket.label}</span>
                <span className="text-subtle-foreground">target {bucket.target}%</span>
              </dt>
              <dd className="mt-1 font-mono text-lg text-foreground" data-numeric>
                {formatMoney(summary.byBucket[bucket.id])}{" "}
                <span className={cn("text-sm", over ? "text-destructive" : "text-muted-foreground")}>
                  {share.toFixed(0)}%
                </span>
              </dd>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-hover">
                <div
                  className={cn(
                    "h-full rounded-full",
                    over ? "bg-destructive" : "bg-[var(--accent-fun)]",
                  )}
                  style={{ width: `${Math.min(100, share)}%` }}
                />
              </div>
              <dd className="mt-2 text-xs text-subtle-foreground">{bucket.description}</dd>
            </div>
          );
        })}
      </dl>

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-3 text-sm font-medium text-foreground">
          Where it goes
        </h2>
        <ul className="divide-y divide-border">
          {store.lines.map((line) => (
            <li key={line.id} className="flex flex-wrap items-center gap-3 px-5 py-2.5">
              <Input
                value={line.label}
                onChange={(event) => update(line.id, { label: event.target.value })}
                aria-label="Expense name"
                className="h-9 min-w-40 flex-1"
              />
              <Input
                value={line.amount}
                onChange={(event) => update(line.id, { amount: event.target.value })}
                aria-label={`Amount for ${line.label}`}
                inputMode="decimal"
                className="h-9 w-28"
              />
              <Select
                value={line.bucket}
                onValueChange={(value) => update(line.id, { bucket: value as Bucket })}
              >
                <SelectTrigger className="h-9 w-40" aria-label={`Category for ${line.label}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUCKETS.map((bucket) => (
                    <SelectItem key={bucket.id} value={bucket.id}>
                      {bucket.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remove ${line.label}`}
                onClick={() =>
                  setStore((current) => ({
                    ...current,
                    lines: current.lines.filter((entry) => entry.id !== line.id),
                  }))
                }
              >
                <X className="size-3.5" strokeWidth={1.75} />
              </Button>
            </li>
          ))}
        </ul>
        <div className="border-t border-border px-5 py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setStore((current) => ({
                ...current,
                lines: [
                  ...current.lines,
                  { id: `line-${Date.now()}`, label: "New expense", amount: "", bucket: "wants" },
                ],
              }))
            }
          >
            <Plus className="size-4" strokeWidth={1.75} />
            Add a line
          </Button>
        </div>
      </section>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The 50/30/20 split is a starting shape, not a rule — it was written for
          a housing market that no longer exists in most cities, and needs
          routinely run past 50% through no fault of the person paying them. Use
          it to see where the money actually goes; the number worth improving is
          the savings share, currently{" "}
          <span className="font-mono text-foreground">
            {summary.savingsRate.toFixed(0)}%
          </span>{" "}
          including whatever is left unspent. Everything stays in this browser.
        </span>
      </p>
    </div>
  );
}
