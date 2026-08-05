"use client";

import * as React from "react";
import { Crop } from "lucide-react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ResultPanel } from "@/components/shared/ResultPanel";
import { ProgressBar } from "@/components/shared/Progress";
import { Button } from "@/components/ui/button";
import { FieldHint, Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatExtensions, formatLabels, type RasterFormat } from "@/lib/image";
import { baseName, clamp, cn, formatBytes } from "@/lib/utils";
import {
  aspectRatios,
  cropImage,
  normaliseRect,
  type AspectRatioKey,
  type CropRect,
  type CropResult,
} from "./logic";

type Handle = "nw" | "ne" | "sw" | "se" | "move";

const handles: { id: Handle; className: string; label: string }[] = [
  { id: "nw", className: "left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize", label: "top left" },
  { id: "ne", className: "right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize", label: "top right" },
  { id: "sw", className: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize", label: "bottom left" },
  { id: "se", className: "bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize", label: "bottom right" },
];

export default function CropImageTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [natural, setNatural] = React.useState<{ width: number; height: number } | null>(null);
  const [rect, setRect] = React.useState<CropRect>({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
  const [ratioKey, setRatioKey] = React.useState<AspectRatioKey>("free");
  const [format, setFormat] = React.useState<RasterFormat>("image/jpeg");
  const [result, setResult] = React.useState<CropResult | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const frameRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<{ handle: Handle; startRect: CropRect; startX: number; startY: number } | null>(null);

  const file = files[0];
  const ratio = aspectRatios.find((entry) => entry.key === ratioKey)?.value ?? null;

  const imageUrl = React.useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  React.useEffect(() => {
    if (!imageUrl) return;
    return () => URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  React.useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result.previewUrl);
    };
  }, [result]);

  /**
   * Re-fits the selection to a fixed ratio.
   *
   * The frame's own aspect differs from the image's, so the ratio has to be
   * expressed in frame-relative terms before it can be applied to a normalised
   * rectangle. Width leads and height follows.
   */
  function applyRatio(key: AspectRatioKey) {
    setRatioKey(key);

    const nextRatio = aspectRatios.find((entry) => entry.key === key)?.value ?? null;
    if (nextRatio === null || !natural) return;

    const displayRatio = nextRatio / (natural.width / natural.height);
    const height = Math.min(rect.width / displayRatio, 1);
    setRect(normaliseRect({ ...rect, width: height * displayRatio, height }));
  }

  function pointerPosition(event: React.PointerEvent | PointerEvent) {
    const frame = frameRef.current;
    if (!frame) return { x: 0, y: 0 };
    const bounds = frame.getBoundingClientRect();
    return {
      x: (event.clientX - bounds.left) / bounds.width,
      y: (event.clientY - bounds.top) / bounds.height,
    };
  }

  function startDrag(event: React.PointerEvent, handle: Handle) {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    const position = pointerPosition(event);
    dragRef.current = { handle, startRect: rect, startX: position.x, startY: position.y };
  }

  function onDrag(event: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag || !natural) return;

    const position = pointerPosition(event);
    const dx = position.x - drag.startX;
    const dy = position.y - drag.startY;
    const start = drag.startRect;

    if (drag.handle === "move") {
      setRect(normaliseRect({ ...start, x: start.x + dx, y: start.y + dy }));
      return;
    }

    let { x, y, width, height } = start;

    if (drag.handle === "se") {
      width = start.width + dx;
      height = start.height + dy;
    } else if (drag.handle === "sw") {
      x = start.x + dx;
      width = start.width - dx;
      height = start.height + dy;
    } else if (drag.handle === "ne") {
      y = start.y + dy;
      width = start.width + dx;
      height = start.height - dy;
    } else {
      x = start.x + dx;
      y = start.y + dy;
      width = start.width - dx;
      height = start.height - dy;
    }

    if (ratio !== null) {
      // Width leads; height follows so the on-screen box matches the ratio
      // even though the frame's own aspect differs from the image's.
      const displayRatio = ratio / (natural.width / natural.height);
      height = Math.max(0.02, width / displayRatio);
      if (drag.handle === "ne" || drag.handle === "nw") y = start.y + start.height - height;
    }

    if (width < 0.02) width = 0.02;
    if (height < 0.02) height = 0.02;

    setRect(normaliseRect({ x: clamp(x, 0, 0.98), y: clamp(y, 0, 0.98), width, height }));
  }

  function endDrag() {
    dragRef.current = null;
  }

  /** Keyboard equivalent for the drag interaction — 1% per press. */
  function nudge(event: React.KeyboardEvent) {
    const step = event.shiftKey ? 0.05 : 0.01;
    const moves: Record<string, Partial<CropRect>> = {
      ArrowLeft: { x: rect.x - step },
      ArrowRight: { x: rect.x + step },
      ArrowUp: { y: rect.y - step },
      ArrowDown: { y: rect.y + step },
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    setRect(normaliseRect({ ...rect, ...move }));
  }

  async function handleCrop() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      setResult(await cropImage(file, rect, format));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "That image could not be cropped.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    if (result) URL.revokeObjectURL(result.previewUrl);
    setFiles([]);
    setResult(null);
    setError(null);
  }

  const cropPixels = natural
    ? {
        width: Math.round(rect.width * natural.width),
        height: Math.round(rect.height * natural.height),
      }
    : null;

  if (result && file) {
    return (
      <ResultPanel
        title="Image cropped"
        stats={[
          { label: "Width", value: `${result.width} px` },
          { label: "Height", value: `${result.height} px` },
          { label: "Size", value: formatBytes(result.byteSize) },
        ]}
        downloads={[
          {
            blob: result.blob,
            fileName: `${baseName(file.name)}-cropped.${formatExtensions[format]}`,
            label: "Download cropped image",
          },
        ]}
        onReset={reset}
        resetLabel="Crop another"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={result.previewUrl}
          alt="Cropped result"
          className="max-h-72 w-auto rounded-md border border-border"
        />
      </ResultPanel>
    );
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="image/jpeg,image/png,image/webp,image/avif"
        acceptLabel="a JPG, PNG, WEBP or AVIF image"
        maxSizeMb={30}
        files={files}
        onFilesChange={(next) => {
          setFiles(next);
          setNatural(null);
          setRect({ x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
          setFormat(next[0]?.type === "image/png" ? "image/png" : "image/jpeg");
          setError(null);
        }}
        disabled={busy}
      />

      {file && imageUrl ? (
        <>
          <div
            ref={frameRef}
            className="relative mx-auto w-fit max-w-full touch-none select-none overflow-hidden rounded-lg border border-border bg-surface"
            onPointerMove={onDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Crop preview"
              draggable={false}
              onLoad={(event) => {
                const target = event.currentTarget;
                setNatural({ width: target.naturalWidth, height: target.naturalHeight });
              }}
              className="block max-h-[28rem] w-auto max-w-full"
            />

            {/* Dim everything outside the selection. */}
            <div
              className="pointer-events-none absolute inset-0 bg-black/55"
              style={{
                clipPath: `polygon(0% 0%, 0% 100%, ${rect.x * 100}% 100%, ${rect.x * 100}% ${rect.y * 100}%, ${(rect.x + rect.width) * 100}% ${rect.y * 100}%, ${(rect.x + rect.width) * 100}% ${(rect.y + rect.height) * 100}%, ${rect.x * 100}% ${(rect.y + rect.height) * 100}%, ${rect.x * 100}% 100%, 100% 100%, 100% 0%)`,
              }}
              aria-hidden="true"
            />

            <div
              role="group"
              aria-label="Crop selection — drag to move, or use the arrow keys"
              tabIndex={0}
              onKeyDown={nudge}
              onPointerDown={(event) => startDrag(event, "move")}
              className="absolute cursor-move outline-2 outline-white focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
              style={{
                left: `${rect.x * 100}%`,
                top: `${rect.y * 100}%`,
                width: `${rect.width * 100}%`,
                height: `${rect.height * 100}%`,
              }}
            >
              {/* Rule-of-thirds guides. */}
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute left-1/3 top-0 h-full w-px bg-white/30" />
                <div className="absolute left-2/3 top-0 h-full w-px bg-white/30" />
                <div className="absolute left-0 top-1/3 h-px w-full bg-white/30" />
                <div className="absolute left-0 top-2/3 h-px w-full bg-white/30" />
              </div>

              {handles.map((handle) => (
                <button
                  key={handle.id}
                  type="button"
                  aria-label={`Resize from ${handle.label}`}
                  onPointerDown={(event) => startDrag(event, handle.id)}
                  className={cn(
                    "absolute size-4 rounded-sm border-2 border-white bg-black/50",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                    handle.className,
                  )}
                />
              ))}
            </div>
          </div>

          <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="aspect-ratio">Aspect ratio</Label>
              <Select
                value={ratioKey}
                onValueChange={(value) => applyRatio(value as AspectRatioKey)}
              >
                <SelectTrigger id="aspect-ratio">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aspectRatios.map((entry) => (
                    <SelectItem key={entry.key} value={entry.key}>
                      {entry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="crop-format">Output format</Label>
              <Select value={format} onValueChange={(value) => setFormat(value as RasterFormat)}>
                <SelectTrigger id="crop-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(formatLabels) as RasterFormat[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {formatLabels[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FieldHint className="sm:col-span-2">
              {cropPixels ? (
                <>
                  Output:{" "}
                  <span className="font-mono text-foreground" data-numeric>
                    {cropPixels.width} × {cropPixels.height}
                  </span>{" "}
                  px. Drag the box or focus it and use the arrow keys.
                </>
              ) : (
                "Drag the box or focus it and use the arrow keys."
              )}
            </FieldHint>
          </div>
        </>
      ) : null}

      {busy ? <ProgressBar label="Cropping image" /> : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button size="lg" disabled={!file || busy} onClick={handleCrop}>
        <Crop strokeWidth={1.75} />
        {busy ? "Cropping…" : "Crop image"}
      </Button>
    </div>
  );
}
