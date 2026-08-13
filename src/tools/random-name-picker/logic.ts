import { secureInt } from "@/lib/random";

/**
 * Draws names without replacement.
 *
 * "No repeats" is the mode that matters in a classroom: picking uniformly every
 * time means someone can go four turns running while another child is never
 * called, which is fair in the statistical sense and unfair in every other one.
 */
export function pickNames(pool: string[], count: number): string[] {
  const available = [...pool];
  const picked: string[] = [];
  const wanted = Math.max(1, Math.min(available.length, Math.floor(count)));

  for (let index = 0; index < wanted; index += 1) {
    const chosen = secureInt(available.length);
    picked.push(available[chosen]);
    available.splice(chosen, 1);
  }

  return picked;
}
