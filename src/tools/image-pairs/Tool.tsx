"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Info } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { caveats, comparison, formatPairs, getFormatPair } from "@/lib/image-formats";
import { cn } from "@/lib/utils";

interface Converted {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  originalBytes: number;
}

/**
 * One direct image conversion, e.g. /image/png-to-webp.
 *
 * A single component serves all sixteen routes; the slug picks the pair. Every
 * page carries the live converter, what the two formats actually differ on, and
 * what this particular conversion costs you — a page with only a file input
 * would be thin content that deserves to rank for nothing.
 */
export default function ImagePairTool({ slug }: { slug: string }) {
  const pair = getFormatPair(slug);

  const [files, setFiles] = React.useState<File[]>([]);
  const [quality, setQuality] = React.useState(90);
  const [background, setBackground] = React.useState("#ffffff");
  const [result, setResult] = React.useState<Converted | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  // Revoke the previous object URL whenever a new result replaces it, or the
  // decoded image is held in memory for the life of the page.
  React.useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  if (!pair) return null;

  const notes = caveats(pair);
  const losesTransparency = pair.from.transparency && !pair.to.transparency;
  const targetMime = pair.to.mime ?? "image/png";

  async function convert(next: File[]) {
    setFiles(next);
    setError(null);
    setResult(null);

    const file = next[0];
    if (!file) return;

    setBusy(true);
    const url = URL.createObjectURL(file);

    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const element = new Image();
        element.onload = () => resolve(element);
        element.onerror = () =>
          reject(
            new Error(
              pair!.riskySource
                ? `Your browser could not decode this ${pair!.from.label} file. ${pair!.from.label} needs a decoder most browsers do not ship — Safari on an Apple device is usually the exception.`
                : `That does not look like a valid ${pair!.from.label} file.`,
            ),
          );
        element.src = url;
      });

      const canvas = document.createElement("canvas");
      // SVG has no intrinsic pixel size in some files; fall back to something
      // usable rather than producing a 0x0 canvas.
      canvas.width = image.naturalWidth || 1024;
      canvas.height = image.naturalHeight || 1024;

      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not create a canvas to draw on.");

      /*
       * Fill before drawing when the target has no alpha channel. Without this
       * a transparent PNG becomes a JPG with a black background — the canvas
       * starts transparent, and JPEG has no way to store that, so it flattens
       * to whatever was underneath.
       */
      if (losesTransparency) {
        context.fillStyle = background;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      context.drawImage(image, 0, 0);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (produced) =>
            produced ? resolve(produced) : reject(new Error("Could not encode the image.")),
          targetMime,
          pair!.to.lossy ? quality / 100 : undefined,
        );
      });

      /*
       * `toBlob` does not fail on a type it cannot encode — it quietly returns
       * a PNG. Checking the type back is the only way to know the browser
       * actually produced what was asked for.
       */
      if (blob.type !== targetMime) {
        throw new Error(
          `Your browser cannot encode ${pair!.to.label}; it produced ${blob.type || "an unknown format"} instead. Try a current version of Chrome, Edge, Firefox or Safari.`,
        );
      }

      setResult({
        blob,
        url: URL.createObjectURL(blob),
        width: canvas.width,
        height: canvas.height,
        originalBytes: file.size,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Conversion failed.");
    } finally {
      URL.revokeObjectURL(url);
      setBusy(false);
    }
  }

  const saved = result ? 1 - result.blob.size / result.originalBytes : 0;

  /* Other conversions from or to the same formats, for onward navigation. */
  const related = formatPairs
    .filter(
      (entry) =>
        entry.slug !== pair.slug &&
        (entry.from.id === pair.from.id || entry.to.id === pair.to.id),
    )
    .slice(0, 6);

  return (
    <div className="space-y-5">
      <FileDropzone
        accept={pair.from.mime ?? `.${pair.from.url}`}
        acceptLabel={`${pair.from.label} files`}
        multiple={false}
        files={files}
        onFilesChange={(next) => void convert(next)}
      />

      {pair.riskySource ? (
        <p className="flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
          <span>
            {pair.from.label} needs a decoder that most browsers do not ship. This works in Safari on
            an Apple device, and often nowhere else — if the file fails to load, that is why, and it
            is not something this page can work around.
          </span>
        </p>
      ) : null}

      {error ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      {pair.to.lossy || losesTransparency ? (
        <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
          {pair.to.lossy ? (
            <div className="space-y-2">
              <Label htmlFor="quality">Quality — {quality}</Label>
              <Slider
                id="quality"
                min={40}
                max={100}
                value={[quality]}
                onValueChange={([value]) => setQuality(value)}
              />
              <FieldHint>
                90 is a good default. Below about 60, artefacts start showing in skies and skin.
              </FieldHint>
            </div>
          ) : null}

          {losesTransparency ? (
            <div className="space-y-2">
              <Label htmlFor="bg">Background behind transparent areas</Label>
              <Input
                id="bg"
                type="color"
                value={background}
                onChange={(event) => setBackground(event.target.value)}
                className="h-10 w-24 p-1"
              />
              <FieldHint>
                {pair.to.label} cannot store transparency, so it has to become something.
              </FieldHint>
            </div>
          ) : null}
        </div>
      ) : null}

      {busy ? (
        <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Converting…
        </p>
      ) : null}

      {result ? (
        <>
          <div className="surface-card overflow-hidden">
            {/* A canvas-produced object URL; next/image cannot optimise one. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.url}
              alt={`Converted ${pair.to.label}`}
              className="max-h-96 w-full bg-surface-hover object-contain"
            />
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Original", value: `${(result.originalBytes / 1024).toFixed(1)} KB` },
              { label: pair.to.label, value: `${(result.blob.size / 1024).toFixed(1)} KB` },
              {
                label: saved >= 0 ? "Smaller by" : "Larger by",
                value: `${Math.abs(saved * 100).toFixed(0)}%`,
              },
              { label: "Dimensions", value: `${result.width} × ${result.height}` },
            ].map((card) => (
              <div key={card.label} className="surface-card p-4">
                <dt className="text-xs text-muted-foreground">{card.label}</dt>
                <dd className="mt-1 font-mono text-base text-foreground" data-numeric>
                  {card.value}
                </dd>
              </div>
            ))}
          </dl>

          <DownloadButton
            blob={result.blob}
            fileName={`${files[0]?.name.replace(/\.[^.]+$/, "") ?? "image"}.${pair.to.url}`}
            label={`Download ${pair.to.label}`}
            size="lg"
          />
        </>
      ) : null}

      {notes.length > 0 ? (
        <section className="surface-card space-y-2 p-5">
          <h2 className="text-sm font-medium text-foreground">
            What changes when you convert {pair.from.label} to {pair.to.label}
          </h2>
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-3 text-sm font-medium text-foreground">
          {pair.from.label} against {pair.to.label}
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-5 py-2 text-left font-normal">Property</th>
              <th className="px-5 py-2 text-left font-normal">{pair.from.label}</th>
              <th className="px-5 py-2 text-left font-normal">{pair.to.label}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {comparison(pair).map((row) => (
              <tr key={row.label}>
                <td className="px-5 py-2.5 text-muted-foreground">{row.label}</td>
                <td className="px-5 py-2.5 text-foreground">{row.from}</td>
                <td className="px-5 py-2.5 text-foreground">{row.to}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {related.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-foreground">Other conversions</h2>
          <div className="flex flex-wrap gap-2">
            {related.map((entry) => (
              <Link
                key={entry.slug}
                href={`/image/${entry.slug}`}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-sm text-muted-foreground",
                  "transition-colors duration-[180ms] ease-out-expo hover:border-border-strong hover:text-foreground",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                )}
              >
                {entry.title}
                <ArrowRight className="size-3.5" strokeWidth={2} />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The conversion runs on a canvas in your own browser — the file is read
          from disk, decoded, redrawn and re-encoded locally, and never
          uploaded. The encoded type is checked afterwards, because{" "}
          <code className="rounded bg-surface-hover px-1 font-mono text-xs">toBlob</code> does not
          fail on a format the browser cannot write; it quietly returns a PNG
          instead, and a file with the wrong contents under the right extension
          is worse than an error.
        </span>
      </p>
    </div>
  );
}
