import { Palette } from "lucide-react";

import type { Tool } from "@/config/tools";

export const colorPaletteGenerator: Tool = {
  slug: "color-palette-generator",
  name: "Color Palette Generator",
  category: "color",
  description: "Build harmonious palettes from one seed colour, with a full tint and shade ramp.",
  keywords: [
    "color palette generator",
    "colour scheme generator",
    "complementary colors",
    "triadic color scheme",
    "tailwind color palette generator",
  ],
  icon: Palette,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Pick a seed colour, or paste one in any format.",
    "Choose a harmony — complementary, triadic, analogous and the rest are generated from colour-wheel relationships.",
    "Copy a single swatch, or export the whole palette as CSS variables, Tailwind tokens or JSON.",
  ],
  notes: [
    "Palettes are built from colour theory relationships rather than picked at random. Complementary takes the hue directly opposite for maximum contrast; analogous takes neighbours for a harmonious, low-tension set; triadic spaces three hues evenly for a balanced but lively palette; monochromatic varies lightness and saturation at one hue.",
    "A palette that looks good is not the same as a palette that works. Contrast is what decides whether text on a background can be read, and two colours can be beautifully harmonious and completely illegible together. Every pair here is checked against the WCAG contrast thresholds — 4.5:1 for body text, 3:1 for large text and interface components.",
    "The practical shape of a usable palette is one dominant colour, one accent, and a set of neutrals. Five equally vivid colours is a palette you will fight with, because nothing recedes and every element competes for the same attention.",
  ],
  faq: [
    {
      question: "How many colours should a palette have?",
      answer: "One dominant colour, one accent, and a range of neutrals is enough for most interfaces. Five equally saturated colours give you nothing to recede into the background, and every element ends up competing for attention.",
    },
    {
      question: "What is the difference between complementary and analogous colours?",
      answer: "Complementary colours sit opposite on the wheel and produce maximum contrast and tension. Analogous colours are neighbours and produce a calm, harmonious set. Complementary suits an accent against a base; analogous suits a whole scheme.",
    },
    {
      question: "What contrast ratio do I need for text?",
      answer: "4.5:1 for normal body text and 3:1 for large text and interface components, to meet WCAG AA. AAA asks for 7:1. A palette can be harmonious and still fail these, which is why they are checked separately from how it looks.",
    },
    {
      question: "Can I generate a palette from a brand colour?",
      answer: "Yes. Enter your hex value as the base and the harmonies are calculated from its hue, so every result is built around the colour you already have to work with.",
    },
    {
      question: "Why do my colours look different on another screen?",
      answer: "Displays vary in calibration and gamut, and a wide-gamut screen renders saturated colours differently from an sRGB one. Test on at least one ordinary display, and never rely on a subtle colour difference to convey information.",
    },
  ],
};
