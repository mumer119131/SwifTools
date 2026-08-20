/**
 * Roman numerals, both directions.
 *
 * Encoding is easy. Decoding is where the care goes, because most converters
 * accept anything vaguely Roman-looking and quietly return a number — `IIII`,
 * `IC`, `VV` and `MMMM` all parse under a naive left-to-right scan, and none of
 * them is a valid numeral. Reporting 99 for `IC` is worse than refusing it,
 * because the reader has no reason to doubt the answer.
 */

/** Values in descending order, including the six subtractive pairs. */
const NUMERALS: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

const VALUES: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

/** The system has no zero and no way to write beyond 3999 without overbars. */
export const MIN = 1;
export const MAX = 3999;

export function toRoman(value: number): string | null {
  if (!Number.isInteger(value) || value < MIN || value > MAX) return null;

  let remaining = value;
  let out = "";

  for (const [amount, numeral] of NUMERALS) {
    while (remaining >= amount) {
      out += numeral;
      remaining -= amount;
    }
  }

  return out;
}

export interface DecodeResult {
  value: number;
  /** The canonical spelling, which may differ from what was typed. */
  canonical: string;
}

/**
 * Decodes strictly.
 *
 * Rather than validating with a list of rules — which is where these
 * implementations get long and still miss cases — the input is decoded and then
 * re-encoded. If the canonical form of the resulting number is not the input,
 * the input was not a valid numeral. That catches `IIII`, `VV`, `IC` and
 * everything else in one comparison, because there is exactly one correct
 * spelling of any number.
 */
export function fromRoman(input: string): DecodeResult | { error: string } {
  const text = input.trim().toUpperCase();
  if (text === "") return { error: "Enter a numeral." };

  if (!/^[IVXLCDM]+$/.test(text)) {
    const bad = [...text].find((character) => !(character in VALUES));
    return { error: `"${bad}" is not a Roman numeral. Only I, V, X, L, C, D and M are.` };
  }

  let total = 0;
  for (let i = 0; i < text.length; i += 1) {
    const current = VALUES[text[i]];
    const next = i + 1 < text.length ? VALUES[text[i + 1]] : 0;
    // A smaller value before a larger one is subtracted.
    total += current < next ? -current : current;
  }

  if (total < MIN || total > MAX) {
    return { error: `That works out to ${total}, which is outside 1–3999.` };
  }

  const canonical = toRoman(total);
  if (canonical !== text) {
    return {
      error: `Not a valid numeral. ${total} is written ${canonical}, not ${text}.`,
    };
  }

  return { value: total, canonical };
}

/** Why the rules are what they are, for the ones people get wrong. */
export const RULES = [
  {
    rule: "Only I, X and C are ever subtracted",
    detail: "So 99 is XCIX — ninety plus nine — and never IC. V, L and D are never subtracted from anything.",
  },
  {
    rule: "Subtract only from the next two values up",
    detail: "I goes before V and X, X before L and C, C before D and M. IM is not 999.",
  },
  {
    rule: "No more than three of the same numeral in a row",
    detail: "4 is IV, not IIII — though clock faces have used IIII for centuries, for reasons that are aesthetic rather than arithmetic.",
  },
  {
    rule: "There is no zero, and no negative",
    detail: "The system was built for counting things, and had no need for either.",
  },
  {
    rule: "3999 is the practical ceiling",
    detail: "Beyond it, larger values needed an overbar meaning multiply by a thousand — which plain text cannot show.",
  },
] as const;

/** Years and numbers people actually look up. */
export const EXAMPLES = [
  { value: 4, roman: "IV", note: "Not IIII" },
  { value: 9, roman: "IX", note: "Not VIIII" },
  { value: 40, roman: "XL", note: "Not XXXX" },
  { value: 99, roman: "XCIX", note: "Not IC" },
  { value: 400, roman: "CD" },
  { value: 1999, roman: "MCMXCIX", note: "The awkward one" },
  { value: 2026, roman: "MMXXVI" },
  { value: 3999, roman: "MMMCMXCIX", note: "The largest" },
];
