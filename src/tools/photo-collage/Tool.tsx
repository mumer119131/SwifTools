"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { decodeImage, imageSize } from "@/lib/image";
import { cn } from "@/lib/utils";
import { PRESETS, coverCrop, emptyCells, gridLayout, rowsFor, suggestColumns } from "./logic";

export default function PhotoCollageTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [preset, setPreset] = React.useState(0);
  const [columns, setColumns] = React.useState(2);
  const [gap, setGap] = React.useState(16);
  const [background, setBackground] = React.useState("#ffffff");
  const [preview, setPreview] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const blobRef = React.useRef<Blob | null>(null);

  const size = PRESETS[preset];

  function load(next: File[]) {
    setFiles(next);
    setError(null);
    setPreview(null);
    if (next.length > 0) setColumns(suggestColumns(next.length));
  }

  React.useEffect(() => {
    if (files.length === 0) return;

    let cancelled = false;
    let url: string | null = null;

    async function render() {
      setBusy(true);
      try {
        const canvas = document.createElement("canvas");
        canvas.width = size.width;
        canvas.height = size.height;

        const context = canvas.getContext("2d");
        if (!context) throw new Error("no canvas");

        context.fillStyle = background;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingQuality = "high";

        const cells = gridLayout({
          count: files.length,
          width: size.width,
          height: size.height,
          columns,
          gap,
        });

        for (let i = 0; i < cells.length; i += 1) {
          const cell = cells[i];
          const source = await decodeImage(files[i]);
          const { width, height } = imageSize(source);
          const crop = coverCrop(width, height, cell.width, cell.height);

          context.drawImage(
            source,
            crop.x, crop.y, crop.width, crop.height,
            cell.x, cell.y, cell.width, cell.height,
          );
          if ("close" in source) source.close();
        }

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", 0.92),
        );
        if (!blob) throw new Error("encode failed");
        if (cancelled) return;

        blobRef.current = blob;
        url = URL.createObjectURL(blob);
        setPreview(url);
      } catch {
        if (!cancelled) setError("Those images could not be laid out.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    }

    void render();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [files, columns, gap, background, size]);

  const empty = emptyCells(files.length, columns);

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="image/*"
        acceptLabel="Several photos — laid out in the order you add them"
        multiple
        files={files}
        onFilesChange={load}
      />

      {error ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      {files.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((entry, index) => (
              <button
                key={entry.label}
                type="button"
                onClick={() => setPreset(index)}
                title={entry.note}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm transition-colors",
                  preset === index
                    ? "border-border-strong text-foreground"
                    : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
                )}
              >
                {entry.label}
              </button>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="columns">
                Columns — {columns} × {rowsFor(files.length, columns)} rows
              </Label>
              <Slider
                id="columns"
                min={1}
                max={Math.min(6, files.length)}
                step={1}
                value={[columns]}
                onValueChange={([value]) => setColumns(value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gap">Gap — {gap}px</Label>
              <Slider
                id="gap"
                min={0}
                max={80}
                step={4}
                value={[gap]}
                onValueChange={([value]) => setGap(value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bg">Background</Label>
              <Input
                id="bg"
                type="color"
                value={background}
                onChange={(event) => setBackground(event.target.value)}
                className="h-10 w-full cursor-pointer p-1"
              />
            </div>
          </div>

          {empty > 0 ? (
            <p className="text-sm text-muted-foreground">
              {empty} {empty === 1 ? "cell" : "cells"} will be left empty in the last
              row. Cells are kept the same size rather than stretched — a final
              row twice as tall reads as a mistake.
            </p>
          ) : null}

          {preview ? (
            <figure className="surface-card overflow-hidden">
              <div className="grid place-items-center bg-surface-hover p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="The collage" className="max-h-[32rem] w-auto max-w-full shadow-lg" />
              </div>
              <figcaption className="flex flex-wrap items-center gap-3 border-t border-border px-5 py-3 text-sm text-muted-foreground">
                <span data-numeric>
                  {size.width} × {size.height} · {files.length} photos
                </span>
                <span className="ml-auto">
                  <DownloadButton
                    blob={() => blobRef.current ?? new Blob()}
                    fileName="collage.jpg"
                    label="Download"
                  />
                </span>
              </figcaption>
            </figure>
          ) : busy ? (
            <p className="text-sm text-muted-foreground">Laying it out…</p>
          ) : null}
        </>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Each photo is cropped to fill its cell rather than squashed into it, so
          nothing is distorted — the trade is that the edges of a photo whose
          shape differs from the cell get trimmed. Everything is drawn in your
          browser and nothing is uploaded.
        </span>
      </p>
    </div>
  );
}
