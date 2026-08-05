export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface RemoveBackgroundOptions {
  /** The colour to treat as background. Detected from the edges when omitted. */
  reference: Rgb;
  /** 0–100. How far a pixel may differ from the reference and still be cut. */
  tolerance: number;
  /** 0–100. Width of the soft alpha ramp at the cut edge. */
  feather: number;
}

/**
 * Perceptual-ish colour distance.
 *
 * Plain Euclidean RGB distance treats a green shift as being as significant as
 * a blue one, which it isn't to the human eye. These weights approximate
 * luminance sensitivity and make one tolerance value behave consistently across
 * white, grey and coloured backgrounds.
 */
export function colorDistance(a: Rgb, b: Rgb): number {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return Math.sqrt(2 * dr * dr + 4 * dg * dg + 3 * db * db) / 3;
}

/**
 * Picks the background colour by taking the median of the border pixels.
 *
 * A median rather than a mean, because a subject touching one edge would drag
 * an average badly off but barely moves a median.
 */
export function detectBackgroundColor(data: Uint8ClampedArray, width: number, height: number): Rgb {
  const reds: number[] = [];
  const greens: number[] = [];
  const blues: number[] = [];

  const sample = (x: number, y: number) => {
    const index = (y * width + x) * 4;
    reds.push(data[index]);
    greens.push(data[index + 1]);
    blues.push(data[index + 2]);
  };

  const stepX = Math.max(1, Math.floor(width / 100));
  const stepY = Math.max(1, Math.floor(height / 100));

  for (let x = 0; x < width; x += stepX) {
    sample(x, 0);
    sample(x, height - 1);
  }
  for (let y = 0; y < height; y += stepY) {
    sample(0, y);
    sample(width - 1, y);
  }

  const median = (values: number[]) => {
    values.sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)] ?? 0;
  };

  return { r: median(reds), g: median(greens), b: median(blues) };
}

/**
 * Flood-fills the background inward from the image edges and writes a soft
 * alpha channel.
 *
 * Seeding from the border rather than thresholding the whole image is what
 * keeps interior regions that happen to match the background — the white of an
 * eye, a gap in a logo — from being punched out too.
 *
 * Mutates `data` in place and returns the number of pixels removed.
 */
export function removeBackground(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  options: RemoveBackgroundOptions,
): number {
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  // Tolerance and feather are expressed on the same 0–100 scale the UI uses.
  const hardLimit = (options.tolerance / 100) * 120;
  const featherWidth = Math.max(1, (options.feather / 100) * 60);
  const outerLimit = hardLimit + featherWidth;

  const distanceAt = (pixel: number): number => {
    const index = pixel * 4;
    return colorDistance(
      { r: data[index], g: data[index + 1], b: data[index + 2] },
      options.reference,
    );
  };

  const enqueue = (pixel: number) => {
    if (visited[pixel]) return;
    if (distanceAt(pixel) > outerLimit) return;
    visited[pixel] = 1;
    queue[tail++] = pixel;
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }

  let removed = 0;

  while (head < tail) {
    const pixel = queue[head++];
    const distance = distanceAt(pixel);

    // Inside the hard limit the pixel is background; beyond it, alpha ramps
    // back up so the cut edge is anti-aliased rather than jagged.
    const alpha =
      distance <= hardLimit
        ? 0
        : Math.round(255 * Math.min(1, (distance - hardLimit) / featherWidth));

    const index = pixel * 4;
    if (alpha < data[index + 3]) {
      data[index + 3] = alpha;
      if (alpha === 0) removed += 1;
    }

    // Only fully-removed pixels continue the fill; edge pixels stop it, which
    // is what stops the fill bleeding through soft boundaries into the subject.
    if (alpha > 0) continue;

    const x = pixel % width;
    const y = (pixel - x) / width;

    if (x > 0) enqueue(pixel - 1);
    if (x < width - 1) enqueue(pixel + 1);
    if (y > 0) enqueue(pixel - width);
    if (y < height - 1) enqueue(pixel + width);
  }

  return removed;
}
