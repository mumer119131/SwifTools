"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeftRight, ArrowRight } from "lucide-react";

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
import {
  TEMPERATURE_CATEGORY,
  convert,
  convertTemperature,
  formatValue,
  getCategory,
  temperatureUnits,
  unitPairs,
  type TemperatureUnit,
} from "@/lib/units";
import { cn } from "@/lib/utils";

interface UnitOption {
  id: string;
  label: string;
  symbol: string;
}

/**
 * One measurement type's converter.
 *
 * Split out of the original all-in-one tool because packing every measurement
 * behind a category selector made each individual conversion unfindable — a
 * page for "Weight" can rank for weight queries in a way one generic page
 * cannot.
 */
export function UnitConverterShell({
  categoryId,
  defaultFrom,
  defaultTo,
}: {
  categoryId: string;
  defaultFrom: string;
  defaultTo: string;
}) {
  const isTemperature = categoryId === TEMPERATURE_CATEGORY;
  const category = getCategory(categoryId);

  const options: UnitOption[] = isTemperature
    ? temperatureUnits.map((entry) => ({ id: entry.id, label: entry.label, symbol: entry.symbol }))
    : (category?.units ?? []).map((entry) => ({
        id: entry.id,
        label: entry.label,
        symbol: entry.symbol,
      }));

  const [amount, setAmount] = React.useState("1");
  const [fromId, setFromId] = React.useState(defaultFrom);
  const [toId, setToId] = React.useState(defaultTo);

  const value = Number(amount);
  const isValid = amount.trim() !== "" && Number.isFinite(value);

  // Left unmemoised deliberately: this is a couple of multiplications per unit,
  // and manual memoisation here stops the React Compiler optimising the whole
  // component.
  const convertTo = (targetId: string): number | null => {
    if (!isValid) return null;

    if (isTemperature) {
      return convertTemperature(value, fromId as TemperatureUnit, targetId as TemperatureUnit);
    }

    const from = category?.units.find((entry) => entry.id === fromId);
    const to = category?.units.find((entry) => entry.id === targetId);
    if (!from || !to) return null;
    return convert(value, from, to);
  };

  const result = convertTo(toId);
  const toSymbol = options.find((option) => option.id === toId)?.symbol ?? "";
  const resultText = result === null ? "" : `${formatValue(result)} ${toSymbol}`.trim();

  // Direct pages for this measurement type, so a browser can jump to the
  // conversion they actually wanted.
  const relatedPairs = unitPairs.filter((pair) => pair.categoryId === categoryId).slice(0, 12);

  return (
    <div className="space-y-5">
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
              {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label} ({option.symbol})
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
              {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label} ({option.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isValid ? (
        <section className="surface-card overflow-hidden">
          <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
            {amount} {options.find((option) => option.id === fromId)?.symbol} in every unit
          </h2>
          <dl className="divide-y divide-border">
            {options.map((option) => {
              const converted = convertTo(option.id);
              return (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center gap-4 px-5 py-2.5 text-sm",
                    option.id === toId && "bg-surface-hover",
                  )}
                >
                  <dt className="min-w-0 flex-1 truncate text-muted-foreground">{option.label}</dt>
                  <dd className="shrink-0 font-mono text-foreground" data-numeric>
                    {converted === null ? "—" : formatValue(converted)}{" "}
                    <span className="text-subtle-foreground">{option.symbol}</span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>
      ) : null}

      {relatedPairs.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-foreground">Common conversions</h2>
          <ul className="flex flex-wrap gap-2">
            {relatedPairs.map((pair) => (
              <li key={pair.slug}>
                <Link
                  href={`/units/${pair.slug}`}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 text-sm",
                    "text-muted-foreground transition-colors duration-[180ms] ease-out-expo",
                    "hover:border-border-strong hover:text-foreground",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                  )}
                >
                  {pair.shorthand}
                  <ArrowRight className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
