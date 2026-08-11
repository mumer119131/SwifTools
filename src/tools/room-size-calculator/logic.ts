import { SQFT_PER_SQM } from "@/lib/home";

export interface RoomMetrics {
  floorSqft: number;
  wallSqft: number;
  ceilingSqft: number;
  perimeterFt: number;
  volumeFt3: number;
  floorSqm: number;
  volumeM3: number;
  /** Rough cooling load — the standard 20 BTU per square foot rule. */
  coolingBtu: number;
  /** Rough heating load at a moderate 35 BTU per square foot. */
  heatingBtu: number;
  /** Recommended rug size in feet, leaving a border of floor showing. */
  rug: { width: number; length: number } | null;
}

/** Feet per metre, exact. */
const FEET_PER_METRE = 3.280839895013123;

export function metrics(
  length: number,
  width: number,
  height: number,
  unit: "ft" | "m",
): RoomMetrics | null {
  if (!(length > 0) || !(width > 0) || !(height > 0)) return null;

  const scale = unit === "ft" ? 1 : FEET_PER_METRE;
  const lengthFt = length * scale;
  const widthFt = width * scale;
  const heightFt = height * scale;

  const floorSqft = lengthFt * widthFt;
  const perimeterFt = 2 * (lengthFt + widthFt);

  /*
   * A rug should leave 18 to 24 inches of floor showing on each side in a room
   * this size — so about 3 feet off each dimension, snapped to the sizes rugs
   * are actually sold in.
   */
  const STANDARD_RUGS: [number, number][] = [
    [3, 5], [4, 6], [5, 8], [6, 9], [8, 10], [9, 12], [10, 14], [12, 15],
  ];
  const targetWidth = Math.min(widthFt, lengthFt) - 3;
  const targetLength = Math.max(widthFt, lengthFt) - 3;
  const rug =
    targetWidth >= 3
      ? [...STANDARD_RUGS]
          .reverse()
          .map(([w, l]) => ({ width: w, length: l }))
          .find((size) => size.width <= targetWidth && size.length <= targetLength) ?? null
      : null;

  return {
    floorSqft,
    wallSqft: perimeterFt * heightFt,
    ceilingSqft: floorSqft,
    perimeterFt,
    volumeFt3: floorSqft * heightFt,
    floorSqm: floorSqft / SQFT_PER_SQM,
    volumeM3: floorSqft * heightFt * 0.028316846592,
    coolingBtu: floorSqft * 20,
    heatingBtu: floorSqft * 35,
    rug,
  };
}
