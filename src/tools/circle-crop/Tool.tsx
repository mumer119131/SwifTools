"use client";

import * as React from "react";
import { AlertTriangle, Info } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { decodeImage, formatExtensions, formatLabels, imageSize, type RasterFormat } from "@/lib/image";
import { baseName, cn } from "@/lib/utils";
import { SHAPE_LABELS, SIZE_PRESETS, cornerRadius, needsBackground, squareRegion, type Shape } from "./logic";

export default function CircleCropTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [shape, setShape] = React.useState<Shape>("circle");
  const [size, setSize] = React.useState(400);
  const [offsetX, setOffsetX] = React.useState(0.5);
  const [offsetY, setOffsetY] = React.useState(0.4);
  const [format, setFormat] = React.useState<RasterFormat>("image/png");
  const [background, setBackground] = React.useState("#ffffff");
  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const blobRef = React.useRef<Blob | null>(null);

  const file = files[0];
  const fillCorners = needsBackground(shape, format);

  React.useEffect(() => {
    if (!file) return;

    let cancelled = false;
    let url: string | null = null;

    async function render() {
      try {
        const source = await decodeImage(file);
        const { width, height } = imageSize(source);
        const region = squareRegion(width, height, offsetX, offsetY);

        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const context = canvas.getContext("2d");
        if (!context) throw new Error("no canvas");

        // JPEG has no alpha, so the corners a circle leaves must be filled or
        // they come out black rather than the white people expect.
        if (fillCorners) {
          context.fillStyle = background;
          context.fillRect(0, 0, size, size);
        }

        if (shape !== "square") {
          const radius = cornerRadius(size, shape);
          context.beginPath();
          if (shape === "circle") {
            context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          } else {
            context.roundRect(0, 0, size, size, radius);
          }
          context.closePath();
          context.clip();
        }

        context.imageSmoothingQuality = "high";
        context.drawImage(source, region.x, region.y, region.size, region.size, 0, 0, size, size);
        if ("close" in source) source.close();

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, format, 0.95),
        );
        if (!blob) throw new Error("encode failed");
        if (cancelled) return;

        blobRef.current = blob;
        url = URL.createObjectURL(blob);
        setPreview(url);
        setError(null);
      } catch {
        if (!cancelled) setError("That image could not be cropped.");
      }
    }

    void render();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [file, shape, size, offsetX, offsetY, format, background, fillCorners]);

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="image/*"
        acceptLabel="A photo — cropped in your browser, never uploaded"
        multiple={false}
        files={files}
        onFilesChange={(next) => {
          setFiles(next);
          setPreview(null);
          setError(null);
        }}
      />

      {error ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      {file ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
          <div>
            {preview ? (
              <figure className="surface-card grid place-items-center bg-surface-hover p-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="The cropped result"
                  className="max-h-80 w-auto max-w-full shadow-lg"
                />
              </figure>
            ) : (
              <div className="surface-card grid h-64 place-items-center text-sm text-muted-foreground">
                Rendering…
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Tabs value={shape} onValueChange={(v) => setShape(v as Shape)}>
              <TabsList className="w-full">
                {(Object.keys(SHAPE_LABELS) as Shape[]).map((key) => (
                  <TabsTrigger key={key} value={key} className="flex-1">
                    {SHAPE_LABELS[key]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="space-y-1.5">
              <Label htmlFor="size">Output size — {size}px</Label>
              <div className="flex flex-wrap gap-2">
                {SIZE_PRESETS.map((entry) => (
                  <button
                    key={entry.value}
                    type="button"
                    onClick={() => setSize(entry.value)}
                    title={entry.note}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition-colors",
                      size === entry.value
                        ? "border-border-strong text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ox">Horizontal position</Label>
              <Slider id="ox" min={0} max={100} step={1} value={[offsetX * 100]}
                onValueChange={([v]) => setOffsetX(v / 100)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="oy">Vertical position</Label>
              <Slider id="oy" min={0} max={100} step={1} value={[offsetY * 100]}
                onValueChange={([v]) => setOffsetY(v / 100)} />
              <p className="text-xs text-muted-foreground">
                Defaults slightly above centre — faces usually sit high in a
                portrait.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="format">Save as</Label>
              <Select value={format} onValueChange={(v) => setFormat(v as RasterFormat)}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(formatLabels) as RasterFormat[]).map((value) => (
                    <SelectItem key={value} value={value}>
                      {formatLabels[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {fillCorners ? (
              <>
                <p className="flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-3 py-2 text-xs text-foreground">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
                  JPEG cannot hold transparency, so the corners need a colour.
                  Choose PNG to keep them see-through.
                </p>
                <div className="space-y-1.5">
                  <Label htmlFor="bg">Corner colour</Label>
                  <Input id="bg" type="color" value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="h-10 w-full cursor-pointer p-1" />
                </div>
              </>
            ) : null}

            <DownloadButton
              blob={() => blobRef.current ?? new Blob()}
              fileName={`${baseName(file.name)}-${shape}.${formatExtensions[format]}`}
              label="Download"
              className="w-full"
            />
          </div>
        </div>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          A circular crop has to start from a square, so a rectangular photo
          loses its long edges — the position sliders decide which part survives.
          Save as PNG for genuinely transparent corners; JPEG will fill them,
          which is fine on a background of a known colour and obvious on anything
          else.
        </span>
      </p>
    </div>
  );
}
