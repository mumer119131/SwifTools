"use client";

import * as React from "react";
import { Info, Moon, Plus, Trash2 } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";
import {
  WEEKDAYS,
  blankEntry,
  calculateEntry,
  calculateTotals,
  formatDuration,
  type Entry,
} from "./logic";

const STARTING_WEEK: Entry[] = WEEKDAYS.slice(0, 5).map((day) => ({
  id: day,
  label: day,
  start: "",
  end: "",
  breakMinutes: 30,
}));

export default function HoursCalculatorTool() {
  // Kept locally so a timesheet survives closing the tab, which is the whole
  // point of one — nobody fills this in a single sitting.
  const [entries, setEntries] = useLocalStorage<Entry[]>("pockettoolz:timesheet", STARTING_WEEK);
  const [rate, setRate] = React.useState("");
  const [overtimeAfter, setOvertimeAfter] = React.useState("");
  const [multiplier, setMultiplier] = React.useState("1.5");

  const parsedRate = rate.trim() === "" ? null : Number(rate);
  const parsedThreshold = overtimeAfter.trim() === "" ? null : Number(overtimeAfter);

  const totals = calculateTotals(entries, {
    rate: parsedRate !== null && Number.isFinite(parsedRate) ? parsedRate : null,
    overtimeAfterHours:
      parsedThreshold !== null && Number.isFinite(parsedThreshold) ? parsedThreshold : null,
    overtimeMultiplier: Number(multiplier) || 1.5,
  });

  function update(id: string, patch: Partial<Entry>) {
    setEntries((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    );
  }

  return (
    <div className="space-y-5">
      <div className="surface-card overflow-x-auto">
        <table className="w-full min-w-[38rem] text-sm">
          <thead className="border-b border-border text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">Day</th>
              <th className="px-4 py-2.5 font-medium">Start</th>
              <th className="px-4 py-2.5 font-medium">End</th>
              <th className="px-4 py-2.5 font-medium">Break (min)</th>
              <th className="px-4 py-2.5 text-right font-medium">Worked</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {entries.map((entry) => {
              const result = calculateEntry(entry);
              return (
                <tr key={entry.id}>
                  <td className="px-4 py-2">
                    <Input
                      value={entry.label}
                      onChange={(event) => update(entry.id, { label: event.target.value })}
                      className="h-9 w-28 border-transparent bg-transparent px-2"
                      aria-label="Label"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      value={entry.start}
                      onChange={(event) => update(entry.id, { start: event.target.value })}
                      placeholder="09:00"
                      className="h-9 w-24 font-mono"
                      aria-label={`${entry.label} start`}
                      aria-invalid={result.error !== null && entry.start.trim() !== ""}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      value={entry.end}
                      onChange={(event) => update(entry.id, { end: event.target.value })}
                      placeholder="17:30"
                      className="h-9 w-24 font-mono"
                      aria-label={`${entry.label} end`}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      inputMode="numeric"
                      value={String(entry.breakMinutes)}
                      onChange={(event) =>
                        update(entry.id, { breakMinutes: Number(event.target.value) || 0 })
                      }
                      className="h-9 w-20"
                      aria-label={`${entry.label} break`}
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    {result.error ? (
                      <span className="text-xs text-destructive">{result.error}</span>
                    ) : result.minutes === null ? (
                      <span className="text-subtle-foreground">—</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-mono text-foreground" data-numeric>
                        {result.overnight ? (
                          <Moon
                            className="size-3.5 text-muted-foreground"
                            strokeWidth={1.75}
                            aria-label="Crosses midnight"
                          />
                        ) : null}
                        {formatDuration(result.minutes)}
                      </span>
                    )}
                  </td>
                  <td className="px-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label={`Remove ${entry.label}`}
                      disabled={entries.length <= 1}
                      onClick={() =>
                        setEntries((current) => current.filter((item) => item.id !== entry.id))
                      }
                    >
                      <Trash2 className="size-3.5" strokeWidth={1.75} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setEntries((current) => [
              ...current,
              blankEntry(WEEKDAYS[current.length % 7] ?? `Day ${current.length + 1}`),
            ])
          }
        >
          <Plus strokeWidth={1.75} />
          Add a day
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setEntries(STARTING_WEEK)}>
          Clear the week
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="rate">Hourly rate (optional)</Label>
          <Input
            id="rate"
            inputMode="decimal"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            placeholder="20"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ot">Overtime after (hours)</Label>
          <Input
            id="ot"
            inputMode="decimal"
            value={overtimeAfter}
            onChange={(event) => setOvertimeAfter(event.target.value)}
            placeholder="40"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mult">Overtime rate</Label>
          <Input
            id="mult"
            inputMode="decimal"
            value={multiplier}
            onChange={(event) => setMultiplier(event.target.value)}
            placeholder="1.5"
          />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Total", formatDuration(totals.minutes)],
          ["Decimal hours", totals.decimalHours.toFixed(2)],
          [
            "Overtime",
            totals.overtimeMinutes > 0 ? formatDuration(totals.overtimeMinutes) : "—",
          ],
          ["Pay", totals.pay === null ? "—" : totals.pay.toFixed(2)],
        ].map(([label, value]) => (
          <div key={label} className="surface-card px-4 py-3">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd
              className={cn(
                "mt-0.5 font-mono text-lg text-foreground",
                label === "Total" && "text-[var(--accent-calculator)]",
              )}
              data-numeric
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap gap-3">
        <CopyButton
          value={() =>
            entries
              .map((entry) => {
                const result = calculateEntry(entry);
                return `${entry.label}\t${entry.start}\t${entry.end}\t${entry.breakMinutes}\t${
                  result.minutes === null ? "" : (result.minutes / 60).toFixed(2)
                }`;
              })
              .concat(`Total\t\t\t\t${totals.decimalHours.toFixed(2)}`)
              .join("\n")
          }
          label="Copy as a table"
        />
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Times can be written however you like — <code className="font-mono">9</code>,{" "}
          <code className="font-mono">9:30</code>, <code className="font-mono">9.30</code>,{" "}
          <code className="font-mono">5:45pm</code>. A shift ending before it
          starts is treated as running past midnight rather than as a negative
          number. Your timesheet is kept in this browser and never sent anywhere.
        </span>
      </p>
    </div>
  );
}
