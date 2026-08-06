"use client";

import * as React from "react";
import { ExternalLink, Info, TriangleAlert } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Spinner } from "@/components/shared/Progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { extractVimeoId, fetchVimeoInfo, formatDuration, type VimeoInfo } from "./logic";

export default function VimeoThumbnailGrabberTool() {
  const [input, setInput] = React.useState("");
  const [result, setResult] = React.useState<{
    id: string;
    info: VimeoInfo | null;
    error: string | null;
  } | null>(null);

  const videoId = extractVimeoId(input);

  React.useEffect(() => {
    if (!videoId) return;

    let cancelled = false;
    const timer = setTimeout(() => {
      fetchVimeoInfo(videoId)
        .then((info) => {
          if (!cancelled) setResult({ id: videoId, info, error: null });
        })
        .catch((cause: unknown) => {
          if (!cancelled) {
            setResult({
              id: videoId,
              info: null,
              error: cause instanceof Error ? cause.message : "That video could not be read.",
            });
          }
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [videoId]);

  // Only show a result that belongs to the ID currently in the box.
  const settled = result?.id === videoId ? result : null;
  const loading = Boolean(videoId) && !settled;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="vimeo-input">Vimeo URL or video ID</Label>
        <Input
          id="vimeo-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="https://vimeo.com/76979871"
          className="font-mono"
          spellCheck={false}
          autoCapitalize="off"
          aria-invalid={input.trim() !== "" && !videoId}
        />
        <FieldHint>Full URLs, channel and group paths, or a bare numeric ID.</FieldHint>
      </div>

      {input.trim() && !videoId ? (
        <p role="alert" className="text-sm text-destructive">
          No Vimeo video ID found in that.
        </p>
      ) : null}

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner className="size-4" />
          Asking Vimeo…
        </p>
      ) : null}

      {settled?.error ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md border border-[color-mix(in_oklab,var(--destructive)_30%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-destructive"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          <span>{settled.error}</span>
        </p>
      ) : null}

      {settled?.info ? (
        <section className="surface-card overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={settled.info.thumbnailUrl}
            alt={`Thumbnail for ${settled.info.title}`}
            width={settled.info.width}
            height={settled.info.height}
            className="w-full border-b border-border bg-surface-hover object-cover"
          />
          <div className="space-y-3 p-5">
            <div>
              <h2 className="text-sm font-medium text-foreground">{settled.info.title}</h2>
              <p className="text-xs text-muted-foreground">
                {settled.info.authorName}
                {settled.info.duration ? ` · ${formatDuration(settled.info.duration)}` : ""} ·{" "}
                <span data-numeric>
                  {settled.info.width}×{settled.info.height}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <a href={settled.info.thumbnailUrl} target="_blank" rel="noreferrer noopener" download>
                  Open full size
                  <ExternalLink strokeWidth={1.75} />
                </a>
              </Button>
              <CopyButton value={settled.info.thumbnailUrl} label="Copy URL" />
            </div>
          </div>
        </section>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          This uses Vimeo&rsquo;s official oEmbed API — the documented, public way to ask for a
          video&rsquo;s metadata. It has no CORS headers, so the request goes through our own cached
          endpoint rather than your browser. Private and password-protected videos return nothing,
          by design.
        </span>
      </p>
    </div>
  );
}
