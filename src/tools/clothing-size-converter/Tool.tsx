"use client";

import * as React from "react";
import { AlertTriangle, Info } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  MEASURING_NOTES, REGION_LABELS, TABLES, convert, fromMeasurement,
  type Fit, type Garment, type Region,
} from "./logic";

export default function ClothingSizeConverterTool() {
  const [fit, setFit] = React.useState<Fit>("women");
  const [garment, setGarment] = React.useState<Garment>("tops");
  const [region, setRegion] = React.useState<Region>("uk");
  const [value, setValue] = React.useState("12");
  const [measurement, setMeasurement] = React.useState("");

  const match = convert(value, region, fit, garment);
  const byMeasurement =
    measurement.trim() === "" ? [] : fromMeasurement(Number(measurement), fit, garment);

  return (
    <div className="space-y-5">
      <p className="flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
        <span>
          Clothing sizes are less standardised than shoes, which is saying
          something. The numbers derive from nothing consistent, and vanity
          sizing means a size 12 today is a different garment from a size 12
          twenty years ago. The body measurement is the figure that means
          anything — check it against the brand&rsquo;s own chart.
        </span>
      </p>

      <div className="flex flex-wrap gap-3">
        <Tabs value={fit} onValueChange={(v) => setFit(v as Fit)}>
          <TabsList>
            <TabsTrigger value="women">Women&rsquo;s</TabsTrigger>
            <TabsTrigger value="men">Men&rsquo;s</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs value={garment} onValueChange={(v) => setGarment(v as Garment)}>
          <TabsList>
            <TabsTrigger value="tops">Tops</TabsTrigger>
            <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="size">Size</Label>
          <Input
            id="size"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-28 font-mono"
            aria-invalid={match === null && value.trim() !== ""}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="region">Given as</Label>
          <Select value={region} onValueChange={(v) => setRegion(v as Region)}>
            <SelectTrigger id="region" className="w-40">
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
        <div className="space-y-1.5">
          <Label htmlFor="measure">
            Or by {garment === "tops" ? "chest/bust" : "waist"} (cm)
          </Label>
          <Input
            id="measure"
            inputMode="decimal"
            value={measurement}
            onChange={(e) => setMeasurement(e.target.value)}
            placeholder="93"
            className="w-28 font-mono"
          />
        </div>
      </div>

      {match ? (
        <>
          <dl className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {(Object.keys(REGION_LABELS) as Region[]).map((key) => (
              <div key={key} className="surface-card px-4 py-3">
                <dt className="text-xs text-muted-foreground">{REGION_LABELS[key]}</dt>
                <dd className="mt-0.5 font-mono text-lg text-foreground">{match.row[key]}</dd>
              </div>
            ))}
          </dl>

          <div className="surface-card border-border-strong px-4 py-3">
            <div className="text-xs text-muted-foreground">
              {garment === "tops" ? "Chest / bust" : "Waist"}
            </div>
            <div className="mt-0.5 font-mono text-lg text-[var(--accent-converter)]" data-numeric>
              {match.row.bodyCm} cm
              {match.row.hipCm ? (
                <span className="ml-3 text-muted-foreground">hip {match.row.hipCm} cm</span>
              ) : null}
            </div>
          </div>

          {match.alsoMatching.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              That alpha size also covers{" "}
              {match.alsoMatching.map((row) => `UK ${row.uk}`).join(", ")} — which
              is precisely why S/M/L is the least reliable way to buy anything.
            </p>
          ) : null}
        </>
      ) : value.trim() !== "" ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          No {REGION_LABELS[region]} size matching that in the{" "}
          {fit === "women" ? "women's" : "men's"} {garment} table.
        </p>
      ) : null}

      {byMeasurement.length > 0 ? (
        <p className="text-sm text-muted-foreground">
          A {measurement}cm {garment === "tops" ? "chest" : "waist"} corresponds to{" "}
          <span className="text-foreground">
            {byMeasurement.map((row) => `UK ${row.uk}`).join(" or ")}
          </span>
          .
        </p>
      ) : null}

      <p className="text-sm text-muted-foreground">{MEASURING_NOTES[garment]}</p>

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-2.5 text-sm font-medium text-foreground">
          {fit === "women" ? "Women's" : "Men's"} {garment}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-sm">
            <thead className="border-b border-border text-left text-xs text-muted-foreground">
              <tr>
                {(Object.keys(REGION_LABELS) as Region[]).map((key) => (
                  <th key={key} className="px-4 py-2 font-medium">
                    {REGION_LABELS[key]}
                  </th>
                ))}
                <th className="px-4 py-2 font-medium">
                  {garment === "tops" ? "Chest" : "Waist"} (cm)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TABLES[fit][garment].map((row) => (
                <tr
                  key={row.uk + row.bodyCm}
                  className={cn(match && match.row.bodyCm === row.bodyCm && "bg-surface-hover")}
                >
                  {(Object.keys(REGION_LABELS) as Region[]).map((key) => (
                    <td key={key} className="px-4 py-2 font-mono text-muted-foreground">
                      {row[key]}
                    </td>
                  ))}
                  <td className="px-4 py-2 font-mono text-muted-foreground" data-numeric>
                    {row.bodyCm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Italian sizing runs four above the EU number for women, which catches
          people out buying from Italian brands. And note that a single alpha
          size routinely covers two numeric ones — a &ldquo;medium&rdquo; is a
          range, not a size.
        </span>
      </p>
    </div>
  );
}
