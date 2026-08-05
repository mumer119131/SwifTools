"use client";

import * as React from "react";
import { Link2, Link2Off, Scaling } from "lucide-react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ResultPanel } from "@/components/shared/ResultPanel";
import { ProgressBar } from "@/components/shared/Progress";
import { ImageThumb } from "@/components/shared/ImageThumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatExtensions, formatLabels, type RasterFormat } from "@/lib/image";
import { baseName, formatBytes, formatNumber } from "@/lib/utils";
import { readDimensions, resizeImage, type ResizeResult } from "./logic";

const percentPresets = [25, 50, 75];

export default function ResizeImageTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [original, setOriginal] = React.useState<{ width: number; height: number } | null>(null);
  const [width, setWidth] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [lockRatio, setLockRatio] = React.useState(true);
  const [format, setFormat] = React.useState<RasterFormat>("image/jpeg");
  const [result, setResult] = React.useState<ResizeResult | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const file = files[0];

  React.useEffect(() => {
    if (!file) return;
    let cancelled = false;
    readDimensions(file)
      .then((size) => {
        if (cancelled) return;
        setOriginal(size);
        setWidth(String(size.width));
        setHeight(String(size.height));
        // Default the output format to the input's, when it is one we support.
        if (file.type === "image/png" || file.type === "image/webp") {
          setFormat(file.type);
        } else {
          setFormat("image/jpeg");
        }
      })
      .catch(() => {
        if (!cancelled) setError("That image could not be read.");
      });
    return () => {
      cancelled = true;
    };
  }, [file]);

  React.useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result.previewUrl);
    };
  }, [result]);

  const ratio = original ? original.width / original.height : 1;

  function handleWidthChange(value: string) {
    setWidth(value);
    if (lockRatio && original && value) {
      setHeight(String(Math.max(1, Math.round(Number(value) / ratio))));
    }
  }

  function handleHeightChange(value: string) {
    setHeight(value);
    if (lockRatio && original && value) {
      setWidth(String(Math.max(1, Math.round(Number(value) * ratio))));
    }
  }

  function applyPercent(percent: number) {
    if (!original) return;
    setWidth(String(Math.max(1, Math.round((original.width * percent) / 100))));
    setHeight(String(Math.max(1, Math.round((original.height * percent) / 100))));
  }

  async function handleResize() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      setResult(await resizeImage(file, Number(width), Number(height), format));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "That image could not be resized.");
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

  if (result && file) {
    return (
      <ResultPanel
        title="Image resized"
        stats={[
          {
            label: "From",
            value: original ? `${original.width}×${original.height}` : "—",
          },
          { label: "To", value: `${result.width}×${result.height}` },
          { label: "Size", value: formatBytes(result.byteSize) },
        ]}
        downloads={[
          {
            blob: result.blob,
            fileName: `${baseName(file.name)}-${result.width}x${result.height}.${formatExtensions[format]}`,
            label: "Download image",
          },
        ]}
        onReset={reset}
        resetLabel="Resize another"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={result.previewUrl}
          alt="Resized result"
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
          setOriginal(null);
          setError(null);
        }}
        renderPreview={(item) => <ImageThumb file={item} />}
        disabled={busy}
      />

      {file && original ? (
        <section className="surface-card space-y-5 p-5">
          <p className="text-sm text-muted-foreground">
            Original size:{" "}
            <span className="font-mono text-foreground" data-numeric>
              {formatNumber(original.width)} × {formatNumber(original.height)}
            </span>{" "}
            px
          </p>

          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-2">
              <Label htmlFor="resize-width">Width (px)</Label>
              <Input
                id="resize-width"
                type="number"
                min={1}
                value={width}
                onChange={(event) => handleWidthChange(event.target.value)}
                className="w-32"
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setLockRatio((locked) => !locked)}
              aria-pressed={lockRatio}
              aria-label={lockRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}
              className="mb-0.5"
            >
              {lockRatio ? <Link2 strokeWidth={1.75} /> : <Link2Off strokeWidth={1.75} />}
            </Button>

            <div className="space-y-2">
              <Label htmlFor="resize-height">Height (px)</Label>
              <Input
                id="resize-height"
                type="number"
                min={1}
                value={height}
                onChange={(event) => handleHeightChange(event.target.value)}
                className="w-32"
              />
            </div>
          </div>
          <FieldHint>
            {lockRatio
              ? "Aspect ratio is locked — changing one dimension updates the other."
              : "Aspect ratio is unlocked. The image will be stretched to fit."}
          </FieldHint>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Scale to:</span>
            {percentPresets.map((percent) => (
              <Button
                key={percent}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyPercent(percent)}
              >
                {percent}%
              </Button>
            ))}
          </div>

          <div className="max-w-xs space-y-2">
            <Label htmlFor="resize-format">Output format</Label>
            <Select value={format} onValueChange={(value) => setFormat(value as RasterFormat)}>
              <SelectTrigger id="resize-format">
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
        </section>
      ) : null}

      {busy ? <ProgressBar label="Resizing image" /> : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button size="lg" disabled={!file || !width || !height || busy} onClick={handleResize}>
        <Scaling strokeWidth={1.75} />
        {busy ? "Resizing…" : "Resize image"}
      </Button>
    </div>
  );
}
