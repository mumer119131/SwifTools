/**
 * What a journey costs in fuel.
 *
 * The awkward part is that the world measures fuel economy two incompatible
 * ways round. MPG is distance per volume — higher is better. L/100km is volume
 * per distance — lower is better. They are reciprocals, so converting is a
 * division rather than a multiplication, and averaging them is meaningless.
 *
 * There are also two different gallons. A US gallon is 3.785 litres and an
 * imperial one is 4.546, so "40 mpg" means two different things depending on
 * which side of the Atlantic wrote it — a 21% difference, which is far too
 * large to ignore.
 */

export type Economy = "mpg-uk" | "mpg-us" | "l100km" | "kml";
export type Distance = "km" | "mi";
export type Volume = "litre" | "gallon-uk" | "gallon-us";

const KM_PER_MILE = 1.609344;
const LITRES_PER_UK_GALLON = 4.54609;
const LITRES_PER_US_GALLON = 3.785411784;

export const ECONOMY_LABELS: Record<Economy, string> = {
  "mpg-uk": "MPG (imperial)",
  "mpg-us": "MPG (US)",
  l100km: "L/100km",
  kml: "km per litre",
};

/** Everything is normalised to litres per 100km, then converted back out. */
export function toL100km(value: number, unit: Economy): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;

  switch (unit) {
    case "l100km":
      return value;
    case "kml":
      return 100 / value;
    case "mpg-uk":
      // miles per UK gallon -> km per litre -> L/100km
      return 100 / ((value * KM_PER_MILE) / LITRES_PER_UK_GALLON);
    default:
      return 100 / ((value * KM_PER_MILE) / LITRES_PER_US_GALLON);
  }
}

export function fromL100km(l100km: number, unit: Economy): number {
  switch (unit) {
    case "l100km":
      return l100km;
    case "kml":
      return 100 / l100km;
    case "mpg-uk":
      return (100 / l100km) * (LITRES_PER_UK_GALLON / KM_PER_MILE);
    default:
      return (100 / l100km) * (LITRES_PER_US_GALLON / KM_PER_MILE);
  }
}

export function toKm(distance: number, unit: Distance): number {
  return unit === "km" ? distance : distance * KM_PER_MILE;
}

export function litresPer(unit: Volume): number {
  return unit === "litre" ? 1 : unit === "gallon-uk" ? LITRES_PER_UK_GALLON : LITRES_PER_US_GALLON;
}

export interface TripCost {
  km: number;
  litres: number;
  /** Total cost, in whatever currency the price was given in. */
  cost: number;
  costPerKm: number;
  costPerMile: number;
  /** Split between this many people. Equal to cost when one. */
  perPerson: number;
  /** The same trip there and back. */
  returnCost: number;
}

export function calculate(input: {
  distance: number;
  distanceUnit: Distance;
  economy: number;
  economyUnit: Economy;
  price: number;
  priceUnit: Volume;
  people: number;
}): TripCost | null {
  const l100km = toL100km(input.economy, input.economyUnit);
  if (l100km === null) return null;
  if (!Number.isFinite(input.distance) || input.distance <= 0) return null;
  if (!Number.isFinite(input.price) || input.price < 0) return null;

  const km = toKm(input.distance, input.distanceUnit);
  const litres = (km / 100) * l100km;

  // The price is per whatever volume unit was chosen, so convert it to a price
  // per litre before multiplying.
  const pricePerLitre = input.price / litresPer(input.priceUnit);
  const cost = litres * pricePerLitre;

  const people = Math.max(1, Math.round(input.people));

  return {
    km,
    litres,
    cost,
    costPerKm: cost / km,
    costPerMile: (cost / km) * KM_PER_MILE,
    perPerson: cost / people,
    returnCost: cost * 2,
  };
}

/**
 * How much a more efficient car would save over a year.
 *
 * The comparison people actually want when shopping, and the one where
 * reasoning in MPG misleads: going from 20 to 25 mpg saves considerably more
 * fuel than going from 40 to 50, despite being a smaller-looking improvement.
 * That is the reciprocal at work, and it is why L/100km is the more honest
 * unit.
 */
export function annualComparison(
  currentEconomy: number,
  otherEconomy: number,
  unit: Economy,
  annualDistance: number,
  distanceUnit: Distance,
  pricePerLitre: number,
): { currentCost: number; otherCost: number; saving: number } | null {
  const a = toL100km(currentEconomy, unit);
  const b = toL100km(otherEconomy, unit);
  if (a === null || b === null) return null;

  const km = toKm(annualDistance, distanceUnit);
  const currentCost = (km / 100) * a * pricePerLitre;
  const otherCost = (km / 100) * b * pricePerLitre;

  return { currentCost, otherCost, saving: currentCost - otherCost };
}
