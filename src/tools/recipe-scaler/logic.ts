import { formatKitchen } from "@/lib/home";

export interface ScaledLine {
  original: string;
  /** The rescaled line, or the original when there was no number to scale. */
  scaled: string;
  changed: boolean;
}

/** Unicode fractions a recipe might contain, and their values. */
const UNICODE_FRACTIONS: Record<string, number> = {
  "½": 0.5, "⅓": 1 / 3, "⅔": 2 / 3, "¼": 0.25, "¾": 0.75,
  "⅕": 0.2, "⅖": 0.4, "⅗": 0.6, "⅘": 0.8, "⅙": 1 / 6, "⅚": 5 / 6,
  "⅛": 0.125, "⅜": 0.375, "⅝": 0.625, "⅞": 0.875,
};

/**
 * Matches a quantity at the start of an ingredient line.
 *
 * Recipes write quantities four ways — "2", "1.5", "1 1/2" and "1½" — and all
 * four have to survive. The pattern is anchored to the line start so "350°F" in
 * a method line and the 2 in "2% milk" are left alone.
 */
const QUANTITY = new RegExp(
  String.raw`^(\s*)(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?\s*[${Object.keys(UNICODE_FRACTIONS).join("")}]|[${Object.keys(UNICODE_FRACTIONS).join("")}]|\d+(?:\.\d+)?)`,
);

/** Reads "1 1/2", "3/4", "1½", "0.75" or "2" as a number. */
export function parseQuantity(text: string): number | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  // A trailing unicode fraction, optionally after a whole number: "1½".
  const unicodeMatch = trimmed.match(
    new RegExp(String.raw`^(\d+)?\s*([${Object.keys(UNICODE_FRACTIONS).join("")}])$`),
  );
  if (unicodeMatch) {
    const whole = unicodeMatch[1] ? Number(unicodeMatch[1]) : 0;
    return whole + UNICODE_FRACTIONS[unicodeMatch[2]];
  }

  // "1 1/2"
  const mixedMatch = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const denominator = Number(mixedMatch[3]);
    if (denominator === 0) return null;
    return Number(mixedMatch[1]) + Number(mixedMatch[2]) / denominator;
  }

  // "3/4"
  const fractionMatch = trimmed.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const denominator = Number(fractionMatch[2]);
    if (denominator === 0) return null;
    return Number(fractionMatch[1]) / denominator;
  }

  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

/**
 * Scales every ingredient line by a factor.
 *
 * Lines with no leading quantity — "salt to taste", "a pinch of nutmeg" — pass
 * through untouched, which is correct: they do not scale linearly anyway.
 */
export function scaleRecipe(text: string, factor: number): ScaledLine[] {
  return text.split("\n").map((line) => {
    if (!line.trim()) return { original: line, scaled: line, changed: false };

    const match = line.match(QUANTITY);
    if (!match) return { original: line, scaled: line, changed: false };

    const quantity = parseQuantity(match[2]);
    if (quantity === null || quantity === 0) {
      return { original: line, scaled: line, changed: false };
    }

    const scaledValue = quantity * factor;
    const rest = line.slice(match[0].length);

    /*
     * Grams and millilitres are decimal measures — rounding 187.5 g to "187 ½"
     * would be absurd. Cups and spoons get fractions, because that is what the
     * measuring set has.
     */
    const isMetric = /^\s*(g|kg|ml|l|grams?|kilograms?|millilitres?|milliliters?|litres?|liters?)\b/i.test(rest);

    const formatted = isMetric
      ? scaledValue.toLocaleString("en-US", { maximumFractionDigits: scaledValue < 10 ? 1 : 0 })
      : formatKitchen(scaledValue);

    return { original: line, scaled: `${match[1]}${formatted}${rest}`, changed: true };
  });
}

export const SAMPLE = `2 cups all-purpose flour
1 1/2 tsp baking powder
1/2 tsp salt
3/4 cup granulated sugar
115 g butter, softened
2 large eggs
1 cup milk
1 tsp vanilla extract
Salt to taste`;
