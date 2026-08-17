import { Blend } from "lucide-react";

import type { Tool } from "@/config/tools";

export const cssGradientGenerator: Tool = {
  slug: "css-gradient-generator",
  name: "CSS Gradient Generator",
  category: "developer",
  description: "Build linear, radial and conic CSS gradients visually and copy the code.",
  keywords: [
    "css gradient generator",
    "linear gradient generator",
    "radial gradient css",
    "conic gradient generator",
    "background gradient css",
    "gradient maker",
  ],
  icon: Blend,
  processing: "client",
  status: "live",
  popular: true,
  steps: [
    "Pick a gradient type and drag the colour stops where you want them.",
    "Add as many stops as you need, and set the angle or centre point.",
    "Copy the CSS, or the Tailwind arbitrary-value class.",
  ],
  notes: [
    "Three gradient types cover almost everything. A linear gradient runs along a line at the angle you set, where 0deg points up and 90deg points right — the opposite of the CSS transform convention, which trips people up constantly. A radial gradient spreads outward from a point and is the right choice for a spotlight or a soft vignette. A conic gradient sweeps around a centre, which is what makes colour wheels, pie charts and the fake border-gradient trick possible.",
    "Stops are sorted by position before the CSS is written. That is not cosmetic: CSS silently clamps an out-of-order stop to the previous one's position, so a stop at 30% listed after one at 60% produces a hard band where a fade was intended. It looks like a browser bug and it is a typo, and sorting removes the possibility.",
    "Two stops at the same position give a hard edge rather than a blend, which is the standard way to build stripes and progress bars without an image. Turning on repeating makes the whole stop sequence tile along the gradient line, which is how barber-pole and hazard patterns are made in pure CSS.",
  ],
  faq: [
    {
      question: "How do CSS gradient angles work?",
      answer: "0deg points to the top and angles increase clockwise, so 90deg points right and 180deg points down. This is the opposite direction from CSS transforms, which is why a gradient often ends up rotated the wrong way on the first attempt.",
    },
    {
      question: "What is the difference between linear, radial and conic gradients?",
      answer: "Linear runs along a straight line at a given angle. Radial spreads outward from a centre point, which suits spotlights and vignettes. Conic sweeps around a centre like a clock hand, which is what makes colour wheels and pure-CSS pie charts possible.",
    },
    {
      question: "How do I make a gradient with a hard edge instead of a fade?",
      answer: "Put two stops at the same position. A red stop at 50% followed by a blue stop at 50% gives a crisp line rather than a blend, which is how stripes, progress bars and two-tone backgrounds are built without an image.",
    },
    {
      question: "Why does my gradient have a grey band in the middle?",
      answer: "Interpolating between two saturated complementary colours passes through grey in sRGB. Adding a mid stop in a related hue avoids it, or use an OKLCH gradient in browsers that support it, where the interpolation stays saturated.",
    },
    {
      question: "How do I use a gradient as text colour?",
      answer: "Apply it as a background, then add background-clip: text and colour: transparent. Include the -webkit-background-clip prefix, which is still required in Safari, and keep a solid colour fallback for anything that has to remain readable.",
    },
  ],
};
