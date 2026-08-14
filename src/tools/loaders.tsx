"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Clock } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import { getPair } from "@/lib/units";
import { ToolErrorBoundary } from "@/components/shared/ToolErrorBoundary";
import { Skeleton } from "@/components/ui/misc";

/**
 * Maps a tool slug to a lazily-loaded implementation.
 *
 * The imports are static expressions so the bundler can split each tool into
 * its own chunk — a tool's code (and its heavy deps: pdf-lib, pdfjs, mammoth,
 * qrcode, marked) is only fetched when someone actually opens that tool's page.
 * Nothing here reaches the homepage bundle.
 *
 * `ssr: false` because these tools need Canvas, File, Worker, Web Audio or
 * `crypto` APIs that only exist in the browser. The surrounding page is still
 * statically rendered, so the SEO content ships in the HTML either way.
 */
function lazyTool(loader: () => Promise<{ default: React.ComponentType }>) {
  return dynamic(loader, { ssr: false, loading: ToolSkeleton });
}

function ToolSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading tool">
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="flex gap-3">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

const registry: Record<string, React.ComponentType> = {
  // PDF
  "merge-pdf": lazyTool(() => import("@/tools/merge-pdf/Tool")),
  "split-pdf": lazyTool(() => import("@/tools/split-pdf/Tool")),
  "compress-pdf": lazyTool(() => import("@/tools/compress-pdf/Tool")),
  "pdf-to-word": lazyTool(() => import("@/tools/pdf-to-word/Tool")),
  "pdf-to-jpg": lazyTool(() => import("@/tools/pdf-to-jpg/Tool")),
  "word-to-pdf": lazyTool(() => import("@/tools/word-to-pdf/Tool")),
  "jpg-to-pdf": lazyTool(() => import("@/tools/jpg-to-pdf/Tool")),

  // Image
  "compress-image": lazyTool(() => import("@/tools/compress-image/Tool")),
  "resize-image": lazyTool(() => import("@/tools/resize-image/Tool")),
  "convert-image": lazyTool(() => import("@/tools/convert-image/Tool")),
  "crop-image": lazyTool(() => import("@/tools/crop-image/Tool")),
  "watermark-image": lazyTool(() => import("@/tools/watermark-image/Tool")),
  "remove-background": lazyTool(() => import("@/tools/remove-background/Tool")),

  // Text
  "word-counter": lazyTool(() => import("@/tools/word-counter/Tool")),
  "character-counter": lazyTool(() => import("@/tools/character-counter/Tool")),
  "case-converter": lazyTool(() => import("@/tools/case-converter/Tool")),
  "remove-duplicate-lines": lazyTool(() => import("@/tools/remove-duplicate-lines/Tool")),
  "text-diff": lazyTool(() => import("@/tools/text-diff/Tool")),

  // Developer
  "json-formatter": lazyTool(() => import("@/tools/json-formatter/Tool")),
  "base64-encode-decode": lazyTool(() => import("@/tools/base64-encode-decode/Tool")),
  "url-encode-decode": lazyTool(() => import("@/tools/url-encode-decode/Tool")),
  "html-formatter": lazyTool(() => import("@/tools/html-formatter/Tool")),
  "regex-tester": lazyTool(() => import("@/tools/regex-tester/Tool")),
  "uuid-generator": lazyTool(() => import("@/tools/uuid-generator/Tool")),
  "markdown-to-html": lazyTool(() => import("@/tools/markdown-to-html/Tool")),
  "html-encode-decode": lazyTool(() => import("@/tools/html-encode-decode/Tool")),
  "url-slug-generator": lazyTool(() => import("@/tools/url-slug-generator/Tool")),
  "json-tree-viewer": lazyTool(() => import("@/tools/json-tree-viewer/Tool")),
  "jwt-decoder": lazyTool(() => import("@/tools/jwt-decoder/Tool")),
  "code-to-image": lazyTool(() => import("@/tools/code-to-image/Tool")),
  "css-minifier": lazyTool(() => import("@/tools/css-minifier/Tool")),
  "css-formatter": lazyTool(() => import("@/tools/css-formatter/Tool")),
  "js-minifier": lazyTool(() => import("@/tools/js-minifier/Tool")),
  "js-formatter": lazyTool(() => import("@/tools/js-formatter/Tool")),
  "react-native-shadow-generator": lazyTool(
    () => import("@/tools/react-native-shadow-generator/Tool"),
  ),
  "md5-hash-generator": lazyTool(() => import("@/tools/md5-hash-generator/Tool")),
  "sha1-hash-generator": lazyTool(() => import("@/tools/sha1-hash-generator/Tool")),
  "sha224-hash-generator": lazyTool(() => import("@/tools/sha224-hash-generator/Tool")),
  "sha256-hash-generator": lazyTool(() => import("@/tools/sha256-hash-generator/Tool")),
  "sha384-hash-generator": lazyTool(() => import("@/tools/sha384-hash-generator/Tool")),
  "sha512-hash-generator": lazyTool(() => import("@/tools/sha512-hash-generator/Tool")),

  // Color
  "color-picker": lazyTool(() => import("@/tools/color-picker/Tool")),
  "color-palette-generator": lazyTool(() => import("@/tools/color-palette-generator/Tool")),
  "color-mixer": lazyTool(() => import("@/tools/color-mixer/Tool")),

  // Converter
  "unit-converter": lazyTool(() => import("@/tools/unit-converter/Tool")),
  "length-converter": lazyTool(() => import("@/tools/length-converter/Tool")),
  "weight-converter": lazyTool(() => import("@/tools/weight-converter/Tool")),
  "temperature-converter": lazyTool(() => import("@/tools/temperature-converter/Tool")),
  "volume-converter": lazyTool(() => import("@/tools/volume-converter/Tool")),
  "area-converter": lazyTool(() => import("@/tools/area-converter/Tool")),
  "speed-converter": lazyTool(() => import("@/tools/speed-converter/Tool")),
  "data-converter": lazyTool(() => import("@/tools/data-converter/Tool")),
  "time-converter": lazyTool(() => import("@/tools/time-converter/Tool")),
  "currency-converter": lazyTool(() => import("@/tools/currency-converter/Tool")),
  "timezone-converter": lazyTool(() => import("@/tools/timezone-converter/Tool")),
  "number-base-converter": lazyTool(() => import("@/tools/number-base-converter/Tool")),

  // Calculator
  "loan-calculator": lazyTool(() => import("@/tools/loan-calculator/Tool")),
  "compound-interest-calculator": lazyTool(
    () => import("@/tools/compound-interest-calculator/Tool"),
  ),
  "tax-calculator": lazyTool(() => import("@/tools/tax-calculator/Tool")),
  "bmi-calculator": lazyTool(() => import("@/tools/bmi-calculator/Tool")),
  "calorie-calculator": lazyTool(() => import("@/tools/calorie-calculator/Tool")),
  "age-calculator": lazyTool(() => import("@/tools/age-calculator/Tool")),
  "percentage-calculator": lazyTool(() => import("@/tools/percentage-calculator/Tool")),
  "invoice-generator": lazyTool(() => import("@/tools/invoice-generator/Tool")),

  // Fun & utility
  "online-notepad": lazyTool(() => import("@/tools/online-notepad/Tool")),
  "to-do-list": lazyTool(() => import("@/tools/to-do-list/Tool")),
  "habit-tracker": lazyTool(() => import("@/tools/habit-tracker/Tool")),
  "budget-tracker": lazyTool(() => import("@/tools/budget-tracker/Tool")),
  "typing-speed-test": lazyTool(() => import("@/tools/typing-speed-test/Tool")),
  "screen-ruler": lazyTool(() => import("@/tools/screen-ruler/Tool")),
  "password-manager": lazyTool(() => import("@/tools/password-manager/Tool")),
  "quiz-builder": lazyTool(() => import("@/tools/quiz-builder/Tool")),
  "trivia-questions": lazyTool(() => import("@/tools/trivia-questions/Tool")),
  "nickname-generator": lazyTool(() => import("@/tools/nickname-generator/Tool")),
  "team-name-generator": lazyTool(() => import("@/tools/team-name-generator/Tool")),
  "story-plot-generator": lazyTool(() => import("@/tools/story-plot-generator/Tool")),
  "icebreaker-questions": lazyTool(() => import("@/tools/icebreaker-questions/Tool")),
  "this-or-that": lazyTool(() => import("@/tools/this-or-that/Tool")),
  "compliment-generator": lazyTool(() => import("@/tools/compliment-generator/Tool")),
  "roast-generator": lazyTool(() => import("@/tools/roast-generator/Tool")),
  "ascii-art-generator": lazyTool(() => import("@/tools/ascii-art-generator/Tool")),
  "pixel-font-maker": lazyTool(() => import("@/tools/pixel-font-maker/Tool")),
  "wheel-spinner": lazyTool(() => import("@/tools/wheel-spinner/Tool")),
  "random-name-picker": lazyTool(() => import("@/tools/random-name-picker/Tool")),
  "random-number-generator": lazyTool(() => import("@/tools/random-number-generator/Tool")),
  "random-name-generator": lazyTool(() => import("@/tools/random-name-generator/Tool")),
  "random-color-generator": lazyTool(() => import("@/tools/random-color-generator/Tool")),
  "coin-flipper": lazyTool(() => import("@/tools/coin-flipper/Tool")),
  "dice-roller": lazyTool(() => import("@/tools/dice-roller/Tool")),
  "list-randomizer": lazyTool(() => import("@/tools/list-randomizer/Tool")),
  "decision-maker": lazyTool(() => import("@/tools/decision-maker/Tool")),
  "meme-generator": lazyTool(() => import("@/tools/meme-generator/Tool")),
  "online-whiteboard": lazyTool(() => import("@/tools/online-whiteboard/Tool")),
  "color-blindness-simulator": lazyTool(
    () => import("@/tools/color-blindness-simulator/Tool"),
  ),
  "memory-game": lazyTool(() => import("@/tools/memory-game/Tool")),
  "sudoku-generator": lazyTool(() => import("@/tools/sudoku-generator/Tool")),
  "bingo-card": lazyTool(() => import("@/tools/bingo-card/Tool")),
  "word-search": lazyTool(() => import("@/tools/word-search/Tool")),
  "crossword-maker": lazyTool(() => import("@/tools/crossword-maker/Tool")),
  "tournament-bracket": lazyTool(() => import("@/tools/tournament-bracket/Tool")),

  // Home & lifestyle
  "square-footage-calculator": lazyTool(() => import("@/tools/square-footage-calculator/Tool")),
  "room-size-calculator": lazyTool(() => import("@/tools/room-size-calculator/Tool")),
  "paint-calculator": lazyTool(() => import("@/tools/paint-calculator/Tool")),
  "flooring-calculator": lazyTool(() => import("@/tools/flooring-calculator/Tool")),
  "tile-calculator": lazyTool(() => import("@/tools/tile-calculator/Tool")),
  "wallpaper-calculator": lazyTool(() => import("@/tools/wallpaper-calculator/Tool")),
  "concrete-calculator": lazyTool(() => import("@/tools/concrete-calculator/Tool")),
  "fence-calculator": lazyTool(() => import("@/tools/fence-calculator/Tool")),
  "electricity-cost-calculator": lazyTool(
    () => import("@/tools/electricity-cost-calculator/Tool"),
  ),
  "water-bill-calculator": lazyTool(() => import("@/tools/water-bill-calculator/Tool")),
  "solar-savings-calculator": lazyTool(() => import("@/tools/solar-savings-calculator/Tool")),
  "unit-price-calculator": lazyTool(() => import("@/tools/unit-price-calculator/Tool")),
  "cooking-measurement-converter": lazyTool(
    () => import("@/tools/cooking-measurement-converter/Tool"),
  ),
  "recipe-scaler": lazyTool(() => import("@/tools/recipe-scaler/Tool")),
  "moving-checklist": lazyTool(() => import("@/tools/moving-checklist/Tool")),
  "grocery-list": lazyTool(() => import("@/tools/grocery-list/Tool")),
  "meal-planner": lazyTool(() => import("@/tools/meal-planner/Tool")),
  "calorie-tracker": lazyTool(() => import("@/tools/calorie-tracker/Tool")),

  // Science & engineering
  "ohms-law-calculator": lazyTool(() => import("@/tools/ohms-law-calculator/Tool")),
  "voltage-divider-calculator": lazyTool(
    () => import("@/tools/voltage-divider-calculator/Tool"),
  ),
  "led-resistor-calculator": lazyTool(() => import("@/tools/led-resistor-calculator/Tool")),
  "resistor-color-code-calculator": lazyTool(
    () => import("@/tools/resistor-color-code-calculator/Tool"),
  ),
  "capacitor-calculator": lazyTool(() => import("@/tools/capacitor-calculator/Tool")),
  "frequency-calculator": lazyTool(() => import("@/tools/frequency-calculator/Tool")),
  "force-calculator": lazyTool(() => import("@/tools/force-calculator/Tool")),
  "kinetic-energy-calculator": lazyTool(() => import("@/tools/kinetic-energy-calculator/Tool")),
  "density-calculator": lazyTool(() => import("@/tools/density-calculator/Tool")),
  "pressure-calculator": lazyTool(() => import("@/tools/pressure-calculator/Tool")),
  "molecular-weight-calculator": lazyTool(
    () => import("@/tools/molecular-weight-calculator/Tool"),
  ),
  "stoichiometry-calculator": lazyTool(() => import("@/tools/stoichiometry-calculator/Tool")),
  "ph-calculator": lazyTool(() => import("@/tools/ph-calculator/Tool")),
  "half-life-calculator": lazyTool(() => import("@/tools/half-life-calculator/Tool")),
  "significant-figures-calculator": lazyTool(
    () => import("@/tools/significant-figures-calculator/Tool"),
  ),

  // Social
  "tweet-generator": lazyTool(() => import("@/tools/tweet-generator/Tool")),
  "tweet-to-image": lazyTool(() => import("@/tools/tweet-to-image/Tool")),
  "instagram-post-generator": lazyTool(() => import("@/tools/instagram-post-generator/Tool")),
  "instagram-story-generator": lazyTool(() => import("@/tools/instagram-story-generator/Tool")),
  "instagram-dm-generator": lazyTool(() => import("@/tools/instagram-dm-generator/Tool")),
  "instagram-filters": lazyTool(() => import("@/tools/instagram-filters/Tool")),
  "whatsapp-chat-generator": lazyTool(() => import("@/tools/whatsapp-chat-generator/Tool")),
  "imessage-chat-generator": lazyTool(() => import("@/tools/imessage-chat-generator/Tool")),
  "youtube-thumbnail-grabber": lazyTool(() => import("@/tools/youtube-thumbnail-grabber/Tool")),
  "vimeo-thumbnail-grabber": lazyTool(() => import("@/tools/vimeo-thumbnail-grabber/Tool")),
  "instagram-photo-downloader": lazyTool(() => import("@/tools/instagram-photo-downloader/Tool")),
  "twitter-ad-revenue-generator": lazyTool(
    () => import("@/tools/twitter-ad-revenue-generator/Tool"),
  ),

  // SEO
  "meta-tag-generator": lazyTool(() => import("@/tools/meta-tag-generator/Tool")),
  "keyword-density-checker": lazyTool(() => import("@/tools/keyword-density-checker/Tool")),
  "robots-txt-generator": lazyTool(() => import("@/tools/robots-txt-generator/Tool")),
  "sitemap-generator": lazyTool(() => import("@/tools/sitemap-generator/Tool")),

  // Generator
  "password-generator": lazyTool(() => import("@/tools/password-generator/Tool")),
  "qr-code-generator": lazyTool(() => import("@/tools/qr-code-generator/Tool")),
  "fake-data-generator": lazyTool(() => import("@/tools/fake-data-generator/Tool")),
  "lorem-ipsum-generator": lazyTool(() => import("@/tools/lorem-ipsum-generator/Tool")),
  "pomodoro-timer": lazyTool(() => import("@/tools/pomodoro-timer/Tool")),
  "screen-resolution-checker": lazyTool(() => import("@/tools/screen-resolution-checker/Tool")),
};

/**
 * Only the two strings are accepted rather than the whole `Tool` — its `icon`
 * is a component function, and functions cannot cross the server/client
 * boundary. Keeping the prop surface this narrow makes that impossible to
 * reintroduce by accident.
 */
/**
 * All ~64 unit pair routes share one implementation, selected by slug — a
 * folder each would be sixty copies of the same component.
 */
const UnitPairTool = dynamic(() => import("@/tools/unit-pairs/Tool"), {
  ssr: false,
  loading: ToolSkeleton,
});

export function ToolRuntime({ slug, name }: { slug: string; name: string }) {
  if (getPair(slug)) {
    return (
      <ToolErrorBoundary toolName={name}>
        <UnitPairTool slug={slug} />
      </ToolErrorBoundary>
    );
  }

  const Implementation = registry[slug];

  if (!Implementation) {
    return (
      <EmptyState
        icon={Clock}
        title={`${name} is coming soon`}
        description="This tool is on the roadmap and its page is already live. In the meantime, try one of the related tools below."
      />
    );
  }

  return (
    <ToolErrorBoundary toolName={name}>
      <Implementation />
    </ToolErrorBoundary>
  );
}
