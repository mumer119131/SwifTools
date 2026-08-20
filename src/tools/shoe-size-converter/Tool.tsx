"use client";

import * as React from "react";
import { AlertTriangle, Info, Ruler } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  FIT_LABELS, MEASURING_STEPS, REGION_LABELS, TABLES, TOE_ROOM_CM, convert,
  type Fit, type Region,
} from "./logic";

export default function ShoeSizeConverterTool() {
  const [fit, setFit] = React.useState<Fit>("men");
  const [region, setRegion] = React.useState<Region>("uk");
  const [value, setValue] = React.useState("9");

  const match = convert(Number(value), region, fit);

  return (
    <div className="space-y-5">
      <p className="flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
        <span>
          There is no international standard for shoe sizes, and brands deviate
          from the published tables by half a size in either direction routinely.
          The foot length in centimetres is the only figure that means anything —
          use it to check against a brand&rsquo;s own chart rather than trusting a
          number.
        </span>
      </p>

      <Tabs value={fit} onValueChange={(v) => setFit(v as Fit)}>
        <TabsList>
          {(Object.keys(FIT_LABELS) as Fit[]).map((key) => (
            <TabsTrigger key={key} value={key}>
              {FIT_LABELS[key]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="size">Size</Label>
          <Input
            id="size"
            inputMode="decimal"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="w-28 font-mono"
            aria-invalid={match === null}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="region">Given as</Label>
          <Select value={region} onValueChange={(v) => setRegion(v as Region)}>
            <SelectTrigger id="region" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(REGION_LABELS) as Region[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {REGION_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {match ? (
        <>
          {!match.exact ? (
            <p className="text-sm text-muted-foreground">
              No published size at exactly that. Showing the closest.
            </p>
          ) : null}

          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(REGION_LABELS) as Region[]).map((key) => (
              <div
                key={key}
                className={cn(
                  "surface-card px-4 py-3",
                  key === "cm" && "border-border-strong",
                )}
              >
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {key === "cm" ? <Ruler className="size-3" strokeWidth={1.75} /> : null}
                  {REGION_LABELS[key]}
                </dt>
                <dd
                  className={cn(
                    "mt-0.5 font-mono text-xl",
                    key === "cm" ? "text-[var(--accent-home)]" : "text-foreground",
                  )}
                  data-numeric
                >
                  {match.row[key]}
                </dd>
              </div>
            ))}
          </dl>

          <p className="text-sm text-muted-foreground">
            That is a foot of{" "}
            <span className="font-mono text-foreground">{match.row.cm}cm</span> — so
            when buying, look for an inside length of around{" "}
            <span className="font-mono text-foreground">
              {(match.row.cm + TOE_ROOM_CM).toFixed(1)}cm
            </span>
            . The table figure is your foot, not the shoe.
          </p>
        </>
      ) : (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          That is outside the range of published sizes for {FIT_LABELS[fit].toLowerCase()} shoes.
        </p>
      )}

      <section>
        <h2 className="text-sm font-medium text-foreground">How to measure properly</h2>
        <ol className="mt-3 space-y-2">
          {MEASURING_STEPS.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm text-muted-foreground">
              <span className="text-subtle-foreground">{index + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-2.5 text-sm font-medium text-foreground">
          {FIT_LABELS[fit]} sizes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[26rem] text-sm">
            <thead className="border-b border-border text-left text-xs text-muted-foreground">
              <tr>
                {(Object.keys(REGION_LABELS) as Region[]).map((key) => (
                  <th key={key} className="px-5 py-2 font-medium">
                    {REGION_LABELS[key]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TABLES[fit].map((row) => (
                <tr
                  key={`${row.uk}-${row.cm}`}
                  className={cn(match && match.row.cm === row.cm && "bg-surface-hover")}
                >
                  {(Object.keys(REGION_LABELS) as Region[]).map((key) => (
                    <td key={key} className="px-5 py-2 font-mono text-muted-foreground" data-numeric>
                      {row[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          UK and US sizes both derive from the barleycorn — a third of an inch —
          but count from different starting points, which is why they differ by
          about one for men and two for women. EU sizes use the Paris point, two
          thirds of a centimetre, measured on the last rather than the foot. None
          of the three agrees with the others exactly, which is why the
          centimetre column is the one to trust.
        </span>
      </p>
    </div>
  );
}
