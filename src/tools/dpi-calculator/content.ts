import type { ToolContent } from "@/config/tool-content";

export const dpiCalculatorContent: ToolContent = {
  steps: [
    "Pick what you are working out — print size, pixels needed, or whether an image is good enough.",
    "Enter the figures you have.",
    "Paper size presets cover the common cases.",
  ],
  notes: [
    "There is one relationship here and three ways round it: pixels equal inches times DPI. The confusion is almost never about the arithmetic and almost always about what DPI is. It is not a property an image carries in any meaningful sense — it is the ratio you choose when deciding how large to print. A file described as a 300 DPI image is only 300 DPI at one particular printed size, and the same file is 150 DPI when printed twice as large.",
    "Which is why changing the DPI field in an image editor, without resampling, changes nothing about the pixels at all. It changes a note stored in the file about how large the image would like to be printed. Some software respects it, some ignores it, and neither adds or removes a single pixel.",
    "300 DPI is the print standard because it is roughly where the eye stops resolving individual dots at normal reading distance. It is a convention rather than physics, and viewing distance is what actually decides it — a poster read from two metres is fine at 150, and a billboard is fine at 15. The trap is going the other way: an image printed at 100 DPI in the hand looks obviously soft, and no amount of upscaling fixes it, because enlarging cannot add detail that was never captured.",
    "When the two axes give different figures, the image's aspect ratio does not match the print size, and the lower of the two is what limits quality. Cropping to the right shape first is usually better than stretching to fill.",
  ],
  faq: [
    {
      question: "How many pixels do I need to print A4 at 300 DPI?",
      answer: "2480 × 3508 pixels, which is about 8.7 megapixels. A4 is 210 × 297mm, and at 300 dots per inch that works out to those dimensions.",
    },
    {
      question: "What does DPI actually mean for a digital image?",
      answer: "On its own, nothing. DPI is the ratio between pixels and physical size, so it only exists once you decide how large to print. The same file is 300 DPI at one size and 150 at twice that size.",
    },
    {
      question: "Does changing the DPI in Photoshop improve my image?",
      answer: "Not unless you resample. Changing the DPI field alone edits a note in the file about intended print size — the pixels are untouched. Resampling does change them, but enlarging invents detail rather than recovering it.",
    },
    {
      question: "Is 72 DPI enough for anything?",
      answer: "For screens, where DPI is meaningless anyway — a screen shows pixels, and 72 is a historical convention rather than a measurement. For print it is far too low: an image at 72 DPI held in the hand is visibly pixelated.",
    },
    {
      question: "Why do my two DPI figures differ?",
      answer: "Because the image's proportions do not match the print size you asked for. The lower of the two is what limits sharpness. Cropping the image to the right shape usually gives a better result than stretching it to fit.",
    },
  ],
};
