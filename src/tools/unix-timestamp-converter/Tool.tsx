"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { useHydrated, useNow } from "@/lib/use-client-value";
import { NOTABLE, formats, parseTimestamp } from "./logic";

export default function UnixTimestampTool() {
  const [input, setInput] = React.useState("");
  const hydrated = useHydrated();

  // A shared clock on useSyncExternalStore. Reading Date.now() during render
  // would break purity, and seeding it from an effect would cost a second pass.
  const nowMs = useNow();

  const parsed = parseTimestamp(input);
  const now = new Date(nowMs || 0);
  const result = parsed ? formats(parsed.date, now) : null;

  const rows = result
    ? [
        { label: "Seconds", value: String(result.seconds), mono: true },
        { label: "Milliseconds", value: String(result.milliseconds), mono: true },
        { label: "ISO 8601", value: result.iso, mono: true },
        { label: "UTC", value: result.utc, mono: false },
        { label: "Local", value: `${result.localDate}, ${result.localTime}`, mono: false },
        { label: "Relative", value: result.relative, mono: false },
      ]
    : [];

  return (
    <div className="space-y-5">
      <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="text-xs text-muted-foreground">Current Unix time</p>
          <p className="mt-1 font-mono text-3xl tracking-[-0.02em] text-foreground" data-numeric>
            {hydrated && nowMs ? Math.floor(nowMs / 1000) : "—"}
          </p>
          <p className="mt-1 text-xs text-subtle-foreground">
            {hydrated && nowMs ? new Date(nowMs).toISOString() : " "}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyButton value={String(Math.floor(nowMs / 1000))} label="Copy seconds" />
          <CopyButton value={String(nowMs)} label="Copy milliseconds" />
          <Button variant="outline" onClick={() => setInput(String(Math.floor(nowMs / 1000)))}>
            Use now
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ts-input">Timestamp or date</Label>
        <Input
          id="ts-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="1700000000, 1700000000000, or 2026-08-15T12:00:00Z"
          className="font-mono text-lg"
          spellCheck={false}
          autoComplete="off"
          aria-invalid={input.trim() !== "" && parsed === null}
        />
        {parsed ? (
          <FieldHint>
            Read as <span className="font-mono text-foreground">{parsed.unit}</span>.
            {parsed.unit === "seconds" || parsed.unit === "milliseconds"
              ? " Ten digits is seconds, thirteen is milliseconds."
              : null}
          </FieldHint>
        ) : input.trim() ? (
          <p className="text-sm text-destructive">
            That is not a timestamp or a date this can read. Try a number of
            seconds, or an ISO date like 2026-08-15.
          </p>
        ) : (
          <FieldHint>The unit is detected from the number of digits.</FieldHint>
        )}
      </div>

      {result ? (
        <>
          <div className="surface-card p-6 text-center">
            <p className="text-xs text-muted-foreground">{result.dayOfWeek}</p>
            <p
              className="mt-2 text-3xl tracking-[-0.02em] text-foreground sm:text-4xl"
              aria-live="polite"
            >
              {result.localDate}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.localTime} · {result.relative}
            </p>
          </div>

          <section className="surface-card overflow-hidden">
            <ul className="divide-y divide-border">
              {rows.map((row) => (
                <li key={row.label} className="flex items-center gap-4 px-5 py-3">
                  <span className="w-28 shrink-0 text-sm text-muted-foreground">{row.label}</span>
                  <span
                    className={`min-w-0 flex-1 truncate text-sm text-foreground ${row.mono ? "font-mono" : ""}`}
                  >
                    {row.value}
                  </span>
                  <CopyButton value={row.value} iconOnly label={`Copy ${row.label}`} />
                </li>
              ))}
            </ul>
          </section>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Day of year", value: String(result.dayOfYear) },
              { label: "ISO week", value: String(result.weekOfYear) },
              { label: "Your timezone", value: result.timezone },
              {
                label: "UTC offset",
                value: `${result.offsetMinutes >= 0 ? "+" : "−"}${String(Math.floor(Math.abs(result.offsetMinutes) / 60)).padStart(2, "0")}:${String(Math.abs(result.offsetMinutes) % 60).padStart(2, "0")}`,
              },
            ].map((card) => (
              <div key={card.label} className="surface-card p-4">
                <dt className="text-xs text-muted-foreground">{card.label}</dt>
                <dd className="mt-1 truncate font-mono text-sm text-foreground" data-numeric>
                  {card.value}
                </dd>
              </div>
            ))}
          </dl>
        </>
      ) : null}

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-3 text-sm font-medium text-foreground">
          Timestamps worth knowing
        </h2>
        <ul className="divide-y divide-border">
          {NOTABLE.map((entry) => (
            <li key={entry.label} className="flex flex-wrap items-center gap-3 px-5 py-3">
              <button
                type="button"
                onClick={() => setInput(String(entry.seconds))}
                className="cursor-pointer font-mono text-sm text-foreground underline underline-offset-2 hover:text-[var(--accent-converter,var(--foreground))]"
              >
                {entry.seconds.toLocaleString("en-US")}
              </button>
              <span className="text-sm text-foreground">{entry.label}</span>
              <span className="w-full text-xs text-subtle-foreground sm:w-auto sm:flex-1">
                {entry.note}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The unit is inferred from digit count, and the inferred unit is shown
          so you can see what was assumed. That guess is where most timestamp
          bugs live: a seconds value handed to JavaScript&rsquo;s Date, which
          wants milliseconds, lands a few days after the epoch, and the reverse
          lands fifty thousand years out. Everything is computed in your browser
          against your own system clock and timezone.
        </span>
      </p>
    </div>
  );
}
