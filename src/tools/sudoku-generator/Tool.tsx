"use client";

import * as React from "react";
import { Eye, EyeOff, Info, Printer, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { randomSeed } from "@/lib/random";
import { cn } from "@/lib/utils";
import { generate, isLegal, type Difficulty, type Puzzle } from "./logic";

export default function SudokuGeneratorTool() {
  const [difficulty, setDifficulty] = React.useState<Difficulty>("medium");
  const [seedInput, setSeedInput] = React.useState("");
  const [puzzle, setPuzzle] = React.useState<Puzzle | null>(null);
  const [entries, setEntries] = React.useState<number[]>(() => new Array(81).fill(0));
  const [showSolution, setShowSolution] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  function make(nextDifficulty = difficulty, seed = seedInput.trim() || randomSeed()) {
    setBusy(true);
    // Yield a frame so the button can show its disabled state before the
    // synchronous solve blocks the thread.
    window.setTimeout(() => {
      const result = generate(nextDifficulty, seed);
      setPuzzle(result);
      setEntries(new Array(81).fill(0));
      setSeedInput(seed);
      setShowSolution(false);
      setBusy(false);
    }, 16);
  }

  const board = puzzle
    ? showSolution
      ? puzzle.solution
      : puzzle.puzzle.map((value, index) => (value !== 0 ? value : entries[index]))
    : null;

  return (
    <div className="space-y-5">
      <div className="surface-card flex flex-wrap items-end gap-4 p-5 print:hidden">
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Difficulty</span>
          <Tabs
            value={difficulty}
            onValueChange={(value) => {
              setDifficulty(value as Difficulty);
              setSeedInput("");
              make(value as Difficulty, randomSeed());
            }}
          >
            <TabsList>
              <TabsTrigger value="easy">Easy</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="hard">Hard</TabsTrigger>
              <TabsTrigger value="expert">Expert</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sudoku-seed">Seed</Label>
          <Input
            id="sudoku-seed"
            value={seedInput}
            onChange={(event) => setSeedInput(event.target.value)}
            placeholder="Leave blank for a new one"
            className="w-48 font-mono"
            spellCheck={false}
          />
          <FieldHint>The same seed always gives the same puzzle.</FieldHint>
        </div>

        <Button size="lg" onClick={() => make(difficulty, seedInput.trim() || randomSeed())} disabled={busy}>
          <RefreshCw className={cn("size-4", busy && "animate-spin")} strokeWidth={1.75} />
          {busy ? "Generating…" : "Generate"}
        </Button>

        {puzzle ? (
          <>
            <Button variant="outline" onClick={() => setShowSolution((value) => !value)}>
              {showSolution ? (
                <>
                  <EyeOff className="size-4" strokeWidth={1.75} />
                  Hide solution
                </>
              ) : (
                <>
                  <Eye className="size-4" strokeWidth={1.75} />
                  Show solution
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" strokeWidth={1.75} />
              Print
            </Button>
          </>
        ) : null}
      </div>

      {puzzle && board ? (
        <>
          <p className="text-sm text-muted-foreground print:hidden">
            {puzzle.givens} clues · seed{" "}
            <span className="font-mono text-foreground">{puzzle.seed}</span> ·{" "}
            {puzzle.difficulty}
          </p>

          <div className="flex justify-center">
            <div
              className="grid grid-cols-9 border-2 border-foreground bg-surface"
              role="grid"
              aria-label="Sudoku grid"
            >
              {board.map((value, index) => {
                const given = puzzle.puzzle[index] !== 0;
                const row = Math.floor(index / 9);
                const col = index % 9;
                const wrong =
                  !given &&
                  value !== 0 &&
                  !showSolution &&
                  !isLegal(
                    board.map((entry, i) => (i === index ? 0 : entry)),
                    index,
                    value,
                  );

                return (
                  <input
                    key={index}
                    value={value === 0 ? "" : value}
                    readOnly={given || showSolution}
                    inputMode="numeric"
                    maxLength={1}
                    aria-label={`Row ${row + 1}, column ${col + 1}`}
                    onChange={(event) => {
                      const digit = Number(event.target.value.replace(/\D/g, "").slice(-1));
                      setEntries((current) =>
                        current.map((entry, i) => (i === index ? (digit || 0) : entry)),
                      );
                    }}
                    className={cn(
                      "size-9 border border-border text-center font-mono text-lg sm:size-11 sm:text-xl",
                      "focus:z-10 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--ring)]",
                      // The 3×3 boxes need heavier rules, or the grid is unreadable.
                      col % 3 === 2 && col !== 8 && "border-r-2 border-r-foreground",
                      row % 3 === 2 && row !== 8 && "border-b-2 border-b-foreground",
                      given
                        ? "bg-surface-hover font-medium text-foreground"
                        : wrong
                          ? "bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)] text-destructive"
                          : "bg-surface text-[var(--accent-fun)]",
                    )}
                  />
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
          Press generate to make a puzzle.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground print:hidden">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Every puzzle is checked to have exactly one solution: cells are removed
          from a complete grid one at a time, and any removal that would leave
          two possible answers is put back. That guarantee is the whole point — a
          sudoku with two solutions cannot be reasoned out, only guessed at, and
          plenty of generators skip the check. Clashing entries are highlighted
          as you type.
        </span>
      </p>
    </div>
  );
}
