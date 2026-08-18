"use client";

import * as React from "react";
import { AlertTriangle, Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FIELDS, MEDIUM_PRESETS, build, validate, type Params } from "./logic";

export default function UtmBuilderTool() {
  const [params, setParams] = React.useState<Params>({
    url: "https://pockettoolz.com/tools",
    source: "newsletter",
    medium: "email",
    campaign: "spring-launch",
    term: "",
    content: "",
    id: "",
  });

  const url = build(params);
  const issues = validate(params);
  const errors = issues.filter((issue) => issue.level === "error");

  function set(key: keyof Params, value: string) {
    setParams((current) => ({ ...current, [key]: value }));
  }

  function issuesFor(field: keyof Params | "url") {
    return issues.filter((issue) => issue.field === field);
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="utm-url">Destination URL</Label>
        <Input
          id="utm-url"
          value={params.url}
          onChange={(event) => set("url", event.target.value)}
          placeholder="https://example.com/landing"
          className="font-mono"
          spellCheck={false}
          aria-invalid={issuesFor("url").some((issue) => issue.level === "error")}
        />
        {issuesFor("url").map((issue) => (
          <p
            key={issue.message}
            className={cn(
              "text-sm",
              issue.level === "error" ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {issue.message}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">Common combinations</span>
        <div className="flex flex-wrap gap-2">
          {MEDIUM_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              onClick={() =>
                setParams((current) => ({
                  ...current,
                  source: preset.source,
                  medium: preset.medium,
                }))
              }
            >
              {preset.label}
              <span className="font-mono text-xs text-subtle-foreground">{preset.medium}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {FIELDS.map((field) => {
          const fieldIssues = issuesFor(field.key);
          const hasError = fieldIssues.some((issue) => issue.level === "error");

          return (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={`utm-${field.key}`}>
                {field.label}
                {field.required ? (
                  <span className="ml-1 text-destructive" aria-hidden="true">
                    *
                  </span>
                ) : null}
                <span className="ml-1.5 font-mono text-xs text-subtle-foreground">
                  {field.param}
                </span>
              </Label>
              <Input
                id={`utm-${field.key}`}
                value={params[field.key]}
                onChange={(event) => set(field.key, event.target.value)}
                placeholder={field.example}
                className="font-mono text-sm"
                spellCheck={false}
                aria-invalid={hasError}
              />
              {fieldIssues.length > 0 ? (
                fieldIssues.map((issue) => (
                  <p
                    key={issue.message}
                    className={cn(
                      "text-xs leading-relaxed",
                      issue.level === "error" ? "text-destructive" : "text-[var(--warning)]",
                    )}
                  >
                    {issue.message}
                  </p>
                ))
              ) : (
                <FieldHint>{field.hint}</FieldHint>
              )}
            </div>
          );
        })}
      </div>

      {url && errors.length === 0 ? (
        <section className="surface-card overflow-hidden">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
            <h2 className="text-sm font-medium text-foreground">Your tagged URL</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground" data-numeric>
                {url.length} characters
              </span>
              <CopyButton value={url} label="Copy" />
            </div>
          </header>
          <p className="break-all px-5 py-4 font-mono text-sm text-foreground">{url}</p>
        </section>
      ) : (
        <p className="flex items-start gap-2 rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" strokeWidth={1.75} />
          Fill in the required fields to build the link. Source, medium and
          campaign are the three that decide whether this shows up as a campaign
          or as direct traffic.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Never put UTM parameters on internal links. Doing so overwrites the
          original source of the session, so a visitor who arrived from Google
          and then clicked a tagged link in your own nav is reported as coming
          from you — which is how sites end up believing their biggest referrer
          is themselves. Existing parameters on the URL are kept, and any
          utm_ values already present are replaced rather than duplicated.
        </span>
      </p>
    </div>
  );
}
