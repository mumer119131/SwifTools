"use client";

import * as React from "react";
import { Info, RefreshCw } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GeneratorShellProps {
  /** Produces `count` results. Called on mount and on every regenerate. */
  generate: (count: number) => string[];
  defaultCount?: number;
  maxCount?: number;
  /** Shown above the count field, e.g. "How many nicknames". */
  countLabel: string;
  /** Rendered before the results — filters, style toggles and the like. */
  controls?: React.ReactNode;
  /** Bumping this regenerates, so controls can force a refresh. */
  refreshKey?: unknown;
  /** One result per card rather than a compact list. */
  spacious?: boolean;
  footnote: React.ReactNode;
}

/**
 * The shared shell for the text generators.
 *
 * Seven tools are the same interaction — set a count, press generate, copy the
 * results — so they share one implementation and behave identically rather than
 * each inventing its own layout and copy affordances.
 */
export function GeneratorShell({
  generate,
  defaultCount = 10,
  maxCount = 100,
  countLabel,
  controls,
  refreshKey,
  spacious = false,
  footnote,
}: GeneratorShellProps) {
  const [count, setCount] = React.useState(String(defaultCount));
  const [nonce, setNonce] = React.useState(0);

  // Results are derived, not stored: `nonce` and `refreshKey` are the only
  // things that make them change, which keeps the render pure.
  const results = React.useMemo(
    () => generate(Math.max(1, Math.min(maxCount, Number(count) || 1))),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- nonce and refreshKey are the refresh triggers
    [nonce, refreshKey, count, maxCount],
  );

  return (
    <div className="space-y-5">
      <div className="surface-card flex flex-wrap items-end gap-4 p-5">
        {controls}

        <div className="space-y-2">
          <Label htmlFor="generator-count">{countLabel}</Label>
          <Input
            id="generator-count"
            type="number"
            inputMode="numeric"
            min={1}
            max={maxCount}
            value={count}
            onChange={(event) => setCount(event.target.value)}
            className="w-24"
          />
        </div>

        <Button size="lg" onClick={() => setNonce((value) => value + 1)}>
          <RefreshCw className="size-4" strokeWidth={1.75} />
          Generate
        </Button>

        <CopyButton value={results.join("\n")} label="Copy all" />
      </div>

      {spacious ? (
        <div className="space-y-3" aria-live="polite">
          {results.map((result, index) => (
            <div key={index} className="surface-card flex items-start gap-4 p-5">
              <p className="min-w-0 flex-1 text-base leading-relaxed text-foreground">{result}</p>
              <CopyButton value={result} iconOnly label="Copy this one" />
            </div>
          ))}
        </div>
      ) : (
        <div className="surface-card overflow-hidden" aria-live="polite">
          <ul className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {results.map((result, index) => (
              <li
                key={index}
                className="flex items-center gap-2 bg-surface px-5 py-2.5 text-sm text-foreground"
              >
                <span className="min-w-0 flex-1">{result}</span>
                <CopyButton value={result} iconOnly label="Copy this one" />
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>{footnote}</span>
      </p>
    </div>
  );
}
