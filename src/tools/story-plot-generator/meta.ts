import { BookOpen } from "lucide-react";

import type { Tool } from "@/config/tools";

export const storyPlotGenerator: Tool = {
  slug: "story-plot-generator",
  name: "Story Plot Generator",
  category: "fun",
  description: "A protagonist, a want, an obstacle and a twist — a story premise you could actually write.",
  keywords: ["story plot generator","story idea generator","writing prompt generator","plot ideas","story premise generator"],
  icon: BookOpen,
  processing: "client",
  status: "live",
};
