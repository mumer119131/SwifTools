"use client";

import * as React from "react";

import { CodeTransformShell } from "@/components/shared/CodeTransformShell";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { defaultMinifyJsOptions, minifyJs, SAMPLE, type MinifyJsOptions } from "./logic";

export default function JsMinifierTool() {
  const [options, setOptions] = React.useState<MinifyJsOptions>(defaultMinifyJsOptions);

  const transform = React.useCallback(
    (source: string) => minifyJs(source, options),
    [options],
  );

  const toggles = [
    { key: "module" as const, label: "Parse as ES module" },
    { key: "mangle" as const, label: "Rename local variables" },
    { key: "dropConsole" as const, label: "Drop console.*" },
    { key: "keepBanner" as const, label: "Keep /*! licence banners" },
  ];

  return (
    <CodeTransformShell
      inputLabel="JavaScript"
      outputLabel="Minified JavaScript"
      placeholder="export function greet(name) { … }"
      sample={SAMPLE}
      fileName="script.min.js"
      mimeType="text/javascript"
      showSavings
      transform={transform}
      options={toggles.map((toggle) => (
        <div key={toggle.key} className="flex items-center gap-3">
          <Switch
            id={`js-${toggle.key}`}
            checked={options[toggle.key]}
            onCheckedChange={(value) =>
              setOptions((current) => ({ ...current, [toggle.key]: value }))
            }
          />
          <Label htmlFor={`js-${toggle.key}`}>{toggle.label}</Label>
        </div>
      ))}
      footnote={
        <>
          This is Terser, doing real minification: it parses to an AST, eliminates unreachable
          branches and unused bindings, then renames locals. That is a different thing from
          stripping whitespace, which typically saves about a fifth as much. TypeScript and JSX are
          not supported — compile them first.
        </>
      }
    />
  );
}
