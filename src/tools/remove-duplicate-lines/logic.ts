export type SortOrder = "original" | "asc" | "desc";
export type OutputMode = "unique" | "duplicates-only";

export interface DedupeOptions {
  caseSensitive: boolean;
  trimWhitespace: boolean;
  removeEmptyLines: boolean;
  sort: SortOrder;
  mode: OutputMode;
}

export interface DedupeResult {
  lines: string[];
  totalLines: number;
  uniqueLines: number;
  removedLines: number;
}

export function dedupeLines(input: string, options: DedupeOptions): DedupeResult {
  const rawLines = input.split(/\r\n|\r|\n/);

  const prepared = rawLines
    .map((line) => (options.trimWhitespace ? line.trim() : line))
    .filter((line) => !options.removeEmptyLines || line.trim().length > 0);

  // The comparison key is separate from the value, so the first-seen casing and
  // spacing survive even when matching ignores them.
  const keyOf = (line: string) => {
    const base = options.trimWhitespace ? line : line.trim();
    return options.caseSensitive ? base : base.toLowerCase();
  };

  const counts = new Map<string, number>();
  for (const line of prepared) {
    const key = keyOf(line);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const seen = new Set<string>();
  const unique: string[] = [];
  for (const line of prepared) {
    const key = keyOf(line);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(line);
  }

  let output =
    options.mode === "duplicates-only"
      ? unique.filter((line) => (counts.get(keyOf(line)) ?? 0) > 1)
      : unique;

  if (options.sort !== "original") {
    const collator = new Intl.Collator(undefined, {
      // Numeric collation puts "item2" before "item10", which is what people mean.
      numeric: true,
      sensitivity: options.caseSensitive ? "variant" : "base",
    });
    output = [...output].sort((a, b) =>
      options.sort === "asc" ? collator.compare(a, b) : collator.compare(b, a),
    );
  }

  return {
    lines: output,
    totalLines: prepared.length,
    uniqueLines: unique.length,
    removedLines: prepared.length - unique.length,
  };
}
