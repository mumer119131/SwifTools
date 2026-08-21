import { PersonStanding } from "lucide-react";

import type { Tool } from "@/config/tools";

export const bodyFatCalculator: Tool = {
  slug: "body-fat-calculator",
  name: "Body Fat Calculator",
  category: "calculator",
  description: "Estimate body fat from tape measurements using the US Navy method.",
  keywords: [
    "body fat calculator",
    "body fat percentage",
    "navy body fat formula",
    "how to measure body fat",
    "lean body mass calculator",
  ],
  icon: PersonStanding,
  processing: "client",
  status: "live",
  popular: true,
};
