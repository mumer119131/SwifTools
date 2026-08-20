/**
 * Removing HTML from text.
 *
 * The naive version — replace everything between angle brackets — is what most
 * tools do, and it fails in two directions. It leaves entities behind, so the
 * output is littered with `&amp;` and `&nbsp;`. And it removes block structure
 * without replacing it, so paragraphs and list items run together into one
 * wall of text with words glued to each other.
 */

export interface Options {
  /** Turn block elements into line breaks rather than deleting them. */
  keepStructure: boolean;
  /** Decode &amp; and friends back to characters. */
  decodeEntities: boolean;
  /** Collapse runs of whitespace and blank lines. */
  tidyWhitespace: boolean;
  /** Append a numbered list of link targets, footnote style. */
  keepLinks: boolean;
}

/** Elements whose contents are not prose and should go entirely. */
const DROP_CONTENT = ["script", "style", "noscript", "template", "svg", "head"];

/**
 * Block elements, split by how much space they deserve.
 *
 * The distinction matters: list items and table rows want one line each, while
 * paragraphs and headings want a blank line between them. Treating them alike
 * gives either double-spaced lists or run-together paragraphs.
 *
 * The separator is emitted on the *closing* tag only. Emitting on both open and
 * close doubles every gap, which is what made list items come out
 * double-spaced.
 */
const LINE_BLOCK = ["li", "tr", "dt", "dd", "figcaption", "option"];

const PARAGRAPH_BLOCK = [
  "p", "div", "h1", "h2", "h3", "h4", "h5", "h6",
  "blockquote", "pre", "section", "article", "header", "footer", "table", "ul", "ol",
];

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  mdash: "—", ndash: "–", hellip: "…", lsquo: "‘", rsquo: "’",
  ldquo: "“", rdquo: "”", copy: "©", reg: "®", trade: "™",
  deg: "°", pound: "£", euro: "€", cent: "¢", times: "×", divide: "÷",
  frac12: "½", frac14: "¼", frac34: "¾", middot: "·", bull: "•",
};

export function decodeEntities(input: string): string {
  return input
    // Numeric, decimal and hex.
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, digits: string) => String.fromCodePoint(Number(digits)))
    .replace(/&([a-z][a-z0-9]*);/gi, (whole, name: string) => {
      const decoded = ENTITIES[name.toLowerCase()];
      return decoded ?? whole;
    });
}

export interface Result {
  text: string;
  /** Link targets, when they were kept. */
  links: { label: string; href: string }[];
  removedTags: number;
}

export function stripHtml(input: string, options: Options): Result {
  if (input.trim() === "") return { text: "", links: [], removedTags: 0 };

  let working = input;
  const links: { label: string; href: string }[] = [];

  // Count before anything is removed, so the figure reflects the input.
  const removedTags = (working.match(/<[^>]+>/g) ?? []).length;

  // Whole elements whose contents are not prose. Done first, or their contents
  // survive as text once the tags around them are stripped — which is how a
  // page's CSS ends up in the output.
  for (const tag of DROP_CONTENT) {
    working = working.replace(
      new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}\\s*>`, "gi"),
      " ",
    );
    // Unclosed, e.g. a truncated document.
    working = working.replace(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*$`, "gi"), " ");
  }

  working = working.replace(/<!--[\s\S]*?-->/g, " ");

  if (options.keepLinks) {
    working = working.replace(
      /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a\s*>/gi,
      (_, href: string, label: string) => {
        const text = label.replace(/<[^>]+>/g, "").trim();
        links.push({ label: text || href, href });
        return `${text} [${links.length}]`;
      },
    );
  }

  if (options.keepStructure) {
    // Self-closing breaks come first — they have no closing tag to hang the
    // separator on.
    working = working.replace(/<(?:br|hr)\b[^>]*\/?>/gi, "\n");

    working = working.replace(
      new RegExp(`</(?:${LINE_BLOCK.join("|")})\\s*>`, "gi"),
      "\n",
    );
    working = working.replace(
      new RegExp(`</(?:${PARAGRAPH_BLOCK.join("|")})\\s*>`, "gi"),
      "\n\n",
    );
    // Opening tags carry no separator of their own; the content that follows
    // them is already on a fresh line thanks to the previous close.
    working = working.replace(
      new RegExp(`<(?:${[...LINE_BLOCK, ...PARAGRAPH_BLOCK].join("|")})\\b[^>]*>`, "gi"),
      "",
    );
  }

  working = working.replace(/<[^>]+>/g, options.keepStructure ? "" : " ");

  if (options.decodeEntities) working = decodeEntities(working);

  if (options.tidyWhitespace) {
    working = working
      // Non-breaking spaces survive decoding and are invisible in the output.
      .replace(/ /g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/ *\n */g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  return { text: working, links, removedTags };
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}
