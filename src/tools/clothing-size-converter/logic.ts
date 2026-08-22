/**
 * Clothing sizes across regions.
 *
 * Even less standardised than shoes. UK, US and EU numbering for women's
 * clothing derives from nothing consistent at all, and "vanity sizing" — the
 * long drift of a given number toward larger measurements — means a size 12
 * from 1990 and a size 12 today are different garments.
 *
 * So, as with shoes, the body measurement is the figure that means anything and
 * the number is a convention. The tables say what the labels usually
 * correspond to; the chest and waist columns say what will actually fit.
 */

export type Fit = "women" | "men";
export type Garment = "tops" | "bottoms";
export type Region = "uk" | "us" | "eu" | "it" | "alpha";

export const REGION_LABELS: Record<Region, string> = {
  uk: "UK",
  us: "US",
  eu: "EU / FR",
  it: "IT",
  alpha: "S / M / L",
};

export interface Row {
  uk: string;
  us: string;
  eu: string;
  it: string;
  alpha: string;
  /** Chest for tops, waist for bottoms, in centimetres. */
  bodyCm: string;
  hipCm?: string;
}

export const TABLES: Record<Fit, Record<Garment, Row[]>> = {
  women: {
    tops: [
      { uk: "4", us: "0", eu: "32", it: "36", alpha: "XXS", bodyCm: "76–79", hipCm: "84–87" },
      { uk: "6", us: "2", eu: "34", it: "38", alpha: "XS", bodyCm: "80–83", hipCm: "88–91" },
      { uk: "8", us: "4", eu: "36", it: "40", alpha: "S", bodyCm: "84–87", hipCm: "92–95" },
      { uk: "10", us: "6", eu: "38", it: "42", alpha: "S", bodyCm: "88–91", hipCm: "96–99" },
      { uk: "12", us: "8", eu: "40", it: "44", alpha: "M", bodyCm: "92–95", hipCm: "100–103" },
      { uk: "14", us: "10", eu: "42", it: "46", alpha: "L", bodyCm: "96–99", hipCm: "104–107" },
      { uk: "16", us: "12", eu: "44", it: "48", alpha: "L", bodyCm: "100–105", hipCm: "108–113" },
      { uk: "18", us: "14", eu: "46", it: "50", alpha: "XL", bodyCm: "106–111", hipCm: "114–119" },
      { uk: "20", us: "16", eu: "48", it: "52", alpha: "XXL", bodyCm: "112–117", hipCm: "120–125" },
      { uk: "22", us: "18", eu: "50", it: "54", alpha: "XXXL", bodyCm: "118–123", hipCm: "126–131" },
    ],
    bottoms: [
      { uk: "6", us: "2", eu: "34", it: "38", alpha: "XS", bodyCm: "61–64", hipCm: "88–91" },
      { uk: "8", us: "4", eu: "36", it: "40", alpha: "S", bodyCm: "65–68", hipCm: "92–95" },
      { uk: "10", us: "6", eu: "38", it: "42", alpha: "S", bodyCm: "69–72", hipCm: "96–99" },
      { uk: "12", us: "8", eu: "40", it: "44", alpha: "M", bodyCm: "73–76", hipCm: "100–103" },
      { uk: "14", us: "10", eu: "42", it: "46", alpha: "L", bodyCm: "77–81", hipCm: "104–107" },
      { uk: "16", us: "12", eu: "44", it: "48", alpha: "L", bodyCm: "82–87", hipCm: "108–113" },
      { uk: "18", us: "14", eu: "46", it: "50", alpha: "XL", bodyCm: "88–93", hipCm: "114–119" },
      { uk: "20", us: "16", eu: "48", it: "52", alpha: "XXL", bodyCm: "94–99", hipCm: "120–125" },
    ],
  },
  men: {
    tops: [
      { uk: "34", us: "34", eu: "44", it: "44", alpha: "XS", bodyCm: "86–89" },
      { uk: "36", us: "36", eu: "46", it: "46", alpha: "S", bodyCm: "91–94" },
      { uk: "38", us: "38", eu: "48", it: "48", alpha: "S", bodyCm: "96–99" },
      { uk: "40", us: "40", eu: "50", it: "50", alpha: "M", bodyCm: "101–104" },
      { uk: "42", us: "42", eu: "52", it: "52", alpha: "L", bodyCm: "106–109" },
      { uk: "44", us: "44", eu: "54", it: "54", alpha: "L", bodyCm: "111–114" },
      { uk: "46", us: "46", eu: "56", it: "56", alpha: "XL", bodyCm: "116–119" },
      { uk: "48", us: "48", eu: "58", it: "58", alpha: "XXL", bodyCm: "121–124" },
    ],
    bottoms: [
      { uk: "28", us: "28", eu: "44", it: "44", alpha: "XS", bodyCm: "71–73" },
      { uk: "30", us: "30", eu: "46", it: "46", alpha: "S", bodyCm: "76–78" },
      { uk: "32", us: "32", eu: "48", it: "48", alpha: "M", bodyCm: "81–83" },
      { uk: "34", us: "34", eu: "50", it: "50", alpha: "M", bodyCm: "86–88" },
      { uk: "36", us: "36", eu: "52", it: "52", alpha: "L", bodyCm: "91–93" },
      { uk: "38", us: "38", eu: "54", it: "54", alpha: "XL", bodyCm: "96–98" },
      { uk: "40", us: "40", eu: "56", it: "56", alpha: "XL", bodyCm: "101–103" },
      { uk: "42", us: "42", eu: "58", it: "58", alpha: "XXL", bodyCm: "106–108" },
    ],
  },
};

export interface Match {
  row: Row;
  /** More than one row can carry the same alpha size, which is the point. */
  alsoMatching: Row[];
}

export function convert(value: string, region: Region, fit: Fit, garment: Garment): Match | null {
  const text = value.trim().toUpperCase();
  if (text === "") return null;

  const table = TABLES[fit][garment];
  const matches = table.filter((row) => row[region].toUpperCase() === text);
  if (matches.length === 0) return null;

  return { row: matches[0], alsoMatching: matches.slice(1) };
}

/** Finds the rows whose body measurement covers a given centimetre value. */
export function fromMeasurement(cm: number, fit: Fit, garment: Garment): Row[] {
  if (!Number.isFinite(cm) || cm <= 0) return [];

  return TABLES[fit][garment].filter((row) => {
    const [low, high] = row.bodyCm.split("–").map(Number);
    return cm >= low && cm <= high;
  });
}

export const MEASURING_NOTES: Record<Garment, string> = {
  tops: "Chest or bust: around the fullest part, tape level, arms down. Do not pull it tight.",
  bottoms: "Waist: around the narrowest part, usually just above the navel. Hips: around the fullest part, feet together.",
};
