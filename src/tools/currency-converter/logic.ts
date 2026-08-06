export interface Rates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

/** Currencies the ECB publishes, with names for the picker. */
export const currencyNames: Record<string, string> = {
  AUD: "Australian Dollar", BGN: "Bulgarian Lev", BRL: "Brazilian Real", CAD: "Canadian Dollar",
  CHF: "Swiss Franc", CNY: "Chinese Yuan", CZK: "Czech Koruna", DKK: "Danish Krone",
  EUR: "Euro", GBP: "British Pound", HKD: "Hong Kong Dollar", HUF: "Hungarian Forint",
  IDR: "Indonesian Rupiah", ILS: "Israeli Shekel", INR: "Indian Rupee", ISK: "Icelandic Krona",
  JPY: "Japanese Yen", KRW: "South Korean Won", MXN: "Mexican Peso", MYR: "Malaysian Ringgit",
  NOK: "Norwegian Krone", NZD: "New Zealand Dollar", PHP: "Philippine Peso", PLN: "Polish Zloty",
  RON: "Romanian Leu", SEK: "Swedish Krona", SGD: "Singapore Dollar", THB: "Thai Baht",
  TRY: "Turkish Lira", USD: "US Dollar", ZAR: "South African Rand",
};

export async function fetchRates(base: string): Promise<Rates> {
  const response = await fetch(`/api/rates?base=${encodeURIComponent(base)}`);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Rates are unavailable right now.");
  }

  return (await response.json()) as Rates;
}

export function convertCurrency(amount: number, rates: Rates, target: string): number | null {
  if (target === rates.base) return amount;
  const rate = rates.rates[target];
  return rate === undefined ? null : amount * rate;
}

/**
 * Formats with the currency's own conventions — JPY has no minor unit, so
 * `Intl` correctly renders ¥1,234 rather than ¥1,234.00.
 */
export function formatCurrency(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

export function formatRate(value: number): string {
  // Small rates (e.g. IDR→EUR) need more decimals to say anything at all.
  const decimals = value < 0.01 ? 6 : value < 1 ? 4 : 4;
  return value.toFixed(decimals).replace(/\.?0+$/, "");
}
