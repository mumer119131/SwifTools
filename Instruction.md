# SwiftKnife — Build Instructions for Claude Code

> This document is the single source of truth for building this project.
> Read it fully before writing any code. Ask me the questions in **§0** before scaffolding.

---

## 0. Ask Me First (before you scaffold)

Before generating anything, ask me these and wait for answers:

1. **Design language** — which reference aesthetic should the UI emulate? Give me options like:
   - **Vercel / Geist** — black & white, high contrast, tight geometric sans, lots of whitespace
   - **Linear** — dark-first, subtle gradients, refined micro-interactions
   - **Stripe** — clean light, soft shadows, friendly but professional
   - **Raycast** — dark, glassy, keyboard-driven feel
   - **shadcn/ui default** — neutral, minimal, developer-favorite
   - Or let me name my own reference.
2. **Primary font pairing** — offer 2–3 options based on the chosen aesthetic (e.g. Geist Sans + Geist Mono, Inter + JetBrains Mono).
3. **Accent color** — one accent for CTAs/active states, or fully monochrome?

Once I answer, invoke your **UI/UX design skill** (the strongest design skill you have available — e.g. `frontend-design`) to lock the design tokens, then proceed.

---

## 1. Project Identity — MUST BE DYNAMIC

The app name **must never be hardcoded** anywhere in the UI, metadata, or copy. It currently is **"SwiftKnife"** but I need to change it in one place.

Create `src/config/site.ts`:

```ts
export const siteConfig = {
  name: "SwiftKnife",
  tagline: "Every tool you need, sharp and fast.",
  description: "A fast, free collection of PDF, image, text, developer, and converter tools — all in one place.",
  url: "https://swiftknife.com",
  ogImage: "/og.png",
  author: "Umer Labs",
  links: {
    twitter: "",
    github: "",
  },
} as const;
```

**Rule:** every reference to the app name in the entire codebase — header, footer, `<title>`, meta tags, OG images, manifest, emails, everything — imports from `siteConfig.name`. Zero string literals of the name in JSX or metadata. Changing `siteConfig.name` must rebrand the whole app.

---

## 2. Tech Stack — Latest Everything

Install the newest stable versions at build time (run `npm view <pkg> version` — do not pin to versions in this doc, they may be stale):

- **Next.js** (latest, App Router, Turbopack, TypeScript, `src/` dir)
- **React** (latest)
- **Tailwind CSS** (latest — v4 if stable, use the new CSS-first config if so)
- **shadcn/ui** for base primitives
- **lucide-react** for icons
- **next-themes** for dark/light
- **next-sitemap** for sitemap/robots
- Per-tool libs installed only when that tool is built (`pdf-lib`, `browser-image-compression`, `qrcode`, etc.)

Package manager: **pnpm** (fallback npm). Node: latest LTS.

---

## 3. Theme — Dark + Light, Both Polished

- Full dark + light mode via `next-themes`, class strategy.
- Both themes must be *equally* refined — no half-baked light mode.
- Toggle in the header, defaults to system, persists choice.
- All colors are CSS variables / Tailwind tokens — never hardcoded hex in components.

---

## 4. Modular Tool Architecture (the core of the project)

This is the most important section. Adding a new tool must take **one folder + one registry entry**, nothing else.

### 4.1 Tool Registry

`src/config/tools.ts` — the single source that drives the homepage grid, category pages, search, breadcrumbs, sitemap, and SEO metadata.

```ts
import { LucideIcon } from "lucide-react";

export type ToolCategory =
  | "pdf" | "image" | "text" | "developer" | "converter"
  | "calculator" | "seo" | "generator";

export interface Tool {
  slug: string;              // "compress-pdf" -> /pdf/compress-pdf
  name: string;              // "Compress PDF"
  category: ToolCategory;
  description: string;       // used in cards + meta description
  keywords: string[];        // SEO long-tail
  icon: LucideIcon;
  processing: "client" | "server"; // YOU decide per tool (see §4.4)
  status: "live" | "soon";
}
```

Category metadata (label, icon, accent, description) lives in `src/config/categories.ts`.

### 4.2 Tool Folder Convention

