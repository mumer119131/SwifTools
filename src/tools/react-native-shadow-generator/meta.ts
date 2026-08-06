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
  steps: [
    "Drag the sliders, or start from a preset, and watch the preview update.",
    "Android's elevation and iOS's four shadow props are kept in sync — change either and the other follows.",
    "Copy the StyleSheet, choosing the legacy cross-platform props or the newer boxShadow.",
  ],
};
