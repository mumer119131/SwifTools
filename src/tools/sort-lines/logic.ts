export type Mode = "alpha" | "natural" | "numeric" | "length" | "random" | "reverse";

export interface Options {
  mode: Mode;
  descending: boolean;
  caseSensitive: boolean;
  trim: boolean;
  removeEmpty: boolean;
  removeDuplicates: boolean;
}

export const MODES: { id: Mode; label: string; note: string }[] = [
  { id: "alpha", label: "Alphabetical", note: "A to Z, using your locale's rules." },
  { id: "natural", label: "Natural", note: "item2 before item10, the way a person would order them." },
  { id: "numeric", label: "Numeric", note: "By the first number found on each line." },
  { id: "length", label: "By length", note: "Shortest line first." },
  { id: "random", label: "Shuffle", note: "Fisher–Yates, from the browser's crypto source." },
  { id: "reverse", label: "Reverse", note: "Flip the current order without sorting." },
];

/**
 * Sorts a block of lines.
 *
 * Alphabetical uses `Intl.Collator` rather than comparing strings directly.
 * A plain `<` comparison sorts by code point, which puts every capital letter
 * before every lowercase one — so "Zebra" lands before "apple" — and files
 * accented words in the wrong place entirely.
 */
export function sortLines(input: string, options: Options): string[] {
  let lines = input.split("\n");

  if (options.trim) lines = lines.map((line) => line.trim());
  if (options.removeEmpty) lines = lines.filter((line) => line.trim() !== "");

  if (options.removeDuplicates) {
    const seen = new Set<string>();
    lines = lines.filter((line) => {
      const key = options.caseSensitive ? line : line.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  const collator = new Intl.Collator(undefined, {
    sensitivity: options.caseSensitive ? "variant" : "base",
    // Natural mode is this flag; it is what puts item2 before item10.
    numeric: options.mode === "natural",
  });

  if (options.mode === "reverse") {
    lines = [...lines].reverse();
  } else if (options.mode === "random") {
    lines = shuffle(lines);
  } else if (options.mode === "length") {
    lines = [...lines].sort((a, b) => a.length - b.length || collator.compare(a, b));
  } else if (options.mode === "numeric") {
    lines = [...lines].sort((a, b) => {
      const left = firstNumber(a);
      const right = firstNumber(b);
      // Lines with no number sort to the end rather than being treated as 0,
      // which would scatter them through the middle of the list.
      if (left === null && right === null) return collator.compare(a, b);
      if (left === null) return 1;
      if (right === null) return -1;
      return left - right;
    });
  } else {
    lines = [...lines].sort(collator.compare);
  }

  // Reverse and shuffle already produce a direction; flipping them again would
  // make the toggle meaningless for one and pointless for the other.
  if (options.descending && options.mode !== "reverse" && options.mode !== "random") {
    lines = lines.reverse();
  }

  return lines;
}

function firstNumber(line: string): number | null {
  const match = line.match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

/** Fisher–Yates from the crypto source, same as the randomiser tools. */
function shuffle(items: string[]): string[] {
  const result = [...items];
  const random = () => {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const buffer = new Uint32Array(1);
      crypto.getRandomValues(buffer);
      return buffer[0] / 4294967296;
    }
    return Math.random();
  };

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}
