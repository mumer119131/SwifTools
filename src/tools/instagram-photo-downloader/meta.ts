import { Download } from "lucide-react";

import type { Tool } from "@/config/tools";

export const instagramPhotoDownloader: Tool = {
  slug: "instagram-photo-downloader",
  name: "Instagram Photo Downloader",
  category: "social",
  description: "Fetch the preview image a public Instagram post advertises to link crawlers.",
  keywords: [
    "instagram photo downloader",
    "download instagram image",
    "instagram picture saver",
    "save instagram photo",
  ],
  icon: Download,
  // Instagram blocks cross-origin reads, so the page metadata is fetched by our
  // own cached route.
  processing: "server",
  status: "live",
  steps: [
    "Paste the URL of a public Instagram post or reel.",
    "The page's advertised preview image is read — the same one Slack or WhatsApp shows in a link preview.",
    "Open or save it. Private posts return nothing, and Instagram rate-limits this heavily.",
  ],
};
