import { CircleDollarSign } from "lucide-react";

import type { Tool } from "@/config/tools";

export const coinFlipper: Tool = {
  slug: "coin-flipper",
  name: "Coin Flipper",
  category: "fun",
  description: "Flip a fair coin, one at a time or a thousand at once, and watch the tally.",
  keywords: ["coin flip","flip a coin","heads or tails","coin toss","random coin flipper","virtual coin"],
  icon: CircleDollarSign,
  processing: "client",
  status: "live",
};
