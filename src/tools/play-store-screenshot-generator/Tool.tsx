"use client";

import * as React from "react";
import { AlertTriangle, Download, Info, Plus, X } from "lucide-react";

import { FileDropzone } from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { hashSeed, mulberry32 } from "@/lib/random";
import {
  FONT_STACKS,
  LAYOUTS,
  PATTERNS,
  SIZE_PRESETS,
  THEMES,
  checkSpec,
  drawPattern,
  renderSlide,
  type Layout,
  type PatternId,
  type Slide,
  type Theme,
} from "./logic";

/** Reads a File into an Image the canvas can draw. */
async function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Could not read ${file.name}`));
      image.src = url;
    });
  } finally {
    // Revoking immediately is safe: the decoded bitmap is retained by the
    // Image once it has loaded, and holding the URL open leaks memory.
    URL.revokeObjectURL(url);
  }
}

export default function PlayStoreScreenshotTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [slides, setSlides] = React.useState<Slide[]>([]);
  const [sizeId, setSizeId] = React.useState("phone-portrait");
  const [themeId, setThemeId] = React.useState("indigo");
  const [layout, setLayout] = React.useState<Layout>("text-top");
  const [fontId, setFontId] = React.useState("system");
  const [showFrame, setShowFrame] = React.useState(true);
  const [pattern, setPattern] = React.useState<PatternId>("mesh");
  const [patternIntensity, setPatternIntensity] = React.useState(70);
  const [grain, setGrain] = React.useState(false);
  const [tilt, setTilt] = React.useState(0);
  const [headlineScale, setHeadlineScale] = React.useState(4.5);
  const [format, setFormat] = React.useState<"png" | "jpeg">("png");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const size = SIZE_PRESETS.find((entry) => entry.id === sizeId)!;
  const theme = THEMES.find((entry) => entry.id === themeId)!;
  const fontStack = FONT_STACKS.find((entry) => entry.id === fontId)!.stack;

  const options = {
    theme,
    layout,
    width: size.width,
    height: size.height,
    fontStack,
    showFrame,
    tilt,
    headlineScale,
    pattern,
    patternIntensity,
    grain,
  };

  const warnings = checkSpec(size.width, size.height, slides.length, size.kind);
  const blocking = warnings.some((entry) => entry.level === "error");

  async function addFiles(next: File[]) {
    setFiles(next);
    setError(null);

    // Only load files that are not already in the set, so re-dropping does not
    // decode everything again.
    const known = new Set(slides.map((slide) => slide.fileName));
    const additions: Slide[] = [];

    for (const file of next) {
      if (known.has(file.name)) continue;
      try {
        const image = await loadImage(file);
        additions.push({
          id: `slide-${Date.now()}-${additions.length}`,
          headline: "",
          subtext: "",
          image,
          fileName: file.name,
        });
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not read that file.");
      }
    }

    const removed = new Set(next.map((file) => file.name));
    setSlides((current) => [
      ...current.filter((slide) => slide.image === null || removed.has(slide.fileName)),
      ...additions,
    ]);
  }

  function update(id: string, patch: Partial<Slide>) {
    setSlides((current) =>
      current.map((slide) => (slide.id === id ? { ...slide, ...patch } : slide)),
    );
  }

  function move(index: number, direction: -1 | 1) {
    setSlides((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  /** Renders one slide to a full-size canvas and returns it as a Blob. */
  async function toBlob(slide: Slide, index: number): Promise<Blob> {
    const canvas = document.createElement("canvas");
    renderSlide(canvas, slide, { ...options, index });

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode the image."))),
        format === "png" ? "image/png" : "image/jpeg",
        format === "jpeg" ? 0.92 : undefined,
      );
    });
  }

  async function downloadAll() {
    if (slides.length === 0) return;

    setBusy(true);
    setError(null);

    try {
      // jszip is only pulled in when someone actually exports, rather than
      // being loaded with the page.
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();

      for (const [index, slide] of slides.entries()) {
        const blob = await toBlob(slide, index);
        const number = String(index + 1).padStart(2, "0");
        zip.file(`${sizeId}-${number}.${format === "png" ? "png" : "jpg"}`, blob);
      }

      const archive = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(archive);

      const link = document.createElement("a");
      link.href = url;
      link.download = `play-store-${sizeId}.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Export failed.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadOne(slide: Slide, index: number) {
    try {
      const blob = await toBlob(slide, index);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${sizeId}-${String(index + 1).padStart(2, "0")}.${format === "png" ? "png" : "jpg"}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Export failed.");
    }
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="image/*"
        acceptLabel="PNG, JPG or WebP screenshots"
        multiple
        files={files}
        onFilesChange={(next) => void addFiles(next)}
      />

      {error ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      {/* ------------------------------------------------------- controls */}
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="ps-size">Output size</Label>
          <Select value={sizeId} onValueChange={setSizeId}>
            <SelectTrigger id="ps-size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SIZE_PRESETS.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.label} — {preset.width}×{preset.height}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldHint>{size.note}</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ps-layout">Layout</Label>
          <Select value={layout} onValueChange={(value) => setLayout(value as Layout)}>
            <SelectTrigger id="ps-layout">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LAYOUTS.map((entry) => (
                <SelectItem key={entry.id} value={entry.id}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldHint>{LAYOUTS.find((entry) => entry.id === layout)?.note}</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ps-font">Caption font</Label>
          <Select value={fontId} onValueChange={setFontId}>
            <SelectTrigger id="ps-font">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_STACKS.map((font) => (
                <SelectItem key={font.id} value={font.id}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldHint>Rendered with whichever of these your device has.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ps-format">File format</Label>
          <Select value={format} onValueChange={(value) => setFormat(value as "png" | "jpeg")}>
            <SelectTrigger id="ps-format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG — sharper text</SelectItem>
              <SelectItem value="jpeg">JPEG — smaller files</SelectItem>
            </SelectContent>
          </Select>
          <FieldHint>Both are exported without transparency, as Play requires.</FieldHint>
        </div>

        <div className="space-y-2 sm:col-span-2 lg:col-span-4">
          <span className="text-sm font-medium text-foreground">Style</span>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setThemeId(entry.id)}
                aria-label={`Use the ${entry.label} style`}
                aria-pressed={themeId === entry.id}
                className={cn(
                  "flex h-10 cursor-pointer items-center gap-2 rounded-full border pl-1.5 pr-4 text-sm",
                  "transition-colors duration-[180ms] ease-out-expo",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                  themeId === entry.id
                    ? "border-border-strong bg-surface-hover text-foreground"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className="size-7 rounded-full border border-border"
                  style={{
                    background: `linear-gradient(135deg, ${entry.background[0]}, ${entry.background[1]})`,
                  }}
                />
                {entry.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 sm:col-span-2 lg:col-span-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-sm font-medium text-foreground">Background detail</span>
            <span className="text-xs text-muted-foreground">
              {PATTERNS.find((entry) => entry.id === pattern)?.note}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PATTERNS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setPattern(entry.id)}
                aria-label={`Use the ${entry.label} background`}
                aria-pressed={pattern === entry.id}
                className={cn(
                  "cursor-pointer overflow-hidden rounded-lg border text-left",
                  "transition-colors duration-[180ms] ease-out-expo",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                  pattern === entry.id
                    ? "border-border-strong ring-1 ring-[var(--border-strong)]"
                    : "border-border hover:border-border-strong",
                )}
              >
                <PatternSwatch pattern={entry.id} theme={theme} intensity={patternIntensity} />
                <span
                  className={cn(
                    "block px-2 py-1.5 text-xs",
                    pattern === entry.id ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {entry.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ps-pattern-strength">Detail strength — {patternIntensity}%</Label>
          <Slider
            id="ps-pattern-strength"
            min={0}
            max={100}
            step={5}
            value={[patternIntensity]}
            onValueChange={([value]) => setPatternIntensity(value)}
            disabled={pattern === "none"}
          />
          <FieldHint>
            {pattern === "none"
              ? "Pick a background above to enable this."
              : "Lower is usually better — the screenshot is the subject."}
          </FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ps-headline-size">Caption size — {headlineScale.toFixed(1)}%</Label>
          <Slider
            id="ps-headline-size"
            min={2}
            max={9}
            step={0.5}
            value={[headlineScale]}
            onValueChange={([value]) => setHeadlineScale(value)}
          />
          <FieldHint>As a share of image height, so it scales with the size.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ps-tilt">Device tilt — {tilt}°</Label>
          <Slider
            id="ps-tilt"
            min={-12}
            max={12}
            step={1}
            value={[tilt]}
            onValueChange={([value]) => setTilt(value)}
          />
        </div>

        <div className="space-y-3 pt-7">
          <div className="flex items-center gap-3">
            <Switch id="ps-frame" checked={showFrame} onCheckedChange={setShowFrame} />
            <Label htmlFor="ps-frame">Draw a phone frame</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="ps-grain" checked={grain} onCheckedChange={setGrain} />
            <Label htmlFor="ps-grain">Add film grain</Label>
          </div>
        </div>

        <div className="flex items-end pb-1">
          <Button
            size="lg"
            onClick={() => void downloadAll()}
            disabled={slides.length === 0 || busy || blocking}
          >
            <Download className="size-4" strokeWidth={1.75} />
            {busy ? "Building ZIP…" : `Download ${slides.length || ""} as ZIP`}
          </Button>
        </div>
      </div>

      {warnings.length > 0 ? (
        <div className="space-y-2">
          {warnings.map((entry) => (
            <p
              key={entry.message}
              className={cn(
                "flex items-start gap-2 rounded-md border px-4 py-3 text-sm text-foreground",
                entry.level === "error"
                  ? "border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)]"
                  : "border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)]",
              )}
            >
              <AlertTriangle
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  entry.level === "error" ? "text-destructive" : "text-[var(--warning)]",
                )}
                strokeWidth={1.75}
              />
              {entry.message}
            </p>
          ))}
        </div>
      ) : null}

      {/* --------------------------------------------------------- slides */}
      {slides.length > 0 ? (
        <div className="space-y-4">
          {slides.map((slide, index) => (
            <section key={slide.id} className="surface-card grid gap-5 p-5 lg:grid-cols-[1fr_1.3fr]">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-medium text-foreground">
                    Image {index + 1}
                    <span className="ml-2 truncate text-xs text-subtle-foreground">
                      {slide.fileName}
                    </span>
                  </h2>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Move image ${index + 1} earlier`}
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Move image ${index + 1} later`}
                      disabled={index === slides.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      ↓
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove image ${index + 1}`}
                      onClick={() => {
                        setSlides((current) => current.filter((entry) => entry.id !== slide.id));
                        setFiles((current) => current.filter((file) => file.name !== slide.fileName));
                      }}
                    >
                      <X className="size-4" strokeWidth={1.75} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${slide.id}-headline`}>Headline</Label>
                  <Input
                    id={`${slide.id}-headline`}
                    value={slide.headline}
                    onChange={(event) => update(slide.id, { headline: event.target.value })}
                    placeholder="Track every workout"
                  />
                  <FieldHint>Three to five words. It has to read at thumbnail size.</FieldHint>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${slide.id}-subtext`}>Supporting line</Label>
                  <Textarea
                    id={`${slide.id}-subtext`}
                    value={slide.subtext}
                    onChange={(event) => update(slide.id, { subtext: event.target.value })}
                    rows={2}
                    placeholder="Sets, reps and personal bests, logged in seconds."
                  />
                </div>

                <Button variant="outline" size="sm" onClick={() => void downloadOne(slide, index)}>
                  <Download className="size-4" strokeWidth={1.75} />
                  Download this one
                </Button>
              </div>

              <SlidePreview slide={slide} options={{ ...options, index }} />
            </section>
          ))}

          <Button
            variant="outline"
            onClick={() =>
              setSlides((current) => [
                ...current,
                {
                  id: `slide-${Date.now()}`,
                  headline: "",
                  subtext: "",
                  image: null,
                  fileName: "No screenshot",
                },
              ])
            }
          >
            <Plus className="size-4" strokeWidth={1.75} />
            Add a caption-only slide
          </Button>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
          Drop your app screenshots above to start. You can add several at once.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Everything is composed on a canvas in your browser at the exact pixel
          size the Play Console expects, and the ZIP is assembled locally — your
          screenshots are never uploaded, which matters for an unreleased app.
          The background is filled opaquely before anything is drawn, because
          Play rejects screenshots containing an alpha channel and a canvas
          starts out transparent.
        </span>
      </p>
    </div>
  );
}

/**
 * A tiny live preview of one background option.
 *
 * Rendered rather than listed, because the names alone mean very little — the
 * difference between "Rings" and "Contours" is obvious at a glance and opaque
 * in a dropdown. Each swatch paints the real gradient and the real pattern
 * function, so what you pick is what you get.
 */
function PatternSwatch({
  pattern,
  theme,
  intensity,
}: {
  pattern: PatternId;
  theme: Theme;
  intensity: number;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const width = 108;
    const height = 68;
    canvas.width = width;
    canvas.height = height;

    const radians = (theme.angle * Math.PI) / 180;
    const gradient = context.createLinearGradient(
      width / 2 - (Math.cos(radians) * width) / 2,
      height / 2 - (Math.sin(radians) * height) / 2,
      width / 2 + (Math.cos(radians) * width) / 2,
      height / 2 + (Math.sin(radians) * height) / 2,
    );
    gradient.addColorStop(0, theme.background[0]);
    gradient.addColorStop(1, theme.background[1]);
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    // The same seed the full render uses for slide 0, so the swatch is a
    // genuine sample rather than a different arrangement of the same idea.
    drawPattern(
      context,
      pattern,
      width,
      height,
      theme,
      intensity,
      mulberry32(hashSeed(`${pattern}-0-${theme.id}`)),
    );
  }, [pattern, theme, intensity]);

  return <canvas ref={canvasRef} className="block h-[68px] w-[108px]" aria-hidden="true" />;
}

/**
 * A scaled-down preview of one slide.
 *
 * The preview canvas is rendered at the real output size and displayed scaled
 * by CSS, so what you see is exactly what exports rather than an approximation
 * drawn at a different size.
 */
function SlidePreview({
  slide,
  options,
}: {
  slide: Slide;
  options: Parameters<typeof renderSlide>[2];
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (canvasRef.current) renderSlide(canvasRef.current, slide, options);
  }, [slide, options]);

  return (
    <div className="grid place-items-center rounded-lg bg-surface-hover p-4">
      <canvas
        ref={canvasRef}
        className="max-h-96 w-auto max-w-full rounded shadow-card"
        aria-label={`Preview of image ${options.index + 1}`}
      />
    </div>
  );
}
