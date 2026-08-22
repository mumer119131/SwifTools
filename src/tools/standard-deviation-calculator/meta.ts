import { Sigma } from "lucide-react";

import type { Tool } from "@/config/tools";

export const standardDeviationCalculator: Tool = {
  slug: "standard-deviation-calculator",
  name: "Standard Deviation Calculator",
  category: "science",
  description: "Mean, median, variance, quartiles and outliers — sample or population.",
  keywords: [
    "standard deviation calculator",
    "variance calculator",
    "sample vs population standard deviation",
    "mean median mode calculator",
    "interquartile range calculator",
  ],
  icon: Sigma,
  processing: "client",
  status: "live",
};
