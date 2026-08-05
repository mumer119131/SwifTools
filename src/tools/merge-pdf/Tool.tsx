"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Combine } from "lucide-react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ResultPanel } from "@/components/shared/ResultPanel";
import { ProgressBar } from "@/components/shared/Progress";
import { Button } from "@/components/ui/button";
import { formatBytes, formatNumber } from "@/lib/utils";
import { mergePdfs, type MergeResult } from "./logic";

export default function MergePdfTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [result, setResult] = React.useState<MergeResult | null>(null);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const busy = progress !== null;

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= files.length) return;
    const next = [...files];
    [next[index], next[target]] = [next[target], next[index]];
    setFiles(next);
  }

  async function handleMerge() {
    setError(null);
    setProgress(0);
    try {
      setResult(await mergePdfs(files, (ratio) => setProgress(ratio * 100)));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The files could not be merged.");
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
        title="PDFs merged"
        stats={[
          { label: "Files", value: formatNumber(files.length) },
          { label: "Pages", value: formatNumber(result.pageCount) },
          { label: "Size", value: formatBytes(result.byteSize) },
        ]}
        downloads={[{ blob: result.blob, fileName: "merged.pdf", label: "Download merged PDF" }]}
        onReset={reset}
        resetLabel="Merge more"
      />
    );
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="application/pdf,.pdf"
        acceptLabel="PDF files"
        multiple
        maxSizeMb={100}
        files={files}
        onFilesChange={(next) => {
          setFiles(next);
          setError(null);
        }}
        disabled={busy}
      />

      {files.length > 1 ? (
        <section className="surface-card p-4">
          <h2 className="text-sm font-medium text-foreground">Merge order</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Pages are appended top to bottom. Reorder with the arrows.
          </p>
          <ol className="mt-3 space-y-1.5">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${file.lastModified}-${index}`}
                className="flex items-center gap-3 rounded-md bg-surface-hover px-3 py-2"
              >
                <span className="font-mono text-xs text-subtle-foreground" data-numeric>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">{file.name}</span>
                <span className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9"
                    disabled={index === 0 || busy}
                    onClick={() => move(index, -1)}
                    aria-label={`Move ${file.name} up`}
                  >
                    <ArrowUp strokeWidth={1.75} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9"
                    disabled={index === files.length - 1 || busy}
                    onClick={() => move(index, 1)}
                    aria-label={`Move ${file.name} down`}
                  >
                    <ArrowDown strokeWidth={1.75} />
                  </Button>
                </span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {busy ? <ProgressBar value={progress ?? 0} label="Merging PDFs" /> : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button size="lg" disabled={files.length < 2 || busy} onClick={handleMerge}>
        <Combine strokeWidth={1.75} />
        {busy ? "Merging…" : `Merge ${files.length || ""} PDFs`.trim()}
      </Button>
    </div>
  );
}
