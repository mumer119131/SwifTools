#!/usr/bin/env node
/**
 * Checks the progressive web app setup.
 *
 * A service worker is the one piece of a site that can permanently break it:
 * it sits in front of every request for every returning visitor, and a bad one
 * serves stale HTML pointing at deleted chunks — a white page a normal deploy
 * cannot fix, because the broken worker decides what loads. So the assertions
 * here are mostly about the worker refusing to do the dangerous things.
 *
 * Requires a build and a running server:
 *
 *   pnpm build && pnpm start &
 *   BASE=http://localhost:3000 pnpm check:pwa
 */

import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import process from "node:process";

import { guides } from "@/config/guides";
import { toolHref, tools } from "@/config/tools";

const require = createRequire(import.meta.url);
const store = readdirSync("node_modules/.pnpm").find((dir) => dir.startsWith("sharp@"));
const sharp = require(`${process.cwd()}/node_modules/.pnpm/${store}/node_modules/sharp`);

const BASE = process.env.BASE ?? "http://localhost:3000";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/* ------------------------------------------------- the worker's source */

const worker = readFileSync("public/sw.js", "utf8");

// Pages must be network-first. Cache-first HTML is the failure that cannot be
// deployed away.
assert(
  "navigations are served network-first",
  /request\.mode === "navigate"/.test(worker) && /await fetch\(request\)/.test(worker),
);
assert(
  "only content-hashed assets are cache-first",
  worker.includes("/_next/static/") && /isImmutable/.test(worker),
);
assert("API routes are never cached", /\/api\//.test(worker) && /isUncacheable/.test(worker));
assert("the sitemap is never cached", worker.includes("/sitemap.xml"));
assert("only GET requests are handled", /request\.method !== "GET"/.test(worker));
assert("cross-origin requests are left alone", /url\.origin !== self\.location\.origin/.test(worker));
assert("only successful responses are cached", /response\.ok/.test(worker));
assert("old caches are deleted on activate", /caches\.delete/.test(worker));
// Without a way to withdraw it, a worker on thousands of devices is permanent.
assert("there is a kill switch", worker.includes("unregister") && worker.includes("sw-kill"));

/* ------------------------------------------ the install offer's memory */

/*
 * Asking someone to install an app they already installed is the most
 * irritating thing a PWA can do, and it is easy to ship: the obvious
 * `display-mode: standalone` check is only true *while running inside the
 * installed app*, so a later visit in an ordinary browser tab — which is what
 * arriving from a search result looks like — asks again.
 *
 * Four signals are needed, and none of them is optional.
 */
const prompt = readFileSync("src/components/layout/InstallPrompt.tsx", "utf8");

assert(
  "installation is remembered across visits, not just detected",
  prompt.includes("pockettoolz:installed"),
);
assert(
  "the appinstalled event is handled",
  /addEventListener\("appinstalled"/.test(prompt),
);
assert(
  "running standalone records the install for later browser visits",
  /if \(standalone\) \{[\s\S]{0,120}setInstalled\(true\)/.test(prompt),
);
assert(
  "accepting the native prompt is treated as permanent",
  /outcome === "accepted"[\s\S]{0,40}setInstalled\(true\)/.test(prompt),
);
// Safari fires no install event, and a home-screen app there has storage
// separate from the browser — so the user is the only possible source.
assert(
  "there is a manual way to say it is already installed",
  prompt.includes("Already added it"),
);
assert(
  "an installed app is never offered the prompt",
  /!installed &&/.test(prompt),
);
assert(
  "declining is a snooze rather than permanent",
  prompt.includes("setDismissedAt(Date.now())") && prompt.includes("SNOOZE_MS"),
);

/* --------------------------------------------------------- as served */

async function get(path: string): Promise<Response | null> {
  try {
    return await fetch(`${BASE}${path}`);
  } catch {
    return null;
  }
}

const swResponse = await get("/sw.js");
if (!swResponse) {
  console.error(`  FAIL  could not reach ${BASE} — is the server running?`);
  process.exit(1);
}

assert("/sw.js is served", swResponse.ok);
assert(
  "/sw.js is served as JavaScript",
  (swResponse.headers.get("content-type") ?? "").includes("javascript"),
  swResponse.headers.get("content-type") ?? "",
);
// A cached worker cannot be superseded, which is how a bad one becomes
// permanent.
assert(
  "/sw.js is served uncacheable",
  (swResponse.headers.get("cache-control") ?? "").includes("no-store"),
  swResponse.headers.get("cache-control") ?? "",
);

/* ----------------------------------------------------------- manifest */

const manifestResponse = await get("/manifest.webmanifest");
assert("the manifest is served", manifestResponse?.ok === true);

const manifest = (await manifestResponse!.json()) as Record<string, unknown>;

for (const field of ["name", "short_name", "start_url", "display", "icons", "id", "scope"]) {
  assert(`the manifest declares ${field}`, manifest[field] !== undefined);
}
assert("it is installable (display is standalone)", manifest.display === "standalone");
assert(
  "short_name is short enough for a home screen",
  String(manifest.short_name).length <= 12,
  String(manifest.short_name),
);

const icons = manifest.icons as { src: string; sizes: string; purpose?: string }[];
assert("a 512px icon is declared", icons.some((icon) => icon.sizes === "512x512"));
assert(
  "a maskable icon is declared",
  icons.some((icon) => icon.purpose === "maskable"),
);

for (const icon of icons) {
  const response = await get(icon.src);
  assert(`${icon.src} resolves`, response?.ok === true);
}

/* ------------------------------------------------------ the shortcuts */

const routes = new Set([
  "/",
  "/tools",
  "/guides",
  "/blog",
  ...tools.map((tool) => toolHref(tool)),
  ...guides.map((guide) => `/guides/${guide.slug}`),
]);

const shortcuts = (manifest.shortcuts ?? []) as { name: string; url: string }[];
assert("shortcuts are declared", shortcuts.length > 0);
for (const shortcut of shortcuts) {
  assert(`shortcut "${shortcut.name}" points somewhere real`, routes.has(shortcut.url), shortcut.url);
}

/* ------------------------------------------------------- offline page */

const offline = await get("/offline");
assert("/offline is served", offline?.ok === true);

const offlineHtml = await offline!.text();
// It is a fallback, not a landing page.
assert("/offline is excluded from search", /noindex/.test(offlineHtml));
assert("/offline explains what still works", /run entirely in your browser/.test(offlineHtml));

/* ------------------------------------- the maskable icon's safe zone */

// Android crops a maskable icon to the launcher's shape and guarantees only
// the middle 80%. A mark drawn to the edges loses its corners, and there is no
// way to see that without decoding the image.
const maskable = icons.find((icon) => icon.purpose === "maskable");
if (maskable) {
  const buffer = Buffer.from(await (await get(maskable.src))!.arrayBuffer());
  const { data, info } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const at = (y * width + x) * channels;
      const brightness = (data[at] + data[at + 1] + data[at + 2]) / 3;
      if (brightness > 100) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const low = width * 0.1;
  const high = width * 0.9;
  assert(
    `the maskable mark stays inside the safe zone (x ${minX}-${maxX} of ${width})`,
    minX >= low && minY >= low && maxX <= high && maxY <= high,
  );

  // It must also be full-bleed: a transparent corner shows the launcher's
  // background through the mask.
  const corner = (x: number, y: number) => {
    const at = (y * width + x) * channels;
    return channels === 4 ? data[at + 3] : 255;
  };
  assert(
    "the maskable icon is full-bleed, with no transparent corners",
    corner(2, 2) > 250 && corner(width - 3, 2) > 250 && corner(2, height - 3) > 250,
    `alpha ${corner(2, 2)}`,
  );
}

console.log(
  failures === 0
    ? "\nPWA checks passed — installable, offline-capable, and the worker cannot serve stale HTML."
    : `\n${failures} PWA checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);
