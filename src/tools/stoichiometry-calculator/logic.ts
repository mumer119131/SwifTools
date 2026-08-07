import { parseFormula } from "@/tools/molecular-weight-calculator/logic";

export interface Species {
  coefficient: number;
  formula: string;
  molarMass: number;
}

export interface Equation {
  reactants: Species[];
  products: Species[];
}

export type EquationResult =
  | { ok: true; equation: Equation; balanced: boolean; imbalance: string[] }
  | { ok: false; error: string };

/**
 * Parses "2H2 + O2 -> 2H2O" into species with coefficients and molar masses.
 *
 * The arrow is written a dozen ways in practice — ->, =>, →, = — so all of them
 * are accepted rather than insisting on one.
 */
export function parseEquation(input: string): EquationResult {
  const normalised = input.replace(/[⟶→⇒]/g, "->").replace(/=>/g, "->").replace(/(?<![-=<>])=(?![>])/g, "->");
  const sides = normalised.split("->");

  if (sides.length !== 2) {
    return { ok: false, error: "Write the equation with one arrow, like 2H2 + O2 -> 2H2O." };
  }

  const reactants = parseSide(sides[0]);
  if (!reactants.ok) return reactants;

  const products = parseSide(sides[1]);
  if (!products.ok) return products;

  if (reactants.species.length === 0 || products.species.length === 0) {
    return { ok: false, error: "Both sides need at least one species." };
  }

  const imbalance = findImbalance(reactants.species, products.species);

  return {
    ok: true,
    equation: { reactants: reactants.species, products: products.species },
    balanced: imbalance.length === 0,
    imbalance,
  };
}

type SideResult = { ok: true; species: Species[] } | { ok: false; error: string };

function parseSide(side: string): SideResult {
  const species: Species[] = [];

  for (const raw of side.split("+")) {
    const term = raw.trim();
    if (!term) continue;

    // A leading integer is the stoichiometric coefficient; anything else is
    // part of the formula (a leading 5 in 5H2O means five waters, but that only
    // appears after a hydrate dot, which parseFormula handles).
    const match = term.match(/^(\d+)\s*(.+)$/);
    const coefficient = match ? Number(match[1]) : 1;
    const formula = match ? match[2].trim() : term;

    const parsed = parseFormula(formula);
    if (!parsed.ok) return { ok: false, error: `${formula}: ${parsed.error}` };

    species.push({ coefficient, formula, molarMass: parsed.molarMass });
  }

  return { ok: true, species };
}

/** Element symbols whose atom counts differ across the arrow. */
function findImbalance(reactants: Species[], products: Species[]): string[] {
  const tally = (species: Species[]) => {
    const counts = new Map<string, number>();
    for (const entry of species) {
      const parsed = parseFormula(entry.formula);
      if (!parsed.ok) continue;
      for (const element of parsed.elements) {
        counts.set(
          element.symbol,
          (counts.get(element.symbol) ?? 0) + element.count * entry.coefficient,
        );
      }
    }
    return counts;
  };

  const left = tally(reactants);
  const right = tally(products);
  const symbols = new Set([...left.keys(), ...right.keys()]);

  return [...symbols].filter(
    (symbol) => Math.abs((left.get(symbol) ?? 0) - (right.get(symbol) ?? 0)) > 1e-9,
  );
}

export interface ReactantRow {
  species: Species;
  moles: number;
  grams: number;
  /** Moles of reaction this reactant alone could support. */
  extent: number;
  limiting: boolean;
  consumedMoles: number;
  consumedGrams: number;
  leftoverMoles: number;
  leftoverGrams: number;
}

export interface ProductRow {
  species: Species;
  moles: number;
  grams: number;
}

export interface Yield {
  reactants: ReactantRow[];
  products: ProductRow[];
  limiting: Species | null;
  /** Moles of reaction as written, set by the limiting reagent. */
  extent: number;
}

/**
 * Works out how far the reaction can run given the amounts supplied.
 *
 * The limiting reagent is the one with the smallest moles-over-coefficient
 * ratio — not the smallest mass, and not the smallest mole count, which is the
 * mistake this tool exists to prevent.
 */
export function computeYield(
  equation: Equation,
  amounts: number[],
  unit: "g" | "mol",
): Yield {
  const supplied = equation.reactants.map((species, index) => {
    const raw = amounts[index];
    const value = Number.isFinite(raw) && raw > 0 ? raw : 0;
    const moles = unit === "mol" ? value : value / species.molarMass;
    return { species, moles, grams: unit === "mol" ? value * species.molarMass : value };
  });

  const extents = supplied.map((entry) => entry.moles / entry.species.coefficient);
  const extent = extents.length > 0 ? Math.min(...extents) : 0;
  const limitingIndex = extents.indexOf(extent);

  const reactants: ReactantRow[] = supplied.map((entry, index) => {
    const consumedMoles = extent * entry.species.coefficient;
    const leftoverMoles = Math.max(0, entry.moles - consumedMoles);
    return {
      ...entry,
      extent: extents[index],
      limiting: index === limitingIndex && extent > 0,
      consumedMoles,
      consumedGrams: consumedMoles * entry.species.molarMass,
      leftoverMoles,
      leftoverGrams: leftoverMoles * entry.species.molarMass,
    };
  });

  const products: ProductRow[] = equation.products.map((species) => {
    const moles = extent * species.coefficient;
    return { species, moles, grams: moles * species.molarMass };
  });

  return {
    reactants,
    products,
    limiting: extent > 0 && limitingIndex >= 0 ? equation.reactants[limitingIndex] : null,
    extent,
  };
}

export const EXAMPLES = [
  "2H2 + O2 -> 2H2O",
  "CH4 + 2O2 -> CO2 + 2H2O",
  "N2 + 3H2 -> 2NH3",
  "2Al + 3Cl2 -> 2AlCl3",
  "C6H12O6 + 6O2 -> 6CO2 + 6H2O",
];
