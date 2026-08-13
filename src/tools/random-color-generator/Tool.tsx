"use client";

import * as React from "react";
import { Check, Info, RefreshCw } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FILTERS, randomColour, type Colour, type Filter } from "./logic";

export default function RandomColorTool() {
  const [filter, setFilter] = React.useState<Filter>("any");
  const [count, setCount] = React.useState("12");
  const [colours, setColours] = React.useState<Colour[]>(() =>
    Array.from({ length: 12 }, () => randomColour("any")),
  );
  const [copied, setCopied] = React.useState<string | null>(null);

  function generate(nextFilter = filter) {
    const wanted = Math.max(1, Math.min(120, Number(count) || 1));
    setColours(Array.from({ length: wanted }, () => randomColour(nextFilter)));
  }

  async function copyHex(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      window.setTimeout(() => setCopied(null), 1400);
    } catch {
      // A blocked clipboard is not worth an error state — the hex is on screen.
    }
  }

  const featured = colours[0];

  return (
    <div className="space-y-5">
      <div className="surface-card flex flex-wrap items-end gap-4 p-5">
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Style</span>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((entry) => (
              <Button
                key={entry.id}
                variant={filter === entry.id ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFilter(entry.id);
                  generate(entry.id);
                }}
              >
                {entry.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color-count">How many</Label>
          <Input
            id="color-count"
            type="number"
            inputMode="numeric"
            min={1}
            max={120}
            value={count}
            onChange={(event) => setCount(event.target.value)}
            className="w-24"
          />
        </div>

        <Button size="lg" onClick={() => generate()}>
          <RefreshCw className="size-4" strokeWidth={1.75} />
          Generate
        </Button>
      </div>

      {featured ? (
        <div
          className="surface-card grid place-items-center p-16 text-center"
          style={{ backgroundColor: featured.hex }}
        >
          <div style={{ color: featured.textOnTop }}>
            <p className="font-mono text-4xl tracking-[-0.02em] sm:text-5xl" data-numeric>
              {featured.hex.toUpperCase()}
            </p>
            <p className="mt-2 font-mono text-sm opacity-80">
              {featured.rgb} · {featured.hsl}
            </p>
          </div>
          <div className="mt-6 flex gap-2">
            <CopyButton value={featured.hex} label="Copy hex" />
            <CopyButton value={featured.rgb} label="Copy RGB" />
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {colours.map((colour, index) => (
          <button
            key={`${colour.hex}-${index}`}
            type="button"
            onClick={() => copyHex(colour.hex)}
            className="group aspect-square cursor-pointer rounded-lg border border-border transition-transform duration-[180ms] ease-out-expo hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
            style={{ backgroundColor: colour.hex }}
            aria-label={`Copy ${colour.hex}`}
          >
            <span
              className="flex size-full items-center justify-center gap-1 font-mono text-xs opacity-0 transition-opacity duration-[180ms] group-hover:opacity-100 group-focus-visible:opacity-100"
              style={{ color: colour.textOnTop }}
            >
              {copied === colour.hex ? (
                <>
                  <Check className="size-3" strokeWidth={2} />
                  Copied
                </>
              ) : (
                colour.hex.toUpperCase()
              )}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <CopyButton
          value={colours.map((colour) => colour.hex).join("\n")}
          label="Copy all hex codes"
        />
        <CopyButton
          value={colours
            .map((colour, index) => `--color-${index + 1}: ${colour.hex};`)
            .join("\n")}
          label="Copy as CSS variables"
        />
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Colours are generated in HSL rather than as three random bytes. Uniform
          RGB sounds more random and is much worse in practice — most of the RGB
          cube is muddy near-grey, so you get a lot of sludge and very few
          colours anyone would use. Constraining hue, saturation and lightness
          separately is also what makes &ldquo;pastel&rdquo; a range rather than
          a filter that throws most results away.
        </span>
      </p>
    </div>
  );
}
