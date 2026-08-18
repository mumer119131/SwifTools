import { Braces } from "lucide-react";

import type { Tool } from "@/config/tools";

export const imageToBase64: Tool = {
  slug: "image-to-base64",
  name: "Image to Base64",
  category: "image",
  description: "Turn an image into a data URI, ready to paste into CSS, HTML or Markdown.",
  keywords: [
    "image to base64",
    "base64 encode image",
    "data uri generator",
    "png to base64",
    "svg to base64",
    "inline image css",
    "base64 image converter",
  ],
  icon: Braces,
  processing: "client",
  status: "live",
  steps: [
    "Drop in the image.",
    "Pick the form you need — raw Base64, a data URI, or a ready-made CSS, HTML or Markdown snippet.",
    "Copy it. The file is never uploaded.",
  ],
  notes: [
    "A data URI puts the image inside the document that references it, so the browser needs no second request to fetch it. For a small icon that appears on every page, that is a real saving: the image arrives with the stylesheet and paints immediately, instead of costing a round trip.",
    "It stops being a saving quickly. Base64 grows the data by about a third, an inlined image cannot be cached separately from the file containing it, and it blocks that file until the whole thing has downloaded. A 200 KB photograph inlined into a stylesheet is 270 KB of render-blocking CSS that every visitor re-downloads whenever anything else in that stylesheet changes. The size verdict shown alongside the result says plainly which side of that line your image is on.",
    "SVG is the format where this usually makes sense — small, and inlining sidesteps the same-origin restrictions that stop an external SVG being styled by the page. Photographs almost never belong here.",
    "The encoding happens in your browser. Nothing is uploaded, which matters more than usual for this tool: the images people inline are often logos and assets from work that has not shipped yet.",
  ],
  faq: [
    {
      question: "What is a data URI?",
      answer: "A way of writing the file's contents directly into the place that would normally hold a link to it. `src=\"data:image/png;base64,iVBOR…\"` carries the whole image, so the browser has nothing further to fetch.",
    },
    {
      question: "When should I inline an image instead of linking to it?",
      answer: "When it is small — a few kilobytes at most — and appears on nearly every page. Below that threshold the saved request is worth the size. Above it, you are making a render-blocking file bigger and giving up separate caching for it.",
    },
    {
      question: "Why is the Base64 bigger than the original file?",
      answer: "Base64 represents three bytes using four ASCII characters, so the result is about 33% larger, plus a short scheme prefix. That overhead is the price of storing binary data somewhere only text is allowed.",
    },
    {
      question: "Does inlining images make a site faster?",
      answer: "For a handful of tiny assets, yes. Past that it makes things worse: the containing file grows, cannot be cached independently, and holds up rendering until it has fully arrived. Modern HTTP/2 and HTTP/3 also made the extra-request argument far weaker than it was.",
    },
    {
      question: "Is my image uploaded anywhere?",
      answer: "No. It is read and encoded by your browser, which matters here because the images people inline are usually logos and interface assets from work that is not public yet.",
    },
  ],
};
