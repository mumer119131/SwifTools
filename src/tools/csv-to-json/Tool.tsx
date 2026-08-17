"use client";

import * as React from "react";
import { AlertTriangle, ArrowLeftRight, Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { Button } from "@/components/ui/button";
import { FieldHint, Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DELIMITERS, SAMPLE_CSV, csvToJson, jsonToCsv, parseCsv } from "./logic";

export default function CsvToJsonTool() {
  const [direction, setDirection] = React.useState<"toJson" | "toCsv">("toJson");
  const [input, setInput] = React.useState(SAMPLE_CSV);
  const [delimiter, setDelimiter] = React.useState(",");
  const [inferTypes, setInferTypes] = React.useState(true);
  const [skipEmpty, setSkipEmpty] = React.useState(true);
  const [indent, setIndent] = React.useState(true);

  let output = "";
  let error: string | null = null;
  let preview: ReturnType<typeof parseCsv> | null = null;

  if (direction === "toJson") {
    const { json, result } = csvToJson(input, { delimiter, inferTypes, skipEmpty });
    preview = result;
    output = JSON.stringify(json, null, indent ? 2 : 0);
  } else {
    try {
      output = jsonToCsv(JSON.parse(input), delimiter);
      preview = parseCsv(output, delimiter);
    } catch (cause) {
      error = cause instanceof Error ? cause.message : "Could not read that JSON.";
    }
  }

  return (
    <div className="space-y-5">
      <div className="surface-card flex flex-wrap items-end gap-4 p-5">
        <Tabs
          value={direction}
          onValueChange={(value) => {
            const next = value as "toJson" | "toCsv";
            // Swap the panes so the output becomes the new input, which is
            // what people expect from a direction toggle.
            if (output && !error) setInput(output);
            setDirection(next);
          }}
        >
          <TabsList>
            <TabsTrigger value="toJson">CSV → JSON</TabsTrigger>
            <TabsTrigger value="toCsv">JSON → CSV</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Delimiter</span>
          <Tabs value={delimiter} onValueChange={setDelimiter}>
            <TabsList>
              {DELIMITERS.map((entry) => (
                <TabsTrigger key={entry.id} value={entry.id}>
                  {entry.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {direction === "toJson" ? (
          <>
            <div className="flex items-center gap-3 pb-2">
              <Switch id="csv-types" checked={inferTypes} onCheckedChange={setInferTypes} />
              <Label htmlFor="csv-types">Infer numbers and booleans</Label>
            </div>
            <div className="flex items-center gap-3 pb-2">
              <Switch id="csv-empty" checked={skipEmpty} onCheckedChange={setSkipEmpty} />
              <Label htmlFor="csv-empty">Skip blank rows</Label>
            </div>
            <div className="flex items-center gap-3 pb-2">
              <Switch id="csv-indent" checked={indent} onCheckedChange={setIndent} />
              <Label htmlFor="csv-indent">Indent output</Label>
            </div>
          </>
        ) : null}

        <Button variant="ghost" onClick={() => setInput(SAMPLE_CSV)}>
          Load example
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="csv-input">{direction === "toJson" ? "CSV" : "JSON"}</Label>
          <Textarea
            id="csv-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={16}
            spellCheck={false}
            className="font-mono text-sm"
            placeholder={direction === "toJson" ? "name,role\nAda,Engineer" : '[{ "name": "Ada" }]'}
          />
          <FieldHint>
            {direction === "toJson"
              ? "The first row is used as the header."
              : "An array of objects at the top level."}
          </FieldHint>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="csv-output">{direction === "toJson" ? "JSON" : "CSV"}</Label>
            <div className="flex gap-2">
              <CopyButton value={output} label="Copy" />
              <DownloadButton
                blob={() =>
                  new Blob([output], {
                    type: direction === "toJson" ? "application/json" : "text/csv",
                  })
                }
                fileName={direction === "toJson" ? "data.json" : "data.csv"}
                label="Download"
                size="sm"
                variant="outline"
              />
            </div>
          </div>
          <Textarea
            id="csv-output"
            value={error ?? output}
            readOnly
            rows={16}
            spellCheck={false}
            className="font-mono text-sm"
            aria-invalid={error !== null}
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      {preview && preview.ragged.length > 0 ? (
        <p className="flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
          <span>
            {preview.ragged.length} row{preview.ragged.length === 1 ? "" : "s"} have a
            different number of columns from the header — line
            {preview.ragged.length === 1 ? " " : "s "}
            {preview.ragged.slice(0, 8).join(", ")}
            {preview.ragged.length > 8 ? ", …" : ""}. An unescaped quote earlier
            in the file is the usual cause, so the fault may be above the line
            reported.
          </span>
        </p>
      ) : null}

      {preview && preview.headers.length > 0 && !error ? (
        <section className="surface-card overflow-hidden">
          <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
            <h2 className="text-sm font-medium text-foreground">Preview</h2>
            <span className="text-xs text-muted-foreground">
              {preview.headers.length} columns · {preview.rows.length} rows
            </span>
          </header>
          <div className="max-h-96 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-surface">
                <tr className="border-b border-border">
                  {preview.headers.map((header, index) => (
                    <th
                      key={`${header}-${index}`}
                      className="whitespace-nowrap px-4 py-2 text-left font-medium text-foreground"
                    >
                      {header || <em className="text-subtle-foreground">column {index + 1}</em>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {preview.rows.slice(0, 50).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {preview!.headers.map((_, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="max-w-64 truncate px-4 py-1.5 font-mono text-xs text-muted-foreground"
                      >
                        {row[cellIndex] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.rows.length > 50 ? (
            <p className="border-t border-border px-5 py-2 text-xs text-subtle-foreground">
              Showing the first 50 of {preview.rows.length} rows. All of them are in the output.
            </p>
          ) : null}
        </section>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          <ArrowLeftRight className="mr-1 inline size-3.5" strokeWidth={1.75} />
          The parser reads character by character rather than splitting on the
          delimiter, so quoted fields containing commas, line breaks and doubled
          quotes survive intact. Type inference only converts a value when the
          number round-trips back to the original text — which is why a product
          code of 007 stays a string instead of quietly becoming 7. Nothing is
          uploaded; CSV exports are usually customer or transaction data.
        </span>
      </p>
    </div>
  );
}
