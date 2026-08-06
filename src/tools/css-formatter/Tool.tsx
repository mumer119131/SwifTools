"use client";

import * as React from "react";

import { CodeTransformShell } from "@/components/shared/CodeTransformShell";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultFormatOptions, formatCode, SAMPLE, type CssSyntax } from "./logic";

export default function CssFormatterTool() {
  const [syntax, setSyntax] = React.useState<CssSyntax>("css");
  const [tabWidth, setTabWidth] = React.useState("2");
  const [printWidth, setPrintWidth] = React.useState("80");

  const transform = React.useCallback(
    async (source: string) => {
      try {
        const code = await formatCode(source, syntax, {
          ...defaultFormatOptions,
          tabWidth: Number(tabWidth),
          printWidth: Number(printWidth),
        });
        return { code, error: null };
      } catch (cause) {
        return {
          code: "",
          error:
            cause instanceof Error
              ? cause.message.split("\n")[0]
              : "That stylesheet could not be parsed.",
        };
      }
    },
    [syntax, tabWidth, printWidth],
  );

  return (
    <CodeTransformShell
      inputLabel="CSS, SCSS or Less"
      outputLabel="Formatted"
      placeholder=".card{margin:0 auto}"
      sample={SAMPLE}
      fileName={`styles.${syntax}`}
      mimeType="text/css"
      transform={transform}
      options={
        <>
          <div className="flex items-center gap-3">
            <Label htmlFor="css-syntax">Syntax</Label>
            <Select value={syntax} onValueChange={(value) => setSyntax(value as CssSyntax)}>
              <SelectTrigger id="css-syntax" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="scss">SCSS</SelectItem>
                <SelectItem value="less">Less</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="css-indent">Indent</Label>
            <Select value={tabWidth} onValueChange={setTabWidth}>
              <SelectTrigger id="css-indent" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 spaces</SelectItem>
                <SelectItem value="4">4 spaces</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="css-width">Line width</Label>
            <Select value={printWidth} onValueChange={setPrintWidth}>
              <SelectTrigger id="css-width" className="w-28">
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
        </>
      }
      footnote={
        <>
          Formatting is done by Prettier&rsquo;s standalone build — the same engine your editor
          runs — so the output matches whatever your project&rsquo;s own tooling would produce.
        </>
      }
    />
  );
}
