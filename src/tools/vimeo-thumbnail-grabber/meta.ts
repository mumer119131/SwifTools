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
  notes: [
    "Vimeo does not publish thumbnails at predictable URLs the way YouTube does, so this asks Vimeo's oEmbed endpoint for the video's metadata and reads the thumbnail address from the response. That request goes through a small server-side proxy, because the endpoint does not allow direct browser requests from another origin.",
    "The proxy passes only the video ID and returns only the thumbnail URL and title. Nothing about the request is stored, and the video itself is never fetched.",
    "Because the image comes from the video's own metadata, it is always the current thumbnail — if the owner changes it, the next lookup returns the new one. A video that has been deleted or made private returns nothing, which is the correct behaviour rather than an error to work around.",
  ],
  faq: [
    {
      question: "How do I get a Vimeo video's thumbnail?",
      answer: "Paste the video URL or ID. Unlike YouTube, Vimeo does not expose thumbnails at guessable addresses, so the tool asks Vimeo's oEmbed endpoint for the video's metadata and reads the image URL from the response.",
    },
    {
      question: "Why does this need a server when other tools don't?",
      answer: "Vimeo's oEmbed endpoint does not permit cross-origin requests from a browser, so the lookup has to be relayed. Only the video ID goes out and only the thumbnail URL and title come back.",
    },
    {
      question: "Why does my video return nothing?",
      answer: "It is private, deleted, or restricted to specific domains. Vimeo's oEmbed endpoint only describes videos that are publicly embeddable, so a private one correctly returns nothing at all.",
    },
    {
      question: "What resolution is the thumbnail?",
      answer: "Whatever Vimeo generated for that video, which depends on the source resolution. The URL returned points at the largest available version rather than a fixed size.",
    },
    {
      question: "Is my lookup logged?",
      answer: "No. The proxy forwards the request and returns the response without storing anything about it — there is no record of which videos have been looked up.",
    },
  ],
};
