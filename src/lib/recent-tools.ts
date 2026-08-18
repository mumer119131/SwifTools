"use client";

import * as React from "react";

import { useLocalStorage } from "@/lib/use-local-storage";

/**
 * The tools this browser has opened recently.
 *
 * With 182 tools, someone coming back has to find their way to the same one
 * again — through search, a category page, or memory of the URL. This makes the
 * second visit shorter than the first, which is the only kind of continuity a
 * site with no accounts can offer.
 *
 * Stored as slugs in `localStorage` and never transmitted. That is not a
 * privacy policy, it is the whole implementation: there is no server call to
 * make, and the list is gone when the browser data is cleared.
 */

const KEY = "pockettoolz:recent-tools";
const LIMIT = 8;

/** Slugs, most recently opened first. */
const EMPTY: string[] = [];

/**
 * Frozen at module scope rather than built inline.
 *
 * `useLocalStorage` compares snapshots with `Object.is`, so passing a fresh
 * `[]` as the fallback on every render would return a new array each time and
 * re-render forever.
 */
/**
 * Moves a slug to the front of the list, deduplicated and capped.
 *
 * Pure, and exported, so it can be tested without a browser — the behaviour
 * that matters (an already-present tool moves to the front rather than
 * appearing twice, and the oldest falls off the end) is invisible from the
 * outside until it is wrong.
 *
 * Returns the original array when nothing would change. Writing an identical
 * list would still notify every subscriber and re-render, and this runs on
 * every tool page view.
 */
export function pushRecent(current: string[], slug: string, limit = LIMIT): string[] {
  if (slug === "") return current;

  const next = [slug, ...current.filter((existing) => existing !== slug)].slice(0, limit);
  const unchanged =
    next.length === current.length && next.every((value, index) => value === current[index]);

  return unchanged ? current : next;
}

export function useRecentTools(): [string[], (slug: string) => void, () => void] {
  const [slugs, setSlugs, clear] = useLocalStorage<string[]>(KEY, EMPTY);

  const record = React.useCallback(
    (slug: string) => {
      setSlugs((current) => pushRecent(current, slug));
    },
    [setSlugs],
  );

  return [slugs, record, clear];
}

export { LIMIT as RECENT_LIMIT };
