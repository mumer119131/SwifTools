"use client";

import * as React from "react";
import { Check, Lock, X } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Skeleton } from "@/components/ui/misc";
import { cn, formatNumber } from "@/lib/utils";
import { readDisplayInfo, readFeatures, type DisplayInfo } from "./logic";

/**
 * `useSyncExternalStore` needs a referentially stable snapshot or it re-renders
 * forever, so the reading is cached and only replaced when a resize actually
 * changes something. Subscribing this way also removes the mount effect that
 * a `useState` + `useEffect` version would need.
 */
let cachedInfo: DisplayInfo | null = null;

function subscribeToViewport(onChange: () => void) {
  const handle = () => {
    cachedInfo = null;
    onChange();
  };
  window.addEventListener("resize", handle);
  window.addEventListener("orientationchange", handle);
  return () => {
    window.removeEventListener("resize", handle);
    window.removeEventListener("orientationchange", handle);
  };
}

function getInfoSnapshot(): DisplayInfo | null {
  cachedInfo ??= readDisplayInfo();
  return cachedInfo;
}

export default function ScreenResolutionTool() {
  const info = React.useSyncExternalStore(subscribeToViewport, getInfoSnapshot, () => null);
  const features = React.useMemo(() => (info ? readFeatures() : []), [info]);

  if (!info) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Reading display information">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  const summary = [
    `Screen: ${info.screenWidth}×${info.screenHeight} CSS px`,
    `Physical: ${info.physicalWidth}×${info.physicalHeight} device px`,
    `Viewport: ${info.viewportWidth}×${info.viewportHeight}`,
    `Pixel ratio: ${info.pixelRatio}`,
    `Colour depth: ${info.colorDepth}-bit`,
    `Aspect ratio: ${info.aspectRatio}`,
    `Orientation: ${info.orientation}`,
    `Breakpoint: ${info.breakpoint}`,
  ].join("\n");

  const groups: { title: string; rows: [string, string, string?][] }[] = [
    {
      title: "Display",
      rows: [
        ["Screen resolution", `${formatNumber(info.screenWidth)} × ${formatNumber(info.screenHeight)}`, "CSS pixels — what your layout sees"],
        ["Physical resolution", `${formatNumber(info.physicalWidth)} × ${formatNumber(info.physicalHeight)}`, "Actual device pixels"],
        ["Available area", `${formatNumber(info.availWidth)} × ${formatNumber(info.availHeight)}`, "Excludes docks and taskbars"],
        ["Aspect ratio", info.aspectRatio],
        ["Colour depth", `${info.colorDepth}-bit`],
        ["Pixel ratio", `${info.pixelRatio}×`, info.pixelRatio > 1 ? "High-DPI — serve 2× images" : "Standard density"],
      ],
    },
    {
      title: "Browser window",
      rows: [
        ["Viewport", `${formatNumber(info.viewportWidth)} × ${formatNumber(info.viewportHeight)}`, "Resize the window to watch this change"],
        ["Breakpoint", info.breakpoint],
        ["Orientation", info.orientation],
        ["Touch points", String(info.touchPoints), info.touchPoints > 0 ? "Touch-capable" : "Pointer only"],
      ],
    },
    {
      title: "Preferences",
      rows: [
        ["Colour scheme", info.colorScheme, "From your operating system"],
        ["Reduced motion", info.reducedMotion ? "On" : "Off", info.reducedMotion ? "Animations are suppressed site-wide" : "Animations play normally"],
      ],
    },
  ];

  return (
    <div className="space-y-5">
      <div className="surface-card p-6 text-center">
        <p className="text-xs text-muted-foreground">Screen resolution</p>
        <p className="mt-1 font-mono text-4xl tracking-[-0.03em] text-foreground sm:text-5xl" data-numeric>
          {formatNumber(info.screenWidth)} × {formatNumber(info.screenHeight)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Viewport{" "}
          <span className="font-mono text-foreground" data-numeric>
            {formatNumber(info.viewportWidth)} × {formatNumber(info.viewportHeight)}
          </span>{" "}
          · {info.pixelRatio}× density
        </p>
        <div className="mt-4 flex justify-center">
          <CopyButton value={summary} label="Copy all details" />
        </div>
      </div>

      {groups.map((group) => (
        <section key={group.title} className="surface-card overflow-hidden">
          <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
            {group.title}
          </h2>
          <dl className="divide-y divide-border">
            {group.rows.map(([label, value, note]) => (
              <div key={label} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-3">
                <dt className="w-40 shrink-0 text-sm text-muted-foreground">{label}</dt>
                <dd className="font-mono text-sm text-foreground" data-numeric>
                  {value}
                </dd>
                {note ? (
                  <span className="w-full text-xs text-subtle-foreground sm:w-auto sm:flex-1 sm:text-right">
                    {note}
                  </span>
                ) : null}
              </div>
            ))}
          </dl>
        </section>
      ))}

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
          Browser capabilities
        </h2>
        <ul className="divide-y divide-border">
          {features.map((feature) => (
            <li key={feature.label} className="flex items-center gap-4 px-5 py-3">
              {/* Icon plus the words "Supported"/"Not available" — colour alone
                  never carries the result. */}
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full",
                  feature.supported
                    ? "bg-[color-mix(in_oklab,var(--success)_18%,transparent)] text-success"
                    : "bg-surface-hover text-subtle-foreground",
                )}
                aria-hidden="true"
              >
                {feature.supported ? (
                  <Check className="size-3.5" strokeWidth={2.5} />
                ) : (
                  <X className="size-3.5" strokeWidth={2.5} />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-foreground">{feature.label}</span>
                <span className="block text-xs text-muted-foreground">{feature.note}</span>
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {feature.supported ? "Supported" : "Not available"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Lock className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Every value here is read from your own browser and rendered locally. Nothing is logged,
          transmitted or fingerprinted — closing the tab is the end of it.
        </span>
      </p>
    </div>
  );
}
