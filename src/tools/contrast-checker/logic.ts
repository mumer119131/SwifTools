/**
 * WCAG contrast, implemented to the 2.x specification.
 *
 * The formula is not intuitive and getting it wrong is easy: contrast is
 * computed from *relative luminance*, which requires undoing the sRGB gamma
 * curve first. Comparing the raw channel values, or comparing HSL lightness,
 * gives numbers that look plausible and are wrong — which is worse than no
 * checker at all, because it certifies inaccessible pairs as passing.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function parseColor(input: string): Rgb | null {
  const value = input.trim().toLowerCase();

  const hex = value.replace(/^#/, "");
  if (/^[0-9a-f]{3}$/.test(hex)) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
    };
  }
  if (/^[0-9a-f]{6}$/.test(hex)) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  const rgb = value.match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (rgb) {
    const [r, g, b] = [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
    if ([r, g, b].every((channel) => channel >= 0 && channel <= 255)) return { r, g, b };
  }

  return null;
}

export function toHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
}

/**
 * WCAG relative luminance.
 *
 * Each channel is normalised to 0–1, the sRGB transfer curve is undone, and the
 * results are weighted 0.2126 / 0.7152 / 0.0722 — the coefficients reflect how
 * much each primary contributes to perceived brightness, which is why green
 * dominates and blue barely registers.
 */
export function luminance({ r, g, b }: Rgb): number {
  const channel = (value: number) => {
    const scaled = value / 255;
    return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Contrast ratio, from 1:1 (identical) to 21:1 (black on white). */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = luminance(a);
  const lb = luminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  // The 0.05 offset models ambient screen flare, and is what caps the scale
  // at 21 rather than infinity.
  return (lighter + 0.05) / (darker + 0.05);
}

export interface Verdict {
  ratio: number;
  /** Normal text is anything under 18pt, or under 14pt bold. */
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
  /** Icons, form borders, focus rings — WCAG 2.1 non-text contrast. */
  uiComponents: boolean;
}

export function assess(foreground: Rgb, background: Rgb): Verdict {
  const ratio = contrastRatio(foreground, background);

  return {
    ratio,
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaNormal: ratio >= 7,
    aaaLarge: ratio >= 4.5,
    uiComponents: ratio >= 3,
  };
}

/**
 * Nudges the foreground's lightness until it passes at the target ratio.
 *
 * Walks in both directions and returns whichever passes with the smaller
 * change, so a brand colour is altered as little as the requirement allows
 * rather than being replaced with black.
 */
export function suggest(foreground: Rgb, background: Rgb, target: number): Rgb | null {
  if (contrastRatio(foreground, background) >= target) return foreground;

  const candidates: { colour: Rgb; distance: number }[] = [];

  for (const direction of [-1, 1]) {
    for (let step = 1; step <= 100; step += 1) {
      const amount = (direction * step) / 100;
      const shifted: Rgb = {
        r: clamp(foreground.r + 255 * amount),
        g: clamp(foreground.g + 255 * amount),
        b: clamp(foreground.b + 255 * amount),
      };

      if (contrastRatio(shifted, background) >= target) {
        candidates.push({ colour: shifted, distance: step });
        break;
      }
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => a.distance - b.distance);
  return candidates[0].colour;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

/** Common pairs worth testing against, and what each is for. */
export const PRESETS: { label: string; foreground: string; background: string }[] = [
  { label: "Black on white", foreground: "#000000", background: "#ffffff" },
  { label: "Grey body text", foreground: "#6b7280", background: "#ffffff" },
  { label: "Placeholder grey", foreground: "#9ca3af", background: "#ffffff" },
  { label: "White on brand blue", foreground: "#ffffff", background: "#2563eb" },
  { label: "Dark mode body", foreground: "#e5e7eb", background: "#111827" },
  { label: "Muted on dark", foreground: "#6b7280", background: "#111827" },
];
