/**
 * Rendering for Play Store listing images.
 *
 * Everything is painted directly onto a canvas rather than rasterising styled
 * HTML through an SVG foreignObject. That is the same choice the other image
 * generators here make and for the same reason: foreignObject rendering depends
 * on which fonts the browser happens to have and produces different output on
 * different machines, which is unacceptable for an asset that has to be
 * pixel-exact at a fixed size.
 */

/* ------------------------------------------------------------------ specs */

/**
 * Google Play's actual requirements, as of the current Play Console rules.
 *
 * The constraint people trip over is the alpha channel: Play rejects
 * screenshots and feature graphics containing transparency, which is why every
 * export here fills an opaque background first. The other is the aspect ratio
 * rule — the longer side may not exceed twice the shorter side, so a very tall
 * 9:21 screenshot is rejected even though it is what the phone produced.
 */
export const PLAY_SPECS = {
  minScreenshots: 2,
  maxScreenshots: 8,
  minSide: 320,
  maxSide: 3840,
  /** Longest side ÷ shortest side may not exceed this. Screenshots only. */
  maxAspectRatio: 2,
} as const;

/** The feature graphic has one permitted size and is exempt from the above. */
export const FEATURE_GRAPHIC = { width: 1024, height: 500 } as const;

export interface SizePreset {
  id: string;
  label: string;
  width: number;
  height: number;
  /**
   * Which set of Play rules applies. The feature graphic is a fixed
   * 1024 × 500 and is exempt from the screenshot constraints — 1024:500 is
   * 2.05:1, which would fail the screenshot aspect ratio limit, so treating
   * them alike wrongly reports the one size Play mandates as invalid.
   */
  kind: "screenshot" | "feature";
  /** What this asset is for, shown under the option. */
  note: string;
}

export const SIZE_PRESETS: SizePreset[] = [
  {
    id: "phone-portrait",
    kind: "screenshot" as const,
    label: "Phone portrait",
    width: 1080,
    height: 1920,
    note: "9:16 — the standard phone screenshot. Two to eight required.",
  },
  {
    id: "phone-landscape",
    kind: "screenshot" as const,
    label: "Phone landscape",
    width: 1920,
    height: 1080,
    note: "16:9 — for apps and games that run in landscape.",
  },
  {
    id: "tablet-7",
    kind: "screenshot" as const,
    label: "7-inch tablet",
    width: 1200,
    height: 1920,
    note: "Optional, but a listing without them shows phone shots stretched.",
  },
  {
    id: "tablet-10",
    kind: "screenshot" as const,
    label: "10-inch tablet",
    width: 1600,
    height: 2560,
    note: "Optional. Needed to qualify for tablet recommendations.",
  },
  {
    id: "feature-graphic",
    kind: "feature" as const,
    label: "Feature graphic",
    width: 1024,
    height: 500,
    note: "Required for every listing. Shown at the top of the store page.",
  },
];

/* ----------------------------------------------------------------- themes */

export interface Theme {
  id: string;
  label: string;
  /** Two stops; identical values give a flat background. */
  background: [string, string];
  /** Gradient angle in degrees, 0 being left to right. */
  angle: number;
  headline: string;
  subtext: string;
  /** Phone bezel colour. */
  bezel: string;
  /** Decorative blob behind the device, or null for none. */
  glow: string | null;
}

export const THEMES: Theme[] = [
  { id: "midnight", label: "Midnight", background: ["#0f172a", "#1e293b"], angle: 135, headline: "#f8fafc", subtext: "#94a3b8", bezel: "#0b1120", glow: "rgba(99,102,241,0.30)" },
  { id: "indigo", label: "Indigo", background: ["#4f46e5", "#7c3aed"], angle: 135, headline: "#ffffff", subtext: "#ddd6fe", bezel: "#1e1b4b", glow: "rgba(255,255,255,0.16)" },
  { id: "sunset", label: "Sunset", background: ["#f97316", "#db2777"], angle: 140, headline: "#ffffff", subtext: "#ffe4e6", bezel: "#431407", glow: "rgba(255,255,255,0.18)" },
  { id: "mint", label: "Mint", background: ["#059669", "#0891b2"], angle: 130, headline: "#ffffff", subtext: "#d1fae5", bezel: "#042f2e", glow: "rgba(255,255,255,0.16)" },
  { id: "paper", label: "Paper", background: ["#f8fafc", "#e2e8f0"], angle: 160, headline: "#0f172a", subtext: "#475569", bezel: "#1e293b", glow: "rgba(15,23,42,0.06)" },
  { id: "sand", label: "Sand", background: ["#fef3c7", "#fed7aa"], angle: 150, headline: "#431407", subtext: "#92400e", bezel: "#292524", glow: "rgba(120,53,15,0.10)" },
  { id: "slate", label: "Slate", background: ["#1e293b", "#334155"], angle: 120, headline: "#f1f5f9", subtext: "#94a3b8", bezel: "#020617", glow: null },
  { id: "mono", label: "Mono", background: ["#111827", "#111827"], angle: 0, headline: "#ffffff", subtext: "#9ca3af", bezel: "#000000", glow: null },
];

