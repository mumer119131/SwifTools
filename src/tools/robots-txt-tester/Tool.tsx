"use client";

import * as React from "react";
import { AlertTriangle, Ban, Check, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AGENTS, SAMPLE, parse, test } from "./logic";

export default function RobotsTxtTesterTool() {
  const [content, setContent] = React.useState(SAMPLE);
  const [path, setPath] = React.useState("/api/public/rates");
  const [agent, setAgent] = React.useState("Googlebot");

  const parsed = parse(content);
  const verdict = test(parsed, agent, path);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="rt-content">Your robots.txt</Label>
          <Textarea
            id="rt-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={16}
            spellCheck={false}
            className="font-mono text-sm"
          />
          <FieldHint>
            Paste it rather than fetching, so you can test a version before publishing it.
          </FieldHint>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rt-path">URL or path to test</Label>
            <Input
              id="rt-path"
              value={path}
              onChange={(event) => setPath(event.target.value)}
              placeholder="/admin/settings"
              className="font-mono"
              spellCheck={false}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rt-agent">Crawler</Label>
            <Input
              id="rt-agent"
              value={agent}
              onChange={(event) => setAgent(event.target.value)}
              className="font-mono"
              spellCheck={false}
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {AGENTS.map((entry) => (
                <Button
                  key={entry}
                  variant={agent === entry ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAgent(entry)}
                >
                  {entry}
                </Button>
              ))}
            </div>
          </div>

          <div
            className={cn(
              "surface-card p-6 text-center",
              verdict.allowed
                ? "border-[color-mix(in_oklab,var(--success)_45%,var(--border))]"
                : "border-[color-mix(in_oklab,var(--destructive)_45%,var(--border))]",
            )}
            aria-live="polite"
          >
            <p className="flex items-center justify-center gap-2 text-2xl text-foreground">
              {verdict.allowed ? (
                <Check className="size-6 text-[var(--success)]" strokeWidth={2.5} />
              ) : (
                <Ban className="size-6 text-destructive" strokeWidth={2.5} />
              )}
              {verdict.allowed ? "Crawlable" : "Blocked"}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{verdict.reason}</p>
            {verdict.group ? (
              <p className="mt-2 text-xs text-subtle-foreground">
                Matched the group for{" "}
                <span className="font-mono">{verdict.group.agents.join(", ")}</span> —{" "}
                {verdict.group.rules.length} rule
                {verdict.group.rules.length === 1 ? "" : "s"}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {parsed.warnings.length > 0 ? (
        <section className="space-y-2">
          {parsed.warnings.map((warning) => (
            <p
              key={`${warning.line}-${warning.message}`}
              className="flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground"
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
              <span>
                <span className="font-mono text-xs">Line {warning.line}</span> — {warning.message}
              </span>
            </p>
          ))}
        </section>
      ) : null}

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-3 text-sm font-medium text-foreground">
          Groups found
        </h2>
        <ul className="divide-y divide-border">
          {parsed.groups.map((group, index) => {
            const active = group === verdict.group;
            return (
              <li
                key={index}
                className={cn("px-5 py-3", active && "bg-surface-hover")}
              >
                <p className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-mono text-foreground">{group.agents.join(", ")}</span>
                  {active ? (
                    <span className="rounded-full bg-[color-mix(in_oklab,var(--accent-seo,var(--foreground))_18%,transparent)] px-2 py-0.5 text-[11px] text-foreground">
                      applies to {agent}
                    </span>
                  ) : null}
                </p>
                <ul className="mt-1.5 space-y-0.5">
                  {group.rules.length === 0 ? (
                    <li className="text-xs text-subtle-foreground">No rules — nothing restricted.</li>
                  ) : (
                    group.rules.map((rule) => (
                      <li
                        key={rule.line}
                        className={cn(
                          "font-mono text-xs",
                          rule === verdict.rule ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {rule.type}: {rule.path || "(empty — allows everything)"}
                        {rule === verdict.rule ? " ← decided it" : ""}
                      </li>
                    ))
                  )}
                </ul>
              </li>
            );
          })}
          {parsed.groups.length === 0 ? (
            <li className="px-5 py-6 text-center text-sm text-muted-foreground">
              No User-agent groups found.
            </li>
          ) : null}
        </ul>
        {parsed.sitemaps.length > 0 ? (
          <div className="border-t border-border px-5 py-3">
            <p className="text-xs text-muted-foreground">
              {parsed.sitemaps.length} sitemap
              {parsed.sitemaps.length === 1 ? "" : "s"} declared
            </p>
          </div>
        ) : null}
      </section>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Precedence is by length, not order — the longest matching path wins
          wherever it appears, and Allow beats Disallow at equal length. And a
          crawler reads exactly one group: once a Googlebot section exists,
          Googlebot never looks at the <span className="font-mono">*</span>{" "}
          section again, so every rule it still needs must be repeated there.
          That single detail is behind most robots.txt files that do not do what
          their author believed.
        </span>
      </p>
    </div>
  );
}
