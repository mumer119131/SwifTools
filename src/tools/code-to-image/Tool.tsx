"use client";

import * as React from "react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  canvasToPngBlob,
  gradients,
  renderToCanvas,
  themes,
  type Language,
  type RenderOptions,
} from "./logic";

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "python", label: "Python" },
  { value: "plain", label: "Plain text" },
];

const SAMPLE = `// Debounce anything that fires too often
export function debounce(fn, wait = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}`;

export default function CodeToImageTool() {
  const [code, setCode] = React.useState(SAMPLE);
  const [language, setLanguage] = React.useState<Language>("javascript");
  const [themeId, setThemeId] = React.useState("midnight");
  const [gradientId, setGradientId] = React.useState("indigo");
  const [padding, setPadding] = React.useState(48);
  const [fontSize, setFontSize] = React.useState(15);
  const [showLineNumbers, setShowLineNumbers] = React.useState(true);
  const [showWindowChrome, setShowWindowChrome] = React.useState(true);
  const [fileName, setFileName] = React.useState("debounce.js");
  const [scale, setScale] = React.useState("2");

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const theme = themes.find((entry) => entry.id === themeId) ?? themes[0];

  const options: RenderOptions = React.useMemo(
    () => ({
      code,
      language,
      theme,
      gradientId,
      padding,
      fontSize,
      showLineNumbers,
      showWindowChrome,
      fileName,
      scale: Number(scale),
    }),
    [code, language, theme, gradientId, padding, fontSize, showLineNumbers, showWindowChrome, fileName, scale],
  );

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // The only realistic failure is a missing 2D context, which is a broken
    // environment rather than bad input — the tool's error boundary is the
    // right place for that, and it keeps this effect free of setState.
    renderToCanvas(canvas, options);
  }, [options]);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="cti-code">Code</Label>
          <Button variant="ghost" size="sm" onClick={() => setCode("")} disabled={!code}>
            Clear
          </Button>
        </div>
        <textarea
          id="cti-code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Paste a snippet…"
          spellCheck={false}
          className={cn(
            "flex min-h-48 w-full rounded-md border border-border bg-surface px-3 py-2.5",
            "font-mono text-sm text-foreground placeholder:text-subtle-foreground",
            "transition-colors duration-[180ms] ease-out-expo hover:border-border-strong",
            "focus-visible:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-[var(--ring)]",
          )}
        />
      </div>

      <section className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="cti-language">Language</Label>
          <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
            <SelectTrigger id="cti-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((entry) => (
                <SelectItem key={entry.value} value={entry.value}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cti-theme">Theme</Label>
          <Select value={themeId} onValueChange={setThemeId}>
            <SelectTrigger id="cti-theme">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {themes.map((entry) => (
                <SelectItem key={entry.id} value={entry.id}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cti-gradient">Backdrop</Label>
          <Select value={gradientId} onValueChange={setGradientId}>
            <SelectTrigger id="cti-gradient">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {gradients.map((entry) => (
                <SelectItem key={entry.id} value={entry.id}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cti-filename">Window title</Label>
          <Input
            id="cti-filename"
            value={fileName}
            onChange={(event) => setFileName(event.target.value)}
            className="font-mono"
            disabled={!showWindowChrome}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="cti-padding">Padding</Label>
            <span className="font-mono text-sm text-muted-foreground" data-numeric>
              {padding}
            </span>
          </div>
          <Slider
            id="cti-padding"
            min={0}
            max={128}
            step={4}
            value={[padding]}
            onValueChange={([value]) => setPadding(value)}
            aria-label="Backdrop padding"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="cti-font">Font size</Label>
            <span className="font-mono text-sm text-muted-foreground" data-numeric>
              {fontSize}
            </span>
          </div>
          <Slider
            id="cti-font"
            min={10}
            max={28}
            step={1}
            value={[fontSize]}
            onValueChange={([value]) => setFontSize(value)}
            aria-label="Font size"
          />
        </div>

        <div className="flex items-center gap-3 sm:pt-7">
          <Switch
            id="cti-numbers"
            checked={showLineNumbers}
            onCheckedChange={setShowLineNumbers}
          />
          <Label htmlFor="cti-numbers">Line numbers</Label>
        </div>

        <div className="flex items-center gap-3 sm:pt-7">
          <Switch
            id="cti-chrome"
            checked={showWindowChrome}
            onCheckedChange={setShowWindowChrome}
          />
          <Label htmlFor="cti-chrome">Window chrome</Label>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-foreground">Preview</h2>
        <div className="surface-card overflow-x-auto p-4">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Rendered code image"
            className="h-auto max-w-full"
            style={{ imageRendering: "auto" }}
          />
        </div>
      </section>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <Label htmlFor="cti-scale">Export scale</Label>
          <Select value={scale} onValueChange={setScale}>
            <SelectTrigger id="cti-scale" className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1×</SelectItem>
              <SelectItem value="2">2×</SelectItem>
              <SelectItem value="3">3×</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DownloadButton
          blob={async () => {
            const canvas = canvasRef.current;
            if (!canvas) throw new Error("Nothing to export.");
            return canvasToPngBlob(canvas);
          }}
          fileName={`${(fileName || "code").replace(/\.[^.]+$/, "")}.png`}
          label="Download PNG"
          disabled={!code.trim()}
        />
      </div>

      <FieldHint>
        Export at 2× or 3× for slide decks and high-DPI screens — a 1× image looks soft when
        scaled up. Highlighting is a lightweight tokenizer, not a full parser: it colours strings,
        comments, numbers, keywords and call sites, and will occasionally mis-colour a genuinely
        ambiguous case like a regex containing a quote.
      </FieldHint>
    </div>
  );
}
