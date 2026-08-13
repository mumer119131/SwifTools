"use client";

import * as React from "react";
import { Info, RotateCcw, Sparkles } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toLines } from "@/lib/random";
import { pickNames } from "./logic";

const SAMPLE = `Amara\nBen\nChen\nDiego\nElena\nFarid\nGrace\nHugo\nIsla\nJonas`;

export default function RandomNamePickerTool() {
  const [text, setText] = React.useState(SAMPLE);
  const [count, setCount] = React.useState("1");
  const [noRepeats, setNoRepeats] = React.useState(true);
  const [alreadyPicked, setAlreadyPicked] = React.useState<string[]>([]);
  const [current, setCurrent] = React.useState<string[]>([]);

  const all = toLines(text);
  const pool = noRepeats ? all.filter((name) => !alreadyPicked.includes(name)) : all;
  const exhausted = noRepeats && pool.length === 0 && all.length > 0;

  function pick() {
    if (pool.length === 0) return;
    const picked = pickNames(pool, Number(count));
    setCurrent(picked);
    if (noRepeats) setAlreadyPicked((entries) => [...entries, ...picked]);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="picker-names">Names</Label>
              <span className="text-xs text-muted-foreground">
                {pool.length} of {all.length} left
              </span>
            </div>
            <Textarea
              id="picker-names"
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                setAlreadyPicked([]);
                setCurrent([]);
              }}
              rows={12}
              spellCheck={false}
              placeholder="One name per line"
              className="font-mono text-sm"
            />
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="picker-count">How many</Label>
              <Input
                id="picker-count"
                type="number"
                inputMode="numeric"
                min={1}
                value={count}
                onChange={(event) => setCount(event.target.value)}
                className="w-24"
              />
            </div>
            <div className="flex items-center gap-3 pb-2">
              <Switch
                id="picker-repeats"
                checked={noRepeats}
                onCheckedChange={(value) => {
                  setNoRepeats(value);
                  setAlreadyPicked([]);
                }}
              />
              <Label htmlFor="picker-repeats">Everyone before anyone repeats</Label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="lg" onClick={pick} disabled={pool.length === 0}>
              <Sparkles className="size-4" strokeWidth={1.75} />
              Pick
            </Button>
            {alreadyPicked.length > 0 ? (
              <Button
                variant="ghost"
                onClick={() => {
                  setAlreadyPicked([]);
                  setCurrent([]);
                }}
              >
                <RotateCcw className="size-4" strokeWidth={1.75} />
                Start the round again
              </Button>
            ) : null}
          </div>

          {exhausted ? (
            <p className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
              Everyone has had a turn. Start the round again to go round once more.
            </p>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="surface-card grid min-h-64 place-items-center p-8 text-center">
            {current.length > 0 ? (
              <div aria-live="polite">
                <p className="text-xs text-muted-foreground">
                  {current.length === 1 ? "Picked" : `Picked ${current.length}`}
                </p>
                <p className="mt-3 flex flex-wrap justify-center gap-3">
                  {current.map((name) => (
                    <span
                      key={name}
                      className="text-3xl tracking-[-0.02em] text-foreground sm:text-4xl"
                    >
                      {name}
                    </span>
                  ))}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Press pick to draw a name.</p>
            )}
          </div>

          {alreadyPicked.length > 0 ? (
            <section className="surface-card overflow-hidden">
              <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-2.5">
                <h2 className="text-sm font-medium text-foreground">
                  Already picked
                  <span className="ml-2 text-xs text-subtle-foreground">
                    {alreadyPicked.length}
                  </span>
                </h2>
                <CopyButton
                  value={alreadyPicked.map((name, index) => `${index + 1}. ${name}`).join("\n")}
                  iconOnly
                  label="Copy picked names"
                />
              </header>
              <ol className="divide-y divide-border">
                {alreadyPicked.map((name, index) => (
                  <li key={index} className="flex gap-3 px-5 py-2 text-sm">
                    <span className="w-5 shrink-0 text-right font-mono text-subtle-foreground">
                      {index + 1}
                    </span>
                    <span className="text-foreground">{name}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </div>
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          With repeats off, everyone is drawn once before anyone is drawn twice.
          That is not the same as picking uniformly each time — uniform picking
          will happily call the same child four turns running while another is
          never called, which is fair statistically and obviously unfair in a
          classroom.
        </span>
      </p>
    </div>
  );
}
