import { shuffle } from "@/lib/random";

export interface Matchup {
  left: string;
  right: string;
}

/**
 * A single-elimination bracket over the options.
 *
 * The reason this beats a random pick: being asked to choose between exactly
 * two things is easy, and a list of eight is not. Answering seven easy
 * questions gets you an answer you actually believe, which a coin flip never
 * does — the useful thing about flipping a coin has always been noticing how
 * you feel while it is in the air.
 */
export function buildRounds(options: string[]): string[][] {
  const shuffled = shuffle(options);
  return [shuffled];
}

/** Plays one round: the winners advance, an odd one out gets a bye. */
export function nextRound(winners: string[], byes: string[]): string[] {
  return [...winners, ...byes];
}

export function pairUp(entrants: string[]): { matchups: Matchup[]; bye: string | null } {
  const matchups: Matchup[] = [];
  let bye: string | null = null;

  for (let index = 0; index + 1 < entrants.length; index += 2) {
    matchups.push({ left: entrants[index], right: entrants[index + 1] });
  }

  // An odd entrant skips the round rather than facing nobody.
  if (entrants.length % 2 === 1) bye = entrants[entrants.length - 1];

  return { matchups, bye };
}

export const PRESETS: { label: string; options: string[] }[] = [
  { label: "Yes or no", options: ["Yes", "No"] },
  { label: "Yes, no, maybe", options: ["Yes", "No", "Ask again later"] },
  { label: "Cook or order in", options: ["Cook something", "Order in", "Go out"] },
  { label: "Do it now or later", options: ["Do it now", "Do it tomorrow", "Drop it entirely"] },
  { label: "Rock paper scissors", options: ["Rock", "Paper", "Scissors"] },
];
