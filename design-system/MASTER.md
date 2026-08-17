# PocketToolz — Design System (Source of Truth)

> Locked in response to §0 of `Instruction.md`. Every component reads these tokens via CSS
> variables. No raw hex in JSX, ever.

## 1. Direction

| Decision | Value |
|---|---|
| Reference aesthetic | **Linear** — dark-first, near-black surfaces, hairline borders, ambient gradient wash, restrained micro-interactions |
| Fonts | **Geist Sans** (UI/headings) + **Geist Mono** (code, counts, byte sizes, hex values) |
| Chrome color | **Monochrome** — CTAs, focus rings, and active states are pure foreground/background |
| Category color | **8 accent hues**, used *only* in category icons, badges, and card glows |
| Theme support | Dark **and** light, both fully designed (§3 of the brief) |

Light mode is not an inversion. Dark mode leans on *elevation via lightness*; light mode leans on
*elevation via hairline borders and a single soft shadow*. They are designed as two separate
surfaces that share one skeleton.

## 2. Core tokens

All colors are `oklch()` so the two themes stay perceptually matched. Defined in
`src/styles/globals.css` under `:root` and `.dark`.

### Surfaces

| Token | Dark | Light | Use |
|---|---|---|---|
| `--background` | `#08090A` | `#FFFFFF` | page |
| `--surface` | `#0E0F11` | `#FCFCFD` | cards, panels, dropzone |
| `--surface-elevated` | `#141517` | `#FFFFFF` | popovers, command palette, modals |
| `--surface-hover` | `#17181A` | `#F4F4F5` | row/card hover |
| `--border` | `rgb(255 255 255 / 0.08)` | `#E8E8EB` | hairlines |
| `--border-strong` | `rgb(255 255 255 / 0.14)` | `#D4D4D8` | focused inputs, active cards |

Never use pure `#000000` as a dark background — it smears on OLED and kills the elevation ladder.

### Text

| Token | Dark | Light | Contrast |
|---|---|---|---|
| `--foreground` | `#F7F8F8` | `#09090B` | 17:1 / 19:1 |
| `--muted-foreground` | `#8A8F98` | `#63636D` | 5.9:1 / 5.7:1 |
| `--subtle-foreground` | `#62666D` | `#8E8E98` | 3.4:1 — decorative/meta only, never body copy |

### Chrome

| Token | Dark | Light |
|---|---|---|
| `--primary` | `#F7F8F8` | `#09090B` |
| `--primary-foreground` | `#08090A` | `#FAFAFA` |
| `--ring` | `#8A8F98` | `#09090B` |
| `--destructive` | `#FF6369` | `#DC2626` |
| `--success` | `#4CC38A` | `#16A34A` |

## 3. Category accents

Each category owns one hue. It appears in exactly three places: the category icon, the
`CategoryBadge`, and a 12%-opacity tint behind the icon on `ToolCard`. It never colors a button,
a link, or body text — that keeps the chrome monochrome while 60+ tools stay scannable.

