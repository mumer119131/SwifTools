"use client";

import * as React from "react";
import { Info, RotateCcw } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { FieldHint, Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { canvasToPng, loadImage } from "@/lib/mockup";
import { cn, formatNumber } from "@/lib/utils";
import { applyFilter, filters, neutral, toCssFilter, type Adjustments } from "./logic";

const PREVIEW_MAX = 720;

export default function InstagramFiltersTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [image, setImage] = React.useState<ImageBitmap | null>(null);
  const [filterId, setFilterId] = React.useState("none");
  const [adjustments, setAdjustments] = React.useState<Adjustments>(neutral);

  const previewRef = React.useRef<HTMLCanvasElement>(null);
  const exportRef = React.useRef<HTMLCanvasElement>(null);
  const file = files[0];
  const filter = filters.find((entry) => entry.id === filterId) ?? filters[0];

  React.useEffect(() => {
    if (!file) return;
    let cancelled = false;
    loadImage(file)
      .then((bitmap) => {
        if (!cancelled) setImage(bitmap);
      })
      .catch(() => {
        if (!cancelled) setImage(null);
      });
    return () => {
      cancelled = true;
    };
  }, [file]);

  React.useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas || !image) return;

    const ratio = Math.min(PREVIEW_MAX / image.width, PREVIEW_MAX / image.height, 1);
    applyFilter(
      canvas,
      image,
      Math.round(image.width * ratio),
      Math.round(image.height * ratio),
      filter,
      adjustments,
    );
  }, [image, filter, adjustments]);

  /** Selecting a preset replaces the sliders; the sliders then fine-tune it. */
  function choose(id: string) {
    setFilterId(id);
    const preset = filters.find((entry) => entry.id === id);
    if (preset) setAdjustments(preset.adjustments);
  }

  const sliders: [keyof Adjustments, string, number, number][] = [
    ["brightness", "Brightness", 40, 180],
    ["contrast", "Contrast", 40, 200],
    ["saturate", "Saturation", 0, 220],
    ["sepia", "Warmth", 0, 100],
    ["grayscale", "Desaturate", 0, 100],
    ["blur", "Blur", 0, 12],
  ];

  return (
    <div className="space-y-5">
      {!image ? (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp,image/avif"
          acceptLabel="a JPG, PNG, WEBP or AVIF image"
          maxSizeMb={30}
          files={files}
          onFilesChange={setFiles}
        />
      ) : (
        <>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="surface-card grid place-items-center overflow-hidden bg-surface-hover p-4">
              <canvas
                ref={previewRef}
                role="img"
                aria-label="Filtered photo preview"
                className="h-auto max-h-[30rem] max-w-full rounded-lg"
              />
              <canvas ref={exportRef} className="hidden" aria-hidden="true" />
            </div>

            <section className="surface-card space-y-5 p-5">
              <div className="space-y-2">
                <Label>Filter</Label>
                <ul className="grid grid-cols-4 gap-2">
                  {filters.map((entry) => (
                    <li key={entry.id}>
                      <button
                        type="button"
                        aria-pressed={filterId === entry.id}
                        onClick={() => choose(entry.id)}
                        className={cn(
                          "w-full cursor-pointer overflow-hidden rounded-md border text-center",
                          "transition-colors duration-[120ms] ease-out-expo",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                          filterId === entry.id
                            ? "border-border-strong bg-surface-hover"
                            : "border-border hover:border-border-strong",
                        )}
                      >
                        <span
                          className="block h-10 w-full"
                          style={{
                            background:
                              "linear-gradient(135deg, #6b7280, #d1d5db 50%, #374151)",
                            filter: toCssFilter(entry.adjustments),
                          }}
                          aria-hidden="true"
                        />
                        <span className="block px-1 py-1 text-[0.625rem] text-muted-foreground">
                          {entry.label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {sliders.map(([key, label, min, max]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`filter-${key}`}>{label}</Label>
                    <span className="font-mono text-sm text-muted-foreground" data-numeric>
                      {adjustments[key]}
                    </span>
                  </div>
                  <Slider
                    id={`filter-${key}`}
                    min={min}
                    max={max}
                    step={1}
                    value={[adjustments[key]]}
                    onValueChange={([value]) =>
                      setAdjustments((current) => ({ ...current, [key]: value }))
                    }
                    aria-label={label}
                  />
                </div>
              ))}

              <Button variant="outline" size="sm" onClick={() => choose(filterId)}>
                <RotateCcw strokeWidth={1.75} />
                Reset to filter
              </Button>
            </section>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <DownloadButton
              blob={async () => {
                const canvas = exportRef.current;
                if (!canvas || !image) throw new Error("Nothing to export.");
                // Re-rendered at native size — the preview is scaled for screen.
                applyFilter(canvas, image, image.width, image.height, filter, adjustments);
                return canvasToPng(canvas);
              }}
              fileName="filtered.png"
              label="Download full resolution"
            />
            <Button
              variant="ghost"
              onClick={() => {
                setFiles([]);
                setImage(null);
              }}
            >
              Use a different photo
            </Button>
            <span className="text-sm text-muted-foreground" data-numeric>
              {formatNumber(image.width)} × {formatNumber(image.height)}
            </span>
          </div>
        </>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          These are approximations of familiar looks, built from canvas filter primitives and a
          colour wash — not the original lookup tables, which are proprietary. Your photo is decoded
          and filtered entirely in your browser; the export is re-rendered at native resolution
          rather than upscaled from the preview.
        </span>
      </p>

      <FieldHint>
        Adjusting any slider fine-tunes the selected filter. &ldquo;Reset to filter&rdquo; puts the
        preset&rsquo;s own values back.
      </FieldHint>
    </div>
  );
}
