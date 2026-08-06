export interface Unit {
  id: string;
  label: string;
  symbol: string;
  /** How many base units one of this unit is worth. */
  ratio: number;
}

export interface UnitCategory {
  id: string;
  label: string;
  baseSymbol: string;
  units: Unit[];
}

/**
 * Every category converts through one base unit: value → base → target. That
 * keeps each unit to a single constant instead of an N×N conversion table.
 *
 * Temperature is the exception — it has offsets as well as scales — and is
 * handled separately below.
 */
export const categories: readonly UnitCategory[] = [
  {
    id: "length",
    label: "Length",
    baseSymbol: "m",
    units: [
      { id: "mm", label: "Millimetre", symbol: "mm", ratio: 0.001 },
      { id: "cm", label: "Centimetre", symbol: "cm", ratio: 0.01 },
      { id: "m", label: "Metre", symbol: "m", ratio: 1 },
      { id: "km", label: "Kilometre", symbol: "km", ratio: 1000 },
      { id: "in", label: "Inch", symbol: "in", ratio: 0.0254 },
      { id: "ft", label: "Foot", symbol: "ft", ratio: 0.3048 },
      { id: "yd", label: "Yard", symbol: "yd", ratio: 0.9144 },
      { id: "mi", label: "Mile", symbol: "mi", ratio: 1609.344 },
      { id: "nmi", label: "Nautical mile", symbol: "nmi", ratio: 1852 },
    ],
  },
  {
    id: "weight",
    label: "Weight",
    baseSymbol: "kg",
    units: [
      { id: "mg", label: "Milligram", symbol: "mg", ratio: 0.000001 },
      { id: "g", label: "Gram", symbol: "g", ratio: 0.001 },
      { id: "kg", label: "Kilogram", symbol: "kg", ratio: 1 },
      { id: "t", label: "Tonne", symbol: "t", ratio: 1000 },
      { id: "oz", label: "Ounce", symbol: "oz", ratio: 0.028349523125 },
      { id: "lb", label: "Pound", symbol: "lb", ratio: 0.45359237 },
      { id: "st", label: "Stone", symbol: "st", ratio: 6.35029318 },
    ],
  },
  {
    id: "volume",
    label: "Volume",
    baseSymbol: "L",
    units: [
      { id: "ml", label: "Millilitre", symbol: "ml", ratio: 0.001 },
      { id: "l", label: "Litre", symbol: "L", ratio: 1 },
      { id: "m3", label: "Cubic metre", symbol: "m³", ratio: 1000 },
      { id: "tsp", label: "Teaspoon (US)", symbol: "tsp", ratio: 0.00492892159375 },
      { id: "tbsp", label: "Tablespoon (US)", symbol: "tbsp", ratio: 0.01478676478125 },
      { id: "flozus", label: "Fluid ounce (US)", symbol: "fl oz", ratio: 0.0295735295625 },
      { id: "cup", label: "Cup (US)", symbol: "cup", ratio: 0.2365882365 },
      { id: "ptus", label: "Pint (US)", symbol: "pt", ratio: 0.473176473 },
      { id: "galus", label: "Gallon (US)", symbol: "gal", ratio: 3.785411784 },
      { id: "galuk", label: "Gallon (UK)", symbol: "gal UK", ratio: 4.54609 },
    ],
  },
  {
    id: "area",
    label: "Area",
    baseSymbol: "m²",
    units: [
      { id: "cm2", label: "Square centimetre", symbol: "cm²", ratio: 0.0001 },
      { id: "m2", label: "Square metre", symbol: "m²", ratio: 1 },
      { id: "ha", label: "Hectare", symbol: "ha", ratio: 10000 },
      { id: "km2", label: "Square kilometre", symbol: "km²", ratio: 1000000 },
      { id: "ft2", label: "Square foot", symbol: "ft²", ratio: 0.09290304 },
      { id: "yd2", label: "Square yard", symbol: "yd²", ratio: 0.83612736 },
      { id: "acre", label: "Acre", symbol: "ac", ratio: 4046.8564224 },
      { id: "mi2", label: "Square mile", symbol: "mi²", ratio: 2589988.110336 },
    ],
  },
  {
    id: "speed",
    label: "Speed",
    baseSymbol: "m/s",
    units: [
      { id: "mps", label: "Metres per second", symbol: "m/s", ratio: 1 },
      { id: "kph", label: "Kilometres per hour", symbol: "km/h", ratio: 0.2777777777777778 },
      { id: "mph", label: "Miles per hour", symbol: "mph", ratio: 0.44704 },
      { id: "kn", label: "Knot", symbol: "kn", ratio: 0.5144444444444445 },
      { id: "fps", label: "Feet per second", symbol: "ft/s", ratio: 0.3048 },
    ],
  },
  {
    id: "data",
    label: "Data",
    baseSymbol: "B",
    units: [
      { id: "b", label: "Bit", symbol: "bit", ratio: 0.125 },
      { id: "B", label: "Byte", symbol: "B", ratio: 1 },
      { id: "KB", label: "Kilobyte (1000)", symbol: "KB", ratio: 1000 },
      { id: "KiB", label: "Kibibyte (1024)", symbol: "KiB", ratio: 1024 },
      { id: "MB", label: "Megabyte", symbol: "MB", ratio: 1000 ** 2 },
      { id: "MiB", label: "Mebibyte", symbol: "MiB", ratio: 1024 ** 2 },
      { id: "GB", label: "Gigabyte", symbol: "GB", ratio: 1000 ** 3 },
      { id: "GiB", label: "Gibibyte", symbol: "GiB", ratio: 1024 ** 3 },
      { id: "TB", label: "Terabyte", symbol: "TB", ratio: 1000 ** 4 },
      { id: "TiB", label: "Tebibyte", symbol: "TiB", ratio: 1024 ** 4 },
    ],
  },
  {
    id: "time",
    label: "Time",
    baseSymbol: "s",
    units: [
      { id: "ms", label: "Millisecond", symbol: "ms", ratio: 0.001 },
      { id: "s", label: "Second", symbol: "s", ratio: 1 },
      { id: "min", label: "Minute", symbol: "min", ratio: 60 },
      { id: "h", label: "Hour", symbol: "h", ratio: 3600 },
      { id: "d", label: "Day", symbol: "d", ratio: 86400 },
      { id: "wk", label: "Week", symbol: "wk", ratio: 604800 },
      // The Gregorian mean year, so "1 year" isn't silently 365 days.
      { id: "yr", label: "Year (365.2425 d)", symbol: "yr", ratio: 31556952 },
    ],
  },
];

export const temperatureUnits = [
  { id: "c", label: "Celsius", symbol: "°C" },
  { id: "f", label: "Fahrenheit", symbol: "°F" },
  { id: "k", label: "Kelvin", symbol: "K" },
] as const;

export type TemperatureUnit = (typeof temperatureUnits)[number]["id"];

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

/**
 * Formats without pretending to a precision the conversion doesn't have.
 * Very large and very small magnitudes fall back to exponent notation rather
 * than printing twenty digits.
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
