"use client";

import * as React from "react";
import { FileType, Info, TriangleAlert } from "lucide-react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ResultPanel } from "@/components/shared/ResultPanel";
import { ProgressBar } from "@/components/shared/Progress";
import { Button } from "@/components/ui/button";
import { baseName, formatBytes, formatNumber } from "@/lib/utils";
import { pdfToWord, type PdfToWordResult } from "./logic";

export default function PdfToWordTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [result, setResult] = React.useState<PdfToWordResult | null>(null);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const file = files[0];
  const busy = progress !== null;

  async function handleConvert() {
    if (!file) return;
    setError(null);
    setProgress(0);
    try {
      setResult(await pdfToWord(file, (ratio) => setProgress(ratio * 100)));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "That PDF could not be converted.");
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
        title={result.isLikelyScanned ? "No text found" : "Word document ready"}
        stats={[
          { label: "Pages", value: formatNumber(result.pageCount) },
          { label: "Words", value: formatNumber(result.wordCount) },
          { label: "Size", value: formatBytes(result.blob.size) },
        ]}
        downloads={[
          {
            blob: result.blob,
            fileName: `${baseName(file.name)}.docx`,
            label: "Download .docx",
          },
        ]}
        onReset={reset}
        resetLabel="Convert another"
      >
        {result.isLikelyScanned ? (
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" strokeWidth={1.75} />
            <span>
              This PDF appears to be a scan — the pages are images with no text layer, so there is
              nothing to extract. Converting it would need OCR, which this tool doesn&rsquo;t do.
              Try <strong>PDF to JPG</strong> if you want the pages as images.
            </span>
          </p>
        ) : (
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
            <span>
              Text, paragraph breaks and page breaks are preserved. Columns, tables, images and
              exact fonts are not — those need a native rendering engine to reproduce.
            </span>
          </p>
        )}
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

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          This extracts the text of your PDF into an editable Word file. It keeps paragraphs and
          page breaks, but not columns, tables or images — and it can&rsquo;t read scanned PDFs,
          which have no text layer.
        </span>
      </p>

      {busy ? <ProgressBar value={progress ?? 0} label="Extracting text" /> : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button size="lg" disabled={!file || busy} onClick={handleConvert}>
        <FileType strokeWidth={1.75} />
        {busy ? "Converting…" : "Convert to Word"}
      </Button>
    </div>
  );
}
