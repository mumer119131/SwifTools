import { secureRange } from "@/lib/random";

export interface Roll {
  notation: string;
  dice: { sides: number; values: number[]; kept: boolean[] }[];
  modifier: number;
  total: number;
  min: number;
  max: number;
  average: number;
}

export type Mode = "normal" | "advantage" | "disadvantage" | "drop-lowest";

/**
 * Parses standard dice notation: "2d6+3", "d20", "4d6", "3d8-1".
 *
 * Multiple groups separated by + are supported — "1d8+2d6+4" is one roll of
 * three parts, which is how damage is written in most tabletop systems.
 */
export function parseNotation(input: string): { count: number; sides: number }[] | null {
  const cleaned = input.toLowerCase().replace(/\s+/g, "");
  if (!cleaned) return null;

  // Split on + and - while keeping the sign with the term that follows.
  const terms = cleaned.match(/[+-]?[^+-]+/g);
  if (!terms) return null;

  const groups: { count: number; sides: number }[] = [];

  for (const term of terms) {
    const dieMatch = term.match(/^([+-]?)(\d*)d(\d+)$/);
    if (dieMatch) {
      const count = dieMatch[2] === "" ? 1 : Number(dieMatch[2]);
      const sides = Number(dieMatch[3]);
      if (count < 1 || count > 100 || sides < 2 || sides > 1000) return null;
      groups.push({ count, sides });
      continue;
    }

    // A bare number is a modifier, handled separately by the caller.
    if (/^[+-]?\d+$/.test(term)) continue;

    return null;
  }

  return groups.length > 0 ? groups : null;
}

/** The flat modifier — every bare number in the notation, summed. */
export function parseModifier(input: string): number {
  const cleaned = input.toLowerCase().replace(/\s+/g, "");
  const terms = cleaned.match(/[+-]?[^+-]+/g) ?? [];

  return terms.reduce((sum, term) => {
    if (/^[+-]?\d+$/.test(term)) return sum + Number(term);
    return sum;
  }, 0);
}

export function roll(notation: string, mode: Mode): Roll | null {
  const groups = parseNotation(notation);
  if (!groups) return null;

  const modifier = parseModifier(notation);

  const dice = groups.map((group) => {
    /*
     * Advantage and disadvantage roll twice and keep one; drop-lowest rolls the
     * stated number and discards the worst. Both are shown with the discarded
     * die visible, because seeing what was dropped is half the appeal.
     */
    const rollCount =
      mode === "advantage" || mode === "disadvantage" ? group.count * 2 : group.count;

    const values = Array.from({ length: rollCount }, () => secureRange(1, group.sides));
    const kept = new Array(rollCount).fill(true);

    if (mode === "advantage" || mode === "disadvantage") {
      const sorted = values.map((value, index) => ({ value, index }));
      sorted.sort((a, b) => (mode === "advantage" ? b.value - a.value : a.value - b.value));
      for (const entry of sorted.slice(group.count)) kept[entry.index] = false;
    } else if (mode === "drop-lowest" && group.count > 1) {
      let lowestIndex = 0;
      values.forEach((value, index) => {
        if (value < values[lowestIndex]) lowestIndex = index;
      });
      kept[lowestIndex] = false;
    }

    return { sides: group.sides, values, kept };
  });

  const diceTotal = dice.reduce(
    (sum, group) =>
      sum + group.values.reduce((inner, value, index) => inner + (group.kept[index] ? value : 0), 0),
    0,
  );

  const keptCount = dice.reduce(
    (sum, group) => sum + group.kept.filter(Boolean).length,
    0,
  );

  return {
    notation,
    dice,
    modifier,
    total: diceTotal + modifier,
    min: keptCount + modifier,
    max: dice.reduce(
      (sum, group) => sum + group.sides * group.kept.filter(Boolean).length,
      0,
    ) + modifier,
    average:
      dice.reduce(
        (sum, group) => sum + ((group.sides + 1) / 2) * group.kept.filter(Boolean).length,
        0,
      ) + modifier,
  };
}

export const PRESETS = ["d4", "d6", "2d6", "3d6", "d8", "d10", "d12", "d20", "d20+5", "d100", "4d6", "2d6+3"];
