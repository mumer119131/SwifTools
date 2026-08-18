/**
 * The long-form content for each tool — kept out of the registry on purpose.
 *
 * `src/config/tools.ts` is imported by client components: the ⌘K palette, the
 * mega menu, the mobile nav and the homepage directory all need to know every
 * tool's name, slug and keywords. Before this split they also received every
 * tool's prose, because `notes`, `faq` and `steps` were properties of the same
 * objects. That was 440KB of text — roughly 26,000 words of SEO copy — shipped
 * as JavaScript to every visitor on every page, having already been rendered
 * into the HTML server-side. The client never read a word of it.
 *
 * So the prose lives beside each tool in `content.ts` and is collected here.
 * Only server components import this module: the tool page shell, which renders
 * it, and the JSON-LD builders, which emit it. Nothing here reaches the browser
 * as script.
 *
 * `scripts/check-content.ts` asserts the two halves stay in step — every live
 * tool has content, and no client component imports this file.
 */

export interface ToolContent {
  /** Rendered as "How it works" and emitted as `HowTo` JSON-LD. */
  steps?: string[];
  /**
   * Server-rendered explanation, one paragraph per entry.
   *
   * Plain strings rather than JSX on purpose: the tool bodies are loaded with
   * `ssr: false`, so anything written inside them is invisible to a crawler.
   * This is the substance of the page as far as search is concerned.
   */
  notes?: string[];
  /**
   * Questions people actually ask, emitted as `FAQPage` JSON-LD.
   *
   * Only real questions with real answers. "Is it free?" is not a question
   * anyone types into a search engine.
   */
  faq?: { question: string; answer: string }[];
}

const EMPTY: ToolContent = {};

/** Content for one tool, or an empty object when it has none yet. */
export function getToolContent(slug: string): ToolContent {
  return contentBySlug[slug] ?? EMPTY;
}

