# SwiftKnife

A fast, free collection of 78 tools across ten categories — PDF, image, text, developer, colour,
converter, calculator, SEO, generator and social. All but four run entirely in the browser, so
your files are never uploaded.

Built with Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, and TypeScript in strict
mode. Every tool page is statically generated.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

| Script | What it does |
|---|---|
| `pnpm dev` | Dev server with Turbopack |
| `pnpm build` | Production build (static-generates every tool page) |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm check:snapshots` | Asserts every `useClientValue` reader is `Object.is`-stable |
| `pnpm check:hashes` | Verifies all six hash algorithms against published test vectors |
| `pnpm check:search` | Asserts the ⌘K palette returns the tool each query means |
| `pnpm check:units` | Verifies conversions against known values and round-trips every pair |
| `pnpm new:tool` | Scaffold a new tool (see below) |

---

## Rebranding the whole app

The app name is **never** hardcoded. It lives in exactly one place:

```ts
// src/config/site.ts
export const siteConfig = {
  name: "SwiftKnife",
  tagline: "Every tool you need, sharp and fast.",
  // …
};
```

Change `name` and the header, footer, every `<title>`, all meta and Open Graph tags, the generated
OG image, the PWA manifest, the JSON-LD and the legal pages all follow. Nothing else needs editing.

The same applies to `tagline`, `description`, `url`, `author` and the social links — an empty link
string simply hides that icon in the footer.

> Verified: swapping `name` to another value produces zero occurrences of the old name in the
> rendered HTML.

---

## Adding a tool

Adding a tool costs **one folder and one registry entry**, and the scaffolder writes both:

```bash
pnpm new:tool
# or non-interactively:
pnpm new:tool --slug compress-svg --name "Compress SVG" --category image \
  --description "Strip bloat from SVG files." --icon Shrink
```

That creates:

```
src/tools/compress-svg/
  meta.ts      # the registry entry — name, description, keywords, icon, steps
  logic.ts     # pure functions, no React, unit-testable
  Tool.tsx     # the UI, default export, composed from shared components
  worker.ts    # optional — add one for heavy work (see remove-background)
```

…and wires it into `src/config/tools.ts` and `src/tools/loaders.tsx`.

From there the tool automatically appears in the homepage grid, its category page, the ⌘K palette,
the footer, the sitemap and the related-tools rail — and gets its own statically generated page at
`/<category>/<slug>` with metadata and JSON-LD derived from `meta.ts`.

**Then:**

1. Fill in `keywords` (long-tail SEO; also indexed by ⌘K) and `steps` in `meta.ts`. The steps render
   as the "How it works" section *and* become `HowTo` structured data.
2. Write the real work in `logic.ts` — keep it free of React so it stays testable.
3. Build the UI in `Tool.tsx` from the shared components below.

### Tools not yet built

Every registered tool is currently live. A tool can be registered before it is implemented by
setting `status: "soon"` in its `meta.ts` — it gets a real, crawlable page showing a coming-soon
state, and is excluded from search indexing until the status flips to `"live"`.

---

## Architecture

```
src/
  app/
    layout.tsx                  root shell: fonts, theme, ⌘K provider, header/footer
    page.tsx                    landing page
    [category]/page.tsx         category listing        (SSG, 10 pages)
    [category]/[tool]/page.tsx  tool page               (SSG, 78 pages)
    api/rates/route.ts          cached ECB exchange-rate proxy
    api/vimeo/route.ts          Vimeo oEmbed proxy (no CORS upstream)
    api/og-image/route.ts       reads a public page's og:image, host-allowlisted
    (legal)/privacy, terms
    sitemap.ts robots.ts manifest.ts opengraph-image.tsx icon.tsx apple-icon.tsx
  components/
    layout/     Header, Footer, Logo, ThemeToggle, SearchCommand (⌘K),
                ToolsMenu (desktop mega menu), MobileNav
    shared/     ToolShell, FileDropzone, ResultPanel, ToolCard, Breadcrumbs, …
    ui/         button, input, select, slider, switch, tabs, dialog, command, …
    home/       ToolDirectory (filterable grid)
  tools/
    <slug>/     meta.ts · logic.ts · Tool.tsx · worker.ts?
    loaders.tsx slug → lazily-imported implementation
  config/
    site.ts     ← the app name lives here
    tools.ts    ← the tool registry
    categories.ts
  lib/          utils, seo helpers, pdf/image helpers
  styles/       globals.css (all design tokens)
scripts/
  new-tool.ts   the pnpm new:tool scaffolder
design-system/
  MASTER.md     the locked design system
