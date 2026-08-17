"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMoney } from "@/lib/home";
import { CUSTOMS, QUICK_TIPS, calculate, type Rounding } from "./logic";

export default function TipCalculatorTool() {
  const [subtotal, setSubtotal] = React.useState("84.50");
  const [tax, setTax] = React.useState("");
  const [tipPercent, setTipPercent] = React.useState("18");
  const [people, setPeople] = React.useState("4");
  const [tipOnPreTax, setTipOnPreTax] = React.useState(true);
  const [rounding, setRounding] = React.useState<Rounding>("none");

  const result = calculate(
    Number(subtotal),
    Number(tax),
    Number(tipPercent),
    Number(people),
    tipOnPreTax,
    rounding,
  );

  const heads = Math.max(1, Math.floor(Number(people) || 1));

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="tip-subtotal">Bill before tax</Label>
          <Input
            id="tip-subtotal"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            value={subtotal}
            onChange={(event) => setSubtotal(event.target.value)}
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tip-tax">Tax or service charge</Label>
          <Input
            id="tip-tax"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            value={tax}
            onChange={(event) => setTax(event.target.value)}
            placeholder="0.00"
          />
          <FieldHint>Optional. Leave blank if the bill is the total.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tip-percent">Tip percentage</Label>
          <Input
            id="tip-percent"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.5}
            value={tipPercent}
            onChange={(event) => setTipPercent(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tip-people">Splitting between</Label>
          <Input
            id="tip-people"
            type="number"
            inputMode="numeric"
            min={1}
            value={people}
            onChange={(event) => setPeople(event.target.value)}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-foreground">Quick tip</span>
          <div className="flex flex-wrap gap-2">
            {QUICK_TIPS.map((value) => (
              <Button
                key={value}
                variant={Number(tipPercent) === value ? "default" : "outline"}
                size="sm"
                onClick={() => setTipPercent(String(value))}
              >
                {value}%
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-7">
          <Switch id="tip-pretax" checked={tipOnPreTax} onCheckedChange={setTipOnPreTax} />
          <Label htmlFor="tip-pretax">Tip on the pre-tax amount</Label>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Rounding</span>
          <Tabs value={rounding} onValueChange={(value) => setRounding(value as Rounding)}>
            <TabsList>
              <TabsTrigger value="none">Exact</TabsTrigger>
              <TabsTrigger value="total">Total up</TabsTrigger>
              <TabsTrigger value="perPerson">Each share up</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="surface-card p-6 text-center">
          <p className="text-xs text-muted-foreground">Each person pays</p>
          <p
            className="mt-2 flex items-baseline justify-center gap-3 font-mono text-4xl tracking-[-0.03em] text-foreground sm:text-5xl"
            data-numeric
            aria-live="polite"
          >
            {formatMoney(result.perPerson)}
            <CopyButton value={formatMoney(result.perPerson)} iconOnly label="Copy share" />
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {heads} {heads === 1 ? "person" : "people"} · {formatMoney(result.tipPerPerson)} of that is tip
          </p>
        </div>

        <div className="surface-card p-6 text-center">
          <p className="text-xs text-muted-foreground">Total to pay</p>
          <p className="mt-2 font-mono text-4xl tracking-[-0.03em] text-foreground sm:text-5xl" data-numeric>
            {formatMoney(result.roundedTotal)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {rounding !== "none" && Math.abs(result.roundingAdjustment) > 0.005
              ? `${formatMoney(result.total)} rounded up by ${formatMoney(result.roundingAdjustment)}`
              : `${formatMoney(result.tipBase)} tipped at ${result.effectiveTipPercent.toFixed(1)}%`}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Tip", value: formatMoney(result.roundedTotal - Number(subtotal) - Number(tax || 0)) },
          { label: "Tipped on", value: formatMoney(result.tipBase), detail: tipOnPreTax ? "Pre-tax" : "Full bill" },
          { label: "Effective rate", value: `${result.effectiveTipPercent.toFixed(1)}%`, detail: rounding !== "none" ? "After rounding" : undefined },
          { label: "Bill before tip", value: formatMoney(Number(subtotal) + Number(tax || 0)) },
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

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-3 text-sm font-medium text-foreground">
          What a tip means where you are
        </h2>
        <ul className="divide-y divide-border">
          {CUSTOMS.map((entry) => (
            <li key={entry.region} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-3 text-sm">
              <span className="w-36 shrink-0 text-foreground">{entry.region}</span>
              <span className="w-20 shrink-0 font-mono text-muted-foreground">{entry.typical}</span>
              <span className="min-w-0 flex-1 text-xs text-subtle-foreground">{entry.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Rounding each share up rather than the total is the option worth
          using: rounding the total still leaves fractional shares, so the
          collection comes up short and somebody covers the difference. The
          effective tip rate is shown after rounding, because rounding a small
          bill up can quietly turn an intended 12.5% into 20%.
        </span>
      </p>
    </div>
  );
}
