"use client";

import * as React from "react";
import { Info, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { flip, flipMany, summarise, type Side } from "./logic";

export default function CoinFlipperTool() {
  const [history, setHistory] = React.useState<Side[]>([]);
  const [batch, setBatch] = React.useState("100");
  const [spinning, setSpinning] = React.useState(false);

  const latest = history[history.length - 1] ?? null;
  const stats = summarise(history);

  function flipOne() {
    // A brief spin so the result reads as an event rather than a text change.
    setSpinning(true);
    window.setTimeout(() => {
      setHistory((current) => [...current, flip()]);
      setSpinning(false);
    }, 320);
  }

  return (
    <div className="space-y-5">
      <div className="surface-card flex flex-col items-center gap-6 p-10">
        <div
          className={cn(
            "grid size-32 place-items-center rounded-full border-4 text-2xl font-medium",
            "transition-transform duration-[320ms] ease-out-expo",
            spinning && "animate-spin",
            latest === "heads"
              ? "border-[var(--accent-fun)] bg-[color-mix(in_oklab,var(--accent-fun)_16%,transparent)] text-foreground"
              : latest === "tails"
                ? "border-border-strong bg-surface-hover text-foreground"
                : "border-dashed border-border text-subtle-foreground",
          )}
          role="img"
          aria-label={latest ? `Result: ${latest}` : "No flip yet"}
        >
          {spinning ? "" : latest === "heads" ? "H" : latest === "tails" ? "T" : "?"}
        </div>

        <p className="text-lg text-foreground" aria-live="polite">
          {spinning ? "Flipping…" : latest ? (latest === "heads" ? "Heads" : "Tails") : "Ready"}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" onClick={flipOne} disabled={spinning}>
            Flip
          </Button>
          <Button
            variant="outline"
            onClick={() => setHistory((current) => [...current, ...flipMany(Number(batch))])}
          >
            Flip {Number(batch).toLocaleString("en-US")} at once
          </Button>
          <Button variant="ghost" onClick={() => setHistory([])} disabled={history.length === 0}>
            <RotateCcw className="size-4" strokeWidth={1.75} />
            Reset
          </Button>
        </div>

        <div className="w-full max-w-48 space-y-2">
          <Label htmlFor="coin-batch">Batch size</Label>
          <Input
            id="coin-batch"
            type="number"
            inputMode="numeric"
            min={1}
            max={10000}
            value={batch}
            onChange={(event) => setBatch(event.target.value)}
          />
          <FieldHint>Up to 10,000.</FieldHint>
        </div>
      </div>

      {stats.total > 0 ? (
        <>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Heads", value: `${stats.heads}`, detail: `${stats.headsPercent.toFixed(1)}%` },
              { label: "Tails", value: `${stats.tails}`, detail: `${(100 - stats.headsPercent).toFixed(1)}%` },
              { label: "Total flips", value: stats.total.toLocaleString("en-US") },
              {
                label: "Longest streak",
                value: `${stats.longestStreak}`,
                detail: stats.streakSide ? `of ${stats.streakSide}` : undefined,
              },
            ].map((card) => (
              <div key={card.label} className="surface-card p-4">
                <dt className="text-xs text-muted-foreground">{card.label}</dt>
                <dd className="mt-1 font-mono text-lg text-foreground" data-numeric>
                  {card.value}
                </dd>
                {card.detail ? (
                  <dd className="mt-0.5 text-xs text-subtle-foreground">{card.detail}</dd>
                ) : null}
              </div>
            ))}
          </dl>

          <div className="surface-card p-5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Heads {stats.headsPercent.toFixed(1)}%</span>
              <span>Tails {(100 - stats.headsPercent).toFixed(1)}%</span>
            </div>
            <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-surface-hover">
              <div
                className="h-full bg-[var(--accent-fun)]"
                style={{ width: `${stats.headsPercent}%` }}
              />
            </div>
          </div>

          <section className="surface-card p-5">
            <h2 className="text-sm font-medium text-foreground">Last 100</h2>
            <p className="mt-3 flex flex-wrap gap-1 font-mono text-xs">
              {history.slice(-100).map((side, index) => (
                <span
                  key={index}
                  className={cn(
                    "grid size-6 place-items-center rounded",
                    side === "heads"
                      ? "bg-[color-mix(in_oklab,var(--accent-fun)_20%,transparent)] text-foreground"
                      : "bg-surface-hover text-muted-foreground",
                  )}
                >
                  {side === "heads" ? "H" : "T"}
                </span>
              ))}
            </p>
          </section>
        </>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Each flip comes from the browser&rsquo;s cryptographic random source,
          with the modulo bias removed, so it is genuinely 50/50. Long streaks
          are normal and not evidence otherwise: in 100 fair flips, a run of six
          the same way happens more often than not. Flip a few thousand and watch
          the percentage settle — that is the law of large numbers, and it says
          nothing about what the next flip will do.
        </span>
      </p>
    </div>
  );
}
