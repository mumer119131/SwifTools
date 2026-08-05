import {
  canvasToBlob,
  decodeImage,
  releaseImage,
  supportsTransparency,
  type RasterFormat,
} from "@/lib/image";
import { clamp } from "@/lib/utils";

/** Selection in normalised 0–1 coordinates, so it survives any preview size. */
export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const aspectRatios = [
  { key: "free", label: "Free", value: null },
  { key: "1:1", label: "1:1 square", value: 1 },
  { key: "4:3", label: "4:3", value: 4 / 3 },
  { key: "3:2", label: "3:2", value: 3 / 2 },
  { key: "16:9", label: "16:9", value: 16 / 9 },
  { key: "9:16", label: "9:16 story", value: 9 / 16 },
] as const;

export type AspectRatioKey = (typeof aspectRatios)[number]["key"];

export interface CropResult {
  blob: Blob;
  previewUrl: string;
  width: number;
  height: number;
  byteSize: number;
}

/** Keeps a normalised rect inside the image and above a minimum size. */
export function normaliseRect(rect: CropRect): CropRect {
  const width = clamp(rect.width, 0.02, 1);
  const height = clamp(rect.height, 0.02, 1);
  return {
    width,
    height,
    x: clamp(rect.x, 0, 1 - width),
    y: clamp(rect.y, 0, 1 - height),
  };
}

/**
 * Crops from the decoded source at full resolution — the on-screen selection is
 * only ever a normalised rectangle, so a 4000px photo is cut at 4000px even
 * though the preview was 600px wide.
 */
export async function cropImage(
  file: File,
  rect: CropRect,
  format: RasterFormat,
  quality = 0.92,
): Promise<CropResult> {
  const source = await decodeImage(file);
  const naturalWidth = source instanceof HTMLImageElement ? source.naturalWidth : source.width;
  const naturalHeight = source instanceof HTMLImageElement ? source.naturalHeight : source.height;

  const safe = normaliseRect(rect);
  const sx = Math.round(safe.x * naturalWidth);
  const sy = Math.round(safe.y * naturalHeight);
  const sWidth = Math.max(1, Math.round(safe.width * naturalWidth));
  const sHeight = Math.max(1, Math.round(safe.height * naturalHeight));

  const canvas = document.createElement("canvas");
  canvas.width = sWidth;
  canvas.height = sHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    releaseImage(source);
    throw new Error("Could not get a 2D canvas context.");
  }

  if (!supportsTransparency(format)) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, sWidth, sHeight);
  }

  context.drawImage(source, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
  releaseImage(source);

  const blob = await canvasToBlob(canvas, format, format === "image/png" ? undefined : quality);
  canvas.width = 0;
  canvas.height = 0;

  return {
    blob,
    previewUrl: URL.createObjectURL(blob),
    width: sWidth,
    height: sHeight,
    byteSize: blob.size,
  };
}
