import {
  canvasToBlob,
  decodeImage,
  drawToCanvas,
  formatExtensions,
  imageSize,
  releaseImage,
  supportsTransparency,
  type RasterFormat,
} from "@/lib/image";
import { baseName } from "@/lib/utils";

export interface ConvertedImage {
  name: string;
  blob: Blob;
  previewUrl: string;
  originalSize: number;
  convertedSize: number;
  width: number;
  height: number;
  /** True when transparency was flattened onto white to satisfy the target. */
  flattened: boolean;
}

/**
 * SVG is accepted as an input (it rasterises through the `<img>` path) but is
 * not offered as an output: turning pixels into vectors is tracing, not
 * conversion, and any tool claiming otherwise is lying about the result.
 */
export async function convertImage(
  file: File,
  format: RasterFormat,
  quality = 0.92,
): Promise<ConvertedImage> {
  const source = await decodeImage(file);
  const { width, height } = imageSize(source);

  if (width === 0 || height === 0) {
    releaseImage(source);
    throw new Error(`${file.name} has no intrinsic size and cannot be converted.`);
  }

  const canvas = drawToCanvas(source, width, height, format);
  releaseImage(source);

  const blob = await canvasToBlob(canvas, format, format === "image/png" ? undefined : quality);
  canvas.width = 0;
  canvas.height = 0;

  const hadAlpha = file.type === "image/png" || file.type === "image/webp" || file.type === "image/svg+xml";

  return {
    name: `${baseName(file.name)}.${formatExtensions[format]}`,
    blob,
    previewUrl: URL.createObjectURL(blob),
    originalSize: file.size,
    convertedSize: blob.size,
    width,
    height,
    flattened: hadAlpha && !supportsTransparency(format),
  };
}

export async function zipImages(images: ConvertedImage[]): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  for (const image of images) zip.file(image.name, image.blob);
  return zip.generateAsync({ type: "blob", compression: "STORE" });
}
