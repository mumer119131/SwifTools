"use client";

import * as React from "react";
import { Eraser, Info, Trash2 } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";
import {
  CHARSET,
  blankGlyph,
  drawSheet,
  resizeGlyph,
  seedFont,
  type FontData,
} from "./logic";

interface Store {
  width: number;
  height: number;
  font: FontData;
}

const DEFAULT: Store = { width: 5, height: 7, font: seedFont(5, 7) };

export default function PixelFontMakerTool() {
  const [store, setStore, clear] = useLocalStorage<Store>("swiftknife:pixel-font", DEFAULT);
  const [active, setActive] = React.useState("A");
  const [preview, setPreview] = React.useState("HELLO 123");
  const paintingRef = React.useRef<0 | 1 | null>(null);
  const sheetRef = React.useRef<HTMLCanvasElement>(null);

  const { width, height, font } = store;
  const glyph = font[active] ?? blankGlyph(width, height);

  // The sprite sheet is the export, so it is redrawn whenever the font changes.
  React.useEffect(() => {
    if (sheetRef.current) drawSheet(sheetRef.current, font, width, height, 4);
  }, [font, width, height]);

  function setPixel(index: number, value: 0 | 1) {
    setStore((current) => ({
      ...current,
      font: {
        ...current.font,
        [active]: (current.font[active] ?? blankGlyph(current.width, current.height)).map(
          (cell, i) => (i === index ? value : cell),
        ),
      },
    }));
  }

  function changeSize(nextWidth: number, nextHeight: number) {
    setStore((current) => ({
      width: nextWidth,
      height: nextHeight,
      font: Object.fromEntries(
        Object.entries(current.font).map(([character, entry]) => [
          character,
          resizeGlyph(entry, current.width, current.height, nextWidth, nextHeight),
        ]),
      ),
    }));
  }

  return (
    <div className="space-y-5">
      <div className="surface-card flex flex-wrap items-end gap-4 p-5">
        <div className="space-y-2">
          <Label htmlFor="pf-width">Glyph width</Label>
          <Input
            id="pf-width"
            type="number"
            inputMode="numeric"
            min={3}
            max={16}
            value={width}
            onChange={(event) =>
              changeSize(Math.max(3, Math.min(16, Number(event.target.value) || 5)), height)
            }
            className="w-24"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pf-height">Glyph height</Label>
          <Input
            id="pf-height"
            type="number"
            inputMode="numeric"
            min={3}
            max={16}
            value={height}
            onChange={(event) =>
              changeSize(width, Math.max(3, Math.min(16, Number(event.target.value) || 7)))
            }
            className="w-24"
          />
          <FieldHint>Existing glyphs are kept, cropped if you shrink the grid.</FieldHint>
        </div>

        <Button
          variant="outline"
          onClick={() =>
            setStore((current) => ({
              ...current,
              font: { ...current.font, [active]: blankGlyph(current.width, current.height) },
            }))
          }
        >
          <Eraser className="size-4" strokeWidth={1.75} />
          Clear this glyph
        </Button>
        <Button variant="ghost" onClick={clear}>
          <Trash2 className="size-4" strokeWidth={1.75} />
          Reset the font
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[auto_1fr]">
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">
            Editing <span className="font-mono text-lg">{active === " " ? "space" : active}</span>
          </p>

          <div
            className="inline-grid gap-px rounded-lg border border-border-strong bg-border-strong p-px"
            style={{ gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))` }}
            onPointerUp={() => {
              paintingRef.current = null;
            }}
            onPointerLeave={() => {
              paintingRef.current = null;
            }}
          >
            {glyph.map((cell, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Pixel ${(index % width) + 1}, ${Math.floor(index / width) + 1}`}
                aria-pressed={cell === 1}
                className={cn(
                  "size-7 cursor-pointer touch-none sm:size-8",
                  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ring)]",
                  cell === 1 ? "bg-foreground" : "bg-surface hover:bg-surface-hover",
                )}
                onPointerDown={(event) => {
                  event.preventDefault();
                  // Painting mode is set by the first cell: filling an empty
                  // pixel paints, starting on a filled one erases.
                  const value: 0 | 1 = cell === 1 ? 0 : 1;
                  paintingRef.current = value;
                  setPixel(index, value);
                }}
                onPointerEnter={() => {
                  if (paintingRef.current !== null) setPixel(index, paintingRef.current);
                }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pf-charset">Character set</Label>
            <div className="flex max-h-40 flex-wrap gap-1 overflow-y-auto rounded-lg border border-border p-2">
              {[...CHARSET].map((character) => {
                const drawn = (font[character] ?? []).some((cell) => cell === 1);
                return (
                  <button
                    key={character}
                    type="button"
                    onClick={() => setActive(character)}
                    className={cn(
                      "size-8 cursor-pointer rounded font-mono text-sm",
                      "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]",
                      active === character
                        ? "bg-foreground text-background"
                        : drawn
                          ? "bg-surface-hover text-foreground"
                          : "text-subtle-foreground hover:bg-surface-hover",
                    )}
                  >
                    {character === " " ? "␣" : character}
                  </button>
                );
              })}
            </div>
            <FieldHint>Characters you have drawn are highlighted.</FieldHint>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pf-preview">Preview text</Label>
            <Input
              id="pf-preview"
              value={preview}
              onChange={(event) => setPreview(event.target.value)}
            />
          </div>

          <div className="surface-card overflow-x-auto p-5">
            <div className="flex items-end gap-1">
              {[...preview].map((character, index) => {
                const entry = font[character];
                if (!entry) return null;

                return (
                  <div
                    key={index}
                    className="grid gap-px"
                    style={{ gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))` }}
                  >
                    {entry.map((cell, cellIndex) => (
                      <span
                        key={cellIndex}
                        className={cn("size-1.5", cell === 1 ? "bg-foreground" : "bg-transparent")}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <section className="surface-card space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-foreground">Sprite sheet</h2>
          <div className="flex flex-wrap gap-2">
            <DownloadButton
              blob={() =>
                new Promise<Blob>((resolve, reject) => {
                  sheetRef.current?.toBlob(
                    (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode the sheet."))),
                    "image/png",
                  );
                })
              }
              fileName={`pixel-font-${width}x${height}.png`}
              label="Download PNG"
              size="sm"
            />
            <CopyButton
              value={JSON.stringify({ width, height, charset: CHARSET, glyphs: font }, null, 2)}
              label="Copy JSON"
            />
          </div>
        </div>

        <canvas
          ref={sheetRef}
          className="max-w-full rounded border border-border bg-white"
          aria-label="Sprite sheet preview"
        />
        <FieldHint>
          16 glyphs per row, in character-set order, at 4× scale. Each cell is{" "}
          {width * 4} × {height * 4} pixels.
        </FieldHint>
      </section>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Dragging paints continuously, and the mode is set by the first pixel
          you touch — start on an empty cell and you fill, start on a filled one
          and you erase. That is how every pixel editor behaves, and it is much
          faster than switching tools. The export is a sprite sheet and a JSON
          glyph map rather than a TTF: bitmap fonts are used as sheets in game
          engines, and converting to a real outline font would throw away the
          crispness that is the entire point.
        </span>
      </p>
    </div>
  );
}
