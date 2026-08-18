import { Scale } from "lucide-react";

import type { Tool } from "@/config/tools";

export const bmiCalculator: Tool = {
  slug: "bmi-calculator",
  name: "BMI Calculator",
  category: "calculator",
  description: "Calculate body mass index in metric or imperial units, with the healthy range.",
  keywords: ["bmi calculator", "body mass index", "healthy weight calculator",
    "am i a healthy weight",
    "body weight range"],
  icon: Scale,
  processing: "client",
  status: "live",
};