export type Layout = "text-top" | "text-bottom" | "text-side" | "full-bleed";

export const LAYOUTS: { id: Layout; label: string; note: string }[] = [
  { id: "text-top", label: "Text above", note: "Caption at the top, device below. The most common arrangement." },
  { id: "text-bottom", label: "Text below", note: "Device at the top — keeps the screen visible in a small thumbnail." },
  { id: "text-side", label: "Text beside", note: "Side by side. Best on landscape and tablet sizes." },
  { id: "full-bleed", label: "No caption", note: "The screenshot alone, filling the frame." },
];

export const FONT_STACKS: { id: string; label: string; stack: string }[] = [
  { id: "system", label: "System sans", stack: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" },
  { id: "grotesk", label: "Grotesque", stack: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  { id: "serif", label: "Serif", stack: "Georgia, 'Times New Roman', serif" },
  { id: "mono", label: "Monospace", stack: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace" },
];

/* ---------------------------------------------------------------- drawing */

export interface Slide {
  id: string;
  headline: string;
  subtext: string;
  /** Loaded screenshot, or null for a slide that is still just text. */
  image: HTMLImageElement | null;
  fileName: string;
}

export interface RenderOptions {
  theme: Theme;
  layout: Layout;
  width: number;
  height: number;
  fontStack: string;
  /** Draw a phone bezel around the screenshot. */
  showFrame: boolean;
  /** Degrees, positive tilts clockwise. */
  tilt: number;
  /** Headline size as a percentage of canvas height. */
  headlineScale: number;
  /** Index in the set, used only for the fallback placeholder text. */
  index: number;
}

/**
 * Wraps text to a width by measuring it in the font actually in use.
 *
 * Counting characters cannot work — "WWWW" and "iiii" are the same length and
 * nothing like the same width — and a caption that overflows its region is the
 * one defect that makes a store listing look amateur.
 */
export function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];

  for (const paragraph of text.split("\n")) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }

    let line = words[0];
    for (const word of words.slice(1)) {
      const candidate = `${line} ${word}`;
      if (context.measureText(candidate).width <= maxWidth) line = candidate;
      else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }

  return lines;
}

/** A rounded rectangle path, since canvas has no primitive for one. */
function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + width - r, y);
  context.quadraticCurveTo(x + width, y, x + width, y + r);
  context.lineTo(x + width, y + height - r);
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  context.lineTo(x + r, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
}

/**
 * Draws the screenshot, optionally inside a phone bezel, fitted to a region.
 *
 * The frame takes the screenshot's own aspect ratio rather than forcing a fixed
 * one. Phones now ship anything from 16:9 to 20:9, and forcing a single shape
 * would crop the top and bottom off a tall screenshot — exactly the part that
 * usually holds the app's header and navigation.
 */
