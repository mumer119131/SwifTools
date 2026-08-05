import { canvasToBlob, closePdf, openPdf, renderPage } from "@/lib/pdf";

export type PageFormat = "image/jpeg" | "image/png";

export interface PageImage {
  pageNumber: number;
  fileName: string;
  blob: Blob;
  /** Object URL for the on-page preview. Revoked by the caller on reset. */
  previewUrl: string;
  width: number;
  height: number;
}

/** PDF user space is 72 DPI, so the render scale is simply dpi / 72. */
export function scaleForDpi(dpi: number): number {
  return dpi / 72;
}

export async function pdfToImages(
  file: File,
  format: PageFormat,
  dpi: number,
  baseFileName: string,
  onProgress?: (ratio: number) => void,
): Promise<PageImage[]> {
  const document = await openPdf(file);
  const scale = scaleForDpi(dpi);
  const extension = format === "image/png" ? "png" : "jpg";
  const images: PageImage[] = [];

  try {
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const { canvas, width, height } = await renderPage(document, pageNumber, scale);
      const blob = await canvasToBlob(canvas, format, format === "image/jpeg" ? 0.92 : undefined);

      images.push({
        pageNumber,
        fileName: `${baseFileName}-page-${pageNumber}.${extension}`,
        blob,
        previewUrl: URL.createObjectURL(blob),
        width,
        height,
      });

      canvas.width = 0;
      canvas.height = 0;
      onProgress?.(pageNumber / document.numPages);
    }
  } finally {
    await closePdf(document);
  }

  return images;
}

export async function zipImages(images: PageImage[]): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  for (const image of images) zip.file(image.fileName, image.blob);
  // JPG/PNG are already compressed — deflating them again just costs time.
  return zip.generateAsync({ type: "blob", compression: "STORE" });
}
