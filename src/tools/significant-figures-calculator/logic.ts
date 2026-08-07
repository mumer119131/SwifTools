export interface DigitMark {
  character: string;
  significant: boolean;
}

export interface SigFigResult {
  count: number;
  digits: DigitMark[];
  rounded: string;
  scientific: string;
  decimalPlaces: number;
  explanation: string;
}

/**
 * Counts significant figures.
 *
 * The rules that trip people up: leading zeros are never significant; trailing
 * zeros count only when there is a decimal point; zeros between non-zero digits
 * always count. A bare "1200" is genuinely ambiguous — it is treated as 2
 * figures here and flagged, because that is the convention when no decimal
 * point or overbar is written.
 */
export function analyse(input: string, roundTo: number): SigFigResult | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return null;

  // Scientific notation: only the mantissa carries significance.
  const scientificMatch = trimmed.match(/^([+-]?[\d.]+)[eE]([+-]?\d+)$/);
  const mantissa = scientificMatch ? scientificMatch[1] : trimmed;

  const body = mantissa.replace(/^[+-]/, "");
  const hasDecimalPoint = body.includes(".");
  const characters = [...body];

  let seenNonZero = false;
  let lastNonZeroIndex = -1;
  characters.forEach((character, index) => {
    if (/[1-9]/.test(character)) lastNonZeroIndex = index;
  });

  const digits: DigitMark[] = characters.map((character, index) => {
    if (character === ".") return { character, significant: false };

    if (/[1-9]/.test(character)) {
      seenNonZero = true;
      return { character, significant: true };
    }

    // A zero before any non-zero digit is a placeholder, never significant.
    if (!seenNonZero) return { character, significant: false };

    // After the last non-zero digit, a zero counts only with a decimal point.
    if (index > lastNonZeroIndex) return { character, significant: hasDecimalPoint };

    // Sandwiched between significant digits — always counts.
    return { character, significant: true };
  });

  const count = digits.filter((digit) => digit.significant).length;

  const places = Math.max(0, Math.min(20, roundTo));
  const rounded = places > 0 ? formatToSigFigs(value, places) : String(value);

  const ambiguous = !hasDecimalPoint && !scientificMatch && /0$/.test(body) && lastNonZeroIndex >= 0;

  return {
    count,
    digits,
    rounded,
    scientific: value === 0 ? "0" : value.toExponential(Math.max(0, places - 1)),
    decimalPlaces: hasDecimalPoint ? body.split(".")[1].length : 0,
    explanation: ambiguous
      ? "Trailing zeros with no decimal point are ambiguous — write it in scientific notation to be explicit."
      : hasDecimalPoint
        ? "The decimal point makes trailing zeros significant."
        : "Leading zeros never count; zeros between digits always do.",
  };
}

/**
 * Rounds to N significant figures without the exponent notation `toPrecision`
 * switches to for large numbers.
 */
function formatToSigFigs(value: number, figures: number): string {
  if (value === 0) return "0";

  const precise = value.toPrecision(figures);
  // toPrecision emits exponent form past 21 digits or below 1e-7; keep it then.
  if (precise.includes("e")) return precise;

  // Strip a trailing decimal point left by rounding, but keep meaningful zeros.
  return precise.replace(/\.$/, "");
}
