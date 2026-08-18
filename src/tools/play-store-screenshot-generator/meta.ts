import { Smartphone } from "lucide-react";

import type { Tool } from "@/config/tools";

export const playStoreScreenshotGenerator: Tool = {
  slug: "play-store-screenshot-generator",
  name: "Play Store Screenshot Generator",
  category: "image",
  description: "Turn app screenshots into a full set of Play Store listing images with captions and device frames.",
  keywords: [
    "play store screenshot generator",
    "google play screenshot maker",
    "app store screenshot generator",
    "play store listing images",
    "app screenshot mockup generator",
    "play store feature graphic maker",
    "android app screenshot design",
    "device frame generator",
  ],
  icon: Smartphone,
  processing: "client",
  status: "live",
  popular: true,
};
