"use client";

import * as React from "react";

import { CodeTransformShell } from "@/components/shared/CodeTransformShell";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { defaultMinifyCssOptions, minifyCss, SAMPLE, type MinifyCssOptions } from "./logic";

export default function CssMinifierTool() {
  const [options, setOptions] = React.useState<MinifyCssOptions>(defaultMinifyCssOptions);

  const transform = React.useCallback(
    async (source: string) => ({ code: minifyCss(source, options), error: null }),
    [options],
  );

  const toggles = [
    { key: "keepBanner" as const, label: "Keep /*! banner comments" },
    { key: "shortenHex" as const, label: "Shorten hex colours" },
    { key: "stripZeroUnits" as const, label: "Strip units from zero" },
  ];

  return (
    <CodeTransformShell
      inputLabel="CSS"
      outputLabel="Minified CSS"
      placeholder=".card { margin: 0px auto; }"
      sample={SAMPLE}
      fileName="styles.min.css"
      mimeType="text/css"
      showSavings
      transform={transform}
      options={toggles.map((toggle) => (
        <div key={toggle.key} className="flex items-center gap-3">
          <Switch
            id={`css-${toggle.key}`}
            checked={options[toggle.key]}
            onCheckedChange={(value) =>
              setOptions((current) => ({ ...current, [toggle.key]: value }))
            }
          />
          <Label htmlFor={`css-${toggle.key}`}>{toggle.label}</Label>
        </div>
      ))}
      footnote={
        <>
          Strings and <code className="font-mono">url()</code> contents are extracted before any
          transformation and restored afterwards — collapsing whitespace inside{" "}
          <code className="font-mono">content: &quot;a  b&quot;</code> would change what the page
          renders.
        </>
      }
    />
  );
}
