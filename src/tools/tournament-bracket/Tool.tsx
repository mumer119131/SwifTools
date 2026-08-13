"use client";

import * as React from "react";
import { Info, RefreshCw, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldHint, Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toLines } from "@/lib/random";
import { cn } from "@/lib/utils";
import { SAMPLE, buildBracket, propagate, roundName, type Match } from "./logic";

export default function TournamentBracketTool() {
  const [text, setText] = React.useState(SAMPLE);
  const [randomise, setRandomise] = React.useState(false);
  const [matches, setMatches] = React.useState<Match[]>(() => buildBracket(toLines(SAMPLE), false));

  const entrants = toLines(text);
  const totalRounds = matches.length > 0 ? Math.max(...matches.map((m) => m.round)) : 0;
  const champion = matches.find((match) => match.round === totalRounds)?.winner ?? null;

  function rebuild() {
    setMatches(buildBracket(entrants, randomise));
  }

  function setWinner(id: string, winner: string) {
    setMatches((current) =>
      propagate(
        current.map((match) =>
          match.id === id
            ? { ...match, winner: match.winner === winner ? null : winner }
            : match,
        ),
      ),
    );
  }

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="bracket-entrants">Entrants</Label>
            <span className="text-xs text-muted-foreground">{entrants.length}</span>
          </div>
          <Textarea
            id="bracket-entrants"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={10}
            spellCheck={false}
            placeholder="One per line, strongest first if seeding"
            className="text-sm"
          />
          <FieldHint>
            Any number works — the field is padded with byes to the next power of
            two.
          </FieldHint>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch id="bracket-random" checked={randomise} onCheckedChange={setRandomise} />
            <Label htmlFor="bracket-random">Draw at random instead of seeding in order</Label>
          </div>
          <Button size="lg" onClick={rebuild} disabled={entrants.length < 2}>
            <RefreshCw className="size-4" strokeWidth={1.75} />
            Build the bracket
          </Button>
          {champion ? (
            <div className="surface-card p-6 text-center" aria-live="polite">
              <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Trophy className="size-3.5" strokeWidth={1.75} />
                Champion
              </p>
              <p className="mt-2 text-3xl tracking-[-0.02em] text-foreground">{champion}</p>
            </div>
          ) : null}
        </div>
      </div>

      {matches.length > 0 ? (
        <div className="surface-card overflow-x-auto p-6">
          <div className="flex min-w-max gap-8">
            {Array.from({ length: totalRounds }, (_, index) => index + 1).map((round) => (
              <section key={round} className="flex flex-col justify-around gap-4">
                <h2 className="text-xs font-medium text-muted-foreground">
                  {roundName(round, totalRounds)}
                </h2>
                {matches
                  .filter((match) => match.round === round)
                  .map((match) => (
                    <div key={match.id} className="w-52 space-y-px overflow-hidden rounded-lg border border-border">
                      {(["left", "right"] as const).map((side) => {
                        const name = match[side];
                        const won = name !== null && match.winner === name;
                        const lost = match.winner !== null && !won && name !== null;

                        return (
                          <button
                            key={side}
                            type="button"
                            disabled={name === null}
                            onClick={() => name && setWinner(match.id, name)}
                            className={cn(
                              "block w-full px-3 py-2 text-left text-sm transition-colors duration-[180ms] ease-out-expo",
                              "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--ring)]",
                              name === null
                                ? "cursor-default bg-surface text-subtle-foreground"
                                : won
                                  ? "cursor-pointer bg-[color-mix(in_oklab,var(--accent-fun)_18%,transparent)] font-medium text-foreground"
                                  : lost
                                    ? "cursor-pointer bg-surface text-subtle-foreground line-through"
                                    : "cursor-pointer bg-surface text-foreground hover:bg-surface-hover",
                            )}
                          >
                            {name ?? "—"}
                          </button>
                        );
                      })}
                    </div>
                  ))}
              </section>
            ))}
          </div>
        </div>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Seeds are paired 1 against the bottom seed, 2 against the next, and so
          on, so the two strongest entrants can only meet in the final. An
          awkward number of entrants is padded with byes into the first round
          rather than given an extra round — seven players means one walks
          straight into round two, which is how a real draw handles it. Click a
          name again to undo the result; everything downstream clears with it.
        </span>
      </p>
    </div>
  );
}
