"use client";

import * as React from "react";

import { CopyButton } from "@/components/shared/CopyButton";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNumber } from "@/lib/utils";
import { dedupeLines, type OutputMode, type SortOrder } from "./logic";

export default function RemoveDuplicateLinesTool() {
  const [text, setText] = React.useState("");
  const [caseSensitive, setCaseSensitive] = React.useState(false);
  const [trimWhitespace, setTrimWhitespace] = React.useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = React.useState(true);
  const [sort, setSort] = React.useState<SortOrder>("original");
  const [mode, setMode] = React.useState<OutputMode>("unique");

  const result = React.useMemo(
    () => dedupeLines(text, { caseSensitive, trimWhitespace, removeEmptyLines, sort, mode }),
    [text, caseSensitive, trimWhitespace, removeEmptyLines, sort, mode],
  );

  const output = result.lines.join("\n");

  const toggles = [
    {
      id: "case-sensitive",
      label: "Case-sensitive matching",
      hint: '"Apple" and "apple" count as different lines.',
      checked: caseSensitive,
      onChange: setCaseSensitive,
    },
    {
      id: "trim-whitespace",
      label: "Trim surrounding spaces",
      hint: "Also removes leading and trailing spaces from the output.",
      checked: trimWhitespace,
      onChange: setTrimWhitespace,
    },
    {
      id: "remove-empty",
      label: "Drop empty lines",
      checked: removeEmptyLines,
      onChange: setRemoveEmptyLines,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="dedupe-input">Input</Label>
            <Button variant="ghost" size="sm" onClick={() => setText("")} disabled={!text}>
              Clear
            </Button>
          </div>
          <Textarea
            id="dedupe-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={"One item per line…\napple\nbanana\napple"}
            className="min-h-72 font-mono text-sm"
            spellCheck={false}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="dedupe-output">Output</Label>
            <div className="flex items-center gap-2">
              <CopyButton value={output} label="Copy" />
              <DownloadButton
                blob={() => new Blob([output], { type: "text/plain;charset=utf-8" })}
                fileName="deduplicated.txt"
                label="Save"
                size="sm"
                variant="outline"
                disabled={!output}
              />
            </div>
          </div>
          <Textarea
            id="dedupe-output"
            value={output}
            readOnly
            placeholder="The cleaned list appears here."
            className="min-h-72 bg-surface-hover font-mono text-sm"
            spellCheck={false}
          />
        </div>
      </div>

      <section className="surface-card grid gap-5 p-5 sm:grid-cols-2">
        <div className="space-y-4">
          {toggles.map((toggle) => (
            <div key={toggle.id} className="flex items-start gap-3">
              <Switch
                id={toggle.id}
                checked={toggle.checked}
                onCheckedChange={toggle.onChange}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor={toggle.id}>{toggle.label}</Label>
                {toggle.hint ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">{toggle.hint}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sort-order">Sort output</Label>
            <Select value={sort} onValueChange={(value) => setSort(value as SortOrder)}>
              <SelectTrigger id="sort-order">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="original">Keep original order</SelectItem>
                <SelectItem value="asc">A → Z</SelectItem>
                <SelectItem value="desc">Z → A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="output-mode">Show</Label>
            <Select value={mode} onValueChange={(value) => setMode(value as OutputMode)}>
              <SelectTrigger id="output-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unique">Unique lines</SelectItem>
                <SelectItem value="duplicates-only">Only lines that repeated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <dl className="grid grid-cols-3 gap-3">
        {[
          { label: "Lines in", value: formatNumber(result.totalLines) },
          { label: "Unique", value: formatNumber(result.uniqueLines) },
          { label: "Removed", value: formatNumber(result.removedLines) },
        ].map((card) => (
          <div key={card.label} className="surface-card p-4">
            <dt className="text-xs text-muted-foreground">{card.label}</dt>
            <dd className="mt-1 font-mono text-2xl tracking-[-0.02em] text-foreground" data-numeric>
              {card.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
