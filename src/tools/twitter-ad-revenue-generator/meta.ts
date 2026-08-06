import { BadgeDollarSign } from "lucide-react";

import type { Tool } from "@/config/tools";

export const twitterAdRevenueGenerator: Tool = {
  slug: "twitter-ad-revenue-generator",
  name: "Ad Revenue Payout Mockup",
  category: "social",
  description: "Design a creator-payout dashboard mockup for concepts, decks and satire.",
  keywords: [
    "twitter ad revenue generator",
    "x payout screenshot",
    "creator earnings mockup",
    "ad revenue dashboard mockup",
  ],
  icon: BadgeDollarSign,
  processing: "client",
  status: "live",
  steps: [
    "Set the handle, payout amount, period and the impression and engagement figures.",
    "The card renders as a payout summary, in light or dark.",
    "Export a PNG. It is a mockup — see the note on the page about passing one off as real.",
  ],
};
