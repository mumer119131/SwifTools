import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  number: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  fromName: string;
  fromDetails: string;
  toName: string;
  toDetails: string;
  items: LineItem[];
  taxPercent: number;
  discountPercent: number;
  notes: string;
}

export interface Totals {
  subtotal: number;
  discount: number;
  taxable: number;
  tax: number;
  total: number;
}

export function calculateTotals(invoice: Invoice): Totals {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const discount = (subtotal * invoice.discountPercent) / 100;
  // Tax applies after the discount — charging tax on money nobody paid is wrong.
  const taxable = subtotal - discount;
  const tax = (taxable * invoice.taxPercent) / 100;

  return { subtotal, discount, taxable, tax, total: taxable + tax };
}

export function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 48;

/**
 * Typesets the invoice with pdf-lib.
 *
 * The standard PDF fonts are WinAnsi-encoded, so any character outside that set
 * would throw while drawing. Everything user-supplied is sanitised on the way
 * in rather than letting a stray em dash or emoji fail the whole export.
 */
export async function buildInvoicePdf(invoice: Invoice): Promise<Blob> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([A4.width, A4.height]);

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const ink = rgb(0.06, 0.06, 0.07);
  const muted = rgb(0.42, 0.44, 0.47);
  const rule = rgb(0.85, 0.85, 0.87);

  let y = A4.height - MARGIN;

  const draw = (
    text: string,
    x: number,
    size: number,
    font: PDFFont = regular,
    color = ink,
  ) => {
    page.drawText(safe(text), { x, y, size, font, color });
  };

  const drawRight = (text: string, right: number, size: number, font: PDFFont = regular, color = ink) => {
    const value = safe(text);
    page.drawText(value, {
      x: right - font.widthOfTextAtSize(value, size),
      y,
      size,
      font,
      color,
    });
  };

  const line = (target: PDFPage) => {
    target.drawLine({
      start: { x: MARGIN, y },
      end: { x: A4.width - MARGIN, y },
      thickness: 0.75,
      color: rule,
    });
  };

  // Header
  draw("INVOICE", MARGIN, 26, bold);
  drawRight(`#${invoice.number}`, A4.width - MARGIN, 12, bold, muted);
  y -= 28;
  drawRight(`Issued ${invoice.issueDate}`, A4.width - MARGIN, 9, regular, muted);
  y -= 12;
  drawRight(`Due ${invoice.dueDate}`, A4.width - MARGIN, 9, regular, muted);

  y -= 24;
  line(page);
  y -= 24;

  // Parties, side by side
  const columnY = y;
  draw("FROM", MARGIN, 8, bold, muted);
  y -= 14;
  draw(invoice.fromName, MARGIN, 11, bold);
  y -= 14;
  for (const detail of invoice.fromDetails.split("\n").slice(0, 6)) {
    if (!detail.trim()) continue;
    draw(detail, MARGIN, 9, regular, muted);
    y -= 12;
  }
  const fromBottom = y;

  y = columnY;
  const rightColumn = A4.width / 2 + 10;
  draw("BILL TO", rightColumn, 8, bold, muted);
  y -= 14;
  draw(invoice.toName, rightColumn, 11, bold);
  y -= 14;
  for (const detail of invoice.toDetails.split("\n").slice(0, 6)) {
    if (!detail.trim()) continue;
    draw(detail, rightColumn, 9, regular, muted);
    y -= 12;
  }

  y = Math.min(fromBottom, y) - 24;
  line(page);
  y -= 18;

  // Table header
  const columns = {
    description: MARGIN,
    quantity: A4.width - MARGIN - 230,
    price: A4.width - MARGIN - 140,
    amount: A4.width - MARGIN,
  };

  draw("DESCRIPTION", columns.description, 8, bold, muted);
  drawRight("QTY", columns.quantity + 30, 8, bold, muted);
  drawRight("UNIT PRICE", columns.price + 70, 8, bold, muted);
  drawRight("AMOUNT", columns.amount, 8, bold, muted);
  y -= 10;
  line(page);
  y -= 16;

  for (const item of invoice.items) {
    if (!item.description.trim() && item.quantity === 0) continue;

    // Long descriptions wrap rather than running under the numbers.
    const wrapped = wrap(item.description, regular, 10, columns.quantity - MARGIN - 12);
    const amount = item.quantity * item.unitPrice;

    for (const [index, textLine] of wrapped.entries()) {
      draw(textLine, columns.description, 10);
      if (index === 0) {
        drawRight(String(item.quantity), columns.quantity + 30, 10);
        drawRight(formatMoney(item.unitPrice, invoice.currency), columns.price + 70, 10);
        drawRight(formatMoney(amount, invoice.currency), columns.amount, 10, bold);
      }
      y -= 14;
    }
    y -= 4;
  }

  y -= 8;
  line(page);
  y -= 18;

  // Totals, right-aligned
  const totals = calculateTotals(invoice);
  const totalRows: [string, string, boolean][] = [
    ["Subtotal", formatMoney(totals.subtotal, invoice.currency), false],
    ...(invoice.discountPercent > 0
      ? ([[`Discount (${invoice.discountPercent}%)`, `−${formatMoney(totals.discount, invoice.currency)}`, false]] as [string, string, boolean][])
      : []),
    ...(invoice.taxPercent > 0
      ? ([[`Tax (${invoice.taxPercent}%)`, formatMoney(totals.tax, invoice.currency), false]] as [string, string, boolean][])
      : []),
    ["Total due", formatMoney(totals.total, invoice.currency), true],
  ];

  for (const [label, value, emphasised] of totalRows) {
    drawRight(label, columns.price + 70, emphasised ? 12 : 10, emphasised ? bold : regular, emphasised ? ink : muted);
    drawRight(value, columns.amount, emphasised ? 12 : 10, emphasised ? bold : regular);
    y -= emphasised ? 20 : 16;
  }

  if (invoice.notes.trim()) {
    y -= 16;
    line(page);
    y -= 18;
    draw("NOTES", MARGIN, 8, bold, muted);
    y -= 14;
    for (const noteLine of wrap(invoice.notes, regular, 9, A4.width - MARGIN * 2)) {
      draw(noteLine, MARGIN, 9, regular, muted);
      y -= 12;
    }
  }

  pdf.setTitle(`Invoice ${invoice.number}`);
  pdf.setProducer("");
  pdf.setCreator("");

  const bytes = await pdf.save({ useObjectStreams: true });
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

/** Replaces characters the standard PDF fonts cannot encode. */
function safe(text: string): string {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/—/g, "-")
    .replace(/–/g, "-")
    .replace(/[^\x20-\xFF]/g, "");
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = safe(text).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);

  return lines;
}

/**
 * Line-item ids only need to be unique within this form, so a counter beats
 * `crypto.randomUUID` here: it is deterministic, which means the first row can
 * be built during render without a hydration mismatch.
 */
let nextItemId = 0;

/** A date `offsetDays` from today, as a `<input type="date">` value. */
export function todayInput(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Default issue and due dates, read on the client so SSR output stays
 * deterministic.
 *
 * Two readers returning strings rather than one returning an object: these feed
 * `useClientValue`, which compares snapshots with `Object.is`, and rebuilding
 * an object on every call would re-render forever.
 */
export const readIssueDate = (): string => todayInput();
export const readDueDate = (): string => todayInput(30);

export function blankItem(): LineItem {
  return {
    id: `item-${(nextItemId += 1)}`,
    description: "",
    quantity: 1,
    unitPrice: 0,
  };
}
