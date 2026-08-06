"use client";

import * as React from "react";

import { CodeOutput } from "@/components/shared/CodeOutput";
import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
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
import { defaultOptions, slugifyAll, type SlugOptions } from "./logic";

const SAMPLE = `Café Münster — 10 Best Coffees in 2026!
How to Build a Website (A Beginner's Guide)
Résumé & CV Templates @ 50% off
Café Münster — 10 Best Coffees in 2026!`;

export default function UrlSlugGeneratorTool() {
  const [input, setInput] = React.useState("");
  const [options, setOptions] = React.useState<SlugOptions>(defaultOptions);

  const rows = React.useMemo(() => slugifyAll(input, options), [input, options]);
  const output = rows.map((row) => row.slug).join("\n");
  const deduped = rows.filter((row) => row.deduplicated).length;

  const update = <K extends keyof SlugOptions>(key: K, value: SlugOptions[K]) =>
    setOptions((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="slug-input">Titles — one per line</Label>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setInput(SAMPLE)} disabled={!!input}>
              Use sample
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setInput("")} disabled={!input}>
              Clear
            </Button>
          </div>
        </div>
        <Textarea
          id="slug-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="How to Build a Website (A Beginner's Guide)"
          className="min-h-40"
          spellCheck={false}
        />
      </div>

      <section className="surface-card grid gap-5 p-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="slug-separator">Separator</Label>
          <Select
            value={options.separator}
            onValueChange={(value) => update("separator", value as SlugOptions["separator"])}
          >
            <SelectTrigger id="slug-separator">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-">Hyphen — recommended</SelectItem>
              <SelectItem value="_">Underscore</SelectItem>
              <SelectItem value=".">Dot</SelectItem>
            </SelectContent>
          </Select>
          <FieldHint>
            Google treats hyphens as word separators and underscores as joiners, so hyphens are the
            SEO-safe default.
          </FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug-length">Maximum length</Label>
          <Input
            id="slug-length"
            type="number"
            inputMode="numeric"
            min={0}
            max={200}
            value={options.maxLength}
            onChange={(event) => update("maxLength", Number(event.target.value) || 0)}
          />
          <FieldHint>Truncates at a word boundary. 0 disables the limit.</FieldHint>
        </div>

        <div className="space-y-3 sm:col-span-2">
          {[
            { key: "lowercase" as const, label: "Lowercase everything" },
            {
              key: "removeStopWords" as const,
              label: "Drop filler words (a, the, of…)",
            },
            { key: "deduplicate" as const, label: "Number duplicate slugs" },
          ].map((toggle) => (
            <div key={toggle.key} className="flex items-center gap-3">
              <Switch
                id={`slug-${toggle.key}`}
                checked={options[toggle.key]}
                onCheckedChange={(value) => update(toggle.key, value)}
              />
              <Label htmlFor={`slug-${toggle.key}`}>{toggle.label}</Label>
            </div>
          ))}
        </div>
      </section>

      {deduped > 0 ? (
        <Badge variant="outline">
          <span data-numeric>{deduped}</span> duplicate {deduped === 1 ? "slug" : "slugs"} numbered
        </Badge>
      ) : null}

      {rows.length > 0 ? (
        <section className="surface-card overflow-hidden">
          <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
            <span data-numeric>{formatNumber(rows.length)}</span>{" "}
            {rows.length === 1 ? "slug" : "slugs"}
          </h2>
          <ul className="max-h-96 divide-y divide-border overflow-y-auto">
            {rows.map((row, index) => (
              <li key={index} className="flex items-center gap-3 px-5 py-2.5">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs text-subtle-foreground">{row.source}</span>
                  <span className="block truncate font-mono text-sm text-foreground">
                    /{row.slug || <em className="text-destructive">empty</em>}
                  </span>
                </span>
                <CopyButton value={row.slug} iconOnly label={`Copy ${row.slug}`} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <CodeOutput
        value={output}
        label="All slugs"
        fileName="slugs.txt"
        placeholder="Paste some titles above."
      />

      <p className="text-sm text-muted-foreground">
        Accents are folded rather than stripped — &ldquo;Café Münster&rdquo; becomes{" "}
        <code className="font-mono">cafe-munster</code>, not <code className="font-mono">caf-mnster</code>.
        Symbols with a conventional reading are spelled out, so <code className="font-mono">&amp;</code>{" "}
        becomes &ldquo;and&rdquo; and <code className="font-mono">50%</code> becomes
        &ldquo;50-percent&rdquo;.
      </p>
    </div>
  );
}
