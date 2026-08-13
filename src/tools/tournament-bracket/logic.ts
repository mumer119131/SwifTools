import { shuffle } from "@/lib/random";

export interface Match {
  id: string;
  round: number;
  slot: number;
  /** null means the seat is waiting on an earlier match. */
  left: string | null;
  right: string | null;
  winner: string | null;
}

/**
 * Builds an empty single-elimination bracket.
 *
 * The field is padded up to the next power of two with byes rather than
 * inventing an extra round, so seven entrants play a six-team first round and
 * the top seed walks into round two — which is exactly how a real draw works.
 * Seeds are paired 1 vs 16, 2 vs 15 and so on, so the strongest entrants only
 * meet at the end.
 */
export function buildBracket(entrants: string[], randomise: boolean): Match[] {
  const field = randomise ? shuffle(entrants) : [...entrants];
  if (field.length < 2) return [];

  const size = 2 ** Math.ceil(Math.log2(field.length));
  const rounds = Math.log2(size);

  // Standard seeding order for a bracket of `size`, built by reflection.
  let order = [0];
  for (let round = 0; round < rounds; round += 1) {
    const next: number[] = [];
    const pairSum = order.length * 2 - 1;
    for (const seed of order) {
      next.push(seed, pairSum - seed);
    }
    order = next;
  }

  const matches: Match[] = [];

  for (let slot = 0; slot < size / 2; slot += 1) {
    const leftSeed = order[slot * 2];
    const rightSeed = order[slot * 2 + 1];

    const left = field[leftSeed] ?? null;
    const right = field[rightSeed] ?? null;

    matches.push({
      id: `r1-m${slot}`,
      round: 1,
      slot,
      left,
      right,
      // A player facing a bye advances immediately rather than waiting.
      winner: left && !right ? left : right && !left ? right : null,
    });
  }

  for (let round = 2; round <= rounds; round += 1) {
    const count = size / 2 ** round;
    for (let slot = 0; slot < count; slot += 1) {
      matches.push({
        id: `r${round}-m${slot}`,
        round,
        slot,
        left: null,
        right: null,
        winner: null,
      });
    }
  }

  return propagate(matches);
}

/** Carries every decided winner forward into its next match. */
export function propagate(matches: Match[]): Match[] {
  const byId = new Map(matches.map((match) => [match.id, { ...match }]));
  const rounds = Math.max(...matches.map((match) => match.round));

  for (let round = 1; round < rounds; round += 1) {
    const inRound = [...byId.values()].filter((match) => match.round === round);

    for (const match of inRound) {
      const next = byId.get(`r${round + 1}-m${Math.floor(match.slot / 2)}`);
      if (!next) continue;

      // Even slots feed the top seat of the next match, odd slots the bottom.
      if (match.slot % 2 === 0) next.left = match.winner;
      else next.right = match.winner;

      // A seat that lost its occupant invalidates anything decided downstream.
      if (next.winner && next.winner !== next.left && next.winner !== next.right) {
        next.winner = null;
      }

      // A bye in the next round advances the lone entrant automatically.
      const feeders = inRound.filter(
        (entry) => Math.floor(entry.slot / 2) === Math.floor(match.slot / 2),
      );
      const decided = feeders.every((entry) => entry.winner !== null);
      if (decided && next.left && !next.right) next.winner = next.left;
      if (decided && next.right && !next.left) next.winner = next.right;
    }
  }

  return [...byId.values()].sort((a, b) => a.round - b.round || a.slot - b.slot);
}

export function roundName(round: number, totalRounds: number): string {
  const fromEnd = totalRounds - round;
  if (fromEnd === 0) return "Final";
  if (fromEnd === 1) return "Semi-finals";
  if (fromEnd === 2) return "Quarter-finals";
  return `Round ${round}`;
}

export const SAMPLE = `Amara\nBen\nChen\nDiego\nElena\nFarid\nGrace\nHugo`;
