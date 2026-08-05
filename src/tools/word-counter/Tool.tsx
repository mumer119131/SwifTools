"use client";

import * as React from "react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatNumber } from "@/lib/utils";
import { analyseText, formatDuration, wordFrequencies } from "./logic";

export default function WordCounterTool() {
  const [text, setText] = React.useState("");

  const stats = React.useMemo(() => analyseText(text), [text]);
  const frequencies = React.useMemo(() => wordFrequencies(text), [text]);

  const cards = [
    { label: "Words", value: formatNumber(stats.words) },
    { label: "Characters", value: formatNumber(stats.characters) },
    { label: "Without spaces", value: formatNumber(stats.charactersNoSpaces) },
    { label: "Sentences", value: formatNumber(stats.sentences) },
    { label: "Paragraphs", value: formatNumber(stats.paragraphs) },
    { label: "Reading time", value: formatDuration(stats.readingMinutes) },
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="text-input">Your text</Label>
          <div className="flex items-center gap-2">
            <CopyButton value={text} label="Copy" />
            <Button variant="ghost" size="sm" onClick={() => setText("")} disabled={!text}>
              Clear
            </Button>
          </div>
        </div>
        <Textarea
          id="text-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste or type your text here…"
          className="min-h-64 font-sans"
          spellCheck
        />
      </div>

      {/* Counts change on every keystroke, so they are announced only when the
          user pauses — aria-live on a per-character counter is unusable. */}
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => (
          <div key={card.label} className="surface-card p-4">
            <dt className="text-xs text-muted-foreground">{card.label}</dt>
            <dd className="mt-1 font-mono text-2xl tracking-[-0.02em] text-foreground" data-numeric>
              {card.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-sm text-muted-foreground">
        Speaking time: <span className="text-foreground">{formatDuration(stats.speakingMinutes)}</span>{" "}
        at a comfortable 150 words per minute.
      </p>

      {frequencies.length > 0 ? (
        <section className="surface-card p-5">
          <h2 className="text-sm font-medium text-foreground">Most-used words</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Common filler words are excluded. Useful for spotting repetition.
          </p>
          <ul className="mt-4 space-y-2.5">
            {frequencies.map((entry) => (
              <li key={entry.word} className="flex items-center gap-3">
                <span className="w-28 shrink-0 truncate text-sm text-foreground">{entry.word}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(100, entry.density * 6)}%` }}
                  />
                </span>
                <span
                  className="w-24 shrink-0 text-right font-mono text-xs text-muted-foreground"
                  data-numeric
                >
                  {entry.count}× · {entry.density.toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
