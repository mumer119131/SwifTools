"use client";

import * as React from "react";
import { Split } from "lucide-react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ResultPanel } from "@/components/shared/ResultPanel";
import { ProgressBar } from "@/components/shared/Progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { baseName, formatBytes, formatNumber } from "@/lib/utils";
import { readPageCount, splitPdf, zipOutputs, type SplitMode, type SplitOutput } from "./logic";

export default function SplitPdfTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [pageCount, setPageCount] = React.useState<number | null>(null);
  const [mode, setMode] = React.useState<SplitMode>("range");
  const [ranges, setRanges] = React.useState("1-1");
  const [outputs, setOutputs] = React.useState<SplitOutput[] | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const file = files[0];

  // Reading the page count up front lets the hint show the real upper bound.
  React.useEffect(() => {
    if (!file) return;
    let cancelled = false;
    readPageCount(file)
      .then((count) => {
        if (cancelled) return;
        setPageCount(count);
        setRanges(`1-${Math.min(count, 1)}`);
      })
      .catch(() => {
        if (!cancelled) setError("That PDF could not be read. It may be password-protected.");
      });
    return () => {
      cancelled = true;
    };
  }, [file]);

  async function handleSplit() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      setOutputs(await splitPdf(file, mode, ranges, baseName(file.name)));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "That PDF could not be split.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFiles([]);
    setOutputs(null);
    setError(null);
  }

  if (outputs && file) {
    const isBundle = outputs.length > 1;
    const totalBytes = outputs.reduce((sum, output) => sum + output.blob.size, 0);

    return (
      <ResultPanel
        title={isBundle ? `${outputs.length} PDFs created` : "PDF split"}
        stats={[
          { label: "Source pages", value: formatNumber(pageCount ?? 0) },
          { label: "Files out", value: formatNumber(outputs.length) },
          { label: "Total size", value: formatBytes(totalBytes) },
        ]}
        downloads={[
          isBundle
            ? {
                blob: () => zipOutputs(outputs),
                fileName: `${baseName(file.name)}-pages.zip`,
                label: "Download all as ZIP",
              }
            : {
                blob: outputs[0].blob,
                fileName: outputs[0].fileName,
                label: "Download PDF",
              },
        ]}
        onReset={reset}
        resetLabel="Split another"
      />
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
        <section className="surface-card space-y-4 p-5">
          <Tabs value={mode} onValueChange={(value) => setMode(value as SplitMode)}>
            <TabsList>
              <TabsTrigger value="range">Extract a range</TabsTrigger>
              <TabsTrigger value="every-page">Split every page</TabsTrigger>
            </TabsList>
          </Tabs>

          {mode === "range" ? (
            <div className="space-y-2">
              <Label htmlFor="page-ranges">Pages to keep</Label>
              <Input
                id="page-ranges"
                value={ranges}
                onChange={(event) => setRanges(event.target.value)}
                placeholder="1-3, 5, 8-10"
                inputMode="numeric"
                className="max-w-xs"
                aria-describedby="page-ranges-hint"
              />
              <FieldHint id="page-ranges-hint">
                Use commas and dashes, e.g. <span className="font-mono">1-3, 5</span>.
                {pageCount ? (
                  <>
                    {" "}
                    This PDF has <span data-numeric>{pageCount}</span> pages.
                  </>
                ) : null}
              </FieldHint>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Each page becomes its own PDF
              {pageCount ? (
                <>
                  {" "}
                  — that&rsquo;s <span data-numeric>{pageCount}</span> files
                </>
              ) : null}
              , delivered as a single ZIP.
            </p>
          )}
        </section>
      ) : null}

      {busy ? <ProgressBar label="Splitting PDF" /> : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button size="lg" disabled={!file || busy} onClick={handleSplit}>
        <Split strokeWidth={1.75} />
        {busy ? "Splitting…" : "Split PDF"}
      </Button>
    </div>
  );
}
