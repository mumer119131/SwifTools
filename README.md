# SwiftKnife

A fast, free collection of PDF, image, text, developer and converter tools. Almost everything runs
in the browser — files are never uploaded.

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

### Planned tools

Tools not built yet live in the `plannedTools` array in `src/config/tools.ts` with
`status: "soon"`. They get a real, crawlable page showing a coming-soon state, and are excluded from
search indexing until they go live. Running `pnpm new:tool` with a planned tool's slug promotes it —
delete its `plannedTools` entry afterwards.

---

## Architecture

```
src/
  app/
    layout.tsx                  root shell: fonts, theme, ⌘K provider, header/footer
    page.tsx                    landing page
    [category]/page.tsx         category listing        (SSG, 8 pages)
    [category]/[tool]/page.tsx  tool page               (SSG, one per registry entry)
    (legal)/privacy, terms
    sitemap.ts robots.ts manifest.ts opengraph-image.tsx icon.tsx apple-icon.tsx
  components/
    layout/     Header, Footer, Logo, ThemeToggle, SearchCommand (⌘K)
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
dependencies (`pdf-lib`, `pdfjs-dist`, `mammoth`, `docx`, `jszip`) — is only fetched when someone
opens that tool's page. None of it reaches the homepage bundle.

### Client vs. server

Every Phase 1 tool runs **entirely in the browser** via Canvas, the File API and WASM. That is the
product's main selling point, not just an optimisation: no upload wait, no server cost, and files
that genuinely never leave the device. Each tool declares this in its `processing` field, and the
page states it plainly.

Heavy work goes into a Web Worker so the UI never freezes — `src/tools/remove-background/worker.ts`
is the reference example.

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

- Every tool and category page is statically generated with its own title, description and keywords.
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
