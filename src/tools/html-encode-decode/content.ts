import type { ToolContent } from "@/config/tool-content";

export const htmlEncodeDecodeContent: ToolContent = {
  steps: [
    "Paste text or markup you want to display literally on a page.",
    "Choose minimal escaping for the five characters that matter, or full escaping for every non-ASCII character.",
    "Copy the result. Decoding goes the other way, resolving named and numeric entities.",
  ],
  notes: [
    "HTML entity encoding converts characters that would otherwise be interpreted as markup into their entity form — < becomes &lt;, & becomes &amp;. It is what allows a page to display a piece of HTML as text rather than rendering it, and it is the mechanism that prevents user input from becoming executable markup.",
    "The five characters that must be escaped in HTML are <, >, &, \" and '. The ampersand is the one people forget, and it matters most: without escaping it, a string containing &lt; would be decoded twice and turn back into a real angle bracket.",
    "Encoding is context-dependent and this is not a substitute for it. Escaping for HTML text is different from escaping for an attribute value, a URL, or a JavaScript string, and applying the wrong one leaves a hole. Use a templating engine that escapes by context for anything user-supplied; this tool is for inspecting and converting content by hand.",
  ],
  faq: [
    {
      question: "Which characters need HTML encoding?",
      answer: "The five with structural meaning: <, >, &, double quote and single quote. The ampersand is the important one — miss it and any entity in the text will be decoded a second time, turning escaped markup back into real markup.",
    },
    {
      question: "Does HTML encoding prevent XSS?",
      answer: "It is a necessary part of the defence but not sufficient on its own. Escaping is context-dependent — HTML text, attribute values, URLs and JavaScript strings each need different treatment. Use a framework that escapes by context for user input.",
    },
    {
      question: "What is the difference between &amp;lt; and &amp;#60;?",
      answer: "Nothing in effect — both produce a less-than sign. The first is a named entity and the second a numeric reference. Named entities are more readable; numeric ones work for any character and are useful where the name is obscure.",
    },
    {
      question: "Why does my text show &amp;amp; instead of &amp;?",
      answer: "It has been encoded twice. An ampersand became &amp;amp;, and encoding that again turned the ampersand of the entity itself into &amp;amp;amp;. Decode once and check whether the result is what you meant before encoding.",
    },
    {
      question: "Is my content uploaded?",
      answer: "No. Encoding and decoding run entirely in your browser, so page source or user data you are inspecting stays on your machine.",
    },
  ],
};
