import { PaintRoller } from "lucide-react";

import type { Tool } from "@/config/tools";

export const paintCalculator: Tool = {
  slug: "paint-calculator",
  name: "Paint Calculator",
  category: "home",
  description: "How many gallons or litres to buy for a room, doors and windows deducted.",
  keywords: [
    "paint calculator",
    "how much paint do i need",
    "paint coverage calculator",
    "gallons of paint for a room",
    "wall paint estimator",
  ],
  icon: PaintRoller,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Enter the room's dimensions and how many coats you want.",
    "Say how many doors and windows there are so their area comes off.",
    "You get gallons, litres and a cost estimate at your price per gallon.",
  ],
};
