"use client";

import * as React from "react";
import { ExternalLink, Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { extractVideoId, thumbnailsFor, watchUrl } from "./logic";

export default function YoutubeThumbnailGrabberTool() {
  const [input, setInput] = React.useState("");
  const [failed, setFailed] = React.useState<Set<string>>(new Set());

  const videoId = extractVideoId(input);
  const thumbnails = videoId ? thumbnailsFor(videoId) : [];

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="yt-input">YouTube URL or video ID</Label>
        <Input
          id="yt-input"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setFailed(new Set());
          }}
          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          className="font-mono"
          spellCheck={false}
          autoCapitalize="off"
          aria-invalid={input.trim() !== "" && !videoId}
        />
        <FieldHint>
          Watch links, youtu.be shortlinks, /embed/, /shorts/, /live/ and a bare 11-character ID
          all work.
        </FieldHint>
      </div>

      {input.trim() && !videoId ? (
        <p role="alert" className="text-sm text-destructive">
          No video ID found in that. Check for a truncated paste, or use the full watch URL.
        </p>
      ) : null}

      {videoId ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm text-muted-foreground" data-numeric>
              {videoId}
            </span>
            <CopyButton value={videoId} label="Copy ID" />
            <Button asChild variant="outline" size="sm">
              <a href={watchUrl(videoId)} target="_blank" rel="noreferrer noopener">
                Open on YouTube
                <ExternalLink strokeWidth={1.75} />
              </a>
            </Button>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {thumbnails.map((thumbnail) => (
              <li key={thumbnail.id} className="surface-card overflow-hidden">
                {/* A remote CDN URL can't go through next/image without listing
                    every possible host, so a plain img is correct here. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnail.url}
                  alt={`${thumbnail.label} thumbnail`}
                  width={thumbnail.width}
                  height={thumbnail.height}
                  onError={() => setFailed((current) => new Set(current).add(thumbnail.id))}
                  className="aspect-video w-full border-b border-border bg-surface-hover object-cover"
                />
                <div className="space-y-2 p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm text-foreground">{thumbnail.label}</p>
                    <p className="font-mono text-xs text-muted-foreground" data-numeric>
                      {thumbnail.width}×{thumbnail.height}
                    </p>
                  </div>
                  {failed.has(thumbnail.id) ? (
                    <p className="text-xs text-destructive">
                      Not available for this video.
                      {thumbnail.note ? ` ${thumbnail.note}.` : ""}
                    </p>
                  ) : thumbnail.note ? (
                    <p className="text-xs text-muted-foreground">{thumbnail.note}</p>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <a href={thumbnail.url} target="_blank" rel="noreferrer noopener" download>
                        Open full size
                        <ExternalLink strokeWidth={1.75} />
                      </a>
                    </Button>
                    <CopyButton value={thumbnail.url} label="Copy URL" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Images come straight from Google&rsquo;s public thumbnail CDN — this tool only builds the
          URL, so nothing is proxied or stored. Thumbnails belong to the video&rsquo;s uploader;
          reusing one beyond quotation or commentary needs their permission.
        </span>
      </p>
    </div>
  );
}
