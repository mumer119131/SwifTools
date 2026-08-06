export type EncodeScope = "minimal" | "named" | "all";

/**
 * The five characters that must be escaped for markup to stay inert. Everything
 * else is optional — escaping more is a display choice, not a safety one.
 */
const MINIMAL: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Common named entities, for the "named where possible" mode. */
const NAMED: Record<string, string> = {
  ...MINIMAL,
  " ": "&nbsp;",
  "¢": "&cent;",
  "£": "&pound;",
  "¥": "&yen;",
  "€": "&euro;",
  "©": "&copy;",
  "®": "&reg;",
  "™": "&trade;",
  "§": "&sect;",
  "¶": "&para;",
  "†": "&dagger;",
  "‡": "&Dagger;",
  "•": "&bull;",
  "…": "&hellip;",
  "–": "&ndash;",
  "—": "&mdash;",
  "‘": "&lsquo;",
  "’": "&rsquo;",
  "“": "&ldquo;",
  "”": "&rdquo;",
  "«": "&laquo;",
  "»": "&raquo;",
  "×": "&times;",
  "÷": "&divide;",
  "±": "&plusmn;",
  "°": "&deg;",
  "µ": "&micro;",
  "¼": "&frac14;",
  "½": "&frac12;",
  "¾": "&frac34;",
  "←": "&larr;",
  "↑": "&uarr;",
  "→": "&rarr;",
  "↓": "&darr;",
  "↔": "&harr;",
};

export function encodeHtml(text: string, scope: EncodeScope): string {
  if (scope === "minimal") {
    return text.replace(/[&<>"']/g, (character) => MINIMAL[character]);
  }

  if (scope === "named") {
    return [...text]
      .map((character) => NAMED[character] ?? character)
      .join("");
  }

  // "all": every non-ASCII code point becomes a numeric reference. Verbose, but
  // survives being pasted into a file with an unknown or wrong encoding.
  return [...text]
    .map((character) => {
      if (MINIMAL[character]) return MINIMAL[character];
      const codePoint = character.codePointAt(0) ?? 0;
      return codePoint > 126 || codePoint < 32 ? `&#${codePoint};` : character;
    })
    .join("");
}

/** Named entities the decoder resolves, plus the numeric forms. */
const DECODE_NAMED: Record<string, string> = Object.fromEntries(
  Object.entries(NAMED).map(([character, entity]) => [entity, character]),
);

// A few aliases browsers accept that aren't in the encode table.
Object.assign(DECODE_NAMED, {
  "&apos;": "'",
  "&#x27;": "'",
  "&#x2F;": "/",
  "&nbsp;": " ",
  "&quot;": '"',
});

export function decodeHtml(text: string): string {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (match, body: string) => {
    if (body.startsWith("#")) {
      const codePoint = body.startsWith("#x") || body.startsWith("#X")
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);

      // Reject out-of-range and surrogate code points rather than throwing.
      if (!Number.isFinite(codePoint) || codePoint < 0 || codePoint > 0x10ffff) return match;
      if (codePoint >= 0xd800 && codePoint <= 0xdfff) return match;

      try {
        return String.fromCodePoint(codePoint);
      } catch {
        return match;
      }
    }

    return DECODE_NAMED[match] ?? DECODE_NAMED[match.toLowerCase()] ?? match;
  });
}

export function countEncoded(original: string, encoded: string): number {
  // Every entity adds at least three characters (& ; plus a name).
  return original === encoded ? 0 : (encoded.match(/&[#a-zA-Z0-9]+;/g) ?? []).length;
}
