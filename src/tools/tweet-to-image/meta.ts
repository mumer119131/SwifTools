import { Images } from "lucide-react";

import type { Tool } from "@/config/tools";

export const tweetToImage: Tool = {
  slug: "tweet-to-image",
  name: "Tweet to Image",
  category: "social",
  description: "Turn tweet text into a polished image on a gradient backdrop, ready to share.",
  keywords: [
    "tweet to image",
    "tweet screenshot generator",
    "twitter post to picture",
    "quote tweet image",
  ],
  icon: Images,
  processing: "client",
  status: "live",
  steps: [
    "Paste the post text and the author's name and handle.",
    "Pick a gradient backdrop and padding — the card sits on it like a screenshot.",
    "Export a square or 16:9 image for Instagram, LinkedIn or a slide.",
  ],
  notes: [
    "Turns a real post's text into a clean, shareable image. Screenshots of posts are usually poor — wrong aspect ratio, interface clutter, low resolution on a phone, and unreadable when a platform recompresses them. Rendering at a chosen size on a canvas avoids all of it.",
    "The image is drawn at a resolution you set rather than captured at your screen's, which is what makes it legible after a platform's own compression. Anything intended for a timeline should be exported at twice the size it will be displayed at.",
    "If you are quoting someone, keeping their name and handle visible is both fairer and more useful — an image with the attribution cropped out is the raw material for a misquote, and readers have learned to distrust it.",
  ],
  faq: [
    {
      question: "Why is this better than a screenshot?",
      answer: "A screenshot captures your screen's resolution and whatever interface clutter is around the post, then gets recompressed by the next platform. Rendering at a chosen size produces a clean image that stays legible after compression.",
    },
    {
      question: "What resolution should I export at?",
      answer: "Roughly twice the size it will be displayed. Timeline images are shown small and viewed on phones, and platforms compress them again on upload, so starting larger is what keeps text readable.",
    },
    {
      question: "Should I keep the name and handle visible?",
      answer: "Yes, when quoting someone else. An image with attribution cropped out is indistinguishable from a fabrication, and readers have learned to treat it that way.",
    },
    {
      question: "What image format is produced?",
      answer: "PNG, which keeps text edges sharp. JPEG puts compression halos around letterforms because it is designed for photographs rather than for type.",
    },
    {
      question: "Is the post fetched from the platform?",
      answer: "No. You paste the text and it is rendered locally, so nothing is requested from any social platform and nothing about what you are quoting is transmitted.",
    },
  ],
};
