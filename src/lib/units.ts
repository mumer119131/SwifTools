/**
 * Unit definitions, shared by the per-measurement converters and the dedicated
 * pair pages.
 *
 * Every category converts through one base unit — value → base → target — so
 * each unit needs a single constant rather than an N×N table. Temperature is
 * the exception: its scales have offsets as well as scales, so it is handled
 * separately throughout.
 */

export interface Unit {
  id: string;
  label: string;
  symbol: string;
  /** How many base units one of this unit is worth. */
  ratio: number;
  /** URL segment used in pair slugs, e.g. "lb" in /units/lb-to-kg. */
  url: string;
  /** Plural noun for prose: "Pounds to Kilograms". */
  noun: string;
  /** Everything a person might type for this unit, for search keywords. */
  aliases: string[];
}

export interface UnitCategory {
  id: string;
  label: string;
  /** Used in the tool slug: "weight" -> /units/weight-converter. */
  slug: string;
  baseSymbol: string;
  description: string;
  units: Unit[];
}

const unit = (
  id: string,
  label: string,
  symbol: string,
  ratio: number,
  url: string,
  noun: string,
  aliases: string[],
): Unit => ({ id, label, symbol, ratio, url, noun, aliases });

export const categories: readonly UnitCategory[] = [
  {
    id: "length",
    label: "Length",
    slug: "length",
    baseSymbol: "m",
    description: "Metres, feet, inches, miles and everything between.",
    units: [
      unit("mm", "Millimetre", "mm", 0.001, "mm", "Millimetres", ["mm", "millimetre", "millimeters", "millimetres"]),
      unit("cm", "Centimetre", "cm", 0.01, "cm", "Centimetres", ["cm", "centimetre", "centimeters", "centimetres"]),
      unit("m", "Metre", "m", 1, "m", "Metres", ["m", "metre", "meters", "metres"]),
      unit("km", "Kilometre", "km", 1000, "km", "Kilometres", ["km", "kilometre", "kilometers", "kilometres"]),
      unit("in", "Inch", "in", 0.0254, "inches", "Inches", ["in", "inch", "inches", '"']),
      unit("ft", "Foot", "ft", 0.3048, "feet", "Feet", ["ft", "foot", "feet"]),
      unit("yd", "Yard", "yd", 0.9144, "yards", "Yards", ["yd", "yard", "yards"]),
      unit("mi", "Mile", "mi", 1609.344, "miles", "Miles", ["mi", "mile", "miles"]),
      unit("nmi", "Nautical mile", "nmi", 1852, "nautical-miles", "Nautical miles", ["nmi", "nautical mile", "nautical miles"]),
    ],
  },
  {
    id: "weight",
    label: "Weight",
    slug: "weight",
    baseSymbol: "kg",
    description: "Kilograms, pounds, ounces, stones and tonnes.",
    units: [
      unit("mg", "Milligram", "mg", 0.000001, "mg", "Milligrams", ["mg", "milligram", "milligrams"]),
      unit("g", "Gram", "g", 0.001, "g", "Grams", ["g", "gram", "grams"]),
      unit("kg", "Kilogram", "kg", 1, "kg", "Kilograms", ["kg", "kgs", "kilogram", "kilograms", "kilos", "kilo"]),
      unit("t", "Tonne", "t", 1000, "tonnes", "Tonnes", ["t", "tonne", "tonnes", "metric ton"]),
      unit("oz", "Ounce", "oz", 0.028349523125, "oz", "Ounces", ["oz", "ounce", "ounces"]),
      unit("lb", "Pound", "lb", 0.45359237, "lb", "Pounds", ["lb", "lbs", "pound", "pounds"]),
      unit("st", "Stone", "st", 6.35029318, "stone", "Stone", ["st", "stone", "stones"]),
    ],
  },
  {
    id: "volume",
    label: "Volume",
    slug: "volume",
    baseSymbol: "L",
    description: "Litres, gallons, cups, pints and spoons.",
    units: [
      unit("ml", "Millilitre", "ml", 0.001, "ml", "Millilitres", ["ml", "millilitre", "milliliters", "millilitres"]),
      unit("l", "Litre", "L", 1, "litres", "Litres", ["l", "litre", "liters", "litres"]),
      unit("m3", "Cubic metre", "m³", 1000, "cubic-metres", "Cubic metres", ["m3", "cubic metre", "cubic meters"]),
      unit("tsp", "Teaspoon (US)", "tsp", 0.00492892159375, "teaspoons", "Teaspoons", ["tsp", "teaspoon", "teaspoons"]),
      unit("tbsp", "Tablespoon (US)", "tbsp", 0.01478676478125, "tablespoons", "Tablespoons", ["tbsp", "tablespoon", "tablespoons"]),
      unit("flozus", "Fluid ounce (US)", "fl oz", 0.0295735295625, "fluid-ounces", "Fluid ounces", ["fl oz", "fluid ounce", "fluid ounces", "floz"]),
      unit("cup", "Cup (US)", "cup", 0.2365882365, "cups", "Cups", ["cup", "cups"]),
      unit("ptus", "Pint (US)", "pt", 0.473176473, "pints", "Pints", ["pt", "pint", "pints"]),
      unit("galus", "Gallon (US)", "gal", 3.785411784, "gallons", "Gallons", ["gal", "gallon", "gallons"]),
      unit("galuk", "Gallon (UK)", "gal UK", 4.54609, "uk-gallons", "UK gallons", ["uk gallon", "imperial gallon"]),
    ],
  },
  {
    id: "area",
    label: "Area",
    slug: "area",
    baseSymbol: "m²",
    description: "Square metres, square feet, acres and hectares.",
    units: [
      unit("cm2", "Square centimetre", "cm²", 0.0001, "sq-cm", "Square centimetres", ["cm2", "square centimetre", "sq cm"]),
      unit("m2", "Square metre", "m²", 1, "sq-m", "Square metres", ["m2", "square metre", "square meters", "sq m"]),
      unit("ha", "Hectare", "ha", 10000, "hectares", "Hectares", ["ha", "hectare", "hectares"]),
      unit("km2", "Square kilometre", "km²", 1000000, "sq-km", "Square kilometres", ["km2", "square kilometre", "sq km"]),
      unit("ft2", "Square foot", "ft²", 0.09290304, "sq-ft", "Square feet", ["ft2", "square foot", "square feet", "sq ft"]),
      unit("yd2", "Square yard", "yd²", 0.83612736, "sq-yd", "Square yards", ["yd2", "square yard", "sq yd"]),
      unit("acre", "Acre", "ac", 4046.8564224, "acres", "Acres", ["acre", "acres", "ac"]),
      unit("mi2", "Square mile", "mi²", 2589988.110336, "sq-mi", "Square miles", ["mi2", "square mile", "sq mi"]),
    ],
  },
  {
    id: "speed",
    label: "Speed",
    slug: "speed",
    baseSymbol: "m/s",
    description: "km/h, mph, knots and metres per second.",
    units: [
      unit("mps", "Metres per second", "m/s", 1, "mps", "Metres per second", ["m/s", "mps", "metres per second"]),
      unit("kph", "Kilometres per hour", "km/h", 0.2777777777777778, "kmh", "Kilometres per hour", ["kph", "km/h", "kmh", "kilometres per hour"]),
      unit("mph", "Miles per hour", "mph", 0.44704, "mph", "Miles per hour", ["mph", "miles per hour"]),
      unit("kn", "Knot", "kn", 0.5144444444444445, "knots", "Knots", ["kn", "knot", "knots"]),
      unit("fps", "Feet per second", "ft/s", 0.3048, "fps", "Feet per second", ["ft/s", "fps", "feet per second"]),
    ],
  },
  {
    id: "data",
    label: "Data",
    slug: "data",
    baseSymbol: "B",
    description: "Bytes, kilobytes, megabytes — and the 1024 versions.",
    units: [
      unit("b", "Bit", "bit", 0.125, "bits", "Bits", ["bit", "bits"]),
      unit("B", "Byte", "B", 1, "bytes", "Bytes", ["byte", "bytes"]),
      unit("KB", "Kilobyte (1000)", "KB", 1000, "kb", "Kilobytes", ["kb", "kilobyte", "kilobytes"]),
      unit("KiB", "Kibibyte (1024)", "KiB", 1024, "kib", "Kibibytes", ["kib", "kibibyte"]),
      unit("MB", "Megabyte", "MB", 1000 ** 2, "mb", "Megabytes", ["mb", "megabyte", "megabytes"]),
      unit("MiB", "Mebibyte", "MiB", 1024 ** 2, "mib", "Mebibytes", ["mib", "mebibyte"]),
      unit("GB", "Gigabyte", "GB", 1000 ** 3, "gb", "Gigabytes", ["gb", "gigabyte", "gigabytes"]),
      unit("GiB", "Gibibyte", "GiB", 1024 ** 3, "gib", "Gibibytes", ["gib", "gibibyte"]),
      unit("TB", "Terabyte", "TB", 1000 ** 4, "tb", "Terabytes", ["tb", "terabyte", "terabytes"]),
      unit("TiB", "Tebibyte", "TiB", 1024 ** 4, "tib", "Tebibytes", ["tib", "tebibyte"]),
    ],
  },
  {
    id: "time",
    label: "Time",
    slug: "time",
    baseSymbol: "s",
    description: "Seconds, minutes, hours, days and years.",
    units: [
      unit("ms", "Millisecond", "ms", 0.001, "ms", "Milliseconds", ["ms", "millisecond", "milliseconds"]),
      unit("s", "Second", "s", 1, "seconds", "Seconds", ["s", "sec", "second", "seconds"]),
      unit("min", "Minute", "min", 60, "minutes", "Minutes", ["min", "minute", "minutes"]),
      unit("h", "Hour", "h", 3600, "hours", "Hours", ["h", "hr", "hour", "hours"]),
      unit("d", "Day", "d", 86400, "days", "Days", ["d", "day", "days"]),
      unit("wk", "Week", "wk", 604800, "weeks", "Weeks", ["wk", "week", "weeks"]),
      // The Gregorian mean year, so "1 year" isn't silently 365 days.
      unit("yr", "Year (365.2425 d)", "yr", 31556952, "years", "Years", ["yr", "year", "years"]),
    ],
  },
];

