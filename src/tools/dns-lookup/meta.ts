import { Network } from "lucide-react";

import type { Tool } from "@/config/tools";

export const dnsLookup: Tool = {
  slug: "dns-lookup",
  name: "DNS Lookup",
  category: "developer",
  description: "Look up A, AAAA, MX, TXT, NS, CNAME, SOA and CAA records for any domain.",
  keywords: [
    "dns lookup",
    "dns checker",
    "mx record lookup",
    "txt record",
    "nslookup online",
    "check dns records",
    "spf record lookup",
  ],
  icon: Network,
  // Server-side: this needs something only the server can see or reach.
  processing: "server",
  status: "live",
};
