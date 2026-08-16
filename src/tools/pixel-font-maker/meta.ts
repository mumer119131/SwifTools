import { Grid2x2Check } from "lucide-react";

import type { Tool } from "@/config/tools";

export const pixelFontMaker: Tool = {
  slug: "pixel-font-maker",
  name: "Pixel Font Maker",
  category: "fun",
  description: "Draw a bitmap font glyph by glyph and export it as a sprite sheet or JSON.",
  keywords: [
    "pixel font maker",
    "bitmap font editor",
    "pixel font generator",
    "8 bit font maker",
    "game font creator",
    "sprite font editor",
  ],
  icon: Grid2x2Check,
  processing: "client",
  status: "live",
  steps: [
    "Pick a glyph and draw it on the grid — click or drag to fill pixels.",
    "Preview any text in your font as you go.",
    "Export the whole set as a PNG sprite sheet or as JSON.",
  ],
  notes: [
    "Draw each glyph on a grid and preview any text in the font as you go. Dragging paints continuously, and the mode is set by the first pixel you touch — start on an empty cell and you fill, start on a filled one and you erase, which is how every pixel editor behaves.",
    "The export is a sprite sheet and a JSON glyph map rather than a TTF. That is deliberate: bitmap fonts are used as sheets in game engines, and converting to a real outline font would throw away the pixel crispness that is the entire point.",
    "A 5×7 grid is the classic size for a legible bitmap font and is what the seeded starting set uses. Smaller grids force compromises on letters like M, W and Q; larger ones give more room but take considerably longer to draw.",
  ],
  faq: [
    {
      question: "What size should a pixel font be?",
      answer: "5×7 is the classic legible minimum and what the starting set uses. Smaller forces compromises on M, W and Q; larger gives more room but multiplies the drawing work across eighty glyphs.",
    },
    {
      question: "How do I export my pixel font?",
      answer: "As a PNG sprite sheet, 16 glyphs per row in character-set order, or as JSON with the glyph data. Both are what game engines actually consume for bitmap fonts.",
    },
    {
      question: "Why not export as a TTF?",
      answer: "Because converting a bitmap to an outline font throws away the pixel crispness that is the whole point. Game engines use sprite sheets for bitmap fonts precisely so the pixels stay exact.",
    },
    {
      question: "Can I change the grid size after starting?",
      answer: "Yes. Existing glyphs are kept and cropped if you shrink the grid, or padded if you enlarge it, so you do not lose work by changing your mind.",
    },
    {
      question: "Is my font saved?",
      answer: "Yes, in this browser as you draw. Export the sprite sheet or JSON for anything you want to keep, since browser storage is not a backup.",
    },
  ],
};
