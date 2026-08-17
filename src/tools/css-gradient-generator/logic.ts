export interface Stop {
  id: string;
  color: string;
  /** Percent along the gradient line. */
  position: number;
}

export type GradientType = "linear" | "radial" | "conic";

export interface Gradient {
  type: GradientType;
  angle: number;
  stops: Stop[];
  /** Radial and conic only — where the gradient is centred, in percent. */
  centerX: number;
  centerY: number;
  /** Radial only. */
  shape: "circle" | "ellipse";
  repeating: boolean;
}

/**
 * Builds the CSS.
 *
 * Stops are sorted by position before output. CSS does not require it, but an
 * out-of-order stop is silently clamped to the previous one's position, which
 * produces a hard band where a fade was intended — and looks like a browser
 * bug rather than a typo.
 */
export function toCss(gradient: Gradient): string {
  const stops = [...gradient.stops]
    .sort((a, b) => a.position - b.position)
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ");

  const prefix = gradient.repeating ? "repeating-" : "";

  if (gradient.type === "linear") {
    return `${prefix}linear-gradient(${gradient.angle}deg, ${stops})`;
  }

  const position = `at ${gradient.centerX}% ${gradient.centerY}%`;

  if (gradient.type === "radial") {
    return `${prefix}radial-gradient(${gradient.shape} ${position}, ${stops})`;
  }

  return `${prefix}conic-gradient(from ${gradient.angle}deg ${position}, ${stops})`;
}

export function toTailwind(gradient: Gradient): string {
  return `bg-[${toCss(gradient).replace(/\s+/g, "_")}]`;
}

/** Presets people actually reach for, rather than a rainbow of random hues. */
export const PRESETS: { label: string; gradient: Partial<Gradient> & { stops: Stop[] } }[] = [
  { label: "Sunset", gradient: { type: "linear", angle: 135, stops: stops(["#f97316", "#db2777"]) } },
  { label: "Ocean", gradient: { type: "linear", angle: 160, stops: stops(["#0ea5e9", "#4f46e5"]) } },
  { label: "Mint", gradient: { type: "linear", angle: 120, stops: stops(["#34d399", "#0891b2"]) } },
  { label: "Dusk", gradient: { type: "linear", angle: 200, stops: stops(["#1e293b", "#4c1d95", "#be185d"]) } },
  { label: "Peach", gradient: { type: "linear", angle: 45, stops: stops(["#fed7aa", "#fda4af"]) } },
  { label: "Steel", gradient: { type: "linear", angle: 180, stops: stops(["#f8fafc", "#cbd5e1"]) } },
  { label: "Spotlight", gradient: { type: "radial", stops: stops(["#fef3c7", "#78350f"]) } },
  { label: "Colour wheel", gradient: { type: "conic", angle: 0, stops: stops(["#ef4444", "#eab308", "#22c55e", "#3b82f6", "#a855f7", "#ef4444"]) } },
];

function stops(colors: string[]): Stop[] {
  return colors.map((color, index) => ({
    id: `stop-${index}`,
    color,
    position: colors.length === 1 ? 0 : Math.round((index / (colors.length - 1)) * 100),
  }));
}
