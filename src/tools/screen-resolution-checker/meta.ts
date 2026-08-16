import { Monitor } from "lucide-react";

import type { Tool } from "@/config/tools";

export const screenResolutionChecker: Tool = {
  slug: "screen-resolution-checker",
  name: "Screen Resolution Checker",
  category: "generator",
  description: "Detect your screen size, viewport, pixel ratio, colour depth and browser features.",
  keywords: [
    "screen resolution checker",
    "what is my screen size",
    "viewport size",
    "device pixel ratio",
  ],
  icon: Monitor,
  processing: "client",
  status: "live",
  steps: [
    "Everything is read from your own browser the moment the page loads.",
    "Resize the window to watch the viewport, breakpoint and orientation update live.",
    "Nothing is sent anywhere — these values never leave your device.",
  ],
  notes: [
    "Shows what your browser reports about the display: screen resolution, the browser viewport, device pixel ratio, colour depth and orientation. The two numbers people confuse are screen resolution and viewport — the first is the whole display, the second is the area a web page actually gets.",
    "Device pixel ratio is the one that explains blurry images. A ratio of 2 means the browser draws two physical pixels for every CSS pixel, so an image intended to appear 400 CSS pixels wide needs to be 800 actual pixels to look sharp. Exporting at the CSS size is why photographs look soft on modern phones and laptops.",
    "Everything here is read from the browser rather than from your operating system, which is why a scaled display can report a resolution lower than the panel's native one. That is not an error — it is the resolution the browser is working in, which is the number that matters for CSS.",
  ],
  faq: [
    {
      question: "What is the difference between screen resolution and viewport size?",
      answer: "Screen resolution is the whole display; the viewport is the area available to the page, after browser chrome, scrollbars and any zoom. CSS media queries respond to the viewport, which is why it is the more useful number for web work.",
    },
    {
      question: "What is device pixel ratio?",
      answer: "How many physical pixels the browser draws per CSS pixel. A ratio of 2 means a 400-pixel-wide image slot needs an 800-pixel image to look sharp — exporting at the CSS size is the usual cause of soft images on modern screens.",
    },
    {
      question: "Why does my resolution look lower than my monitor's specification?",
      answer: "Because the display is scaled. A 4K screen at 200 percent scaling reports 1920 by 1080 to the browser, which is the resolution CSS is working in even though the panel has four times the pixels.",
    },
    {
      question: "What screen size should I design for?",
      answer: "Design for ranges rather than devices. The common breakpoints — around 375, 768, 1024 and 1440 — cover phones, tablets, laptops and desktops, and content should reflow between them rather than snapping between fixed layouts.",
    },
    {
      question: "Is any of this information sent anywhere?",
      answer: "No. The values are read from your browser and displayed. They are the same values any website can read, which is worth knowing — screen dimensions are a component of browser fingerprinting.",
    },
  ],
};
