import type { LucideIcon } from "lucide-react";

import { relatedTools } from "@/lib/related";

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
  /**
   * Server-rendered explanation, one paragraph per entry.
   *
   * Plain strings rather than JSX on purpose: the tool bodies are loaded with
   * `ssr: false`, so anything written inside them is invisible to a crawler.
   * This is the substance of the page as far as search is concerned — the part
   * that says why the number is what it is, or what the tool gets right that a
   * naive version gets wrong.
   */
  notes?: string[];
  /**
   * Questions people actually ask about this tool, emitted as `FAQPage`
   * JSON-LD and rendered on the page.
   *
   * Only real questions with real answers. "Is it free?" is not a question
   * anyone types into a search engine, and padding the schema with filler is
   * the fastest way to have it ignored.
   */
  faq?: { question: string; answer: string }[];
  /** Surfaced in the homepage "Popular tools" rail. */
  popular?: boolean;
  /**
   * Reachable and indexed, but kept out of the browse surfaces — the category
   * grid, footer, mega menu and the ⌘K list before you type.
   *
   * The unit pair pages use this. All ~64 of them deserve to rank for their own
   * query, but listing every one would bury the nine tools people actually
   * browse for behind a wall of near-identical cards.
   */
  searchOnly?: boolean;
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
import { faviconGenerator } from "@/tools/favicon-generator/meta";
import { playStoreScreenshotGenerator } from "@/tools/play-store-screenshot-generator/meta";
import { watermarkImage } from "@/tools/watermark-image/meta";
import { exifViewer } from "@/tools/exif-viewer/meta";
import { imageToBase64 } from "@/tools/image-to-base64/meta";
import { rotateImage } from "@/tools/rotate-image/meta";
import { socialMediaResizer } from "@/tools/social-media-resizer/meta";

// Text
import { caseConverter } from "@/tools/case-converter/meta";
import { extractFromText } from "@/tools/extract-from-text/meta";
import { findAndReplace } from "@/tools/find-and-replace/meta";
import { removeLineBreaks } from "@/tools/remove-line-breaks/meta";
import { sortLines } from "@/tools/sort-lines/meta";
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
import { codeToImage } from "@/tools/code-to-image/meta";
import { boxShadowGenerator } from "@/tools/box-shadow-generator/meta";
import { csvToJson } from "@/tools/csv-to-json/meta";
import { cronExpressionBuilder } from "@/tools/cron-expression-builder/meta";
import { hmacGenerator } from "@/tools/hmac-generator/meta";
import { jsonToTypescript } from "@/tools/json-to-typescript/meta";
import { sqlFormatter } from "@/tools/sql-formatter/meta";
import { subnetCalculator } from "@/tools/subnet-calculator/meta";
import { yamlToJson } from "@/tools/yaml-to-json/meta";
import { cssGradientGenerator } from "@/tools/css-gradient-generator/meta";
import { cssFormatter } from "@/tools/css-formatter/meta";
import { cssMinifier } from "@/tools/css-minifier/meta";
import { jsFormatter } from "@/tools/js-formatter/meta";
import { jsMinifier } from "@/tools/js-minifier/meta";
import { reactNativeShadowGenerator } from "@/tools/react-native-shadow-generator/meta";
import { md5HashGenerator } from "@/tools/md5-hash-generator/meta";
import { sha1HashGenerator } from "@/tools/sha1-hash-generator/meta";
import { sha224HashGenerator } from "@/tools/sha224-hash-generator/meta";
import { sha256HashGenerator } from "@/tools/sha256-hash-generator/meta";
import { sha384HashGenerator } from "@/tools/sha384-hash-generator/meta";
import { sha512HashGenerator } from "@/tools/sha512-hash-generator/meta";

// Color
import { colorMixer } from "@/tools/color-mixer/meta";
import { contrastChecker } from "@/tools/contrast-checker/meta";
import { colorPaletteGenerator } from "@/tools/color-palette-generator/meta";

// Units
import { areaConverter } from "@/tools/area-converter/meta";
import { dataConverter } from "@/tools/data-converter/meta";
import { lengthConverter } from "@/tools/length-converter/meta";
import { speedConverter } from "@/tools/speed-converter/meta";
import { temperatureConverter } from "@/tools/temperature-converter/meta";
import { timeConverter } from "@/tools/time-converter/meta";
import { unitPairTools } from "@/tools/unit-pairs/meta";
import { imagePairTools } from "@/tools/image-pairs/meta";
import { volumeConverter } from "@/tools/volume-converter/meta";
import { weightConverter } from "@/tools/weight-converter/meta";

