"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ArrowRightLeft } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TEMPERATURE_CATEGORY,
  commonInputsFor,
  convertPair,
  formatValue,
  getCategory,
  getPair,
  pairFormula,
  unitPairs,
} from "@/lib/units";
import { cn } from "@/lib/utils";

/**
 * A single direct conversion, e.g. /units/lb-to-kg.
 *
 * One component serves all ~64 pair routes; the slug selects the pair. Each
 * page carries the live converter, the formula written out, and a table of
 * common values — a page showing only a number would be thin content that
 * deserves to rank for nothing.
 */
export default function UnitPairTool({ slug }: { slug: string }) {
  const pair = getPair(slug);
  const [amount, setAmount] = React.useState("1");

  if (!pair) {
    return (
      <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
        That conversion isn&rsquo;t available.
      </p>
    );
  }

  const value = Number(amount);
  const isValid = amount.trim() !== "" && Number.isFinite(value);
  const result = isValid ? convertPair(pair, value) : null;

  const categoryLabel =
    pair.categoryId === TEMPERATURE_CATEGORY
      ? "Temperature"
      : (getCategory(pair.categoryId)?.label ?? "Unit");
  const parentSlug =
    pair.categoryId === TEMPERATURE_CATEGORY
      ? "temperature-converter"
      : `${pair.categoryId}-converter`;

  const reverse = unitPairs.find(
    (entry) =>
      entry.categoryId === pair.categoryId &&
      entry.fromId === pair.toId &&
      entry.toId === pair.fromId,
  );

  const siblings = unitPairs
    .filter((entry) => entry.categoryId === pair.categoryId && entry.slug !== pair.slug)
    .slice(0, 10);

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="space-y-2">
          <Label htmlFor="pair-amount">{pair.fromLabel}</Label>
          <div className="flex items-center gap-2">
            <Input
              id="pair-amount"
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              aria-invalid={!isValid}
              autoFocus
            />
            <span className="shrink-0 font-mono text-sm text-muted-foreground">
              {pair.fromSymbol}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-center pb-2 sm:items-center sm:pb-0">
          <ArrowRightLeft
            className="size-4 text-subtle-foreground"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pair-result">{pair.toLabel}</Label>
          <div className="flex items-center gap-2">
            <output
              id="pair-result"
              className="flex h-10 min-w-0 flex-1 items-center truncate rounded-md border border-border bg-surface-hover px-3 font-mono text-sm text-foreground"
              data-numeric
              aria-live="polite"
            >
              {result === null ? "—" : formatValue(result)}
            </output>
            <span className="shrink-0 font-mono text-sm text-muted-foreground">
              {pair.toSymbol}
            </span>
            <CopyButton
              value={result === null ? "" : `${formatValue(result)} ${pair.toSymbol}`}
              iconOnly
              label="Copy result"
            />
          </div>
        </div>
      </div>

      <section className="surface-card p-5">
        <h2 className="text-sm font-medium text-foreground">Formula</h2>
        <p className="mt-2 font-mono text-base text-foreground" data-numeric>
          {pairFormula(pair)}
        </p>
        {isValid && result !== null ? (
          <p className="mt-2 font-mono text-sm text-muted-foreground" data-numeric>
            {formatValue(value)} {pair.fromSymbol} = {formatValue(result)} {pair.toSymbol}
          </p>
        ) : null}
      </section>

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
          Common values
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">
              {pair.title} for a range of common values.
            </caption>
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th scope="col" className="px-5 py-2.5 text-left font-medium">
                  {pair.fromLabel}
                </th>
                <th scope="col" className="px-5 py-2.5 text-right font-medium">
                  {pair.toLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {commonInputsFor(pair).map((input) => (
                <tr
                  key={input}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-hover"
                  onClick={() => setAmount(String(input))}
                >
                  <td className="px-5 py-2 font-mono text-muted-foreground" data-numeric>
                    {formatValue(input)} {pair.fromSymbol}
                  </td>
                  <td className="px-5 py-2 text-right font-mono text-foreground" data-numeric>
                    {formatValue(convertPair(pair, input))} {pair.toSymbol}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {reverse ? (
          <Button asChild variant="outline" size="sm">
            <Link href={`/units/${reverse.slug}`}>
              {reverse.shorthand}
              <ArrowRight strokeWidth={1.75} />
            </Link>
          </Button>
        ) : null}
        <Button asChild variant="outline" size="sm">
          <Link href={`/units/${parentSlug}`}>
            All {categoryLabel.toLowerCase()} units
            <ArrowRight strokeWidth={1.75} />
          </Link>
        </Button>
      </div>

      {siblings.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-foreground">
            Other {categoryLabel.toLowerCase()} conversions
          </h2>
          <ul className="flex flex-wrap gap-2">
            {siblings.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={`/units/${entry.slug}`}
                  className={cn(
                    "inline-flex h-9 items-center rounded-full border border-border bg-surface px-3.5 text-sm",
                    "text-muted-foreground transition-colors duration-[180ms] ease-out-expo",
                    "hover:border-border-strong hover:text-foreground",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                  )}
                >
                  {entry.shorthand}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
