import { HardDrive } from "lucide-react";

import type { Tool } from "@/config/tools";

export const dataConverter: Tool = {
  slug: "data-converter",
  name: "Data Size Converter",
  category: "units",
  description: "Convert bytes, KB, MB, GB and TB — including the 1024-based binary units.",
  keywords: [
    "data size converter",
    "mb to gb",
    "gb to tb",
    "bytes converter",
    "kib vs kb",
    "file size converter",
  ],
  icon: HardDrive,
  processing: "client",
  status: "live",
};
