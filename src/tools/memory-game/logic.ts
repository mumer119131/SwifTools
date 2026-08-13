import { shuffle } from "@/lib/random";

export interface Card {
  id: number;
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

/** Symbols distinct enough to tell apart at a glance and in both themes. */
const SYMBOLS = [
  "★", "▲", "●", "■", "◆", "✚", "❤", "☀", "☂", "⚑",
  "♪", "☾", "✿", "⚓", "☘", "✈", "⌂", "✂", "✉", "☕",
  "♞", "⚙", "☯", "✦", "◐", "❄", "☁", "⌛", "⚡", "☺",
  "♣", "♠",
];

export const SIZES = [
  { id: "4x3", label: "4 × 3", cols: 4, pairs: 6 },
  { id: "4x4", label: "4 × 4", cols: 4, pairs: 8 },
  { id: "6x4", label: "6 × 4", cols: 6, pairs: 12 },
  { id: "6x6", label: "6 × 6", cols: 6, pairs: 18 },
  { id: "8x6", label: "8 × 6", cols: 8, pairs: 24 },
];

export function deal(pairs: number): Card[] {
  const chosen = SYMBOLS.slice(0, pairs);
  const doubled = [...chosen, ...chosen];

  return shuffle(doubled).map((symbol, index) => ({
    id: index,
    symbol,
    flipped: false,
    matched: false,
  }));
}

/** The fewest moves the board can theoretically be cleared in. */
export function perfectMoves(pairs: number): number {
  return pairs;
}
