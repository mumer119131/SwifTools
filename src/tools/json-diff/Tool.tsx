"use client";

import * as React from "react";
import { Check, Info, Minus, Plus, RefreshCw } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { diff, groupByRoot, parse, preview, type Change } from "./logic";

const A = `{
  "name": "widget",
  "version": "1.2.0",
  "tags": ["a", "b"],
  "config": { "retries": 3, "timeout": 30 }
}`;

const B = `{
  "version": "1.3.0",
  "name": "widget",
  "tags": ["a", "b", "c"],
  "config": { "retries": "3", "verbose": true }
}`;

const KIND_STYLE: Record<Change["kind"], { tint: string; icon: React.ReactNode; label: string }> = {
  added: { tint: "text-[var(--success)]", icon: <Plus className="size-3.5" strokeWidth={2} />, label: "added" },
  removed: { tint: "text-destructive", icon: <Minus className="size-3.5" strokeWidth={2} />, label: "removed" },
  changed: { tint: "text-[var(--warning)]", icon: <RefreshCw className="size-3.5" strokeWidth={2} />, label: "changed" },
  "type-changed": { tint: "text-[var(--accent-pdf)]", icon: <RefreshCw className="size-3.5" strokeWidth={2} />, label: "type changed" },
};

export default function JsonDiffTool() {
  const [left, setLeft] = React.useState(A);
  const [right, setRight] = React.useState(B);

  const parsedLeft = parse(left);
  const parsedRight = parse(right);

  const result =
    "error" in parsedLeft || "error" in parsedRight
      ? null
      : diff(parsedLeft.value, parsedRight.value);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {(
          [
            ["left", "Before", left, setLeft, parsedLeft],
            ["right", "After", right, setRight, parsedRight],
          ] as const
        ).map(([id, label, value, setter, parsed]) => (
          <div key={id} className="space-y-1.5">
            <Label htmlFor={id}>{label}</Label>
            <Textarea
              id={id}
              value={value}
              onChange={(event) => setter(event.target.value)}
              rows={14}
              spellCheck={false}
              className="font-mono text-sm"
              aria-invalid={"error" in parsed}
            />
            {"error" in parsed ? (
              <p className="text-xs text-destructive">{parsed.error}</p>
            ) : null}
          </div>
        ))}
      </div>

      {result ? (
        result.identical ? (
          <p className="flex items-center gap-2 rounded-md border border-[var(--success)] bg-[color-mix(in_oklab,var(--success)_10%,transparent)] px-4 py-3 text-sm text-foreground">
            <Check className="size-4 shrink-0 text-[var(--success)]" strokeWidth={2} />
            Identical. Key order and formatting differ, or do not — either way the
            data is the same.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(result.counts) as Change["kind"][])
                .filter((kind) => result.counts[kind] > 0)
                .map((kind) => (
                  <span
                    key={kind}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs",
                      KIND_STYLE[kind].tint,
                    )}
                  >
                    {KIND_STYLE[kind].icon}
                    {result.counts[kind]} {KIND_STYLE[kind].label}
                  </span>
                ))}
            </div>

            {groupByRoot(result.changes).map((group) => (
              <section key={group.root} className="surface-card overflow-hidden">
                <h2 className="border-b border-border px-4 py-2 font-mono text-sm text-foreground">
                  {group.root}
                </h2>
                <ul className="divide-y divide-border">
                  {group.changes.map((change) => (
                    <li key={`${change.kind}-${change.path}`} className="px-4 py-2.5 text-sm">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className={cn("shrink-0", KIND_STYLE[change.kind].tint)}>
                          {KIND_STYLE[change.kind].icon}
                        </span>
                        <span className="font-mono text-foreground">{change.path || "(root)"}</span>
                        {change.kind === "type-changed" ? (
                          <span className="text-xs text-muted-foreground">
                            {change.beforeType} → {change.afterType}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 pl-6 font-mono text-xs">
                        {change.kind !== "added" ? (
                          <span className="text-destructive">− {preview(change.before)}</span>
                        ) : null}
                        {change.kind !== "removed" ? (
                          <span className="text-[var(--success)]">+ {preview(change.after)}</span>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </>
        )
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The parsed values are compared, not the text — so reordered keys and
          different formatting register as identical, which a line-based diff
          cannot manage. Arrays are compared by position: inserting an item at
          the front will show every later index as changed, because working out
          that it was an insertion is a much harder problem than it looks.
        </span>
      </p>
    </div>
  );
}
