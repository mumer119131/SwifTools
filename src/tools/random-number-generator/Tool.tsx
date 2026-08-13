"use client";

import * as React from "react";
import { Info, Shuffle } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PRESETS, draw } from "./logic";

export default function RandomNumberTool() {
  const [min, setMin] = React.useState("1");
  const [max, setMax] = React.useState("100");
  const [count, setCount] = React.useState("1");
  const [allowRepeats, setAllowRepeats] = React.useState(false);
  const [sorted, setSorted] = React.useState(false);
  const [numbers, setNumbers] = React.useState<number[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  function generate(over?: { min: number; max: number; count: number }) {
    const result = draw(
      over ? over.min : Number(min),
      over ? over.max : Number(max),
      over ? over.count : Number(count),
      allowRepeats,
      sorted,
    );

    if (result.ok) {
      setNumbers(result.numbers);
      setError(null);
    } else {
      setNumbers([]);
      setError(result.error);
    }
  }

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="rng-min">Minimum</Label>
          <Input
            id="rng-min"
            type="number"
            inputMode="numeric"
            value={min}
            onChange={(event) => setMin(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rng-max">Maximum</Label>
          <Input
            id="rng-max"
            type="number"
            inputMode="numeric"
            value={max}
            onChange={(event) => setMax(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rng-count">How many</Label>
          <Input
            id="rng-count"
            type="number"
            inputMode="numeric"
            min={1}
            value={count}
            onChange={(event) => setCount(event.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch id="rng-repeats" checked={allowRepeats} onCheckedChange={setAllowRepeats} />
          <Label htmlFor="rng-repeats">Allow repeats</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="rng-sorted" checked={sorted} onCheckedChange={setSorted} />
          <Label htmlFor="rng-sorted">Sort the result</Label>
        </div>
        <Button size="lg" onClick={() => generate()}>
          <Shuffle className="size-4" strokeWidth={1.75} />
          Generate
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() => {
              setMin(String(preset.min));
              setMax(String(preset.max));
              setCount(String(preset.count));
              generate(preset);
            }}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {error ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      {numbers.length > 0 ? (
        numbers.length === 1 ? (
          <div className="surface-card p-10 text-center">
            <p
              className="font-mono text-7xl tracking-[-0.03em] text-foreground"
              data-numeric
              aria-live="polite"
            >
              {numbers[0]}
            </p>
            <div className="mt-6 flex justify-center">
              <CopyButton value={String(numbers[0])} label="Copy number" />
            </div>
          </div>
        ) : (
          <div className="surface-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {numbers.length.toLocaleString("en-US")} numbers
              </p>
              <CopyButton value={numbers.join(", ")} label="Copy all" />
            </div>
            <p className="flex flex-wrap gap-2" aria-live="polite">
              {numbers.map((number, index) => (
                <span
                  key={index}
                  className="rounded-lg border border-border bg-surface-hover px-3 py-1.5 font-mono text-base text-foreground"
                  data-numeric
                >
                  {number}
                </span>
              ))}
            </p>
          </div>
        )
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Numbers come from the browser&rsquo;s cryptographic random source with
          the modulo bias removed, so every value in the range is equally likely
          — good enough that a prize draw run here is defensible. Drawing without
          repeats uses a partial shuffle rather than re-rolling until a new
          number appears, which is why asking for 49 of 49 returns instantly
          instead of hanging.
        </span>
      </p>
    </div>
  );
}
