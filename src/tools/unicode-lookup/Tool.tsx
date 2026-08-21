"use client";

import * as React from "react";
import { Info, Search } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CURATED, inspect, parseInput, searchCurated } from "./logic";

export default function UnicodeLookupTool() {
  const [query, setQuery] = React.useState("→");

  const character = parseInput(query);
  const info = character ? inspect(character) : null;
  const matches = searchCurated(query);

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
          placeholder="Paste a character, or type U+00E9, 8364, or a name like em dash"
          className="pl-9 font-mono"
          spellCheck={false}
          aria-label="Character, code point or name"
        />
      </div>

      {info ? (
        <div className="surface-card overflow-hidden">
          <div className="flex flex-wrap items-center gap-6 border-b border-border p-6">
            <span
              className="grid size-24 shrink-0 place-items-center rounded-md border border-border bg-surface-hover text-foreground"
              style={{ fontSize: "3rem", lineHeight: 1 }}
            >
              {info.character}
            </span>
            <div className="min-w-0">
              <div className="font-mono text-2xl text-foreground">{info.notation}</div>
              <div className="mt-1 text-sm text-muted-foreground">{info.block}</div>
              <div className="mt-1 text-xs text-subtle-foreground" data-numeric>
                Code point {info.codePoint} · {info.utf8Bytes}{" "}
                {info.utf8Bytes === 1 ? "byte" : "bytes"} in UTF-8
              </div>
            </div>
          </div>

          <dl className="divide-y divide-border">
            {(
              [
                ["Character", info.character],
                ["Code point", info.notation],
                ["HTML entity", info.htmlNamed ? `${info.htmlNamed}  or  ${info.htmlEntity}` : info.htmlEntity],
                ["CSS", info.cssEscape],
                ["JavaScript", info.jsEscape],
                ["URL encoded", info.urlEncoded],
                ["UTF-8 bytes", info.utf8.join(" ")],
                ["UTF-16 units", info.utf16.join(" ")],
              ] as [string, string][]
            ).map(([label, value]) => (
              <div key={label} className="flex items-center gap-4 px-5 py-2.5 text-sm">
                <dt className="w-32 shrink-0 text-muted-foreground">{label}</dt>
                <dd className="min-w-0 flex-1 break-all font-mono text-foreground">{value}</dd>
                <CopyButton value={value} iconOnly />
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {matches.length > 0 ? (
        <section>
          <h2 className="text-sm font-medium text-foreground">Matching symbols</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {matches.map((entry) => (
              <li key={entry.character}>
                <button
                  type="button"
                  onClick={() => setQuery(entry.character)}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-border-strong"
                >
                  <span className="text-foreground">{entry.character}</span>
                  <span className="text-xs text-muted-foreground">{entry.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {CURATED.map((group) => (
        <section key={group.group}>
          <h2 className="text-sm font-medium text-foreground">{group.group}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {group.entries.map((entry) => (
              <li key={entry.character}>
                <button
                  type="button"
                  onClick={() => setQuery(entry.character)}
                  title={entry.name}
                  className={cn(
                    "grid size-11 place-items-center rounded-md border text-lg transition-colors",
                    character === entry.character
                      ? "border-border-strong bg-surface-hover text-foreground"
                      : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
                  )}
                >
                  {entry.character}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          A bare run of digits is read as a decimal code point and anything with
          a letter or a <code className="font-mono">U+</code> prefix as hex, since{" "}
          <code className="font-mono">8364</code> is ambiguous on its own. The
          byte count is worth noticing: an emoji costs four bytes in UTF-8 and
          two UTF-16 units, which is why it counts as two characters in some
          languages and breaks naive string truncation.
        </span>
      </p>
    </div>
  );
}
