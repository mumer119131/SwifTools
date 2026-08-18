"use client";

import * as React from "react";
import { AlertTriangle, Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SCHEMAS, build, missingRequired, toScriptTag, type SchemaType, type Values } from "./logic";

const DEFAULTS: Partial<Record<SchemaType, Values>> = {
  Article: {
    headline: "How image compression actually works",
    author: "Ada Lovelace",
    datePublished: "2026-08-18",
  },
  FAQPage: {
    faq: "Is it free?\nYes, every tool is free with no account and no limits.\nAre my files uploaded?\nNo — almost every tool runs entirely in your browser.",
  },
  BreadcrumbList: {
    crumbs: "Home\nhttps://example.com/\nGuides\nhttps://example.com/guides",
  },
};

export default function SchemaGeneratorTool() {
  const [type, setType] = React.useState<SchemaType>("Article");
  const [values, setValues] = React.useState<Values>(DEFAULTS.Article ?? {});

  const schema = SCHEMAS.find((entry) => entry.id === type)!;
  const missing = missingRequired(type, values);
  const json = build(type, values);
  const output = toScriptTag(json);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">Type</span>
        <Tabs
          value={type}
          onValueChange={(next) => {
            setType(next as SchemaType);
            setValues(DEFAULTS[next as SchemaType] ?? {});
          }}
        >
          <TabsList>
            {SCHEMAS.map((entry) => (
              <TabsTrigger key={entry.id} value={entry.id}>
                {entry.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <FieldHint>{schema.note}</FieldHint>
      </div>

      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        {schema.fields.map((field) => {
          const isBlock = field.multiline || field.list || field.pairs;
          return (
            <div
              key={field.key}
              className={cn(isBlock ? "sm:col-span-2" : "", "space-y-2")}
            >
              <Label htmlFor={`sc-${field.key}`}>
                {field.label}
                {field.required ? (
                  <span className="ml-1 text-destructive" aria-hidden="true">
                    *
                  </span>
                ) : null}
              </Label>
              {isBlock ? (
                <Textarea
                  id={`sc-${field.key}`}
                  value={values[field.key] ?? ""}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, [field.key]: event.target.value }))
                  }
                  rows={field.pairs ? 8 : 4}
                  placeholder={field.placeholder}
                  className="text-sm"
                />
              ) : (
                <Input
                  id={`sc-${field.key}`}
                  value={values[field.key] ?? ""}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, [field.key]: event.target.value }))
                  }
                  placeholder={field.placeholder}
                />
              )}
              {field.hint ? <FieldHint>{field.hint}</FieldHint> : null}
            </div>
          );
        })}
      </div>

      {missing.length > 0 ? (
        <p className="flex items-start gap-2 rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
          <span>
            Still needed: {missing.join(", ")}. The block is generated below regardless, but Google
            will not treat it as eligible for a rich result without these.
          </span>
        </p>
      ) : null}

      <section className="surface-card overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
          <h2 className="text-sm font-medium text-foreground">Paste this into your head</h2>
          <div className="flex gap-2">
            <CopyButton value={output} label="Copy script tag" />
            <CopyButton value={JSON.stringify(json, null, 2)} label="Copy JSON" />
          </div>
        </header>
        <pre className="overflow-x-auto px-5 py-4 font-mono text-xs leading-relaxed text-muted-foreground">
          {output}
        </pre>
      </section>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Empty fields are dropped rather than emitted as null — a property
          present but empty is worse than one absent, because a validator flags
          it and Google treats a malformed block as untrusted rather than
          partly useful. Only mark up what a visitor can actually see on the
          page: invented ratings, invisible FAQs and prices you are not charging
          are a manual-action offence, and the penalty applies to the whole site
          rather than the one page. Check the result in Google&rsquo;s Rich
          Results Test before shipping.
        </span>
      </p>
    </div>
  );
}
