import type { ToolContent } from "@/config/tool-content";

export const loremIpsumGeneratorContent: ToolContent = {
  steps: [
    "Choose paragraphs, sentences, words or list items, and how many you need.",
    "Switch to plain English if Latin makes it harder to judge how the copy reads.",
    "Copy as plain text or wrapped in HTML tags, ready to paste into a mockup.",
  ],
  notes: [
    "Lorem ipsum is scrambled Latin from Cicero's De finibus bonorum et malorum, written in 45 BC, and used as placeholder text since at least the 1500s. It persists because it looks like language without being readable — reviewers comment on the layout rather than on the copy.",
    "That is also its weakness. Latin has a different letter distribution and average word length from English, so a paragraph of lorem ipsum sets differently from the real thing, and a design that looks balanced in Latin can look cramped once English copy arrives.",
    "The larger risk is shipping it. Lorem ipsum has reached production on national newspaper sites, printed packaging and at least one government form. If the text is placeholder, make it obvious — or use realistic sample copy so the design is tested against what it will actually hold.",
  ],
  faq: [
    {
      question: "What does lorem ipsum actually mean?",
      answer: "Nothing coherent. It is scrambled text from Cicero's De finibus bonorum et malorum of 45 BC, with words altered and shuffled so it reads as language without carrying meaning.",
    },
    {
      question: "Why use lorem ipsum instead of real text?",
      answer: "Because readable copy pulls attention to the words. Placeholder text keeps a design review about the layout, typography and hierarchy rather than about the wording, which is the point at that stage.",
    },
    {
      question: "Is lorem ipsum bad for design?",
      answer: "It has a real drawback: Latin has different word lengths and letter frequencies from English, so a layout that looks balanced in lorem ipsum can look cramped with real copy. Test with realistic text before signing off.",
    },
    {
      question: "How much lorem ipsum do I need?",
      answer: "Enough to fill the space at the length real copy will be. Generating three paragraphs when the finished page will hold ten tests nothing about how the design handles length.",
    },
    {
      question: "Can I generate lorem ipsum as HTML?",
      answer: "Yes — as paragraphs, lists or headings with tags included, which saves wrapping it by hand when dropping it into a template.",
    },
  ],
};