function drawDevice(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  region: { x: number; y: number; width: number; height: number },
  options: RenderOptions,
): void {
  const shotRatio = image.naturalWidth / image.naturalHeight;

  // Fit the screenshot inside the region, preserving its shape.
  let screenWidth = region.width;
  let screenHeight = screenWidth / shotRatio;
  if (screenHeight > region.height) {
    screenHeight = region.height;
    screenWidth = screenHeight * shotRatio;
  }

  const bezel = options.showFrame ? Math.max(6, screenWidth * 0.035) : 0;
  const outerWidth = screenWidth + bezel * 2;
  const outerHeight = screenHeight + bezel * 2;

  // Re-fit if the bezel pushed the whole device outside the region.
  const overflow = Math.max(outerWidth / region.width, outerHeight / region.height, 1);
  const scale = 1 / overflow;

  const finalScreenW = screenWidth * scale;
  const finalScreenH = screenHeight * scale;
  const finalBezel = bezel * scale;

  const centreX = region.x + region.width / 2;
  const centreY = region.y + region.height / 2;

  context.save();
  context.translate(centreX, centreY);
  if (options.tilt !== 0) context.rotate((options.tilt * Math.PI) / 180);

  const outerX = -(finalScreenW / 2 + finalBezel);
  const outerY = -(finalScreenH / 2 + finalBezel);
  const outerW = finalScreenW + finalBezel * 2;
  const outerH = finalScreenH + finalBezel * 2;

  // A drop shadow lifts the device off the background; without it the
  // screenshot reads as a flat rectangle pasted on.
  context.shadowColor = "rgba(0,0,0,0.35)";
  context.shadowBlur = finalScreenW * 0.12;
  context.shadowOffsetY = finalScreenW * 0.04;

  if (options.showFrame) {
    context.fillStyle = options.theme.bezel;
    roundedRect(context, outerX, outerY, outerW, outerH, finalBezel * 2.6);
    context.fill();
  }

  // Clear the shadow before the screen, or it darkens the image itself.
  context.shadowColor = "transparent";
  context.shadowBlur = 0;
  context.shadowOffsetY = 0;

  const screenRadius = options.showFrame ? finalBezel * 1.6 : Math.min(finalScreenW, finalScreenH) * 0.02;

  context.save();
  roundedRect(context, -finalScreenW / 2, -finalScreenH / 2, finalScreenW, finalScreenH, screenRadius);
  context.clip();
  context.drawImage(image, -finalScreenW / 2, -finalScreenH / 2, finalScreenW, finalScreenH);
  context.restore();

  // A dynamic-island pill, only where the screenshot is tall enough for a
  // phone frame to be plausible.
  if (options.showFrame && finalScreenH / finalScreenW > 1.6) {
    const pillW = finalScreenW * 0.28;
    const pillH = finalScreenW * 0.075;
    context.fillStyle = options.theme.bezel;
    roundedRect(context, -pillW / 2, -finalScreenH / 2 + pillH * 0.55, pillW, pillH, pillH / 2);
    context.fill();
  }

  context.restore();
}

/** Paints one complete slide onto a canvas sized to the chosen preset. */
export function renderSlide(
  canvas: HTMLCanvasElement,
  slide: Slide,
  options: RenderOptions,
): void {
  const context = canvas.getContext("2d");
  if (!context) return;

  canvas.width = options.width;
  canvas.height = options.height;

  const { width, height, theme } = options;

  /*
   * The background is filled opaquely before anything else. Play rejects
   * screenshots and feature graphics containing an alpha channel, and a canvas
   * starts fully transparent — so skipping this produces a PNG the Play
   * Console silently refuses to accept.
   */
  const radians = (theme.angle * Math.PI) / 180;
  const gradient = context.createLinearGradient(
    width / 2 - (Math.cos(radians) * width) / 2,
    height / 2 - (Math.sin(radians) * height) / 2,
    width / 2 + (Math.cos(radians) * width) / 2,
    height / 2 + (Math.sin(radians) * height) / 2,
  );
  gradient.addColorStop(0, theme.background[0]);
  gradient.addColorStop(1, theme.background[1]);
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  if (theme.glow) {
    const glow = context.createRadialGradient(
      width * 0.5,
      height * 0.55,
      0,
      width * 0.5,
      height * 0.55,
      Math.max(width, height) * 0.55,
    );
    glow.addColorStop(0, theme.glow);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
  }

  const margin = Math.round(Math.min(width, height) * 0.075);
  const headlineSize = Math.round(height * (options.headlineScale / 100));
  const subSize = Math.round(headlineSize * 0.46);
  const lineGap = Math.round(headlineSize * 0.16);

  const headline = slide.headline.trim();
  const subtext = slide.subtext.trim();
  const hasText = options.layout !== "full-bleed" && (headline !== "" || subtext !== "");

  // Measure the caption block before deciding how much room the device gets.
  let textWidth = width - margin * 2;
  if (options.layout === "text-side") textWidth = width * 0.42 - margin;

  context.font = `700 ${headlineSize}px ${options.fontStack}`;
  const headlineLines = headline ? wrapText(context, headline, textWidth) : [];

  context.font = `400 ${subSize}px ${options.fontStack}`;
  const subLines = subtext ? wrapText(context, subtext, textWidth) : [];

  const headlineBlock = headlineLines.length * (headlineSize + lineGap);
  const subBlock = subLines.length * (subSize + lineGap * 0.6);
  const textBlock = hasText ? headlineBlock + (subLines.length > 0 ? subBlock + lineGap : 0) : 0;

  const drawText = (x: number, top: number, align: CanvasTextAlign) => {
    context.textAlign = align;
    context.textBaseline = "top";

    let cursor = top;

    context.fillStyle = theme.headline;
    context.font = `700 ${headlineSize}px ${options.fontStack}`;
    for (const line of headlineLines) {
      context.fillText(line, x, cursor);
      cursor += headlineSize + lineGap;
    }

    if (subLines.length > 0) {
      cursor += lineGap * 0.5;
      context.fillStyle = theme.subtext;
      context.font = `400 ${subSize}px ${options.fontStack}`;
      for (const line of subLines) {
        context.fillText(line, x, cursor);
        cursor += subSize + lineGap * 0.6;
      }
    }
  };

  let deviceRegion = { x: margin, y: margin, width: width - margin * 2, height: height - margin * 2 };

  if (options.layout === "text-top" && hasText) {
    drawText(width / 2, margin, "center");
    const top = margin + textBlock + margin * 0.6;
    deviceRegion = { x: margin, y: top, width: width - margin * 2, height: height - top - margin * 0.5 };
  } else if (options.layout === "text-bottom" && hasText) {
    drawText(width / 2, height - margin - textBlock, "center");
    const bottom = height - margin - textBlock - margin * 0.6;
    deviceRegion = { x: margin, y: margin * 0.5, width: width - margin * 2, height: bottom - margin * 0.5 };
  } else if (options.layout === "text-side" && hasText) {
    drawText(margin, height / 2 - textBlock / 2, "left");
    const left = width * 0.46;
    deviceRegion = { x: left, y: margin * 0.5, width: width - left - margin, height: height - margin };
  }

  if (slide.image) {
    drawDevice(context, slide.image, deviceRegion, options);
  } else {
    // A placeholder so the layout is visible before a screenshot is added.
    context.save();
    context.strokeStyle = theme.subtext;
    context.globalAlpha = 0.4;
    context.lineWidth = Math.max(2, width * 0.004);
    context.setLineDash([width * 0.02, width * 0.015]);
    const w = Math.min(deviceRegion.width, deviceRegion.height * 0.5);
    roundedRect(
      context,
      deviceRegion.x + (deviceRegion.width - w) / 2,
      deviceRegion.y,
      w,
      deviceRegion.height,
      w * 0.08,
    );
    context.stroke();
    context.setLineDash([]);
    context.globalAlpha = 0.7;
    context.fillStyle = theme.subtext;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `400 ${Math.round(height * 0.025)}px ${options.fontStack}`;
    context.fillText(
      `Screenshot ${options.index + 1}`,
      deviceRegion.x + deviceRegion.width / 2,
      deviceRegion.y + deviceRegion.height / 2,
    );
    context.restore();
  }
}

