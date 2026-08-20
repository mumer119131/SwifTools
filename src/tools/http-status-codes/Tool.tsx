"use client";

import * as React from "react";
import { Info, Search } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CONFUSIONS, STATUS_CLASSES, classOf, findCode, search } from "./logic";

const CLASS_TINT: Record<string, string> = {
  "1xx": "text-muted-foreground",
  "2xx": "text-[var(--success)]",
  "3xx": "text-[var(--accent-converter)]",
  "4xx": "text-[var(--warning)]",
  "5xx": "text-destructive",
};

export default function HttpStatusCodesTool() {
  const [query, setQuery] = React.useState("");

  const trimmed = query.trim();
  const results = search(trimmed);

  // A number that is a valid status but not in the list still deserves an answer.
  const numeric = Number(trimmed);
  const unlisted =
    /^\d{3}$/.test(trimmed) && findCode(numeric) === null ? classOf(numeric) : null;

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.75}
        />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="404, teapot, redirect…"
          className="pl-9"
          spellCheck={false}
          aria-label="Search status codes"
        />
      </div>

      {unlisted ? (
        <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          <span>
            <span className="font-mono text-foreground">{numeric}</span> is not a
            standard code, but it is in the {unlisted.range} range —{" "}
            {unlisted.name.toLowerCase()}. {unlisted.summary} Servers and CDNs do
            define their own codes in these ranges.
          </span>
        </p>
      ) : null}

      {trimmed !== "" ? (
        results.length > 0 ? (
          <ul className="space-y-2">
            {results.map((status) => {
              const group = classOf(status.code)!;
              return (
                <li key={status.code} className="surface-card p-4">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span
                      className={cn("font-mono text-xl", CLASS_TINT[group.range])}
                      data-numeric
                    >
                      {status.code}
                    </span>
                    <span className="text-sm font-medium text-foreground">{status.name}</span>
                    <span className="ml-auto">
                      <CopyButton value={`${status.code} ${status.name}`} iconOnly />
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{status.meaning}</p>
                  {status.detail ? (
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {status.detail}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
            Nothing matches that.
          </p>
        )
      ) : (
        <>
          <section>
            <h2 className="text-sm font-medium text-foreground">The pairs people confuse</h2>
            <dl className="mt-3 space-y-3">
              {CONFUSIONS.map((entry) => (
                <div key={entry.pair} className="border-l-2 border-border pl-4">
                  <dt className="font-mono text-sm text-foreground">{entry.pair}</dt>
                  <dd className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    {entry.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {STATUS_CLASSES.map((group) => (
            <section key={group.range}>
              <h2 className="flex items-baseline gap-3 text-sm font-medium text-foreground">
                <span className={cn("font-mono", CLASS_TINT[group.range])}>{group.range}</span>
                {group.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{group.summary}</p>
              <ul className="mt-3 divide-y divide-border rounded-md border border-border">
                {group.codes.map((status) => (
                  <li key={status.code} className="flex flex-wrap gap-x-4 gap-y-1 px-4 py-2.5 text-sm">
                    <span
                      className={cn("w-10 shrink-0 font-mono", CLASS_TINT[group.range])}
                      data-numeric
                    >
                      {status.code}
                    </span>
                    <span className="w-44 shrink-0 text-foreground">{status.name}</span>
                    <span className="min-w-0 flex-1 text-muted-foreground">{status.meaning}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
