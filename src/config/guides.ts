import type { LucideIcon } from "lucide-react";
import { FileDown, FileText, ImageIcon, KeyRound, LayoutGrid, Palette, ShieldCheck } from "lucide-react";

/**
 * The guides registry.
 *
 * Guides exist to answer the questions people ask *before* they know which tool
 * they need — "png or jpg", "what size is an Instagram post", "how do I get
 * this under 5MB". A tool page cannot rank for those without becoming a worse
 * tool page, and a visitor who arrives on one is a visitor with a job to do.
 *
 * Kept deliberately separate from the prose, the same way `tools.ts` is: the
 * registry is small and structural, the writing lives in `content.tsx` beside
 * each guide and is rendered server-side only. See `@/config/tool-content` for
 * why that split matters.
 */
export interface Guide {
  slug: string;
  title: string;
  /** The <h1>, which can be longer and more natural than the nav title. */
  heading: string;
  description: string;
  keywords: string[];
  icon: LucideIcon;
  /** ISO date. Used for `datePublished` and the sitemap. */
  published: string;
  updated: string;
  /** Roughly how long it takes to read, in minutes. */
  minutes: number;
  /**
   * Tools this guide is the front door for.
   *
   * Rendered as a "tools mentioned" rail, and used to link the two directions:
   * a guide that sends nobody to a tool is just an article.
   */
  tools: string[];
}

export const guides: Guide[] = [
  {
    slug: "image-formats",
    title: "Choosing an image format",
    heading: "PNG, JPG, WebP or AVIF: which should you use?",
    description:
      "A straight answer for each kind of image — photographs, logos, screenshots, transparency — and what each format costs you.",
    keywords: [
      "png vs jpg",
      "webp vs png",
      "jpg vs jpeg",
      "avif vs webp",
      "best image format for web",
      "which image format should i use",
      "png or jpg for photos",
      "image format comparison",
    ],
    icon: ImageIcon,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 7,
    tools: [
      "png-to-jpg",
      "jpg-to-png",
      "png-to-webp",
      "webp-to-png",
      "heic-to-jpg",
      "svg-to-png",
      "convert-image",
      "compress-image",
    ],
  },
  {
    slug: "social-media-image-sizes",
    title: "Social media image sizes",
    heading: "Every social media image size, and why they keep changing",
    description:
      "Current upload dimensions for Instagram, X, LinkedIn, Facebook, YouTube, TikTok and Pinterest — plus how to crop without losing the subject.",
    // Deliberately broad. The specific placement queries — "instagram post
    // size", "youtube thumbnail size" — belong to the resizer, which can
    // actually do the job; a guide bidding for them would put two of our own
    // pages against each other. check-guides.ts enforces the divide.
    keywords: [
      "social media image sizes",
      "social media image dimensions",
      "social media aspect ratios",
      "what size should social media images be",
      "image sizes for every platform",
      "social media size guide",
      "why do social media image sizes change",
    ],
    icon: LayoutGrid,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 6,
    tools: ["social-media-resizer", "crop-image", "resize-image", "play-store-screenshot-generator"],
  },
  {
    slug: "reduce-file-size",
    title: "Making a file smaller",
    heading: "How to get a file under the size limit",
    description:
      "What actually makes a PDF or an image large, which lever to pull first, and how to lose the least quality doing it.",
    keywords: [
      "reduce file size",
      "how to compress a file",
      "email attachment too large",
      "file too large to upload",
      "compress pdf under 5mb",
      "make image smaller",
      "reduce photo file size",
      "resize or compress first",
    ],
    icon: FileDown,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 6,
    tools: ["compress-image", "resize-image", "compress-pdf", "convert-image", "split-pdf"],
  },
  {
    slug: "online-tool-privacy",
    title: "Are online tools safe?",
    heading: "What actually happens to a file you put into an online tool",
    description:
      "Most converters upload your file to a server you know nothing about. Some do not need to \u2014 here is how to tell the difference, and how to check for yourself.",
    keywords: [
      "are online converters safe",
      "do online tools upload my files",
      "is it safe to upload documents online",
      "online pdf converter privacy",
      "client side file processing",
      "browser based tools privacy",
      "what happens to files i upload",
    ],
    icon: ShieldCheck,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 7,
    tools: ["exif-viewer", "compress-pdf", "merge-pdf", "compress-image", "password-generator"],
  },
  {
    slug: "hashing-encoding-encryption",
    title: "Hashing, encoding and encryption",
    heading: "Hashing, encoding and encryption are three different things",
    description:
      "Base64 is not encryption, a hash is not reversible, and confusing them is how credentials end up in plain sight. What each one is actually for.",
    keywords: [
      "encoding vs encryption",
      "is base64 encryption",
      "hashing vs encryption",
      "what is a hash",
      "difference between hashing and encoding",
      "is md5 secure",
      "why can't you decrypt a hash",
    ],
    icon: KeyRound,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 8,
    tools: [
      "sha256-hash-generator",
      "md5-hash-generator",
      "base64-encode-decode",
      "hmac-generator",
      "jwt-decoder",
      "password-generator",
    ],
  },
  {
    slug: "pdf-basics",
    title: "Working with PDFs",
    heading: "Why PDFs behave the way they do",
    description:
      "Why the text will not copy, why the file is 40MB, why editing one is awkward \u2014 and what to do about each.",
    keywords: [
      "how do pdfs work",
      "why is my pdf so big",
      "why can't i copy text from a pdf",
      "scanned pdf vs text pdf",
      "pdf explained",
      "why are pdfs hard to edit",
    ],
    icon: FileText,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 6,
    tools: ["merge-pdf", "split-pdf", "compress-pdf", "pdf-to-word", "pdf-to-jpg", "jpg-to-pdf"],
  },
  {
    slug: "colour-formats",
    title: "Colour on the web",
    heading: "HEX, RGB, HSL and OKLCH: which colour format to use",
    description:
      "Four ways to write the same colour, and why the newest one finally makes lightness mean what you expect.",
    keywords: [
      "hex vs rgb",
      "what is hsl",
      "oklch colour",
      "css colour formats",
      "how do hex colours work",
      "rgb vs hsl",
      "which colour format should i use",
    ],
    icon: Palette,
    published: "2026-08-18",
    updated: "2026-08-18",
    minutes: 6,
    tools: ["color-picker", "color-palette-generator", "color-mixer", "contrast-checker"],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function guideHref(guide: Pick<Guide, "slug">): string {
  return `/guides/${guide.slug}`;
}
