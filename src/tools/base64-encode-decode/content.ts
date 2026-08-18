import type { ToolContent } from "@/config/tool-content";

export const base64EncodeDecodeContent: ToolContent = {
  steps: [
    "Paste text to encode, or a Base64 string to decode — or drop in a file.",
    "Switch on URL-safe mode for values that go in a query string or filename.",
    "Copy the result. Files are converted to a data URI you can paste straight into HTML or CSS.",
  ],
  notes: [
    "Base64 represents binary data using 64 printable characters, so it can travel through systems that only handle text — email bodies, JSON fields, data URLs, HTTP headers. It encodes three bytes into four characters, which is why encoded data is always about 33 percent larger than what went in.",
    "It is emphatically not encryption. Anyone can decode Base64 in one step with no key, which is precisely why it is used to carry data rather than to protect it. A password stored Base64-encoded is a password stored in plain text with an extra step.",
    "The URL-safe variant swaps + and / for - and _, because the standard characters have special meaning in URLs and would be corrupted by percent-encoding. If a token fails to decode, a mismatch between the two variants is the first thing to check; missing = padding at the end is the second.",
  ],
  faq: [
    {
      question: "Is Base64 encryption?",
      answer: "No. It is an encoding, reversible by anyone with no key at all. It exists to let binary data pass through text-only channels, not to protect anything. Never use it to store passwords or secrets.",
    },
    {
      question: "Why does my Base64 string fail to decode?",
      answer: "Usually a variant mismatch — the URL-safe form uses - and _ where the standard form uses + and / — or missing = padding at the end. Whitespace and line breaks inserted by email clients also break it.",
    },
    {
      question: "Why is the encoded data larger than the original?",
      answer: "Base64 turns every three bytes into four characters, so output is roughly 33 percent bigger. That overhead is the price of being able to send binary safely through a text channel.",
    },
    {
      question: "What is URL-safe Base64?",
      answer: "A variant that replaces + with - and / with _, because the standard characters have reserved meanings in URLs. It is what JWTs and most token formats use, and the two are not interchangeable.",
    },
    {
      question: "Can I encode files, not just text?",
      answer: "Yes. Files are read in your browser and encoded locally, which is how data URLs for small images are produced. Nothing is uploaded.",
    },
  ],
};
