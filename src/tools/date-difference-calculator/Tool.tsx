"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNow } from "@/lib/use-client-value";
import { difference, parseDate, shift, toInputValue, type Unit } from "./logic";

export default function DateDifferenceTool() {
  const [mode, setMode] = React.useState<"between" | "shift">("between");
  const [start, setStart] = React.useState("");
  const [end, setEnd] = React.useState("");
  const [amount, setAmount] = React.useState("30");
  const [unit, setUnit] = React.useState<Unit>("days");
  const [direction, setDirection] = React.useState<"add" | "subtract">("add");

  const nowMs = useNow();
  const today = nowMs ? toInputValue(new Date(nowMs)) : "";

  // Seed both fields with today the first time the clock reports in, without
  // an effect — an empty string means "not set yet" rather than a real value.
  const from = parseDate(start || today);
  const to = parseDate(end || today);

  const result = from && to ? difference(from, to) : null;

  const shifted =
    from && Number.isFinite(Number(amount))
      ? shift(from, direction === "add" ? Number(amount) : -Number(amount), unit)
      : null;

  return (
    <div className="space-y-5">
      <Tabs value={mode} onValueChange={(value) => setMode(value as "between" | "shift")}>
        <TabsList>
          <TabsTrigger value="between">Between two dates</TabsTrigger>
          <TabsTrigger value="shift">Add or subtract</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="surface-card flex flex-wrap items-end gap-4 p-5">
        <div className="space-y-2">
          <Label htmlFor="dd-start">{mode === "between" ? "Start date" : "From this date"}</Label>
          <Input
            id="dd-start"
            type="date"
            value={start || today}
            onChange={(event) => setStart(event.target.value)}
            className="w-48"
          />
        </div>

        {mode === "between" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="dd-end">End date</Label>
              <Input
                id="dd-end"
                type="date"
                value={end || today}
                onChange={(event) => setEnd(event.target.value)}
                className="w-48"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                const a = start || today;
                setStart(end || today);
                setEnd(a);
              }}
            >
              Swap
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <span className="text-sm font-medium text-foreground">Direction</span>
              <Tabs value={direction} onValueChange={(value) => setDirection(value as "add" | "subtract")}>
                <TabsList>
                  <TabsTrigger value="add">Add</TabsTrigger>
                  <TabsTrigger value="subtract">Subtract</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dd-amount">How many</Label>
              <Input
                id="dd-amount"
                type="number"
                inputMode="numeric"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="w-28"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dd-unit">Unit</Label>
              <Select value={unit} onValueChange={(value) => setUnit(value as Unit)}>
                <SelectTrigger id="dd-unit" className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                  <SelectItem value="years">Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      {mode === "between" && result ? (
        <>
          <div className="surface-card p-6 text-center">
            <p className="text-xs text-muted-foreground">
              {result.reversed ? "The end date is before the start" : "Difference"}
            </p>
            <p
              className="mt-2 font-mono text-4xl tracking-[-0.03em] text-foreground sm:text-5xl"
              data-numeric
              aria-live="polite"
            >
              {result.totalDays.toLocaleString("en-US")} days
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {[
                result.years > 0 ? `${result.years} year${result.years === 1 ? "" : "s"}` : null,
                result.months > 0 ? `${result.months} month${result.months === 1 ? "" : "s"}` : null,
                result.days > 0 ? `${result.days} day${result.days === 1 ? "" : "s"}` : null,
              ]
                .filter(Boolean)
                .join(", ") || "The same day"}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "Weeks", value: result.totalWeeks.toFixed(2) },
              { label: "Hours", value: result.totalHours.toLocaleString("en-US") },
              { label: "Minutes", value: result.totalMinutes.toLocaleString("en-US") },
              { label: "Working days", value: result.weekdays.toLocaleString("en-US"), detail: "Weekends excluded" },
              { label: "Weekend days", value: result.weekendDays.toLocaleString("en-US") },
              { label: "Months", value: (result.years * 12 + result.months).toLocaleString("en-US"), detail: "Whole months" },
            ].map((card) => (
              <div key={card.label} className="surface-card p-4">
                <dt className="text-xs text-muted-foreground">{card.label}</dt>
                <dd className="mt-1 font-mono text-base text-foreground" data-numeric>
                  {card.value}
                </dd>
                {card.detail ? (
                  <dd className="mt-0.5 text-xs text-subtle-foreground">{card.detail}</dd>
                ) : null}
              </div>
            ))}
          </dl>

          <CopyButton
            value={`${result.totalDays} days (${result.years}y ${result.months}m ${result.days}d, ${result.weekdays} working days)`}
            label="Copy the result"
          />
        </>
      ) : null}

      {mode === "shift" && shifted ? (
        <div className="surface-card p-6 text-center">
          <p className="text-xs text-muted-foreground">
            {amount} {unit} {direction === "add" ? "after" : "before"} that date
          </p>
          <p
            className="mt-2 text-3xl tracking-[-0.02em] text-foreground sm:text-4xl"
            aria-live="polite"
          >
            {shifted.toLocaleDateString(undefined, { dateStyle: "full" })}
          </p>
          <p className="mt-2 font-mono text-sm text-muted-foreground">{toInputValue(shifted)}</p>
          <div className="mt-4 flex justify-center gap-2">
            <CopyButton value={toInputValue(shifted)} label="Copy ISO date" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEnd(toInputValue(shifted));
                setMode("between");
              }}
            >
              Measure to it
            </Button>
          </div>
        </div>
      ) : null}

      {!nowMs ? (
        <FieldHint>Reading your system date…</FieldHint>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Working days are counted one at a time rather than estimated as
          days ÷ 7 × 5, which is wrong whenever a range does not start on a
          Monday. Public holidays are not deducted, because they differ by
          country and region. Adding a month clamps to the end of a short month,
          so 31 January plus one month is 28 February rather than 3 March.
        </span>
      </p>
    </div>
  );
}
