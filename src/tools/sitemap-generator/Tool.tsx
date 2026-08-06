"use client";

import * as React from "react";
import { TriangleAlert } from "lucide-react";

import { CodeOutput } from "@/components/shared/CodeOutput";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/misc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNumber } from "@/lib/utils";
import { useClientValue } from "@/lib/use-client-value";
import { buildSitemap, changeFrequencies, todayIso, type ChangeFrequency } from "./logic";

export default function SitemapGeneratorTool() {
  const [urls, setUrls] = React.useState("");
  const [baseUrl, setBaseUrl] = React.useState("https://example.com");
  const today = useClientValue(todayIso, "");
  const [lastModOverride, setLastModOverride] = React.useState<string | null>(null);
  const lastModified = lastModOverride ?? today;
  const setLastModified = setLastModOverride;
  const [changeFrequency, setChangeFrequency] = React.useState<ChangeFrequency>("weekly");
  const [priority, setPriority] = React.useState("0.8");
  const [includeLastMod, setIncludeLastMod] = React.useState(true);
  const [includeChangeFreq, setIncludeChangeFreq] = React.useState(true);
  const [includePriority, setIncludePriority] = React.useState(true);

  const result = React.useMemo(
    () =>
      buildSitemap(urls, {
        baseUrl,
        lastModified,
        changeFrequency,
        priority,
        includeLastMod,
        includeChangeFreq,
        includePriority,
      }),
    [urls, baseUrl, lastModified, changeFrequency, priority, includeLastMod, includeChangeFreq, includePriority],
  );

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="sitemap-base">Base URL</Label>
        <Input
          id="sitemap-base"
          type="url"
          value={baseUrl}
          onChange={(event) => setBaseUrl(event.target.value)}
          placeholder="https://example.com"
          className="max-w-md"
        />
        <FieldHint>Used to resolve relative paths. Absolute URLs are left as they are.</FieldHint>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sitemap-urls">URLs — one per line</Label>
        <Textarea
          id="sitemap-urls"
          value={urls}
          onChange={(event) => setUrls(event.target.value)}
          placeholder={"/\n/about\n/pricing\nhttps://example.com/blog/first-post"}
          className="min-h-56 font-mono text-sm"
          spellCheck={false}
        />
      </div>

      <section className="surface-card grid gap-5 p-5 sm:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Switch id="inc-lastmod" checked={includeLastMod} onCheckedChange={setIncludeLastMod} />
            <Label htmlFor="inc-lastmod">Include lastmod</Label>
          </div>
          <Input
            type="date"
            value={lastModified}
            onChange={(event) => setLastModified(event.target.value)}
            disabled={!includeLastMod}
            aria-label="Last modified date"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Switch
              id="inc-changefreq"
              checked={includeChangeFreq}
              onCheckedChange={setIncludeChangeFreq}
            />
            <Label htmlFor="inc-changefreq">Include changefreq</Label>
          </div>
          <Select
            value={changeFrequency}
            onValueChange={(value) => setChangeFrequency(value as ChangeFrequency)}
            disabled={!includeChangeFreq}
          >
            <SelectTrigger aria-label="Change frequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {changeFrequencies.map((frequency) => (
                <SelectItem key={frequency} value={frequency}>
                  {frequency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Switch
              id="inc-priority"
              checked={includePriority}
              onCheckedChange={setIncludePriority}
            />
            <Label htmlFor="inc-priority">Include priority</Label>
          </div>
          <Select value={priority} onValueChange={setPriority} disabled={!includePriority}>
            <SelectTrigger aria-label="Priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["1.0", "0.8", "0.6", "0.5", "0.3"].map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={result.urlCount > 0 ? "success" : "default"}>
          <span data-numeric>{formatNumber(result.urlCount)}</span>{" "}
          {result.urlCount === 1 ? "URL" : "URLs"}
        </Badge>
        {result.skipped.length > 0 ? (
          <Badge variant="outline">
            <span data-numeric>{result.skipped.length}</span> skipped
          </Badge>
        ) : null}
      </div>

      {result.exceedsLimit ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md border border-[color-mix(in_oklab,var(--destructive)_30%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-destructive"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          <span>
            A single sitemap may contain at most 50,000 URLs and must be under 50 MB uncompressed.
            Split this into several files and list them in a sitemap index.
          </span>
        </p>
      ) : null}

      {result.skipped.length > 0 ? (
        <details className="surface-card p-5">
          <summary className="cursor-pointer text-sm font-medium text-foreground">
            {result.skipped.length} line{result.skipped.length === 1 ? "" : "s"} couldn&rsquo;t be
            resolved
          </summary>
          <ul className="mt-3 space-y-1 font-mono text-xs text-muted-foreground">
            {result.skipped.slice(0, 20).map((line, index) => (
              <li key={index} className="break-all">
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Set a base URL so relative paths can be resolved, or paste full URLs.
          </p>
        </details>
      ) : null}

      <CodeOutput
        value={result.xml}
        label="sitemap.xml"
        fileName="sitemap.xml"
        mimeType="application/xml"
        placeholder="Paste some URLs above to generate the sitemap."
      />

      <p className="text-sm text-muted-foreground">
        Google ignores <code className="font-mono">priority</code> and largely ignores{" "}
        <code className="font-mono">changefreq</code> — they were part of the original spec but are
        no longer ranking or crawl signals. <code className="font-mono">lastmod</code> is still
        used, so keep it accurate: an always-today timestamp on unchanged pages teaches crawlers to
        distrust it.
      </p>
    </div>
  );
}
