import { SQFT_PER_SQM, type LengthUnit } from "@/lib/home";

export interface Section {
  id: string;
  label: string;
  length: string;
  width: string;
}

export interface AreaTotals {
  squareFeet: number;
  squareMetres: number;
  squareYards: number;
  perSection: { id: string; label: string; squareFeet: number }[];
}

/**
 * Sums a set of rectangles.
 *
 * Real rooms are rarely one rectangle — an L-shape is two, a bay window adds a
 * third. Splitting the floor into rectangles and adding them is how a builder
 * measures it, and it needs no geometry beyond multiplication.
 */
export function totalArea(sections: Section[], unit: LengthUnit): AreaTotals {
  const perSection = sections.map((section) => {
    const length = Number(section.length);
    const width = Number(section.width);
    const raw = length > 0 && width > 0 ? length * width : 0;
    return {
      id: section.id,
      label: section.label,
      squareFeet: unit === "ft" ? raw : raw * SQFT_PER_SQM,
    };
  });

  const squareFeet = perSection.reduce((sum, section) => sum + section.squareFeet, 0);

  return {
    squareFeet,
    squareMetres: squareFeet / SQFT_PER_SQM,
    // 9 square feet to the square yard — carpet is still sold this way.
    squareYards: squareFeet / 9,
    perSection,
  };
}
