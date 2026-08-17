"use client";

import * as React from "react";
import { Info, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";
import { SIZES, deal, perfectMoves, type Card } from "./logic";

interface Best {
  moves: number;
  seconds: number;
}

const NO_BEST: Record<string, Best> = {};

export default function MemoryGameTool() {
  const [sizeId, setSizeId] = React.useState("4x4");
  const size = SIZES.find((entry) => entry.id === sizeId)!;

  const [cards, setCards] = React.useState<Card[]>(() => deal(8));
  const [moves, setMoves] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [locked, setLocked] = React.useState(false);
  const [best, setBest] = useLocalStorage<Record<string, Best>>("pockettoolz:memory-best", NO_BEST);

  const won = cards.length > 0 && cards.every((card) => card.matched);

  /*
   * The clock counts ticks rather than subtracting timestamps. Reading
   * `Date.now()` in an event handler trips React Compiler's purity rule, and a
   * second of drift over a game of pairs is not worth working around it for.
   */
  React.useEffect(() => {
    if (!running || won) return;

    const timer = window.setInterval(() => setElapsed((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [running, won]);

  // Recording the best score is a side effect of winning, not of rendering.
  const recordedRef = React.useRef(false);
  React.useEffect(() => {
    if (!won || recordedRef.current) return;
    recordedRef.current = true;

    const current = best[sizeId];
    if (!current || moves < current.moves || (moves === current.moves && elapsed < current.seconds)) {
      setBest((entries) => ({ ...entries, [sizeId]: { moves, seconds: elapsed } }));
    }
  }, [won, best, sizeId, moves, elapsed, setBest]);

  function reset(nextSizeId = sizeId) {
    const nextSize = SIZES.find((entry) => entry.id === nextSizeId)!;
    setCards(deal(nextSize.pairs));
    setMoves(0);
    setRunning(false);
    setElapsed(0);
    setLocked(false);
    recordedRef.current = false;
  }

  function flip(id: number) {
    if (locked || won) return;

    const card = cards.find((entry) => entry.id === id);
    if (!card || card.flipped || card.matched) return;

    setRunning(true);

    const next = cards.map((entry) => (entry.id === id ? { ...entry, flipped: true } : entry));
    setCards(next);

    const nowFlipped = next.filter((entry) => entry.flipped && !entry.matched);
    if (nowFlipped.length < 2) return;

    setMoves((count) => count + 1);

    const [first, second] = nowFlipped;
    if (first.symbol === second.symbol) {
      setCards(
        next.map((entry) =>
          entry.symbol === first.symbol ? { ...entry, matched: true, flipped: true } : entry,
        ),
      );
      return;
    }

    // Hold the mismatch on screen long enough to memorise before turning back.
    setLocked(true);
    window.setTimeout(() => {
      setCards((current) =>
        current.map((entry) => (entry.matched ? entry : { ...entry, flipped: false })),
      );
      setLocked(false);
    }, 850);
  }

  const record = best[sizeId];

  return (
    <div className="space-y-5">
      <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
        <Tabs
          value={sizeId}
          onValueChange={(value) => {
            setSizeId(value);
            reset(value);
          }}
        >
          <TabsList>
            {SIZES.map((entry) => (
              <TabsTrigger key={entry.id} value={entry.id}>
                {entry.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs text-muted-foreground">Moves</p>
            <p className="font-mono text-lg text-foreground" data-numeric>
              {moves}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Time</p>
            <p className="font-mono text-lg text-foreground" data-numeric>
              {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Your best</p>
            <p className="font-mono text-lg text-foreground" data-numeric>
              {record ? `${record.moves} moves` : "—"}
            </p>
          </div>
          <Button variant="outline" onClick={() => reset()}>
            <RotateCcw className="size-4" strokeWidth={1.75} />
            New game
          </Button>
        </div>
      </div>

      {won ? (
        <div className="surface-card p-6 text-center" aria-live="polite">
          <p className="text-2xl text-foreground">Cleared in {moves} moves</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")} ·
            a perfect game is {perfectMoves(size.pairs)} moves
          </p>
        </div>
      ) : null}

      <div
        className="mx-auto grid max-w-3xl gap-2 sm:gap-3"
        style={{ gridTemplateColumns: `repeat(${size.cols}, minmax(0, 1fr))` }}
      >
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => flip(card.id)}
            aria-label={card.flipped || card.matched ? `Card showing ${card.symbol}` : "Face-down card"}
            className={cn(
              "grid aspect-square cursor-pointer place-items-center rounded-lg border text-2xl sm:text-3xl",
              "transition-all duration-[220ms] ease-out-expo",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
              card.matched
                ? "border-[var(--accent-fun)] bg-[color-mix(in_oklab,var(--accent-fun)_16%,transparent)] text-foreground"
                : card.flipped
                  ? "border-border-strong bg-surface-hover text-foreground"
                  : "border-border bg-surface text-transparent hover:bg-surface-hover",
            )}
          >
            {card.flipped || card.matched ? card.symbol : "•"}
          </button>
        ))}
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The deck is shuffled with Fisher–Yates from the browser&rsquo;s
          cryptographic random source, so no two games start the same way. A
          perfect game is one move per pair — {perfectMoves(size.pairs)} on this
          board — which needs you to remember every card you have turned over.
          Your best score per board size is kept in this browser.
        </span>
      </p>
    </div>
  );
}
