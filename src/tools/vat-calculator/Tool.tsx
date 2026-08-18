"use client";

import * as React from "react";
import { AlertTriangle, ArrowLeftRight } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  RATE_PRESETS,
  addVat,
  naiveRemoval,
  parseAmount,
  removeVat,
  vatFraction,
} from "./logic";

type Direction = "add" | "remove";

export default function VatCalculatorTool() {
  const [direction, setDirection] = React.useState<Direction>("add");
  const [amount, setAmount] = React.useState("100");
  const [rate, setRate] = React.useState("20");

  const parsedAmount = parseAmount(amount);
  const parsedRate = Number(rate);
  const valid =
    parsedAmount !== null && Number.isFinite(parsedRate) && parsedRate >= 0 && parsedRate <= 100;

  const result = valid
    ? direction === "add"
      ? addVat(parsedAmount, parsedRate)
      : removeVat(parsedAmount, parsedRate)
    : null;

  const money = (value: number) =>
    value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <Button
          variant="outline"
          onClick={() => setDirection((d) => (d === "add" ? "remove" : "add"))}
        >
          <ArrowLeftRight strokeWidth={1.75} />
          {direction === "add" ? "Adding VAT" : "Removing VAT"}
        </Button>

        <div className="space-y-1.5">
          <Label htmlFor="amount">
            {direction === "add" ? "Net amount (before VAT)" : "Gross amount (including VAT)"}
          </Label>
          <Input
            id="amount"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-40 font-mono"
            aria-invalid={parsedAmount === null && amount.trim() !== ""}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="rate">Rate</Label>
          <div className="relative">
            <Input
              id="rate"
              inputMode="decimal"
              value={rate}
              onChange={(event) => setRate(event.target.value)}
              className="w-28 pr-7 font-mono"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
        </div>
      </div>

      {result ? (
        <>
          <dl className="grid gap-3 sm:grid-cols-3">
            {[
              ["Net", result.net, direction === "remove"],
              ["VAT", result.vat, false],
              ["Gross", result.gross, direction === "add"],
            ].map(([label, value, highlight]) => (
              <div
                key={label as string}
                className={cn("surface-card px-4 py-3", highlight && "border-border-strong")}
              >
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd
                  className={cn(
                    "mt-0.5 font-mono text-xl",
                    highlight ? "text-[var(--accent-calculator)]" : "text-foreground",
                  )}
                  data-numeric
                >
                  {money(value as number)}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap gap-3">
            <CopyButton value={money(result.net)} label="Copy net" />
            <CopyButton value={money(result.vat)} label="Copy VAT" />
            <CopyButton value={money(result.gross)} label="Copy gross" />
          </div>

          {direction === "remove" && parsedRate > 0 ? (
            <p className="flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
              <span>
                Removing VAT is a division, not a subtraction. Taking{" "}
                {parsedRate}% <em>off</em> {money(result.gross)} would give{" "}
                <span className="font-mono">{money(naiveRemoval(result.gross, parsedRate))}</span>,
                which is wrong — the percentage applies to the net figure, not the
                gross one. The correct net is{" "}
                <span className="font-mono">{money(result.net)}</span>.
              </span>
            </p>
          ) : null}

          {parsedRate > 0 ? (
            <p className="text-sm text-muted-foreground">
              At {parsedRate}%, VAT is {vatFraction(parsedRate)} of the gross price
              {vatFraction(parsedRate).startsWith("1/")
                ? " — a useful one to know for checking a receipt in your head."
                : "."}
            </p>
          ) : null}
        </>
      ) : (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          Enter an amount and a rate between 0 and 100.
        </p>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">Common rates</h2>
        {RATE_PRESETS.map((group) => (
          <div key={group.region}>
            <div className="text-xs text-subtle-foreground">{group.region}</div>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {group.rates.map((preset) => (
                <button
                  key={`${group.region}-${preset.label}`}
                  type="button"
                  onClick={() => setRate(String(preset.percent))}
                  title={preset.note}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm transition-colors",
                    Number(rate) === preset.percent
                      ? "border-border-strong text-foreground"
                      : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
                  )}
                >
                  {preset.label} {preset.percent}%
                </button>
              ))}
            </div>
          </div>
        ))}
        <p className="pt-1 text-xs text-muted-foreground">
          Rates change, and which one applies depends on what is being sold.
          Check against your own tax authority before invoicing.
        </p>
      </section>
    </div>
  );
}
