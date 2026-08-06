"use client";

import * as React from "react";
import { Check, X } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  buildScale,
  contrastRatio,
  formatHsl,
  formatOklch,
  formatRgb,
  parseColor,
  rgbToHex,
  rgbToHsl,
  rgbToOklch,
  type Rgb,
} from "./logic";

const WHITE: Rgb = { r: 255, g: 255, b: 255 };
const BLACK: Rgb = { r: 0, g: 0, b: 0 };

export default function ColorPickerTool() {
  const [text, setText] = React.useState("#5e6ad2");

  const parsed = React.useMemo(() => parseColor(text), [text]);
  // Keep the last valid colour on screen while the user is mid-edit.
  const [lastValid, setLastValid] = React.useState<Rgb>({ r: 94, g: 106, b: 210 });
  const [trackedParse, setTrackedParse] = React.useState<Rgb | null>(parsed);

  if (parsed && trackedParse !== parsed) {
    setTrackedParse(parsed);
    setLastValid(parsed);
  }

  const rgb = parsed ?? lastValid;
  const hex = rgbToHex(rgb);
  const hsl = rgbToHsl(rgb);
  const oklch = rgbToOklch(rgb);
  const scale = React.useMemo(() => buildScale(rgb), [rgb]);

  const onWhite = contrastRatio(rgb, WHITE);
  const onBlack = contrastRatio(rgb, BLACK);

  const formats = [
    { label: "HEX", value: hex },
    { label: "RGB", value: formatRgb(rgb) },
    { label: "HSL", value: formatHsl(hsl) },
    { label: "OKLCH", value: formatOklch(oklch) },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)]">
        <div className="space-y-2">
          <Label htmlFor="color-swatch">Pick</Label>
          <input
            id="color-swatch"
            type="color"
            value={hex}
            onChange={(event) => setText(event.target.value)}
            className="h-28 w-full cursor-pointer rounded-lg border border-border bg-surface p-1 sm:w-40"
            aria-label="Colour swatch"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color-input">Or type any format</Label>
          <Input
            id="color-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="#5e6ad2, rgb(94 106 210), hsl(234 56% 60%), rebeccapurple"
            className="font-mono"
            spellCheck={false}
            autoCapitalize="off"
            aria-invalid={!parsed}
          />
          <FieldHint>
            {parsed
              ? "Hex (3, 4, 6 or 8 digit), rgb(), hsl() and common colour names are all accepted."
              : "That value isn't a colour we recognise — showing the last valid one."}
          </FieldHint>

          <dl className="mt-4 space-y-2">
            {formats.map((format) => (
              <div key={format.label} className="flex items-center gap-3">
                <dt className="w-16 shrink-0 text-xs text-muted-foreground">{format.label}</dt>
                <dd className="min-w-0 flex-1 truncate rounded-md bg-surface-hover px-3 py-2 font-mono text-sm text-foreground">
                  {format.value}
                </dd>
                <CopyButton value={format.value} iconOnly label={`Copy ${format.label}`} />
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">Tints and shades</h2>
        <ul className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {scale.map((entry, index) => {
            const entryHex = rgbToHex(entry.rgb);
            return (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => setText(entryHex)}
                  className={cn(
                    "block w-full cursor-pointer rounded-md border transition-transform duration-[120ms] ease-out-expo hover:scale-105",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                    entry.label === "base" ? "border-border-strong" : "border-border",
                  )}
                  style={{ backgroundColor: entryHex }}
                  aria-label={`Use ${entryHex}`}
                >
                  <span className="block h-12 rounded-t-md" />
                  <span className="block bg-surface px-1 py-1 text-center font-mono text-[0.625rem] text-muted-foreground">
                    {entry.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
          Contrast (WCAG)
        </h2>
        <ul className="divide-y divide-border">
          {[
            { label: "As text on white", ratio: onWhite, bg: "#ffffff", fg: hex },
            { label: "As text on black", ratio: onBlack, bg: "#000000", fg: hex },
            { label: "White text on this", ratio: onWhite, bg: hex, fg: "#ffffff" },
            { label: "Black text on this", ratio: onBlack, bg: hex, fg: "#000000" },
          ].map((row, index) => {
            const passesAA = row.ratio >= 4.5;
            const passesLarge = row.ratio >= 3;
            return (
              <li key={index} className="flex flex-wrap items-center gap-4 px-5 py-3">
                <span
                  className="grid h-10 w-24 shrink-0 place-items-center rounded border border-border text-sm font-medium"
                  style={{ backgroundColor: row.bg, color: row.fg }}
                >
                  Sample
                </span>
                <span className="min-w-0 flex-1 text-sm text-muted-foreground">{row.label}</span>
                <span className="font-mono text-sm text-foreground" data-numeric>
                  {row.ratio.toFixed(2)}:1
                </span>
                {/* Pass/fail is stated in words and an icon, never colour alone. */}
                <span
                  className={cn(
                    "flex w-40 shrink-0 items-center justify-end gap-1.5 text-xs",
                    passesAA ? "text-success" : passesLarge ? "text-muted-foreground" : "text-destructive",
                  )}
                >
                  {passesAA ? (
                    <Check className="size-3.5" strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <X className="size-3.5" strokeWidth={2} aria-hidden="true" />
                  )}
                  {passesAA ? "AA body text" : passesLarge ? "AA large text only" : "Fails AA"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="text-sm text-muted-foreground">
        AA requires 4.5:1 for body text and 3:1 for large text (18pt, or 14pt bold). OKLCH is
        perceptually uniform, so equal lightness steps look equal — which is why the tint scale is
        built by mixing rather than by shifting HSL lightness.
      </p>
    </div>
  );
}
