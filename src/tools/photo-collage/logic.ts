/**
 * Laying photographs out in a grid.
 *
 * The layout is pure arithmetic — cell rectangles from a canvas size, a column
 * count and a gap — so it can be reasoned about and tested without a canvas.
 * Drawing is a separate step that consumes these rectangles.
 */

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutOptions {
  count: number;
  width: number;
  height: number;
  columns: number;
  /** Pixels between cells and around the edge. */
  gap: number;
}

/**
 * Even grid cells, filling the canvas.
 *
 * The last row is left the same size as the others rather than stretched to
 * fill: a row of two images made twice as tall as the rows above reads as a
 * mistake, and leaving the space empty at least looks deliberate.
 */
export function gridLayout(options: LayoutOptions): Rect[] {
  const { count, width, height, gap } = options;
  const columns = Math.max(1, Math.min(options.columns, count));
  if (count <= 0 || width <= 0 || height <= 0) return [];

  const rows = Math.ceil(count / columns);

  const cellWidth = (width - gap * (columns + 1)) / columns;
  const cellHeight = (height - gap * (rows + 1)) / rows;
  if (cellWidth <= 0 || cellHeight <= 0) return [];

  const rects: Rect[] = [];
  for (let i = 0; i < count; i += 1) {
    const column = i % columns;
    const row = Math.floor(i / columns);
    rects.push({
      x: gap + column * (cellWidth + gap),
      y: gap + row * (cellHeight + gap),
      width: cellWidth,
      height: cellHeight,
    });
  }
  return rects;
}

/**
 * The source rectangle to sample so an image fills a cell without distortion.
 *
 * The same cover-crop as the social resizer: take the largest region of the
 * source that already has the cell's shape. Stretching to fit is the one option
 * that is always wrong.
 */
export function coverCrop(
  sourceWidth: number,
  sourceHeight: number,
  cellWidth: number,
  cellHeight: number,
): Rect {
  const sourceRatio = sourceWidth / sourceHeight;
  const cellRatio = cellWidth / cellHeight;

  let width = sourceWidth;
  let height = sourceHeight;

  if (sourceRatio > cellRatio) width = sourceHeight * cellRatio;
  else height = sourceWidth / cellRatio;

  return {
    x: (sourceWidth - width) / 2,
    y: (sourceHeight - height) / 2,
    width,
    height,
  };
}

export const PRESETS: { label: string; width: number; height: number; note: string }[] = [
  { label: "Square", width: 1080, height: 1080, note: "Instagram post" },
  { label: "Portrait", width: 1080, height: 1350, note: "Instagram portrait" },
  { label: "Story", width: 1080, height: 1920, note: "Stories and Reels" },
  { label: "Landscape", width: 1920, height: 1080, note: "Widescreen" },
  { label: "A4 portrait", width: 2480, height: 3508, note: "Printing at 300 DPI" },
];

/** Columns that divide a given number of photos tidily. */
export function suggestColumns(count: number): number {
  if (count <= 1) return 1;
  if (count <= 4) return 2;
  if (count <= 9) return 3;
  if (count <= 16) return 4;
  return 5;
}

/** Rows a layout will occupy, for showing how the grid will break. */
export function rowsFor(count: number, columns: number): number {
  return Math.ceil(count / Math.max(1, columns));
}

/** Cells left empty in the final row. */
export function emptyCells(count: number, columns: number): number {
  const rows = rowsFor(count, columns);
  return rows * columns - count;
}
