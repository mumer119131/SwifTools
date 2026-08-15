import { Stamp } from "lucide-react";

import type { Tool } from "@/config/tools";

export const watermarkImage: Tool = {
  slug: "watermark-image",
  name: "Add Watermark",
  category: "image",
  description: "Stamp text across your images — position, size and opacity all yours.",
  keywords: [
    "add watermark to image",
    "watermark photos online free",
    "text watermark",
    "copyright image",
    "batch watermark images",
  ],
  icon: Stamp,
  processing: "client",
  status: "live",
  steps: [
    "Drop in the images you want to protect — the same watermark is applied to all of them.",
    "Type your text, then set position, size, opacity, colour and rotation. The preview updates live.",
    "Apply and download individually or as a ZIP.",
  ],
  notes: [
    "A watermark is drawn onto the pixels of the image itself, which is the point — it travels with the file wherever it goes and cannot be stripped by removing metadata. Position, size, opacity and rotation are all adjustable, and the preview shows exactly what will be exported.",
    "There is a real trade-off in opacity. A faint watermark is easy to ignore and easy to paint out; a heavy one protects the image and spoils it. The usual compromise is moderate opacity placed diagonally across the middle rather than tucked in a corner, because a corner mark can simply be cropped off.",
    "No visible watermark is unremovable — someone determined with the right tools can reconstruct what is underneath. It is a deterrent and a statement of ownership, not a lock. For proof of authorship, keep the unwatermarked original: you having it and no one else does is stronger evidence than the mark itself.",
  ],
  faq: [
    {
      question: "Where should I place a watermark?",
      answer: "Across the middle, diagonally, rather than in a corner. A corner mark takes one crop to remove. Placing it over the subject means removing it would damage the part of the image people want.",
    },
    {
      question: "What opacity works best?",
      answer: "Around 30 to 50 percent for most images. Low enough that the picture is still enjoyable, high enough that the mark cannot be missed or easily painted out. Test against both the lightest and darkest areas of the image.",
    },
    {
      question: "Can a watermark be removed?",
      answer: "By someone determined, yes — no visible watermark is permanent. It is a deterrent against casual reuse, not protection against a skilled editor. Keep your unwatermarked original as the real evidence of authorship.",
    },
    {
      question: "Can I use my logo as a watermark?",
      answer: "Yes. Upload a PNG with transparency and it is composited over the image with the position, scale and opacity you set. Transparent areas stay transparent.",
    },
    {
      question: "Does watermarking change the original file?",
      answer: "No. The original is read into memory and a new watermarked image is produced for download. The file on your disk is untouched, and nothing is uploaded anywhere.",
    },
  ],
};
