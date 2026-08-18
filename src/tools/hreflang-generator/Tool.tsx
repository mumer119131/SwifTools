"use client";

import * as React from "react";
import { AlertTriangle, Info, Plus, X } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { COMMON, toLinkTags, toSitemapXml, validate, type Entry } from "./logic";

export default function HreflangGeneratorTool() {
  const [entries, setEntries] = React.useState<Entry[]>([
    { id: "a", lang: "en-GB", url: "https://example.com/" },
    { id: "b", lang: "en-US", url: "https://example.com/us/" },
    { id: "c", lang: "fr", url: "https://example.com/fr/" },
    { id: "d", lang: "x-default", url: "https://example.com/" },
  ]);
  const [format, setFormat] = React.useState<"tags" | "sitemap">("tags");

  const issues = validate(entries);
  const output = format === "tags" ? toLinkTags(entries) : toSitemapXml(entries);

  function update(id: string, patch: Partial<Entry>) {
    setEntries((current) => current.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  return (
    <div className="space-y-5">
      <section className="surface-card space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Language versions</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setEntries((current) => [
                ...current,
                { id: `e-${Date.now()}`, lang: "", url: "" },
              ])
            }
          >
            <Plus className="size-4" strokeWidth={1.75} />
            Add
          </Button>
        </div>

        {entries.map((entry) => (
          <div key={entry.id} className="flex flex-wrap items-end gap-3">
            <div className="w-40 space-y-1.5">
              <Label htmlFor={`hl-${entry.id}-lang`}>Code</Label>
              <Input
                id={`hl-${entry.id}-lang`}
                value={entry.lang}
                onChange={(event) => update(entry.id, { lang: event.target.value })}
                list="hreflang-codes"
                placeholder="en-GB"
                className="font-mono"
                spellCheck={false}
              />
            </div>
            <div className="min-w-56 flex-1 space-y-1.5">
              <Label htmlFor={`hl-${entry.id}-url`}>URL</Label>
              <Input
                id={`hl-${entry.id}-url`}
                value={entry.url}
                onChange={(event) => update(entry.id, { url: event.target.value })}
                placeholder="https://example.com/fr/"
                className="font-mono text-sm"
                spellCheck={false}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Remove this language"
              disabled={entries.length <= 2}
              onClick={() => setEntries((current) => current.filter((e) => e.id !== entry.id))}
            >
              <X className="size-4" strokeWidth={1.75} />
            </Button>
          </div>
        ))}

        <datalist id="hreflang-codes">
          {COMMON.map((code) => (
            <option key={code.code} value={code.code}>
              {code.label}
            </option>
          ))}
        </datalist>

        <FieldHint>
          Codes are language, optionally script, optionally country — en, zh-Hans, en-GB. The
          country part uses ISO 3166, which is why the UK is GB.
        </FieldHint>
      </section>

      {issues.length > 0 ? (
        <div className="space-y-2">
          {issues.map((issue) => (
            <p
              key={issue.message}
              className={cn(
                "flex items-start gap-2 rounded-md border px-4 py-3 text-sm text-foreground",
                issue.level === "error"
                  ? "border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)]"
                  : "border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)]",
              )}
            >
              <AlertTriangle
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  issue.level === "error" ? "text-destructive" : "text-[var(--warning)]",
                )}
                strokeWidth={1.75}
              />
              {issue.message}
            </p>
          ))}
        </div>
      ) : null}

      <div className="space-y-2">
        <Tabs value={format} onValueChange={(value) => setFormat(value as "tags" | "sitemap")}>
          <TabsList>
            <TabsTrigger value="tags">Link tags</TabsTrigger>
            <TabsTrigger value="sitemap">XML sitemap</TabsTrigger>
          </TabsList>
        </Tabs>
        <FieldHint>
          {format === "tags"
            ? "Goes in the head of every page in the set — each one must carry the full list, including itself."
            : "Declares every relationship once. The better choice past a handful of pages."}
        </FieldHint>
      </div>

      <section className="surface-card overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
          <h2 className="text-sm font-medium text-foreground">
            {format === "tags" ? "Paste into every page's head" : "sitemap.xml"}
          </h2>
          <CopyButton value={output} label="Copy" />
        </header>
        <pre className="overflow-x-auto px-5 py-4 font-mono text-xs leading-relaxed text-muted-foreground">
          {output || "Add at least one language version."}
        </pre>
      </section>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          hreflang only works if it is reciprocal: every page in the set must
          list every other, including itself. A page that is pointed at but does
          not point back is dropped from the set, and nothing reports it. The
          same silence applies to an invalid code —{" "}
          <span className="font-mono">en-UK</span> is the classic, since the ISO
          country code for the United Kingdom is GB, and Google discards the
          whole tag rather than guessing.
        </span>
      </p>
    </div>
  );
}
