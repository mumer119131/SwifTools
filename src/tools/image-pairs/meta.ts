import { ArrowRightLeft } from "lucide-react";

import type { Tool } from "@/config/tools";
import { caveats, formatPairs, type FormatPair } from "@/lib/image-formats";

/**
 * Registry entries for the direct image conversion pages.
 *
 * `searchOnly`, like the unit pairs: all sixteen deserve to rank for their own
 * query, and listing them in the Image category grid would bury the six real
 * image tools behind a wall of near-identical cards.
 */
function toTool(pair: FormatPair): Tool {
  const notes = caveats(pair);

  return {
    slug: pair.slug,
    name: pair.title,
    category: "image",
    description: `Convert ${pair.from.label} to ${pair.to.label} in your browser. Free, no upload, no signup.`,
    keywords: [...new Set([...pair.keywords, `${pair.title.toLowerCase()} converter`])],
    icon: ArrowRightLeft,
    processing: "client",
    status: "live",
    searchOnly: true,
    steps: [
      `Drop in a ${pair.from.label} file — it is read by your browser, not uploaded.`,
      `It is decoded and re-encoded as ${pair.to.label} on your own device.`,
      "Download the result. Nothing is stored anywhere.",
    ],
    notes: [
      `${pair.from.label} is ${pair.from.fullName}. ${pair.from.strength} ${pair.from.weakness}`,
      `${pair.to.label} is ${pair.to.fullName}. ${pair.to.strength} ${pair.to.weakness}`,
      notes.length > 0
        ? `What changes in this conversion: ${notes.join(" ")}`
        : `Both formats store the full image, so this conversion changes the container rather than the picture. File size will differ — that is the point of converting — but nothing visible is discarded.`,
      "The whole conversion happens on a canvas in your own browser. The file is read from disk with the File API, decoded, redrawn and re-encoded locally, so it is never uploaded and there is no size limit beyond your device's memory.",
    ],
    faq: [
      {
        question: `How do I convert ${pair.from.label} to ${pair.to.label}?`,
        answer: `Drop your ${pair.from.label} file onto this page and the ${pair.to.label} version is produced immediately, in your browser. There is no upload, no queue and no account — the conversion runs on your own device using the canvas API.`,
      },
      {
        question: `Does converting ${pair.from.label} to ${pair.to.label} lose quality?`,
        answer:
          notes.find((note) => note.includes("discards detail")) ??
          (pair.to.lossy
            ? `${pair.to.label} is a lossy format, so some detail is discarded when re-encoding. At high quality the difference is invisible at normal viewing size, but keep your original if you may need to edit it later.`
            : `${pair.to.label} is lossless, so nothing further is discarded during the conversion itself. Anything already lost by ${pair.from.label}'s own compression cannot be recovered.`),
      },
      {
        question: `Is my ${pair.from.label} file uploaded to a server?`,
        answer: `No. The file is read by your browser, decoded and re-encoded on your device, and handed straight back. Nothing is transmitted, which matters when the image is a document, a screenshot of something private, or a photograph with location data in it.`,
      },
      {
        question: `Why would I convert ${pair.from.label} to ${pair.to.label}?`,
        answer: `${pair.to.strength} That is usually the reason. ${pair.from.weakness}`,
      },
    ],
  };
}

export const imagePairTools: readonly Tool[] = formatPairs.map(toTool);
