"use client";

import * as React from "react";
import { Check, TriangleAlert } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatBytes, formatNumber } from "@/lib/utils";
import { analyseCharacters, limitTargets, usageFor } from "./logic";

export default function CharacterCounterTool() {
  const [text, setText] = React.useState("");

  const stats = React.useMemo(() => analyseCharacters(text), [text]);
  const hasEmojiGap = stats.graphemes !== stats.codeUnits;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="character-input">Your text</Label>
          <div className="flex items-center gap-2">
            <CopyButton value={text} label="Copy" />
            <Button variant="ghost" size="sm" onClick={() => setText("")} disabled={!text}>
              Clear
            </Button>
          </div>
        </div>
        <Textarea
          id="character-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste or type your text here…"
          className="min-h-48"
          spellCheck
        />
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Characters", value: formatNumber(stats.graphemes) },
          { label: "Without spaces", value: formatNumber(stats.withoutSpaces) },
          { label: "Lines", value: formatNumber(stats.lines) },
          { label: "UTF-8 size", value: formatBytes(stats.bytes) },
        ].map((card) => (
          <div key={card.label} className="surface-card p-4">
            <dt className="text-xs text-muted-foreground">{card.label}</dt>
            <dd className="mt-1 font-mono text-2xl tracking-[-0.02em] text-foreground" data-numeric>
              {card.value}
            </dd>
          </div>
        ))}
      </dl>

      {hasEmojiGap ? (
        <p className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
          Your text contains emoji or combining marks:{" "}
          <span className="font-mono text-foreground" data-numeric>
            {formatNumber(stats.graphemes)}
          </span>{" "}
          visible characters but{" "}
          <span className="font-mono text-foreground" data-numeric>
            {formatNumber(stats.codeUnits)}
          </span>{" "}
          code units. Platforms differ on which they count, so both are shown below.
        </p>
      ) : null}

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
          Against common limits
        </h2>
        <ul className="divide-y divide-border">
          {limitTargets.map((target) => {
            const usage = usageFor(stats, target);
            return (
              <li key={target.label} className="flex items-center gap-4 px-5 py-3.5">
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-foreground">{target.label}</span>
                  {target.note ? (
                    <span className="block text-xs text-subtle-foreground">{target.note}</span>
                  ) : null}
                </span>

                <span className="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-border sm:w-40">
                  <span
                    className={cn(
                      "block h-full rounded-full transition-[width] duration-[180ms] ease-out-expo",
                      usage.state === "over" ? "bg-destructive" : "bg-primary",
                    )}
                    style={{ width: `${Math.min(100, usage.ratio * 100)}%` }}
                  />
                </span>

                <span
                  className={cn(
                    "flex w-28 shrink-0 items-center justify-end gap-1.5 font-mono text-xs",
                    usage.state === "over" ? "text-destructive" : "text-muted-foreground",
                  )}
                  data-numeric
                >
                  {/* Colour never carries the state alone — an icon accompanies it. */}
                  {usage.state === "over" ? (
                    <TriangleAlert className="size-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
                  ) : text ? (
                    <Check className="size-3.5 shrink-0 text-success" strokeWidth={2} aria-hidden="true" />
                  ) : null}
                  {formatNumber(usage.used)}/{formatNumber(target.limit)}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
