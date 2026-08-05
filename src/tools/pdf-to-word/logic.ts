import { closePdf, extractText, openPdf } from "@/lib/pdf";

export interface PdfToWordResult {
  blob: Blob;
  pageCount: number;
  wordCount: number;
  /** True when the PDF holds no extractable text — i.e. it is a scan. */
  isLikelyScanned: boolean;
}

/**
 * Extracts text with pdf.js and rebuilds it as a real .docx.
 *
 * This is a text conversion, not a layout clone: columns, tables and images do
 * not survive, because reconstructing them faithfully needs a native rendering
 * engine. The UI says so up front rather than letting the result surprise
 * anyone. A scanned PDF has no text layer at all, which is detected and
 * reported instead of handing back an empty document.
 */
export async function pdfToWord(
  file: File,
  onProgress?: (ratio: number) => void,
): Promise<PdfToWordResult> {
  const document = await openPdf(file);

  let pages: string[];
  try {
    onProgress?.(0.2);
    pages = await extractText(document);
    onProgress?.(0.7);
  } finally {
    await closePdf(document);
  }

  const combined = pages.join("\n").trim();
  const isLikelyScanned = combined.length < 20;

  const { Document, HeadingLevel, Packer, PageBreak, Paragraph, TextRun } = await import("docx");

  const children = pages.flatMap((pageText, pageIndex) => {
    const blocks = pageText
      .split(/\n{2,}/)
      .map((block) => block.replace(/\s*\n\s*/g, " ").trim())
      .filter(Boolean);

    const paragraphs = blocks.map(
      (text) =>
        new Paragraph({
          children: [new TextRun({ text, size: 22 })],
          spacing: { after: 160 },
        }),
    );

    if (paragraphs.length === 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: "[This page contains no extractable text]", italics: true, size: 20 }),
          ],
        }),
      );
    }

    // A page break between source pages keeps the document navigable.
    if (pageIndex < pages.length - 1) {
      paragraphs.push(new Paragraph({ children: [new PageBreak()] }));
    }

    return paragraphs;
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: file.name.replace(/\.pdf$/i, ""),
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 240 },
          }),
          ...children,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  onProgress?.(1);

  return {
    blob,
    pageCount: pages.length,
    wordCount: combined ? combined.split(/\s+/).filter(Boolean).length : 0,
    isLikelyScanned,
  };
}
