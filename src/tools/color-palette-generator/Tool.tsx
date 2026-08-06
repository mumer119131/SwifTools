"use client";

import * as React from "react";
import { Shuffle } from "lucide-react";

import { CodeOutput } from "@/components/shared/CodeOutput";
import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { parseColor, rgbToHex, type Rgb } from "@/tools/color-picker/logic";
import { cn } from "@/lib/utils";
import {
  buildPalette,
  exportPalette,
  harmonies,
  type ExportFormat,
} from "./logic";

const SEEDS = ["#5e6ad2", "#e5484d", "#30a46c", "#f76b15", "#8e4ec6", "#00a2c7"];

export default function ColorPaletteGeneratorTool() {
  const [text, setText] = React.useState("#5e6ad2");
  const [harmonyId, setHarmonyId] = React.useState("analogous");
  const [format, setFormat] = React.useState<ExportFormat>("css");

  const parsed = parseColor(text);
  const [lastValid, setLastValid] = React.useState<Rgb>({ r: 94, g: 106, b: 210 });
  const [tracked, setTracked] = React.useState<Rgb | null>(parsed);

  if (parsed && tracked !== parsed) {
    setTracked(parsed);
    setLastValid(parsed);
  }

  const seed = parsed ?? lastValid;
  const harmony = harmonies.find((entry) => entry.id === harmonyId) ?? harmonies[1];
  const palette = React.useMemo(() => buildPalette(seed, harmony), [seed, harmony]);
  const exported = React.useMemo(() => exportPalette(palette, format), [palette, format]);

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-[auto_minmax(0,1fr)]">
        <div className="space-y-2">
          <Label htmlFor="seed-swatch">Seed colour</Label>
          <input
            id="seed-swatch"
            type="color"
            value={rgbToHex(seed)}
            onChange={(event) => setText(event.target.value)}
            className="h-11 w-full cursor-pointer rounded-md border border-border bg-surface p-1 sm:w-28"
            aria-label="Seed colour swatch"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seed-input">Or type any format</Label>
          <div className="flex items-center gap-2">
            <Input
              id="seed-input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="#5e6ad2, rgb(94 106 210), hsl(234 56% 60%)"
              className="font-mono"
              spellCheck={false}
              autoCapitalize="off"
              aria-invalid={!parsed}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setText(SEEDS[Math.floor(Math.random() * SEEDS.length)])}
              aria-label="Use a random seed colour"
            >
              <Shuffle strokeWidth={1.75} />
            </Button>
          </div>
          <FieldHint>
            {parsed
              ? "Harmonies rotate the hue and keep the seed's saturation and lightness, so the set reads as one family."
              : "That isn't a colour we recognise — showing the last valid one."}
          </FieldHint>
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-foreground">Harmony</legend>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {harmonies.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="radio"
              aria-checked={harmonyId === entry.id}
              onClick={() => setHarmonyId(entry.id)}
              className={cn(
                "surface-card cursor-pointer p-4 text-left",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                harmonyId === entry.id
                  ? "border-border-strong bg-surface-hover"
                  : "hover:border-border-strong",
              )}
            >
              <span className="text-sm font-medium text-foreground">{entry.label}</span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                {entry.description}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-foreground">Palette</h2>

        {palette.map((entry) => (
          <div key={entry.name} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">{entry.name}</p>
              <CopyButton value={entry.base.hex} label={entry.base.hex} />
            </div>

            <ul className="grid grid-cols-6 overflow-hidden rounded-md border border-border sm:grid-cols-11">
              {entry.ramp.map((swatch) => (
                <li key={swatch.step}>
                  <button
                    type="button"
                    onClick={() => setText(swatch.hex)}
                    style={{ backgroundColor: swatch.hex }}
                    className={cn(
                      "flex h-16 w-full cursor-pointer flex-col items-center justify-center gap-0.5",
                      "transition-transform duration-[120ms] ease-out-expo hover:scale-105 hover:rounded-sm",
                      "focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--ring)]",
                    )}
                    aria-label={`Use ${swatch.hex}, step ${swatch.step}`}
                  >
                    {/* Label colour flips with the swatch so it stays legible
                        at both ends of the ramp. */}
                    <span
                      className="font-mono text-[0.625rem]"
                      style={{ color: swatch.preferWhiteText ? "#ffffff" : "#000000" }}
                      data-numeric
                    >
                      {swatch.step}
                    </span>
                    <span
                      className="font-mono text-[0.5625rem] opacity-70"
                      style={{ color: swatch.preferWhiteText ? "#ffffff" : "#000000" }}
                    >
                      {swatch.hex.slice(1)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Export as</span>
        {(["css", "scss", "tailwind", "json"] as ExportFormat[]).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={format === option}
            onClick={() => setFormat(option)}
            className={cn(
              "inline-flex h-9 cursor-pointer items-center rounded-full border px-3.5 text-sm",
              "transition-colors duration-[180ms] ease-out-expo",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
              format === option
                ? "border-border-strong bg-surface-hover text-foreground"
                : "border-border bg-surface text-muted-foreground hover:text-foreground",
            )}
          >
            {option === "css" ? "CSS variables" : option === "scss" ? "SCSS" : option === "tailwind" ? "Tailwind" : "JSON"}
          </button>
        ))}
      </div>

      <CodeOutput
        value={exported}
        label="Palette tokens"
        fileName={`palette.${format === "tailwind" ? "ts" : format === "json" ? "json" : format}`}
      />

      <p className="text-sm text-muted-foreground">
        No model is involved — harmonies are hue rotations on the colour wheel, the relationships
        painters have used for two centuries. Each ramp eases saturation toward its extremes,
        because a fully saturated near-white reads as a colour cast rather than a tint.
      </p>
    </div>
  );
}
