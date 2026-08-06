"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/misc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatNumber } from "@/lib/utils";
import {
  calculateLoan,
  currencies,
  formatMoney,
  summariseByYear,
} from "./logic";

export default function LoanCalculatorTool() {
  const [principal, setPrincipal] = React.useState("250000");
  const [rate, setRate] = React.useState("6.5");
  const [years, setYears] = React.useState("25");
  const [extra, setExtra] = React.useState("0");
  const [currency, setCurrency] = React.useState("USD");

  const result = React.useMemo(
    () =>
      calculateLoan({
        principal: Number(principal),
        annualRatePercent: Number(rate),
        years: Number(years),
        extraMonthly: Number(extra) || 0,
      }),
    [principal, rate, years, extra],
  );

  const yearly = React.useMemo(
    () => (result ? summariseByYear(result.schedule) : []),
    [result],
  );

  const money = (value: number) => formatMoney(value, currency);

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="loan-principal">Loan amount</Label>
          <Input
            id="loan-principal"
            type="number"
            inputMode="decimal"
            min={0}
            value={principal}
            onChange={(event) => setPrincipal(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="loan-rate">Annual interest rate (%)</Label>
          <Input
            id="loan-rate"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="loan-years">Term (years)</Label>
          <Input
            id="loan-years"
            type="number"
            inputMode="numeric"
            min={1}
            max={50}
            value={years}
            onChange={(event) => setYears(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="loan-currency">Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="loan-currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((code) => (
                <SelectItem key={code} value={code}>
                  {code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="loan-extra">Extra payment each month (optional)</Label>
          <Input
            id="loan-extra"
            type="number"
            inputMode="decimal"
            min={0}
            value={extra}
            onChange={(event) => setExtra(event.target.value)}
          />
          <FieldHint>
            Anything above the scheduled payment goes straight against the principal, which is what
            makes overpaying so effective early in the term.
          </FieldHint>
        </div>
      </div>

      {result ? (
        <>
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "Monthly payment", value: money(result.monthlyPayment) },
              { label: "Total interest", value: money(result.totalInterest) },
              { label: "Total repaid", value: money(result.totalPaid) },
              { label: "Payments", value: formatNumber(result.schedule.length) },
            ].map((card) => (
              <div key={card.label} className="surface-card p-4">
                <dt className="text-xs text-muted-foreground">{card.label}</dt>
                <dd
                  className="mt-1 font-mono text-xl tracking-[-0.02em] text-foreground"
                  data-numeric
                >
                  {card.value}
                </dd>
              </div>
            ))}
          </dl>

          {result.monthsSaved > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">
                Paid off <span data-numeric>{result.monthsSaved}</span> months early
              </Badge>
              <Badge variant="success">{money(result.interestSaved)} interest saved</Badge>
            </div>
          ) : null}

          {/* Interest vs principal split, as a single stacked bar. */}
          <section className="space-y-2">
            <h2 className="text-sm font-medium text-foreground">Where the money goes</h2>
            <div
              className="flex h-8 overflow-hidden rounded-md border border-border"
              role="img"
              aria-label={`${money(Number(principal))} principal and ${money(result.totalInterest)} interest`}
            >
              <div
                className="bg-primary"
                style={{ width: `${(Number(principal) / result.totalPaid) * 100}%` }}
              />
              <div
                className="bg-[color-mix(in_oklab,var(--foreground)_25%,transparent)]"
                style={{ width: `${(result.totalInterest / result.totalPaid) * 100}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-sm bg-primary" aria-hidden="true" />
                Principal {money(Number(principal))}
              </span>
              <span className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-sm bg-[color-mix(in_oklab,var(--foreground)_25%,transparent)]"
                  aria-hidden="true"
                />
                Interest {money(result.totalInterest)} (
                <span data-numeric>
                  {((result.totalInterest / Number(principal)) * 100).toFixed(0)}%
                </span>{" "}
                of what you borrowed)
              </span>
            </div>
          </section>

          <section className="surface-card overflow-hidden">
            <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
              Amortisation by year
            </h2>
            <div className="max-h-96 overflow-auto">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">
                  Interest and principal paid each year, with the remaining balance.
                </caption>
                <thead className="sticky top-0 bg-surface">
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th scope="col" className="px-5 py-2.5 text-left font-medium">Year</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Interest</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Principal</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {yearly.map((row) => (
                    <tr key={row.year} className="border-b border-border last:border-0">
                      <td className="px-5 py-2 font-mono text-muted-foreground" data-numeric>
                        {row.year}
                      </td>
                      <td className="px-5 py-2 text-right font-mono text-foreground" data-numeric>
                        {money(row.interest)}
                      </td>
                      <td className="px-5 py-2 text-right font-mono text-foreground" data-numeric>
                        {money(row.principal)}
                      </td>
                      <td
                        className={cn(
                          "px-5 py-2 text-right font-mono",
                          row.balance === 0 ? "text-success" : "text-muted-foreground",
                        )}
                        data-numeric
                      >
                        {money(row.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Enter a loan amount, rate and term to see the figures.
        </p>
      )}

      <p className="text-sm text-muted-foreground">
        This models a standard amortising loan with a fixed rate. Real quotes usually add
        arrangement fees, insurance or a variable rate, so treat this as an estimate rather than an
        offer.
      </p>
    </div>
  );
}
