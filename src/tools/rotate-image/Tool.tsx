"use client";

import * as React from "react";
import { FlipHorizontal, FlipVertical, RotateCcw, RotateCw, Undo2 } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatExtensions, formatLabels, type RasterFormat } from "@/lib/image";
import { baseName, formatBytes } from "@/lib/utils";
import { describe, isIdentity, rotateImage, type Rotation, type Transform } from "./logic";

const IDENTITY: Transform = { rotation: 0, flipX: false, flipY: false };

export default function RotateImageTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [transform, setTransform] = React.useState<Transform>(IDENTITY);
  const [format, setFormat] = React.useState<RasterFormat>("image/jpeg");
  const [preview, setPreview] = React.useState<string | null>(null);
  const [size, setSize] = React.useState<{ width: number; height: number; bytes: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const blobRef = React.useRef<Blob | null>(null);

  const file = files[0];

  React.useEffect(() => {
    if (!file) return;

    let cancelled = false;
    let created: string | null = null;

    rotateImage(file, transform, format)
      .then((result) => {
        if (cancelled) {
          URL.revokeObjectURL(result.url);
          return;
        }
        created = result.url;
        blobRef.current = result.blob;
        setPreview(result.url);
        setSize({ width: result.width, height: result.height, bytes: result.blob.size });
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "That image could not be rotated.");
        }
      });

    return () => {
      cancelled = true;
      if (created) URL.revokeObjectURL(created);
    };
  }, [file, transform, format]);

  function load(next: File[]) {
    setFiles(next);
    setTransform(IDENTITY);
    setError(null);
    setPreview(null);
    setSize(null);
    // Default the output to the input's own format when it is one we can write,
    // so a PNG with transparency does not silently become a JPEG.
    const incoming = next[0]?.type;
    setFormat(incoming === "image/png" || incoming === "image/webp" ? incoming : "image/jpeg");
  }

  function turn(by: 90 | 270) {
    setTransform((current) => ({
      ...current,
      rotation: (((current.rotation + by) % 360) as Rotation),
    }));
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="image/*"
        acceptLabel="Any image — JPG, PNG, WebP, GIF"
        multiple={false}
        files={files}
        onFilesChange={load}
      />

      {error ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      {file ? (
        <>
          <div className="surface-card flex flex-wrap items-center gap-2 p-3">
            <Button variant="outline" size="sm" onClick={() => turn(270)}>
              <RotateCcw strokeWidth={1.75} />
              Left
            </Button>
            <Button variant="outline" size="sm" onClick={() => turn(90)}>
              <RotateCw strokeWidth={1.75} />
              Right
            </Button>
            <Button
              variant={transform.flipX ? "default" : "outline"}
              size="sm"
              onClick={() => setTransform((c) => ({ ...c, flipX: !c.flipX }))}
            >
              <FlipHorizontal strokeWidth={1.75} />
              Mirror
            </Button>
            <Button
              variant={transform.flipY ? "default" : "outline"}
              size="sm"
              onClick={() => setTransform((c) => ({ ...c, flipY: !c.flipY }))}
            >
              <FlipVertical strokeWidth={1.75} />
              Flip
            </Button>

            <span className="mx-1 h-6 w-px bg-border" aria-hidden="true" />

            <Button
              variant="ghost"
              size="sm"
              disabled={isIdentity(transform)}
              onClick={() => setTransform(IDENTITY)}
            >
              <Undo2 strokeWidth={1.75} />
              Reset
            </Button>

            <div className="ml-auto flex items-center gap-2">
              <Label htmlFor="rotate-format" className="text-xs text-muted-foreground">
                Save as
              </Label>
              <Select value={format} onValueChange={(value) => setFormat(value as RasterFormat)}>
                <SelectTrigger id="rotate-format" className="h-8 w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(formatLabels) as RasterFormat[]).map((value) => (
                    <SelectItem key={value} value={value}>
                      {formatLabels[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {preview ? (
            <figure className="surface-card overflow-hidden">
              <div className="grid min-h-64 place-items-center bg-surface-hover p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="The rotated result"
                  className="max-h-[28rem] w-auto max-w-full rounded-sm shadow-lg"
                />
              </div>
              <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border px-5 py-3 text-sm text-muted-foreground">
                <span data-numeric>
                  {size?.width} × {size?.height}
                </span>
                <span data-numeric>{size ? formatBytes(size.bytes) : null}</span>
                <span className="capitalize">{describe(transform)}</span>
                <span className="ml-auto">
                  <DownloadButton
                    blob={() => blobRef.current ?? new Blob()}
                    fileName={`${baseName(file.name)}-rotated.${formatExtensions[format]}`}
                    label="Download"
                  />
                </span>
              </figcaption>
            </figure>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
