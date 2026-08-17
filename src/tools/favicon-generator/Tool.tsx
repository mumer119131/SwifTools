"use client";

import * as React from "react";
import { Download, Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ICON_SIZES,
  NEXT_SNIPPET,
  buildIco,
  drawIcon,
  htmlSnippet,
  manifestJson,
  type RenderConfig,
  type Shape,
} from "./logic";

const FONT_STACK = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

export default function FaviconGeneratorTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [image, setImage] = React.useState<HTMLImageElement | null>(null);
  const [source, setSource] = React.useState<"image" | "letter">("letter");
  const [letter, setLetter] = React.useState("S");
  const [letterColor, setLetterColor] = React.useState("#ffffff");
  const [background, setBackground] = React.useState("#4f46e5");
  const [transparent, setTransparent] = React.useState(false);
  const [shape, setShape] = React.useState<Shape>("rounded");
  const [padding, setPadding] = React.useState(12);
  const [appName, setAppName] = React.useState("My App");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const config: RenderConfig = {
    image: source === "image" ? image : null,
    letter,
    letterColor,
    fontStack: FONT_STACK,
    background,
    transparent,
    shape,
    padding,
  };

  async function load(next: File[]) {
    setFiles(next);
    setError(null);

    const file = next[0];
    if (!file) {
      setImage(null);
      return;
    }

    const url = URL.createObjectURL(file);
    try {
      const loaded = await new Promise<HTMLImageElement>((resolve, reject) => {
        const element = new Image();
        element.onload = () => resolve(element);
        element.onerror = () => reject(new Error("Could not read that image."));
        element.src = url;
      });
      setImage(loaded);
      setSource("image");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not read that image.");
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  /** Renders one size and returns it as PNG bytes. */
  async function pngFor(size: number): Promise<Uint8Array> {
    const canvas = document.createElement("canvas");
    drawIcon(canvas, size, config);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("Could not encode the icon.");

    return new Uint8Array(await blob.arrayBuffer());
  }

  async function downloadAll() {
    setBusy(true);
    setError(null);

    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();

      const icoParts: { size: number; png: Uint8Array }[] = [];

      for (const entry of ICON_SIZES) {
        const png = await pngFor(entry.size);
        zip.file(entry.fileName, png);
        if (entry.inIco) icoParts.push({ size: entry.size, png });
      }

      zip.file("favicon.ico", buildIco(icoParts));
      zip.file("site.webmanifest", manifestJson(appName, background, background));
      zip.file(
        "README.txt",
        [
          "Put every file in your site root, then paste this into <head>:",
          "",
          htmlSnippet(background),
          "",
          NEXT_SNIPPET,
        ].join("\n"),
      );

      const archive = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(archive);
      const link = document.createElement("a");
      link.href = url;
      link.download = "favicon.zip";
      link.click();
      URL.revokeObjectURL(url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Export failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <Tabs value={source} onValueChange={(value) => setSource(value as "image" | "letter")}>
        <TabsList>
          <TabsTrigger value="letter">From a letter</TabsTrigger>
          <TabsTrigger value="image">From a logo</TabsTrigger>
        </TabsList>
      </Tabs>

      {source === "image" ? (
        <FileDropzone
          accept="image/*"
          acceptLabel="PNG, JPG, WebP or SVG — square works best"
          multiple={false}
          files={files}
          onFilesChange={(next) => void load(next)}
        />
      ) : null}

      {error ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        {source === "letter" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="fav-letter">Letter</Label>
              <Input
                id="fav-letter"
                value={letter}
                onChange={(event) => setLetter(event.target.value)}
                maxLength={2}
                className="text-lg"
              />
              <FieldHint>One character survives 16 pixels. Two rarely does.</FieldHint>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fav-letter-color">Letter colour</Label>
              <Input
                id="fav-letter-color"
                type="color"
                value={letterColor}
                onChange={(event) => setLetterColor(event.target.value)}
                className="h-10 w-full p-1"
              />
            </div>
          </>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="fav-bg">Background</Label>
          <Input
            id="fav-bg"
            type="color"
            value={background}
            onChange={(event) => setBackground(event.target.value)}
            className="h-10 w-full p-1"
            disabled={transparent}
          />
          <FieldHint>Also used as the manifest theme colour.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fav-name">App name</Label>
          <Input
            id="fav-name"
            value={appName}
            onChange={(event) => setAppName(event.target.value)}
          />
          <FieldHint>Goes in site.webmanifest.</FieldHint>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Shape</span>
          <Tabs value={shape} onValueChange={(value) => setShape(value as Shape)}>
            <TabsList>
              <TabsTrigger value="square">Square</TabsTrigger>
              <TabsTrigger value="rounded">Rounded</TabsTrigger>
              <TabsTrigger value="circle">Circle</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fav-padding">Padding — {padding}%</Label>
          <Slider
            id="fav-padding"
            min={0}
            max={30}
            step={1}
            value={[padding]}
            onValueChange={([value]) => setPadding(value)}
          />
        </div>

        <div className="flex items-center gap-3 pt-7">
          <Switch id="fav-transparent" checked={transparent} onCheckedChange={setTransparent} />
          <Label htmlFor="fav-transparent">Transparent background</Label>
        </div>

        <div className="flex items-end pb-1">
          <Button size="lg" onClick={() => void downloadAll()} disabled={busy}>
            <Download className="size-4" strokeWidth={1.75} />
            {busy ? "Building ZIP…" : "Download the set"}
          </Button>
        </div>
      </div>

      {/* Previews at true pixel size, which is the whole point. */}
      <section className="surface-card p-6">
        <h2 className="text-sm font-medium text-foreground">Every size, at actual size</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          The 16 pixel preview is the one that matters. If your mark is unreadable
          there, it will be unreadable in a browser tab.
        </p>
        <div className="mt-5 flex flex-wrap items-end gap-8">
          {ICON_SIZES.map((entry) => (
            <figure key={entry.fileName} className="text-center">
              <IconPreview size={entry.size} config={config} />
              <figcaption className="mt-3">
                <span className="block font-mono text-xs text-foreground">{entry.size}px</span>
                <span className="block max-w-32 text-[11px] leading-tight text-subtle-foreground">
                  {entry.purpose}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface-card overflow-hidden">
          <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
            <h2 className="text-sm font-medium text-foreground">HTML for your &lt;head&gt;</h2>
            <CopyButton value={htmlSnippet(background)} label="Copy" />
          </header>
          <pre className="overflow-x-auto px-5 py-4 font-mono text-xs leading-relaxed text-muted-foreground">
            {htmlSnippet(background)}
          </pre>
        </section>

        <section className="surface-card overflow-hidden">
          <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
            <h2 className="text-sm font-medium text-foreground">site.webmanifest</h2>
            <CopyButton value={manifestJson(appName, background, background)} label="Copy" />
          </header>
          <pre className="overflow-x-auto px-5 py-4 font-mono text-xs leading-relaxed text-muted-foreground">
            {manifestJson(appName, background, background)}
          </pre>
        </section>
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The favicon.ico is written by hand, because canvas has no encoder for
          it — the format is an old Windows container with a directory of
          images appended to a short header. It still earns its place: a browser
          requests /favicon.ico whether or not you link one, so a site without
          it serves a 404 on every page load. Everything is drawn in your own
          browser and nothing is uploaded.
        </span>
      </p>
    </div>
  );
}

/** One icon rendered at its true pixel size, doubled for retina clarity. */
function IconPreview({ size, config }: { size: number; config: RenderConfig }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (canvasRef.current) drawIcon(canvasRef.current, size, config);
  }, [size, config]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className={cn(
        "rounded-sm",
        // A checkerboard behind transparent icons, or they vanish on the card.
        config.transparent &&
          "bg-[repeating-conic-gradient(var(--surface-hover)_0_25%,transparent_0_50%)] bg-[length:8px_8px]",
      )}
      aria-label={`${size} pixel preview`}
    />
  );
}
