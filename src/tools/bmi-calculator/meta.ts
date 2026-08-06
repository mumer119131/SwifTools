import { Scale } from "lucide-react";

import type { Tool } from "@/config/tools";

export const bmiCalculator: Tool = {
  slug: "bmi-calculator",
  name: "BMI Calculator",
  category: "calculator",
  description: "Calculate body mass index in metric or imperial units, with the healthy range.",
  keywords: ["bmi calculator", "body mass index", "healthy weight calculator"],
  icon: Scale,
  processing: "client",
  status: "live",
  steps: [
    "Switch between metric and imperial, then enter your height and weight.",
    "Your BMI is shown against the WHO categories, with the healthy weight range for your height.",
    "Read the caveats — BMI is a population screening tool, not an individual diagnosis.",
  ],
};
