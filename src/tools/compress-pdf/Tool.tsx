"use client";

import * as React from "react";
import { Shrink, TriangleAlert } from "lucide-react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ResultPanel, compressionStats } from "@/components/shared/ResultPanel";
import { ProgressBar } from "@/components/shared/Progress";
import { Button } from "@/components/ui/button";
import { baseName, cn, formatNumber } from "@/lib/utils";
import { compressPdf, presets, type CompressionLevel, type CompressResult } from "./logic";

export default function CompressPdfTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [level, setLevel] = React.useState<CompressionLevel>("strong");
  const [result, setResult] = React.useState<CompressResult | null>(null);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const file = files[0];
  const busy = progress !== null;

  async function handleCompress() {
    if (!file) return;
    setError(null);
    setProgress(0);
    try {
      setResult(await compressPdf(file, level, (ratio) => setProgress(ratio * 100)));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "That PDF could not be compressed.");
    } finally {
      setProgress(null);
    }
  }

  function reset() {
    setFiles([]);
    setResult(null);
    setError(null);
  }

  if (result && file) {
    return (
      <ResultPanel
        title={result.grew ? "No saving possible" : "PDF compressed"}
        stats={[
          ...compressionStats(result.originalSize, result.compressedSize),
          { label: "Pages", value: formatNumber(result.pageCount) },
        ]}
        downloads={[
          {
            // If compression made it bigger, hand back the original — a worse
            // file is never the right download.
            blob: result.grew ? file : result.blob,
            fileName: `${baseName(file.name)}-compressed.pdf`,
            label: result.grew ? "Download original" : "Download compressed PDF",
          },
        ]}
        onReset={reset}
        resetLabel="Compress another"
      >
        {result.grew ? (
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" strokeWidth={1.75} />
            <span>
              This PDF is already well optimised — every level produced a larger file. The download
              button gives you the untouched original. Try a stronger level if the file is
              scan-heavy.
            </span>
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
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-foreground">Compression level</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {presets.map((preset) => {
              const isActive = level === preset.level;
              return (
                <button
                  key={preset.level}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  disabled={busy}
                  onClick={() => setLevel(preset.level)}
                  className={cn(
                    "surface-card cursor-pointer p-4 text-left",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                    "disabled:cursor-not-allowed disabled:opacity-45",
                    isActive
                      ? "border-border-strong bg-surface-hover"
                      : "hover:border-border-strong",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "grid size-4 shrink-0 place-items-center rounded-full border",
                        isActive ? "border-foreground" : "border-border-strong",
                      )}
                      aria-hidden="true"
                    >
                      {isActive ? <span className="size-2 rounded-full bg-foreground" /> : null}
                    </span>
                    <span className="text-sm font-medium text-foreground">{preset.label}</span>
                  </span>
                  <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
                    {preset.description}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {busy ? <ProgressBar value={progress ?? 0} label="Compressing PDF" /> : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button size="lg" disabled={!file || busy} onClick={handleCompress}>
        <Shrink strokeWidth={1.75} />
        {busy ? "Compressing…" : "Compress PDF"}
      </Button>
    </div>
  );
}