Each tool is fully self-contained:

```
src/tools/compress-pdf/
  meta.ts        // exports the Tool registry object
  Tool.tsx       // the tool UI (default export)
  logic.ts       // pure processing functions (unit-testable)
  worker.ts      // optional Web Worker for heavy client work
```

A generator script (`pnpm new:tool`) scaffolds this folder + appends to the registry. Build it.

### 4.3 Dynamic Routing

```
src/app/[category]/[tool]/page.tsx
```

- `generateStaticParams` from the registry → every tool is SSG.
- `generateMetadata` pulls title/description/keywords/OG from the tool's `meta.ts`.
- The page lazy-loads the tool's `Tool.tsx` (`next/dynamic`), so tool code never bloats the homepage bundle.
- Adds JSON-LD (`SoftwareApplication` + `HowTo`) automatically from meta.

### 4.4 Processing Model — Decide Per Tool

I'm leaving this to your judgment. Rule of thumb:
- **Client** for anything that can run in-browser (image compress/resize/convert via Canvas/WASM, text tools, converters, generators, calculators, simple PDF merge/split via `pdf-lib`). Zero server cost, instant, private.
- **Server** (Next.js API route, stateless — process & stream back, never store files) only when a tool genuinely needs it (heavy PDF compression, format conversions needing native binaries, background removal).
- Use **Web Workers** for heavy client-side work so the UI never freezes.
- Mark the choice in each tool's `processing` field.

---

## 5. Shared Components — Build Once, Reuse Everywhere

Everything is a component. Build these shared primitives first, then every tool composes them:

- `ToolShell` — consistent wrapper: title, description, breadcrumb, the tool body, "how it works" section, related tools.
- `FileDropzone` — drag & drop + click, multi-file, type validation, previews.
- `ResultPanel` — download button, copy button, "process another" reset.
- `ProgressBar` / `Spinner` — unified processing feedback.
- `CopyButton`, `DownloadButton`.
- `ToolCard` — used on homepage + category + search + related.
- `CategoryBadge`, `Breadcrumbs`, `SearchCommand` (⌘K palette over the registry).
- `EmptyState`, `ErrorBoundary` per tool.

Keep components small, typed, and presentational. Logic lives in `logic.ts`, not components.

---

## 6. Categories & Discovery

Divide tools into clear categories, each with its own icon + accent + landing section:

- **PDF** · **Image** · **Text** · **Developer** · **Converter** · **Calculator** · **SEO** · **Generator**

Discovery features:
- Homepage: hero + category grid + "popular tools" + full searchable grid.
- `/[category]` pages listing that category's tools.
- **⌘K command palette** to fuzzy-search all tools by name/keyword — this is a killer UX feature, build it.
- Every tool page shows **related tools** from the same category.
- Each tool has a **distinct lucide icon** (pick sensible ones) for scannability.

---

## 7. Tools to Build

Ship in phases. Every tool registered from day 1 (with `status: "soon"` if not built yet) so the site looks full and pages get indexed.

### Phase 1 — Launch
**PDF:** Merge PDF · Split PDF · Compress PDF · PDF→Word · PDF→JPG · Word→PDF · JPG→PDF
**Image:** Compress Image · Resize Image · Convert (PNG/JPG/WEBP/SVG) · Crop Image · Add Watermark · Remove Background
**Text:** Word Counter · Character Counter · Case Converter · Remove Duplicate Lines · Text Diff Checker

### Phase 2 — Developer & Converters
**Developer:** JSON Formatter/Validator · Base64 Encode/Decode · URL Encode/Decode · HTML Formatter · Regex Tester · Color Picker (HEX↔RGB) · UUID Generator · Markdown→HTML
**Converter:** Unit Converter · Currency Converter (live rates) · Timezone Converter · Number Base Converter

### Phase 3 — Calculators & SEO
**Calculator:** Loan/EMI · Compound Interest · Tax · BMI · Calorie · Age · Percentage · Invoice Generator
**SEO:** Meta Tag Generator · Word Density Checker · Robots.txt Generator · Sitemap Generator

