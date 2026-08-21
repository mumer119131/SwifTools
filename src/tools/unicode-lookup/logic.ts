/**
 * Inspecting characters.
 *
 * Two jobs. Anything typed can be broken down — code point, UTF-8 bytes, the
 * various escape forms — which needs no database at all. And a curated list of
 * the symbols people actually hunt for is searchable, because shipping the full
 * Unicode name table to a browser is not sensible and nobody is looking up
 * U+1D4A9 anyway.
 */

export interface CharacterInfo {
  character: string;
  codePoint: number;
  /** U+00E9 form. */
  notation: string;
  /** Bytes when encoded as UTF-8. */
  utf8: string[];
  utf16: string[];
  htmlEntity: string;
  htmlNamed?: string;
  cssEscape: string;
  jsEscape: string;
  urlEncoded: string;
  /** Which block it falls in, from a coarse table. */
  block: string;
  /** How many bytes it costs in UTF-8, which is what surprises people. */
  utf8Bytes: number;
}

const NAMED_ENTITIES: Record<number, string> = {
  38: "&amp;", 60: "&lt;", 62: "&gt;", 34: "&quot;", 39: "&apos;", 160: "&nbsp;",
  169: "&copy;", 174: "&reg;", 8482: "&trade;", 8212: "&mdash;", 8211: "&ndash;",
  8230: "&hellip;", 8216: "&lsquo;", 8217: "&rsquo;", 8220: "&ldquo;", 8221: "&rdquo;",
  163: "&pound;", 8364: "&euro;", 165: "&yen;", 162: "&cent;", 176: "&deg;",
  215: "&times;", 247: "&divide;", 177: "&plusmn;", 8804: "&le;", 8805: "&ge;",
  8734: "&infin;", 8800: "&ne;", 183: "&middot;", 8226: "&bull;",
};

/** Coarse blocks — enough to say roughly what something is. */
const BLOCKS: [number, number, string][] = [
  [0x0000, 0x007f, "Basic Latin (ASCII)"],
  [0x0080, 0x00ff, "Latin-1 Supplement"],
  [0x0100, 0x017f, "Latin Extended-A"],
  [0x0370, 0x03ff, "Greek and Coptic"],
  [0x0400, 0x04ff, "Cyrillic"],
  [0x0590, 0x05ff, "Hebrew"],
  [0x0600, 0x06ff, "Arabic"],
  [0x0900, 0x097f, "Devanagari"],
  [0x2000, 0x206f, "General Punctuation"],
  [0x20a0, 0x20cf, "Currency Symbols"],
  [0x2190, 0x21ff, "Arrows"],
  [0x2200, 0x22ff, "Mathematical Operators"],
  [0x2500, 0x257f, "Box Drawing"],
  [0x2600, 0x26ff, "Miscellaneous Symbols"],
  [0x2700, 0x27bf, "Dingbats"],
  [0x3040, 0x309f, "Hiragana"],
  [0x30a0, 0x30ff, "Katakana"],
  [0x4e00, 0x9fff, "CJK Unified Ideographs"],
  [0x1f300, 0x1f5ff, "Miscellaneous Symbols and Pictographs"],
  [0x1f600, 0x1f64f, "Emoticons"],
  [0x1f680, 0x1f6ff, "Transport and Map Symbols"],
];

export function blockOf(codePoint: number): string {
  return BLOCKS.find(([from, to]) => codePoint >= from && codePoint <= to)?.[2] ?? "Unassigned or uncommon block";
}

export function inspect(character: string): CharacterInfo | null {
  const codePoint = character.codePointAt(0);
  if (codePoint === undefined) return null;

  // Take exactly one character, so a pasted word inspects its first.
  const single = String.fromCodePoint(codePoint);

  const utf8 = [...new TextEncoder().encode(single)].map(
    (byte) => byte.toString(16).padStart(2, "0").toUpperCase(),
  );
  const hex = codePoint.toString(16).toUpperCase().padStart(4, "0");

  return {
    character: single,
    codePoint,
    notation: `U+${hex}`,
    utf8,
    utf16: [...Array(single.length).keys()].map((i) =>
      single.charCodeAt(i).toString(16).padStart(4, "0").toUpperCase(),
    ),
    htmlEntity: `&#${codePoint};`,
    htmlNamed: NAMED_ENTITIES[codePoint],
    cssEscape: `\\${hex}`,
    // Above the BMP, JavaScript needs the braced form.
    jsEscape: codePoint > 0xffff ? `\\u{${hex}}` : `\\u${hex}`,
    urlEncoded: encodeURIComponent(single),
    block: blockOf(codePoint),
    utf8Bytes: utf8.length,
  };
}

