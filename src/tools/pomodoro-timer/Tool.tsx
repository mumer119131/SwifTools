"use client";

import * as React from "react";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/misc";
import {
  defaultSettings,
  durationFor,
  formatClock,
  nextPhase,
  phaseLabels,
  playChime,
  type Phase,
  type Settings,
} from "./logic";

export default function PomodoroTimerTool() {
  const [settings, setSettings] = React.useState<Settings>(defaultSettings);
  const [phase, setPhase] = React.useState<Phase>("focus");
  const [remaining, setRemaining] = React.useState(defaultSettings.focusMinutes * 60);
  const [running, setRunning] = React.useState(false);
  const [completedRounds, setCompletedRounds] = React.useState(0);

  const audioRef = React.useRef<AudioContext | null>(null);
  // The deadline is stored as a timestamp rather than decremented per tick, so
  // a throttled background tab can't make the timer drift.
  const deadlineRef = React.useRef<number | null>(null);

  const advance = React.useCallback(() => {
    const roundsAfter = phase === "focus" ? completedRounds + 1 : completedRounds;
    const upcoming = nextPhase(phase, roundsAfter, settings);

    if (settings.soundEnabled && audioRef.current) {
      playChime(audioRef.current, upcoming);
    }

    setCompletedRounds(roundsAfter);
    setPhase(upcoming);
    setRemaining(durationFor(upcoming, settings));

    if (settings.autoStartNext) {
      deadlineRef.current = Date.now() + durationFor(upcoming, settings) * 1000;
    } else {
      setRunning(false);
      deadlineRef.current = null;
    }
  }, [phase, completedRounds, settings]);

  React.useEffect(() => {
    if (!running) return;

    deadlineRef.current ??= Date.now() + remaining * 1000;

    const interval = setInterval(() => {
      const deadline = deadlineRef.current;
      if (deadline === null) return;

      const left = Math.round((deadline - Date.now()) / 1000);
      if (left <= 0) {
        advance();
      } else {
        setRemaining(left);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [running, remaining, advance]);

  // Mirror the countdown into the tab title so it is readable in the background.
  React.useEffect(() => {
    if (!running) {
      document.title = document.title.replace(/^\(\d+:\d+\)\s*/, "");
      return;
    }
    const base = document.title.replace(/^\(\d+:\d+\)\s*/, "");
    document.title = `(${formatClock(remaining)}) ${base}`;

    return () => {
      document.title = base;
    };
  }, [running, remaining]);

  function start() {
    // The AudioContext must be created inside a user gesture or it stays
    // suspended and the chime never plays.
    if (!audioRef.current && settings.soundEnabled) {
      audioRef.current = new AudioContext();
    }
    void audioRef.current?.resume();

    deadlineRef.current = Date.now() + remaining * 1000;
    setRunning(true);
  }

  function pause() {
    setRunning(false);
    deadlineRef.current = null;
  }

  function reset() {
    setRunning(false);
    deadlineRef.current = null;
    setRemaining(durationFor(phase, settings));
  }

  function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((current) => {
      const next = { ...current, [key]: value };
      // A duration change applies immediately when the timer isn't running.
      if (!running) setRemaining(durationFor(phase, next));
      return next;
    });
  }

  const total = durationFor(phase, settings);
  const progress = total > 0 ? 1 - remaining / total : 0;
  const circumference = 2 * Math.PI * 45;

  return (
    <div className="space-y-5">
      <div className="surface-card flex flex-col items-center gap-6 p-8">
        <div className="flex items-center gap-2">
          <Badge variant={phase === "focus" ? "outline" : "success"}>{phaseLabels[phase]}</Badge>
          <Badge>
            Round <span data-numeric>{completedRounds + (phase === "focus" ? 1 : 0)}</span>
          </Badge>
        </div>

        <div className="relative grid size-56 place-items-center sm:size-64">
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="3" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--foreground)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              // Transitioning the dash offset keeps the ring smooth between the
              // 250ms polls without animating a layout property.
              style={{ transition: "stroke-dashoffset 250ms linear" }}
            />
          </svg>
          <p
            className="font-mono text-5xl tracking-[-0.03em] text-foreground sm:text-6xl"
            data-numeric
            role="timer"
            aria-live="off"
            aria-label={`${formatClock(remaining)} remaining in ${phaseLabels[phase]}`}
          >
            {formatClock(remaining)}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {running ? (
            <Button size="lg" onClick={pause}>
              <Pause strokeWidth={1.75} />
              Pause
            </Button>
          ) : (
            <Button size="lg" onClick={start}>
              <Play strokeWidth={1.75} />
              Start
            </Button>
          )}
          <Button variant="outline" size="lg" onClick={reset}>
            <RotateCcw strokeWidth={1.75} />
            Reset
          </Button>
          <Button variant="ghost" size="lg" onClick={advance}>
            <SkipForward strokeWidth={1.75} />
            Skip
          </Button>
        </div>
      </div>

      <section className="surface-card grid gap-5 p-5 sm:grid-cols-3">
        <h2 className="sr-only">Timer settings</h2>

        {(
          [
            ["focusMinutes", "Focus (min)", 1, 120],
            ["shortBreakMinutes", "Short break (min)", 1, 60],
            ["longBreakMinutes", "Long break (min)", 1, 60],
          ] as [keyof Settings, string, number, number][]
        ).map(([key, label, min, max]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={`pomo-${key}`}>{label}</Label>
            <Input
              id={`pomo-${key}`}
              type="number"
              inputMode="numeric"
              min={min}
              max={max}
              value={settings[key] as number}
              onChange={(event) =>
                updateSetting(
                  key,
                  Math.max(min, Math.min(max, Number(event.target.value) || min)) as never,
                )
              }
              disabled={running}
            />
          </div>
        ))}

        <div className="space-y-2">
          <Label htmlFor="pomo-rounds">Rounds before long break</Label>
          <Input
            id="pomo-rounds"
            type="number"
            inputMode="numeric"
            min={2}
            max={10}
            value={settings.roundsBeforeLongBreak}
            onChange={(event) =>
              updateSetting(
                "roundsBeforeLongBreak",
                Math.max(2, Math.min(10, Number(event.target.value) || 4)),
              )
            }
            disabled={running}
          />
        </div>

        <div className="flex items-center gap-3 sm:pt-7">
          <Switch
            id="pomo-auto"
            checked={settings.autoStartNext}
            onCheckedChange={(value) => updateSetting("autoStartNext", value)}
          />
          <Label htmlFor="pomo-auto">Auto-start next</Label>
        </div>

        <div className="flex items-center gap-3 sm:pt-7">
          <Switch
            id="pomo-sound"
            checked={settings.soundEnabled}
            onCheckedChange={(value) => updateSetting("soundEnabled", value)}
          />
          <Label htmlFor="pomo-sound">Chime</Label>
        </div>

        <FieldHint className="sm:col-span-3">
          Durations can only be changed while the timer is paused. The countdown is anchored to a
          wall-clock deadline, so it stays accurate even if the browser throttles this tab.
        </FieldHint>
      </section>
    </div>
  );
}
