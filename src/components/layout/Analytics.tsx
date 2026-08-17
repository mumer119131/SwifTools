"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { analyticsConfig } from "@/config/analytics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Sends a page_view whenever the route changes.
 *
 * The App Router navigates without a document load, so gtag's own measurement
 * only sees the first page unless told otherwise. `send_page_view: false` in
 * the bootstrap plus an explicit event here means every tool page is counted
 * exactly once — the automatic history-based fallback double-counts on some
 * navigations and misses others entirely.
 *
 * The scripts themselves live in the root layout rather than here, because
 * `beforeInteractive` only inlines into the HTML when it is a direct child of
 * the layout. Nested inside a client component it ends up in the flight
 * payload and runs far too late for a consent default to be worth anything.
 */
function PageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (!analyticsConfig.enabled || typeof window.gtag !== "function") return;

    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;

    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

/**
 * Route-change tracking for Google Analytics.
 *
 * Renders nothing when analytics is disabled, and nothing visible ever.
 */
export function Analytics() {
  if (!analyticsConfig.enabled) return null;

  /*
   * useSearchParams opts its subtree into client rendering, so it is isolated
   * behind Suspense. Without this the whole route would drop out of static
   * generation — all 521 pages of it.
   */
  return (
    <React.Suspense fallback={null}>
      <PageViews />
    </React.Suspense>
  );
}
