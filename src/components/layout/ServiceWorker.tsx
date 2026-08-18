"use client";

import * as React from "react";

/**
 * Registers the service worker, and nothing else.
 *
 * Deliberately late — after `load` — so it never competes with the first
 * render for bandwidth. A service worker exists to speed up the *second*
 * visit; letting it slow down the first would be a poor trade.
 *
 * Registration is skipped in development, where a caching worker between you
 * and the dev server produces exactly the sort of confusing staleness it is
 * supposed to prevent.
 */
export function ServiceWorker() {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        // A failed registration is not worth surfacing: the site works
        // perfectly well without it, which is the point of the design.
      });
    };

    if (document.readyState === "complete") {
      register();
      return;
    }

    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
