import type { ToolContent } from "@/config/tool-content";

export const urlEncodeDecodeContent: ToolContent = {
  steps: [
    "Paste a URL, a query value or an encoded string.",
    "Choose component encoding for a single value, or full-URL encoding to leave the structure intact.",
    "Copy the result, or use the parsed breakdown to inspect each query parameter separately.",
  ],
  notes: [
    "URL encoding replaces characters that have a reserved meaning in a URL with a percent sign and their hexadecimal byte value — a space becomes %20, an ampersand %26. Without it, a query parameter containing an ampersand would be read as the start of the next parameter, and the value would be silently truncated.",
    "There are two functions and they are not interchangeable. encodeURIComponent escapes everything reserved and is what you want for a single parameter value. encodeURI leaves the structural characters — the slashes, question mark and ampersands — intact, and is for encoding a whole URL that is already assembled. Using encodeURI on a parameter value is the classic source of URLs that break on unusual input.",
    "Non-ASCII characters are encoded as their UTF-8 bytes, so an accented letter becomes two percent-escapes and most emoji become four. That is why a short piece of text can produce a surprisingly long encoded string.",
  ],
  faq: [
    {
      question: "What is the difference between encodeURI and encodeURIComponent?",
      answer: "encodeURIComponent escapes every reserved character and is correct for a single query parameter value. encodeURI leaves slashes, question marks and ampersands alone and is for a complete URL. Using the wrong one is why URLs break when a value contains an ampersand.",
    },
    {
      question: "Why does a space become %20 and sometimes a plus sign?",
      answer: "%20 is correct everywhere in a URL. The plus sign means a space only inside form-encoded query strings, an older convention from HTML forms. In a path segment a plus is a literal plus, which is why the two must not be mixed.",
    },
    {
      question: "Why is my encoded emoji so long?",
      answer: "Non-ASCII characters are encoded as their UTF-8 bytes, one percent-escape per byte. Most emoji are four bytes, so a single emoji becomes twelve characters.",
    },
    {
      question: "Do I need to encode a whole URL?",
      answer: "No — encode the parts, not the whole. Escaping an assembled URL with encodeURIComponent would escape its slashes and question mark and break it. Encode each parameter value as you build it.",
    },
    {
      question: "Is my data sent anywhere?",
      answer: "No. Encoding and decoding both run in your browser, so URLs containing tokens or session identifiers stay local.",
    },
  ],
};
