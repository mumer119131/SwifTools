export interface Options {
  find: string;
  replace: string;
  regex: boolean;
  caseSensitive: boolean;
  wholeWord: boolean;
  multiline: boolean;
}

export type Outcome =
  | { ok: true; output: string; count: number; matches: string[] }
  | { ok: false; error: string };

/** Escapes a literal so it can be embedded in a pattern safely. */
function escapeLiteral(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Builds the pattern and runs the replacement.
 *
 * Literal mode escapes the search term rather than passing it through, so a
 * search for "a.b" finds "a.b" and not "axb". That is the behaviour people
 * expect from a find box, and getting it wrong silently changes text they
 * never intended to touch.
 */
export function replace(input: string, options: Options): Outcome {
  if (options.find === "") return { ok: true, output: input, count: 0, matches: [] };

  let source = options.regex ? options.find : escapeLiteral(options.find);
  if (options.wholeWord) source = `\\b(?:${source})\\b`;

  const flags = `g${options.caseSensitive ? "" : "i"}${options.multiline ? "m" : ""}`;

  let pattern: RegExp;
  try {
    pattern = new RegExp(source, flags);
  } catch (cause) {
    return {
      ok: false,
      error: cause instanceof Error ? cause.message : "That is not a valid regular expression.",
    };
  }

  const matches = [...input.matchAll(pattern)].map((match) => match[0]);

  /*
   * A pattern that can match an empty string — `a*`, `^`, `\b` — matches at
   * every position, so a naive replace produces one insertion per character.
   * Refusing is clearer than silently mangling the text.
   */
  if (matches.length > 0 && matches.every((match) => match === "")) {
    return {
      ok: false,
      error: "That pattern matches an empty string at every position, which would insert the replacement between every character. Add something it must actually match.",
    };
  }

  /*
   * In literal mode the replacement is escaped too. Otherwise "$1" or "$&" in
   * the replacement box would be interpreted as backreferences, which is
   * surprising when you are replacing a price with "$5".
   */
  const replacement = options.regex ? options.replace : options.replace.replace(/\$/g, "$$$$");

  return {
    ok: true,
    output: input.replace(pattern, replacement),
    count: matches.length,
    matches: [...new Set(matches)].slice(0, 12),
  };
}

export const PRESETS: { label: string; find: string; replace: string; regex: boolean }[] = [
  { label: "Collapse blank lines", find: "\\n{3,}", replace: "\n\n", regex: true },
  { label: "Trim trailing spaces", find: "[ \\t]+$", replace: "", regex: true },
  { label: "Collapse spaces", find: " {2,}", replace: " ", regex: true },
  { label: "Straighten quotes", find: "[“”]", replace: '"', regex: true },
  { label: "Strip HTML tags", find: "<[^>]+>", replace: "", regex: true },
  { label: "Remove digits", find: "\\d", replace: "", regex: true },
];
