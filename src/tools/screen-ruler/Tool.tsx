"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldHint, Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useLocalStorage } from "@/lib/use-local-storage";

/**
 * A credit card is 85.60 × 53.98 mm by ISO/IEC 7810 ID-1 — the same everywhere
 * in the world, which makes it the one object almost everyone has to hand that
 * can calibrate a screen.
 */
const CARD_WIDTH_MM = 85.6;

/** The CSS reference pixel: 96 per inch by definition, rarely the truth. */
const DEFAULT_PPI = 96;

export default function ScreenRulerTool() {
  const [ppi, setPpi] = useLocalStorage<number>("swiftknife:screen-ppi", DEFAULT_PPI);
  const [cardWidth, setCardWidth] = React.useState(323); // ~96 ppi
  const [calibrating, setCalibrating] = React.useState(false);

  const [start, setStart] = React.useState<{ x: number; y: number } | null>(null);
  const [end, setEnd] = React.useState<{ x: number; y: number } | null>(null);
  const draggingRef = React.useRef(false);

  const width = start && end ? Math.abs(end.x - start.x) : 0;
  const height = start && end ? Math.abs(end.y - start.y) : 0;
  const diagonal = Math.hypot(width, height);

  function inches(pixels: number): number {
    return pixels / ppi;
  }

  return (
    <div className="space-y-5">
      <div className="surface-card space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              Calibration: {ppi.toFixed(0)} pixels per inch
            </p>
            <p className="text-xs text-muted-foreground">
              {ppi === DEFAULT_PPI
                ? "Using the CSS default of 96 — calibrate for real-world accuracy."
                : "Calibrated to your display."}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCalibrating((value) => !value)}>
              {calibrating ? "Done" : "Calibrate"}
            </Button>
            <Button variant="ghost" onClick={() => setPpi(DEFAULT_PPI)}>
              Reset
            </Button>
          </div>
        </div>

        {calibrating ? (
          <div className="space-y-4 border-t border-border pt-4">
            <div className="space-y-2">
              <Label htmlFor="ruler-card">
                Hold a bank card against the screen and match the rectangle to it
              </Label>
              <Slider
                id="ruler-card"
                min={200}
                max={600}
                step={1}
                value={[cardWidth]}
                onValueChange={([value]) => {
                  setCardWidth(value);
                  // 85.6 mm is 3.37 inches, so ppi = pixels ÷ 3.37.
                  setPpi(value / (CARD_WIDTH_MM / 25.4));
                }}
              />
              <FieldHint>
                Any ISO ID-1 card works — bank card, driving licence, most ID
                cards. They are all 85.60 × 53.98 mm, everywhere in the world.
              </FieldHint>
            </div>

            <div
              className="rounded-xl border-2 border-[var(--accent-fun)] bg-[color-mix(in_oklab,var(--accent-fun)_10%,transparent)]"
              style={{ width: cardWidth, height: cardWidth * (53.98 / CARD_WIDTH_MM) }}
              role="img"
              aria-label="Calibration rectangle — match it to a bank card"
            />
          </div>
        ) : null}
      </div>

      <div
        className="relative h-96 cursor-crosshair touch-none select-none overflow-hidden rounded-lg border border-border bg-surface"
        onPointerDown={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          draggingRef.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
          setStart(point);
          setEnd(point);
        }}
        onPointerMove={(event) => {
          if (!draggingRef.current) return;
          const rect = event.currentTarget.getBoundingClientRect();
          setEnd({ x: event.clientX - rect.left, y: event.clientY - rect.top });
        }}
        onPointerUp={() => {
          draggingRef.current = false;
        }}
        role="application"
        aria-label="Measuring canvas — drag to measure"
      >
        {/* A ruled background, so the canvas reads as a measuring surface. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
            backgroundSize: `${ppi / 8}px ${ppi / 8}px`,
          }}
          aria-hidden="true"
        />

        {start && end ? (
          <div
            className="pointer-events-none absolute border-2 border-[var(--accent-fun)] bg-[color-mix(in_oklab,var(--accent-fun)_12%,transparent)]"
            style={{
              left: Math.min(start.x, end.x),
              top: Math.min(start.y, end.y),
              width,
              height,
            }}
          />
        ) : (
          <p className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-muted-foreground">
            Drag anywhere to measure.
          </p>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Width", pixels: width },
          { label: "Height", pixels: height },
          { label: "Diagonal", pixels: diagonal },
        ].map((entry) => (
          <div key={entry.label} className="surface-card p-4">
            <dt className="text-xs text-muted-foreground">{entry.label}</dt>
            <dd className="mt-1 font-mono text-lg text-foreground" data-numeric>
              {entry.pixels.toFixed(0)} px
            </dd>
            <dd className="mt-0.5 font-mono text-xs text-subtle-foreground" data-numeric>
              {inches(entry.pixels).toFixed(2)} in · {(inches(entry.pixels) * 2.54).toFixed(2)} cm
            </dd>
          </div>
        ))}
        <div className="surface-card p-4">
          <dt className="text-xs text-muted-foreground">Area</dt>
          <dd className="mt-1 font-mono text-lg text-foreground" data-numeric>
            {(width * height).toLocaleString("en-US", { maximumFractionDigits: 0 })} px²
          </dd>
          <dd className="mt-0.5 font-mono text-xs text-subtle-foreground" data-numeric>
            {width > 0 && height > 0 ? `ratio ${(width / height).toFixed(3)}:1` : "—"}
          </dd>
        </div>
      </dl>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Pixel measurements are always exact. Inches and centimetres are not,
          until you calibrate: a browser has no way to know your display&rsquo;s
          real size, so it assumes 96 pixels per inch — a figure fixed in the CSS
          specification and true of almost no modern screen. A bank card fixes
          that in one drag, because ISO/IEC 7810 makes every one of them 85.60 mm
          wide, anywhere in the world. Your calibration is saved in this browser.
        </span>
      </p>
    </div>
  );
}
