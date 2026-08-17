"use client";

import * as React from "react";
import { Info, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";
import { PASSAGES, score } from "./logic";

const NO_BEST: Record<string, number> = {};

export default function TypingSpeedTestTool() {
  const [passageId, setPassageId] = React.useState("medium");
  const passage = PASSAGES.find((entry) => entry.id === passageId)!;

  const [typed, setTyped] = React.useState("");
  const [running, setRunning] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [best, setBest] = useLocalStorage<Record<string, number>>("pockettoolz:typing-best", NO_BEST);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const finished = typed.length >= passage.text.length;
  const result = score(passage.text, typed, elapsed);

  // Tick rather than subtract timestamps — reading the clock during a render or
  // an event handler trips React Compiler's purity rule.
  React.useEffect(() => {
    if (!running || finished) return;
    const timer = window.setInterval(() => setElapsed((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [running, finished]);

  const recordedRef = React.useRef(false);
  React.useEffect(() => {
    if (!finished || recordedRef.current) return;
    recordedRef.current = true;
    setRunning(false);

    const wpm = Math.round(result.netWpm);
    if (!best[passageId] || wpm > best[passageId]) {
      setBest((entries) => ({ ...entries, [passageId]: wpm }));
    }
  }, [finished, result.netWpm, best, passageId, setBest]);

  function reset(nextId = passageId) {
    setPassageId(nextId);
    setTyped("");
    setRunning(false);
    setElapsed(0);
    recordedRef.current = false;
    inputRef.current?.focus();
  }

  return (
    <div className="space-y-5">
      <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
        <Tabs value={passageId} onValueChange={(value) => reset(value)}>
          <TabsList>
            {PASSAGES.map((entry) => (
              <TabsTrigger key={entry.id} value={entry.id}>
                {entry.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs text-muted-foreground">Net WPM</p>
            <p className="font-mono text-2xl text-foreground" data-numeric>
              {elapsed > 0 ? Math.round(result.netWpm) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Accuracy</p>
            <p className="font-mono text-2xl text-foreground" data-numeric>
              {typed.length > 0 ? `${result.accuracy.toFixed(1)}%` : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Time</p>
            <p className="font-mono text-2xl text-foreground" data-numeric>
              {elapsed}s
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Your best</p>
            <p className="font-mono text-2xl text-foreground" data-numeric>
              {best[passageId] ?? "—"}
            </p>
          </div>
          <Button variant="outline" onClick={() => reset()}>
            <RotateCcw className="size-4" strokeWidth={1.75} />
            Restart
          </Button>
        </div>
      </div>

      {/* The passage, with each character marked as it is typed. */}
      <div className="surface-card p-6 font-mono text-lg leading-relaxed">
        {passage.text.split("").map((character, index) => {
          const attempt = typed[index];
          return (
            <span
              key={index}
              className={cn(
                attempt === undefined
                  ? index === typed.length
                    ? "border-l-2 border-foreground text-muted-foreground"
                    : "text-muted-foreground"
                  : attempt === character
                    ? "text-foreground"
                    : "rounded-sm bg-[color-mix(in_oklab,var(--destructive)_22%,transparent)] text-destructive",
              )}
            >
              {character}
            </span>
          );
        })}
      </div>

      <textarea
        ref={inputRef}
        value={typed}
        onChange={(event) => {
          setRunning(true);
          setTyped(event.target.value.slice(0, passage.text.length));
        }}
        disabled={finished}
        rows={4}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        placeholder="Click here and start typing. The clock starts with your first keystroke."
        aria-label="Type the passage here"
        className="w-full rounded-lg border border-border bg-surface px-4 py-3 font-mono text-base text-foreground placeholder:text-subtle-foreground focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-[var(--ring)] disabled:opacity-60"
      />

      {finished ? (
        <div className="surface-card p-6 text-center" aria-live="polite">
          <p className="text-xs text-muted-foreground">Finished</p>
          <p className="mt-2 font-mono text-5xl tracking-[-0.03em] text-foreground" data-numeric>
            {Math.round(result.netWpm)} WPM
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {Math.round(result.grossWpm)} gross · {result.accuracy.toFixed(1)}% accurate ·{" "}
            {result.incorrect} error{result.incorrect === 1 ? "" : "s"} · {elapsed}s
          </p>
        </div>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          A &ldquo;word&rdquo; here is five characters including the space, which
          is the convention every typing test uses — counting real words would
          let a passage of short words score far higher than one of long words at
          the same physical speed. Net WPM deducts a word for each uncorrected
          error, and it is the number worth quoting: gross speed with 85% accuracy
          is slower in practice than a steadier pace you do not have to go back
          and fix.
        </span>
      </p>
    </div>
  );
}