// Fun & utility
import { asciiArtGenerator } from "@/tools/ascii-art-generator/meta";
import { budgetTracker } from "@/tools/budget-tracker/meta";
import { complimentGenerator } from "@/tools/compliment-generator/meta";
import { habitTracker } from "@/tools/habit-tracker/meta";
import { icebreakerQuestions } from "@/tools/icebreaker-questions/meta";
import { nicknameGenerator } from "@/tools/nickname-generator/meta";
import { onlineNotepad } from "@/tools/online-notepad/meta";
import { passwordManager } from "@/tools/password-manager/meta";
import { pixelFontMaker } from "@/tools/pixel-font-maker/meta";
import { quizBuilder } from "@/tools/quiz-builder/meta";
import { roastGenerator } from "@/tools/roast-generator/meta";
import { screenRuler } from "@/tools/screen-ruler/meta";
import { storyPlotGenerator } from "@/tools/story-plot-generator/meta";
import { teamNameGenerator } from "@/tools/team-name-generator/meta";
import { thisOrThat } from "@/tools/this-or-that/meta";
import { toDoList } from "@/tools/to-do-list/meta";
import { triviaQuestions } from "@/tools/trivia-questions/meta";
import { typingSpeedTest } from "@/tools/typing-speed-test/meta";
import { bingoCard } from "@/tools/bingo-card/meta";
import { coinFlipper } from "@/tools/coin-flipper/meta";
import { colorBlindnessSimulator } from "@/tools/color-blindness-simulator/meta";
import { crosswordMaker } from "@/tools/crossword-maker/meta";
import { decisionMaker } from "@/tools/decision-maker/meta";
import { diceRoller } from "@/tools/dice-roller/meta";
import { listRandomizer } from "@/tools/list-randomizer/meta";
import { memeGenerator } from "@/tools/meme-generator/meta";
import { memoryGame } from "@/tools/memory-game/meta";
import { onlineWhiteboard } from "@/tools/online-whiteboard/meta";
import { randomColorGenerator } from "@/tools/random-color-generator/meta";
import { randomNameGenerator } from "@/tools/random-name-generator/meta";
import { randomNamePicker } from "@/tools/random-name-picker/meta";
import { randomNumberGenerator } from "@/tools/random-number-generator/meta";
import { sudokuGenerator } from "@/tools/sudoku-generator/meta";
import { tournamentBracket } from "@/tools/tournament-bracket/meta";
import { wheelSpinner } from "@/tools/wheel-spinner/meta";
import { wordSearch } from "@/tools/word-search/meta";

// Home & lifestyle
import { calorieTracker } from "@/tools/calorie-tracker/meta";
import { concreteCalculator } from "@/tools/concrete-calculator/meta";
import { cookingMeasurementConverter } from "@/tools/cooking-measurement-converter/meta";
import { electricityCostCalculator } from "@/tools/electricity-cost-calculator/meta";
import { fenceCalculator } from "@/tools/fence-calculator/meta";
import { flooringCalculator } from "@/tools/flooring-calculator/meta";
import { groceryList } from "@/tools/grocery-list/meta";
import { mealPlanner } from "@/tools/meal-planner/meta";
import { movingChecklist } from "@/tools/moving-checklist/meta";
import { paintCalculator } from "@/tools/paint-calculator/meta";
import { recipeScaler } from "@/tools/recipe-scaler/meta";
import { roomSizeCalculator } from "@/tools/room-size-calculator/meta";
import { solarSavingsCalculator } from "@/tools/solar-savings-calculator/meta";
import { squareFootageCalculator } from "@/tools/square-footage-calculator/meta";
import { tileCalculator } from "@/tools/tile-calculator/meta";
import { unitPriceCalculator } from "@/tools/unit-price-calculator/meta";
import { wallpaperCalculator } from "@/tools/wallpaper-calculator/meta";
import { waterBillCalculator } from "@/tools/water-bill-calculator/meta";

// Science & engineering
import { capacitorCalculator } from "@/tools/capacitor-calculator/meta";
import { densityCalculator } from "@/tools/density-calculator/meta";
import { forceCalculator } from "@/tools/force-calculator/meta";
import { frequencyCalculator } from "@/tools/frequency-calculator/meta";
import { halfLifeCalculator } from "@/tools/half-life-calculator/meta";
import { kineticEnergyCalculator } from "@/tools/kinetic-energy-calculator/meta";
import { ledResistorCalculator } from "@/tools/led-resistor-calculator/meta";
import { molecularWeightCalculator } from "@/tools/molecular-weight-calculator/meta";
import { ohmsLawCalculator } from "@/tools/ohms-law-calculator/meta";
import { phCalculator } from "@/tools/ph-calculator/meta";
import { pressureCalculator } from "@/tools/pressure-calculator/meta";
import { resistorColorCodeCalculator } from "@/tools/resistor-color-code-calculator/meta";
import { significantFiguresCalculator } from "@/tools/significant-figures-calculator/meta";
import { stoichiometryCalculator } from "@/tools/stoichiometry-calculator/meta";
import { voltageDividerCalculator } from "@/tools/voltage-divider-calculator/meta";

