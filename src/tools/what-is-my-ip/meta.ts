import { Globe } from "lucide-react";

import type { Tool } from "@/config/tools";

export const whatIsMyIp: Tool = {
  slug: "what-is-my-ip",
  name: "What Is My IP",
  category: "developer",
  description: "See your public IP address, plus what your browser reveals about you.",
  keywords: [
    "what is my ip",
    "my ip address",
    "ip address lookup",
    "find my ip",
    "whats my ip",
    "check my ip",
    "ipv4 or ipv6",
  ],
  icon: Globe,
  // Server-side: this needs something only the server can see or reach.
  processing: "server",
  status: "live",
};
