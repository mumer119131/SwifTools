"use client";

import * as React from "react";
import { FileImage } from "lucide-react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ResultPanel } from "@/components/shared/ResultPanel";
import { ProgressBar } from "@/components/shared/Progress";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { baseName, formatBytes, formatNumber } from "@/lib/utils";
import { pdfToImages, zipImages, type PageFormat, type PageImage } from "./logic";

const dpiOptions = [
  { value: "96", label: "96 DPI — screen" },
  { value: "150", label: "150 DPI — balanced" },
  { value: "300", label: "300 DPI — print" },
];

export default function PdfToJpgTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [format, setFormat] = React.useState<PageFormat>("image/jpeg");
  const [dpi, setDpi] = React.useState("150");
  const [images, setImages] = React.useState<PageImage[] | null>(null);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const file = files[0];
  const busy = progress !== null;

  // Previews hold object URLs; they must be released when the set is replaced.
  React.useEffect(() => {
    return () => {
      images?.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, [images]);

  async function handleConvert() {
    if (!file) return;
    setError(null);
    setProgress(0);
    try {
      setImages(
        await pdfToImages(file, format, Number(dpi), baseName(file.name), (ratio) =>
          setProgress(ratio * 100),
        ),
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "That PDF could not be converted.");
    } finally {
      setProgress(null);
    }
  }

  function reset() {
    images?.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setFiles([]);
    setImages(null);
    setError(null);
  }

  if (images && file) {
    const totalBytes = images.reduce((sum, image) => sum + image.blob.size, 0);
    const isBundle = images.length > 1;

    return (
      <ResultPanel
        title={`${images.length} ${images.length === 1 ? "image" : "images"} ready`}
        stats={[
          { label: "Pages", value: formatNumber(images.length) },
          { label: "Resolution", value: `${dpi} DPI` },
          { label: "Total size", value: formatBytes(totalBytes) },
        ]}
        downloads={[
          isBundle
            ? {
                blob: () => zipImages(images),
                fileName: `${baseName(file.name)}-images.zip`,
                label: "Download all as ZIP",
              }
            : { blob: images[0].blob, fileName: images[0].fileName, label: "Download image" },
        ]}
        onReset={reset}
        resetLabel="Convert another"
      >
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.slice(0, 8).map((image) => (
            <li key={image.pageNumber} className="space-y-2">
              {/* Blob previews are client-only and unknown at build time, so
                  next/image cannot optimise them — a plain img is correct. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.previewUrl}
                alt={`Page ${image.pageNumber}`}
                width={image.width}
                height={image.height}
                className="w-full rounded-md border border-border bg-white"
              />
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground" data-numeric>
                  Page {image.pageNumber}
                </span>
                <DownloadButton
                  blob={image.blob}
                  fileName={image.fileName}
                  label=""
                  size="icon"
                  variant="ghost"
                  className="size-8"
                  aria-label={`Download page ${image.pageNumber}`}
                />
              </div>
            </li>
          ))}
        </ul>
        {images.length > 8 ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Showing the first 8 of <span data-numeric>{images.length}</span> pages. The ZIP contains
            all of them.
          </p>
        ) : null}
      </ResultPanel>
    );
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="application/pdf,.pdf"
        acceptLabel="a PDF file"
        maxSizeMb={100}
        files={files}
        onFilesChange={(next) => {
          setFiles(next);
          setError(null);
        }}
        disabled={busy}
      />

      {file ? (
        <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="output-format">Image format</Label>
            <Select value={format} onValueChange={(value) => setFormat(value as PageFormat)}>
              <SelectTrigger id="output-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image/jpeg">JPG — smaller files</SelectItem>
                <SelectItem value="image/png">PNG — sharper text</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="output-dpi">Resolution</Label>
            <Select value={dpi} onValueChange={setDpi}>
              <SelectTrigger id="output-dpi">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dpiOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : null}

      {busy ? <ProgressBar value={progress ?? 0} label="Rendering pages" /> : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button size="lg" disabled={!file || busy} onClick={handleConvert}>
        <FileImage strokeWidth={1.75} />
        {busy ? "Converting…" : "Convert to images"}
      </Button>
    </div>
  );
}
