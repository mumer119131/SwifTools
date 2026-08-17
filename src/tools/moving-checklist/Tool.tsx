"use client";

import * as React from "react";
import { Info, Plus, RotateCcw, X } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";
import { DEFAULT_TASKS, STAGES, stageDate, type Task } from "./logic";

interface Saved {
  done: string[];
  custom: Task[];
  movingDate: string;
}

const EMPTY: Saved = { done: [], custom: [], movingDate: "" };

/** A stable id from the task text, so ticks survive a reordered default list. */
function taskId(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60);
}

const BASE_TASKS: Task[] = DEFAULT_TASKS.map((task) => ({ ...task, id: taskId(task.label) }));

export default function MovingChecklistTool() {
  const [saved, setSaved, clear] = useLocalStorage<Saved>("pockettoolz:moving-checklist", EMPTY);
  const [draft, setDraft] = React.useState<Record<number, string>>({});

  const tasks = [...BASE_TASKS, ...saved.custom];
  const done = new Set(saved.done);

  const completed = tasks.filter((task) => done.has(task.id)).length;
  const percent = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;

  function toggle(id: string) {
    setSaved((current) => ({
      ...current,
      done: current.done.includes(id)
        ? current.done.filter((entry) => entry !== id)
        : [...current.done, id],
    }));
  }

  function addTask(stage: number) {
    const label = (draft[stage] ?? "").trim();
    if (!label) return;

    setSaved((current) => ({
      ...current,
      custom: [...current.custom, { id: `custom-${Date.now()}`, label, stage, custom: true }],
    }));
    setDraft((current) => ({ ...current, [stage]: "" }));
  }

  const plainText = STAGES.map((stage) => {
    const lines = tasks
      .filter((task) => task.stage === stage.weeks)
      .map((task) => `  [${done.has(task.id) ? "x" : " "}] ${task.label}`);
    return `${stage.title}\n${lines.join("\n")}`;
  }).join("\n\n");

  return (
    <div className="space-y-5">
      <div className="surface-card flex flex-wrap items-end justify-between gap-4 p-5">
        <div className="space-y-2">
          <Label htmlFor="moving-date">Moving date</Label>
          <Input
            id="moving-date"
            type="date"
            value={saved.movingDate}
            onChange={(event) =>
              setSaved((current) => ({ ...current, movingDate: event.target.value }))
            }
            className="w-52"
          />
          <FieldHint>Optional — it puts a date on every stage.</FieldHint>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CopyButton value={plainText} label="Copy list" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clear();
              setDraft({});
            }}
          >
            <RotateCcw className="size-4" strokeWidth={1.75} />
            Start over
          </Button>
        </div>
      </div>

      <div className="surface-card p-5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="font-mono text-sm text-foreground" data-numeric>
            {completed} of {tasks.length} · {percent.toFixed(0)}%
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-hover">
          <div
            className="h-full rounded-full bg-[var(--accent-home)] transition-[width] duration-[240ms] ease-out-expo"
            style={{ width: `${percent}%` }}
            role="progressbar"
            aria-valuenow={Math.round(percent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Checklist progress"
          />
        </div>
      </div>

      <div className="space-y-4">
        {STAGES.map((stage) => {
          const stageTasks = tasks.filter((task) => task.stage === stage.weeks);
          const date = saved.movingDate ? stageDate(saved.movingDate, Math.max(0, stage.weeks)) : null;
          const stageDone = stageTasks.filter((task) => done.has(task.id)).length;

          return (
            <section key={stage.weeks} className="surface-card overflow-hidden">
              <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-5 py-3.5">
                <div>
                  <h2 className="text-sm font-medium text-foreground">{stage.title}</h2>
                  <p className="text-xs text-muted-foreground">{stage.description}</p>
                </div>
                <p className="font-mono text-xs text-subtle-foreground" data-numeric>
                  {stageDone}/{stageTasks.length}
                  {date && stage.weeks > 0
                    ? ` · by ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                    : null}
                </p>
              </header>

              <ul className="divide-y divide-border">
                {stageTasks.map((task) => {
                  const checked = done.has(task.id);
                  return (
                    <li key={task.id} className="flex items-start gap-3 px-5 py-2.5">
                      <input
                        type="checkbox"
                        id={task.id}
                        checked={checked}
                        onChange={() => toggle(task.id)}
                        className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[var(--accent-home)]"
                      />
                      <label
                        htmlFor={task.id}
                        className={cn(
                          "min-w-0 flex-1 cursor-pointer text-sm",
                          checked ? "text-subtle-foreground line-through" : "text-foreground",
                        )}
                      >
                        {task.label}
                      </label>
                      {task.custom ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove ${task.label}`}
                          onClick={() =>
                            setSaved((current) => ({
                              ...current,
                              custom: current.custom.filter((entry) => entry.id !== task.id),
                              done: current.done.filter((entry) => entry !== task.id),
                            }))
                          }
                        >
                          <X className="size-3.5" strokeWidth={1.75} />
                        </Button>
                      ) : null}
                    </li>
                  );
                })}
              </ul>

              <form
                className="flex gap-2 border-t border-border px-5 py-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  addTask(stage.weeks);
                }}
              >
                <Input
                  value={draft[stage.weeks] ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, [stage.weeks]: event.target.value }))
                  }
                  placeholder="Add your own task"
                  aria-label={`Add a task to ${stage.title}`}
                  className="h-9"
                />
                <Button type="submit" variant="outline" size="sm">
                  <Plus className="size-4" strokeWidth={1.75} />
                  Add
                </Button>
              </form>
            </section>
          );
        })}
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Everything here is stored in this browser only — nothing is uploaded,
          and there is no account. That also means it will not follow you to
          another device, and clearing site data will clear the list. Copy it out
          if you want it somewhere permanent.
        </span>
      </p>
    </div>
  );
}