// Converter
import { currencyConverter } from "@/tools/currency-converter/meta";
import { unixTimestampConverter } from "@/tools/unix-timestamp-converter/meta";
import { numberBaseConverter } from "@/tools/number-base-converter/meta";
import { tipCalculator } from "@/tools/tip-calculator/meta";
import { dateDifferenceCalculator } from "@/tools/date-difference-calculator/meta";
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

// Social
import { imessageChatGenerator } from "@/tools/imessage-chat-generator/meta";
import { instagramDmGenerator } from "@/tools/instagram-dm-generator/meta";
import { instagramFilters } from "@/tools/instagram-filters/meta";
import { instagramPostGenerator } from "@/tools/instagram-post-generator/meta";
import { instagramStoryGenerator } from "@/tools/instagram-story-generator/meta";
import { tweetGenerator } from "@/tools/tweet-generator/meta";
import { tweetToImage } from "@/tools/tweet-to-image/meta";
import { twitterAdRevenueGenerator } from "@/tools/twitter-ad-revenue-generator/meta";
import { vimeoThumbnailGrabber } from "@/tools/vimeo-thumbnail-grabber/meta";
import { whatsappChatGenerator } from "@/tools/whatsapp-chat-generator/meta";
import { youtubeThumbnailGrabber } from "@/tools/youtube-thumbnail-grabber/meta";

// SEO
import { hreflangGenerator } from "@/tools/hreflang-generator/meta";
import { robotsTxtTester } from "@/tools/robots-txt-tester/meta";
import { schemaGenerator } from "@/tools/schema-generator/meta";
import { utmBuilder } from "@/tools/utm-builder/meta";
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
  rotateImage,
  socialMediaResizer,
  watermarkImage,
  removeBackground,
  playStoreScreenshotGenerator,
  faviconGenerator,
  exifViewer,
  imageToBase64,

  // Text
  wordCounter,
  characterCounter,
  caseConverter,
  removeDuplicateLines,
  textDiff,
  findAndReplace,
  sortLines,
  removeLineBreaks,
  extractFromText,

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
  codeToImage,
  jsFormatter,
  jsMinifier,
  cssFormatter,
  cssMinifier,
  cssGradientGenerator,
  boxShadowGenerator,
  csvToJson,
  jsonToTypescript,
  yamlToJson,
  sqlFormatter,
  subnetCalculator,
  cronExpressionBuilder,
  hmacGenerator,
  reactNativeShadowGenerator,
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
  contrastChecker,

  // Units — the hub, then one page per measurement type. The ~64 direct
  // conversion pages are appended after this list; they are search-only.
  unitConverter,
  lengthConverter,
  weightConverter,
  temperatureConverter,
  volumeConverter,
  areaConverter,
  speedConverter,
  dataConverter,
  timeConverter,

  // Converter
  currencyConverter,
  timezoneConverter,
  unixTimestampConverter,
  numberBaseConverter,

  // Calculator
  loanCalculator,
  compoundInterestCalculator,
  taxCalculator,
  bmiCalculator,
  calorieCalculator,
  ageCalculator,
  percentageCalculator,
  tipCalculator,
  dateDifferenceCalculator,
  invoiceGenerator,

  // Social
  tweetGenerator,
  tweetToImage,
  instagramPostGenerator,
  instagramStoryGenerator,
  instagramDmGenerator,
  instagramFilters,
  whatsappChatGenerator,
  imessageChatGenerator,
  youtubeThumbnailGrabber,
  vimeoThumbnailGrabber,
  twitterAdRevenueGenerator,

  // SEO
  metaTagGenerator,
  keywordDensityChecker,
  robotsTxtGenerator,
  sitemapGenerator,
  utmBuilder,
  schemaGenerator,
  robotsTxtTester,
  hreflangGenerator,

  // Generator
  passwordGenerator,
  qrCodeGenerator,
  fakeDataGenerator,
  loremIpsumGenerator,
  pomodoroTimer,
  screenResolutionChecker,

  // Science & engineering
  ohmsLawCalculator,
  voltageDividerCalculator,
  ledResistorCalculator,
  resistorColorCodeCalculator,
  capacitorCalculator,
  frequencyCalculator,
  forceCalculator,
  kineticEnergyCalculator,
  densityCalculator,
  pressureCalculator,
  molecularWeightCalculator,
  stoichiometryCalculator,
  phCalculator,
  halfLifeCalculator,
  significantFiguresCalculator,

  // Home & lifestyle
  squareFootageCalculator,
  roomSizeCalculator,
  paintCalculator,
  flooringCalculator,
  tileCalculator,
  wallpaperCalculator,
  concreteCalculator,
  fenceCalculator,
  electricityCostCalculator,
  waterBillCalculator,
  solarSavingsCalculator,
  unitPriceCalculator,
  cookingMeasurementConverter,
  recipeScaler,
  movingChecklist,
  groceryList,
  mealPlanner,
  calorieTracker,

  // Fun & utility
  wheelSpinner,
  randomNamePicker,
  randomNumberGenerator,
  randomNameGenerator,
  randomColorGenerator,
  coinFlipper,
  diceRoller,
  listRandomizer,
  decisionMaker,
  memeGenerator,
  onlineWhiteboard,
  colorBlindnessSimulator,
  memoryGame,
  sudokuGenerator,
  bingoCard,
  wordSearch,
  crosswordMaker,
  tournamentBracket,

  onlineNotepad,
  toDoList,
  habitTracker,
  budgetTracker,
  typingSpeedTest,
  screenRuler,
  passwordManager,
  quizBuilder,
  triviaQuestions,
  nicknameGenerator,
  teamNameGenerator,
  storyPlotGenerator,
  icebreakerQuestions,
  thisOrThat,
  complimentGenerator,
  roastGenerator,
  asciiArtGenerator,
  pixelFontMaker,

  // Direct conversion pages — generated, and search-only so they stay out of
  // the browse surfaces while remaining indexed and findable.
  ...unitPairTools,
  ...imagePairTools,
];

