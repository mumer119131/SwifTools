"use client";

import * as React from "react";
import { ExternalLink, Info, TriangleAlert } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Spinner } from "@/components/shared/Progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { fetchPostImage, normaliseInstagramUrl, type PostImage } from "./logic";

export default function InstagramPhotoDownloaderTool() {
  const [input, setInput] = React.useState("");
  const [result, setResult] = React.useState<{
    url: string;
    image: PostImage | null;
    error: string | null;
  } | null>(null);
  const [requested, setRequested] = React.useState<string | null>(null);

  const postUrl = normaliseInstagramUrl(input);

  React.useEffect(() => {
    if (!requested) return;

    let cancelled = false;
    fetchPostImage(requested)
      .then((image) => {
        if (!cancelled) setResult({ url: requested, image, error: null });
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setResult({
            url: requested,
            image: null,
            error: cause instanceof Error ? cause.message : "That post could not be read.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [requested]);

  const settled = result?.url === requested ? result : null;
  const loading = Boolean(requested) && !settled;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="ig-input">Instagram post URL</Label>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            id="ig-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="https://www.instagram.com/p/Cxxxxxxxxxx/"
            className="min-w-64 flex-1 font-mono"
            spellCheck={false}
            autoCapitalize="off"
            aria-invalid={input.trim() !== "" && !postUrl}
          />
          <Button onClick={() => setRequested(postUrl)} disabled={!postUrl || loading}>
            {loading ? <Spinner className="text-primary-foreground" /> : null}
            {loading ? "Fetching…" : "Fetch image"}
          </Button>
        </div>
        <FieldHint>Post, reel and IGTV URLs. Tracking parameters are stripped.</FieldHint>
      </div>

      {input.trim() && !postUrl ? (
        <p role="alert" className="text-sm text-destructive">
          That doesn&rsquo;t look like an Instagram post URL. It should contain{" "}
          <code className="font-mono">/p/</code> or <code className="font-mono">/reel/</code>.
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

      {settled?.image ? (
        <section className="surface-card overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={settled.image.imageUrl}
            alt={settled.image.title ?? "Instagram post image"}
            className="max-h-[32rem] w-full border-b border-border bg-surface-hover object-contain"
          />
          <div className="space-y-3 p-5">
            {settled.image.title ? (
              <p className="line-clamp-2 text-sm text-muted-foreground">{settled.image.title}</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <a href={settled.image.imageUrl} target="_blank" rel="noreferrer noopener" download>
                  Open full size
                  <ExternalLink strokeWidth={1.75} />
                </a>
              </Button>
              <CopyButton value={settled.image.imageUrl} label="Copy image URL" />
            </div>
          </div>
        </section>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          <strong className="text-foreground">Expect this one to be unreliable.</strong> It reads
          the preview image a post advertises to link crawlers — the same tag Slack and WhatsApp use
          — rather than Instagram&rsquo;s private API. Instagram rate-limits those requests hard
          from server IPs and changes its markup often, so failures are normal rather than a bug.
          Private posts return nothing at all. Only the first image of a carousel is advertised.
        </span>
      </p>

      <p className="text-sm text-muted-foreground">
        Photos belong to whoever posted them. Downloading one for personal reference is one thing;
        republishing it without permission is copyright infringement, and automated bulk collection
        breaches Instagram&rsquo;s terms.
      </p>
    </div>
  );
}
