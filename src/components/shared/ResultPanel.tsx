"use client";

import * as React from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { CopyButton } from "@/components/shared/CopyButton";
import { AdSlot } from "@/components/shared/AdSlot";
import { cn, formatBytes, formatDelta } from "@/lib/utils";

export interface ResultDownload {
  blob: Blob | (() => Blob | Promise<Blob>);
  fileName: string;
  label?: string;
}

export interface ResultStat {
  label: string;
  value: string;
}

interface ResultPanelProps {
  title?: string;
  /** One primary download, or several when a tool emits multiple outputs. */
  downloads?: ResultDownload[];
  /** Text result — renders a copy button instead of a download. */
  copyValue?: string;
  stats?: ResultStat[];
  /** Resets the tool back to its empty state. */
  onReset: () => void;
  resetLabel?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * The success surface every tool ends at: what changed, how to get it, and how
 * to start over. Announced politely so the result is not missed by screen
 * readers when it replaces the form in place.
 */
export function ResultPanel({
  title = "Done",
  downloads = [],
  copyValue,
  stats = [],
  onReset,
  resetLabel = "Process another",
  children,
  className,
}: ResultPanelProps) {
  return (
    <div className={cn("space-y-5", className)}>
      <section
        aria-live="polite"
        className="surface-card overflow-hidden rounded-lg border-[color-mix(in_oklab,var(--success)_28%,var(--border))]"
      >
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
            <CheckCircle2 className="size-4 text-success" strokeWidth={2} />
            {title}
          </h3>
          <Button type="button" variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw strokeWidth={1.75} />
            {resetLabel}
          </Button>
        </header>

        {stats.length > 0 ? (
          <dl className="grid grid-cols-2 divide-x divide-y divide-border border-b border-border sm:grid-cols-4 sm:divide-y-0">
            {stats.map((stat) => (
              <div key={stat.label} className="px-5 py-4">
                <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                <dd className="mt-1 font-mono text-lg text-foreground" data-numeric>
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {children ? <div className="border-b border-border p-5">{children}</div> : null}

        <div className="flex flex-wrap items-center gap-3 p-5">
          {downloads.map((download) => (
            <DownloadButton
              key={download.fileName}
              blob={download.blob}
              fileName={download.fileName}
              label={download.label ?? `Download ${download.fileName}`}
            />
          ))}
          {copyValue !== undefined ? (
            <CopyButton value={copyValue} label="Copy result" size="lg" />
          ) : null}
        </div>
      </section>

      {/* Reserved ad region (§10) — proportioned, empty, no network calls. */}
      <AdSlot placement="below-results" />
    </div>
  );
}

/** Convenience builder for the before/after stats on compression tools. */
export function compressionStats(before: number, after: number): ResultStat[] {
  return [
    { label: "Original", value: formatBytes(before) },
    { label: "Result", value: formatBytes(after) },
    { label: "Saved", value: formatDelta(before, after) },
  ];
}
