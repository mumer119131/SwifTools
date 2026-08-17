"use client";

import * as React from "react";
import { Flame, Info, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHydrated } from "@/lib/use-client-value";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";
import { dayKey, recentDays, streaks, type Habit } from "./logic";

const EMPTY: Habit[] = [];
const WINDOW = 35; // five weeks

export default function HabitTrackerTool() {
  const [habits, setHabits, clear] = useLocalStorage<Habit[]>("pockettoolz:habits", EMPTY);
  const [draft, setDraft] = React.useState("");
  const hydrated = useHydrated();

  // The date is read at render, so the grid rolls over without a timer. The
  // server render shows nothing rather than a date that would mismatch.
  const today = hydrated ? new Date() : null;
  const days = today ? recentDays(WINDOW, today) : [];

  function add(event: React.FormEvent) {
    event.preventDefault();
    const name = draft.trim();
    if (!name) return;

    setHabits((current) => [...current, { id: `habit-${Date.now()}`, name, done: [] }]);
    setDraft("");
  }

  function toggle(id: string, key: string) {
    setHabits((current) =>
      current.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              done: habit.done.includes(key)
                ? habit.done.filter((entry) => entry !== key)
                : [...habit.done, key],
            }
          : habit,
      ),
    );
  }

  return (
    <div className="space-y-5">
      <form onSubmit={add} className="surface-card flex flex-wrap items-end gap-3 p-5">
        <div className="min-w-48 flex-1 space-y-2">
          <Label htmlFor="habit-add">New habit</Label>
          <Input
            id="habit-add"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Read 20 pages, walk, no phone after 10…"
            autoComplete="off"
          />
        </div>
        <Button type="submit">
          <Plus className="size-4" strokeWidth={1.75} />
          Add
        </Button>
        {habits.length > 0 ? (
          <Button variant="ghost" onClick={clear}>
            Clear all
          </Button>
        ) : null}
      </form>

      {!hydrated ? (
        <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Loading your habits…
        </p>
      ) : habits.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          No habits yet. Add one above — two or three is plenty to start.
        </p>
      ) : (
        <div className="space-y-4">
          {habits.map((habit) => {
            const stats = streaks(habit.done, today!, WINDOW);

            return (
              <section key={habit.id} className="surface-card overflow-hidden">
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
                  <h2 className="text-sm font-medium text-foreground">{habit.name}</h2>
                  <div className="flex items-center gap-5 text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Flame
                        className={cn(
                          "size-3.5",
                          stats.current > 0 ? "text-[var(--accent-fun)]" : "text-subtle-foreground",
                        )}
                        strokeWidth={1.75}
                      />
                      <span className="font-mono text-foreground" data-numeric>
                        {stats.current}
                      </span>{" "}
                      day streak
                    </span>
                    <span className="text-muted-foreground">
                      best{" "}
                      <span className="font-mono text-foreground" data-numeric>
                        {stats.best}
                      </span>
                    </span>
                    <span className="text-muted-foreground">
                      <span className="font-mono text-foreground" data-numeric>
                        {stats.rate.toFixed(0)}%
                      </span>{" "}
                      of 5 weeks
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${habit.name}`}
                      onClick={() =>
                        setHabits((current) => current.filter((entry) => entry.id !== habit.id))
                      }
                    >
                      <X className="size-3.5" strokeWidth={1.75} />
                    </Button>
                  </div>
                </header>

                <div className="overflow-x-auto p-5">
                  <div className="grid grid-flow-col grid-rows-7 gap-1" style={{ width: "max-content" }}>
                    {days.map((date) => {
                      const key = dayKey(date);
                      const marked = habit.done.includes(key);
                      const isToday = key === dayKey(today!);

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggle(habit.id, key)}
                          title={date.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                          aria-label={`${habit.name} on ${date.toDateString()}${marked ? " — done" : ""}`}
                          aria-pressed={marked}
                          className={cn(
                            "size-5 cursor-pointer rounded-sm border transition-colors duration-[180ms] ease-out-expo",
                            "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]",
                            marked
                              ? "border-[var(--accent-fun)] bg-[var(--accent-fun)]"
                              : "border-border bg-surface-hover hover:border-border-strong",
                            isToday && "ring-1 ring-foreground ring-offset-1 ring-offset-[var(--surface)]",
                          )}
                        />
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          A streak stays alive until you miss a whole day — not ticking today
          before lunch does not break it, which is the behaviour that stops the
          counter being discouraging by nine in the morning. Everything is stored
          in this browser only, with no account and nothing uploaded, so it will
          not follow you to another device.
        </span>
      </p>
    </div>
  );
}
