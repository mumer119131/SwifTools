"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  LANDMARKS, QUANTITY_LABELS, RULES, atDistance, combine, decibelsToRatio,
  nearestLandmark, ratioToDecibels, type Quantity,
} from "./logic";

type Mode = "ratio" | "combine" | "distance";

export default function DecibelCalculatorTool() {
  const [mode, setMode] = React.useState<Mode>("ratio");
  const [quantity, setQuantity] = React.useState<Quantity>("power");
  const [ratio, setRatio] = React.useState("2");
  const [decibels, setDecibels] = React.useState("3");
  const [sources, setSources] = React.useState("60, 60");
  const [level, setLevel] = React.useState("100");
  const [from, setFrom] = React.useState("1");
  const [to, setTo] = React.useState("10");

  const asDb = ratioToDecibels(Number(ratio), quantity);
  const asRatio = decibelsToRatio(Number(decibels), quantity);
  const combined = combine(sources.split(/[,\s]+/).map(Number).filter(Number.isFinite));
  const spread = atDistance(Number(level), Number(from), Number(to));
  const round = (n: number, p = 4) => Number(n.toPrecision(p));

  return (
    <div className="space-y-5">
      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
        <TabsList>
          <TabsTrigger value="ratio">Ratio ⇄ decibels</TabsTrigger>
          <TabsTrigger value="combine">Add sources</TabsTrigger>
          <TabsTrigger value="distance">Over distance</TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === "ratio" ? (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="quantity">Measuring</Label>
            <Select value={quantity} onValueChange={(v) => setQuantity(v as Quantity)}>
              <SelectTrigger id="quantity" className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(QUANTITY_LABELS) as Quantity[]).map((key) => (
                  <SelectItem key={key} value={key}>{QUANTITY_LABELS[key]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="surface-card p-5">
              <Label htmlFor="ratio">Ratio</Label>
              <Input id="ratio" inputMode="decimal" value={ratio}
                onChange={(e) => setRatio(e.target.value)} className="mt-1.5 font-mono"
                aria-invalid={asDb === null} />
              <div className="mt-3 text-xs text-muted-foreground">is</div>
              <div className="mt-0.5 flex items-center gap-2 font-mono text-2xl text-foreground" data-numeric>
                {asDb === null ? "—" : `${round(asDb)} dB`}
                {asDb !== null ? <CopyButton value={String(round(asDb))} iconOnly /> : null}
              </div>
            </div>

            <div className="surface-card p-5">
              <Label htmlFor="db">Decibels</Label>
              <Input id="db" inputMode="decimal" value={decibels}
                onChange={(e) => setDecibels(e.target.value)} className="mt-1.5 font-mono" />
              <div className="mt-3 text-xs text-muted-foreground">is a ratio of</div>
              <div className="mt-0.5 flex items-center gap-2 font-mono text-2xl text-foreground" data-numeric>
                {asRatio === null ? "—" : `${round(asRatio)}×`}
                {asRatio !== null ? <CopyButton value={String(round(asRatio))} iconOnly /> : null}
              </div>
            </div>
          </div>

          <section>
            <h2 className="text-sm font-medium text-foreground">Worth memorising</h2>
            <ul className="mt-3 divide-y divide-border rounded-md border border-border">
              {RULES.map((rule) => (
                <li key={rule.change} className="flex flex-wrap gap-x-4 gap-y-1 px-4 py-2.5 text-sm">
                  <span className="w-16 shrink-0 font-mono text-foreground">{rule.change}</span>
                  <span className="min-w-0 flex-1 text-muted-foreground">{rule.meaning}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : mode === "combine" ? (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="sources">Sound levels (dB), separated by commas</Label>
            <Input id="sources" value={sources} onChange={(e) => setSources(e.target.value)}
              className="font-mono" placeholder="60, 60, 55" />
          </div>
          {combined !== null ? (
            <div className="surface-card px-6 py-5">
              <div className="text-xs text-muted-foreground">Combined level</div>
              <div className="mt-1 font-mono text-3xl text-foreground" data-numeric>
                {round(combined)} dB
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Decibels do not add. Two 60 dB sources give 63 dB, not 120 —
                the powers add and the logarithm is taken afterwards, so
                doubling the power adds about 3 dB wherever you started.
              </p>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="level">Level at reference (dB)</Label>
              <Input id="level" inputMode="decimal" value={level}
                onChange={(e) => setLevel(e.target.value)} className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="from">Reference distance (m)</Label>
              <Input id="from" inputMode="decimal" value={from}
                onChange={(e) => setFrom(e.target.value)} className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="to">New distance (m)</Label>
              <Input id="to" inputMode="decimal" value={to}
                onChange={(e) => setTo(e.target.value)} className="font-mono" />
            </div>
          </div>
          {spread !== null ? (
            <div className="surface-card px-6 py-5">
              <div className="text-xs text-muted-foreground">Level at {to} m</div>
              <div className="mt-1 font-mono text-3xl text-foreground" data-numeric>
                {round(spread)} dB
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                A point source spreads over a sphere, so intensity falls with
                the square of distance — 6 dB lost every time the distance
                doubles. Roughly <span className="text-foreground">{nearestLandmark(spread).label.toLowerCase()}</span>.
              </p>
            </div>
          ) : null}
        </>
      )}

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-2.5 text-sm font-medium text-foreground">
          The scale in context
        </h2>
        <ul className="divide-y divide-border">
          {LANDMARKS.map((entry) => (
            <li key={entry.db} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-2 text-sm">
              <span className={cn("w-14 shrink-0 font-mono", entry.db >= 85 ? "text-[var(--warning)]" : "text-foreground")} data-numeric>
                {entry.db} dB
              </span>
              <span className="text-muted-foreground">{entry.label}</span>
              {entry.note ? (
                <span className="w-full text-xs text-subtle-foreground sm:w-auto sm:flex-1 sm:text-right">
                  {entry.note}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          A decibel is a ratio, not a quantity — which is why the formula
          depends on what you are comparing. Power uses 10·log₁₀ and amplitude
          uses 20·log₁₀, and picking the wrong one puts you out by a factor of
          two. They agree physically because power goes as amplitude squared,
          and a square becomes a factor of two inside a logarithm.
        </span>
      </p>
    </div>
  );
}
