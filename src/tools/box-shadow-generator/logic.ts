export interface Shadow {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  /** Alpha, kept separate so the colour picker stays a plain hex input. */
  alpha: number;
  inset: boolean;
}

/** Hex plus alpha to an rgba() string, since <input type="color"> has no alpha. */
export function rgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

export function shadowToCss(shadow: Shadow): string {
  return [
    shadow.inset ? "inset" : null,
    `${shadow.x}px`,
    `${shadow.y}px`,
    `${shadow.blur}px`,
    `${shadow.spread}px`,
    rgba(shadow.color, shadow.alpha),
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Layers are joined in order, and order matters: the first shadow in the list
 * paints on top. That is the opposite of what most people assume, and it is why
 * a tight dark shadow listed last disappears behind a wide soft one.
 */
export function toCss(shadows: Shadow[]): string {
  if (shadows.length === 0) return "none";
  return shadows.map(shadowToCss).join(",\n            ");
}

export function toTailwind(shadows: Shadow[]): string {
  return `shadow-[${shadows.map(shadowToCss).join(",").replace(/\s+/g, "_")}]`;
}

/**
 * Presets built from real elevation systems rather than invented numbers.
 *
 * The convincing ones all layer two shadows: a tight, darker one for the
 * contact edge and a wide, softer one for the ambient cast. A single shadow
 * always reads as a sticker.
 */
export const PRESETS: { label: string; shadows: Omit<Shadow, "id">[] }[] = [
  {
    label: "Subtle",
    shadows: [{ x: 0, y: 1, blur: 2, spread: 0, color: "#000000", alpha: 0.05, inset: false }],
  },
  {
    label: "Card",
    shadows: [
      { x: 0, y: 1, blur: 3, spread: 0, color: "#000000", alpha: 0.1, inset: false },
      { x: 0, y: 1, blur: 2, spread: -1, color: "#000000", alpha: 0.1, inset: false },
    ],
  },
  {
    label: "Raised",
    shadows: [
      { x: 0, y: 4, blur: 6, spread: -1, color: "#000000", alpha: 0.1, inset: false },
      { x: 0, y: 2, blur: 4, spread: -2, color: "#000000", alpha: 0.1, inset: false },
    ],
  },
  {
    label: "Floating",
    shadows: [
      { x: 0, y: 20, blur: 25, spread: -5, color: "#000000", alpha: 0.1, inset: false },
      { x: 0, y: 8, blur: 10, spread: -6, color: "#000000", alpha: 0.1, inset: false },
    ],
  },
  {
    label: "Pressed",
    shadows: [{ x: 0, y: 2, blur: 4, spread: 0, color: "#000000", alpha: 0.12, inset: true }],
  },
  {
    label: "Glow",
    shadows: [{ x: 0, y: 0, blur: 24, spread: 2, color: "#6366f1", alpha: 0.55, inset: false }],
  },
  {
    label: "Focus ring",
    shadows: [{ x: 0, y: 0, blur: 0, spread: 3, color: "#3b82f6", alpha: 0.45, inset: false }],
  },
  {
    label: "Neumorphic",
    shadows: [
      { x: 12, y: 12, blur: 24, spread: 0, color: "#000000", alpha: 0.16, inset: false },
      { x: -12, y: -12, blur: 24, spread: 0, color: "#ffffff", alpha: 0.75, inset: false },
    ],
  },
];
