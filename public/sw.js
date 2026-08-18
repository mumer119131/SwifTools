/*
 * Service worker for PocketToolz.
 *
 * Written by hand rather than generated, because a service worker is the one
 * piece of a site that can permanently break it. It sits in front of every
 * request for every returning visitor, and a bad one serves stale HTML that
 * points at deleted script chunks — a white page that a normal deploy cannot
 * fix, because the broken worker is the thing deciding what to load.
 *
 * The strategy is chosen to make that failure impossible rather than unlikely:
 *
 *   - HTML is network-first. Online, you always get the current page. Offline,
 *     you get the last one you saw. A stale page is never served to someone who
 *     could have had a fresh one.
 *   - Hashed build assets are cache-first, because their filenames contain a
 *     content hash. A given URL's contents can never change, so caching it
 *     forever is safe by construction.
 *   - Everything else — API routes, the sitemap — is not cached at all.
 *
 * Nothing here changes the privacy position. A cache is local storage on your
 * own machine; no request is created that would not otherwise exist, and none
 * is sent anywhere new.
 */

// Bump to invalidate everything. Old caches are deleted on activate.
const VERSION = "v1";
const PAGES = `pockettoolz-pages-${VERSION}`;
const ASSETS = `pockettoolz-assets-${VERSION}`;

const OFFLINE_URL = "/offline";

/** The few pages worth having before they are ever visited. */
const PRECACHE = ["/", "/tools", "/guides", OFFLINE_URL];

/**
 * A kill switch.
 *
 * If this worker ever needs to be withdrawn, serving a `/sw-kill` that responds
 * 200 lets it unregister itself on the next activation. Without something like
 * this, a worker installed on thousands of devices cannot be recalled.
 */
async function shouldSelfDestruct() {
  try {
    const response = await fetch("/sw-kill", { cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PAGES);
      // Individually, so one failure does not abort the whole install.
      await Promise.all(
        PRECACHE.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch(() => undefined),
        ),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      if (await shouldSelfDestruct()) {
        await self.registration.unregister();
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
        return;
      }

      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("pockettoolz-") && !key.endsWith(VERSION))
          .map((key) => caches.delete(key)),
      );

      // Navigation preload lets the browser start the network request while the
      // worker is still booting, which removes most of the latency a worker adds.
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }

      await self.clients.claim();
    })(),
  );
});

/** Content-hashed build output, safe to cache indefinitely. */
function isImmutable(url) {
  return url.pathname.startsWith("/_next/static/");
}

/** Things that must always hit the network. */
function isUncacheable(url) {
  return (
    url.pathname.startsWith("/api/") ||
    url.pathname === "/sitemap.xml" ||
    url.pathname === "/robots.txt" ||
    url.pathname === "/sw-kill" ||
    url.pathname.endsWith("/rss.xml")
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only GET is cacheable, and only our own origin is ours to cache.
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (isUncacheable(url)) return;

  // ---- Pages: network first, cache as a fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloaded = await event.preloadResponse;
          const response = preloaded || (await fetch(request));

          // Only store a genuine success — caching a 404 or a redirect would
          // serve that page back offline as though it were real.
          if (response && response.ok && response.type === "basic") {
            const cache = await caches.open(PAGES);
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          const cached = await caches.match(request);
          if (cached) return cached;

          const offline = await caches.match(OFFLINE_URL);
          if (offline) return offline;

          return new Response("You are offline.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }
      })(),
    );
    return;
  }

  // ---- Build assets: cache first. The URL contains a content hash, so a hit
  // is always correct and a miss is a one-off fetch.
  if (isImmutable(url)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;

        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(ASSETS);
          cache.put(request, response.clone());
        }
        return response;
      })(),
    );
    return;
  }

  // ---- Everything else (icons, the manifest): try the network, fall back to
  // whatever was stored. Deliberately not cached on success, to keep the cache
  // small and predictable.
  event.respondWith(
    (async () => {
      try {
        return await fetch(request);
      } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        throw new Error("offline and uncached");
      }
    })(),
  );
});
