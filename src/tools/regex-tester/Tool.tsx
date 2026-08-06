"use client";

import * as React from "react";
import { TriangleAlert } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/misc";
import { cn, formatNumber } from "@/lib/utils";
import { applyReplacement, availableFlags, runRegex, toSegments } from "./logic";

const SAMPLE_TEXT = `Contact: ada@example.com and grace@navy.mil
Backup: hopper+work@example.co.uk`;

export default function RegexTesterTool() {
  const [pattern, setPattern] = React.useState("\\b[\\w.+-]+@[\\w-]+\\.[\\w.]+\\b");
  const [flags, setFlags] = React.useState("g");
  const [input, setInput] = React.useState(SAMPLE_TEXT);
  const [replacement, setReplacement] = React.useState("");

  const result = React.useMemo(() => runRegex(pattern, flags, input), [pattern, flags, input]);

  const segments = React.useMemo(
    () => (result.ok ? toSegments(input, result.matches) : []),
    [result, input],
  );

  const replaced = React.useMemo(
    () => (result.ok && replacement ? applyReplacement(pattern, flags, input, replacement) : ""),
    [result.ok, replacement, pattern, flags, input],
  );

  function toggleFlag(flag: string) {
    setFlags((current) =>
      current.includes(flag) ? current.replace(flag, "") : current + flag,
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="regex-pattern">Pattern</Label>
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg text-subtle-foreground" aria-hidden="true">
            /
          </span>
          <Input
            id="regex-pattern"
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            placeholder="\\d{4}-\\d{2}-\\d{2}"
            className="font-mono"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-invalid={!result.ok}
          />
          <span className="font-mono text-lg text-subtle-foreground" aria-hidden="true">
            /{flags}
          </span>
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">Flags</legend>
        <div className="flex flex-wrap gap-2">
          {availableFlags.map((entry) => {
            const active = flags.includes(entry.flag);
            return (
              <button
                key={entry.flag}
                type="button"
                role="switch"
                aria-checked={active}
                onClick={() => toggleFlag(entry.flag)}
                title={entry.hint}
                className={cn(
                  "inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-sm",
                  "transition-colors duration-[180ms] ease-out-expo",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                  active
                    ? "border-border-strong bg-surface-hover text-foreground"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="font-mono">{entry.flag}</span>
                <span className="text-xs">{entry.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {!result.ok ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md border border-[color-mix(in_oklab,var(--destructive)_30%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-destructive"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          <span>{result.error}</span>
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="regex-input">Test text</Label>
        <Textarea
          id="regex-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="min-h-40 font-mono text-sm"
          spellCheck={false}
        />
      </div>

      {result.ok ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={result.matches.length > 0 ? "success" : "default"}>
              <span data-numeric>{formatNumber(result.matches.length)}</span>{" "}
              {result.matches.length === 1 ? "match" : "matches"}
            </Badge>
            {result.truncated ? <Badge variant="outline">Showing the first 500</Badge> : null}
          </div>

          <section className="space-y-2">
            <h2 className="text-sm font-medium text-foreground">Highlighted</h2>
            <p className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-surface p-4 font-mono text-[0.8125rem] leading-relaxed">
              {segments.length > 0 ? (
                segments.map((segment, index) =>
                  segment.isMatch ? (
                    <mark
                      key={index}
                      className="rounded bg-[color-mix(in_oklab,var(--success)_28%,transparent)] px-0.5 text-foreground"
                    >
                      {segment.text}
                    </mark>
                  ) : (
                    <span key={index} className="text-muted-foreground">
                      {segment.text}
                    </span>
                  ),
                )
              ) : (
                <span className="text-subtle-foreground">No matches.</span>
              )}
            </p>
          </section>

          {result.matches.length > 0 ? (
            <section className="surface-card overflow-hidden">
              <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
                Matches and capture groups
              </h2>
              <ul className="max-h-80 divide-y divide-border overflow-y-auto">
                {result.matches.slice(0, 50).map((match, index) => (
                  <li key={`${match.index}-${index}`} className="px-5 py-3">
                    <div className="flex items-baseline gap-3">
                      <span
                        className="shrink-0 font-mono text-xs text-subtle-foreground"
                        data-numeric
                      >
                        @{match.index}
                      </span>
                      <span className="min-w-0 break-all font-mono text-sm text-foreground">
                        {match.text || <em className="text-subtle-foreground">(empty match)</em>}
                      </span>
                    </div>
                    {match.groups.length > 0 ? (
                      <dl className="mt-2 space-y-1">
                        {match.groups.map((group) => (
                          <div key={group.name} className="flex gap-3 text-xs">
                            <dt className="w-16 shrink-0 font-mono text-subtle-foreground">
                              ${group.name}
                            </dt>
                            <dd className="min-w-0 break-all font-mono text-muted-foreground">
                              {group.value ?? <em>undefined</em>}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="regex-replace">Replace with</Label>
            <Input
              id="regex-replace"
              value={replacement}
              onChange={(event) => setReplacement(event.target.value)}
              placeholder="[redacted] — or use $1, $2, $&amp; for groups"
              className="font-mono"
              spellCheck={false}
            />
            <FieldHint>
              Use <code className="font-mono">$1</code> for the first capture group,{" "}
              <code className="font-mono">$&amp;</code> for the whole match, and{" "}
              <code className="font-mono">$&lt;name&gt;</code> for named groups.
            </FieldHint>
          </div>

          {replacement ? (
            <section className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-medium text-foreground">Replacement preview</h2>
                <CopyButton value={replaced} label="Copy" />
              </div>
              <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-surface p-4 font-mono text-[0.8125rem] leading-relaxed text-foreground">
                <code>{replaced}</code>
              </pre>
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
