"use client";

import * as React from "react";
import { AlertTriangle, Info, Trash2, Undo2 } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { decodeImage, imageSize } from "@/lib/image";
import { baseName, cn } from "@/lib/utils";
import {
  MODE_LABELS, STRENGTH, blur, block, pixelate, regionFromDrag, toPixels,
  type Mode, type Region,
} from "./logic";

export default function RedactImageTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [mode, setMode] = React.useState<Mode>("pixelate");
  const [strength, setStrength] = React.useState(24);
  const [regions, setRegions] = React.useState<Region[]>([]);
  // Only ever set from the async render. The displayed image is derived below,
  // so the "no regions yet" case needs no state write at all.
  const [rendered, setRendered] = React.useState<{ url: string; blob: Blob } | null>(null);
  const [source, setSource] = React.useState<{ url: string; width: number; height: number } | null>(null);
  const [drag, setDrag] = React.useState<Region | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const pixelsRef = React.useRef<ImageData | null>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);

  const file = files[0];

  async function load(next: File[]) {
    setFiles(next);
    setRegions([]);
    setRendered(null);
    setSource(null);
    setError(null);
    pixelsRef.current = null;

    const incoming = next[0];
    if (!incoming) return;

    try {
      const decoded = await decodeImage(incoming);
      const { width, height } = imageSize(decoded);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("no canvas");

      context.drawImage(decoded, 0, 0);
      pixelsRef.current = context.getImageData(0, 0, width, height);
      setSource({ url: canvas.toDataURL("image/png"), width, height });
      if ("close" in decoded) decoded.close();
    } catch {
      setError("That image could not be read.");
    }
  }

  /* Re-render whenever the regions or settings change. */
  React.useEffect(() => {
    const original = pixelsRef.current;
    if (!original || !source || regions.length === 0) return;

    let cancelled = false;
    let url: string | null = null;

    async function render() {
      // Work from a copy, so removing a region genuinely restores the pixels
      // rather than compounding edits.
      const data = new Uint8ClampedArray(original!.data);

      for (const region of regions) {
        const area = toPixels(region, source!.width, source!.height);
        if (area.width < 1 || area.height < 1) continue;

        if (mode === "pixelate") pixelate(data, source!.width, area, strength);
        else if (mode === "blur") blur(data, source!.width, source!.height, area, Math.max(1, strength / 6));
        else block(data, source!.width, area, { r: 0, g: 0, b: 0 });
      }

      const canvas = document.createElement("canvas");
      canvas.width = source!.width;
      canvas.height = source!.height;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.putImageData(new ImageData(data, source!.width, source!.height), 0, 0);

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob || cancelled) return;

      url = URL.createObjectURL(blob);
      setRendered({ url, blob });
    }

    void render();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [regions, mode, strength, source]);

  function relative(event: React.PointerEvent): { x: number; y: number } | null {
    const box = boxRef.current;
    if (!box) return null;
    const rect = box.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  }

  const startRef = React.useRef<{ x: number; y: number } | null>(null);

  function down(event: React.PointerEvent) {
    const point = relative(event);
    if (!point) return;
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
    startRef.current = point;
    setDrag(regionFromDrag(point.x, point.y, point.x, point.y, "drag"));
  }

  function move(event: React.PointerEvent) {
    const start = startRef.current;
    const point = relative(event);
    if (!start || !point) return;
    setDrag(regionFromDrag(start.x, start.y, point.x, point.y, "drag"));
  }

  function up() {
    const current = drag;
    startRef.current = null;
    setDrag(null);
    // Ignore a stray click; a region has to be big enough to be intentional.
    if (current && current.width > 0.01 && current.height > 0.01) {
      setRegions((list) => [...list, { ...current, id: `r-${Date.now()}` }]);
    }
  }

  const info = STRENGTH[mode];
  // Derived rather than stored: with no regions the original is the preview.
  const shown = regions.length === 0 ? source?.url : (rendered?.url ?? source?.url);

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="image/*"
        acceptLabel="A photo or screenshot — redacted in your browser, never uploaded"
        multiple={false}
        files={files}
        onFilesChange={(next) => void load(next)}
      />

      {error ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      {source ? (
        <>
          <div className="flex flex-wrap items-end gap-4">
            <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <TabsList>
                {(Object.keys(MODE_LABELS) as Mode[]).map((key) => (
                  <TabsTrigger key={key} value={key}>
                    {MODE_LABELS[key]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {mode !== "block" ? (
              <div className="min-w-48 flex-1 space-y-1.5">
                <Label htmlFor="strength">
                  {mode === "pixelate" ? `Block size — ${strength}px` : `Blur radius — ${Math.round(strength / 6)}`}
                </Label>
                <Slider
                  id="strength"
                  min={6}
                  max={80}
                  step={2}
                  value={[strength]}
                  onValueChange={([value]) => setStrength(value)}
                />
              </div>
            ) : null}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRegions((list) => list.slice(0, -1))}
              disabled={regions.length === 0}
            >
              <Undo2 strokeWidth={1.75} />
              Undo
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setRegions([])} disabled={regions.length === 0}>
              <Trash2 strokeWidth={1.75} />
              Clear
            </Button>
          </div>

          <p
            className={cn(
              "flex items-start gap-2 rounded-md border px-4 py-3 text-sm",
              info.safe
                ? "border-border bg-surface text-muted-foreground"
                : "border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] text-foreground",
            )}
          >
            <AlertTriangle
              className={cn("mt-0.5 size-4 shrink-0", info.safe ? "text-muted-foreground" : "text-[var(--warning)]")}
              strokeWidth={1.75}
            />
            <span>
              <span className="text-foreground">{info.label}.</span> {info.note}
            </span>
          </p>

          <div
            ref={boxRef}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerLeave={up}
            className="surface-card relative touch-none select-none overflow-hidden"
            style={{ cursor: "crosshair" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shown ?? source.url}
              alt="Drag over anything you want obscured"
              className="pointer-events-none w-full"
              draggable={false}
            />
            {drag ? (
              <div
                className="pointer-events-none absolute border-2 border-dashed border-[var(--accent-image)] bg-[color-mix(in_oklab,var(--accent-image)_20%,transparent)]"
                style={{
                  left: `${drag.x * 100}%`,
                  top: `${drag.y * 100}%`,
                  width: `${drag.width * 100}%`,
                  height: `${drag.height * 100}%`,
                }}
              />
            ) : null}
          </div>

          <p className="text-sm text-muted-foreground">
            Drag over anything you want obscured. {regions.length}{" "}
            {regions.length === 1 ? "area" : "areas"} redacted.
          </p>

          {regions.length > 0 && rendered ? (
            <DownloadButton
              blob={() => rendered.blob}
              fileName={`${baseName(file?.name ?? "image")}-redacted.png`}
              label="Download redacted image"
            />
          ) : null}
        </>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The pixels are read, replaced and written back — the originals are gone
          from the download rather than hidden behind something drawn on top,
          which is the mistake that has exposed redacted documents repeatedly.
          Saved as PNG, because a lossy format could in principle leave traces of
          what was there. And it all happens in your browser: uploading an image
          in order to hide something in it rather defeats the purpose.
        </span>
      </p>
    </div>
  );
}
