export interface ShadowInput {
  offsetX: number;
  offsetY: number;
  /** iOS shadowRadius / CSS blur. */
  radius: number;
  opacity: number;
  color: string;
  /** Android's only shadow control. */
  elevation: number;
}

export const defaultShadow: ShadowInput = {
  offsetX: 0,
  offsetY: 4,
  radius: 8,
  opacity: 0.15,
  color: "#000000",
  elevation: 5,
};

/**
 * Android's elevation is a single number that drives a shadow whose offset,
 * blur and opacity are all derived by the platform. There is no exact mapping
 * to iOS's four independent properties, so this approximates the Material
 * elevation curve — roughly `elevation / 2` for vertical offset and a blur a
 * little under the elevation itself.
 *
 * Offered as a starting point, clearly labelled, because the alternative is
 * people guessing.
 */
export function elevationToIos(elevation: number): Pick<ShadowInput, "offsetY" | "radius" | "opacity"> {
  const e = Math.max(0, elevation);
  return {
    offsetY: Math.round(e * 0.5 * 10) / 10,
    radius: Math.round(e * 0.8 * 10) / 10,
    opacity: Math.min(0.5, Math.round((0.1 + e * 0.012) * 100) / 100),
  };
}

/** The inverse, for people starting from an iOS design. */
export function iosToElevation(offsetY: number, radius: number): number {
  return Math.max(0, Math.round((offsetY * 0.5 + radius * 0.75) * 10) / 10);
}

export type Target = "legacy" | "modern" | "web";

/**
 * React Native 0.76 added `boxShadow`, which behaves like the CSS property on
 * both platforms. Before that, iOS used four `shadow*` props and Android had
 * only `elevation`, so a cross-platform shadow needed both — which is the
 * single most common source of "why does this look wrong on Android".
 */
export function generateStyle(shadow: ShadowInput, target: Target): string {
  const { offsetX, offsetY, radius, opacity, color, elevation } = shadow;

  if (target === "web") {
    return `boxShadow: "${offsetX}px ${offsetY}px ${radius}px ${withAlpha(color, opacity)}"`;
  }

  if (target === "modern") {
    return [
      "const styles = StyleSheet.create({",
      "  card: {",
      `    boxShadow: "${offsetX}px ${offsetY}px ${radius}px ${withAlpha(color, opacity)}",`,
      "  },",
      "});",
    ].join("\n");
  }

  return [
    "const styles = StyleSheet.create({",
    "  card: {",
    "    // iOS",
    `    shadowColor: "${color}",`,
    `    shadowOffset: { width: ${offsetX}, height: ${offsetY} },`,
    `    shadowOpacity: ${opacity},`,
    `    shadowRadius: ${radius},`,
    "",
    "    // Android — elevation is the only control, and it also",
    "    // raises the view in the z-order.",
    `    elevation: ${elevation},`,
    "  },",
    "});",
  ].join("\n");
}

/** CSS equivalent, for the live preview and the web target. */
export function toCssShadow(shadow: ShadowInput): string {
  return `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.radius}px ${withAlpha(shadow.color, shadow.opacity)}`;
}

function withAlpha(hex: string, opacity: number): string {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const presets: { label: string; shadow: ShadowInput }[] = [
  { label: "Subtle", shadow: { offsetX: 0, offsetY: 1, radius: 2, opacity: 0.1, color: "#000000", elevation: 1 } },
  { label: "Card", shadow: { offsetX: 0, offsetY: 4, radius: 8, opacity: 0.15, color: "#000000", elevation: 5 } },
  { label: "Raised", shadow: { offsetX: 0, offsetY: 8, radius: 16, opacity: 0.2, color: "#000000", elevation: 10 } },
  { label: "Modal", shadow: { offsetX: 0, offsetY: 16, radius: 32, opacity: 0.28, color: "#000000", elevation: 20 } },
];
