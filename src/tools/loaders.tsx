"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Clock } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
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
export function ToolRuntime({ slug, name }: { slug: string; name: string }) {
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
