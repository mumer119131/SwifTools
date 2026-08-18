"use client";

import * as React from "react";
import { AlertTriangle, Check, Info, MapPin, ShieldCheck } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { GROUP_LABELS, readExif, stripMetadata, type ExifResult } from "./logic";
import { cn } from "@/lib/utils";

export default function ExifViewerTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [result, setResult] = React.useState<ExifResult | null>(null);
  const [stripped, setStripped] = React.useState<Uint8Array | null>(null);
  const [originalSize, setOriginalSize] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  async function load(next: File[]) {
    setFiles(next);
    setError(null);
    setResult(null);
    setStripped(null);

    const file = next[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      setOriginalSize(buffer.byteLength);
      setResult(readExif(buffer));
      setStripped(stripMetadata(buffer));
    } catch {
      setError("That file could not be read.");
    }
  }

  const sensitive = result?.tags.filter((tag) => tag.sensitive) ?? [];
  const groups = (["location", "camera", "capture", "software", "other"] as const)
    .map((group) => ({ group, tags: result?.tags.filter((tag) => tag.group === group) ?? [] }))
    .filter((entry) => entry.tags.length > 0);

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="image/jpeg"
        acceptLabel="JPEG photos — where EXIF actually lives"
        multiple={false}
        files={files}
        onFilesChange={(next) => void load(next)}
      />

      {error ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      {result ? (
        result.hasMetadata ? (
          <>
            {result.gps ? (
              <div className="flex flex-wrap items-center gap-4 rounded-lg border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-5 py-4">
                <MapPin className="size-6 shrink-0 text-destructive" strokeWidth={1.75} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    This photo records where it was taken
                  </p>
                  <p className="mt-0.5 font-mono text-sm text-muted-foreground">
                    {result.gps.latitude.toFixed(6)}, {result.gps.longitude.toFixed(6)}
                  </p>
                </div>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${result.gps.latitude}&mlon=${result.gps.longitude}#map=16/${result.gps.latitude}/${result.gps.longitude}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-foreground underline underline-offset-4 hover:opacity-70"
                >
                  See it on a map
                </a>
              </div>
            ) : (
              <p className="flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
                <Check className="size-4 shrink-0 text-[var(--success)]" strokeWidth={2} />
                No GPS coordinates in this photo.
              </p>
            )}

            {sensitive.length > 0 ? (
              <p className="flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
                <span>
                  {sensitive.length} identifying{" "}
                  {sensitive.length === 1 ? "value" : "values"} — {sensitive.map((t) => t.name).join(", ")}.
                  A serial number links every photo you publish to the same device.
                </span>
              </p>
            ) : null}

            {groups.map(({ group, tags }) => (
              <section key={group} className="surface-card overflow-hidden">
                <h2 className="border-b border-border px-5 py-3 text-sm font-medium text-foreground">
                  {GROUP_LABELS[group]}
                </h2>
                <dl className="divide-y divide-border">
                  {tags.map((tag) => (
                    <div key={tag.name} className="flex items-center gap-4 px-5 py-2.5 text-sm">
                      <dt className="w-44 shrink-0 text-muted-foreground">{tag.name}</dt>
                      <dd
                        className={cn(
                          "min-w-0 flex-1 break-words font-mono",
                          tag.sensitive ? "text-destructive" : "text-foreground",
                        )}
                      >
                        {tag.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}

            {stripped ? (
              <div className="surface-card flex flex-wrap items-center gap-5 p-5">
                <ShieldCheck className="size-8 shrink-0 text-[var(--success)]" strokeWidth={1.5} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">Clean copy ready</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {((originalSize - stripped.length) / 1024).toFixed(1)} KB of metadata removed.
                    The image data is byte-for-byte identical — nothing was re-encoded.
                  </p>
                </div>
                <DownloadButton
                  blob={() => new Blob([stripped.slice().buffer as ArrayBuffer], { type: "image/jpeg" })}
                  fileName={`${files[0]?.name.replace(/\.[^.]+$/, "") ?? "photo"}-clean.jpg`}
                  label="Download without metadata"
                />
              </div>
            ) : null}
          </>
        ) : (
          <p className="flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
            <Check className="size-4 shrink-0 text-[var(--success)]" strokeWidth={2} />
            This photo carries no metadata at all — nothing to see and nothing to remove.
          </p>
        )
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Stripping removes whole marker segments from the file rather than
          redrawing the image, so the compressed pixel data is bit-for-bit what
          it was. Tools that round-trip through a canvas do clear the metadata
          and quietly recompress the photo at the same time — paying for privacy
          in image quality. And all of this happens in your browser: a tool that
          asks you to upload a photo in order to remove its location has already
          done the thing you were trying to prevent.
        </span>
      </p>
    </div>
  );
}
