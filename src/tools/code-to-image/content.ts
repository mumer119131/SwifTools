import type { ToolContent } from "@/config/tool-content";

export const codeToImageContent: ToolContent = {
  steps: [
    "Paste your snippet and pick its language — highlighting updates as you type.",
    "Choose a theme, a backdrop gradient and whether to show line numbers and window chrome.",
    "Download a PNG at up to 3× for a crisp result on high-DPI screens and slide decks.",
  ],
  notes: [
    "The image is painted directly onto a canvas rather than rendered from styled HTML, which is what makes the output pixel-exact and reliable. The usual approach — drawing HTML into an SVG foreignObject and rasterising it — is at the mercy of which fonts the browser happens to have and produces different results on different machines.",
    "Syntax highlighting runs locally over the pasted code. Language, theme, padding, window chrome and background are all adjustable, and the preview is the actual canvas, so what you see is exactly what downloads.",
    "For a code screenshot that will be read on a phone, keep lines under about 60 characters and the font size up. The most common mistake is pasting a wide block at a small size, which produces an image that is technically legible and practically useless in a timeline.",
  ],
  faq: [
    {
      question: "What image format does it produce?",
      answer: "PNG, which is lossless and keeps text edges crisp. JPEG would put compression halos around every character — it is designed for photographs, and code is line art.",
    },
    {
      question: "Why not just take a screenshot?",
      answer: "A screenshot captures whatever your editor looks like at whatever your window size is, including the parts you did not want. This produces a consistent image at a resolution you choose, with padding and background already right for sharing.",
    },
    {
      question: "What size should code images be for social media?",
      answer: "Keep lines under about 60 characters and use a larger font than feels necessary. Timeline images are viewed small on phones, and a wide block at a small size becomes unreadable.",
    },
    {
      question: "Which languages are supported?",
      answer: "The common ones — JavaScript, TypeScript, Python, Go, Rust, Java, C, C++, HTML, CSS, JSON, SQL, shell and several more. If a language is not listed, plain text still renders with correct spacing.",
    },
    {
      question: "Is my code uploaded to generate the image?",
      answer: "No. Highlighting and rendering both happen on a canvas in your browser, so proprietary snippets are never transmitted.",
    },
  ],
};
