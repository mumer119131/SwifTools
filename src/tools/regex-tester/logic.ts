export interface RegexMatch {
  index: number;
  text: string;
  groups: { name: string; value: string | undefined }[];
}

export type RegexResult =
  | { ok: true; matches: RegexMatch[]; truncated: boolean }
  | { ok: false; error: string };

export const availableFlags = [
  { flag: "g", label: "global", hint: "Find every match, not just the first" },
  { flag: "i", label: "ignore case", hint: "Match regardless of upper/lowercase" },
  { flag: "m", label: "multiline", hint: "^ and $ match at every line break" },
  { flag: "s", label: "dot all", hint: ". also matches newlines" },
  { flag: "u", label: "unicode", hint: "Enable \\p{…} and full code-point matching" },
  { flag: "y", label: "sticky", hint: "Match only from lastIndex" },
] as const;

/** Guards against pathological patterns filling memory with matches. */
const MATCH_LIMIT = 500;

export function runRegex(pattern: string, flags: string, input: string): RegexResult {
  if (!pattern) return { ok: true, matches: [], truncated: false };

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch (cause) {
    return {
      ok: false,
      error: cause instanceof Error ? cause.message.replace(/^Invalid regular expression: /, "") : "Invalid pattern.",
    };
  }

  if (!input) return { ok: true, matches: [], truncated: false };

  const matches: RegexMatch[] = [];
  let truncated = false;

  const collect = (match: RegExpExecArray) => {
    const named = match.groups ?? {};
    const groups = [
      // Numbered groups first, then any named ones.
      ...match.slice(1).map((value, index) => ({ name: String(index + 1), value })),
      ...Object.entries(named).map(([name, value]) => ({ name, value })),
    ];
    matches.push({ index: match.index, text: match[0], groups });
  };

  if (!regex.global) {
    const match = regex.exec(input);
    if (match) collect(match);
    return { ok: true, matches, truncated: false };
  }

  let match: RegExpExecArray | null;
  while ((match = regex.exec(input)) !== null) {
    collect(match);

    // A zero-length match would otherwise loop forever on the same index.
    if (match.index === regex.lastIndex) regex.lastIndex += 1;

    if (matches.length >= MATCH_LIMIT) {
      truncated = true;
      break;
    }
  }

  return { ok: true, matches, truncated };
}

export interface Segment {
  text: string;
  isMatch: boolean;
}

/** Splits the input into alternating plain and matched runs for highlighting. */
export function toSegments(input: string, matches: RegexMatch[]): Segment[] {
  if (matches.length === 0) return input ? [{ text: input, isMatch: false }] : [];

  const segments: Segment[] = [];
  let cursor = 0;

  for (const match of matches) {
    // Zero-length matches have nothing to highlight.
    if (match.text.length === 0) continue;
    if (match.index > cursor) {
      segments.push({ text: input.slice(cursor, match.index), isMatch: false });
    }
    segments.push({ text: match.text, isMatch: true });
    cursor = match.index + match.text.length;
  }

  if (cursor < input.length) segments.push({ text: input.slice(cursor), isMatch: false });
  return segments;
}

export function applyReplacement(
  pattern: string,
  flags: string,
  input: string,
  replacement: string,
): string {
  try {
    return input.replace(new RegExp(pattern, flags), replacement);
  } catch {
    return "";
  }
}
