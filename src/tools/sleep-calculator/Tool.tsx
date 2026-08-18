"use client";

import * as React from "react";
import { Info, Moon, Sunrise } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNow } from "@/lib/use-client-value";
import { cn } from "@/lib/utils";
import {
  DEFAULT_LATENCY,
  bedtimesFor,
  formatSleep,
  formatTime,
  parseTime,
  wakeTimesFor,
} from "./logic";

export default function SleepCalculatorTool() {
  const [mode, setMode] = React.useState<"wake" | "bed">("wake");
  const [wake, setWake] = React.useState("07:00");
  const [bed, setBed] = React.useState("23:00");
  const [latency, setLatency] = React.useState(String(DEFAULT_LATENCY));
  const [clock, setClock] = React.useState<"24" | "12">("24");

  const nowMs = useNow();

  const fallAsleep = Number(latency);
  const safeLatency = Number.isFinite(fallAsleep) && fallAsleep >= 0 ? fallAsleep : DEFAULT_LATENCY;

  const wakeMinutes = parseTime(wake);
  const bedMinutes = parseTime(bed);

  const suggestions =
    mode === "wake"
      ? wakeMinutes !== null
        ? bedtimesFor(wakeMinutes, safeLatency)
        : null
      : bedMinutes !== null
        ? wakeTimesFor(bedMinutes, safeLatency)
        : null;

  function sleepNow() {
    if (!nowMs) return;
    const date = new Date(nowMs);
    setBed(formatTime(date.getHours() * 60 + date.getMinutes()));
    setMode("bed");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={mode} onValueChange={(value) => setMode(value as typeof mode)}>
          <TabsList>
            <TabsTrigger value="wake">I need to wake at…</TabsTrigger>
            <TabsTrigger value="bed">I&rsquo;m going to bed at…</TabsTrigger>
          </TabsList>
        </Tabs>

        <button
          type="button"
          onClick={() => setClock((value) => (value === "24" ? "12" : "24"))}
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          {clock === "24" ? "12-hour" : "24-hour"}
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="time">{mode === "wake" ? "Wake up at" : "Going to bed at"}</Label>
          <Input
            id="time"
            value={mode === "wake" ? wake : bed}
            onChange={(event) =>
              mode === "wake" ? setWake(event.target.value) : setBed(event.target.value)
            }
            placeholder="07:00"
            className="w-28 font-mono"
            aria-invalid={(mode === "wake" ? wakeMinutes : bedMinutes) === null}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="latency">Minutes to fall asleep</Label>
          <Input
            id="latency"
            inputMode="numeric"
            value={latency}
            onChange={(event) => setLatency(event.target.value)}
            className="w-24 font-mono"
          />
        </div>

        {mode === "bed" ? (
          <button
            type="button"
            onClick={sleepNow}
            disabled={!nowMs}
            className="h-10 rounded-md border border-border px-4 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground disabled:opacity-50"
          >
            If I sleep now
          </button>
        ) : null}
      </div>

      {suggestions ? (
        <>
          <p className="text-sm text-muted-foreground">
            {mode === "wake"
              ? "Go to bed at one of these to wake at the end of a cycle rather than the middle of one."
              : "Set your alarm for one of these."}
          </p>

          <ul className="grid gap-3 sm:grid-cols-2">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.cycles}
                className={cn(
                  "surface-card flex items-center gap-4 px-5 py-4",
                  suggestion.recommended && "border-border-strong",
                )}
              >
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-full border border-border",
                    suggestion.recommended ? "bg-surface-hover" : "bg-background",
                  )}
                >
                  {mode === "wake" ? (
                    <Moon className="size-4 text-muted-foreground" strokeWidth={1.75} />
                  ) : (
                    <Sunrise className="size-4 text-muted-foreground" strokeWidth={1.75} />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      "font-mono text-2xl",
                      suggestion.recommended
                        ? "text-[var(--accent-calculator)]"
                        : "text-foreground",
                    )}
                    data-numeric
                  >
                    {formatTime(suggestion.minutes, clock)}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {suggestion.cycles} cycles · {formatSleep(suggestion.sleepMinutes)} asleep
                    {suggestion.recommended ? " · recommended" : ""}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          Enter a time like 07:00, 7am or 10:45pm.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Ninety minutes is an average, not a constant — real cycles run
          anywhere from 70 to 120 minutes and vary between people and across a
          night. Treat these as sensible targets rather than precise
          instructions, and note that six hours is still six hours however well
          it is timed.
        </span>
      </p>
    </div>
  );
}
