import { secureRange } from "@/lib/random";

export type Filter = "any" | "pastel" | "vivid" | "dark" | "light" | "muted";

export interface Colour {
  hex: string;
  rgb: string;
  hsl: string;
  h: number;
  s: number;
  l: number;
  /** Whether black or white text reads better on it. */
  textOnTop: "#000000" | "#ffffff";
}

/**
 * Generates in HSL rather than picking three random bytes.
 *
 * Uniform RGB produces a lot of muddy near-greys, because most of the RGB cube
 * is unsaturated. Constraining saturation and lightness gives colours someone
 * would actually use, and makes filters like "pastel" a matter of range rather
 * than rejection sampling.
 */
export function randomColour(filter: Filter): Colour {
  const hue = secureRange(0, 359);

  let saturation: number;
  let lightness: number;

  switch (filter) {
    case "pastel":
      saturation = secureRange(45, 75);
      lightness = secureRange(80, 90);
      break;
    case "vivid":
      saturation = secureRange(85, 100);
      lightness = secureRange(45, 58);
      break;
    case "dark":
      saturation = secureRange(30, 80);
      lightness = secureRange(12, 28);
      break;
    case "light":
      saturation = secureRange(25, 70);
      lightness = secureRange(72, 88);
      break;
    case "muted":
      saturation = secureRange(15, 35);
      lightness = secureRange(40, 65);
      break;
    default:
      saturation = secureRange(20, 100);
      lightness = secureRange(20, 80);
  }

  return fromHsl(hue, saturation, lightness);
}

export function fromHsl(h: number, s: number, l: number): Colour {
  const [r, g, b] = hslToRgb(h, s / 100, l / 100);
  const hex = `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;

  return {
    hex,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
    h,
    s,
    l,
    // Relative luminance decides legibility far better than lightness does.
    textOnTop: luminance(r, g, b) > 0.45 ? "#000000" : "#ffffff",
  };
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  const [r, g, b] =
    h < 60 ? [c, x, 0] :
    h < 120 ? [x, c, 0] :
    h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] :
    h < 300 ? [x, 0, c] : [c, 0, x];

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

/** WCAG relative luminance. */
function luminance(r: number, g: number, b: number): number {
  const channel = (value: number) => {
    const scaled = value / 255;
    return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export const FILTERS: { id: Filter; label: string }[] = [
  { id: "any", label: "Any" },
  { id: "vivid", label: "Vivid" },
  { id: "pastel", label: "Pastel" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "muted", label: "Muted" },
];
