"use client";

import * as React from "react";
import { Info, RotateCcw, Sparkles, Swords } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldHint, Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { pick, shuffle, toLines } from "@/lib/random";
import { PRESETS, pairUp } from "./logic";

const SAMPLE = `Stay in and read\nGo for a long walk\nCall a friend\nStart that side project\nWatch something bad on purpose`;

export default function DecisionMakerTool() {
  const [text, setText] = React.useState(SAMPLE);
  const [mode, setMode] = React.useState<"instant" | "headToHead">("instant");
  const [chosen, setChosen] = React.useState<string | null>(null);

  // Head-to-head state: who is still in, who has won this round.
  const [entrants, setEntrants] = React.useState<string[] | null>(null);
  const [winners, setWinners] = React.useState<string[]>([]);
  const [matchIndex, setMatchIndex] = React.useState(0);

  const options = toLines(text);

  const { matchups, bye } = entrants ? pairUp(entrants) : { matchups: [], bye: null };
  const currentMatch = matchups[matchIndex] ?? null;

  function startTournament() {
    setEntrants(shuffle(options));
    setWinners([]);
    setMatchIndex(0);
    setChosen(null);
  }

  function choose(option: string) {
    const nextWinners = [...winners, option];

    if (matchIndex + 1 < matchups.length) {
      setWinners(nextWinners);
      setMatchIndex(matchIndex + 1);
      return;
    }

    // Round over. The byes join the winners for the next round.
    const advancing = bye ? [...nextWinners, bye] : nextWinners;

    if (advancing.length === 1) {
      setChosen(advancing[0]);
      setEntrants(null);
      setWinners([]);
      setMatchIndex(0);
      return;
    }

    setEntrants(shuffle(advancing));
    setWinners([]);
    setMatchIndex(0);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="decide-options">Your options</Label>
              <span className="text-xs text-muted-foreground">{options.length}</span>
            </div>
            <Textarea
              id="decide-options"
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                setEntrants(null);
                setChosen(null);
              }}
              rows={10}
              spellCheck={false}
              placeholder="One option per line"
              className="text-sm"
            />
            <FieldHint>One per line. Two or more.</FieldHint>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => {
                  setText(preset.options.join("\n"));
                  setEntrants(null);
                  setChosen(null);
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Tabs
            value={mode}
            onValueChange={(value) => {
              setMode(value as "instant" | "headToHead");
              setEntrants(null);
              setChosen(null);
            }}
          >
            <TabsList>
              <TabsTrigger value="instant">Just pick one</TabsTrigger>
              <TabsTrigger value="headToHead">Head-to-head</TabsTrigger>
            </TabsList>
          </Tabs>

          {mode === "instant" ? (
            <>
              <Button
                size="lg"
                onClick={() => setChosen(pick(options) ?? null)}
                disabled={options.length === 0}
              >
                <Sparkles className="size-4" strokeWidth={1.75} />
                Decide for me
              </Button>

              <div className="surface-card grid min-h-56 place-items-center p-8 text-center">
                {chosen ? (
                  <div aria-live="polite">
                    <p className="text-xs text-muted-foreground">The answer is</p>
                    <p className="mt-3 text-3xl tracking-[-0.02em] text-foreground sm:text-4xl">
                      {chosen}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Press decide and see how you feel about the answer.
                  </p>
                )}
              </div>
            </>
          ) : entrants && currentMatch ? (
            <div className="space-y-4" aria-live="polite">
              <p className="text-sm text-muted-foreground">
                {entrants.length} left · match {matchIndex + 1} of {matchups.length}
              </p>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr]">
                <button
                  type="button"
                  onClick={() => choose(currentMatch.left)}
                  className="surface-card cursor-pointer p-8 text-center text-lg text-foreground transition-colors duration-[180ms] ease-out-expo hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                >
                  {currentMatch.left}
                </button>
                <span className="grid place-items-center text-xs text-subtle-foreground">
                  vs
                </span>
                <button
                  type="button"
                  onClick={() => choose(currentMatch.right)}
                  className="surface-card cursor-pointer p-8 text-center text-lg text-foreground transition-colors duration-[180ms] ease-out-expo hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                >
                  {currentMatch.right}
                </button>
              </div>

              {bye ? (
                <p className="text-xs text-subtle-foreground">
                  {bye} sits this round out and rejoins next.
                </p>
              ) : null}

              <Button variant="ghost" size="sm" onClick={() => setEntrants(null)}>
                <RotateCcw className="size-4" strokeWidth={1.75} />
                Stop
              </Button>
            </div>
          ) : (
            <>
              <Button size="lg" onClick={startTournament} disabled={options.length < 2}>
                <Swords className="size-4" strokeWidth={1.75} />
                Start head-to-head
              </Button>

              <div className="surface-card grid min-h-56 place-items-center p-8 text-center">
                {chosen ? (
                  <div aria-live="polite">
                    <p className="text-xs text-muted-foreground">You chose</p>
                    <p className="mt-3 text-3xl tracking-[-0.02em] text-foreground sm:text-4xl">
                      {chosen}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    You&rsquo;ll be shown two options at a time until one is left.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The head-to-head is the mode worth using. Choosing between eight things
          is genuinely hard; choosing between two is easy, and seven easy choices
          get you an answer you believe. A random pick is still useful, but for a
          different reason — the flip was never meant to decide anything, only to
          show you what you were hoping it would say.
        </span>
      </p>
    </div>
  );
}
