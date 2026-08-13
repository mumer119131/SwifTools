"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FieldHint, Label } from "@/components/ui/label";
import { toLines } from "@/lib/random";
import {
  DEFICIENCIES,
  hexToRgb,
  rgbToHex,
  simulateImage,
  simulatePixel,
} from "./logic";

const SAMPLE_PALETTE = "#e05a4a\n#3fa88a\n#e0913f\n#3f8fc4\n#7fae43\n#c45f9e";

export default function ColorBlindnessTool() {
  const [mode, setMode] = React.useState<"palette" | "image">("palette");
  const [palette, setPalette] = React.useState(SAMPLE_PALETTE);
  const [source, setSource] = React.useState<string | null>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [simulated, setSimulated] = React.useState<Record<string, string>>({});
  const [busy, setBusy] = React.useState(false);

  const colours = toLines(palette)
    .map((entry) => ({ hex: entry, rgb: hexToRgb(entry) }))
    .filter((entry): entry is { hex: string; rgb: [number, number, number] } => entry.rgb !== null);

  async function loadImage(files: File[]) {
    const file = files[0];
    if (!file) return;

    setBusy(true);
    const url = URL.createObjectURL(file);

    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const element = new Image();
        element.onload = () => resolve(element);
        element.onerror = () => reject(new Error("Could not read that image."));
        element.src = url;
      });

      // Cap the working size: a 12 MP photo is 48 MB of pixel data per pass.
      const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;

      context.drawImage(image, 0, 0, width, height);
      setSource(canvas.toDataURL("image/png"));

      const original = context.getImageData(0, 0, width, height);
      const results: Record<string, string> = {};

      for (const deficiency of DEFICIENCIES) {
        const copy = new ImageData(
          new Uint8ClampedArray(original.data),
          original.width,
          original.height,
        );
        simulateImage(copy.data, deficiency.matrix);
        context.putImageData(copy, 0, 0);
        results[deficiency.id] = canvas.toDataURL("image/png");
      }

      setSimulated(results);
    } finally {
      URL.revokeObjectURL(url);
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <Tabs
        value={mode}
        onValueChange={(value) => setMode(value as "palette" | "image")}
      >
        <TabsList>
          <TabsTrigger value="palette">Check a palette</TabsTrigger>
          <TabsTrigger value="image">Check an image</TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === "palette" ? (
        <div className="space-y-2">
          <Label htmlFor="cb-palette">Hex colours</Label>
          <Textarea
            id="cb-palette"
            value={palette}
            onChange={(event) => setPalette(event.target.value)}
            rows={6}
            spellCheck={false}
            className="max-w-sm font-mono text-sm"
          />
          <FieldHint>One per line. {colours.length} valid.</FieldHint>
        </div>
      ) : (
        <FileDropzone
          accept="image/*"
          acceptLabel="PNG, JPG, WebP or GIF"
          multiple={false}
          files={files}
          onFilesChange={(next) => {
            setFiles(next);
            void loadImage(next);
          }}
        />
      )}

      {mode === "palette" && colours.length > 0 ? (
        <div className="space-y-4">
          <section className="surface-card overflow-hidden">
            <h2 className="border-b border-border px-5 py-3 text-sm font-medium text-foreground">
              Normal vision
            </h2>
            <div className="flex flex-wrap gap-2 p-5">
              {colours.map((colour) => (
                <span key={colour.hex} className="text-center">
                  <span
                    className="block size-16 rounded-lg border border-border"
                    style={{ backgroundColor: colour.hex }}
                  />
                  <span className="mt-1 block font-mono text-xs text-muted-foreground">
                    {colour.hex}
                  </span>
                </span>
              ))}
            </div>
          </section>

          {DEFICIENCIES.map((deficiency) => (
            <section key={deficiency.id} className="surface-card overflow-hidden">
              <header className="border-b border-border px-5 py-3">
                <h2 className="text-sm font-medium text-foreground">
                  {deficiency.label}
                  <span className="ml-2 text-xs text-subtle-foreground">
                    {deficiency.prevalence}
                  </span>
                </h2>
                <p className="text-xs text-muted-foreground">{deficiency.description}</p>
              </header>
              <div className="flex flex-wrap gap-2 p-5">
                {colours.map((colour) => {
                  const [r, g, b] = simulatePixel(...colour.rgb, deficiency.matrix);
                  const hex = rgbToHex(r, g, b);
                  return (
                    <span key={colour.hex} className="text-center">
                      <span
                        className="block size-16 rounded-lg border border-border"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="mt-1 block font-mono text-xs text-muted-foreground">
                        {hex}
                      </span>
                    </span>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : null}

      {mode === "image" && source ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <figure className="surface-card overflow-hidden">
            {/* A canvas data: URL — next/image cannot optimise one. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={source} alt="Original" className="w-full" />
            <figcaption className="border-t border-border px-4 py-2.5 text-sm text-foreground">
              Normal vision
            </figcaption>
          </figure>
          {DEFICIENCIES.map((deficiency) =>
            simulated[deficiency.id] ? (
              <figure key={deficiency.id} className="surface-card overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={simulated[deficiency.id]}
                  alt={`Simulated ${deficiency.label}`}
                  className="w-full"
                />
                <figcaption className="border-t border-border px-4 py-2.5">
                  <p className="text-sm text-foreground">{deficiency.label}</p>
                  <p className="text-xs text-muted-foreground">{deficiency.prevalence}</p>
                </figcaption>
              </figure>
            ) : null,
          )}
        </div>
      ) : mode === "image" && busy ? (
        <p className="rounded-lg border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
          Simulating eight kinds of colour vision…
        </p>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The matrices are from Machado, Oliveira &amp; Fernandes (2009), applied
          in linear RGB — the sRGB gamma curve is undone first and re-applied
          after, which most quick implementations skip and which is why their
          results come out visibly too dark. Around one man in twelve has some
          form of colour vision deficiency, and deuteranomaly alone is about one
          in twenty; if two colours in your palette collapse into one here, no
          amount of legend will separate them.
        </span>
      </p>
    </div>
  );
}
