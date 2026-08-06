import { Video } from "lucide-react";

import type { Tool } from "@/config/tools";

export const vimeoThumbnailGrabber: Tool = {
  slug: "vimeo-thumbnail-grabber",
  name: "Vimeo Thumbnail Grabber",
  category: "social",
  description: "Grab the thumbnail for any public Vimeo video, via Vimeo's own oEmbed API.",
  keywords: [
    "vimeo thumbnail downloader",
    "vimeo thumbnail grabber",
    "download vimeo thumbnail",
    "vimeo preview image",
  ],
  icon: Video,
  // Vimeo's oEmbed endpoint has no CORS headers, so the request is proxied by
  // our own cached route rather than made from the browser.
  processing: "server",
  status: "live",
  steps: [
    "Paste a Vimeo URL, or just the numeric video ID.",
    "Vimeo's official oEmbed API returns the thumbnail along with the title and author.",
    "Open or download the image at the size Vimeo provides.",
  ],
};
