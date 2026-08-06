"use client";

import * as React from "react";

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
import { formatBytes, formatDelta } from "@/lib/utils";
import { beautifyHtml, minifyHtml } from "./logic";

type Mode = "beautify" | "minify";

const SAMPLE = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Example</title></head>
<body><div class="card"><h1>Hello</h1><p>Some <strong>bold</strong> text.</p><!-- a note --></div></body></html>`;

export default function HtmlFormatterTool() {
  const [input, setInput] = React.useState("");
  const [mode, setMode] = React.useState<Mode>("beautify");
  const [indentSize, setIndentSize] = React.useState("2");
  const [wrapAt, setWrapAt] = React.useState("100");
  const [keepComments, setKeepComments] = React.useState(false);

  const output = React.useMemo(() => {
    if (!input.trim()) return "";
    return mode === "minify"
      ? minifyHtml(input, keepComments)
      : beautifyHtml(input, { indentSize: Number(indentSize), wrapAt: Number(wrapAt) });
  }, [input, mode, indentSize, wrapAt, keepComments]);

  const inputBytes = new Blob([input]).size;
  const outputBytes = new Blob([output]).size;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="html-input">HTML input</Label>
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
          id="html-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="<div><p>Paste your HTML here</p></div>"
          className="min-h-48 font-mono text-sm"
          spellCheck={false}
        />
      </div>

      <div className="surface-card flex flex-wrap items-center gap-x-6 gap-y-4 p-5">
        <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
          <TabsList>
            <TabsTrigger value="beautify">Beautify</TabsTrigger>
            <TabsTrigger value="minify">Minify</TabsTrigger>
          </TabsList>
        </Tabs>

        {mode === "beautify" ? (
          <>
            <div className="flex items-center gap-3">
              <Label htmlFor="html-indent">Indent</Label>
              <Select value={indentSize} onValueChange={setIndentSize}>
                <SelectTrigger id="html-indent" className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 spaces</SelectItem>
                  <SelectItem value="4">4 spaces</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="html-wrap">Wrap text at</Label>
              <Select value={wrapAt} onValueChange={setWrapAt}>
                <SelectTrigger id="html-wrap" className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No wrapping</SelectItem>
                  <SelectItem value="80">80 columns</SelectItem>
                  <SelectItem value="100">100 columns</SelectItem>
                  <SelectItem value="120">120 columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Switch id="keep-comments" checked={keepComments} onCheckedChange={setKeepComments} />
            <Label htmlFor="keep-comments">Keep comments</Label>
          </div>
        )}
      </div>

      <CodeOutput
        value={output}
        label={mode === "minify" ? "Minified HTML" : "Formatted HTML"}
        fileName="formatted.html"
        mimeType="text/html;charset=utf-8"
        className={mode === "minify" ? "whitespace-pre-wrap break-all" : undefined}
      />

      {output ? (
        <dl className="grid grid-cols-3 gap-3">
          {[
            { label: "Input", value: formatBytes(inputBytes) },
            { label: "Output", value: formatBytes(outputBytes) },
            { label: "Change", value: formatDelta(inputBytes, outputBytes) },
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
        Content inside <code className="font-mono">pre</code>,{" "}
        <code className="font-mono">textarea</code>, <code className="font-mono">script</code> and{" "}
        <code className="font-mono">style</code> is preserved exactly — re-indenting there would
        change what the page renders or what the code means. Conditional comments survive minifying
        for the same reason.
      </p>
    </div>
  );
}
