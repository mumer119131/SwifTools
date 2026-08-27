"use client";

import * as React from "react";
import { ClipboardCheck, Copy, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toStandalonePage } from "@/tools/markdown-to-html/logic";
import { analyze, copyForMedium, toHtml } from "./logic";

const SAMPLE = `# Your headline goes here

A short standfirst paragraph that sets up the piece.

## A section heading

Prose with **bold**, *italic* and a [link](https://example.com).

> A pull quote Medium will render as a blockquote.

- A list item
- Another one

\`\`\`js
const inline = "code blocks survive too";
\`\`\`
`;

export default function MarkdownToMediumTool() {
  const [markdown, setMarkdown] = React.useState(SAMPLE);
  const [html, setHtml] = React.useState("");
  const [copied, setCopied] = React.useState<"rich" | "plain" | null>(null);

  const analysis = analyze(markdown);

  // Re-rendered on a short delay so typing does not re-parse on every keystroke.
  React.useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      void toHtml(markdown).then((result) => {
        if (!cancelled) setHtml(result);
      });
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [markdown]);

  async function copy() {
    const how = await copyForMedium(html, markdown);
    setCopied(how);
    setTimeout(() => setCopied(null), 2500);
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="md">Your Markdown</Label>
        <Textarea
          id="md"
          value={markdown}
          onChange={(event) => setMarkdown(event.target.value)}
          rows={14}
          spellCheck={false}
          className="font-mono text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => void copy()} disabled={html === ""}>
          {copied ? <ClipboardCheck strokeWidth={1.75} /> : <Copy strokeWidth={1.75} />}
          {copied === "rich"
            ? "Copied — paste into Medium"
            : copied === "plain"
              ? "Copied as plain text"
              : "Copy for Medium"}
        </Button>

        <span className="text-sm text-muted-foreground" data-numeric>
          {analysis.words.toLocaleString("en-GB")} words · {analysis.readMinutes} min read
        </span>
      </div>

      {copied === "plain" ? (
        <p className="text-sm text-muted-foreground">
          Your browser would not accept formatted text on the clipboard, so the raw Markdown was
          copied instead. Medium will show it literally — try again in Chrome, Edge or Safari.
        </p>
      ) : null}

      {analysis.warnings.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-foreground">
            {analysis.warnings.length} thing{analysis.warnings.length === 1 ? "" : "s"} Medium will
            not keep
          </h2>
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
            {analysis.warnings.map((warning) => (
              <li key={warning.id} className="flex items-start gap-3 px-4 py-3">
                <TriangleAlert
                  className="mt-0.5 size-4 shrink-0 text-subtle-foreground"
                  strokeWidth={1.75}
                />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground">
                    {warning.label}
                    <span className="ml-2 text-xs font-normal text-subtle-foreground" data-numeric>
                      ×{warning.count}
                    </span>
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{warning.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-foreground">Preview</h2>
        {/*
          Sandboxed rather than injected, matching the Markdown to HTML tool:
          Markdown may legitimately contain raw HTML, and a sandbox with no
          allow-* tokens blocks scripts outright rather than trying to sanitise.
        */}
        <iframe
          title="Rendered preview"
          sandbox=""
          srcDoc={toStandalonePage(html, "Preview")}
          className="h-[28rem] w-full rounded-lg border border-border bg-white"
        />
      </section>
    </div>
  );
}
