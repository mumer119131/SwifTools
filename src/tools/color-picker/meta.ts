import { Pipette } from "lucide-react";

import type { Tool } from "@/config/tools";

export const colorPicker: Tool = {
  slug: "color-picker",
  name: "Color Picker",
  category: "color",
  description: "Pick colors and convert between HEX, RGB, HSL and OKLCH.",
  keywords: ["color picker", "hex to rgb", "rgb to hex", "hsl converter", "color converter"],
  icon: Pipette,
  processing: "client",
  status: "live",
  steps: [
    "Pick a colour, or paste one in any format — #1e293b, rgb(30 41 59), hsl(215 25% 17%).",
    "Every other format is shown at once, along with tints and shades and a contrast check.",
    "Copy the value you need in the syntax you need it.",
  ],
  notes: [
    "Colours are shown in every notation you are likely to need — HEX, RGB, HSL, HWB and OKLCH — and converting between them is exact rather than approximate, because they all describe the same sRGB colour in different coordinates.",
    "HSL is the one most people reach for and the one that misleads most. Its lightness value is not perceptual: hsl(60 100% 50%) is a blinding yellow and hsl(240 100% 50%) is a dark blue, despite both claiming 50 percent lightness. If you are building a palette where steps should look evenly spaced, that is the trap.",
    "OKLCH fixes it. Its lightness axis is perceptually uniform, so two colours with the same L genuinely look equally bright, and changing hue at fixed lightness and chroma keeps the apparent brightness constant. It is supported in every current browser and is the better basis for a design system.",
  ],
  faq: [
    {
      question: "What is the difference between HEX, RGB and HSL?",
      answer: "They are three notations for the same sRGB colour. HEX and RGB give red, green and blue channels directly; HSL restates them as hue, saturation and lightness, which is easier to reason about when adjusting a colour by hand.",
    },
    {
      question: "Why do two colours with the same HSL lightness look different?",
      answer: "Because HSL lightness is a mathematical midpoint, not a perceptual one. Yellow at 50 percent lightness is far brighter to the eye than blue at 50 percent. OKLCH exists precisely to fix this.",
    },
    {
      question: "Should I use OKLCH instead of HSL?",
      answer: "For building palettes, yes. Its lightness axis matches perception, so a scale of evenly spaced L values actually looks evenly spaced. Every current browser supports it, and it degrades gracefully with a fallback.",
    },
    {
      question: "How do I convert HEX to RGB?",
      answer: "Paste the hex value and the RGB form appears alongside it. Each pair of hex digits is one channel in base 16, so #ff8800 is 255, 136, 0 — the conversion is exact, not approximate.",
    },
    {
      question: "Can I pick a colour from an image?",
      answer: "Yes — drop an image in and sample from it. The picker reads the pixel value directly from a canvas in your browser, so the image is not uploaded.",
    },
  ],
};
