"use client";

import * as React from "react";
import { Eye, EyeOff, Info, Printer, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { randomSeed, toLines } from "@/lib/random";
import { cn } from "@/lib/utils";
import { SAMPLE, generate, solutionCells, type Level } from "./logic";

export default function WordSearchTool() {
  const [words, setWords] = React.useState(SAMPLE);
  const [size, setSize] = React.useState("15");
  const [level, setLevel] = React.useState<Level>("medium");
  const [title, setTitle] = React.useState("Word Search");
  const [seed, setSeed] = React.useState(() => randomSeed());
  const [showAnswers, setShowAnswers] = React.useState(false);

  const list = toLines(words);
  const gridSize = Math.max(8, Math.min(25, Number(size) || 15));

  const puzzle = generate(list, gridSize, level, seed);
  const answers = solutionCells(puzzle.placements);

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 lg:grid-cols-[2fr_1fr] print:hidden">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="ws-words">Words</Label>
            <span className="text-xs text-muted-foreground">
              {puzzle.placements.length} of {list.length} placed
            </span>
          </div>
          <Textarea
            id="ws-words"
            value={words}
            onChange={(event) => setWords(event.target.value)}
            rows={8}
            spellCheck={false}
            placeholder="One word per line"
            className="text-sm"
          />
          <FieldHint>
            Letters only — spaces, hyphens and punctuation are stripped.
          </FieldHint>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ws-title">Title</Label>
            <Input id="ws-title" value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ws-size">Grid size</Label>
            <Input
              id="ws-size"
              type="number"
              inputMode="numeric"
              min={8}
              max={25}
              value={size}
              onChange={(event) => setSize(event.target.value)}
              className="w-24"
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium text-foreground">Difficulty</span>
            <Tabs value={level} onValueChange={(value) => setLevel(value as Level)}>
              <TabsList>
                <TabsTrigger value="easy">Easy</TabsTrigger>
                <TabsTrigger value="medium">Medium</TabsTrigger>
                <TabsTrigger value="hard">Hard</TabsTrigger>
              </TabsList>
            </Tabs>
            <FieldHint>
              {level === "easy"
                ? "Across and down only."
                : level === "medium"
                  ? "Adds diagonals."
                  : "Adds every direction backwards."}
            </FieldHint>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setSeed(randomSeed())}>
              <RefreshCw className="size-4" strokeWidth={1.75} />
              Regenerate
            </Button>
            <Button variant="outline" onClick={() => setShowAnswers((value) => !value)}>
              {showAnswers ? (
                <>
                  <EyeOff className="size-4" strokeWidth={1.75} />
                  Hide key
                </>
              ) : (
                <>
                  <Eye className="size-4" strokeWidth={1.75} />
                  Answer key
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" strokeWidth={1.75} />
              Print
            </Button>
          </div>
        </div>
      </div>

      {puzzle.unplaced.length > 0 ? (
        <p className="rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground print:hidden">
          These wouldn&rsquo;t fit: {puzzle.unplaced.join(", ")}. Make the grid
          bigger, allow more directions, or use shorter words.
        </p>
      ) : null}

      <div className="surface-card p-6">
        <h2 className="mb-4 text-center text-lg text-foreground">{title}</h2>

        <div className="flex justify-center overflow-x-auto">
          <div
            className="grid gap-0"
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
            role="grid"
            aria-label="Word search grid"
          >
            {puzzle.grid.map((row, rowIndex) =>
              row.map((letter, colIndex) => (
                <span
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "grid size-6 place-items-center font-mono text-sm sm:size-7 sm:text-base",
                    showAnswers && answers.has(`${rowIndex},${colIndex}`)
                      ? "rounded bg-[color-mix(in_oklab,var(--accent-fun)_28%,transparent)] font-medium text-foreground"
                      : "text-foreground",
                  )}
                >
                  {letter}
                </span>
              )),
            )}
          </div>
        </div>

        <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-sm text-muted-foreground">
          {puzzle.placements.map((placement) => (
            <li key={placement.word}>{placement.word}</li>
          ))}
        </ul>
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground print:hidden">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Long words are placed first, into an empty grid, because the hard ones
          need the space before it is used up. Words are allowed to cross where
          they share a letter, which is what stops the result looking like a list
          with noise sprinkled around it. Anything that genuinely will not fit is
          named rather than quietly dropped.
        </span>
      </p>
    </div>
  );
}