/* ------------------------------------------------------------- temperature */

export const temperatureUnits = [
  { id: "c", label: "Celsius", symbol: "°C", url: "celsius", noun: "Celsius", aliases: ["c", "celsius", "centigrade"] },
  { id: "f", label: "Fahrenheit", symbol: "°F", url: "fahrenheit", noun: "Fahrenheit", aliases: ["f", "fahrenheit"] },
  { id: "k", label: "Kelvin", symbol: "K", url: "kelvin", noun: "Kelvin", aliases: ["k", "kelvin"] },
] as const;

export type TemperatureUnit = (typeof temperatureUnits)[number]["id"];

export const TEMPERATURE_CATEGORY = "temperature";

/** Temperature scales have offsets, so they cannot use a single ratio. */
export function convertTemperature(
  value: number,
  from: TemperatureUnit,
  to: TemperatureUnit,
): number {
  const celsius = from === "c" ? value : from === "f" ? (value - 32) * (5 / 9) : value - 273.15;
  if (to === "c") return celsius;
  if (to === "f") return celsius * (9 / 5) + 32;
  return celsius + 273.15;
}

export function convert(value: number, from: Unit, to: Unit): number {
  return (value * from.ratio) / to.ratio;
}

export function getCategory(id: string): UnitCategory | undefined {
  return categories.find((category) => category.id === id);
}