### Phase 4 — Generators / Viral
**Generator:** Password Generator · QR Code Generator · Fake Data Generator · Lorem Ipsum · Pomodoro Timer · Screen Resolution Checker

Build Phase 1 fully working first. Register all four phases in `tools.ts`.

---

## 8. Landing Page

Modern, conversion-focused, scannable:

1. **Hero** — big type: `{siteConfig.name}` + tagline + ⌘K search bar + primary CTA. Subtle gradient/grid background matching the chosen aesthetic.
2. **Trust strip** — "100% free · No signup · Files never leave your browser" (privacy = a real selling point since most tools run client-side).
3. **Category grid** — 8 cards, icon + name + tool count, hover lift.
4. **Popular tools** — curated ToolCards.
5. **"Why {name}"** — fast, private, free, no limits (3–4 feature blocks).
6. **Full tool directory** — searchable/filterable grid of everything.
7. **Footer** — categories, all tools, legal (privacy/terms), name from `siteConfig`.

Motion: tasteful only (hover lifts, fade-ins on scroll). No gratuitous animation.

---

## 9. SEO & Performance (this is the revenue engine)

- Every tool page SSG with unique title/description/keywords from its meta.
- `next-sitemap` auto-generates sitemap + robots from the registry.
- JSON-LD (`SoftwareApplication`, `HowTo`, `BreadcrumbList`) on tool pages.
- Semantic HTML, proper headings, alt text, `next/image` everywhere.
- Target Core Web Vitals green: lazy-load tool logic, code-split per route, minimal client JS on the homepage.
- Open Graph + Twitter cards, dynamic OG image using `siteConfig.name`.
- `manifest.ts` and favicons driven by `siteConfig`.

---

## 10. Ads — Later, but Leave Room

Do **not** add ads now. Keep the UI clean. But:
- Design layouts so ad slots can drop into sidebar / between-steps / below-results later **without redesign**.
- Reserve those regions as empty, well-proportioned containers now (commented, no network calls).

---

## 11. Code Quality & Conventions

- TypeScript strict. No `any`.
- ESLint + Prettier configured.
- Absolute imports via `@/`.
- Pure logic functions separated from UI (so tools are testable).
- Accessible: keyboard nav, focus states, ARIA on interactive bits, respects `prefers-reduced-motion`.
- Consistent, self-documenting naming. Comment only non-obvious logic.

---

## 12. Suggested Project Structure

```
src/
  app/
    layout.tsx
    page.tsx                 // landing
    [category]/page.tsx      // category listing
    [category]/[tool]/page.tsx
    sitemap.ts  robots.ts  manifest.ts
  components/
    layout/    (Header, Footer, ThemeToggle, SearchCommand)
    shared/    (ToolShell, FileDropzone, ResultPanel, ToolCard, ...)
    ui/        (shadcn primitives)
  tools/
    <tool-slug>/ (meta.ts, Tool.tsx, logic.ts, worker.ts?)
  config/
    site.ts        // ← app name lives here, dynamic
    tools.ts       // ← tool registry
    categories.ts
  lib/       (utils, seo helpers, hooks)
  styles/    (globals.css, theme tokens)
scripts/
  new-tool.ts      // pnpm new:tool scaffolder
```

---

## 13. Build Order

1. Ask me the **§0** design questions; lock design tokens via the design skill.
2. Scaffold Next.js (latest) + Tailwind + shadcn + theming + `siteConfig`.
3. Build layout shell (Header/Footer/ThemeToggle/⌘K palette) — all name-dynamic.
4. Build the registry + categories + shared components + `ToolShell`.
5. Build dynamic routing + SSG + metadata + JSON-LD.
6. Build the landing page.
7. Implement **Phase 1** tools end-to-end; register Phases 2–4 as `soon`.
8. Wire SEO (sitemap/robots/OG) + Lighthouse pass.
9. Build the `new:tool` scaffolder script.
10. README documenting how to add a tool and how to rebrand (change `siteConfig.name`).

---

**Reminder:** app name is dynamic (§1), tools are modular (§4), everything is a reusable component (§5), latest versions (§2), both themes polished (§3), ads later (§10). Ask me the §0 design questions before you start.