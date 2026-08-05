import { PDFDocument } from "pdf-lib";

export interface MergeResult {
  blob: Blob;
  pageCount: number;
  byteSize: number;
}

/**
 * Concatenates PDFs in the given order.
 *
 * `ignoreEncryption` lets us open files that carry an owner password (the
 * common "no printing" flag) — pdf-lib can still read their pages. Files with
 * a *user* password genuinely cannot be opened and throw, which the UI reports.
 */
export async function mergePdfs(files: File[], onProgress?: (ratio: number) => void): Promise<MergeResult> {
  if (files.length < 2) throw new Error("Add at least two PDFs to merge.");

  const merged = await PDFDocument.create();

  for (const [index, file] of files.entries()) {
    const bytes = await file.arrayBuffer();

    let source: PDFDocument;
    try {
      source = await PDFDocument.load(bytes, { ignoreEncryption: true });
    } catch {
      throw new Error(`${file.name} could not be read. It may be password-protected or damaged.`);
    }

    const pages = await merged.copyPages(source, source.getPageIndices());
    for (const page of pages) merged.addPage(page);

    onProgress?.((index + 1) / files.length);
  }

  merged.setProducer("");
  merged.setCreator("");

  const bytes = await merged.save({ useObjectStreams: true });
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });

  return { blob, pageCount: merged.getPageCount(), byteSize: blob.size };
}
