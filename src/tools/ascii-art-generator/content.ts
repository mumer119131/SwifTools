import type { ToolContent } from "@/config/tool-content";

export const asciiArtGeneratorContent: ToolContent = {
  steps: [
    "Type your text and pick a style.",
    "Everything renders instantly — no server, no waiting.",
    "Copy it into a README, a terminal banner or a commit message.",
  ],
  notes: [
    "The letterforms are defined in the tool itself rather than loaded from figlet font files, which are larger than this whole page. That means it renders instantly and works with no network at all.",
    "The compact style folds pairs of rows into half-block characters, which is how you get a readable banner in three lines instead of five — useful in a terminal or a commit message where vertical space is limited.",
    "Use a monospaced font wherever you paste the result, or the alignment falls apart entirely. That is why ASCII banners work in code comments, terminals and READMEs and look broken in a word processor.",
  ],
  faq: [
    {
      question: "How do I make ASCII art from text?",
      answer: "Type the text and pick a style. Four are available, including a compact one that folds rows into half-block characters to fit a banner into three lines instead of five.",
    },
    {
      question: "Why does my ASCII art look misaligned?",
      answer: "Because it is being displayed in a proportional font. ASCII art only works in a monospaced font, where every character is the same width — that is why it survives in terminals and breaks in word processors.",
    },
    {
      question: "Can I use ASCII art in code comments?",
      answer: "Yes, and there is a wrapping option for it — hash, double-slash or block comment style. Code is displayed in a monospaced font, which is exactly where ASCII banners work best.",
    },
    {
      question: "Which characters can I use?",
      answer: "Letters, digits and common punctuation. Anything without a defined glyph is skipped rather than drawn as a box, so a stray emoji does not ruin the banner.",
    },
    {
      question: "Does this need an internet connection?",
      answer: "Only to load the page. The letterforms are built in rather than fetched, so generation itself works entirely offline.",
    },
  ],
};
