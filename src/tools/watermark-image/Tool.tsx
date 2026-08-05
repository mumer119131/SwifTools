"use client";

import * as React from "react";
import { Stamp } from "lucide-react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ResultPanel } from "@/components/shared/ResultPanel";
import { ProgressBar } from "@/components/shared/Progress";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { ImageThumb } from "@/components/shared/ImageThumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { decodeImage, drawToCanvas, imageSize, releaseImage, type RasterFormat } from "@/lib/image";
import { formatBytes, formatNumber } from "@/lib/utils";
import {
  drawWatermark,
  watermarkImage,
  zipImages,
  type WatermarkedImage,
  type WatermarkOptions,
  type WatermarkPosition,
} from "./logic";

const positions: { value: WatermarkPosition; label: string }[] = [
  { value: "bottom-right", label: "Bottom right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "top-right", label: "Top right" },
  { value: "top-left", label: "Top left" },
  { value: "center", label: "Centre" },
  { value: "tile", label: "Tiled across" },
];

const PREVIEW_MAX = 520;

export default function WatermarkImageTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [text, setText] = React.useState("© Your Name");
  const [position, setPosition] = React.useState<WatermarkPosition>("bottom-right");
  const [sizePercent, setSizePercent] = React.useState(6);
  const [opacity, setOpacity] = React.useState(60);
  const [color, setColor] = React.useState<"white" | "black">("white");
  const [rotation, setRotation] = React.useState(0);
  const [format, setFormat] = React.useState<RasterFormat>("image/jpeg");
  const [results, setResults] = React.useState<WatermarkedImage[] | null>(null);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const previewRef = React.useRef<HTMLCanvasElement>(null);
  const busy = progress !== null;
  const file = files[0];

  const options: WatermarkOptions = React.useMemo(
    () => ({ text, position, sizePercent, opacity: opacity / 100, color, rotation, format }),
    [text, position, sizePercent, opacity, color, rotation, format],
  );

  // Live preview: the first image is redrawn at preview scale on every change.
  // Scaling down first keeps this cheap even for a 6000px photo.
  React.useEffect(() => {
    if (!file) return;
    let cancelled = false;

    (async () => {
      const source = await decodeImage(file);
      if (cancelled) {
        releaseImage(source);
        return;
      }

      const { width, height } = imageSize(source);
      const scale = Math.min(PREVIEW_MAX / width, PREVIEW_MAX / height, 1);
      const scaled = drawToCanvas(source, width * scale, height * scale, format);
      releaseImage(source);

      drawWatermark(scaled, options);

      const target = previewRef.current;
      if (!target || cancelled) return;
      target.width = scaled.width;
      target.height = scaled.height;
      target.getContext("2d")?.drawImage(scaled, 0, 0);
      scaled.width = 0;
      scaled.height = 0;
    })().catch(() => {
      if (!cancelled) setError("That image could not be previewed.");
    });

    return () => {
      cancelled = true;
    };
  }, [file, options, format]);

  React.useEffect(() => {
    return () => results?.forEach((image) => URL.revokeObjectURL(image.previewUrl));
  }, [results]);

  async function handleApply() {
    setError(null);
    setProgress(0);
    try {
      const output: WatermarkedImage[] = [];
      for (const [index, item] of files.entries()) {
        output.push(await watermarkImage(item, options));
        setProgress(((index + 1) / files.length) * 100);
      }
      setResults(output);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The watermark could not be applied.");
    } finally {
      setProgress(null);
    }
  }

  function reset() {
    results?.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setFiles([]);
    setResults(null);
    setError(null);
  }

  if (results) {
    const totalBytes = results.reduce((sum, image) => sum + image.byteSize, 0);
    const isBundle = results.length > 1;

    return (
      <ResultPanel
        title="Watermark applied"
        stats={[
          { label: "Images", value: formatNumber(results.length) },
          { label: "Total size", value: formatBytes(totalBytes) },
        ]}
        downloads={[
          isBundle
            ? {
                blob: () => zipImages(results),
                fileName: "watermarked-images.zip",
                label: "Download all as ZIP",
              }
            : { blob: results[0].blob, fileName: results[0].name, label: "Download image" },
        ]}
        onReset={reset}
        resetLabel="Watermark more"
      >
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {results.slice(0, 8).map((image) => (
            <li key={image.name} className="space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.previewUrl}
                alt=""
                aria-hidden="true"
                className="w-full rounded-md border border-border"
              />
              <DownloadButton
                blob={image.blob}
                fileName={image.name}
                label="Save"
                size="sm"
                variant="outline"
                className="w-full"
              />
            </li>
          ))}
        </ul>
      </ResultPanel>
    );
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="image/jpeg,image/png,image/webp,image/avif"
        acceptLabel="JPG, PNG, WEBP or AVIF images"
        multiple
        maxSizeMb={30}
        files={files}
        onFilesChange={(next) => {
          setFiles(next);
          setError(null);
        }}
        renderPreview={(item) => <ImageThumb file={item} />}
        disabled={busy}
      />

      {file ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="surface-card grid place-items-center overflow-hidden p-4">
            <canvas
              ref={previewRef}
              role="img"
              aria-label="Live watermark preview"
              className="max-h-[26rem] w-auto max-w-full rounded"
            />
          </div>

          <section className="surface-card space-y-5 p-5">
            <div className="space-y-2">
              <Label htmlFor="watermark-text">Watermark text</Label>
              <Input
                id="watermark-text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                maxLength={60}
                placeholder="© Your Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="watermark-position">Position</Label>
              <Select
                value={position}
                onValueChange={(value) => setPosition(value as WatermarkPosition)}
              >
                <SelectTrigger id="watermark-position">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((entry) => (
                    <SelectItem key={entry.value} value={entry.value}>
                      {entry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="watermark-size">Size</Label>
                <span className="font-mono text-sm text-muted-foreground" data-numeric>
                  {sizePercent}%
                </span>
              </div>
              <Slider
                id="watermark-size"
                min={2}
                max={20}
                step={1}
                value={[sizePercent]}
                onValueChange={([value]) => setSizePercent(value)}
                aria-label="Watermark size"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="watermark-opacity">Opacity</Label>
                <span className="font-mono text-sm text-muted-foreground" data-numeric>
                  {opacity}%
                </span>
              </div>
              <Slider
                id="watermark-opacity"
                min={10}
                max={100}
                step={5}
                value={[opacity]}
                onValueChange={([value]) => setOpacity(value)}
                aria-label="Watermark opacity"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="watermark-rotation">Rotation</Label>
                <span className="font-mono text-sm text-muted-foreground" data-numeric>
                  {rotation}°
                </span>
              </div>
              <Slider
                id="watermark-rotation"
                min={-90}
                max={90}
                step={5}
                value={[rotation]}
                onValueChange={([value]) => setRotation(value)}
                aria-label="Watermark rotation"
              />
              {position === "tile" ? (
                <FieldHint>Tiled watermarks default to −30° when rotation is 0.</FieldHint>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="watermark-color">Colour</Label>
                <Select
                  value={color}
                  onValueChange={(value) => setColor(value as "white" | "black")}
                >
                  <SelectTrigger id="watermark-color">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="watermark-format">Format</Label>
                <Select value={format} onValueChange={(value) => setFormat(value as RasterFormat)}>
                  <SelectTrigger id="watermark-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image/jpeg">JPG</SelectItem>
                    <SelectItem value="image/png">PNG</SelectItem>
                    <SelectItem value="image/webp">WEBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {busy ? <ProgressBar value={progress ?? 0} label="Applying watermark" /> : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button size="lg" disabled={files.length === 0 || !text.trim() || busy} onClick={handleApply}>
        <Stamp strokeWidth={1.75} />
        {busy ? "Applying…" : `Watermark ${files.length || ""} ${files.length === 1 ? "image" : "images"}`.replace(/\s+/g, " ")}
      </Button>
    </div>
  );
}
