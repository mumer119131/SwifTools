"use client";

import * as React from "react";
import { CornerUpLeft } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { caseVariants } from "./logic";

const SAMPLE = "the quick brown fox jumps over the lazy dog";

export default function CaseConverterTool() {
  const [text, setText] = React.useState("");

  const results = React.useMemo(
    () => (text ? caseVariants.map((variant) => ({ variant, output: variant.transform(text) })) : []),
    [text],
  );

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="case-input">Your text</Label>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setText(SAMPLE)} disabled={!!text}>
              Use sample
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setText("")} disabled={!text}>
              Clear
            </Button>
          </div>
        </div>
        <Textarea
          id="case-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste or type your text here…"
          className="min-h-32"
        />
      </div>

      {results.length > 0 ? (
        <ul className="space-y-3">
          {results.map(({ variant, output }) => (
            <li key={variant.key} className="surface-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-mono text-sm text-foreground">{variant.label}</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">{variant.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9"
                    onClick={() => setText(output)}
                    aria-label={`Send ${variant.label} back to the input`}
                    title="Send back to input"
                  >
                    <CornerUpLeft strokeWidth={1.75} />
                  </Button>
                  <CopyButton value={output} iconOnly label={`Copy ${variant.label}`} />
                </div>
              </div>
              <p className="mt-3 break-words rounded-md bg-surface-hover px-3 py-2.5 font-mono text-sm text-foreground">
                {output}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Enter some text above and every case appears here at once.
        </p>
      )}
    </div>
  );
}
