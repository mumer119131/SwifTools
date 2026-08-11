export interface TileEstimate {
  tileAreaSqft: number;
  tilesNeeded: number;
  tilesWithWaste: number;
  boxes: number;
  groutKg: number;
  cost: number | null;
}

/** Common tile sizes in inches. */
export const TILE_SIZES = [
  { id: "12x12", label: '12" × 12"', width: 12, height: 12 },
  { id: "12x24", label: '12" × 24"', width: 12, height: 24 },
  { id: "18x18", label: '18" × 18"', width: 18, height: 18 },
  { id: "24x24", label: '24" × 24"', width: 24, height: 24 },
  { id: "6x24", label: '6" × 24" plank', width: 6, height: 24 },
  { id: "4x12", label: '4" × 12" subway', width: 4, height: 12 },
  { id: "3x6", label: '3" × 6" subway', width: 3, height: 6 },
  { id: "custom", label: "Custom size", width: 0, height: 0 },
];

/**
 * Tiles for an area.
 *
 * The grout gap matters more than it looks: a 3 mm joint on a 12-inch tile adds
 * about 2% to its effective footprint, which across a large floor is a box.
 */
export function estimate(
  areaSqft: number,
  tileWidthIn: number,
  tileHeightIn: number,
  groutMm: number,
  wastePercent: number,
  tilesPerBox: number,
  pricePerBox: number,
): TileEstimate {
  const groutIn = Math.max(0, groutMm) / 25.4;
  const effectiveWidth = Math.max(0, tileWidthIn) + groutIn;
  const effectiveHeight = Math.max(0, tileHeightIn) + groutIn;

  // 144 square inches to the square foot.
  const tileAreaSqft = (effectiveWidth * effectiveHeight) / 144;

  const tilesNeeded = tileAreaSqft > 0 ? Math.max(0, areaSqft) / tileAreaSqft : 0;
  const tilesWithWaste = Math.ceil(tilesNeeded * (1 + Math.max(0, wastePercent) / 100));

  const boxes = tilesPerBox > 0 ? Math.ceil(tilesWithWaste / tilesPerBox) : 0;

  /*
   * Grout volume: joint width × joint depth × total joint length. Approximated
   * from the standard coverage rule of thumb — about 0.4 kg per square metre
   * for a 3 mm joint on a 300 mm tile, scaled by joint width and tile size.
   */
  const areaSqm = Math.max(0, areaSqft) / 10.763910416709722;
  const averageTileMm = ((tileWidthIn + tileHeightIn) / 2) * 25.4;
  const groutKg =
    averageTileMm > 0 ? areaSqm * 0.4 * (groutMm / 3) * (300 / averageTileMm) : 0;

  return {
    tileAreaSqft,
    tilesNeeded,
    tilesWithWaste,
    boxes,
    groutKg,
    cost: pricePerBox > 0 ? boxes * pricePerBox : null,
  };
}
