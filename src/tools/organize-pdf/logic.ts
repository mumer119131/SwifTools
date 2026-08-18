import { PDFDocument, degrees } from "pdf-lib";

/**
 * Rearranging PDF pages: reorder, rotate, delete.
 *
 * All three are page-level operations, which means they are lossless — pages
 * are copied between documents whole, and nothing inside them is decoded or
 * re-encoded. A rotated page is the same page with a different `/Rotate` entry,
 * not a redrawn one, so text stays selectable and images keep their original
 * quality. That is the difference between this and anything that renders pages
 * to images first.
 */

export interface PageState {
  /** Index in the original document, zero-based. Stable across reordering. */
  source: number;
  /** Clockwise degrees, always one of 0, 90, 180, 270. */
  rotation: number;
  deleted: boolean;
}

export function initialPages(count: number): PageState[] {
  return Array.from({ length: count }, (_, index) => ({
    source: index,
    rotation: 0,
    deleted: false,
  }));
}

/** Normalises to 0–270, so repeated turns never accumulate past a full circle. */
export function rotatePage(pages: PageState[], at: number, by: number): PageState[] {
  return pages.map((page, index) =>
    index === at ? { ...page, rotation: (((page.rotation + by) % 360) + 360) % 360 } : page,
  );
}

export function toggleDelete(pages: PageState[], at: number): PageState[] {
  return pages.map((page, index) =>
    index === at ? { ...page, deleted: !page.deleted } : page,
  );
}

/** Moves a page, clamping rather than wrapping — dragging past the end should stop. */
export function movePage(pages: PageState[], from: number, to: number): PageState[] {
  if (from === to || from < 0 || from >= pages.length) return pages;

  const target = Math.min(Math.max(to, 0), pages.length - 1);
  const next = [...pages];
  const [moved] = next.splice(from, 1);
  next.splice(target, 0, moved);
  return next;
}

export function rotateAll(pages: PageState[], by: number): PageState[] {
  return pages.map((page) => ({
    ...page,
    rotation: (((page.rotation + by) % 360) + 360) % 360,
  }));
}

export function reverse(pages: PageState[]): PageState[] {
  return [...pages].reverse();
}

/** Pages that will survive, in output order. */
export function kept(pages: PageState[]): PageState[] {
  return pages.filter((page) => !page.deleted);
}

/** True when nothing would change, so the download button can say so. */
export function isUnchanged(pages: PageState[]): boolean {
  return pages.every(
    (page, index) => page.source === index && page.rotation === 0 && !page.deleted,
  );
}

export async function buildPdf(bytes: ArrayBuffer, pages: PageState[]): Promise<Uint8Array> {
  const surviving = kept(pages);
  if (surviving.length === 0) {
    throw new Error("Every page is marked for deletion — keep at least one.");
  }

  const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const output = await PDFDocument.create();

  // copyPages takes the whole list at once so shared resources — fonts, images
  // used on several pages — are copied once rather than duplicated per page.
  const copied = await output.copyPages(
    source,
    surviving.map((page) => page.source),
  );

  copied.forEach((page, index) => {
    const rotation = surviving[index].rotation;
    if (rotation !== 0) {
      // Add to whatever the page already declared: a page that was already
      // rotated in the original must not be reset to zero.
      const existing = page.getRotation().angle;
      page.setRotation(degrees((existing + rotation) % 360));
    }
    output.addPage(page);
  });

  return output.save();
}
