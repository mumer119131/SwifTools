#!/usr/bin/env node
/**
 * Verifies the science and engineering tools against textbook values.
 *
 * These tools give a number and nothing else — there is no way for someone to
 * tell a right answer from a wrong one by looking at it. Every case here has a
 * known answer from a standard reference or a definition, not from running the
 * code and writing down what it printed.
 *
 *   pnpm check:science
 */

import process from "node:process";

import { nearestE24, formatEngineering, ATOMIC_WEIGHTS } from "@/lib/science";
import { parseFormula } from "@/tools/molecular-weight-calculator/logic";
import { computeYield, parseEquation } from "@/tools/stoichiometry-calculator/logic";
import { solveDecay } from "@/tools/half-life-calculator/logic";
import { analyse } from "@/tools/significant-figures-calculator/logic";
import { decode, encode } from "@/tools/resistor-color-code-calculator/logic";

let failures = 0;

function check(label: string, actual: unknown, expected: unknown): void {
  const ok =
    typeof actual === "number" && typeof expected === "number"
      ? Math.abs(actual - expected) <= Math.max(1e-9, Math.abs(expected) * 1e-6)
      : actual === expected;

  if (ok) {
    console.log(`  ok    ${label} = ${String(actual)}`);
  } else {
    failures += 1;
    console.error(`  FAIL  ${label}: got ${String(actual)}, expected ${String(expected)}`);
  }
}

/* ---------------------------------------------------------------- chemistry */

// Molar masses from IUPAC standard atomic weights, rounded as published.
check("M(H2O)", round(parseMass("H2O"), 3), 18.015);
check("M(C6H12O6)", round(parseMass("C6H12O6"), 3), 180.156);
check("M(NaCl)", round(parseMass("NaCl"), 3), 58.44);
check("M(Ca(OH)2)", round(parseMass("Ca(OH)2"), 3), 74.092);
// Hydrate notation: the five waters must be counted, not ignored.
check("M(CuSO4·5H2O)", round(parseMass("CuSO4·5H2O"), 2), 249.68);
check("M(K4[Fe(CN)6])", round(parseMass("K4[Fe(CN)6]"), 2), 368.35);
// Caffeine, a case where a wrong subscript would be invisible in the output.
check("M(C8H10N4O2)", round(parseMass("C8H10N4O2"), 3), 194.194);

// A bad symbol must be rejected rather than silently skipped.
check("parse Xx fails", parseFormula("Xx").ok, false);
check("unbalanced bracket fails", parseFormula("Ca(OH2").ok, false);
check("lowercase start fails", parseFormula("h2o").ok, false);
// CO is carbon monoxide; Co is cobalt. Case must decide, not a fuzzy match.
check("CO ≠ Co", round(parseMass("CO"), 3) === round(ATOMIC_WEIGHTS.Co, 3), false);

function parseMass(formula: string): number {
  const parsed = parseFormula(formula);
  return parsed.ok ? parsed.molarMass : NaN;
}

function round(value: number, places: number): number {
  return Number(value.toFixed(places));
}

/* ------------------------------------------------------------ stoichiometry */

{
  // 10 g H2 with 64 g O2. H2 is 4.96 mol, O2 is 2.00 mol; the ratio needs two
  // H2 per O2, so oxygen is limiting despite weighing six times more.
  const parsed = parseEquation("2H2 + O2 -> 2H2O");
  if (!parsed.ok) {
    failures += 1;
    console.error("  FAIL  2H2 + O2 -> 2H2O did not parse");
  } else {
    check("equation balanced", parsed.balanced, true);

    const result = computeYield(parsed.equation, [10, 64], "g");
    check("limiting reagent", result.limiting?.formula, "O2");
    // Not exactly 2: O is 15.999, so 64 g of O2 is 2.0001 mol, not 2.
    check("extent (mol)", round(result.extent, 4), 2.0001);
    // 2 mol of reaction makes 4 mol water: 4 × 18.015 = 72.06 g.
    check("water yield (g)", round(result.products[0].grams, 2), 72.06);
    // 4 mol H2 consumed of 4.96 supplied leaves 0.96 mol ≈ 1.94 g.
    check("H2 left over (g)", round(result.reactants[0].leftoverGrams, 2), 1.94);
  }
}

{
  // Methane combustion, the case every textbook opens with.
  const parsed = parseEquation("CH4 + 2O2 -> CO2 + 2H2O");
  if (!parsed.ok) {
    failures += 1;
    console.error("  FAIL  methane equation did not parse");
  } else {
    check("methane balanced", parsed.balanced, true);
    // 1 mol CH4 (16.043 g) with excess O2 makes 1 mol CO2 = 44.009 g.
    const result = computeYield(parsed.equation, [1, 10], "mol");
    check("CO2 from 1 mol CH4 (g)", round(result.products[0].grams, 2), 44.01);
    check("CH4 is limiting", result.limiting?.formula, "CH4");
  }
}

