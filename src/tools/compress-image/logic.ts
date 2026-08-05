import {
  canvasToBlob,
  decodeImage,
  drawToCanvas,
  fitWithin,
  imageSize,
  releaseImage,
  type RasterFormat,
} from "@/lib/image";
import { baseName } from "@/lib/utils";

export type CompressMode = "quality" | "target-size";

export interface CompressOptions {
  mode: CompressMode;
  /** 0–1. Used when mode is "quality". */
  quality: number;
  /** Kilobytes. Used when mode is "target-size". */
  targetKb: number;
  /** Longest edge in pixels; 0 leaves the dimensions untouched. */
  maxDimension: number;
  /** WEBP is smaller than JPEG at equal quality but slightly less universal. */
  format: RasterFormat;
}

export interface CompressedImage {
  name: string;
  originalSize: number;
  compressedSize: number;
  blob: Blob;
  previewUrl: string;
  width: number;
  height: number;
  /** True when compression could not beat the original, so it was kept. */
  keptOriginal: boolean;
}

const MAX_SEARCH_STEPS = 7;

export async function compressImage(
  file: File,
  options: CompressOptions,
): Promise<CompressedImage> {
  const source = await decodeImage(file);
  const original = imageSize(source);

  const target =
    options.maxDimension > 0
      ? fitWithin(original.width, original.height, options.maxDimension, options.maxDimension)
      : original;

  const canvas = drawToCanvas(source, target.width, target.height, options.format);
  releaseImage(source);

  let blob: Blob;

  if (options.mode === "target-size") {
    blob = await searchForTargetSize(canvas, options.format, options.targetKb * 1024);
  } else {
    blob = await canvasToBlob(canvas, options.format, options.quality);
  }

  // Re-encoding an already-optimised image often makes it bigger. When that
  // happens and no resize or format change was asked for, keep the original.
  const unchangedShape = target.width === original.width && target.height === original.height;
  const unchangedFormat = file.type === options.format;
  const keptOriginal = blob.size >= file.size && unchangedShape && unchangedFormat;
  if (keptOriginal) blob = file;

  canvas.width = 0;
  canvas.height = 0;

  return {
    name: `${baseName(file.name)}.${options.format.split("/")[1].replace("jpeg", "jpg")}`,
    originalSize: file.size,
    compressedSize: blob.size,
    blob,
    previewUrl: URL.createObjectURL(blob),
    width: target.width,
    height: target.height,
    keptOriginal,
  };
}

/**
 * Binary-searches the quality axis for the highest quality that still fits the
 * byte budget. Seven steps narrows a 0–1 range to under 1% — well past the
 * point where the difference is visible — and each step is one encode.
 */
async function searchForTargetSize(
  canvas: HTMLCanvasElement,
  format: RasterFormat,
  targetBytes: number,
): Promise<Blob> {
  let low = 0.05;
  let high = 0.95;
  let best = await canvasToBlob(canvas, format, high);

  if (best.size <= targetBytes) return best;

  for (let step = 0; step < MAX_SEARCH_STEPS; step += 1) {
    const mid = (low + high) / 2;
    const candidate = await canvasToBlob(canvas, format, mid);

    if (candidate.size <= targetBytes) {
      best = candidate;
      low = mid;
    } else {
      high = mid;
    }
  }

  return best;
}

export async function zipImages(images: CompressedImage[]): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  for (const image of images) zip.file(image.name, image.blob);
  return zip.generateAsync({ type: "blob", compression: "STORE" });
}
