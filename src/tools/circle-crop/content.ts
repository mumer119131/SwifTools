import type { ToolContent } from "@/config/tool-content";

export const circleCropContent: ToolContent = {
  steps: [
    "Drop in a photo.",
    "Choose a circle, rounded square or plain square, and an output size.",
    "Nudge the position so the crop lands on the subject, then download.",
  ],
  notes: [
    "A circular crop has to start from a square, so a rectangular photo loses its long edges before the circle is even applied. Which part survives is the whole decision, which is why the position controls exist — and why the vertical one defaults slightly above centre. Faces sit high in most portraits, and a centred square crop routinely takes the top of someone's head off.",
    "The format choice matters more than it looks. A circle leaves transparent corners, and JPEG has no alpha channel at all — so saving a circle as JPEG fills those corners, and browsers commonly fill them with black rather than the white people expect. Save as PNG for genuinely transparent corners; the tool only offers a corner colour when the format cannot hold transparency, rather than letting it be a surprise.",
    "400 pixels is a sensible default for an avatar. Most platforms display them far smaller, but they also generate their own sizes from what you upload, and starting larger means those are downscaled rather than upscaled.",
    "The rounded square is worth considering over a true circle for anything that will be displayed as a rounded rectangle — a lot of interfaces mask avatars themselves, and a pre-circled image inside a rounded-square mask ends up with visible gaps at the corners.",
  ],
  faq: [
    {
      question: "How do I crop an image into a circle?",
      answer: "Drop it in and choose the circle shape. The image is cropped to a square first — the position sliders decide which part — and then masked to a circle. Save as PNG to keep the corners transparent.",
    },
    {
      question: "Why are the corners black instead of transparent?",
      answer: "Because the file was saved as JPEG, which has no transparency at all. Browsers commonly fill the missing alpha with black. Choose PNG for genuinely transparent corners, or pick a corner colour if you need JPEG.",
    },
    {
      question: "What size should a profile picture be?",
      answer: "400×400 is a safe default. Platforms display avatars much smaller but generate their own sizes from your upload, so starting larger means downscaling rather than upscaling — which is the difference between sharp and soft.",
    },
    {
      question: "Why does the crop default to slightly above centre?",
      answer: "Because faces sit high in most portraits. A perfectly centred square crop of a standing photo routinely cuts the top of the head off, so the default leans upward and the slider lets you correct it.",
    },
    {
      question: "Should I use a circle or a rounded square?",
      answer: "If the platform already masks avatars to a circle, upload a square or rounded square — a pre-circled image inside their mask can leave visible gaps at the corners. Use a true circle when you need the image itself to be round.",
    },
  ],
};
