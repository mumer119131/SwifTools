"use client";

import * as React from "react";
import { Info, Pipette } from "lucide-react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { ResultPanel } from "@/components/shared/ResultPanel";
import { ProgressBar } from "@/components/shared/Progress";
import { Button } from "@/components/ui/button";
import { FieldHint, Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { canvasToBlob, decodeImage, imageSize, releaseImage } from "@/lib/image";
import { baseName, formatBytes } from "@/lib/utils";
import type { Rgb } from "./logic";
import type { WorkerRequest, WorkerResponse } from "./worker";

const PREVIEW_MAX = 900;

export default function RemoveBackgroundTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [tolerance, setTolerance] = React.useState(28);
  const [feather, setFeather] = React.useState(20);
  const [reference, setReference] = React.useState<Rgb | null>(null);
  const [detected, setDetected] = React.useState<Rgb | null>(null);
  const [pickMode, setPickMode] = React.useState(false);
  const [resultBlob, setResultBlob] = React.useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [working, setWorking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const sourceRef = React.useRef<ImageData | null>(null);
  const workerRef = React.useRef<Worker | null>(null);
  const runIdRef = React.useRef(0);

  const file = files[0];

  React.useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  // Decode once into an ImageData we can re-cut on every slider change without
  // re-reading the file.
  React.useEffect(() => {
    if (!file) return;

    let cancelled = false;
    (async () => {
      const source = await decodeImage(file);
      const { width, height } = imageSize(source);
      const scale = Math.min(PREVIEW_MAX / width, PREVIEW_MAX / height, 1);

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context?.drawImage(source, 0, 0, canvas.width, canvas.height);
      releaseImage(source);

      if (cancelled || !context) return;
      sourceRef.current = context.getImageData(0, 0, canvas.width, canvas.height);
    })().catch(() => {
      if (!cancelled) setError("That image could not be read.");
    });

    return () => {
      cancelled = true;
    };
  }, [file]);

  /** Posts one job to the shared worker and resolves with the cut pixels. */
  const runWorker = React.useCallback(
    (image: ImageData, referenceColor: Rgb | null): Promise<WorkerResponse> => {
      workerRef.current ??= new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
      const worker = workerRef.current;

      // The buffer is copied because the worker takes ownership of what it is
      // sent; the source must survive for the next slider change.
      const copy = new Uint8ClampedArray(image.data);
      const request: WorkerRequest = {
        buffer: copy.buffer as ArrayBuffer,
        width: image.width,
        height: image.height,
        tolerance,
        feather,
        reference: referenceColor,
      };

      return new Promise<WorkerResponse>((resolve, reject) => {
        worker.onmessage = (event: MessageEvent<WorkerResponse>) => resolve(event.data);
        worker.onerror = () => reject(new Error("Background removal failed."));
        worker.postMessage(request, [request.buffer]);
      });
    },
    [tolerance, feather],
  );

  async function toPng(response: WorkerResponse, width: number, height: number): Promise<Blob> {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas
      .getContext("2d")
      ?.putImageData(new ImageData(new Uint8ClampedArray(response.buffer), width, height), 0, 0);

    const blob = await canvasToBlob(canvas, "image/png");
    canvas.width = 0;
    canvas.height = 0;
    return blob;
  }

  const run = React.useCallback(async () => {
    const source = sourceRef.current;
    if (!source) return;

    const runId = ++runIdRef.current;
    setWorking(true);
    setError(null);

    try {
      const response = await runWorker(source, reference);

      // A newer run started while this one was in flight — drop the stale result.
      if (runId !== runIdRef.current) return;

      setDetected(response.reference);
      const blob = await toPng(response, source.width, source.height);

      setResultBlob(blob);
      setPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return URL.createObjectURL(blob);
      });
    } catch (cause) {
      if (runId === runIdRef.current) {
        setError(cause instanceof Error ? cause.message : "Background removal failed.");
      }
    } finally {
      if (runId === runIdRef.current) setWorking(false);
    }
  }, [runWorker, reference]);

  /**
   * The preview is cut at a reduced size so the sliders stay responsive. The
   * download must not inherit that compromise, so the original is decoded at
   * full resolution and cut again — with the colour already resolved, so the
   * result matches exactly what the preview showed.
   */
  const renderFullResolution = React.useCallback(async (): Promise<Blob> => {
    if (!file) throw new Error("No image loaded.");
    const resolved = reference ?? detected;

    const source = await decodeImage(file);
    const { width, height } = imageSize(source);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context?.drawImage(source, 0, 0);
    releaseImage(source);
    if (!context) throw new Error("Could not get a 2D canvas context.");

    const full = context.getImageData(0, 0, width, height);
    canvas.width = 0;
    canvas.height = 0;

    const response = await runWorker(full, resolved);
    return toPng(response, width, height);
  }, [file, reference, detected, runWorker]);

  // Debounced so dragging a slider queues one run, not thirty.
  React.useEffect(() => {
    if (!file) return;
    const timer = setTimeout(run, 180);
    return () => clearTimeout(timer);
  }, [file, run]);

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function pickColor(event: React.MouseEvent<HTMLImageElement>) {
    const source = sourceRef.current;
    if (!pickMode || !source) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(((event.clientX - bounds.left) / bounds.width) * source.width);
    const y = Math.floor(((event.clientY - bounds.top) / bounds.height) * source.height);
    const index = (y * source.width + x) * 4;

    setReference({
      r: source.data[index],
      g: source.data[index + 1],
      b: source.data[index + 2],
    });
    setPickMode(false);
  }

  function reset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFiles([]);
    setResultBlob(null);
    setPreviewUrl(null);
    setError(null);
  }

  const activeColor = reference ?? detected;

  return (
    <div className="space-y-5">
      {!file ? (
        <>
          <FileDropzone
            accept="image/jpeg,image/png,image/webp,image/avif"
            acceptLabel="a JPG, PNG, WEBP or AVIF image"
            maxSizeMb={30}
            files={files}
            onFilesChange={(next) => {
              // A new image invalidates everything derived from the old one.
              sourceRef.current = null;
              setResultBlob(null);
              setReference(null);
              setDetected(null);
              setError(null);
              setFiles(next);
            }}
          />
          <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
            <span>
              This works by flood-filling the background inward from the edges, which is excellent
              for plain backdrops — product shots, logos, scans, screenshots, studio portraits. A
              busy or cluttered background needs a segmentation model, which this tool
              deliberately doesn&rsquo;t download.
            </span>
          </p>
        </>
      ) : (
        <>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div
              className="surface-card grid place-items-center overflow-hidden p-4"
              // Checkerboard makes the transparency legible in both themes.
              style={{
                backgroundImage:
                  "linear-gradient(45deg, var(--surface-hover) 25%, transparent 25%), linear-gradient(-45deg, var(--surface-hover) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--surface-hover) 75%), linear-gradient(-45deg, transparent 75%, var(--surface-hover) 75%)",
                backgroundSize: "16px 16px",
                backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
              }}
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Background removed preview"
                  onClick={pickColor}
                  className={`max-h-[26rem] w-auto max-w-full ${pickMode ? "cursor-crosshair" : ""}`}
                />
              ) : (
                <div className="py-24">
                  <ProgressBar label="Preparing preview" />
                </div>
              )}
            </div>

            <section className="surface-card space-y-5 p-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tolerance">Tolerance</Label>
                  <span className="font-mono text-sm text-muted-foreground" data-numeric>
                    {tolerance}
                  </span>
                </div>
                <Slider
                  id="tolerance"
                  min={2}
                  max={80}
                  step={1}
                  value={[tolerance]}
                  onValueChange={([value]) => setTolerance(value)}
                  aria-label="Colour tolerance"
                />
                <FieldHint>
                  Raise it if background remains; lower it if the subject is being eaten.
                </FieldHint>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="feather">Edge softness</Label>
                  <span className="font-mono text-sm text-muted-foreground" data-numeric>
                    {feather}
                  </span>
                </div>
                <Slider
                  id="feather"
                  min={0}
                  max={60}
                  step={1}
                  value={[feather]}
                  onValueChange={([value]) => setFeather(value)}
                  aria-label="Edge softness"
                />
                <FieldHint>Softens the cut so edges don&rsquo;t look jagged.</FieldHint>
              </div>

              <div className="space-y-2">
                <Label>Background colour</Label>
                <div className="flex items-center gap-3">
                  <span
                    className="size-9 shrink-0 rounded-md border border-border"
                    style={{
                      backgroundColor: activeColor
                        ? `rgb(${activeColor.r} ${activeColor.g} ${activeColor.b})`
                        : "transparent",
                    }}
                    aria-hidden="true"
                  />
                  <Button
                    type="button"
                    variant={pickMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPickMode((mode) => !mode)}
                    aria-pressed={pickMode}
                  >
                    <Pipette strokeWidth={1.75} />
                    {pickMode ? "Click the image…" : "Pick from image"}
                  </Button>
                </div>
                <FieldHint>
                  {reference
                    ? "Using the colour you picked."
                    : "Detected automatically from the image edges."}
                </FieldHint>
              </div>

              {working ? <ProgressBar label="Removing background" /> : null}
            </section>
          </div>

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {resultBlob ? (
            <ResultPanel
              title="Background removed"
              stats={[{ label: "Preview size", value: formatBytes(resultBlob.size) }]}
              downloads={[
                {
                  // Re-cut at full resolution on demand — the preview above is
                  // downscaled purely so the sliders stay smooth.
                  blob: renderFullResolution,
                  fileName: `${baseName(file.name)}-no-background.png`,
                  label: "Download transparent PNG",
                },
              ]}
              onReset={reset}
              resetLabel="Start over"
            />
          ) : null}
        </>
      )}
    </div>
  );
}
