import type { ToolContent } from "@/config/tool-content";

export const imageColorPickerContent: ToolContent = {
  steps: [
    "Drop in an image — a screenshot, a photo, a logo.",
    "Click anywhere to sample that colour as HEX, RGB and HSL.",
    "Or take one from the palette, which is extracted automatically.",
  ],
  notes: [
    "Clicking samples a small square and averages it rather than reading the single pixel underneath. That is deliberate: photographs are noisy at pixel level and JPEG compression adds more, so reading one pixel from a wall that is plainly beige can return something visibly wrong. Averaging a few pixels is what the eyedropper in a design application does, for the same reason.",
    "The palette is extracted by grouping similar shades into buckets and ranking them, with near-black, near-white and washed-out pixels set aside first. Without that step almost every photograph returns black, dark grey and white — technically the most common colours in the image, and completely useless as a palette. What comes back instead are the colours you would actually name if asked.",
    "Each swatch is the average of its bucket rather than the bucket's centre, so the value is close to a colour genuinely present in the image rather than a mathematical midpoint that appears nowhere in it.",
    "Everything happens in your browser. The image is decoded locally and its pixels never leave your machine, which matters for the commonest use of a tool like this: pulling brand colours out of a design that has not been published yet.",
  ],
  faq: [
    {
      question: "How do I get the hex code of a colour in an image?",
      answer: "Drop the image in and click the colour. The HEX, RGB and HSL values appear together, each with a copy button.",
    },
    {
      question: "Why does the picked colour differ slightly from what I expected?",
      answer: "A small area is averaged rather than a single pixel read. Photographs and JPEGs are noisy at pixel level, so one pixel is often not representative — averaging gives the colour you can actually see, which is what you want.",
    },
    {
      question: "How is the palette chosen?",
      answer: "Similar shades are grouped into buckets and ranked by how much of the image they cover, with near-black, near-white and near-grey excluded. Without that exclusion nearly every photo returns black, grey and white, which is accurate and useless.",
    },
    {
      question: "Can I use this on a screenshot of a website?",
      answer: "Yes, and it is one of the better uses — screenshot the page, drop it in, and read the exact values. Bear in mind a screenshot may carry colour profile differences, so treat the result as very close rather than certain.",
    },
    {
      question: "Does the image leave my browser to be analysed?",
      answer: "No. It is decoded in your browser and the pixels never leave your device, which matters when the image is unreleased design work.",
    },
  ],
};
