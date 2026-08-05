import type { LucideIcon } from "lucide-react";
import {
  AlignLeft,
  Banknote,
  Binary,
  Bot,
  Braces,
  CalendarDays,
  Clock,
  Dices,
  FileCode2,
  FileSpreadsheet,
  Fingerprint,
  Flame,
  Gauge,
  Hash,
  KeyRound,
  Landmark,
  Link2,
  Monitor,
  Network,
  Percent,
  Pipette,
  QrCode,
  Receipt,
  Regex,
  Ruler,
  Scale,
  SquareCode,
  Tags,
  Timer,
  TrendingUp,
} from "lucide-react";

import type { ToolCategory } from "@/config/categories";
import { categories } from "@/config/categories";

export type { ToolCategory };

export interface Tool {
  /** URL segment. Combined with the category: "compress-pdf" -> /pdf/compress-pdf */
  slug: string;
  name: string;
  category: ToolCategory;
  /** Used on cards and as the page meta description. Keep under ~155 chars. */
  description: string;
  /** Long-tail SEO keywords, also indexed by the ⌘K palette. */
  keywords: string[];
  icon: LucideIcon;
  /** Where the work happens. See §4.4 — client wherever it is possible. */
  processing: "client" | "server";
  status: "live" | "soon";
  /** Rendered as "How it works" and emitted as `HowTo` JSON-LD. */
  steps?: string[];
  /** Surfaced in the homepage "Popular tools" rail. */
  popular?: boolean;
}

/* --------------------------------------------------------------------------
 * Live tools — each owns a folder in src/tools/<slug>/ and exports its
 * registry entry from meta.ts. `pnpm new:tool` appends to both lists below.
 * ----------------------------------------------------------------------- */

import { compressPdf } from "@/tools/compress-pdf/meta";
import { jpgToPdf } from "@/tools/jpg-to-pdf/meta";
import { mergePdf } from "@/tools/merge-pdf/meta";
import { pdfToJpg } from "@/tools/pdf-to-jpg/meta";
import { pdfToWord } from "@/tools/pdf-to-word/meta";
import { splitPdf } from "@/tools/split-pdf/meta";
import { wordToPdf } from "@/tools/word-to-pdf/meta";

import { compressImage } from "@/tools/compress-image/meta";
import { convertImage } from "@/tools/convert-image/meta";
import { cropImage } from "@/tools/crop-image/meta";
import { removeBackground } from "@/tools/remove-background/meta";
import { resizeImage } from "@/tools/resize-image/meta";
import { watermarkImage } from "@/tools/watermark-image/meta";

import { caseConverter } from "@/tools/case-converter/meta";
import { characterCounter } from "@/tools/character-counter/meta";
import { removeDuplicateLines } from "@/tools/remove-duplicate-lines/meta";
import { textDiff } from "@/tools/text-diff/meta";
import { wordCounter } from "@/tools/word-counter/meta";

const liveTools: readonly Tool[] = [
  mergePdf,
  splitPdf,
  compressPdf,
  pdfToWord,
  pdfToJpg,
  wordToPdf,
  jpgToPdf,

  compressImage,
  resizeImage,
  convertImage,
  cropImage,
  watermarkImage,
  removeBackground,

  wordCounter,
  characterCounter,
  caseConverter,
  removeDuplicateLines,
  textDiff,
];

/* --------------------------------------------------------------------------
 * Planned tools — registered from day one so the directory reads as complete
 * and every page is crawlable. They render a "coming soon" state until a
 * folder exists, at which point they move into the list above.
 * ----------------------------------------------------------------------- */

