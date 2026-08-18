import type { ToolContent } from "@/config/tool-content";

export const memeGeneratorContent: ToolContent = {
  steps: [
    "Drop in any image from your device.",
    "Type the top and bottom lines and adjust the size, colour and outline.",
    "Download the result. The image never leaves your browser.",
  ],
  notes: [
    "The image is drawn onto a canvas in your own browser and never uploaded — there is no server involved and nothing to delete afterwards. That matters more than it sounds, since most meme sites upload your image and keep it.",
    "Text wraps by measuring against the actual font rather than counting characters, which is the only approach that works: 'WWWWW' and 'iiiii' are the same length and nothing like the same width. Font size is set as a percentage of image height, so a caption looks the same on a 400-pixel thumbnail and a 4000-pixel photo.",
    "The classic look is Impact with a heavy black outline, which exists for a practical reason: it stays legible over any background, light or dark. Impact must be installed on your device to be used; the next font in the stack is substituted otherwise.",
  ],
  faq: [
    {
      question: "Is my image uploaded when I make a meme?",
      answer: "No. Everything is drawn on a canvas in your browser and downloaded from memory. Most meme sites upload and store your image; this one has no server to upload to.",
    },
    {
      question: "What font do memes use?",
      answer: "Impact with a heavy black outline, which is the convention because it stays readable over both light and dark backgrounds. Impact ships with Windows and macOS; if it is missing, the next font in the stack is used.",
    },
    {
      question: "How do I add text to an image?",
      answer: "Drop the image in and type the top and bottom lines. Size, colour, outline weight and case are all adjustable, and long lines wrap automatically to fit the image width.",
    },
    {
      question: "Why does my text overflow the image?",
      answer: "It should not — wrapping is measured against the real font rather than estimated from character count. If a single word is wider than the image, reduce the font size, since a word cannot be broken mid-way.",
    },
    {
      question: "What format is the meme saved in?",
      answer: "PNG, which keeps the text edges sharp. JPEG would put visible compression halos around the outlined letters, because it is designed for photographs rather than hard-edged graphics.",
    },
  ],
};
