import { decodeImage, imageSize, supportsTransparency, type RasterFormat } from "@/lib/image";

export interface Preset {
  id: string;
  platform: string;
  label: string;
  width: number;
  height: number;
}

/**
 * Sizes for the placements people actually resize for.
 *
 * These are the dimensions each platform documents as its recommended upload
 * size, not the size it displays at — uploading at the recommended size and
 * letting the platform downscale gives a sharper result than uploading at the
 * display size and letting it upscale.
 *
 * They do change. Anything here is a good bet rather than a guarantee, which is
 * why the tool also takes custom dimensions.
 */
export const presets: Preset[] = [
  { id: "ig-square", platform: "Instagram", label: "Square post", width: 1080, height: 1080 },
  { id: "ig-portrait", platform: "Instagram", label: "Portrait post", width: 1080, height: 1350 },
  { id: "ig-story", platform: "Instagram", label: "Story / Reel", width: 1080, height: 1920 },

  { id: "fb-post", platform: "Facebook", label: "Shared link", width: 1200, height: 630 },
  { id: "fb-cover", platform: "Facebook", label: "Page cover", width: 1640, height: 624 },

  { id: "x-post", platform: "X", label: "Post image", width: 1600, height: 900 },
  { id: "x-header", platform: "X", label: "Profile header", width: 1500, height: 500 },

  { id: "li-post", platform: "LinkedIn", label: "Post image", width: 1200, height: 627 },
  { id: "li-banner", platform: "LinkedIn", label: "Profile banner", width: 1584, height: 396 },

  { id: "yt-thumb", platform: "YouTube", label: "Thumbnail", width: 1280, height: 720 },
  { id: "yt-art", platform: "YouTube", label: "Channel art", width: 2560, height: 1440 },

  { id: "tiktok", platform: "TikTok", label: "Video cover", width: 1080, height: 1920 },
  { id: "pin", platform: "Pinterest", label: "Standard pin", width: 1000, height: 1500 },

  { id: "og", platform: "Open Graph", label: "Link preview", width: 1200, height: 630 },
  { id: "avatar", platform: "Any", label: "Profile picture", width: 400, height: 400 },
];

/**
 * Which part of the image to keep when the aspect ratios disagree.
 *
 * This is the whole reason a resizer needs more than two numbers. A centre crop
 * to a story from a landscape photo routinely cuts the top off someone's head,
 * and the fix is one click rather than a different tool.
 */
export type Anchor = "center" | "top" | "bottom" | "left" | "right";

export const anchorLabels: Record<Anchor, string> = {
  center: "Centre",
  top: "Top",
  bottom: "Bottom",
  left: "Left",
  right: "Right",
};

/** Source rectangle to sample, cropping to fill the target without distortion. */
export function coverRect(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  anchor: Anchor,
): { x: number; y: number; width: number; height: number } {
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;

  // Fill the target: take the largest region of the source with the target's
  // aspect ratio. Whichever axis is proportionally longer is the one trimmed.
  let width = sourceWidth;
  let height = sourceHeight;

  if (sourceRatio > targetRatio) {
    width = sourceHeight * targetRatio;
  } else {
    height = sourceWidth / targetRatio;
  }

  const spareX = sourceWidth - width;
  const spareY = sourceHeight - height;

  // A vertical anchor says nothing about horizontal placement and vice versa,
  // so the unconstrained axis stays centred rather than snapping to an edge.
  const x = anchor === "left" ? 0 : anchor === "right" ? spareX : spareX / 2;
  const y = anchor === "top" ? 0 : anchor === "bottom" ? spareY : spareY / 2;

  return { x, y, width, height };
}

export interface ResizedImage {
  preset: Preset;
  blob: Blob;
  url: string;
}

/** Renders one image at one target size, cropping to fill. */
async function render(
  source: ImageBitmap | HTMLImageElement,
  preset: Preset,
  anchor: Anchor,
  format: RasterFormat,
  quality: number,
): Promise<Blob> {
  const { width: sw, height: sh } = imageSize(source);
  const crop = coverRect(sw, sh, preset.width, preset.height, anchor);

  const canvas = document.createElement("canvas");
  canvas.width = preset.width;
  canvas.height = preset.height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser would not provide a drawing canvas.");

  if (!supportsTransparency(format)) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, preset.width, preset.height);
  }

  context.imageSmoothingQuality = "high";
  context.drawImage(
    source,
    crop.x, crop.y, crop.width, crop.height,
    0, 0, preset.width, preset.height,
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, format, quality),
  );
  if (!blob) throw new Error("The resized image could not be encoded.");

  // `toBlob` falls back to PNG rather than failing when a type is unsupported,
  // so the caller would otherwise hand out a .jpg containing PNG bytes.
  if (blob.type !== format) {
    throw new Error(`Your browser cannot save ${format}. Try PNG or JPG.`);
  }

  return blob;
}

/** Renders every selected size from one decode of the source. */
export async function resizeForPlatforms(
  file: File,
  chosen: Preset[],
  anchor: Anchor,
  format: RasterFormat,
  quality = 0.92,
): Promise<ResizedImage[]> {
  const source = await decodeImage(file);
  try {
    const out: ResizedImage[] = [];
    for (const preset of chosen) {
      const blob = await render(source, preset, anchor, format, quality);
      out.push({ preset, blob, url: URL.createObjectURL(blob) });
    }
    return out;
  } finally {
    if ("close" in source) source.close();
  }
}

/** How much of the source survives the crop, as a fraction of its area. */
export function retained(
  sourceWidth: number,
  sourceHeight: number,
  preset: Preset,
): number {
  const crop = coverRect(sourceWidth, sourceHeight, preset.width, preset.height, "center");
  return (crop.width * crop.height) / (sourceWidth * sourceHeight);
}
