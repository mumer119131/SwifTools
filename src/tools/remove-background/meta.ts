import { Eraser } from "lucide-react";

import type { Tool } from "@/config/tools";

export const removeBackground: Tool = {
  slug: "remove-background",
  name: "Remove Background",
  category: "image",
  description: "Cut a solid or near-solid background out of an image and export a transparent PNG.",
  keywords: [
    "remove background from image",
    "transparent background maker",
    "delete white background",
    "png transparent background free",
    "remove background online",
  ],
  icon: Eraser,
  processing: "client",
  status: "live",
  steps: [
    "Drop in an image with a plain background — a product shot, logo, scan or screenshot.",
    "The background colour is detected from the edges. Click the image to pick a different one, and adjust tolerance until the edges look clean.",
    "Download a transparent PNG. Everything runs in a background thread, so the page stays responsive.",
  ],
  notes: [
    "Background removal runs a segmentation model directly in your browser. The model looks at the whole image and estimates, for every pixel, whether it belongs to the foreground subject — then writes that estimate into the alpha channel so the background becomes transparent. There is no server involved and no upload.",
    "The work is done in a Web Worker so the page stays responsive while it runs. The first use downloads the model, which takes a moment; after that it is cached by the browser and subsequent images are much faster.",
    "It performs best on a clear subject against a distinguishable background — a person, a product, an animal. It struggles with fine detail like loose hair, with subjects the same colour as what is behind them, and with reflections and glass, where the honest answer to 'is this pixel foreground' is genuinely ambiguous. Expect to touch up hair edges by hand for anything going into print.",
  ],
  faq: [
    {
      question: "How does background removal work without uploading my photo?",
      answer: "A segmentation model runs directly in your browser, in a Web Worker, and classifies each pixel as foreground or background. The model is downloaded once and cached; the image itself never leaves your device.",
    },
    {
      question: "Why are the edges around hair rough?",
      answer: "Fine strands are genuinely ambiguous — a single pixel may be part hair and part background, and a hard foreground-or-background decision cannot represent that. Portrait cutouts for print usually need manual refinement around hair regardless of the tool used.",
    },
    {
      question: "What kind of images work best?",
      answer: "A single clear subject against a background that differs in colour or focus. Product shots and portraits work very well. Busy scenes, subjects matching the background colour, glass and reflections are much harder.",
    },
    {
      question: "What format is the result saved in?",
      answer: "PNG, because it is the format that supports transparency. Saving as JPG would fill the transparent area with a solid colour, which defeats the purpose.",
    },
    {
      question: "Why is it slow the first time?",
      answer: "The model has to be downloaded before it can run. That happens once and is then cached by your browser, so every image after the first is considerably quicker.",
    },
  ],
};
