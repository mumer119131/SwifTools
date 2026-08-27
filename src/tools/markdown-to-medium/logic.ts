/**
 * Markdown prepared for Medium's editor.
 *
 * The whole tool rests on one behaviour: Medium ignores Markdown syntax pasted
 * as plain text — you get a literal "## Heading" — but it honours pasted *rich
 * text*. So the useful output is not a string of HTML for you to read, it is
 * HTML placed on the clipboard under the `text/html` type, which the editor
 * then renders as real headings, links and lists.
 *
 * That is what separates this from a Markdown-to-HTML converter, which gives
 * you source to paste into a file.
 */

/** Roughly Medium's own reading pace. */
const WORDS_PER_MINUTE = 265;

export interface Warning {
  id: string;
  label: string;
  detail: string;
  count: number;
}

export interface Analysis {
  words: number;
  readMinutes: number;
  warnings: Warning[];
}

/** Strips fenced code so its contents never trip the other checks. */
function withoutFences(markdown: string): string {
  return markdown.replace(/```[\s\S]*?```/g, "").replace(/~~~[\s\S]*?~~~/g, "");
}

export function countWords(markdown: string): number {
  const text = withoutFences(markdown)
    // Link and image syntax would otherwise count their URLs as words.
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]/g, " ");

  return text.split(/\s+/).filter(Boolean).length;
}

export function readMinutes(words: number): number {
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/**
 * Flags Markdown that Medium's editor will not reproduce.
 *
 * Deliberately limited to things that genuinely do not survive rather than
 * everything that differs — a warning list nobody trusts is worse than none.
 * Each carries a count so a document with one stray table reads differently
 * from one built out of them.
 */
export function findWarnings(markdown: string): Warning[] {
  const body = withoutFences(markdown);
  const lines = body.split("\n");
  const warnings: Warning[] = [];

  const tableRows = lines.filter((line) => /^\s*\|.*\|\s*$/.test(line)).length;
  if (tableRows > 0) {
    warnings.push({
      id: "tables",
      label: "Tables",
      detail:
        "Medium has no table support. Rows paste as separate lines of text. Consider an image of the table, or a list.",
      count: tableRows,
    });
  }

  const images = [...body.matchAll(/!\[[^\]]*\]\([^)]+\)/g)].length;
  if (images > 0) {
    warnings.push({
      id: "images",
      label: "Images",
      detail:
        "Medium hosts its own images, so a linked file will not embed on paste. Add each one in the editor afterwards.",
      count: images,
    });
  }

  const nested = lines.filter((line) => /^(\s{2,}|\t)[-*+]\s|\s{2,}\d+\.\s/.test(line)).length;
  if (nested > 0) {
    warnings.push({
      id: "nested-lists",
      label: "Nested list items",
      detail: "Medium's lists are a single level deep. Indented items flatten into the parent list.",
      count: nested,
    });
  }

  const footnotes = [...body.matchAll(/\[\^[^\]]+\]/g)].length;
  if (footnotes > 0) {
    warnings.push({
      id: "footnotes",
      label: "Footnotes",
      detail: "Not supported. The markers paste as literal text — move these inline or into a closing note.",
      count: footnotes,
    });
  }

  // Medium offers two heading sizes, so h3 and deeper have nowhere to land.
  const deepHeadings = lines.filter((line) => /^#{3,}\s/.test(line)).length;
  if (deepHeadings > 0) {
    warnings.push({
      id: "deep-headings",
      label: "Headings below H2",
      detail:
        "Medium has only two heading levels. H3 and deeper arrive as small headings, losing the distinction between them.",
      count: deepHeadings,
    });
  }

  const html = [...body.matchAll(/<(?!\/?(?:b|i|em|strong|code|a)\b)[a-z][^>]*>/gi)].length;
  if (html > 0) {
    warnings.push({
      id: "raw-html",
      label: "Inline HTML",
      detail: "Medium strips most raw HTML on paste. Only basic emphasis and links reliably survive.",
      count: html,
    });
  }

  return warnings;
}

export function analyze(markdown: string): Analysis {
  const words = countWords(markdown);
  return { words, readMinutes: readMinutes(words), warnings: findWarnings(markdown) };
}

/** Renders Markdown to the HTML that goes onto the clipboard. */
export async function toHtml(markdown: string): Promise<string> {
  // Lazily imported so the parser only ships to people who open this tool.
  const { marked } = await import("marked");
  return marked.parse(markdown, { gfm: true, breaks: false }) as Promise<string> | string;
}

/**
 * Puts the rendered HTML on the clipboard as rich text.
 *
 * Both types are written: `text/html` is what Medium reads, and `text/plain`
 * is the fallback any other target uses. Returns how it landed so the UI can
 * tell the truth rather than always claiming success.
 */
export async function copyForMedium(html: string, plain: string): Promise<"rich" | "plain"> {
  if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
        }),
      ]);
      return "rich";
    } catch {
      // Falls through: some browsers refuse write() without a user gesture
      // they recognise, and plain text is better than nothing.
    }
  }

  await navigator.clipboard.writeText(plain);
  return "plain";
}
