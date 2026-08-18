"use client";

import * as React from "react";
import { AlertTriangle, Clock, Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNow } from "@/lib/use-client-value";
import { aliasNames, describe, expandAlias, nextRuns, parse } from "./logic";

const PRESETS: { label: string; expression: string }[] = [
  { label: "Every minute", expression: "* * * * *" },
  { label: "Every 15 minutes", expression: "*/15 * * * *" },
  { label: "Hourly", expression: "0 * * * *" },
  { label: "Daily at midnight", expression: "0 0 * * *" },
  { label: "Weekdays at 09:00", expression: "0 9 * * 1-5" },
  { label: "Every Monday", expression: "0 0 * * 1" },
  { label: "First of the month", expression: "0 0 1 * *" },
  { label: "Quarterly", expression: "0 0 1 1,4,7,10 *" },
];

const FIELD_NAMES = ["Minute", "Hour", "Day of month", "Month", "Day of week"];

export default function CronExpressionBuilderTool() {
  const [expression, setExpression] = React.useState("0 9 * * 1-5");

  const { parsed, errors } = React.useMemo(() => parse(expression), [expression]);
  const expanded = expandAlias(expression).trim();

  // Reading Date.now() during render is impure and seeding it from an effect
  // costs a second pass; the shared clock store is the mechanism for both.
  // It returns 0 until hydration, so 0 means "not known yet".
  const nowMs = useNow();

  // Bucketed to the minute: the clock ticks every second, but a cron schedule
  // has minute resolution, so recomputing more often than that is wasted work.
  const minute = Math.floor(nowMs / 60_000);
  const runs = React.useMemo(
    () => (parsed && minute ? nextRuns(parsed, new Date(minute * 60_000), 5) : []),
    [parsed, minute],
  );

  const timezone = React.useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "your local time";
    }
  }, []);

  const parts = expanded.split(/\s+/);

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="cron">Cron expression</Label>
        <Input
          id="cron"
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          placeholder="0 9 * * 1-5"
          spellCheck={false}
          className="font-mono text-base"
          aria-invalid={errors.length > 0}
        />
        <p className="pt-1 text-xs text-muted-foreground">
          Five fields: minute, hour, day of month, month, day of week. Shorthands like{" "}
          {aliasNames.slice(0, 3).map((name) => (
            <code key={name} className="font-mono">
              {name}{" "}
            </code>
          ))}
          are expanded.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.expression}
            type="button"
            onClick={() => setExpression(preset.expression)}
            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {errors.length > 0 ? (
        <div className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm">
          <p className="flex items-center gap-2 font-medium text-foreground">
            <AlertTriangle className="size-4 shrink-0 text-destructive" strokeWidth={1.75} />
            That expression will not run
          </p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            {errors.map((error) => (
              <li key={`${error.field}-${error.message}`}>
                <span className="text-foreground">{error.field}</span>: {error.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {parsed ? (
        <>
          <div className="surface-card p-5">
            <p className="text-lg leading-relaxed text-foreground">{describe(parsed)}</p>
            {expanded !== expression.trim() ? (
              <p className="mt-2 text-sm text-muted-foreground">
                <code className="font-mono">{expression.trim()}</code> expands to{" "}
                <code className="font-mono text-foreground">{expanded}</code>
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-3">
              {parts.map((part, index) => (
                <div key={FIELD_NAMES[index]} className="min-w-20">
                  <div className="text-xs text-subtle-foreground">{FIELD_NAMES[index]}</div>
                  <div className="font-mono text-sm text-foreground">{part}</div>
                </div>
              ))}
              <span className="ml-auto self-end">
                <CopyButton value={expanded} label="Copy" />
              </span>
            </div>
          </div>

          <section className="surface-card overflow-hidden">
            <h2 className="flex items-center gap-2 border-b border-border px-5 py-3 text-sm font-medium text-foreground">
              <Clock className="size-4 text-muted-foreground" strokeWidth={1.75} />
              Next runs
              <span className="ml-auto font-normal text-xs text-muted-foreground">{timezone}</span>
            </h2>
            {runs.length > 0 ? (
              <ol className="divide-y divide-border">
                {runs.map((run) => (
                  <li
                    key={run.toISOString()}
                    className="flex flex-wrap items-baseline gap-x-4 px-5 py-2.5 text-sm"
                  >
                    <span className="font-mono text-foreground" data-numeric>
                      {run.toLocaleString(undefined, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </li>
                ))}
              </ol>
            ) : nowMs ? (
              <p className="flex items-start gap-2 px-5 py-4 text-sm text-muted-foreground">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
                This schedule never fires. Nothing in the next four years matches it — a date like
                the 30th of February is the usual cause.
              </p>
            ) : (
              <p className="px-5 py-4 text-sm text-muted-foreground">Calculating…</p>
            )}
          </section>

          <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
            <span>
              These times are in {timezone}, because that is what your browser
              reports. Your server is very likely on UTC, and that difference is
              the usual reason a job fires at an unexpected hour.
            </span>
          </p>
        </>
      ) : null}
    </div>
  );
}
