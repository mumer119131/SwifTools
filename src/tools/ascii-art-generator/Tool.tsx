"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FONTS, render, wrapAsComment } from "./logic";

export default function AsciiArtTool() {
  const [text, setText] = React.useState("POCKETTOOLZ");
  const [fontId, setFontId] = React.useState("block");
  const [spacing, setSpacing] = React.useState(1);
  const [comment, setComment] = React.useState<"none" | "block" | "hash" | "slash">("none");

  const banner = render(text, fontId, spacing);
  const output = comment === "none" ? banner : wrapAsComment(banner, comment);

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ascii-text">Text</Label>
          <Input
            id="ascii-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="HELLO"
            className="text-lg"
            autoComplete="off"
          />
          <FieldHint>
            Letters, digits and common punctuation. Anything else is skipped.
          </FieldHint>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Style</span>
          <Tabs value={fontId} onValueChange={setFontId}>
            <TabsList>
              {FONTS.map((font) => (
                <TabsTrigger key={font.id} value={font.id}>
                  {font.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ascii-spacing">Letter spacing — {spacing}</Label>
          <Slider
            id="ascii-spacing"
            min={0}
            max={5}
            step={1}
            value={[spacing]}
            onValueChange={([value]) => setSpacing(value)}
          />
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Wrap as a comment</span>
          <Tabs value={comment} onValueChange={(value) => setComment(value as typeof comment)}>
            <TabsList>
              <TabsTrigger value="none">Plain</TabsTrigger>
              <TabsTrigger value="hash"># </TabsTrigger>
              <TabsTrigger value="slash">{"//"}</TabsTrigger>
              <TabsTrigger value="block">{"/* */"}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="surface-card overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
          <h2 className="text-sm font-medium text-foreground">Result</h2>
          <CopyButton value={output} label="Copy" />
        </header>
        <pre
          className="overflow-x-auto px-5 py-6 font-mono text-xs leading-tight text-foreground sm:text-sm"
          aria-live="polite"
        >
          {output || " "}
        </pre>
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The letterforms are defined in the tool itself rather than loaded from
          figlet font files, which are larger than this whole page — so it renders
          instantly and works with no network at all. The compact style folds
          pairs of rows into half-block characters, which is how you get a
          readable banner in three lines instead of five. Use a monospaced font
          wherever you paste it, or the alignment falls apart.
        </span>
      </p>
    </div>
  );
}
