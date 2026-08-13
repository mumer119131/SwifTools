import { hashSeed, mulberry32 } from "@/lib/random";

export type Grid = number[]; // 81 cells, 0 for blank

export type Difficulty = "easy" | "medium" | "hard" | "expert";

export interface Puzzle {
  puzzle: Grid;
  solution: Grid;
  seed: string;
  difficulty: Difficulty;
  givens: number;
}

/** How many numbers are left showing. Fewer clues is harder, roughly. */
const CLUES: Record<Difficulty, number> = {
  easy: 45,
  medium: 36,
  hard: 30,
  // 17 is the proven minimum for a unique solution; 24 is hard enough.
  expert: 24,
};

function rowOf(index: number): number {
  return Math.floor(index / 9);
}

function colOf(index: number): number {
  return index % 9;
}

function boxOf(index: number): number {
  return Math.floor(rowOf(index) / 3) * 3 + Math.floor(colOf(index) / 3);
}

export function isLegal(grid: Grid, index: number, value: number): boolean {
  const row = rowOf(index);
  const col = colOf(index);
  const box = boxOf(index);

  for (let other = 0; other < 81; other += 1) {
    if (other === index || grid[other] !== value) continue;
    if (rowOf(other) === row || colOf(other) === col || boxOf(other) === box) return false;
  }

  return true;
}

/** Fills an empty grid with a valid complete solution. */
function solve(grid: Grid, random: () => number): boolean {
  const index = grid.indexOf(0);
  if (index === -1) return true;

  // Trying values in random order is what makes each generated grid different.
  const candidates = shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9], random);

  for (const value of candidates) {
    if (!isLegal(grid, index, value)) continue;

    grid[index] = value;
    if (solve(grid, random)) return true;
    grid[index] = 0;
  }

  return false;
}

/**
 * Counts solutions, stopping at two.
 *
 * A sudoku with more than one solution is not a sudoku — it cannot be reasoned
 * to an answer. Counting past two is wasted work, so the search stops as soon
 * as a second is found, which is what keeps generation fast enough to run in a
 * click.
 */
function countSolutions(grid: Grid, limit = 2): number {
  const index = grid.indexOf(0);
  if (index === -1) return 1;

  let found = 0;

  for (let value = 1; value <= 9; value += 1) {
    if (!isLegal(grid, index, value)) continue;

    grid[index] = value;
    found += countSolutions(grid, limit - found);
    grid[index] = 0;

    if (found >= limit) break;
  }

  return found;
}

function shuffled<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

/**
 * Generates a puzzle by digging holes out of a full solution.
 *
 * Cells are removed one at a time and the removal is undone whenever it would
 * leave more than one solution — which is why the puzzle is guaranteed
 * solvable by logic alone rather than by guessing.
 */
export function generate(difficulty: Difficulty, seed: string): Puzzle {
  const random = mulberry32(hashSeed(seed));

  const solution: Grid = new Array(81).fill(0);
  solve(solution, random);

  const puzzle = [...solution];
  const order = shuffled(
    Array.from({ length: 81 }, (_, index) => index),
    random,
  );

  const targetClues = CLUES[difficulty];
  let remaining = 81;

  for (const index of order) {
    if (remaining <= targetClues) break;

    const removed = puzzle[index];
    puzzle[index] = 0;

    if (countSolutions([...puzzle]) !== 1) {
      puzzle[index] = removed;
      continue;
    }

    remaining -= 1;
  }

  return {
    puzzle,
    solution,
    seed,
    difficulty,
    givens: puzzle.filter((value) => value !== 0).length,
  };
}
