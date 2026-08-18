"use client";

import * as React from "react";
import { AlertTriangle, Download, Loader2 } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { decodeImage, formatExtensions, formatLabels, imageSize, type RasterFormat } from "@/lib/image";
import { baseName, formatBytes } from "@/lib/utils";
import {
  anchorLabels,
  presets,
  resizeForPlatforms,
  retained,
  type Anchor,
  type Preset,
  type ResizedImage,
} from "./logic";

const DEFAULTS = ["ig-square", "ig-story", "og", "yt-thumb"];

export default function SocialMediaResizerTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [source, setSource] = React.useState<{ width: number; height: number } | null>(null);
  const [chosen, setChosen] = React.useState<string[]>(DEFAULTS);
  const [anchor, setAnchor] = React.useState<Anchor>("center");
  const [format, setFormat] = React.useState<RasterFormat>("image/jpeg");
  const [custom, setCustom] = React.useState({ width: "", height: "" });
  const [results, setResults] = React.useState<ResizedImage[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const file = files[0];

  // Grouped for display, so the list reads by platform rather than as 15 rows.
  const grouped = React.useMemo(() => {
    const map = new Map<string, Preset[]>();
    for (const preset of presets) {
      const list = map.get(preset.platform) ?? [];
      list.push(preset);
      map.set(preset.platform, list);
    }
    return [...map];
  }, []);

  const customPreset = React.useMemo((): Preset | null => {
    const width = Number(custom.width);
    const height = Number(custom.height);
    if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) return null;
    return {
      id: "custom",
      platform: "Custom",
      label: "Custom size",
      width: Math.round(width),
      height: Math.round(height),
    };
  }, [custom]);

  async function load(next: File[]) {
    setFiles(next);
    setResults([]);
    setError(null);
    setSource(null);

    const incoming = next[0];
    if (!incoming) return;

    try {
      const decoded = await decodeImage(incoming);
      setSource(imageSize(decoded));
      if ("close" in decoded) decoded.close();
    } catch {
      setError("That image could not be read.");
    }
  }

  async function generate() {
    if (!file) return;

    const selected = presets.filter((preset) => chosen.includes(preset.id));
    if (customPreset) selected.push(customPreset);
    if (selected.length === 0) {
      setError("Pick at least one size.");
      return;
    }

    setBusy(true);
    setError(null);
    for (const result of results) URL.revokeObjectURL(result.url);

    try {
      setResults(await resizeForPlatforms(file, selected, anchor, format));
    } catch (cause) {
      setResults([]);
      setError(cause instanceof Error ? cause.message : "Those sizes could not be generated.");
    } finally {
      setBusy(false);
    }
  }

  function toggle(id: string) {
    setChosen((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="image/*"
        acceptLabel="One image — it will be cropped to every size you pick"
        multiple={false}
        files={files}
        onFilesChange={(next) => void load(next)}
      />

      {error ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      {file ? (
        <>
          <section className="surface-card p-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-sm font-medium text-foreground">Sizes</h2>
                {source ? (
                  <p className="mt-0.5 text-xs text-muted-foreground" data-numeric>
                    Source: {source.width} × {source.height}
                  </p>
                ) : null}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setChosen(presets.map((p) => p.id))}>
                  All
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setChosen([])}>
                  None
                </Button>
              </div>
            </div>

            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {grouped.map(([platform, group]) => (
                <div key={platform} className="space-y-2">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-subtle-foreground">
                    {platform}
                  </h3>
                  {group.map((preset) => {
                    const kept = source ? retained(source.width, source.height, preset) : 1;
                    return (
                      <label
                        key={preset.id}
                        className="flex cursor-pointer items-center gap-2.5 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={chosen.includes(preset.id)}
                          onChange={() => toggle(preset.id)}
                          className="size-4 shrink-0 cursor-pointer accent-[var(--accent-image)]"
                        />
                        <span className="min-w-0 flex-1 truncate text-foreground">
                          {preset.label}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground" data-numeric>
                          {preset.width}×{preset.height}
                        </span>
                        {/* A crop keeping under half the frame is usually a mistake
                            rather than a choice, so it is called out here. */}
                        {source && kept < 0.5 ? (
                          <AlertTriangle
                            className="size-3.5 shrink-0 text-[var(--warning)]"
                            strokeWidth={2}
                            aria-label={`Keeps only ${Math.round(kept * 100)}% of the image`}
                          />
                        ) : null}
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="anchor">Keep which part</Label>
              <Select value={anchor} onValueChange={(value) => setAnchor(value as Anchor)}>
                <SelectTrigger id="anchor" className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(anchorLabels) as Anchor[]).map((value) => (
                    <SelectItem key={value} value={value}>
                      {anchorLabels[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="resizer-format">Save as</Label>
              <Select value={format} onValueChange={(value) => setFormat(value as RasterFormat)}>
                <SelectTrigger id="resizer-format" className="w-28">
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

            <div className="space-y-1.5">
              <Label htmlFor="custom-width">Custom size</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="custom-width"
                  inputMode="numeric"
                  className="w-24"
                  placeholder="Width"
                  value={custom.width}
                  onChange={(event) => setCustom((c) => ({ ...c, width: event.target.value }))}
                />
                <span className="text-muted-foreground">×</span>
                <Input
                  inputMode="numeric"
                  className="w-24"
                  placeholder="Height"
                  aria-label="Custom height"
                  value={custom.height}
                  onChange={(event) => setCustom((c) => ({ ...c, height: event.target.value }))}
                />
              </div>
            </div>

            <Button onClick={() => void generate()} disabled={busy} className="ml-auto">
              {busy ? <Loader2 className="animate-spin" strokeWidth={1.75} /> : <Download strokeWidth={1.75} />}
              {busy ? "Rendering…" : "Generate"}
            </Button>
          </div>

          {results.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((result) => (
                <figure key={result.preset.id} className="surface-card overflow-hidden">
                  <div className="grid h-40 place-items-center bg-surface-hover p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.url}
                      alt={`${result.preset.platform} ${result.preset.label}`}
                      className="max-h-full w-auto max-w-full rounded-sm shadow"
                    />
                  </div>
                  <figcaption className="space-y-2 border-t border-border p-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm text-foreground">
                        {result.preset.platform} · {result.preset.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span data-numeric>
                        {result.preset.width}×{result.preset.height} · {formatBytes(result.blob.size)}
                      </span>
                      <DownloadButton
                        blob={() => result.blob}
                        fileName={`${baseName(file.name)}-${result.preset.id}.${formatExtensions[format]}`}
                        label="Save"
                      />
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
