import { Palette } from "lucide-react";

import type { Tool } from "@/config/tools";

export const randomColorGenerator: Tool = {
  slug: "random-color-generator",
  name: "Random Color Generator",
  category: "fun",
  description: "Generate random colours with hex, RGB and HSL — filtered to ones worth using.",
  keywords: [
    "random color generator",
    "random hex color",
    "random colour picker",
    "random rgb generator",
    "pastel color generator",
  ],
  icon: Palette,
  processing: "client",
  status: "live",
  steps: [
    "Generate a colour, or a whole grid of them.",
    "Filter to pastels, vivid, dark or light so the results are usable.",
    "Click any swatch to copy its hex.",
  ],
  notes: [
    "Colours are generated in HSL rather than as three random bytes, which sounds like a detail and is the whole difference between useful output and sludge. Uniform RGB produces mostly muddy near-greys, because that is what the bulk of the RGB cube contains.",
    "Constraining hue, saturation and lightness separately is also what makes the style filters meaningful. Pastel is a range of high lightness and moderate saturation; vivid is high saturation at mid lightness. Neither needs rejection sampling.",
    "Each swatch shows whether black or white text reads better on it, calculated from WCAG relative luminance rather than from lightness — which is the correct measure and frequently disagrees with what the lightness value suggests.",
  ],
  faq: [
    {
      question: "How do I generate a random hex colour?",
      answer: "Press generate and take the hex code from any swatch. Colours are produced in HSL and converted, which avoids the muddy near-greys that dominate uniform RGB generation.",
    },
    {
      question: "Why not just pick three random RGB values?",
      answer: "Because most of the RGB cube is desaturated. Uniform random RGB produces mostly sludge — generating in HSL with constrained saturation and lightness gives colours someone would actually use.",
    },
    {
      question: "How do I get pastel colours?",
      answer: "Use the pastel filter, which constrains lightness to the 80 to 90 percent range with moderate saturation. That is what pastel means numerically, so no results have to be thrown away.",
    },
    {
      question: "How do I know whether to use black or white text on a colour?",
      answer: "Each swatch shows the better choice, calculated from WCAG relative luminance rather than lightness. The two disagree often — a yellow with 50 percent lightness needs black text, a blue with the same value needs white.",
    },
    {
      question: "Can I export the colours?",
      answer: "Yes — copy all the hex codes at once, or copy them as CSS custom properties ready to paste into a stylesheet.",
    },
  ],
};
