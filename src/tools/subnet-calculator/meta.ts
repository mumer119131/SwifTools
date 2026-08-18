import { Network } from "lucide-react";

import type { Tool } from "@/config/tools";

export const subnetCalculator: Tool = {
  slug: "subnet-calculator",
  name: "Subnet Calculator",
  category: "developer",
  description: "Work out network, broadcast, host range and usable addresses for any IPv4 block.",
  keywords: [
    "subnet calculator",
    "cidr calculator",
    "ip subnet",
    "netmask calculator",
    "how many hosts in a /24",
    "cidr to netmask",
    "ipv4 subnetting",
    "wildcard mask",
  ],
  icon: Network,
  processing: "client",
  status: "live",
  popular: true,
};
