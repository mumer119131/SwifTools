"use client";

import { CopyButton } from "@/components/shared/CopyButton";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { cn } from "@/lib/utils";

interface CodeOutputProps {
  value: string;
  label: string;
  /** Offers a download button when a filename is given. */
  fileName?: string;
  mimeType?: string;
  placeholder?: string;
  className?: string;
  /** Extra controls rendered next to copy/download. */
  actions?: React.ReactNode;
}

/**
 * Read-only output panel shared by the generator and formatter tools: a
 * monospace block with copy and optional download.
 *
 * Wide content scrolls inside the block rather than pushing the page sideways.
 */
export function CodeOutput({
  value,
  label,
  fileName,
  mimeType = "text/plain;charset=utf-8",
  placeholder = "Output appears here.",
  className,
  actions,
}: CodeOutputProps) {
  return (
    <section className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-foreground">{label}</h2>
        <div className="flex items-center gap-2">
          {actions}
          <CopyButton value={value} label="Copy" />
          {fileName ? (
            <DownloadButton
              blob={() => new Blob([value], { type: mimeType })}
              fileName={fileName}
              label="Save"
              size="sm"
              variant="outline"
              disabled={!value}
            />
          ) : null}
        </div>
      </div>

      <pre
        className={cn(
          "max-h-96 overflow-auto rounded-lg border border-border bg-surface p-4",
          "font-mono text-[0.8125rem] leading-relaxed text-foreground",
          className,
        )}
      >
        <code>{value || <span className="text-subtle-foreground">{placeholder}</span>}</code>
      </pre>
    </section>
  );
}