/** Accepts a character, `U+00E9`, `00E9`, or a decimal code point. */
export function parseInput(input: string): string | null {
  const text = input.trim();
  if (text === "") return null;

  /*
   * Hex is tried first only when it is unambiguous: prefixed, or containing a
   * letter. "8364" is otherwise read as hex and yields a CJK ideograph rather
   * than the euro sign someone meant — the two readings are both plausible, so
   * the rule is stated rather than guessed.
   */
  const prefixed = /^(?:u\+|0x|\\u\{?)/i.test(text);
  const hasLetter = /[a-f]/i.test(text);

  const hex = prefixed || hasLetter
    ? text.match(/^(?:u\+|0x|\\u\{?)?([0-9a-f]{2,6})\}?$/i)
    : null;

  if (hex) {
    const value = Number.parseInt(hex[1], 16);
    if (value >= 0 && value <= 0x10ffff) {
      try {
        return String.fromCodePoint(value);
      } catch {
        return null;
      }
    }
  }

  if (/^\d+$/.test(text)) {
    const value = Number(text);
    // Only treat a bare number as a code point when it could not be the digit
    // itself — "5" means the character 5, not U+0005.
    if (value > 9 && value <= 0x10ffff) {
      try {
        return String.fromCodePoint(value);
      } catch {
        return null;
      }
    }
  }

  return text;
}

export interface CuratedEntry {
  character: string;
  name: string;
  keywords: string;
}

/** The ones people actually hunt for, rather than the full name table. */
export const CURATED: { group: string; entries: CuratedEntry[] }[] = [
  {
    group: "Punctuation and dashes",
    entries: [
      { character: "—", name: "Em dash", keywords: "long dash aside" },
      { character: "–", name: "En dash", keywords: "range dash between" },
      { character: "…", name: "Ellipsis", keywords: "dots three" },
      { character: " ", name: "Non-breaking space", keywords: "nbsp hard space" },
      { character: "‘", name: "Left single quote", keywords: "curly apostrophe" },
      { character: "’", name: "Right single quote", keywords: "curly apostrophe" },
      { character: "“", name: "Left double quote", keywords: "curly smart quote" },
      { character: "”", name: "Right double quote", keywords: "curly smart quote" },
      { character: "•", name: "Bullet", keywords: "list dot point" },
      { character: "§", name: "Section sign", keywords: "legal clause" },
      { character: "†", name: "Dagger", keywords: "footnote" },
    ],
  },
  {
    group: "Currency",
    entries: [
      { character: "£", name: "Pound sign", keywords: "sterling gbp money" },
      { character: "€", name: "Euro sign", keywords: "eur money" },
      { character: "¥", name: "Yen sign", keywords: "jpy money" },
      { character: "¢", name: "Cent sign", keywords: "money" },
      { character: "₹", name: "Indian rupee sign", keywords: "inr money" },
      { character: "₽", name: "Ruble sign", keywords: "money" },
      { character: "₩", name: "Won sign", keywords: "money korea" },
    ],
  },
  {
    group: "Maths and science",
    entries: [
      { character: "°", name: "Degree sign", keywords: "temperature angle" },
      { character: "×", name: "Multiplication sign", keywords: "times multiply" },
      { character: "÷", name: "Division sign", keywords: "divide" },
      { character: "±", name: "Plus-minus sign", keywords: "tolerance" },
      { character: "≈", name: "Almost equal to", keywords: "approximately" },
      { character: "≠", name: "Not equal to", keywords: "inequality" },
      { character: "≤", name: "Less than or equal", keywords: "inequality" },
      { character: "≥", name: "Greater than or equal", keywords: "inequality" },
      { character: "∞", name: "Infinity", keywords: "endless" },
      { character: "√", name: "Square root", keywords: "radical" },
      { character: "π", name: "Greek small letter pi", keywords: "circle constant" },
      { character: "µ", name: "Micro sign", keywords: "micro prefix" },
      { character: "Ω", name: "Ohm sign", keywords: "resistance omega" },
    ],
  },
  {
    group: "Arrows and symbols",
    entries: [
      { character: "→", name: "Rightwards arrow", keywords: "arrow right" },
      { character: "←", name: "Leftwards arrow", keywords: "arrow left" },
      { character: "↑", name: "Upwards arrow", keywords: "arrow up" },
      { character: "↓", name: "Downwards arrow", keywords: "arrow down" },
      { character: "⇧", name: "Shift key", keywords: "keyboard modifier" },
      { character: "⌘", name: "Command key", keywords: "mac keyboard cmd" },
      { character: "⌥", name: "Option key", keywords: "mac alt keyboard" },
      { character: "↵", name: "Return", keywords: "enter keyboard" },
      { character: "©", name: "Copyright sign", keywords: "legal" },
      { character: "®", name: "Registered sign", keywords: "trademark legal" },
      { character: "™", name: "Trade mark sign", keywords: "legal" },
      { character: "★", name: "Black star", keywords: "rating favourite" },
      { character: "☆", name: "White star", keywords: "rating outline" },
      { character: "✓", name: "Check mark", keywords: "tick yes done" },
      { character: "✗", name: "Ballot X", keywords: "cross no wrong" },
    ],
  },
];

export const ALL_CURATED = CURATED.flatMap((group) => group.entries);

export function searchCurated(query: string): CuratedEntry[] {
  const text = query.trim().toLowerCase();
  if (text === "") return [];

  return ALL_CURATED.filter(
    (entry) =>
      entry.character === query.trim() ||
      entry.name.toLowerCase().includes(text) ||
      entry.keywords.includes(text),
  );
}
