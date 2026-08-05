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
 * its own chunk — a tool's code (and its heavy deps: pdf-lib, pdfjs, mammoth)
 * is only fetched when someone actually opens that tool's page. Nothing here
 * reaches the homepage bundle.
 *
 * `ssr: false` because every Phase 1 tool needs Canvas, File or Worker APIs
 * that only exist in the browser. The surrounding page is still statically
 * rendered, so the SEO content ships in the HTML either way.
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
