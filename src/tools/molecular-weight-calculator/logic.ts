import { ATOMIC_WEIGHTS, AVOGADRO, ELEMENT_NAMES } from "@/lib/science";

export interface ElementCount {
  symbol: string;
  name: string;
  count: number;
  atomicWeight: number;
  mass: number;
  percent: number;
}

export type ParseResult =
  | { ok: true; molarMass: number; elements: ElementCount[] }
  | { ok: false; error: string };

/**
 * Recursive-descent parser for chemical formulas.
 *
 * Handles nested brackets — Ca(OH)2, K4[Fe(CN)6] — and hydrate notation with
 * either a middot or a full stop, since both are written in practice. A regex
 * cannot do this: brackets nest arbitrarily.
 */
export function parseFormula(input: string): ParseResult {
  const formula = input
    .replace(/\s+/g, "")
    .replace(/[·•.]/g, "·")
    .replace(/[[{]/g, "(")
    .replace(/[\]}]/g, ")");

  if (!formula) return { ok: false, error: "Enter a chemical formula." };

  // A hydrate is separate units summed: CuSO4·5H2O
  const segments = formula.split("·");
  const totals = new Map<string, number>();

  for (const segment of segments) {
    if (!segment) continue;

    // A leading number multiplies the whole segment: 5H2O
    const leading = segment.match(/^(\d+)(.*)$/);
    const repeat = leading ? Number(leading[1]) : 1;
    const body = leading ? leading[2] : segment;

    const parsed = parseSegment(body);
    if (!parsed.ok) return parsed;

    for (const [symbol, count] of parsed.counts) {
      totals.set(symbol, (totals.get(symbol) ?? 0) + count * repeat);
    }
  }

  if (totals.size === 0) return { ok: false, error: "No elements found in that formula." };

  let molarMass = 0;
  for (const [symbol, count] of totals) molarMass += ATOMIC_WEIGHTS[symbol] * count;

  const elements: ElementCount[] = [...totals.entries()]
    .map(([symbol, count]) => {
      const mass = ATOMIC_WEIGHTS[symbol] * count;
      return {
        symbol,
        name: ELEMENT_NAMES[symbol] ?? symbol,
        count,
        atomicWeight: ATOMIC_WEIGHTS[symbol],
        mass,
        percent: (mass / molarMass) * 100,
      };
    })
    .sort((a, b) => b.mass - a.mass);

  return { ok: true, molarMass, elements };
}

type SegmentResult =
  | { ok: true; counts: Map<string, number> }
  | { ok: false; error: string };

function parseSegment(segment: string): SegmentResult {
  let index = 0;

  function parseGroup(): SegmentResult {
    const counts = new Map<string, number>();

    while (index < segment.length) {
      const character = segment[index];

      if (character === ")") break;

      if (character === "(") {
        index += 1;
        const inner = parseGroup();
        if (!inner.ok) return inner;

        if (segment[index] !== ")") return { ok: false, error: "Unbalanced brackets." };
        index += 1;

        const multiplier = readNumber();
        for (const [symbol, count] of inner.counts) {
          counts.set(symbol, (counts.get(symbol) ?? 0) + count * multiplier);
        }
        continue;
      }

      if (!/[A-Za-z]/.test(character)) {
        return { ok: false, error: `Unexpected character "${character}".` };
      }

      // An element symbol is an uppercase letter optionally followed by
      // lowercase ones — Cl, not CL.
      if (character !== character.toUpperCase()) {
        return { ok: false, error: `Element symbols start with a capital letter — check "${character}".` };
      }

      let symbol = character;
      index += 1;
      while (index < segment.length && /[a-z]/.test(segment[index])) {
        symbol += segment[index];
        index += 1;
      }

      if (!(symbol in ATOMIC_WEIGHTS)) {
        return { ok: false, error: `"${symbol}" is not an element we know.` };
      }

      counts.set(symbol, (counts.get(symbol) ?? 0) + readNumber());
    }

    return { ok: true, counts };
  }

  function readNumber(): number {
    let digits = "";
    while (index < segment.length && /\d/.test(segment[index])) {
      digits += segment[index];
      index += 1;
    }
    // An absent subscript means one atom, not zero.
    return digits === "" ? 1 : Number(digits);
  }

  const result = parseGroup();
  if (!result.ok) return result;
  if (index < segment.length) return { ok: false, error: "Unbalanced brackets." };
  return result;
}

export function molesFrom(grams: number, molarMass: number): number {
  return molarMass > 0 ? grams / molarMass : 0;
}

export function moleculesFrom(moles: number): number {
  return moles * AVOGADRO;
}

export const EXAMPLES = ["H2O", "C6H12O6", "NaCl", "CuSO4·5H2O", "Ca(OH)2", "C8H10N4O2"];