// An unbalanced equation must be reported, not quietly accepted.
{
  const parsed = parseEquation("H2 + O2 -> H2O");
  check("H2 + O2 -> H2O flagged unbalanced", parsed.ok && parsed.balanced, false);
}
check("missing arrow rejected", parseEquation("2H2 + O2").ok, false);
// Alternative arrow spellings all have to work.
check("→ arrow accepted", parseEquation("N2 + 3H2 → 2NH3").ok, true);
check("= arrow accepted", parseEquation("N2 + 3H2 = 2NH3").ok, true);

/* ------------------------------------------------------------------- decay */

{
  // Four half-lives leaves 1/16 of the sample.
  const result = solveDecay("remaining", 100, 0, 20, 5);
  check("100 after 4 half-lives", round(result!.remaining, 6), 6.25);
  check("half-lives elapsed", result!.halvings, 4);
  // λ = ln2 / t½
  check("decay constant", round(result!.decayConstant, 6), round(Math.LN2 / 5, 6));
}
{
  // Carbon dating: 25% remaining is exactly two half-lives, 11,460 years.
  const result = solveDecay("time", 100, 25, 0, 5730);
  check("carbon-14 age at 25%", round(result!.elapsed, 3), 11460);
}
{
  // Solving the other way: half gone in 10 units means t½ = 10.
  const result = solveDecay("halfLife", 80, 40, 10, 0);
  check("half-life from 50% in 10", round(result!.halfLife, 9), 10);
}
// More left than you started with is growth, not decay — must be refused.
check("remaining > initial rejected", solveDecay("time", 10, 20, 0, 5), null);
check("zero half-life rejected", solveDecay("remaining", 10, 0, 5, 0), null);

/* -------------------------------------------------------- significant figures */

check("0.004520 sig figs", analyse("0.004520", 3)!.count, 4);
check("1002 sig figs", analyse("1002", 3)!.count, 4);
check("4.50 sig figs", analyse("4.50", 3)!.count, 3);
// No decimal point, so the trailing zeros are placeholders.
check("450 sig figs", analyse("450", 3)!.count, 2);
check("450. sig figs", analyse("450.", 3)!.count, 3);
check("0.0045 sig figs", analyse("0.0045", 3)!.count, 2);
// Scientific notation: only the mantissa counts.
check("4.520e-3 sig figs", analyse("4.520e-3", 3)!.count, 4);
check("100.0 sig figs", analyse("100.0", 3)!.count, 4);
check("round 3.14159 to 3 s.f.", analyse("3.14159", 3)!.rounded, "3.14");
check("round 0.00012345 to 2 s.f.", analyse("0.00012345", 2)!.rounded, "0.00012");
check("garbage rejected", analyse("abc", 3), null);

/* --------------------------------------------------------------- resistors */

// Yellow-violet-red-gold is the 4.7 kΩ ±5% resistor everyone recognises.
{
  const reading = decode(4, ["Yellow", "Violet", "Red", "Gold"]);
  check("yellow-violet-red-gold", reading!.resistance, 4700);
  check("gold tolerance", reading!.tolerance, 5);
  check("4.7k min", round(reading!.min, 6), 4465);
  check("4.7k max", round(reading!.max, 6), 4935);
}
// Brown-black-red = 1 kΩ.
check("brown-black-red", decode(3, ["Brown", "Black", "Red"])!.resistance, 1000);
// Five-band: brown-black-black-brown = 100 × 10 = 1 kΩ.
check(
  "5-band 1k",
  decode(5, ["Brown", "Black", "Black", "Brown", "Brown"])!.resistance,
  1000,
);
// Encoding must round-trip back to the same value.
{
  const bands = encode(4700, 4);
  check("encode 4700 → bands", bands?.slice(0, 3).join("-"), "Yellow-Violet-Red");
  check("encode/decode round-trip", decode(4, bands!)!.resistance, 4700);
}

check("formatEngineering 4700 Ω", formatEngineering(4700, "Ω"), "4.7 kΩ");
check("formatEngineering 0.0022 F", formatEngineering(0.0022, "F"), "2.2 mF");
check("formatEngineering 1500000 Hz", formatEngineering(1_500_000, "Hz"), "1.5 MHz");

// E24 rounds up to the next stocked value — never down, or the LED burns out.
check("E24 above 220", nearestE24(215), 220);
check("E24 above 4600", nearestE24(4600), 4700);
check("E24 exact 1000", nearestE24(1000), 1000);

console.log(
  failures === 0
    ? "\nAll science checks passed."
    : `\n${failures} science checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);
