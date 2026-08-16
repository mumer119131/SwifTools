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
  steps: [
    "Drop in your app screenshots — as many as you want, in one go.",
    "Write a caption for each, then pick a style, background detail and layout.",
    "Download the whole set as a ZIP, sized and formatted for the Play Console.",
  ],
  notes: [
    "Every image is composed on a canvas in your browser at the exact pixel size Google Play expects, and the whole set downloads as a ZIP. Screenshots are never uploaded, which matters when they are of an unreleased app.",
    "Two Play Console rules cause most rejections and both are handled here. Screenshots and feature graphics may not contain an alpha channel, so the background is filled opaquely before anything is drawn — a canvas starts transparent, and a PNG exported without that step is refused. The other is the aspect ratio limit: the longer side may not exceed twice the shorter one, so a 9:21 screenshot straight from a modern phone is rejected as-is. Both are checked against your chosen size before you export.",
    "Ten background treatments sit on top of the base gradient — a soft colour mesh, organic blobs, dot grids, contour lines, rings, rays, stripes, waves and bubbles — with a strength control and an optional film grain. The scattered ones are driven by a seeded generator keyed to each slide rather than by Math.random, so the background stays put while you type a caption, the preview matches the export exactly, and a set of eight screenshots gets eight different arrangements rather than the same image repeated.",
    "The device frame takes each screenshot's own aspect ratio rather than forcing a fixed shape. Phones now ship anything from 16:9 to 20:9, and squeezing a tall screenshot into a fixed frame crops the top and bottom — exactly where the app's header and navigation live.",
    "Captions wrap by measuring against the font actually in use rather than counting characters, so a long headline reflows instead of running off the edge. Text is the part of a listing image that does the selling: the store shows your first two screenshots in search results, and a reader decides from those before ever opening the page.",
  ],
  faq: [
    {
      question: "What size should Play Store screenshots be?",
      answer: "1080 by 1920 is the standard phone portrait size and works everywhere. Play accepts anything from 320 to 3840 pixels per side, as long as the longer side is no more than twice the shorter one. The feature graphic is a separate, fixed 1024 by 500.",
    },
    {
      question: "How many screenshots does Google Play require?",
      answer: "At least two phone screenshots to publish, and up to eight per device type. Tablet screenshots are optional but a listing without them shows stretched phone images on tablets, and having them is a condition of tablet recommendations.",
    },
    {
      question: "Why does the Play Console reject my screenshots?",
      answer: "Most often an alpha channel — Play refuses screenshots and feature graphics containing transparency, and a PNG exported from a canvas has one unless the background was filled first. The other common cause is the aspect ratio: a tall 9:21 phone screenshot exceeds the two-to-one limit and is rejected unmodified.",
    },
    {
      question: "Do I need a feature graphic?",
      answer: "Yes, every listing requires one at 1024 by 500. It appears at the top of your store page and in some promotional placements. Keep text well inside the edges — it is cropped differently across surfaces, and anything near the border can be cut.",
    },
    {
      question: "What background should I use for store screenshots?",
      answer: "Something quiet. The screenshot is the subject, and a busy background competes with it — a soft colour mesh or a fine dot grid at low strength adds depth without pulling attention. Keep the same treatment across the whole set, since the store shows them in a row and a mismatched one reads as an error.",
    },
    {
      question: "Should my screenshots have captions?",
      answer: "Almost always. Search results show the first two screenshots, and most people decide from those without opening the listing. A screenshot alone asks the reader to work out what the app does; a three-word caption tells them.",
    },
    {
      question: "Are my app screenshots uploaded anywhere?",
      answer: "No. Everything is composed on a canvas in your own browser and the ZIP is assembled locally, so screenshots of an unreleased app never leave your device.",
    },
  ],
};
