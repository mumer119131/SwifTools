"use client";

import * as React from "react";

/**
 * State that survives a reload, kept in `localStorage`.
 *
 * Built on `useSyncExternalStore` rather than an effect: reading storage in an
 * effect and calling `setState` costs an extra render, flashes the default
 * value first, and trips React's `set-state-in-effect` rule. This returns the
 * server snapshot during SSR and the stored one immediately after hydration.
 *
 * `getSnapshot` must return an `Object.is`-stable value or React re-renders
 * forever, so parsed values are cached against the raw string they came from
 * and only re-parsed when that string actually changes.
 */

interface CacheEntry {
  raw: string | null;
  value: unknown;
}

const cache = new Map<string, CacheEntry>();
const listeners = new Map<string, Set<() => void>>();

function notify(key: string): void {
  for (const listener of listeners.get(key) ?? []) listener();
}

function subscribeTo(key: string) {
  return (onChange: () => void) => {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(onChange);

    // Another tab writing the same key should update this one too.
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) {
        cache.delete(key);
        onChange();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      listeners.get(key)?.delete(onChange);
      window.removeEventListener("storage", onStorage);
    };
  };
}

function readSnapshot<T>(key: string, fallback: T): T {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    // Private mode and blocked storage both throw rather than returning null.
    return fallback;
  }

  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;

  let value: T = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }

  cache.set(key, { raw, value });
  return value;
}

export function useLocalStorage<T>(
  key: string,
  fallback: T,
): [T, (next: T | ((current: T) => T)) => void, () => void] {
  const subscribe = React.useMemo(() => subscribeTo(key), [key]);

  const value = React.useSyncExternalStore(
    subscribe,
    () => readSnapshot(key, fallback),
    () => fallback,
  );

  const setValue = React.useCallback(
    (next: T | ((current: T) => T)) => {
      const resolved =
        typeof next === "function"
          ? (next as (current: T) => T)(readSnapshot(key, fallback))
          : next;

      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // Quota exceeded or storage blocked — keep the in-memory value so the
        // UI stays responsive rather than silently reverting.
      }

      cache.set(key, { raw: JSON.stringify(resolved), value: resolved });
      notify(key);
    },
    [key, fallback],
  );

  const clear = React.useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Nothing to do — the cache reset below still applies.
    }
    cache.delete(key);
    notify(key);
  }, [key]);

  return [value, setValue, clear];
}
