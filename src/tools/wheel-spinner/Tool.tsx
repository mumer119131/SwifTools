"use client";

import * as React from "react";
import { Info, RotateCcw, Trophy } from "lucide-react";

import { SpinWheel } from "@/components/shared/SpinWheel";
import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { FieldHint, Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toLines } from "@/lib/random";

const SAMPLE = `Pizza\nSushi\nThai\nBurgers\nCurry\nRamen\nTapas\nDumplings`;

export default function WheelSpinnerTool() {
  const [text, setText] = React.useState(SAMPLE);
  const [eliminate, setEliminate] = React.useState(false);
  const [removed, setRemoved] = React.useState<string[]>([]);
  const [winner, setWinner] = React.useState<string | null>(null);
  const [drawn, setDrawn] = React.useState<string[]>([]);

  const all = toLines(text);
  const entries = all.filter((entry) => !removed.includes(entry));

  return (
    <div className="space-y-5">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="wheel-entries">Entries</Label>
              <span className="text-xs text-muted-foreground">
                {entries.length} on the wheel
              </span>
            </div>
            <Textarea
              id="wheel-entries"
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                setRemoved([]);
                setDrawn([]);
                setWinner(null);
              }}
              rows={12}
              spellCheck={false}
              placeholder="One entry per line"
              className="font-mono text-sm"
            />
            <FieldHint>Two or more entries. Long names are truncated on the wheel.</FieldHint>
          </div>

          <div className="flex items-center gap-3">
            <Switch id="wheel-eliminate" checked={eliminate} onCheckedChange={setEliminate} />
            <Label htmlFor="wheel-eliminate">Remove the winner after each spin</Label>
          </div>

          {drawn.length > 0 ? (
            <section className="surface-card overflow-hidden">
              <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-2.5">
                <h2 className="text-sm font-medium text-foreground">Drawn so far</h2>
                <div className="flex gap-2">
                  <CopyButton
                    value={drawn.map((entry, index) => `${index + 1}. ${entry}`).join("\n")}
                    iconOnly
                    label="Copy results"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Reset the wheel"
                    onClick={() => {
                      setRemoved([]);
                      setDrawn([]);
                      setWinner(null);
                    }}
                  >
                    <RotateCcw className="size-4" strokeWidth={1.75} />
                  </Button>
                </div>
              </header>
              <ol className="divide-y divide-border">
                {drawn.map((entry, index) => (
                  <li key={index} className="flex gap-3 px-5 py-2 text-sm">
                    <span className="w-5 shrink-0 text-right font-mono text-subtle-foreground">
                      {index + 1}
                    </span>
                    <span className="text-foreground">{entry}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </div>

        <div className="space-y-6">
          <SpinWheel
            entries={entries}
            removeOnWin={eliminate}
            onResult={(entry) => {
              setWinner(entry);
              setDrawn((current) => [...current, entry]);
            }}
            onRemove={(index) => setRemoved((current) => [...current, entries[index]])}
          />

          {winner ? (
            <div className="surface-card p-6 text-center" aria-live="polite">
              <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Trophy className="size-3.5" strokeWidth={1.75} />
                Winner
              </p>
              <p className="mt-2 text-3xl tracking-[-0.02em] text-foreground">{winner}</p>
            </div>
          ) : null}
        </div>
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The winner is picked from the browser&rsquo;s cryptographic random
          source before the wheel starts moving, and the rotation is then worked
          out to land on it. That is deliberately the opposite of how it looks:
          spinning by a random angle and reading whatever lands under the pointer
          is very slightly unfair, because floating-point rounding at the segment
          edges does not divide the circle perfectly evenly.
        </span>
      </p>
    </div>
  );
}
