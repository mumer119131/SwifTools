import { UserRoundPlus } from "lucide-react";

import type { Tool } from "@/config/tools";

export const randomNameGenerator: Tool = {
  slug: "random-name-generator",
  name: "Random Name Generator",
  category: "fun",
  description: "Invent names for characters, test data and accounts — first, last or both.",
  keywords: [
    "random name generator",
    "fake name generator",
    "character name generator",
    "random first and last name",
    "name ideas generator",
  ],
  icon: UserRoundPlus,
  processing: "client",
  status: "live",
};
