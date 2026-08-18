import { BoxSelect } from "lucide-react";

import type { Tool } from "@/config/tools";

export const reactNativeShadowGenerator: Tool = {
  slug: "react-native-shadow-generator",
  name: "React Native Shadow Generator",
  category: "developer",
  description: "Generate matching iOS and Android shadow styles for React Native, with a preview.",
  keywords: [
    "react native shadow generator",
    "react native box shadow",
    "android elevation",
    "ios shadowoffset",
    "rn shadow style",
  ],
  icon: BoxSelect,
  processing: "client",
  status: "live",
};
