import { AudioWaveform } from "lucide-react";

import type { Tool } from "@/config/tools";

export const frequencyCalculator: Tool = {
  slug: "frequency-calculator",
  name: "Frequency Calculator",
  category: "science",
  description: "Convert between frequency, period and wavelength for any wave speed.",
  keywords: ["frequency calculator","wavelength calculator","period to frequency","hz to wavelength","frequency period converter"],
  icon: AudioWaveform,
  processing: "client",
  status: "live",
};
