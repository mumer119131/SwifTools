/**
 * Randomness for the fun tools.
 *
 * Two different needs, kept apart deliberately:
 *
 *   - `secureInt` uses the Web Crypto API. Anything a person might treat as
 *     fair — a coin flip, a dice roll, a prize draw — uses it, because
 *     `Math.random` is not uniform enough to defend and cannot be seeded away
 *     from a predictable state.
 *   - `mulberry32` is a seeded generator, used where a result has to be
 *     reproducible: a puzzle you can share by its seed, or a bingo card that
 *     regenerates identically from a link.
 */

/**
 * A uniform integer in [0, max), free of modulo bias.
 *
 * The naive `crypto value % max` is biased whenever `max` does not divide the
 * range evenly — with a byte and max = 100, the values 0–55 are very slightly
 * more likely than 56–99. Rejecting the tail of the range removes it entirely.
 */
export function secureInt(max: number): number {
  if (!Number.isFinite(max) || max <= 0) return 0;
  const bound = Math.floor(max);
  if (bound <= 1) return 0;

  // Fall back where crypto is unavailable rather than throwing on an old device.
  if (typeof crypto === "undefined" || !crypto.getRandomValues) {
    return Math.floor(Math.random() * bound);
  }

  const limit = Math.floor(0xffffffff / bound) * bound;
  const buffer = new Uint32Array(1);

  for (;;) {
    crypto.getRandomValues(buffer);
    if (buffer[0] < limit) return buffer[0] % bound;
  }
}

/** A uniform integer in [min, max], inclusive at both ends. */
export function secureRange(min: number, max: number): number {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return low + secureInt(high - low + 1);
}

/** One item, chosen uniformly. */
export function pick<T>(items: readonly T[]): T | undefined {
  return items.length > 0 ? items[secureInt(items.length)] : undefined;
}

/**
 * Fisher–Yates, which is the only shuffle that produces every permutation with
 * equal probability. `sort(() => Math.random() - 0.5)` — the usual shortcut —
 * is measurably biased and depends on the engine's sort implementation.
 */
export function shuffle<T>(items: readonly T[], random: () => number = () => secureInt(1e9) / 1e9): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

/**
 * A small, fast seeded generator. Same seed, same sequence, every time — which
 * is what makes a puzzle shareable as a short code rather than a blob of state.
 */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** Turns a human-typed seed into the 32-bit number mulberry32 wants. */
export function hashSeed(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** A short, readable seed to show alongside a generated puzzle. */
export function randomSeed(): string {
  return secureInt(0xffffff).toString(36).toUpperCase().padStart(5, "0");
}

/** Splits a textarea into trimmed, non-empty lines. */
export function toLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
