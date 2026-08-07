export const categoryId = "pressure";
export const defaultFrom = "psi";
export const defaultTo = "bar";

/** Reference pressures in pascals, for context. */
export const REFERENCES: { name: string; pascals: number }[] = [
  { name: "Vacuum of space", pascals: 0 },
  { name: "Everest summit", pascals: 33700 },
  { name: "Sea-level atmosphere", pascals: 101325 },
  { name: "Car tyre (32 psi)", pascals: 220632 },
  { name: "Espresso machine (9 bar)", pascals: 900000 },
  { name: "Scuba tank (200 bar)", pascals: 20000000 },
  { name: "Mariana Trench", pascals: 108600000 },
];
