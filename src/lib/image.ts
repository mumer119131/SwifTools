export type RasterFormat = "image/jpeg" | "image/png" | "image/webp";

export const formatExtensions: Record<RasterFormat, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const formatLabels: Record<RasterFormat, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WEBP",
};

/** Formats that carry an alpha channel. Flattening onto white is required for the rest. */
export function supportsTransparency(format: RasterFormat): boolean {
  return format !== "image/jpeg";
}

/**
 * Decodes a file to an `ImageBitmap`, falling back to `HTMLImageElement` for
 * SVG, which `createImageBitmap` refuses in Safari.
 */
export async function decodeImage(file: File | Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (file.type !== "image/svg+xml") {
    try {
      return await createImageBitmap(file);
    } catch {
      // Fall through to the <img> path below.
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "sync";
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("That image could not be decoded."));
      image.src = url;
    });
    return image;
  } finally {
    // The bitmap is already decoded into the element by this point.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

export function imageSize(source: ImageBitmap | HTMLImageElement): {
  width: number;
  height: number;
} {
  return source instanceof HTMLImageElement
    ? { width: source.naturalWidth || source.width, height: source.naturalHeight || source.height }
    : { width: source.width, height: source.height };
}

/**
 * Draws a decoded image onto a canvas at the given size.
 *
 * Opaque formats get an explicit white fill first — otherwise transparent PNG
 * regions come out black once alpha is discarded.
 */
export function drawToCanvas(
  source: ImageBitmap | HTMLImageElement | HTMLCanvasElement,
  width: number,
  height: number,
  format: RasterFormat,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get a 2D canvas context.");

  if (!supportsTransparency(format)) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(source, 0, 0, canvas.width, canvas.height);

  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: RasterFormat,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("The image could not be encoded."))),
      format,
      quality,
    );
  });
}

/** Scales `width`/`height` to fit inside a box while keeping the aspect ratio. */
export function fitWithin(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  return { width: Math.round(width * ratio), height: Math.round(height * ratio) };
}

/** Releases a decoded bitmap. No-op for the `<img>` fallback path. */
export function releaseImage(source: ImageBitmap | HTMLImageElement): void {
  if (!(source instanceof HTMLImageElement)) source.close();
}
