"use client";

import * as React from "react";
import { ArrowLeftRight, RefreshCw, TriangleAlert } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Spinner } from "@/components/shared/Progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/misc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  convertCurrency,
  currencyNames,
  fetchRates,
  formatCurrency,
  formatRate,
  type Rates,
} from "./logic";

const POPULAR = ["USD", "EUR", "GBP", "JPY", "INR", "CAD", "AUD", "CHF", "CNY"];

export default function CurrencyConverterTool() {
  const [amount, setAmount] = React.useState("100");
  const [from, setFrom] = React.useState("USD");
  const [to, setTo] = React.useState("EUR");
  // `null` means "not fetched yet for the current base"; loading is derived
  // from that rather than tracked in its own state, which keeps the effect free
  // of synchronous setState.
  const [result, setResult] = React.useState<{ base: string; rates: Rates | null; error: string | null }>({
    base: "",
    rates: null,
    error: null,
  });
  const [reloadToken, setReloadToken] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;

    fetchRates(from)
      .then((data) => {
        if (!cancelled) setResult({ base: from, rates: data, error: null });
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setResult({
            base: from,
            rates: null,
            error: cause instanceof Error ? cause.message : "Rates are unavailable right now.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [from, reloadToken]);

  // Stale results from a previous base are ignored while the new one loads.
  const settled = result.base === from;
  const rates = settled ? result.rates : null;
  const error = settled ? result.error : null;
  const loading = !settled;

  const value = Number(amount);
  const isValid = amount.trim() !== "" && Number.isFinite(value);
  const converted = rates && isValid ? convertCurrency(value, rates, to) : null;
  const rate = rates ? (to === rates.base ? 1 : rates.rates[to]) : null;

  const codes = React.useMemo(() => {
    const available = rates ? new Set([rates.base, ...Object.keys(rates.rates)]) : new Set(Object.keys(currencyNames));
    return [...available].sort((a, b) => {
      // Popular currencies float to the top; the rest stay alphabetical.
      const aRank = POPULAR.indexOf(a);
      const bRank = POPULAR.indexOf(b);
      if (aRank !== -1 || bRank !== -1) {
        return (aRank === -1 ? 99 : aRank) - (bRank === -1 ? 99 : bRank);
      }
      return a.localeCompare(b);
    });
  }, [rates]);

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="space-y-2">
          <Label htmlFor="currency-amount">Amount</Label>
          <Input
            id="currency-amount"
            type="number"
            inputMode="decimal"
            min={0}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            aria-invalid={!isValid}
          />
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger aria-label="Convert from">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {codes.map((code) => (
                <SelectItem key={code} value={code}>
                  {code} — {currencyNames[code] ?? code}
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
              setFrom(to);
              setTo(from);
            }}
            aria-label="Swap currencies"
          >
            <ArrowLeftRight strokeWidth={1.75} />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency-result">Converted</Label>
          <div className="flex items-center gap-2">
            {loading ? (
              <Skeleton className="h-10 flex-1" />
            ) : (
              <output
                id="currency-result"
                className="flex h-10 min-w-0 flex-1 items-center truncate rounded-md border border-border bg-surface-hover px-3 font-mono text-sm text-foreground"
                data-numeric
              >
                {converted === null ? "—" : formatCurrency(converted, to)}
              </output>
            )}
            <CopyButton
              value={converted === null ? "" : String(converted.toFixed(2))}
              iconOnly
              label="Copy converted amount"
            />
          </div>
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger aria-label="Convert to">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {codes.map((code) => (
                <SelectItem key={code} value={code}>
                  {code} — {currencyNames[code] ?? code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 rounded-md border border-[color-mix(in_oklab,var(--destructive)_30%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3"
        >
          <TriangleAlert className="size-4 shrink-0 text-destructive" strokeWidth={1.75} />
          <span className="min-w-0 flex-1 text-sm text-destructive">{error}</span>
          <Button variant="outline" size="sm" onClick={() => setReloadToken((token) => token + 1)}>
            <RefreshCw strokeWidth={1.75} />
            Retry
          </Button>
        </div>
      ) : null}

      {rates && rate ? (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            <span className="font-mono text-foreground" data-numeric>
              1 {from} = {formatRate(rate)} {to}
            </span>
            {" · "}
            <span className="font-mono" data-numeric>
              1 {to} = {formatRate(1 / rate)} {from}
            </span>
          </p>
          <p className="flex items-center gap-2">
            {loading ? <Spinner className="size-3.5" /> : null}
            ECB reference rates for <span data-numeric>{rates.date}</span>
          </p>
        </div>
      ) : null}

      {rates ? (
        <section className="surface-card overflow-hidden">
          <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
            {isValid ? `${amount} ${from} in other currencies` : "Other currencies"}
          </h2>
          <dl className="max-h-96 divide-y divide-border overflow-y-auto">
            {POPULAR.filter((code) => code !== from).map((code) => {
              const amountIn = isValid ? convertCurrency(value, rates, code) : null;
              if (amountIn === null) return null;
              return (
                <div key={code} className="flex items-center gap-4 px-5 py-2.5 text-sm">
                  <dt className="min-w-0 flex-1 truncate text-muted-foreground">
                    <span className="font-mono text-foreground">{code}</span> —{" "}
                    {currencyNames[code] ?? code}
                  </dt>
                  <dd className="shrink-0 font-mono text-foreground" data-numeric>
                    {formatCurrency(amountIn, code)}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>
      ) : null}

      <p className="text-sm text-muted-foreground">
        Rates are the European Central Bank&rsquo;s daily reference rates, published once per working
        day — they are indicative, not a live trading feed, and won&rsquo;t match what a bank or card
        network actually charges you.
      </p>
    </div>
  );
}
