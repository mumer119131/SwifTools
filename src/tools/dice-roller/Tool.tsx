"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PRESETS, roll, type Mode, type Roll } from "./logic";

export default function DiceRollerTool() {
  const [notation, setNotation] = React.useState("2d6+3");
  const [mode, setMode] = React.useState<Mode>("normal");
  const [current, setCurrent] = React.useState<Roll | null>(null);
  const [history, setHistory] = React.useState<Roll[]>([]);

  const valid = roll(notation, mode) !== null;

  function doRoll(withNotation = notation) {
    const result = roll(withNotation, mode);
    if (!result) return;
    setCurrent(result);
    setHistory((entries) => [result, ...entries].slice(0, 20));
  }

  return (
    <div className="space-y-5">
      <div className="surface-card space-y-4 p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-48 flex-1 space-y-2">
            <Label htmlFor="dice-notation">Dice notation</Label>
            <Input
              id="dice-notation"
              value={notation}
              onChange={(event) => setNotation(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") doRoll();
              }}
              placeholder="2d6+3"
              className="font-mono text-lg"
              spellCheck={false}
              autoComplete="off"
              aria-invalid={!valid}
            />
            <FieldHint>
              {valid ? "Press enter or Roll. Combine groups: 1d8+2d6+4." : "That notation isn't valid — try 2d6+3."}
            </FieldHint>
          </div>

          <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
            <TabsList>
              <TabsTrigger value="normal">Normal</TabsTrigger>
              <TabsTrigger value="advantage">Advantage</TabsTrigger>
              <TabsTrigger value="disadvantage">Disadvantage</TabsTrigger>
              <TabsTrigger value="drop-lowest">Drop lowest</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button size="lg" onClick={() => doRoll()} disabled={!valid}>
            Roll
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              onClick={() => {
                setNotation(preset);
                doRoll(preset);
              }}
            >
              {preset}
            </Button>
          ))}
        </div>
      </div>

      {current ? (
        <>
          <div className="surface-card p-8 text-center">
            <p className="text-xs text-muted-foreground">
              {current.notation}
              {mode !== "normal" ? ` · ${mode.replace("-", " ")}` : null}
            </p>
            <p
              className="mt-2 font-mono text-6xl tracking-[-0.03em] text-foreground"
              data-numeric
              aria-live="polite"
            >
              {current.total}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {current.dice.map((group, groupIndex) =>
                group.values.map((value, index) => (
                  <span
                    key={`${groupIndex}-${index}`}
                    title={`d${group.sides}${group.kept[index] ? "" : " — dropped"}`}
                    className={cn(
                      "grid size-11 place-items-center rounded-lg border font-mono text-lg",
                      group.kept[index]
                        ? "border-border-strong bg-surface-hover text-foreground"
                        : "border-dashed border-border text-subtle-foreground line-through",
                    )}
                  >
                    {value}
                  </span>
                )),
              )}
              {current.modifier !== 0 ? (
                <span className="grid size-11 place-items-center rounded-lg border border-dashed border-border font-mono text-lg text-muted-foreground">
                  {current.modifier > 0 ? `+${current.modifier}` : current.modifier}
                </span>
              ) : null}
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-3">
            {[
              { label: "Minimum", value: current.min },
              { label: "Average", value: current.average.toFixed(1) },
              { label: "Maximum", value: current.max },
            ].map((card) => (
              <div key={card.label} className="surface-card p-4">
                <dt className="text-xs text-muted-foreground">{card.label}</dt>
                <dd className="mt-1 font-mono text-base text-foreground" data-numeric>
                  {card.value}
                </dd>
              </div>
            ))}
          </dl>

          {history.length > 1 ? (
            <section className="surface-card overflow-hidden">
              <h2 className="border-b border-border px-5 py-3 text-sm font-medium text-foreground">
                Recent rolls
              </h2>
              <ul className="divide-y divide-border">
                {history.map((entry, index) => (
                  <li key={index} className="flex items-center justify-between gap-4 px-5 py-2 text-sm">
                    <span className="font-mono text-muted-foreground">{entry.notation}</span>
                    <span className="font-mono text-foreground" data-numeric>
                      {entry.total}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Every die is rolled independently from the browser&rsquo;s
          cryptographic random source, with the modulo bias removed — so a d20 is
          genuinely uniform across all twenty faces, which a naive
          <code className="mx-1 rounded bg-surface-hover px-1 font-mono text-xs">
            random() % 20
          </code>
          is not. Dropped dice stay visible, struck through, so advantage and
          4d6-drop-lowest show their working.
        </span>
      </p>
    </div>
  );
}
