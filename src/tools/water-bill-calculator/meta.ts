import { Droplets } from "lucide-react";

import type { Tool } from "@/config/tools";

export const waterBillCalculator: Tool = {
  slug: "water-bill-calculator",
  name: "Water Bill Calculator",
  category: "home",
  description: "Estimate a household water bill from showers, laundry, dishes and a dripping tap.",
  keywords: [
    "water bill calculator",
    "water usage calculator",
    "household water consumption",
    "how much water does a shower use",
    "dripping tap water waste",
  ],
  icon: Droplets,
  processing: "client",
  status: "live",
  steps: [
    "Set how many people live there and how often each fixture is used.",
    "Enter your rate per 1,000 gallons — it is on the bill.",
    "You get daily and monthly usage, the bill, and where the water goes.",
  ],
};
