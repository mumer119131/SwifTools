/**
 * The PocketToolz mark: a two-by-two grid of rounded squares, with the last
 * one softened to a circle and dimmed.
 *
 * Abstract rather than literal. It says "several things gathered in one place",
 * which is what the site is, without committing to a picture of a pocket or a
 * tool that would look wrong next to a chemistry calculator.
 *
 * Drawn from `currentColor` and nothing else, so it inverts with the theme,
 * needs no light and dark variant, and drops into the header, an OG card or a
 * favicon unchanged. The dimmed quarter uses opacity rather than a second
 * colour for the same reason.
 *
 * The geometry is coarse on purpose. A favicon is about the area of a full stop
 * at reading distance, so each square is 7.5 units of a 24-unit box with a
 * 3-unit gutter — wide enough that the four stay distinct at 16 pixels, which
 * is where a favicon spends its life. Anything finer turns to mush.
 */
const SIZE = 7.5;
const GAP = 3;
const START = 3;

export const LOGO_CELLS = [
  { x: START, y: START, rx: 2.2, opacity: 1 },
  { x: START + SIZE + GAP, y: START, rx: 2.2, opacity: 1 },
  { x: START, y: START + SIZE + GAP, rx: 2.2, opacity: 1 },
  // Fully rounded and dimmed: the one that stops it reading as a plain grid.
  { x: START + SIZE + GAP, y: START + SIZE + GAP, rx: SIZE / 2, opacity: 0.55 },
] as const;

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      {LOGO_CELLS.map((cell) => (
        <rect
          key={`${cell.x}-${cell.y}`}
          x={cell.x}
          y={cell.y}
          width={SIZE}
          height={SIZE}
          rx={cell.rx}
          fill="currentColor"
          opacity={cell.opacity}
        />
      ))}
    </svg>
  );
}
