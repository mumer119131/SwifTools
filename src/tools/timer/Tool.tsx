"use client";

import * as React from "react";
import { Bell, BellOff, Flag, Pause, Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  PRESETS,
  addSplit,
  formatDuration,
  formatForTitle,
  lapExtremes,
  parseDuration,
  playAlarm,
  presetLabel,
  remainingFrom,
  type Split,
} from "./logic";

/**
 * Ticks often enough for a smooth tenths readout on the stopwatch. The interval
 * only decides how often we *look* at the clock — the value shown always comes
 * from comparing timestamps, so a throttled or delayed tick shows the right
 * number rather than a slow one.
 */
const TICK_MS = 100;

export default function TimerTool() {
  const [mode, setMode] = React.useState<"timer" | "stopwatch">("timer");
  const [sound, setSound] = React.useState(true);

  /* ------------------------------------------------------------ timer */
  const [duration, setDuration] = React.useState(300);
  const [input, setInput] = React.useState("5:00");
  const [remaining, setRemaining] = React.useState(300_000);
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  const deadlineRef = React.useRef<number | null>(null);

  /* -------------------------------------------------------- stopwatch */
  const [elapsed, setElapsed] = React.useState(0);
  const [watchRunning, setWatchRunning] = React.useState(false);
  const [splits, setSplits] = React.useState<Split[]>([]);
  const startedAtRef = React.useRef<number | null>(null);
  const accumulatedRef = React.useRef(0);

  const audioRef = React.useRef<AudioContext | null>(null);

  /** Created on a user gesture, which is the only time browsers allow it. */
  function unlockAudio(): AudioContext | null {
    if (!sound) return null;
    if (!audioRef.current) {
      const Ctor = window.AudioContext ?? (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      audioRef.current = new Ctor();
    }
    void audioRef.current.resume();
    return audioRef.current;
  }

  /* ------------------------------------------------------ timer ticks */
  React.useEffect(() => {
    if (!timerRunning) return;

    const tick = () => {
      const deadline = deadlineRef.current;
      if (deadline === null) return;

      const left = remainingFrom(deadline, Date.now());
      setRemaining(left);

      if (left === 0) {
        setTimerRunning(false);
        setFinished(true);
        deadlineRef.current = null;
        const context = audioRef.current;
        if (sound && context) playAlarm(context);
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification("Timer finished", { body: `${formatDuration(duration * 1000)} is up.` });
        }
      }
    };

    const interval = setInterval(tick, TICK_MS);
    return () => clearInterval(interval);
  }, [timerRunning, sound, duration]);

  /* -------------------------------------------------- stopwatch ticks */
  React.useEffect(() => {
    if (!watchRunning) return;

    const interval = setInterval(() => {
      const startedAt = startedAtRef.current;
      if (startedAt === null) return;
      setElapsed(accumulatedRef.current + (Date.now() - startedAt));
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [watchRunning]);

  /* ------------------------------------------------------- tab title */
  React.useEffect(() => {
    const original = document.title;

    if (mode === "timer" && (timerRunning || finished)) {
      document.title = finished ? "Time's up" : `${formatForTitle(remaining)} — Timer`;
    } else if (mode === "stopwatch" && watchRunning) {
      document.title = `${formatForTitle(elapsed)} — Stopwatch`;
    }

    return () => {
      document.title = original;
    };
  }, [mode, timerRunning, finished, remaining, watchRunning, elapsed]);

  /* -------------------------------------------------------- controls */

  function applyDuration(seconds: number) {
    setDuration(seconds);
    setInput(formatDuration(seconds * 1000));
    setRemaining(seconds * 1000);
    setTimerRunning(false);
    setFinished(false);
    deadlineRef.current = null;
  }

  function commitInput(value: string) {
    setInput(value);
    const parsed = parseDuration(value);
    if (parsed !== null && parsed > 0) {
      setDuration(parsed);
      if (!timerRunning) {
        setRemaining(parsed * 1000);
        setFinished(false);
      }
    }
  }

  function toggleTimer() {
    if (timerRunning) {
      // Freeze what is left; the deadline is rebuilt from it on resume.
      const deadline = deadlineRef.current;
      if (deadline !== null) setRemaining(remainingFrom(deadline, Date.now()));
      deadlineRef.current = null;
      setTimerRunning(false);
      return;
    }

    unlockAudio();
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      void Notification.requestPermission();
    }

    const from = finished || remaining === 0 ? duration * 1000 : remaining;
    deadlineRef.current = Date.now() + from;
    setRemaining(from);
    setFinished(false);
    setTimerRunning(true);
  }

  function resetTimer() {
    deadlineRef.current = null;
    setTimerRunning(false);
    setFinished(false);
    setRemaining(duration * 1000);
  }

  function toggleWatch() {
    if (watchRunning) {
      const startedAt = startedAtRef.current;
      if (startedAt !== null) accumulatedRef.current += Date.now() - startedAt;
      startedAtRef.current = null;
      setWatchRunning(false);
      return;
    }
    unlockAudio();
    startedAtRef.current = Date.now();
    setWatchRunning(true);
  }

  function resetWatch() {
    startedAtRef.current = null;
    accumulatedRef.current = 0;
    setWatchRunning(false);
    setElapsed(0);
    setSplits([]);
  }

  function recordSplit() {
    const startedAt = startedAtRef.current;
    const total = startedAt === null ? elapsed : accumulatedRef.current + (Date.now() - startedAt);
    setSplits((current) => addSplit(current, total));
  }

  const extremes = lapExtremes(splits);
  const progress = duration > 0 ? 1 - remaining / (duration * 1000) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Tabs value={mode} onValueChange={(value) => setMode(value as typeof mode)}>
          <TabsList>
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSound((value) => !value)}
          aria-pressed={sound}
          aria-label={sound ? "Mute the alarm" : "Unmute the alarm"}
        >
          {sound ? <Bell strokeWidth={1.75} /> : <BellOff strokeWidth={1.75} />}
          {sound ? "Sound on" : "Muted"}
        </Button>
      </div>

      {mode === "timer" ? (
        <>
          <div
            className={cn(
              "surface-card relative overflow-hidden px-6 py-12 text-center",
              finished && "border-[var(--success)]",
            )}
          >
            {/* A quiet progress wash rather than a bar — readable at a glance
                from across a room, which is where a timer is usually read. */}
            <div
              className="absolute inset-y-0 left-0 bg-surface-hover transition-[width] duration-200 ease-linear"
              style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
              aria-hidden="true"
            />
            <div className="relative">
              <div
                className="font-display tabular-nums text-foreground"
                style={{ fontSize: "clamp(3.5rem, 16vw, 7rem)", lineHeight: 1 }}
                role="timer"
                aria-live="off"
              >
                {formatDuration(remaining)}
              </div>
              <p aria-live="polite" className="sr-only">
                {finished ? "Timer finished" : `${formatForTitle(remaining)} remaining`}
              </p>
              {finished ? (
                <p className="mt-4 text-lg text-[var(--success)]">Time&rsquo;s up</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={input}
                onChange={(event) => commitInput(event.target.value)}
                placeholder="5:00"
                className="w-32 font-mono"
                spellCheck={false}
                aria-invalid={parseDuration(input) === null}
              />
            </div>
            <Button onClick={toggleTimer} size="lg">
              {timerRunning ? <Pause strokeWidth={1.75} /> : <Play strokeWidth={1.75} />}
              {timerRunning ? "Pause" : finished || remaining === 0 ? "Start again" : "Start"}
            </Button>
            <Button variant="outline" size="lg" onClick={resetTimer}>
              <RotateCcw strokeWidth={1.75} />
              Reset
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyDuration(preset)}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm transition-colors",
                  duration === preset
                    ? "border-border-strong text-foreground"
                    : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
                )}
              >
                {presetLabel(preset)}
              </button>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            Type <code className="font-mono">90</code> for ninety minutes,{" "}
            <code className="font-mono">1:30</code> for ninety seconds, or{" "}
            <code className="font-mono">1h30m</code>. The countdown runs off the
            clock rather than counting ticks, so it stays accurate in a
            background tab.
          </p>
        </>
      ) : (
        <>
          <div className="surface-card px-6 py-12 text-center">
            <div
              className="font-display tabular-nums text-foreground"
              style={{ fontSize: "clamp(3rem, 14vw, 6rem)", lineHeight: 1 }}
            >
              {formatDuration(elapsed, true)}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={toggleWatch} size="lg">
              {watchRunning ? <Pause strokeWidth={1.75} /> : <Play strokeWidth={1.75} />}
              {watchRunning ? "Pause" : elapsed > 0 ? "Resume" : "Start"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={recordSplit}
              disabled={!watchRunning && elapsed === 0}
            >
              <Flag strokeWidth={1.75} />
              Lap
            </Button>
            <Button variant="outline" size="lg" onClick={resetWatch} disabled={elapsed === 0}>
              <RotateCcw strokeWidth={1.75} />
              Reset
            </Button>
          </div>

          {splits.length > 0 ? (
            <div className="surface-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-5 py-2 font-medium">Lap</th>
                    <th className="px-5 py-2 font-medium">Split</th>
                    <th className="px-5 py-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[...splits].reverse().map((split) => (
                    <tr key={split.index}>
                      <td className="px-5 py-2 text-muted-foreground" data-numeric>
                        {split.index}
                      </td>
                      <td
                        className={cn(
                          "px-5 py-2 font-mono tabular-nums",
                          extremes && split.lap === extremes.fastest && "text-[var(--success)]",
                          extremes && split.lap === extremes.slowest && "text-destructive",
                        )}
                        data-numeric
                      >
                        {formatDuration(split.lap, true)}
                        {extremes && split.lap === extremes.fastest ? (
                          <span className="ml-2 text-xs">fastest</span>
                        ) : null}
                        {extremes && split.lap === extremes.slowest ? (
                          <span className="ml-2 text-xs">slowest</span>
                        ) : null}
                      </td>
                      <td className="px-5 py-2 font-mono tabular-nums text-muted-foreground" data-numeric>
                        {formatDuration(split.total, true)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
