/**
 * The PocketToolz mark: three stacked capsules.
 *
 * Drawn from `currentColor` and nothing else, so it inverts with the theme,
 * needs no light and dark variant, and can be dropped into a button, the
 * header, an OG card or a favicon without change.
 *
 * The geometry is deliberately coarse. A favicon is about the area of a full
 * stop at reading distance, so the shapes have to survive being drawn at 16
 * pixels: three bars, four pixels of stroke each, six pixels apart. Anything
 * finer — a notch, an outline, a second tone — turns to mush at that size, and
 * the browser tab is where a favicon spends its life.
 *
 * Widths descend rather than staying equal, which is what stops it reading as
 * a hamburger menu.
 */
export const LOGO_BARS = [
  { x: 2, y: 3, width: 20, height: 4 },
  { x: 4.5, y: 10, width: 15, height: 4 },
  { x: 7, y: 17, width: 10, height: 4 },
] as const;

/** Corner radius. Half the bar height makes each one a true capsule. */
const RADIUS = 2;

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {LOGO_BARS.map((bar) => (
        <rect
          key={bar.y}
          x={bar.x}
          y={bar.y}
          width={bar.width}
          height={bar.height}
          rx={RADIUS}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}
