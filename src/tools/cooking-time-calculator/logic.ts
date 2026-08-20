/**
 * Roasting times by weight.
 *
 * Time per kilogram is how recipes are written and it is a rough guide, not a
 * rule: a joint's thickness matters more than its mass, ovens run 10–20°C off
 * their dials, and a chilled joint straight from the fridge takes noticeably
 * longer than one brought to room temperature.
 *
 * So the internal temperature is given at least as much prominence as the time.
 * It is the only thing that actually determines whether meat is cooked, and a
 * thermometer settles in seconds what a timer only estimates.
 */

export type Doneness = "rare" | "medium-rare" | "medium" | "medium-well" | "well-done";

export interface Meat {
  id: string;
  label: string;
  /** Oven temperature in Celsius, conventional oven. */
  celsius: number;
  /** Minutes per kilogram at that temperature, by doneness where it applies. */
  perKg: Partial<Record<Doneness, number>> & { default?: number };
  /** Extra minutes added once, regardless of weight. */
  fixed: number;
  /** Safe or recommended internal temperatures in Celsius. */
  internal: Partial<Record<Doneness, number>>;
  /** Minutes to rest before carving. */
  rest: number;
  note?: string;
  /** Doneness is meaningless for poultry and pork — they are cooked or unsafe. */
  singleDoneness?: boolean;
}

export const MEATS: Meat[] = [
  {
    id: "beef",
    label: "Beef joint",
    celsius: 180,
    perKg: { rare: 20, "medium-rare": 25, medium: 30, "medium-well": 35, "well-done": 40 },
    fixed: 20,
    internal: { rare: 50, "medium-rare": 55, medium: 60, "medium-well": 65, "well-done": 70 },
    rest: 20,
    note: "Sear at 220°C for the first 20 minutes, then drop to 180°C for the rest.",
  },
  {
    id: "lamb",
    label: "Lamb joint",
    celsius: 180,
    perKg: { "medium-rare": 25, medium: 30, "medium-well": 35, "well-done": 40 },
    fixed: 20,
    internal: { "medium-rare": 55, medium: 60, "medium-well": 65, "well-done": 70 },
    rest: 20,
  },
  {
    id: "pork",
    label: "Pork joint",
    celsius: 180,
    perKg: { default: 35 },
    fixed: 35,
    internal: { medium: 71 },
    rest: 20,
    singleDoneness: true,
    note: "For crackling, start at 220°C for 25 minutes with the skin dry and salted.",
  },
  {
    id: "chicken",
    label: "Whole chicken",
    celsius: 190,
    perKg: { default: 45 },
    fixed: 20,
    internal: { medium: 75 },
    rest: 15,
    singleDoneness: true,
    note: "Juices should run clear from the thickest part of the thigh.",
  },
  {
    id: "turkey",
    label: "Whole turkey",
    celsius: 180,
    perKg: { default: 40 },
    fixed: 20,
    internal: { medium: 75 },
    rest: 30,
    singleDoneness: true,
    note: "Cover with foil for most of the cooking and remove it for the last 30 minutes to brown.",
  },
  {
    id: "duck",
    label: "Whole duck",
    celsius: 180,
    perKg: { default: 45 },
    fixed: 30,
    internal: { medium: 75 },
    rest: 15,
    singleDoneness: true,
  },
  {
    id: "gammon",
    label: "Gammon / ham",
    celsius: 180,
    perKg: { default: 40 },
    fixed: 30,
    internal: { medium: 68 },
    rest: 15,
    singleDoneness: true,
  },
];

export const DONENESS_LABELS: Record<Doneness, string> = {
  rare: "Rare",
  "medium-rare": "Medium rare",
  medium: "Medium",
  "medium-well": "Medium well",
  "well-done": "Well done",
};

export interface CookingResult {
  meat: Meat;
  /** Cooking time in minutes, before resting. */
  minutes: number;
  restMinutes: number;
  totalMinutes: number;
  internalCelsius: number | null;
  perKgUsed: number;
  celsius: number;
  fanCelsius: number;
}

export function calculate(
  meatId: string,
  weightKg: number,
  doneness: Doneness,
): CookingResult | null {
  const meat = MEATS.find((entry) => entry.id === meatId);
  if (!meat) return null;
  if (!Number.isFinite(weightKg) || weightKg <= 0 || weightKg > 30) return null;

  const perKg = meat.singleDoneness
    ? meat.perKg.default
    : (meat.perKg[doneness] ?? meat.perKg.default);
  if (perKg === undefined) return null;

  const minutes = Math.round(weightKg * perKg + meat.fixed);
  const internal = meat.singleDoneness
    ? (Object.values(meat.internal)[0] ?? null)
    : (meat.internal[doneness] ?? null);

  return {
    meat,
    minutes,
    restMinutes: meat.rest,
    totalMinutes: minutes + meat.rest,
    internalCelsius: internal,
    perKgUsed: perKg,
    celsius: meat.celsius,
    // A fan oven runs hotter at the same dial, so drop it by 20°C.
    fanCelsius: meat.celsius - 20,
  };
}

/** Which doneness settings a given meat actually offers. */
export function donenessOptions(meatId: string): Doneness[] {
  const meat = MEATS.find((entry) => entry.id === meatId);
  if (!meat || meat.singleDoneness) return [];
  // `perKg` also carries a `default`, which is not a doneness setting.
  return Object.keys(meat.perKg).filter(
    (key): key is Doneness => key !== "default",
  );
}

export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

/** Working backwards: when to put it in for a given serving time. */
export function startTime(servingMinutes: number, totalMinutes: number): number {
  return ((servingMinutes - totalMinutes) % 1440 + 1440) % 1440;
}

export function toFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}
