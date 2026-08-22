"use client";

import * as React from "react";
import { Info, Plus, Trash2 } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { calculate, formatOhms, parseOhms, type Arrangement } from "./logic";

export default function ResistorNetworkCalculatorTool() {
  const [arrangement, setArrangement] = React.useState<Arrangement>("parallel");
  const [inputs, setInputs] = React.useState<string[]>(["100", "220", "330"]);
  const [voltage, setVoltage] = React.useState("12");

  const values = inputs.map(parseOhms).filter((value): value is number => value !== null);
  const supply = voltage.trim() === "" ? null : Number(voltage);
  const result = calculate(values, arrangement, Number.isFinite(supply) ? supply : null);

  const smallest = values.length > 0 ? Math.min(...values) : 0;
  const format = (value: number | null, unit: string, decimals = 3) =>
    value === null ? "—" : `${Number(value.toPrecision(decimals))} ${unit}`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-4">
        <Tabs value={arrangement} onValueChange={(v) => setArrangement(v as Arrangement)}>
          <TabsList>
            <TabsTrigger value="series">Series</TabsTrigger>
            <TabsTrigger value="parallel">Parallel</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-1.5">
          <Label htmlFor="voltage">Supply voltage (optional)</Label>
          <Input
            id="voltage"
            inputMode="decimal"
            value={voltage}
            onChange={(event) => setVoltage(event.target.value)}
            className="w-28 font-mono"
            placeholder="12"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Resistors</Label>
        <ul className="space-y-2">
          {inputs.map((value, index) => {
            const parsed = parseOhms(value);
            return (
              <li key={index} className="flex items-center gap-2">
                <Input
                  value={value}
                  onChange={(event) =>
                    setInputs((list) => list.map((v, i) => (i === index ? event.target.value : v)))
                  }
                  placeholder="4k7"
                  className="w-40 font-mono"
                  aria-label={`Resistor ${index + 1}`}
                  aria-invalid={parsed === null && value.trim() !== ""}
                />
                <span className="w-24 text-sm text-muted-foreground">
                  {parsed === null ? (value.trim() === "" ? "" : "?") : formatOhms(parsed)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label={`Remove resistor ${index + 1}`}
                  disabled={inputs.length <= 1}
                  onClick={() => setInputs((list) => list.filter((_, i) => i !== index))}
                >
                  <Trash2 className="size-3.5" strokeWidth={1.75} />
                </Button>
              </li>
            );
          })}
        </ul>
        <Button variant="outline" size="sm" onClick={() => setInputs((list) => [...list, ""])}>
          <Plus strokeWidth={1.75} />
          Add a resistor
        </Button>
        <p className="text-xs text-muted-foreground">
          Schematic notation works — <code className="font-mono">4k7</code>,{" "}
          <code className="font-mono">2.2k</code>, <code className="font-mono">1M</code>,{" "}
          <code className="font-mono">470</code>.
        </p>
      </div>

      {result ? (
        <>
          <div className="surface-card px-6 py-5">
            <div className="text-xs text-muted-foreground">
              {result.count} resistors in {arrangement}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <span
                className="font-display text-foreground"
                style={{ fontSize: "clamp(1.75rem, 6vw, 2.75rem)" }}
              >
                {formatOhms(result.total)}
              </span>
              <CopyButton value={String(Number(result.total.toPrecision(6)))} />
            </div>
            {result.nearestStandard !== result.total && result.total > 0 ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Nearest standard value:{" "}
                <span className="font-mono text-foreground">{formatOhms(result.nearestStandard)}</span>
              </p>
            ) : null}
          </div>

          {arrangement === "parallel" && values.length > 1 && result.total > 0 ? (
            <p className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
              <span className="text-foreground">{formatOhms(result.total)}</span> is below the
              smallest resistor in the set ({formatOhms(smallest)}), and always will be. Adding
              another path for current can only make it easier to flow.
            </p>
          ) : null}

          {result.current !== null ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="surface-card px-4 py-3">
                <dt className="text-xs text-muted-foreground">Total current</dt>
                <dd className="mt-0.5 font-mono text-lg text-foreground" data-numeric>
                  {format(result.current * 1000, "mA", 4)}
                </dd>
              </div>
              <div className="surface-card px-4 py-3">
                <dt className="text-xs text-muted-foreground">Total power</dt>
                <dd className="mt-0.5 font-mono text-lg text-foreground" data-numeric>
                  {format(result.power, "W", 4)}
                </dd>
              </div>
            </div>
          ) : null}

          {result.shares[0]?.power !== null ? (
            <section className="surface-card overflow-hidden">
              <h2 className="border-b border-border px-5 py-2.5 text-sm font-medium text-foreground">
                Per resistor
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[28rem] text-sm">
                  <thead className="border-b border-border text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="px-5 py-2 font-medium">Resistor</th>
                      <th className="px-5 py-2 font-medium">Voltage</th>
                      <th className="px-5 py-2 font-medium">Current</th>
                      <th className="px-5 py-2 font-medium">Power</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {result.shares.map((share, index) => (
                      <tr key={index}>
                        <td className="px-5 py-2 font-mono text-foreground">{formatOhms(share.value)}</td>
                        <td className="px-5 py-2 font-mono text-muted-foreground" data-numeric>
                          {format(share.voltage, "V", 4)}
                        </td>
                        <td className="px-5 py-2 font-mono text-muted-foreground" data-numeric>
                          {format(share.current === null ? null : share.current * 1000, "mA", 4)}
                        </td>
                        <td
                          className={cn(
                            "px-5 py-2 font-mono",
                            (share.power ?? 0) > 0.25 ? "text-[var(--warning)]" : "text-muted-foreground",
                          )}
                          data-numeric
                        >
                          {format(share.power, "W", 3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="border-t border-border px-5 py-2.5 text-xs text-muted-foreground">
                Anything above a quarter of a watt is highlighted — that is the
                rating of the resistors most people have in a drawer, and
                exceeding it is how they end up smelling distinctive.
              </p>
            </section>
          ) : null}
        </>
      ) : (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          Enter at least one resistor value.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          In series the resistances add and the same current flows through
          every one, so the voltage divides in proportion. In parallel the
          reciprocals add, every resistor sees the full voltage, and the current
          divides inversely — the smallest resistor takes the most.
        </span>
      </p>
    </div>
  );
}
