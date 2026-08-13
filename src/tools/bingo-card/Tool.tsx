"use client";

import * as React from "react";
import { Info, Printer, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { randomSeed, toLines } from "@/lib/random";
import { SAMPLE_WORDS, makeNumberCard, makeWordCard, type Size } from "./logic";

const HEADERS = "BINGO";

export default function BingoCardTool() {
  const [mode, setMode] = React.useState<"numbers" | "words">("numbers");
  const [size, setSize] = React.useState<Size>(5);
  const [count, setCount] = React.useState("4");
  const [words, setWords] = React.useState(SAMPLE_WORDS);
  const [title, setTitle] = React.useState("Meeting Bingo");
  const [seed, setSeed] = React.useState(() => randomSeed());

  const wordList = toLines(words);
  const cardCount = Math.max(1, Math.min(50, Number(count) || 1));

  const cards = Array.from({ length: cardCount }, (_, index) =>
    mode === "numbers"
      ? makeNumberCard(index + 1, seed, size)
      : makeWordCard(index + 1, seed, size, wordList.length > 0 ? wordList : ["—"]),
  );

  return (
    <div className="space-y-5">
      <div className="surface-card space-y-4 p-5 print:hidden">
        <div className="flex flex-wrap items-end gap-4">
          <Tabs value={mode} onValueChange={(value) => setMode(value as "numbers" | "words")}>
            <TabsList>
              <TabsTrigger value="numbers">Classic numbers</TabsTrigger>
              <TabsTrigger value="words">Your own words</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="bingo-size">Grid</Label>
            <Tabs value={String(size)} onValueChange={(value) => setSize(Number(value) as Size)}>
              <TabsList>
                <TabsTrigger value="3">3×3</TabsTrigger>
                <TabsTrigger value="4">4×4</TabsTrigger>
                <TabsTrigger value="5">5×5</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bingo-count">Cards</Label>
            <Input
              id="bingo-count"
              type="number"
              inputMode="numeric"
              min={1}
              max={50}
              value={count}
              onChange={(event) => setCount(event.target.value)}
              className="w-24"
            />
          </div>

          <Button onClick={() => setSeed(randomSeed())}>
            <RefreshCw className="size-4" strokeWidth={1.75} />
            New cards
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="size-4" strokeWidth={1.75} />
            Print
          </Button>
        </div>

        {mode === "words" ? (
          <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
            <div className="space-y-2">
              <Label htmlFor="bingo-title">Card title</Label>
              <Input
                id="bingo-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bingo-words">Squares</Label>
                <span className="text-xs text-muted-foreground">
                  {wordList.length} words · {size * size - (size % 2)} per card
                </span>
              </div>
              <Textarea
                id="bingo-words"
                value={words}
                onChange={(event) => setWords(event.target.value)}
                rows={6}
                spellCheck={false}
                className="text-sm"
              />
              <FieldHint>
                {wordList.length < size * size
                  ? "Fewer words than squares — some will repeat across a card."
                  : "One per line. More words means more variety between cards."}
              </FieldHint>
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {cards.map((card) => (
          <div key={card.id} className="surface-card break-inside-avoid p-5">
            <h2 className="mb-3 text-center text-sm font-medium text-foreground">
              {mode === "words" ? title : "Bingo"}
              <span className="ml-2 font-mono text-xs text-subtle-foreground">
                #{card.id}
              </span>
            </h2>

            {mode === "numbers" && size === 5 ? (
              <div className="mb-1 grid grid-cols-5">
                {HEADERS.split("").map((letter) => (
                  <span
                    key={letter}
                    className="text-center text-lg font-medium text-[var(--accent-fun)]"
                  >
                    {letter}
                  </span>
                ))}
              </div>
            ) : null}

            <div
              className="grid gap-px border border-border-strong bg-border-strong"
              style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
            >
              {card.cells.map((cell, index) => (
                <span
                  key={index}
                  className="grid aspect-square place-items-center bg-surface p-1 text-center text-foreground"
                  style={{
                    fontSize:
                      cell === null
                        ? "0.75rem"
                        : mode === "numbers"
                          ? "1.125rem"
                          : `${Math.max(0.5, 0.85 - (cell.length / 90))}rem`,
                    lineHeight: 1.15,
                  }}
                >
                  {cell ?? "FREE"}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground print:hidden">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Classic cards draw each column from its own range — B from 1–15, I from
          16–30 and so on — which is what makes them bingo cards rather than
          grids of random numbers. Every card gets its own arrangement from the
          shared seed, so printing forty gives forty different cards and
          regenerating from the same seed gives the same forty back.
        </span>
      </p>
    </div>
  );
}
