export interface FlooringEstimate {
  area: number;
  areaWithWaste: number;
  boxes: number;
  covered: number;
  spare: number;
  cost: number | null;
}

/**
 * Boxes of flooring for an area.
 *
 * The waste allowance is not padding: every plank cut to fit at a wall leaves
 * an offcut too short to start the next row, and a diagonal or herringbone
 * layout wastes far more. Ordering the exact area guarantees a shortfall, and a
 * second order rarely matches the first batch's dye lot.
 */
export function estimate(
  areaSqft: number,
  sqftPerBox: number,
  wastePercent: number,
  pricePerBox: number,
): FlooringEstimate {
  const area = Math.max(0, areaSqft);
  const areaWithWaste = area * (1 + Math.max(0, wastePercent) / 100);

  const boxes = sqftPerBox > 0 ? Math.ceil(areaWithWaste / sqftPerBox) : 0;
  const covered = boxes * sqftPerBox;

  return {
    area,
    areaWithWaste,
    boxes,
    covered,
    spare: Math.max(0, covered - area),
    cost: pricePerBox > 0 ? boxes * pricePerBox : null,
  };
}

export const WASTE_PRESETS = [
  { value: 5, label: "5% — simple square room" },
  { value: 10, label: "10% — standard straight lay" },
  { value: 15, label: "15% — angled walls or many cuts" },
  { value: 20, label: "20% — diagonal lay" },
  { value: 30, label: "30% — herringbone or chevron" },
];
