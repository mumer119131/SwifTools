import { hashSeed, mulberry32 } from "@/lib/random";

export interface Entry {
  word: string;
  clue: string;
}

export interface Placed extends Entry {
  row: number;
  col: number;
  across: boolean;
  number: number;
}

export interface Crossword {
  placed: Placed[];
  unplaced: Entry[];
  grid: (string | null)[][];
  numbers: (number | null)[][];
  rows: number;
  cols: number;
}

/** Parses "WORD = clue" lines, tolerating a colon or a dash as the separator. */
export function parseEntries(text: string): Entry[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(.+?)\s*(?:=|:|\s—\s|\s-\s)\s*(.*)$/);
      const word = (match ? match[1] : line).toUpperCase().replace(/[^A-Z]/g, "");
      const clue = match ? match[2].trim() : "";
      return { word, clue };
    })
    .filter((entry) => entry.word.length >= 2);
}

interface Slot {
  row: number;
  col: number;
  across: boolean;
  crossings: number;
}

const SIZE = 40; // working grid, trimmed to the used area at the end

/**
 * Builds a criss-cross crossword.
 *
 * The first word goes in the middle; every word after it must cross one already
 * placed, at a shared letter. Placements are scored by how many crossings they
 * make and how compact they keep the grid, because a puzzle where every word
 * crosses in exactly one place and sprawls across forty columns is technically
 * a crossword and useless as one.
 *
 * Several random orderings are tried and the densest result kept — the outcome
 * depends heavily on which word is placed first, and one attempt is a coin flip.
 */
export function build(entries: Entry[], seed: string): Crossword {
  const random = mulberry32(hashSeed(seed));

  let best: Crossword | null = null;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const ordered = orderWords(entries, random, attempt);
    const candidate = attemptBuild(ordered);

    if (
      !best ||
      candidate.placed.length > best.placed.length ||
      (candidate.placed.length === best.placed.length &&
        candidate.rows * candidate.cols < best.rows * best.cols)
    ) {
      best = candidate;
    }
  }

  return best ?? attemptBuild(entries);
}

function orderWords(entries: Entry[], random: () => number, attempt: number): Entry[] {
  // The first attempt is longest-first, which is usually best; the rest shuffle
  // so a bad first choice is not the only thing tried.
  const sorted = [...entries].sort((a, b) => b.word.length - a.word.length);
  if (attempt === 0) return sorted;

  const shuffled = [...entries];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  // Keep a long word first — starting from a three-letter word wastes the grid.
  shuffled.sort((a, b) => (b.word.length > 6 ? 0 : 1) - (a.word.length > 6 ? 0 : 1));
  return shuffled;
}

function attemptBuild(entries: Entry[]): Crossword {
  const grid: (string | null)[][] = Array.from({ length: SIZE }, () =>
    new Array(SIZE).fill(null),
  );

  const placed: { entry: Entry; row: number; col: number; across: boolean }[] = [];
  const unplaced: Entry[] = [];

  for (const entry of entries) {
    if (placed.length === 0) {
      const row = Math.floor(SIZE / 2);
      const col = Math.floor((SIZE - entry.word.length) / 2);
      write(grid, entry.word, row, col, true);
      placed.push({ entry, row, col, across: true });
      continue;
    }

    const slot = bestSlot(grid, entry.word);
    if (!slot) {
      unplaced.push(entry);
      continue;
    }

    write(grid, entry.word, slot.row, slot.col, slot.across);
    placed.push({ entry, row: slot.row, col: slot.col, across: slot.across });
  }

  return trim(grid, placed, unplaced);
}

function write(
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  across: boolean,
): void {
  for (let index = 0; index < word.length; index += 1) {
    grid[row + (across ? 0 : index)][col + (across ? index : 0)] = word[index];
  }
}

/** Finds the highest-scoring legal placement, or null if there is none. */
function bestSlot(grid: (string | null)[][], word: string): Slot | null {
  let best: Slot | null = null;
  let bestScore = -Infinity;

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const letter = grid[row][col];
      if (letter === null) continue;

      for (let index = 0; index < word.length; index += 1) {
        if (word[index] !== letter) continue;

        // Cross the existing letter, running the other way.
        for (const across of [true, false]) {
          const startRow = across ? row : row - index;
          const startCol = across ? col - index : col;

          const crossings = validate(grid, word, startRow, startCol, across);
          if (crossings === null) continue;

          // Prefer more crossings, then a placement nearer the middle.
          const centre = SIZE / 2;
          const distance =
            Math.abs(startRow - centre) + Math.abs(startCol - centre);
          const score = crossings * 100 - distance;

          if (score > bestScore) {
            bestScore = score;
            best = { row: startRow, col: startCol, across, crossings };
          }
        }
      }
    }
  }

  return best;
}

