import type { PDFDocumentProxy } from "pdfjs-dist";

/**
 * pdf.js is only ever loaded in the browser, and only by the tools that need
 * it — it is a ~1 MB dependency that must never touch the homepage bundle.
 *
 * The worker URL is resolved through `import.meta.url` so the bundler emits it
 * as an asset rather than requiring a CDN at runtime.
 */
let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;

export function loadPdfJs() {
  pdfjsPromise ??= import("pdfjs-dist").then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.mjs",
      import.meta.url,
    ).toString();
    return pdfjs;
  });
  return pdfjsPromise;
}

export async function openPdf(file: File | ArrayBuffer): Promise<PDFDocumentProxy> {
  const pdfjs = await loadPdfJs();
  const data = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  return pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
}

/**
 * Tears down a document and its worker.
 *
 * `destroy()` lives on the loading task, not the document proxy — skipping it
 * leaves a worker thread alive for every PDF the user opens in a session.
 */
export async function closePdf(document: PDFDocumentProxy): Promise<void> {
  await document.loadingTask.destroy();
}

export interface RenderedPage {
  pageNumber: number;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

/**
 * Renders one page to an offscreen canvas at the requested scale.
 * `scale` 1 is 72 DPI; 2 is roughly print-legible; 4 is high quality.
 */
export async function renderPage(
  document: PDFDocumentProxy,
  pageNumber: number,
  scale: number,
): Promise<RenderedPage> {
  const page = await document.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = globalThis.document.createElement("canvas");
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get a 2D canvas context.");

  // PDFs assume a white page; without this, transparent areas render black.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({ canvas, canvasContext: context, viewport }).promise;
  page.cleanup();

  return { pageNumber, canvas, width: canvas.width, height: canvas.height };
}

/** Extracts the text of every page, preserving line breaks where pdf.js reports them. */
export async function extractText(document: PDFDocumentProxy): Promise<string[]> {
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();

    let text = "";
    for (const item of content.items) {
      if (!("str" in item)) continue;
      text += item.str;
      if (item.hasEOL) text += "\n";
    }

    pages.push(text.trim());
    page.cleanup();
  }

  return pages;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas could not be encoded."))),
      type,
      quality,
    );
  });
}

/**
 * Parses page-range syntax like "1-3, 5, 8-10" into a sorted, de-duplicated,
 * 1-based page list. Out-of-range and malformed entries are dropped.
 */
export function parsePageRanges(input: string, pageCount: number): number[] {
  const pages = new Set<number>();

  for (const part of input.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const range = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const start = Math.max(1, Number(range[1]));
      const end = Math.min(pageCount, Number(range[2]));
      for (let page = start; page <= end; page += 1) pages.add(page);
      continue;
    }

    const single = Number(trimmed);
    if (Number.isInteger(single) && single >= 1 && single <= pageCount) pages.add(single);
  }

  return [...pages].sort((a, b) => a - b);
}
