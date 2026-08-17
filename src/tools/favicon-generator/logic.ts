/**
 * Favicon generation, including a real ICO encoder.
 *
 * favicon.ico still matters: browsers request /favicon.ico by default whether
 * or not you link one, and a missing file is a 404 on every page load. The
 * format is an old Windows container, so it has to be written by hand — there
 * is no canvas.toBlob("image/x-icon").
 */

export interface IconSize {
  size: number;
  fileName: string;
  /** What this file is actually for. */
  purpose: string;
  /** Included in the multi-resolution .ico rather than written separately. */
  inIco: boolean;
}

export const ICON_SIZES: IconSize[] = [
  { size: 16, fileName: "favicon-16x16.png", purpose: "Browser tab and bookmark bar", inIco: true },
  { size: 32, fileName: "favicon-32x32.png", purpose: "Tab on high-density displays, taskbar", inIco: true },
  { size: 48, fileName: "favicon-48x48.png", purpose: "Windows site shortcuts", inIco: true },
  { size: 180, fileName: "apple-touch-icon.png", purpose: "iOS home screen. iOS ignores the manifest", inIco: false },
  { size: 192, fileName: "android-chrome-192x192.png", purpose: "Android home screen and app switcher", inIco: false },
  { size: 512, fileName: "android-chrome-512x512.png", purpose: "PWA splash screen and install prompt", inIco: false },
];

export type Shape = "square" | "rounded" | "circle";

export interface RenderConfig {
  /** Source artwork, or null when generating from a letter. */
  image: HTMLImageElement | null;
  /** Used when there is no image. */
  letter: string;
  letterColor: string;
  fontStack: string;
  background: string;
  /** Transparent backgrounds are legal for PNG but not for the ICO fallback. */
  transparent: boolean;
  shape: Shape;
  /** Inset as a percentage of the icon, so artwork does not touch the edge. */
  padding: number;
}

/**
 * Draws one icon at one size.
 *
 * Every size is rendered from the source rather than by scaling a single
 * rendering, because downscaling a 512px icon to 16px turns detailed artwork
 * into grey mush. Rendering at the target size lets the browser's own
 * resampling work from the full-resolution original each time.
 */
export function drawIcon(canvas: HTMLCanvasElement, size: number, config: RenderConfig): void {
  const context = canvas.getContext("2d");
  if (!context) return;

  canvas.width = size;
  canvas.height = size;
  context.clearRect(0, 0, size, size);

  const radius =
    config.shape === "circle" ? size / 2 : config.shape === "rounded" ? size * 0.22 : 0;

  context.save();

  if (radius > 0) {
    context.beginPath();
    if (config.shape === "circle") {
      context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    } else {
      const r = Math.min(radius, size / 2);
      context.moveTo(r, 0);
      context.lineTo(size - r, 0);
      context.quadraticCurveTo(size, 0, size, r);
      context.lineTo(size, size - r);
      context.quadraticCurveTo(size, size, size - r, size);
      context.lineTo(r, size);
      context.quadraticCurveTo(0, size, 0, size - r);
      context.lineTo(0, r);
      context.quadraticCurveTo(0, 0, r, 0);
      context.closePath();
    }
    context.clip();
  }

  if (!config.transparent) {
    context.fillStyle = config.background;
    context.fillRect(0, 0, size, size);
  }

  const inset = size * (config.padding / 100);
  const inner = size - inset * 2;

  if (config.image) {
    // Contain rather than cover: a logo cropped at the edges reads as broken,
    // where letterboxing just reads as padding.
    const ratio = config.image.naturalWidth / config.image.naturalHeight;
    let width = inner;
    let height = inner / ratio;
    if (height > inner) {
      height = inner;
      width = inner * ratio;
    }
    context.drawImage(config.image, (size - width) / 2, (size - height) / 2, width, height);
  } else if (config.letter.trim()) {
    const glyph = [...config.letter.trim()][0] ?? "";
    context.fillStyle = config.letterColor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `700 ${inner * 0.78}px ${config.fontStack}`;
    // Optical centring: textBaseline "middle" sits slightly high for most
    // fonts, and at 16px that error is visible.
    context.fillText(glyph, size / 2, size / 2 + inner * 0.04);
  }

  context.restore();
}

/* --------------------------------------------------------------- ICO file */

/**
 * Packs PNG images into a multi-resolution .ico.
 *
 * The format is a 6-byte header, then a 16-byte directory entry per image,
 * then the image data. Modern browsers accept PNG payloads inside an ICO,
 * which avoids having to write BMP with its upside-down rows and AND mask.
 *
 * The one trap: a 256-pixel image is stored as 0 in the single-byte width and
 * height fields, because 256 does not fit in a byte.
 */
export function buildIco(images: { size: number; png: Uint8Array }[]): Uint8Array {
  if (images.length === 0) throw new Error("An ICO needs at least one image.");

  const HEADER = 6;
  const ENTRY = 16;

  const directorySize = HEADER + ENTRY * images.length;
  const total = directorySize + images.reduce((sum, entry) => sum + entry.png.length, 0);

  const buffer = new ArrayBuffer(total);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  // ICONDIR — reserved, type 1 (icon), image count. All little-endian.
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, images.length, true);

  let offset = directorySize;

  images.forEach((entry, index) => {
    const base = HEADER + ENTRY * index;

    view.setUint8(base + 0, entry.size >= 256 ? 0 : entry.size);
    view.setUint8(base + 1, entry.size >= 256 ? 0 : entry.size);
    view.setUint8(base + 2, 0); // palette size, 0 for truecolour
    view.setUint8(base + 3, 0); // reserved
    view.setUint16(base + 4, 1, true); // colour planes
    view.setUint16(base + 6, 32, true); // bits per pixel
    view.setUint32(base + 8, entry.png.length, true);
    view.setUint32(base + 12, offset, true);

    bytes.set(entry.png, offset);
    offset += entry.png.length;
  });

  return bytes;
}

/* --------------------------------------------------------------- snippets */

export function manifestJson(name: string, background: string, theme: string): string {
  return `${JSON.stringify(
    {
      name,
      short_name: name.slice(0, 12),
      icons: [
        { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      theme_color: theme,
      background_color: background,
      display: "standalone",
    },
    null,
    2,
  )}\n`;
}

export function htmlSnippet(themeColor: string): string {
  return [
    '<link rel="icon" href="/favicon.ico" sizes="any">',
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
    '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
    '<link rel="manifest" href="/site.webmanifest">',
    `<meta name="theme-color" content="${themeColor}">`,
  ].join("\n");
}

export const NEXT_SNIPPET = `// Next.js App Router: put the files in app/ and the framework
// generates the tags for you — no <link> elements needed.
//
//   app/favicon.ico
//   app/icon.png            (any size; Next emits the right tags)
//   app/apple-icon.png
//   app/manifest.webmanifest
`;
