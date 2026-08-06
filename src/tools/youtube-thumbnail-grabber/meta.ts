import { MonitorPlay } from "lucide-react";

import type { Tool } from "@/config/tools";

export const youtubeThumbnailGrabber: Tool = {
  slug: "youtube-thumbnail-grabber",
  name: "YouTube Thumbnail Grabber",
  category: "social",
  description: "Get every thumbnail size for any YouTube video, straight from Google's CDN.",
  keywords: [
    "youtube thumbnail downloader",
    "youtube thumbnail grabber",
    "download youtube thumbnail hd",
    "youtube thumbnail 1080p",
  ],
  icon: MonitorPlay,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Paste any YouTube URL — watch, share, embed, Shorts or a bare video ID.",
    "Every available size appears, from 120px up to maxres where the uploader provided one.",
    "Open or download the one you need. Images come from Google's public thumbnail CDN.",
  ],
};
