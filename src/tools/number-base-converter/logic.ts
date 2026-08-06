const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";

/**
 * Everything runs through `BigInt`.
 *
 * `parseInt`/`toString(radix)` lose precision above 2^53, which silently
 * corrupts exactly the values people bring to a base converter — 64-bit IDs,
 * hashes, register dumps. BigInt is exact at any width.
 */
export function parseInBase(text: string, base: number): bigint | null {
  const cleaned = text.trim().replace(/[\s_,]/g, "").toLowerCase();
  if (!cleaned) return null;

  const negative = cleaned.startsWith("-");
  // Tolerate the usual prefixes when they match the chosen base.
  const body = cleaned
    .replace(/^-/, "")
    .replace(/^0x/, base === 16 ? "" : "0x")
    .replace(/^0b/, base === 2 ? "" : "0b")
    .replace(/^0o/, base === 8 ? "" : "0o");

  if (!body) return null;

  const allowed = DIGITS.slice(0, base);
  let value = 0n;
  const bigBase = BigInt(base);

  for (const character of body) {
    const digit = allowed.indexOf(character);
    if (digit === -1) return null;
    value = value * bigBase + BigInt(digit);
  }

  return negative ? -value : value;
}

export function toBase(value: bigint, base: number): string {
  if (value === 0n) return "0";

  const negative = value < 0n;
  let remaining = negative ? -value : value;
  const bigBase = BigInt(base);
  let out = "";

  while (remaining > 0n) {
    out = DIGITS[Number(remaining % bigBase)] + out;
    remaining /= bigBase;
  }

  return negative ? `-${out}` : out;
}

export const presetBases = [
  { base: 2, label: "Binary", prefix: "0b" },
  { base: 8, label: "Octal", prefix: "0o" },
  { base: 10, label: "Decimal", prefix: "" },
  { base: 16, label: "Hexadecimal", prefix: "0x" },
] as const;

/** Groups digits for readability — nibbles for binary, thousands for decimal. */
export function groupDigits(value: string, base: number): string {
  const negative = value.startsWith("-");
  const body = negative ? value.slice(1) : value;

  const size = base === 2 ? 4 : base === 16 ? 4 : base === 8 ? 3 : 3;
  const separator = base === 10 ? "," : " ";

  const grouped = body
    .split("")
    .reverse()
    .reduce<string[]>((chunks, character, index) => {
      if (index > 0 && index % size === 0) chunks.push(separator);
      chunks.push(character);
      return chunks;
    }, [])
    .reverse()
    .join("");

  return negative ? `-${grouped}` : grouped;
}

export interface BitInfo {
  bits: number;
  /** Smallest standard width that holds the value, or null if it exceeds 64. */
  fitsIn: string | null;
  signedFitsIn: string | null;
}

export function analyseBits(value: bigint): BitInfo {
  const magnitude = value < 0n ? -value : value;
  const bits = magnitude === 0n ? 1 : magnitude.toString(2).length;

  const unsignedWidths = [8, 16, 32, 64];
  const fitsIn =
    value < 0n ? null : unsignedWidths.find((width) => magnitude < 2n ** BigInt(width)) ?? null;

  const signedFitsIn = unsignedWidths.find((width) => {
    const limit = 2n ** BigInt(width - 1);
    return value >= -limit && value < limit;
  });

  return {
    bits,
    fitsIn: fitsIn ? `uint${fitsIn}` : null,
    signedFitsIn: signedFitsIn ? `int${signedFitsIn}` : null,
  };
}
