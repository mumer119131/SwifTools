import { decodeImage, imageSize, supportsTransparency, type RasterFormat } from "@/lib/image";

/** Clockwise degrees. Only right angles — anything else needs a background fill. */
export type Rotation = 0 | 90 | 180 | 270;

export interface Transform {
  rotation: Rotation;
  flipX: boolean;
  flipY: boolean;
}

export interface RotateResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

/**
 * Applies a rotation and optional mirroring, drawing once onto a canvas sized
 * for the result.
 *
 * Right angles only, which keeps this lossless in geometry: no interpolation
 * happens because every source pixel lands exactly on a destination pixel. An
 * arbitrary angle would need resampling and a decision about what fills the
 * corners, and is a different tool.
 */
export async function rotateImage(
  file: File,
  transform: Transform,
  format: RasterFormat,
  quality = 0.92,
): Promise<RotateResult> {
  const source = await decodeImage(file);
  const { width, height } = imageSize(source);

  // A quarter turn swaps the axes; a half turn does not.
  const swapped = transform.rotation === 90 || transform.rotation === 270;
  const outWidth = swapped ? height : width;
  const outHeight = swapped ? width : height;

  const canvas = document.createElement("canvas");
  canvas.width = outWidth;
  canvas.height = outHeight;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser would not provide a drawing canvas.");

  // JPEG has no alpha, so transparent source pixels would otherwise come out
  // black rather than white.
  if (!supportsTransparency(format)) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, outWidth, outHeight);
  }

  // Work from the centre so rotation and mirroring compose without having to
  // track where the origin ended up after each step.
  context.translate(outWidth / 2, outHeight / 2);
  context.rotate((transform.rotation * Math.PI) / 180);
  context.scale(transform.flipX ? -1 : 1, transform.flipY ? -1 : 1);
  context.drawImage(source, -width / 2, -height / 2, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, format, quality),
  );
  if (!blob) throw new Error("The rotated image could not be encoded.");

  if ("close" in source) source.close();

  return { blob, url: URL.createObjectURL(blob), width: outWidth, height: outHeight };
}

/** Turns a transform into the label shown on the button that undoes it. */
export function describe(transform: Transform): string {
  const parts: string[] = [];
  if (transform.rotation) parts.push(`${transform.rotation}° clockwise`);
  if (transform.flipX) parts.push("flipped horizontally");
  if (transform.flipY) parts.push("flipped vertically");
  return parts.length > 0 ? parts.join(", ") : "unchanged";
}

/** True when the transform would leave the image exactly as it arrived. */
export function isIdentity(transform: Transform): boolean {
  return transform.rotation === 0 && !transform.flipX && !transform.flipY;
}
