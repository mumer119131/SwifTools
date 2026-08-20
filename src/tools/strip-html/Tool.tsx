"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { countWords, stripHtml, type Options } from "./logic";

const SAMPLE = `<article>
  <h2>A heading</h2>
  <p>Some copy with <strong>bold</strong> text and an
  <a href="https://example.com">example link</a>.</p>
  <ul><li>First item</li><li>Second item</li></ul>
  <style>.hidden { display: none }</style>
</article>`;

export default function StripHtmlTool() {
  const [input, setInput] = React.useState(SAMPLE);
  const [options, setOptions] = React.useState<Options>({
    keepStructure: true,
    decodeEntities: true,
    tidyWhitespace: true,
    keepLinks: false,
  });

  const result = React.useMemo(() => stripHtml(input, options), [input, options]);

  function toggle<K extends keyof Options>(key: K) {
    setOptions((current) => ({ ...current, [key]: !current[key] }));
  }

  const output =
    result.links.length > 0
      ? `${result.text}\n\n${result.links.map((link, i) => `[${i + 1}] ${link.href}`).join("\n")}`
      : result.text;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {(
          [
            ["keepStructure", "Keep line breaks"],
            ["decodeEntities", "Decode entities"],
            ["tidyWhitespace", "Tidy whitespace"],
            ["keepLinks", "Keep link targets"],
          ] as [keyof Options, string][]
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2.5 text-sm text-foreground">
            <Switch checked={options[key]} onCheckedChange={() => toggle(key)} />
            {label}
          </label>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="html">HTML</Label>
          <Textarea
            id="html"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={18}
            spellCheck={false}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="text">Plain text</Label>
            {output !== "" ? <CopyButton value={output} /> : null}
          </div>
          <Textarea
            id="text"
            value={output}
            readOnly
            rows={18}
            spellCheck={false}
            className="text-sm"
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground" data-numeric>
        {result.removedTags} tags removed · {countWords(result.text)} words
        {result.links.length > 0 ? ` · ${result.links.length} links kept` : ""}
      </p>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Script and style contents are dropped entirely rather than left behind
          as text, which is how a page&rsquo;s CSS ends up in the output of
          simpler tools. Paragraphs and headings get a blank line between them,
          list items get one line each — removing block elements without
          replacing them is what glues words together.
        </span>
      </p>
    </div>
  );
}
