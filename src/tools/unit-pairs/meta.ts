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
    // Deduped: pair.keywords already contains the plain "grams to ounces"
    // phrasing for the primary aliases, and the title is often exactly that.
    // A keyword listed twice is not worth twice as much, it just looks careless.
    keywords: [
      ...new Set([
        ...pair.keywords,
        pair.title.toLowerCase(),
        `${categoryLabel.toLowerCase()} converter`,
      ]),
    ],
    icon: ArrowRightLeft,
    processing: "client",
    status: "live",
    searchOnly: true,
  };
}

export const unitPairTools: readonly Tool[] = unitPairs.map(toTool);
