import type { ToolContent } from "@/config/tool-content";

export const instagramFiltersContent: ToolContent = {
  steps: [
    "Drop in a photo — it is decoded locally and never uploaded.",
    "Pick a filter, then fine-tune brightness, contrast, saturation and warmth.",
    "Export at full resolution; the preview is scaled down only for the screen.",
  ],
  notes: [
    "Applies classic photo filter effects — contrast, saturation, warmth, fade, vignette and grain — to your own image, with everything processed on a canvas in your browser. The image is never uploaded, which matters for personal photographs.",
    "Most filters are combinations of a small number of adjustments. A warm vintage look is mainly reduced contrast in the shadows, a slight sepia shift and added grain; a punchy modern look is raised contrast and saturation with cooler shadows. Seeing the components makes them easier to adjust deliberately rather than by trial.",
    "Filters are best applied at export size rather than to a full-resolution original you will later downscale, because grain and vignette are resolution-dependent — grain that looks right on a 4000-pixel image disappears entirely when the image is resized to 1080.",
  ],
  faq: [
    {
      question: "Are my photos uploaded when I apply a filter?",
      answer: "No. Filters are applied on a canvas in your browser and the result is downloaded from memory, so personal photographs never leave your device.",
    },
    {
      question: "What makes a photo look vintage?",
      answer: "Mostly lifted shadows so blacks are not truly black, a slight warm or sepia colour shift, reduced contrast and a little grain. Those four adjustments account for most of what a vintage preset does.",
    },
    {
      question: "Should I apply filters before or after resizing?",
      answer: "After. Grain and vignette are resolution-dependent — grain that looks right on a 4000-pixel image vanishes when the image is scaled to 1080, and a vignette shifts position relative to the frame.",
    },
    {
      question: "Can I undo a filter?",
      answer: "The original image is untouched — filters are applied to a copy for export. Reset returns to the original at any point, and nothing is written over your file.",
    },
    {
      question: "Why does my filtered image look different on Instagram?",
      answer: "Because the platform recompresses on upload and applies its own colour handling. Exporting at a higher resolution and avoiding heavy grain both reduce how much that compression shows.",
    },
  ],
};