const plannedTools: readonly Tool[] = [
  // Phase 2 — Developer
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "developer",
    description: "Format, validate and minify JSON with clear error positions.",
    keywords: ["json formatter", "json validator", "json beautifier", "prettify json", "minify json"],
    icon: Braces,
    processing: "client",
    status: "soon",
  },
  {
    slug: "base64-encode-decode",
    name: "Base64 Encode / Decode",
    category: "developer",
    description: "Convert text and files to Base64 and back, with URL-safe output.",
    keywords: ["base64 encode", "base64 decode", "base64 converter", "url safe base64"],
    icon: Binary,
    processing: "client",
    status: "soon",
  },
  {
    slug: "url-encode-decode",
    name: "URL Encode / Decode",
    category: "developer",
    description: "Percent-encode and decode URLs, query strings and path segments.",
    keywords: ["url encode", "url decode", "percent encoding", "query string encoder"],
    icon: Link2,
    processing: "client",
    status: "soon",
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    category: "developer",
    description: "Beautify or minify HTML with consistent indentation.",
    keywords: ["html formatter", "html beautifier", "html minifier", "prettify html"],
    icon: FileCode2,
    processing: "client",
    status: "soon",
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    category: "developer",
    description: "Test regular expressions live with match highlighting and capture groups.",
    keywords: ["regex tester", "regular expression tester", "regex match", "regexp online"],
    icon: Regex,
    processing: "client",
    status: "soon",
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    category: "developer",
    description: "Pick colors and convert between HEX, RGB, HSL and OKLCH.",
    keywords: ["color picker", "hex to rgb", "rgb to hex", "hsl converter", "color converter"],
    icon: Pipette,
    processing: "client",
    status: "soon",
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "developer",
    description: "Generate v4 and v7 UUIDs in bulk, ready to copy.",
    keywords: ["uuid generator", "guid generator", "uuid v4", "uuid v7", "random id"],
    icon: Fingerprint,
    processing: "client",
    status: "soon",
  },
  {
    slug: "markdown-to-html",
    name: "Markdown to HTML",
    category: "developer",
    description: "Convert Markdown to clean, semantic HTML with a live preview.",
    keywords: ["markdown to html", "md to html", "markdown converter", "markdown preview"],
    icon: SquareCode,
    processing: "client",
    status: "soon",
  },

  // Phase 2 — Converter
  {
    slug: "unit-converter",
    name: "Unit Converter",
    category: "converter",
    description: "Convert length, weight, volume, temperature, area and speed.",
    keywords: ["unit converter", "metric to imperial", "length converter", "weight converter"],
    icon: Ruler,
    processing: "client",
    status: "soon",
  },
  {
    slug: "currency-converter",
    name: "Currency Converter",
    category: "converter",
    description: "Convert between world currencies using live exchange rates.",
    keywords: ["currency converter", "exchange rate", "usd to eur", "live forex rates"],
    icon: Banknote,
    // Rates come from an upstream API; the route caches and proxies them so the
    // key never reaches the browser.
    processing: "server",
    status: "soon",
  },
  {
    slug: "timezone-converter",
    name: "Timezone Converter",
    category: "converter",
    description: "Compare times across cities and plan meetings across zones.",
    keywords: ["timezone converter", "time zone calculator", "utc converter", "meeting planner"],
    icon: Clock,
    processing: "client",
    status: "soon",
  },
  {
    slug: "number-base-converter",
    name: "Number Base Converter",
    category: "converter",
    description: "Convert between binary, octal, decimal, hexadecimal and any base.",
    keywords: ["binary to decimal", "hex converter", "number base converter", "octal converter"],
    icon: Hash,
    processing: "client",
    status: "soon",
  },

  // Phase 3 — Calculator
  {
    slug: "loan-calculator",
    name: "Loan & EMI Calculator",
    category: "calculator",
    description: "Work out monthly payments, total interest and a full amortisation schedule.",
    keywords: ["loan calculator", "emi calculator", "mortgage calculator", "amortisation schedule"],
    icon: Landmark,
    processing: "client",
    status: "soon",
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: "calculator",
    description: "Project savings growth with regular contributions and compounding.",
    keywords: ["compound interest calculator", "investment growth", "savings calculator"],
    icon: TrendingUp,
    processing: "client",
    status: "soon",
  },
  {
    slug: "tax-calculator",
    name: "Tax Calculator",
    category: "calculator",
    description: "Estimate income tax and take-home pay from gross salary.",
    keywords: ["tax calculator", "income tax", "salary calculator", "take home pay"],
    icon: Receipt,
    processing: "client",
    status: "soon",
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "calculator",
    description: "Calculate body mass index in metric or imperial units.",
    keywords: ["bmi calculator", "body mass index", "healthy weight calculator"],
    icon: Scale,
    processing: "client",
    status: "soon",
  },
  {
    slug: "calorie-calculator",
    name: "Calorie Calculator",
    category: "calculator",
    description: "Estimate daily calorie needs from BMR and activity level.",
    keywords: ["calorie calculator", "tdee calculator", "bmr calculator", "daily calories"],
    icon: Flame,
    processing: "client",
    status: "soon",
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "calculator",
    description: "Find exact age in years, months, days — and the next birthday.",
    keywords: ["age calculator", "date of birth calculator", "how old am i"],
    icon: CalendarDays,
    processing: "client",
    status: "soon",
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "calculator",
    description: "Percentage of a number, increase, decrease and difference.",
    keywords: ["percentage calculator", "percent increase", "percent difference", "discount calculator"],
    icon: Percent,
    processing: "client",
    status: "soon",
  },
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    category: "calculator",
    description: "Build a clean invoice with line items and tax, then export as PDF.",
    keywords: ["invoice generator", "free invoice maker", "invoice template", "invoice pdf"],
    icon: FileSpreadsheet,
    processing: "client",
    status: "soon",
  },

  // Phase 3 — SEO
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    category: "seo",
    description: "Generate title, description, Open Graph and Twitter card tags.",
    keywords: ["meta tag generator", "open graph generator", "twitter card generator", "seo tags"],
    icon: Tags,
    processing: "client",
    status: "soon",
  },
  {
    slug: "keyword-density-checker",
    name: "Word Density Checker",
    category: "seo",
    description: "Analyse keyword frequency and density in any block of content.",
    keywords: ["keyword density checker", "word density", "keyword frequency", "content analysis"],
    icon: Gauge,
    processing: "client",
    status: "soon",
  },
  {
    slug: "robots-txt-generator",
    name: "Robots.txt Generator",
    category: "seo",
    description: "Build a valid robots.txt with per-crawler allow and disallow rules.",
    keywords: ["robots txt generator", "robots file", "crawler rules", "disallow generator"],
    icon: Bot,
    processing: "client",
    status: "soon",
  },
  {
    slug: "sitemap-generator",
    name: "Sitemap Generator",
    category: "seo",
    description: "Turn a list of URLs into a valid XML sitemap with priorities.",
    keywords: ["sitemap generator", "xml sitemap", "sitemap xml creator", "seo sitemap"],
    icon: Network,
    processing: "client",
    status: "soon",
  },

  // Phase 4 — Generator
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "generator",
    description: "Generate strong random passwords with a live strength estimate.",
    keywords: ["password generator", "strong password", "random password", "secure password"],
    icon: KeyRound,
    processing: "client",
    status: "soon",
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    category: "generator",
    description: "Create QR codes for links, text, Wi-Fi and contacts, then download as PNG or SVG.",
    keywords: ["qr code generator", "free qr code", "wifi qr code", "qr code png"],
    icon: QrCode,
    processing: "client",
    status: "soon",
  },
  {
    slug: "fake-data-generator",
    name: "Fake Data Generator",
    category: "generator",
    description: "Generate realistic placeholder records as JSON, CSV or SQL.",
    keywords: ["fake data generator", "mock data", "test data generator", "dummy data json"],
    icon: Dices,
    processing: "client",
    status: "soon",
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    category: "generator",
    description: "Generate placeholder paragraphs, sentences or words.",
    keywords: ["lorem ipsum generator", "placeholder text", "dummy text", "filler text"],
    icon: AlignLeft,
    processing: "client",
    status: "soon",
  },
  {
    slug: "pomodoro-timer",
    name: "Pomodoro Timer",
    category: "generator",
    description: "A focus timer with work and break intervals and gentle alerts.",
    keywords: ["pomodoro timer", "focus timer", "25 minute timer", "productivity timer"],
    icon: Timer,
    processing: "client",
    status: "soon",
  },
  {
    slug: "screen-resolution-checker",
    name: "Screen Resolution Checker",
    category: "generator",
    description: "Detect your screen size, viewport, pixel ratio and colour depth.",
    keywords: ["screen resolution checker", "what is my screen size", "viewport size", "device pixel ratio"],
    icon: Monitor,
    processing: "client",
    status: "soon",
  },
];

