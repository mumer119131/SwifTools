import type { ToolContent } from "@/config/tool-content";

export const aspectRatioCalculatorContent: ToolContent = {
  steps: [
    "Enter a width and height, or click a common ratio.",
    "Read the ratio, resize to a new width keeping it, or fit it inside a box.",
    "The fit view shows what contain and cover each cost you.",
  ],
  notes: [
    "An aspect ratio is a width and height reduced to their simplest form. 1920×1080 and 3840×2160 are both 16:9, which is why a video shot on one scales cleanly to the other and why mixing 16:9 and 4:3 footage in one timeline always looks wrong somewhere.",
    "Some sizes do not reduce tidily. 1000×667 simplifies to 1000:667, which is true and useless — it is a crop very slightly off 3:2, almost certainly from a camera. Where a size lands close to a common ratio without matching it, that is reported, because the near-match is usually the answer someone wanted.",
    "The fit view is the part worth understanding. Contain shows the whole image inside the box and leaves bars wherever the ratio does not match. Cover fills the box completely and crops whatever does not fit. They are different operations with different costs, and confusing them is behind most badly cropped thumbnails and most letterboxed videos. Putting a 16:9 image into a square with cover discards 44% of it, which the tool states outright rather than leaving you to discover.",
    "There is a third option that is always wrong: stretching. Scaling width and height by different amounts distorts everything in the frame, and unlike a crop it cannot be undone by anyone looking at the result. Nothing here offers it.",
  ],
  faq: [
    {
      question: "What aspect ratio is 1920x1080?",
      answer: "16:9. So is 3840×2160, 2560×1440 and 1280×720 — they are all the same shape at different sizes, which is why they scale between each other cleanly.",
    },
    {
      question: "What is the difference between contain and cover?",
      answer: "Contain shows all of the image and leaves bars where the shapes disagree. Cover fills the space and crops the overflow. Neither distorts — the third option, stretching, is always wrong and is not offered here.",
    },
    {
      question: "How do I resize an image without distorting it?",
      answer: "Change one dimension and let the other follow the ratio. Enter your new width in the resize tab and the matching height is calculated. Setting both by hand is how images get squashed.",
    },
    {
      question: "Why does my ratio come out as something like 1000:667?",
      answer: "Because those numbers share no useful common factor — it is an exact answer to an untidy size, usually a crop. The tool also reports the nearest common ratio, which for 1000×667 is 3:2 and is almost certainly what was meant.",
    },
  ],
};
