"use client";

import * as React from "react";
import { Info, TrendingDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currencies, formatMoney } from "@/tools/loan-calculator/logic";
import { calculate, formatTerm, ltvBand } from "./logic";

function Field({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        ) : null}
        <Input
          id={id}
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={prefix ? "pl-7" : suffix ? "pr-8" : undefined}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function MortgageCalculatorTool() {
  const [currency, setCurrency] = React.useState<string>("GBP");
  const [price, setPrice] = React.useState("300000");
  const [deposit, setDeposit] = React.useState("60000");
  const [rate, setRate] = React.useState("5");
  const [years, setYears] = React.useState("25");
  const [tax, setTax] = React.useState("");
  const [insurance, setInsurance] = React.useState("");
  const [other, setOther] = React.useState("");
  const [overpay, setOverpay] = React.useState("");

  const num = (value: string) => (value.trim() === "" ? 0 : Number(value));

  const result = React.useMemo(
    () =>
      calculate({
        price: num(price),
        deposit: num(deposit),
        annualRate: num(rate),
        years: num(years),
        annualTax: num(tax),
        annualInsurance: num(insurance),
        monthlyOther: num(other),
        monthlyOverpayment: num(overpay),
      }),
    [price, deposit, rate, years, tax, insurance, other, overpay],
  );

  const money = (value: number) => formatMoney(value, currency);
  const band = result ? ltvBand(result.ltv) : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="currency">Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency">
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
        <Field id="price" label="Property price" value={price} onChange={setPrice} />
        <Field id="deposit" label="Deposit" value={deposit} onChange={setDeposit} />
        <Field id="rate" label="Interest rate" value={rate} onChange={setRate} suffix="%" />
        <Field id="years" label="Term" value={years} onChange={setYears} suffix="yrs" />
        <Field
          id="overpay"
          label="Monthly overpayment"
          value={overpay}
          onChange={setOverpay}
        />
      </div>

      {!result ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          Check the figures — the deposit must be less than the price, and the
          rate and term must be sensible.
        </p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Monthly payment", money(result.monthlyPayment), true],
              ["Borrowing", money(result.principal), false],
              ["Loan to value", `${result.ltv.toFixed(1)}%`, false],
              ["Total interest", money(result.totalInterest), false],
            ].map(([label, value, highlight]) => (
              <div key={label as string} className="surface-card px-4 py-3">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd
                  className={`mt-0.5 font-mono text-lg ${highlight ? "text-[var(--accent-calculator)]" : "text-foreground"}`}
                  data-numeric
                >
                  {value}
                </dd>
              </div>
            ))}
          </div>

          {band ? (
            <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
              <span>
                <span className="text-foreground">{band.label} LTV.</span> {band.note}
              </span>
            </p>
          ) : null}

          <section className="space-y-4">
            <h2 className="text-sm font-medium text-foreground">
              What the house actually costs each month
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field id="tax" label="Property tax (yearly)" value={tax} onChange={setTax} />
              <Field
                id="insurance"
                label="Insurance (yearly)"
                value={insurance}
                onChange={setInsurance}
              />
              <Field id="other" label="Other (monthly)" value={other} onChange={setOther} />
            </div>
            <div className="surface-card px-5 py-4">
              <div className="text-xs text-muted-foreground">Total monthly outlay</div>
              <div className="mt-1 font-mono text-2xl text-foreground" data-numeric>
                {money(result.monthlyTotal)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Mortgage payment plus running costs — the figure worth comparing
                against rent, rather than the payment alone.
              </p>
            </div>
          </section>

          {result.overpaid ? (
            <section className="surface-card border-[var(--success)] p-5">
              <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
                <TrendingDown className="size-4 text-[var(--success)]" strokeWidth={1.75} />
                Overpaying by {money(Number(overpay))} a month
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-xs text-muted-foreground">Paid off in</div>
                  <div className="mt-0.5 font-mono text-lg text-foreground" data-numeric>
                    {formatTerm(result.overpaid.monthsToClear)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Time saved</div>
                  <div className="mt-0.5 font-mono text-lg text-[var(--success)]" data-numeric>
                    {formatTerm(result.overpaid.monthsSaved)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Interest saved</div>
                  <div className="mt-0.5 font-mono text-lg text-[var(--success)]" data-numeric>
                    {money(result.overpaid.interestSaved)}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Every overpayment comes off the balance, so all the interest it
                would have attracted for the rest of the term disappears with it.
                That is why a small amount early beats a large amount later.
                Check your lender&rsquo;s limits first — many cap penalty-free
                overpayments at 10% of the balance a year.
              </p>
            </section>
          ) : null}
        </>
      )}

      <p className="text-sm text-muted-foreground">
        An estimate, not an offer. Lenders apply their own affordability rules,
        fees and stress tests, and the rate you are quoted depends on the LTV
        band above as much as on the headline figure.
      </p>
    </div>
  );
}
