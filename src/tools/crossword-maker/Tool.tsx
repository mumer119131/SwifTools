"use client";

import * as React from "react";
import { Eye, EyeOff, Info, Printer, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { randomSeed } from "@/lib/random";
import { cn } from "@/lib/utils";
import { SAMPLE, build, parseEntries } from "./logic";

export default function CrosswordMakerTool() {
  const [text, setText] = React.useState(SAMPLE);
  const [title, setTitle] = React.useState("Crossword");
  const [seed, setSeed] = React.useState(() => randomSeed());
  const [showAnswers, setShowAnswers] = React.useState(false);

  const entries = parseEntries(text);
  const crossword = build(entries, seed);

  const across = crossword.placed
    .filter((entry) => entry.across)
    .sort((a, b) => a.number - b.number);
  const down = crossword.placed
    .filter((entry) => !entry.across)
    .sort((a, b) => a.number - b.number);

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 lg:grid-cols-[2fr_1fr] print:hidden">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="cw-entries">Words and clues</Label>
            <span className="text-xs text-muted-foreground">
              {crossword.placed.length} of {entries.length} placed
            </span>
          </div>
          <Textarea
            id="cw-entries"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={12}
            spellCheck={false}
            placeholder={"PYTHON = A language named after a comedy troupe\nCOMPILER = Turns source into machine code"}
            className="text-sm"
          />
          <FieldHint>
            One per line, as <code className="font-mono">WORD = clue</code>. A
            colon or a dash works too. Words need at least one letter in common
            with the puzzle to fit.
          </FieldHint>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cw-title">Title</Label>
            <Input id="cw-title" value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setSeed(randomSeed())}>
              <RefreshCw className="size-4" strokeWidth={1.75} />
              Rebuild
            </Button>
            <Button variant="outline" onClick={() => setShowAnswers((value) => !value)}>
              {showAnswers ? (
                <>
                  <EyeOff className="size-4" strokeWidth={1.75} />
                  Hide answers
                </>
              ) : (
                <>
                  <Eye className="size-4" strokeWidth={1.75} />
                  Show answers
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" strokeWidth={1.75} />
              Print
            </Button>
          </div>

          <FieldHint>
            Rebuild tries a different arrangement — the shape depends a lot on
            which word lands first.
          </FieldHint>
        </div>
      </div>

      {crossword.unplaced.length > 0 ? (
        <p className="rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground print:hidden">
          These share no letters with the rest of the puzzle:{" "}
          {crossword.unplaced.map((entry) => entry.word).join(", ")}. Rebuild, or
          add a word that bridges them.
        </p>
      ) : null}

      {crossword.rows > 0 ? (
        <div className="surface-card p-6">
          <h2 className="mb-4 text-center text-lg text-foreground">{title}</h2>

          <div className="flex justify-center overflow-x-auto">
            <div
              className="grid"
              style={{ gridTemplateColumns: `repeat(${crossword.cols}, minmax(0, 1fr))` }}
              role="grid"
              aria-label="Crossword grid"
            >
              {crossword.grid.map((row, rowIndex) =>
                row.map((letter, colIndex) => (
                  <span
                    key={`${rowIndex}-${colIndex}`}
                    className={cn(
                      "relative grid size-7 place-items-center font-mono text-sm sm:size-8 sm:text-base",
                      letter === null
                        ? "bg-transparent"
                        : "border border-border-strong bg-surface text-foreground",
                    )}
                  >
                    {crossword.numbers[rowIndex][colIndex] !== null ? (
                      <span className="absolute left-0.5 top-0 font-sans text-[9px] leading-tight text-muted-foreground">
                        {crossword.numbers[rowIndex][colIndex]}
                      </span>
                    ) : null}
                    {showAnswers ? letter : ""}
                  </span>
                )),
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {[
              { heading: "Across", list: across },
              { heading: "Down", list: down },
            ].map((section) => (
              <section key={section.heading}>
                <h3 className="mb-2 text-sm font-medium text-foreground">{section.heading}</h3>
                <ol className="space-y-1.5 text-sm text-muted-foreground">
                  {section.list.map((entry) => (
                    <li key={`${entry.number}-${entry.word}`} className="flex gap-2">
                      <span className="w-6 shrink-0 text-right font-mono text-subtle-foreground">
                        {entry.number}
                      </span>
                      <span>
                        {entry.clue || <em>no clue given</em>}{" "}
                        <span className="text-subtle-foreground">({entry.word.length})</span>
                        {showAnswers ? (
                          <span className="ml-2 font-mono text-foreground">{entry.word}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
          Add a few words to build a puzzle.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground print:hidden">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          This is a criss-cross puzzle: words cross at shared letters and the
          grid is trimmed to whatever shape they make, rather than being forced
          into a symmetrical newspaper block. Placements are scored on how many
          crossings they make and how compact they keep the grid — a puzzle where
          every word touches in exactly one place and sprawls over forty columns
          is technically a crossword and useless as one. A dozen arrangements are
          tried and the densest kept, which is why rebuilding can help.
        </span>
      </p>
    </div>
  );
}
