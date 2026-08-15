import { Scaling } from "lucide-react";

import type { Tool } from "@/config/tools";

export const resizeImage: Tool = {
  slug: "resize-image",
  name: "Resize Image",
  category: "image",
  description: "Change an image's dimensions by pixels or percentage, with the ratio locked.",
  keywords: [
    "resize image",
    "image resizer online free",
    "change image dimensions",
    "scale image",
    "resize photo without losing quality",
  ],
  icon: Scaling,
  processing: "client",
  status: "live",
  steps: [
    "Drop in the image you want to resize.",
    "Enter a new width or height in pixels, or scale by percentage. The aspect ratio stays locked unless you unlock it.",
    "Resize and download — the original file is never modified.",
  ],
  notes: [
    "Resizing changes the pixel dimensions. Making an image smaller is safe and is usually the single biggest saving available — a 4000-pixel photo displayed in a 800-pixel column is carrying twenty-five times more data than the screen can use. Making an image larger cannot add detail that was never captured; it interpolates between existing pixels and the result is softer than the original.",
    "Keeping the aspect ratio locked is almost always right. Unlocking it stretches the picture, and the human eye is very good at spotting a face that is three percent too wide even when it cannot say why. If you need a specific shape, crop to it rather than stretching.",
    "For screens, remember device pixel ratio: a retina display draws two physical pixels for every CSS pixel, so an image meant to appear 600 pixels wide on such a screen should be exported at 1200. For print, work back from the physical size — 300 DPI at 6 inches wide is 1800 pixels.",
  ],
  faq: [
    {
      question: "What size should I resize an image to for a website?",
      answer: "Match the largest size it will be displayed at, then double it for high-density screens. An image shown in an 800-pixel column should be exported at around 1600 pixels wide. Anything beyond that is bytes the visitor downloads and never sees.",
    },
    {
      question: "Does resizing reduce quality?",
      answer: "Making an image smaller does not — it discards pixels you were not using. Making it larger does, because the extra pixels are invented by interpolating between real ones, which softens edges and cannot recover detail that was never there.",
    },
    {
      question: "Should I keep the aspect ratio locked?",
      answer: "Yes, unless you have a specific reason not to. Unlocking it stretches the picture, which is immediately noticeable on faces and text even at small distortions. Crop instead if you need a particular shape.",
    },
    {
      question: "What dimensions do I need for printing?",
      answer: "Multiply the printed size in inches by 300. A 6 by 4 inch print needs about 1800 by 1200 pixels. Below roughly 200 DPI the result starts looking soft on paper, even though it looked fine on screen.",
    },
    {
      question: "Are my images uploaded to resize them?",
      answer: "No. The resize happens on a canvas in your own browser and the result is downloaded straight from memory, so the image never leaves your device.",
    },
  ],
};
