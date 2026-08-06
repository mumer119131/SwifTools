export interface JsonError {
  message: string;
  /** 1-based, derived from the character offset the engine reports. */
  line: number;
  column: number;
  /** The line's text, for the error excerpt. */
  excerpt: string;
}

export interface JsonStats {
  keys: number;
  depth: number;
  arrays: number;
  objects: number;
}

export type JsonParseResult =
  | { ok: true; value: unknown }
  | { ok: false; error: JsonError };

/**
 * Turns a character offset into a line/column pair.
 *
 * Engines report JSON syntax errors as "position N" (or, in newer V8, with a
 * line number already included but in an inconsistent format). Deriving it from
 * the offset ourselves gives the same answer everywhere.
 */
function locate(text: string, offset: number): { line: number; column: number; excerpt: string } {
  const safeOffset = Math.min(Math.max(offset, 0), text.length);
  const before = text.slice(0, safeOffset);
  const line = before.split("\n").length;
  const lastBreak = before.lastIndexOf("\n");
  const column = safeOffset - lastBreak;
  const excerpt = text.split("\n")[line - 1] ?? "";
  return { line, column, excerpt };
}

export function parseJson(text: string): JsonParseResult {
  if (!text.trim()) return { ok: false, error: { message: "Nothing to parse.", line: 1, column: 1, excerpt: "" } };

  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (cause) {
    const raw = cause instanceof Error ? cause.message : "Invalid JSON.";
    const offsetMatch = raw.match(/position (\d+)/i);
    const position = offsetMatch ? Number(offsetMatch[1]) : 0;
    const { line, column, excerpt } = locate(text, position);

    // Engine messages carry their own position wording; strip it so the UI
    // isn't showing the location twice in two different formats.
    const message = raw
      .replace(/^JSON\.parse:\s*/i, "")
      .replace(/\s*(in JSON )?at position \d+.*$/i, "")
      .replace(/^Unexpected token (.)/, "Unexpected character $1")
      .trim();

    return { ok: false, error: { message: message || "Invalid JSON.", line, column, excerpt } };
  }
}

export function analyseJson(value: unknown): JsonStats {
  const stats: JsonStats = { keys: 0, depth: 0, arrays: 0, objects: 0 };

  const walk = (node: unknown, depth: number) => {
    stats.depth = Math.max(stats.depth, depth);

    if (Array.isArray(node)) {
      stats.arrays += 1;
      for (const item of node) walk(item, depth + 1);
      return;
    }

    if (node !== null && typeof node === "object") {
      stats.objects += 1;
      for (const [, child] of Object.entries(node)) {
        stats.keys += 1;
        walk(child, depth + 1);
      }
    }
  };

  walk(value, 1);
  return stats;
}

/**
 * Recursively sorts object keys. Useful for diffing two API responses that are
 * equivalent but serialised in a different order.
 */
function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value === null || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, child]) => [key, sortKeys(child)]),
  );
}

export function formatJson(value: unknown, indent: number, sorted: boolean): string {
  return JSON.stringify(sorted ? sortKeys(value) : value, null, indent);
}

export function minifyJson(value: unknown, sorted: boolean): string {
  return JSON.stringify(sorted ? sortKeys(value) : value);
}
