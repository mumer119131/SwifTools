import { PDFDocument } from "pdf-lib";

import { parsePageRanges } from "@/lib/pdf";

export type SplitMode = "range" | "every-page";

export interface SplitOutput {
  fileName: string;
  blob: Blob;
  pageCount: number;
}

export async function readPageCount(file: File): Promise<number> {
  const document = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  return document.getPageCount();
}

async function buildPdf(source: PDFDocument, pageIndices: number[]): Promise<Blob> {
  const output = await PDFDocument.create();
  const pages = await output.copyPages(source, pageIndices);
  for (const page of pages) output.addPage(page);
  output.setProducer("");
  output.setCreator("");
  const bytes = await output.save({ useObjectStreams: true });
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

export async function splitPdf(
  file: File,
  mode: SplitMode,
  ranges: string,
  baseFileName: string,
): Promise<SplitOutput[]> {
  const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const pageCount = source.getPageCount();

  if (mode === "every-page") {
    const outputs: SplitOutput[] = [];
    for (let page = 0; page < pageCount; page += 1) {
      outputs.push({
        fileName: `${baseFileName}-page-${page + 1}.pdf`,
        blob: await buildPdf(source, [page]),
        pageCount: 1,
      });
    }
    return outputs;
  }

  const pages = parsePageRanges(ranges, pageCount);
  if (pages.length === 0) {
    throw new Error(`Enter at least one page between 1 and ${pageCount}, e.g. "1-3, 5".`);
  }

  return [
    {
      fileName: `${baseFileName}-pages-${pages[0]}-${pages[pages.length - 1]}.pdf`,
      // parsePageRanges is 1-based; pdf-lib indices are 0-based.
      blob: await buildPdf(source, pages.map((page) => page - 1)),
      pageCount: pages.length,
    },
  ];
}

/**
 * Bundles multiple outputs so the user gets one download instead of many.
 * JSZip is imported lazily — it is only needed on the "every page" path.
 */
export async function zipOutputs(outputs: SplitOutput[]): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  for (const output of outputs) zip.file(output.fileName, output.blob);
  // PDFs are already compressed; STORE avoids a slow second pass for nothing.
  return zip.generateAsync({ type: "blob", compression: "STORE" });
}
