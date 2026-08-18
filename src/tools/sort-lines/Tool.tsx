"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { FieldHint, Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MODES, sortLines, type Mode, type Options } from "./logic";

const SAMPLE = `item10
Banana
item2
apple
item1
Cherry
café
banana
`;

export default function SortLinesTool() {
  const [input, setInput] = React.useState(SAMPLE);
  const [options, setOptions] = React.useState<Options>({
    mode: "natural",
    descending: false,
    caseSensitive: false,
    trim: true,
    removeEmpty: true,
    removeDuplicates: false,
  });

  const lines = sortLines(input, options);
  const output = lines.join("\n");
  const inputCount = input.split("\n").filter((line) => line.trim() !== "").length;

  function set<K extends keyof Options>(key: K, value: Options[K]) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  const mode = MODES.find((entry) => entry.id === options.mode)!;

  return (
    <div className="space-y-5">
      <div className="surface-card space-y-4 p-5">
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Order</span>
          <Tabs value={options.mode} onValueChange={(value) => set("mode", value as Mode)}>
            <TabsList>
              {MODES.map((entry) => (
                <TabsTrigger key={entry.id} value={entry.id}>
                  {entry.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <FieldHint>{mode.note}</FieldHint>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { key: "descending" as const, label: "Descending", disabled: options.mode === "reverse" || options.mode === "random" },
            { key: "caseSensitive" as const, label: "Case sensitive", disabled: false },
            { key: "trim" as const, label: "Trim whitespace", disabled: false },
            { key: "removeEmpty" as const, label: "Drop blank lines", disabled: false },
            { key: "removeDuplicates" as const, label: "Remove duplicates", disabled: false },
          ].map((toggle) => (
            <div key={toggle.key} className="flex items-center gap-3">
              <Switch
                id={`sl-${toggle.key}`}
                checked={options[toggle.key]}
                disabled={toggle.disabled}
                onCheckedChange={(value) => set(toggle.key, value)}
              />
              <Label htmlFor={`sl-${toggle.key}`}>{toggle.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="sl-input">Input</Label>
            <span className="text-xs text-muted-foreground">{inputCount} lines</span>
          </div>
          <Textarea
            id="sl-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={18}
            spellCheck={false}
            className="font-mono text-sm"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="sl-output">Sorted</Label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                {lines.length} lines
                {lines.length !== inputCount ? ` · ${inputCount - lines.length} removed` : null}
              </span>
              <CopyButton value={output} label="Copy" />
            </div>
          </div>
          <Textarea
            id="sl-output"
            value={output}
            readOnly
            rows={18}
            spellCheck={false}
            className="font-mono text-sm"
          />
        </div>
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Alphabetical order goes through Intl.Collator rather than comparing
          strings directly. A plain comparison sorts by code point, which puts
          &ldquo;Zebra&rdquo; before &ldquo;apple&rdquo; and files café in the
          wrong place. Natural order is the one to reach for whenever the list
          has numbers in it — it puts item2 before item10, which plain
          alphabetical never will.
        </span>
      </p>
    </div>
  );
}
