"use client";

import * as React from "react";

/** Never resubscribes — these stores are read-once facts about the client. */
const noopSubscribe = () => () => {};

/**
 * Values `useClientValue` can safely return.
 *
 * Deliberately restricted to primitives. `useSyncExternalStore` compares
 * successive snapshots with `Object.is` and re-renders whenever they differ, so
 * a reader that builds a fresh object each call — `() => ({ date, time })` —
 * never settles and React throws "Maximum update depth exceeded". Primitives
 * compare by value, which makes that failure mode unrepresentable rather than
 * merely documented.
 *
 * Need an object? Cache it at module scope and invalidate it from the
 * subscribe callback, the way `screen-resolution-checker` does, and call
 * `useSyncExternalStore` directly.
 */
type Primitive = string | number | boolean | bigint | null | undefined;

/**
 * Reads a value that only exists in the browser, without an effect.
 *
 * Several tools need something the server cannot know: today's date, the user's
 * timezone, a freshly generated password. Seeding that with
 * `useEffect(() => setState(read()), [])` costs a second render pass and trips
 * React's `set-state-in-effect` rule. `useSyncExternalStore` is the intended
 * mechanism — it returns the server snapshot during SSR and the client one
 * after hydration, in a single pass.
 *
 * `read` runs on every render, so keep it cheap, pure, and stable: calling it
 * twice in a row must produce an `Object.is`-equal result.
 */
export function useClientValue<T extends Primitive>(read: () => T, serverFallback: T): T {
  return React.useSyncExternalStore(noopSubscribe, read, () => serverFallback);
}

/**
 * True once the component has hydrated on the client.
 *
 * Gates work that would crash or produce non-deterministic output during server
 * rendering — `crypto.getRandomValues`, `Date.now()`, anything reading `window`.
 */
export function useHydrated(): boolean {
  return React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/* --------------------------------------------------------------- the clock */

/**
 * A ticking clock, shared by every component that asks for one.
 *
 * The obvious implementation — `useEffect(() => setInterval(() => setNow(Date.now())))`
 * — trips React's `set-state-in-effect` rule when seeding the first value, and
 * reading `Date.now()` during render trips the purity rule. This is the
 * intended mechanism instead: one interval, a cached timestamp, and a snapshot
 * that only changes on a tick.
 *
 * The cache is what makes it safe. `getSnapshot` must return an
 * `Object.is`-equal value when nothing has changed, and `() => Date.now()`
 * returns a different number on every call — which would re-render forever.
 */
let cachedNow = 0;
let ticker: ReturnType<typeof setInterval> | null = null;
const clockListeners = new Set<() => void>();

function subscribeToClock(onChange: () => void): () => void {
  clockListeners.add(onChange);

  if (ticker === null) {
    cachedNow = Date.now();
    ticker = setInterval(() => {
      cachedNow = Date.now();
      for (const listener of clockListeners) listener();
    }, 1000);
  }

  return () => {
    clockListeners.delete(onChange);
    // Stop the interval once nothing is watching, rather than leaving it
    // running for the life of the page.
    if (clockListeners.size === 0 && ticker !== null) {
      clearInterval(ticker);
      ticker = null;
    }
  };
}

/**
 * Milliseconds since the epoch, updated once a second.
 *
 * Returns 0 during server rendering and on the first client pass, so callers
 * must treat 0 as "not known yet" rather than as the Unix epoch.
 */
export function useNow(): number {
  return React.useSyncExternalStore(
    subscribeToClock,
    () => cachedNow || Date.now(),
    () => 0,
  );
}
