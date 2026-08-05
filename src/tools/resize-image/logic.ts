import {
  canvasToBlob,
  decodeImage,
  drawToCanvas,
  imageSize,
  releaseImage,
  type RasterFormat,
} from "@/lib/image";

export interface ResizeResult {
  blob: Blob;
  previewUrl: string;
  width: number;
  height: number;
  byteSize: number;
}

export async function readDimensions(file: File): Promise<{ width: number; height: number }> {
  const source = await decodeImage(file);
  const size = imageSize(source);
  releaseImage(source);
  return size;
}

/**
 * Downscaling in one step aliases badly — the browser samples too few source
 * pixels. Halving repeatedly until within 2× of the target, then doing the
 * final step, gives results close to a proper Lanczos resample for free.
 */
function stepDown(
  source: ImageBitmap | HTMLImageElement,
  from: { width: number; height: number },
  to: { width: number; height: number },
  format: RasterFormat,
): HTMLCanvasElement {
  let current = drawToCanvas(source, from.width, from.height, format);

  while (current.width / 2 > to.width && current.height / 2 > to.height) {
    const next = drawToCanvas(current, current.width / 2, current.height / 2, format);
    current.width = 0;
    current.height = 0;
    current = next;
  }

  const final = drawToCanvas(current, to.width, to.height, format);
  current.width = 0;
  current.height = 0;
  return final;
}

export async function resizeImage(
  file: File,
  width: number,
  height: number,
  format: RasterFormat,
  quality = 0.92,
): Promise<ResizeResult> {
  if (width < 1 || height < 1) throw new Error("Width and height must both be at least 1 pixel.");

  const source = await decodeImage(file);
  const original = imageSize(source);

  const isDownscale = width < original.width && height < original.height;
  const canvas = isDownscale
    ? stepDown(source, original, { width, height }, format)
    : drawToCanvas(source, width, height, format);

  releaseImage(source);

  const blob = await canvasToBlob(canvas, format, format === "image/png" ? undefined : quality);
  canvas.width = 0;
  canvas.height = 0;

  return {
    blob,
    previewUrl: URL.createObjectURL(blob),
    width,
    height,
    byteSize: blob.size,
  };
}
