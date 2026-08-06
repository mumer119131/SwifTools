/**
 * Canvas primitives shared by the social mockup generators.
 *
 * Everything is painted directly rather than rasterised from HTML: an SVG
 * `foreignObject` needs its fonts inlined as data URIs or the text silently
 * falls back to a default, and Safari renders it inconsistently. Measuring and
 * drawing by hand costs more code but produces the same image everywhere.
 */

export const SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | number[],
): void {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

/** Wraps text to a maximum width, respecting existing newlines. */
export function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];

  for (const paragraph of text.split("\n")) {
    if (!paragraph) {
      lines.push("");
      continue;
    }

    let current = "";
    for (const word of paragraph.split(" ")) {
      const candidate = current ? `${current} ${word}` : word;

      if (context.measureText(candidate).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
  }

  return lines;
}

export function measureWrapped(
  context: CanvasRenderingContext2D,
  lines: string[],
): number {
  return lines.reduce((max, line) => Math.max(max, context.measureText(line).width), 0);
}

/** Deterministic colour from a name, so the same person keeps the same avatar. */
export function avatarColor(seed: string): string {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  const hues = [210, 340, 145, 25, 265, 190, 45, 300];
  return `hsl(${hues[hash % hues.length]} 62% 52%)`;
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts.at(-1)![0]).toUpperCase();
}

/**
 * Draws a circular avatar — the supplied image if there is one, otherwise
 * initials on a colour derived from the name.
 */
export function drawAvatar(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource | null,
  name: string,
  x: number,
  y: number,
  size: number,
): void {
  context.save();
  context.beginPath();
  context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  context.clip();

  if (image) {
    context.drawImage(image, x, y, size, size);
  } else {
    context.fillStyle = avatarColor(name || "?");
    context.fillRect(x, y, size, size);
    context.fillStyle = "#ffffff";
    context.font = `600 ${Math.round(size * 0.4)}px ${SANS}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(initialsOf(name), x + size / 2, y + size / 2 + 1);
    context.textAlign = "left";
    context.textBaseline = "alphabetic";
  }

  context.restore();
}

/** Decodes an uploaded image for use as an avatar or attachment. */
export async function loadImage(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file);
}

export function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("The image could not be encoded."))),
      "image/png",
    );
  });
}

/** Verified checkmark, drawn rather than shipped as an asset. */
export function drawVerifiedBadge(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
): void {
  context.save();
  context.translate(x, y);
  const r = size / 2;

  // Scalloped circle, approximated with a rotated square-ish path.
  context.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2;
    const radius = i % 2 === 0 ? r : r * 0.92;
    const px = r + Math.cos(angle) * radius;
    const py = r + Math.sin(angle) * radius;
    if (i === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }
  context.closePath();
  context.fillStyle = color;
  context.fill();

  context.strokeStyle = "#ffffff";
  context.lineWidth = Math.max(1.5, size * 0.11);
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();
  context.moveTo(r * 0.6, r);
  context.lineTo(r * 0.9, r * 1.3);
  context.lineTo(r * 1.42, r * 0.72);
  context.stroke();
  context.restore();
}

/** Compact engagement counts, the way every social product renders them. */
export function formatCount(value: number): string {
  if (value < 1000) return String(value);
  if (value < 1_000_000) {
    const thousands = value / 1000;
    return `${thousands < 10 ? thousands.toFixed(1).replace(/\.0$/, "") : Math.round(thousands)}K`;
  }
  const millions = value / 1_000_000;
  return `${millions < 10 ? millions.toFixed(1).replace(/\.0$/, "") : Math.round(millions)}M`;
}

/** iOS-style status bar: time on the left, signal/wifi/battery on the right. */
export function drawStatusBar(
  context: CanvasRenderingContext2D,
  width: number,
  time: string,
  color: string,
): void {
  context.fillStyle = color;
  context.font = `600 15px ${SANS}`;
  context.textAlign = "left";
  context.fillText(time, 28, 30);

  // Battery
  const batteryX = width - 52;
  context.strokeStyle = color;
  context.globalAlpha = 0.5;
  context.lineWidth = 1.2;
  roundedRect(context, batteryX, 17, 24, 12, 3.5);
  context.stroke();
  context.globalAlpha = 1;
  context.fillRect(batteryX + 2, 19, 18, 8);
  context.fillRect(batteryX + 25, 21, 2, 4);

  // Wifi and signal, drawn as simple bars.
  for (let i = 0; i < 4; i += 1) {
    const barHeight = 4 + i * 2.5;
    context.fillRect(width - 106 + i * 6, 28 - barHeight, 4, barHeight);
  }
  context.beginPath();
  context.arc(width - 68, 30, 3, Math.PI, 0);
  context.arc(width - 68, 30, 7, Math.PI, 0);
  context.arc(width - 68, 30, 11, Math.PI, 0);
  context.strokeStyle = color;
  context.lineWidth = 2.2;
  context.stroke();
}