export function getUnit(categoryId: string, unitId: string): Unit | undefined {
  return getCategory(categoryId)?.units.find((entry) => entry.id === unitId);
}

/**
 * Formats without claiming a precision the conversion doesn't have. Very large
 * and very small magnitudes fall back to exponent notation.
 */
export function formatValue(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0) return "0";

  const magnitude = Math.abs(value);
  if (magnitude >= 1e15 || magnitude < 1e-6) return value.toExponential(4);

  const decimals = magnitude >= 100 ? 2 : magnitude >= 1 ? 4 : 6;
  return Number(value.toFixed(decimals)).toLocaleString("en-US", {
    maximumFractionDigits: decimals,
  });
}

/* -------------------------------------------------------------- pair pages */

export interface UnitPair {
  slug: string;
  categoryId: string;
  fromId: string;
  toId: string;
  /** "Pounds to Kilograms" */
  title: string;
  /** "lb to kg" — the phrase people actually type. */
  shorthand: string;
  fromLabel: string;
  toLabel: string;
  fromSymbol: string;
  toSymbol: string;
  keywords: string[];
}

/**
 * The pairs that get their own page.
 *
 * Deliberately not every permutation: length alone would be 72 pages, and the
 * full set roughly 400, which is thin content that competes with itself. These
 * are the conversions people actually search for, and each is expanded into
 * both directions since "kg to lbs" and "lbs to kg" are separate queries.
 */
