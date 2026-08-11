"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { formatMoney } from "@/lib/home";

export interface Stat {
  label: string;
  value: string;
  /** Shown smaller underneath — the working, not another number. */
  detail?: string;
}

interface MaterialResultProps {
  /** The one number the page exists to produce. */
  headline: string;
  headlineLabel: string;
  /** Copied when the button is pressed; defaults to the headline. */
  copyValue?: string;
  stats: Stat[];
  /** Total cost, when a price per unit was supplied. */
  cost?: number | null;
  footnote: React.ReactNode;
}

/**
 * The shared output for the material calculators.
 *
 * Paint, tile, flooring, wallpaper, concrete and fencing all answer the same
 * question — how much to buy, and what it costs — so they present it the same
 * way rather than each inventing a layout.
 */
export function MaterialResult({
  headline,
  headlineLabel,
  copyValue,
  stats,
  cost,
  footnote,
}: MaterialResultProps) {
  return (
    <div className="space-y-5">
      <div className="surface-card p-6 text-center">
        <p className="text-xs text-muted-foreground">{headlineLabel}</p>
        <p
          className="mt-2 flex flex-wrap items-baseline justify-center gap-3 font-mono text-4xl tracking-[-0.03em] text-foreground sm:text-5xl"
          data-numeric
          aria-live="polite"
        >
          {headline}
          <CopyButton value={copyValue ?? headline} iconOnly label="Copy result" />
        </p>
        {cost != null && cost > 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Around <span className="font-mono text-foreground">{formatMoney(cost)}</span> in
            materials
          </p>
        ) : null}
      </div>

      {stats.length > 0 ? (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="surface-card p-4">
              <dt className="text-xs text-muted-foreground">{stat.label}</dt>
              <dd className="mt-1 font-mono text-base text-foreground" data-numeric>
                {stat.value}
              </dd>
              {stat.detail ? (
                <dd className="mt-0.5 text-xs text-subtle-foreground">{stat.detail}</dd>
              ) : null}
            </div>
          ))}
        </dl>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>{footnote}</span>
      </p>
    </div>
  );
}
