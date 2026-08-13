export interface MemeOptions {
  topText: string;
  bottomText: string;
  fontSize: number;
  strokeWidth: number;
  color: string;
  strokeColor: string;
  uppercase: boolean;
  fontFamily: string;
}

export const FONTS = [
  { id: "impact", label: "Impact (classic)", stack: "Impact, 'Haettenschweiler', 'Arial Narrow Bold', sans-serif" },
  { id: "sans", label: "Sans-serif", stack: "'Helvetica Neue', Arial, sans-serif" },
  { id: "serif", label: "Serif", stack: "Georgia, 'Times New Roman', serif" },
  { id: "mono", label: "Monospace", stack: "'Courier New', monospace" },
];

/**
 * Wraps text to fit a width, measured against the actual canvas font.
 *
 * Measuring rather than counting characters is the only approach that works:
 * "WWWWW" and "iiiii" are the same character count and wildly different
 * widths, so a character-based wrap overflows on one and wastes space on the
 * other.
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
      if (context.measureText(candidate).width <= maxWidth) {
        line = candidate;
      } else {
        lines.push(line);
        line = word;
      }
    }

    lines.push(line);
  }

  return lines;
}

/** Draws the meme onto a canvas already sized to the image. */
export function render(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  options: MemeOptions,
): void {
  const context = canvas.getContext("2d");
  if (!context) return;

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  context.drawImage(image, 0, 0);

  // Font size is a percentage of image height, so a caption looks the same on
  // a 400px thumbnail and a 4000px photo.
  const size = (options.fontSize / 100) * canvas.height;
  const stack = FONTS.find((font) => font.id === options.fontFamily)?.stack ?? FONTS[0].stack;

  context.font = `bold ${size}px ${stack}`;
  context.textAlign = "center";
  context.lineJoin = "round";
  context.miterLimit = 2;
  context.fillStyle = options.color;
  context.strokeStyle = options.strokeColor;
  context.lineWidth = (options.strokeWidth / 100) * size;

  const margin = canvas.width * 0.06;
  const maxWidth = canvas.width - margin * 2;

  function drawBlock(text: string, position: "top" | "bottom") {
    if (!text.trim()) return;

    const content = options.uppercase ? text.toUpperCase() : text;
    const lines = wrapText(context!, content, maxWidth);
    const lineHeight = size * 1.1;

    lines.forEach((line, index) => {
      const y =
        position === "top"
          ? margin + size + index * lineHeight
          : canvas.height - margin - (lines.length - 1 - index) * lineHeight;

      // Stroke first, then fill, or the outline eats into the letterforms.
      if (context!.lineWidth > 0) context!.strokeText(line, canvas.width / 2, y);
      context!.fillText(line, canvas.width / 2, y);
    });
  }

  drawBlock(options.topText, "top");
  drawBlock(options.bottomText, "bottom");
}
