/** A glyph is a flat array of 0/1, row-major, width × height long. */
export type Glyph = number[];

export type FontData = Record<string, Glyph>;

export const CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?:;'\"-+/()[]#@&*%<>= ";

export function blankGlyph(width: number, height: number): Glyph {
  return new Array(width * height).fill(0);
}

/**
 * A legible 5×7 starting set, so the tool opens with something to edit rather
 * than eighty blank grids. Only the shapes people most often want to tweak are
 * seeded; everything else starts empty.
 */
const SEED_5x7: Record<string, string[]> = {
  A: [".███.", "█...█", "█...█", "█████", "█...█", "█...█", "█...█"],
  B: ["████.", "█...█", "████.", "█...█", "█...█", "█...█", "████."],
  C: [".████", "█....", "█....", "█....", "█....", "█....", ".████"],
  D: ["████.", "█...█", "█...█", "█...█", "█...█", "█...█", "████."],
  E: ["█████", "█....", "█....", "████.", "█....", "█....", "█████"],
  F: ["█████", "█....", "█....", "████.", "█....", "█....", "█...."],
  G: [".████", "█....", "█....", "█.███", "█...█", "█...█", ".████"],
  H: ["█...█", "█...█", "█...█", "█████", "█...█", "█...█", "█...█"],
  I: ["█████", "..█..", "..█..", "..█..", "..█..", "..█..", "█████"],
  L: ["█....", "█....", "█....", "█....", "█....", "█....", "█████"],
  O: [".███.", "█...█", "█...█", "█...█", "█...█", "█...█", ".███."],
  S: [".████", "█....", "█....", ".███.", "....█", "....█", "████."],
  T: ["█████", "..█..", "..█..", "..█..", "..█..", "..█..", "..█.."],
  "0": [".███.", "█...█", "█..██", "█.█.█", "██..█", "█...█", ".███."],
  "1": ["..█..", ".██..", "..█..", "..█..", "..█..", "..█..", ".███."],
  "2": [".███.", "█...█", "....█", "...█.", "..█..", ".█...", "█████"],
  "3": ["████.", "....█", "....█", ".███.", "....█", "....█", "████."],
};

export function seedFont(width: number, height: number): FontData {
  const font: FontData = {};

  for (const character of CHARSET) {
    const seed = width === 5 && height === 7 ? SEED_5x7[character] : undefined;

    if (!seed) {
      font[character] = blankGlyph(width, height);
      continue;
    }

    font[character] = seed
      .join("")
      .split("")
      .map((cell) => (cell === "█" ? 1 : 0));
  }

  return font;
}

/** Rescales a glyph when the grid size changes, keeping what fits. */
export function resizeGlyph(
  glyph: Glyph,
  fromWidth: number,
  fromHeight: number,
  toWidth: number,
  toHeight: number,
): Glyph {
  const next = blankGlyph(toWidth, toHeight);

  for (let row = 0; row < Math.min(fromHeight, toHeight); row += 1) {
    for (let col = 0; col < Math.min(fromWidth, toWidth); col += 1) {
      next[row * toWidth + col] = glyph[row * fromWidth + col] ?? 0;
    }
  }

  return next;
}

/** Draws the whole set onto a canvas as a sprite sheet, 16 glyphs per row. */
export function drawSheet(
  canvas: HTMLCanvasElement,
  font: FontData,
  width: number,
  height: number,
  scale: number,
): void {
  const characters = [...CHARSET];
  const columns = 16;
  const rows = Math.ceil(characters.length / columns);

  canvas.width = columns * width * scale;
  canvas.height = rows * height * scale;

  const context = canvas.getContext("2d");
  if (!context) return;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#000000";

  characters.forEach((character, index) => {
    const glyph = font[character];
    if (!glyph) return;

    const originX = (index % columns) * width * scale;
    const originY = Math.floor(index / columns) * height * scale;

    for (let row = 0; row < height; row += 1) {
      for (let col = 0; col < width; col += 1) {
        if (glyph[row * width + col] !== 1) continue;
        context.fillRect(originX + col * scale, originY + row * scale, scale, scale);
      }
    }
  });
}
