"use client";

import * as React from "react";

/** Never resubscribes — these stores are read-once facts about the client. */
const noopSubscribe = () => () => {};

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
 * `read` runs on every render, so keep it cheap and pure.
 */
export function useClientValue<T>(read: () => T, serverFallback: T): T {
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
