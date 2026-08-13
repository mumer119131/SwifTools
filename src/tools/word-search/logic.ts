import { hashSeed, mulberry32 } from "@/lib/random";

export interface Placement {
  word: string;
  row: number;
  col: number;
  dr: number;
  dc: number;
}

export interface Puzzle {
  grid: string[][];
  placements: Placement[];
  unplaced: string[];
  size: number;
}

/** [row delta, column delta] for each allowed run direction. */
const DIRECTIONS: Record<string, [number, number][]> = {
  // Left to right and top to bottom only — the gentlest setting.
  easy: [[0, 1], [1, 0]],
  // Adds diagonals.
  medium: [[0, 1], [1, 0], [1, 1], [1, -1]],
  // Adds every reverse, which is what makes a puzzle genuinely hard.
  hard: [[0, 1], [1, 0], [1, 1], [1, -1], [0, -1], [-1, 0], [-1, -1], [-1, 1]],
};

export type Level = keyof typeof DIRECTIONS;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Places words into a grid, then fills the gaps with random letters.
 *
 * Overlaps are allowed and in fact preferred — two words crossing at a shared
 * letter is what stops the grid looking like a list with noise around it. Each
 * word is tried from many random starts before being given up on, and anything
 * that will not fit is reported rather than silently dropped.
 */
export function generate(
  words: string[],
  size: number,
  level: Level,
  seed: string,
): Puzzle {
  const random = mulberry32(hashSeed(seed));
  const directions = DIRECTIONS[level];

  const grid: string[][] = Array.from({ length: size }, () =>
    new Array(size).fill(""),
  );

  const placements: Placement[] = [];
  const unplaced: string[] = [];

  // Longest first: the hard ones need the empty grid, not what is left of it.
  const ordered = [...words]
    .map((word) => word.toUpperCase().replace(/[^A-Z]/g, ""))
    .filter((word) => word.length >= 2)
    .sort((a, b) => b.length - a.length);

  for (const word of ordered) {
    if (word.length > size) {
      unplaced.push(word);
      continue;
    }

    let placed = false;

    for (let attempt = 0; attempt < 300 && !placed; attempt += 1) {
      const [dr, dc] = directions[Math.floor(random() * directions.length)];
      const row = Math.floor(random() * size);
      const col = Math.floor(random() * size);

      const endRow = row + dr * (word.length - 1);
      const endCol = col + dc * (word.length - 1);
      if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) continue;

      // A cell may be reused only if it already holds the same letter.
      let fits = true;
      for (let index = 0; index < word.length; index += 1) {
        const cell = grid[row + dr * index][col + dc * index];
        if (cell !== "" && cell !== word[index]) {
          fits = false;
          break;
        }
      }
      if (!fits) continue;

      for (let index = 0; index < word.length; index += 1) {
        grid[row + dr * index][col + dc * index] = word[index];
      }
      placements.push({ word, row, col, dr, dc });
      placed = true;
    }

    if (!placed) unplaced.push(word);
  }

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (grid[row][col] === "") {
        grid[row][col] = ALPHABET[Math.floor(random() * 26)];
      }
    }
  }

  return { grid, placements, unplaced, size };
}

/** Every cell a placed word occupies, for the answer key. */
export function solutionCells(placements: Placement[]): Set<string> {
  const cells = new Set<string>();
  for (const placement of placements) {
    for (let index = 0; index < placement.word.length; index += 1) {
      cells.add(`${placement.row + placement.dr * index},${placement.col + placement.dc * index}`);
    }
  }
  return cells;
}

export const SAMPLE = `Volcano\nGlacier\nCanyon\nPlateau\nEstuary\nSavanna\nTundra\nArchipelago\nFjord\nDelta\nOasis\nReef\nGeyser\nDune\nBasin`;
