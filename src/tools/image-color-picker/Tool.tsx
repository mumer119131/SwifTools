"use client";

import * as React from "react";
import { Info, Pipette } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { decodeImage, imageSize } from "@/lib/image";
import {
  extractPalette,
  readableOn,
  sampleAt,
  toHex,
  toHslString,
  toRgbString,
  type Rgb,
  type Swatch,
} from "./logic";

export default function ImageColorPickerTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [picked, setPicked] = React.useState<Rgb | null>(null);
  const [palette, setPalette] = React.useState<Swatch[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  // Pixels are held here rather than in state: it is a large buffer, never
  // rendered, and putting it in state would mean React diffing megabytes.
  const pixels = React.useRef<{ data: Uint8ClampedArray; width: number; height: number } | null>(null);

  async function load(next: File[]) {
    setFiles(next);
    setError(null);
    setPicked(null);
    setPalette([]);
    setPreview(null);
    pixels.current = null;

    const file = next[0];
    if (!file) return;

    try {
      const source = await decodeImage(file);
      const { width, height } = imageSize(source);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("no canvas");

      context.drawImage(source, 0, 0);
      const image = context.getImageData(0, 0, width, height);

      pixels.current = { data: image.data, width, height };
      setPreview(canvas.toDataURL("image/png"));
      setPalette(extractPalette(image.data));
      if ("close" in source) source.close();
    } catch {
      setError("That image could not be read.");
    }
  }

  function pick(event: React.MouseEvent<HTMLImageElement>) {
    const store = pixels.current;
    if (!store) return;

    const rect = event.currentTarget.getBoundingClientRect();
    // The preview is scaled to fit; map the click back to source pixels.
    const x = Math.round(((event.clientX - rect.left) / rect.width) * store.width);
    const y = Math.round(((event.clientY - rect.top) / rect.height) * store.height);

    setPicked(sampleAt(store.data, store.width, store.height, x, y));
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="image/*"
        acceptLabel="Any image — read in your browser, never uploaded"
        multiple={false}
        files={files}
        onFilesChange={(next) => void load(next)}
      />

      {error ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      {preview ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_16rem]">
          <div className="space-y-2">
            <figure className="surface-card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Click anywhere to sample a colour"
                onClick={pick}
                className="w-full cursor-crosshair"
              />
            </figure>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Pipette className="size-3.5" strokeWidth={1.75} />
              Click anywhere on the image. A small area is averaged rather than a
              single pixel, so compression noise does not throw the reading off.
            </p>
          </div>

          <div className="space-y-4">
            {picked ? (
              <div className="surface-card overflow-hidden">
                <div
                  className="grid h-24 place-items-center font-mono text-sm"
                  style={{ backgroundColor: toHex(picked), color: readableOn(picked) }}
                >
                  {toHex(picked)}
                </div>
                <dl className="divide-y divide-border">
                  {[
                    ["HEX", toHex(picked)],
                    ["RGB", toRgbString(picked)],
                    ["HSL", toHslString(picked)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center gap-2 px-3 py-2 text-sm">
                      <dt className="w-10 shrink-0 text-xs text-muted-foreground">{label}</dt>
                      <dd className="min-w-0 flex-1 truncate font-mono text-foreground">{value}</dd>
                      <CopyButton value={value} iconOnly />
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <p className="surface-card grid h-24 place-items-center px-4 text-center text-sm text-muted-foreground">
                Click the image to pick a colour
              </p>
            )}

            {palette.length > 0 ? (
              <section>
                <h2 className="text-sm font-medium text-foreground">Palette</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  The image&rsquo;s dominant colours, with near-black and
                  near-white set aside.
                </p>
                <ul className="mt-3 space-y-1.5">
                  {palette.map((swatch) => {
                    const hex = toHex(swatch.color);
                    return (
                      <li key={hex} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPicked(swatch.color)}
                          className="size-8 shrink-0 rounded border border-border"
                          style={{ backgroundColor: hex }}
                          aria-label={`Select ${hex}`}
                        />
                        <span className="flex-1 font-mono text-xs text-foreground">{hex}</span>
                        <span className="text-xs text-subtle-foreground" data-numeric>
                          {Math.round(swatch.share * 100)}%
                        </span>
                        <CopyButton value={hex} iconOnly />
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-3">
                  <CopyButton
                    value={palette.map((s) => toHex(s.color)).join(", ")}
                    label="Copy all"
                  />
                </div>
              </section>
            ) : null}
          </div>
        </div>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The image is decoded in your browser and its pixels never leave your
          machine — which matters for the usual case here, pulling brand colours
          out of a design that has not shipped.
        </span>
      </p>
    </div>
  );
}
