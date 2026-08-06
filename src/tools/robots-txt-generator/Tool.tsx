"use client";

import * as React from "react";
import { Info, Plus, TriangleAlert, X } from "lucide-react";

import { CodeOutput } from "@/components/shared/CodeOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  blankGroup,
  commonAgents,
  generateRobotsTxt,
  presets,
  validate,
  type RuleGroup,
} from "./logic";

export default function RobotsTxtGeneratorTool() {
  // Group ids are deterministic, so the default set can be the initial state —
  // no effect, and no hydration mismatch.
  const [groups, setGroups] = React.useState<RuleGroup[]>(() => presets[0].build());
  const [sitemapUrl, setSitemapUrl] = React.useState("");
  const [host, setHost] = React.useState("");
  const [presetId, setPresetId] = React.useState("allow-all");

  const config = React.useMemo(
    () => ({ groups, sitemapUrl, host }),
    [groups, sitemapUrl, host],
  );
  const output = React.useMemo(() => generateRobotsTxt(config), [config]);
  const warnings = React.useMemo(() => validate(config), [config]);

  const updateGroup = (id: string, patch: Partial<RuleGroup>) =>
    setGroups((current) =>
      current.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)),
    );

  return (
    <div className="space-y-5">
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-foreground">Start from a preset</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              role="radio"
              aria-checked={presetId === preset.id}
              onClick={() => {
                setPresetId(preset.id);
                setGroups(preset.build());
              }}
              className={cn(
                "surface-card cursor-pointer p-4 text-left",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                presetId === preset.id
                  ? "border-border-strong bg-surface-hover"
                  : "hover:border-border-strong",
              )}
            >
              <span className="text-sm font-medium text-foreground">{preset.label}</span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                {preset.description}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">Rule groups</h2>

        {groups.map((rule, index) => (
          <div key={rule.id} className="surface-card space-y-4 p-5">
            <div className="flex items-end gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <Label htmlFor={`agent-${rule.id}`}>User-agent</Label>
                <Input
                  id={`agent-${rule.id}`}
                  value={rule.userAgent}
                  onChange={(event) => updateGroup(rule.id, { userAgent: event.target.value })}
                  list="robots-agents"
                  className="font-mono"
                  spellCheck={false}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setGroups((current) => current.filter((entry) => entry.id !== rule.id))}
                disabled={groups.length <= 1}
                aria-label={`Remove rule group ${index + 1}`}
              >
                <X strokeWidth={1.75} />
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`disallow-${rule.id}`}>Disallow (one path per line)</Label>
                <Textarea
                  id={`disallow-${rule.id}`}
                  value={rule.disallow}
                  onChange={(event) => updateGroup(rule.id, { disallow: event.target.value })}
                  placeholder={"/admin/\n/cart/"}
                  className="min-h-24 font-mono text-sm"
                  spellCheck={false}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`allow-${rule.id}`}>Allow (exceptions)</Label>
                <Textarea
                  id={`allow-${rule.id}`}
                  value={rule.allow}
                  onChange={(event) => updateGroup(rule.id, { allow: event.target.value })}
                  placeholder="/admin/public/"
                  className="min-h-24 font-mono text-sm"
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`delay-${rule.id}`}>Crawl-delay (seconds, 0 to omit)</Label>
              <Input
                id={`delay-${rule.id}`}
                type="number"
                min={0}
                max={120}
                value={rule.crawlDelay}
                onChange={(event) =>
                  updateGroup(rule.id, { crawlDelay: Number(event.target.value) || 0 })
                }
                className="max-w-32"
              />
              <FieldHint>Google ignores Crawl-delay; Bing and Yandex honour it.</FieldHint>
            </div>
          </div>
        ))}

        <datalist id="robots-agents">
          {commonAgents.map((agent) => (
            <option key={agent} value={agent} />
          ))}
        </datalist>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setGroups((current) => [...current, blankGroup()])}
        >
          <Plus strokeWidth={1.75} />
          Add rule group
        </Button>
      </section>

      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="robots-sitemap">Sitemap URL</Label>
          <Input
            id="robots-sitemap"
            type="url"
            value={sitemapUrl}
            onChange={(event) => setSitemapUrl(event.target.value)}
            placeholder="https://example.com/sitemap.xml"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="robots-host">Preferred host (optional)</Label>
          <Input
            id="robots-host"
            value={host}
            onChange={(event) => setHost(event.target.value)}
            placeholder="example.com"
          />
        </div>
      </div>

      {warnings.length > 0 ? (
        <ul className="space-y-2">
          {warnings.map((warning, index) => (
            <li
              key={index}
              className={cn(
                "flex items-start gap-2 rounded-md border px-4 py-3 text-sm",
                warning.level === "error"
                  ? "border-[color-mix(in_oklab,var(--destructive)_30%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] text-destructive"
                  : "border-border bg-surface text-muted-foreground",
              )}
            >
              {warning.level === "error" ? (
                <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
              ) : (
                <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
              )}
              <span>{warning.message}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <CodeOutput value={output} label="robots.txt" fileName="robots.txt" />

      <p className="text-sm text-muted-foreground">
        Put this at <code className="font-mono">https://yourdomain.com/robots.txt</code> — it only
        works at the root. Note that robots.txt is a <em>request</em>, not access control: it stops
        well-behaved crawlers indexing a path, but the page is still publicly reachable. Use{" "}
        <code className="font-mono">noindex</code> or real authentication for anything that
        matters.
      </p>
    </div>
  );
}