```

### The registry drives everything

`src/config/tools.ts` is the single source for the homepage grid, category pages, ⌘K search,
breadcrumbs, related tools, the footer link map, the sitemap and every page's metadata. There is no
second list to keep in sync.

### Code splitting

`src/tools/loaders.tsx` maps each slug to a `next/dynamic` import. A tool's code — and its heavy
dependencies (`pdf-lib`, `pdfjs-dist`, `mammoth`, `docx`, `jszip`, `qrcode`, `marked`) — is only
fetched when someone opens that tool's page. None of it reaches the homepage bundle.

### Client vs. server

**74 of the 78 tools run entirely in the browser** via Canvas, the File API, Web Workers and WASM.
That is the product's main selling point, not just an optimisation: no upload wait, no server cost,
and files that genuinely never leave the device.

Four need a server, each for a stated reason:

- **Currency converter** — `/api/rates` proxies the European Central Bank's daily reference rates
  via Frankfurter, cached for an hour, so one upstream request is shared by every visitor.
- **Vimeo thumbnail grabber** — `/api/vimeo` proxies Vimeo's official oEmbed endpoint, which is
  public and keyless but sends no CORS headers, so a browser cannot call it.
- **Instagram photo downloader** — `/api/og-image` reads the preview image a public post
  advertises to link crawlers. Expect it to be unreliable; see the note on that tool's page.

`/api/og-image` uses a **host allowlist, not a blocklist**. Without one it would be an open proxy
that could be pointed at internal addresses — verified that both an arbitrary host and the
`169.254.169.254` cloud metadata endpoint are rejected with a 400.

None of these routes read a request body or store anything.

Each tool declares which it is in its `processing` field, and its page states it plainly.

Heavy work goes into a Web Worker so the UI never freezes — `src/tools/remove-background/worker.ts`
is the reference example.

### Search ranking

`src/lib/search.ts` scores results explicitly rather than using cmdk's built-in
filter. That filter is a fuzzy subsequence matcher, which is far too permissive
for a catalogue this size: searching **bmi** matched *Merge PDF*, because b, m
and i appear in that order across its keywords — "com**b**ine", "**m**erger",
"onl**i**ne". It scored low, but it still matched, and because results were
rendered in per-category groups, that low match sat above the exact one.

The scorer uses widely separated tiers so they can never interleave — an exact
name beats a name prefix, beats initials, beats an exact keyword, beats a
description hit. On top of that:

- **Every token must match something.** "png to pdf" cannot return a tool that
  only matched "to".
- **Stop words are capped.** "to", "of", "for" and friends carry intent but no
  discriminating power, so they can contribute at most a token amount and never
  disqualify a tool on their own.
- **A whole-query match on a name or keyword adds a large bonus.** Someone
  typing "png to jpg" wants the tool listing exactly that, not one sharing two
  of the words.
- **Fuzzy matching runs only when nothing else matched**, so a typo still finds
  something without ever outranking a real result.
- Results carry a **reason** when the match came from a keyword rather than the
  name, so a result never looks arbitrary.

Both the ⌘K palette and the homepage directory use this, so a query behaves the
same in both places.

`pnpm check:search` asserts 35 query → expected-tool pairs. Relevance is exactly
the kind of thing that regresses silently when a new tool arrives with broad
keywords.

### Search-only pages

`Tool.searchOnly` marks a page that is reachable, indexed and linked, but kept
out of the browse surfaces — the category grid, footer, mega menu, and the ⌘K
list before you type.

The unit conversion pages use it. Searching **lb to kg** used to return fuzzy
junk, because one page carrying every measurement cannot rank for any specific
conversion. There are now nine browsable converters plus 72 direct pages
(`/units/lb-to-kg`), each with a live converter, the formula written out and a
table of common values. All 72 are in the sitemap and linked from their parent
converter; none of them appear in the footer or category grid, where they would
bury the nine tools people actually browse for.

`browsableTools` is the list for browse surfaces; `tools` — the full set — is
what search, the sitemap and `generateStaticParams` use.

Pairs are deliberately not exhaustive. Every permutation would be roughly 400
pages that compete with each other; these are the conversions people search for,
expanded in both directions because "kg to lbs" and "lbs to kg" are different
queries.

### Canvas mockups

The social generators paint directly onto a canvas rather than rasterising styled HTML through an
SVG `foreignObject`. That approach needs every font inlined as a data URI or the text silently
falls back, and Safari renders it inconsistently. Measuring and painting each element by hand costs
more code but produces the same image in every browser. `src/lib/mockup.ts` holds the primitives;
`chat-mockup.ts` and `social-mockup.ts` build the specific layouts.

Each renderer measures its content before sizing the canvas, so output height matches the content
exactly instead of clipping a long post or leaving dead space under a short one.

### Client-only values

Several tools need something the server cannot know — today's date, the user's timezone, a random
password. `src/lib/use-client-value.ts` provides `useClientValue` and `useHydrated`, both built on
`useSyncExternalStore`. Seeding that state with `useEffect(() => setState(read()), [])` costs an
extra render pass and trips React's `set-state-in-effect` rule; `useSyncExternalStore` returns the
server snapshot during SSR and the client one after hydration, in a single pass.

**The reader must return a stable primitive.** `useSyncExternalStore` compares successive snapshots
with `Object.is`, so a reader that builds a fresh object each call — `() => ({ date, time })` —
never settles and React throws *Maximum update depth exceeded*. Two guards enforce this:

- `useClientValue` is typed to accept primitives only, so an object reader is a compile error.
- `pnpm check:snapshots` calls every registered reader twice and asserts the results are
  `Object.is`-equal.

If you genuinely need an object snapshot, cache it at module scope and invalidate it from the
`subscribe` callback — `screen-resolution-checker` does this for its resize listener — and call
`useSyncExternalStore` directly.

---

## Shared components

Build tools by composing these, not by writing bespoke UI:

| Component | Purpose |
|---|---|
| `ToolShell` | Page frame: breadcrumb, title, tool body, "how it works", related tools, ad slots |
| `FileDropzone` | Drag & drop + click, multi-file, type/size validation, previews |
| `ResultPanel` | Success surface: stats, downloads, copy, "process another" |
| `ProgressBar` / `Spinner` | Unified processing feedback |
| `CopyButton` / `DownloadButton` | Clipboard and download with inline confirmation |
| `ToolCard` | Used by homepage, category pages, search and related rails |
| `CategoryBadge`, `Breadcrumbs`, `EmptyState` | Supporting pieces |
| `ToolErrorBoundary` | Isolates a tool crash from the rest of the page |
| `CodeOutput` | Read-only monospace output block with copy and download |
| `CodeTransformShell` | Frame for the formatter/minifier tools: input, options, result, savings |
| `HashToolShell` | Shared body for the six hash generators |
| `ChatMockupShell` | Shared editor for the WhatsApp, iMessage and Instagram DM mockups |
| `TweetEditor` | Shared post-composition form for the three tweet-shaped tools |

### Header navigation

The header carries a single **Tools** entry rather than a row of category
links. It opens a two-column mega menu — categories on the left, the hovered
category's tools on the right — built on Radix `NavigationMenu`, which supplies
the open delay, the pointer "safe triangle", and full keyboard operation.

Two columns rather than a nested flyout: nested submenus are fragile to hit
with a mouse and awkward to operate with a keyboard, whereas one panel keeps
every tool a single pointer-move away and every row in one tab sequence. The
active category follows **focus as well as hover**, so keyboard users get the
same reveal.

Hover doesn't exist on touch, so `MobileNav` renders the same structure as
disclosures: tapping a category name navigates, tapping its chevron expands its
tools.

The menu's contents are client-mounted on open, so they are not in the
server-rendered HTML — this costs nothing for crawling, because the footer
already links every category and all 48 tools on every page.

---

## Design system

Fully specified in [`design-system/MASTER.md`](design-system/MASTER.md). In short:

- **Linear-inspired**: dark-first, near-black surfaces, hairline borders, one ambient gradient wash.
- **Both themes are fully designed** — light mode is not an inversion. Dark elevates with lightness;
  light elevates with borders and a soft shadow.
- **Monochrome chrome**: buttons, links and focus rings are pure foreground/background. Each of the
  8 categories owns one accent hue, used only in its icon, badge and card tint.
- **Geist Sans + Geist Mono**, with tabular figures on every counter and byte size.
- **One motion rhythm**: `cubic-bezier(0.16, 1, 0.3, 1)`, 120/180/260ms, transform and opacity only,
  fully collapsed under `prefers-reduced-motion`.

All colours are CSS variables in `src/styles/globals.css`. **A raw hex value in a component is a
bug.**

---

## Ads

Not implemented, by design. Layout reserves proportioned, empty containers so slots can drop in
later without a redesign — the right rail beside the tool body, a band between the tool and the
explainer, and a band below the result. They render nothing and make no network calls. See
`src/components/shared/AdSlot.tsx`.

---

## SEO

- All 48 tool pages and 8 category pages are statically generated with their own title, description
  and keywords. Titles come from the layout's `title.template`, so `buildToolMetadata` returns the
  bare segment — building the full string in both places would render the brand twice.
- `SoftwareApplication`, `HowTo` and `BreadcrumbList` JSON-LD on tool pages; `ItemList` on listings;
  `WebSite` site-wide.
- `sitemap.xml` and `robots.txt` are generated from the registry by Next's native metadata routes.
- The OG image is generated at build time from `siteConfig`, so rebranding regenerates it.
- No external fonts, analytics or third-party scripts — the page talks to its own origin and nothing
  else.

---

## Notes on dependency choices

Three places where "latest" and "working" diverged, resolved deliberately:

- **TypeScript is pinned to 6.x.** TypeScript 7 (the Go rewrite) is out, but `typescript-eslint`
  does not support it yet and ESLint fails to start. Since strict linting is a project requirement,
  TS 6 wins until typescript-eslint ships TS 7 support.
- **ESLint is pinned to 9.x.** `eslint-plugin-react`, pulled in by `eslint-config-next@16`, crashes
  under ESLint 10.
- **`next-sitemap` is not used.** Next's native `sitemap.ts` and `robots.ts` generate both files
  directly from the tool registry, with no post-build step and no second source of truth. Installing
  `next-sitemap` alongside them would produce two competing sitemaps.
