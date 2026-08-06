"use client";

import * as React from "react";
import { ArrowLeftRight } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  categories,
  convert,
  convertTemperature,
  formatValue,
  getCategory,
  temperatureUnits,
  type TemperatureUnit,
} from "./logic";

const TEMPERATURE = "temperature";

export default function UnitConverterTool() {
  const [categoryId, setCategoryId] = React.useState("length");
  const [amount, setAmount] = React.useState("1");
  const [fromId, setFromId] = React.useState("m");
  const [toId, setToId] = React.useState("ft");

  const isTemperature = categoryId === TEMPERATURE;
  const category = getCategory(categoryId);
  const value = Number(amount);
  const isValid = amount.trim() !== "" && Number.isFinite(value);

  function switchCategory(nextId: string) {
    setCategoryId(nextId);
    if (nextId === TEMPERATURE) {
      setFromId("c");
      setToId("f");
      return;
    }
    // Default to the first two units so the pair is always valid.
    const next = getCategory(nextId);
    setFromId(next?.units[0].id ?? "");
    setToId(next?.units[1]?.id ?? next?.units[0].id ?? "");
  }

  const unitOptions = isTemperature
    ? temperatureUnits.map((unit) => ({ id: unit.id, label: unit.label, symbol: unit.symbol }))
    : (category?.units ?? []).map((unit) => ({
        id: unit.id,
        label: unit.label,
        symbol: unit.symbol,
      }));

  // Left unmemoised on purpose: these are a handful of multiplications, and
  // manual memoisation here blocks the React Compiler from optimising the
  // component at all.
  const result = (() => {
    if (!isValid) return null;

    if (isTemperature) {
      return convertTemperature(value, fromId as TemperatureUnit, toId as TemperatureUnit);
    }

    const from = category?.units.find((unit) => unit.id === fromId);
    const to = category?.units.find((unit) => unit.id === toId);
    if (!from || !to) return null;
    return convert(value, from, to);
  })();

  /** The same input expressed in every unit of the category. */
  const allUnits = (() => {
    if (!isValid) return [];

    if (isTemperature) {
      return temperatureUnits.map((unit) => ({
        id: unit.id,
        label: unit.label,
        symbol: unit.symbol,
        value: convertTemperature(value, fromId as TemperatureUnit, unit.id),
      }));
    }

    const from = category?.units.find((unit) => unit.id === fromId);
    if (!from) return [];
    return (category?.units ?? []).map((unit) => ({
      id: unit.id,
      label: unit.label,
      symbol: unit.symbol,
      value: convert(value, from, unit),
    }));
  })();

  const toSymbol = unitOptions.find((unit) => unit.id === toId)?.symbol ?? "";
  const resultText = result === null ? "" : `${formatValue(result)} ${toSymbol}`.trim();

  return (
    <div className="space-y-5">
      <div
        role="group"
        aria-label="Measurement category"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {[...categories.map((entry) => ({ id: entry.id, label: entry.label })), { id: TEMPERATURE, label: "Temperature" }].map(
          (entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={categoryId === entry.id}
              onClick={() => switchCategory(entry.id)}
              className={cn(
                "inline-flex h-9 shrink-0 cursor-pointer items-center whitespace-nowrap rounded-full border px-3.5 text-sm",
                "transition-colors duration-[180ms] ease-out-expo",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                categoryId === entry.id
                  ? "border-border-strong bg-surface-hover text-foreground"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {entry.label}
            </button>
          ),
        )}
      </div>

      <div className="surface-card grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="space-y-2">
          <Label htmlFor="unit-amount">Value</Label>
          <Input
            id="unit-amount"
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            aria-invalid={!isValid}
          />
          <Select value={fromId} onValueChange={setFromId}>
            <SelectTrigger aria-label="Convert from">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {unitOptions.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.label} ({unit.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end justify-center pb-1 sm:items-center sm:pb-0">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setFromId(toId);
              setToId(fromId);
            }}
            aria-label="Swap units"
          >
            <ArrowLeftRight strokeWidth={1.75} />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit-result">Result</Label>
          <div className="flex items-center gap-2">
            <output
              id="unit-result"
              className="flex h-10 min-w-0 flex-1 items-center truncate rounded-md border border-border bg-surface-hover px-3 font-mono text-sm text-foreground"
              data-numeric
            >
              {result === null ? "—" : formatValue(result)}
            </output>
            <CopyButton value={resultText} iconOnly label="Copy result" />
          </div>
          <Select value={toId} onValueChange={setToId}>
            <SelectTrigger aria-label="Convert to">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {unitOptions.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.label} ({unit.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {allUnits.length > 0 ? (
        <section className="surface-card overflow-hidden">
          <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
            In every unit
          </h2>
          <dl className="divide-y divide-border">
            {allUnits.map((unit) => (
              <div
                key={unit.id}
                className={cn(
                  "flex items-center gap-4 px-5 py-2.5 text-sm",
                  unit.id === toId && "bg-surface-hover",
                )}
              >
                <dt className="min-w-0 flex-1 truncate text-muted-foreground">{unit.label}</dt>
                <dd className="shrink-0 font-mono text-foreground" data-numeric>
                  {formatValue(unit.value)}{" "}
                  <span className="text-subtle-foreground">{unit.symbol}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}
