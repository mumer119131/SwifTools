"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";

import { CodeOutput } from "@/components/shared/CodeOutput";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { extractTitle, markdownToHtml, toStandalonePage } from "./logic";

type View = "html" | "preview";

const SAMPLE = `# Release notes

A short summary with **bold**, _italic_ and \`inline code\`.

## What's new
- Tables and task lists
- [Links](https://example.com)
- [x] Done
- [ ] Not yet

| Tool | Status |
| --- | --- |
| Markdown | Live |

> Blockquotes work too.

\`\`\`js
console.log("fenced code blocks");
\`\`\`
`;

export default function MarkdownToHtmlTool() {
  const [markdown, setMarkdown] = React.useState("");
  const [gfm, setGfm] = React.useState(true);
  const [breaks, setBreaks] = React.useState(false);
  const [view, setView] = React.useState<View>("preview");
  const [html, setHtml] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    markdownToHtml(markdown, { gfm, breaks })
      .then((result) => {
        if (!cancelled) setHtml(result);
      })
      .catch(() => {
        if (!cancelled) setHtml("");
      });
    return () => {
      cancelled = true;
    };
  }, [markdown, gfm, breaks]);

  const title = extractTitle(markdown);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="markdown-input">Markdown</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMarkdown(SAMPLE)}
              disabled={!!markdown}
            >
              Use sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMarkdown("")}
              disabled={!markdown}
            >
              Clear
            </Button>
          </div>
        </div>
        <Textarea
          id="markdown-input"
          value={markdown}
          onChange={(event) => setMarkdown(event.target.value)}
          placeholder="# Your heading&#10;&#10;Some **Markdown** text…"
          className="min-h-56 font-mono text-sm"
          spellCheck
        />
      </div>

      <div className="surface-card flex flex-wrap items-center gap-x-6 gap-y-4 p-5">
        <div className="flex items-center gap-3">
          <Switch id="gfm" checked={gfm} onCheckedChange={setGfm} />
          <Label htmlFor="gfm">GitHub-flavoured</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="breaks" checked={breaks} onCheckedChange={setBreaks} />
          <Label htmlFor="breaks">Line breaks become &lt;br&gt;</Label>
        </div>
        <Tabs value={view} onValueChange={(value) => setView(value as View)} className="ml-auto">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "html" ? (
        <CodeOutput
          value={html}
          label="HTML"
          fileName="output.html"
          mimeType="text/html;charset=utf-8"
          actions={
            <DownloadButton
              blob={() =>
                new Blob([toStandalonePage(html, title)], { type: "text/html;charset=utf-8" })
              }
              fileName="page.html"
              label="Standalone page"
              size="sm"
              variant="outline"
              disabled={!html}
            />
          }
        />
      ) : (
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-foreground">Preview</h2>
          {/*
            Rendered inside a fully sandboxed iframe rather than with
            dangerouslySetInnerHTML. Markdown legitimately allows raw HTML, so
            pasted content could carry a script or an onerror handler — the
            sandbox attribute with no allow-* tokens blocks scripts, forms and
            same-origin access outright, which is a stronger guarantee than
            trying to sanitise the markup.
          */}
          <iframe
            title="Rendered Markdown preview"
            sandbox=""
            srcDoc={toStandalonePage(html, title)}
            className="h-[32rem] w-full rounded-lg border border-border bg-white"
          />
        </section>
      )}

      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The preview runs in a sandboxed frame with scripts disabled, so raw HTML in your Markdown
          can render without being able to execute. The copied HTML is the parser&rsquo;s output
          unchanged — sanitise it yourself before publishing anything you didn&rsquo;t write.
        </span>
      </p>
    </div>
  );
}
