"use client";

import * as React from "react";
import { Check, Info, X } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PRESETS, assess, parseColor, suggest, toHex } from "./logic";

export default function ContrastCheckerTool() {
  const [foreground, setForeground] = React.useState("#6b7280");
  const [background, setBackground] = React.useState("#ffffff");

  const fg = parseColor(foreground);
  const bg = parseColor(background);
  const verdict = fg && bg ? assess(fg, bg) : null;

  const fixed = fg && bg && verdict && !verdict.aaNormal ? suggest(fg, bg, 4.5) : null;

  const levels = verdict
    ? [
        { label: "AA — normal text", need: "4.5:1", pass: verdict.aaNormal },
        { label: "AA — large text", need: "3:1", pass: verdict.aaLarge },
        { label: "AAA — normal text", need: "7:1", pass: verdict.aaaNormal },
        { label: "AAA — large text", need: "4.5:1", pass: verdict.aaaLarge },
        { label: "UI components & icons", need: "3:1", pass: verdict.uiComponents },
      ]
    : [];

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        {[
          { id: "cc-fg", label: "Text colour", value: foreground, set: setForeground, parsed: fg },
          { id: "cc-bg", label: "Background colour", value: background, set: setBackground, parsed: bg },
        ].map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <div className="flex gap-2">
              <Input
                id={field.id}
                value={field.value}
                onChange={(event) => field.set(event.target.value)}
                className="font-mono"
                spellCheck={false}
                aria-invalid={field.parsed === null}
              />
              <Input
                type="color"
                value={field.parsed ? toHex(field.parsed) : "#000000"}
                onChange={(event) => field.set(event.target.value)}
                aria-label={`Pick ${field.label.toLowerCase()}`}
                className="h-10 w-14 shrink-0 p-1"
              />
            </div>
            {field.parsed === null ? (
              <p className="text-sm text-destructive">
                Not a colour this can read. Try #6b7280 or rgb(107, 114, 128).
              </p>
            ) : (
              <FieldHint>Hex or rgb() both work.</FieldHint>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() => {
              setForeground(preset.foreground);
              setBackground(preset.background);
            }}
          >
            <span
              className="size-4 rounded-full border border-border"
              style={{ backgroundColor: preset.background, color: preset.foreground }}
            />
            {preset.label}
          </Button>
        ))}
      </div>

      {verdict && fg && bg ? (
        <>
          <div
            className="surface-card overflow-hidden"
            style={{ backgroundColor: toHex(bg) }}
          >
            <div className="space-y-4 p-8" style={{ color: toHex(fg) }}>
              <p className="text-3xl font-semibold tracking-[-0.02em]">
                Large heading at 30 pixels
              </p>
              <p className="text-base leading-relaxed">
                Normal body text at sixteen pixels. This is the size most of the
                reading on a page happens at, and the size the 4.5:1 threshold
                was written for.
              </p>
              <p className="text-sm leading-relaxed">
                Small text at fourteen pixels — captions, labels, form hints.
                Still normal text as far as WCAG is concerned.
              </p>
              <div className="flex items-center gap-3">
                <span
                  className="inline-block size-6 rounded"
                  style={{ backgroundColor: toHex(fg) }}
                  aria-hidden="true"
                />
                <span
                  className="inline-block h-8 w-32 rounded border"
                  style={{ borderColor: toHex(fg) }}
                  aria-hidden="true"
                />
                <span className="text-xs">Icon and border, at 3:1</span>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 text-center">
            <p className="text-xs text-muted-foreground">Contrast ratio</p>
            <p
              className="mt-2 font-mono text-5xl tracking-[-0.03em] text-foreground"
              data-numeric
              aria-live="polite"
            >
              {verdict.ratio.toFixed(2)}:1
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {verdict.ratio >= 7
                ? "Passes everything, including AAA for body text."
                : verdict.ratio >= 4.5
                  ? "Passes AA for all text. Below AAA for normal text."
                  : verdict.ratio >= 3
                    ? "Large text and UI only. Fails for body text."
                    : "Fails every threshold."}
            </p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {levels.map((level) => (
              <div
                key={level.label}
                className={cn(
                  "surface-card p-4",
                  level.pass
                    ? "border-[color-mix(in_oklab,var(--success)_45%,var(--border))]"
                    : "border-[color-mix(in_oklab,var(--destructive)_35%,var(--border))]",
                )}
              >
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {level.pass ? (
                    <Check className="size-3.5 text-[var(--success)]" strokeWidth={2.5} />
                  ) : (
                    <X className="size-3.5 text-destructive" strokeWidth={2.5} />
                  )}
                  {level.label}
                </dt>
                <dd className="mt-1 font-mono text-sm text-foreground">
                  {level.pass ? "Pass" : "Fail"}
                  <span className="ml-1.5 text-xs text-subtle-foreground">
                    needs {level.need}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          {fixed ? (
            <section className="surface-card flex flex-wrap items-center gap-5 p-5">
              <div>
                <p className="text-xs text-muted-foreground">Nearest passing text colour</p>
                <p className="mt-1 font-mono text-lg text-foreground">{toHex(fixed)}</p>
                <p className="mt-0.5 text-xs text-subtle-foreground">
                  {assess(fixed, bg).ratio.toFixed(2)}:1 — the smallest change that reaches AA.
                </p>
              </div>
              <span
                className="grid h-16 w-32 place-items-center rounded-lg text-sm"
                style={{ backgroundColor: toHex(bg), color: toHex(fixed) }}
              >
                Sample text
              </span>
              <div className="flex gap-2">
                <CopyButton value={toHex(fixed)} label="Copy" />
                <Button variant="outline" size="sm" onClick={() => setForeground(toHex(fixed))}>
                  Use it
                </Button>
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The ratio comes from relative luminance, which means undoing the sRGB
          gamma curve before weighting the channels — comparing HSL lightness
          instead gives numbers that look right and are not, and a checker that
          passes an inaccessible pair is worse than none. Meeting the threshold
          is a floor rather than a target: text at exactly 4.5:1 is legible, not
          comfortable, and it gets harder in sunlight or on a cheap screen.
        </span>
      </p>
    </div>
  );
}
