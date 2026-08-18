import type { ToolContent } from "@/config/tool-content";

import { getCategory, unitPairs, type UnitPair } from "@/lib/units";

/**
 * Steps for the ~98 generated unit pair pages.
 *
 * Generated alongside the tools themselves rather than written out, for the
 * same reason the tools are: 98 near-identical hand-written copies would
 * drift apart within a month.
 */
function toContent(pair: UnitPair): ToolContent {
  const categoryLabel =
    pair.categoryId === "temperature"
      ? "Temperature"
      : (getCategory(pair.categoryId)?.label ?? "Unit");
  return {
    steps: [
    `Type a value in ${pair.fromLabel.toLowerCase()} — the result appears as you type.`,
    "The formula is shown, so you can check the arithmetic rather than trusting it.",
    `Use the table for common values, or open the full ${categoryLabel} Converter for other units.`,
    ],
  };
}

export const unitPairContent: Record<string, ToolContent> = Object.fromEntries(
  unitPairs.map((pair) => [pair.slug, toContent(pair)]),
);
