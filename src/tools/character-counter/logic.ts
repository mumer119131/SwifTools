export interface CharacterStats {
  /** UTF-16 code units — what `String.length` and most APIs report. */
  codeUnits: number;
  /**
   * User-perceived characters. An emoji like 👨‍👩‍👧 is one grapheme but eleven
   * code units, which is exactly the discrepancy that breaks length limits.
   */
  graphemes: number;
  withoutSpaces: number;
  lines: number;
  bytes: number;
}

export interface LimitTarget {
  label: string;
  limit: number;
  /** Which count the platform actually enforces. */
  basis: "graphemes" | "codeUnits";
  note?: string;
}

export const limitTargets: readonly LimitTarget[] = [
  { label: "X post", limit: 280, basis: "graphemes" },
  { label: "Meta title", limit: 60, basis: "graphemes", note: "Google truncates around here" },
  { label: "Meta description", limit: 160, basis: "graphemes" },
  { label: "SMS segment", limit: 160, basis: "codeUnits", note: "70 if any non-GSM character" },
  { label: "LinkedIn post", limit: 3000, basis: "graphemes" },
  { label: "Instagram caption", limit: 2200, basis: "graphemes" },
];

export function countGraphemes(text: string): number {
  if (!text) return 0;

  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    let count = 0;
    for (const segment of segmenter.segment(text)) {
      if (segment) count += 1;
    }
    return count;
  }

  // Spreading a string iterates code points, which is closer than `.length`.
  return [...text].length;
}

export function analyseCharacters(text: string): CharacterStats {
  return {
    codeUnits: text.length,
    graphemes: countGraphemes(text),
    withoutSpaces: text.replace(/\s/g, "").length,
    lines: text ? text.split(/\r\n|\r|\n/).length : 0,
    bytes: new TextEncoder().encode(text).length,
  };
}

export function usageFor(stats: CharacterStats, target: LimitTarget): {
  used: number;
  remaining: number;
  ratio: number;
  state: "ok" | "close" | "over";
} {
  const used = target.basis === "graphemes" ? stats.graphemes : stats.codeUnits;
  const ratio = used / target.limit;
  return {
    used,
    remaining: target.limit - used,
    ratio,
    state: ratio > 1 ? "over" : ratio > 0.9 ? "close" : "ok",
  };
}
