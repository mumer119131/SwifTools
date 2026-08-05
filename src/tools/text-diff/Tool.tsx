"use client";

import * as React from "react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/misc";
import { cn, formatNumber } from "@/lib/utils";
import { diffLines, toUnifiedDiff, type DiffLine } from "./logic";

type View = "split" | "unified";

/** Row tinting per operation. Paired with a +/− sign so colour is never alone. */
const rowStyles: Record<DiffLine["op"], string> = {
  equal: "",
  insert: "bg-[color-mix(in_oklab,var(--success)_14%,transparent)]",
  delete: "bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)]",
};

export default function TextDiffTool() {
  const [original, setOriginal] = React.useState("");
  const [changed, setChanged] = React.useState("");
  const [ignoreCase, setIgnoreCase] = React.useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = React.useState(false);
  const [view, setView] = React.useState<View>("split");

  const diff = React.useMemo(() => {
    if (!original && !changed) return null;
    try {
      return diffLines(original, changed, { ignoreCase, ignoreWhitespace });
    } catch (cause) {
      return { error: cause instanceof Error ? cause.message : "Comparison failed." } as const;
    }
  }, [original, changed, ignoreCase, ignoreWhitespace]);

  const hasError = diff !== null && "error" in diff;
  const result = diff !== null && !("error" in diff) ? diff : null;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="diff-original">Original</Label>
          <Textarea
            id="diff-original"
            value={original}
            onChange={(event) => setOriginal(event.target.value)}
            placeholder="Paste the original text…"
            className="min-h-56 font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="diff-changed">Changed</Label>
          <Textarea
            id="diff-changed"
            value={changed}
            onChange={(event) => setChanged(event.target.value)}
            placeholder="Paste the changed text…"
            className="min-h-56 font-mono text-sm"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="surface-card flex flex-wrap items-center gap-x-6 gap-y-4 p-5">
        <div className="flex items-center gap-3">
          <Switch id="ignore-case" checked={ignoreCase} onCheckedChange={setIgnoreCase} />
          <Label htmlFor="ignore-case">Ignore case</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            id="ignore-whitespace"
            checked={ignoreWhitespace}
            onCheckedChange={setIgnoreWhitespace}
          />
          <Label htmlFor="ignore-whitespace">Ignore whitespace</Label>
        </div>
        <Tabs value={view} onValueChange={(value) => setView(value as View)} className="ml-auto">
          <TabsList>
            <TabsTrigger value="split">Split</TabsTrigger>
            <TabsTrigger value="unified">Unified</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {hasError ? (
        <p role="alert" className="text-sm text-destructive">
          {(diff as { error: string }).error}
        </p>
      ) : null}

      {result ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success">
              +<span data-numeric>{formatNumber(result.summary.added)}</span> added
            </Badge>
            <Badge className="border-[color-mix(in_oklab,var(--destructive)_35%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)] text-destructive">
              −<span data-numeric>{formatNumber(result.summary.removed)}</span> removed
            </Badge>
            <Badge>
              <span data-numeric>{formatNumber(result.summary.unchanged)}</span> unchanged
            </Badge>
            <CopyButton
              value={() => toUnifiedDiff(result.lines)}
              label="Copy unified diff"
              className="ml-auto"
            />
          </div>

          <section className="surface-card overflow-hidden">
            <h2 className="sr-only">Differences</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-mono text-[0.8125rem]">
                <caption className="sr-only">
                  Line-by-line comparison. Lines marked + were added, − were removed.
                </caption>
                <tbody>
                  {result.lines.map((line, index) => (
                    <tr key={index} className={cn(rowStyles[line.op])}>
                      <td className="w-12 select-none border-r border-border px-2 py-1 text-right align-top text-subtle-foreground">
                        {line.leftNumber ?? ""}
                      </td>
                      {view === "split" ? (
                        <td className="w-12 select-none border-r border-border px-2 py-1 text-right align-top text-subtle-foreground">
                          {line.rightNumber ?? ""}
                        </td>
                      ) : null}
                      <td className="w-6 select-none px-2 py-1 text-center align-top text-muted-foreground">
                        {line.op === "insert" ? "+" : line.op === "delete" ? "−" : ""}
                      </td>
                      <td className="whitespace-pre-wrap break-words px-2 py-1 align-top text-foreground">
                        {line.text || " "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Paste text into both boxes to see the differences.
        </p>
      )}
    </div>
  );
}
