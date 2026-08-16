import { Ruler } from "lucide-react";

import type { Tool } from "@/config/tools";

export const screenRuler: Tool = {
  slug: "screen-ruler",
  name: "Screen Ruler",
  category: "fun",
  description: "Measure anything on screen in pixels, and in real inches once calibrated.",
  keywords: [
    "screen ruler",
    "online ruler",
    "pixel ruler",
    "measure on screen",
    "virtual ruler",
    "ruler in inches online",
  ],
  icon: Ruler,
  processing: "client",
  status: "live",
  steps: [
    "Drag on the canvas to measure — width, height and diagonal are shown.",
    "Calibrate against a bank card to get real-world inches and centimetres.",
    "Your calibration is remembered for next time.",
  ],
  notes: [
    "Pixel measurements are always exact. Inches and centimetres are not, until you calibrate — a browser has no way to know your display's physical size, so it assumes 96 pixels per inch, a figure fixed in the CSS specification and true of almost no modern screen.",
    "A bank card fixes that in one drag, because ISO/IEC 7810 makes every ID-1 card exactly 85.60 by 53.98 millimetres, everywhere in the world. It is the one object almost everyone has that can calibrate a display.",
    "Your calibration is saved in this browser, so it only has to be done once per device.",
  ],
  faq: [
    {
      question: "How accurate is an on-screen ruler?",
      answer: "Pixel measurements are exact. Physical units are only accurate after calibration, because a browser cannot know your display's real size and assumes 96 pixels per inch by default.",
    },
    {
      question: "How do I calibrate a screen ruler?",
      answer: "Hold a bank card against the screen and resize the rectangle to match it. Every ISO ID-1 card is exactly 85.60 mm wide, anywhere in the world, which makes it a reliable reference.",
    },
    {
      question: "Why does the browser assume 96 pixels per inch?",
      answer: "It is a value fixed in the CSS specification as a reference, dating from typical monitors of the 1990s. It is true of almost no modern display, which is why physical measurements need calibrating.",
    },
    {
      question: "Is the calibration saved?",
      answer: "Yes, in this browser, so it only needs doing once per device. It does not transfer to another machine, since every screen is different.",
    },
    {
      question: "Can I measure something on a printed page?",
      answer: "Not reliably. This measures what is on the screen. Holding paper against a monitor introduces parallax and depends on the screen being flat, so a physical ruler is better for physical objects.",
    },
  ],
};