const POPULAR: [string, string, string][] = [
  // [categoryId, fromId, toId]
  ["weight", "kg", "lb"],
  ["weight", "g", "oz"],
  ["weight", "kg", "st"],
  ["weight", "lb", "oz"],
  ["weight", "kg", "g"],
  ["weight", "t", "kg"],

  ["length", "cm", "in"],
  ["length", "m", "ft"],
  ["length", "km", "mi"],
  ["length", "mm", "in"],
  ["length", "m", "yd"],
  ["length", "cm", "ft"],
  ["length", "in", "ft"],
  ["length", "m", "km"],

  ["volume", "l", "galus"],
  ["volume", "ml", "flozus"],
  ["volume", "l", "ml"],
  ["volume", "cup", "ml"],
  ["volume", "tbsp", "tsp"],

  ["data", "MB", "GB"],
  ["data", "GB", "TB"],
  ["data", "KB", "MB"],
  ["data", "MiB", "MB"],
  ["data", "b", "B"],

  ["speed", "kph", "mph"],
  ["speed", "mps", "kph"],
  ["speed", "kn", "mph"],

  ["area", "m2", "ft2"],
  ["area", "acre", "ha"],
  ["area", "km2", "mi2"],

  ["time", "min", "s"],
  ["time", "h", "min"],
  ["time", "d", "h"],
];

/** Temperature pairs, kept separate because the maths is. */
const TEMPERATURE_PAIRS: [TemperatureUnit, TemperatureUnit][] = [
  ["c", "f"],
  ["c", "k"],
  ["f", "k"],
];

/**
 * Builds the search phrases a person might type for one direction.
 *
 * Every plain "X to Y" combination is generated before any "convert X to Y"
 * variant. Interleaving them and then truncating dropped whole aliases — which
 * is what made "inches to cm" miss its own page, because the list was full of
 * "convert in to centimetre" before it reached "inches".
 */
function pairKeywords(fromAliases: readonly string[], toAliases: readonly string[]): string[] {
  const from = fromAliases.slice(0, 3);
  const to = toAliases.slice(0, 3);

  const plain: string[] = [];
  for (const a of from) {
    for (const b of to) plain.push(`${a} to ${b}`);
  }

  // One "convert …" phrasing per alias pairing of the primary symbols is
  // enough; more would be near-duplicates competing with each other.
  const prefixed = [`convert ${from[0]} to ${to[0]}`, `${from[0]} into ${to[0]}`];

  return [...new Set([...plain, ...prefixed])];
}

