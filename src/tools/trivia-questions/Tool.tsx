"use client";

import * as React from "react";
import { Eye, EyeOff, Info, RefreshCw } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { shuffle } from "@/lib/random";
import { CATEGORIES, filter, type Category, type Difficulty } from "./logic";

export default function TriviaQuestionsTool() {
  const [category, setCategory] = React.useState<Category | "all">("all");
  const [difficulty, setDifficulty] = React.useState<Difficulty | "all">("all");
  const [count, setCount] = React.useState("10");
  const [nonce, setNonce] = React.useState(0);
  const [revealed, setRevealed] = React.useState<Set<number>>(new Set());
  const [showAll, setShowAll] = React.useState(false);

  const pool = filter(category, difficulty);

  const round = React.useMemo(
    () => shuffle(pool).slice(0, Math.max(1, Math.min(pool.length, Number(count) || 1))),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- nonce is the refresh trigger
    [nonce, category, difficulty, count],
  );

  return (
    <div className="space-y-5">
      <div className="surface-card flex flex-wrap items-end gap-4 p-5 print:hidden">
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Category</span>
          <Tabs
            value={category}
            onValueChange={(value) => {
              setCategory(value as Category | "all");
              setRevealed(new Set());
            }}
          >
            <TabsList>
              {CATEGORIES.map((entry) => (
                <TabsTrigger key={entry.id} value={entry.id}>
                  {entry.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Difficulty</span>
          <Tabs
            value={difficulty}
            onValueChange={(value) => {
              setDifficulty(value as Difficulty | "all");
              setRevealed(new Set());
            }}
          >
            <TabsList>
              <TabsTrigger value="all">Any</TabsTrigger>
              <TabsTrigger value="easy">Easy</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="hard">Hard</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2">
          <Label htmlFor="trivia-count">Questions</Label>
          <Input
            id="trivia-count"
            type="number"
            inputMode="numeric"
            min={1}
            max={pool.length}
            value={count}
            onChange={(event) => setCount(event.target.value)}
            className="w-24"
          />
          <FieldHint>{pool.length} available in this selection.</FieldHint>
        </div>

        <Button
          onClick={() => {
            setNonce((value) => value + 1);
            setRevealed(new Set());
            setShowAll(false);
          }}
        >
          <RefreshCw className="size-4" strokeWidth={1.75} />
          New round
        </Button>

        <Button variant="outline" onClick={() => setShowAll((value) => !value)}>
          {showAll ? (
            <>
              <EyeOff className="size-4" strokeWidth={1.75} />
              Hide answers
            </>
          ) : (
            <>
              <Eye className="size-4" strokeWidth={1.75} />
              Reveal all
            </>
          )}
        </Button>

        <CopyButton
          value={round
            .map((question, index) => `${index + 1}. ${question.question}\n   → ${question.answer}`)
            .join("\n\n")}
          label="Copy round"
        />
      </div>

      <ol className="space-y-3" aria-live="polite">
        {round.map((question, index) => {
          const open = showAll || revealed.has(index);

          return (
            <li key={`${nonce}-${index}`} className="surface-card p-5">
              <div className="flex gap-3">
                <span className="w-6 shrink-0 text-right font-mono text-sm text-subtle-foreground">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="text-base text-foreground">{question.question}</p>
                  <p className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-surface-hover px-2 py-0.5 text-muted-foreground">
                      {question.category}
                    </span>
                    <span className="rounded-full bg-surface-hover px-2 py-0.5 text-muted-foreground">
                      {question.difficulty}
                    </span>
                  </p>

                  {open ? (
                    <p className="rounded-md bg-[color-mix(in_oklab,var(--accent-fun)_12%,transparent)] px-3 py-2 text-sm text-foreground">
                      {question.answer}
                    </p>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRevealed((current) => new Set(current).add(index))}
                    >
                      Reveal answer
                    </Button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground print:hidden">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          These come from a bank held in the page rather than a trivia API, so a
          quiz never fails because someone else&rsquo;s server is down or your
          key ran out. Answers that are genuinely contested say so — the longest
          river depends on where you decide the Amazon starts, and Australia&rsquo;s
          capital catches out more people than any other question here.
        </span>
      </p>
    </div>
  );
}
