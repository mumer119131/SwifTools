import { ArrowRightLeft } from "lucide-react";

import type { Tool } from "@/config/tools";
import { getCategory, unitPairs, type UnitPair } from "@/lib/units";

/**
 * Registry entries for the direct conversion pages.
 *
 * One page per popular conversion, both directions — "kg to lbs" and "lbs to
 * kg" are different queries and deserve different pages. They are marked
 * `searchOnly` so all ~64 stay out of the category grid, footer and mega menu
 * while remaining indexed, linked from their parent converter, and findable the
 * moment someone types what they actually want.
 */
function toTool(pair: UnitPair): Tool {
  const categoryLabel =
    pair.categoryId === "temperature"
      ? "Temperature"
      : (getCategory(pair.categoryId)?.label ?? "Unit");

  return {
    slug: pair.slug,
    name: `${pair.fromSymbol} to ${pair.toSymbol}`,
    category: "units",
    description: `Convert ${pair.title.toLowerCase()} instantly, with the formula and a table of common values.`,
    keywords: [
      ...pair.keywords,
      pair.title.toLowerCase(),
      `${categoryLabel.toLowerCase()} converter`,
    ],
    icon: ArrowRightLeft,
    processing: "client",
    status: "live",
    searchOnly: true,
    steps: [
      `Type a value in ${pair.fromLabel.toLowerCase()} — the result appears as you type.`,
      "The formula is shown, so you can check the arithmetic rather than trusting it.",
      `Use the table for common values, or open the full ${categoryLabel} Converter for other units.`,
    ],
  };
}

export const unitPairTools: readonly Tool[] = unitPairs.map(toTool);
