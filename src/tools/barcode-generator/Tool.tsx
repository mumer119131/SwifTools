"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { DownloadButton } from "@/components/shared/DownloadButton";
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
import { FORMATS, encode, toSvg, validate, type Format } from "./logic";

const SAMPLES: Record<Format, string> = {
  code128: "PKT-2026-0041",
  ean13: "590123412345",
  upca: "03600029145",
  ean8: "4006381",
  code39: "SHIP-1024",
};

export default function BarcodeGeneratorTool() {
  const [format, setFormat] = React.useState<Format>("code128");
  const [value, setValue] = React.useState(SAMPLES.code128);
  const [height, setHeight] = React.useState(80);
  const [moduleWidth, setModuleWidth] = React.useState(2);
  const [showText, setShowText] = React.useState(true);

  const problem = validate(value, format);

  const svg = React.useMemo(() => {
    if (problem) return null;
    try {
      return toSvg(encode(value, format), { moduleWidth, height, showText });
    } catch {
      return null;
    }
  }, [value, format, moduleWidth, height, showText, problem]);

  function changeFormat(next: Format) {
    setFormat(next);
    // Switching to a fixed-length numeric format with text in the box would
    // leave it in an error state; a sample makes the change useful instead.
    if (validate(value, next) !== null) setValue(SAMPLES[next]);
  }

  const hint = FORMATS.find((entry) => entry.id === format)?.hint;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="format">Format</Label>
          <Select value={format} onValueChange={(next) => changeFormat(next as Format)}>
            <SelectTrigger id="format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FORMATS.map((entry) => (
                <SelectItem key={entry.id} value={entry.id}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hint ? <p className="pt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="font-mono"
            spellCheck={false}
            aria-invalid={problem !== null}
          />
          {problem ? (
            <p className="pt-0.5 text-xs text-destructive">{problem}</p>
          ) : (
            <p className="pt-0.5 text-xs text-muted-foreground">
              {format === "ean13" || format === "upca" || format === "ean8"
                ? "The check digit is calculated for you and appended."
                : " "}
            </p>
          )}
        </div>
      </div>

      {svg ? (
        <>
          <figure className="surface-card grid place-items-center overflow-x-auto p-8">
            {/* The SVG is generated from the value in this component; there is
                no external input, so rendering it as markup is safe here. */}
            <div dangerouslySetInnerHTML={{ __html: svg }} />
          </figure>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="height">Bar height — {height}px</Label>
              <Slider
                id="height"
                min={30}
                max={160}
                step={5}
                value={[height]}
                onValueChange={([next]) => setHeight(next)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="module">Bar width — {moduleWidth}px per module</Label>
              <Slider
                id="module"
                min={1}
                max={6}
                step={1}
                value={[moduleWidth]}
                onValueChange={([next]) => setModuleWidth(next)}
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-sm text-foreground">
            <input
              type="checkbox"
              checked={showText}
              onChange={(event) => setShowText(event.target.checked)}
              className="size-4 cursor-pointer accent-[var(--accent-generator)]"
            />
            Print the number underneath
          </label>

          <div className="flex flex-wrap gap-3">
            <DownloadButton
              blob={() => new Blob([svg], { type: "image/svg+xml" })}
              fileName={`barcode-${value.replace(/[^A-Za-z0-9-]/g, "")}.svg`}
              label="Download SVG"
            />
            <CopyButton value={svg} label="Copy SVG" />
          </div>
        </>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Downloaded as SVG, so it stays sharp at any size — which matters, because
          a barcode scaled up from a small bitmap develops soft edges and stops
          scanning. Print at 100%, keep the white space either side, and test with
          a real scanner before ordering a thousand labels.
        </span>
      </p>
    </div>
  );
}