function buildPair(
  categoryId: string,
  from: { id: string; url: string; noun: string; label: string; symbol: string; aliases: readonly string[] },
  to: { id: string; url: string; noun: string; label: string; symbol: string; aliases: readonly string[] },
): UnitPair {
  return {
    slug: `${from.url}-to-${to.url}`,
    categoryId,
    fromId: from.id,
    toId: to.id,
    title: `${from.noun} to ${to.noun}`,
    shorthand: `${from.symbol} to ${to.symbol}`,
    fromLabel: from.label,
    toLabel: to.label,
    fromSymbol: from.symbol,
    toSymbol: to.symbol,
    keywords: pairKeywords(from.aliases, to.aliases),
  };
}

/** Every pair page, both directions, built once at module load. */
export const unitPairs: readonly UnitPair[] = (() => {
  const pairs: UnitPair[] = [];

  for (const [categoryId, fromId, toId] of POPULAR) {
    const from = getUnit(categoryId, fromId);
    const to = getUnit(categoryId, toId);
    if (!from || !to) continue;

    pairs.push(buildPair(categoryId, from, to));
    pairs.push(buildPair(categoryId, to, from));
  }

  for (const [fromId, toId] of TEMPERATURE_PAIRS) {
    const from = temperatureUnits.find((entry) => entry.id === fromId)!;
    const to = temperatureUnits.find((entry) => entry.id === toId)!;
    pairs.push(buildPair(TEMPERATURE_CATEGORY, from, to));
    pairs.push(buildPair(TEMPERATURE_CATEGORY, to, from));
  }

  return pairs;
})();

const pairBySlug = new Map(unitPairs.map((pair) => [pair.slug, pair]));

export function getPair(slug: string): UnitPair | undefined {
  return pairBySlug.get(slug);
}

/** Converts within a pair, routing temperature through its own function. */
export function convertPair(pair: UnitPair, value: number): number {
  if (pair.categoryId === TEMPERATURE_CATEGORY) {
    return convertTemperature(value, pair.fromId as TemperatureUnit, pair.toId as TemperatureUnit);
  }

  const from = getUnit(pair.categoryId, pair.fromId);
  const to = getUnit(pair.categoryId, pair.toId);
  if (!from || !to) return Number.NaN;
  return convert(value, from, to);
}

/**
 * The formula, written out. A pair page that only shows a number is worth less
 * than one that shows the arithmetic — to a reader and to a search engine.
 */
export function pairFormula(pair: UnitPair): string {
  if (pair.categoryId === TEMPERATURE_CATEGORY) {
    const key = `${pair.fromId}${pair.toId}`;
    const formulas: Record<string, string> = {
      cf: "°F = (°C × 9/5) + 32",
      fc: "°C = (°F − 32) × 5/9",
      ck: "K = °C + 273.15",
      kc: "°C = K − 273.15",
      fk: "K = (°F − 32) × 5/9 + 273.15",
      kf: "°F = (K − 273.15) × 9/5 + 32",
    };
    return formulas[key] ?? "";
  }

  const from = getUnit(pair.categoryId, pair.fromId);
  const to = getUnit(pair.categoryId, pair.toId);
  if (!from || !to) return "";

  const factor = from.ratio / to.ratio;
  return `${to.symbol} = ${from.symbol} × ${formatFactor(factor)}`;
}

function formatFactor(factor: number): string {
  if (factor >= 1e6 || factor < 1e-6) return factor.toExponential(6);
  return String(Number(factor.toPrecision(9)));
}

/** Common values, for the reference table every conversion page should have. */
export const COMMON_INPUTS = [1, 2, 5, 10, 20, 25, 50, 100, 500, 1000];

/** Temperature reads better on a human range than on powers of ten. */
export const TEMPERATURE_INPUTS = [-40, -10, 0, 10, 20, 25, 30, 37, 100, 200];

export function commonInputsFor(pair: UnitPair): number[] {
  return pair.categoryId === TEMPERATURE_CATEGORY ? TEMPERATURE_INPUTS : COMMON_INPUTS;
}
