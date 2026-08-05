"use client";

import * as React from "react";
import { FileText } from "lucide-react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ResultPanel } from "@/components/shared/ResultPanel";
import { ProgressBar } from "@/components/shared/Progress";
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
import { formatBytes, formatNumber } from "@/lib/utils";
import {
  imagesToPdf,
  pageSizes,
  type FitMode,
  type ImagesToPdfResult,
  type Orientation,
  type PageSizeKey,
} from "./logic";

export default function JpgToPdfTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [pageSize, setPageSize] = React.useState<PageSizeKey>("a4");
  const [orientation, setOrientation] = React.useState<Orientation>("portrait");
  const [fit, setFit] = React.useState<FitMode>("contain");
  const [result, setResult] = React.useState<ImagesToPdfResult | null>(null);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const busy = progress !== null;
  const isFitToImage = pageSize === "fit";

  async function handleConvert() {
    setError(null);
    setProgress(0);
    try {
      setResult(
        await imagesToPdf(
          files,
          { pageSize, orientation, fit, marginPt: 36 },
          (ratio) => setProgress(ratio * 100),
        ),
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The PDF could not be created.");
    } finally {
      setProgress(null);
    }
  }

  function reset() {
    setFiles([]);
    setResult(null);
    setError(null);
  }

  if (result) {
    return (
      <ResultPanel
        title="PDF created"
        stats={[
          { label: "Images", value: formatNumber(files.length) },
          { label: "Pages", value: formatNumber(result.pageCount) },
          { label: "Size", value: formatBytes(result.byteSize) },
        ]}
        downloads={[{ blob: result.blob, fileName: "images.pdf", label: "Download PDF" }]}
        onReset={reset}
        resetLabel="Convert more"
      />
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
        <div className="surface-card grid gap-4 p-5 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="page-size">Page size</Label>
            <Select value={pageSize} onValueChange={(value) => setPageSize(value as PageSizeKey)}>
              <SelectTrigger id="page-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(pageSizes).map(([key, size]) => (
                  <SelectItem key={key} value={key}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="orientation">Orientation</Label>
            <Select
              value={orientation}
              onValueChange={(value) => setOrientation(value as Orientation)}
              disabled={isFitToImage}
            >
              <SelectTrigger id="orientation">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fit-mode">Image fit</Label>
            <Select
              value={fit}
              onValueChange={(value) => setFit(value as FitMode)}
              disabled={isFitToImage}
            >
              <SelectTrigger id="fit-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contain">Fit inside page</SelectItem>
                <SelectItem value="cover">Fill page (crops edges)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isFitToImage ? (
            <p className="text-xs text-muted-foreground sm:col-span-3">
              Each page matches its image exactly, so orientation and fit don&rsquo;t apply.
            </p>
          ) : null}
        </div>
      ) : null}

      {busy ? <ProgressBar value={progress ?? 0} label="Building PDF" /> : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button size="lg" disabled={files.length === 0 || busy} onClick={handleConvert}>
        <FileText strokeWidth={1.75} />
        {busy ? "Creating…" : "Create PDF"}
      </Button>
    </div>
  );
}
