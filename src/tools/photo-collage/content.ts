import type { ToolContent } from "@/config/tool-content";

export const photoCollageContent: ToolContent = {
  steps: [
    "Add several photos — they are laid out in the order you add them.",
    "Pick a canvas shape, then adjust the columns, gap and background.",
    "Download. Everything is drawn in your browser.",
  ],
  notes: [
    "Each photo is cropped to fill its cell rather than squashed into it. Stretching to fit is the one option that is always wrong — it distorts everything in the frame and, unlike a crop, cannot be undone by anyone looking at the result. The trade is that a photo whose shape differs from its cell loses its edges, which is why the column count is worth playing with: a grid closer to your photos' natural shape crops less.",
    "Cells in the final row stay the same size as the others rather than stretching to fill the width. A row of two images made twice as wide as the rows above reads as a mistake; leaving the space empty at least looks deliberate. The tool says how many cells will be left over so it is not a surprise.",
    "The canvas presets are the sizes people actually need — the Instagram shapes, widescreen, and A4 at 300 DPI for printing. Starting from the right dimensions means the platform downscales your collage rather than upscaling it, which is the difference between sharp and soft.",
    "Everything is drawn on a canvas in your browser and nothing is uploaded, which matters for the usual case: family photographs.",
  ],
  faq: [
    {
      question: "How do I combine several photos into one image?",
      answer: "Add them all, choose a canvas shape and column count, and download. They are laid out in the order you added them, each cropped to fill its cell so nothing is distorted.",
    },
    {
      question: "Why are the edges of my photos cut off?",
      answer: "Because each one is cropped to fill its cell rather than squashed to fit. Stretching would distort the picture, which is worse. Changing the column count to get cells closer to your photos' natural shape reduces how much is trimmed.",
    },
    {
      question: "What size should I use for Instagram?",
      answer: "1080×1080 for a square post, 1080×1350 for portrait, 1080×1920 for a story. All three are presets. Upload at those sizes and the platform downscales rather than upscaling, which keeps the result sharp.",
    },
    {
      question: "Why is the last row not filled?",
      answer: "Because the cells stay the same size rather than stretching. A final row of images twice the width of the rows above looks like an error — leaving the space empty is the more deliberate-looking option, and the tool tells you how many cells will be spare.",
    },
    {
      question: "Are my photos uploaded?",
      answer: "No. The collage is drawn on a canvas in your browser and the files never leave your device.",
    },
  ],
};
