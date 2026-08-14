"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Info, Minus, Plus, Trash2, X } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";

type Priority = "high" | "normal" | "low";

interface Task {
  id: string;
  text: string;
  done: boolean;
  priority: Priority;
}

const EMPTY: Task[] = [];

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, normal: 1, low: 2 };

const PRIORITY_META: Record<Priority, { label: string; icon: typeof ArrowUp; className: string }> = {
  high: { label: "High", icon: ArrowUp, className: "text-destructive" },
  normal: { label: "Normal", icon: Minus, className: "text-muted-foreground" },
  low: { label: "Low", icon: ArrowDown, className: "text-subtle-foreground" },
};

export default function ToDoListTool() {
  const [tasks, setTasks, clear] = useLocalStorage<Task[]>("swiftknife:todo", EMPTY);
  const [draft, setDraft] = React.useState("");
  const [priority, setPriority] = React.useState<Priority>("normal");
  const [filter, setFilter] = React.useState<"all" | "active" | "done">("all");

  const visible = tasks
    .filter((task) =>
      filter === "all" ? true : filter === "active" ? !task.done : task.done,
    )
    // Unfinished work first, then by priority — the order you'd actually read.
    .sort(
      (a, b) =>
        Number(a.done) - Number(b.done) ||
        PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
    );

  const remaining = tasks.filter((task) => !task.done).length;

  function add(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setTasks((current) => [
      ...current,
      { id: `task-${Date.now()}-${current.length}`, text, done: false, priority },
    ]);
    setDraft("");
  }

  return (
    <div className="space-y-5">
      <form onSubmit={add} className="surface-card flex flex-wrap items-end gap-3 p-5">
        <div className="min-w-48 flex-1 space-y-2">
          <Label htmlFor="todo-add">New task</Label>
          <Input
            id="todo-add"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="What needs doing?"
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Priority</span>
          <Tabs value={priority} onValueChange={(value) => setPriority(value as Priority)}>
            <TabsList>
              <TabsTrigger value="high">High</TabsTrigger>
              <TabsTrigger value="normal">Normal</TabsTrigger>
              <TabsTrigger value="low">Low</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Button type="submit">
          <Plus className="size-4" strokeWidth={1.75} />
          Add
        </Button>
      </form>

      {tasks.length > 0 ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
              <TabsList>
                <TabsTrigger value="all">All {tasks.length}</TabsTrigger>
                <TabsTrigger value="active">Left {remaining}</TabsTrigger>
                <TabsTrigger value="done">Done {tasks.length - remaining}</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-wrap gap-2">
              <CopyButton
                value={tasks.map((task) => `[${task.done ? "x" : " "}] ${task.text}`).join("\n")}
                label="Copy list"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTasks((current) => current.filter((task) => !task.done))}
                disabled={remaining === tasks.length}
              >
                <Trash2 className="size-4" strokeWidth={1.75} />
                Clear done
              </Button>
              <Button variant="ghost" size="sm" onClick={clear}>
                Clear all
              </Button>
            </div>
          </div>

          <ul className="surface-card divide-y divide-border overflow-hidden">
            {visible.map((task) => {
              const meta = PRIORITY_META[task.priority];
              const Icon = meta.icon;

              return (
                <li key={task.id} className="flex items-center gap-3 px-5 py-3">
                  <input
                    type="checkbox"
                    id={task.id}
                    checked={task.done}
                    onChange={() =>
                      setTasks((current) =>
                        current.map((entry) =>
                          entry.id === task.id ? { ...entry, done: !entry.done } : entry,
                        ),
                      )
                    }
                    className="size-4 shrink-0 cursor-pointer accent-[var(--accent-fun)]"
                  />
                  <Icon
                    className={cn("size-3.5 shrink-0", meta.className)}
                    strokeWidth={2}
                    aria-label={`${meta.label} priority`}
                  />
                  <label
                    htmlFor={task.id}
                    className={cn(
                      "min-w-0 flex-1 cursor-pointer text-sm",
                      task.done ? "text-subtle-foreground line-through" : "text-foreground",
                    )}
                  >
                    {task.text}
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${task.text}`}
                    onClick={() =>
                      setTasks((current) => current.filter((entry) => entry.id !== task.id))
                    }
                  >
                    <X className="size-3.5" strokeWidth={1.75} />
                  </Button>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Nothing on the list. Add a task above.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Tasks are kept in this browser only — no account, nothing uploaded, and
          no sync to your phone. That is the trade: it works instantly and asks
          nothing of you, and it is gone if you clear site data. Copy the list out
          if it matters.
        </span>
      </p>
    </div>
  );
}