/* --------------------------------------------------------------------------
 * Derived views. Everything downstream — homepage grid, category pages, the
 * ⌘K palette, breadcrumbs, sitemap and metadata — reads from these.
 * ----------------------------------------------------------------------- */

export const publishedTools = tools.filter((tool) => tool.status === "live");

/**
 * Everything that belongs in a browse surface. Search, the sitemap and
 * `generateStaticParams` all use the full `tools` list instead — a search-only
 * tool is hidden from browsing, not from the web.
 */
export const browsableTools = tools.filter((tool) => !tool.searchOnly);

/**
 * Categories that actually hold something.
 *
 * A category is declared in `categories.ts` before its tools are written, so
 * without this filter an empty shelf ships to production — a nav entry, a
 * sitemap URL and a category page with nothing on it. Every browse surface
 * reads this instead of the raw `categories` list, so a category appears the
 * moment its first tool is registered and not before.
 */
export const populatedCategories = categories.filter((category) =>
  browsableTools.some((tool) => tool.category === category.slug),
);

const toolByPath = new Map(tools.map((tool) => [`${tool.category}/${tool.slug}`, tool]));

export function getTool(category: string, slug: string): Tool | undefined {
  return toolByPath.get(`${category}/${slug}`);
}

/** Browsable tools in a category — what category pages and menus show. */
export function getToolsByCategory(category: ToolCategory): Tool[] {
  return browsableTools.filter((tool) => tool.category === category);
}

/** Including search-only entries. Used for counts and internal linking. */
export function getAllToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((tool) => tool.category === category);
}

/** Tool counts keyed by category — used on the homepage category grid. */
export const toolCountByCategory = categories.reduce<Record<ToolCategory, number>>(
  (counts, category) => {
    counts[category.slug] = browsableTools.filter(
      (tool) => tool.category === category.slug,
    ).length;
    return counts;
  },
  {} as Record<ToolCategory, number>,
);

export const popularTools = tools.filter((tool) => tool.popular);

/**
 * Same-category siblings for the "related tools" rail.
 *
 * Always browsable tools, even for a search-only page — someone who landed on
 * /units/lb-to-kg from a search should be offered the full Weight Converter,
 * not sixty more pair pages.
 */
/**
 * The tools most worth showing next to this one, ranked by keyword overlap.
 *
 * Delegates to `relatedTools`, which holds the scoring. This used to return the
 * first few tools in the category in declaration order, so every tool in a
 * category recommended the same handful and the rest received no internal links
 * at all.
 */
export function getRelatedTools(tool: Tool, limit = 6): Tool[] {
  return relatedTools(tool, tools, limit);
}

export function toolHref(tool: Pick<Tool, "category" | "slug">): string {
  return `/${tool.category}/${tool.slug}`;
}
