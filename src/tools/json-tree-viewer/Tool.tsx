"use client";

import * as React from "react";
import { ChevronRight, TriangleAlert } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseJson } from "@/tools/json-formatter/logic";
import { cn, formatNumber } from "@/lib/utils";
import {
  allContainerPaths,
  buildTree,
  findMatches,
  preview,
  statsFor,
  type JsonValue,
  type TreeNode,
} from "./logic";

const SAMPLE = `{
  "site": "PocketToolz",
  "tools": [
    { "slug": "json-tree-viewer", "category": "developer", "live": true },
    { "slug": "color-mixer", "category": "color", "live": true }
  ],
  "meta": { "count": 62, "updated": "2026-08-06", "tags": ["free", "no signup"] }
}`;

/** Colour per JSON type — paired with the value's own syntax, never colour alone. */
const KIND_CLASS: Record<TreeNode["kind"], string> = {
  string: "text-[var(--accent-developer)]",
  number: "text-[var(--accent-calculator)]",
  boolean: "text-[var(--accent-seo)]",
  null: "text-subtle-foreground",
  object: "text-muted-foreground",
  array: "text-muted-foreground",
};

export default function JsonTreeViewerTool() {
  const [input, setInput] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set());

  const parsed = React.useMemo(() => parseJson(input), [input]);
  const tree = React.useMemo(
    () => (parsed.ok ? buildTree(parsed.value as JsonValue) : null),
    [parsed],
  );
  const matches = React.useMemo(
    () => (tree ? findMatches(tree, query) : new Set<string>()),
    [tree, query],
  );
  const stats = React.useMemo(() => (tree ? statsFor(tree) : null), [tree]);

  const filtering = query.trim().length > 0;

  function toggle(path: string) {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="tree-input">JSON</Label>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setInput(SAMPLE)} disabled={!!input}>
              Use sample
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setInput("")} disabled={!input}>
              Clear
            </Button>
          </div>
        </div>
        <Textarea
          id="tree-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder='{ "paste": "your JSON here" }'
          className="min-h-40 font-mono text-sm"
          spellCheck={false}
          aria-invalid={input.trim() !== "" && !parsed.ok}
        />
      </div>

      {input.trim() && !parsed.ok ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md border border-[color-mix(in_oklab,var(--destructive)_30%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-destructive"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          <span>
            {parsed.error.message} — line <span data-numeric>{parsed.error.line}</span>, column{" "}
            <span data-numeric>{parsed.error.column}</span>.
          </span>
        </p>
      ) : null}

      {tree ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-56 flex-1">
              <Label htmlFor="tree-search" className="sr-only">
                Filter the tree
              </Label>
              <Input
                id="tree-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter by key or value…"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => setCollapsed(new Set())}>
              Expand all
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCollapsed(new Set(allContainerPaths(tree)))}
            >
              Collapse all
            </Button>
          </div>

          {filtering ? (
            <p className="text-sm text-muted-foreground" aria-live="polite">
              <span data-numeric>{matches.size}</span> matching{" "}
              {matches.size === 1 ? "node" : "nodes"} and their parents shown.
            </p>
          ) : null}

          <section className="surface-card overflow-x-auto p-2">
            <h2 className="sr-only">JSON tree</h2>
            <ul role="tree" aria-label="JSON structure" className="font-mono text-[0.8125rem]">
              <TreeBranch
                node={tree}
                collapsed={collapsed}
                onToggle={toggle}
                matches={matches}
                filtering={filtering}
              />
            </ul>
          </section>

          {stats ? (
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Nodes", value: formatNumber(stats.nodes) },
                { label: "Max depth", value: formatNumber(stats.maxDepth) },
                { label: "Objects", value: formatNumber(stats.objects) },
                { label: "Arrays", value: formatNumber(stats.arrays) },
              ].map((card) => (
                <div key={card.label} className="surface-card p-4">
                  <dt className="text-xs text-muted-foreground">{card.label}</dt>
                  <dd className="mt-1 font-mono text-lg text-foreground" data-numeric>
                    {card.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          <p className="text-sm text-muted-foreground">
            Copying a path gives you something you can paste straight into code — array indices and
            awkward keys use bracket notation, so{" "}
            <code className="font-mono">$.data[&quot;odd key&quot;][0]</code> stays valid rather
            than becoming a dotted string that wouldn&rsquo;t parse.
          </p>
        </>
      ) : null}
    </div>
  );
}

function TreeBranch({
  node,
  collapsed,
  onToggle,
  matches,
  filtering,
}: {
  node: TreeNode;
  collapsed: Set<string>;
  onToggle: (path: string) => void;
  matches: Set<string>;
  filtering: boolean;
}) {
  if (filtering && !matches.has(node.path)) return null;

  const isContainer = node.children !== undefined;
  const isCollapsed = collapsed.has(node.path);

  return (
    // aria-selected is required on treeitem. This tree is for reading rather
    // than selecting, so every node reports false.
    <li
      role="treeitem"
      aria-selected={false}
      aria-expanded={isContainer ? !isCollapsed : undefined}
    >
      <div
        className="group flex items-center gap-1.5 rounded px-1 py-0.5 hover:bg-surface-hover"
        style={{ paddingLeft: `${node.depth * 1.1 + 0.25}rem` }}
      >
        {isContainer ? (
          <button
            type="button"
            onClick={() => onToggle(node.path)}
            aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${node.key}`}
            className="grid size-5 shrink-0 cursor-pointer place-items-center rounded text-subtle-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]"
          >
            <ChevronRight
              className={cn(
                "size-3.5 transition-transform duration-[120ms] ease-out-expo",
                !isCollapsed && "rotate-90",
              )}
              strokeWidth={2.5}
            />
          </button>
        ) : (
          <span className="size-5 shrink-0" aria-hidden="true" />
        )}

        <span className="shrink-0 text-foreground">{node.key}</span>
        <span className="shrink-0 text-subtle-foreground">:</span>

        <span className={cn("min-w-0 truncate", KIND_CLASS[node.kind])}>
          {isContainer && !isCollapsed ? (
            <span className="text-subtle-foreground">
              {node.kind === "array" ? "[" : "{"}
            </span>
          ) : (
            preview(node)
          )}
        </span>

        {/* Copy controls stay out of the way until the row is hovered or focused. */}
        <span className="ml-auto flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-[120ms] group-hover:opacity-100 focus-within:opacity-100">
          <CopyButton
            value={node.path}
            iconOnly
            label={`Copy path ${node.path}`}
            className="size-7"
          />
          <CopyButton
            value={() =>
              typeof node.value === "object" && node.value !== null
                ? JSON.stringify(node.value, null, 2)
                : String(node.value)
            }
            iconOnly
            label={`Copy value of ${node.key}`}
            variant="ghost"
            className="size-7"
          />
        </span>
      </div>

      {isContainer && !isCollapsed ? (
        <ul role="group">
          {node.children!.map((child) => (
            <TreeBranch
              key={child.path}
              node={child}
              collapsed={collapsed}
              onToggle={onToggle}
              matches={matches}
              filtering={filtering}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
