"use client";

import * as React from "react";
import { AlertTriangle, Check, Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatBytes } from "@/lib/utils";
import {
  encodeFile,
  flavourLabels,
  overhead,
  snippet,
  verdict,
  type Encoded,
  type Flavour,
} from "./logic";

export default function ImageToBase64Tool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [encoded, setEncoded] = React.useState<Encoded | null>(null);
  const [flavour, setFlavour] = React.useState<Flavour>("uri");
  const [alt, setAlt] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  async function load(next: File[]) {
    setFiles(next);
    setEncoded(null);
    setError(null);

    const file = next[0];
    if (!file) return;

    setAlt(file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));

    try {
      setEncoded(await encodeFile(file));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "That file could not be encoded.");
    }
  }

  const output = encoded ? snippet(encoded, flavour, alt) : "";
  const size = encoded ? verdict(encoded.encodedBytes) : null;
  const needsAlt = flavour === "html" || flavour === "markdown";

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="image/*"
        acceptLabel="Any image — SVG and small PNGs are the ones worth inlining"
        multiple={false}
        files={files}
        onFilesChange={(next) => void load(next)}
      />

      {error ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      {encoded ? (
        <>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="b64-flavour">Output as</Label>
              <Select value={flavour} onValueChange={(value) => setFlavour(value as Flavour)}>
                <SelectTrigger id="b64-flavour" className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(flavourLabels) as Flavour[]).map((value) => (
                    <SelectItem key={value} value={value}>
                      {flavourLabels[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {needsAlt ? (
              <div className="min-w-48 flex-1 space-y-1.5">
                <Label htmlFor="b64-alt">Alt text</Label>
                <Input
                  id="b64-alt"
                  value={alt}
                  onChange={(event) => setAlt(event.target.value)}
                  placeholder="What the image shows"
                />
              </div>
            ) : null}
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Original", formatBytes(encoded.originalBytes)],
              ["Encoded", formatBytes(encoded.encodedBytes)],
              ["Overhead", `+${Math.round(overhead(encoded) * 100)}%`],
              ["Type", encoded.mime],
            ].map(([label, value]) => (
              <div key={label} className="surface-card px-4 py-3">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="mt-0.5 truncate text-sm text-foreground" data-numeric>
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {size ? (
            <p
              className={
                size.tone === "good"
                  ? "flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground"
                  : size.tone === "warn"
                    ? "flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground"
                    : "flex items-start gap-2 rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground"
              }
            >
              {size.tone === "good" ? (
                <Check className="mt-0.5 size-4 shrink-0 text-[var(--success)]" strokeWidth={2} />
              ) : (
                <AlertTriangle
                  className={`mt-0.5 size-4 shrink-0 ${size.tone === "warn" ? "text-[var(--warning)]" : "text-destructive"}`}
                  strokeWidth={1.75}
                />
              )}
              {size.message}
            </p>
          ) : null}

          <div className="surface-card overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
              <span className="text-sm text-muted-foreground">{flavourLabels[flavour]}</span>
              <CopyButton value={output} />
            </div>
            <pre className="max-h-64 overflow-auto px-4 py-3 text-xs leading-relaxed">
              <code className="break-all whitespace-pre-wrap text-foreground">{output}</code>
            </pre>
          </div>
        </>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Inlining trades a request for size. It pays off for a small icon on
          every page and stops paying quickly after that — an inlined image
          cannot be cached separately from the file holding it, and holds up
          that file until it has fully downloaded. Encoding happens in your
          browser; nothing is uploaded.
        </span>
      </p>
    </div>
  );
}
