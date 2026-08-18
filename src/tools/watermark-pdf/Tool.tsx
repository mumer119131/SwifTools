"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { closePdf, openPdf } from "@/lib/pdf";
import { baseName, cn } from "@/lib/utils";
import { PRESETS, parsePages, watermarkPdf, type Placement } from "./logic";

const COLOURS = [
  { label: "Grey", value: { r: 0.55, g: 0.55, b: 0.55 } },
  { label: "Red", value: { r: 0.8, g: 0.15, b: 0.15 } },
  { label: "Blue", value: { r: 0.15, g: 0.3, b: 0.7 } },
  { label: "Black", value: { r: 0, g: 0, b: 0 } },
];

export default function WatermarkPdfTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [bytes, setBytes] = React.useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const [text, setText] = React.useState("DRAFT");
  const [placement, setPlacement] = React.useState<Placement>("diagonal");
  const [opacity, setOpacity] = React.useState(15);
  const [fontSize, setFontSize] = React.useState(48);
  const [colour, setColour] = React.useState(0);
  const [tile, setTile] = React.useState(false);
  const [range, setRange] = React.useState("");

  async function load(next: File[]) {
    setFiles(next);
    setError(null);
    setBytes(null);
    setPageCount(0);

    const file = next[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      setBytes(buffer);
      const document = await openPdf(buffer.slice(0));
      setPageCount(document.numPages);
      await closePdf(document);
    } catch {
      setError("That PDF could not be opened. If it is password-protected, remove the password first.");
    }
  }

  async function build(): Promise<Blob> {
    if (!bytes) throw new Error("No document loaded.");
    const result = await watermarkPdf(bytes.slice(0), {
      text,
      placement,
      opacity: opacity / 100,
      fontSize,
      color: COLOURS[colour].value,
      tile,
      pages: parsePages(range, pageCount),
    });
    return new Blob([result.slice().buffer as ArrayBuffer], { type: "application/pdf" });
  }

  const selected = parsePages(range, pageCount);

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="application/pdf"
        acceptLabel="A PDF — stamped in your browser, never uploaded"
        multiple={false}
        files={files}
        onFilesChange={(next) => void load(next)}
      />

      {error ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      {bytes ? (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="text">Watermark text</Label>
            <Input
              id="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="font-mono"
              aria-invalid={text.trim() === ""}
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setText(preset)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-colors",
                    text === preset
                      ? "border-border-strong text-foreground"
                      : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="placement">Placement</Label>
              <Select value={placement} onValueChange={(value) => setPlacement(value as Placement)}>
                <SelectTrigger id="placement">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diagonal">Diagonal across the page</SelectItem>
                  <SelectItem value="horizontal">Horizontal, centred</SelectItem>
                  <SelectItem value="footer">Small, in the footer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="colour">Colour</Label>
              <Select value={String(colour)} onValueChange={(value) => setColour(Number(value))}>
                <SelectTrigger id="colour">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLOURS.map((entry, index) => (
                    <SelectItem key={entry.label} value={String(index)}>
                      {entry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="opacity">Opacity — {opacity}%</Label>
              <Slider
                id="opacity"
                min={5}
                max={100}
                step={5}
                value={[opacity]}
                onValueChange={([value]) => setOpacity(value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="size">
                Text size — {fontSize}pt
                {placement === "diagonal" && !tile ? " (fitted to the page)" : ""}
              </Label>
              <Slider
                id="size"
                min={8}
                max={96}
                step={2}
                value={[fontSize]}
                onValueChange={([value]) => setFontSize(value)}
                disabled={placement === "diagonal" && !tile}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <label className="flex items-center gap-2.5 text-sm text-foreground">
              <input
                type="checkbox"
                checked={tile}
                onChange={(event) => setTile(event.target.checked)}
                className="size-4 cursor-pointer accent-[var(--accent-pdf)]"
              />
              Repeat across the whole page
            </label>

            <div className="space-y-1.5">
              <Label htmlFor="range">Pages (blank for all {pageCount})</Label>
              <Input
                id="range"
                value={range}
                onChange={(event) => setRange(event.target.value)}
                placeholder="1,3-5"
                className="w-40 font-mono"
              />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {selected === null
              ? `Every page will be stamped — all ${pageCount}.`
              : `${selected.length} of ${pageCount} pages: ${selected.join(", ")}.`}
          </p>

          <DownloadButton
            blob={build}
            fileName={`${baseName(files[0]?.name ?? "document")}-watermarked.pdf`}
            label="Download watermarked PDF"
          />
        </>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The watermark is drawn as real text into the page rather than laid over
          it as an image, so the document stays a normal PDF — text still
          selectable, nothing rasterised. That also means anyone with a PDF
          editor can remove it: this marks a document as a draft or a copy, it
          does not protect it.
        </span>
      </p>
    </div>
  );
}
