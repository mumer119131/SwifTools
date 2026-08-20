import type { ToolContent } from "@/config/tool-content";

export const stripHtmlContent: ToolContent = {
  steps: [
    "Paste HTML — a page source, an email, an export from a CMS.",
    "Choose whether to keep line breaks, decode entities and collect link targets.",
    "Copy the plain text.",
  ],
  notes: [
    "The obvious approach — delete everything between angle brackets — fails in two directions, and most tools that offer this do exactly that. It leaves entities behind, so the output is littered with `&amp;` and `&nbsp;` where an ampersand and a space should be. And it removes block structure without replacing it, so paragraphs and list items run together into one unbroken wall with words glued to each other at the seams.",
    "Both are handled here. Entities are decoded, including numeric and hex ones. Block elements are replaced with the right amount of space rather than nothing: paragraphs and headings get a blank line between them, list items and table rows get a single line each. Treating those alike gives either double-spaced lists or run-together paragraphs, which is why the distinction is worth making.",
    "Script and style elements have their contents removed entirely rather than just their tags. This is the difference between clean output and a page's CSS appearing as text in the middle of your document — a failure that is obvious once you have seen it and surprisingly common.",
    "Keeping link targets is optional and off by default. When it is on, links are numbered in the text and their destinations listed underneath, footnote style, so nothing is lost when the markup goes.",
    "Everything runs in your browser, which matters given what people usually paste here — email content, CMS exports and scraped pages that frequently contain things not intended for a third party.",
  ],
  faq: [
    {
      question: "How do I convert HTML to plain text?",
      answer: "Paste it and copy the result. Tags are removed, entities decoded, and block elements replaced with appropriate line breaks so the text stays readable rather than running together.",
    },
    {
      question: "Why does other software leave &nbsp; in the output?",
      answer: "Because removing tags and decoding entities are different jobs, and simple strippers only do the first. Entities are HTML's way of writing characters that would otherwise be markup, and they need decoding separately — which this does.",
    },
    {
      question: "Will it keep my paragraphs?",
      answer: "Yes, if you leave the structure option on. Paragraphs and headings get a blank line between them and list items get one line each. Turn it off and everything collapses to a single line.",
    },
    {
      question: "What happens to CSS and JavaScript in the page?",
      answer: "Removed entirely, contents included. Stripping only the tags would leave the stylesheet and script bodies behind as text, which is how a page's CSS ends up in the middle of the output.",
    },
    {
      question: "Can I keep the links?",
      answer: "Yes. Turn on link targets and each link is numbered in the text with its destination listed underneath, footnote style, so the addresses survive the markup being removed.",
    },
  ],
};
