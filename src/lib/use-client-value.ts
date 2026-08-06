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
