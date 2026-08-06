export interface MarkdownOptions {
  /** GitHub-flavoured Markdown: tables, strikethrough, task lists, autolinks. */
  gfm: boolean;
  /** Treat single newlines as `<br>`, the way GitHub comments do. */
  breaks: boolean;
}

/**
 * `marked` is imported lazily so the parser only ships to people who open this
 * tool, not to anyone who lands on the homepage.
 */
export async function markdownToHtml(
  markdown: string,
  options: MarkdownOptions,
): Promise<string> {
  if (!markdown.trim()) return "";

  const { marked } = await import("marked");
  const html = await marked.parse(markdown, {
    gfm: options.gfm,
    breaks: options.breaks,
    async: true,
  });

  return html.trim();
}

/**
 * Wraps the fragment in a complete document with self-contained styling, for
 * the "download as a standalone page" path.
 */
export function toStandalonePage(fragment: string, title: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  :root { color-scheme: light dark; }
  body {
    max-width: 46rem;
    margin: 0 auto;
    padding: 2.5rem 1.25rem 6rem;
    font: 16px/1.65 ui-sans-serif, system-ui, -apple-system, sans-serif;
  }
  h1, h2, h3 { line-height: 1.25; margin-top: 2em; }
  code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.9em; }
  pre { padding: 1rem; overflow-x: auto; border-radius: 8px; background: rgb(128 128 128 / 0.12); }
  code:not(pre code) { padding: 0.15em 0.35em; border-radius: 4px; background: rgb(128 128 128 / 0.15); }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid rgb(128 128 128 / 0.35); padding: 0.5rem 0.75rem; text-align: left; }
  blockquote { margin-inline: 0; padding-left: 1rem; border-left: 3px solid rgb(128 128 128 / 0.4); }
  img { max-width: 100%; height: auto; }
</style>
</head>
<body>
${fragment}
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** First heading, used as the standalone page's `<title>`. */
export function extractTitle(markdown: string): string {
  const heading = markdown.match(/^#{1,6}\s+(.+)$/m);
  return heading?.[1].trim() ?? "Document";
}