import { ageCalculatorContent } from "@/tools/age-calculator/content";
import { areaConverterContent } from "@/tools/area-converter/content";
import { asciiArtGeneratorContent } from "@/tools/ascii-art-generator/content";
import { base64EncodeDecodeContent } from "@/tools/base64-encode-decode/content";
import { bingoCardContent } from "@/tools/bingo-card/content";
import { bmiCalculatorContent } from "@/tools/bmi-calculator/content";
import { boxShadowGeneratorContent } from "@/tools/box-shadow-generator/content";
import { budgetTrackerContent } from "@/tools/budget-tracker/content";
import { calorieCalculatorContent } from "@/tools/calorie-calculator/content";
import { calorieTrackerContent } from "@/tools/calorie-tracker/content";
import { capacitorCalculatorContent } from "@/tools/capacitor-calculator/content";
import { caseConverterContent } from "@/tools/case-converter/content";
import { characterCounterContent } from "@/tools/character-counter/content";
import { codeToImageContent } from "@/tools/code-to-image/content";
import { coinFlipperContent } from "@/tools/coin-flipper/content";
import { colorBlindnessSimulatorContent } from "@/tools/color-blindness-simulator/content";
import { colorMixerContent } from "@/tools/color-mixer/content";
import { colorPaletteGeneratorContent } from "@/tools/color-palette-generator/content";
import { colorPickerContent } from "@/tools/color-picker/content";
import { complimentGeneratorContent } from "@/tools/compliment-generator/content";
import { compoundInterestCalculatorContent } from "@/tools/compound-interest-calculator/content";
import { compressImageContent } from "@/tools/compress-image/content";
import { compressPdfContent } from "@/tools/compress-pdf/content";
import { concreteCalculatorContent } from "@/tools/concrete-calculator/content";
import { contrastCheckerContent } from "@/tools/contrast-checker/content";
import { convertImageContent } from "@/tools/convert-image/content";
import { cookingMeasurementConverterContent } from "@/tools/cooking-measurement-converter/content";
import { cronExpressionBuilderContent } from "@/tools/cron-expression-builder/content";
import { cropImageContent } from "@/tools/crop-image/content";
import { crosswordMakerContent } from "@/tools/crossword-maker/content";
import { cssFormatterContent } from "@/tools/css-formatter/content";
import { cssGradientGeneratorContent } from "@/tools/css-gradient-generator/content";
import { cssMinifierContent } from "@/tools/css-minifier/content";
import { csvToJsonContent } from "@/tools/csv-to-json/content";
import { currencyConverterContent } from "@/tools/currency-converter/content";
import { dataConverterContent } from "@/tools/data-converter/content";
import { dateDifferenceCalculatorContent } from "@/tools/date-difference-calculator/content";
import { decisionMakerContent } from "@/tools/decision-maker/content";
import { densityCalculatorContent } from "@/tools/density-calculator/content";
import { diceRollerContent } from "@/tools/dice-roller/content";
import { electricityCostCalculatorContent } from "@/tools/electricity-cost-calculator/content";
import { exifViewerContent } from "@/tools/exif-viewer/content";
import { extractFromTextContent } from "@/tools/extract-from-text/content";
import { fakeDataGeneratorContent } from "@/tools/fake-data-generator/content";
import { faviconGeneratorContent } from "@/tools/favicon-generator/content";
import { fenceCalculatorContent } from "@/tools/fence-calculator/content";
import { findAndReplaceContent } from "@/tools/find-and-replace/content";
import { flooringCalculatorContent } from "@/tools/flooring-calculator/content";
import { forceCalculatorContent } from "@/tools/force-calculator/content";
import { frequencyCalculatorContent } from "@/tools/frequency-calculator/content";
import { groceryListContent } from "@/tools/grocery-list/content";
import { habitTrackerContent } from "@/tools/habit-tracker/content";
import { halfLifeCalculatorContent } from "@/tools/half-life-calculator/content";
import { hmacGeneratorContent } from "@/tools/hmac-generator/content";
import { hreflangGeneratorContent } from "@/tools/hreflang-generator/content";
import { htmlEncodeDecodeContent } from "@/tools/html-encode-decode/content";
import { htmlFormatterContent } from "@/tools/html-formatter/content";
import { icebreakerQuestionsContent } from "@/tools/icebreaker-questions/content";
import { imageToBase64Content } from "@/tools/image-to-base64/content";
import { imessageChatGeneratorContent } from "@/tools/imessage-chat-generator/content";
import { instagramDmGeneratorContent } from "@/tools/instagram-dm-generator/content";
import { instagramFiltersContent } from "@/tools/instagram-filters/content";
import { instagramPostGeneratorContent } from "@/tools/instagram-post-generator/content";
import { instagramStoryGeneratorContent } from "@/tools/instagram-story-generator/content";
import { invoiceGeneratorContent } from "@/tools/invoice-generator/content";
import { jpgToPdfContent } from "@/tools/jpg-to-pdf/content";
import { jsFormatterContent } from "@/tools/js-formatter/content";
import { jsMinifierContent } from "@/tools/js-minifier/content";
import { jsonFormatterContent } from "@/tools/json-formatter/content";
import { jsonToTypescriptContent } from "@/tools/json-to-typescript/content";
import { jsonTreeViewerContent } from "@/tools/json-tree-viewer/content";
import { jwtDecoderContent } from "@/tools/jwt-decoder/content";
import { keywordDensityCheckerContent } from "@/tools/keyword-density-checker/content";
import { kineticEnergyCalculatorContent } from "@/tools/kinetic-energy-calculator/content";
import { ledResistorCalculatorContent } from "@/tools/led-resistor-calculator/content";
import { lengthConverterContent } from "@/tools/length-converter/content";
import { listRandomizerContent } from "@/tools/list-randomizer/content";
import { loanCalculatorContent } from "@/tools/loan-calculator/content";
import { loremIpsumGeneratorContent } from "@/tools/lorem-ipsum-generator/content";
import { markdownToHtmlContent } from "@/tools/markdown-to-html/content";
import { md5HashGeneratorContent } from "@/tools/md5-hash-generator/content";
import { mealPlannerContent } from "@/tools/meal-planner/content";
import { memeGeneratorContent } from "@/tools/meme-generator/content";
import { memoryGameContent } from "@/tools/memory-game/content";
import { mergePdfContent } from "@/tools/merge-pdf/content";
import { metaTagGeneratorContent } from "@/tools/meta-tag-generator/content";
import { molecularWeightCalculatorContent } from "@/tools/molecular-weight-calculator/content";
import { movingChecklistContent } from "@/tools/moving-checklist/content";
import { nicknameGeneratorContent } from "@/tools/nickname-generator/content";
import { numberBaseConverterContent } from "@/tools/number-base-converter/content";
import { ohmsLawCalculatorContent } from "@/tools/ohms-law-calculator/content";
import { onlineNotepadContent } from "@/tools/online-notepad/content";
import { onlineWhiteboardContent } from "@/tools/online-whiteboard/content";
import { paintCalculatorContent } from "@/tools/paint-calculator/content";
import { passwordGeneratorContent } from "@/tools/password-generator/content";
import { passwordManagerContent } from "@/tools/password-manager/content";
import { pdfToJpgContent } from "@/tools/pdf-to-jpg/content";
import { pdfToWordContent } from "@/tools/pdf-to-word/content";
import { percentageCalculatorContent } from "@/tools/percentage-calculator/content";
import { phCalculatorContent } from "@/tools/ph-calculator/content";
import { pixelFontMakerContent } from "@/tools/pixel-font-maker/content";
import { playStoreScreenshotGeneratorContent } from "@/tools/play-store-screenshot-generator/content";
import { pomodoroTimerContent } from "@/tools/pomodoro-timer/content";
import { pressureCalculatorContent } from "@/tools/pressure-calculator/content";
import { qrCodeGeneratorContent } from "@/tools/qr-code-generator/content";
import { quizBuilderContent } from "@/tools/quiz-builder/content";
import { randomColorGeneratorContent } from "@/tools/random-color-generator/content";
import { randomNameGeneratorContent } from "@/tools/random-name-generator/content";
import { randomNamePickerContent } from "@/tools/random-name-picker/content";
import { randomNumberGeneratorContent } from "@/tools/random-number-generator/content";
import { reactNativeShadowGeneratorContent } from "@/tools/react-native-shadow-generator/content";
import { recipeScalerContent } from "@/tools/recipe-scaler/content";
import { regexTesterContent } from "@/tools/regex-tester/content";
import { removeBackgroundContent } from "@/tools/remove-background/content";
import { removeDuplicateLinesContent } from "@/tools/remove-duplicate-lines/content";
import { removeLineBreaksContent } from "@/tools/remove-line-breaks/content";
import { resistorColorCodeCalculatorContent } from "@/tools/resistor-color-code-calculator/content";
import { resizeImageContent } from "@/tools/resize-image/content";
import { roastGeneratorContent } from "@/tools/roast-generator/content";
import { robotsTxtGeneratorContent } from "@/tools/robots-txt-generator/content";
import { robotsTxtTesterContent } from "@/tools/robots-txt-tester/content";
import { roomSizeCalculatorContent } from "@/tools/room-size-calculator/content";
import { rotateImageContent } from "@/tools/rotate-image/content";
import { schemaGeneratorContent } from "@/tools/schema-generator/content";
import { screenResolutionCheckerContent } from "@/tools/screen-resolution-checker/content";
import { screenRulerContent } from "@/tools/screen-ruler/content";
import { sha1HashGeneratorContent } from "@/tools/sha1-hash-generator/content";
import { sha224HashGeneratorContent } from "@/tools/sha224-hash-generator/content";
import { sha256HashGeneratorContent } from "@/tools/sha256-hash-generator/content";
import { sha384HashGeneratorContent } from "@/tools/sha384-hash-generator/content";
import { sha512HashGeneratorContent } from "@/tools/sha512-hash-generator/content";
import { significantFiguresCalculatorContent } from "@/tools/significant-figures-calculator/content";
import { sitemapGeneratorContent } from "@/tools/sitemap-generator/content";
import { socialMediaResizerContent } from "@/tools/social-media-resizer/content";
import { solarSavingsCalculatorContent } from "@/tools/solar-savings-calculator/content";
import { sortLinesContent } from "@/tools/sort-lines/content";
import { speedConverterContent } from "@/tools/speed-converter/content";
import { splitPdfContent } from "@/tools/split-pdf/content";
import { sqlFormatterContent } from "@/tools/sql-formatter/content";
import { squareFootageCalculatorContent } from "@/tools/square-footage-calculator/content";
import { stoichiometryCalculatorContent } from "@/tools/stoichiometry-calculator/content";
import { storyPlotGeneratorContent } from "@/tools/story-plot-generator/content";
import { subnetCalculatorContent } from "@/tools/subnet-calculator/content";
import { sudokuGeneratorContent } from "@/tools/sudoku-generator/content";
import { taxCalculatorContent } from "@/tools/tax-calculator/content";
import { teamNameGeneratorContent } from "@/tools/team-name-generator/content";
import { temperatureConverterContent } from "@/tools/temperature-converter/content";
import { textDiffContent } from "@/tools/text-diff/content";
import { thisOrThatContent } from "@/tools/this-or-that/content";
import { tileCalculatorContent } from "@/tools/tile-calculator/content";
import { timeConverterContent } from "@/tools/time-converter/content";
import { timezoneConverterContent } from "@/tools/timezone-converter/content";
import { tipCalculatorContent } from "@/tools/tip-calculator/content";
import { toDoListContent } from "@/tools/to-do-list/content";
import { tournamentBracketContent } from "@/tools/tournament-bracket/content";
import { triviaQuestionsContent } from "@/tools/trivia-questions/content";
import { tweetGeneratorContent } from "@/tools/tweet-generator/content";
import { tweetToImageContent } from "@/tools/tweet-to-image/content";
import { twitterAdRevenueGeneratorContent } from "@/tools/twitter-ad-revenue-generator/content";
import { typingSpeedTestContent } from "@/tools/typing-speed-test/content";
import { unitConverterContent } from "@/tools/unit-converter/content";
import { unitPriceCalculatorContent } from "@/tools/unit-price-calculator/content";
import { unixTimestampConverterContent } from "@/tools/unix-timestamp-converter/content";
import { urlEncodeDecodeContent } from "@/tools/url-encode-decode/content";
import { urlSlugGeneratorContent } from "@/tools/url-slug-generator/content";
import { utmBuilderContent } from "@/tools/utm-builder/content";
import { uuidGeneratorContent } from "@/tools/uuid-generator/content";
import { vimeoThumbnailGrabberContent } from "@/tools/vimeo-thumbnail-grabber/content";
import { voltageDividerCalculatorContent } from "@/tools/voltage-divider-calculator/content";
import { volumeConverterContent } from "@/tools/volume-converter/content";
import { wallpaperCalculatorContent } from "@/tools/wallpaper-calculator/content";
import { waterBillCalculatorContent } from "@/tools/water-bill-calculator/content";
import { watermarkImageContent } from "@/tools/watermark-image/content";
import { weightConverterContent } from "@/tools/weight-converter/content";
import { whatsappChatGeneratorContent } from "@/tools/whatsapp-chat-generator/content";
import { wheelSpinnerContent } from "@/tools/wheel-spinner/content";
import { wordCounterContent } from "@/tools/word-counter/content";
import { wordSearchContent } from "@/tools/word-search/content";
import { wordToPdfContent } from "@/tools/word-to-pdf/content";
import { yamlToJsonContent } from "@/tools/yaml-to-json/content";
import { youtubeThumbnailGrabberContent } from "@/tools/youtube-thumbnail-grabber/content";
import { imagePairContent } from "@/tools/image-pairs/content";
import { barcodeGeneratorContent } from "@/tools/barcode-generator/content";
import { hoursCalculatorContent } from "@/tools/hours-calculator/content";
import { aspectRatioCalculatorContent } from "@/tools/aspect-ratio-calculator/content";
import { imageColorPickerContent } from "@/tools/image-color-picker/content";
import { paceCalculatorContent } from "@/tools/pace-calculator/content";
import { passwordStrengthCheckerContent } from "@/tools/password-strength-checker/content";
import { mortgageCalculatorContent } from "@/tools/mortgage-calculator/content";
import { vatCalculatorContent } from "@/tools/vat-calculator/content";
import { watermarkPdfContent } from "@/tools/watermark-pdf/content";
import { organizePdfContent } from "@/tools/organize-pdf/content";
import { signPdfContent } from "@/tools/sign-pdf/content";
import { timerContent } from "@/tools/timer/content";
import { unitPairContent } from "@/tools/unit-pairs/content";