/**
 * Returns the number of crossings if the placement is legal, else null.
 *
 * Legal means: inside the grid, every overlapping cell already holds the same
 * letter, the cells immediately before and after the word are empty, and no
 * letter sits alongside the word except where it genuinely crosses. Without
 * that last rule words end up running parallel and touching, which reads as
 * gibberish down the crossing direction.
 */
function validate(
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  across: boolean,
): number | null {
  const endRow = row + (across ? 0 : word.length - 1);
  const endCol = col + (across ? word.length - 1 : 0);

  if (row < 0 || col < 0 || endRow >= SIZE || endCol >= SIZE) return null;

  // The cell before the start and after the end must be empty.
  const beforeRow = across ? row : row - 1;
  const beforeCol = across ? col - 1 : col;
  const afterRow = across ? row : endRow + 1;
  const afterCol = across ? endCol + 1 : col;

  if (beforeRow >= 0 && beforeCol >= 0 && grid[beforeRow][beforeCol] !== null) return null;
  if (afterRow < SIZE && afterCol < SIZE && grid[afterRow][afterCol] !== null) return null;

  let crossings = 0;

  for (let index = 0; index < word.length; index += 1) {
    const r = row + (across ? 0 : index);
    const c = col + (across ? index : 0);
    const existing = grid[r][c];

    if (existing !== null) {
      if (existing !== word[index]) return null;
      crossings += 1;
      continue;
    }

    // An empty cell must not have neighbours perpendicular to the word.
    const sides = across
      ? [[r - 1, c], [r + 1, c]]
      : [[r, c - 1], [r, c + 1]];

    for (const [sr, sc] of sides) {
      if (sr < 0 || sc < 0 || sr >= SIZE || sc >= SIZE) continue;
      if (grid[sr][sc] !== null) return null;
    }
  }

  // Every word after the first has to connect to the puzzle.
  return crossings > 0 ? crossings : null;
}

/** Crops the working grid to the used area and numbers the entries. */
function trim(
  grid: (string | null)[][],
  placed: { entry: Entry; row: number; col: number; across: boolean }[],
  unplaced: Entry[],
): Crossword {
  if (placed.length === 0) {
    return { placed: [], unplaced, grid: [], numbers: [], rows: 0, cols: 0 };
  }

  let minRow = SIZE;
  let maxRow = 0;
  let minCol = SIZE;
  let maxCol = 0;

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (grid[row][col] === null) continue;
      minRow = Math.min(minRow, row);
      maxRow = Math.max(maxRow, row);
      minCol = Math.min(minCol, col);
      maxCol = Math.max(maxCol, col);
    }
  }

  const rows = maxRow - minRow + 1;
  const cols = maxCol - minCol + 1;

  const cropped = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => grid[row + minRow][col + minCol]),
  );

  // Numbering runs left to right, top to bottom — the standard convention.
  const shifted = placed.map((entry) => ({
    ...entry,
    row: entry.row - minRow,
    col: entry.col - minCol,
  }));

  const starts = [...shifted].sort((a, b) => a.row - b.row || a.col - b.col);
  const numbers: (number | null)[][] = Array.from({ length: rows }, () =>
    new Array(cols).fill(null),
  );

  let next = 1;
  const numbered: Placed[] = [];

  for (const entry of starts) {
    const existing = numbers[entry.row][entry.col];
    // Two entries starting in the same cell share a number.
    const number = existing ?? next;
    if (existing === null) {
      numbers[entry.row][entry.col] = number;
      next += 1;
    }

    numbered.push({
      ...entry.entry,
      row: entry.row,
      col: entry.col,
      across: entry.across,
      number,
    });
  }

  return { placed: numbered, unplaced, grid: cropped, numbers, rows, cols };
}

export const SAMPLE = `PYTHON = A language named after a comedy troupe
COMPILER = Turns source into machine code
VARIABLE = A named box for a value
FUNCTION = A reusable block of code
ARRAY = An ordered list of values
LOOP = Repeats until a condition fails
BOOLEAN = True or false
STRING = A sequence of characters
DEBUG = Hunt down a defect
SYNTAX = The rules of a language's grammar
RECURSION = See recursion
INTEGER = A whole number`;
