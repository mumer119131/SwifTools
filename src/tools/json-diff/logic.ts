/**
 * Comparing two JSON documents structurally.
 *
 * A text diff on JSON is close to useless: reordering keys shows every line as
 * changed when nothing changed at all, reformatting shows the whole document as
 * different, and a value buried six levels down is reported as a change to a
 * line rather than to a path you can act on.
 *
 * This compares the parsed values instead, so key order and whitespace are
 * irrelevant and every difference is reported as the path where it lives.
 */

export type ChangeKind = "added" | "removed" | "changed" | "type-changed";

export interface Change {
  kind: ChangeKind;
  /** Dotted path with array indices in brackets: `user.roles[2].name`. */
  path: string;
  before?: unknown;
  after?: unknown;
  beforeType?: string;
  afterType?: string;
}

/** More precise than `typeof`, which calls null and arrays "object". */
export function typeOf(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function join(path: string, key: string | number): string {
  if (typeof key === "number") return `${path}[${key}]`;
  // Keys that are not plain identifiers get bracketed and quoted, so the path
  // stays something you could paste into code.
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)
    ? path === ""
      ? key
      : `${path}.${key}`
    : `${path}["${key}"]`;
}

/**
 * Walks both values together, recording differences.
 *
 * Arrays are compared by position rather than by content. Matching them up
 * properly is a much harder problem — an item inserted at the front makes every
 * later index look changed — and the honest thing is to compare by index and
 * say so, rather than to guess at intent.
 */
function walk(before: unknown, after: unknown, path: string, out: Change[]): void {
  const beforeType = typeOf(before);
  const afterType = typeOf(after);

  if (beforeType !== afterType) {
    out.push({ kind: "type-changed", path, before, after, beforeType, afterType });
    return;
  }

  if (beforeType === "object") {
    const a = before as Record<string, unknown>;
    const b = after as Record<string, unknown>;
    // Sorted so the report is stable regardless of key order in either file.
    const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();

    for (const key of keys) {
      const inA = Object.prototype.hasOwnProperty.call(a, key);
      const inB = Object.prototype.hasOwnProperty.call(b, key);

      if (!inA) out.push({ kind: "added", path: join(path, key), after: b[key] });
      else if (!inB) out.push({ kind: "removed", path: join(path, key), before: a[key] });
      else walk(a[key], b[key], join(path, key), out);
    }
    return;
  }

  if (beforeType === "array") {
    const a = before as unknown[];
    const b = after as unknown[];

    for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
      if (i >= a.length) out.push({ kind: "added", path: join(path, i), after: b[i] });
      else if (i >= b.length) out.push({ kind: "removed", path: join(path, i), before: a[i] });
      else walk(a[i], b[i], join(path, i), out);
    }
    return;
  }

  // NaN is never equal to itself, but two documents both containing it are the
  // same document.
  const same =
    before === after ||
    (typeof before === "number" && typeof after === "number" &&
      Number.isNaN(before) && Number.isNaN(after));

  if (!same) out.push({ kind: "changed", path, before, after });
}

export interface DiffResult {
  changes: Change[];
  identical: boolean;
  counts: Record<ChangeKind, number>;
}

export function diff(before: unknown, after: unknown): DiffResult {
  const changes: Change[] = [];
  walk(before, after, "", changes);

  const counts: Record<ChangeKind, number> = {
    added: 0, removed: 0, changed: 0, "type-changed": 0,
  };
  for (const change of changes) counts[change.kind] += 1;

  return { changes, identical: changes.length === 0, counts };
}

export function parse(input: string): { value: unknown } | { error: string } {
  if (input.trim() === "") return { error: "Empty." };
  try {
    return { value: JSON.parse(input) as unknown };
  } catch (cause) {
    return { error: cause instanceof Error ? cause.message : "Invalid JSON." };
  }
}

/** A compact one-line rendering for the change list. */
export function preview(value: unknown, limit = 60): string {
  if (value === undefined) return "—";
  const text = typeof value === "string" ? JSON.stringify(value) : JSON.stringify(value) ?? "undefined";
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
}

/** Root-level paths, so a large diff can be scanned by area. */
export function groupByRoot(changes: Change[]): { root: string; changes: Change[] }[] {
  const grouped = new Map<string, Change[]>();

  for (const change of changes) {
    const root = change.path.split(/[.[]/)[0] || "(root)";
    const list = grouped.get(root) ?? [];
    list.push(change);
    grouped.set(root, list);
  }

  return [...grouped.entries()]
    .map(([root, list]) => ({ root, changes: list }))
    .sort((a, b) => b.changes.length - a.changes.length);
}
