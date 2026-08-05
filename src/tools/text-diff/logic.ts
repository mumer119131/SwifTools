export type DiffOp = "equal" | "insert" | "delete";

export interface DiffLine {
  op: DiffOp;
  text: string;
  /** 1-based line number in the original text, or null for insertions. */
  leftNumber: number | null;
  /** 1-based line number in the changed text, or null for deletions. */
  rightNumber: number | null;
}

export interface DiffOptions {
  ignoreCase: boolean;
  ignoreWhitespace: boolean;
}

export interface DiffSummary {
  added: number;
  removed: number;
  unchanged: number;
}

/**
 * Line diff via the classic LCS dynamic-programming table.
 *
 * The table is O(n·m) in memory, which is fine for the pasted-text sizes this
 * tool is for but would be wrong for whole files — hence the guard below, which
 * fails loudly rather than locking the tab up allocating gigabytes.
 */
const MAX_CELLS = 4_000_000;

export function diffLines(
  original: string,
  changed: string,
  options: DiffOptions,
): { lines: DiffLine[]; summary: DiffSummary } {
  const left = original.split(/\r\n|\r|\n/);
  const right = changed.split(/\r\n|\r|\n/);

  if (left.length * right.length > MAX_CELLS) {
    throw new Error(
      "These texts are too large to compare here. Try comparing a few hundred lines at a time.",
    );
  }

  const normalise = (line: string) => {
    let value = line;
    if (options.ignoreWhitespace) value = value.replace(/\s+/g, " ").trim();
    if (options.ignoreCase) value = value.toLowerCase();
    return value;
  };

  const a = left.map(normalise);
  const b = right.map(normalise);

  // lcs[i][j] = length of the longest common subsequence of a[i:] and b[j:].
  const lcs: Uint32Array[] = Array.from(
    { length: a.length + 1 },
    () => new Uint32Array(b.length + 1),
  );

  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      lcs[i][j] =
        a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const lines: DiffLine[] = [];
  const summary: DiffSummary = { added: 0, removed: 0, unchanged: 0 };

  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      lines.push({ op: "equal", text: left[i], leftNumber: i + 1, rightNumber: j + 1 });
      summary.unchanged += 1;
      i += 1;
      j += 1;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      lines.push({ op: "delete", text: left[i], leftNumber: i + 1, rightNumber: null });
      summary.removed += 1;
      i += 1;
    } else {
      lines.push({ op: "insert", text: right[j], leftNumber: null, rightNumber: j + 1 });
      summary.added += 1;
      j += 1;
    }
  }

  while (i < a.length) {
    lines.push({ op: "delete", text: left[i], leftNumber: i + 1, rightNumber: null });
    summary.removed += 1;
    i += 1;
  }

  while (j < b.length) {
    lines.push({ op: "insert", text: right[j], leftNumber: null, rightNumber: j + 1 });
    summary.added += 1;
    j += 1;
  }

  return { lines, summary };
}

/** Renders the diff as a unified patch, ready to paste into a review. */
export function toUnifiedDiff(lines: DiffLine[]): string {
  return lines
    .map((line) => `${line.op === "insert" ? "+" : line.op === "delete" ? "-" : " "}${line.text}`)
    .join("\n");
}
