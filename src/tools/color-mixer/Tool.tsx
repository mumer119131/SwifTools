"use client";

import * as React from "react";
import { ArrowLeftRight } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatRgb, parseColor, rgbToHex, type Rgb } from "@/tools/color-picker/logic";
import { cn } from "@/lib/utils";
import { buildRamp, mix, toCssGradient, type BlendSpace } from "./logic";

function useColorField(initial: string, fallback: Rgb) {
  const [text, setText] = React.useState(initial);
  const parsed = parseColor(text);
  const [lastValid, setLastValid] = React.useState<Rgb>(fallback);
  const [tracked, setTracked] = React.useState<Rgb | null>(parsed);

  if (parsed && tracked !== parsed) {
    setTracked(parsed);
    setLastValid(parsed);
  }

  return { text, setText, rgb: parsed ?? lastValid, isValid: parsed !== null };
}

export default function ColorMixerTool() {
  const from = useColorField("#5e6ad2", { r: 94, g: 106, b: 210 });
  const to = useColorField("#ffb224", { r: 255, g: 178, b: 36 });

  const [amount, setAmount] = React.useState(50);
  const [space, setSpace] = React.useState<BlendSpace>("oklab");
  const [steps, setSteps] = React.useState("11");

  const mixed = mix(from.rgb, to.rgb, amount / 100, space);
  const mixedHex = rgbToHex(mixed);
  const ramp = React.useMemo(
    () => buildRamp(from.rgb, to.rgb, Number(steps), space),
    [from.rgb, to.rgb, steps, space],
  );

  function swap() {
    const a = from.text;
    from.setText(to.text);
    to.setText(a);
  }

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="space-y-2">
          <Label htmlFor="mix-from">From</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={rgbToHex(from.rgb)}
              onChange={(event) => from.setText(event.target.value)}
              className="h-10 w-14 shrink-0 cursor-pointer rounded-md border border-border bg-surface p-1"
              aria-label="From colour swatch"
            />
            <Input
              id="mix-from"
              value={from.text}
              onChange={(event) => from.setText(event.target.value)}
              className="font-mono"
              spellCheck={false}
              autoCapitalize="off"
              aria-invalid={!from.isValid}
            />
          </div>
        </div>

        <div className="flex items-end justify-center pb-0.5 sm:items-center sm:pb-0">
          <Button variant="outline" size="icon" onClick={swap} aria-label="Swap colours">
            <ArrowLeftRight strokeWidth={1.75} />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mix-to">To</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={rgbToHex(to.rgb)}
              onChange={(event) => to.setText(event.target.value)}
              className="h-10 w-14 shrink-0 cursor-pointer rounded-md border border-border bg-surface p-1"
              aria-label="To colour swatch"
            />
            <Input
              id="mix-to"
              value={to.text}
              onChange={(event) => to.setText(event.target.value)}
              className="font-mono"
              spellCheck={false}
              autoCapitalize="off"
              aria-invalid={!to.isValid}
            />
          </div>
        </div>
      </div>

      <div className="surface-card space-y-5 p-5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Tabs value={space} onValueChange={(value) => setSpace(value as BlendSpace)}>
            <TabsList>
              <TabsTrigger value="oklab">OKLab</TabsTrigger>
              <TabsTrigger value="srgb">sRGB</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3">
            <Label htmlFor="mix-steps">Steps</Label>
            <Select value={steps} onValueChange={setSteps}>
              <SelectTrigger id="mix-steps" className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["3", "5", "7", "9", "11", "15", "21"].map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="mix-amount">Mix</Label>
            <span className="font-mono text-sm text-muted-foreground" data-numeric>
              {amount}%
            </span>
          </div>
          <Slider
            id="mix-amount"
            min={0}
            max={100}
            step={1}
            value={[amount]}
            onValueChange={([value]) => setAmount(value)}
            aria-label="Blend amount"
          />
          <FieldHint>
            {space === "oklab"
              ? "OKLab is perceptually uniform, so the midpoint looks like a midpoint."
              : "sRGB is what naive gradients and mix-blend-mode do — it passes through a desaturated grey between opposite hues."}
          </FieldHint>
        </div>

        <div
          className="grid h-28 place-items-center rounded-lg border border-border"
          style={{ backgroundColor: mixedHex }}
        >
          <div className="flex items-center gap-2 rounded-md bg-background/85 px-3 py-1.5 backdrop-blur-sm">
            <span className="font-mono text-sm text-foreground" data-numeric>
              {mixedHex}
            </span>
            <CopyButton value={mixedHex} iconOnly label="Copy mixed colour" />
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          <span className="font-mono text-foreground">{formatRgb(mixed)}</span>
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-foreground">Every step</h2>
        <ul
          className="grid overflow-hidden rounded-md border border-border"
          style={{ gridTemplateColumns: `repeat(${ramp.length}, minmax(0, 1fr))` }}
        >
          {ramp.map((step) => (
            <li key={step.amount}>
              <button
                type="button"
                onClick={() => setAmount(Math.round(step.amount * 100))}
                style={{ backgroundColor: step.hex }}
                className={cn(
                  "flex h-20 w-full cursor-pointer items-end justify-center pb-1.5",
                  "transition-transform duration-[120ms] ease-out-expo hover:scale-105 hover:rounded-sm",
                  "focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--ring)]",
                )}
                aria-label={`Set mix to ${step.label} — ${step.hex}`}
              >
                <span
                  className="rounded bg-black/45 px-1 font-mono text-[0.5625rem] text-white"
                  data-numeric
                >
                  {step.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-foreground">As a CSS gradient</h2>
          <CopyButton value={toCssGradient(from.rgb, to.rgb, space)} label="Copy" />
        </div>
        <div
          className="h-12 rounded-md border border-border"
          style={{ background: `linear-gradient(to right, ${rgbToHex(from.rgb)}, ${rgbToHex(to.rgb)})` }}
          role="img"
          aria-label="Gradient preview"
        />
        <pre className="overflow-x-auto rounded-md border border-border bg-surface p-3 font-mono text-xs text-foreground">
          <code>{toCssGradient(from.rgb, to.rgb, space)}</code>
        </pre>
        <FieldHint>
          The preview above always renders in sRGB, because that is what a plain
          <code className="mx-1 font-mono">linear-gradient</code> does. The copied value includes
          the <code className="mx-1 font-mono">in oklab</code> hint when OKLab is selected — modern
          browsers honour it, older ones fall back to sRGB.
        </FieldHint>
      </section>
    </div>
  );
}
