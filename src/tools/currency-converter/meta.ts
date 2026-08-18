import { Banknote } from "lucide-react";

import type { Tool } from "@/config/tools";

export const currencyConverter: Tool = {
  slug: "currency-converter",
  name: "Currency Converter",
  category: "converter",
  description: "Convert between world currencies using daily European Central Bank rates.",
  keywords: ["currency converter", "exchange rate", "usd to eur", "live forex rates"],
  icon: Banknote,
  // The only server-side tool on the site: rates are fetched and cached by our
  // own route so the browser never talks to a third party.
  processing: "server",
  status: "live",
  popular: true,
};
