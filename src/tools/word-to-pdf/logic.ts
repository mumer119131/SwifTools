import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

export interface WordToPdfResult {
  blob: Blob;
  pageCount: number;
  byteSize: number;
  /** Warnings mammoth raised about unsupported content, surfaced to the user. */
  warnings: string[];
}

type BlockKind = "h1" | "h2" | "h3" | "p" | "li";

interface Run {
  text: string;
  bold: boolean;
  italic: boolean;
}

interface Block {
  kind: BlockKind;
  runs: Run[];
}

interface Word {
  text: string;
  bold: boolean;
  italic: boolean;
  width: number;
}

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 56;

const blockStyles: Record<BlockKind, { size: number; leading: number; spaceAfter: number; bold: boolean }> = {
  h1: { size: 22, leading: 27, spaceAfter: 14, bold: true },
  h2: { size: 17, leading: 21, spaceAfter: 11, bold: true },
  h3: { size: 14, leading: 18, spaceAfter: 9, bold: true },
  p: { size: 11, leading: 16, spaceAfter: 9, bold: false },
  li: { size: 11, leading: 16, spaceAfter: 4, bold: false },
};

/** Walks the DOM mammoth produced, flattening it into styled runs per block. */
function parseHtml(html: string): Block[] {
  const document = new DOMParser().parseFromString(html, "text/html");
  const blocks: Block[] = [];

  function collectRuns(node: Node, bold: boolean, italic: boolean, into: Run[]): void {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (text.trim()) into.push({ text, bold, italic });
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const element = node as Element;
    const tag = element.tagName.toLowerCase();
    const nextBold = bold || tag === "strong" || tag === "b";
    const nextItalic = italic || tag === "em" || tag === "i";

    for (const child of Array.from(element.childNodes)) {
      collectRuns(child, nextBold, nextItalic, into);
    }
  }

  function visit(element: Element): void {
    const tag = element.tagName.toLowerCase();

    if (tag === "ul" || tag === "ol" || tag === "table" || tag === "tbody" || tag === "tr") {
      for (const child of Array.from(element.children)) visit(child);
      return;
    }

    const kind: BlockKind | null =
      tag === "h1"
        ? "h1"
        : tag === "h2"
          ? "h2"
          : tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6"
            ? "h3"
            : tag === "li"
              ? "li"
              : tag === "p" || tag === "td" || tag === "th"
                ? "p"
                : null;

    if (kind) {
      const runs: Run[] = [];
      collectRuns(element, false, false, runs);
      if (runs.length > 0) blocks.push({ kind, runs });
      return;
    }

    for (const child of Array.from(element.children)) visit(child);
  }

  for (const child of Array.from(document.body.children)) visit(child);
  return blocks;
}

/**
 * Typesets blocks onto A4 pages with greedy word wrapping.
 *
 * Each word is measured with the exact font it will be drawn in, so bold and
 * italic runs wrap correctly rather than overflowing the measured width.
 */
export async function wordToPdf(
  file: File,
  onProgress?: (ratio: number) => void,
): Promise<WordToPdfResult> {
  const { default: mammoth } = await import("mammoth");

  let html: string;
  let warnings: string[] = [];
  try {
    const conversion = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
    html = conversion.value;
    warnings = [...new Set(conversion.messages.map((message) => message.message))].slice(0, 3);
  } catch {
    throw new Error(
      "That file could not be read. Only .docx is supported — older .doc files need to be re-saved as .docx first.",
    );
  }

  onProgress?.(0.4);

  const blocks = parseHtml(html);
  if (blocks.length === 0) throw new Error("That document appears to be empty.");

  const pdf = await PDFDocument.create();
  const fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    italic: await pdf.embedFont(StandardFonts.HelveticaOblique),
    boldItalic: await pdf.embedFont(StandardFonts.HelveticaBoldOblique),
  };

  const pickFont = (bold: boolean, italic: boolean): PDFFont =>
    bold && italic ? fonts.boldItalic : bold ? fonts.bold : italic ? fonts.italic : fonts.regular;

  let page: PDFPage = pdf.addPage([A4.width, A4.height]);
  let cursorY = A4.height - MARGIN;

  const newPage = () => {
    page = pdf.addPage([A4.width, A4.height]);
    cursorY = A4.height - MARGIN;
  };

  for (const [index, block] of blocks.entries()) {
    const style = blockStyles[block.kind];
    const indent = block.kind === "li" ? 18 : 0;
    const maxWidth = A4.width - MARGIN * 2 - indent;
    const spaceWidth = fonts.regular.widthOfTextAtSize(" ", style.size);

    // Split runs into individually-measured words.
    const words: Word[] = [];
    for (const run of block.runs) {
      const bold = run.bold || style.bold;
      for (const text of run.text.split(/\s+/)) {
        if (!text) continue;
        // pdf-lib's standard fonts are WinAnsi-only; unsupported glyphs throw.
        const safe = text.replace(/[^\x20-\xFF]/g, "?");
        words.push({
          text: safe,
          bold,
          italic: run.italic,
          width: pickFont(bold, run.italic).widthOfTextAtSize(safe, style.size),
        });
      }
    }
    if (words.length === 0) continue;

    // Greedy line breaking.
    const lines: Word[][] = [[]];
    let lineWidth = 0;
    for (const word of words) {
      const addedWidth = lines.at(-1)!.length === 0 ? word.width : spaceWidth + word.width;
      if (lineWidth + addedWidth > maxWidth && lines.at(-1)!.length > 0) {
        lines.push([word]);
        lineWidth = word.width;
      } else {
        lines.at(-1)!.push(word);
        lineWidth += addedWidth;
      }
    }

    for (const [lineIndex, line] of lines.entries()) {
      if (cursorY - style.leading < MARGIN) newPage();

      let cursorX = MARGIN + indent;

      if (block.kind === "li" && lineIndex === 0) {
        page.drawText("•", {
          x: MARGIN + 6,
          y: cursorY - style.size,
          size: style.size,
          font: fonts.regular,
          color: rgb(0, 0, 0),
        });
      }

      for (const [wordIndex, word] of line.entries()) {
        if (wordIndex > 0) cursorX += spaceWidth;
        page.drawText(word.text, {
          x: cursorX,
          y: cursorY - style.size,
          size: style.size,
          font: pickFont(word.bold, word.italic),
          color: rgb(0, 0, 0),
        });
        cursorX += word.width;
      }

      cursorY -= style.leading;
    }

    cursorY -= style.spaceAfter;
    if (index % 20 === 0) onProgress?.(0.4 + (index / blocks.length) * 0.55);
  }

  pdf.setProducer("");
  pdf.setCreator("");

  const bytes = await pdf.save({ useObjectStreams: true });
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  onProgress?.(1);

  return { blob, pageCount: pdf.getPageCount(), byteSize: blob.size, warnings };
}
