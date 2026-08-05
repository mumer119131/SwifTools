import { PDFDocument, type PDFImage } from "pdf-lib";

import { canvasToBlob, decodeImage, drawToCanvas, imageSize, releaseImage } from "@/lib/image";

/** Page sizes in PDF points (1 pt = 1/72 inch). */
export const pageSizes = {
  a4: { label: "A4", width: 595.28, height: 841.89 },
  letter: { label: "US Letter", width: 612, height: 792 },
  fit: { label: "Fit to image", width: 0, height: 0 },
} as const;

export type PageSizeKey = keyof typeof pageSizes;
export type Orientation = "portrait" | "landscape";
export type FitMode = "contain" | "cover";

export interface ImagesToPdfOptions {
  pageSize: PageSizeKey;
  orientation: Orientation;
  fit: FitMode;
  marginPt: number;
}

export interface ImagesToPdfResult {
  blob: Blob;
  pageCount: number;
  byteSize: number;
}

/**
 * pdf-lib can only embed JPEG and PNG. Anything else (WEBP, AVIF, SVG) is
 * re-encoded to JPEG through a canvas first — which also normalises CMYK JPEGs
 * that pdf-lib would otherwise reject.
 */
async function embedImage(
  pdf: PDFDocument,
  file: File,
): Promise<{ image: PDFImage; width: number; height: number }> {
  if (file.type === "image/png") {
    const image = await pdf.embedPng(await file.arrayBuffer());
    return { image, width: image.width, height: image.height };
  }

  if (file.type === "image/jpeg") {
    try {
      const image = await pdf.embedJpg(await file.arrayBuffer());
      return { image, width: image.width, height: image.height };
    } catch {
      // Falls through to the canvas path — usually a CMYK or progressive JPEG.
    }
  }

  const source = await decodeImage(file);
  const { width, height } = imageSize(source);
  const canvas = drawToCanvas(source, width, height, "image/jpeg");
  releaseImage(source);

  const jpeg = await canvasToBlob(canvas, "image/jpeg", 0.92);
  const image = await pdf.embedJpg(await jpeg.arrayBuffer());
  return { image, width: image.width, height: image.height };
}

export async function imagesToPdf(
  files: File[],
  options: ImagesToPdfOptions,
  onProgress?: (ratio: number) => void,
): Promise<ImagesToPdfResult> {
  if (files.length === 0) throw new Error("Add at least one image.");

  const pdf = await PDFDocument.create();

  for (const [index, file] of files.entries()) {
    const { image, width, height } = await embedImage(pdf, file);

    if (options.pageSize === "fit") {
      // The page becomes the image: no margins, no letterboxing.
      const page = pdf.addPage([width, height]);
      page.drawImage(image, { x: 0, y: 0, width, height });
    } else {
      const size = pageSizes[options.pageSize];
      const [pageWidth, pageHeight] =
        options.orientation === "landscape"
          ? [size.height, size.width]
          : [size.width, size.height];

      const page = pdf.addPage([pageWidth, pageHeight]);
      const boxWidth = Math.max(1, pageWidth - options.marginPt * 2);
      const boxHeight = Math.max(1, pageHeight - options.marginPt * 2);

      // contain fits the whole image inside the box; cover fills the box and
      // lets the overflow run off the page edge.
      const ratio =
        options.fit === "contain"
          ? Math.min(boxWidth / width, boxHeight / height)
          : Math.max(boxWidth / width, boxHeight / height);

      const drawWidth = width * ratio;
      const drawHeight = height * ratio;

      page.drawImage(image, {
        x: (pageWidth - drawWidth) / 2,
        y: (pageHeight - drawHeight) / 2,
        width: drawWidth,
        height: drawHeight,
      });
    }

    onProgress?.((index + 1) / files.length);
  }

  pdf.setProducer("");
  pdf.setCreator("");

  const bytes = await pdf.save({ useObjectStreams: true });
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });

  return { blob, pageCount: pdf.getPageCount(), byteSize: blob.size };
}
