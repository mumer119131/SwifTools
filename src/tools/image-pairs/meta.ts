import { ArrowRightLeft } from "lucide-react";

import type { Tool } from "@/config/tools";
import { formatPairs, type FormatPair } from "@/lib/image-formats";

/**
 * Registry entries for the direct image conversion pages.
 *
 * `searchOnly`, like the unit pairs: all sixteen deserve to rank for their own
 * query, and listing them in the Image category grid would bury the six real
 * image tools behind a wall of near-identical cards.
 */
function toTool(pair: FormatPair): Tool {
  return {
    slug: pair.slug,
    name: pair.title,
    category: "image",
    description: `Convert ${pair.from.label} to ${pair.to.label} in your browser. Free, no upload, no signup.`,
    keywords: [...new Set([...pair.keywords, `${pair.title.toLowerCase()} converter`])],
    icon: ArrowRightLeft,
    processing: "client",
    status: "live",
    searchOnly: true,
  };
}

export const imagePairTools: readonly Tool[] = formatPairs.map(toTool);
