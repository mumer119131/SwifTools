import { Minimize2 } from "lucide-react";

import type { Tool } from "@/config/tools";

export const cssMinifier: Tool = {
  slug: "css-minifier",
  name: "CSS Minifier",
  category: "developer",
  description: "Strip comments and whitespace from CSS, and shorten hex colours and zero units.",
  keywords: ["css minifier", "minify css", "compress css online", "css compressor"],
  icon: Minimize2,
  processing: "client",
  status: "live",
  steps: [
    "Paste your stylesheet.",
    "Comments and whitespace go, hex colours shorten to three digits where possible, and zero values lose their units.",
    "Copy or download the result, with the byte saving shown against the original.",
  ],
  notes: [
    "Minifying strips comments, whitespace and the last semicolon in each block, and shortens what can be shortened without changing meaning — #ffffff to #fff, 0px to 0. Typical savings on hand-written CSS are 20 to 40 percent before gzip.",
    "Gzip or Brotli, which every server should already apply, does most of the same job for repeated whitespace. Minifying still helps because it removes content rather than compressing it, and the two compound — but the gain from minifying already-compressed CSS is smaller than the raw percentage suggests.",
    "Keep the readable source in version control and minify as a build step. A minified stylesheet is unreviewable in a diff, and editing one by hand is how a stray brace ends up breaking every rule after it.",
  ],
  faq: [
    {
      question: "How much smaller will my CSS get?",
      answer: "Usually 20 to 40 percent for hand-written CSS with comments and generous formatting. Already-compact or framework-generated CSS gains less, because there is less whitespace and fewer comments to remove.",
    },
    {
      question: "Does minifying CSS break anything?",
      answer: "It should not — only whitespace, comments and redundant syntax are removed. The one thing to watch is CSS hacks that depend on specific spacing or malformed syntax to target old browsers, which minification can normalise away.",
    },
    {
      question: "Should I minify if my server already uses gzip?",
      answer: "Yes, though the gain is smaller than the raw percentage suggests. Gzip compresses repeated whitespace efficiently; minification removes content entirely, including comments, so the two compound rather than overlap completely.",
    },
    {
      question: "Can I un-minify CSS?",
      answer: "You can reformat it with the CSS formatter, which restores readable indentation. Comments are gone for good, though — they are removed, not compressed.",
    },
    {
      question: "Is my stylesheet uploaded?",
      answer: "No. Minification runs in your browser, so unreleased styles and anything containing internal class names or comments stay on your machine.",
    },
  ],
};
