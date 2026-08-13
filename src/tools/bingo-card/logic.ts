import { hashSeed, mulberry32, shuffle } from "@/lib/random";

export interface Card {
  id: number;
  cells: (string | null)[];
  seed: string;
}

export type Size = 3 | 4 | 5;

/**
 * Classic bingo columns: B 1–15, I 16–30, N 31–45, G 46–60, O 61–75.
 *
 * Each column draws only from its own range, which is what makes the card a
 * bingo card rather than a grid of random numbers.
 */
export function numberPool(column: number): number[] {
  const start = column * 15 + 1;
  return Array.from({ length: 15 }, (_, index) => start + index);
}

export function makeNumberCard(id: number, seed: string, size: Size): Card {
  const random = mulberry32(hashSeed(`${seed}-${id}`));
  const cells: (string | null)[] = new Array(size * size).fill(null);

  for (let column = 0; column < size; column += 1) {
    const drawn = shuffle(numberPool(column), random).slice(0, size);
    for (let row = 0; row < size; row += 1) {
      cells[row * size + column] = String(drawn[row]);
    }
  }

  // The centre square is free on an odd-sized card, as tradition demands.
  if (size % 2 === 1) cells[Math.floor((size * size) / 2)] = null;

  return { id, cells, seed: `${seed}-${id}` };
}

export function makeWordCard(id: number, seed: string, size: Size, words: string[]): Card {
  const random = mulberry32(hashSeed(`${seed}-${id}`));
  const needed = size * size - (size % 2 === 1 ? 1 : 0);

  // Repeat the pool if there are not enough words, rather than leaving blanks.
  const pool: string[] = [];
  while (pool.length < needed) pool.push(...shuffle(words, random));

  const chosen = pool.slice(0, needed);
  const cells: (string | null)[] = [];

  let cursor = 0;
  for (let index = 0; index < size * size; index += 1) {
    if (size % 2 === 1 && index === Math.floor((size * size) / 2)) {
      cells.push(null);
      continue;
    }
    cells.push(chosen[cursor]);
    cursor += 1;
  }

  return { id, cells, seed: `${seed}-${id}` };
}

export const SAMPLE_WORDS = `Circle back\nLow-hanging fruit\nSynergy\nTouch base\nMove the needle\nDeep dive\nBandwidth\nPing me\nLet's take this offline\nAt the end of the day\nGoing forward\nAlignment\nQuick win\nDouble click on that\nBoil the ocean\nNorth star\nTable it\nRun it up the flagpole\nOpen the kimono\nParadigm shift\nHolistic\nLeverage\nPivot\nActionable\nBest practice\nCore competency\nEcosystem\nGranular\nStakeholder\nValue-add`;
