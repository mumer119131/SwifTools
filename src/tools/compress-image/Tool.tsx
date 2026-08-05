"use client";

import * as React from "react";
import { ImageDown } from "lucide-react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ResultPanel } from "@/components/shared/ResultPanel";
import { ProgressBar } from "@/components/shared/Progress";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { ImageThumb } from "@/components/shared/ImageThumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatLabels, type RasterFormat } from "@/lib/image";
import { formatBytes, formatDelta } from "@/lib/utils";
import {
  compressImage,
  zipImages,
  type CompressedImage,
  type CompressMode,
} from "./logic";

export default function CompressImageTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [mode, setMode] = React.useState<CompressMode>("quality");
  const [quality, setQuality] = React.useState(75);
  const [targetKb, setTargetKb] = React.useState(200);
  const [maxDimension, setMaxDimension] = React.useState("0");
  const [format, setFormat] = React.useState<RasterFormat>("image/jpeg");
  const [results, setResults] = React.useState<CompressedImage[] | null>(null);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const busy = progress !== null;

  React.useEffect(() => {
    return () => results?.forEach((image) => URL.revokeObjectURL(image.previewUrl));
  }, [results]);

  async function handleCompress() {
    setError(null);
    setProgress(0);
    try {
      const output: CompressedImage[] = [];
      for (const [index, file] of files.entries()) {
        output.push(
          await compressImage(file, {
            mode,
            quality: quality / 100,
            targetKb,
            maxDimension: Number(maxDimension),
            format,
          }),
        );
        setProgress(((index + 1) / files.length) * 100);
      }
      setResults(output);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Those images could not be compressed.");
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
    const originalTotal = results.reduce((sum, image) => sum + image.originalSize, 0);
    const compressedTotal = results.reduce((sum, image) => sum + image.compressedSize, 0);
    const isBundle = results.length > 1;

    return (
      <ResultPanel
        title={`${results.length} ${results.length === 1 ? "image" : "images"} compressed`}
        stats={[
          { label: "Original", value: formatBytes(originalTotal) },
          { label: "Compressed", value: formatBytes(compressedTotal) },
          { label: "Saved", value: formatDelta(originalTotal, compressedTotal) },
        ]}
        downloads={[
          isBundle
            ? {
                blob: () => zipImages(results),
                fileName: "compressed-images.zip",
                label: "Download all as ZIP",
              }
            : { blob: results[0].blob, fileName: results[0].name, label: "Download image" },
        ]}
        onReset={reset}
        resetLabel="Compress more"
      >
        <ul className="space-y-3">
          {results.map((image) => (
            <li key={image.name} className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.previewUrl}
                alt=""
                aria-hidden="true"
                className="size-11 shrink-0 rounded border border-border object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{image.name}</p>
                <p className="text-xs text-muted-foreground" data-numeric>
                  {formatBytes(image.originalSize)} → {formatBytes(image.compressedSize)}{" "}
                  <span className={image.keptOriginal ? "" : "text-success"}>
                    {image.keptOriginal
                      ? "(already optimal — original kept)"
                      : formatDelta(image.originalSize, image.compressedSize)}
                  </span>
                </p>
              </div>
              <DownloadButton
                blob={image.blob}
                fileName={image.name}
                label=""
                size="icon"
                variant="ghost"
                className="size-9 shrink-0"
                aria-label={`Download ${image.name}`}
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
        renderPreview={(file) => <ImageThumb file={file} />}
        disabled={busy}
      />

      {files.length > 0 ? (
        <section className="surface-card space-y-5 p-5">
          <Tabs value={mode} onValueChange={(value) => setMode(value as CompressMode)}>
            <TabsList>
              <TabsTrigger value="quality">By quality</TabsTrigger>
              <TabsTrigger value="target-size">By target size</TabsTrigger>
            </TabsList>
          </Tabs>

          {mode === "quality" ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="quality">Quality</Label>
                <span className="font-mono text-sm text-muted-foreground" data-numeric>
                  {quality}%
                </span>
              </div>
              <Slider
                id="quality"
                min={10}
                max={95}
                step={5}
                value={[quality]}
                onValueChange={([value]) => setQuality(value)}
                aria-label="Compression quality"
              />
              <FieldHint>
                75% is the sweet spot for photos. Below 50% artefacts become visible.
              </FieldHint>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="target-size">Target size (KB)</Label>
              <Input
                id="target-size"
                type="number"
                min={10}
                max={10000}
                value={targetKb}
                onChange={(event) => setTargetKb(Math.max(10, Number(event.target.value) || 10))}
                className="max-w-40"
                aria-describedby="target-size-hint"
              />
              <FieldHint id="target-size-hint">
                Quality is searched automatically to land just under this size.
              </FieldHint>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="output-format">Output format</Label>
              <Select value={format} onValueChange={(value) => setFormat(value as RasterFormat)}>
                <SelectTrigger id="output-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image/jpeg">{formatLabels["image/jpeg"]} — universal</SelectItem>
                  <SelectItem value="image/webp">{formatLabels["image/webp"]} — smallest</SelectItem>
                  <SelectItem value="image/png">{formatLabels["image/png"]} — lossless</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-dimension">Resize longest edge</Label>
              <Select value={maxDimension} onValueChange={setMaxDimension}>
                <SelectTrigger id="max-dimension">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Keep original size</SelectItem>
                  <SelectItem value="2560">2560 px — large</SelectItem>
                  <SelectItem value="1920">1920 px — full HD</SelectItem>
                  <SelectItem value="1280">1280 px — web</SelectItem>
                  <SelectItem value="640">640 px — thumbnail</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
      ) : null}

      {busy ? <ProgressBar value={progress ?? 0} label="Compressing images" /> : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button size="lg" disabled={files.length === 0 || busy} onClick={handleCompress}>
        <ImageDown strokeWidth={1.75} />
        {busy ? "Compressing…" : "Compress images"}
      </Button>
    </div>
  );
}
