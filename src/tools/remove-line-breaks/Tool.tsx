"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { FieldHint, Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MODES, SEPARATORS, removeBreaks, type Mode, type Options } from "./logic";

const SAMPLE = `The quick brown fox jumps over the
lazy dog. It was a bright cold day in
April, and the clocks were striking
thirteen.

Winston Smith, his chin nuzzled into
his breast in an effort to escape the
vile wind, slipped quickly through the
glass doors.

- First bullet point
- Second bullet point`;

export default function RemoveLineBreaksTool() {
  const [input, setInput] = React.useState(SAMPLE);
  const [options, setOptions] = React.useState<Options>({
    mode: "unwrap",
    separator: " ",
    collapseSpaces: true,
    trimLines: true,
  });

  const output = removeBreaks(input, options);

  function set<K extends keyof Options>(key: K, value: Options[K]) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  const mode = MODES.find((entry) => entry.id === options.mode)!;

  return (
    <div className="space-y-5">
      <div className="surface-card space-y-4 p-5">
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">What to remove</span>
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

        <div className="flex flex-wrap items-center gap-6">
          <div className="space-y-2">
            <span className="text-sm font-medium text-foreground">Join with</span>
            <Tabs value={options.separator} onValueChange={(value) => set("separator", value)}>
              <TabsList>
                {SEPARATORS.map((entry) => (
                  <TabsTrigger key={entry.label} value={entry.id}>
                    {entry.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <Switch
              id="rlb-collapse"
              checked={options.collapseSpaces}
              onCheckedChange={(value) => set("collapseSpaces", value)}
            />
            <Label htmlFor="rlb-collapse">Collapse double spaces</Label>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch
              id="rlb-trim"
              checked={options.trimLines}
              onCheckedChange={(value) => set("trimLines", value)}
            />
            <Label htmlFor="rlb-trim">Trim each line</Label>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="rlb-input">Input</Label>
          <Textarea
            id="rlb-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={18}
            spellCheck={false}
            className="font-mono text-sm"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="rlb-output">Result</Label>
            <CopyButton value={output} label="Copy" />
          </div>
          <Textarea
            id="rlb-output"
            value={output}
            readOnly
            rows={18}
            spellCheck={false}
            className="text-sm leading-relaxed"
          />
        </div>
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Unwrap is the mode worth using on text from a PDF. It joins a break
          only when the line before it does not end a sentence and the line
          after does not begin a bullet, a number or a heading — so paragraphs
          and lists survive while the accidental wrapping goes. Line endings are
          normalised first, so a file mixing Windows and Unix breaks is handled
          consistently rather than half-fixed.
        </span>
      </p>
    </div>
  );
}
