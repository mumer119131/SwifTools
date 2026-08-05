import {
  canvasToBlob,
  decodeImage,
  drawToCanvas,
  formatExtensions,
  imageSize,
  releaseImage,
  type RasterFormat,
} from "@/lib/image";
import { baseName } from "@/lib/utils";

export type WatermarkPosition =
  | "top-left"
  | "top-right"
  | "center"
  | "bottom-left"
  | "bottom-right"
  | "tile";

export interface WatermarkOptions {
  text: string;
  position: WatermarkPosition;
  /** Font size as a percentage of the image's shortest edge. */
  sizePercent: number;
  opacity: number;
  color: "white" | "black";
  rotation: number;
  format: RasterFormat;
}

export interface WatermarkedImage {
  name: string;
  blob: Blob;
  previewUrl: string;
  byteSize: number;
}

/**
 * Draws the watermark onto a canvas holding the source image.
 *
 * Sizing is relative to the shortest edge, so the same settings look the same
 * on a 500px thumbnail and a 5000px original. A contrasting shadow is always
 * drawn beneath the text — a white watermark on a white sky is invisible
 * otherwise.
 */
export function drawWatermark(
  canvas: HTMLCanvasElement,
  options: WatermarkOptions,
): void {
  const context = canvas.getContext("2d");
  if (!context || !options.text.trim()) return;

  const shortestEdge = Math.min(canvas.width, canvas.height);
  const fontSize = Math.max(10, (shortestEdge * options.sizePercent) / 100);
  const padding = shortestEdge * 0.04;

  context.save();
  context.globalAlpha = options.opacity;
  context.font = `600 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
  context.fillStyle = options.color === "white" ? "#ffffff" : "#000000";
  context.shadowColor = options.color === "white" ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)";
  context.shadowBlur = fontSize * 0.12;
  context.textBaseline = "middle";

  const metrics = context.measureText(options.text);
  const textWidth = metrics.width;
  const radians = (options.rotation * Math.PI) / 180;

  if (options.position === "tile") {
    // Diagonal repeat across the whole canvas, sized off the text so the
    // spacing scales with the image rather than being fixed in pixels.
    const stepX = textWidth + fontSize * 2;
    const stepY = fontSize * 3.5;
    context.textAlign = "center";

    // Rotate about the centre so the tiling covers the corners too.
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(radians || -Math.PI / 6);
    context.translate(-canvas.width / 2, -canvas.height / 2);

    const overscan = Math.max(canvas.width, canvas.height);
    for (let y = -overscan; y < canvas.height + overscan; y += stepY) {
      for (let x = -overscan; x < canvas.width + overscan; x += stepX) {
        context.fillText(options.text, x, y);
      }
    }

    context.restore();
    return;
  }

  const anchors: Record<Exclude<WatermarkPosition, "tile">, { x: number; y: number; align: CanvasTextAlign }> = {
    "top-left": { x: padding, y: padding + fontSize / 2, align: "left" },
    "top-right": { x: canvas.width - padding, y: padding + fontSize / 2, align: "right" },
    center: { x: canvas.width / 2, y: canvas.height / 2, align: "center" },
    "bottom-left": { x: padding, y: canvas.height - padding - fontSize / 2, align: "left" },
    "bottom-right": {
      x: canvas.width - padding,
      y: canvas.height - padding - fontSize / 2,
      align: "right",
    },
  };

  const anchor = anchors[options.position];
  context.textAlign = anchor.align;
  context.translate(anchor.x, anchor.y);
  context.rotate(radians);
  context.fillText(options.text, 0, 0);
  context.restore();
}

export async function watermarkImage(
  file: File,
  options: WatermarkOptions,
): Promise<WatermarkedImage> {
  const source = await decodeImage(file);
  const { width, height } = imageSize(source);
  const canvas = drawToCanvas(source, width, height, options.format);
  releaseImage(source);

  drawWatermark(canvas, options);

  const blob = await canvasToBlob(
    canvas,
    options.format,
    options.format === "image/png" ? undefined : 0.92,
  );
  canvas.width = 0;
  canvas.height = 0;

  return {
    name: `${baseName(file.name)}-watermarked.${formatExtensions[options.format]}`,
    blob,
    previewUrl: URL.createObjectURL(blob),
    byteSize: blob.size,
  };
}

export async function zipImages(images: WatermarkedImage[]): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  for (const image of images) zip.file(image.name, image.blob);
  return zip.generateAsync({ type: "blob", compression: "STORE" });
}
