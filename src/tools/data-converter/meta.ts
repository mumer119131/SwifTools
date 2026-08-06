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
  steps: [
    "Type a value and choose the units to convert between.",
    "The result updates as you type, with the same value shown in every other unit below.",
    "Jump straight to a direct page for the common conversions listed at the bottom.",
  ],
};
