"use client";

import * as React from "react";
import { Baby, CalendarHeart, Info } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useNow } from "@/lib/use-client-value";
import { cn } from "@/lib/utils";
import { METHOD_LABELS, calculate, formatDate, formatShort, type Method } from "./logic";

export default function DueDateCalculatorTool() {
  const [method, setMethod] = React.useState<Method>("lmp");
  const [date, setDate] = React.useState("");
  const [cycle, setCycle] = React.useState("28");

  const nowMs = useNow();
  const today = React.useMemo(() => (nowMs ? new Date(nowMs) : null), [nowMs]);

  const parsed = date === "" ? null : new Date(`${date}T00:00:00`);
  const result =
    parsed && today ? calculate(parsed, method, Number(cycle) || 28, today) : null;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-1">
          <Label htmlFor="method">Working from</Label>
          <Select value={method} onValueChange={(v) => setMethod(v as Method)}>
            <SelectTrigger id="method">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(METHOD_LABELS) as Method[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {METHOD_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        {method === "lmp" || method === "conception" ? (
          <div className="space-y-1.5">
            <Label htmlFor="cycle">Cycle length (days)</Label>
            <Input
              id="cycle"
              inputMode="numeric"
              value={cycle}
              onChange={(event) => setCycle(event.target.value)}
              className="font-mono"
            />
          </div>
        ) : null}
      </div>

      {date === "" ? (
        <p className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
          Pick a date to see the estimate.
        </p>
      ) : result ? (
        <>
          <div className="surface-card px-6 py-5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarHeart className="size-3.5" strokeWidth={1.75} />
              Estimated due date
            </div>
            <div
              className="font-display mt-1 text-foreground"
              style={{ fontSize: "clamp(1.75rem, 6vw, 2.75rem)" }}
            >
              {formatDate(result.dueDate)}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.daysRemaining > 0
                ? `${result.daysRemaining} days to go`
                : result.daysRemaining === 0
                  ? "That is today"
                  : `${Math.abs(result.daysRemaining)} days past`}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["How far along", `${result.weeks}w ${result.days}d`],
              ["Trimester", ["First", "Second", "Third"][result.trimester - 1]],
              ["Conception (est.)", formatShort(result.conception)],
            ].map(([label, value]) => (
              <div key={label} className="surface-card px-4 py-3">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="mt-0.5 font-mono text-lg text-foreground" data-numeric>
                  {value}
                </dd>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground" data-numeric>
                {Math.round(result.percentComplete)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-[var(--accent-calculator)] transition-[width]"
                style={{ width: `${result.percentComplete}%` }}
              />
            </div>
          </div>

          <p className="flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground">
            <Baby className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
            <span>
              Only about 4% of babies arrive on their due date. Full term runs
              from <span className="font-mono">{formatShort(result.termWindow.earliest)}</span> to{" "}
              <span className="font-mono">{formatShort(result.termWindow.latest)}</span> — a
              five-week window, and anything inside it is normal.
            </span>
          </p>

          <section>
            <h2 className="text-sm font-medium text-foreground">Milestones</h2>
            <ul className="mt-3 divide-y divide-border rounded-md border border-border">
              {result.milestones.map((milestone) => {
                const past = result.weeks >= milestone.week;
                return (
                  <li
                    key={milestone.label}
                    className={cn("flex flex-wrap gap-x-4 gap-y-1 px-4 py-2.5 text-sm", past && "opacity-60")}
                  >
                    <span className="w-16 shrink-0 font-mono text-muted-foreground" data-numeric>
                      {milestone.week}w
                    </span>
                    <span className="min-w-0 flex-1 text-foreground">
                      {milestone.label}
                      {milestone.note ? (
                        <span className="block text-xs text-muted-foreground">{milestone.note}</span>
                      ) : null}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {formatShort(milestone.date)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
            <span>
              An estimate from a standard formula, not a medical assessment. A
              dating scan is more accurate than any calculation, particularly if
              your cycle is irregular, and it is what your midwife or doctor will
              use. Nothing you enter here is sent anywhere.
            </span>
          </p>
        </>
      ) : (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          Check the date and cycle length. Cycle length should be between 20 and
          45 days, and the date should be within the last year.
        </p>
      )}
    </div>
  );
}
