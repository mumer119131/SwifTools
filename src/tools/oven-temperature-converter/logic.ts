/**
 * Oven temperatures: Celsius, Fahrenheit, gas mark, and fan.
 *
 * The part recipes get wrong, and the part that ruins baking: a fan (convection)
 * oven cooks hotter than its dial says, because moving air transfers heat far
 * more effectively than still air. A recipe written for a conventional oven at
 * 200°C needs about 180°C in a fan oven — and following it literally gives you
 * something burnt outside and raw inside.
 *
 * Gas marks are not linear and are not a formula anyone should derive. They are
 * a defined table, so a table is what this uses.
 */

export interface OvenRow {
  celsius: number;
  fahrenheit: number;
  /** Conventional-oven gas mark. */
  gas: number | null;
  /** The dial setting for the same result in a fan oven. */
  fanCelsius: number;
  description: string;
}

/**
 * The standard table.
 *
 * Celsius and gas marks come from the conventional British scale; Fahrenheit
 * values are the rounded ones recipes actually print rather than exact
 * conversions, because 140°C is written as 275°F and not 284°F.
 */
export const TABLE: OvenRow[] = [
  { celsius: 110, fahrenheit: 225, gas: 0.25, fanCelsius: 90, description: "Very cool — meringues, slow drying" },
  { celsius: 120, fahrenheit: 250, gas: 0.5, fanCelsius: 100, description: "Very cool — slow cooking" },
  { celsius: 140, fahrenheit: 275, gas: 1, fanCelsius: 120, description: "Cool — rich fruit cake, slow braising" },
  { celsius: 150, fahrenheit: 300, gas: 2, fanCelsius: 130, description: "Cool — casseroles, custards" },
  { celsius: 160, fahrenheit: 325, gas: 3, fanCelsius: 140, description: "Warm — victoria sponge, slow roasts" },
  { celsius: 180, fahrenheit: 350, gas: 4, fanCelsius: 160, description: "Moderate — most cakes and biscuits" },
  { celsius: 190, fahrenheit: 375, gas: 5, fanCelsius: 170, description: "Moderately hot — pastry, muffins" },
  { celsius: 200, fahrenheit: 400, gas: 6, fanCelsius: 180, description: "Fairly hot — roast vegetables, scones" },
  { celsius: 220, fahrenheit: 425, gas: 7, fanCelsius: 200, description: "Hot — roasting, puff pastry" },
  { celsius: 230, fahrenheit: 450, gas: 8, fanCelsius: 210, description: "Very hot — bread, pizza" },
  { celsius: 240, fahrenheit: 475, gas: 9, fanCelsius: 220, description: "Very hot — searing, thin pizza" },
];

export type Scale = "c" | "f" | "gas" | "fan";

export const SCALE_LABELS: Record<Scale, string> = {
  c: "Celsius (conventional)",
  f: "Fahrenheit",
  gas: "Gas mark",
  fan: "Celsius (fan / convection)",
};

/** The standard reduction for a fan oven: 20°C below the conventional dial. */
export const FAN_REDUCTION = 20;

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

/** Normalises any input scale to a conventional-oven Celsius value. */
export function toConventionalCelsius(value: number, scale: Scale): number | null {
  if (!Number.isFinite(value)) return null;

  switch (scale) {
    case "c":
      return value;
    case "f":
      return fahrenheitToCelsius(value);
    case "fan":
      return value + FAN_REDUCTION;
    default: {
      // Gas marks are a lookup, not a formula. Interpolate between the two
      // nearest rows so an in-between value still gives something sensible.
      const rows = TABLE.filter((row) => row.gas !== null);
      const exact = rows.find((row) => row.gas === value);
      if (exact) return exact.celsius;

      const below = [...rows].reverse().find((row) => (row.gas as number) < value);
      const above = rows.find((row) => (row.gas as number) > value);

      if (!below && above) return above.celsius;
      if (below && !above) return below.celsius;
      if (!below || !above) return null;

      const span = (above.gas as number) - (below.gas as number);
      const position = (value - (below.gas as number)) / span;
      return below.celsius + position * (above.celsius - below.celsius);
    }
  }
}

export interface Converted {
  celsius: number;
  fahrenheit: number;
  fanCelsius: number;
  fanFahrenheit: number;
  /** Null when the temperature falls outside the gas mark range. */
  gas: number | null;
  /** True when it lands exactly on a standard row rather than between two. */
  standard: boolean;
  nearest: OvenRow | null;
}

export function convert(value: number, scale: Scale): Converted | null {
  const celsius = toConventionalCelsius(value, scale);
  if (celsius === null || celsius < 0) return null;

  const rows = TABLE.filter((row) => row.gas !== null);
  const exact = TABLE.find((row) => Math.abs(row.celsius - celsius) < 0.5);

  let gas: number | null = null;
  if (exact?.gas != null) {
    gas = exact.gas;
  } else if (celsius >= rows[0].celsius && celsius <= rows[rows.length - 1].celsius) {
    const below = [...rows].reverse().find((row) => row.celsius <= celsius);
    const above = rows.find((row) => row.celsius >= celsius);
    if (below && above && above.celsius !== below.celsius) {
      const position = (celsius - below.celsius) / (above.celsius - below.celsius);
      gas = Math.round(((below.gas as number) + position * ((above.gas as number) - (below.gas as number))) * 4) / 4;
    } else if (below) {
      gas = below.gas;
    }
  }

  const nearest = TABLE.reduce<OvenRow | null>((best, row) => {
    if (!best) return row;
    return Math.abs(row.celsius - celsius) < Math.abs(best.celsius - celsius) ? row : best;
  }, null);

  const fanCelsius = celsius - FAN_REDUCTION;

  return {
    celsius,
    fahrenheit: celsiusToFahrenheit(celsius),
    fanCelsius,
    fanFahrenheit: celsiusToFahrenheit(fanCelsius),
    gas,
    standard: Boolean(exact),
    nearest,
  };
}

/**
 * How much less time a fan oven needs at the same dial setting.
 *
 * The other half of the fan adjustment, and the one people forget. If you keep
 * the temperature the same rather than dropping it, reduce the time instead —
 * roughly a quarter.
 */
export function fanTimeAdjustment(minutes: number): number {
  return Math.round(minutes * 0.75);
}
