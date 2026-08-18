import { Hash } from "lucide-react";

import type { Tool } from "@/config/tools";

export const randomNumberGenerator: Tool = {
  slug: "random-number-generator",
  name: "Random Number Generator",
  category: "fun",
  description: "Draw random numbers in any range, with or without repeats — a fair prize draw.",
  keywords: [
    "random number generator",
    "number picker",
    "rng",
    "random number between 1 and 100",
    "prize draw generator",
    "lottery number generator",
  ],
  icon: Hash,
  processing: "client",
  status: "live",
  popular: true,
};
