"use client";

import * as React from "react";
import { FileOutput, Info } from "lucide-react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ResultPanel } from "@/components/shared/ResultPanel";
import { ProgressBar } from "@/components/shared/Progress";
import { Button } from "@/components/ui/button";
import { baseName, formatBytes, formatNumber } from "@/lib/utils";
import { wordToPdf, type WordToPdfResult } from "./logic";

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export default function WordToPdfTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [result, setResult] = React.useState<WordToPdfResult | null>(null);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const file = files[0];
  const busy = progress !== null;

  async function handleConvert() {
    if (!file) return;
    setError(null);
    setProgress(0);
    try {
      setResult(await wordToPdf(file, (ratio) => setProgress(ratio * 100)));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "That document could not be converted.");
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
        title="PDF created"
        stats={[
          { label: "Pages", value: formatNumber(result.pageCount) },
          { label: "Size", value: formatBytes(result.byteSize) },
        ]}
        downloads={[
          { blob: result.blob, fileName: `${baseName(file.name)}.pdf`, label: "Download PDF" },
        ]}
        onReset={reset}
        resetLabel="Convert another"
      >
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          <span>
            Headings, paragraphs, lists, bold and italic are carried over and typeset onto A4.
            Embedded images, exact fonts and complex tables are not reproduced.
            {result.warnings.length > 0 ? ` ${result.warnings.join(" ")}` : ""}
          </span>
        </p>
      </ResultPanel>
    );
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept={`${DOCX_MIME},.docx`}
        acceptLabel="a .docx document"
        maxSizeMb={30}
        files={files}
        onFilesChange={(next) => {
          setFiles(next);
          setError(null);
        }}
        disabled={busy}
      />

      {busy ? <ProgressBar value={progress ?? 0} label="Typesetting document" /> : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button size="lg" disabled={!file || busy} onClick={handleConvert}>
        <FileOutput strokeWidth={1.75} />
        {busy ? "Converting…" : "Convert to PDF"}
      </Button>
    </div>
  );
}
