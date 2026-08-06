"use client";

import * as React from "react";
import { Check, TriangleAlert } from "lucide-react";

import { CodeOutput } from "@/components/shared/CodeOutput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { displayUrl, generateTags, lengthState, limits, type MetaInput } from "./logic";

export default function MetaTagGeneratorTool() {
  const [input, setInput] = React.useState<MetaInput>({
    title: "",
    description: "",
    url: "",
    siteName: "",
    imageUrl: "",
    imageAlt: "",
    author: "",
    keywords: "",
    twitterHandle: "",
    cardType: "summary_large_image",
    locale: "en_US",
    robotsIndex: true,
  });

  const update = <K extends keyof MetaInput>(key: K, value: MetaInput[K]) =>
    setInput((current) => ({ ...current, [key]: value }));

  const tags = React.useMemo(() => generateTags(input), [input]);

  const titleState = lengthState(input.title, limits.title);
  const descriptionState = lengthState(input.description, limits.description);

  return (
    <div className="space-y-5">
      <section className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="meta-title" required>
              Page title
            </Label>
            <LengthBadge value={input.title.length} limit={limits.title} state={titleState} />
          </div>
          <Input
            id="meta-title"
            value={input.title}
            onChange={(event) => update("title", event.target.value)}
            placeholder="Free Online PDF Tools — Merge, Split and Compress"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="meta-description" required>
              Meta description
            </Label>
            <LengthBadge
              value={input.description.length}
              limit={limits.description}
              state={descriptionState}
            />
          </div>
          <Textarea
            id="meta-description"
            value={input.description}
            onChange={(event) => update("description", event.target.value)}
            placeholder="Merge, split and compress PDFs in your browser. Free, no signup, and your files never leave your device."
            className="min-h-24"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta-url">Canonical URL</Label>
          <Input
            id="meta-url"
            type="url"
            value={input.url}
            onChange={(event) => update("url", event.target.value)}
            placeholder="https://example.com/pdf-tools"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta-site">Site name</Label>
          <Input
            id="meta-site"
            value={input.siteName}
            onChange={(event) => update("siteName", event.target.value)}
            placeholder="Example"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta-image">Social image URL</Label>
          <Input
            id="meta-image"
            type="url"
            value={input.imageUrl}
            onChange={(event) => update("imageUrl", event.target.value)}
            placeholder="https://example.com/og.png"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta-image-alt">Image alt text</Label>
          <Input
            id="meta-image-alt"
            value={input.imageAlt}
            onChange={(event) => update("imageAlt", event.target.value)}
            placeholder="Screenshot of the PDF tools page"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta-author">Author</Label>
          <Input
            id="meta-author"
            value={input.author}
            onChange={(event) => update("author", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta-twitter">X / Twitter handle</Label>
          <Input
            id="meta-twitter"
            value={input.twitterHandle}
            onChange={(event) => update("twitterHandle", event.target.value)}
            placeholder="@example"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta-card">Twitter card type</Label>
          <Select
            value={input.cardType}
            onValueChange={(value) => update("cardType", value as MetaInput["cardType"])}
          >
            <SelectTrigger id="meta-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary_large_image">Large image</SelectItem>
              <SelectItem value="summary">Summary (small thumbnail)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta-locale">Locale</Label>
          <Input
            id="meta-locale"
            value={input.locale}
            onChange={(event) => update("locale", event.target.value)}
            placeholder="en_US"
          />
        </div>

        <div className="flex items-center gap-3 sm:col-span-2">
          <Switch
            id="meta-robots"
            checked={input.robotsIndex}
            onCheckedChange={(value) => update("robotsIndex", value)}
          />
          <Label htmlFor="meta-robots">Allow search engines to index this page</Label>
        </div>
      </section>

      {/* Search result preview */}
      <section className="space-y-2">
        <h2 className="text-sm font-medium text-foreground">Google result preview</h2>
        <div className="surface-card p-5">
          <p className="truncate text-xs text-muted-foreground">{displayUrl(input.url)}</p>
          <p className="mt-1 truncate text-lg text-[#1a0dab] dark:text-[#8ab4f8]">
            {input.title || "Your page title appears here"}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {input.description ||
              "Your meta description appears here. Search engines often rewrite it, but a good one still helps click-through."}
          </p>
        </div>
      </section>

      {/* Social card preview */}
      <section className="space-y-2">
        <h2 className="text-sm font-medium text-foreground">Social card preview</h2>
        <div className="surface-card max-w-lg overflow-hidden p-0">
          {input.imageUrl ? (
            // A user-supplied remote URL can't be run through next/image without
            // configuring every possible host, so a plain img is correct here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={input.imageUrl}
              alt={input.imageAlt || ""}
              className="aspect-[1200/630] w-full border-b border-border object-cover"
            />
          ) : (
            <div className="grid aspect-[1200/630] w-full place-items-center border-b border-border bg-surface-hover text-xs text-subtle-foreground">
              Social image preview
            </div>
          )}
          <div className="p-4">
            <p className="truncate text-xs uppercase text-subtle-foreground">
              {input.siteName || displayUrl(input.url).split(" › ")[0]}
            </p>
            <p className="mt-1 truncate text-sm font-medium text-foreground">
              {input.title || "Your page title"}
            </p>
            <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
              {input.description || "Your description"}
            </p>
          </div>
        </div>
      </section>

      <CodeOutput
        value={tags}
        label="Generated tags"
        fileName="meta-tags.html"
        mimeType="text/html;charset=utf-8"
      />

      <p className="text-sm text-muted-foreground">
        Length limits are approximate — search engines truncate on pixel width, not characters, so a
        title full of wide capitals cuts off sooner than the count suggests. Google also rewrites
        descriptions for around two thirds of results; a good one is still worth writing, because
        it is used when it matches the query.
      </p>
    </div>
  );
}

function LengthBadge({
  value,
  limit,
  state,
}: {
  value: number;
  limit: number;
  state: ReturnType<typeof lengthState>;
}) {
  if (state === "empty") return null;

  return (
    <span
      className={cn(
        "flex items-center gap-1.5 font-mono text-xs",
        state === "long" ? "text-destructive" : state === "good" ? "text-success" : "text-muted-foreground",
      )}
      data-numeric
    >
      {/* Icon carries the state alongside colour. */}
      {state === "long" ? (
        <TriangleAlert className="size-3.5" strokeWidth={2} aria-hidden="true" />
      ) : state === "good" ? (
        <Check className="size-3.5" strokeWidth={2} aria-hidden="true" />
      ) : null}
      {value}/{limit}
      {state === "long" ? " — may be truncated" : state === "short" ? " — could be longer" : ""}
    </span>
  );
}