/* ------------------------------------------------------------ validation */

export interface SpecWarning {
  level: "error" | "warning";
  message: string;
}

/**
 * Checks a chosen output size against what the Play Console will accept.
 *
 * Screenshots and feature graphics have different rules, and conflating them is
 * a real trap: the mandated feature graphic size of 1024 × 500 is 2.05:1 and
 * would fail the screenshot aspect ratio limit, so a single set of rules
 * reports the one size Google requires as invalid.
 */
export function checkSpec(
  width: number,
  height: number,
  count: number,
  kind: "screenshot" | "feature" = "screenshot",
): SpecWarning[] {
  const warnings: SpecWarning[] = [];

  if (kind === "feature") {
    if (width !== FEATURE_GRAPHIC.width || height !== FEATURE_GRAPHIC.height) {
      warnings.push({
        level: "error",
        message: `A feature graphic must be exactly ${FEATURE_GRAPHIC.width} × ${FEATURE_GRAPHIC.height}px.`,
      });
    }
    if (count > 1) {
      warnings.push({
        level: "warning",
        message: `A listing has one feature graphic. You have ${count} images — only the first will be needed.`,
      });
    }
    return warnings;
  }

  const shortest = Math.min(width, height);
  const longest = Math.max(width, height);

  if (shortest < PLAY_SPECS.minSide) {
    warnings.push({ level: "error", message: `Each side must be at least ${PLAY_SPECS.minSide}px — this is ${shortest}px.` });
  }
  if (longest > PLAY_SPECS.maxSide) {
    warnings.push({ level: "error", message: `No side may exceed ${PLAY_SPECS.maxSide}px — this is ${longest}px.` });
  }
  if (longest / shortest > PLAY_SPECS.maxAspectRatio) {
    warnings.push({
      level: "error",
      message: `The long side may not be more than twice the short side. This is ${(longest / shortest).toFixed(2)}:1, which Play will reject.`,
    });
  }
  if (count > 0 && count < PLAY_SPECS.minScreenshots) {
    warnings.push({ level: "warning", message: `Play requires at least ${PLAY_SPECS.minScreenshots} phone screenshots to publish. You have ${count}.` });
  }
  if (count > PLAY_SPECS.maxScreenshots) {
    warnings.push({ level: "warning", message: `Play accepts a maximum of ${PLAY_SPECS.maxScreenshots} screenshots per device type. You have ${count}.` });
  }

  return warnings;
}
