"use client";

import * as React from "react";
import { TriangleAlert } from "lucide-react";

import { CodeOutput } from "@/components/shared/CodeOutput";
import { Spinner } from "@/components/shared/Progress";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { byteSize, estimateGzipped } from "@/lib/code-format";
import { formatBytes, formatDelta } from "@/lib/utils";

interface CodeTransformShellProps {
  inputLabel: string;
  outputLabel: string;
  placeholder: string;
  sample: string;
  fileName: string;
  mimeType: string;
  /** Controls rendered between the input and the output. */
  options: React.ReactNode;
  /** Runs whenever the input or any option changes. */
  transform: (source: string) => Promise<{ code: string; error: string | null }>;
  /** Show the byte comparison — meaningful for minifying, noise for formatting. */
  showSavings?: boolean;
  footnote: React.ReactNode;
}

/**
 * Shared frame for the four CSS/JS formatter and minifier tools: an input, the
 * options, the result and a size comparison. Each tool supplies its own
 * transform and controls, so the shape stays identical while the behaviour
 * differs.
 */
export function CodeTransformShell({
  inputLabel,
  outputLabel,
  placeholder,
  sample,
  fileName,
  mimeType,
  options,
  transform,
  showSavings = false,
  footnote,
}: CodeTransformShellProps) {
  const [input, setInput] = React.useState("");
  // Holds the last completed run. The displayed values are derived from it, so
  // clearing the input needs no setState — it just stops being shown.
  const [result, setResult] = React.useState<{ code: string; error: string | null }>({
    code: "",
    error: null,
  });
  const [pending, setPending] = React.useState(false);

  // Prettier and Terser are async, so the result is tracked against the input
  // that produced it — a slower earlier run must not overwrite a newer one.
  const runId = React.useRef(0);

  React.useEffect(() => {
    if (!input.trim()) return;

    const id = ++runId.current;
    let cancelled = false;

    // Debounced: reformatting on every keystroke of a large file is wasteful.
    const timer = setTimeout(() => {
      transform(input)
        .then((outcome) => {
          if (cancelled || id !== runId.current) return;
          setResult(outcome);
          setPending(false);
        })
        .catch(() => {
          if (cancelled || id !== runId.current) return;
          setResult({ code: "", error: "That input could not be processed." });
          setPending(false);
        });
    }, 220);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [input, transform]);

  const hasInput = input.trim().length > 0;
  const output = hasInput ? result.code : "";
  const error = hasInput ? result.error : null;

  const inputBytes = byteSize(input);
  const outputBytes = byteSize(output);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="transform-input">{inputLabel}</Label>
          <div className="flex items-center gap-2">
            {pending ? <Spinner className="size-3.5" /> : null}
            <Button variant="ghost" size="sm" onClick={() => setInput(sample)} disabled={!!input}>
              Use sample
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setInput("")} disabled={!input}>
              Clear
            </Button>
          </div>
        </div>
        <Textarea
          id="transform-input"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setPending(true);
          }}
          placeholder={placeholder}
          className="min-h-56 font-mono text-sm"
          spellCheck={false}
          aria-invalid={error !== null}
        />
      </div>

      <div className="surface-card flex flex-wrap items-center gap-x-6 gap-y-4 p-5">{options}</div>

      {error ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md border border-[color-mix(in_oklab,var(--destructive)_30%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-destructive"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          <span>{error}</span>
        </p>
      ) : null}

      <CodeOutput
        value={output}
        label={outputLabel}
        fileName={fileName}
        mimeType={mimeType}
        className={showSavings ? "whitespace-pre-wrap break-all" : undefined}
      />

      {showSavings && output ? (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Original", value: formatBytes(inputBytes) },
            { label: "Minified", value: formatBytes(outputBytes) },
            { label: "Saved", value: formatDelta(inputBytes, outputBytes) },
            { label: "Gzipped (est.)", value: formatBytes(estimateGzipped(output)) },
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

      <p className="text-sm text-muted-foreground">{footnote}</p>
    </div>
  );
}