export const contentBySlug: Record<string, ToolContent> = {
  "age-calculator": ageCalculatorContent,
  "area-converter": areaConverterContent,
  "ascii-art-generator": asciiArtGeneratorContent,
  "base64-encode-decode": base64EncodeDecodeContent,
  "bingo-card": bingoCardContent,
  "bmi-calculator": bmiCalculatorContent,
  "box-shadow-generator": boxShadowGeneratorContent,
  "budget-tracker": budgetTrackerContent,
  "calorie-calculator": calorieCalculatorContent,
  "calorie-tracker": calorieTrackerContent,
  "capacitor-calculator": capacitorCalculatorContent,
  "case-converter": caseConverterContent,
  "character-counter": characterCounterContent,
  "code-to-image": codeToImageContent,
  "coin-flipper": coinFlipperContent,
  "color-blindness-simulator": colorBlindnessSimulatorContent,
  "color-mixer": colorMixerContent,
  "color-palette-generator": colorPaletteGeneratorContent,
  "color-picker": colorPickerContent,
  "compliment-generator": complimentGeneratorContent,
  "compound-interest-calculator": compoundInterestCalculatorContent,
  "compress-image": compressImageContent,
  "compress-pdf": compressPdfContent,
  "concrete-calculator": concreteCalculatorContent,
  "contrast-checker": contrastCheckerContent,
  "convert-image": convertImageContent,
  "cooking-measurement-converter": cookingMeasurementConverterContent,
  "cron-expression-builder": cronExpressionBuilderContent,
  "crop-image": cropImageContent,
  "crossword-maker": crosswordMakerContent,
  "css-formatter": cssFormatterContent,
  "css-gradient-generator": cssGradientGeneratorContent,
  "css-minifier": cssMinifierContent,
  "csv-to-json": csvToJsonContent,
  "currency-converter": currencyConverterContent,
  "data-converter": dataConverterContent,
  "date-difference-calculator": dateDifferenceCalculatorContent,
  "decision-maker": decisionMakerContent,
  "density-calculator": densityCalculatorContent,
  "dice-roller": diceRollerContent,
  "electricity-cost-calculator": electricityCostCalculatorContent,
  "exif-viewer": exifViewerContent,
  "extract-from-text": extractFromTextContent,
  "fake-data-generator": fakeDataGeneratorContent,
  "favicon-generator": faviconGeneratorContent,
  "fence-calculator": fenceCalculatorContent,
  "find-and-replace": findAndReplaceContent,
  "flooring-calculator": flooringCalculatorContent,
  "force-calculator": forceCalculatorContent,
  "frequency-calculator": frequencyCalculatorContent,
  "grocery-list": groceryListContent,
  "habit-tracker": habitTrackerContent,
  "half-life-calculator": halfLifeCalculatorContent,
  "hmac-generator": hmacGeneratorContent,
  "hreflang-generator": hreflangGeneratorContent,
  "html-encode-decode": htmlEncodeDecodeContent,
  "html-formatter": htmlFormatterContent,
  "icebreaker-questions": icebreakerQuestionsContent,
  "image-to-base64": imageToBase64Content,
  "imessage-chat-generator": imessageChatGeneratorContent,
  "instagram-dm-generator": instagramDmGeneratorContent,
  "instagram-filters": instagramFiltersContent,
  "instagram-post-generator": instagramPostGeneratorContent,
  "instagram-story-generator": instagramStoryGeneratorContent,
  "invoice-generator": invoiceGeneratorContent,
  "jpg-to-pdf": jpgToPdfContent,
  "js-formatter": jsFormatterContent,
  "js-minifier": jsMinifierContent,
  "json-formatter": jsonFormatterContent,
  "json-to-typescript": jsonToTypescriptContent,
  "json-tree-viewer": jsonTreeViewerContent,
  "jwt-decoder": jwtDecoderContent,
  "keyword-density-checker": keywordDensityCheckerContent,
  "kinetic-energy-calculator": kineticEnergyCalculatorContent,
  "led-resistor-calculator": ledResistorCalculatorContent,
  "length-converter": lengthConverterContent,
  "list-randomizer": listRandomizerContent,
  "loan-calculator": loanCalculatorContent,
  "lorem-ipsum-generator": loremIpsumGeneratorContent,
  "markdown-to-html": markdownToHtmlContent,
  "md5-hash-generator": md5HashGeneratorContent,
  "meal-planner": mealPlannerContent,
  "meme-generator": memeGeneratorContent,
  "memory-game": memoryGameContent,
  "merge-pdf": mergePdfContent,
  "meta-tag-generator": metaTagGeneratorContent,
  "molecular-weight-calculator": molecularWeightCalculatorContent,
  "moving-checklist": movingChecklistContent,
  "nickname-generator": nicknameGeneratorContent,
  "number-base-converter": numberBaseConverterContent,
  "ohms-law-calculator": ohmsLawCalculatorContent,
  "online-notepad": onlineNotepadContent,
  "online-whiteboard": onlineWhiteboardContent,
  "paint-calculator": paintCalculatorContent,
  "password-generator": passwordGeneratorContent,
  "password-manager": passwordManagerContent,
  "pdf-to-jpg": pdfToJpgContent,
  "pdf-to-word": pdfToWordContent,
  "percentage-calculator": percentageCalculatorContent,
  "ph-calculator": phCalculatorContent,
  "pixel-font-maker": pixelFontMakerContent,
  "play-store-screenshot-generator": playStoreScreenshotGeneratorContent,
  "pomodoro-timer": pomodoroTimerContent,
  "pressure-calculator": pressureCalculatorContent,
  "qr-code-generator": qrCodeGeneratorContent,
  "quiz-builder": quizBuilderContent,
  "random-color-generator": randomColorGeneratorContent,
  "random-name-generator": randomNameGeneratorContent,
  "random-name-picker": randomNamePickerContent,
  "random-number-generator": randomNumberGeneratorContent,
  "react-native-shadow-generator": reactNativeShadowGeneratorContent,
  "recipe-scaler": recipeScalerContent,
  "regex-tester": regexTesterContent,
  "remove-background": removeBackgroundContent,
  "remove-duplicate-lines": removeDuplicateLinesContent,
  "remove-line-breaks": removeLineBreaksContent,
  "resistor-color-code-calculator": resistorColorCodeCalculatorContent,
  "resize-image": resizeImageContent,
  "roast-generator": roastGeneratorContent,
  "robots-txt-generator": robotsTxtGeneratorContent,
  "robots-txt-tester": robotsTxtTesterContent,
  "room-size-calculator": roomSizeCalculatorContent,
  "rotate-image": rotateImageContent,
  "schema-generator": schemaGeneratorContent,
  "screen-resolution-checker": screenResolutionCheckerContent,
  "screen-ruler": screenRulerContent,
  "sha1-hash-generator": sha1HashGeneratorContent,
  "sha224-hash-generator": sha224HashGeneratorContent,
  "sha256-hash-generator": sha256HashGeneratorContent,
  "sha384-hash-generator": sha384HashGeneratorContent,
  "sha512-hash-generator": sha512HashGeneratorContent,
  "significant-figures-calculator": significantFiguresCalculatorContent,
  "sitemap-generator": sitemapGeneratorContent,
  "social-media-resizer": socialMediaResizerContent,
  "solar-savings-calculator": solarSavingsCalculatorContent,
  "sort-lines": sortLinesContent,
  "speed-converter": speedConverterContent,
  "split-pdf": splitPdfContent,
  "sql-formatter": sqlFormatterContent,
  "square-footage-calculator": squareFootageCalculatorContent,
  "stoichiometry-calculator": stoichiometryCalculatorContent,
  "story-plot-generator": storyPlotGeneratorContent,
  "subnet-calculator": subnetCalculatorContent,
  "sudoku-generator": sudokuGeneratorContent,
  "tax-calculator": taxCalculatorContent,
  "team-name-generator": teamNameGeneratorContent,
  "temperature-converter": temperatureConverterContent,
  "text-diff": textDiffContent,
  "this-or-that": thisOrThatContent,
  "tile-calculator": tileCalculatorContent,
  "time-converter": timeConverterContent,
  "timezone-converter": timezoneConverterContent,
  "tip-calculator": tipCalculatorContent,
  "to-do-list": toDoListContent,
  "tournament-bracket": tournamentBracketContent,
  "trivia-questions": triviaQuestionsContent,
  "tweet-generator": tweetGeneratorContent,
  "tweet-to-image": tweetToImageContent,
  "twitter-ad-revenue-generator": twitterAdRevenueGeneratorContent,
  "typing-speed-test": typingSpeedTestContent,
  "unit-converter": unitConverterContent,
  "unit-price-calculator": unitPriceCalculatorContent,
  "unix-timestamp-converter": unixTimestampConverterContent,
  "url-encode-decode": urlEncodeDecodeContent,
  "url-slug-generator": urlSlugGeneratorContent,
  "utm-builder": utmBuilderContent,
  "uuid-generator": uuidGeneratorContent,
  "vimeo-thumbnail-grabber": vimeoThumbnailGrabberContent,
  "voltage-divider-calculator": voltageDividerCalculatorContent,
  "volume-converter": volumeConverterContent,
  "wallpaper-calculator": wallpaperCalculatorContent,
  "water-bill-calculator": waterBillCalculatorContent,
  "watermark-image": watermarkImageContent,
  "weight-converter": weightConverterContent,
  "whatsapp-chat-generator": whatsappChatGeneratorContent,
  "wheel-spinner": wheelSpinnerContent,
  "word-counter": wordCounterContent,
  "word-search": wordSearchContent,
  "word-to-pdf": wordToPdfContent,
  "yaml-to-json": yamlToJsonContent,
  "youtube-thumbnail-grabber": youtubeThumbnailGrabberContent,
  // The unit pair pages are generated, so their content is too.
  "barcode-generator": barcodeGeneratorContent,
  "hours-calculator": hoursCalculatorContent,
  "mortgage-calculator": mortgageCalculatorContent,
  "vat-calculator": vatCalculatorContent,
  "watermark-pdf": watermarkPdfContent,
  "image-color-picker": imageColorPickerContent,
  "aspect-ratio-calculator": aspectRatioCalculatorContent,
  "password-strength-checker": passwordStrengthCheckerContent,
  "pace-calculator": paceCalculatorContent,
  "organize-pdf": organizePdfContent,
  "sign-pdf": signPdfContent,
  "timer": timerContent,
  ...imagePairContent,
  ...unitPairContent,
};