/* --------------------------------------------------------------------------
 * Derived views. Everything downstream — homepage grid, category pages, the
 * ⌘K palette, breadcrumbs, sitemap and metadata — reads from these.
 * ----------------------------------------------------------------------- */

export const tools: readonly Tool[] = [...liveTools, ...plannedTools];

export const publishedTools = tools.filter((tool) => tool.status === "live");

const toolByPath = new Map(tools.map((tool) => [`${tool.category}/${tool.slug}`, tool]));

export function getTool(category: string, slug: string): Tool | undefined {
  return toolByPath.get(`${category}/${slug}`);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((tool) => tool.category === category);
}

/** Tool counts keyed by category — used on the homepage category grid. */
export const toolCountByCategory = categories.reduce<Record<ToolCategory, number>>(
  (counts, category) => {
    counts[category.slug] = tools.filter((tool) => tool.category === category.slug).length;
    return counts;
  },
  {} as Record<ToolCategory, number>,
);

export const popularTools = tools.filter((tool) => tool.popular);

/** Same-category siblings, live ones first, for the "related tools" rail. */
export function getRelatedTools(tool: Tool, limit = 4): Tool[] {
  return getToolsByCategory(tool.category)
    .filter((candidate) => candidate.slug !== tool.slug)
    .sort((a, b) => Number(b.status === "live") - Number(a.status === "live"))
    .slice(0, limit);
}

export function toolHref(tool: Pick<Tool, "category" | "slug">): string {
  return `/${tool.category}/${tool.slug}`;
}
