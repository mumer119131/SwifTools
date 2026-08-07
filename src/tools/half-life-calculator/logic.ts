export type Target = "remaining" | "time" | "halfLife";

export interface DecayResult {
  remaining: number;
  elapsed: number;
  halfLife: number;
  halvings: number;
  decayConstant: number;
  meanLifetime: number;
  percentRemaining: number;
}

/** Well-known isotopes, in seconds. */
export const ISOTOPES: { name: string; halfLife: number; unit: string; seconds: number }[] = [
  { name: "Carbon-14", halfLife: 5730, unit: "years", seconds: 5730 * 31556952 },
  { name: "Uranium-238", halfLife: 4.468e9, unit: "years", seconds: 4.468e9 * 31556952 },
  { name: "Iodine-131", halfLife: 8.02, unit: "days", seconds: 8.02 * 86400 },
  { name: "Cobalt-60", halfLife: 5.27, unit: "years", seconds: 5.27 * 31556952 },
  { name: "Technetium-99m", halfLife: 6.01, unit: "hours", seconds: 6.01 * 3600 },
  { name: "Caesium-137", halfLife: 30.17, unit: "years", seconds: 30.17 * 31556952 },
  { name: "Plutonium-239", halfLife: 24110, unit: "years", seconds: 24110 * 31556952 },
];

/**
 * Exponential decay: N = N₀ × (1/2)^(t / t½).
 *
 * Solved for whichever quantity is missing. The logarithmic forms need a
 * positive ratio, so an amount larger than the original — which would mean
 * growth, not decay — returns null rather than a NaN.
 */
export function solveDecay(
  target: Target,
  initial: number,
  remaining: number,
  elapsed: number,
  halfLife: number,
): DecayResult | null {
  if (!(initial > 0)) return null;

  let finalRemaining = remaining;
  let finalElapsed = elapsed;
  let finalHalfLife = halfLife;

  if (target === "remaining") {
    if (!(halfLife > 0) || elapsed < 0) return null;
    finalRemaining = initial * 0.5 ** (elapsed / halfLife);
  } else if (target === "time") {
    if (!(halfLife > 0) || !(remaining > 0) || remaining > initial) return null;
    finalElapsed = halfLife * Math.log2(initial / remaining);
  } else {
    if (!(remaining > 0) || remaining > initial || !(elapsed > 0)) return null;
    const ratio = Math.log2(initial / remaining);
    if (ratio === 0) return null;
    finalHalfLife = elapsed / ratio;
  }

  if (!(finalHalfLife > 0) || !Number.isFinite(finalElapsed)) return null;

  const decayConstant = Math.LN2 / finalHalfLife;

  return {
    remaining: finalRemaining,
    elapsed: finalElapsed,
    halfLife: finalHalfLife,
    halvings: finalElapsed / finalHalfLife,
    decayConstant,
    // The average time an individual atom survives — 1/λ, not the half-life.
    meanLifetime: 1 / decayConstant,
    percentRemaining: (finalRemaining / initial) * 100,
  };
}
