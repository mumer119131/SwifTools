import type { LucideIcon } from "lucide-react";

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
 * The registry.
 *
 * Every tool owns a folder in src/tools/<slug>/ and exports its entry from
 * meta.ts, so a tool's metadata lives beside its implementation instead of
 * drifting in a central list. `pnpm new:tool` appends here automatically.
 * ----------------------------------------------------------------------- */

// PDF
import { compressPdf } from "@/tools/compress-pdf/meta";
import { jpgToPdf } from "@/tools/jpg-to-pdf/meta";
import { mergePdf } from "@/tools/merge-pdf/meta";
import { pdfToJpg } from "@/tools/pdf-to-jpg/meta";
import { pdfToWord } from "@/tools/pdf-to-word/meta";
import { splitPdf } from "@/tools/split-pdf/meta";
import { wordToPdf } from "@/tools/word-to-pdf/meta";

// Image
import { compressImage } from "@/tools/compress-image/meta";
import { convertImage } from "@/tools/convert-image/meta";
import { cropImage } from "@/tools/crop-image/meta";
import { removeBackground } from "@/tools/remove-background/meta";
import { resizeImage } from "@/tools/resize-image/meta";
import { watermarkImage } from "@/tools/watermark-image/meta";

// Text
import { caseConverter } from "@/tools/case-converter/meta";
import { characterCounter } from "@/tools/character-counter/meta";
import { removeDuplicateLines } from "@/tools/remove-duplicate-lines/meta";
import { textDiff } from "@/tools/text-diff/meta";
import { wordCounter } from "@/tools/word-counter/meta";

// Developer
import { base64EncodeDecode } from "@/tools/base64-encode-decode/meta";
import { colorPicker } from "@/tools/color-picker/meta";
import { htmlFormatter } from "@/tools/html-formatter/meta";
import { jsonFormatter } from "@/tools/json-formatter/meta";
import { markdownToHtml } from "@/tools/markdown-to-html/meta";
import { regexTester } from "@/tools/regex-tester/meta";
import { urlEncodeDecode } from "@/tools/url-encode-decode/meta";
import { uuidGenerator } from "@/tools/uuid-generator/meta";
import { htmlEncodeDecode } from "@/tools/html-encode-decode/meta";
import { jsonTreeViewer } from "@/tools/json-tree-viewer/meta";
import { jwtDecoder } from "@/tools/jwt-decoder/meta";
import { urlSlugGenerator } from "@/tools/url-slug-generator/meta";
import { md5HashGenerator } from "@/tools/md5-hash-generator/meta";
import { sha1HashGenerator } from "@/tools/sha1-hash-generator/meta";
import { sha224HashGenerator } from "@/tools/sha224-hash-generator/meta";
import { sha256HashGenerator } from "@/tools/sha256-hash-generator/meta";
import { sha384HashGenerator } from "@/tools/sha384-hash-generator/meta";
import { sha512HashGenerator } from "@/tools/sha512-hash-generator/meta";

// Color
import { colorMixer } from "@/tools/color-mixer/meta";
import { colorPaletteGenerator } from "@/tools/color-palette-generator/meta";

// Converter
import { currencyConverter } from "@/tools/currency-converter/meta";
import { numberBaseConverter } from "@/tools/number-base-converter/meta";
import { timezoneConverter } from "@/tools/timezone-converter/meta";
import { unitConverter } from "@/tools/unit-converter/meta";

// Calculator
import { ageCalculator } from "@/tools/age-calculator/meta";
import { bmiCalculator } from "@/tools/bmi-calculator/meta";
import { calorieCalculator } from "@/tools/calorie-calculator/meta";
import { compoundInterestCalculator } from "@/tools/compound-interest-calculator/meta";
import { invoiceGenerator } from "@/tools/invoice-generator/meta";
import { loanCalculator } from "@/tools/loan-calculator/meta";
import { percentageCalculator } from "@/tools/percentage-calculator/meta";
import { taxCalculator } from "@/tools/tax-calculator/meta";

// SEO
import { keywordDensityChecker } from "@/tools/keyword-density-checker/meta";
import { metaTagGenerator } from "@/tools/meta-tag-generator/meta";
import { robotsTxtGenerator } from "@/tools/robots-txt-generator/meta";
import { sitemapGenerator } from "@/tools/sitemap-generator/meta";

// Generator
import { fakeDataGenerator } from "@/tools/fake-data-generator/meta";
import { loremIpsumGenerator } from "@/tools/lorem-ipsum-generator/meta";
import { passwordGenerator } from "@/tools/password-generator/meta";
import { pomodoroTimer } from "@/tools/pomodoro-timer/meta";
import { qrCodeGenerator } from "@/tools/qr-code-generator/meta";
import { screenResolutionChecker } from "@/tools/screen-resolution-checker/meta";

/**
 * Order within a category is the order shown on category pages and in the ⌘K
 * palette — most-reached-for first, rather than alphabetical.
 */
export const tools: readonly Tool[] = [
  // PDF
  mergePdf,
  splitPdf,
  compressPdf,
  pdfToWord,
  pdfToJpg,
  wordToPdf,
  jpgToPdf,

  // Image
  compressImage,
  resizeImage,
  convertImage,
  cropImage,
  watermarkImage,
  removeBackground,

  // Text
  wordCounter,
  characterCounter,
  caseConverter,
  removeDuplicateLines,
  textDiff,

  // Developer
  jsonFormatter,
  base64EncodeDecode,
  urlEncodeDecode,
  htmlFormatter,
  regexTester,
  jsonTreeViewer,
  jwtDecoder,
  uuidGenerator,
  markdownToHtml,
  htmlEncodeDecode,
  urlSlugGenerator,
  sha256HashGenerator,
  md5HashGenerator,
  sha1HashGenerator,
  sha512HashGenerator,
  sha384HashGenerator,
  sha224HashGenerator,

  // Color
  colorPicker,
  colorPaletteGenerator,
  colorMixer,

  // Converter
  unitConverter,
  currencyConverter,
  timezoneConverter,
  numberBaseConverter,

  // Calculator
  loanCalculator,
  compoundInterestCalculator,
  taxCalculator,
  bmiCalculator,
  calorieCalculator,
  ageCalculator,
  percentageCalculator,
  invoiceGenerator,

  // SEO
  metaTagGenerator,
  keywordDensityChecker,
  robotsTxtGenerator,
  sitemapGenerator,

  // Generator
  passwordGenerator,
  qrCodeGenerator,
  fakeDataGenerator,
  loremIpsumGenerator,
  pomodoroTimer,
  screenResolutionChecker,
];

/* --------------------------------------------------------------------------
 * Derived views. Everything downstream — homepage grid, category pages, the
 * ⌘K palette, breadcrumbs, sitemap and metadata — reads from these.
 * ----------------------------------------------------------------------- */

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
