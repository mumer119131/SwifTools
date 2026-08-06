"use client";

import * as React from "react";

import { CodeTransformShell } from "@/components/shared/CodeTransformShell";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultFormatOptions, formatCode, SAMPLE, type JsParser } from "./logic";

export default function JsFormatterTool() {
  const [parser, setParser] = React.useState<JsParser>("babel");
  const [tabWidth, setTabWidth] = React.useState("2");
  const [printWidth, setPrintWidth] = React.useState("80");
  const [semi, setSemi] = React.useState(true);
  const [singleQuote, setSingleQuote] = React.useState(false);

  const transform = React.useCallback(
    async (source: string) => {
      try {
        const code = await formatCode(source, parser, {
          ...defaultFormatOptions,
          tabWidth: Number(tabWidth),
          printWidth: Number(printWidth),
          semi,
          singleQuote,
        });
        return { code, error: null };
      } catch (cause) {
        return {
          code: "",
          error:
            cause instanceof Error
              ? cause.message.split("\n")[0]
              : "That code could not be parsed.",
        };
      }
    },
    [parser, tabWidth, printWidth, semi, singleQuote],
  );

  return (
    <CodeTransformShell
      inputLabel="JavaScript, TypeScript or JSX"
      outputLabel="Formatted"
      placeholder="const x=1;function f(){return x}"
      sample={SAMPLE}
      fileName={parser === "typescript" ? "code.ts" : "code.js"}
      mimeType="text/javascript"
      transform={transform}
      options={
        <>
          <div className="flex items-center gap-3">
            <Label htmlFor="js-parser">Parser</Label>
            <Select value={parser} onValueChange={(value) => setParser(value as JsParser)}>
              <SelectTrigger id="js-parser" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="babel">JavaScript / JSX</SelectItem>
                <SelectItem value="typescript">TypeScript / TSX</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="js-indent">Indent</Label>
            <Select value={tabWidth} onValueChange={setTabWidth}>
              <SelectTrigger id="js-indent" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 spaces</SelectItem>
                <SelectItem value="4">4 spaces</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="js-width">Line width</Label>
            <Select value={printWidth} onValueChange={setPrintWidth}>
              <SelectTrigger id="js-width" className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["80", "100", "120"].map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="js-semi" checked={semi} onCheckedChange={setSemi} />
            <Label htmlFor="js-semi">Semicolons</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="js-quotes" checked={singleQuote} onCheckedChange={setSingleQuote} />
            <Label htmlFor="js-quotes">Single quotes</Label>
          </div>
        </>
      }
      footnote={
        <>
          Prettier reprints from the AST rather than nudging the text, so the result is
          deterministic — running it twice gives the same output, and it matches what your
          editor&rsquo;s Prettier would produce with the same settings.
        </>
      }
    />
  );
}
