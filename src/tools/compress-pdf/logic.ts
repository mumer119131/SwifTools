import { PDFDocument } from "pdf-lib";

import { canvasToBlob, closePdf, openPdf, renderPage } from "@/lib/pdf";

export type CompressionLevel = "lossless" | "strong" | "maximum";

export interface CompressionPreset {
  level: CompressionLevel;
  label: string;
  description: string;
  /** Undefined = structural only. Otherwise the render scale (1 ≈ 72 DPI). */
  scale?: number;
  jpegQuality?: number;
}

export const presets: readonly CompressionPreset[] = [
  {
    level: "lossless",
    label: "Lossless",
    description: "Rewrites the file structure and strips metadata. Text stays selectable.",
  },
  {
    level: "strong",
    label: "Strong",
    description: "Re-renders pages at ~150 DPI as JPEG. Much smaller; text becomes an image.",
    scale: 2.08,
    jpegQuality: 0.72,
  },
  {
    level: "maximum",
    label: "Maximum",
    description: "Re-renders at ~96 DPI. Smallest result, best for on-screen reading only.",
    scale: 1.33,
    jpegQuality: 0.6,
  },
];

export interface CompressResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  pageCount: number;
  /** True when the output grew — the UI then offers the original instead. */
  grew: boolean;
}

/**
 * Two genuinely different strategies, because "compress a PDF" means two things:
 *
 * - Lossless rebuilds the document with object streams and drops metadata. Safe
 *   and reversible, but only helps files carrying structural bloat.
 * - Strong/Maximum rasterise each page through pdf.js at a lower resolution and
 *   re-embed it as JPEG. This is what actually shrinks scan-heavy PDFs, at the
 *   cost of selectable text — which the UI states plainly before you commit.
 */
export async function compressPdf(
  file: File,
  level: CompressionLevel,
  onProgress?: (ratio: number) => void,
): Promise<CompressResult> {
  const preset = presets.find((entry) => entry.level === level) ?? presets[0];
  const originalSize = file.size;
  const bytes = await file.arrayBuffer();

  if (preset.scale === undefined) {
    const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
    stripMetadata(source);
    onProgress?.(0.5);

    const output = await source.save({ useObjectStreams: true });
    onProgress?.(1);

    const blob = new Blob([output as BlobPart], { type: "application/pdf" });
    return {
      blob,
      originalSize,
      compressedSize: blob.size,
      pageCount: source.getPageCount(),
      grew: blob.size >= originalSize,
    };
  }

  const source = await openPdf(bytes.slice(0));
  const output = await PDFDocument.create();

  for (let pageNumber = 1; pageNumber <= source.numPages; pageNumber += 1) {
    const { canvas } = await renderPage(source, pageNumber, preset.scale);
    const jpeg = await canvasToBlob(canvas, "image/jpeg", preset.jpegQuality);
    const embedded = await output.embedJpg(await jpeg.arrayBuffer());

    // Keep the original page geometry: the raster is scaled back down to the
    // page's own point size, so page dimensions and print size are unchanged.
    const page = output.addPage([canvas.width / preset.scale, canvas.height / preset.scale]);
    page.drawImage(embedded, {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
    });

    // Free the backing store immediately; large PDFs otherwise pile up canvases.
    canvas.width = 0;
    canvas.height = 0;

    onProgress?.(pageNumber / source.numPages);
  }

  stripMetadata(output);
  const saved = await output.save({ useObjectStreams: true });
  await closePdf(source);

  const blob = new Blob([saved as BlobPart], { type: "application/pdf" });
  return {
    blob,
    originalSize,
    compressedSize: blob.size,
    pageCount: output.getPageCount(),
    grew: blob.size >= originalSize,
  };
}

function stripMetadata(document: PDFDocument): void {
  document.setTitle("");
  document.setAuthor("");
  document.setSubject("");
  document.setKeywords([]);
  document.setProducer("");
  document.setCreator("");
}
