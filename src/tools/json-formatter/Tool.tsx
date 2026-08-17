"use client";

import * as React from "react";
import { CheckCircle2, TriangleAlert } from "lucide-react";

import { CodeOutput } from "@/components/shared/CodeOutput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatBytes, formatNumber } from "@/lib/utils";
import { analyseJson, formatJson, minifyJson, parseJson } from "./logic";

type Mode = "beautify" | "minify";

const SAMPLE = '{"name":"PocketToolz","tools":[{"slug":"json-formatter","live":true}],"count":48}';

export default function JsonFormatterTool() {
  const [input, setInput] = React.useState("");
  const [mode, setMode] = React.useState<Mode>("beautify");
  const [indent, setIndent] = React.useState("2");
  const [sorted, setSorted] = React.useState(false);

  const parsed = React.useMemo(() => parseJson(input), [input]);

  const output = React.useMemo(() => {
    if (!parsed.ok) return "";
    return mode === "minify"
      ? minifyJson(parsed.value, sorted)
      : formatJson(parsed.value, Number(indent), sorted);
  }, [parsed, mode, indent, sorted]);

  const stats = React.useMemo(
    () => (parsed.ok ? analyseJson(parsed.value) : null),
    [parsed],
  );

  const hasInput = input.trim().length > 0;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="json-input">JSON input</Label>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setInput(SAMPLE)} disabled={hasInput}>
              Use sample
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setInput("")} disabled={!hasInput}>
              Clear
            </Button>
          </div>
        </div>
        <Textarea
          id="json-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder='{"paste": "your JSON here"}'
          className="min-h-56 font-mono text-sm"
          spellCheck={false}
          aria-invalid={hasInput && !parsed.ok}
          aria-describedby="json-status"
        />
      </div>

      {/* Validity is announced politely rather than assertively — it changes on
          every keystroke and would otherwise talk over the user. */}
      <div id="json-status" aria-live="polite">
        {hasInput && !parsed.ok ? (
          <div
            role="alert"
            className="space-y-2 rounded-md border border-[color-mix(in_oklab,var(--destructive)_30%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3"
          >
            <p className="flex items-start gap-2 text-sm text-destructive">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
              <span>
                {parsed.error.message} — line{" "}
                <span data-numeric>{parsed.error.line}</span>, column{" "}
                <span data-numeric>{parsed.error.column}</span>.
              </span>
            </p>
            {parsed.error.excerpt ? (
              <pre className="overflow-x-auto rounded bg-surface px-3 py-2 font-mono text-xs text-muted-foreground">
                <code>
                  {parsed.error.excerpt}
                  {"\n"}
                  {/* Caret sits under the reported column. */}
                  {" ".repeat(Math.max(0, parsed.error.column - 1))}^
                </code>
              </pre>
            ) : null}
          </div>
        ) : null}

        {hasInput && parsed.ok ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 shrink-0 text-success" strokeWidth={2} />
            Valid JSON.
          </p>
        ) : null}
      </div>

      {parsed.ok ? (
        <>
          <div className="surface-card flex flex-wrap items-center gap-x-6 gap-y-4 p-5">
            <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
              <TabsList>
                <TabsTrigger value="beautify">Beautify</TabsTrigger>
                <TabsTrigger value="minify">Minify</TabsTrigger>
              </TabsList>
            </Tabs>

            {mode === "beautify" ? (
              <div className="flex items-center gap-3">
                <Label htmlFor="json-indent">Indent</Label>
                <Select value={indent} onValueChange={setIndent}>
                  <SelectTrigger id="json-indent" className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 spaces</SelectItem>
                    <SelectItem value="4">4 spaces</SelectItem>
                    <SelectItem value="8">8 spaces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            <div className="flex items-center gap-3">
              <Switch id="sort-keys" checked={sorted} onCheckedChange={setSorted} />
              <Label htmlFor="sort-keys">Sort keys A→Z</Label>
            </div>
          </div>

          <CodeOutput
            value={output}
            label={mode === "minify" ? "Minified" : "Formatted"}
            fileName="formatted.json"
            mimeType="application/json"
          />

          {stats ? (
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Keys", value: formatNumber(stats.keys) },
                { label: "Max depth", value: formatNumber(stats.depth) },
                { label: "Objects / arrays", value: `${stats.objects} / ${stats.arrays}` },
                { label: "Output size", value: formatBytes(new Blob([output]).size) },
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
        </>
      ) : null}
    </div>
  );
}