| Category | Dark | Light | Hue |
|---|---|---|---|
| PDF | `#FF6369` | `#DC3D43` | red |
| Image | `#BF7AF0` | `#8E4EC6` | violet |
| Text | `#FFCA16` | `#AB6400` | amber |
| Developer | `#4CC38A` | `#18794E` | emerald |
| Converter | `#4CCCE6` | `#0C7792` | cyan |
| Calculator | `#7B87E8` | `#5E6AD2` | indigo (Linear's own) |
| SEO | `#FF802B` | `#BD4B00` | orange |
| Generator | `#F65CB6` | `#CD1D8D` | pink |

Light-mode values are darkened so icon glyphs clear 3:1 against white. Both sets are checked
against their own theme, not assumed from one another.

## 4. Type scale

Geist Sans, `font-feature-settings: "cv11", "ss01"`. Tabular figures (`font-variant-numeric:
tabular-nums`) on every counter, byte size, and result number so values don't jitter as they update.

| Step | Size / line-height | Tracking | Use |
|---|---|---|---|
| Display | `clamp(2.75rem, 6vw, 4.5rem)` / 1.05 | `-0.035em` | hero headline |
| H1 | `2.25rem` / 1.15 | `-0.025em` | tool + category page titles |
| H2 | `1.5rem` / 1.25 | `-0.02em` | section headings |
| H3 | `1.125rem` / 1.4 | `-0.01em` | card titles |
| Body | `1rem` / 1.6 | `0` | prose (max 68ch) |
| Small | `0.875rem` / 1.5 | `0` | card descriptions, helper text |
| Micro | `0.75rem` / 1.4 | `0.02em` | badges, meta, kbd |

Body never drops below `16px` on mobile (prevents iOS auto-zoom on the ⌘K input).

## 5. Space, radius, elevation

- Spacing: 4px base — `4 8 12 16 24 32 48 64 96`. Section rhythm `48 / 64 / 96`.
- Radius: `--radius-sm: 6px`, `--radius: 10px` (cards, inputs, buttons), `--radius-lg: 14px`
  (panels, palette), `--radius-full` for pills.
- Container: `max-w-6xl` (1152px) with `px-5 / sm:px-6 / lg:px-8` gutters.
- Elevation, dark: lightness step + hairline border. **No drop shadows** — they're invisible on
  near-black and read as mud.
- Elevation, light: `0 1px 2px rgb(0 0 0 / 0.04), 0 4px 12px rgb(0 0 0 / 0.04)` plus the hairline.

## 6. Signature Linear touches

1. **Ambient hero wash** — one fixed, `pointer-events-none` radial gradient at the top of the
   viewport (indigo at 10% opacity in dark, 5% in light) plus a masked grid. Static, CSS-only, so
   it costs nothing on Core Web Vitals and needs no reduced-motion escape hatch.
2. **Hairline-first cards** — border does the work, background barely differs from the page.
3. **Gradient border on hover** — `border-color` moves from `--border` to `--border-strong` over
   150ms, with a 2px lift (`translateY(-2px)`).
4. **Focus ring, always visible** — `outline: 2px solid var(--ring); outline-offset: 2px`. Never
   removed, only restyled.

## 7. Motion

One easing family, one rhythm — this is what separates "refined" from "animated".

```
--ease-out:  cubic-bezier(0.16, 1, 0.3, 1)   /* entering, hover, expand  */
--ease-in:   cubic-bezier(0.4, 0, 1, 1)      /* exiting                  */
--dur-fast:  120ms   /* press, color/opacity swaps          */
--dur-base:  180ms   /* hover lift, border, theme swap      */
--dur-slow:  260ms   /* palette open, panel expand, reveals */
```

Rules:
- Animate `transform` and `opacity` only. Never `width`, `height`, `top`, `left`.
- Exits run at ~65% of the entering duration.
- Scroll reveals: fade + 8px rise, staggered 40ms per item, max 6 items in a stagger group.
- Press: `scale(0.98)` on cards and buttons, released on pointerup.
- Everything above collapses to `0.01ms` under `prefers-reduced-motion: reduce`.

## 8. Layout & ad reservations (§10)

Ads are **not** built. Layout leaves proportioned, empty, comment-marked containers so slots drop
in later without a redesign:

- `ToolShell` right rail — `hidden xl:block w-[300px]` beside the tool body.
- Between the tool body and the "How it works" section — full-width `min-h-[90px]` band.
- Below `ResultPanel` — full-width band.

They render nothing and make no network calls today.

## 9. Non-negotiables

- Semantic tokens only in components — a raw hex in a `.tsx` file is a bug.
- Lucide icons only, `strokeWidth={1.75}`, sized `16 / 20 / 24`. No emoji as icons.
- Every interactive target ≥ 44×44px on touch.
- Color never carries meaning alone — category hue is always paired with an icon and a label.
- Both themes verified independently before anything ships.
