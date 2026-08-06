/** Elements that never have a closing tag, so they must not open an indent level. */
const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

/**
 * Elements whose contents are not HTML and must survive verbatim. Re-indenting
 * inside `<pre>` changes what the page renders; inside `<script>` it can change
 * what the code means.
 */
const RAW_TEXT_ELEMENTS = new Set(["pre", "textarea", "script", "style"]);

/** Inline elements are kept on their parent's line rather than broken out. */
const INLINE_ELEMENTS = new Set([
  "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn", "em", "i",
  "kbd", "mark", "q", "s", "samp", "small", "span", "strong", "sub", "sup", "time",
  "u", "var", "wbr",
]);

type Token =
  | { kind: "open"; name: string; text: string; selfClosing: boolean }
  | { kind: "close"; name: string; text: string }
  | { kind: "text"; text: string }
  | { kind: "comment"; text: string }
  | { kind: "doctype"; text: string }
  | { kind: "raw"; name: string; text: string };

/**
 * Hand-rolled scanner rather than DOMParser: the DOM normalises as it parses
 * (moving stray elements, inserting tbody, dropping comments in some
 * positions), which would silently rewrite the user's markup. A formatter must
 * only change whitespace.
 */
function tokenize(html: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < html.length) {
    const nextTag = html.indexOf("<", index);

    if (nextTag === -1) {
      const text = html.slice(index);
      if (text.trim()) tokens.push({ kind: "text", text: text.trim() });
      break;
    }

    if (nextTag > index) {
      const text = html.slice(index, nextTag);
      if (text.trim()) tokens.push({ kind: "text", text: text.trim() });
    }

    if (html.startsWith("<!--", nextTag)) {
      const end = html.indexOf("-->", nextTag);
      const stop = end === -1 ? html.length : end + 3;
      tokens.push({ kind: "comment", text: html.slice(nextTag, stop) });
      index = stop;
      continue;
    }

    if (html.startsWith("<!", nextTag)) {
      const end = html.indexOf(">", nextTag);
      const stop = end === -1 ? html.length : end + 1;
      tokens.push({ kind: "doctype", text: html.slice(nextTag, stop).trim() });
      index = stop;
      continue;
    }

    const tagEnd = html.indexOf(">", nextTag);
    if (tagEnd === -1) {
      tokens.push({ kind: "text", text: html.slice(nextTag).trim() });
      break;
    }

    const tagText = html.slice(nextTag, tagEnd + 1);
    const nameMatch = tagText.match(/^<\/?\s*([a-zA-Z][a-zA-Z0-9-]*)/);
    const name = (nameMatch?.[1] ?? "").toLowerCase();

    if (tagText.startsWith("</")) {
      tokens.push({ kind: "close", name, text: `</${name}>` });
      index = tagEnd + 1;
      continue;
    }

    const selfClosing = tagText.endsWith("/>") || VOID_ELEMENTS.has(name);
    tokens.push({ kind: "open", name, text: normaliseTag(tagText), selfClosing });
    index = tagEnd + 1;

    // Swallow raw-text content whole, up to its matching close tag.
    if (RAW_TEXT_ELEMENTS.has(name) && !selfClosing) {
      const closeTag = new RegExp(`</\\s*${name}\\s*>`, "i");
      const rest = html.slice(index);
      const match = rest.match(closeTag);
      const contentEnd = match?.index ?? rest.length;

      tokens.push({ kind: "raw", name, text: rest.slice(0, contentEnd) });
      tokens.push({ kind: "close", name, text: `</${name}>` });
      index += contentEnd + (match?.[0].length ?? 0);
    }
  }

  return tokens;
}

/** Collapses runs of whitespace between attributes without touching values. */
function normaliseTag(tag: string): string {
  return tag.replace(/\s+/g, " ").replace(/\s+>/, ">").replace(/\s+\/>/, " />");
}

export interface FormatOptions {
  indentSize: number;
  /** Re-wraps long text runs to keep lines readable. 0 disables it. */
  wrapAt: number;
}

export function beautifyHtml(html: string, options: FormatOptions): string {
  const tokens = tokenize(html);
  const lines: string[] = [];
  let depth = 0;

  const pad = () => " ".repeat(Math.max(0, depth) * options.indentSize);

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    switch (token.kind) {
      case "doctype":
      case "comment":
        lines.push(pad() + token.text);
        break;

      case "open": {
        // An inline element with a single text child stays on one line —
        // breaking <span>x</span> across three lines helps nobody.
        const next = tokens[index + 1];
        const afterNext = tokens[index + 2];
        if (
          INLINE_ELEMENTS.has(token.name) &&
          !token.selfClosing &&
          next?.kind === "text" &&
          afterNext?.kind === "close" &&
          afterNext.name === token.name
        ) {
          lines.push(`${pad()}${token.text}${next.text}${afterNext.text}`);
          // Skip the two tokens just consumed onto this line.
          index += 2;
          break;
        }

        lines.push(pad() + token.text);
        if (!token.selfClosing) depth += 1;
        break;
      }

      case "close":
        depth -= 1;
        lines.push(pad() + token.text);
        break;

      case "raw": {
        // Emitted verbatim, only shifted to the current indent level.
        const trimmed = token.text.replace(/^\n+|\s+$/g, "");
        if (!trimmed) break;
        if (token.name === "pre" || token.name === "textarea") {
          lines.push(trimmed);
        } else {
          const base = pad();
          for (const line of dedent(trimmed).split("\n")) {
            lines.push(line ? base + line : "");
          }
        }
        break;
      }

      case "text":
        for (const line of wrapText(token.text, options.wrapAt, pad().length)) {
          lines.push(pad() + line);
        }
        break;
    }
  }

  return lines.join("\n");
}

/** Removes the smallest common leading indent so re-indenting is idempotent. */
function dedent(text: string): string {
  const lines = text.split("\n");
  const indents = lines
    .filter((line) => line.trim())
    .map((line) => line.match(/^[ \t]*/)?.[0].length ?? 0);
  const smallest = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(smallest)).join("\n");
}

function wrapText(text: string, wrapAt: number, indentWidth: number): string[] {
  const collapsed = text.replace(/\s+/g, " ").trim();
  if (wrapAt <= 0 || collapsed.length + indentWidth <= wrapAt) return [collapsed];

  const limit = Math.max(20, wrapAt - indentWidth);
  const lines: string[] = [];
  let current = "";

  for (const word of collapsed.split(" ")) {
    if (current && current.length + 1 + word.length > limit) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);

  return lines;
}

export function minifyHtml(html: string, keepComments: boolean): string {
  const tokens = tokenize(html);
  const parts: string[] = [];

  for (const token of tokens) {
    switch (token.kind) {
      case "comment":
        // Conditional comments are logic, not documentation — always kept.
        if (keepComments || token.text.startsWith("<!--[if")) parts.push(token.text);
        break;
      case "raw":
        parts.push(token.name === "pre" || token.name === "textarea" ? token.text : token.text.trim());
        break;
      case "text":
        parts.push(token.text.replace(/\s+/g, " "));
        break;
      default:
        parts.push(token.text);
    }
  }

  return parts.join("").replace(/>\s+</g, "><").trim();
}
