import { Monitor } from "lucide-react";

import type { Tool } from "@/config/tools";

export const screenResolutionChecker: Tool = {
  slug: "screen-resolution-checker",
  name: "Screen Resolution Checker",
  category: "generator",
  description: "Detect your screen size, viewport, pixel ratio, colour depth and browser features.",
  keywords: [
    "screen resolution checker",
    "what is my screen size",
    "viewport size",
    "device pixel ratio",
  ],
  icon: Monitor,
  processing: "client",
  status: "live",
};
