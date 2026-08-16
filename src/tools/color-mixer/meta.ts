import { Blend } from "lucide-react";

import type { Tool } from "@/config/tools";

export const colorMixer: Tool = {
  slug: "color-mixer",
  name: "Color Mixer",
  category: "color",
  description: "Blend two colours and see every step between them, in sRGB or OKLab.",
  keywords: [
    "color mixer",
    "blend two colors",
    "color gradient generator",
    "mix hex colors",
    "color interpolation",
  ],
  icon: Blend,
  processing: "client",
  status: "live",
  steps: [
    "Pick two colours to blend between.",
    "Drag the slider for a single mix, or read the full ramp of steps below it.",
    "Switch the blend space — OKLab avoids the muddy grey that sRGB produces between opposite hues.",
  ],
  notes: [
    "Mixing two colours is not one operation but several, and they give visibly different answers. Mixing in sRGB — averaging the red, green and blue channels — is what most software does and what produces the muddy grey when you blend blue and yellow, because the maths passes straight through the desaturated middle of the cube.",
    "Mixing in a perceptual space such as OKLAB follows the path the eye expects, keeping saturation through the transition. Blue to yellow passes through green rather than grey, which is what someone mixing paint would predict and what a gradient should look like.",
    "This matters most for gradients. A two-stop gradient interpolated in sRGB often develops a dull band in the middle; the same gradient in OKLAB stays vivid throughout. CSS now supports specifying the interpolation space directly, so the fix is a one-line change rather than adding intermediate stops.",
  ],
  faq: [
    {
      question: "Why does mixing blue and yellow give grey instead of green?",
      answer: "Because averaging RGB channels passes through the desaturated centre of the colour cube. Mixing in a perceptual space such as OKLAB keeps saturation through the transition and gives the green you would expect from paint.",
    },
    {
      question: "Which colour space should I mix in?",
      answer: "OKLAB or OKLCH for anything a person will look at — they follow perception rather than channel maths. sRGB mixing is only right when you are reproducing what other software does, since most tools still average channels.",
    },
    {
      question: "Why does my CSS gradient have a dull band in the middle?",
      answer: "It is being interpolated in sRGB, which dips through a desaturated midpoint. Modern CSS lets you specify the space — 'in oklab' after the direction — which fixes it without adding extra colour stops.",
    },
    {
      question: "Can I mix more than two colours?",
      answer: "Mix two at a time and feed the result into the next mix. Averaging several at once collapses towards grey quickly, because every additional colour pulls the result further into the middle of the space.",
    },
    {
      question: "Does this simulate mixing real paint?",
      answer: "Not exactly. Paint mixes subtractively and its behaviour depends on pigment chemistry. Perceptual mixing gets closer to intuition than RGB averaging does, but no screen model reproduces pigment properly.",
    },
  ],
};
