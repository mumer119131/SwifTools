import { rgbToHex, type Rgb } from "@/tools/color-picker/logic";

export type BlendSpace = "srgb" | "oklab";

const clamp255 = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

/* --------------------------------------------------- sRGB ⇄ linear ⇄ OKLab */

function toLinear(channel: number): number {
  const v = channel / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function fromLinear(value: number): number {
  const v = value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055;
  return clamp255(v * 255);
}

interface Oklab {
  L: number;
  a: number;
  b: number;
}

function rgbToOklab({ r, g, b }: Rgb): Oklab {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

function oklabToRgb({ L, a, b }: Oklab): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return {
    r: fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  };
}

/* ------------------------------------------------------------------- mixing */

/**
 * Blends two colours at `amount` (0 = all of `from`, 1 = all of `to`).
 *
 * sRGB interpolation is what `mix-blend-mode` and naive gradients do, and it
 * famously passes through a desaturated grey between opposite hues — blue to
 * yellow goes via mud. OKLab is perceptually uniform, so the midpoint looks
 * like a midpoint. Both are offered because sRGB is still what most existing
 * CSS produces, and matching it is sometimes the point.
 */
export function mix(from: Rgb, to: Rgb, amount: number, space: BlendSpace): Rgb {
  const t = Math.max(0, Math.min(1, amount));

  if (space === "srgb") {
    return {
      r: clamp255(from.r + (to.r - from.r) * t),
      g: clamp255(from.g + (to.g - from.g) * t),
      b: clamp255(from.b + (to.b - from.b) * t),
    };
  }

  const a = rgbToOklab(from);
  const b = rgbToOklab(to);
  return oklabToRgb({
    L: a.L + (b.L - a.L) * t,
    a: a.a + (b.a - a.a) * t,
    b: a.b + (b.b - a.b) * t,
  });
}

export interface MixStep {
  amount: number;
  rgb: Rgb;
  hex: string;
  label: string;
}

export function buildRamp(from: Rgb, to: Rgb, steps: number, space: BlendSpace): MixStep[] {
  const count = Math.max(2, Math.min(21, steps));
  return Array.from({ length: count }, (_, index) => {
    const amount = index / (count - 1);
    const rgb = mix(from, to, amount, space);
    return {
      amount,
      rgb,
      hex: rgbToHex(rgb),
      label: `${Math.round(amount * 100)}%`,
    };
  });
}

/** A CSS gradient reproducing the ramp, in the same interpolation space. */
export function toCssGradient(from: Rgb, to: Rgb, space: BlendSpace): string {
  const a = rgbToHex(from);
  const b = rgbToHex(to);
  return space === "oklab"
    ? `linear-gradient(in oklab to right, ${a}, ${b})`
    : `linear-gradient(to right, ${a}, ${b})`;
}
