import {
  contrastRatio,
  formatHsl,
  formatOklch,
  formatRgb,
  hslToRgb,
  rgbToHex,
  rgbToHsl,
  rgbToOklch,
  type Rgb,
} from "@/tools/color-picker/logic";

export interface Harmony {
  id: string;
  label: string;
  description: string;
  /** Hue rotations, in degrees, applied to the seed. */
  offsets: number[];
}

/**
 * Harmonies are hue rotations on the colour wheel — the relationships painters
 * have used for two centuries, not a model's guess. Saturation and lightness
 * are carried over from the seed so the set reads as one family.
 */
export const harmonies: readonly Harmony[] = [
  {
    id: "complementary",
    label: "Complementary",
    description: "The seed and its opposite. Maximum contrast — good for a single accent.",
    offsets: [0, 180],
  },
  {
    id: "analogous",
    label: "Analogous",
    description: "Neighbours on the wheel. Calm and cohesive, with no single colour fighting.",
    offsets: [-30, 0, 30],
  },
  {
    id: "triadic",
    label: "Triadic",
    description: "Three evenly spaced hues. Vivid but balanced.",
    offsets: [0, 120, 240],
  },
  {
    id: "split-complementary",
    label: "Split complementary",
    description: "The opposite hue's two neighbours. Contrast without the harshness.",
    offsets: [0, 150, 210],
  },
  {
    id: "tetradic",
    label: "Tetradic",
    description: "Two complementary pairs. Rich, but one colour should dominate.",
    offsets: [0, 90, 180, 270],
  },
  {
    id: "monochromatic",
    label: "Monochromatic",
    description: "One hue at several lightnesses. The safest choice for interfaces.",
    offsets: [0, 0, 0, 0, 0],
  },
];

export interface Swatch {
  hex: string;
  rgb: Rgb;
  /** 50–950, matching the scale Tailwind and most design systems use. */
  step: number;
  /** True when white text meets AA on this swatch. */
  preferWhiteText: boolean;
}

export interface PaletteEntry {
  name: string;
  base: Swatch;
  ramp: Swatch[];
}

const WHITE: Rgb = { r: 255, g: 255, b: 255 };
const BLACK: Rgb = { r: 0, g: 0, b: 0 };

function toSwatch(rgb: Rgb, step: number): Swatch {
  return {
    hex: rgbToHex(rgb),
    rgb,
    step,
    preferWhiteText: contrastRatio(rgb, WHITE) >= contrastRatio(rgb, BLACK),
  };
}

/** Target lightness for each step of the ramp, as a percentage. */
const RAMP: [number, number][] = [
  [50, 97],
  [100, 94],
  [200, 86],
  [300, 77],
  [400, 66],
  [500, 55],
  [600, 46],
  [700, 38],
  [800, 30],
  [900, 23],
  [950, 15],
];

/**
 * Builds a 50–950 ramp by holding the hue and easing saturation toward the
 * extremes.
 *
 * Saturation is reduced at both ends because a fully saturated near-white or
 * near-black reads as a colour cast rather than a tint — the same reason
 * design systems desaturate their 50 and 950 steps.
 */
export function buildRamp(seed: Rgb): Swatch[] {
  const { h, s } = rgbToHsl(seed);

  return RAMP.map(([step, lightness]) => {
    const distanceFromMid = Math.abs(lightness - 55) / 45;
    const saturation = s * (1 - distanceFromMid * 0.35);
    return toSwatch(hslToRgb({ h, s: saturation, l: lightness }), step);
  });
}

export function buildPalette(seed: Rgb, harmony: Harmony): PaletteEntry[] {
  const { h, s, l } = rgbToHsl(seed);

  if (harmony.id === "monochromatic") {
    // Vary lightness rather than hue, spread around the seed.
    return [-30, -15, 0, 15, 30].map((delta, index) => {
      const lightness = Math.max(8, Math.min(92, l + delta));
      const rgb = hslToRgb({ h, s, l: lightness });
      return {
        name: `Shade ${index + 1}`,
        base: toSwatch(rgb, 500),
        ramp: buildRamp(rgb),
      };
    });
  }

  return harmony.offsets.map((offset, index) => {
    const rgb = hslToRgb({ h: (((h + offset) % 360) + 360) % 360, s, l });
    return {
      name: offset === 0 ? "Primary" : `Accent ${index}`,
      base: toSwatch(rgb, 500),
      ramp: buildRamp(rgb),
    };
  });
}

/* ------------------------------------------------------------------ export */

export type ExportFormat = "css" | "tailwind" | "json" | "scss";

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function exportPalette(palette: PaletteEntry[], format: ExportFormat): string {
  if (format === "json") {
    return JSON.stringify(
      Object.fromEntries(
        palette.map((entry) => [
          slugify(entry.name),
          Object.fromEntries(entry.ramp.map((swatch) => [swatch.step, swatch.hex])),
        ]),
      ),
      null,
      2,
    );
  }

  if (format === "tailwind") {
    const body = palette
      .map((entry) => {
        const steps = entry.ramp
          .map((swatch) => `          ${swatch.step}: "${swatch.hex}",`)
          .join("\n");
        return `        "${slugify(entry.name)}": {\n${steps}\n        },`;
      })
      .join("\n");
    return `// tailwind.config.ts\nexport default {\n  theme: {\n    extend: {\n      colors: {\n${body}\n      },\n    },\n  },\n};`;
  }

  const prefix = format === "scss" ? "$" : "  --";
  const lines = palette.flatMap((entry) =>
    entry.ramp.map(
      (swatch) => `${prefix}${slugify(entry.name)}-${swatch.step}: ${swatch.hex};`,
    ),
  );

  return format === "scss" ? lines.join("\n") : `:root {\n${lines.join("\n")}\n}`;
}

export { formatHsl, formatOklch, formatRgb, rgbToHex, rgbToOklch };
