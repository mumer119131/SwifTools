export interface Deficiency {
  id: string;
  label: string;
  prevalence: string;
  description: string;
  /** Row-major 3×3 matrix applied in linear RGB. */
  matrix: number[];
}

/**
 * Simulation matrices from Machado, Oliveira & Fernandes (2009), the model most
 * accessibility tooling uses. They are applied in linear RGB, not sRGB — the
 * gamma curve has to be undone first or the result is noticeably too dark, and
 * that is the mistake most quick implementations make.
 */
export const DEFICIENCIES: Deficiency[] = [
  {
    id: "protanopia",
    label: "Protanopia",
    prevalence: "~1% of men",
    description: "No red cones. Reds darken towards black and confuse with green.",
    matrix: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998],
  },
  {
    id: "protanomaly",
    label: "Protanomaly",
    prevalence: "~1% of men",
    description: "Reduced red sensitivity — the milder form of protanopia.",
    matrix: [0.458064, 0.679578, -0.137642, 0.092785, 0.846313, 0.060902, -0.007494, -0.016807, 1.024301],
  },
  {
    id: "deuteranopia",
    label: "Deuteranopia",
    prevalence: "~1% of men",
    description: "No green cones. The most common form of severe colour blindness.",
    matrix: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.011820, 0.042940, 0.968881],
  },
  {
    id: "deuteranomaly",
    label: "Deuteranomaly",
    prevalence: "~5% of men",
    description: "Reduced green sensitivity — by far the most common of all, and often undiagnosed.",
    matrix: [0.547494, 0.607765, -0.155259, 0.181692, 0.781742, 0.036566, -0.010410, 0.027275, 0.983136],
  },
  {
    id: "tritanopia",
    label: "Tritanopia",
    prevalence: "~0.01%",
    description: "No blue cones. Blues and greens confuse, yellows look pink.",
    matrix: [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.303900],
  },
  {
    id: "tritanomaly",
    label: "Tritanomaly",
    prevalence: "~0.01%",
    description: "Reduced blue sensitivity — the milder form of tritanopia.",
    matrix: [1.017277, 0.027029, -0.044306, -0.006113, 0.958479, 0.047634, 0.006379, 0.248708, 0.744913],
  },
  {
    id: "achromatopsia",
    label: "Achromatopsia",
    prevalence: "~0.003%",
    description: "No colour vision at all. Everything is luminance.",
    matrix: [0.212656, 0.715158, 0.072186, 0.212656, 0.715158, 0.072186, 0.212656, 0.715158, 0.072186],
  },
  {
    id: "achromatomaly",
    label: "Achromatomaly",
    prevalence: "rare",
    description: "Severely reduced colour perception, short of total.",
    matrix: [0.618, 0.320, 0.062, 0.163, 0.775, 0.062, 0.163, 0.320, 0.516],
  },
];

/** sRGB → linear. The transfer curve is not a simple 2.2 power. */
function toLinear(value: number): number {
  const scaled = value / 255;
  return scaled <= 0.04045 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
}

function toSrgb(value: number): number {
  const clamped = Math.max(0, Math.min(1, value));
  const encoded = clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * clamped ** (1 / 2.4) - 0.055;
  return Math.round(encoded * 255);
}

export function simulatePixel(
  r: number,
  g: number,
  b: number,
  matrix: number[],
): [number, number, number] {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

  return [
    toSrgb(matrix[0] * lr + matrix[1] * lg + matrix[2] * lb),
    toSrgb(matrix[3] * lr + matrix[4] * lg + matrix[5] * lb),
    toSrgb(matrix[6] * lr + matrix[7] * lg + matrix[8] * lb),
  ];
}

/** Applies a matrix to a whole ImageData buffer in place. */
export function simulateImage(data: Uint8ClampedArray, matrix: number[]): void {
  for (let index = 0; index < data.length; index += 4) {
    const [r, g, b] = simulatePixel(data[index], data[index + 1], data[index + 2], matrix);
    data[index] = r;
    data[index + 1] = g;
    data[index + 2] = b;
  }
}

export function hexToRgb(hex: string): [number, number, number] | null {
  const cleaned = hex.trim().replace(/^#/, "");
  const full =
    cleaned.length === 3
      ? cleaned.split("").map((character) => character + character).join("")
      : cleaned;

  if (!/^[0-9a-f]{6}$/i.test(full)) return null;

  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}
