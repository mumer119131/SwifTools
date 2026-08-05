"use client";

import * as React from "react";
import { Info, Replace } from "lucide-react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ResultPanel } from "@/components/shared/ResultPanel";
import { ProgressBar } from "@/components/shared/Progress";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { ImageThumb } from "@/components/shared/ImageThumb";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatLabels, type RasterFormat } from "@/lib/image";
import { formatBytes, formatNumber } from "@/lib/utils";
import { convertImage, zipImages, type ConvertedImage } from "./logic";

export default function ConvertImageTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [format, setFormat] = React.useState<RasterFormat>("image/png");
  const [results, setResults] = React.useState<ConvertedImage[] | null>(null);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const busy = progress !== null;

  React.useEffect(() => {
    return () => results?.forEach((image) => URL.revokeObjectURL(image.previewUrl));
  }, [results]);

  async function handleConvert() {
    setError(null);
    setProgress(0);
    try {
      const output: ConvertedImage[] = [];
      for (const [index, file] of files.entries()) {
        output.push(await convertImage(file, format));
        setProgress(((index + 1) / files.length) * 100);
      }
      setResults(output);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Those images could not be converted.");
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
    const totalBytes = results.reduce((sum, image) => sum + image.convertedSize, 0);
    const anyFlattened = results.some((image) => image.flattened);
    const isBundle = results.length > 1;

    return (
      <ResultPanel
        title={`Converted to ${formatLabels[format]}`}
        stats={[
          { label: "Images", value: formatNumber(results.length) },
          { label: "Format", value: formatLabels[format] },
          { label: "Total size", value: formatBytes(totalBytes) },
        ]}
        downloads={[
          isBundle
            ? {
                blob: () => zipImages(results),
                fileName: `converted-${formatLabels[format].toLowerCase()}.zip`,
                label: "Download all as ZIP",
              }
            : { blob: results[0].blob, fileName: results[0].name, label: "Download image" },
        ]}
        onReset={reset}
        resetLabel="Convert more"
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
                  {image.width}×{image.height} · {formatBytes(image.convertedSize)}
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

        {anyFlattened ? (
          <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
            <span>
              JPG has no alpha channel, so transparent areas were flattened onto white. Use PNG or
              WEBP to keep transparency.
            </span>
          </p>
        ) : null}
      </ResultPanel>
    );
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
        acceptLabel="JPG, PNG, WEBP, AVIF or SVG images"
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
        <div className="surface-card max-w-xs space-y-2 p-5">
          <Label htmlFor="target-format">Convert to</Label>
          <Select value={format} onValueChange={(value) => setFormat(value as RasterFormat)}>
            <SelectTrigger id="target-format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image/png">PNG — lossless, keeps transparency</SelectItem>
              <SelectItem value="image/jpeg">JPG — smallest for photos</SelectItem>
              <SelectItem value="image/webp">WEBP — small and keeps transparency</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          SVG files can be converted <em>to</em> raster formats. Converting a photo back{" "}
          <em>to</em> SVG would mean tracing it into vector shapes, which produces a rough
          approximation rather than a conversion — so it isn&rsquo;t offered here.
        </span>
      </p>

      {busy ? <ProgressBar value={progress ?? 0} label="Converting images" /> : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button size="lg" disabled={files.length === 0 || busy} onClick={handleConvert}>
        <Replace strokeWidth={1.75} />
        {busy ? "Converting…" : `Convert to ${formatLabels[format]}`}
      </Button>
    </div>
  );
}
